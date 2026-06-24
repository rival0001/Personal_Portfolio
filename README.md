# Ritik Singh Portfolio

Premium full-stack personal portfolio website built with React, Tailwind CSS, Framer Motion, Node.js, Express.js, and MongoDB.

## Features

- Secure access-id login with hashed credentials and JWT sessions
- Protected dashboard and admin panel
- Dynamic projects, education, experience, certifications, achievements, resume, skills, visitors, and messages
- Glassmorphism UI, dark/light mode, animated sections, scroll progress, loading screen, back-to-top
- Project search, filters, detailed project pages, newest-first sorting
- Resume upload, preview, and download
- SEO meta tags, PWA manifest, Google Analytics hook

## Quick Start

1. Install Node.js 20+, pnpm, and MongoDB.
2. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Install dependencies:

```bash
pnpm install
```

4. Seed an admin user:

```bash
pnpm seed
```

Default seeded credentials:

- Full Name: `Ritik Singh`
- Unique Access ID: `RITIK-ADMIN-2026`

5. Start development servers:

```bash
pnpm dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Deployment

- Deploy `client` to Vercel, Netlify, or static hosting after `pnpm --dir client build`.
- Deploy `server` to Render, Railway, Fly.io, or an Azure App Service.
- Use MongoDB Atlas for production.
- Set production environment variables from `server/.env.example` and `client/.env.example`.
- Point `VITE_API_URL` to your deployed API URL.

## Uploads

Uploaded images, videos, and resumes are stored under `server/uploads`. For production, replace local uploads with Cloudinary, Azure Blob Storage, or S3.
