import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function useGsapHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-brand',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          '.hero-title-line',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          '-=0.3'
        )
        .fromTo(
          '.hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-trust',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )
        .fromTo(
          '.hero-visual',
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1 },
          '-=0.8'
        );

      // Subtle parallax on hero visual during scroll
      if (!isMobile()) {
        gsap.to('.hero-visual', {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
