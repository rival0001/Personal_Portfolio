// What: Protected admin dashboard for managing portfolio content and analytics.
// Why: Ritik can update projects, resume, skills, messages, and visitor data without code edits.
import { Plus, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Layout from "../components/Layout.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { api } from "../lib/api.js";

const resources = ["projects", "education", "experience", "certifications", "achievements", "resume", "skills", "messages", "visitors"];

const templates = {
  // Why: Templates define the editable fields for each MongoDB-backed content type.
  projects: { title: "", category: "", shortDescription: "", description: "", problemStatement: "", solution: "", technologiesUsed: [], githubUrl: "", liveUrl: "", datasetUrl: "", documentationUrl: "", images: [], screenshots: [], videoDemo: "", architectureDiagram: "", status: "Completed", learningOutcomes: [], challengesFaced: [], futureEnhancements: [], tags: [], rating: 5, visibility: "Public" },
  education: { level: "", schoolName: "", board: "", percentage: "", year: "", collegeName: "", degree: "", specialization: "", cgpa: "", courseName: "", platform: "", certificateLink: "" },
  experience: { companyName: "", role: "", location: "", description: "", achievements: [], technologiesUsed: [], companyLogo: "" },
  certifications: { name: "", platform: "", credentialUrl: "", image: "" },
  achievements: { title: "", description: "", proofImage: "", proofLink: "" },
  resume: { title: "Ritik Singh Resume", fileUrl: "" },
  skills: { category: "", name: "", proficiency: 80 }
};

const arrayFields = new Set(["technologiesUsed", "images", "screenshots", "learningOutcomes", "challengesFaced", "futureEnhancements", "tags", "achievements"]);

export default function Admin() {
  const [active, setActive] = useState("projects");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(templates.projects);
  const [editingId, setEditingId] = useState(null);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    load(active);
  }, [active]);

  useEffect(() => {
    api.get("/analytics").then((res) => setAnalytics(res.data));
  }, []);

  async function load(resource) {
    // Why: Reload after switching tabs or saving so the list reflects MongoDB state.
    const { data } = await api.get(`/${resource}`);
    setItems(data);
    setForm(templates[resource] || {});
    setEditingId(null);
  }

  function update(key, value) {
    // Why: Array fields are entered as comma-separated text to keep the admin form compact.
    setForm({ ...form, [key]: arrayFields.has(key) ? value.split(",").map((x) => x.trim()) : value });
  }

  async function save() {
    if (editingId) await api.put(`/${active}/${editingId}`, form);
    else await api.post(`/${active}`, form);
    await load(active);
  }

  function edit(item) {
    const template = templates[active] || {};
    setEditingId(item._id);
    setForm(Object.fromEntries(Object.keys(template).map((key) => [key, item[key] ?? template[key]])));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    await api.delete(`/${active}/${id}`);
    await load(active);
  }

  async function uploadFiles(event, field) {
    // Why: Uploads return public file URLs that can be saved directly into content records.
    const payload = new FormData();
    [...event.target.files].forEach((file) => payload.append("files", file));
    const { data } = await api.post("/uploads", payload);
    const urls = data.files.map((file) => file.url);
    setForm({ ...form, [field]: arrayFields.has(field) ? [...(form[field] || []), ...urls] : urls[0] });
  }

  return (
    <Layout>
      <main className="section">
        <SectionTitle eyebrow="Admin" title="Dashboard Management" text="Create, edit, upload, and monitor your portfolio content." />
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {Object.entries({ Projects: analytics.projects, Visitors: analytics.visitors, Certificates: analytics.certificates, Messages: analytics.messages }).map(([label, value]) => <Card key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value ?? 0}</p></Card>)}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {resources.map((resource) => <button key={resource} onClick={() => setActive(resource)} className={`rounded-md px-3 py-2 text-sm capitalize ${active === resource ? "bg-cyan-500 text-white" : "glass"}`}>{resource}</button>)}
        </div>
        {templates[active] && (
          <Card className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><Plus size={18} /> {editingId ? "Edit" : "Add"} {active}</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.keys(templates[active]).map((key) => (
                <label key={key} className="text-sm">
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <input className="mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={arrayFields.has(key) ? (form[key] || []).join(", ") : form[key] || ""} onChange={(e) => update(key, e.target.value)} />
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {["images", "screenshots", "videoDemo", "architectureDiagram", "image", "proofImage", "fileUrl", "companyLogo"].map((field) => field in form && <label className="btn-secondary cursor-pointer" key={field}><Upload size={16} /> Upload {field}<input className="hidden" type="file" multiple={arrayFields.has(field)} onChange={(e) => uploadFiles(e, field)} /></label>)}
              <button className="btn-primary" onClick={save}><Save size={16} /> {editingId ? "Update" : "Save"}</button>
              {editingId && <button className="btn-secondary" onClick={() => { setEditingId(null); setForm(templates[active]); }}>Cancel Edit</button>}
            </div>
          </Card>
        )}
        <div className="grid gap-4">
          {items.map((item) => <Card key={item._id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold">{item.title || item.name || item.role || item.level || item.email || item.category || item.visitorId}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description || item.message || item.companyName || item.platform || item.shortDescription || item.userAgent}</p>{active === "visitors" && <p className="mt-2 text-xs text-slate-500">IP: {item.ip || "unknown"} | Visits: {item.visitCount || 1} | Last seen: {item.lastSeenAt ? new Date(item.lastSeenAt).toLocaleString() : "unknown"}</p>}</div>{!["messages", "visitors"].includes(active) && <div className="flex gap-2"><button className="btn-secondary" onClick={() => edit(item)}>Edit</button><button className="btn-secondary text-rose-500" onClick={() => remove(item._id)}><Trash2 size={16} /> Delete</button></div>}</div></Card>)}
        </div>
      </main>
    </Layout>
  );
}
