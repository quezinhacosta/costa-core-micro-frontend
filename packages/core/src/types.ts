export type CostaTheme = "light" | "dark";

export interface CostaUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MfeManifest {
  id: string;
  name: string;
  scope: string;
  module: string;
  url: string;
  version?: string;
  status?: "registered" | "loading" | "loaded" | "error";
  fallbackUrl?: string;
}

export interface MfeErrorPayload {
  mfeId: string;
  error: string;
  timestamp: number;
}

export interface CostaEventMap {
  "theme:change": { theme: CostaTheme };
  "session:change": { user: CostaUser | null };
  "mfe:error": MfeErrorPayload;
  "mfe:navigation": { path: string };
  "mfe:ready": { mfeId: string };
  [key: string]: unknown;
}
