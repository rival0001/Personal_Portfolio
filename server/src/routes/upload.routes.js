import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("files", 10), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const files = req.files.map((file) => ({
    originalName: file.originalname,
    url: `${base}/uploads/${file.filename}`,
    type: file.mimetype
  }));
  res.status(201).json({ files });
});

export default router;
