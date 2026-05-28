import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bookmark, Copy, Lightbulb, Check, ArrowRight, Lock } from 'lucide-react';
import { PROMPTS } from '../data';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { getUserPlan, canAccessPrompt } from '../lib/access';
import { UpgradeCard } from '../components/UpgradeCard';

const CAT_LABELS: Record<string, string> = {
  marketing: 'Маркетинг',
  business: 'Бизнес',
  content: 'Съдържание',
  productivity: 'Продуктивност',
  automation: 'Автоматизация',
};

const CAT_ORDER = ['all', 'marketing', 'business', 'content', 'productivity', 'automation'];

export default function Prompts({ db, updateDb, showToast, currentUser, setPage }: any) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const plan = getUserPlan(currentUser);
  const saved = db.savedPrompts || [];

  const filtered = PROMPTS.filter((p: any) => {
    if (savedOnly && !saved.includes(p.id)) return false;
    if (cat !== 'all' && p.cat !== cat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToast('Prompt копиран');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleSave = (id: string) => {
    let newSaved;
    if (saved.includes(id)) {
      newSaved = saved.filter((x: string) => x !== id);
      showToast('Премахнато');
    } else {
      newSaved = [...saved, id];
      showToast('Запазено');
    }
    updateDb('savedPrompts', newSaved);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        {/* Header */}
        <div className="mb-10">
          <span className="label-caps mb-3 block">Библиотека</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="display-lg text-[var(--ink-900)] mb-3">
                AI Prompts
              </h1>
              <p className="text-[16px] text-[var(--text-secondary)] max-w-lg leading-relaxed">
                Подбрани prompts за бизнес, маркетинг, продуктивност и автоматизация. Копирайте и използвайте веднага.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-[var(--text-tertiary)] shrink-0">
              <span>{PROMPTS.length} общо</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              <span>{saved.length} запазени</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={16} />
            <Input
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              placeholder="Търсене в prompts..."
              className="pl-10 h-11 rounded-full text-[14px] border-[var(--border)] bg-[var(--surface-strong)]"
            />
          </div>

          <Button
            variant={savedOnly ? 'primary' : 'secondary'}
            onClick={() => setSavedOnly(v => !v)}
            className="h-11 shrink-0 px-5"
          >
            <Bookmark size={14} className={savedOnly ? "fill-white" : ""} /> Запазени ({saved.length})
          </Button>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar snap-x snap-mandatory hide-scrollbar">
          {CAT_ORDER.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`snap-start shrink-0 px-4 h-10 rounded-full text-[13px] font-medium transition-all border ${
                cat === c
                  ? 'bg-[var(--ink-900)] text-[var(--bg)] border-[var(--ink-900)]'
                  : 'bg-transparent text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--ink-900)]'
              }`}
            >
              {c === 'all' ? 'Всички' : CAT_LABELS[c]}
            </button>
          ))}
        </div>

        {/* Prompts grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-full">
                <EmptyState
                  icon={<Lightbulb size={32} />}
                  title="Няма намерени prompts"
                  description="Опитайте с други ключови думи или изчистете филтрите."
                  action={<Button variant="secondary" onClick={() => { setSearch(''); setCat('all'); setSavedOnly(false); }}>Изчисти филтрите</Button>}
                />
              </motion.div>
            ) : filtered.map((p: any, idx: number) => {
              const isSaved = saved.includes(p.id);
              const isCopied = copiedId === p.id;
              const accessible = canAccessPrompt(p, plan);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2, delay: idx * 0.02 }}
                  key={p.id}
                >
                  <div className="premium-card p-5 md:p-6 h-full flex flex-col group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--brand)] uppercase tracking-wider">
                          {CAT_LABELS[p.cat] || p.cat}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)]">{p.saves} запазвания</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className={`h-9 w-9 rounded-full border border-[var(--border)] transition flex items-center justify-center shrink-0 ${isSaved ? 'bg-[var(--emerald-light)] text-[var(--emerald)] border-[var(--emerald)]/20' : 'hover:bg-[var(--ink-900)] hover:text-[var(--bg)]'}`}
                          onClick={() => toggleSave(p.id)}
                          title={isSaved ? 'Премахни от запазени' : 'Запази'}
                        >
                          <Bookmark size={14} className={isSaved ? "fill-[var(--emerald)]" : ""} />
                        </button>
                        {accessible && (
                          <button
                            className="h-9 w-9 rounded-full border border-[var(--border)] transition flex items-center justify-center shrink-0 hover:bg-[var(--ink-900)] hover:text-[var(--bg)]"
                            onClick={() => copy(p.id, p.text)}
                            title="Копирай"
                          >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                    <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2 leading-snug">
                      {p.title}
                    </h3>
                    {accessible ? (
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
                        {p.text}
                      </p>
                    ) : (
                      <div className="relative mb-4 flex-1">
                        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed blur-sm select-none">
                          {p.text}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-soft)] border border-[var(--border)] text-[12px] font-medium text-[var(--text-tertiary)]">
                            <Lock size={12} /> Pro
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-tertiary)]">
                        {accessible ? (p.text.length > 200 ? 'Дълъг prompt' : 'Кратък prompt') : 'Заключен'}
                      </span>
                      {accessible ? (
                        <button
                          onClick={() => copy(p.id, p.text)}
                          className="text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors"
                        >
                          {isCopied ? 'Копирано' : 'Копирай'} <ArrowRight size={13} />
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--text-tertiary)]">Включено в Pro</span>
                      )}
                    </div>
                    {!accessible && (
                      <div className="mt-4">
                        <UpgradeCard
                          title="Отключи пълния prompt"
                          description="Включено в Pro"
                          onUpgrade={() => setPage('pricing')}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
