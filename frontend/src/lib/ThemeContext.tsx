"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "safepai-theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  /* Sync theme to DOM + localStorage */
  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    root.setAttribute("data-theme", t);
    root.classList.toggle("dark", t === "dark");
    /* Remove transition class after animation completes */
    requestAnimationFrame(() => {
      setTimeout(() => root.classList.remove("theme-transitioning"), 250);
    });
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  /* On mount: sync React state with persisted preference.
     The inline <script> in layout.tsx already applied the correct
     data-theme + dark class before first paint, so we only need to
     update React state here — NOT re-apply to the DOM. */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
