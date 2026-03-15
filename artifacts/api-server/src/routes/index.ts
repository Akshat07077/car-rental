import { Router } from "express";
import healthRouter from "./health.js";
import carsRouter from "./cars.js";
import bookingsRouter from "./bookings.js";
import paymentsRouter from "./payments.js";
import authRouter from "./auth.js";
import uploadRouter from "./upload.js";

const router = Router();

router.use(healthRouter);
router.use("/cars", carsRouter);
router.use("/bookings", bookingsRouter);
router.use("/payments", paymentsRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);

export default router;
