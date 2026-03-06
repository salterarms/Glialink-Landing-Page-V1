// UTM parameter capture — grabs from URL on load, persists in sessionStorage
import { getVariant } from "@/lib/variants";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UTMParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export interface AnalyticsContext extends UTMParams {
  referrer: string;
  variant: string;
}

export function captureUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const params: UTMParams = {};

  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) {
      params[key] = val;
      sessionStorage.setItem(key, val);
    } else {
      const stored = sessionStorage.getItem(key);
      if (stored) params[key] = stored;
    }
  }
  return params;
}

export function getStoredUTM(): UTMParams {
  if (typeof window === "undefined") return {};
  const params: UTMParams = {};
  for (const key of UTM_KEYS) {
    const val = sessionStorage.getItem(key);
    if (val) params[key] = val;
  }
  return params;
}

export function getAnalyticsContext(): AnalyticsContext {
  if (typeof window === "undefined") {
    return {
      referrer: "",
      variant: "control",
    };
  }

  return {
    ...getStoredUTM(),
    referrer: document.referrer || "(direct)",
    variant: getVariant(),
  };
}
