"use client";

import { useState, useEffect, type FormEvent } from "react";
import { SIGNUP, SURVEY } from "@/lib/copy";
import { event } from "@/lib/analytics";
import { getAnalyticsContext } from "@/lib/utm";
import { getVariant } from "@/lib/variants";

interface SurveyResponse {
  careerStage: string;
  field: string;
  institutionType: string;
  biggestChallenge: string;
}

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<string>("control");
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [survey, setSurvey] = useState<SurveyResponse>({
    careerStage: "",
    field: "",
    institutionType: "",
    biggestChallenge: "",
  });

  useEffect(() => {
    const v = getVariant();
    setVariant(v);
  }, []);

  const scrollToBookCall = () => {
    document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");

    const emailDomain = email.split("@")[1] || "";
    event("form_submit", { email_domain: emailDomain, variant });

    const context = getAnalyticsContext();

    const formEndpoint =
      process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
      `${typeof window !== "undefined" ? window.location.origin : ""}/api/signup`;

    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          institution,
          email,
          phone,
          ...context,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
      setShowSurvey(true);
      event("form_submit_success", { variant });
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong. Please try again.");
      event("form_submit_error", { variant, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (surveyLoading) return;

    setSurveyLoading(true);

    event("survey_submit", {
      career_stage: survey.careerStage,
      field: survey.field,
      institution_type: survey.institutionType,
      biggest_challenge: survey.biggestChallenge,
      variant,
    });

    const surveyEndpoint =
      process.env.NEXT_PUBLIC_SURVEY_ENDPOINT ||
      `${typeof window !== "undefined" ? window.location.origin : ""}/api/survey`;

    try {
      await fetch(surveyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...survey,
          variant,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Survey submission error:", err);
    }

    setShowSurvey(false);
    setSurveyLoading(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    event("copy_link", { variant });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="signup" className="relative overflow-hidden bg-ink px-6 py-20 md:px-12 lg:px-20">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/8 blur-3xl" />

      <div className="relative mx-auto max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white md:text-4xl">
          {SIGNUP.heading}
        </h2>
        <p className="mt-4 text-lg text-white/70">{SIGNUP.sub}</p>

        {/* Three action buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={scrollToBookCall}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {SIGNUP.ctaSchedule}
          </button>
          <button
            onClick={handleCopyLink}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {copied ? SIGNUP.shareCopied : SIGNUP.ctaShare}
          </button>
        </div>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-widest">or join the waitlist</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Waitlist form */}
        <div className="mt-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={SIGNUP.namePlaceholder}
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition-all focus:border-white/50 focus:ring-2 focus:ring-white/10"
                />
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder={SIGNUP.institutionPlaceholder}
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition-all focus:border-white/50 focus:ring-2 focus:ring-white/10"
                />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => event("form_start", { variant })}
                placeholder={SIGNUP.placeholder}
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition-all focus:border-white/50 focus:ring-2 focus:ring-white/10"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={SIGNUP.phonePlaceholder}
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition-all focus:border-white/50 focus:ring-2 focus:ring-white/10"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-white px-8 py-3.5 text-base font-semibold text-purple-dark shadow-lg transition-all hover:shadow-xl hover:bg-purple-light disabled:opacity-60"
              >
                {loading ? "..." : SIGNUP.cta}
              </button>
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </form>
          ) : showSurvey ? (
            <form onSubmit={handleSurveySubmit} className="mt-2 space-y-4 text-left">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center mb-6">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
                  {SIGNUP.successHeading}
                </h3>
                <p className="mt-2 text-white/70">{SIGNUP.successMessage}</p>
              </div>

              <p className="text-sm text-white/60 text-center mb-4">{SURVEY.intro}</p>

              {/* Career stage */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {SURVEY.careerStage.label} *
                </label>
                <select
                  value={survey.careerStage}
                  onChange={(e) => setSurvey({ ...survey, careerStage: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all"
                  required
                >
                  <option value="" className="text-ink bg-white">Select…</option>
                  {SURVEY.careerStage.options.map((o) => (
                    <option key={o.value} value={o.value} className="text-ink bg-white">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Research field */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {SURVEY.field.label} *
                </label>
                <input
                  type="text"
                  value={survey.field}
                  onChange={(e) => setSurvey({ ...survey, field: e.target.value })}
                  placeholder={SURVEY.field.placeholder}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all"
                  required
                />
              </div>

              {/* Institution type */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {SURVEY.institutionType.label} *
                </label>
                <select
                  value={survey.institutionType}
                  onChange={(e) =>
                    setSurvey({ ...survey, institutionType: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all"
                  required
                >
                  <option value="" className="text-ink bg-white">Select…</option>
                  {SURVEY.institutionType.options.map((o) => (
                    <option key={o.value} value={o.value} className="text-ink bg-white">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Biggest challenge */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {SURVEY.biggestChallenge.label}
                  <span className="ml-1 text-white/40 font-normal">(optional)</span>
                </label>
                <textarea
                  value={survey.biggestChallenge}
                  onChange={(e) =>
                    setSurvey({ ...survey, biggestChallenge: e.target.value })
                  }
                  placeholder={SURVEY.biggestChallenge.placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={surveyLoading}
                className="w-full rounded-full bg-white px-6 py-3 text-purple-dark font-medium shadow-lg transition-all hover:bg-purple-light disabled:opacity-60 mt-6"
              >
                {surveyLoading ? SURVEY.submitting : SURVEY.submit}
              </button>
            </form>
          ) : (
            <div className="mt-2 space-y-4">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-white">
                  {SIGNUP.successHeading}
                </h3>
                <p className="mt-2 text-white/70">{SIGNUP.successMessage}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                {copied ? SIGNUP.shareCopied : SIGNUP.shareButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
