import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function TypingText({ text, speed = 80, className = '', delay = 0 }: { text: string; speed?: number; className?: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span
          className="inline-block w-[3px] h-[1em] bg-[var(--accent)] ml-1 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  );
}
