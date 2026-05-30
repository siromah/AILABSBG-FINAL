import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto relative">
      <div className="section-shell py-14 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 justify-between">

          <div className="md:max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-[var(--accent)] to-[var(--lavender)] rounded-[10px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white/90 rounded-[3px]" />
              </div>
              <span className="font-semibold text-[16px] text-[var(--ink-900)] tracking-tight">AILABS.BG</span>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6">
              Практическа AI академия за български професионалисти. Уроци, prompt-и и общност — без шум и без празна теория.
            </p>
            <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-full hover:bg-[var(--ink-900)]/[0.04]">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-full hover:bg-[var(--ink-900)]/[0.04]">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-full hover:bg-[var(--ink-900)]/[0.04]">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-20">
            <div>
              <h4 className="text-[11px] font-semibold text-[var(--ink-900)] uppercase tracking-wider mb-4">Платформа</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/lessons" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Академия</Link></li>
                <li><Link to="/prompts" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Prompt-и</Link></li>
                <li><Link to="/community" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Общност</Link></li>
                <li><Link to="/events" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Събития</Link></li>
                <li><Link to="/pricing" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Цени</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-[var(--ink-900)] uppercase tracking-wider mb-4">Екип</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/about" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">За нас</Link></li>
                <li><Link to="/contact" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Контакт</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold text-[var(--ink-900)] uppercase tracking-wider mb-4">Правни</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/privacy" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Поверителност</Link></li>
                <li><Link to="/terms" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Условия</Link></li>
                <li><Link to="/cookie-policy" className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Бисквитки</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-[12px] text-[var(--text-tertiary)]">
          <span>&copy; {new Date().getFullYear()} AILABS.BG. Всички права запазени.</span>
          <span>Цените са в евро. София, България.</span>
        </div>
      </div>
    </footer>
  );
}
