// What: Protected upload route for admin-managed portfolio files.
// Why: Only admins should be able to add public file URLs to the portfolio.
import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("files", 10), (req, res) => {

    const files = req.files.map((file) => ({
        originalName: file.originalname,
        url: file.path,
        type: file.mimetype
    }));

    res.status(201).json({ files });

});

export default router;
