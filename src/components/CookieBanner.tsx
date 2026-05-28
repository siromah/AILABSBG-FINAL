import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('ailabs_cookie_consent');
    if (hasConsent) {
      try {
        setPrefs(JSON.parse(hasConsent));
      } catch (e) {
        console.error('Error parsing cookie consent', e);
      }
    } else {
      setShow(true);
    }

    const openListener = () => {
      setShow(true);
      setShowDetails(true);
    };
    window.addEventListener('open-cookie-banner', openListener);
    return () => window.removeEventListener('open-cookie-banner', openListener);
  }, []);

  if (!show) return null;

  const handleSave = (newPrefs: typeof prefs) => {
    localStorage.setItem('ailabs_cookie_consent', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setShow(false);
  };

  const acceptAll = () => {
    handleSave({ essential: true, analytics: true, marketing: true });
  };

  const rejectOptional = () => {
    handleSave({ essential: true, analytics: false, marketing: false });
  };

  const savePreferences = () => {
    handleSave(prefs);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 flex justify-center pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="w-full max-w-3xl bg-[var(--bg)] border border-[var(--border)] shadow-md rounded-[20px] p-6 lg:p-8 pointer-events-auto">
        {!showDetails ? (
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">Предпочитания за бисквитки</h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6 leading-relaxed">
              Използваме бисквитки, за да осигурим правилната работа на платформата и за анализи, които подобряват вашето преживяване. Може да прочетете повече в нашата <Link to="/cookie-policy" className="text-[var(--accent)] hover:underline">Политика за бисквитки</Link>.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={acceptAll} variant="primary">Приеми всички</Button>
              <Button onClick={rejectOptional} variant="secondary">Само необходими</Button>
              <Button onClick={() => setShowDetails(true)} variant="ghost" className="ml-auto">Настройки</Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-6">Настройки за бисквитки</h3>

            <div className="flex flex-col gap-5 mb-8">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--border)]">
                <div>
                  <div className="font-semibold text-[15px] text-[var(--ink-900)]">Необходими бисквитки</div>
                  <div className="text-[13px] text-[var(--text-tertiary)] max-w-lg mt-1">Задължителни за работата на сайта (сесии, теми). Не могат да бъдат изключени.</div>
                </div>
                <div className="bg-[var(--bg-soft)] px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[var(--text-secondary)] border border-[var(--border)]">Винаги активни</div>
              </div>

              <label className="flex justify-between items-center cursor-pointer pb-4 border-b border-[var(--border)] group">
                <div>
                  <div className="font-semibold text-[15px] text-[var(--ink-900)]">Аналитични</div>
                  <div className="text-[13px] text-[var(--text-tertiary)] max-w-lg mt-1">Помагат ни да разберем как използвате платформата чрез анонимни данни.</div>
                </div>
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[var(--border-strong)] rounded bg-[var(--bg)] checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-colors cursor-pointer"
                    checked={prefs.analytics}
                    onChange={e => setPrefs({...prefs, analytics: e.target.checked})}
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 placeholder:transition-opacity" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </label>

              <label className="flex justify-between items-center cursor-pointer group">
                <div>
                  <div className="font-semibold text-[15px] text-[var(--ink-900)]">Маркетингови</div>
                  <div className="text-[13px] text-[var(--text-tertiary)] max-w-lg mt-1">Използват се за персонализирани реклами чрез трети страни.</div>
                </div>
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-[var(--border-strong)] rounded bg-[var(--bg)] checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-colors cursor-pointer"
                    checked={prefs.marketing}
                    onChange={e => setPrefs({...prefs, marketing: e.target.checked})}
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 placeholder:transition-opacity" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={savePreferences} variant="primary">Запази предпочитания</Button>
              <Button onClick={() => setShowDetails(false)} variant="ghost">Назад</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
