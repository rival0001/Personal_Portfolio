// What: MongoDB project model for dynamic portfolio project entries.
// Why: Projects need rich metadata for cards, filters, detail pages, and admin CRUD.
import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: String,
    shortDescription: String,
    description: String,
    problemStatement: String,
    solution: String,
    technologiesUsed: [String],
    githubUrl: String,
    liveUrl: String,
    datasetUrl: String,
    documentationUrl: String,
    images: [String],
    videoDemo: String,
    screenshots: [String],
    architectureDiagram: String,
    startDate: Date,
    completionDate: Date,
    status: { type: String, enum: ["Planned", "In Progress", "Completed", "Archived"], default: "Completed" },
    learningOutcomes: [String],
    challengesFaced: [String],
    futureEnhancements: [String],
    tags: [String],
    rating: { type: Number, min: 0, max: 5, default: 5 },
    visibility: { type: String, enum: ["Public", "Private"], default: "Public" }
  },
  { timestamps: true }
);

projectSchema.pre("validate", function setSlug(next) {
  // Why: Slugs create readable project URLs while keeping ObjectId fallback support.
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Project = mongoose.model("Project", projectSchema);
