import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query so the layout choices JavaScript has to make — the
 * rail rendering as a drawer, for instance — stay in step with the breakpoints
 * the stylesheet uses.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}
