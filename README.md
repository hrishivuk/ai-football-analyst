# AI Match Analyst - Tactical Assistant

AI-powered football tactical analysis and match preparation tool for coaches.

## Features

- **Tactical Analysis** — AI generates formation suggestions, pressing intensity, danger areas, and substitution strategies based on your match intel
- **Team Talk Generator** — Dramatic pre-match motivational speeches streamed in real-time
- **Tactical Board** — Visual formation display showing suggested player positions
- **Responsive UI** — Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **AI:** Groq Cloud (Llama 3.3 70B)
- **Streaming:** Server-sent streaming for real-time team talk generation
- **Deploy:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Add your Groq API key to .env.local
# GROQ_API_KEY=gsk_your-key-here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add `GROQ_API_KEY` environment variable
4. Deploy

## Usage

1. Fill in match intelligence (opponent, formation, weaknesses, etc.)
2. Click "Generate Tactical Analysis"
3. Review AI-generated tactics and formation
4. Switch to "Team Talk" tab for a motivational pre-match speech

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # Tactical analysis endpoint
│   │   └── team-talk/route.ts  # Streaming team talk endpoint
│   ├── layout.tsx
│   ├── page.tsx                # Main page (client component)
│   └── globals.css
├── components/
│   ├── TacticalForm.tsx        # Input form
│   ├── TacticalBoard.tsx       # Football pitch visualization
│   ├── AnalysisDisplay.tsx     # Analysis results
│   └── TeamTalk.tsx            # Team talk generator
└── types.ts                    # TypeScript types & formation data
```
