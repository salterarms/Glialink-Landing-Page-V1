"use client";

import { useEffect } from "react";
import { BOOK_CALL } from "@/lib/copy";

// Calendly inline widget — loads their scheduler directly on the page.
// No API key needed for the embed. The webhook handler at
// /api/calendly/webhook receives booking events server-side.

export default function BookCall() {
  useEffect(() => {
    // Inject Calendly widget script once
    if (document.querySelector('script[src*="calendly.com"]')) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existing = document.querySelector('script[src*="calendly.com"]');
      if (existing) document.body.removeChild(existing);
    };
  }, []);

  return (
    <section
      id="book-call"
      className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-20 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {BOOK_CALL.heading}
        </h2>
        <p className="mt-4 text-lg text-gray">{BOOK_CALL.sub}</p>

        {/* Calendly inline widget */}
        <div
          className="calendly-inline-widget mt-10 w-full overflow-hidden rounded-2xl border border-border shadow-sm"
          data-url={BOOK_CALL.calendlyUrl}
          style={{ minWidth: "320px", height: "700px" }}
        />
      </div>
    </section>
  );
}
