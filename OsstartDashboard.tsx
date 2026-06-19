'use client';

import React, { useState } from 'react';
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
  category: 'Market' | 'Financial' | 'Tech';
  status: 'Unverified' | 'Testing' | 'Validated';
  confidence: 'High' | 'Medium' | 'Low';
  microSteps: string[];
}

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

  const assumptions: AssumptionRow[] = [
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

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleRunCrashTest = () => {
    setIsDashboardActive(true);
    setExpandedRows([]);
  };

  const handleReset = () => {
    setIsDashboardActive(false);
    setExpandedRows([]);
    setMobileMenuOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Testing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Unverified':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Validated':
        return <CheckCircle className="w-4 h-4" />;
      case 'Testing':
        return <Clock className="w-4 h-4" />;
      case 'Unverified':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Market':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Financial':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Tech':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High':
        return 'text-emerald-600';
      case 'Medium':
        return 'text-amber-600';
      case 'Low':
        return 'text-rose-600';
      default:
        return 'text-slate-600';
    }
  };

  const validatedCount = assumptions.filter((a) => a.status === 'Validated').length;
  const totalCount = assumptions.length;
  const ideaClarity = Math.round((validatedCount / totalCount) * 100);

  // INPUT STATE VIEW
  if (!isDashboardActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Osstart</h1>
            <p className="text-lg text-slate-600">
              Run a crash-test on your startup idea in 30 days
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">The Startup Posture Scanner</h2>

            {/* Core Idea */}
            <div className="mb-6">
              <label className="block text-sm font-semibold tracking-tight text-slate-900 mb-3">
                The Core Idea
              </label>
              <textarea
                value={formData.coreIdea}
                onChange={(e) =>
                  setFormData({ ...formData, coreIdea: e.target.value })
                }
                placeholder="e.g., An Uber for pet grooming"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
                rows={3}
              />
              <p className="mt-2 text-xs text-slate-500">Describe your core business concept in 1-2 sentences.</p>
            </div>

            {/* Target Audience */}
            <div className="mb-6">
              <label className="block text-sm font-semibold tracking-tight text-slate-900 mb-3">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
                placeholder="e.g., Busy urban professionals in high-rises"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
              />
              <p className="mt-2 text-xs text-slate-500">Who is your primary customer?</p>
            </div>

            {/* Biggest Assumption */}
            <div className="mb-8">
              <label className="block text-sm font-semibold tracking-tight text-slate-900 mb-3">
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-slate-900 placeholder-slate-400"
                rows={3}
              />
              <p className="mt-2 text-xs text-slate-500">What's the riskiest bet you're making?</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleRunCrashTest}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Play className="w-5 h-5" />
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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-slate-600" />
        ) : (
          <Menu className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-indigo-600" />
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Osstart Dashboard</h1>
                </div>
                <p className="text-sm text-slate-500">30-Day Startup Posture Assessment</p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Idea Clarity Score</p>
                  <p className="text-3xl font-bold text-slate-900">{ideaClarity}%</p>
                </div>
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${ideaClarity}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-3">{validatedCount} of {totalCount} assumptions validated</p>
            </div>

            {/* Card 2: Current Sprint */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-3">Current Sprint</p>
                </div>
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Validate target customer interview pool</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">Map grooming duration variables</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Assumption Tracker */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-3">Assumption Tracker</p>
                </div>
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-emerald-600">{validatedCount}</p>
                <p className="text-sm text-slate-500">of {totalCount} validated</p>
              </div>
              <div className="flex gap-1 mt-4">
                {assumptions.map((a) => (
                  <div
                    key={a.id}
                    className={`flex-1 h-1 rounded-full ${
                      a.status === 'Validated'
                        ? 'bg-emerald-500'
                        : a.status === 'Testing'
                        ? 'bg-amber-500'
                        : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* The Horizon Scanner Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                The Horizon Scanner
              </h2>
              <p className="text-sm text-slate-500 mt-1">30-Day Execution Matrix with interactive micro-steps</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wide">
                      Assumption / Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wide">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 tracking-wide">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assumptions.map((row, idx) => (
                    <React.Fragment key={row.id}>
                      {/* Main Row */}
                      <tr
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => toggleRow(row.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">{row.assumption}</p>
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
                          <span className={`text-sm font-medium ${getConfidenceColor(row.confidence)}`}>
                            {row.confidence}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(row.id);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-200 transition-colors text-slate-600"
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
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td colSpan={5} className="px-6 py-6">
                            <div className="bg-white rounded-lg border border-slate-200 p-4">
                              <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-600" />
                                30-Day Micro-Steps
                              </h4>
                              <div className="space-y-3">
                                {row.microSteps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                                        {stepIdx + 1}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm text-slate-700">{step}</p>
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
        className={`w-full lg:w-96 border-l border-slate-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'fixed inset-0 top-16 lg:static z-30' : 'hidden lg:flex'
        }`}
      >
        {/* Panel Header */}
        <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">The Friendly Critic</h3>
          <p className="text-xs text-slate-500 mt-1">Simulation feedback & remediation</p>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Simulation Log */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Simulation Log</h4>
            </div>
            <div className="bg-slate-900 text-slate-50 rounded-lg p-4 font-mono text-xs space-y-1 border border-slate-800">
              <p><span className="text-emerald-400">$</span> osstart-simulator --personas 1000</p>
              <p className="text-slate-500">Initializing crash-test environment...</p>
              <p className="text-slate-500">
                <span className="text-cyan-400">&gt;</span> Running market assumptions...
              </p>
              <p className="text-slate-500">
                <span className="text-cyan-400">&gt;</span> Simulating 1,000 professional personas
              </p>
              <p className="text-amber-400">⚠ Found critical risks (3)</p>
              <p className="mt-2 text-emerald-400">✓ Simulation complete</p>
            </div>
          </div>

          {/* Key Findings */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 tracking-wide uppercase mb-3">Key Findings</h4>
            <div className="space-y-2">
              <div className="flex gap-2 p-3 bg-rose-50 rounded-lg border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-rose-700">
                  <strong>42%</strong> flagged safety concerns about in-home access
                </p>
              </div>
              <div className="flex gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  <strong>38%</strong> questioned pet groomer vetting process
                </p>
              </div>
              <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  <strong>31%</strong> concerned about pricing vs. traditional salons
                </p>
              </div>
            </div>
          </div>

          {/* AI Consultancy Brief */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 tracking-wide uppercase mb-3">AI Consultancy Brief</h4>
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div>
                <p className="font-semibold text-slate-900 mb-1">🔒 Priority #1: Security & Trust</p>
                <p className="text-slate-600">
                  Implement background checks, insurance requirements, and live GPS tracking during
                  appointments. Consider a "trial groom" with owner present.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">💰 Priority #2: Pricing Strategy</p>
                <p className="text-slate-600">
                  Your 20% take rate may be unsustainable. Groomer feedback suggests 15% is necessary
                  for gig supply. Adjust margins or reduce CAC.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">👥 Priority #3: Market Expansion</p>
                <p className="text-slate-600">
                  Consider adjacent verticals (pet sitting, dog walking, training) to improve unit
                  economics and lifetime customer value.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="pt-3 border-t border-slate-200">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
              Export Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
