import { useState, useRef, useEffect } from "react";
import TripDetails from "./components/TripDetails";
import TravellerCard from "./components/TravelerCard";
import Itinerary from "./components/Itinerary";
import { PlaneIcon } from "./components/Icons";
import { generateItinerary } from "./api/generateItinerary";
import { testTripDetails, testTravellers } from "./testFixture";
import { pushStateToUrl, readStateFromUrl, copyCurrentUrl } from "./shareUrl";

function createTraveller(id) {
  return { id, name: "", pace: "relaxed", interests: [], budget: "mid range", mustHaves: "", dealbreakers: "" };
}

function validate(tripDetails, travellers) {
  const errors = { trip: {}, travellers: {} };
  if (!tripDetails.destination.trim()) errors.trip.destination = "Please enter a destination.";
  if (!tripDetails.days || tripDetails.days < 1) errors.trip.days = "Please enter at least 1 day.";
  if (tripDetails.days > 16) errors.trip.days = "Maximum 16 days supported.";
  for (const t of travellers) {
    if (!t.name.trim()) errors.travellers[t.id] = { name: "Please enter this traveller's name." };
  }
  const hasErrors = Object.keys(errors.trip).length > 0 || Object.keys(errors.travellers).length > 0;
  return hasErrors ? errors : null;
}

const AVATAR_BG = ["bg-tomato", "bg-ocean", "bg-palm", "bg-golden", "bg-cocoa", "bg-coral"];
const AVATAR_TEXT = ["text-white", "text-white", "text-white", "text-olive", "text-white", "text-white"];

function Avatar({ name, colorIndex, size = "w-8 h-8" }) {
  const initials = name.trim().slice(0, 2).toUpperCase() || "?";
  return (
    <div className={`${size} ${AVATAR_BG[colorIndex % AVATAR_BG.length]} ${AVATAR_TEXT[colorIndex % AVATAR_TEXT.length]} rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 border-2 border-cream`}>
      {initials}
    </div>
  );
}


