import { useEffect, useState, type RefObject } from "react";

/**
 * True while the referenced element intersects the viewport. Used to pause
 * looping decorative animations when they are scrolled off-screen.
 * Defaults to true so SSR / no-IntersectionObserver environments still render.
 */
export function useInView(ref: RefObject<HTMLElement>, rootMargin = "0px"): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** Reads the user's reduced-motion preference once (client only). */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}
