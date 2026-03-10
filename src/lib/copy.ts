// ============================================================
// GLIALINK LANDING PAGE — ALL EDITABLE COPY
// ============================================================
// To change ANY text on the landing page, edit this file only.
// Components pull from these constants. No hardcoded strings.
// After editing, commit and push — Vercel auto-deploys in ~60s.
// ============================================================

export const SITE = {
  title: "Glialink — Your research deserves more than a PDF and a prayer",
  description:
    "Turn your publications into living project pages that bring the right collaborators to you. Free early access for researchers.",
  url: "https://glialink.com",
};

export const NAV = {
  logoAlt: "Glialink logo",
  about: "About",
  demo: "Demo",
  bookCall: "Book a Call",
};

export const HERO = {
  headline: "Your research deserves more than a PDF and a prayer.",
  sub: "You share your work at conferences and online. A few nods, maybe some likes — then silence. Glialink turns your publications into living project pages that actually bring the right people to you.",
  cta: "Get early access",
  ctaSub:
    "Free. 30 seconds. We're students building this — come shape it with us.",
};

export const PROBLEM = {
  heading: "The follow-up problem isn't just conferences. It's everywhere.",
  beats: [
    {
      text: "You present a poster. Great conversations. \"Let's collaborate!\" You follow up. Silence. Not because they didn't care — because there's no system for what comes next.",
    },
    {
      text: "But it's not just conferences. You share your paper on LinkedIn. A few likes from people you already know. Zero from the people who could actually move your work forward. A flat PDF gives readers no way to act.",
    },
    {
      text: "The people who could help — collaborators, mentors, students, funders — are out there. Many are one or two warm introductions away. But there's no bridge between your work and their attention.",
    },
  ],
  pullQuote: {
    text: "\"I don't know of many successful collaborations that started with a cold email.\"",
    source: "— r/PhD",
  },
};

export const SOLUTION = {
  heading: "A home for your research that actually works for you.",
  items: [
    {
      title: "Project pages, not PDFs",
      description:
        "Something worth sharing — not a paywalled link that leads to a dead end.",
      icon: "page" as const,
    },
    {
      title: "Say what you actually need",
      description:
        "Structured asks so people know exactly how they can help — collaborators, recruits, expertise, funding.",
      icon: "ask" as const,
    },
    {
      title: "Warm intros, not cold emails",
      description:
        "Introductions that come with context, through people who already know you.",
      icon: "intro" as const,
    },
  ],
};

export const HOW_IT_WORKS = {
  heading: "Three steps. Two minutes. One link.",
  steps: [
    {
      number: "01",
      title: "Share what you've got",
      description:
        "Upload your poster, paper, abstract, or paste a link. We turn it into a clean project page.",
    },
    {
      number: "02",
      title: "Tell people what you need",
      description:
        "Add structured asks — collaborators, student recruits, specific expertise, funding leads.",
    },
    {
      number: "03",
      title: "Share it everywhere",
      description:
        "Conference, LinkedIn, email signature — interest flows back to you, organized and actionable.",
    },
  ],
};

export const WHO_ITS_FOR = {
  heading: "Built for the researchers who need it most.",
  personas: [
    {
      title: "Grad students & postdocs",
      description:
        "You represent your lab at conferences and online. Your network is still small. Glialink gives your work reach beyond your advisor's rolodex.",
      icon: "student" as const,
    },
    {
      title: "Conference presenters",
      description:
        "Your poster session is 3 hours. The people who need to see your work are everywhere. Give your research a permanent, shareable home.",
      icon: "presenter" as const,
    },
    {
      title: "Principal Investigators",
      description:
        "Your trainees are your lab's ambassadors. Give them a better tool than a PDF and a QR code linking to a paywall.",
      icon: "pi" as const,
    },
  ],
};

export const MISSION = {
  heading: "We're researchers too. Here's why we're building this.",
  paragraphs: [
    "We're students at Brown who watched these problems play out in our own research. Lost follow-ups after every conference. LinkedIn posts that vanish into the feed. Cold emails that go nowhere.",
    "We believe research shouldn't operate in silos. The outdated ways researchers connect aren't enough — especially now, when funding is under pressure and the ecosystem needs to come together more than ever.",
    "So we're building the first project-sharing network where researchers communicate their work in digestible ways, find collaborators through warm paths, and make their impact visible beyond citation counts.",
  ],
  whyUs:
    "Why trust a team of students? Because we're inside the problem. No legacy models to protect. Not another ResearchGate. Built on 30+ researcher interviews and a genuine belief that academia's connection layer is broken.",
};

export const PROOF_BAR = {
  stats: [
    {
      value: "~10",
      label: "Average readers per published paper",
    },
    {
      value: "82%",
      label: "Of papers are never cited",
    },
    {
      value: "90%",
      label: "Of researchers use social media professionally",
    },
  ],
};

export const SIGNUP = {
  heading: "Come build this with us.",
  sub: "Not a waitlist — a seat at the table. Join early and help shape what Glialink becomes.",
  placeholder: "your@email.edu",
  cta: "Get early access",
  successHeading: "You're in.",
  successMessage:
    "We'll be in touch soon. Know someone who'd care about this?",
  shareButton: "Copy link to share",
  shareCopied: "Link copied!",
};

export const SURVEY = {
  intro: "Help us understand your research better (1 min)",
  careerStage: {
    label: "Career stage",
    options: [
      { value: "phd", label: "PhD student" },
      { value: "postdoc", label: "Postdoc" },
      { value: "faculty", label: "Faculty" },
      { value: "industry_researcher", label: "Industry researcher" },
      { value: "other", label: "Other" },
    ],
  },
  field: {
    label: "Research field",
    placeholder: "e.g., Neuroscience, Biophysics, Climate Science…",
  },
  institutionType: {
    label: "Institution type",
    options: [
      { value: "r1_university", label: "R1 University" },
      { value: "smaller_college", label: "Smaller college" },
      { value: "industry", label: "Industry" },
      { value: "government_lab", label: "Government lab" },
      { value: "other", label: "Other" },
    ],
  },
  biggestChallenge: {
    label: "What's the biggest challenge you face sharing your research outside your immediate network?",
    placeholder: "Optional — share as much or as little as you'd like.",
  },
  submit: "Submit",
  submitting: "Submitting…",
};

export const BOOK_CALL = {
  heading: "Talk to the team.",
  sub: "Have questions or want to learn more? Book a 15-minute call with us — we'd love to hear about your research.",
  cta: "Book a 15-min call",
  ctaSub: "Pick a time that works for you.",
  // Calendly scheduling URL (public — safe to expose to client)
  calendlyUrl: "https://calendly.com/salter_arms-brown/30min",
};

export const FOOTER = {
  tagline: "Built by researchers, for researchers.",
  org: "Brown University",
  contactEmail: "team@glialink.com",
};
