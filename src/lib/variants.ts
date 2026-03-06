// A/B Testing variant detection and management

export type Variant = "control" | "v1" | "v2" | string;

export function getVariant(): Variant {
  if (typeof window === "undefined") return "control";

  // Check URL query param first (?variant=v1)
  const url = new URL(window.location.href);
  const variant = url.searchParams.get("variant");
  if (variant) return variant;

  // Check if already assigned in this session
  const assigned = sessionStorage.getItem("assigned_variant");
  if (assigned) return assigned;

  return "control";
}

export function getVariantFromPath(pathname: string): Variant {
  // Support paths like /v1, /v2, /control
  const pathMatch = pathname.match(/^\/(v\d+|control)/);
  return pathMatch ? pathMatch[1] : "control";
}

// Persist variant in session storage and send to GA4
export function persistVariant(variant: Variant) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("assigned_variant", variant);
  // Send to GA4 as a user property
  window.gtag?.("set", { variant });
}

// Randomly assign variant (for A/B testing)
export function assignRandomVariant(variants: Variant[] = [
  "control",
  "v1",
]): Variant {
  if (typeof window === "undefined") return "control";

  const existing = sessionStorage.getItem("assigned_variant");
  if (existing) return existing as Variant;

  const assigned = variants[Math.floor(Math.random() * variants.length)];
  persistVariant(assigned);
  return assigned;
}
