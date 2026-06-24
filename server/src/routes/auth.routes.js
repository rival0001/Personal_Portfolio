import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../middleware/error.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post("/login", asyncHandler(async (req, res) => {
  const { fullName, accessId } = req.body;
  if (!fullName || !accessId) {
    res.status(400);
    throw new Error("Full name and access ID are required");
  }

  const users = await User.find({ fullName: new RegExp(`^${escapeRegExp(fullName.trim())}$`, "i"), isActive: true });
  const user = await users.reduce(async (foundPromise, candidate) => {
    const found = await foundPromise;
    if (found) return found;
    return (await candidate.matchAccessId(accessId)) ? candidate : null;
  }, Promise.resolve(null));

  if (!user) {
    res.status(401);
    throw new Error("Invalid access details");
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    token: signToken(user),
    user: { id: user._id, fullName: user.fullName, role: user.role }
  });
}));

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
