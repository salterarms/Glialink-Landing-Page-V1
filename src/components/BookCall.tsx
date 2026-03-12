"use client";

import { BOOK_CALL } from "@/lib/copy";

// Calendly inline embed via iframe — more reliable than the widget.js script
// approach in Next.js App Router (strict mode double-mount strips the script
// before Calendly can initialize the widget div).
//
// The iframe approach works identically, requires no JS loading,
// and survives client-side navigation without reinit issues.

export default function BookCall() {
  // Strip any hardcoded ?month= param so the calendar always opens on the
  // current month. The embed params are appended separately.
  const baseUrl = BOOK_CALL.calendlyUrl.split("?")[0];
  const embedUrl = `${baseUrl}?embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=7C5CFC`;

  return (
    <section
      id="book-call"
      className="bg-white px-6 py-10 md:px-12 lg:px-20"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-ink">
          {BOOK_CALL.heading}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray">{BOOK_CALL.sub}</p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-sm">
          <iframe
            src={embedUrl}
            width="100%"
            height="600"
            scrolling="no"
            frameBorder="0"
            title="Schedule a call with Glialink"
            className="block w-full"
          />
        </div>
      </div>
    </section>
  );
}
