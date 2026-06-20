/**
 * OsstartDashboard Component Variants & Stories
 * 
 * This file documents all possible states and variations of the component.
 * Use these as reference for understanding the component behavior.
 */

// ============================================================================
// STATE 1: INPUT FORM (Initial State)
// ============================================================================
/**
 * The user sees the onboarding form when isDashboardActive = false
 * 
 * Features:
 * - Centered card layout
 * - 3 input fields (1 large textarea, 1 input, 1 large textarea)
 * - Brand header with icon and description
 * - "Run Crash-Test" CTA button
 * - Pre-populated with pet grooming example (for demo)
 * 
 * Interactions:
 * - User can type in any field
 * - User can click "Run Crash-Test" to transition to dashboard
 * 
 * Responsive:
 * - Mobile: Single column, full width
 * - Desktop: Centered, max-w-2xl
 */

// Example filled form data:
const filledFormData = {
  coreIdea: 'An Uber for pet grooming',
  targetAudience: 'Busy urban professionals in high-rises',
  biggestAssumption: 'People are comfortable letting a stranger groom their dog inside their apartment'
};

// ============================================================================
// STATE 2: DASHBOARD (After form submission)
// ============================================================================
/**
 * The dashboard appears when isDashboardActive = true
 * 
 * Structure:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Header (Sticky)                                                         │
 * │ Title: "Osstart Dashboard"                                              │
 * │ Reset Button                                                            │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ┌────────────────────────────────────────┬──────────────────────────────┐
 * │ Main Content                           │ The Friendly Critic Panel    │
 * │                                        │ (Side Panel - hidden on      │
 * │ ┌──────────────────────────────────┐  │  mobile with menu toggle)    │
 * │ │ Analytics Cards Row (3 Cards)    │  │                              │
 * │ │ ├─ Idea Clarity Score            │  │ ┌──────────────────────────┐ │
 * │ │ │  68% with progress bar          │  │ │ Simulation Log           │ │
 * │ │ ├─ Current Sprint                │  │ │ (Terminal widget)        │ │
 * │ │ │  - Action items list            │  │ │                          │ │
 * │ │ └─ Assumption Tracker            │  │ ├──────────────────────────┤ │
 * │ │    1 of 3 Validated               │  │ │ Key Findings             │ │
 * │ │                                   │  │ │ - Risk cards             │ │
 * │ │ ┌──────────────────────────────┐  │  │ ├──────────────────────────┤ │
 * │ │ │ The Horizon Scanner (Table)  │  │  │ │ AI Consultancy Brief     │ │
 * │ │ │                              │  │  │ │ - Priorities & advice    │ │
 * │ │ │ ┌──────────────────────────┐ │  │  │ └──────────────────────────┘ │
 * │ │ │ │ Row 1 (Collapsible)     │ │  │  │                              │
 * │ │ │ │ ├─ Main content         │ │  │  │ [Export Report Button]       │
 * │ │ │ │ └─ Expanded micro-steps │ │  │  │                              │
 * │ │ │ ├──────────────────────────┤ │  │  │                              │
 * │ │ │ │ Row 2                   │ │  │  │                              │
 * │ │ │ ├──────────────────────────┤ │  │  │                              │
 * │ │ │ │ Row 3 (Expanded)        │ │  │  │                              │
 * │ │ │ │ ├─ Main content         │ │  │  │                              │
 * │ │ │ │ └─ Expanded micro-steps │ │  │  │                              │
 * │ │ │ └──────────────────────────┘ │  │  │                              │
 * │ │ └──────────────────────────────┘  │  │                              │
 * │ └──────────────────────────────────┘  │                              │
 * └────────────────────────────────────────┴──────────────────────────────┘
 */

// ============================================================================
// ANALYTICS CARDS VARIANTS
// ============================================================================

/**
 * Card 1: Idea Clarity Score
 * Shows: Percentage (0-100%) based on assumptions validated
 * Visual: Circular/linear progress indicator
 * Calculation: (validatedCount / totalCount) * 100
 */
