"use client";

import { useState, useEffect, type FormEvent } from "react";
import { SIGNUP } from "@/lib/copy";
import { event } from "@/lib/analytics";
import { captureUTM, getStoredUTM } from "@/lib/utm";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    captureUTM();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError("");
    event("form_submit", { email_domain: email.split("@")[1] || "" });

    const utm = getStoredUTM();
    const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

    if (!formEndpoint) {
      // No endpoint configured — just show success for dev/testing
      setSubmitted(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          ...utm,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    event("copy_link");
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
                onFocus={() => event("form_start")}
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
