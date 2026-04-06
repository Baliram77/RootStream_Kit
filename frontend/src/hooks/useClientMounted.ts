import { useEffect, useState } from "react";

/**
 * True only after the first client paint. Deferring with rAF avoids synchronous
 * setState-in-effect lint noise while still matching server HTML on first render.
 */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}
