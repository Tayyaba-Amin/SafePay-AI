"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import AnalysisResultDisplay from "@/components/AnalysisResultDisplay";
import LoadingState from "@/components/LoadingState";
import { analyzeVoice, type AnalysisResult } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

export default function VoiceAnalyzerPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<"idle" | "transcribing" | "analyzing">("idle");
  const [uploaderKey, setUploaderKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(f: File) {
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
  }

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadingStage("transcribing");
    try {
      const res = await analyzeVoice(file);
      setResult(res);
    } catch (err) {
      // Show the actual error from the backend instead of falling back to mock data
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoadingStage("idle");
      setLoading(false);
    }
  }

  function handleReset() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setAudioUrl(null);
    setResult(null);
    setError(null);
    setLoadingStage("idle");
    setUploaderKey((k) => k + 1);
  }

  const loadingMessage =
    loadingStage === "transcribing"
      ? "Transcribing audio with Qwen3-ASR-Flash..."
      : loadingStage === "analyzing"
        ? "Analyzing transcript for scam indicators..."
        : "Processing voice recording...";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5 text-[var(--placeholder)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)] font-medium">Voice Analyzer</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isDark ? "bg-[var(--primary-light)] text-[var(--primary)]" : "bg-[#EFF6FF] text-[#2563EB]"
        }`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-1">Voice Scam Analyzer</h1>
          {language === "ur" ? (
            <p className="text-sm text-[var(--muted)] urdu-text" dir="rtl" lang="ur">آواز اسکیم کا تجزیہ — کال میں دھوکا دہی کی نشاندہی</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">Upload a suspicious call recording for AI-powered scam analysis</p>
          )}
        </div>
      </div>

      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        Upload a short voice recording of a suspicious call. Our AI will transcribe it and analyze the conversation for scam indicators, impersonation, or pressure tactics.
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

      {/* Upload Card */}
      {!result && (
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          <FileUploader
            key={uploaderKey}
            accept="audio/*"
            label="Voice Recording"
            hint="MP3, WAV, OGG, M4A, WebM — max 10 MB"
            onFileSelect={handleFileSelect}
            disabled={loading}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            }
          />

          {audioUrl && (
            <div className={`mt-4 rounded-xl p-4 ${isDark ? "bg-[var(--surface)] border border-[var(--border)]" : "bg-[#F8FAFC] border border-[#E2E8F0]"}`}>
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">Audio Preview</p>
              <audio controls src={audioUrl} className="w-full h-10" preload="metadata" />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`mt-6 w-full rounded-[10px] font-semibold py-3 transition-colors duration-150 disabled:cursor-not-allowed ${
              isDark
                ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-pressed)] disabled:bg-[var(--surface)] disabled:text-[var(--placeholder)]"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#CBD5E1] disabled:text-[#64748B]"
            }`}
          >
            {loading ? "Analyzing Voice..." : "Analyze Voice"}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6">
          <LoadingState message={loadingMessage} />
          <div className="flex items-center justify-center gap-3 mt-4 text-xs text-[var(--muted)]">
            <span className={`px-3 py-1.5 rounded-full border transition-colors duration-150 ${
              loadingStage === "transcribing"
                ? isDark ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold" : "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold"
                : isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"
            }`}>
              1. Transcribe
            </span>
            <svg className="w-4 h-4 text-[var(--placeholder)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className={`px-3 py-1.5 rounded-full border transition-colors duration-150 ${
              loadingStage === "analyzing"
                ? isDark ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] font-semibold" : "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold"
                : isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"
            }`}>
              2. Analyze
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && !loading && (
        <div className={`mt-6 rounded-2xl border p-6 ${
          isDark
            ? "bg-[var(--card-bg)] border-[#FCA5A5]"
            : "bg-white border-[#FCA5A5]"
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDark ? "bg-[#7F1D1D]" : "bg-[#FEE2E2]"
            }`}>
              <svg className={`w-5 h-5 ${isDark ? "text-[#FCA5A5]" : "text-[#DC2626]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${isDark ? "text-[#FCA5A5]" : "text-[#DC2626]"}`}>
                Analysis Could Not Be Completed
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-[var(--text-secondary)]" : "text-[#475569]"}`}>
                {error}
              </p>
              <p className={`text-xs mt-3 ${isDark ? "text-[var(--muted)]" : "text-[#64748B]"}`}>
                Tips: Use a clear recording with spoken words. Avoid silence, background noise, or very short clips.
                Supported formats: MP3, WAV, OGG, M4A, WebM.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className={`mt-4 w-full rounded-[10px] border text-sm font-medium py-2.5 transition-colors duration-150 ${
              isDark
                ? "border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--surface)]"
                : "border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]"
            }`}
          >
            Try Another Recording
          </button>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className={`mt-6 rounded-2xl border overflow-hidden ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          <div className="p-6">
            {audioUrl && (
              <div className="mb-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isDark ? "bg-[var(--primary-light)]" : "bg-[#EFF6FF]"
                }`}>
                  <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <audio controls src={audioUrl} className="flex-1 h-10" preload="metadata" />
              </div>
            )}

            {/* Transcript */}
            {result.transcript && (
              <section className="mb-8 animate-fade-in-up">
                <h4 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  Transcript
                  <span className="text-[10px] font-normal normal-case text-[var(--placeholder)]">(auto-generated by Qwen3-ASR-Flash)</span>
                </h4>
                <div className={`rounded-xl p-4 ${isDark ? "bg-[var(--surface)] border border-[var(--border)]" : "bg-[#F8FAFC] border border-[#E2E8F0]"}`}>
                  <p className="text-sm leading-relaxed italic" style={{ color: isDark ? "var(--text-secondary)" : "#475569" }}>&ldquo;{result.transcript}&rdquo;</p>
                </div>
              </section>
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
                  ? "یہ تجزیہ AI پر مبنی ہے اور غلط ہو سکتا ہے۔ یہ آفیشل تصدیق نہیں ہے۔ ہمیشہ اپنے بینک یا والٹ فراہم کنندہ سے ان کی آفیشل ہیلپ لائن پر تصدیق کریں۔"
                  : <>This analysis is AI-generated and may contain errors. It does <strong>not</strong> constitute official verification. Always independently verify by contacting your bank or wallet provider through their official helpline.</>
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
              Analyze Another Recording
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
