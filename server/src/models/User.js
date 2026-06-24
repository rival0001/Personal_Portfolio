import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    accessIdHash: { type: String, required: true },
    role: { type: String, enum: ["visitor", "admin"], default: "visitor" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.methods.matchAccessId = function matchAccessId(accessId) {
  return bcrypt.compare(accessId, this.accessIdHash);
};

userSchema.statics.hashAccessId = function hashAccessId(accessId) {
  return bcrypt.hash(accessId, 12);
};

export const User = mongoose.model("User", userSchema);
