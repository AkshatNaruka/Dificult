# Dificult - Typing Game

A modern, gamified typing test application built with Next.js and deployed on Vercel.

## 🎯 Features

- **Multiple Game Modes**: Story Mode, Battle Royale, Daily Challenge, and Type Racing
- **Real-time Statistics**: WPM, Accuracy, Combo Multipliers, and Performance Tracking
- **Achievement System**: Unlock achievements as you improve your typing skills
- **Level Progression**: Gain XP and level up through consistent practice
- **Global Leaderboard**: See how you rank against other players
- **Multiplayer Racing**: Real-time typing races with other players
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🏗️ Development Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build
```

## 💳 Monetization Setup

To enable subscriptions, one-time cosmetics, and entitlements, apply the Supabase schema in `supabase/schema.sql`
and configure the following environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY`
- `NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY`
- `NEXT_PUBLIC_STRIPE_PRICE_THEME_TOKYO_NIGHT`
- `NEXT_PUBLIC_STRIPE_PRICE_THEME_DRACULA`
- `NEXT_PUBLIC_STRIPE_PRICE_THEME_OCEAN`
- `NEXT_PUBLIC_STRIPE_PRICE_SOUND_CLICKS`
- `NEXT_PUBLIC_STRIPE_PRICE_BORDER_PRISM`
- `NEXT_PUBLIC_STRIPE_PRICE_CARET_NEON`
- `NEXT_PUBLIC_ADSENSE_CLIENT` (optional)
- `NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM` (optional)
- `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` (optional)

## 📁 Project Structure

```
├── src/                # Next.js application source
│   ├── app/            # App router pages
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand state management
│   └── utils/          # Utilities
├── server.js           # Multiplayer Socket.IO server
├── public/             # Static assets
└── package.json        # Dependencies
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

- **Framework**: Next.js 15.4.6
- **UI**: React 19.1.0 with Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Multiplayer**: Socket.IO
- **Deployment**: Vercel

## 🚀 Deployment

The application is deployed on Vercel. Push to the main branch to trigger automatic deployment.

## 📈 Performance Features

- **Real-time WPM calculation**
- **Character-by-character accuracy tracking**
- **Dynamic combo multipliers**
- **Smooth animations and feedback**

## 🎨 Themes & Customization

- Dark theme with gradient backgrounds
- Customizable settings (theme toggle, sound toggle)
- Smooth animations and hover effects
- Modern glassmorphism design elements

---

Built with ❤️ for typing enthusiasts everywhere!
