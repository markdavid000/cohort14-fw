import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number; // ms
  start?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string; // thousands separator
}

export function useCountUp(
  {
    end,
    duration = 1800,
    start = 0,
    prefix = "",
    suffix = "",
    decimals = 0,
    separator = ",",
  }: UseCountUpOptions,
  trigger: boolean // starts when true
) {
  const [value, setValue] = useState(start);
  const rafRef = useRef<number>(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const range = end - start;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(start + range * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger]);

  const formatted = (() => {
    const n = parseFloat(value.toFixed(decimals));
    const parts = n.toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + parts.join(".") + suffix;
  })();

  return formatted;
}

/** Hook that returns true when the element ref enters the viewport */
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}
