export type RouteTheme = "paper" | "night";

/**
 * Single source of truth for the page-level theme.
 * `night` pages need a dark document background so iOS overscroll
 * never shows a white band behind them.
 */
const NIGHT_ROUTES = ["/login", "/timeline", "/navidad"];

export function getRouteTheme(pathname: string | null): RouteTheme {
  if (!pathname) return "paper";

  const isNight = NIGHT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return isNight ? "night" : "paper";
}
