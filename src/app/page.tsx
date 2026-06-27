"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Where to next? ✈",
  "I found 847 flights!",
  "Best deal: Tokyo $899 ✈",
  "Let me plan your trip!",
];

const TRENDING = [
  { city: "Tokyo", country: "Japan", price: "$899", emoji: "🗼" },
  { city: "Barcelona", country: "Spain", price: "$649", emoji: "🏖" },
  { city: "Bali", country: "Indonesia", price: "$749", emoji: "🌴" },
];

const TRAVEL_STYLES = ["Backpacker", "Couples", "Family", "Solo"];

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
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.32em] text-cyan-200">
                AI Travel Agent
              </p>
              <h1 className="max-w-full text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Build a trip that fits the way you travel.
              </h1>
              <p className="mt-6 max-w-full text-lg leading-8 text-slate-200 sm:max-w-xl">
                Enter a destination, dates, and budget — get ranked trip options with flights, hotels, and a day-by-day plan.
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

          {/* Trending destinations */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-slate-400">
              Trending now
            </p>
            <div className="grid gap-3 sm:grid-cols-3 max-w-[calc(100vw-40px)] sm:max-w-2xl">
              {TRENDING.map(({ city, country, price, emoji }) => (
                <a
                  key={city}
                  href={`/plan?destination=${encodeURIComponent(city)}&dates=Sep+12+-+Sep+18&budget=%243%2C500&travelStyle=${encodeURIComponent(travelStyle)}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  <span className="text-2xl" aria-hidden="true">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{city}</p>
                    <p className="text-xs text-slate-400">{country}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-cyan-300">{price}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
