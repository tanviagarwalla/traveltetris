// generateItinerary.js
// Builds a structured prompt and calls the /api/generate serverless function.
// The Claude API key never touches the browser — it lives only in the server environment.

// The exact JSON shape we ask Claude to return.
//
// {
//   destination: string          — the city/country being visited
//   balanceNote: string          — 2-4 sentences on how group preferences were reconciled
//   days: Array<{
//     dayNumber: number
//     theme: string              — short evocative title e.g. "Coastal Highlights"
//     morning:   { activity: string, description: string, tips: string[] }
//     afternoon: { activity: string, description: string, tips: string[] }
//     evening:   { activity: string, description: string, tips: string[] }
//     meals: { breakfast: string, lunch: string, dinner: string }
//     practicalTips: string[]
//   }>
//   budgetSummary: {
//     perPersonPerDay: string    — e.g. "€80–150"
//     accommodation: string
//     dining: string
//     activities: string
//     suggestions: string[]
//   }
// }

function buildPrompt(tripDetails, travellers) {
  const travellerDescriptions = travellers.map((t, i) => {
    const interests = t.interests.length ? t.interests.join(", ") : "no specific interests listed";
    return [
      `Traveller ${i + 1}: ${t.name}`,
      `  - Pace preference: ${t.pace}`,
      `  - Interests: ${interests}`,
      `  - Budget: ${t.budget}`,
      `  - Must-haves: ${t.mustHaves.trim() || "none"}`,
      `  - Dealbreakers: ${t.dealbreakers.trim() || "none"}`,
    ].join("\n");
  }).join("\n\n");

  return `You are an expert travel planner. Create a ${tripDetails.days}-day group itinerary for ${tripDetails.destination}.

Group (${travellers.length} traveller(s)):
${travellerDescriptions}

Important requirements:
- Reply with ONLY valid JSON — no markdown, no code fences.
- Produce exactly ${tripDetails.days} day object(s).
- The destination field must be exactly "${tripDetails.destination}".
- Where preferences conflict, find creative compromises.
- budgetSummary.hotelSuggestions must contain 3-4 specific hotel or guesthouse names matching the group's budget, each formatted as "Hotel Name — one-line note", e.g. "Villa Dubrovnik — luxury clifftop hotel with sea views" or "Hostel One — sociable budget pick near the old town".
${tripDetails.days >= 7 ? "- For this longer trip, keep each activity description to 1 sentence and each tips array to 2 items max.\n" : ""}

JSON schema:

{
  "destination": string,
  "balanceNote": string (2 sentences max),
  "days": [{
    "dayNumber": number,
    "theme": string,
    "morning":   { "activity": string, "description": string, "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "afternoon": { "activity": string, "description": string, "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "evening":   { "activity": string, "description": string, "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "meals": { "breakfast": string, "lunch": string, "dinner": string },
    "practicalTips": string[]
  }],
  "budgetSummary": {
    "perPersonPerDay": string,
    "accommodation": string,
    "dining": string,
    "activities": string,
    "hotelSuggestions": string[]
  }
}`;
}

// Calls the /api/generate serverless function and streams the response back.
// onProgress() is called on each chunk so the UI can show a live progress animation.
export async function generateItinerary(tripDetails, travellers, onProgress) {
  const prompt = buildPrompt(tripDetails, travellers);

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`✈️ Something went wrong on our end (${response.statusText}). Try again in a moment!`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    accumulated += decoder.decode(value, { stream: true });
    onProgress?.();
  }

  // Strip markdown code fences in case Claude wraps the JSON anyway
  const cleaned = accumulated
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    if (cleaned.length === 0) {
      throw new Error("✈️ Our travel planner went quiet — no response came back. Give it another go!");
    }
    if (!cleaned.endsWith("}")) {
      throw new Error("🗺️ That's a long trip! The itinerary was too big to generate in one go. Try splitting it into shorter legs, or reduce the number of days.");
    }
    throw new Error("🧳 Something got scrambled on the way back. Try generating again — it usually works on the second attempt!");
  }
}
