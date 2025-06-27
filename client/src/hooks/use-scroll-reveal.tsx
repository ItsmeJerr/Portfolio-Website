import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) {
      setVisible(true);
      return;
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return {
    ref,
    className:
      "transition-all duration-700 ease-out " +
      (visible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8 pointer-events-none"),
  };
}
