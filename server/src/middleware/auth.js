import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "./error.js";

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401);
    throw new Error("Authentication required");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-accessIdHash");
  if (!user || !user.isActive) {
    res.status(401);
    throw new Error("Invalid session");
  }

  req.user = user;
  next();
});

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    res.status(403);
    return next(new Error("Admin access required"));
  }
  next();
}
