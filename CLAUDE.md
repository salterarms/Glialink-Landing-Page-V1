# Glialink Landing Page

## Architecture
- **All user-facing copy** lives in `src/lib/copy.ts`. Never hardcode text in components.
- Components in `src/components/` pull from copy constants.
- To change messaging: edit `copy.ts` only, commit, push — Vercel auto-deploys.

## Key Files
- `src/lib/copy.ts` — All editable text (headlines, descriptions, CTAs, stats)
- `src/lib/analytics.ts` — GA4 event tracking
- `src/lib/utm.ts` — UTM parameter capture
- `src/app/page.tsx` — Section ordering
- `src/components/` — Hero, Problem, Solution, HowItWorks, WhoItsFor, Mission, ProofBar, SignUpForm, Footer

## Tech Stack
- Next.js 16 (App Router, static export)
- Tailwind CSS v4
- TypeScript
- Vercel hosting

## Brand
- Primary purple: `#7C5CFC`
- Dark purple: `#5A3ED9`
- Light tint: `#F3F0FF`
- Near-black: `#1A1A2E`
- Fonts: DM Sans (headings) + Inter (body)

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (static export to `out/`)
- `npm run lint` — ESLint

## Env Vars (set in Vercel)
- `NEXT_PUBLIC_GA4_ID` — Google Analytics 4 measurement ID
- `NEXT_PUBLIC_FORM_ENDPOINT` — Formspree endpoint URL