const ideaClarityCardProps = {
  title: 'Idea Clarity Score',
  value: 68,
  icon: 'BarChart3',
  metric: '2 of 5 assumptions validated',
  color: 'indigo'
};

/**
 * Card 2: Current Sprint
 * Shows: 2-3 immediate action items
 * Visual: Bulleted list
 * Updates: Dynamic based on assumption status
 */
const currentSprintCardProps = {
  title: 'Current Sprint',
  items: [
    'Validate target customer interview pool',
    'Map grooming duration variables'
  ],
  icon: 'Target',
  color: 'amber'
};

/**
 * Card 3: Assumption Tracker
 * Shows: Fractional status (e.g., "1 of 3")
 * Visual: Mini progress indicators (colored dots)
 * Breakdown: Validated (green), Testing (amber), Unverified (gray)
 */
const assumptionTrackerCardProps = {
  title: 'Assumption Tracker',
  numerator: 1,
  denominator: 3,
  icon: 'Activity',
  statusBreakdown: [
    { status: 'Validated', count: 1, color: 'emerald' },
    { status: 'Testing', count: 2, color: 'amber' },
    { status: 'Unverified', count: 0, color: 'slate' }
  ],
  color: 'emerald'
};

// ============================================================================
// TABLE ROW VARIANTS
// ============================================================================

/**
 * Row State 1: Normal (Collapsed)
 * Shows: Assumption, Category badge, Status badge, Confidence level, Chevron
 * Hover: Subtle background change
 * Click: Expands to show micro-steps
 */
const tableRowNormal = {
  assumption: 'Target professionals will pay premium for convenience',
  category: 'Market',
  status: 'Testing',
  confidence: 'High',
  isExpanded: false
};

/**
 * Row State 2: Expanded
 * Shows: All of above PLUS nested micro-steps list
 * Background: Slightly different color (slate-50)
 * Animation: Smooth slide-down
 * 
 * Micro-steps list shows:
 * - Numbered items (1, 2, 3)
 * - Day range (Day 1-3, Day 4-7, etc.)
 * - Specific actions for each date range
 */
const tableRowExpanded = {
  assumption: 'Target professionals will pay premium for convenience',
  category: 'Market',
  status: 'Testing',
  confidence: 'High',
  isExpanded: true,
  microSteps: [
    'Day 1-3: Create cold outreach script for LinkedIn',
    'Day 4-7: Interview 5 target professionals about willingness to pay',
    'Day 8-10: Conduct pricing sensitivity analysis'
  ]
};

/**
 * Badge Style Variants
 */
