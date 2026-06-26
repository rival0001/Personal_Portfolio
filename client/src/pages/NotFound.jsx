// What: Fallback page for unknown frontend routes.
// Why: Users need a clear path back instead of a blank screen on invalid URLs.
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center animated-bg px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">404</p>
        <h1 className="mt-3 text-4xl font-black">Page not found</h1>
        <Link className="btn-primary mt-6" to="/">Return Home</Link>
      </div>
    </main>
  );
}
