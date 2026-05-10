import { useEffect, useRef, useState } from "react";

/** Observe an element and return true once it enters the viewport */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Animate a number from 0 to target when triggered */
export function useCountUp(target, duration = 1800, triggered = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered || target == null) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);

  return count;
}

/** Stagger delay helper for list animations */
export function staggerDelay(index, base = 100) {
  return `${index * base}ms`;
}
