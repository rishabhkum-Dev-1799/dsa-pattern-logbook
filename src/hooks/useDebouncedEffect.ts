import { useEffect, useRef, type DependencyList } from "react";

/**
 * Runs `effect` once `delay` ms have passed without `deps` changing.
 * Used by the editor so a keystroke does not open a transaction.
 */
export function useDebouncedEffect(
  effect: () => void,
  deps: DependencyList,
  delay = 600
): void {
  const callback = useRef(effect);
  callback.current = effect;

  useEffect(() => {
    const timer = setTimeout(() => callback.current(), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
