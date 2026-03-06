"use client";

import { useEffect } from "react";
import { persistVariant, getVariant } from "@/lib/variants";
import { captureUTM } from "@/lib/utm";

/**
 * Initializes variant assignment on page load
 * - Detects variant from URL params or path
 * - Persists to session storage
 * - Sends to GA4
 * - Captures UTM parameters
 */
export default function VariantInitializer() {
  useEffect(() => {
    // Capture UTM parameters and store in sessionStorage
    captureUTM();

    // Get and persist variant
    const variant = getVariant();
    persistVariant(variant);
  }, []);

  return null;
}
