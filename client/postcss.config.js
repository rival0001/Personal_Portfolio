// What: PostCSS pipeline for Tailwind and vendor prefixing.
// Why: Tailwind utilities and browser-compatible CSS are generated during build.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
