import Link from "next/link";
import { buildTripOptions, sanitizeTravelStyle } from "@/lib/planner";
import { TripResults } from "./TripResults";

export const dynamic = "force-dynamic";

type PlanSearchParams = Promise<Record<string, string | string[] | undefined>>;

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function PlanPage({ searchParams }: { searchParams: PlanSearchParams }) {
  const params = await searchParams;
  const destination = getParam(params, "destination") || "Tokyo";
  const budget = getParam(params, "budget") || "$3,500";
  const travelStyle = sanitizeTravelStyle(getParam(params, "travelStyle"));
  const legacyDates = getParam(params, "dates");
  const startDate = getParam(params, "startDate");
  const dates =
    legacyDates ||
    (startDate ? `${formatDate(startDate)} - ${formatDate(startDate)}` : "Sep 12 - Sep 18");
  const options = await buildTripOptions(destination, dates, budget, travelStyle);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="mb-5 inline-flex text-sm font-medium text-cyan-200 hover:text-cyan-100">
              ← Back to search
            </Link>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Ranked trip options</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
              {destination}
            </h1>
          </div>
          <div className="grid gap-1 text-sm text-slate-300 md:text-right">
            <span>{dates}</span>
            <span>{budget}</span>
            <span>{travelStyle}</span>
          </div>
        </div>

        <TripResults options={options} />
      </div>
    </main>
  );
}
