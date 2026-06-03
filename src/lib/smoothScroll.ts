import type Lenis from "lenis";

let lenisRef: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisRef = instance;
}

export function scrollToElement(id: string, offset = 72, onComplete?: () => void) {
  const el = document.getElementById(id);
  if (!el) {
    onComplete?.();
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  if (lenisRef) {
    lenisRef.scrollTo(top, {
      duration: 1.65,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete,
    });
    return;
  }

  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(() => onComplete?.(), 900);
}
