import React from 'react';
import { ArrowRight, BookOpen, Copy, PlayCircle } from 'lucide-react';

export function WorkspacePreview() {
  return (
    <div className="glass-panel rounded-[32px] p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-tertiary)]">
            Работно пространство
          </p>
          <h3 className="mt-2 text-xl font-semibold text-[var(--ink-900)]">
            Продължи обучението
          </h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)]/12">
          <BookOpen className="h-5 w-5 text-[var(--brand)]" />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-white/45 p-4 dark:bg-white/[0.04]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Следващ урок</p>
            <h4 className="mt-1 text-lg font-semibold text-[var(--ink-900)]">
              Prompt Engineering за реална работа
            </h4>
          </div>
          <button className="rounded-full bg-[var(--ink-900)] px-4 py-2 text-sm font-medium text-[var(--bg)]">
            Старт
          </button>
        </div>

        <div className="mt-4 h-2 rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-2 w-[42%] rounded-full bg-[var(--brand)]" />
        </div>

        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          42% завършен модул
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <button className="rounded-2xl border border-[var(--border)] bg-white/35 p-4 text-left transition hover:border-[var(--brand)]/40 dark:bg-white/[0.04]">
          <Copy className="mb-3 h-4 w-4 text-[var(--brand)]" />
          <p className="font-medium text-[var(--ink-900)]">Копирай prompt</p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            За LinkedIn съдържание
          </p>
        </button>

        <button className="rounded-2xl border border-[var(--border)] bg-white/35 p-4 text-left transition hover:border-[var(--brand)]/40 dark:bg-white/[0.04]">
          <PlayCircle className="mb-3 h-4 w-4 text-[var(--brand)]" />
          <p className="font-medium text-[var(--ink-900)]">Live сесия</p>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            AI за малък бизнес
          </p>
        </button>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink-900)] px-4 py-3 text-sm font-semibold text-[var(--bg)] transition hover:opacity-90">
        Отвори dashboard
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
