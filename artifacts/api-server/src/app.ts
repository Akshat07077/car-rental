import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import router from "./routes/index.js";
import { sessionMiddleware } from "./lib/auth.js";

const app: Express = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

// Raw body for Stripe webhooks
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "car-rental-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
}));

app.use(sessionMiddleware);

app.use("/api", router);

export default app;
