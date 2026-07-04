// Itinerary — structured display of Claude's JSON response.
// Editorial style: typography-first, cream dominant, olive structure, tomato accents only.

import { useState, useEffect } from "react";

function useDestinationPhoto(destination) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!destination) return;

    const query = destination + " travel landmark";
    fetch(`/api/photo?query=${encodeURIComponent(query)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Photo API ${r.status}: ${r.statusText}`);
        return r.json();
      })
      .then((data) => {
        const photo = data.photos?.[0];
        if (photo) {
          setPhotoUrl(photo.src.large);
        } else {
          console.warn("[Pexels] No photos returned for:", destination);
        }
      })
      .catch((err) => console.error("[Pexels] fetch failed:", err));
  }, [destination]);

  return photoUrl;
}

// ── Loading state — progress steps ────────────────────────────────────────────

const STEPS = [
  { label: "Picking the best activities",  detail: "Matching everyone's interests" },
  { label: "Scheduling your days",         detail: "Balancing pace and timing"     },
  { label: "Adding meals & tips",          detail: "Finding local favourites"      },
  { label: "Polishing the details",        detail: "Final touches"                 },
];

function LoadingSkeleton({ chunkCount }) {
  const activeStep = Math.min(Math.floor(chunkCount / 10), STEPS.length - 1);

  return (
    <div className="bg-cream border border-olive/10 rounded-3xl px-8 sm:px-12 py-12">
      <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.2em] mb-10">
        Building your itinerary
      </p>

      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const isDone    = i < activeStep;
          const isActive  = i === activeStep;
          const isLast    = i === STEPS.length - 1;

          return (
            <div key={i} className="flex gap-5">
              {/* Indicator + connector line */}
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                  isDone   ? "bg-olive"        :
                  isActive ? "ring-2 ring-tomato/30 bg-tomato/8" :
                             "bg-olive/6"
                }`}>
                  {isDone && (
                    <svg className="w-3 h-3 text-cream" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5L9.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-tomato animate-pulse" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-px flex-1 my-1 transition-colors duration-500 ${isDone ? "bg-olive/20" : "bg-olive/8"}`} style={{ minHeight: "24px" }} />
                )}
              </div>

              {/* Text */}
              <div className={`pb-7 transition-all duration-500 ${isLast ? "pb-0" : ""}`}>
                <p className={`text-sm font-medium leading-none mb-1 transition-colors duration-500 ${
                  isDone   ? "text-olive/35" :
                  isActive ? "text-olive"    :
                             "text-olive/20"
                }`}>
                  {step.label}
                </p>
                <p className={`text-[11px] transition-colors duration-500 ${
                  isActive ? "text-olive/40" : "text-olive/0"
                }`}>
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Activity tags ─────────────────────────────────────────────────────────────

const TAG_COLORS = {
  walking:    "bg-palm/10    text-palm    border-palm/20",
  culture:    "bg-cocoa/8    text-cocoa   border-cocoa/18",
  food:       "bg-golden/18  text-cocoa   border-golden/28",
  adventure:  "bg-cocoa/8    text-cocoa   border-cocoa/18",
  nature:     "bg-palm/10    text-palm    border-palm/20",
  "boat ride":"bg-palm/10    text-palm    border-palm/20",
  nightlife:  "bg-cocoa/10   text-cocoa   border-cocoa/20",
  beaches:    "bg-golden/18  text-olive   border-golden/28",
  shopping:   "bg-coral/10   text-cocoa   border-coral/20",
  history:    "bg-golden/12  text-cocoa   border-golden/22",
  relaxation: "bg-palm/8     text-palm    border-palm/15",
};

