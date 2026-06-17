import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

export type ThemeId =
  | "dark-default"
  | "light-minimal"
  | "zenhr-inspired"
  | "industrial-brutalist"
  | "ocean-calm";

export interface ThemeConfig {
  id: ThemeId;
  name: { en: string; ar: string };
  preview: string;
  colors: Record<string, string>;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "dark-default",
    name: { en: "Dark Premium", ar: "الداكن المميز" },
    preview: "linear-gradient(135deg,hsl(224,30%,8%),hsl(263,90%,30%))",
    colors: {
      "--bg-main": "hsl(224,30%,8%)",
      "--bg-sidebar": "hsl(224,32%,5%)",
      "--bg-card": "hsla(224,30%,12%,0.5)",
      "--bg-card-hover": "hsla(224,30%,16%,0.7)",
      "--border-color": "hsla(224,20%,30%,0.2)",
      "--border-focus": "hsla(263,90%,65%,0.4)",
      "--accent-cyan": "hsl(185,90%,50%)",
      "--accent-purple": "hsl(263,90%,65%)",
      "--gradient-primary":
        "linear-gradient(135deg,hsl(263,90%,65%) 0%,hsl(185,90%,50%) 100%)",
      "--text-main": "hsl(220,20%,97%)",
      "--text-muted": "hsl(220,15%,70%)",
      "--text-dim": "hsl(220,10%,50%)",
      "--shadow-main": "0 8px 32px 0 rgba(0,0,0,0.37)",
      "--shadow-glow": "0 0 15px hsla(185,90%,50%,0.2)",
    },
  },
  {
    id: "light-minimal",
    name: { en: "Light Minimal", ar: "الفاتح البسيط" },
    preview: "linear-gradient(135deg,hsl(220,20%,96%),hsl(220,10%,88%))",
    colors: {
      "--bg-main": "hsl(220,20%,97%)",
      "--bg-sidebar": "hsl(220,15%,93%)",
      "--bg-card": "hsla(220,20%,99%,0.9)",
      "--bg-card-hover": "hsla(220,20%,95%,0.95)",
      "--border-color": "hsla(220,15%,80%,0.5)",
      "--border-focus": "hsla(263,70%,50%,0.4)",
      "--accent-cyan": "hsl(185,80%,40%)",
      "--accent-purple": "hsl(263,70%,55%)",
      "--gradient-primary":
        "linear-gradient(135deg,hsl(263,70%,55%) 0%,hsl(185,80%,40%) 100%)",
      "--text-main": "hsl(220,20%,10%)",
      "--text-muted": "hsl(220,15%,35%)",
      "--text-dim": "hsl(220,10%,55%)",
      "--shadow-main": "0 4px 16px 0 rgba(0,0,0,0.08)",
      "--shadow-glow": "0 0 15px hsla(263,70%,55%,0.15)",
    },
  },
  {
    id: "zenhr-inspired",
    name: { en: "ZenHR Style", ar: "نمط ZenHR" },
    preview: "linear-gradient(135deg,hsl(180,100%,10%),hsl(180,80%,15%))",
    colors: {
      "--bg-main": "hsl(180,30%,6%)",
      "--bg-sidebar": "hsl(180,25%,4%)",
      "--bg-card": "hsla(180,25%,10%,0.6)",
      "--bg-card-hover": "hsla(180,25%,15%,0.8)",
      "--border-color": "hsla(180,20%,25%,0.3)",
      "--border-focus": "hsla(175,90%,45%,0.5)",
      "--accent-cyan": "hsl(175,100%,40%)",
      "--accent-purple": "hsl(175,60%,45%)",
      "--gradient-primary":
        "linear-gradient(135deg,hsl(175,100%,40%) 0%,hsl(160,80%,40%) 100%)",
      "--text-main": "hsl(180,20%,95%)",
      "--text-muted": "hsl(180,15%,65%)",
      "--text-dim": "hsl(180,10%,45%)",
      "--shadow-main": "0 8px 32px 0 rgba(0,80,80,0.3)",
      "--shadow-glow": "0 0 20px hsla(175,100%,40%,0.25)",
    },
  },
  {
    id: "industrial-brutalist",
    name: { en: "Industrial Brutalist", ar: "الصناعي الخام" },
    preview: "linear-gradient(135deg,hsl(40,20%,8%),hsl(30,20%,5%))",
    colors: {
      "--bg-main": "hsl(40,10%,6%)",
      "--bg-sidebar": "hsl(40,10%,3%)",
      "--bg-card": "hsla(40,10%,10%,0.8)",
      "--bg-card-hover": "hsla(40,10%,14%,0.9)",
      "--border-color": "hsla(40,15%,20%,0.4)",
      "--border-focus": "hsla(35,90%,50%,0.5)",
      "--accent-cyan": "hsl(35,90%,55%)",
      "--accent-purple": "hsl(35,80%,45%)",
      "--gradient-primary":
        "linear-gradient(135deg,hsl(35,90%,55%) 0%,hsl(20,80%,45%) 100%)",
      "--text-main": "hsl(40,20%,92%)",
      "--text-muted": "hsl(40,15%,60%)",
      "--text-dim": "hsl(40,10%,40%)",
      "--shadow-main": "0 4px 8px 0 rgba(0,0,0,0.5)",
      "--shadow-glow": "0 0 12px hsla(35,90%,55%,0.2)",
    },
  },
  {
    id: "ocean-calm",
    name: { en: "Ocean Calm", ar: "هدوء المحيط" },
    preview: "linear-gradient(135deg,hsl(210,30%,10%),hsl(200,40%,18%))",
    colors: {
      "--bg-main": "hsl(210,30%,10%)",
      "--bg-sidebar": "hsl(210,30%,7%)",
      "--bg-card": "hsla(210,30%,14%,0.5)",
      "--bg-card-hover": "hsla(210,30%,18%,0.7)",
      "--border-color": "hsla(210,20%,25%,0.25)",
      "--border-focus": "hsla(200,80%,55%,0.4)",
      "--accent-cyan": "hsl(200,85%,55%)",
      "--accent-purple": "hsl(210,80%,60%)",
      "--gradient-primary":
        "linear-gradient(135deg,hsl(210,80%,60%) 0%,hsl(200,85%,55%) 100%)",
      "--text-main": "hsl(210,20%,94%)",
      "--text-muted": "hsl(210,15%,68%)",
      "--text-dim": "hsl(210,10%,48%)",
      "--shadow-main": "0 8px 32px 0 rgba(0,40,80,0.3)",
      "--shadow-glow": "0 0 15px hsla(200,85%,55%,0.2)",
    },
  },
];

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (id: ThemeId) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES[0],
  setTheme: () => {},
  themes: THEMES,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem("hr_pulse_theme");
    return saved && THEMES.find((t) => t.id === saved)
      ? (saved as ThemeId)
      : "dark-default";
  });

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === themeId) || THEMES[0],
    [themeId]
  );

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem("hr_pulse_theme", themeId);
  }, [currentTheme, themeId]);

  const setTheme = (id: ThemeId) => setThemeId(id);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};