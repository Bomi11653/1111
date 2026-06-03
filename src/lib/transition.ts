export type TransitionPayload = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  secondaryColor: string;
  slug: string;
  label?: string;
};

export const TRANSITION_STORAGE_KEY = "portfolio-transition";

export function saveTransitionPayload(data: TransitionPayload) {
  sessionStorage.setItem(TRANSITION_STORAGE_KEY, JSON.stringify(data));
}

export function readTransitionPayload(): TransitionPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(TRANSITION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TransitionPayload;
  } catch {
    return null;
  }
}

export function clearTransitionPayload() {
  sessionStorage.removeItem(TRANSITION_STORAGE_KEY);
}
