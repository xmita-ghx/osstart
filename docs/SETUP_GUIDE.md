# Setup Guide - Crash-Test API

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
Dependencies were automatically installed. Verify in `package.json`:
```bash
npm ls @google/generative-ai @supabase/supabase-js
```

### Step 2: Create `.env.local`

Copy `.env.example` and fill in your credentials:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```bash
GEMINI_API_KEY=your-api-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Set Up Supabase Database

Create these three tables in your Supabase project:

#### Table 1: `projects`
```sql
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  core_idea TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  biggest_assumption TEXT NOT NULL,
  clarity_score INTEGER,
  current_sprint TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### Table 2: `execution_matrix`
```sql
CREATE TABLE IF NOT EXISTS execution_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  category VARCHAR(50),
  confidence_level VARCHAR(10),
  micro_steps TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_execution_matrix_project_id ON execution_matrix(project_id);
```

#### Table 3: `simulation_reports`
```sql
CREATE TABLE IF NOT EXISTS simulation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  churn_risk TEXT,
  adoption_score INTEGER,
  logs TEXT[],
  consultancy_brief TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_simulation_reports_project_id ON simulation_reports(project_id);
```

**Steps:**
1. Go to [supabase.com](https://supabase.com) and create/open your project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste each table creation SQL and execute
5. Verify tables appear in the "Tables" section

### Step 4: Obtain Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select your project
5. Copy the API key
6. Paste into `.env.local` as `GEMINI_API_KEY`

### Step 5: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click "Settings" (gear icon) → "API"
3. Copy `Project URL` → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Scroll down to "Service Role Key" → copy → paste as `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important**: Service Role Key is sensitive! Never commit to Git or expose to frontend.

### Step 6: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` (you can create a demo page at `app/page.tsx`).

### Step 7: Test the API

```bash
curl -X POST http://localhost:3000/api/crash-test \
  -H "Content-Type: application/json" \
  -d '{
    "core_idea": "AI-powered financial advisor for Gen Z",
    "target_audience": "Young professionals (22-35) with $20k-100k income",
    "biggest_assumption": "Users prefer AI financial advice over human advisors for routine decisions"
  }'
```

Expected response (first time may take 10-15 seconds):
```json
{
  "success": true,
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "clarity_score": 75,
  "simulation": { ... },
  "matrix": [ ... ],
  "consultancy_brief": "# Consultancy Brief..."
}
```

---

## 🔍 Verify Setup

### Checklist
- [ ] All three environment variables in `.env.local`
- [ ] All three Supabase tables created
- [ ] `npm run dev` runs without errors
- [ ] API endpoint responds with 200 and valid JSON
- [ ] Data appears in Supabase tables after API call

### Troubleshooting

**Error: "GEMINI_API_KEY environment variable is not set"**
- Verify `.env.local` has the key
- Restart dev server: `Ctrl+C` then `npm run dev`

**Error: "Supabase client initialization failed"**
- Check `NEXT_PUBLIC_SUPABASE_URL` format (should be `https://...`)
- Verify key has proper permissions

**Error: "Invalid JSON response from Gemini API"**
- Gemini may have returned non-JSON (usually rare)
- Check Gemini API key is valid
- Verify `gemini-2.5-flash` model is available in your region

**Empty Supabase tables after API call**
- Check row-level security (RLS) isn't blocking inserts
- Go to Supabase → Tables → click each table → "RLS" tab → ensure "Enable" is off or policies allow

---

## 📂 Project Structure

```
osstart/
├── app/
│   ├── api/
│   │   └── crash-test/
│   │       └── route.ts           ← Main API handler
│   ├── layout.tsx                  ← Root layout
│   └── page.tsx                    ← Optional: demo page
├── lib/
│   └── supabase-server.ts          ← Supabase client
├── .env.local                       ← Your credentials (create from .env.example)
├── .env.example                     ← Template
├── API_DOCUMENTATION.md             ← Full API reference
├── SETUP_GUIDE.md                   ← This file
├── package.json                     ← Dependencies
└── ...other files...
```

---

## 🎯 Next Steps

### Option 1: Build UI Dashboard
Create `app/dashboard/page.tsx` to display results:
```typescript
'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/crash-test', {
      method: 'POST',
      body: JSON.stringify({
        core_idea: e.target.core_idea.value,
        target_audience: e.target.target_audience.value,
        biggest_assumption: e.target.biggest_assumption.value,
      }),
    });
    setResult(await res.json());
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit}>
        <input name="core_idea" placeholder="Core idea" required />
        <input name="target_audience" placeholder="Target audience" required />
        <input name="biggest_assumption" placeholder="Biggest assumption" required />
        <button type="submit">Run Crash Test</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### Option 2: Integrate with OsstartDashboard
See `OsstartDashboard.tsx` and wire it to call the API.

### Option 3: Deploy to Production
```bash
npm run build
npm run start
```

Deploy to Vercel, Netlify, or your hosting provider.

---

## 📚 Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Full endpoint reference

---

## ✅ Support

If you encounter issues:

1. Check logs: `npm run dev` shows console output
2. Check Supabase: Settings → Logs shows database queries
3. Check Gemini: Visit [aistudio.google.com](https://aistudio.google.com) to test API key
4. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for troubleshooting

