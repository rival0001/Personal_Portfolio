import express from "express";
import mongoose from "mongoose";
import { adminOnly, optionalAuth, protect } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import { Achievement, Certification, Education, Experience, Message, Resume, Skill, Visitor } from "../models/ContentModels.js";
import { Project } from "../models/Project.js";

const router = express.Router();

const resources = {
  projects: Project,
  education: Education,
  experience: Experience,
  skills: Skill,
  certifications: Certification,
  achievements: Achievement,
  resume: Resume,
  messages: Message,
  visitors: Visitor
};

router.post("/visitors", asyncHandler(async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip;
  const userAgent = req.get("user-agent") || "unknown";
  const page = req.body.page || "/";
  const visitorId = req.body.visitorId || `${ip}:${userAgent}`;

  await Visitor.findOneAndUpdate(
    { visitorId },
    {
      $set: {
        visitorId,
        ip,
        userAgent,
        page,
        lastSeenAt: new Date(),
        lastLoginName: req.body.fullName
      },
      $setOnInsert: {
        firstSeenAt: new Date()
      },
      $addToSet: {
        pages: page
      },
      $inc: {
        visitCount: 1
      }
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );

  const total = await Visitor.distinct("visitorId").then((ids) => ids.length);

  res.status(201).json({ total });
}));

router.get("/analytics", protect, adminOnly, asyncHandler(async (_req, res) => {
  const [projects, visitors, certificates, messages] = await Promise.all([
    Project.countDocuments(),
    Visitor.distinct("visitorId").then((ids) => ids.length),
    Certification.countDocuments(),
    Message.countDocuments()
  ]);
  res.json({ projects, visitors, certificates, messages });
}));

router.get("/:resource", optionalAuth, asyncHandler(async (req, res) => {
  const Model = resources[req.params.resource];
  if (!Model) {
    res.status(404);
    throw new Error("Unknown resource");
  }
  if (["messages", "visitors"].includes(req.params.resource) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  const query = {};
  if (req.params.resource === "projects" && req.user.role !== "admin") query.visibility = "Public";
  const docs = await Model.find(query).sort({ createdAt: -1, sortOrder: 1 });
  res.json(docs);
}));

router.get("/:resource/:id", optionalAuth, asyncHandler(async (req, res) => {
  const Model = resources[req.params.resource];
  if (!Model) {
    res.status(404);
    throw new Error("Unknown resource");
  }
  const lookup = req.params.resource === "projects"
    ? mongoose.isValidObjectId(req.params.id)
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
      : { slug: req.params.id }
    : { _id: req.params.id };
  const doc = await Model.findOne(lookup);
  if (!doc) {
    res.status(404);
    throw new Error("Record not found");
  }
  if (req.params.resource === "projects" && doc.visibility === "Private" && req.user?.role !== "admin") {
    res.status(403);
    throw new Error("Admin access required");
  }
  res.json(doc);
}));

router.post("/messages", asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json(message);
}));

router.post("/:resource", protect, adminOnly, asyncHandler(async (req, res) => {
  const Model = resources[req.params.resource];
  const doc = await Model.create(req.body);
  res.status(201).json(doc);
}));

router.put("/:resource/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const Model = resources[req.params.resource];
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) {
    res.status(404);
    throw new Error("Record not found");
  }
  res.json(doc);
}));

router.delete("/:resource/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const Model = resources[req.params.resource];
  await Model.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

export default router;
