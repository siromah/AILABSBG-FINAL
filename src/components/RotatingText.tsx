import React, { useState, useEffect, useRef } from 'react';

const ITEMS = [
  'за Meta Ads',
  'за бизнес автоматизация',
  'за content creation',
  'за дизайн и бранд',
  'за учене и изпити',
  'за prompts и AI инструменти',
  'за маркетинг и продажби',
  'за работа, проекти и реални резултати',
];

const INTERVAL = 3200;
const DURATION = 600;

export default function RotatingText() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (prefersReduced.current) return;

    const tick = () => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ITEMS.length);
        setDisplayIndex((prev) => (prev + 1) % ITEMS.length);
        setIsAnimating(false);
      }, DURATION);
    };

    const id = setInterval(tick, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      <span
        className="text-[var(--accent)] inline-flex flex-col overflow-hidden"
        style={{
          height: '1.1em',
          lineHeight: '1.1em',
          verticalAlign: 'bottom',
        }}
      >
        <span
          className="inline-block transition-transform will-change-transform"
          style={{
            transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
            transitionDuration: prefersReduced.current ? '0ms' : `${DURATION}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {ITEMS[index]}
        </span>
        <span
          className="inline-block transition-transform will-change-transform absolute left-0"
          style={{
            transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
            transitionDuration: prefersReduced.current ? '0ms' : `${DURATION}ms`,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: isAnimating ? 1 : 0,
          }}
          aria-hidden="true"
        >
          {ITEMS[(displayIndex + 1) % ITEMS.length]}
        </span>
      </span>
      <svg
        className="absolute -bottom-2 left-0 w-full"
        viewBox="0 0 300 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 8C50 2 150 2 298 8"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </span>
  );
}
