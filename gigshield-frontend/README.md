# GigShield

AI-powered companion for gig workers — flags possible underpayment,
answers rights questions via an LLM chatbot, and summarizes weekly
earnings trends in plain language.

Built for Synaptrix 2026 (BMSCE IEEE Computer Society x Protocol).

## AI component used
- **LLM (Google Gemini `gemini-2.0-flash` via API)** for:
  - The rights-advisor chatbot (`src/utils/llm.js` → `askGigShieldBot`)
  - The AI-generated weekly insight summary (`generateWeeklyInsight`)
- A rule-based fair-rate benchmark model (`src/utils/fairness.js`) flags
  underpayment by comparing actual fare vs. an expected ₹/km rate.

## Tech stack
React + Vite, Recharts (dashboard chart), Gemini API.

## Setup
```bash
npm install
cp .env.example .env   # then paste your Gemini API key into .env
npm run dev
```

## Team
- [Add teammate names here]
