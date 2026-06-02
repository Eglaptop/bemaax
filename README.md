<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# EGLAPTOP — Gaming Laptops & Tech E-Commerce Platform

Production-ready Next.js 16 + React 19 application with Firebase integration, Gemini AI assistant, and RTL/Arabic support. Containerized with Docker and automated CI/CD via GitHub Actions.

## Quick Start

**Prerequisites:** Node.js 18+, npm/pnpm

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   Create `.env.local` in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   ⚠️ **Never commit `.env.local` to git** — it's in `.gitignore`

3. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint checks
```

## Deployment

### Option 1: Docker (Recommended)

```bash
# Build Docker image locally
docker build -t eglaptop:latest .

# Run container
docker run -p 3000:3000 \
  --env-file .env.local \
  eglaptop:latest

# Or use docker-compose
docker-compose up -d
```

Test health endpoint: `curl http://localhost:3000/api/health`

**For production:** Push image to registry and deploy. See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed K8s and cloud platform instructions.

### Option 2: Automated CI/CD (GitHub Actions)

The repository includes a complete CI/CD pipeline (`.github/workflows/deploy.yml`) that:
- ✅ Runs ESLint on every PR
- ✅ Builds Next.js app on every commit
- ✅ Builds and pushes Docker images to registry
- ✅ Performs health checks

**Setup:**
1. Create GitHub Secrets for deployment:
   - `GEMINI_API_KEY` — Your Gemini API key
   - `NEXT_PUBLIC_GEMINI_API_KEY` — Your public Gemini API key
   
   See [.github/SECRETS.md](.github/SECRETS.md) for detailed instructions.

2. Push to `main` branch — deployment triggers automatically.

### Option 3: Firebase App Hosting

Deploy directly from Git without manual Docker steps. See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for Firebase-specific configuration.

## Project Structure

```
app/                    # Next.js App Router (primary production app)
  layout.tsx           # Root layout with RTL/Arabic support
  page.tsx             # Landing page
  admin/*              # Admin routes
  blog/                # Blog pages
  products/            # Product catalog

components/            # Reusable React components
  ui/                  # Auto-generated Radix UI primitives
  
lib/                   # Shared utilities
  constants.ts         # App-wide constants (colors, nav, categories, AI prompts)
  gemini.ts            # Gemini API integration with exponential backoff
  firebase.ts          # Firebase Auth & Firestore helpers
  utils.ts             # Common utility functions

context/               # React Context (Cart state with localStorage)
public/                # Static assets

src/                   # Legacy Vite SPA (do not use for new features)
```

## Architecture & Key Conventions

### RTL/Arabic-First Design
- Root layout uses `dir="rtl"` — all UI must work bidirectionally
- All Arabic copy preserved and tested in RTL context
- See [AGENTS.md](AGENTS.md) for developer guidelines

### AI Assistant (Gemini Integration)
- `lib/gemini.ts` provides `fetchGeminiRecommendation()` with exponential backoff (5 retries, 1s→32s)
- Requires `GEMINI_API_KEY` in environment
- Used by AI Assistant component for product recommendations

### State Management
- **Cart:** Context API (`context/cart-context.tsx`) + localStorage persistence (client-side only)
- **Theme:** next-themes provider
- **Global state:** kept minimal; prefer component-level state

### UI Components
- Radix UI primitives in `components/ui/` (auto-generated — don't edit directly)
- React Hook Form for forms
- Tailwind CSS 4 for styling
- Sonner for notifications

### Constants & Configuration
All app-wide values live in `lib/constants.ts`:
- Brand colors
- Product categories
- Navigation links
- Footer content
- AI system prompts

### Firebase Integration
- **Firestore:** Database (rules in [firestore.rules](firestore.rules))
- **Auth:** User authentication
- **Config:** `firebase-applet-config.json` (local only, in `.gitignore`)

### Build Quirks
- TypeScript errors ignored in production builds (`next.config.mjs`) — test thoroughly or fix manually
- Image optimization disabled (`unoptimized: true`) — add lazy loading if needed

## Security & Best Practices

- **Never commit secrets:** `.env.local`, `firebase-applet-config.json`, and `firebase-blueprint.json` are in `.gitignore`
- **Environment validation:** Missing `GEMINI_API_KEY` only fails when AI features are used (not on startup)
- **Health endpoint:** `GET /api/health` for monitoring liveness/readiness checks
- **Exponential backoff:** All Gemini API calls retry with backoff to handle rate limits

## Troubleshooting

### `npm run build` fails with TypeScript errors
This is normal (intentional in `next.config.mjs`). The app still builds. Check the output and fix critical errors manually.

### `GEMINI_API_KEY` is not set
Set it in `.env.local` for local development, or in GitHub Secrets + CI environment for production.

### RTL layout broken?
Make sure `dir="rtl"` is in the root `<html>` tag and test with Arabic locale enabled.

### Docker container crashes on startup?
Check logs: `docker logs <container-id>`. Ensure environment variables are passed and health endpoint responds.

## References

- [AGENTS.md](AGENTS.md) — AI agent guidance and repository conventions
- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) — Detailed Docker/K8s deployment guide
- [.github/SECRETS.md](.github/SECRETS.md) — GitHub Actions secrets setup
- [lib/constants.ts](lib/constants.ts) — Application-wide configuration
- [next.config.mjs](next.config.mjs) — Next.js build configuration
