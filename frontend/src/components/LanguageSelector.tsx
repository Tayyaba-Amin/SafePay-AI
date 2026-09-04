"use client";

import { useLanguage, type Language } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ur", label: "اردو" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`inline-flex rounded-[10px] border overflow-hidden ${
        isDark ? "border-[var(--border)]" : "border-[#E2E8F0]"
      }`}
      role="radiogroup"
      aria-label="Response language"
    >
      {OPTIONS.map((opt) => {
        const isActive = language === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isActive}
            aria-label={`Response language: ${opt.label}`}
            onClick={() => setLanguage(opt.value)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[var(--primary)] text-white"
                : isDark
                  ? "bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  : "bg-white text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
