import { NextResponse } from "next/server";
import { buildTripOptions, sanitizeTravelStyle, type PlanRequest } from "@/lib/planner";
import { saveTrip } from "@/lib/supabase";

export type { Activity, TripOption } from "@/lib/planner";

export async function POST(request: Request) {
  const body = (await request.json()) as PlanRequest;
  const destination = body.destination?.trim() || "Tokyo";
  const dates = body.dates?.trim() || "Sep 12 - Sep 18";
  const budget = body.budget?.trim() || "$3,500";
  const travelStyle = sanitizeTravelStyle(body.travelStyle?.trim());

  const options = await buildTripOptions(destination, dates, budget, travelStyle);
  if (body.sessionId) {
    saveTrip({
      session_id: body.sessionId,
      destination,
      dates,
      budget,
      travel_style: travelStyle,
      trip_data: options,
    }).catch(() => {});
  }
  return NextResponse.json({ options });
}
