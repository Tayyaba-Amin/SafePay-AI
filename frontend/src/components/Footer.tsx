"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`mt-auto border-t py-8 ${isDark ? "border-[var(--border)] bg-[var(--card-bg)]" : "border-[#E2E8F0] bg-white"}`}>
      <div className="max-w-[1280px] mx-auto px-6 text-center space-y-3">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-[var(--foreground)]">
            SafePay <span className="text-[var(--primary)]">AI</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xs text-[var(--text-secondary)] font-medium">
          AI-Powered Fraud Protection for Digital Payments in Pakistan
        </p>

        {/* Copyright */}
        <p className="text-[11px] text-[var(--placeholder)] pt-1">
          &copy; {new Date().getFullYear()} SafePay AI - For awareness purposes only.
        </p>
      </div>
    </footer>
  );
}