function ActivityTag({ label }) {
  const colors = TAG_COLORS[label.toLowerCase()] ?? "bg-olive/8 text-olive border-olive/15";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colors}`}>
      {label}
    </span>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const TIME_SLOTS = [
  { key: "morning",   label: "Morning",   emoji: "☀️",  dotBg: "bg-golden/22" },
  { key: "afternoon", label: "Afternoon", emoji: "🌤️", dotBg: "bg-golden/12" },
  { key: "evening",   label: "Evening",   emoji: "🌙",  dotBg: "bg-olive/8"   },
];

function TimeSlot({ slot, data, isLast }) {
  if (!data) return null;
  return (
    <div className={!isLast ? "pb-8 mb-8 border-b border-olive/6" : ""}>

      {/* ── Slot header: emoji + label ── time/duration right-aligned ── */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-7 h-7 rounded-full ${slot.dotBg} flex items-center justify-center text-sm flex-shrink-0`}>
          {slot.emoji}
        </div>
        <span className="text-[9px] font-semibold text-olive/40 uppercase tracking-[0.2em]">
          {slot.label}
        </span>
        <div className="flex-1 h-px bg-olive/8" />
        {(data.startTime || data.durationHours) && (
          <span className="text-[11px] text-olive/30 font-medium tabular-nums flex-shrink-0">
            {[data.startTime, data.durationHours ? `${data.durationHours}h` : null]
              .filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      {/* ── Activity content — indented under dot ── */}
      <div className="ml-9">
        <h4 className="font-display text-olive text-[1.35rem] leading-snug mb-2.5">
          {data.activity}
        </h4>
        <p className="text-olive/50 text-[13px] leading-[1.75] max-w-[46ch]">
          {data.description}
        </p>

        {/* Tags — inline below description */}
        {data.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {data.tags.map((tag) => <ActivityTag key={tag} label={tag} />)}
          </div>
        )}

        {/* Tips */}
            {data.tips?.length > 0 && (
          <ul className="mt-3.5 space-y-1.5">
            {data.tips.map((tip, i) => (
              <li key={i} className="text-[12px] text-olive/35 flex gap-2 leading-[1.6]">
                <span className="text-olive/25 flex-shrink-0 mt-px">›</span> {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Meals ─────────────────────────────────────────────────────────────────────

function MealsRow({ meals }) {
  if (!meals) return null;
  const entries = [
    { emoji: "🥐", label: "Breakfast", value: meals.breakfast },
    { emoji: "🥗", label: "Lunch",     value: meals.lunch     },
    { emoji: "🍽️", label: "Dinner",   value: meals.dinner    },
  ].filter((e) => e.value);
  if (!entries.length) return null;
  return (
    <div className="bg-cream border border-olive/10 rounded-2xl px-4 sm:px-5 py-4 mt-5">
      <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-3">Meals</p>
      <div className="space-y-2.5">
        {entries.map(({ emoji, label, value }) => (
          <div key={label} className="grid text-[12px]" style={{ gridTemplateColumns: "1.25rem auto 1fr", gap: "0 0.5rem", alignItems: "start" }}>
            <span>{emoji}</span>
            <span className="text-olive/35 flex-shrink-0">{label}</span>
            <span className="text-olive/75 leading-[1.6]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Day card ──────────────────────────────────────────────────────────────────

function DayCard({ day }) {
  return (
    <div className="bg-cream border border-olive/10 rounded-2xl overflow-hidden">
      {/* Editorial header */}
      <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-olive/8">
        <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-1.5">
          Day {day.dayNumber}
        </p>
        {day.theme && (
          <h3 className="font-display text-olive text-[1.75rem] leading-snug">{day.theme}</h3>
        )}
      </div>

      {/* Timeline */}
      <div className="px-5 sm:px-8 py-6 sm:py-7">
        {TIME_SLOTS.map((slot, i) => (
          <TimeSlot
            key={slot.key}
            slot={slot}
            data={day[slot.key]}
            isLast={i === TIME_SLOTS.length - 1}
          />
        ))}
        <MealsRow meals={day.meals} />

        {/* Practical tips */}
        {day.practicalTips?.length > 0 && (
          <div className="border-t border-olive/8 pt-5 mt-5">
            <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-3">
              💡 Practical tips
            </p>
            <ul className="space-y-2">
              {day.practicalTips.map((tip, i) => (
                <li key={i} className="text-[12px] text-olive/45 flex gap-2 leading-[1.65]">
                  <span className="text-olive/25 flex-shrink-0 mt-px">›</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Budget summary ────────────────────────────────────────────────────────────

function BudgetSummary({ budget }) {
  if (!budget) return null;
  return (
    <div className="bg-cream border border-olive/10 rounded-2xl overflow-hidden">
      <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-olive/8">
        <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-1.5">Budget</p>
        {budget.perPersonPerDay && (
          <h3 className="font-display text-olive text-[1.75rem]">
            ~{budget.perPersonPerDay}{" "}
            <span className="text-sm font-sans font-normal text-olive/35">per person / day</span>
          </h3>
        )}
      </div>
      <div className="px-5 sm:px-8 py-6 sm:py-7 space-y-3">
        {[
          { label: "Accommodation", value: budget.accommodation },
          { label: "Dining",        value: budget.dining        },
          { label: "Activities",    value: budget.activities    },
        ].filter((r) => r.value).map(({ label, value }) => (
          <div key={label} className="flex gap-6 text-[13px]">
            <span className="text-olive/35 w-32 flex-shrink-0">{label}</span>
            <span className="text-olive/80 leading-[1.7]">{value}</span>
          </div>
        ))}
        {budget.suggestions?.length > 0 && (
          <div className="pt-4 border-t border-olive/8 mt-2">
            <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-3">Where to stay</p>
            <ul className="space-y-2">
              {budget.suggestions.map((s, i) => (
                <li key={i} className="text-[12px] text-olive/50 flex gap-2 leading-[1.6]">
                  <span className="text-olive/25 flex-shrink-0">›</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Travel scene illustration ─────────────────────────────────────────────────

function TravelScene() {
  return (
    <svg viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F6E6A9" />
          <stop offset="100%" stopColor="#FFF8EF" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4F8DCB" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#4F8DCB" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#405B2E" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#405B2E" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#698C46" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#405B2E" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="280" fill="url(#sky)" />

      {/* Sun — three halos for glow */}
      <circle cx="310" cy="88" r="62" fill="#FFC84D" fillOpacity="0.14" />
      <circle cx="310" cy="88" r="42" fill="#FFC84D" fillOpacity="0.32" />
      <circle cx="310" cy="88" r="26" fill="#FFC84D" fillOpacity="0.82" />

      {/* Far mountains */}
      <path d="M0 195 L55 120 L110 165 L175 95 L240 148 L295 108 L355 140 L400 125 L400 280 L0 280Z"
            fill="url(#hillFar)" />

      {/* Mid hills */}
      <path d="M0 220 L70 158 L150 192 L230 148 L310 178 L370 155 L400 165 L400 280 L0 280Z"
            fill="url(#hillNear)" />

      {/* Foreground band */}
      <path d="M0 248 Q100 230 200 240 Q300 250 400 232 L400 280 L0 280Z"
            fill="#405B2E" fillOpacity="0.28" />

      {/* Water shimmer */}
      <path d="M0 238 Q100 228 200 235 Q300 242 400 230 L400 250 Q300 260 200 254 Q100 248 0 258Z"
            fill="url(#water)" />

      {/* Plane */}
      <g transform="translate(55,68) rotate(-10)" opacity="0.68">
        <path d="M0 6 L36 2.5 L41 6 L36 9.5 L0 9.5Z"  fill="#405B2E" />
        <path d="M12 2.5 L24 -7 L27 2.5Z"             fill="#405B2E" />
        <path d="M16 9.5 L23 17.5 L26 9.5Z"           fill="#405B2E" />
        <ellipse cx="7" cy="6" rx="3" ry="2.2" fill="#FFF8EF" fillOpacity="0.85" />
      </g>

      {/* Contrail — dashed */}
      <path d="M98 62 C155 57 220 53 295 49"
            stroke="#FFF8EF" strokeWidth="1.8" strokeLinecap="round"
            strokeDasharray="5 4" strokeOpacity="0.7" />

      {/* Birds */}
      <path d="M32 44 Q35 40 38 44" stroke="#405B2E" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeOpacity="0.32"/>
      <path d="M44 36 Q47 32 50 36" stroke="#405B2E" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeOpacity="0.22"/>
      <path d="M24 58 Q27 55 30 58" stroke="#405B2E" strokeWidth="1"   fill="none" strokeLinecap="round" strokeOpacity="0.22"/>

      {/* Accent stars */}
      <circle cx="18"  cy="28"  r="2"   fill="#F35B2D" fillOpacity="0.50" />
      <circle cx="148" cy="20"  r="1.4" fill="#F35B2D" fillOpacity="0.32" />
      <circle cx="372" cy="35"  r="2.2" fill="#405B2E" fillOpacity="0.22" />
      <circle cx="115" cy="34"  r="1"   fill="#FFC84D" fillOpacity="0.65" />
    </svg>
  );
}

// ── Airmail stripe ────────────────────────────────────────────────────────────

function AirmailStripe() {
  return (
    <div className="absolute left-0 right-0 h-2 flex overflow-hidden" style={{ backgroundSize: "16px 8px" }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-tomato/50" : "bg-ocean/45"}`} />
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

function MetaBadge({ label }) {
  return (
    <span className="text-[11px] text-olive/50 font-medium bg-olive/[0.05] px-2.5 py-1 rounded-full">
      {label}
    </span>
  );
}

export default function Itinerary({ itinerary, isGenerating, chunkCount = 0, travellers = [], destination = "" }) {
  const resolvedDestination = itinerary?.destination || destination;
  const photoUrl = useDestinationPhoto(resolvedDestination);

  if (isGenerating) return <LoadingSkeleton chunkCount={chunkCount} />;
  if (!itinerary) return null;

  const dayCount       = itinerary.days?.length ?? 0;
  const travellerCount = travellers.length;

  // Derive dominant pace from travellers
  const pace = (() => {
    if (!travellers.length) return null;
    const counts = {};
    for (const t of travellers) counts[t.pace] = (counts[t.pace] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return { relaxed: "Relaxed", balanced: "Balanced", "go-go-go": "Go-go-go" }[top] ?? top;
  })();

  return (
    <div className="space-y-6">

      {/* ── Hero — premium travel postcard ── */}
      <div
        className="bg-cream border border-olive/15 rounded-3xl relative overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(64,91,46,0.06), 0 8px 32px rgba(64,91,46,0.09), 0 1px 2px rgba(64,91,46,0.04)" }}
      >

        {/* Airmail stripes — top + bottom */}
        <div className="absolute top-0 left-0 right-0 z-10"><AirmailStripe /></div>
        <div className="absolute bottom-0 left-0 right-0 z-10" style={{ transform: "rotate(180deg)" }}><AirmailStripe /></div>

        <div className="flex flex-col sm:flex-row sm:min-h-[320px]">

          {/* Photo — full-width on mobile, right column on desktop */}
          <div className="h-56 sm:h-auto sm:order-2 sm:w-[46%] flex-shrink-0 relative">
            <div className="absolute inset-0">
              {photoUrl ? (
                <img src={photoUrl} alt={resolvedDestination} className="w-full h-full object-cover" />
              ) : (
                <TravelScene />
              )}
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 sm:order-1 flex flex-col justify-between px-7 pt-9 pb-8 sm:px-10 sm:pt-12 sm:pb-10 border-t sm:border-t-0 sm:border-r border-dashed border-olive/15">
            <div>
              {/* Label row */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[9px] font-medium text-olive/28 uppercase tracking-[0.2em]">Your itinerary</p>
                <div className="flex-1 h-px bg-olive/10" />
              </div>

              {/* Destination pin */}
              {resolvedDestination && (
                <p className="text-[12px] text-olive/45 font-medium mb-2">
                  📍 {resolvedDestination}
                </p>
              )}

              {/* Destination heading — focal point */}
              <h2 className="font-display text-olive text-[2.2rem] sm:text-[3.2rem] leading-[1.05] mb-4">
                {resolvedDestination || "Your trip"}
              </h2>

              {/* AI summary — 2–3 lines */}
              {itinerary.balanceNote && (
                <p
                  className="text-olive/50 text-[13px] leading-[1.75] max-w-[38ch]"
                  style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {itinerary.balanceNote}
                </p>
              )}
            </div>

            {/* Metadata pills */}
            <div className="flex items-center gap-2 flex-wrap mt-6 sm:mt-8">
              {dayCount > 0 && (
                <MetaBadge label={`${dayCount} ${dayCount === 1 ? "day" : "days"}`} />
              )}
              {travellerCount > 0 && (
                <MetaBadge label={`${travellerCount} ${travellerCount === 1 ? "traveller" : "travellers"}`} />
              )}
              {pace && (
                <MetaBadge label={`${pace} pace`} />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Days */}
      {itinerary.days?.map((day) => (
        <DayCard key={day.dayNumber} day={day} />
      ))}

      {/* Budget */}
      <BudgetSummary budget={itinerary.budgetSummary} />

    </div>
  );
}
