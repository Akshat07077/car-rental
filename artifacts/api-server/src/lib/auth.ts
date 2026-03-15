import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

declare module "express-serve-static-core" {
  interface Request {
    user?: typeof usersTable.$inferSelect;
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + process.env.SESSION_SECRET || "secret").digest("hex");
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

export async function sessionMiddleware(req: Request, _res: Response, next: NextFunction) {
  const userId = (req.session as Record<string, unknown>)?.userId;
  if (userId && typeof userId === "number") {
    try {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (user) {
        req.user = user;
      }
    } catch (_e) {
      // ignore
    }
  }
  next();
}
