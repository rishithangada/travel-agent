"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Activity, TripOption } from "@/lib/planner";
import { getSessionId } from "@/lib/session";
import { saveTrip } from "@/lib/supabase";

const RANK_STYLES: Record<
  number,
  { border: string; bg: string; badge: string; label: string }
> = {
  1: {
    border: "border-yellow-400/70",
    bg: "bg-yellow-400/5",
    badge: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
    label: "🥇 Best Pick",
  },
  2: {
    border: "border-slate-400/60",
    bg: "bg-slate-400/5",
    badge: "bg-slate-400/20 text-slate-300 border-slate-400/40",
    label: "🥈 Runner-up",
  },
  3: {
    border: "border-amber-700/60",
    bg: "bg-amber-700/5",
    badge: "bg-amber-700/20 text-amber-400 border-amber-700/40",
    label: "🥉 Budget Pick",
  },
};

function ScoreBar({ score, color = "bg-cyan-400" }: { score: number; color?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700`}
        style={{ width: `${Math.max(2, score)}%` }}
      />
    </div>
  );
}

function FactorBars({ factors }: { factors: TripOption["factors"] }) {
  const colors = ["bg-cyan-400", "bg-sky-400", "bg-blue-400", "bg-indigo-400"];
  return (
    <div className="grid gap-2">
      {factors.map((f, i) => (
        <div key={f.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{f.label}</span>
            <span>{f.score}</span>
          </div>
          <ScoreBar score={f.score} color={colors[i % colors.length]} />
        </div>
      ))}
    </div>
  );
}

function CostBars({ flightCost, hotelCost, nights }: { flightCost: number; hotelCost: number; nights: number }) {
  const food = nights * 50;
  const total = flightCost + hotelCost + food;
  const fp = Math.round((flightCost / total) * 100);
  const hp = Math.round((hotelCost / total) * 100);
  const ep = 100 - fp - hp;
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Cost breakdown</p>
      <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full">
        <div className="h-full bg-cyan-500" style={{ width: `${fp}%` }} />
        <div className="h-full bg-blue-500" style={{ width: `${hp}%` }} />
        <div className="h-full bg-indigo-400" style={{ width: `${ep}%` }} />
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-500" />Flights {fp}%</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500" />Hotel {hp}%</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-indigo-400" />Food &amp; extras ~{ep}%</span>
      </div>
    </div>
  );
}

function timeLabel(time: string): string {
  const h = parseInt(time.split(":")[0], 10);
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

function DayByDay({ activities }: { activities: Activity[] }) {
  const byDay = activities.reduce<Record<number, Activity[]>>((acc, a) => {
    (acc[a.day] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(byDay).map(([day, acts]) => (
        <div key={day}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Day {day}
          </p>
          <div className="space-y-2">
            {acts.map((a, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="min-w-[68px] text-center">
                  <p className="text-xs font-medium text-cyan-300">{a.time}</p>
                  <p className="text-[10px] text-slate-500">{timeLabel(a.time)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{a.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {a.duration} · {a.cost > 0 ? `$${a.cost}` : "Free"}
                  </p>
                  <p className="mt-1 text-[11px] italic leading-relaxed text-cyan-300/70">{a.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TripCard({ option }: { option: TripOption }) {
  const style = RANK_STYLES[option.rank] ?? RANK_STYLES[3];
  const activities = option.activities ?? [];

  return (
    <article className={`flex flex-col gap-5 rounded-2xl border-2 ${style.border} ${style.bg} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>
            {style.label}
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{option.destination}</h2>
          <p className="text-sm text-slate-400">{option.duration} nights · {option.bestFor}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-3xl font-bold tracking-tight text-white">
            ${option.totalCost.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400">total est. cost</p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Overall Score</span>
          <span className="font-bold text-cyan-300">{option.score}/100</span>
        </div>
        <ScoreBar score={option.score} color="bg-gradient-to-r from-cyan-500 to-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs text-slate-400">✈ Flights</p>
          <p className="mt-0.5 text-lg font-semibold text-cyan-200">
            ${option.flightCost.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">per person</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-xs text-slate-400">🏨 Hotel</p>
          <p className="mt-0.5 text-lg font-semibold text-cyan-200">
            ${option.hotelCost.toLocaleString()}
          </p>
          <p className="truncate text-[11px] text-slate-500">
            ${option.hotelCostPerNight ?? Math.round(option.hotelCost / option.duration)}/night
            {option.hotelName ? ` · ${option.hotelName}` : ""}
          </p>
        </div>
      </div>

      <CostBars flightCost={option.flightCost} hotelCost={option.hotelCost} nights={option.duration} />

      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Score breakdown</p>
        <FactorBars factors={option.factors} />
      </div>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
        <p className="mb-1 text-xs font-medium text-slate-400">This trip is right for you if...</p>
        <p className="text-sm text-cyan-100">{option.bestFor}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-emerald-400">Pros</p>
          <div className="flex flex-wrap gap-1.5">
            {option.pros.map((p) => (
              <span key={p} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-rose-400">Cons</p>
          <div className="flex flex-wrap gap-1.5">
            {option.cons.map((c) => (
              <span key={c} className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="border-l-2 border-cyan-500/40 pl-4 text-sm italic leading-7 text-slate-300">
        {option.aiSummary}
      </p>

      {activities.length > 0 && (
        <details className="group">
          <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] [&::-webkit-details-marker]:hidden">
            <span>Day-by-Day Itinerary</span>
            <span className="text-xs text-cyan-400 group-open:hidden">Show ↓</span>
            <span className="hidden text-xs text-cyan-400 group-open:inline">Hide ↑</span>
          </summary>
          <div className="mt-3">
            <DayByDay activities={activities} />
          </div>
        </details>
      )}

      <div className="grid grid-cols-2 gap-3">
        <a
          href={option.affiliateLinks.flights}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 active:scale-95"
        >
          ✈ Book Flights →
        </a>
        <a
          href={option.affiliateLinks.hotels}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-center text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 active:scale-95"
        >
          🏨 Find Hotels →
        </a>
      </div>
      <p className="-mt-3 text-center text-[10px] text-slate-600">via Skyscanner</p>
    </article>
  );
}

function SaveTripOnLoad({
  destination,
  dates,
  budget,
  travelStyle,
  options,
}: {
  destination: string;
  dates: string;
  budget: string;
  travelStyle: string;
  options: TripOption[];
}) {
  useEffect(() => {
    const signature = JSON.stringify({ destination, dates, budget, travelStyle, first: options[0]?.totalCost });
    const key = `saved_trip_${signature}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    saveTrip({
      session_id: getSessionId(),
      destination,
      dates,
      budget,
      travel_style: travelStyle,
      trip_data: options,
    }).catch(() => {});
  }, [budget, dates, destination, options, travelStyle]);

  return null;
}

export function TripResults({
  options,
  destination,
  dates,
  budget,
  travelStyle,
}: {
  options: TripOption[];
  destination: string;
  dates: string;
  budget: string;
  travelStyle: string;
}) {
  return (
    <>
      <SaveTripOnLoad destination={destination} dates={dates} budget={budget} travelStyle={travelStyle} options={options} />
      <p className="mb-6 text-sm text-slate-400">
        {options.length} options ranked best to worst — AI-scored on cost, weather, reviews, flexibility, and travel style fit.
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        {options.map((opt) => (
          <TripCard key={opt.rank} option={opt} />
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-center">
        <p className="text-lg font-semibold text-cyan-100">Want me to plan another trip?</p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 active:scale-95"
        >
          Start a new search
        </Link>
      </div>
    </>
  );
}
