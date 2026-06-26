// What: Admin login screen for full name and unique access ID.
// Why: The public portfolio stays open, but admin actions need a protected entry point.
import { motion } from "framer-motion";
import { LockKeyhole, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useTheme } from "../state/ThemeContext.jsx";

export default function Login() {
  const [form, setForm] = useState({ fullName: "", accessId: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      // Why: Admin clicks should return to Admin after successful authentication.
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Access denied");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden animated-bg px-4">
      <button className="btn-secondary fixed right-5 top-5" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md rounded-lg p-8 shadow-glow"
      >
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-md bg-cyan-500/15 p-3 text-cyan-500">
            <LockKeyhole />
          </div>
          <h1 className="text-3xl font-bold">Ritik Singh Portfolio</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Enter your authorized access details to continue.</p>
        </div>
        <label className="text-sm font-medium">Full Name</label>
        <input className="mt-2 w-full rounded-md border border-slate-300 bg-white/70 px-4 py-3 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/70" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
        <label className="mt-5 block text-sm font-medium">Unique Access ID</label>
        <input className="mt-2 w-full rounded-md border border-slate-300 bg-white/70 px-4 py-3 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/70" type="password" value={form.accessId} onChange={(e) => setForm({ ...form, accessId: e.target.value })} required />
        {error && <p className="mt-4 rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{error}</p>}
        <button className="btn-primary mt-6 w-full py-3" disabled={loading}>{loading ? "Verifying..." : "Login Securely"}</button>
      </motion.form>
    </main>
  );
}
