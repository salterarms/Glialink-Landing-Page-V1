// GA4 Analytics — loads async, no-ops gracefully if GA_ID is missing
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export function pageview(url: string) {
  if (!GA_ID || typeof window === "undefined") return;
  window.gtag?.("config", GA_ID, { page_path: url });
}

export function event(action: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", action, params);
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
