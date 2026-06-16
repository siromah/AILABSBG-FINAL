import { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Обясни по-просто', prompt: 'Обясни ми темата по-просто с пример.' },
  { label: 'Дай пример', prompt: 'Дай ми конкретен пример за тази тема.' },
  { label: 'Провери отговора ми', prompt: 'Провери дали разбирам правилно темата.' },
];

export default function AITutorPanel({ missionTitle }: { missionTitle: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');

  const send = async (prompt: string) => {
    if (loading) return;
    setLoading(prompt);
    setAnswer('');

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          currentPage: 'missions',
          siteContext: `AILABS.BG Missions. Текуща мисия: ${missionTitle}. Отговаряй на български, кратко, ясно и насърчително.`,
        }),
      });
      const data = await res.json();
      setAnswer(data.answer || 'Няма отговор.');
    } catch {
      setAnswer('Проблем с връзката. Опитай отново.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="premium-card p-6 sm:p-7 mt-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] text-[var(--text-secondary)] flex items-center justify-center">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--ink-900)]">AI Учител</h3>
          <p className="text-[13px] text-[var(--text-tertiary)]">Тук съм, ако имаш нужда от помощ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => send(action.prompt)}
            disabled={!!loading}
            className="text-left px-4 py-3 rounded-xl text-[14px] bg-[var(--bg-soft)] hover:bg-[var(--accent-light)] text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            {loading === action.prompt ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Мисля...
              </span>
            ) : (
              action.label
            )}
          </button>
        ))}
      </div>

      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-[var(--accent-light)]/40 border border-[var(--accent)]/20"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles size={16} className="text-[var(--accent)]" />
            <span className="text-[14px] font-semibold text-[var(--ink-900)]">Отговор</span>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}
