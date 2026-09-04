"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/receipt", label: "Receipt Analyzer" },
  { href: "/message", label: "Message Analyzer" },
  { href: "/voice", label: "Voice Analyzer" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className={`sticky top-0 z-50 border-b ${isDark ? "bg-[var(--card-bg)] border-[var(--border)]" : "bg-white border-[#E2E8F0]"}`}>
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center transition-colors group-hover:bg-[var(--primary-hover)]">
            <svg
              className="w-5 h-5 text-white"
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
          <div className="leading-tight">
            <span className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              SafePay{" "}
              <span className="text-[var(--primary)]">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav + Theme Toggle */}
        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? isDark
                        ? "bg-[var(--primary-selected)] text-[var(--primary)]"
                        : "bg-[#DBEAFE] text-[#1D4ED8]"
                      : isDark
                        ? "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-elevated)]"
                        : "text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-3 pl-3 border-l border-[var(--border)] flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: Theme Toggle + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className={`md:hidden border-t animate-fade-in ${isDark ? "border-[var(--border)] bg-[var(--card-bg)]" : "border-[#E2E8F0] bg-white"}`}>
          <div className="max-w-[1280px] mx-auto px-6 py-2 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? isDark
                        ? "bg-[var(--primary-selected)] text-[var(--primary)]"
                        : "bg-[#DBEAFE] text-[#1D4ED8]"
                      : isDark
                        ? "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--card-elevated)]"
                        : "text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
