"use client";

import { useTheme } from "@/lib/ThemeContext";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Analyzing...",
}: LoadingStateProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Shield icon with scan effect */}
      <div className="relative mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden ${
          isDark ? "bg-[var(--primary-light)]" : "bg-[#EFF6FF]"
        }`}>
          <svg
            className="w-8 h-8 text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          {/* Scan line overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className={`absolute inset-x-0 h-1 animate-scan-line ${isDark ? "bg-[var(--primary)]" : "bg-[#2563EB]"}`} style={{ opacity: 0.35 }} />
          </div>
        </div>
        {/* Pulse ring */}
        <div className={`absolute inset-0 rounded-2xl border-2 animate-shield-pulse ${
          isDark ? "border-[var(--primary)]" : "border-[#3B82F6]"
        }`} style={{ opacity: 0.3 }} />
      </div>

      {/* Scanning label */}
      <div className="flex items-center gap-2 mb-1">
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full animate-scan-dot ${
                isDark ? "bg-[var(--primary)]" : "bg-[#2563EB]"
              }`}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">
          AI Security Check
        </span>
      </div>

      {/* Message */}
      <p className="text-sm font-semibold text-[var(--foreground)] mb-1">{message}</p>
      <p className="text-xs text-[var(--muted)]">This may take a few moments...</p>
    </div>
  );
}
