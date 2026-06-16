import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const QUICK_ACTIONS = [
  'Обясни урока',
  'Опрости темата',
  'Дай пример',
];

export default function AITutor({ currentLessonTitle }: { currentLessonTitle?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMsgs: typeof messages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          history: messages,
          currentPage: 'missions',
          siteContext: `AILABS.BG Missions. ${currentLessonTitle ? `Текущ урок: ${currentLessonTitle}.` : ''} Отговаряй на български, кратко и ясно. Ако питат за обяснение, обясни. Ако питат за пример, дай конкретен пример.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessages([...newMsgs, { role: 'assistant', content: data.error || 'Възникна проблем. Опитай отново.' }]);
      } else {
        setMessages([...newMsgs, { role: 'assistant', content: data.answer || 'Няма отговор.' }]);
      }
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'Проблем с връзката. Провери интернета и опитай пак.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-[var(--accent)] text-white shadow-md hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center"
        aria-label="AI Учител"
      >
        <Bot size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] max-h-[70vh] flex flex-col retina-card overflow-hidden shadow-xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[var(--ink-900)]">AI Учител</p>
                  <p className="text-[13px] text-[var(--text-tertiary)]">Помощ за мисиите</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-[var(--bg-soft)] text-[var(--text-secondary)]">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3.5 min-h-[220px]">
              {messages.length === 0 && (
                <div className="space-y-2.5">
                  <p className="text-[15px] text-[var(--text-secondary)] mb-3">Как мога да ти помогна?</p>
                  {QUICK_ACTIONS.map((a) => (
                    <button
                      key={a}
                      onClick={() => send(a)}
                      className="w-full text-left px-4 py-3 rounded-xl text-[15px] bg-[var(--bg-soft)] hover:bg-[var(--accent-light)] text-[var(--text-primary)] transition-colors"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[var(--accent)] text-white rounded-br-md'
                        : 'bg-[var(--bg-soft)] text-[var(--text-primary)] rounded-bl-md border border-[var(--border)]'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-soft)] border border-[var(--border)] px-4 py-2.5 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-[var(--border)] flex items-center gap-2.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Попитай нещо..."
                className="flex-1 bg-[var(--bg-soft)] border border-[var(--border)] rounded-xl px-4 py-3 text-[15px] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-11 h-11 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[var(--accent-hover)] transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
