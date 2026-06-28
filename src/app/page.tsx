"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Where to next? ✈",
  "I found 847 flights!",
  "Best deal: Tokyo $899 ✈",
  "Let me plan your trip!",
];

const TRENDING = [
  {
    city: "Tokyo", country: "Japan", price: "$899", emoji: "🗼",
    photo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Barcelona", country: "Spain", price: "$649", emoji: "🏖",
    photo: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80",
  },
  {
    city: "Bali", country: "Indonesia", price: "$749", emoji: "🌴",
    photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  },
];

const TRAVEL_STYLES = ["Backpacker", "Couples", "Family", "Solo"];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Tell us where and when",
    desc: "Enter destination, travel dates, your total budget, and travel style. Takes 20 seconds.",
  },
  {
    n: "02",
    title: "AI builds ranked options",
    desc: "Groq AI generates 3 ranked trip options with real hotel chains, realistic flight costs, and a day-by-day itinerary.",
  },
  {
    n: "03",
    title: "Book what fits",
    desc: "Compare the plans, then jump to Skyscanner to book your actual flights and hotels at real prices.",
  },
];

const WHY_US = [
  { icon: "🏆", title: "Ranked, not just listed", desc: "Every option is scored for cost efficiency, weather, reviews, and flexibility — so you see the tradeoffs at a glance." },
  { icon: "🗓", title: "Day-by-day itinerary", desc: "Up to 3 activities per day with time, duration, cost, and a local tip. Not a generic bucket list — a real plan." },
  { icon: "💸", title: "Real price anchors", desc: "Flight and hotel costs are pulled from real-world ranges for your destination and season. No made-up numbers." },
];

