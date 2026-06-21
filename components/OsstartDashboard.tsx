'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  BarChart3,
  X,
  Menu,
} from 'lucide-react';

interface FormData {
  coreIdea: string;
  targetAudience: string;
  biggestAssumption: string;
}

interface AssumptionRow {
  id: string;
  assumption: string;
  category: 'Market' | 'Financial' | 'Tech' | 'Operations';
  status: 'Unverified' | 'Testing' | 'Validated';
  confidence: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW';
  microSteps: string[];
}

function renderMarkdown(md: string) {
  if (!md) return null;
  return md.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return <h1 key={idx} className="text-sm font-bold text-slate-200 mt-3 mb-1">{trimmed.slice(2)}</h1>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx} className="text-xs font-bold text-slate-200 mt-2 mb-1">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={idx} className="text-xs font-semibold text-slate-350 mt-2 mb-1">{trimmed.slice(4)}</h3>;
    }
    let content: React.ReactNode = trimmed;
    if (trimmed.includes('**')) {
      const parts = trimmed.split('**');
      content = parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-white">{part}</strong> : part);
    }
    if (trimmed.startsWith('- ')) {
      return <li key={idx} className="list-disc list-inside ml-1 my-0.5 text-slate-300 text-xs">{trimmed.slice(2)}</li>;
    }
    if (trimmed === '') return <div key={idx} className="h-1.5" />;
    return <p key={idx} className="text-slate-400 my-0.5 text-xs">{content}</p>;
  });
}
const DEMO_PRESETS = [
  {
    coreIdea: "An Uber for on-demand neighborhood pet grooming vans.",
    targetAudience: "Busy urban pet owners living in high-rise apartments with no personal vehicles.",
    biggestAssumption: "Pet owners will trust a third-party mobile groomer inside their apartment complex without being physically present."
  },
  {
    coreIdea: "An automated AI micro-contract generator and compliance checker for freelance video editors.",
    targetAudience: "Independent content creators and freelance video editors managing multiple client retainers.",
    biggestAssumption: "Freelancers are willing to legally rely on AI-generated contract compliance without hiring a real attorney."
  },
  {
    coreIdea: "A personalized, physical subscription box that delivers chef-curated weekend meal kits for busy parents.",
    targetAudience: "Dual-income working parents with toddlers who struggle to meal prep on Friday nights.",
    biggestAssumption: "Parents will pay a premium price point of $15 per meal instead of ordering standard fast-food delivery."
  }
];

const SIMULATED_STEPS = [
  "🤖 [SYSTEM] Spawning 1,000 virtual consumer personas based on target audience demographic...",
  "📉 [AGENTS] Running behavioral friction and market churn risk modeling...",
  "💰 [FINANCE] Stress-testing operational cash burn and pilot runway limits...",
  "📋 [MATRIX] Synthesizing localized 30-day execution milestones...",
  "🧠 [CRITIC] Finalizing AI Consultancy Brief and constructive feedback blocks...",
];

