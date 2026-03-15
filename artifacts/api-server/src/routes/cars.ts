import { Router } from "express";
import { db, carsTable } from "@workspace/db";
import { eq, gte, lte, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { transmission, fuel_type, seats, location, min_price, max_price, available } = req.query;

    const conditions = [];

    if (transmission) conditions.push(eq(carsTable.transmission, transmission as "manual" | "automatic"));
    if (fuel_type) conditions.push(eq(carsTable.fuelType, fuel_type as "petrol" | "diesel" | "electric" | "hybrid"));
    if (seats) conditions.push(eq(carsTable.seats, Number(seats)));
    if (location) conditions.push(eq(carsTable.location, location as string));
    if (min_price) conditions.push(gte(carsTable.pricePerDay, String(min_price)));
    if (max_price) conditions.push(lte(carsTable.pricePerDay, String(max_price)));
    if (available !== undefined) conditions.push(eq(carsTable.available, available === "true"));

    const cars = conditions.length > 0
      ? await db.select().from(carsTable).where(and(...conditions))
      : await db.select().from(carsTable);

    res.json(cars.map(formatCar));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [car] = await db.select().from(carsTable).where(eq(carsTable.id, Number(req.params.id))).limit(1);
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }
    res.json(formatCar(car));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id/availability", async (req, res) => {
  try {
    const { pickup_date, return_date } = req.query;
    if (!pickup_date || !return_date) {
      res.status(400).json({ error: "pickup_date and return_date required" });
      return;
    }

    const { bookingsTable } = await import("@workspace/db");
    const { sql } = await import("drizzle-orm");

    const conflicting = await db.select().from(bookingsTable).where(
      and(
        eq(bookingsTable.carId, Number(req.params.id)),
        sql`${bookingsTable.status} NOT IN ('cancelled')`,
        sql`NOT (${bookingsTable.returnDate} < ${pickup_date as string} OR ${bookingsTable.pickupDate} > ${return_date as string})`
      )
    );

    res.json({ available: conflicting.length === 0, conflictingBookings: conflicting.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { brand, model, year, pricePerDay, transmission, fuelType, seats, location, description, imageUrl, available } = req.body;

    const [car] = await db.insert(carsTable).values({
      brand, model, year: Number(year),
      pricePerDay: String(pricePerDay),
      transmission, fuelType,
      seats: Number(seats),
      location,
      description: description || null,
      imageUrl: imageUrl || null,
      available: available !== false,
    }).returning();

    res.status(201).json(formatCar(car));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { brand, model, year, pricePerDay, transmission, fuelType, seats, location, description, imageUrl, available } = req.body;

    const updates: Record<string, unknown> = {};
    if (brand !== undefined) updates.brand = brand;
    if (model !== undefined) updates.model = model;
    if (year !== undefined) updates.year = Number(year);
    if (pricePerDay !== undefined) updates.pricePerDay = String(pricePerDay);
    if (transmission !== undefined) updates.transmission = transmission;
    if (fuelType !== undefined) updates.fuelType = fuelType;
    if (seats !== undefined) updates.seats = Number(seats);
    if (location !== undefined) updates.location = location;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (available !== undefined) updates.available = available;

    const [car] = await db.update(carsTable).set(updates).where(eq(carsTable.id, Number(req.params.id))).returning();
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }
    res.json(formatCar(car));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const [car] = await db.delete(carsTable).where(eq(carsTable.id, Number(req.params.id))).returning();
    if (!car) {
      res.status(404).json({ error: "Car not found" });
      return;
    }
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatCar(car: typeof carsTable.$inferSelect) {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    year: car.year,
    pricePerDay: Number(car.pricePerDay),
    transmission: car.transmission,
    fuelType: car.fuelType,
    seats: car.seats,
    location: car.location,
    description: car.description,
    imageUrl: car.imageUrl,
    available: car.available,
    createdAt: car.createdAt,
  };
}

export default router;
