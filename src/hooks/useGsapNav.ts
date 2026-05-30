import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapNav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -60',
        onUpdate: (self) => {
          if (self.progress > 0) {
            nav.classList.add('nav-scrolled');
          } else {
            nav.classList.remove('nav-scrolled');
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return navRef;
}
