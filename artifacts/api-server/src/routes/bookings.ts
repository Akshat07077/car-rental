import { Router } from "express";
import { db, bookingsTable, carsTable, usersTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    let bookings;

    if (user.role === "admin") {
      bookings = await db.select({
        booking: bookingsTable,
        car: carsTable,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
        },
      })
        .from(bookingsTable)
        .leftJoin(carsTable, eq(bookingsTable.carId, carsTable.id))
        .leftJoin(usersTable, eq(bookingsTable.userId, usersTable.id));
    } else {
      bookings = await db.select({
        booking: bookingsTable,
        car: carsTable,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: usersTable.role,
          createdAt: usersTable.createdAt,
        },
      })
        .from(bookingsTable)
        .leftJoin(carsTable, eq(bookingsTable.carId, carsTable.id))
        .leftJoin(usersTable, eq(bookingsTable.userId, usersTable.id))
        .where(eq(bookingsTable.userId, user.id));
    }

    res.json(bookings.map(formatBookingRow));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    const { carId, pickupDate, returnDate } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      res.status(400).json({ error: "carId, pickupDate, and returnDate required" });
      return;
    }

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickup < today) {
      res.status(400).json({ error: "Pickup date cannot be in the past" });
      return;
    }

    if (returnD <= pickup) {
      res.status(400).json({ error: "Return date must be after pickup date" });
      return;
    }

    const [car] = await db.select().from(carsTable).where(eq(carsTable.id, Number(carId))).limit(1);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }

    if (!car.available) {
      res.status(400).json({ error: "Car is not available" });
      return;
    }

    const conflicting = await db.select().from(bookingsTable).where(
      and(
        eq(bookingsTable.carId, Number(carId)),
        sql`${bookingsTable.status} NOT IN ('cancelled')`,
        sql`NOT (${bookingsTable.returnDate} < ${pickupDate} OR ${bookingsTable.pickupDate} > ${returnDate})`
      )
    );

    if (conflicting.length > 0) {
      res.status(400).json({ error: "Car is already booked for the selected dates" });
      return;
    }

    const days = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * Number(car.pricePerDay);

    const [booking] = await db.insert(bookingsTable).values({
      userId: user.id,
      carId: Number(carId),
      pickupDate,
      returnDate,
      totalPrice: String(totalPrice),
      status: "pending",
    }).returning();

    res.status(201).json(formatBooking(booking));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const user = req.user!;
    const bookingId = Number(req.params.id);

    const [row] = await db.select({
      booking: bookingsTable,
      car: carsTable,
      user: {
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      },
    })
      .from(bookingsTable)
      .leftJoin(carsTable, eq(bookingsTable.carId, carsTable.id))
      .leftJoin(usersTable, eq(bookingsTable.userId, usersTable.id))
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (user.role !== "admin" && row.booking.userId !== user.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.json(formatBookingRow(row));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status required" });
      return;
    }

    const [booking] = await db.update(bookingsTable)
      .set({ status })
      .where(eq(bookingsTable.id, Number(req.params.id)))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(formatBooking(booking));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    id: b.id,
    userId: b.userId,
    carId: b.carId,
    pickupDate: b.pickupDate,
    returnDate: b.returnDate,
    totalPrice: Number(b.totalPrice),
    status: b.status,
    createdAt: b.createdAt,
  };
}

function formatBookingRow(row: { booking: typeof bookingsTable.$inferSelect; car: typeof carsTable.$inferSelect | null; user: { id: number; name: string | null; email: string; role: "user" | "admin"; createdAt: Date } | null }) {
  const base = formatBooking(row.booking);
  return {
    ...base,
    car: row.car ? {
      id: row.car.id,
      brand: row.car.brand,
      model: row.car.model,
      year: row.car.year,
      pricePerDay: Number(row.car.pricePerDay),
      transmission: row.car.transmission,
      fuelType: row.car.fuelType,
      seats: row.car.seats,
      location: row.car.location,
      description: row.car.description,
      imageUrl: row.car.imageUrl,
      available: row.car.available,
      createdAt: row.car.createdAt,
    } : undefined,
    user: row.user || undefined,
  };
}

export default router;
