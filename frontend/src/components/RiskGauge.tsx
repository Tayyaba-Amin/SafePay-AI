"use client";

import { useTheme } from "@/lib/ThemeContext";

interface RiskGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label: string;
}

function scoreColor(score: number, isDark: boolean): string {
  if (score < 30) return isDark ? "#4ADE80" : "#16A34A";
  if (score < 60) return isDark ? "#FBBF24" : "#D97706";
  return isDark ? "#F87171" : "#DC2626";
}

function scoreLabel(score: number): string {
  if (score < 30) return "Low";
  if (score < 60) return "Medium";
  return "High";
}

export default function RiskGauge({
  score,
  size = 110,
  strokeWidth = 10,
  label,
}: RiskGaugeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const offset = arcLength - (arcLength * Math.min(score, 100)) / 100;
  const color = scoreColor(score, isDark);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-[135deg]"
          role="img"
          aria-label={`Risk score ${score} out of 100 — ${scoreLabel(score)} risk`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="gauge-track"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="animate-gauge"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {Math.round(score)}
          </span>
          <span className="text-[10px] font-semibold text-[var(--placeholder)] mt-0.5">
            /100
          </span>
        </div>
      </div>
      <span className="text-xs text-[var(--muted)] font-medium mt-1">{label}</span>
    </div>
  );
}
