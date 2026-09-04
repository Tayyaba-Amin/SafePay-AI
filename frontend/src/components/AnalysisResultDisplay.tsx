import type { AnalysisResult } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import RiskGauge from "./RiskGauge";

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

/* ─── Helpers ─── */

function riskBadgeClass(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "risk-badge-low";
    case "medium": return "risk-badge-medium";
    case "high":
    case "critical": return "risk-badge-high";
    default: return "risk-badge-medium";
  }
}

function riskBarClass(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "risk-bar-low";
    case "medium": return "risk-bar-medium";
    case "high":
    case "critical": return "risk-bar-high";
    default: return "risk-bar-medium";
  }
}

function riskAlertClass(level: string, isDark: boolean): string {
  if (isDark) {
    switch (level.toLowerCase()) {
      case "low": return "bg-[var(--risk-low-bg)] border-[var(--risk-low-border)]";
      case "medium": return "bg-[var(--risk-medium-bg)] border-[var(--risk-medium-border)]";
      case "high":
      case "critical": return "bg-[var(--risk-high-bg)] border-[var(--risk-high-border)]";
      default: return "bg-[var(--risk-medium-bg)] border-[var(--risk-medium-border)]";
    }
  }
  switch (level.toLowerCase()) {
    case "low": return "bg-[#F0FDF4] border-[#BBF7D0]";
    case "medium": return "bg-[#FFFBEB] border-[#FDE68A]";
    case "high":
    case "critical": return "bg-[#FEF2F2] border-[#FECACA]";
    default: return "bg-[#FFFBEB] border-[#FDE68A]";
  }
}

function riskAlertTextColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "text-[var(--risk-low-text)]";
    case "medium": return "text-[var(--risk-medium-text)]";
    case "high":
    case "critical": return "text-[var(--risk-high-text)]";
    default: return "text-[var(--risk-medium-text)]";
  }
}

function riskAlertIconColor(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "text-[var(--risk-low)]";
    case "medium": return "text-[var(--risk-medium)]";
    case "high":
    case "critical": return "text-[var(--risk-high)]";
    default: return "text-[var(--risk-medium)]";
  }
}

/** Localised UI labels */
function labels(lang: string) {
  if (lang === "ur") {
    return {
      securityAssessment: "سیکیورٹی جائزہ",
      riskLabel: "خطرے کی سطح",
      threatType: "خطرے کی قسم",
      findings: "خطرے کی نشانیاں",
      threatIndicators: "خطرے کے اشارے",
      explanation: "تشریح",
      recommendation: "سفارش",
      safetyRecommendation: "حفاظتی سفارش",
      whatToDo: "آپ کو کیا کرنا چاہیے",
      riskSuffix: "خطرہ",
      low: "کم",
      medium: "درمیانہ",
      high: "زیادہ",
      safe: "محفوظ",
      moderate: "معتدل",
      dangerous: "خطرناک",
      indicatorSingular: "علامت",
      indicatorPlural: "علامات",
    };
  }
  return {
    securityAssessment: "Security Assessment",
    riskLabel: "Risk Level",
    threatType: "Threat Type",
    findings: "Warning Signs",
    threatIndicators: "Threat Indicators",
    explanation: "Explanation",
    recommendation: "Recommendation",
    safetyRecommendation: "Safety Recommendation",
    whatToDo: "What You Should Do",
    riskSuffix: "Risk",
    low: "Low",
    medium: "Medium",
    high: "High",
    safe: "Safe",
    moderate: "Moderate",
    dangerous: "Dangerous",
    indicatorSingular: "indicator",
    indicatorPlural: "indicators",
  };
}

