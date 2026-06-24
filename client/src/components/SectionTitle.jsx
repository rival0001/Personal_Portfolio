export default function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-slate-600 dark:text-slate-300">{text}</p>}
    </div>
  );
}
