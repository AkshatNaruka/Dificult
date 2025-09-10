# TypeWarrior - Typing Game

A modern, gamified typing test application with both Next.js and standalone HTML versions.

## 🎯 Features

- **Multiple Game Modes**: Story Mode, Battle Royale, Daily Challenge, and Type Racing
- **Real-time Statistics**: WPM, Accuracy, Combo Multipliers, and Performance Tracking
- **Achievement System**: Unlock achievements as you improve your typing skills
- **Level Progression**: Gain XP and level up through consistent practice
- **Global Leaderboard**: See how you rank against other players
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Local Storage**: Your progress is automatically saved

## 🚀 Live Demo

The standalone HTML version is automatically deployed to GitHub Pages: [https://akshatnaruka.github.io/Dificult](https://akshatnaruka.github.io/Dificult)

## 🏗️ Development Setup

### Next.js Version (Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Standalone HTML Version

Simply open `index.html` in your browser - no build process required!

For local development with a web server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```

## 📁 Project Structure

```
├── index.html          # Standalone HTML version (main deployment)
├── src/                # Next.js application source
├── backup/             # Original HTML prototypes
├── .github/workflows/  # GitHub Actions for deployment
└── package.json        # Next.js dependencies
```

## 🎮 How to Play

1. **Choose Your Battle**: Select from Story Mode, Battle Royale, Daily Challenge, or Type Racing
2. **Start Typing**: Click "Start Test" and begin typing the displayed text
3. **Track Progress**: Monitor your WPM, accuracy, and combo multipliers in real-time
4. **Earn Achievements**: Unlock achievements by reaching specific milestones
5. **Level Up**: Gain XP and advance through levels as you improve

## 🏆 Achievements

- **Speed Demon**: Type 60+ WPM
- **Accuracy Ace**: Achieve 98%+ accuracy
- **Combo Master**: Reach 10x combo multiplier

## 🔧 Technology Stack

### Next.js Version
- **Framework**: Next.js 15.4.6
- **UI**: React 19.1.0 with Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **UI Components**: Radix UI

### Standalone HTML Version
- **Vanilla HTML/CSS/JavaScript**
- **No dependencies or build process**
- **Local storage for persistence**
- **Responsive CSS Grid and Flexbox**

## 🚀 Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

The workflow:
1. Tests the Next.js build
2. Deploys the standalone HTML version to GitHub Pages
3. Makes the game available at the GitHub Pages URL

## 📈 Performance Features

- **Real-time WPM calculation**
- **Character-by-character accuracy tracking**
- **Dynamic combo multipliers**
- **Progress persistence with localStorage**
- **Responsive animations and feedback**

## 🎨 Themes & Customization

- Dark theme with gradient backgrounds
- Customizable settings (theme toggle, sound toggle)
- Smooth animations and hover effects
- Modern glassmorphism design elements

---

Built with ❤️ for typing enthusiasts everywhere!
