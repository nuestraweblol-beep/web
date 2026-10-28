/**
 * Utility to parse and format Spotify URLs into embed-friendly URLs.
 * Supports:
 * - https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
 * - https://open.spotify.com/intl-es/track/4cOdK2wGLETKBW3PvgPWqT?si=...
 * - spotify:track:4cOdK2wGLETKBW3PvgPWqT
 * - Album and playlist links as well (track, album, playlist, episode).
 */

export interface SpotifyParsed {
  type: "track" | "album" | "playlist" | "episode";
  id: string;
  embedUrl: string;
}

export function parseSpotifyUrl(input: string): SpotifyParsed | null {
  if (!input) return null;
  const trimmed = input.trim();

  // URI style: spotify:track:4cOdK2wGLETKBW3PvgPWqT
  const uriMatch = trimmed.match(/^spotify:(track|album|playlist|episode):([a-zA-Z0-9]+)/);
  if (uriMatch) {
    const [, type, id] = uriMatch;
    return {
      type: type as SpotifyParsed["type"],
      id,
      embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
    };
  }

  // HTTP URL style: https://open.spotify.com/[intl-.../](track|album|playlist|episode)/<id>
  try {
    const url = new URL(trimmed);
    if (!url.hostname.includes("spotify.com")) return null;

    const parts = url.pathname.split("/").filter(Boolean);
    // Remove locale prefix if present (e.g. 'intl-es')
    const filteredParts = parts[0]?.startsWith("intl-") ? parts.slice(1) : parts;

    const type = filteredParts[0];
    const id = filteredParts[1]?.split("?")[0];

    if (
      (type === "track" || type === "album" || type === "playlist" || type === "episode") &&
      id &&
      /^[a-zA-Z0-9]+$/.test(id)
    ) {
      return {
        type,
        id,
        embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`,
      };
    }
  } catch {
    return null;
  }

  return null;
}

