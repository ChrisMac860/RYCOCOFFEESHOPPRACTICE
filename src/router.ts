// Router basename shared by the browser entry (main.tsx) and the
// server prerender entry (entry-server.tsx) so the markup they produce
// is byte-for-byte identical and hydration is clean.
//
// Vite injects BASE_URL from the `base` set in vite.config.ts. We strip the
// trailing slash so React Router normalises links the same way on both sides.
const rawBase = import.meta.env.BASE_URL;

export const basename = rawBase === "/" ? undefined : rawBase.replace(/\/$/, "");

// Build the full router location for a given route path, accounting for the
// basename. Used when prerendering each route on the server.
export function toLocation(routePath: string): string {
  if (!basename) {
    return routePath;
  }
  return routePath === "/" ? `${basename}/` : `${basename}${routePath}`;
}
