// ============================================================
// GLIALINK LANDING PAGE — ALL EDITABLE COPY
// ============================================================
// To change ANY text on the landing page, edit this file only.
// Components pull from these constants. No hardcoded strings.
// After editing, commit and push — Vercel auto-deploys in ~60s.
// ============================================================

export const SITE = {
  title: "Glialink — Share your research the right way.",
  description:
    "Glialink turns your paper, abstract, and link into a living online page with clear asks and active context, so your network knows who can help, and how to help.",
  url: "https://glialink.com",
};

export const NAV = {
  logoAlt: "Glialink logo",
  about: "About",
  demo: "Demo",
  bookCall: "Book a Call",
};

// ── SECTION 1 — HERO ────────────────────────────────────────
export const HERO = {
  headline:
    "Turn your research into real connections.",
  sub: "Glialink turns your paper, abstract, and link into a living online page with clear asks and active context, so your network knows who can help, and how to help.",
  cta: "Get early access",
  ctaSecondary: "See an example →",
  ctaSub:
    "We're students and would appreciate your feedback. Help us determine how Glialink supports your work.",
};

// ── SECTION 2 — THE PROBLEM ─────────────────────────────────
export const PROBLEM = {
  heading:
    "Your publications are hidden, dense, and static. There are people who want to help, but you just aren't giving them the chance.",
  beats: [
    {
      title: "At conferences",
      text: "you remember the conversations you didn't get to have. The few contacts you made have no easy way to follow up.",
    },
    {
      title: "After publishing",
      text: "your social posts get fifteen views. Supporters exist, they just can't engage with a 20-page PDF.",
    },
    {
      title: "Finding collaborators",
      text: "whether it's a student, a co-author, or a domain expert, the right connection is always one person away with no reliable path to get there.",
    },
  ],
};

// ── SECTION 3 — THE PRODUCT ─────────────────────────────────
export const SOLUTION = {
  heading: "A home for your research that enables real collaboration.",
  items: [
    {
      title: "Project pages, not PDFs",
      description:
        "Something worth sharing — future directions, your mission, concise summaries. Your work, made legible to anyone.",
      icon: "page" as const,
    },
    {
      title: "Say what you actually need",
      description:
        "Structured asks so people know exactly how they can help: collaborators, student recruits, specific expertise, funding leads.",
      icon: "ask" as const,
    },
    {
      title: "Warm intros, not cold emails",
      description:
        "Introductions that come with context, through people who already trust each other. Your second-degree network, activated.",
      icon: "intro" as const,
    },
  ],
};

// ── SECTION 4 — HOW IT WORKS ────────────────────────────────
export const HOW_IT_WORKS = {
  heading: "Three steps. Two minutes. One link.",
  steps: [
    {
      number: "01",
      title: "Share what you already have",
      description:
        "Upload your poster, paper, or abstract — or paste a link. We turn it into a clean project page that actually represents your work.",
    },
    {
      number: "02",
      title: "Tell us what you need",
      description:
        "Add structured asks: collaborators, student volunteers, specific expertise, funding leads. Your colleagues will know exactly who can help.",
    },
    {
      number: "03",
      title: "Share it everywhere",
      description:
        "Conference QR code. Email signature. Social feeds. One link — your work, your asks, your story.",
    },
  ],
};

// ── SECTION 5 — WHO IT'S FOR ────────────────────────────────
export const WHO_ITS_FOR = {
  heading:
    "Built for the researchers who want to mobilize their research but don't know how",
  personas: [
    {
      title: "Student research assistants",
      description:
        "You're doing important work, but don't know where and how to share it. You are invisible to prospective labs, and want to find opportunities authentically — not through cold emails. You see other ways to support your lab — recruiting participants, recommending research assistants, maintaining an online presence — but legacy research norms keep you confined.",
      icon: "assistant" as const,
      quote:
        "\"I've recently been through that whole process of trying to find a lab, emailing a million PIs, and none of them email you back. You're like, okay, what do I do now?\"",
      quoteSource: "Neuroscience PhD student, Stony Brook University",
    },
    {
      title: "Grad students & postdocs",
      description:
        "You're seeking more opportunities to publish, scale your impact, and build support for your research. You see the value of online personal branding, but your network is spread across 5 platforms. Your work's reach is constrained to your advisor's contacts, and your supporters don't exist beyond your lab mates.",
      icon: "student" as const,
      quote:
        "Over 95% of academics in one survey use at least one social or networking site professionally, and about 70% agree that they need to do more promotion of their work via such channels.",
      quoteSource: "¹",
    },
    {
      title: "Conference presenters",
      description:
        "Your publication took years, and you spent days making it presentable just for the 10 attendees to see. Your networks exist online, but your work exists in person. For those who do connect? They have no idea how they can help, and you rarely follow up.",
      icon: "presenter" as const,
      quote:
        "62.5% said immediately after the event they would keep in touch, but at a 3-month follow-up only 25% still agreed — and 37.5% disagreed or strongly disagreed.",
      quoteSource: "²",
    },
    {
      title: "Principal Investigators",
      description:
        "You have spent years building connections at conferences and online, just to maintain a few. Your supporting cast doesn't see or understand your work and is given no real opportunity to help. Meanwhile, your lab wants to help you build an online presence, surface meaningful collaborations, and find purposeful recruits — you just haven't considered the possibility.",
      icon: "pi" as const,
      quote:
        "\"Faculty have a very hard time finding good people… finding people who are a good fit for their programs.\"",
      quoteSource: "Researcher at the Medical University of South Carolina",
    },
  ],
};

