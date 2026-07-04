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

Reply with ONLY valid JSON — no markdown, no code fences. Schema:

{
  "destination": string,
  "balanceNote": string (2 sentences max),
  "days": [{
    "dayNumber": number,
    "theme": string,
    "morning":   { "activity": string, "description": string (1-2 sentences), "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "afternoon": { "activity": string, "description": string (1-2 sentences), "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "evening":   { "activity": string, "description": string (1-2 sentences), "startTime": string, "durationHours": number, "tags": string[], "tips": string[] },
    "meals": { "breakfast": string, "lunch": string, "dinner": string },
    "practicalTips": string[]
  }],
  "budgetSummary": {
    "perPersonPerDay": string,
    "accommodation": string,
    "dining": string,
    "activities": string,
    "suggestions": string[]
  }
}

Produce exactly ${tripDetails.days} day object(s). destination field must be "${tripDetails.destination}". Where preferences conflict, find creative compromises.`;
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
    throw new Error(`Generation failed: ${response.statusText}`);
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
    throw new Error("Claude returned an unexpected format. Please try again.");
  }
}
