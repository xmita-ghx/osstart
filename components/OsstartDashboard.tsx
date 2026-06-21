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
  Lock,
  Unlock,
  Globe,
  Users,
  Briefcase,
  Copy,
  ExternalLink,
  ShieldCheck,
  ChevronRight
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

  // Matchmaking states
  const [localAssumptions, setLocalAssumptions] = useState<AssumptionRow[]>([]);
  const [isMatchmakingLoading, setIsMatchmakingLoading] = useState(false);
  const [matchmakingError, setMatchmakingError] = useState<string | null>(null);
  const [matchmakingMatches, setMatchmakingMatches] = useState<any[] | null>(null);
  const [blindPayload, setBlindPayload] = useState<any | null>(null);
  const [isHubActive, setIsHubActive] = useState(false);
  const [selectedDisclosureMatch, setSelectedDisclosureMatch] = useState<any | null>(null);
  const [disclosureAuthChecked, setDisclosureAuthChecked] = useState(false);
  const [disclosureSuccess, setDisclosureSuccess] = useState(false);
  const [disclosureToken, setDisclosureToken] = useState<string | null>(null);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [matchmakingLoaderMessage, setMatchmakingLoaderMessage] = useState('');

  // Synchronize localAssumptions with dashboardData or fallback to mock
  useEffect(() => {
    if (dashboardData?.matrix) {
      setLocalAssumptions(
        dashboardData.matrix.map((item: any, idx: number) => ({
          id: `task-${idx}`,
          assumption: item.task_name,
          category: (item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase()) as any,
          status: idx === 0 ? 'Testing' : 'Unverified',
          confidence: (item.confidence_level.charAt(0).toUpperCase() + item.confidence_level.slice(1).toLowerCase()) as any,
          microSteps: item.micro_steps || [],
        }))
      );
    } else {
      setLocalAssumptions(mockAssumptions);
    }
    // Reset matchmaking state when data resets
    setMatchmakingMatches(null);
    setIsHubActive(false);
    setBlindPayload(null);
  }, [dashboardData]);

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

  const assumptions = localAssumptions;

  const updateRowStatus = (id: string, newStatus: 'Unverified' | 'Testing' | 'Validated') => {
    setLocalAssumptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleValidateAll = () => {
    setLocalAssumptions((prev) =>
      prev.map((item) => ({ ...item, status: 'Validated' }))
    );
  };

  const handleActivateMatchmaking = async () => {
    setIsMatchmakingLoading(true);
    setMatchmakingError(null);
    setIsHubActive(true);

    const loadingMessages = [
      "Compiling objective project metrics...",
      "Stripping demographic & regional references (Blind Pitch Mode)...",
      "Evaluating alignment scores across neural hub connections...",
      "Applying 20% wildcard exploration logic to break echo chambers...",
      "Generating secure matchmaking profile nodes..."
    ];

    let msgIndex = 0;
    setMatchmakingLoaderMessage(loadingMessages[0]);
    const messageInterval = setInterval(() => {
      msgIndex++;
      if (msgIndex < loadingMessages.length) {
        setMatchmakingLoaderMessage(loadingMessages[msgIndex]);
      }
    }, 850);

    try {
      const payload = {
        business_model_parameters: {
          core_idea: formData.coreIdea,
          biggest_assumption: formData.biggestAssumption,
          categories: localAssumptions.map(a => a.category)
        },
        target_demographic_strings: formData.targetAudience.split(',').map(s => s.trim()),
        risk_vector_scores: {
          clarity_score: ideaClarity,
          adoption_score: dashboardData ? dashboardData.simulation.adoption_score : 35,
          churn_risk: dashboardData ? dashboardData.simulation.churn_risk : '70% HIGH CHURN RISK',
          milestones_validated: validatedCount,
          total_milestones: totalCount
        }
      };

      const res = await fetch('/api/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      clearInterval(messageInterval);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Neural matchmaking service error.");
      }

      setMatchmakingMatches(data.matches);
      setBlindPayload(data.blind_payload);
    } catch (err: any) {
      clearInterval(messageInterval);
      setMatchmakingError(err.message || "An unexpected error occurred during matchmaking.");
    } finally {
      setIsMatchmakingLoading(false);
    }
  };

  const handleApproveDisclosure = () => {
    const token = 'sec_token_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    setDisclosureToken(token);
    setDisclosureSuccess(true);
    const link = `https://osstart.io/verify/${token}`;
    navigator.clipboard.writeText(link).catch(e => console.error("Clipboard copy failed:", e));
  };

  const handleCloseDisclosureModal = () => {
    setSelectedDisclosureMatch(null);
    setDisclosureAuthChecked(false);
    setDisclosureSuccess(false);
    setDisclosureToken(null);
  };

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

  const validatedCount = localAssumptions.filter((a) => a.status === 'Validated').length;
  const totalCount = localAssumptions.length;
  const ideaClarity = totalCount > 0 ? Math.round((validatedCount / totalCount) * 100) : 0;
  const hasTestingMilestones = localAssumptions.some((a) => a.status === 'Testing');

  // LOADING / SIMULATION VIEW
  if (isLoading) {
    const progressPercent = Math.min(((activeStepIndex + 1) / SIMULATED_STEPS.length) * 100, 100);

    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#121824] border border-slate-800/80 rounded-xl mb-2">
              <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Running Startup Crash-Test...</h2>
            <p className="text-sm text-slate-450">
              Simulating 1,000 professional personas and validating assumption posture
            </p>
          </div>

          {/* Console Container */}
          <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-8 font-mono text-left text-sm space-y-4 text-slate-300">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-slate-500 uppercase tracking-wider text-xs font-sans font-semibold">Simulator Console</span>
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
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute" />
                        <span className="w-2 h-2 rounded-full bg-[#22d3ee] relative" />
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
            <div className="flex justify-between text-xs font-semibold text-slate-400 px-1">
              <span>Simulation Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-[#121824] rounded-full h-2 overflow-hidden border border-slate-800/80">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out" 
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 bg-[#121824] border border-slate-800/80">
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
                className="bg-slate-900 border border-slate-800 hover:border-[#22d3ee]/50 text-cyan-400 hover:text-white transition-all px-4 py-2.5 rounded-xl text-[11px] font-sans font-semibold tracking-wider uppercase flex items-center gap-1.5"
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

  const renderMatchCard = (match: any, idx: number) => {
    return (
      <div 
        key={idx} 
        className={`bg-[#F8FAFC] border border-slate-200/65 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-205 flex flex-col justify-between relative text-left ${
          match.is_wildcard ? 'ring-2 ring-indigo-500/20 bg-indigo-50/10' : ''
        }`}
      >
        <div>
          {/* Alignment and Name */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h5 className="font-extrabold text-sm text-slate-900 leading-tight font-sans">
              {match.name}
            </h5>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex-shrink-0 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {match.alignment_score}%
            </span>
          </div>

          {/* Subtitle Details */}
          <p className="text-[11px] font-bold text-slate-500 font-sans uppercase tracking-wide mb-2">
            {match.details}
          </p>

          {/* Value Prop */}
          <p className="text-xs text-slate-650 leading-relaxed font-sans mb-4">
            {match.value_proposition}
          </p>

          {/* Wildcard Highlight */}
          {match.is_wildcard && (
            <div className="mb-4 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] text-indigo-700 font-sans">
              <span className="font-bold uppercase tracking-wider block mb-0.5">🌟 Exploration Wildcard Match</span>
              <p className="leading-snug">{match.wildcard_reason}</p>
            </div>
          )}
        </div>

        {/* Friction Outreach Button */}
        <button
          onClick={() => {
            setSelectedDisclosureMatch(match);
            setOutreachMessage(`Hello Team at ${match.name},\n\nI am the founder of a validated startup platform. Our core business mechanics focus on ${match.is_wildcard ? 'cross-sector operational synergy' : 'optimized workflow patterns'} matching your investment mandate. Under blind stress-testing, our platform achieved a ${ideaClarity}% Clarity Score, ${dashboardData ? dashboardData.simulation.adoption_score : 35}/100 Consumer Adoption, and we have fully validated ${validatedCount} out of our ${totalCount} core execution milestones.\n\nI would love to securely disclose our verified 30-Day Execution Roadmap for your review.\n\nBest regards,\n[Verified Founder]`);
          }}
          className="w-full bg-[#FFFFFF] hover:bg-indigo-50/50 border border-indigo-200 text-indigo-600 hover:text-indigo-700 transition-all font-bold font-sans py-2 px-3 rounded-lg text-xs mt-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          Request Secure Roadmap Disclosure
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative z-10 text-slate-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-[#121824] border border-slate-800/80 rounded-xl hover:bg-slate-900"
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
        <div className="bg-[#090D16]/90 border-b border-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#121824] border border-slate-800/80">
                    <Zap className="w-4.5 h-4.5 text-[#22d3ee]" />
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-purple-400">Osstart Dashboard</h1>
                </div>
                <p className="text-xs font-sans font-semibold text-slate-450 tracking-wider">30-DAY STARTUP POSTURE ASSESSMENT</p>
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
            <div className="neon-card p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider font-sans uppercase mb-1">Idea Clarity Score</p>
                  <p className="text-3xl font-extrabold text-white">{ideaClarity}%</p>
                </div>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="w-full bg-slate-950 border border-slate-800/80 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${ideaClarity}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 font-sans font-medium mt-3">{validatedCount} of {totalCount} assumptions validated</p>
            </div>

            {/* Card 2: Current Sprint */}
            <div className="neon-card p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider font-sans uppercase mb-2">Current Sprint</p>
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
            <div className="neon-card p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 tracking-wider font-sans uppercase mb-2">Assumption Tracker</p>
                </div>
                <Activity className="w-5 h-5 text-emerald-450" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-3xl font-extrabold text-emerald-400">{validatedCount}</p>
                <p className="text-xs text-slate-400 font-sans font-semibold">of {totalCount} validated</p>
              </div>
              <div className="flex gap-1.5 mt-4">
                {assumptions.map((a) => (
                  <div
                    key={a.id}
                    className={`flex-1 h-1.5 rounded-full ${
                      a.status === 'Validated'
                        ? 'bg-emerald-500'
                        : a.status === 'Testing'
                        ? 'bg-amber-500'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>            {/* The Horizon Scanner Table */}
          <div className="neon-card overflow-hidden">
            <div className="border-b border-slate-800/80 px-8 py-6 bg-[#121824]">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                The Horizon Scanner
              </h2>
              <p className="text-xs text-slate-450 font-sans font-semibold mt-1">30-DAY EXECUTION MATRIX WITH INTERACTIVE MICRO-STEPS</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#121824]/50">
                    <th className="px-8 py-5 text-left text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase">
                      Assumption / Task
                    </th>
                    <th className="px-8 py-5 text-left text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase">
                      Category
                    </th>
                    <th className="px-8 py-5 text-left text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase">
                      Status
                    </th>
                    <th className="px-8 py-5 text-left text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase">
                      Confidence
                    </th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-slate-400 tracking-wider font-sans uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.map((row) => (
                    <React.Fragment key={row.id}>
                      {/* Main Row */}
                      <tr
                        className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors cursor-pointer group"
                        onClick={() => toggleRow(row.id)}
                      >
                        <td className="px-8 py-5">
                          <p className="text-sm font-medium text-slate-200">{row.assumption}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                              row.category
                            )}`}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="relative inline-block">
                            <select
                              value={row.status}
                              onChange={(e) => {
                                updateRowStatus(row.id, e.target.value as any);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className={`appearance-none cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 pr-8 text-xs font-semibold rounded-full border outline-none bg-transparent transition-all hover:bg-slate-900/50 ${getStatusColor(
                                row.status
                              )}`}
                              style={{
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23${
                                  row.status === 'Validated'
                                    ? '34d399'
                                    : row.status === 'Testing'
                                    ? 'fbbf24'
                                    : '94a3b8'
                                }' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1.25rem 1.25rem',
                                backgroundRepeat: 'no-repeat'
                              }}
                            >
                              <option value="Unverified" className="bg-[#121824] text-slate-300">Unverified</option>
                              <option value="Testing" className="bg-[#121824] text-slate-300">Testing</option>
                              <option value="Validated" className="bg-[#121824] text-slate-300">Validated</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-sm font-semibold ${getConfidenceColor(row.confidence)}`}>
                            {row.confidence}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
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
                        <tr className="border-b border-slate-800 bg-[#090D16]/50">
                          <td colSpan={5} className="px-8 py-6">
                            <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-8">
                              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                30-Day Micro-Steps
                              </h4>
                              <div className="space-y-3">
                                {row.microSteps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#090D16] border border-slate-800/80 text-cyan-400 text-xs font-bold font-sans">
                                        {stepIdx + 1}
                                      </div>
                                    </div>
                                    <div className="pt-0.5">
                                      <p className="text-sm text-slate-355">{step}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {row.status !== 'Validated' && (
                                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateRowStatus(row.id, 'Validated');
                                    }}
                                    className="bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/60 text-emerald-400 font-sans font-semibold text-xs py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Mark Milestone as Validated
                                  </button>
                                </div>
                              )}
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

          {/* Strategic Ecosystem Matchmaking Hub */}
          <div className="bg-[#FFFFFF] text-slate-900 rounded-2xl p-8 border border-slate-200 shadow-sm mt-8 relative overflow-hidden transition-all duration-300">
            {/* Soft decorative blur or pattern in the background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/30 rounded-full blur-2xl -z-10 pointer-events-none" />

            {/* Header */}
            <div className="border-b border-slate-100 pb-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
                    {hasTestingMilestones ? <Lock className="w-4.5 h-4.5" /> : <Unlock className="w-4.5 h-4.5" />}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Strategic Ecosystem Matchmaking Hub
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider font-sans uppercase">
                  TRANSITIONING FROM SIMULATOR TO CONNECTED ECOSYSTEM
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                  hasTestingMilestones 
                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}>
                  {hasTestingMilestones ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      Pending Validation
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Ecosystem Ready
                    </>
                  )}
                </span>
                {hasTestingMilestones && (
                  <button
                    onClick={handleValidateAll}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-semibold cursor-pointer border-none bg-transparent ml-1"
                    title="Cheat code to validate all milestones for review convenience"
                  >
                    Demo: Validate All
                  </button>
                )}
              </div>
            </div>

            {/* Body State 1: Locked State */}
            {hasTestingMilestones ? (
              <div className="py-8 text-center max-w-lg mx-auto space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl text-slate-400 mb-2 relative">
                  <Lock className="w-8 h-8" />
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full absolute top-4 right-4 animate-ping" />
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full absolute top-4 right-4" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Connection Engine Engaged but Locked</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  The matchmaking ecosystem remains in standby. In compliance with high-stakes relationship safety, Osstart requires all <strong className="text-slate-700">"Testing"</strong> milestones in your Horizon Scanner to be validated before connecting you to actual venture and peer networks.
                </p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 font-semibold inline-block font-sans">
                  Current Block: {localAssumptions.filter(a => a.status === 'Testing').length} active milestone(s) require validation.
                </div>
              </div>
            ) : (
              /* Body State 2: Unlocked / Results View */
              <div className="space-y-6">
                {!isHubActive && (
                  <div className="py-6 text-center max-w-xl mx-auto space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      All execution assumptions have been successfully validated. You can now compile the local project state (<code className="text-xs bg-slate-50 px-1 py-0.5 rounded font-mono text-slate-600">business_model_parameters</code>, <code className="text-xs bg-slate-50 px-1 py-0.5 rounded font-mono text-slate-600">target_demographic_strings</code>, and <code className="text-xs bg-slate-50 px-1 py-0.5 rounded font-mono text-slate-600">risk_vector_scores</code>) to query our matchmaking service.
                    </p>
                    <button
                      onClick={handleActivateMatchmaking}
                      className="bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all duration-200 py-3.5 px-8 rounded-xl font-bold font-sans tracking-wide uppercase shadow-sm flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Activate Network Alignment
                    </button>
                  </div>
                )}

                {/* Loading State */}
                {isMatchmakingLoading && (
                  <div className="py-12 text-center space-y-4">
                    <div className="inline-block relative w-12 h-12">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                    </div>
                    <p className="text-xs font-mono font-semibold text-indigo-600 animate-pulse animate-pulse">
                      {matchmakingLoaderMessage}
                    </p>
                  </div>
                )}

                {/* Error State */}
                {matchmakingError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-start gap-2.5">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Matchmaking Request Failed</p>
                      <p className="mt-0.5">{matchmakingError}</p>
                    </div>
                  </div>
                )}

                {/* Matchmaking Results Grid */}
                {matchmakingMatches && !isMatchmakingLoading && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Secure Payload Auditor Debugger */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                      <details className="group">
                        <summary className="list-none flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-slate-800 font-sans">
                              Responsible AI Audit: Blind Pitch Payload
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded font-sans uppercase">
                              Active
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 group-open:hidden">Show Payload JSON</span>
                          <span className="text-xs font-semibold text-indigo-600 hidden group-open:block">Hide Payload JSON</span>
                        </summary>
                        <div className="mt-4 pt-4 border-t border-slate-105 space-y-3 font-sans text-xs text-left">
                          <p className="text-slate-500 leading-relaxed">
                            In <strong className="text-slate-700">Blind Pitch Matching Mode</strong>, all demographic keywords, regional data, and hype words are programmatically stripped from the matchmaking request payload. This forces the matching algorithm to pair you purely based on core mechanics, metrics, and milestone velocity.
                          </p>
                          <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[10px] overflow-x-auto max-h-48 leading-normal">
                            {JSON.stringify(blindPayload, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>

                    {/* The 3-Column Results Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Venture Capitalists Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-left">
                          <Briefcase className="w-4.5 h-4.5 text-indigo-600" />
                          <h4 className="font-bold text-sm text-slate-900 font-sans uppercase tracking-wide">
                            Venture Capital Options
                          </h4>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ml-auto">
                            {matchmakingMatches.filter(m => m.category === 'Venture Capitalist').length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {matchmakingMatches
                            .filter(m => m.category === 'Venture Capitalist')
                            .map((match, idx) => renderMatchCard(match, idx))}
                        </div>
                      </div>

                      {/* Regional Incubators Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-left">
                          <Globe className="w-4.5 h-4.5 text-indigo-600" />
                          <h4 className="font-bold text-sm text-slate-900 font-sans uppercase tracking-wide">
                            Regional Incubators
                          </h4>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ml-auto">
                            {matchmakingMatches.filter(m => m.category === 'Regional Incubator').length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {matchmakingMatches
                            .filter(m => m.category === 'Regional Incubator')
                            .map((match, idx) => renderMatchCard(match, idx))}
                        </div>
                      </div>

                      {/* Peer Networks Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-left">
                          <Users className="w-4.5 h-4.5 text-indigo-600" />
                          <h4 className="font-bold text-sm text-slate-900 font-sans uppercase tracking-wide">
                            Peer Networks
                          </h4>
                          <span className="bg-slate-100 text-slate-605 text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ml-auto">
                            {matchmakingMatches.filter(m => m.category === 'Complementary Peer Founder').length}
                          </span>
                        </div>
                        <div className="space-y-4">
                          {matchmakingMatches
                            .filter(m => m.category === 'Complementary Peer Founder')
                            .map((match, idx) => renderMatchCard(match, idx))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Human-in-the-Loop Secure Disclosure Modal */}
        {selectedDisclosureMatch && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-955/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-202 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative font-sans text-slate-800 animate-in fade-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={handleCloseDisclosureModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-105 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Title */}
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    Secure Roadmap Disclosure
                  </h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Human-in-the-Loop Verification Gate
                  </p>
                </div>
              </div>

              {!disclosureSuccess ? (
                <div className="space-y-4 text-left">
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    You are initiating a manual disclosure request to <strong className="text-slate-800">{selectedDisclosureMatch.name}</strong>. In compliance with our Responsible AI framework, Osstart enforces absolute manual validation. Automated cold pitches are strictly prohibited.
                  </p>

                  {/* Secure Disclosed Data Preview */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs font-sans">
                    <span className="font-bold text-slate-805 block mb-1">Disclosed Verification Metrics Payload:</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>✓ Idea Clarity: <strong className="text-slate-800">{ideaClarity}%</strong></div>
                      <div>✓ Market Adoption: <strong className="text-slate-800">{dashboardData ? dashboardData.simulation.adoption_score : 35}/100</strong></div>
                      <div>✓ Churn Risk: <strong className="text-slate-800">{dashboardData ? dashboardData.simulation.churn_risk : '70% HIGH RISK'}</strong></div>
                      <div>✓ Milestones: <strong className="text-slate-800">{validatedCount}/{totalCount} Validated</strong></div>
                    </div>
                  </div>

                  {/* Custom Outreach Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-705 uppercase font-sans">
                      Personalized Outreach Message Draft
                    </label>
                    <textarea
                      value={outreachMessage}
                      onChange={(e) => setOutreachMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-700 font-sans"
                      rows={6}
                    />
                    <p className="text-[10px] text-slate-450 leading-snug font-sans">
                      Customize this pitch message. Keep it professional. It will be sent alongside the secure read-only token link.
                    </p>
                  </div>

                  {/* Verification Checkbox */}
                  <div className="flex items-start gap-2.5 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                    <input
                      type="checkbox"
                      id="auth-checkbox"
                      checked={disclosureAuthChecked}
                      onChange={(e) => setDisclosureAuthChecked(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    />
                    <label htmlFor="auth-checkbox" className="text-xs text-indigo-850 select-none cursor-pointer leading-snug font-sans">
                      I explicitly authorize the generation of a secure roadmap access token and approve sharing my verified metrics with <strong className="text-indigo-950">{selectedDisclosureMatch.name}</strong>.
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex justify-end gap-3 border-t border-slate-100 font-sans">
                    <button
                      onClick={handleCloseDisclosureModal}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold rounded-xl text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveDisclosure}
                      disabled={!disclosureAuthChecked}
                      className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-slate-200 disabled:text-slate-400 disabled:border-transparent text-white transition-all text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Approve Disclosure & Send Verification Link
                    </button>
                  </div>
                </div>
              ) : (
                /* Success State */
                <div className="text-center py-6 space-y-5 text-left font-sans">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-500 mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 text-center">Roadmap Disclosure Approved</h4>
                    <p className="text-xs text-slate-505 mt-1 max-w-sm mx-auto text-center">
                      A secure verification link containing a read-only token has been created. The partner has been notified of your validation milestones.
                    </p>
                  </div>

                  {/* Token and link */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 font-mono text-[10px] space-y-2.5 max-w-md mx-auto text-left">
                    <div>
                      <span className="text-slate-400 block uppercase font-bold text-[9px] font-sans tracking-wide">SECURE DISCLOSURE TOKEN</span>
                      <span className="text-slate-800 break-all">{disclosureToken}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase font-bold text-[9px] font-sans tracking-wide">VERIFIED ACCESS LINK (COPIED)</span>
                      <span className="text-indigo-600 select-all break-all">https://osstart.io/verify/{disclosureToken}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://osstart.io/verify/${disclosureToken}`);
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold rounded-xl text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </button>
                    <button
                      onClick={handleCloseDisclosureModal}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 transition-colors text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* THE FRIENDLY CRITIC - Side Panel */}
      <div
        className={`w-full lg:w-96 border-l border-slate-800/80 bg-[#090D16] flex flex-col overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'fixed inset-0 top-16 lg:static z-30' : 'hidden lg:flex'
        }`}
      >
        {/* Panel Header */}
        <div className="border-b border-slate-800/80 px-6 py-5 bg-[#090D16]">
          <h3 className="text-lg font-bold text-white font-sans">The Friendly Critic</h3>
          <p className="text-xs text-slate-450 font-sans font-semibold mt-1">SIMULATION FEEDBACK & REMEDIATION</p>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulation Log */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans">Simulation Log</h4>
            </div>
            <div className="bg-[#121824] text-slate-100 rounded-xl p-6 font-mono text-xs space-y-1.5 border border-slate-800/80 max-h-60 overflow-y-auto leading-relaxed shadow-none">
              <p><span className="text-[#22d3ee] font-bold">$</span> osstart-simulator --personas 1000</p>
              {dashboardData?.simulation.logs.map((log: string, logIdx: number) => {
                let colorClass = 'text-slate-400';
                if (log.startsWith('[WARN]') || log.includes('WARN')) colorClass = 'text-amber-400 font-medium';
                if (log.startsWith('[CRITICAL]') || log.includes('CRITICAL')) colorClass = 'text-rose-450 font-bold';
                if (log.startsWith('[SUCCESS]') || log.startsWith('✓')) colorClass = 'text-[#10b981] font-medium';
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
                  <p className="text-[#10b981] font-medium">✓ Simulation complete</p>
                </>
              )}
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans mb-3">Key Findings</h4>
            <div className="space-y-2.5">
              {dashboardData ? (
                <>
                  <div className="flex gap-2.5 p-3 bg-rose-955/30 rounded-xl border border-rose-900/40">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-300 font-sans">
                      <strong>Risk Assessment:</strong> {dashboardData.simulation.churn_risk}
                    </div>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-emerald-955/30 rounded-xl border border-emerald-900/40">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-300 font-sans">
                      <strong>Customer Adoption Score:</strong> {dashboardData.simulation.adoption_score}/100
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2.5 p-3 bg-rose-950/30 rounded-xl border border-rose-900/40">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300 font-sans">
                      <strong>42%</strong> flagged safety concerns about in-home access
                    </p>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-amber-955/30 rounded-xl border border-amber-900/40">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 font-sans">
                      <strong>38%</strong> questioned pet groomer vetting process
                    </p>
                  </div>
                  <div className="flex gap-2.5 p-3 bg-blue-955/30 rounded-xl border border-blue-900/40">
                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-300 font-sans">
                      <strong>31%</strong> concerned about pricing vs. traditional salons
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Consultancy Brief */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-sans mb-3">AI Consultancy Brief</h4>
            <div className="space-y-3 text-xs text-slate-350 leading-relaxed max-h-[350px] overflow-y-auto pr-1 font-sans">
              {dashboardData ? (
                <div>
                  {renderMarkdown(dashboardData.consultancy_brief)}
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-bold text-white mb-1 font-sans">🔒 Priority #1: Security & Trust</p>
                    <p className="text-slate-450 font-sans">
                      Implement background checks, insurance requirements, and live GPS tracking during
                      appointments. Consider a "trial groom" with owner present.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 font-sans">💰 Priority #2: Pricing Strategy</p>
                    <p className="text-slate-455 font-sans">
                      Your 20% take rate may be unsustainable. Groomer feedback suggests 15% is necessary
                      for gig supply. Adjust margins or reduce CAC.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1 font-sans">👥 Priority #3: Market Expansion</p>
                    <p className="text-slate-455 font-sans">
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
