# Osstart - AI Startup Crash-Tester

Osstart is an ultra-premium, interactive MVP dashboard designed for startup incubators. It simulates consumer interactions using the Google Gemini API to crash-test startup ideas and generate 30-day execution roadmaps.

---

## 🚀 Developer Quick-Start Sequence

Welcome to the team! Follow these steps to get your local development environment set up:

### 1. Install Dependencies
Clone the repository, navigate to the project directory, and download all required packages:
```bash
npm install
```

### 2. Configure Environment Variables
Duplicate the standardized configuration template `.env.example` into a new file named `.env.local` and populate it with the shared project keys:
```bash
cp .env.example .env.local
```
Open `.env.local` and add the respective API keys and URLs:
- `GEMINI_API_KEY`: Your Gemini API Key from Google AI Studio.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key.

### 3. Initialize Database Migrations
If you are spinning up an isolated database instance, refer to the detailed setup guide inside the `/docs` folder:
- See [SETUP_GUIDE.md](file:///home/mohan/Desktop/OSSTART/osstart/docs/SETUP_GUIDE.md) (or the root copy if applicable) to run the necessary SQL database migrations (creating tables `projects`, `execution_matrix`, and `simulation_reports`) in your Supabase SQL Editor console.

### 4. Start the Local Server
Fire up the local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🛠️ Tech Stack & Styling Design

- **Frontend**: Next.js App Router (React, TypeScript) styled with Tailwind CSS.
- **Backend Routing**: Vercel Edge Runtime for API simulation logic (`app/api/crash-test/route.ts`).
- **Database**: Supabase.
- **AI Simulator**: Gemini 2.5 Flash (`gemini-2.5-flash`).
- **Design Aesthetic**: Cinematic, premium dark mode with a midnight black canvas (`#090D16`), sleek slate cards (`#121824`), thin geometric borders (`border-slate-800/80`), and premium sans-serif typography (`Plus Jakarta Sans` / `Inter`). Monospace fonts are applied strictly to the log console screens.
