// What: Public detailed project page for a selected portfolio project.
// Why: Project cards stay compact while this page shows architecture, outcomes, media, and links.
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Layout from "../components/Layout.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { api } from "../lib/api.js";

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Why: Supports both slug and ObjectId project URLs from the backend route.
    api.get(`/projects/${slug}`).then((res) => setProject(res.data));
  }, [slug]);

  if (!project) return <Layout><div className="section">Loading project...</div></Layout>;

  return (
    <Layout>
      <main className="section">
        <Link className="btn-secondary mb-8" to="/"><ArrowLeft size={16} /> Back</Link>
        <SectionTitle eyebrow={project.category} title={project.title} text={project.description} />
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <h3 className="font-bold">Full Description</h3>
            <p className="mt-2">{project.description}</p>
            <h3 className="mt-6 font-bold">Problem Statement</h3>
            <p className="mt-2">{project.problemStatement}</p>
            <h3 className="mt-6 font-bold">Solution</h3>
            <p className="mt-2">{project.solution}</p>
          </Card>
          <Card>
            <div className="flex flex-wrap gap-2">
              {project.githubUrl && <a className="btn-secondary" href={project.githubUrl}><Github size={16} /> GitHub</a>}
              {project.liveUrl && <a className="btn-secondary" href={project.liveUrl}><ExternalLink size={16} /> Live</a>}
              {project.datasetUrl && <a className="btn-secondary" href={project.datasetUrl}>Dataset</a>}
              {project.documentationUrl && <a className="btn-secondary" href={project.documentationUrl}>Docs</a>}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{project.tags?.map((tag) => <span className="rounded-md bg-cyan-500/10 px-2 py-1 text-xs" key={tag}>{tag}</span>)}</div>
          </Card>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {project.screenshots?.map((src) => <img className="rounded-lg" src={src} alt={project.title} key={src} />)}
          {project.videoDemo && <video className="rounded-lg" src={project.videoDemo} controls />}
          {project.architectureDiagram && <img className="rounded-lg" src={project.architectureDiagram} alt="Architecture diagram" />}
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Card><h3 className="font-bold">Technical Challenges</h3>{project.challengesFaced?.map((x) => <p className="mt-2 text-sm" key={x}>{x}</p>)}</Card>
          <Card><h3 className="font-bold">Learning Outcomes</h3>{project.learningOutcomes?.map((x) => <p className="mt-2 text-sm" key={x}>{x}</p>)}</Card>
          <Card><h3 className="font-bold">Future Enhancements</h3>{project.futureEnhancements?.map((x) => <p className="mt-2 text-sm" key={x}>{x}</p>)}</Card>
        </div>
      </main>
    </Layout>
  );
}
