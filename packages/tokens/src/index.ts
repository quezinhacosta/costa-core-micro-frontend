export type CostaTheme = "light" | "dark";

export const colors = {
  light: {
    bg: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryContrast: "#ffffff",
    border: "#e2e8f0",
    borderFocus: "#3b82f6",
    text: "#0f172a",
    textMuted: "#64748b",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#0284c7",
  },
  dark: {
    bg: "#090d16",
    surface: "#131c2e",
    surfaceHover: "#1c2942",
    primary: "#3b82f6",
    primaryHover: "#60a5fa",
    primaryContrast: "#ffffff",
    border: "#1e293b",
    borderFocus: "#60a5fa",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    danger: "#f87171",
    dangerHover: "#ef4444",
    success: "#34d399",
    warning: "#fbbf24",
    info: "#38bdf8",
  },
} as const;

export const tokens = {
  colors,
  fontFamily: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
  },
  spacing: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
} as const;

export type CostaTokens = typeof tokens;
