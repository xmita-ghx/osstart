# Osstart Crash-Test API Documentation

## Overview

The **Crash-Test API** (`POST /api/crash-test`) is the core backend loop for Osstart that validates startup ideas using Google Gemini's dual-stage startup simulator. It implements a hard-hitting market stress test, execution planning, and AI-driven consultancy in a single API call.

---

## 📋 Request Specification

### Endpoint
```
POST /api/crash-test
Content-Type: application/json
```

### Request Body

```json
{
  "core_idea": "string",           // The startup's core value proposition
  "target_audience": "string",      // Description of primary customer segment
  "biggest_assumption": "string"    // Critical unvalidated hypothesis
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/api/crash-test \
  -H "Content-Type: application/json" \
  -d '{
    "core_idea": "AI-powered meal planning app that generates personalized recipes based on dietary restrictions and available ingredients",
    "target_audience": "Busy professionals (25-45) with family responsibilities, income $60k+, health-conscious",
    "biggest_assumption": "Users will adopt the app if we reduce meal planning time by 70% and guarantee 90% recipe satisfaction"
  }'
```

---

## 📊 Response Specification

### Success Response (200 OK)

```json
{
  "success": true,
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "clarity_score": 78,
  "current_sprint": "Q2 2024 - Market Validation & MVP Launch",
  "simulation": {
    "churn_risk": "34% MODERATE CHURN RISK",
    "adoption_score": 72,
    "logs": [
      "[WARN] 34% flagged cost concerns when compared to free alternatives",
      "[CRITICAL] Onboarding flow required 7+ steps - UX friction detected",
      "[INFO] 89% expressed interest in dietary preference customization",
      "[WARN] Competitor landscape shows 12+ existing solutions with similar features"
    ]
  },
  "matrix": [
    {
      "task_name": "Validate core assumption through user interviews",
      "category": "Market",
      "confidence_level": "HIGH",
      "micro_steps": [
        "Recruit 20 target users for structured interviews",
        "Test prototype recipe generation with 5 meal planning scenarios",
        "Measure satisfaction score and time-to-plan reduction"
      ]
    },
    {
      "task_name": "Finalize pricing model and unit economics",
      "category": "Financial",
      "confidence_level": "MEDIUM",
      "micro_steps": [
        "Calculate CAC based on initial user acquisition data",
        "Model LTV at different price points ($9.99, $14.99, $19.99)",
        "Establish profitability timeline for 10k active users"
      ]
    },
    {
      "task_name": "Build and deploy MVP with core features",
      "category": "Tech",
      "confidence_level": "HIGH",
      "micro_steps": [
        "Implement recipe generation algorithm with 3 dietary options",
        "Deploy beta version to closed user group (50 users)",
        "Set up analytics and feedback collection pipeline"
      ]
    }
  ],
  "consultancy_brief": "# Consultancy Brief: Meal Planning AI\n\n## Executive Summary\nYour core idea has strong market potential (72/100 adoption score), but faces **moderate churn risk** primarily driven by pricing sensitivity and competitive differentiation challenges.\n\n## Key Risks\n\n1. **Market Risk (High)**: 12+ competitors exist with similar features. Your differentiation must center on superior recipe personalization and seamless UX.\n2. **Assumption Risk (Critical)**: The claim of \"70% time reduction\" requires validation. Current market leaders show 40-50% reduction as realistic.\n3. **Financial Risk (Moderate)**: Unit economics at $9.99/month will not sustain growth. Target $14.99+ to achieve profitability at 10k users.\n\n## Mitigation Plans\n\n- **Market**: Focus on underserved niche (e.g., keto + eco-conscious consumers) for initial 10k users\n- **Assumption**: Run A/B tests with 100+ users on different recipe counts and complexity levels\n- **Financial**: Implement tiered pricing ($9.99 basic, $14.99 premium, $24.99 family) within first 30 days\n\n## Growth Opportunities\n\n- Integrate with meal delivery services (HelloFresh, EveryPlate)\n- Add social features (recipe sharing, meal prep groups)\n- Expand to meal prep market ($4.2B TAM)\n\n## 30-Day Roadmap\nFocus on market validation first. Complete 20 user interviews, validate time-to-plan reduction claim, and test pricing elasticity before scaling acquisition."
}
```

### Error Response (4xx/5xx)