export default function AnalysisResultDisplay({
  result,
}: AnalysisResultDisplayProps) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isUrdu = language === "ur";
  const isDark = theme === "dark";
  const t = labels(language);
  const scorePercent = Math.round(result.risk_score);

  /* Localised content */
  const riskDisplay = result.risk_level === "Low"
    ? t.low
    : result.risk_level === "Medium"
      ? t.medium
      : t.high;

  const explanation = isUrdu && result.explanation_urdu?.trim()
    ? result.explanation_urdu
    : result.explanation;
  const recommendation = isUrdu && result.recommended_action_urdu?.trim()
    ? result.recommended_action_urdu
    : result.recommended_action;
  const threatCategory = isUrdu && result.threat_category_urdu?.trim()
    ? result.threat_category_urdu
    : result.threat_category;
  const indicators = isUrdu && result.detected_indicators_urdu?.length
    ? result.detected_indicators_urdu
    : result.detected_indicators;

  return (
    <div className={`space-y-5 animate-fade-in-up ${isUrdu ? "urdu-text" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      {/* ── Security Assessment Header ── */}
      <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
        <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
          {t.securityAssessment}
        </span>
      </div>

      {/* ── Risk Summary ── */}
      <div className={`rounded-2xl border p-5 ${riskAlertClass(result.risk_level, isDark)} animate-fade-in-up`}>
        <div className={`flex flex-col sm:flex-row items-center gap-5 ${isUrdu ? "sm:flex-row-reverse" : ""}`}>
          <RiskGauge score={scorePercent} label={t.riskLabel} />

          <div className={`flex-1 text-center sm:text-${isUrdu ? "right" : "left"} space-y-2.5`}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${riskBadgeClass(result.risk_level)}`}>
              {isUrdu ? `${riskDisplay} ${t.riskSuffix}` : `${result.risk_level} ${t.riskSuffix}`}
            </span>

            <p className={`text-base font-semibold leading-snug ${riskAlertTextColor(result.risk_level)}`}>
              {isUrdu
                ? riskVerdictUrdu(result.risk_level)
                : riskVerdictEn(result.risk_level)}
            </p>

            {/* Score bar */}
            <div className="w-full max-w-xs mx-auto sm:mx-0 pt-1">
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-[var(--border)]" : "bg-[#E2E8F0]"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${riskBarClass(result.risk_level)}`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <div className={`flex justify-between text-[10px] mt-1 font-medium ${isUrdu ? "flex-row-reverse" : ""}`} style={{ color: "var(--placeholder)" }}>
                <span>{t.safe}</span>
                <span>{t.moderate}</span>
                <span>{t.dangerous}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Threat category */}
      <div className={`flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
          {t.threatType}:
        </span>
        <span className="text-sm font-semibold text-[var(--foreground)] rounded-lg px-3 py-1" style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}>
          {threatCategory}
        </span>
      </div>

      {/* ── Detected Indicators ── */}
      <section className={`rounded-2xl border p-5 ${isDark ? "border-[var(--border)] bg-[var(--card-bg)]" : "border-[#E2E8F0] bg-white"}`}>
        <h4 className={`text-sm font-semibold text-[var(--muted)] uppercase tracking-wide mb-3 flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""}`}>
          <svg className={`w-4 h-4 ${riskAlertIconColor(result.risk_level)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {t.findings} ({indicators.length}{" "}
          {indicators.length !== 1 ? t.indicatorPlural : t.indicatorSingular})
        </h4>
        <ul className="space-y-2">
          {indicators.map((indicator, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 text-sm rounded-lg px-3 py-2.5 animate-fade-in-up ${isUrdu ? "flex-row-reverse text-right" : ""} ${
                isDark
                  ? "bg-[var(--risk-high-bg)] border border-[var(--risk-high-border)]"
                  : "bg-[#FEF2F2] border border-[#FECACA]"
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                backgroundColor: isDark ? "var(--risk-high)" : "#DC2626",
                color: "white",
              }}>
                {i + 1}
              </span>
              <span className="leading-relaxed" style={{ color: isDark ? "var(--risk-high-body)" : "#991B1B" }}>{indicator}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Explanation ── */}
      <section className={`rounded-2xl border p-5 animate-fade-in-up stagger-3 ${isDark ? "border-[var(--border)] bg-[var(--card-bg)]" : "border-[#E2E8F0] bg-white"}`}>
        <h4 className={`text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 ${isUrdu ? "flex-row-reverse" : ""}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          {t.explanation}
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{explanation}</p>
      </section>

      {/* ── Safety Recommendation ── */}
      <section className={`rounded-2xl border p-5 animate-fade-in-up stagger-5 ${
        isDark
          ? "border-[var(--info-border)] bg-[var(--info-bg)]"
          : "border-[#BFDBFE] bg-[#EFF6FF]"
      }`}>
        <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2 ${isUrdu ? "flex-row-reverse" : ""} ${
          isDark ? "text-[var(--info-text)]" : "text-[#1E40AF]"
        }`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          {t.safetyRecommendation}
        </h4>
        <p className="text-sm font-medium text-[var(--foreground)] leading-relaxed">
          {recommendation}
        </p>
      </section>
    </div>
  );
}

/* ─── Verdict text ─── */

function riskVerdictEn(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "No obvious scam indicators were detected.";
    case "medium": return "Some suspicious indicators found — proceed with caution and verify.";
    case "high": return "Potential scam indicators detected — do not act before verifying.";
    case "critical": return "Strong scam indicators detected — this is very likely a scam.";
    default: return "Please review the details below carefully.";
  }
}

function riskVerdictUrdu(level: string): string {
  switch (level.toLowerCase()) {
    case "low": return "کوئی واضح اسکیم کی علامت نہیں ملی۔";
    case "medium": return "کچھ مشتبہ علامات ملے — احتیاط کریں اور تصدیق کریں۔";
    case "high": return "ممکنہ اسکیم کی علامات ملیں — تصدیق سے پہلے کوئی قدم نہ اٹھائیں۔";
    case "critical": return "مضبوط اسکیم کی علامات — یہ بہت ممکنہ طور پر اسکیم ہے۔";
    default: return "براہ کرم نیچے دی گئی تفصیلات احتیاط سے دیکھیں۔";
  }
}
