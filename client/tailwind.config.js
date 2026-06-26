// What: Tailwind theme configuration for the portfolio UI.
// Why: Enables class-based dark mode and shared design tokens.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      boxShadow: {
        glow: "0 20px 80px rgba(14, 165, 233, 0.25)"
      }
    }
  },
  plugins: []
};
