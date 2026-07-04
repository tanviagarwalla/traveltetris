# Travel Tetris

**An AI-powered collaborative travel planner that helps groups create itineraries everyone is excited about.**

---

## The Story

Every vacation my husband and I plan starts the same way: we have completely different travel styles.

I love fitting in viewpoints, cafés, hidden gems and unique experiences. My husband prefers a slower pace, long lunches, and not spending the whole day walking.

Planning our September vacation made me realise how much time we spent comparing preferences across WhatsApp chats, Google Maps, Notes and Google Docs before we could agree on an itinerary.

I built Travel Tetris to solve this problem.

The idea was simple: what if an AI could understand everyone's travel preferences, identify the trade-offs, and generate an itinerary that genuinely balances the group's interests?

This started as a tool for our own trip and evolved into a fun side project exploring collaborative AI experiences.

---

## What It Does

Travel Tetris lets multiple travellers each enter their own preferences:

- Travel pace (relaxed, moderate, packed)
- Budget range
- Interests (food, nature, art, nightlife, etc.)
- Must-haves
- Dealbreakers

The AI then:
- Identifies common ground across the group
- Balances conflicting priorities with creative compromises
- Explains its reasoning in plain language
- Generates a structured day-by-day itinerary with activities, meals, and practical tips

---

## Features

- [x] Add 2–6 travellers, each with their own preference profile
- [x] Destination and trip duration inputs
- [x] AI-generated itinerary via Claude (streaming)
- [x] Live progress indicator during generation
- [x] Day-by-day breakdown with morning, afternoon, and evening activities
- [x] Meal suggestions for each day
- [x] Practical tips and budget summary
- [x] Share itineraries via URL (state compressed into URL hash)
- [x] Responsive layout — works on mobile, tablet, and desktop
- [x] Form collapses on mobile once the itinerary is generated
- [x] Toast confirmation when a link is copied

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [lz-string](https://github.com/pieroxy/lz-string) — URL state compression for sharable links
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) — markdown rendering

**AI**
- [Anthropic Claude API](https://www.anthropic.com/) (`claude-sonnet-4-5`) — itinerary generation via streaming

---

## How It Works

1. **Choose a destination** and number of days
2. **Add travellers** (up to 6) and fill in each person's preferences
3. **Generate** — the app builds a structured prompt that describes every traveller's pace, interests, budget, must-haves, and dealbreakers
4. **Claude** receives the prompt and streams back a structured JSON response
5. **Progress steps** animate in real time as chunks arrive
6. **The itinerary renders** — days, activities, meals, tips, and a budget summary
7. **Share** — the full trip state is compressed into the URL so anyone with the link sees the same itinerary

The prompt explicitly asks Claude to find compromises where preferences conflict, and to return a `balanceNote` explaining how it reconciled the group's priorities.

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/travel-tetris.git
cd travel-tetris/trip-tetris

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env:
# VITE_ANTHROPIC_API_KEY=your_key_here

# Start the dev server
npm run dev
```

> **Note:** The API key is currently exposed in the browser bundle via Vite's `import.meta.env`. This is fine for local development. Before any public deployment, move the Claude call behind a server-side API route.

---

## Future Ideas

- [ ] Real-time collaboration — multiple people filling in preferences simultaneously
- [ ] Interactive maps — activities pinned to a map view
- [ ] Voting on activities — group members vote to swap or keep suggestions
- [ ] Cost estimation — real pricing pulled from live data
- [ ] Calendar export — add the itinerary to Google Calendar or Apple Calendar
- [ ] PDF export — download a printable version
- [ ] Editable itineraries — drag, reorder, or replace individual activities
- [ ] Save previous trips — local history or cloud sync

---

## Lessons Learned

**Prompt engineering matters more than you'd expect.** Getting Claude to produce consistent, parseable JSON took several iterations. Being explicit about the schema, adding hard constraints (e.g. `"balanceNote": string (2 sentences max)`), and stripping markdown code fences from the response all turned out to be necessary. Small changes to the prompt wording had a measurable effect on output quality.

**Streaming changes the feel of an AI product.** Waiting for a full response felt slow and opaque. Switching to the streaming API and adding a progress indicator with named steps ("Scheduling your days", "Adding meals & tips") made the wait feel intentional rather than broken. The UI feedback loop matters as much as the generation itself.

**Structured outputs need a stable contract.** The itinerary renderer in the frontend depends on a specific JSON shape. Keeping the schema defined in one place and validating it on arrival meant I caught format drift early, rather than getting silent rendering failures.

**Designing for a group is fundamentally different from designing for one person.** The interesting design problem wasn't the itinerary — it was capturing multiple people's preferences in a way that felt fair to everyone. The balance note Claude returns (explaining how it handled conflicts) turned out to be one of the most useful parts of the output.

**Side projects benefit from a real use case.** Having an actual trip to plan kept me focused. Features that didn't help solve the original problem didn't make it in. That constraint made the project better.

---

## Author

Built by [Tanvi Agarwalla](https://github.com/yourusername) — a side project born out of a travel planning argument.