export default function OsstartDashboard() {
  const [formData, setFormData] = useState<FormData>({
    coreIdea: 'An Uber for pet grooming',
    targetAudience: 'Busy urban professionals in high-rises',
    biggestAssumption: 'People are comfortable letting a stranger groom their dog inside their apartment',
  });

  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live simulator integration states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [presetIndex, setPresetIndex] = useState(0);

  const handleAutofillPreset = () => {
    const preset = DEMO_PRESETS[presetIndex];
    setFormData({
      coreIdea: preset.coreIdea,
      targetAudience: preset.targetAudience,
      biggestAssumption: preset.biggestAssumption
    });
    setPresetIndex((prev) => (prev + 1) % DEMO_PRESETS.length);
  };

  useEffect(() => {
    if (!isLoading) {
      setActiveStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => Math.min(prev + 1, SIMULATED_STEPS.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const mockAssumptions: AssumptionRow[] = [
    {
      id: 'market-1',
      assumption: 'Target professionals will pay premium for convenience',
      category: 'Market',
      status: 'Testing',
      confidence: 'High',
      microSteps: [
        'Day 1-3: Create cold outreach script for LinkedIn',
        'Day 4-7: Interview 5 target professionals about willingness to pay',
        'Day 8-10: Conduct pricing sensitivity analysis',
      ],
    },
    {
      id: 'market-2',
      assumption: 'Demand exists for in-home pet grooming in urban areas',
      category: 'Market',
      status: 'Unverified',
      confidence: 'Medium',
      microSteps: [
        'Day 1-5: Research market size via Google Trends and industry reports',
        'Day 6-10: Survey 20 pet owners in target cities',
        'Day 11-15: Analyze competition and market gaps',
      ],
    },
    {
      id: 'tech-1',
      assumption: 'Pet grooming scheduling can be fully automated',
      category: 'Tech',
      status: 'Testing',
      confidence: 'Medium',
      microSteps: [
        'Day 1-7: Map out grooming duration variables (pet size, coat type)',
        'Day 8-14: Prototype scheduling algorithm',
        'Day 15-20: Test with 3 grooming professionals',
      ],
    },
    {
      id: 'financial-1',
      assumption: 'Unit economics support 20% take rate',
      category: 'Financial',
      status: 'Unverified',
      confidence: 'Low',
      microSteps: [
        'Day 1-5: Calculate groomer acquisition costs',
        'Day 6-10: Model customer lifetime value',
        'Day 11-15: Stress test with 30%, 20%, 15% rate scenarios',
      ],
    },
    {
      id: 'market-3',
      assumption: 'People are comfortable with stranger in their home',
      category: 'Market',
      status: 'Validated',
      confidence: 'High',
      microSteps: [
        'Day 1-10: Conduct 8 in-depth interviews about safety concerns',
        'Day 11-20: Design vetting and insurance protocols',
        'Day 21-30: Test vetting process with pilot group',
      ],
    },
  ];

  const assumptions: AssumptionRow[] = dashboardData?.matrix
    ? dashboardData.matrix.map((item: any, idx: number) => ({
        id: `task-${idx}`,
        assumption: item.task_name,
        category: (item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()) as any,
        status: idx === 0 ? 'Testing' : 'Unverified',
        confidence: (item.confidence_level.charAt(0).toUpperCase() + item.confidence_level.slice(1).toLowerCase()) as any,
        microSteps: item.micro_steps || [],
      }))
    : mockAssumptions;

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleRunCrashTest = async () => {
    setIsLoading(true);
    setError(null);
    setExpandedRows([]);
    try {
      const response = await fetch('/api/crash-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          core_idea: formData.coreIdea,
          target_audience: formData.targetAudience,
          biggest_assumption: formData.biggestAssumption,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete the startup simulation.');
      }

      setDashboardData(data);
      setIsDashboardActive(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsDashboardActive(false);
    setDashboardData(null);
    setExpandedRows([]);
    setMobileMenuOpen(false);
    setError(null);
  };

  const handleExportReport = () => {
    // Generate Markdown report
    const reportTitle = `Osstart Startup Posture Assessment Report - ${formData.coreIdea}`;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let markdown = `# ${reportTitle}
Generated on: ${dateStr}

---

## 💡 Startup Profile
* **Core Idea:** ${formData.coreIdea}
* **Target Audience:** ${formData.targetAudience}
* **Biggest Assumption:** ${formData.biggestAssumption}

---

## 📊 Analytics Summary
* **Idea Clarity Score:** ${ideaClarity}%
* **Customer Adoption Score:** ${dashboardData ? dashboardData.simulation.adoption_score : 35}/100
* **Market Churn Risk:** ${dashboardData ? dashboardData.simulation.churn_risk : '70% HIGH CHURN RISK'}
* **Current Focus / Sprint:** ${dashboardData ? dashboardData.current_sprint : 'Validate core assumption & build trust framework'}

---

## 🗺️ 30-Day Execution Matrix (The Horizon Scanner)
`;

    assumptions.forEach((row, index) => {
      markdown += `\n### Milestone ${index + 1}: ${row.assumption}
* **Category:** ${row.category}
* **Status:** ${row.status}
* **Confidence Level:** ${row.confidence}
* **30-Day Micro-Steps:**
`;
      row.microSteps.forEach((step) => {
        markdown += `  - ${step}\n`;
      });
    });

    markdown += `
---

## 🤖 Simulator Log Output (1,000 Personas Cohort)
\`\`\`
${dashboardData ? dashboardData.simulation.logs.join('\n') : `[CRITICAL] 78% expressed significant security concerns about home access.
[WARN] 55% worried about mess, water, and pet hair inside their apartment.
[WARN] 38% voiced concerns about pet stress with unfamiliar groomers/environment.
[INFO] 25% considered service too premium given trust unknowns.`}
\`\`\`

---

## 🧠 AI Consultancy Brief
${dashboardData ? dashboardData.consultancy_brief : `### 🔒 Priority #1: Security & Trust
Implement background checks, insurance requirements, and live GPS tracking during appointments. Consider a "trial groom" with owner present.

### 💰 Priority #2: Pricing Strategy
Your 20% take rate may be unsustainable. Groomer feedback suggests 15% is necessary for gig supply. Adjust margins or reduce CAC.

### 👥 Priority #3: Market Expansion
Consider adjacent verticals (pet sitting, dog walking, training) to improve unit economics and lifetime customer value.`}

---
*Report generated automatically by Osstart Platform.*
`;

    // Download as file
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedIdeaName = formData.coreIdea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    link.setAttribute('download', `osstart-report-${sanitizedIdeaName || 'project'}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated':
        return 'bg-emerald-950/40 text-emerald-450 border-emerald-900/50';
      case 'Testing':
        return 'bg-amber-955/30 text-amber-400 border-amber-900/30';
      case 'Unverified':
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Validated':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Testing':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Unverified':
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    const normCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    switch (normCategory) {
      case 'Market':
        return 'bg-blue-955/30 text-blue-400 border-blue-900/35';
      case 'Financial':
        return 'bg-purple-955/30 text-purple-400 border-purple-900/35';
      case 'Tech':
        return 'bg-cyan-955/30 text-cyan-400 border-cyan-900/35';
      case 'Operations':
        return 'bg-orange-955/30 text-orange-450 border-orange-900/35';
      default:
        return 'bg-slate-900/50 text-slate-400 border-slate-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    const normConfidence = confidence.toUpperCase();
    switch (normConfidence) {
      case 'HIGH':
      case 'High':
        return 'text-emerald-400';
      case 'MEDIUM':
      case 'Medium':
        return 'text-amber-400';
      case 'LOW':
      case 'Low':
        return 'text-rose-400';
      default:
        return 'text-slate-450';
    }
  };

  const ideaClarity = dashboardData
    ? dashboardData.clarity_score
    : Math.round((assumptions.filter((a) => a.status === 'Validated').length / assumptions.length) * 100);
  const validatedCount = dashboardData
    ? Math.round(assumptions.length * (ideaClarity / 100))
    : assumptions.filter((a) => a.status === 'Validated').length;
  const totalCount = assumptions.length;

  // LOADING / SIMULATION VIEW
  if (isLoading) {
    const progressPercent = Math.min(((activeStepIndex + 1) / SIMULATED_STEPS.length) * 100, 100);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-2">
              <Zap className="w-6 h-6 text-indigo-600 animate-bounce" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Running Startup Crash-Test...</h2>
            <p className="text-sm text-slate-500">
              Simulating 1,000 professional personas and validating assumption posture
            </p>
          </div>

          {/* Console Container */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 font-mono text-left text-sm space-y-4 shadow-xl text-slate-300">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-slate-500 uppercase tracking-wider text-xs">Simulator Console</span>
            </div>

            {/* Console Logs */}
            <div className="space-y-3 min-h-[180px]">
              {SIMULATED_STEPS.slice(0, activeStepIndex + 1).map((step, idx) => {
                const isCompleted = idx < activeStepIndex;
                const isActive = idx === activeStepIndex;
                return (
                  <div key={idx} className="flex items-start gap-2.5 animate-[fadeIn_0.3s_ease-out]">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : isActive ? (
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 relative">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-indigo-500 relative" />
                      </div>
                    ) : null}
                    <span className={`leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-100 font-semibold'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 px-1">
              <span>Simulation Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/50">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 animate-pulse">
            Please wait while the AI incubator validation is generated...
          </p>
        </div>
      </div>
    );
  }

  // INPUT STATE VIEW
  if (!isDashboardActive) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-[#22d3ee3d] shadow-[0_0_24px_rgba(34,211,238,0.1)]">
              <Zap className="w-7 h-7 text-[#22d3ee] animate-pulse" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-purple-400 mb-2">
              Osstart
            </h1>
            <p className="text-lg text-slate-400">
              Run a crash-test on your startup idea in 30 days
            </p>
          </div>

          {/* Form Card */}
          <div className="neon-card p-8 mb-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-955/40 border border-rose-900/60 rounded-xl text-sm text-rose-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-450 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">Incubation Scan Failed</p>
                  <p className="text-xs text-rose-450 mt-1">{error}</p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8 flex-wrap gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                The Startup Posture Scanner
              </h2>
              <button
                onClick={handleAutofillPreset}
                className="bg-slate-900 border border-slate-800 hover:border-[#22d3ee]/50 text-cyan-400 hover:text-white transition-all px-4 py-2.5 rounded-xl text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5"
              >
                🎲 Autofill Demo Idea
              </button>
            </div>

            {/* Core Idea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold tracking-wide text-slate-350 uppercase mb-3">
                The Core Idea
              </label>
              <textarea
                value={formData.coreIdea}
                onChange={(e) =>
                  setFormData({ ...formData, coreIdea: e.target.value })
                }
                placeholder="e.g., An Uber for pet grooming"
                className="w-full px-4 py-3 neon-input focus:outline-none resize-none placeholder-slate-600"
                rows={3}
              />
              <p className="mt-2 text-xs text-slate-500">Describe your core business concept in 1-2 sentences.</p>
            </div>

            {/* Target Audience */}
            <div className="mb-6">
              <label className="block text-sm font-semibold tracking-wide text-slate-350 uppercase mb-3">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                placeholder="e.g., Busy urban professionals in high-rises"
                className="w-full px-4 py-3 neon-input focus:outline-none placeholder-slate-600"
              />
              <p className="mt-2 text-xs text-slate-500">Who is your primary customer?</p>
            </div>

            {/* Biggest Assumption */}
            <div className="mb-8">
              <label className="block text-sm font-semibold tracking-wide text-slate-350 uppercase mb-3">
                The Biggest Assumption
              </label>
              <textarea
                value={formData.biggestAssumption}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    biggestAssumption: e.target.value,
                  })
                }
                placeholder="e.g., People are comfortable letting a stranger groom their dog inside their apartment"
                className="w-full px-4 py-3 neon-input focus:outline-none resize-none placeholder-slate-600"
                rows={3}
              />
              <p className="mt-2 text-xs text-slate-500">What's the riskiest bet you're making?</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRunCrashTest}
              className="w-full btn-neon-primary font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Play className="w-5 h-5 fill-current" />
              Run Crash-Test
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            We'll simulate 1,000 persona interactions to identify risks and opportunities.
          </p>
        </div>
      </div>
    );
  }

  // DASHBOARD VIEW
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative z-10 text-slate-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-[#0b1120d1] border border-slate-800 rounded-xl hover:bg-slate-900"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-slate-350" />
        ) : (
          <Menu className="w-5 h-5 text-slate-350" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-[#0b1120b8] border-b border-slate-800/85 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-[#22d3ee3d] shadow-[0_0_12px_rgba(34,211,238,0.05)]">
                    <Zap className="w-4.5 h-4.5 text-[#22d3ee]" />
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-purple-400">Osstart Dashboard</h1>
                </div>
                <p className="text-xs font-mono text-slate-400 tracking-wide">30-DAY STARTUP POSTURE ASSESSMENT</p>
              </div>
              <button
                onClick={handleReset}
                className="btn-neon-secondary px-4 py-2 rounded-xl text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Idea Clarity Score */}
            <div className="neon-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider font-mono uppercase mb-1">Idea Clarity Score</p>
                  <p className="text-3xl font-extrabold text-white">{ideaClarity}%</p>
                </div>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                  style={{ width: `${ideaClarity}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-3">{validatedCount} of {totalCount} assumptions validated</p>
            </div>

            {/* Card 2: Current Sprint */}
            <div className="neon-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider font-mono uppercase mb-2">Current Sprint</p>
                </div>
                <Target className="w-5 h-5 text-purple-405" />
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-300">
                    {dashboardData ? dashboardData.current_sprint : "Validate target customer interview pool"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <span className="text-xs text-slate-300">Map grooming duration variables</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Assumption Tracker */}
            <div className="neon-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider font-mono uppercase mb-2">Assumption Tracker</p>
                </div>
                <Activity className="w-5 h-5 text-emerald-450" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-extrabold text-emerald-400">{validatedCount}</p>
                <p className="text-xs text-slate-550 font-mono">of {totalCount} validated</p>
              </div>
              <div className="flex gap-1.5 mt-4">
                {assumptions.map((a) => (
                  <div
                    key={a.id}
                    className={`flex-1 h-1.5 rounded-full ${
                      a.status === 'Validated'
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : a.status === 'Testing'
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The Horizon Scanner Table */}
          <div className="neon-card overflow-hidden">
            <div className="border-b border-slate-800/80 px-6 py-4 bg-[#0f172a40]">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                The Horizon Scanner
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-1">30-DAY EXECUTION MATRIX WITH INTERACTIVE MICRO-STEPS</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 tracking-wider font-mono uppercase">
                      Assumption / Task
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 tracking-wider font-mono uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 tracking-wider font-mono uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 tracking-wider font-mono uppercase">
                      Confidence
                    </th>
                    <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-400 tracking-wider font-mono uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.map((row) => (
                    <React.Fragment key={row.id}>
                      {/* Main Row */}
                      <tr
                        className="border-b border-slate-800/60 hover:bg-[#0b112050] transition-colors cursor-pointer group"
                        onClick={() => toggleRow(row.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-200">{row.assumption}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                              row.category
                            )}`}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              row.status
                            )}`}
                          >
                            {getStatusIcon(row.status)}
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${getConfidenceColor(row.confidence)}`}>
                            {row.confidence}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(row.id);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-900 transition-colors text-slate-400 hover:text-white"
                          >
                            {expandedRows.includes(row.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Row - Micro Steps */}
                      {expandedRows.includes(row.id) && (
                        <tr className="border-b border-slate-800 bg-[#050816]/40">
                          <td colSpan={5} className="px-6 py-6">
                            <div className="bg-[#0b1120b8] border border-slate-800/80 rounded-xl p-5 shadow-inner">
                              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                30-Day Micro-Steps
                              </h4>
                              <div className="space-y-3">
                                {row.microSteps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-955/80 border border-cyan-850 text-[#22d3ee] text-xs font-semibold font-mono">
                                        {stepIdx + 1}
                                      </div>
                                    </div>
                                    <div className="pt-0.5">
                                      <p className="text-sm text-slate-355">{step}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* THE FRIENDLY CRITIC - Side Panel */}
      <div
        className={`w-full lg:w-96 border-l border-slate-800 bg-[#0b1120e6] backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'fixed inset-0 top-16 lg:static z-30' : 'hidden lg:flex'
        }`}
      >
        {/* Panel Header */}
        <div className="border-b border-slate-800/80 px-6 py-5 bg-[#0b112099]">
          <h3 className="text-lg font-bold text-white">The Friendly Critic</h3>
          <p className="text-xs text-slate-500 font-mono mt-1">SIMULATION FEEDBACK & REMEDIATION</p>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulation Log */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Simulation Log</h4>
            </div>
            <div className="bg-slate-955/80 text-slate-100 rounded-xl p-4 font-mono text-xs space-y-1.5 border border-slate-850 max-h-60 overflow-y-auto shadow-inner leading-relaxed">
              <p><span className="text-[#22d3ee] font-bold">$</span> osstart-simulator --personas 1000</p>
              {dashboardData?.simulation.logs.map((log: string, logIdx: number) => {
                let colorClass = 'text-slate-400';
                if (log.startsWith('[WARN]') || log.includes('WARN')) colorClass = 'text-amber-400 font-medium';
                if (log.startsWith('[CRITICAL]') || log.includes('CRITICAL')) colorClass = 'text-rose-450 font-bold';
                if (log.startsWith('[SUCCESS]') || log.startsWith('✓')) colorClass = 'text-emerald-400 font-medium';
                return (
                  <p key={logIdx} className={colorClass}>
                    {log}
                  </p>
                );
              })}
              {!dashboardData && (
                <>
                  <p className="text-slate-500">Initializing crash-test environment...</p>
                  <p className="text-slate-500"><span className="text-cyan-400">&gt;</span> Simulating 1,000 professional personas</p>
                  <p className="text-amber-400 font-medium">⚠ Found critical risks (3)</p>
                  <p className="text-emerald-400 font-medium">✓ Simulation complete</p>
                </>
              )}
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono mb-3">Key Findings</h4>
            <div className="space-y-2.5">
              {dashboardData ? (
                <>
                  <div className="flex gap-2.5 p-3 bg-rose-955/30 rounded-xl border border-rose-900/40">
                    <AlertCircle className="w-4 h-4 text-rose-450 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-300">
                      <strong>Risk Assessment:</strong> {dashboardData.simulation.churn_risk}
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-emerald-955/30 rounded-xl border border-emerald-900/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-300">
                      <strong>Customer Adoption Score:</strong> {dashboardData.simulation.adoption_score}/100
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2.5 p-3 bg-rose-955/30 rounded-xl border border-rose-900/40">
                    <AlertCircle className="w-4 h-4 text-rose-450 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300">
                      <strong>42%</strong> flagged safety concerns about in-home access
                    </p>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-amber-955/30 rounded-xl border border-amber-900/40">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300">
                      <strong>38%</strong> questioned pet groomer vetting process
                    </p>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-blue-955/30 rounded-xl border border-blue-900/40">
                    <AlertCircle className="w-4 h-4 text-blue-450 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-300">
                      <strong>31%</strong> concerned about pricing vs. traditional salons
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Consultancy Brief */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono mb-3">AI Consultancy Brief</h4>
            <div className="space-y-3 text-xs text-slate-350 leading-relaxed max-h-[350px] overflow-y-auto pr-1">
              {dashboardData ? (
                <div>
                  {renderMarkdown(dashboardData.consultancy_brief)}
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-bold text-white mb-1">🔒 Priority #1: Security & Trust</p>
                    <p className="text-slate-450">
                      Implement background checks, insurance requirements, and live GPS tracking during
                      appointments. Consider a "trial groom" with owner present.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">💰 Priority #2: Pricing Strategy</p>
                    <p className="text-slate-455">
                      Your 20% take rate may be unsustainable. Groomer feedback suggests 15% is necessary
                      for gig supply. Adjust margins or reduce CAC.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">👥 Priority #3: Market Expansion</p>
                    <p className="text-slate-455">
                      Consider adjacent verticals (pet sitting, dog walking, training) to improve unit
                      economics and lifetime customer value.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleExportReport}
              className="w-full btn-neon-primary py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              Export Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