function Robot({
  message,
  thinking,
}: {
  message: string;
  thinking: boolean;
}) {
  const eyeAnim = thinking
    ? "eye-think 0.4s ease-in-out infinite"
    : "blink 4s ease-in-out infinite";

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Speech bubble */}
      <div className="relative rounded-2xl border border-cyan-400/40 bg-slate-900/90 px-4 py-2.5 text-sm font-medium text-cyan-100 backdrop-blur min-w-[170px] text-center shadow-lg shadow-cyan-900/20">
        {message}
        <div
          className="absolute -bottom-[9px] left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "9px solid rgba(34,211,238,0.4)",
          }}
        />
      </div>

      {/* Robot body — floats; smaller on mobile */}
      <div
        className="flex flex-col items-center scale-[0.72] sm:scale-100 origin-top"
        style={{ animation: "robot-float 3s ease-in-out infinite" }}
      >
        {/* Antenna */}
        <div
          className="flex flex-col items-center"
          style={{ animation: "antenna-bob 2.2s ease-in-out infinite", transformOrigin: "bottom center" }}
        >
          <div
            className="h-3.5 w-3.5 rounded-full bg-cyan-300"
            style={{ boxShadow: "0 0 10px #22d3ee, 0 0 20px #22d3ee60", animation: "eye-glow 2s ease-in-out infinite" }}
          />
          <div className="h-5 w-1 rounded-sm bg-cyan-700" />
        </div>

        {/* Head */}
        <div
          className="relative flex h-14 w-[68px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-cyan-500 bg-slate-800"
          style={{ boxShadow: "0 0 12px rgba(34,211,238,0.25)" }}
        >
          <div className="flex gap-3.5">
            <div
              className="h-3 w-3 rounded-full bg-cyan-300"
              style={{ boxShadow: "0 0 8px #22d3ee", animation: `${eyeAnim}` }}
            />
            <div
              className="h-3 w-3 rounded-full bg-cyan-300"
              style={{ boxShadow: "0 0 8px #22d3ee", animation: `${eyeAnim.replace("infinite", "infinite 0.2s")}` }}
            />
          </div>
          <div className="h-1 w-7 rounded-full bg-cyan-700/70" />
        </div>

        {/* Body */}
        <div className="relative mt-1 flex h-16 w-20 items-center justify-center rounded-2xl border-2 border-blue-600 bg-slate-800">
          <div
            className="absolute -left-4 top-3 h-2 w-5 rounded-full border-2 border-blue-500 bg-slate-700"
            style={{ transformOrigin: "right center", animation: "arm-wave 3s ease-in-out infinite" }}
          />
          <div
            className="absolute -right-4 top-3 h-2 w-5 rounded-full border-2 border-blue-500 bg-slate-700"
            style={{ transformOrigin: "left center", animation: "arm-wave 3s ease-in-out infinite 1.5s" }}
          />
          <div
            className="h-5 w-5 rounded-full border border-cyan-500/50 bg-cyan-900/50"
            style={{ boxShadow: "0 0 12px #0e7490, inset 0 0 6px #22d3ee40", animation: "chest-pulse 2s ease-in-out infinite" }}
          />
        </div>

        {/* Legs */}
        <div className="mt-1 flex gap-3">
          <div className="h-5 w-4 rounded-b-xl border-2 border-blue-700 bg-slate-700" />
          <div className="h-5 w-4 rounded-b-xl border-2 border-blue-700 bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dest, setDest] = useState("Tokyo");
  const [travelStyle, setTravelStyle] = useState("Couples");
  const [userTyped, setUserTyped] = useState(false);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const robotMessage = thinking
    ? "Searching for the best deals..."
    : userTyped && dest.length >= 2
    ? `Oh! I know ${dest}! Great choice.`
    : MESSAGES[msgIdx];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <style>{`
        @keyframes robot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 88%, 100% { transform: scaleY(1); }
          92% { transform: scaleY(0.07); }
        }
        @keyframes eye-think {
          0%, 100% { opacity: 1; box-shadow: 0 0 14px #22d3ee; }
          50% { opacity: 0.15; box-shadow: 0 0 2px #22d3ee; }
        }
        @keyframes antenna-bob {
          0%, 100% { transform: rotate(-7deg); }
          50% { transform: rotate(7deg); }
        }
        @keyframes arm-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes chest-pulse {
          0%, 100% { box-shadow: 0 0 12px #0e7490, inset 0 0 6px #22d3ee40; }
          50% { box-shadow: 0 0 22px #0891b2, inset 0 0 10px #22d3ee70; }
        }
        @keyframes eye-glow {
          0%, 100% { box-shadow: 0 0 10px #22d3ee, 0 0 20px #22d3ee60; }
          50% { box-shadow: 0 0 18px #22d3ee, 0 0 36px #22d3ee80; }
        }
      `}</style>

      <section
        className="relative flex min-h-screen min-w-0 items-center overflow-hidden px-5 py-12 sm:px-10 lg:px-16"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,6,23,.96), rgba(2,6,23,.80), rgba(2,6,23,.40)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 w-full min-w-0 max-w-[calc(100vw-40px)] sm:max-w-6xl">
          {/* Hero row: text + robot */}
          <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-14">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="text-2xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.04em" }}>Wayfarer</span>
                <span className="rounded-full bg-cyan-400/15 border border-cyan-400/25 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">AI Travel Agent</span>
              </div>
              <h1 className="max-w-full text-4xl font-black leading-[1.0] tracking-tight sm:text-6xl" style={{ letterSpacing: "-0.04em" }}>
                Your next trip.<br />
                <span className="text-cyan-300">Planned by AI.</span><br />
                Booked by you.
              </h1>
              <p className="mt-5 max-w-full text-base leading-7 text-slate-300/60 sm:max-w-xl sm:text-lg">
                Enter a destination, dates, and budget. Get 3 ranked options with real hotel chains, seasonal flight costs, and a day-by-day itinerary — in seconds.
              </p>
            </div>

            <div className="flex justify-start lg:justify-end lg:pt-4">
              <Robot message={robotMessage} thinking={thinking} />
            </div>
          </div>

          {/* Search form */}
          <form
            action="/plan"
            onSubmit={() => setThinking(true)}
            className="grid w-full max-w-[calc(100vw-40px)] min-w-0 gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur sm:max-w-6xl md:grid-cols-[1.35fr_1fr_1fr_1fr_auto]"
          >
            <label className="block min-w-0">
              <span className="sr-only">Destination</span>
              <input
                name="destination"
                required
                placeholder="Destination"
                value={dest}
                onChange={(e) => {
                  setDest(e.target.value);
                  setUserTyped(true);
                }}
                className="h-14 w-full min-w-0 rounded-xl border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
              />
            </label>
            <label className="block min-w-0">
              <span className="sr-only">Start date</span>
              <input
                name="startDate"
                type="date"
                defaultValue="2025-09-12"
                className="h-14 w-full min-w-0 rounded-xl border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition focus:border-cyan-300 [color-scheme:dark]"
              />
            </label>
            <label className="block min-w-0">
              <span className="sr-only">Budget</span>
              <input
                name="budget"
                required
                placeholder="Budget (e.g. $3,500)"
                defaultValue="$3,500"
                className="h-14 w-full min-w-0 rounded-xl border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
              />
            </label>
            <label className="block min-w-0">
              <span className="sr-only">Travel style</span>
              <select
                name="travelStyle"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="h-14 w-full min-w-0 rounded-xl border border-white/10 bg-black/35 px-4 text-base text-white outline-none transition focus:border-cyan-300 [color-scheme:dark]"
              >
                {TRAVEL_STYLES.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="h-14 rounded-xl bg-cyan-300 px-6 font-semibold text-slate-950 transition hover:bg-cyan-200 active:scale-95"
            >
              Plan My Trip
            </button>
          </form>

          {/* Trending destinations — photo cards */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
              Trending now
            </p>
            <div className="grid gap-3 sm:grid-cols-3 max-w-[calc(100vw-40px)] sm:max-w-2xl">
              {TRENDING.map(({ city, country, price, photo }) => (
                <a
                  key={city}
                  href={`/plan?destination=${encodeURIComponent(city)}&dates=Sep+12+-+Sep+18&budget=%243%2C500&travelStyle=${encodeURIComponent(travelStyle)}`}
                  className="group relative overflow-hidden rounded-xl h-28 flex items-end backdrop-blur transition"
                >
                  {/* Background photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={city}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {/* Content */}
                  <div className="relative z-10 flex w-full items-end justify-between p-4">
                    <div>
                      <p className="font-bold text-white leading-none">{city}</p>
                      <p className="text-xs text-white/55 mt-0.5">{country}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-cyan-300 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {price}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-24 sm:px-10 lg:px-16" style={{ background: "#020617" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400/60 mb-3">How it works</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Trip planned in 3 steps.
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
              No travel agent, no endless tabs. Just tell the AI what you want.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ n, title, desc }) => (
              <div
                key={n}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
                style={{ borderTop: "1px solid rgba(34,211,238,0.25)" }}
              >
                <span className="block text-5xl font-black text-white/[0.06] mb-5 leading-none">{n}</span>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why use it */}
      <section className="px-5 pb-24 sm:px-10 lg:px-16" style={{ background: "#020617" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {WHY_US.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 rounded-2xl border border-cyan-400/15 bg-cyan-950/20 px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Ready to plan your next trip?</h3>
              <p className="text-sm text-slate-400 mt-1">Takes 30 seconds. Free, no account needed.</p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 active:scale-95"
            >
              Plan my trip →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
