export type PlanRequest = {
  destination?: string;
  dates?: string;
  budget?: string;
  travelStyle?: string;
};

export type Activity = {
  day: number;
  time: string;
  name: string;
  duration: string;
  cost: number;
  tip: string;
};

export type TripOption = {
  rank: number;
  score: number;
  destination: string;
  totalCost: number;
  flightCost: number;
  hotelCost: number;
  hotelCostPerNight: number;
  hotelName: string;
  duration: number;
  pros: string[];
  cons: string[];
  aiSummary: string;
  bestFor: string;
  factors: { label: string; score: number }[];
  activities: Activity[];
  affiliateLinks: { flights: string; hotels: string };
};

function skyscanner(destination: string) {
  const dest = destination.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    flights: `https://www.skyscanner.net/transport/flights/anywhere/${dest}/?adults=1`,
    hotels: `https://www.skyscanner.net/hotels/${dest}/`,
  };
}

function mockActivities(destination: string, nights: number): Activity[] {
  const pool: Omit<Activity, "day">[] = [
    { time: "09:00", name: `${destination} Old Town Walking Tour`, duration: "2.5 hrs", cost: 25, tip: "Book ahead — small group tours fill up in peak season." },
    { time: "14:00", name: "Local Market & Street Food", duration: "1.5 hrs", cost: 15, tip: "Eat small portions; the best stalls always have a queue." },
    { time: "19:00", name: "Rooftop Dinner", duration: "2 hrs", cost: 55, tip: "Reserve a day before for a window seat." },
    { time: "09:30", name: "National Museum", duration: "3 hrs", cost: 15, tip: "Arrive before 11am; crowds thin early." },
    { time: "13:30", name: "Historic District Stroll", duration: "2 hrs", cost: 0, tip: "Free to explore; comfortable shoes essential." },
    { time: "18:00", name: "Sunset Viewpoint", duration: "1 hr", cost: 0, tip: "Get there 30 min early for a front-row spot." },
    { time: "10:00", name: "Day Trip to Nearby Landmark", duration: "4 hrs", cost: 40, tip: "Check return transport the night before." },
    { time: "15:00", name: "Local Cooking Class", duration: "3 hrs", cost: 65, tip: "The tastiest souvenir you can bring home." },
    { time: "09:00", name: "Botanical Gardens", duration: "2 hrs", cost: 10, tip: "Quietest on weekday mornings." },
  ];
  const acts: Activity[] = [];
  const days = Math.min(nights, 3);
  for (let day = 1; day <= days; day++) {
    for (let i = 0; i < 3; i++) {
      acts.push({ day, ...pool[((day - 1) * 3 + i) % pool.length] });
    }
  }
  return acts;
}

export function sanitizeTravelStyle(style: string | undefined): string {
  const allowed = ["Backpacker", "Couples", "Family", "Solo"];
  return allowed.includes(style ?? "") ? style! : "Couples";
}

function mockOptions(destination: string, _dates: string, budget: string, travelStyle: string): TripOption[] {
  const budgetNum = parseInt(budget.replace(/[$,]/g, "")) || 3500;
  const eff = (cost: number) => Math.max(10, Math.min(98, Math.round((1 - cost / budgetNum) * 160)));
  const links = skyscanner(destination);
  const styleNotes: Record<string, string> = {
    Backpacker: "hostels, street food, transit access, and low-cost neighborhood discoveries",
    Couples: "walkable neighborhoods, memorable dinners, scenic moments, and comfortable hotels",
    Family: "safe transit, flexible pacing, larger rooms, and kid-friendly activities",
    Solo: "central hotels, easy logistics, social tours, and safe late-day plans",
  };
  const styleNote = styleNotes[travelStyle] ?? styleNotes.Couples;

  const opts = [
    { flight: 620, hotel: 1260, ppn: 180, nights: 6, hotelName: "Courtyard by Marriott" },
    { flight: 890, hotel: 1680, ppn: 240, nights: 6, hotelName: "Hilton Garden Inn" },
    { flight: 480, hotel: 1050, ppn: 150, nights: 5, hotelName: "Ibis Styles" },
  ] as const;

  const meta = [
    {
      rank: 1, score: 91,
      pros: ["Best overall value", "Direct flights available", "Central location", "Breakfast included"],
      cons: ["Mid-tier hotel amenities", "Peak-season pricing"],
      aiSummary: `A well-balanced ${destination} package for ${travelStyle.toLowerCase()} travel. Economy direct flights and a centrally-located hotel keep costs efficient while leaving meaningful budget for ${styleNote}.`,
      bestFor: `${travelStyle} travelers who want value and convenience`,
    },
    {
      rank: 2, score: 74,
      pros: ["Premium hotel amenities", "More flight time options", "Quieter neighbourhood"],
      cons: ["Higher cost reduces activity budget", "Flights pricier on these dates"],
      aiSummary: `A comfortable step-up for ${destination} with better hotel amenities and more flight flexibility. The higher price suits ${travelStyle.toLowerCase()} travelers who prioritise comfort over squeezing every dollar.`,
      bestFor: `${travelStyle} travelers who prefer comfort`,
    },
    {
      rank: 3, score: 58,
      pros: ["Lowest total cost", "Budget hotel near transit"],
      cons: ["Long layovers (8-12 h)", "Fewer hotel amenities", "One fewer day on the ground"],
      aiSummary: `The lowest-cost ${destination} option, but two long layovers eat into your travel days and the budget hotel trades comfort for savings. It works best if your ${travelStyle.toLowerCase()} plan can tolerate fewer frills.`,
      bestFor: `${travelStyle} travelers optimizing for price`,
    },
  ];

  return opts.map((o, i) => ({
    ...meta[i],
    destination,
    totalCost: o.flight + o.hotel,
    flightCost: o.flight,
    hotelCost: o.hotel,
    hotelCostPerNight: o.ppn,
    hotelName: o.hotelName,
    duration: o.nights,
    factors: [
      { label: "Cost Efficiency", score: eff(o.flight + o.hotel) },
      { label: "Weather", score: i === 2 ? 80 : 83 },
      { label: "Reviews", score: [88, 91, 70][i] },
      { label: "Flexibility", score: [82, 76, 45][i] },
    ],
    activities: mockActivities(destination, o.nights),
    affiliateLinks: links,
  }));
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const arr = text.match(/\[[\s\S]*\]/);
  return arr ? arr[0] : text;
}

