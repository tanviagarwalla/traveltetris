// shareUrl.js
// Encodes the full app state (inputs + generated itinerary) into the URL hash,
// and decodes it back on load.
//
// We use lz-string's compressToEncodedURIComponent because plain JSON can be
// several kilobytes; compression typically cuts it by 60-70%.

import LZString from "lz-string";

// Encode state → URL hash string
export function encodeStateToHash(tripDetails, travellers, itinerary) {
  const payload = JSON.stringify({ tripDetails, travellers, itinerary });
  return LZString.compressToEncodedURIComponent(payload);
}

// Decode URL hash string → state object (returns null if invalid/missing)
export function decodeStateFromHash(hash) {
  if (!hash) return null;
  try {
    const raw = LZString.decompressFromEncodedURIComponent(hash);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Write the encoded state into window.location.hash
export function pushStateToUrl(tripDetails, travellers, itinerary) {
  const encoded = encodeStateToHash(tripDetails, travellers, itinerary);
  window.history.replaceState(null, "", `#${encoded}`);
}

// Read and decode whatever is currently in window.location.hash
export function readStateFromUrl() {
  const raw = window.location.hash.slice(1); // strip leading #
  return decodeStateFromHash(raw);
}

// Copy the current URL to the clipboard; returns a promise
export function copyCurrentUrl() {
  return navigator.clipboard.writeText(window.location.href);
}
