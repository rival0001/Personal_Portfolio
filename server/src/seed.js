import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import { User } from "./models/User.js";
import { Education, Experience, Skill, Certification, Achievement, Resume } from "./models/ContentModels.js";
import { Project } from "./models/Project.js";

dotenv.config();
await connectDB();

const fullName = process.env.ADMIN_FULL_NAME || "Ritik Singh";
const accessId = process.env.ADMIN_ACCESS_ID || "RITIK-ADMIN-2026";

await User.deleteMany({});
await User.create({
  fullName,
  accessIdHash: await User.hashAccessId(accessId),
  role: "admin"
});

await Promise.all([
  Education.deleteMany({}),
  Experience.deleteMany({}),
  Skill.deleteMany({}),
  Certification.deleteMany({}),
  Achievement.deleteMany({}),
  Resume.deleteMany({}),
  Project.deleteMany({})
]);

await Skill.insertMany([
  ["Programming", "Python", 92], ["Programming", "SQL", 95], ["Programming", "Java", 74], ["Programming", "C++", 70],
  ["BI Tools", "Power BI", 94], ["BI Tools", "Excel", 91],
  ["Database", "SQL Server", 90], ["Database", "MySQL", 84], ["Database", "PostgreSQL", 80],
  ["Cloud", "Azure", 76], ["Cloud", "AWS", 70],
  ["AI / ML", "LLM", 82], ["AI / ML", "Prompt Engineering", 88], ["AI / ML", "Machine Learning", 78]
].map(([category, name, proficiency]) => ({ category, name, proficiency })));

await Education.insertMany([
  { level: "Class 10", schoolName: "Your School Name", board: "CBSE", percentage: "Add percentage", year: "Add year", sortOrder: 1 },
  { level: "Class 12", schoolName: "Your School Name", board: "CBSE", percentage: "Add percentage", year: "Add year", sortOrder: 2 },
  { level: "Graduation", collegeName: "Your College Name", degree: "Your Degree", specialization: "Data / Technology", cgpa: "Add CGPA", year: "Add year", sortOrder: 3 }
]);

await Experience.create({
  companyName: "Polestar Solutions",
  role: "Data Analyst",
  location: "India",
  description: "Building analytics solutions, dashboards, and data workflows.",
  achievements: ["Delivered decision-ready dashboards", "Improved reporting efficiency"],
  technologiesUsed: ["Power BI", "SQL", "Excel", "Python"]
});

await Project.create({
  title: "Executive Sales Analytics Dashboard",
  category: "Power BI",
  shortDescription: "Interactive sales dashboard with KPIs, trends, and regional performance.",
  description: "A business intelligence dashboard designed for leadership visibility across sales, products, and geography.",
  problemStatement: "Manual reporting made it hard to monitor trends and make fast decisions.",
  solution: "Created a Power BI dashboard backed by cleaned SQL datasets and reusable measures.",
  technologiesUsed: ["Power BI", "SQL", "Excel"],
  tags: ["Power BI", "SQL", "Data Analytics"],
  status: "Completed",
  learningOutcomes: ["DAX modeling", "Executive KPI design"],
  challengesFaced: ["Data quality", "Metric alignment"],
  futureEnhancements: ["Automated refresh", "Predictive alerts"],
  visibility: "Public"
});

console.log(`Seed complete. Login with "${fullName}" and access ID "${accessId}"`);
process.exit(0);
