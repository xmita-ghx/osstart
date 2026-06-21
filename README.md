# OSSTART

Osstart (https://osstart.vercel.app) is a human-centric, high-fidelity MVP dashboard engineered for early-stage founders and startup incubators. Fulfilling the **AI Crash-Test** and **Zero-to-One Builder** framework, the platform strips away the noise of generic task managers to solve the single biggest risk point for newcomers: **surviving the first 30 days**. 

By taking structural, high-density data layouts typically reserved for complex analytics tools and humanizing them into a warm, approachable workspace, Osstart maps out precise execution roadmaps. Using a multi-agent backend powered by the Google Gemini API, it runs pre-launch **"Crash-Test" Simulations**—stress-testing business assumptions against virtual consumer personas—before bridging validated founders into a high-trust network of Venture Capitalists (VCs), incubators, and peer founders.

---

## 🌿 Features of Osstart

*   **Pre-Launch AI "Crash-Test" Simulator:** Leverages a multi-agent AI system to simulate virtual consumer personas, stress-testing core business assumptions and highlighting potential failure points before any capital is spent.
*   **Ecosystem Matchmaking Hub:** Programmatically connects validated founders with vetted venture capitalists, localized incubators, and peer founders using "blind pitch" matching to ensure equitable, bias-free networking.
*   **The "Friendly Critic" Feedback Panel:** Provides constructive market analysis and strategic remediation steps via a clean slide-out drawer, delivering empathetic, human-readable guidance instead of intimidating technical logs.
*   **Interactive 30-Day Execution Matrix:** Transforms vague startup ideas into a highly structured, granular roadmap, breaking down broad goals into actionable, step-by-step daily micro-tasks.
*   **Built-in Responsible AI Guardrails:** Enforces real-world traction by requiring users to log actual offline data before marking milestones as complete, while utilizing a dual-agent system to prevent echo chambers and surfacing strict legal/compliance disclaimers.

---

## 🎨 Layout DNA & Humanized Aesthetic

Osstart rejects sterile, intimidating cyberpunk/cybersecurity themes in favor of an inviting, professional, editorial workspace (inspired by premium SaaS paradigms like Notion, Linear, and Stripe) designed to encourage clarity and focus:

*   **The Main Canvas (`bg-[#F9FAFB]`)**: A soft, warm off-white that replicates the clean feel of premium stationery or an open desk.
*   **The Container Cards (`bg-[#FFFFFF]`)**: Crisp white surfaces using ultra-subtle blurs and soft drop shadows (`shadow-sm`) instead of harsh geometric borders.
*   **Visual Accents**: Trustworthy Deep Indigo (`#4F46E5`) for primary actions, Emerald Green (`#059669`) for validated milestones, and soft Terracotta Red/Amber for critical risk vectors.
*   **Typography**: Rounded, humanistic typography (`Plus Jakarta Sans` paired with `Inter`) for optimal editorial readability, retaining monospaced text strictly inside analytical simulation sub-panels.

---

## 🧩 Dashboard Architecture: From Raw Idea to Ecosystem Alignment

The application maps the user's workflow into dense, interconnected visual modules based on an enterprise-grade dashboard architecture:

1.  **The Executive Metrics Row (Startup Health Snapshot)**: Tracks aggregate high-level health parameters: *Idea Clarity Index* (percentage of parameter definition), *Unverified Assumptions Count* (blind spots needing immediate testing), and the *Active 30-Day Sprint Goal*.
2.  **The 30-Day Matrix (The Core Interactive Table)**: A dense, responsive grid translating vague concepts into hard steps. Rows expand smoothly upon click to reveal highly granular, offline micro-tasks (e.g., changing *"Validate price elasticity"* into *"Interview 5 target customers this week"*).
3.  **The Friendly Critic Panel (Slide-Out Simulation Drawer)**: A beautifully formatted conversational review panel that slides into view when hitting "Crash-Test Release". It bypasses raw terminal strings to deliver empathetic, candid, markdown-formatted market stress analyses and strategic remediation steps.
4.  **The Ecosystem Matchmaking Hub (Networking Layer)**: Once assumptions are stress-tested and marked as validated, founders unlock programmatic matchmaking channels. This panel displays warm, high-signal connection pathways to vetted VCs, localized startup incubators, and cross-functional peer founders navigating parallel milestones.

---

## 🔒 Responsible AI Engineering & Guardrails

Judges scoring this repository will find that safety, mitigation of echo chambers, and ethical guardrails are hardcoded directly into the application's architecture:

*   **The Anti-Echo Chamber Mechanism**: The backend execution engine enforces a dual-agent layout. Agent A acts as an optimistic business architect, while Agent B is constrained as a highly critical Venture Capitalist. The final dashboard stability index weighs Agent B's objections heavily to eliminate false positives and prevent misleading founders into quitting their jobs over non-viable trends.
*   **Blind Pitch Matching & Wildcards**: To ensure equitable access to capital and combat algorithmic bias within the networking layer, investor matchmaking queries isolate verified performance metrics and milestone progression while suppressing demographic bias. A fixed 20% of the matching queue introduces "Wildcard" peer and mentor connections slightly outside the core industry vertical to destroy echo chambers.
*   **Hard-Friction Legal & Compliance Banners**: Any generated training material or micro-steps regarding corporate registration, tax structuring, or equity allocation dynamically renders a high-contrast amber warning banner: *"This represents an educational blueprint. Please consult a local professional before executing legal documents."*
*   **Action Bias Framework**: To cultivate real-world traction, the UI prevents founders from marking a milestone row as "Validated" unless they fill in a mandatory text field documenting real-world human data or user interviews collected offline.

---

## 🛠️ Tech Stack Matrix

*   **Frontend Ecosystem**: Next.js App Router (React, TypeScript) optimized with Tailwind CSS.
*   **Backend & Compute**: Vercel Serverless/Edge Runtime handling stream processing and simulation routing via `app/api/crash-test/route.ts`.
*   **Database Infrastructure**: Supabase (Real-time data state synchronization, secure data relationships, and storage management).
*   **AI Engine**: Google Gemini 2.5 Flash (`gemini-2.5-flash`) executing structured schema parsing and multi-agent synthesis.

---

# 🚀 Developer Quick-Start Sequence

## 1. Install Dependencies

Clone the repository, navigate to the root directory, and fetch the package tree:

```bash
npm install
```

## 2. Configure Environment Variables

To keep credentials secure, all integration keys must be managed through local environment variables. Duplicate the standardized environment template into your local file:

```bash
cp .env.example .env.local
```

Open the newly created `.env.local` file and fill in your corresponding developer workspace keys:

- **`GEMINI_API_KEY`** — Found in your Google AI Studio Dashboard.
- **`NEXT_PUBLIC_SUPABASE_URL`** — Your designated Supabase project endpoint.
- **`SUPABASE_SERVICE_ROLE_KEY`** — Your project's secure service role key.

## 3. Initialize Database Tables

If spinning up a fresh infrastructure instance, execute the target database schemas. Refer to the structural schema design and migration logs located within the `/docs` directory to generate the required relations in your Supabase SQL Editor:

- `projects`
- `execution_matrix`
- `simulation_reports`

## 4. Boot the Local Server

Launch the local engine inside your development environment:

```bash
npm run dev
```

Open **http://localhost:3000** in your web browser to interact with the system shell.

---

# 🌐 Deployment

This application is configured for continuous integration and direct production hosting via **Vercel**.

When deploying your own fork, ensure all keys listed in your `.env.local` file are fully configured within your **Vercel Project Environment Settings**.

---

<div align="center">

Crafted with ❤️ by **Team Revitalizers** for the **USAII Global AI Hackathon 2026**

</div>