```json
{
  "success": false,
  "error": "Missing required fields: core_idea, target_audience, biggest_assumption"
}
```

---

## 🔧 Environment Configuration

The API requires the following environment variables in `.env.local`:

```bash
# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Getting API Keys

**Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key"
3. Copy and paste into `.env.local`

**Supabase Keys:**
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy `Project URL` and `Service Role Key`

---

## 📈 Gemini Model Configuration

The API uses **Gemini 2.5 Flash** with structured output configuration:

```typescript
{
  model: 'gemini-2.5-flash',
  responseMimeType: 'application/json',
  responseSchema: { /* full JSON schema */ }
}
```

### Why Structured Outputs?

- **Guaranteed JSON Format**: Prevents parsing failures
- **Type Safety**: Strict schema validation at generation time
- **Faster Inference**: Model optimizes for expected structure
- **Reliability**: Eliminates hallucinated or malformed responses

---

## 🗄️ Database Schema

The API inserts data into three Supabase tables:

### 1. `projects`
```sql
CREATE TABLE projects (
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

### 2. `execution_matrix`
```sql
CREATE TABLE execution_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  task_name TEXT NOT NULL,
  category VARCHAR(50),
  confidence_level VARCHAR(10),
  micro_steps TEXT[],
  created_at TIMESTAMP DEFAULT now()
);
```

### 3. `simulation_reports`
```sql
CREATE TABLE simulation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  churn_risk TEXT,
  adoption_score INTEGER,
  logs TEXT[],
  consultancy_brief TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🚀 Usage Example

### Client-Side Implementation

```typescript
async function runCrashTest(idea: {
  core_idea: string;
  target_audience: string;
  biggest_assumption: string;
}) {
  const response = await fetch('/api/crash-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(idea),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // { project_id, clarity_score, simulation, matrix, ... }
}

// Usage
const result = await runCrashTest({
  core_idea: 'AI meal planner',
  target_audience: 'Busy professionals',
  biggest_assumption: '70% time reduction'
});

console.log(`Project ID: ${result.project_id}`);
console.log(`Clarity Score: ${result.clarity_score}`);
console.log(`Adoption Score: ${result.simulation.adoption_score}`);
```

---

## ⚠️ Error Handling

| Status | Error | Action |
|--------|-------|--------|
| 400 | Missing required fields | Ensure all three fields provided |
| 500 | `GEMINI_API_KEY not set` | Add key to `.env.local` |
| 500 | Supabase connection error | Verify URL and service key |
| 500 | Invalid JSON from Gemini | Retry or check model quota |

---

## 🔒 Security Considerations

1. **Service Role Key**: Store `SUPABASE_SERVICE_ROLE_KEY` server-side only (never expose to client)
2. **API Key Rotation**: Regenerate Gemini API key monthly
3. **Rate Limiting**: Consider adding rate limits per IP/user in production
4. **Input Validation**: The endpoint validates required fields; extend with length/format limits as needed

---

## 📊 Response Schema Reference

```typescript
interface CrashTestResponse {
  project_id: string;
  clarity_score: number;              // 0-100 clarity metric
  current_sprint: string;             // Recommended sprint/phase
  simulation: {
    churn_risk: string;              // e.g., "34% MODERATE CHURN RISK"
    adoption_score: number;          // 0-100 market readiness
    logs: string[];                  // 4 detailed console logs
  };
  matrix: Array<{
    task_name: string;               // Clear milestone
    category: string;                // "Market", "Financial", "Tech", "Operations"
    confidence_level: string;        // "HIGH", "MEDIUM", "LOW"
    micro_steps: string[];           // 3 operational steps
  }>;
  consultancy_brief: string;         // Markdown-formatted brief
}
```

---

## 🧪 Testing

To test the endpoint locally:

```bash
# Install dev dependencies (if needed)
npm install

# Start dev server
npm run dev

# In another terminal, test the API
curl -X POST http://localhost:3000/api/crash-test \
  -H "Content-Type: application/json" \
  -d '{
    "core_idea": "AI fitness coach",
    "target_audience": "Fitness enthusiasts 18-45",
    "biggest_assumption": "Users prefer AI coaching over human trainers"
  }'
```

---

## 📚 Related Files

- **Route Handler**: `app/api/crash-test/route.ts`
- **Supabase Client**: `lib/supabase-server.ts`
- **Environment Template**: `.env.example`
- **Layout**: `app/layout.tsx`

