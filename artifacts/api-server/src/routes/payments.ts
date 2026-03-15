import { Router, Request, Response } from "express";
import { db, paymentsTable, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import Stripe from "stripe";

const router = Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(key);
}

router.post("/create-session", requireAuth, async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400).json({ error: "bookingId required" });
      return;
    }

    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, Number(bookingId))).limit(1);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (booking.userId !== req.user!.id && req.user!.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const stripe = getStripe();
    const baseUrl = process.env.PUBLIC_URL || `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Car Rental Booking #${booking.id}`,
            },
            unit_amount: Math.round(Number(booking.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/booking/confirmation/${booking.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/${booking.carId}`,
      metadata: { bookingId: String(booking.id) },
    });

    await db.insert(paymentsTable).values({
      bookingId: booking.id,
      amount: String(booking.totalPrice),
      paymentStatus: "pending",
      stripeSessionId: session.id,
    }).onConflictDoNothing();

    res.json({ sessionUrl: session.url, sessionId: session.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripe = getStripe();
    let event: Stripe.Event;

    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } else {
      event = req.body as Stripe.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = Number(session.metadata?.bookingId);

      if (bookingId) {
        await db.update(paymentsTable)
          .set({ paymentStatus: "paid" })
          .where(eq(paymentsTable.stripeSessionId, session.id));

        await db.update(bookingsTable)
          .set({ status: "confirmed" })
          .where(eq(bookingsTable.id, bookingId));
      }
    }

    res.json({ received: true });
  } catch (e) {
    console.error("Webhook error:", e);
    res.status(400).json({ error: "Webhook error" });
  }
});

router.get("/:bookingId", requireAuth, async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const [payment] = await db.select().from(paymentsTable).where(eq(paymentsTable.bookingId, bookingId)).limit(1);

    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }

    res.json({
      id: payment.id,
      bookingId: payment.bookingId,
      amount: Number(payment.amount),
      paymentStatus: payment.paymentStatus,
      stripeSessionId: payment.stripeSessionId,
      createdAt: payment.createdAt,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
