"use client";

import { useState, useEffect, type FormEvent } from "react";
import { SIGNUP } from "@/lib/copy";
import { event } from "@/lib/analytics";
import { getAnalyticsContext, getStoredUTM } from "@/lib/utm";
import { getVariant } from "@/lib/variants";

interface SurveyResponse {
  careerStage: string;
  field: string;
  interestReason: string;
  institutionType: string;
}

export default function SignUpForm() {
  const [email, setEmail] = useState("");
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
    interestReason: "",
    institutionType: "",
  });

  useEffect(() => {
    const v = getVariant();
    setVariant(v);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");

    const emailDomain = email.split("@")[1] || "";
    event("form_submit", { email_domain: emailDomain, variant });

    const context = getAnalyticsContext();
    
    // Auto-detect endpoint: use configured value or current domain
    const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || 
      `${typeof window !== 'undefined' ? window.location.origin : ''}/api/signup`;

    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
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
      interest_reason: survey.interestReason,
      institution_type: survey.institutionType,
      variant,
    });

    // Auto-detect endpoint: use configured value or current domain
    const surveyEndpoint = process.env.NEXT_PUBLIC_SURVEY_ENDPOINT || 
      `${typeof window !== 'undefined' ? window.location.origin : ''}/api/survey`;

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
    <section id="signup" className="bg-white px-6 py-20 md:px-12 lg:px-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {SIGNUP.heading}
        </h2>
        <p className="mt-4 text-lg text-gray">{SIGNUP.sub}</p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => event("form_start", { variant })}
                placeholder={SIGNUP.placeholder}
                className="flex-1 rounded-full border border-border bg-white px-5 py-3.5 text-base text-ink placeholder:text-gray-light outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-b from-purple to-purple-dark px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple/25 transition-all hover:shadow-xl hover:shadow-purple/30 hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "..." : SIGNUP.cta}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-500">{error}</p>
            )}
          </form>
        ) : showSurvey ? (
          <form onSubmit={handleSurveySubmit} className="mt-8 space-y-4 text-left">
            <div className="rounded-2xl border border-purple/20 bg-purple-light p-6 text-center mb-6">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-ink">
                {SIGNUP.successHeading}
              </h3>
              <p className="mt-2 text-gray">{SIGNUP.successMessage}</p>
            </div>

            <p className="text-sm text-gray text-center mb-4">
              Help us understand your research better (1 min)
            </p>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Career Stage *
              </label>
              <select
                value={survey.careerStage}
                onChange={(e) =>
                  setSurvey({ ...survey, careerStage: e.target.value })
                }
                className="w-full rounded-lg border border-border px-4 py-2.5 text-ink bg-white focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              >
                <option value="">Select...</option>
                <option value="undergrad">Undergraduate Student</option>
                <option value="grad">Graduate Student</option>
                <option value="postdoc">Postdoc / Early Career</option>
                <option value="faculty">Faculty</option>
                <option value="industry">Industry Researcher</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Field of Research *
              </label>
              <input
                type="text"
                value={survey.field}
                onChange={(e) => setSurvey({ ...survey, field: e.target.value })}
                placeholder="e.g., Neuroscience, Biophysics, etc."
                className="w-full rounded-lg border border-border px-4 py-2.5 text-ink bg-white placeholder:text-gray-light focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Primary Interest Reason *
              </label>
              <select
                value={survey.interestReason}
                onChange={(e) =>
                  setSurvey({ ...survey, interestReason: e.target.value })
                }
                className="w-full rounded-lg border border-border px-4 py-2.5 text-ink bg-white focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              >
                <option value="">Select...</option>
                <option value="collaboration">Find collaborators</option>
                <option value="visibility">Increase visibility</option>
                <option value="funding">Find funding opportunities</option>
                <option value="feedback">Get feedback on research</option>
                <option value="networking">Professional networking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Institution Type *
              </label>
              <select
                value={survey.institutionType}
                onChange={(e) =>
                  setSurvey({ ...survey, institutionType: e.target.value })
                }
                className="w-full rounded-lg border border-border px-4 py-2.5 text-ink bg-white focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              >
                <option value="">Select...</option>
                <option value="university">University</option>
                <option value="research_institute">Research Institute</option>
                <option value="industry_research">Industry Research</option>
                <option value="nonprofit">Nonprofit / NGO</option>
                <option value="government">Government Lab</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={surveyLoading}
              className="w-full rounded-full bg-gradient-to-b from-purple to-purple-dark px-6 py-3 text-white font-medium shadow-lg shadow-purple/25 transition-all hover:brightness-110 disabled:opacity-60 mt-6"
            >
              {surveyLoading ? "Submitting..." : "Submit"}
            </button>

            <p className="text-xs text-gray-light text-center">
              Skip this step →
            </p>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-purple/20 bg-purple-light p-6">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-ink">
                {SIGNUP.successHeading}
              </h3>
              <p className="mt-2 text-gray">{SIGNUP.successMessage}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="rounded-full border border-purple/30 px-6 py-2.5 text-sm font-medium text-purple transition-colors hover:bg-purple-light"
            >
              {copied ? SIGNUP.shareCopied : SIGNUP.shareButton}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
