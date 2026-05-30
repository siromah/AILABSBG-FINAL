import React, { useState, useRef, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Lightbulb, GraduationCap, Calendar, Trophy, HelpCircle, Settings, Trash2, Heart, MessageSquare, Bookmark, Send, Zap, Lock, Star, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Input';
import { EVENTS_DATA } from '../data';
import { getUserPlan } from '../lib/access';
import { UpgradeCard } from '../components/UpgradeCard';

function useAutoResize() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const adjust = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };
  return { ref, adjust };
}

export default function Community({ db, updateDb, currentUser, openModal, showToast, setPage }: any) {
  useDocumentTitle('Общност');
  const [feedFilter, setFeedFilter] = useState('all');
  const [compExpanded, setCompExpanded] = useState(false);
  const [compText, setCompText] = useState('');
  const [compType, setCompType] = useState('win');

  const plan = getUserPlan(currentUser);
  const composerTextarea = useAutoResize();

  useEffect(() => {
    composerTextarea.adjust();
  }, [compText]);

  const addNotif = (text: string, icon = 'bell') => {
    const n = { id: 'n' + Date.now(), text, icon, time: Date.now(), read: false };
    updateDb('notifs', [n, ...db.notifs].slice(0, 50));
  };

  const submitPost = () => {
    if (!compText.trim()) { showToast('Напишете нещо, преди да публикувате', true); return; }
    const nTypeLabel = { win: 'Успех', question: 'Въпрос', workflow: 'Workflow', 'prompt-share': 'Prompt' } as any;
    const newPost = {
      id: 'p' + Date.now(),
      uid: currentUser.id,
      type: compType,
      text: compText.trim(),
      tags: [nTypeLabel[compType] || compType],
      likes: [], saved: [], comments: [],
      time: Date.now(), pinned: false
    };
    updateDb('posts', [newPost, ...db.posts]);
    setCompText('');
    setCompExpanded(false);
    showToast('Публикувано');
  };

  const toggleLike = (pid: string) => {
    if (!currentUser) { openModal('login'); return; }
    const posts = [...db.posts];
    const i = posts.findIndex(p => p.id === pid);
    if (i !== -1) {
      const idx = posts[i].likes.indexOf(currentUser.id);
      if (idx === -1) { posts[i].likes.push(currentUser.id); addNotif(`${currentUser.fname} хареса твоя пост`, 'heart'); }
      else { posts[i].likes.splice(idx, 1); }
      updateDb('posts', posts);
    }
  };

  const toggleSave = (pid: string) => {
    if (!currentUser) { openModal('login'); return; }
    const posts = [...db.posts];
    const i = posts.findIndex(p => p.id === pid);
    if (i !== -1) {
      if (!posts[i].saved) posts[i].saved = [];
      const idx = posts[i].saved.indexOf(currentUser.id);
      if (idx === -1) { posts[i].saved.push(currentUser.id); showToast('Запазено'); }
      else { posts[i].saved.splice(idx, 1); showToast('Премахнато'); }
      updateDb('posts', posts);
    }
  };

  const addComment = (pid: string, val: string) => {
    if (!currentUser) { openModal('login'); return; }
    if (!val.trim()) return;
    const posts = [...db.posts];
    const i = posts.findIndex(p => p.id === pid);
    if (i !== -1) {
      if (!posts[i].comments) posts[i].comments = [];
      posts[i].comments.push({ id: 'c' + Date.now(), uid: currentUser.id, text: val.trim(), time: Date.now() });
      updateDb('posts', posts);
      addNotif(`${currentUser.fname} коментира твоя пост`, 'message');
    }
  };

  const delPost = (pid: string) => {
    if (!confirm('Изтриване на тази публикация?')) return;
    updateDb('posts', db.posts.filter((p: any) => p.id !== pid));
    showToast('Изтрито');
  };

  const fTime = (ts: number) => {
    const d = Date.now() - ts;
    if (d < 60000) return 'току-що';
    if (d < 3600000) return `преди ${Math.floor(d / 60000)} мин`;
    if (d < 86400000) return `преди ${Math.floor(d / 3600000)} ч`;
    return `преди ${Math.floor(d / 86400000)} д`;
  };

  const getTypeInfo = (type: string) => {
    const m: any = { win: { label: 'Успех', variant: 'success' }, question: { label: 'Въпрос', variant: 'info' }, workflow: { label: 'Workflow', variant: 'warning' }, 'prompt-share': { label: 'Prompt', variant: 'accent' }, announcement: { label: 'Съобщение', variant: 'default' } };
    return m[type] || { label: type, variant: 'neutral' };
  };

  let postsToRender = db.posts;
  if (feedFilter !== 'all') postsToRender = postsToRender.filter((p: any) => p.type === feedFilter);
  postsToRender.sort((a: any, b: any) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.time - a.time);

  const escH = (t: string) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT SIDEBAR */}
          <div className="hidden lg:flex w-[240px] shrink-0 sticky top-[88px] flex-col gap-6 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">

            {/* User Card */}
            {currentUser ? (
              <div className="premium-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar size="md" initials={currentUser.initials} />
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-[var(--ink-900)] truncate">{currentUser.fname} {currentUser.lname}</div>
                    <div className="text-[12px] text-[var(--text-tertiary)] truncate">{currentUser.role || 'Член'}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Button variant="secondary" className="w-full justify-center text-[12px] h-9" onClick={() => setPage('profile')}>Профил</Button>
                  {currentUser.isAdmin && (
                    <Button variant="ghost" className="w-full justify-center text-rose text-[12px] h-9" onClick={() => setPage('admin')}><Settings size={13} /> Админ</Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="premium-card p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-[17px] font-semibold text-[var(--ink-900)] mb-1">Присъединете се</div>
                  <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">Свържете се с други професионалисти, които използват AI всеки ден.</div>
                  <Button className="w-full h-10 text-[14px]" onClick={() => openModal('signup')}>Регистрация</Button>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div>
              <div className="label-caps mb-2 px-1">Навигация</div>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => setFeedFilter('all')}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] transition-colors ${feedFilter === 'all' ? 'bg-[var(--bg-soft)] text-[var(--ink-900)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)]'}`}
                >
                  <Home size={15} /> Общност
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${feedFilter === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--border)] text-[var(--text-secondary)]'}`}>
                    {db.posts.length}
                  </span>
                </button>
                <button onClick={() => setPage('prompts')} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)] transition-colors">
                  <Lightbulb size={15} /> Prompts
                </button>
                <button onClick={() => setPage('lessons')} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)] transition-colors">
                  <GraduationCap size={15} /> Академия
                </button>
                <button onClick={() => setPage('events')} className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)] transition-colors">
                  <Calendar size={15} /> Събития
                </button>
              </div>
            </div>

            {/* Filters */}
            <div>
              <div className="label-caps mb-2 px-1">Филтри</div>
              <div className="flex flex-col gap-0.5">
                {[
                  { id: 'win', label: 'Успехи', icon: Trophy },
                  { id: 'question', label: 'Въпроси', icon: HelpCircle },
                  { id: 'workflow', label: 'Workflows', icon: Zap },
                  { id: 'prompt-share', label: 'Prompts', icon: Lightbulb }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFeedFilter(f.id)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] transition-colors ${feedFilter === f.id ? 'bg-[var(--bg-soft)] text-[var(--ink-900)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)]'}`}
                  >
                    <f.icon size={15} /> {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pro канали */}
            <div>
              <div className="label-caps mb-2 px-1">Pro канали</div>
              <div className="flex flex-col gap-0.5">
                {[
                  { id: 'qa', label: 'Q&A сесии', lock: 'Pro' },
                  { id: 'office', label: 'Office hours', lock: 'Pro' },
                  { id: 'reviews', label: 'Implementation reviews', lock: 'Premium' },
                  { id: 'pro-disc', label: 'Pro дискусии', lock: 'Pro' }
                ].map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => showToast('Този канал е част от ' + ch.lock + ' плана', true)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]/60 hover:text-[var(--ink-900)] transition-colors"
                  >
                    <Lock size={14} className="text-[var(--text-tertiary)]" />
                    {ch.label}
                    <span className="ml-auto text-[10px] font-medium text-[var(--text-tertiary)]">{ch.lock}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - MAIN FEED */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            <div className="mb-1">
              <span className="label-caps mb-1 block">Общност</span>
              <h1 className="text-[26px] md:text-[32px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">Споделяй и учи заедно</h1>
              <p className="text-[15px] text-[var(--text-secondary)]">Питай, показвай workflows, споделяй какво работи при теб.</p>
            </div>

            {/* Mobile Categories */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 snap-x custom-scrollbar hide-scrollbar">
              <Badge variant={feedFilter === 'all' ? 'default' : 'outline'} className="cursor-pointer snap-start shrink-0 rounded-full px-3 py-1 text-[12px]" onClick={() => setFeedFilter('all')}>Всички</Badge>
              <Badge variant={feedFilter === 'win' ? 'default' : 'outline'} className="cursor-pointer snap-start shrink-0 rounded-full px-3 py-1 text-[12px]" onClick={() => setFeedFilter('win')}>Успехи</Badge>
              <Badge variant={feedFilter === 'question' ? 'default' : 'outline'} className="cursor-pointer snap-start shrink-0 rounded-full px-3 py-1 text-[12px]" onClick={() => setFeedFilter('question')}>Въпроси</Badge>
              <Badge variant={feedFilter === 'workflow' ? 'default' : 'outline'} className="cursor-pointer snap-start shrink-0 rounded-full px-3 py-1 text-[12px]" onClick={() => setFeedFilter('workflow')}>Workflows</Badge>
              <Badge variant={feedFilter === 'prompt-share' ? 'default' : 'outline'} className="cursor-pointer snap-start shrink-0 rounded-full px-3 py-1 text-[12px]" onClick={() => setFeedFilter('prompt-share')}>Prompts</Badge>
            </div>

            {/* Weekly Rhythm */}
            <div className="premium-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="accent" className="rounded-full text-[10px] uppercase tracking-wider">Публично</Badge>
                <span className="text-[11px] text-[var(--text-tertiary)]">Тази седмица</span>
              </div>
              <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1">Prompt Engineering седмица</h3>
              <p className="text-[14px] text-[var(--text-secondary)] mb-3">
                Предизвикателство: Напиши 5 system prompts за различни бизнес задачи. Сподели в общността.
              </p>
              <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
                <Star size={12} /> Присъедини се и ти
              </div>
            </div>

            {/* Composer */}
            {currentUser ? (
              <div className="premium-card p-4 sm:p-5">
                <div className="flex gap-3 items-start">
                  <Avatar size="sm" initials={currentUser.initials} className="hidden sm:flex mt-0.5" />
                  <div className="flex-1 min-w-0">
                    {!compExpanded ? (
                      <button
                        onClick={() => setCompExpanded(true)}
                        className="w-full text-left px-4 py-2.5 bg-[var(--bg-soft)] text-[var(--text-tertiary)] border border-[var(--border)] rounded-full text-[13px] hover:bg-[var(--bg-soft)]/80 transition-colors"
                      >
                        Споделете workflow, въпрос или успех...
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                        <Textarea
                          ref={composerTextarea.ref}
                          value={compText}
                          onChange={(e: any) => { setCompText(e.target.value); composerTextarea.adjust(); }}
                          placeholder="Напишете нещо полезно..."
                          autoFocus
                          rows={1}
                          className="min-h-[60px] mb-3 text-[14px] rounded-2xl bg-[var(--bg-soft)] border-[var(--border)] overflow-hidden resize-none"
                        />

                        <div className="flex flex-wrap gap-2 mb-4">
                          {[
                            { id: 'win', label: 'Успех' },
                            { id: 'question', label: 'Въпрос' },
                            { id: 'workflow', label: 'Workflow' },
                            { id: 'prompt-share', label: 'Prompt' }
                          ].map(t => (
                            <Badge
                              key={t.id}
                              variant={compType === t.id ? 'accent' : 'outline'}
                              className="cursor-pointer text-[12px] py-1 px-2.5 rounded-full"
                              onClick={() => setCompType(t.id)}
                            >
                              {t.label}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-end items-center gap-2 pt-3 border-t border-[var(--border)]">
                          <Button variant="ghost" onClick={() => setCompExpanded(false)} className="h-8 text-[13px]">Отказ</Button>
                          <Button onClick={submitPost} disabled={!compText.trim()} className="h-8 text-[13px]"><Send size={14} /> Публикувай</Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-card p-6 text-center">
                <h2 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1 tracking-tight">Влезте, за да публикувате</h2>
                <p className="text-[14px] text-[var(--text-secondary)] mb-4">Присъединете се към общността и споделете вашия опит.</p>
                <div className="flex justify-center gap-3">
                  <Button variant="secondary" className="h-9 text-[13px]" onClick={() => openModal('login')}>Вход</Button>
                  <Button className="h-9 text-[13px]" onClick={() => openModal('signup')}>Регистрация</Button>
                </div>
              </div>
            )}

            {/* Feed List */}
            <div className="flex flex-col gap-4">
              {postsToRender.length === 0 ? (
                <div className="premium-card py-14 text-center">
                  <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1">Тук още няма публикации</h3>
                  <p className="text-[var(--text-secondary)] mb-4 text-[14px]">Бъди първият, който споделя опит или задава въпрос.</p>
                  <Button variant="secondary" className="h-9 text-[13px]" onClick={() => { setFeedFilter('all'); setCompExpanded(true); }}>Публикувай</Button>
                </div>
              ) : (
                <AnimatePresence>
                  {postsToRender.map((p: any) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PostCard
                        p={p} db={db} currentUser={currentUser} openModal={openModal}
                        toggleLike={toggleLike} toggleSave={toggleSave} addComment={addComment}
                        delPost={delPost} fTime={fTime} getTypeInfo={getTypeInfo} escH={escH}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Locked Community Areas */}
            <div className="mt-8">
              <div className="label-caps mb-4">Pro общност</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Q&A с екипа', desc: 'Седмични live сесии с нашия екип. Задавай въпроси и получавай отговори в реално време.' },
                  { title: 'Office Hours', desc: 'Индивидуални консултации за твоя бизнес и AI стратегия.' },
                  { title: 'Implementation Reviews', desc: 'Преглед на твоите AI workflows и системи от експерти.' }
                ].map(area => (
                  <div key={area.title} className="premium-card p-5 relative overflow-hidden">
                    <h4 className="text-[15px] font-semibold text-[var(--ink-900)] mb-1">{area.title}</h4>
                    <p className="text-[13px] text-[var(--text-secondary)] mb-4 leading-relaxed">{area.desc}</p>
                    <UpgradeCard
                      title="Отключи пълни възможности"
                      description="Включено в Pro и Premium плановете. Получи достъп до всички канали и сесии."
                      onUpgrade={() => setPage('pricing')}
                      className="!px-4 !py-3 !rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden xl:flex w-[240px] shrink-0 sticky top-[88px] flex-col gap-5 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pl-1">
            <div className="premium-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                <Trophy size={14} className="text-[var(--amber)]" /> Последни успехи
              </div>
              <div className="flex flex-col gap-2.5">
                {db.posts.filter((p: any) => p.type === 'win').slice(0, 3).map((p: any) => {
                  const a = db.users.find((u: any) => u.id === p.uid) || { fname: '?' };
                  return (
                    <div key={p.id} className="flex gap-2.5 p-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-xl items-start transition-all hover:border-[var(--border-strong)] hover:-translate-y-0.5">
                      <Avatar size="sm" initials={a.initials || a.fname.charAt(0)} />
                      <div className="text-[12px] text-[var(--text-secondary)] leading-snug">
                        <span className="font-semibold text-[var(--ink-900)]">{a.fname}</span>{' '}
                        {p.text.substring(0, 45)}{p.text.length > 45 ? '...' : ''}
                      </div>
                    </div>
                  );
                })}
                {db.posts.filter((p: any) => p.type === 'win').length === 0 && (
                  <p className="text-[12px] text-[var(--text-tertiary)]">Все още няма споделени успехи.</p>
                )}
              </div>
            </div>

            {/* Upcoming events */}
            <div className="premium-card p-5">
              <div className="flex items-center gap-2 mb-3 text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                <Calendar size={14} className="text-[var(--accent)]" /> Предстоящи събития
              </div>
              <div className="flex flex-col gap-3">
                {EVENTS_DATA.slice(0, 2).map(e => (
                  <div key={e.id} className="flex gap-3 p-3 bg-[var(--bg-soft)] border border-[var(--border)] rounded-xl items-start cursor-pointer hover:border-[var(--border-strong)] transition-colors" onClick={() => setPage('events')}>
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-light)] text-[var(--accent-text)] shrink-0">
                      <span className="text-[10px] font-bold leading-none">{e.mo}</span>
                      <span className="text-[14px] font-bold leading-none">{e.day}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--ink-900)] leading-snug truncate">{e.title}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{e.time} · {e.platform}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ p, db, currentUser, openModal, toggleLike, toggleSave, addComment, delPost, fTime, getTypeInfo, escH }: any) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const adjustComment = () => {
    const el = commentRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(() => {
    adjustComment();
  }, [commentText]);

  const a = db.users.find((u: any) => u.id === p.uid) || { initials: '?', color: 'var(--s2)', tc: 'var(--txt2)', fname: 'Потребител', lname: '' };
  const liked = currentUser && p.likes.includes(currentUser.id);
  const saved = currentUser && p.saved && p.saved.includes(currentUser.id);
  const isOwn = currentUser && p.uid === currentUser.id;
  const isAdmin = currentUser && currentUser.isAdmin;
  const ti = getTypeInfo(p.type);

  return (
    <div className="premium-card hover:border-[var(--border-strong)] transition-all duration-300">
      <div className="p-4 sm:p-5 relative">
        {p.pinned && (
          <div className="absolute top-0 right-5 bg-[var(--amber-light)] text-[var(--amber)] px-2.5 py-0.5 text-[10px] font-bold rounded-b-lg border-x border-b border-[var(--amber)]/20 uppercase tracking-widest">
            Закачена
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar size="sm" initials={a.initials} />
            <div>
              <div className="text-[14px] font-semibold text-[var(--ink-900)]">{a.fname} {a.lname}</div>
              <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 mt-0.5">
                {fTime(p.time)}
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${
                  ti.variant === 'success' ? 'bg-[var(--emerald-light)] text-[var(--emerald)] border-[var(--emerald)]/20' :
                    ti.variant === 'info' ? 'bg-sky-50 text-sky-600 border-sky-100' :
                      ti.variant === 'warning' ? 'bg-[var(--amber-light)] text-[var(--amber)] border-[var(--amber)]/20' :
                        'bg-[var(--bg-soft)] text-[var(--text-secondary)] border-[var(--border)]'
                }`}>
                  {ti.label}
                </span>
              </div>
            </div>
          </div>

          {(isOwn || isAdmin) && (
            <div className="relative group cursor-pointer p-1.5 -mr-1.5">
              <span className="text-[var(--text-tertiary)] group-hover:text-[var(--ink-900)] flex flex-col gap-[3px] px-1">
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
              </span>
              <div className="absolute top-full right-0 mt-1 bg-[var(--surface-strong)] border border-[var(--border)] shadow-md rounded-xl py-1 w-36 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <button onClick={() => delPost(p.id)} className="w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-[var(--rose-light)] text-[var(--rose)] transition-colors flex items-center gap-2">
                  <Trash2 size={13} /> Изтрий
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-[14px] text-[var(--ink-900)] leading-[1.65] mb-4 whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: escH(p.text) }} />

        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.tags.map((t: string) => (
              <Badge key={t} variant="outline" className="text-[11px] rounded-full">{t}</Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
          <button
            onClick={() => toggleLike(p.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border transition-colors ${liked ? 'bg-[var(--rose-light)] text-[var(--rose)] border-[var(--rose)]/20' : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] border-transparent hover:bg-[var(--border)] hover:text-[var(--ink-900)]'}`}
          >
            <Heart size={14} className={liked ? "fill-[var(--rose)] text-[var(--rose)]" : ""} /> {p.likes.length}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border transition-colors ${showComments ? 'bg-[var(--bg-soft)] text-[var(--ink-900)] border-[var(--border)]' : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] border-transparent hover:bg-[var(--border)] hover:text-[var(--ink-900)]'}`}
          >
            <MessageSquare size={14} /> {(p.comments || []).length}
          </button>

          <div className="flex-1"></div>

          <button
            onClick={() => toggleSave(p.id)}
            className={`flex items-center gap-1.5 p-1.5 rounded-full border transition-colors ${saved ? 'bg-[var(--emerald-light)] text-[var(--emerald)] border-[var(--emerald)]/20' : 'bg-transparent text-[var(--text-tertiary)] border-transparent hover:bg-[var(--bg-soft)] hover:text-[var(--ink-900)]'}`}
          >
            <Bookmark size={16} className={saved ? "fill-[var(--emerald)] text-[var(--emerald)]" : ""} />
          </button>
        </div>

        {/* COMMENTS */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                {(!p.comments || p.comments.length === 0) ? (
                  <div className="text-[12px] text-[var(--text-tertiary)] text-center py-4">Все още няма коментари. Започнете разговора.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {p.comments.map((c: any) => {
                      const ca = db.users.find((u: any) => u.id === c.uid) || { initials: '?', color: 'var(--s2)', tc: 'var(--txt2)', fname: '?', lname: '' };
                      return (
                        <div key={c.id} className="flex gap-2.5">
                          <Avatar size="sm" initials={ca.initials} />
                          <div className="flex-1 bg-[var(--bg-soft)] p-3 rounded-2xl rounded-tl-sm border border-[var(--border)]">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-[12px] font-semibold text-[var(--ink-900)]">{ca.fname} {ca.lname}</span>
                              <span className="text-[10px] text-[var(--text-tertiary)]">{fTime(c.time)}</span>
                            </div>
                            <div className="text-[13px] leading-snug text-[var(--text-primary)] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: escH(c.text) }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentUser ? (
                  <div className="flex gap-2.5 mt-4">
                    <Avatar size="sm" initials={currentUser.initials} className="hidden sm:flex shrink-0" />
                    <div className="flex-1 flex gap-2">
                      <textarea
                        ref={commentRef}
                        rows={1}
                        className="flex-1 w-full bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4 py-2.5 text-[13px] text-[var(--ink-900)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors shadow-sm resize-none overflow-hidden min-h-[40px]"
                        placeholder="Напишете коментар..."
                        value={commentText}
                        onChange={e => { setCommentText(e.target.value); adjustComment(); }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(p.id, commentText); setCommentText(''); } }}
                      />
                      <Button onClick={() => { addComment(p.id, commentText); setCommentText(''); }} className="rounded-full px-3.5 h-9 shrink-0 self-end" disabled={!commentText.trim()}>
                        <Send size={14} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-center text-[12px] text-[var(--text-secondary)] bg-[var(--bg-soft)] p-3 rounded-xl border border-[var(--border)]">
                    <button className="text-[var(--accent)] font-semibold hover:underline" onClick={() => openModal('login')}>Влезте</button>, за да коментирате.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