const badgeVariants = {
  // Status badges
  status: {
    Validated: 'bg-emerald-50 text-emerald-700 border-emerald-200 with-checkmark',
    Testing: 'bg-amber-50 text-amber-700 border-amber-200 with-clock',
    Unverified: 'bg-slate-50 text-slate-600 border-slate-200 with-alert'
  },
  // Category badges
  category: {
    Market: 'bg-blue-50 text-blue-700 border-blue-200',
    Financial: 'bg-purple-50 text-purple-700 border-purple-200',
    Tech: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  // Confidence indicators (text-only, no badge)
  confidence: {
    High: 'text-emerald-600 font-medium',
    Medium: 'text-amber-600 font-medium',
    Low: 'text-rose-600 font-medium'
  }
};

// ============================================================================
// MICRO-STEPS EXPANSION ANIMATION
// ============================================================================

/**
 * Row Expansion Behavior:
 * 
 * BEFORE CLICK:
 * ┌────────────────────────────────┐
 * │ Assumption | Category | Status │
 * └────────────────────────────────┘
 * 
 * AFTER CLICK:
 * ┌────────────────────────────────┐
 * │ Assumption | Category | Status │
 * ├────────────────────────────────┤
 * │ ┌────────────────────────────┐ │
 * │ │ 30-Day Micro-Steps        │ │
 * │ │ ┌──────────────────────┐   │ │
 * │ │ │ 1 Day 1-3: ...      │   │ │
 * │ │ ├──────────────────────┤   │ │
 * │ │ │ 2 Day 4-7: ...      │   │ │
 * │ │ ├──────────────────────┤   │ │
 * │ │ │ 3 Day 8-10: ...     │   │ │
 * │ │ └──────────────────────┘   │ │
 * │ └────────────────────────────┘ │
 * └────────────────────────────────┘
 * 
 * Animation: Smooth height transition (CSS)
 * Duration: ~300ms
 * Easing: ease-in-out
 */

// ============================================================================
// SIDE PANEL VARIANTS
// ============================================================================

/**
 * Panel State 1: Desktop
 * Position: Fixed right side, w-96
 * Visibility: Always visible
 * Scrollable: Vertical scroll for content
 * Content: Simulation log + Key findings + AI brief
 */
const sidePanelDesktop = {
  width: '24rem', // w-96
  position: 'fixed-right',
  borderLeft: '1px solid #E5E7EB',
  visible: true
};

/**
 * Panel State 2: Mobile (Hidden)
 * Position: Fixed overlay
 * Visibility: Toggle via menu button
 * Animation: Slide in/out from right
 * Interaction: Tap menu button to show/hide
 */
const sidePanelMobile = {
  position: 'fixed-overlay',
  width: '100%',
  animation: 'slide-in-out-right',
  visible: false, // Initially hidden
  toggleButton: 'top-right'
};

/**
 * Side Panel Sections:
 * 
 * 1. SIMULATION LOG
 *    - Terminal widget style (dark background, monospace font)
 *    - Green animated pulse indicator
 *    - Simulated CLI output:
 *      $ osstart-simulator --personas 1000
 *      > Running market assumptions...
 *      ⚠ Found critical risks (3)
 *      ✓ Simulation complete
 * 
 * 2. KEY FINDINGS
 *    - Color-coded risk cards
 *    - Rose (red): Critical safety concerns (42%)
 *    - Amber (yellow): Medium concerns (38%)
 *    - Blue: Opportunities/notes (31%)
 * 
 * 3. AI CONSULTANCY BRIEF
 *    - Priority #1, #2, #3
 *    - Emoji prefix for each priority
 *    - Actionable recommendations
 *    - Business strategy insights
 * 
 * 4. EXPORT BUTTON
 *    - "Export Full Report" CTA
 *    - Trigger PDF/JSON export
 */

// ============================================================================
// COLOR SYSTEM REFERENCE
// ============================================================================

/**
 * Status Colors
 */
const statusColors = {
  Validated: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'CheckCircle',
    progress: 'bg-emerald-500'
  },
  Testing: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'Clock',
    progress: 'bg-amber-500'
  },
  Unverified: {
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: 'AlertCircle',
    progress: 'bg-slate-300'
  }
};

/**
 * Category Colors
 */
const categoryColors = {
  Market: 'bg-blue-50 text-blue-700 border-blue-200',
  Financial: 'bg-purple-50 text-purple-700 border-purple-200',
  Tech: 'bg-cyan-50 text-cyan-700 border-cyan-200'
};

/**
 * Confidence Colors (Text only)
 */
const confidenceColors = {
  High: 'text-emerald-600',
  Medium: 'text-amber-600',
  Low: 'text-rose-600'
};

// ============================================================================
// RESPONSIVE LAYOUT CHANGES
// ============================================================================

/**
 * Breakpoint: sm (< 640px)
 * - Form: Full screen, no max-width constraint
 * - Dashboard: Main content takes full width
 * - Analytics cards: Stack vertically (1 column)
 * - Table: Full width with horizontal scroll
 * - Side panel: Hidden, toggle via menu button
 * - Header: Reduced padding
 */

/**
 * Breakpoint: md (640px - 1024px)
 * - Form: Slightly constrained
 * - Dashboard: 2 columns for some cards
 * - Analytics: 2-3 columns depending on space
 * - Table: Partial horizontal scroll
 * - Side panel: Still hidden, accessible via menu
 */

