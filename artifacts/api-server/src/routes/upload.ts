import { Router, Request, Response } from "express";
import { requireAdmin } from "../lib/auth.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

router.post("/image", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Return a placeholder if Cloudinary is not configured
      res.json({ url: `https://placehold.co/600x400?text=Car+Image`, publicId: "placeholder" });
      return;
    }

    const cl = getCloudinary();
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cl.uploader.upload_stream(
        { folder: "car-rental", resource_type: "image" },
        (err, result) => {
          if (err || !result) reject(err || new Error("Upload failed"));
          else resolve(result as { secure_url: string; public_id: string });
        }
      );
      const readable = Readable.from(req.file!.buffer);
      readable.pipe(stream);
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
