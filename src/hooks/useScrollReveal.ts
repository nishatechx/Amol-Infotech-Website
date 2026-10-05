import { useEffect } from "react";

/**
 * Global IntersectionObserver hook that detects major sections
 * (Authorisations, Courses, Facilities, GoogleReviewsSection, CentrePhotos, About, Contact)
 * and elements with '.scroll-reveal', adding 'animate-fade-in-up' as they enter the viewport.
 * 
 * Specifically optimized for mobile screens:
 * - On mobile/touch devices (width <= 768px) and reduced-motion, immediately reveals all elements.
 * - Uses a gentle threshold with positive rootMargin to trigger ahead of scroll.
 * - Includes a universal safety timeout so sections never remain hidden.
 */
export function useScrollReveal(
  selector: string = ".scroll-reveal, #authorisations, #courses, #facilities, #reviews, #photos, #about, #contact",
  threshold: number = 0.05
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let observer: IntersectionObserver | null = null;
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Helper to reveal elements immediately
    const revealAllImmediately = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.classList.add("animate-fade-in-up");
      });
    };

    // Use requestAnimationFrame to ensure all components are committed to DOM
    const rafId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll(selector);
      if (!elements.length) return;

      // On mobile or reduced motion, immediately reveal all content to guarantee visibility
      if (isMobile || prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealAllImmediately(elements);
        return;
      }

      observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target;
              target.classList.add("animate-fade-in-up");
              obs.unobserve(target);
            }
          });
        },
        {
          threshold,
          rootMargin: "0px 0px 80px 0px",
        }
      );

      elements.forEach((el) => {
        if (!el.classList.contains("animate-fade-in-up")) {
          el.classList.add("scroll-reveal");
          observer?.observe(el);
        }
      });
    });

    // Safety fallback: reveal all observed elements within 350ms
    const safetyTimer = setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      revealAllImmediately(elements);
    }, 350);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [selector, threshold]);
}

export default useScrollReveal;
