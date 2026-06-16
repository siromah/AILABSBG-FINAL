import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { PenTool, Sparkles, Send, Loader2, CheckCircle2, ThumbsUp, AlertCircle, Lightbulb } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import type { PracticalTask } from '../../lib/missionTypes';

function parseFeedback(raw: string) {
  const goodMatch = raw.match(/(?:✅|Добри страни|Какво е добро|Какво направи добре)[：:]?\s*([\s\S]*?)(?=\n\s*(?:⚠️|❗|Какво липсва|Какво може да подобриш|Как да го подобриш|Продължавай|$))/i);
  const missingMatch = raw.match(/(?:⚠️|❗|Какво липсва|Какво може да подобриш)[：:]?\s*([\s\S]*?)(?=\n\s*(?:💡|✅|Как да го подобриш|Продължавай|$))/i);
  const improveMatch = raw.match(/(?:💡|Как да го подобриш|Продължавай)[：:]?\s*([\s\S]*)/i);

  const good = goodMatch?.[1].trim();
  const missing = missingMatch?.[1].trim();
  const improve = improveMatch?.[1].trim();

  if (!good && !missing && !improve) {
    return { fullText: raw.trim() };
  }

  return { good, missing, improve };
}

export default function PracticalTaskStep({
  task,
  missionTitle,
  onComplete,
}: {
  task: PracticalTask;
  missionTitle: string;
  onComplete: () => void;
}) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const parsed = useMemo(() => (feedback ? parseFeedback(feedback) : null), [feedback]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionTitle,
          taskTitle: task.title,
          answer,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      if (data.feedback) {
        setFeedback(data.feedback);
      } else {
        throw new Error('No feedback');
      }
    } catch {
      const example = task.exampleAnswer;
      setFeedback(
        `✅ Какво е добро:
Опитваш се да приложиш наученото на практика, което е най-важната стъпка.

⚠️ Какво липсва:
Сравни своя отговор с примерен отговор: ${example.slice(0, 200)}${example.length > 200 ? '...' : ''}.
Опитай се да бъдеш по-конкретен: добави роля, формат и ограничения, където е възможно.

💡 Как да го подобриш:
Помисли как би измерил успеха на това, което предлагаш. Продължавай да практикуваш — всеки опит те доближава до по-добри резултати.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-5">
        <PenTool size={20} className="text-[var(--secondary)]" />
        <h2 className="text-[20px] font-semibold text-[var(--ink-900)]">Приложи наученото</h2>
      </div>

      <div className="bg-[var(--bg-soft)] rounded-2xl p-5 sm:p-6 mb-6 border border-[var(--border)]">
        <h3 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1.5">{task.title}</h3>
        <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{task.instructions}</p>
      </div>

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={task.placeholder}
        rows={7}
        disabled={submitted}
        className="mb-5"
      />

      {!submitted ? (
        <Button variant="primary" size="md" onClick={handleSubmit} disabled={!answer.trim() || loading} isLoading={loading}>
          <Send size={16} /> Провери с AI Учител
        </Button>
      ) : (
        <Button variant="secondary" size="md" disabled>
          <CheckCircle2 size={16} /> Изпратено
        </Button>
      )}

      {parsed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 p-6 rounded-2xl bg-[var(--accent-light)]/40 border border-[var(--accent)]/20"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <Sparkles size={18} className="text-[var(--accent)]" />
            <h3 className="text-[16px] font-semibold text-[var(--ink-900)]">Обратна връзка</h3>
          </div>

          {'fullText' in parsed && parsed.fullText ? (
            <div className="text-[15px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {parsed.fullText}
            </div>
          ) : (
            <div className="space-y-5">
              {parsed.good && (
                <div className="flex gap-3.5">
                  <ThumbsUp size={18} className="text-[var(--green)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">Какво е добро</p>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{parsed.good}</p>
                  </div>
                </div>
              )}
              {parsed.missing && (
                <div className="flex gap-3.5">
                  <AlertCircle size={18} className="text-[var(--orange)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">Какво липсва</p>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{parsed.missing}</p>
                  </div>
                </div>
              )}
              {parsed.improve && (
                <div className="flex gap-3.5">
                  <Lightbulb size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">Как да го подобриш</p>
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{parsed.improve}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {submitted && (
        <div className="mt-7 flex justify-end">
          <Button variant="primary" size="md" onClick={onComplete}>
            Продължи
          </Button>
        </div>
      )}
    </div>
  );
}
