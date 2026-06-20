# Osstart MVP Dashboard

A beautiful, fully interactive Next.js component for a startup incubator platform's core MVP dashboard. The design follows a clean, premium SaaS aesthetic (similar to Linear/Notion) with a humanized color scheme.

## 🎨 Design System

### Color Palette
- **Canvas Background**: #F9FAFB (soft off-white)
- **Card Surfaces**: #FFFFFF (pure white)
- **Borders**: #E5E7EB (light gray)
- **Primary/Brand**: #4F46E5 (Indigo)
- **Success**: #059669 (Emerald Green)
- **Warning**: #D97706 (Amber)
- **Danger**: #DC2626 (Rose Red)

### Typography
- **Font Family**: Inter or Plus Jakarta Sans
- **Hierarchy**: Tracking-tight headings, text-slate-900 for primary text, text-slate-500 for captions

## 📦 Features

### 1. **INPUT STATE** - 3-Field Onboarding Form
When no project is loaded, users see an elegant onboarding card with:
- **"The Core Idea"** (Textarea): Main business concept
- **"Target Audience"** (Input): Primary customer segment
- **"The Biggest Assumption"** (Textarea): Riskiest bet in the model
- **"Run Crash-Test"** button: High-visibility CTA that transitions to dashboard

### 2. **DASHBOARD VIEW** - Interactive Analytics & Execution Matrix

#### Analytics Row (3 Cards)
- **Idea Clarity Score**: Circular progress gauge (0-100%) based on assumptions validated
- **Current Sprint**: Immediate action items for the team
- **Assumption Tracker**: Fractional display showing validated assumptions (e.g., "1 of 3 Validated")

#### The Horizon Scanner (Interactive Table)
30-Day execution matrix with columns:
- **Assumption / Task**: Core business assumption or task
- **Category**: Market, Financial, or Tech
- **Status**: Unverified, Testing, or Validated
- **Confidence Level**: High, Medium, or Low
- **Actions**: Expandable row toggle

**Row Expansion**: Clicking a row reveals detailed 30-day micro-steps:
- Day 1-10, Day 11-20, Day 21-30 breakdowns
- Numbered action items with smooth animations
- Beautiful nested styling within expandable sections

### 3. **THE FRIENDLY CRITIC** - Side Panel

A beautiful markdown/chat-style container featuring:

#### Simulation Log
- Terminal-style widget showing simulated crash-test execution
- Humanized visual feedback (animated status indicator)
- Shows simulation of 1,000 persona interactions

#### Key Findings
- Color-coded risk cards (Red for critical, Amber for warnings, Blue for opportunities)
- Percentage-based metrics from simulated personas
- Actionable, concise messaging

#### AI Consultancy Brief
- Prioritized design remediations
- Addresses top concerns from simulation
- Provides business strategy recommendations

#### Export Report CTA
- Button to export full analysis report

## 🚀 Usage

### Installation

1. **Ensure you have Next.js and Tailwind CSS installed**:
```bash
npm install next react react-dom tailwindcss
npm install lucide-react
```

2. **Add Tailwind CSS configuration** (if not already done):
```bash
npx tailwindcss init -p
```

3. **Update your `tailwind.config.js`**:
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Basic Setup

1. **Import the component** in your Next.js page:

```tsx
import OsstartDashboard from '@/components/OsstartDashboard';

export default function DashboardPage() {
  return <OsstartDashboard />;
}
```

2. **Ensure Lucide React icons are available**:
```bash
npm install lucide-react
```

## 🎯 Component Props & State

The component uses React hooks for full state management:

```typescript
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
```

### Internal State Management

- **`formData`**: User input for the three form fields
- **`isDashboardActive`**: Boolean to toggle between form and dashboard views
- **`expandedRows`**: Array of row IDs that are currently expanded
- **`showSidePanel`**: Toggle side panel visibility (default: true)
- **`mobileMenuOpen`**: Mobile-responsive menu state

## 📱 Responsive Design

- **Mobile-first approach** using Tailwind breakpoints
- **Hidden side panel on mobile**, accessible via menu button
- **Responsive grid layouts** (1-column on mobile, 3-column on desktop)
- **Touch-friendly interactive elements** with proper spacing

## ✨ Interactive Features

1. **Form Submission**: Click "Run Crash-Test" to populate dashboard with data
2. **Row Expansion**: Click table rows to reveal 30-day micro-steps
3. **Reset Button**: Return to input form state
4. **Mobile Menu Toggle**: Show/hide side panel on smaller screens
5. **Hover States**: Subtle visual feedback on interactive elements

## 🎨 Customization

### Modify Mock Data

The component includes pre-populated data for a pet-grooming example. To customize:

1. Edit the `assumptions` array in the component
2. Update `formData` initial values
3. Modify analytics calculations based on your metrics

### Theme Colors

Tailwind utilities make it easy to adjust colors:
- Change `bg-indigo-*` to your primary color
- Modify `bg-emerald-*` for success states
- Adjust badge colors in `getStatusColor()` function

### Typography

Update the following classNames for different text sizes:
- `text-4xl` → heading size
- `text-sm` → body text
- `text-xs` → captions

## 🔧 Advanced Customization

### Adding Real Data

Replace mock data with API calls:

```tsx
useEffect(() => {
  const fetchAssumptions = async () => {
    const response = await fetch('/api/assumptions');
    setAssumptions(await response.json());
  };
  if (isDashboardActive) fetchAssumptions();
}, [isDashboardActive]);
```

### Integrating with Backend

Connect the "Export Report" button to your API:

```tsx
const handleExportReport = async () => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  // Handle download or success state
};
```

### Animation Enhancements

Add Framer Motion for advanced animations:

```tsx
npm install framer-motion
```

Then wrap components with `motion.div` for smooth transitions.

## 📊 Metrics & Analytics

### Idea Clarity Score
Calculated as: `(validatedCount / totalCount) * 100`

### Progress Indicators
- **Linear progress bar**: Shows overall clarity score
- **Status badges**: Color-coded assumption status
- **Confidence indicators**: Visual hierarchy by confidence level

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and add tests for new features.

---

Built with ❤️ for Osstart startup incubator platform.