// ── SECTION 6 — MISSION / TRUST ─────────────────────────────
export const MISSION = {
  heading: "Here is why we are building this.",
  paragraphs: [
    "I'm Salter, a neuroscience student at Brown who was once enraptured by the wide world of research. I saw a potential career of innovation with the prospect of building a better world. I thought it was my path to impact.",
    "I was wrong.",
    "Turned away at every corner, I struggled to find my fit and found no way in. Hundreds of outdated lab websites scoured and dozens of cold emails sent, I obtained three different research positions that offered zero sense of belonging.",
    "An impenetrable field, inexplicable to exactly those it's built to support. Closed to those who want to help.",
    "I want to change that.",
    "After a year of obsessing over this problem and countless interviews and conversations with researchers, I reinforced my belief that the infrastructure for scientific connection is broken.",
    "At Glialink, we believe a visible research ecosystem is a supportable one. We want to give students a clear path into the field, the public a sense of its importance, physicians clear takeaways from the work, and researchers a way to reliably lean on someone other than themselves.",
    "A team of current and former student researchers, we are building what we wish existed.",
    "With the long-term vision of an active online lab and researcher directory with clearly communicated needs, wants, and offerings, we are creating a more visible, coordinated, and supportable research ecosystem.",
    "It all starts with one active project, one visible researcher profile, and your ideas and feedback.",
  ],
};

// ── SECTION 7 — THE NUMBERS ─────────────────────────────────
export const PROOF_BAR = {
  stats: [
    {
      value: "60%",
      label: "of academics say their research is difficult to use outside academia",
      footnote: "45% also agree that papers are too long. In a 2021 survey of 1,500 academics across 100+ countries. ³",
    },
    {
      value: "3 / 24",
      label: "Median Twitter mentions / Mendeley readers per article",
      footnote:
        "Among 36,780 articles in emergency medicine journals (2013–2023) — only among articles that received any social attention at all. ⁴",
    },
    {
      value: "~1/3",
      label: "of papers not cited within 5 years",
      footnote:
        "In the social and natural sciences. Noncitation rates as high as 82% in the humanities. ⁵",
    },
    {
      value: "95%",
      label: "of doctors want to learn about new clinical research",
      footnote:
        "70% feel overwhelmed by the volume — Doximity survey of 600 physicians across oncology, neurology, and more. ⁶",
    },
    {
      value: "50+",
      label: "researcher interviews at Brown, and beyond",
      footnote: "Relentless curiosity, by yours truly ;)",
    },
  ],
};

// ── SECTION 8 — FINAL CTA ───────────────────────────────────
export const SIGNUP = {
  heading: "Join the waitlist, share our website, or speak to a founder.",
  sub: "We would love to meet researchers struggling with the outlined problems above and ask a few questions to learn from your experiences. From our lab to yours, we deeply appreciate your support.",
  namePlaceholder: "Your name",
  institutionPlaceholder: "Your institution",
  placeholder: "your@email.edu",
  phonePlaceholder: "Phone number (optional)",
  cta: "Join the waitlist",
  ctaSchedule: "Schedule a 15-min call",
  ctaShare: "Share the page",
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
  calendlyUrl: "https://calendly.com/salter_arms-brown/new-meeting?month=2026-03",
};

export const FOOTER = {
  tagline: "Built by researchers, for researchers.",
  org: "Brown University",
  contactEmail: "team@glialink.com",
};
