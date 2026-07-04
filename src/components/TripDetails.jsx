// TripDetails — destination + duration.
// errors: { destination?: string, days?: string }

export default function TripDetails({ tripDetails, onChange, errors = {} }) {
  return (
    <div>
      <div className="mb-3">
        <h2 className="font-display text-olive text-[2.2rem] leading-tight">Where to?</h2>
      </div>

      <div className="flex gap-4 items-start">
        {/* Destination — takes remaining width */}
        <div className="flex-1">
          <label className="block text-[9px] font-medium text-olive/45 uppercase tracking-[0.18em] mb-2">
            Destination
          </label>
          <input
            type="text"
            placeholder="Montenegro, Lisbon, Bali…"
            value={tripDetails.destination}
            onChange={(e) => onChange({ ...tripDetails, destination: e.target.value })}
            data-error={errors.destination ? true : undefined}
            className={`w-full text-olive font-medium placeholder-olive/25 rounded-2xl px-4 py-3.5 text-sm focus:outline-none transition-all ${
              errors.destination
                ? "bg-tomato/6 ring-1 ring-tomato/20"
                : "bg-olive/[0.04] focus:bg-olive/[0.07] focus:ring-1 focus:ring-olive/15"
            }`}
          />
          {errors.destination && (
            <p className="mt-1.5 text-xs text-tomato">{errors.destination}</p>
          )}
        </div>

        {/* Duration — compact */}
        <div className="w-24 flex-shrink-0">
          <label className="block text-[9px] font-medium text-olive/45 uppercase tracking-[0.18em] mb-2">
            Days
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={30}
              value={tripDetails.days || ""}
              onChange={(e) => onChange({ ...tripDetails, days: e.target.value === "" ? 0 : Number(e.target.value) })}
              data-error={errors.days ? true : undefined}
              className={`w-full text-olive font-medium rounded-2xl pl-3 pr-8 py-3.5 text-sm focus:outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                errors.days
                  ? "bg-tomato/6 ring-1 ring-tomato/20"
                  : "bg-olive/[0.04] focus:bg-olive/[0.07] focus:ring-1 focus:ring-olive/15"
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-olive/45 pointer-events-none">
              days
            </span>
          </div>
          {errors.days && (
            <p className="mt-1.5 text-xs text-tomato">{errors.days}</p>
          )}
        </div>
      </div>
    </div>
  );
}
