import { db, carsTable, usersTable } from "@workspace/db";
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + (process.env.SESSION_SECRET || "secret")).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const adminEmail = "admin@carrental.com";
  const existing = await db.select().from(usersTable);
  
  if (existing.length === 0) {
    await db.insert(usersTable).values([
      {
        name: "Admin User",
        email: adminEmail,
        password: hashPassword("admin123456"),
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashPassword("password123"),
        role: "user",
      },
    ]);
    console.log("Created users: admin@carrental.com (admin123456), john@example.com (password123)");
  } else {
    console.log("Users already exist, skipping user seed");
  }

  // Create sample cars
  const existingCars = await db.select().from(carsTable);
  
  if (existingCars.length === 0) {
    await db.insert(carsTable).values([
      {
        brand: "Toyota",
        model: "Camry",
        year: 2023,
        pricePerDay: "59.99",
        transmission: "automatic",
        fuelType: "petrol",
        seats: 5,
        location: "New York",
        description: "Comfortable and reliable sedan perfect for city driving and long trips.",
        imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
        available: true,
      },
      {
        brand: "BMW",
        model: "3 Series",
        year: 2023,
        pricePerDay: "129.99",
        transmission: "automatic",
        fuelType: "petrol",
        seats: 5,
        location: "New York",
        description: "Premium German engineering delivering performance and luxury in one package.",
        imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
        available: true,
      },
      {
        brand: "Tesla",
        model: "Model 3",
        year: 2023,
        pricePerDay: "149.99",
        transmission: "automatic",
        fuelType: "electric",
        seats: 5,
        location: "Los Angeles",
        description: "All-electric performance sedan with autopilot and long range battery.",
        imageUrl: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800",
        available: true,
      },
      {
        brand: "Ford",
        model: "Mustang",
        year: 2022,
        pricePerDay: "109.99",
        transmission: "manual",
        fuelType: "petrol",
        seats: 4,
        location: "Miami",
        description: "Iconic American muscle car. Experience the thrill of the open road.",
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
        available: true,
      },
      {
        brand: "Honda",
        model: "CR-V",
        year: 2023,
        pricePerDay: "79.99",
        transmission: "automatic",
        fuelType: "hybrid",
        seats: 5,
        location: "Chicago",
        description: "Versatile and fuel-efficient SUV perfect for families and adventures.",
        imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
        available: true,
      },
      {
        brand: "Mercedes",
        model: "E-Class",
        year: 2023,
        pricePerDay: "159.99",
        transmission: "automatic",
        fuelType: "diesel",
        seats: 5,
        location: "Los Angeles",
        description: "Luxurious executive sedan combining elegance with cutting-edge technology.",
        imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        available: true,
      },
      {
        brand: "Volkswagen",
        model: "Golf",
        year: 2022,
        pricePerDay: "49.99",
        transmission: "manual",
        fuelType: "petrol",
        seats: 5,
        location: "Chicago",
        description: "Compact and practical hatchback — ideal for city commutes.",
        imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
        available: true,
      },
      {
        brand: "Jeep",
        model: "Wrangler",
        year: 2023,
        pricePerDay: "119.99",
        transmission: "automatic",
        fuelType: "petrol",
        seats: 4,
        location: "Denver",
        description: "Built for adventure. Take the Wrangler anywhere, on or off road.",
        imageUrl: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800",
        available: true,
      },
    ]);
    console.log("Created 8 sample cars");
  } else {
    console.log("Cars already exist, skipping car seed");
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
