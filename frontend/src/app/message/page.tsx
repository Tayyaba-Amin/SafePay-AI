"use client";

import { useState } from "react";
import Link from "next/link";
import AnalysisResultDisplay from "@/components/AnalysisResultDisplay";
import LoadingState from "@/components/LoadingState";
import { analyzeMessageText, type AnalysisResult } from "@/lib/api";
import { getMockResult } from "@/lib/mock";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const MIN_LENGTH = 10;
const MAX_LENGTH = 5000;

const SAMPLE_MESSAGES = [
  {
    label: "Suspicious bank SMS",
    text: "Dear customer, your wallet account will be blocked today. Verify your account immediately using this link: bit.ly/verify-acc. Reply with OTP to confirm.",
  },
  {
    label: "Fake prize message",
    text: "Congratulations! You have won PKR 500,000 in the JazzCash lucky draw. Send your CNIC number and account details to claim your prize before midnight.",
  },
  {
    label: "Legitimate bank notification",
    text: "HBL Alert: Your account statement for August 2026 is now available on the HBL Mobile app. Log in to view. No action is required.",
  },
];

export default function MessageAnalyzerPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const charCount = text.trim().length;
  const isValid = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH;

  async function handleAnalyze() {
    if (!isValid) return;
    setLoading(true);
    setResult(null);
    setIsMock(false);
    try {
      const res = await analyzeMessageText(text.trim());
      setResult(res);
    } catch {
      setIsMock(true);
      const mock = await getMockResult("message");
      setResult(mock);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setResult(null);
    setIsMock(false);
  }

  function loadSample(sample: string) {
    setText(sample);
    setResult(null);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5 text-[var(--placeholder)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)] font-medium">Message Analyzer</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isDark ? "bg-[var(--primary-light)] text-[var(--primary)]" : "bg-[#EFF6FF] text-[#2563EB]"
        }`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-1">Scam Message Analyzer</h1>
          {language === "ur" ? (
            <p className="text-sm text-[var(--muted)] urdu-text" dir="rtl" lang="ur">اسکیم پیغام کا تجزیہ</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">Paste a suspicious message for AI-powered scam detection</p>
          )}
        </div>
      </div>

      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        Paste an SMS, WhatsApp message, or suspicious payment-related text. Our AI will analyze it for phishing, impersonation, and social engineering tactics.
      </p>
      {/* Privacy notice */}
      <div className={`mb-8 rounded-xl px-4 py-2.5 text-xs flex items-start gap-2 ${
        isDark ? "bg-[var(--info-bg)] border border-[var(--info-border)] text-[var(--info-text)]" : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span>
          <strong>Privacy:</strong> SafePay AI never requests, stores, or repeats passwords, OTPs, PINs, or other credentials mentioned in recordings. Audio is processed temporarily and not saved.
        </span>
      </div>
      {/* Input Card */}
      {!result && (
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          {/* Sample messages */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2.5">Try a sample message</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_MESSAGES.map((s) => (
                <button
                  key={s.label}
                  onClick={() => loadSample(s.text)}
                  disabled={loading}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150 disabled:opacity-40 ${
                    isDark
                      ? "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]"
                      : "border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <label htmlFor="message-input" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
            Message Text
          </label>
          <textarea
            id="message-input"
            rows={7}
            maxLength={MAX_LENGTH}
            placeholder="Paste the suspicious message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            className={`w-full rounded-[10px] border px-4 py-3 text-sm transition-colors duration-150 resize-y focus:outline-none focus:ring-2 ${
              isDark
                ? "border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--placeholder)] focus:ring-[var(--primary-focus)] focus:border-[var(--primary)] disabled:bg-[var(--surface)] disabled:text-[var(--placeholder)] disabled:border-[var(--border)]"
                : "border-[#CBD5E1] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:ring-[#BFDBFE] focus:border-[#2563EB] disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:border-[#E2E8F0]"
            }`}
          />

          {/* Character count */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className={
              charCount < MIN_LENGTH
                ? "text-[var(--muted)]"
                : charCount > MAX_LENGTH
                  ? "text-[var(--risk-high)]"
                  : isDark ? "text-[var(--risk-low)]" : "text-[#16A34A]"
            }>
              {charCount < MIN_LENGTH
                ? `Minimum ${MIN_LENGTH} characters needed`
                : charCount > MAX_LENGTH
                  ? "Maximum length exceeded"
                  : "Ready to analyze"}
            </span>
            <span className="text-[var(--muted)] tabular-nums">
              {charCount} / {MAX_LENGTH}
            </span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!isValid || loading}
            className={`mt-5 w-full rounded-[10px] font-semibold py-3 transition-colors duration-150 disabled:cursor-not-allowed ${
              isDark
                ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-pressed)] disabled:bg-[var(--surface)] disabled:text-[var(--placeholder)]"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#CBD5E1] disabled:text-[#64748B]"
            }`}
          >
            {loading ? "Analyzing Message..." : "Analyze Message"}
          </button>
        </div>
      )}

      {loading && <LoadingState message="Scanning message for scam patterns..." />}

      {/* Result */}
      {result && !loading && (
        <div className={`mt-6 rounded-2xl border overflow-hidden ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          <div className="p-6">
            {isMock && (
              <div className={`mb-5 rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 ${
                isDark ? "bg-[var(--warning-bg)] border border-[var(--warning-border)] text-[var(--warning-text)]" : "bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]"
              }`}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Demo mode &mdash; showing sample result. Connect the backend API (with{" "}
                <code className={`font-mono px-1 rounded ${isDark ? "bg-[var(--warning-border)]" : "bg-[#FDE68A]"}`}>DASHSCOPE_API_KEY</code>) for real AI analysis.
              </div>
            )}

            {text && (
              <div className={`mb-6 rounded-xl p-4 ${isDark ? "bg-[var(--surface)] border border-[var(--border)]" : "bg-[#F8FAFC] border border-[#E2E8F0]"}`}>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold mb-1.5">Analyzed Message</p>
                <p className="text-sm leading-relaxed line-clamp-4" style={{ color: isDark ? "var(--text-secondary)" : "rgba(15,23,42,0.8)" }}>{text}</p>
              </div>
            )}

            {/* Result Header */}
            <div className="flex items-center mb-5">
              <p className={`text-xs font-semibold text-[var(--muted)] uppercase tracking-wider ${language === "ur" ? "urdu-text" : ""}`} dir={language === "ur" ? "rtl" : "ltr"}>
                {language === "ur" ? "تجزیہ کا نتیجہ" : "Analysis Result"}
              </p>
            </div>

            <AnalysisResultDisplay result={result} />

            <div className={`mt-8 rounded-xl px-4 py-3 text-xs flex items-start gap-2 ${
              isDark ? "bg-[var(--info-bg)] border border-[var(--info-border)] text-[var(--info-text)]" : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]"
            } ${language === "ur" ? "urdu-text" : ""}`} dir={language === "ur" ? "rtl" : "ltr"}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>
                {language === "ur"
                  ? "یہ تجزیہ AI پر مبنی ہے اور غلط ہو سکتا ہے۔ یہ آفیشل تصدیق نہیں ہے۔ ہمیشہ اپنے بینک یا والٹ فراہم کنندہ سے آزادانہ تصدیق کریں۔"
                  : <>This analysis is AI-generated and may contain errors. It does <strong>not</strong> constitute official verification. Always independently verify through your bank or wallet provider.</>
                }
              </span>
            </div>

            <button
              onClick={handleReset}
              className={`mt-6 w-full rounded-[10px] border text-sm font-medium py-2.5 transition-colors duration-150 ${
                isDark
                  ? "border-[var(--primary)] bg-[var(--card-bg)] text-[var(--primary)] hover:bg-[var(--primary-light)]"
                  : "border-[#BFDBFE] bg-white text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#93C5FD]"
              }`}
            >
              Analyze Another Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