/**
 * Breakpoint: lg (> 1024px)
 * - Form: max-w-2xl centered
 * - Dashboard: Full side-by-side layout
 * - Analytics: 3 columns always
 * - Table: Full width with no scroll
 * - Side panel: Visible always, w-96
 * - Header: Full padding
 */

// ============================================================================
// INTERACTION PATTERNS
// ============================================================================

/**
 * User Flow 1: First Time User
 * 1. Lands on form
 * 2. Sees pre-filled example (pet grooming)
 * 3. Can edit or clear and enter own idea
 * 4. Clicks "Run Crash-Test"
 * 5. Sees dashboard with populated data
 * 6. Can explore table rows
 * 7. Can read side panel recommendations
 */

/**
 * User Flow 2: Exploring Assumptions
 * 1. User on dashboard
 * 2. Clicks on table row
 * 3. Row expands smoothly
 * 4. Sees 30-day micro-steps with numbering
 * 5. Clicks another row to expand that
 * 6. Previous row can stay open or auto-collapse
 * 7. Can scroll through all micro-steps
 */

/**
 * User Flow 3: Mobile Exploration
 * 1. User on mobile sees dashboard
 * 2. Main content visible
 * 3. Side panel hidden (menu button visible)
 * 4. User clicks menu button
 * 5. Side panel slides in from right
 * 6. Reads critique and recommendations
 * 7. Clicks menu again to close
 */

/**
 * User Flow 4: Reset and Start Over
 * 1. User on dashboard
 * 2. Clicks "Reset" button
 * 3. Smooth transition back to form
 * 4. Form data is preserved (or can be cleared)
 * 5. User can edit and click "Run Crash-Test" again
 */

// ============================================================================
// ACCESSIBILITY FEATURES
// ============================================================================

/**
 * Keyboard Navigation:
 * - Tab through form fields and buttons
 * - Enter submits form or activates button
 * - Esc could potentially close expanded rows or return to form
 * - Arrow keys could navigate table rows (enhancement)
 */

/**
 * Screen Reader Support:
 * - Semantic HTML (h1, h2, p, button, table)
 * - ARIA labels on icon-only buttons
 * - Table headers marked with <th>
 * - Form labels associated with inputs via <label>
 * - Color not the only indicator (icons + text used)
 */

/**
 * Color Contrast:
 * - All text meets WCAG AA standard (4.5:1 minimum)
 * - Status indicators use both color and icon
 * - Focus states clearly visible (ring-indigo-500)
 */

// ============================================================================
// MOCK DATA STRUCTURE
// ============================================================================

/**
 * Complete mock dataset structure
 */
const mockDataset = {
  formData: {
    coreIdea: 'An Uber for pet grooming',
    targetAudience: 'Busy urban professionals in high-rises',
    biggestAssumption: 'People are comfortable letting a stranger groom their dog inside their apartment'
  },
  assumptions: [
    {
      id: 'market-1',
      assumption: 'Target professionals will pay premium for convenience',
      category: 'Market',
      status: 'Testing',
      confidence: 'High',
      microSteps: [
        'Day 1-3: Create cold outreach script for LinkedIn',
        'Day 4-7: Interview 5 target professionals about willingness to pay',
        'Day 8-10: Conduct pricing sensitivity analysis'
      ]
    },
    // ... more assumptions
  ],
  simulationResults: {
    totalPersonasSimulated: 1000,
    criticalRisks: 3,
    findings: [
      {
        percentage: 42,
        concern: 'flagged safety concerns regarding inside-home access',
        severity: 'critical'
      },
      {
        percentage: 38,
        concern: 'questioned pet groomer vetting process',
        severity: 'warning'
      }
    ]
  }
};

// ============================================================================
// END OF VARIANTS & STORIES
// ============================================================================

export {
  filledFormData,
  ideaClarityCardProps,
  currentSprintCardProps,
  assumptionTrackerCardProps,
  tableRowNormal,
  tableRowExpanded,
  badgeVariants,
  sidePanelDesktop,
  sidePanelMobile,
  statusColors,
  categoryColors,
  confidenceColors,
  mockDataset
};
