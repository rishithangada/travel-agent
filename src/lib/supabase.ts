import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export type SavedTrip = {
  id?: string;
  session_id: string;
  created_at?: string;
  destination: string;
  dates: string;
  budget: string;
  travel_style?: string;
  trip_data: object;
};

export async function saveTrip(trip: Omit<SavedTrip, "id" | "created_at">) {
  const { data, error } = await supabase.from("saved_trips").insert(trip).select().single();
  if (error) console.error("saveTrip:", error.message);
  return data;
}

export async function getSavedTrips(sessionId: string): Promise<SavedTrip[]> {
  const { data, error } = await supabase
    .from("saved_trips")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) console.error("getSavedTrips:", error.message);
  return data ?? [];
}
