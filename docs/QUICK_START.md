# Quick Start Guide - Osstart Dashboard

## 🚀 Getting Started in 5 Minutes

### Step 1: Clone and Install

```bash
cd osstart
npm install
```

### Step 2: Add Lucide Icons

```bash
npm install lucide-react
```

### Step 3: Set Up Tailwind CSS

If starting fresh, initialize Tailwind:

```bash
npx tailwindcss init -p
```

Then replace your `tailwind.config.ts` with the provided one.

### Step 4: Import Component

In your Next.js page (e.g., `app/dashboard/page.tsx`):

```tsx
import OsstartDashboard from '@/components/OsstartDashboard';

export default function DashboardPage() {
  return <OsstartDashboard />;
}
```

### Step 5: Add Global Styles

Add the `globals.css` to your layout:

```tsx
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Step 6: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` in your browser.

---

## 📋 File Structure

```
osstart/
├── OsstartDashboard.tsx      # Main component
├── globals.css                # Global Tailwind styles
├── tailwind.config.ts         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies
├── README.md                  # Full documentation
├── DESIGN_DOCS.md            # Design system details
├── QUICK_START.md            # This file
└── example-page.tsx          # Example usage
```

---

## 🎯 Key Features at a Glance

### ✅ Form Input State
- 3-field form for startup ideas
- Beautiful, minimal design
- Smooth transition to dashboard

### ✅ Interactive Dashboard
- Analytics cards with real metrics
- Expandable table with micro-steps
- Color-coded status indicators

### ✅ Side Panel ("The Friendly Critic")
- Simulated feedback from 1,000 personas
- AI-generated recommendations
- Export functionality

### ✅ Fully Responsive
- Mobile-first design
- Touch-friendly controls
- Hidden side panel on mobile (toggle via menu)

### ✅ Zero Dependencies (Beyond React)
- Uses Lucide React for icons
- Styled entirely with Tailwind CSS
- No UI component library needed

---

## 🎨 Customizing the Design

### Change Primary Color

Edit `tailwind.config.ts`:
```typescript
indigo: {
  600: '#YOUR_COLOR_HERE'  // Change to your brand color
}
```

### Modify Form Fields

Edit `OsstartDashboard.tsx`, the `FormData` interface and form section.

### Update Mock Data

Replace the `assumptions` array with your own data:
```typescript
const assumptions: AssumptionRow[] = [
  {
    id: 'your-id',
    assumption: 'Your assumption here',
    category: 'Market', // Market | Financial | Tech
    status: 'Unverified', // Unverified | Testing | Validated
    confidence: 'High', // High | Medium | Low
    microSteps: [
      'Day 1-5: Your action item',
      'Day 6-10: Your next action',
    ]
  }
];
```

---

## 🧪 Testing the Component

### Test the Form Input
1. Fill in all three fields
2. Click "Run Crash-Test"
3. Dashboard should appear with populated data

### Test Table Expansion
1. Click any row in "The Horizon Scanner" table
2. Row should expand to show micro-steps
3. Click again to collapse

### Test Mobile Responsiveness
1. Open DevTools (F12 in Chrome)
2. Toggle device toolbar
3. Side panel should hide (menu button appears)
4. Click menu button to show/hide side panel

### Test Reset
1. Click "Reset" button in header
2. Should return to form input state
3. Form values should be preserved (can be reset if needed)

---

## 💡 Tips & Tricks

### Add Real Data
Replace mock assumptions with API calls:
```typescript
useEffect(() => {
  const fetchAssumptions = async () => {
    const response = await fetch('/api/assumptions');
    const data = await response.json();
    setAssumptions(data);
  };
  if (isDashboardActive) fetchAssumptions();
}, [isDashboardActive]);
```

### Add Animation Library
Install Framer Motion for advanced animations:
```bash
npm install framer-motion
```

Then wrap elements with `motion.div`:
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* Your content */}
</motion.div>
```

### Add Keyboard Shortcuts
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isDashboardActive) {
      handleReset();
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [isDashboardActive]);
```

### Export Report
Add backend integration:
```typescript
const handleExportReport = async () => {
  const response = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formData, assumptions })
  });
  const blob = await response.blob();
  // Trigger download
};
```

---

## 🐛 Troubleshooting

### Styles Not Applying?
1. Ensure `globals.css` is imported in your layout
2. Check `tailwind.config.ts` has correct file paths
3. Clear `.next` build cache: `rm -rf .next && npm run dev`

### Icons Not Showing?
1. Install Lucide React: `npm install lucide-react`
2. Check import statement: `import { ChevronDown } from 'lucide-react'`

### Side Panel Not Working on Mobile?
1. Check `mobileMenuOpen` state is properly toggled
2. Verify `lg:` breakpoint classes are applied correctly
3. Test with actual mobile device or Chrome DevTools

### Form Data Not Persisting?
The component uses `useState`, so data resets on page reload. For persistence:
```typescript
// Save to localStorage
localStorage.setItem('formData', JSON.stringify(formData));

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('formData');
  if (saved) setFormData(JSON.parse(saved));
}, []);
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/icons)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)

---

## 🆘 Need Help?

1. Check the **README.md** for detailed documentation
2. Review **DESIGN_DOCS.md** for design system details
3. Examine **OsstartDashboard.tsx** component code directly
4. Refer to inline code comments for implementation details

---

## ✨ What's Next?

After setup, consider:

1. **Connect Backend**: Add API integration for real data
2. **User Auth**: Add authentication/authorization
3. **Data Persistence**: Save assumptions to database
4. **Real Simulations**: Build persona simulation engine
5. **Export Reports**: Generate PDF reports
6. **Collaboration**: Implement team features
7. **Mobile App**: Create React Native version

---

Happy building! 🚀

Questions? Check the docs or dive into the component code!
