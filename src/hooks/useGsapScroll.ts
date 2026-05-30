import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function useGsapScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Make all animated elements visible immediately
      const allAnimated = containerRef.current?.querySelectorAll('.gsap-section, .gsap-item');
      allAnimated?.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    const yOffset = isMobile() ? 20 : 40;
    const duration = isMobile() ? 0.5 : 0.7;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      const staggerItems = gsap.utils.toArray<HTMLElement>('.gsap-stagger');
      staggerItems.forEach((parent) => {
        const children = parent.querySelectorAll('.gsap-item');
        gsap.fromTo(
          children,
          { opacity: 0, y: isMobile() ? 16 : 30 },
          {
            opacity: 1,
            y: 0,
            duration: isMobile() ? 0.4 : 0.6,
            stagger: isMobile() ? 0.06 : 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: parent,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
