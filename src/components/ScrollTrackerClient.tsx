"use client";

import { useEffect } from "react";
import { initScrollTracking, resetScrollTracking } from "@/lib/scrollTracking";

export default function ScrollTrackerClient() {
  useEffect(() => {
    // Initialize scroll tracking on mount
    const cleanup = initScrollTracking();

    // Cleanup on unmount
    return cleanup;
  }, []);

  return null;
}
