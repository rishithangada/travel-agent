# AI Travel Agent

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss) ![Anthropic](https://img.shields.io/badge/Anthropic-Claude-orange?logo=anthropic)

Part of the **SPIRIT Labs** portfolio — AI-powered products by [Rishi Thangada](https://github.com/rishithangada).

---

## What It Does

AI Travel Agent turns your travel preferences into a ranked shortlist of fully-planned trips. Enter where you want to go, your dates, and a rough budget — the app returns multiple itinerary options scored across cost, weather, reviews, and booking flexibility, presented best-to-worst so you can compare at a glance.

An animated robot mascot guides you through the flow and surfaces key trade-offs between options.

---

## Features

- **Ranked itinerary cards** — options presented with gold / silver / bronze rankings; best match at the top
- **Multi-factor scoring** — each trip scored on cost, weather, user reviews, and booking flexibility with visible bar charts per factor
- **Animated robot assistant** — mascot walks you through inputs and explains recommendations
- **Google Flights integration** — live fare data baked into cost scoring
- **Bio-profile personalization** — budget tier, travel style, and preferences shape every recommendation
- **Claude-powered planning** — full day-by-day itinerary generation via Anthropic API

---

## Setup

```bash
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## Screenshot

> _Add a screenshot here_

---

## Status

Active development. Part of the SPIRIT Labs product portfolio.