export default function App() {
  const [tripDetails, setTripDetails] = useState({ destination: "", days: 3 });
  const [travellers, setTravellers] = useState([createTraveller(1)]);
  const [nextId, setNextId] = useState(2);
  const [errors, setErrors] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chunkCount, setChunkCount] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 1024);

  const itineraryRef = useRef(null);
  const lastCardRef = useRef(null);
  const showItinerary = isGenerating || itinerary !== null;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll the newly added card into view
  useEffect(() => {
    if (travellers.length > 1) {
      lastCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [travellers.length]);

  useEffect(() => {
    const saved = readStateFromUrl();
    if (saved?.itinerary) {
      if (saved.tripDetails) setTripDetails(saved.tripDetails);
      if (saved.travellers) {
        setTravellers(saved.travellers);
        setNextId(Math.max(...saved.travellers.map((t) => t.id)) + 1);
      }
      setItinerary(saved.itinerary);
    }
  }, []);

  useEffect(() => {
    if (itinerary) pushStateToUrl(tripDetails, travellers, itinerary);
  }, [itinerary, tripDetails, travellers]);

  async function handleCopyLink() {
    await copyCurrentUrl();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function loadTestData() {
    setTripDetails(testTripDetails);
    setTravellers(testTravellers);
    setNextId(testTravellers.length + 1);
    setErrors(null); setItinerary(null); setApiError(null);
  }

  function addTraveller() {
    if (travellers.length >= 6) return;
    setTravellers([...travellers, createTraveller(nextId)]);
    setNextId(nextId + 1);
  }

  function removeTraveller(id) {
    if (travellers.length <= 1) return;
    setTravellers(travellers.filter((t) => t.id !== id));
    if (errors?.travellers?.[id]) {
      const { [id]: _, ...rest } = errors.travellers;
      setErrors({ ...errors, travellers: rest });
    }
  }

  function updateTraveller(updated) {
    setTravellers(travellers.map((t) => t.id === updated.id ? updated : t));
    if (errors?.travellers?.[updated.id] && updated.name.trim()) {
      const { [updated.id]: _, ...rest } = errors.travellers;
      setErrors({ ...errors, travellers: rest });
    }
  }

  function handleTripDetailsChange(updated) {
    setTripDetails(updated);
    if (errors?.trip) {
      const e = { ...errors.trip };
      if (updated.destination.trim()) delete e.destination;
      if (updated.days >= 1) delete e.days;
      setErrors({ ...errors, trip: e });
    }
  }

  async function handleGenerate() {
    const validationErrors = validate(tripDetails, travellers);
    if (validationErrors) {
      setErrors(validationErrors);
      setTimeout(() => document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      return;
    }
    setErrors(null); setApiError(null); setItinerary(null);
    setChunkCount(0); setIsGenerating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const result = await generateItinerary(tripDetails, travellers, () => setChunkCount((n) => n + 1));
      setItinerary(result);
      setIsEditing(false);
    } catch (err) {
      setApiError(err.message ?? "Something went wrong calling the Claude API.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream font-sans relative">
      {/* ── Toast ── */}
      <div
        className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
        style={{
          transform: copied ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(16px)",
          opacity: copied ? 1 : 0,
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        <div className="flex items-center gap-2.5 bg-olive text-cream text-sm font-medium px-5 py-3 rounded-full shadow-lg">
          <span>✈️</span>
          <span>Link copied — share it with your travel crew!</span>
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="bg-cream px-4 sm:px-8 pt-6 pb-4 flex items-center justify-between sticky top-0 z-20">

        {/* Stacked wordmark */}
        <div
          style={{
            fontFamily: '"Instrument Sans", system-ui, sans-serif',
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "#405B2E",
            lineHeight: 0.95,
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>travel</span>
          <span>tetris</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Named traveller avatars — hidden on small screens */}
          <div className="hidden sm:flex items-center -space-x-2">
            {travellers.filter(t => t.name.trim()).slice(0, 4).map((t, i) => (
              <Avatar key={t.id} name={t.name} colorIndex={i} />
            ))}
            {travellers.filter(t => t.name.trim()).length > 4 && (
              <div className="w-8 h-8 rounded-full bg-olive/10 text-olive text-xs font-medium flex items-center justify-center border-2 border-cream">
                +{travellers.filter(t => t.name.trim()).length - 4}
              </div>
            )}
          </div>

          {/* Share CTA */}
          <button
            onClick={handleCopyLink}
            disabled={!itinerary}
            className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-tomato text-white text-sm font-medium rounded-full hover:bg-tomato/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <PlaneIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Share trip</span>
          </button>

          {import.meta.env.DEV && (
            <button onClick={loadTestData} className="hidden sm:block px-3 py-1.5 text-xs text-olive/40 border border-olive/12 rounded-full hover:border-olive/25 transition-colors">
              Test data
            </button>
          )}
        </div>
      </nav>

      {/* ── Main layout ── */}
      <main className="px-4 sm:px-8 pb-16">
        <div
          style={{
            maxWidth: showItinerary ? "1440px" : "680px",
            margin: "0 auto",
            transition: "max-width 0.6s ease",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:flex-wrap lg:gap-12 gap-8 lg:items-start">

            {/* LEFT: form */}
            <div
              className={`w-full space-y-5 sm:space-y-1 ${showItinerary ? "lg:max-w-[380px]" : ""}`}
              style={{
                flexShrink: 0,
                maxHeight: (isMobile && showItinerary && !isEditing) ? "0px" : "4000px",
                opacity:   (isMobile && showItinerary && !isEditing) ? 0 : 1,
                overflow:  (isMobile && showItinerary && !isEditing) ? "hidden" : "visible",
                pointerEvents: (isMobile && showItinerary && !isEditing) ? "none" : "auto",
                paddingTop: (isMobile && showItinerary && !isEditing) ? "0px" : "8px",
                transition: "max-height 0.45s ease, opacity 0.3s ease, padding-top 0.35s ease",
              }}
            >
              {/* Where to */}
              <div className="sm:bg-cream sm:rounded-3xl px-0 py-0 sm:px-8 sm:pt-8 sm:pb-3 relative">
                <TripDetails
                  tripDetails={tripDetails}
                  onChange={handleTripDetailsChange}
                  errors={errors?.trip ?? {}}
                />
              </div>

              {/* Who's coming */}
              <div className="sm:bg-cream sm:rounded-3xl px-0 pt-0 pb-4 sm:px-8 sm:pt-3 sm:pb-8 space-y-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-olive text-[1.6rem]">Who's coming?</h2>
                    <p className="text-[11px] text-olive/30 mt-1">{travellers.length} of 6 travellers</p>
                  </div>
                  <button
                    onClick={addTraveller}
                    disabled={travellers.length >= 6}
                    className="px-4 py-2 bg-olive/8 text-olive text-sm font-medium rounded-full hover:bg-olive/14 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    + Add traveller
                  </button>
                </div>

                <div className={showItinerary ? "space-y-5" : "grid grid-cols-1 sm:grid-cols-2 gap-5"}>
                  {travellers.map((traveller, index) => (
                    <div key={traveller.id} ref={index === travellers.length - 1 ? lastCardRef : null}>
                      <TravellerCard
                        traveller={traveller}
                        onChange={updateTraveller}
                        onRemove={() => removeTraveller(traveller.id)}
                        colorIndex={index}
                        errors={errors?.travellers?.[traveller.id] ?? {}}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-tomato text-white text-sm font-medium rounded-full hover:bg-tomato/85 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Building your itinerary…
                  </>
                ) : (
                  itinerary ? "✨ Regenerate itinerary" : "✨ Generate itinerary"
                )}
              </button>

              {apiError && (
                <div className="bg-golden/10 border border-golden/25 rounded-2xl px-5 py-4 text-olive/70 text-sm leading-relaxed">
                  {apiError}
                </div>
              )}
            </div>

            {/* RIGHT: itinerary */}
            <div
              ref={itineraryRef}
              className="relative w-full lg:w-auto pt-2"
              style={{
                flex: "1 1 400px",
                minWidth: 0,
                opacity: showItinerary ? 1 : 0,
                transform: showItinerary ? "translateX(0)" : "translateX(32px)",
                transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
                pointerEvents: showItinerary ? "auto" : "none",
              }}
            >
              {/* Edit trip bar — mobile only, shown when form is hidden */}
              {showItinerary && !isEditing && (
                <div className="lg:hidden flex items-center justify-between mb-5">
                  <p className="text-[11px] text-olive/35 font-medium uppercase tracking-[0.15em]">Your itinerary</p>
                  <button
                    onClick={() => { setIsEditing(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-xs text-olive/55 border border-olive/15 rounded-full px-3 py-1.5 hover:border-olive/30 hover:text-olive/75 transition-colors"
                  >
                    ← Edit trip
                  </button>
                </div>
              )}

              {showItinerary && (
                <Itinerary
                  itinerary={itinerary}
                  isGenerating={isGenerating}
                  chunkCount={chunkCount}
                  travellers={travellers}
                  destination={tripDetails.destination}
                />
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
