import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  level: String,
  schoolName: String,
  board: String,
  percentage: String,
  year: String,
  collegeName: String,
  degree: String,
  specialization: String,
  cgpa: String,
  courseName: String,
  platform: String,
  completionDate: Date,
  certificateLink: String,
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const experienceSchema = new mongoose.Schema({
  companyName: String,
  role: String,
  startDate: Date,
  endDate: Date,
  location: String,
  description: String,
  achievements: [String],
  technologiesUsed: [String],
  companyLogo: String
}, { timestamps: true });

const skillSchema = new mongoose.Schema({
  category: String,
  name: String,
  proficiency: { type: Number, min: 0, max: 100, default: 80 }
}, { timestamps: true });

const certificationSchema = new mongoose.Schema({
  name: String,
  platform: String,
  issueDate: Date,
  credentialUrl: String,
  image: String
}, { timestamps: true });

const achievementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  proofImage: String,
  proofLink: String
}, { timestamps: true });

const resumeSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, sparse: true, index: true },
  ip: String,
  userAgent: String,
  page: String,
  pages: [String],
  visitCount: { type: Number, default: 1 },
  firstSeenAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now },
  lastLoginName: String
}, { timestamps: true });

export const Education = mongoose.model("Education", educationSchema);
export const Experience = mongoose.model("Experience", experienceSchema);
export const Skill = mongoose.model("Skill", skillSchema);
export const Certification = mongoose.model("Certification", certificationSchema);
export const Achievement = mongoose.model("Achievement", achievementSchema);
export const Resume = mongoose.model("Resume", resumeSchema);
export const Message = mongoose.model("Message", messageSchema);
export const Visitor = mongoose.model("Visitor", visitorSchema);
