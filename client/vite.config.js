// What: Vite configuration for the React frontend.
// Why: Keeps local development predictable on port 5173.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
