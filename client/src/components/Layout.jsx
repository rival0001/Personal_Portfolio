import { ArrowUp, LogOut, Moon, Shield, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";
import { useTheme } from "../state/ThemeContext.jsx";

export default function Layout({ children }) {
  const { logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total ? (window.scrollY / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen animated-bg">
      <div className="fixed left-0 top-0 z-50 h-1 bg-cyan-500" style={{ width: `${progress}%` }} />
      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="font-bold tracking-tight">Ritik Singh</Link>
          <div className="flex items-center gap-2">
            {isAdmin && <Link className="btn-secondary" to="/admin"><Shield size={16} /> Admin</Link>}
            <button className="btn-secondary" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="btn-secondary" onClick={logout}><LogOut size={16} /> Logout</button>
          </div>
        </nav>
      </header>
      {children}
      <button
        className="fixed bottom-6 right-6 rounded-full bg-cyan-500 p-3 text-white shadow-glow"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
