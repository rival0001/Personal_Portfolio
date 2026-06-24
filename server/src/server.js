import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/auth.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "Ritik Singh Portfolio API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", resourceRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => console.log(`API running on port ${port}`));
});
