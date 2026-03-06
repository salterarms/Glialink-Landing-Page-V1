// Scroll depth tracking — fires GA4 events at 25%, 50%, 75%, 100%
let scrollDepths = new Set<number>();

export function initScrollTracking() {
  if (typeof window === "undefined") return () => {};

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    // Calculate scroll percentage
    const scrollPercentage = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );

    // Fire events at thresholds
    const thresholds = [25, 50, 75, 100];
    for (const threshold of thresholds) {
      if (scrollPercentage >= threshold && !scrollDepths.has(threshold)) {
        scrollDepths.add(threshold);
        window.gtag?.("event", "scroll_depth", {
          scroll_percentage: threshold,
          page_location: window.location.pathname,
        });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}

// Reset scroll depths when page changes
export function resetScrollTracking() {
  scrollDepths.clear();
}
