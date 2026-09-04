"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

interface AnalyzerCardProps {
  title: string;
  titleUrdu: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function AnalyzerCard({
  title,
  titleUrdu,
  description,
  icon,
  href,
}: AnalyzerCardProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isUrdu = language === "ur";
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      className={`group relative block rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md overflow-hidden ${
        isDark
          ? "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--primary-focus)] hover:bg-[var(--card-elevated)]"
          : "border-[#E2E8F0] bg-white hover:border-[#BFDBFE] hover:shadow-blue-100/40"
      }`}
    >
      {/* Security accent strip */}
      <div className="security-accent-strip" />

      {/* Icon with shield-check feel */}
      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200 ${
        isDark
          ? "bg-[var(--primary-light)] text-[var(--primary)] group-hover:bg-[var(--primary-selected)]"
          : "bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#DBEAFE]"
      }`}>
        {icon}
        {/* Small shield-check badge */}
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border ${
          isDark
            ? "bg-[var(--card-bg)] border-[var(--border)]"
            : "bg-white border-[#E2E8F0]"
        }`}>
          <svg className="w-3 h-3 text-[var(--risk-low)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>

      {/* Title */}
      {isUrdu ? (
        <h3 className="text-[17px] font-bold text-[var(--foreground)] mb-1 urdu-text" dir="rtl" lang="ur">
          {titleUrdu}
        </h3>
      ) : (
        <h3 className="text-[17px] font-bold text-[var(--foreground)] mb-1">
          {title}
        </h3>
      )}

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 ${
        isDark ? "text-[var(--primary)] group-hover:text-[var(--primary-hover)]" : "text-[#2563EB] group-hover:text-[#1D4ED8]"
      }`}>
        {isUrdu ? "ابھی تجزیہ کریں" : "Analyze Now"}
        <svg
          className={`w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5 ${isUrdu ? "rotate-180 group-hover:-translate-x-0.5" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
