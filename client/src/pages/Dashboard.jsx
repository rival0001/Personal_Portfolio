// What: Public portfolio page with hero, about, timelines, skills, projects, and contact.
// Why: This is the main professional profile visitors see without logging in.
import { motion } from "framer-motion";
import { Download, ExternalLink, Github, Mail, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Layout from "../components/Layout.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { api } from "../lib/api.js";
import profile from "../assets/Media.jpg";

const filters = ["All", "Power BI", "SQL", "Python", "AI", "Machine Learning", "Data Engineering", "Web Development"];

function assetUrl(value) {
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:")) return value;

  const apiOrigin = new URL(api.defaults.baseURL).origin;
  return value.startsWith("/") ? `${apiOrigin}${value}` : `${apiOrigin}/uploads/${value}`;
}

export default function Dashboard() {
  const [data, setData] = useState({ projects: [], education: [], experience: [], skills: [], certifications: [], achievements: [], resume: [] });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    // Why: Load all public portfolio collections in parallel for faster first paint.
    Promise.all(["projects", "education", "experience", "skills", "certifications", "achievements", "resume"].map((r) => api.get(`/${r}`))).then((responses) => {
      setData(Object.fromEntries(responses.map((res, i) => [["projects", "education", "experience", "skills", "certifications", "achievements", "resume"][i], res.data])));
    });
    // Why: Store one browser-level ID so repeat visits update the same visitor record.
    let visitorId = localStorage.getItem("visitorId");

    if (!visitorId) {
      visitorId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("visitorId", visitorId);
    }

    // Why: Visitor tracking should never block the portfolio if the API is unavailable.
    api.post("/visitors", {
      visitorId,
      page: "/",
      fullName: localStorage.getItem("portfolio_user") ? JSON.parse(localStorage.getItem("portfolio_user")).fullName : undefined
    }).catch(() => {});
  }, []);

  const projects = useMemo(() => data.projects.filter((project) => {
    // Why: Search and category filtering run client-side for instant project discovery.
    const haystack = `${project.title} ${project.shortDescription} ${(project.tags || []).join(" ")} ${(project.technologiesUsed || []).join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (filter === "All" || haystack.includes(filter.toLowerCase()));
  }), [data.projects, query, filter]);

  async function sendMessage(event) {
    event.preventDefault();
    // Why: Contact submissions are stored in MongoDB for admin follow-up.
    await api.post("/messages", message);
    setMessage({ name: "", email: "", message: "" });
  }

  const groupedSkills = data.skills.reduce((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] || []), skill];
    return acc;
  }, {});
  const resume = data.resume[0];

  return (
    <Layout>
      <section className="section grid min-h-[calc(100vh-72px)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Data portfolio</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Ritik Singh</h1>
          <p className="mt-4 text-xl text-slate-700 dark:text-slate-200">Data Analyst | Power BI Developer | SQL Developer | AI Enthusiast</p>
          <p className="typing mt-6 max-w-fit text-2xl font-bold text-cyan-600 dark:text-cyan-300">Transforming Data into Insights</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {resume?.fileUrl && <a className="btn-primary" href={resume.fileUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> View Resume</a>}
            {resume?.fileUrl && <a className="btn-secondary" href={resume.fileUrl} download><Download size={16} /> Download Resume</a>}
            <a className="btn-secondary" href="#contact"><Mail size={16} /> Contact Me</a>
          </div>
        </motion.div>
        <Card className="p-4">
          <div className="aspect-square overflow-hidden rounded-lg">
          <img
           src={profile}
           alt="Ritik Singh"
           className="h-full w-full object-cover rounded-lg"
           />
        </div>
        </Card>
      </section>

      <section className="section" id="about">
        <SectionTitle eyebrow="About" title="Professional Profile" text="A concise view of personal details, career direction, and analytical strengths." />
        <div className="grid gap-4 md:grid-cols-3">
          {["Full Name: Ritik Singh", "Current City: Kolkata", "Home Town: Varanasi", "Date of Birth: 30/06/2003", "Career Objective: Build insight-led data products", "Professional Summary: Data analyst focused on BI, SQL, automation, and AI-enabled workflows"].map((item) => <Card key={item}>{item}</Card>)}
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Journey" title="Education Timeline" />
        <div className="border-l border-cyan-500/40 pl-6">
          {data.education.map((item) => {
            const score = item.percentage || item.cgpa;
            const date = item.year || (item.completionDate ? new Date(item.completionDate).getFullYear() : "");

            return (
              <Card key={item._id} className="mb-5">
                <h3 className="font-bold">{item.level || item.degree || item.courseName}</h3>
                <p>{item.schoolName || item.collegeName || item.platform}</p>
                {(item.board || item.specialization) && <p className="text-sm text-slate-600 dark:text-slate-300">{item.board || item.specialization}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                  {date && <span>{date}</span>}
                  {score && <span className="font-semibold text-cyan-600 dark:text-cyan-300">{item.percentage ? `${score}%` : `CGPA ${score}`}</span>}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Experience" title="Work Timeline" />
        <div className="grid gap-5 md:grid-cols-2">
          {data.experience.map((exp) => <Card key={exp._id}><div className="flex items-start gap-4">{exp.companyLogo && <img className="h-14 w-14 rounded-md border border-slate-200 object-contain p-1 dark:border-slate-700" src={assetUrl(exp.companyLogo)} alt={`${exp.companyName} logo`} />}<div><h3 className="text-xl font-bold">{exp.role}</h3><p className="font-semibold text-cyan-600">{exp.companyName}</p></div></div><p className="mt-2 text-sm">{exp.description}</p><div className="mt-4 flex flex-wrap gap-2">{exp.technologiesUsed?.map((t) => <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs" key={t}>{t}</span>)}</div></Card>)}
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Skills" title="Capability Matrix" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedSkills).map(([category, skills]) => <Card key={category}><h3 className="mb-4 font-bold">{category}</h3>{skills.map((skill) => <div className="mb-3" key={skill._id}><div className="flex justify-between text-sm"><span>{skill.name}</span><span>{skill.proficiency}%</span></div><div className="mt-1 h-2 rounded bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded bg-cyan-500" style={{ width: `${skill.proficiency}%` }} /></div></div>)}</Card>)}
        </div>
      </section>

      <section className="section" id="projects">
        <SectionTitle eyebrow="Projects" title="Project Showcase" text="Searchable, filterable project cards with newest work first." />
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block md:w-80"><Search className="absolute left-3 top-3" size={16} /><input className="w-full rounded-md border border-slate-300 bg-white/70 py-2 pl-9 pr-3 dark:border-slate-700 dark:bg-slate-900/70" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <div className="flex flex-wrap gap-2">{filters.map((f) => <button className={`rounded-md px-3 py-2 text-sm ${filter === f ? "bg-cyan-500 text-white" : "glass"}`} onClick={() => setFilter(f)} key={f}>{f}</button>)}</div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => <Card key={project._id}><div className="mb-4 aspect-video rounded-md bg-slate-200 dark:bg-slate-800">{project.images?.[0] && <img className="h-full w-full rounded-md object-cover" src={project.images[0]} alt={project.title} />}</div><h3 className="text-xl font-bold">{project.title}</h3><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.shortDescription || project.description}</p><div className="mt-4 flex flex-wrap gap-2">{project.technologiesUsed?.map((t) => <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs" key={t}>{t}</span>)}</div><div className="mt-5 flex flex-wrap gap-2"><Link className="btn-primary" to={`/projects/${project.slug || project._id}`}>View Details</Link>{project.githubUrl && <a className="btn-secondary" href={project.githubUrl}><Github size={16} /> GitHub</a>}{project.liveUrl && <a className="btn-secondary" href={project.liveUrl}>Live Demo</a>}</div></Card>)}
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Proof" title="Certifications & Achievements" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...data.certifications, ...data.achievements].map((item) => {
            const proofImage = item.image || item.proofImage;

            return (
              <Card key={item._id}>
                {proofImage && <div className="mb-4 aspect-video overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800"><img className="h-full w-full object-cover" src={assetUrl(proofImage)} alt={`${item.name || item.title} proof`} /></div>}
                <h3 className="font-bold">{item.name || item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.platform || item.description}</p>
                {(item.credentialUrl || item.proofLink) && <a className="mt-4 inline-block text-sm font-semibold text-cyan-600" href={item.credentialUrl || item.proofLink}>View proof</a>}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section" id="contact">
        <SectionTitle eyebrow="Contact" title="Let’s Connect" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card><p>Email: ritik306singh@gmail.com </p><p>Phone: 6207262105</p><p>LinkedIn: www.linkedin.com/in/ritik-singh-029a98221</p><p>GitHub: https://github.com/rival0001</p><p>Location: India</p></Card>
          <Card><form onSubmit={sendMessage} className="grid gap-3"><input className="rounded-md border border-slate-300 bg-transparent px-3 py-2" placeholder="Name" value={message.name} onChange={(e) => setMessage({ ...message, name: e.target.value })} required /><input className="rounded-md border border-slate-300 bg-transparent px-3 py-2" placeholder="Email" type="email" value={message.email} onChange={(e) => setMessage({ ...message, email: e.target.value })} required /><textarea className="min-h-32 rounded-md border border-slate-300 bg-transparent px-3 py-2" placeholder="Message" value={message.message} onChange={(e) => setMessage({ ...message, message: e.target.value })} required /><button className="btn-primary">Send Message</button></form></Card>
        </div>
      </section>
    </Layout>
  );
}
