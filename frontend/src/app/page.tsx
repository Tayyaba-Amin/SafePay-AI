"use client";

import AnalyzerCard from "@/components/AnalyzerCard";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === "dark";
  const isUrdu = language === "ur";

  return (
    <>
      {/* ───── Hero Section ───── */}
      <section className={isDark ? "bg-[var(--background-secondary)]" : "bg-white"}>
        <div className="max-w-[1280px] mx-auto px-6 pt-14 pb-12 sm:pt-18 sm:pb-14 lg:pt-20 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* ── Left: Text Content ── */}
            <div className="text-center lg:text-left animate-fade-in-up">
              {/* Eyebrow badge */}
              <div className={`inline-flex items-center gap-2 rounded-full text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 mb-5 border ${
                isDark
                  ? "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--info-border)]"
                  : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
              }`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                AI-Powered Payment Security
              </div>

              <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold text-[var(--foreground)] tracking-tight leading-[1.12] mb-5">
                Stay{" "}
                <span className="text-[var(--primary)]">Safe</span>{" "}
                Before You Pay.
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-3 max-w-[540px] mx-auto lg:mx-0">
                SafePay AI analyzes payment receipts, suspicious messages, and voice recordings to help detect potential scams before they cause financial loss.
              </p>

              <p className={`text-sm max-w-md mx-auto lg:mx-0 ${isUrdu ? "urdu-text" : ""}`} style={{ color: "var(--placeholder)" }} dir={isUrdu ? "rtl" : "ltr"}>
                {isUrdu
                  ? "پورے ایپ کے لیے زبان تبدیل کرنے کے لیے اوپر زبان کا انتخاب کریں"
                  : "Select your language from the header to switch across all modules"
                }
              </p>

              {/* CTA */}
              <div className="mt-7 animate-fade-in-up stagger-2">
                <a
                  href="#analyzers"
                  className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-7 py-3 rounded-[10px] text-sm transition-colors duration-150 hover:bg-[var(--primary-hover)] active:bg-[var(--primary-pressed)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Start Analyzing
                </a>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 sm:gap-10 animate-fade-in-up stagger-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--foreground)]">3</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Analyzers</p>
                </div>
                <div className={`w-px h-10 ${isDark ? "bg-[var(--border)]" : "bg-[#E2E8F0]"}`} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--foreground)]">EN/UR</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Bilingual</p>
                </div>
                <div className={`w-px h-10 ${isDark ? "bg-[var(--border)]" : "bg-[#E2E8F0]"}`} />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--foreground)]">0</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">Data Stored</p>
                </div>
              </div>

              {/* ── Mobile Security Visual (compact, visible below lg) ── */}
              <div className={`mt-10 lg:hidden flex justify-center animate-fade-in-up stagger-4`}>
                <div className="relative w-[240px] h-[210px]">
                  {/* Orbit ring */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] rounded-full border border-dashed ${
                    isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"
                  }`} style={{ opacity: 0.3 }} />

                  {/* Central Shield */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl flex items-center justify-center animate-shield-pulse ${
                    isDark
                      ? "bg-[var(--primary-light)] border border-[var(--info-border)]"
                      : "bg-[#EFF6FF] border border-[#BFDBFE]"
                  }`}>
                    <svg className="w-9 h-9 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>

                  {/* Receipt — top */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl flex items-center justify-center border ${
                    isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                  }`}>
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>
                  {/* Connection line — receipt */}
                  <div className={`absolute top-[54px] left-1/2 -translate-x-px w-0.5 h-8 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4 }} />

                  {/* Message — bottom-left */}
                  <div className={`absolute bottom-6 left-2 w-11 h-11 rounded-xl flex items-center justify-center border ${
                    isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                  }`}>
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  {/* Connection line — message */}
                  <div className={`absolute bottom-[68px] left-[52px] w-8 h-0.5 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4, transform: "rotate(-30deg)", transformOrigin: "left center" }} />

                  {/* Voice — bottom-right */}
                  <div className={`absolute bottom-6 right-2 w-11 h-11 rounded-xl flex items-center justify-center border ${
                    isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                  }`}>
                    <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  {/* Connection line — voice */}
                  <div className={`absolute bottom-[68px] right-[52px] w-8 h-0.5 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4, transform: "rotate(30deg)", transformOrigin: "right center" }} />

                  {/* Risk badge — bottom center */}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    isDark
                      ? "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--info-border)]"
                      : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                  }`}>
                    Risk Assessment
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Security Visual (desktop only) ── */}
            <div className="hidden lg:flex items-center justify-center mt-12 lg:mt-0 animate-fade-in-up stagger-3">
              <div className="relative w-[340px] h-[340px]">
                {/* Central Shield */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-3xl flex items-center justify-center animate-shield-pulse ${
                  isDark
                    ? "bg-[var(--primary-light)] border border-[var(--info-border)]"
                    : "bg-[#EFF6FF] border border-[#BFDBFE]"
                }`}>
                  <svg className="w-12 h-12 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>

                {/* Orbiting badges */}
                {/* Receipt — top */}
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                }`}>
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                {/* Connection line — receipt to shield */}
                <div className={`absolute top-[72px] left-1/2 -translate-x-px w-0.5 h-10 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4 }} />

                {/* Message — bottom-left */}
                <div className={`absolute bottom-8 left-6 w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                }`}>
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                {/* Connection line — message to shield */}
                <div className={`absolute bottom-[86px] left-[72px] w-10 h-0.5 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4, transform: "rotate(-35deg)", transformOrigin: "left center" }} />

                {/* Voice — bottom-right */}
                <div className={`absolute bottom-8 right-6 w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0] shadow-sm"
                }`}>
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                {/* Connection line — voice to shield */}
                <div className={`absolute bottom-[86px] right-[72px] w-10 h-0.5 ${isDark ? "bg-[var(--border)]" : "bg-[#CBD5E1]"}`} style={{ opacity: 0.4, transform: "rotate(35deg)", transformOrigin: "right center" }} />

                {/* Risk badge — bottom center */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isDark
                    ? "bg-[var(--primary-light)] text-[var(--primary)] border-[var(--info-border)]"
                    : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
                }`}>
                  Risk Assessment
                </div>

                {/* Subtle orbit ring */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-dashed ${
                  isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"
                }`} style={{ opacity: 0.3 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Disclaimer Bar ───── */}
      <section className={`border-y ${isDark ? "bg-[var(--info-bg)] border-[var(--info-border)]" : "bg-[#EFF6FF] border-[#BFDBFE]"}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className={`text-sm leading-relaxed ${isDark ? "text-[var(--info-text)]" : "text-[#1E40AF]"}`}>
            SafePay AI provides <strong>AI-based risk awareness</strong> and does not replace
            official verification from your bank, wallet, or payment provider.{" "}
            <strong>Never share</strong> OTPs, PINs, passwords, or account credentials.
          </p>
        </div>
      </section>

      {/* ───── Trust Strip ───── */}
      <section className={`border-b ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-5">
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-2.5 text-xs sm:text-sm">
            {[
              { label: "Upload", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg> },
              { label: "AI Analyzes", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg> },
              { label: "Risk Detected", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> },
              { label: "Stay Protected", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
            ].map((item, i, arr) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span className="text-[var(--primary)]">{item.icon}</span>
                <span className={`font-medium ${isDark ? "text-[var(--text-secondary)]" : "text-[#475569]"}`}>{item.label}</span>
                {i < arr.length - 1 && (
                  <svg className="w-3.5 h-3.5 mx-1 flex-shrink-0" style={{ color: "var(--placeholder)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Analyzer Section ───── */}
      <section id="analyzers" className="max-w-[1280px] mx-auto px-6 py-14 sm:py-16">
        <div className="text-center mb-10">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${isDark ? "text-[var(--primary)]" : "text-[#2563EB]"}`}>
            Verify Before You Pay
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-2">
            Choose an Analyzer
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Select the type of content you want to check for fraud indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyzerCard
            title="Receipt Risk Analyzer"
            titleUrdu="رسید کا تجزیہ"
            description="Upload a payment receipt screenshot. AI checks for tampered amounts, fake merchants, and format inconsistencies."
            href="/receipt"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            }
          />
          <AnalyzerCard
            title="Scam Message Analyzer"
            titleUrdu="اسکیم پیغام کا تجزیہ"
            description="Paste a suspicious SMS or WhatsApp message. AI detects phishing links, urgency tactics, and impersonation."
            href="/message"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            }
          />
          <AnalyzerCard
            title="Voice Scam Analyzer"
            titleUrdu="آواز اسکیم کا تجزیہ"
            description="Upload a recording of a suspicious call. AI transcribes it and identifies impersonation and pressure tactics."
            href="/voice"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <p className={`text-xs font-semibold uppercase tracking-widest text-center mb-2 ${isDark ? "text-[var(--primary)]" : "text-[#2563EB]"}`}>
          Protect Yourself in 3 Steps
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)] mb-2">
          How It Works
        </h2>
        <p className="text-center text-[var(--text-secondary)] text-sm max-w-lg mx-auto mb-12">
          Three simple steps to protect yourself from digital payment fraud
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              step: "1",
              title: "Upload",
              desc: "Take a screenshot or recording of the suspicious content and upload it to the relevant analyzer.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "AI Analysis",
              desc: "Our AI examines the content for known fraud patterns, scam indicators, and social engineering tactics.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Get Results",
              desc: "Receive a clear risk assessment with plain-language explanation and recommended safe actions.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className={`relative w-12 h-12 rounded-xl text-white flex items-center justify-center mx-auto mb-4 transition-colors ${
                isDark
                  ? "bg-[var(--primary)] group-hover:bg-[var(--primary-hover)]"
                  : "bg-[#2563EB] group-hover:bg-[#1D4ED8]"
              }`}>
                {item.icon}
                <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-sm border ${
                  isDark
                    ? "bg-[var(--card-elevated)] text-[var(--foreground)] border-[var(--border)]"
                    : "bg-white text-[#0F172A] border-[#E2E8F0]"
                }`}>
                  {item.step}
                </span>
              </div>
              <h3 className="font-bold text-[var(--foreground)] mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Trust / Privacy ───── */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className={`rounded-2xl border p-8 ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          <h3 className="text-center text-lg font-bold text-[var(--foreground)] mb-8">
            Your Privacy &amp; Safety
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "No Data Stored",
                desc: "Files are analyzed in real-time and never saved to any server.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ),
              },
              {
                title: "Never Asks Secrets",
                desc: "We never request OTPs, PINs, passwords, or account credentials.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
              {
                title: "Awareness Only",
                desc: "AI-generated results may have errors. Always verify with your bank before taking action.",
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-[var(--primary-light)] text-[var(--primary)]" : "bg-[#EFF6FF] text-[#2563EB]"
                }`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)] text-sm">{item.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
