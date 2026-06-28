"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TripOption } from "@/lib/planner";
import { getSessionId } from "@/lib/session";
import { getSavedTrips, type SavedTrip } from "@/lib/supabase";

function optionsFromTrip(trip: SavedTrip): TripOption[] {
  const data = trip.trip_data as { options?: TripOption[] } | TripOption[] | null;
  if (Array.isArray(data)) return data;
  return data?.options ?? [];
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getSavedTrips(getSessionId());
      if (!cancelled) {
        setTrips(data);
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-cyan-200 hover:text-cyan-100">Back</Link>
          <Link href="/" className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950">New trip</Link>
        </header>

        <h1 className="text-3xl font-semibold">Saved trips</h1>
        <p className="mt-2 text-sm text-slate-400">Trips saved to Supabase for this browser session.</p>

        <section className="mt-6 grid gap-3">
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">Loading trips...</div>
          ) : trips.length ? (
            trips.map((trip) => {
              const options = optionsFromTrip(trip);
              return (
                <details key={trip.id ?? trip.created_at} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{trip.destination}</h2>
                        <p className="mt-1 text-sm text-slate-400">{trip.dates}</p>
                      </div>
                      <span className="text-xs text-slate-500">{formatDate(trip.created_at)}</span>
                    </div>
                  </summary>
                  <div className="mt-5 grid gap-4">
                    {options.map((option) => (
                      <article key={`${trip.id}-${option.rank}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-cyan-300">Option {option.rank}</p>
                            <h3 className="mt-1 font-semibold">{option.hotelName}</h3>
                            <p className="mt-1 text-sm text-slate-400">{option.aiSummary}</p>
                          </div>
                          <span className="text-sm font-semibold text-cyan-200">${option.totalCost.toLocaleString()}</span>
                        </div>
                        <div className="mt-3 grid gap-2">
                          {option.activities.map((activity) => (
                            <p key={`${option.rank}-${activity.day}-${activity.time}-${activity.name}`} className="text-sm text-slate-300">
                              Day {activity.day}, {activity.time}: {activity.name}
                            </p>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </details>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <h2 className="text-xl font-semibold">No saved trips yet</h2>
              <p className="mt-2 text-sm text-slate-400">Generate an itinerary and it will be saved automatically.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
