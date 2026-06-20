# 🚀 OSSTART DASHBOARD - STARTUP INSTRUCTIONS

## ⚡ QUICKEST WAY (Copy & Paste One Line)

```bash
cd /home/mohan/Desktop/OSSTART/osstart && npm run dev
```

Then open: **http://localhost:3000**

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Your Terminal

- **Mac/Linux**: Open Terminal
- **Windows**: Open Command Prompt or PowerShell

### Step 2: Navigate to Project

```bash
cd /home/mohan/Desktop/OSSTART/osstart
```

### Step 3: Install Dependencies (First Time Only)

```bash
npm install
```

This installs:
- Next.js
- React
- Tailwind CSS
- Lucide Icons
- All other dependencies

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Open in Browser

Visit: **http://localhost:3000**

You should see the beautiful Osstart dashboard! 🎉

---

## 🎯 WHAT HAPPENS WHEN YOU RUN `npm run dev`

You'll see output like:

```
▲ Next.js 14.2.35
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1234ms
✓ Compiled / in 567ms (495 modules)
```

This means:
- ✅ Dev server is running
- ✅ You can access http://localhost:3000
- ✅ Changes auto-reload

---

## 🎨 WHAT YOU'LL SEE

### First Screen
- Beautiful onboarding form
- 3 input fields for your startup idea
- "Run Crash-Test" button

### After Clicking Run Crash-Test
- Analytics dashboard with 3 metric cards
- Interactive table with expandable rows
- Side panel with AI feedback
- All fully responsive

---

## ⏹️ HOW TO STOP THE SERVER

Press: **Ctrl + C**

You'll get your terminal prompt back. The server stops.

---

## 🔄 HOW TO RESTART

Just run again:

```bash
npm run dev
```

---

## 📄 OTHER USEFUL COMMANDS

```bash
# Build for production
npm run build

# Run production build locally
npm start

# Check for code quality issues
npm run lint

# Check TypeScript errors
npm run type-check
```

---

## 🆘 TROUBLESHOOTING

### Port 3000 is Already in Use

If you get an error like "Port 3000 is already in use", try:

```bash
npm run dev -- -p 3001
```

Then visit: http://localhost:3001

### Dependencies Not Installed

Make sure to run:

```bash
npm install
```

### Node/npm Not Found

Install Node.js from: https://nodejs.org/

Check installation:
```bash
node --version
npm --version
```

### Errors in Terminal

Check the error message. Usually it says:
- Missing dependency → Run `npm install`
- Syntax error → Check the file
- Port in use → Use different port with `-p` flag

---

## ✨ FEATURES TO TRY

1. **Fill the Form**
   - Enter your startup idea
   - Add target audience
   - Describe your biggest assumption

2. **Click "Run Crash-Test"**
   - See analytics dashboard appear
   - Watch smooth transitions

3. **Expand Table Rows**
   - Click any row in "The Horizon Scanner"
   - See 30-day micro-steps
   - Click again to collapse

4. **Read The Friendly Critic**
   - Scroll down to see side panel
   - Read AI recommendations
   - See simulated feedback

5. **Test Responsiveness**
   - Resize your browser
   - See mobile-responsive design
   - Try on actual mobile device

6. **Click Reset**
   - Return to form
   - Start over with new idea

---

## 📱 MOBILE TESTING

### In Browser DevTools:
1. Open DevTools (F12 or Cmd+Option+I)
2. Click device toggle (mobile icon)
3. See responsive design in action

### On Mobile Device:
1. Find your computer's IP address
2. Visit: http://[YOUR_IP]:3000
3. See dashboard on phone

---

## 🎓 NEXT STEPS

After starting the app:

1. **Customize Colors**
   - Edit `tailwind.config.ts`
   - Change indigo to your brand color

2. **Modify Mock Data**
   - Edit `components/OsstartDashboard.tsx`
   - Update the `assumptions` array

3. **Add Backend Integration**
   - Create API routes in `app/api/`
   - Connect to your database

4. **Deploy**
   - Build: `npm run build`
   - Deploy to Vercel, Netlify, or your server

---

## 📞 NEED HELP?

Check these files in your project:
- **README.md** - Complete documentation
- **DESIGN_DOCS.md** - Design system
- **SETUP_COMPLETE.md** - Full setup details
- **ALL_CODE.md** - All code files

---

## ✅ SUMMARY

To start your Osstart dashboard:

```bash
cd /home/mohan/Desktop/OSSTART/osstart
npm run dev
```

Visit: http://localhost:3000

That's it! Enjoy! 🚀

---

**Created**: June 20, 2026
**Status**: Ready to Use ✅
