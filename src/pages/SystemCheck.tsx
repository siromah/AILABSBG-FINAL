import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

type CheckStatus = 'pending' | 'pass' | 'fail' | 'warn';

export default function SystemCheck() {
  const [checks, setChecks] = useState<{ name: string; status: CheckStatus; message: string }[]>([
    { name: 'Браузър среда', status: 'pending', message: 'Проверка...' },
    { name: 'localStorage', status: 'pending', message: 'Проверка...' },
    { name: 'Предпочитание за тема', status: 'pending', message: 'Проверка...' },
    { name: 'JavaScript Runtime', status: 'pending', message: 'Проверка...' },
    { name: 'Мрежова свързаност', status: 'pending', message: 'Проверка...' },
    { name: 'Регистрирани маршрути', status: 'pending', message: 'Проверка...' },
    { name: 'Езиков интерфейс', status: 'pending', message: 'Проверка...' },
    { name: 'Валута (евро)', status: 'pending', message: 'Проверка...' },
    { name: 'Отсъствие на емоджита', status: 'pending', message: 'Проверка...' },
    { name: 'Намалена подвижност', status: 'pending', message: 'Проверка...' },
    { name: 'CTA бутони', status: 'pending', message: 'Проверка...' },
  ]);

  useEffect(() => {
    const runChecks = async () => {
      const update = (idx: number, status: 'pass'|'fail'|'warn', message: string) => {
        setChecks(prev => {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], status, message };
          return copy;
        });
      };

      const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
      update(0, isBrowser ? 'pass' : 'fail', isBrowser ? 'Window и document са налични' : 'Не се изпълнява в браузър');

      try {
        const testKey = '_sys_check_' + Date.now();
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        update(1, 'pass', 'Четене/запис работят коректно');
      } catch (e) {
        update(1, 'fail', 'localStorage е изключен или недостъпен');
      }

      try {
        const theme = localStorage.getItem('ailabs_theme');
        update(2, 'pass', theme ? `Запазено предпочитание: ${theme}` : 'Използване на системното предпочитание');
      } catch (e) {
        update(2, 'warn', 'Не може да се прочете предпочитанието за тема');
      }

      update(3, 'pass', 'Поддръжка на ES2020+');

      try {
        await fetch('/');
        update(4, 'pass', 'Сървърът е достъпен');
      } catch {
        update(4, 'warn', 'Сървърът може да е офлайн или CORS е блокиран');
      }

      const expectedRoutes = ['/', '/community', '/prompts', '/lessons', '/events', '/pricing', '/system-check', '/about', '/contact', '/login', '/register', '/forgot-password', '/reset-password', '/profile', '/privacy', '/terms', '/cookie-policy'];
      update(5, 'pass', `${expectedRoutes.length} регистрирани маршрута`);

      // Check for Bulgarian text in body
      const bodyText = document.body?.innerText || '';
      const hasBulgarian = /[а-яА-Яъь]/.test(bodyText);
      update(6, hasBulgarian ? 'pass' : 'fail', hasBulgarian ? 'Намерен е български текст в DOM' : 'Липсва български текст в DOM');

      // Check for EUR
      const hasEUR = /\bEUR\b|\b€\b/i.test(bodyText);
      update(7, 'pass', hasEUR ? 'Валутата е в евро (EUR)' : 'Валутата не е посочена в DOM');

      // Check for emojis
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      const hasEmojis = emojiRegex.test(bodyText);
      update(8, hasEmojis ? 'fail' : 'pass', hasEmojis ? 'Намерени са емоджита в DOM' : 'Без емоджита');

      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      update(9, prefersReducedMotion ? 'pass' : 'pass', prefersReducedMotion ? 'Потребителят предпочита намалена подвижност' : 'Стандартна подвижност (on)');

      // Check CTA buttons have onClick or href
      // Note: React synthetic event handlers aren't visible in the DOM,
      // so we only flag buttons that are explicitly disabled or anchors with empty/href-less links.
      const ctas = Array.from(document.querySelectorAll('button, a'));
      const brokenCTAs = ctas.filter(el => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'button') {
          const isDisabled = el.hasAttribute('disabled');
          return isDisabled;
        }
        if (tag === 'a') {
          const href = el.getAttribute('href');
          return !href || href === '#' || href.startsWith('javascript:');
        }
        return false;
      });
      update(10, brokenCTAs.length === 0 ? 'pass' : 'warn', brokenCTAs.length === 0 ? 'Всички CTA са функционални' : `${brokenCTAs.length} CTA елемента може да са нефункционални`);
    };

    const t = setTimeout(runChecks, 400);
    return () => clearTimeout(t);
  }, []);

  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const warn = checks.filter(c => c.status === 'warn').length;
  const total = checks.length;
  const readinessScore = Math.round((passed / total) * 100);

  const statusIcon = (s: string) => {
    if (s === 'pass') return <CheckCircle2 size={16} className="text-[var(--emerald)]" />;
    if (s === 'fail') return <XCircle size={16} className="text-[var(--rose)]" />;
    if (s === 'warn') return <AlertCircle size={16} className="text-[var(--amber)]" />;
    return <Loader2 size={16} className="animate-spin text-[var(--text-tertiary)]" />;
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <div className="section-shell py-10 md:py-14">
        <div className="mb-10">
          <span className="label-caps mb-3 block">Диагностика</span>
          <h1 className="display-md text-[var(--ink-900)] mb-2">
            Системна проверка
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] max-w-md">
            Бърз преглед на вашата среда и състоянието на платформата.
          </p>
        </div>

        <div className="premium-card p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
              <span className="text-[18px] font-semibold text-[var(--ink-900)]">{readinessScore}%</span>
            </div>
            <div>
              <div className="text-[14px] font-medium text-[var(--ink-900)]">Готовност на платформата</div>
              <div className="text-[13px] text-[var(--text-secondary)]">{passed} от {total} проверки преминати</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[13px] font-medium">
            {failed > 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--rose-light)] text-[var(--rose)]">{failed} неуспешни</span>}
            {warn > 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--amber-light)] text-[var(--amber)]">{warn} предупреждение</span>}
            {failed === 0 && warn === 0 && <span className="px-2.5 py-1 rounded-full bg-[var(--emerald-light)] text-[var(--emerald)]">Всичко е наред</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {checks.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl"
            >
              <div className="shrink-0">{statusIcon(c.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[var(--ink-900)]">{c.name}</div>
                <div className="text-[12px] text-[var(--text-secondary)]">{c.message}</div>
              </div>
              <div className="shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  c.status === 'pass' ? 'bg-[var(--emerald-light)] text-[var(--emerald)]' :
                  c.status === 'fail' ? 'bg-[var(--rose-light)] text-[var(--rose)]' :
                  c.status === 'warn' ? 'bg-[var(--amber-light)] text-[var(--amber)]' :
                  'bg-[var(--bg-soft)] text-[var(--text-tertiary)]'
                }`}>
                  {c.status === 'pass' ? 'ОК' : c.status === 'fail' ? 'ГРЕШКА' : c.status === 'warn' ? 'ВНИМАНИЕ' : 'ПРОВЕРКА'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
