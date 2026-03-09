import { BOOK_CALL } from "@/lib/copy";

// TODO: Wire up Calendly embed in next PR.
// BOOK_CALL.calendlyUrl holds the target URL.
// Options: inline Calendly widget, popup widget, or redirect.

export default function BookCall() {
  return (
    <section id="book-call" className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {BOOK_CALL.heading}
        </h2>
        <p className="mt-4 text-lg text-gray">{BOOK_CALL.sub}</p>

        {/* Calendly embed placeholder — implementation in next PR */}
        <div className="mt-10 rounded-2xl border-2 border-dashed border-purple/20 bg-purple-light px-8 py-16 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple/10">
            {/* Calendar icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-purple"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <p className="text-sm text-gray">{BOOK_CALL.ctaSub}</p>
          {/* Calendly button / embed goes here */}
          <a
            href={BOOK_CALL.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-to-b from-purple to-purple-dark px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple/25 transition-all hover:shadow-xl hover:shadow-purple/30 hover:brightness-110"
          >
            {BOOK_CALL.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
