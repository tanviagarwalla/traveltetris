// TravellerCard — individual traveller preferences.
// Designed to feel like planning a trip, not filling out a form.

const INTERESTS = [
  { id: "Food", emoji: "🍝" },
  { id: "Adventure", emoji: "🏔" },
  { id: "Culture", emoji: "🏛" },
  { id: "Nature", emoji: "🌿" },
  { id: "Nightlife", emoji: "🌙" },
  { id: "Beaches", emoji: "🏖" },
  { id: "Shopping", emoji: "🛍" },
];

const PACE_OPTIONS = [
  { value: "relaxed", label: "☕ Relaxed" },
  { value: "balanced", label: "🌤 Balanced" },
  { value: "go-go-go", label: "⚡ Go Go Go" },
];

const BUDGET_OPTIONS = [
  { value: "budget", label: "🪙 Budget" },
  { value: "mid range", label: "💳 Mid Range" },
  { value: "luxury", label: "✨ Luxury" },
];

const AVATAR_BG = ["bg-tomato", "bg-ocean", "bg-palm", "bg-golden", "bg-cocoa", "bg-coral"];
const AVATAR_TEXT = ["text-white", "text-white", "text-white", "text-olive", "text-white", "text-white"];

// Active: tomato (orange = selected state per brand). Inactive: borderless olive wash.
const ACTIVE = "bg-tomato text-white shadow-sm";
const INACTIVE = "bg-olive/6 text-olive/55 hover:bg-olive/10 hover:text-olive/75";

const LABEL = "text-[9px] font-medium text-olive/28 uppercase tracking-[0.18em] mb-3";

export default function TravellerCard({ traveller, onChange, onRemove, colorIndex = 0, errors = {} }) {
  const avatarBg = AVATAR_BG[colorIndex % AVATAR_BG.length];
  const avatarTxt = AVATAR_TEXT[colorIndex % AVATAR_TEXT.length];
  const initials = traveller.name.trim().slice(0, 2).toUpperCase() || "?";

  function update(field, value) {
    onChange({ ...traveller, [field]: value });
  }

  function toggleInterest(id) {
    const already = traveller.interests.includes(id);
    update("interests", already
      ? traveller.interests.filter((i) => i !== id)
      : [...traveller.interests, id]
    );
  }

  return (
    <div className="w-full bg-cream border border-olive/8 rounded-3xl">

      {/* ── Header ── */}
      <div className="flex items-center gap-3.5 px-6 pt-6 pb-5">
        <div className={`w-10 h-10 rounded-full ${avatarBg} ${avatarTxt} flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Traveller name"
            value={traveller.name}
            onChange={(e) => update("name", e.target.value)}
            data-error={errors.name ? true : undefined}
            className={`w-full bg-transparent text-olive font-semibold placeholder-olive/22 text-base focus:outline-none border-b pb-0.5 transition-colors ${errors.name ? "border-tomato" : "border-transparent focus:border-olive/20"
              }`}
          />
          {errors.name && (
            <p className="text-[11px] text-tomato mt-1">{errors.name}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-olive/18 hover:text-olive/45 text-sm transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* ── Preferences ── */}
      <div className="px-6 pb-7 space-y-6">

        {/* Pace */}
        <div>
          <p className={LABEL}>Pace</p>
          <div className="flex gap-2">
            {PACE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update("pace", value)}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${traveller.pace === value ? ACTIVE : INACTIVE
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <p className={LABEL}>Budget</p>
          <div className="flex gap-2">
            {BUDGET_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update("budget", value)}
                className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${traveller.budget === value ? ACTIVE : INACTIVE
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <p className={LABEL}>Interests</p>
          <div className="grid grid-cols-3 gap-2">
            {INTERESTS.map(({ id, emoji }) => {
              const selected = traveller.interests.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleInterest(id)}
                  className={`py-2 rounded-full text-xs font-medium text-center transition-all ${selected ? ACTIVE : INACTIVE
                    }`}
                >
                  {emoji} {id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Must-haves */}
        <div>
          <p className={LABEL}>Must-haves</p>
          <textarea
            placeholder="A beach day, great coffee, rooftop bar…"
            value={traveller.mustHaves}
            onChange={(e) => update("mustHaves", e.target.value)}
            rows={2}
            className="w-full bg-olive/[0.04] text-olive text-xs placeholder-olive/25 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-olive/15 focus:bg-olive/[0.06] resize-none transition-all"
          />
        </div>

        {/* Dealbreakers */}
        <div>
          <p className={LABEL}>Dealbreakers</p>
          <textarea
            placeholder="Large crowds, early mornings, spicy food…"
            value={traveller.dealbreakers}
            onChange={(e) => update("dealbreakers", e.target.value)}
            rows={2}
            className="w-full bg-olive/[0.04] text-olive text-xs placeholder-olive/25 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-olive/15 focus:bg-olive/[0.06] resize-none transition-all"
          />
        </div>

      </div>
    </div>
  );
}
