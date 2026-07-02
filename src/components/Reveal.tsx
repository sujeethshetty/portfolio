import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
  /** Re-run the reveal every time it enters the viewport */
  repeat?: boolean;
  style?: CSSProperties;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Lightweight scroll-reveal wrapper. Fades + lifts its children into view
 * using an IntersectionObserver — no animation library required.
 */
const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 24,
  repeat = false,
  style,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => prefersReducedMotion());
  const [settled, setSettled] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setShown(false);
          setSettled(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={className}
      onTransitionEnd={(e) => {
        // transitionend bubbles from children; only our own reveal counts
        if (e.target === ref.current && shown) setSettled(true);
      }}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: settled ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;
