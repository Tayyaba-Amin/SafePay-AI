"use client";

import { useState } from "react";
import Link from "next/link";
import FileUploader from "@/components/FileUploader";
import AnalysisResultDisplay from "@/components/AnalysisResultDisplay";
import LoadingState from "@/components/LoadingState";
import { analyzeReceipt, type AnalysisResult } from "@/lib/api";
import { getMockResult } from "@/lib/mock";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const FIELD_LABELS: Record<string, string> = {
  sender: "Sender",
  recipient: "Recipient",
  amount: "Amount",
  currency: "Currency",
  date_time: "Date / Time",
  status: "Payment Status",
  transaction_id: "Transaction ID",
  payment_platform: "Payment Platform",
};

export default function ReceiptAnalyzerPage() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setIsMock(false);
    try {
      const res = await analyzeReceipt(file);
      setResult(res);
    } catch {
      setIsMock(true);
      const mock = await getMockResult("receipt");
      setResult(mock);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setResult(null);
    setIsMock(false);
    setImagePreview(null);
    setUploaderKey((k) => k + 1);
  }

  function handleFileSelect(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
        <Link href="/" className="hover:text-[var(--primary)] transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5 text-[var(--placeholder)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-[var(--foreground)] font-medium">Receipt Analyzer</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isDark ? "bg-[var(--primary-light)] text-[var(--primary)]" : "bg-[#EFF6FF] text-[#2563EB]"
        }`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-1">Receipt Risk Analyzer</h1>
          {language === "ur" ? (
            <p className="text-sm text-[var(--muted)] urdu-text" dir="rtl" lang="ur">رسید کا تجزیہ — ممکنہ ہیرا پھیری کی نشاندہی</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">Upload a payment receipt for AI-powered fraud analysis</p>
          )}
        </div>
      </div>

      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
        Upload a payment receipt screenshot. Our AI will inspect visible details and flag any signs of tampering, fake amounts, or suspicious information.
      </p>

      {/* Disclaimer */}
      <div className={`mb-8 rounded-xl px-4 py-2.5 text-xs flex items-start gap-2 ${
        isDark ? "bg-[var(--info-bg)] border border-[var(--info-border)] text-[var(--info-text)]" : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]"
      }`}>
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span>
          <strong>Disclaimer:</strong> SafePay AI is an awareness tool &mdash;{" "}
          <strong>not an official payment verification service</strong>. Results indicate potential anomalies only. Always verify transactions through your official bank or wallet app.
        </span>
      </div>

      {/* Upload Card */}
      {!result && (
        <div className={`rounded-2xl border p-6 ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
          <FileUploader
            key={uploaderKey}
            accept="image/jpeg,image/png,image/webp"
            label="Payment Receipt Screenshot"
            hint="JPEG, PNG, or WebP — max 10 MB"
            onFileSelect={handleFileSelect}
            disabled={loading}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zm16.5-13.5h.008v.008h-.008V7.5zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            }
          />
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`mt-6 w-full rounded-[10px] font-semibold py-3 transition-colors duration-150 disabled:cursor-not-allowed ${
              isDark
                ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] active:bg-[var(--primary-pressed)] disabled:bg-[var(--surface)] disabled:text-[var(--placeholder)]"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:bg-[#CBD5E1] disabled:text-[#64748B]"
            }`}
          >
            {loading ? "Analyzing Receipt..." : "Analyze Receipt"}
          </button>
        </div>
      )}

      {loading && <LoadingState message="Scanning receipt for fraud indicators..." />}

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

            {imagePreview && (
              <div className="mb-6 flex items-center gap-4">
                <img src={imagePreview} alt="Uploaded receipt" className={`w-20 h-20 object-cover rounded-lg border ${isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"}`} />
                <div className="text-xs text-[var(--muted)]">
                  <p className="font-semibold text-[var(--foreground)]">Uploaded Receipt</p>
                  <p className="mt-0.5">Analyzed by Qwen3-VL-Plus vision AI</p>
                </div>
              </div>
            )}

            {/* Result Header */}
            <div className="flex items-center mb-5">
              <p className={`text-xs font-semibold text-[var(--muted)] uppercase tracking-wider ${language === "ur" ? "urdu-text" : ""}`} dir={language === "ur" ? "rtl" : "ltr"}>
                {language === "ur" ? "تجزیہ کا نتیجہ" : "Analysis Result"}
              </p>
            </div>

            <AnalysisResultDisplay result={result} />

            {result.visible_receipt_information && Object.keys(result.visible_receipt_information).length > 0 && (
              <section className="mt-8 animate-fade-in-up stagger-5">
                <h4 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Extracted Receipt Information
                  <span className="text-[10px] font-normal normal-case text-[var(--placeholder)]">(as visible in the image)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(result.visible_receipt_information).map(([key, value]) => {
                    const label = FIELD_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <div key={key} className={`rounded-lg px-3 py-2.5 ${isDark ? "bg-[var(--surface)] border border-[var(--border)]" : "bg-[#F8FAFC] border border-[#E2E8F0]"}`}>
                        <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-[var(--foreground)] truncate" title={value || "—"}>
                          {value || <span className="text-[var(--placeholder)] italic">Not visible</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Bottom disclaimer */}
            <div className={`mt-8 rounded-xl px-4 py-3 text-xs flex items-start gap-2 ${language === "ur" ? "urdu-text" : ""} ${
              isDark ? "bg-[var(--info-bg)] border border-[var(--info-border)] text-[var(--info-text)]" : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF]"
            }`} dir={language === "ur" ? "rtl" : "ltr"}>
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>
                {language === "ur"
                  ? "یہ تجزیہ AI پر مبنی ہے اور غلط ہو سکتا ہے۔ یہ آفیشل ادائیگی کی تصدیق نہیں ہے۔ ہمیشہ اپنے بینک یا والٹ ایپ میں ٹرانزیکشن کی تصدیق کریں۔"
                  : <>This analysis is AI-generated and may contain errors. It does <strong>not</strong> constitute official payment verification. Always confirm transactions in your bank or wallet application.</>
                }
              </span>
            </div>

            <button
              onClick={handleReset}
              className={`mt-6 w-full rounded-[10px] border text-sm font-medium py-2.5 transition-colors duration-150 ${language === "ur" ? "urdu-text" : ""} ${
                isDark
                  ? "border-[var(--info-border)] bg-[var(--card-bg)] text-[var(--primary)] hover:bg-[var(--primary-light)] hover:border-[var(--primary)]"
                  : "border-[#BFDBFE] bg-white text-[#2563EB] hover:bg-[#EFF6FF] hover:border-[#93C5FD]"
              }`}
              dir={language === "ur" ? "rtl" : "ltr"}
            >
              {language === "ur" ? "ایک اور رسید کا تجزیہ کریں" : "Analyze Another Receipt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