const SYSTEM_PROMPT = `You are a world-class travel consultant. Generate REALISTIC trip options.
Flights: use real airline routes (not fictional ones).
Hotels: name real hotel chains appropriate for the budget (e.g. "Park Hyatt Shinjuku", "Ibis Tokyo Shinjuku", "Courtyard by Marriott").
Itinerary: max 3 activities per day (people get tired). Each activity needs realistic duration (museum = 2-3 hrs, not 30 min).
Budget: flight costs must reflect real seasonal pricing (Tokyo in cherry blossom season costs more than August).`;

async function callAnthropic(
  destination: string,
  dates: string,
  budget: string,
  travelStyle: string,
): Promise<TripOption[] | null> {
  // Prefer Groq (free) — fall back to Anthropic if available
  const groqKey = process.env.GROQ_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!groqKey && !anthropicKey) return null;

  const links = skyscanner(destination);
  const useGroq = !!groqKey;

  const url = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.anthropic.com/v1/messages";

  const systemMsg = `${SYSTEM_PROMPT}\nUser travel style: ${travelStyle}. Adapt hotel type, activity pacing, safety/logistics notes, and pros/cons for that style.`;

  const userMsg = `Return ONLY a valid JSON array of exactly 3 ranked trip options for: ${destination}, ${dates}, ${budget}, style: ${travelStyle}. Each must match the TripOption TypeScript type with all required fields. affiliateLinks.flights="${links.flights}" affiliateLinks.hotels="${links.hotels}". No markdown, no explanation.`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (useGroq) headers["Authorization"] = `Bearer ${groqKey}`;
  else { headers["x-api-key"] = anthropicKey!; headers["anthropic-version"] = "2023-06-01"; }

  const body = useGroq
    ? JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 3500, temperature: 0.7, messages: [{ role: "system", content: systemMsg }, { role: "user", content: userMsg }] })
    : JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5", max_tokens: 3500, system: systemMsg, messages: [{ role: "user", content: userMsg }] });

  const response = await fetch(url, { method: "POST", headers, body });
  if (!response.ok) return null;

  const data = await response.json();
  // Groq returns OpenAI format; Anthropic returns content array
  const text: string | undefined = useGroq
    ? data?.choices?.[0]?.message?.content
    : data?.content?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(extractJson(text)) as TripOption[];
  return parsed.map((opt) => ({ ...opt, affiliateLinks: links }));
}

function sanitise(options: TripOption[], budgetNum: number): TripOption[] {
  return options.map((opt) => {
    const dayCount: Record<number, number> = {};
    const activities = opt.activities.filter((a) => {
      dayCount[a.day] = (dayCount[a.day] ?? 0) + 1;
      return dayCount[a.day] <= 4;
    });
    const over = opt.totalCost > budgetNum * 1.5;
    const hotelCost = over ? Math.round(opt.hotelCost * 0.75) : opt.hotelCost;
    return {
      ...opt,
      activities,
      hotelCost,
      hotelCostPerNight: over ? Math.round(opt.hotelCostPerNight * 0.75) : opt.hotelCostPerNight,
      totalCost: opt.flightCost + hotelCost,
    };
  });
}

export async function buildTripOptions(
  destination: string,
  dates: string,
  budget: string,
  travelStyleInput?: string,
): Promise<TripOption[]> {
  const travelStyle = sanitizeTravelStyle(travelStyleInput?.trim());
  const budgetNum = parseInt(budget.replace(/[$,]/g, "")) || 3500;
  try {
    const generated = await callAnthropic(destination, dates, budget, travelStyle);
    const options = generated ?? mockOptions(destination, dates, budget, travelStyle);
    return sanitise(options, budgetNum);
  } catch {
    return sanitise(mockOptions(destination, dates, budget, travelStyle), budgetNum);
  }
}
