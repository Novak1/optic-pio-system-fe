import { useEffect, useState } from "react";

/**
 * Hook for managing dark mode state
 * Stores preference in localStorage and applies the class to the document element
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    // Fall back to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      html.classList.add("dark");
      body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggle = () => setIsDarkMode((prev) => !prev);
  const enable = () => setIsDarkMode(true);
  const disable = () => setIsDarkMode(false);

  return {
    isDarkMode,
    toggle,
    enable,
    disable,
  };
}

