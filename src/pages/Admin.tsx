import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useAuth } from '../contexts/AuthContext';
import { EVENTS_DATA, PROMPTS } from '../data';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Calendar, 
  Sparkles,
  Trash2,
  Pin,
  PinOff
} from 'lucide-react';

export default function Admin({ db, showToast, refreshDb }: any) {
  useDocumentTitle('Админ');
  const { session } = useAuth();
  const [sec, setSec] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [coachingRequests, setCoachingRequests] = useState<any[]>([]);

  const posts = db.posts || [];

  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
  });

  useEffect(() => {
    if (sec === 'users') loadUsers();
    if (sec === 'coaching') loadCoaching();
  }, [sec]);

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: apiHeaders() });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
      else showToast(data.error || 'Грешка при зареждане', true);
    } catch {
      showToast('Грешка при зареждане на потребители', true);
    } finally {
      setUsersLoading(false);
    }
  }

  async function loadCoaching() {
    try {
      const res = await fetch('/api/admin/coaching', { headers: apiHeaders() });
      const data = await res.json();
      if (res.ok) setCoachingRequests(data.requests || []);
    } catch {
      showToast('Грешка при зареждане', true);
    }
  }

  const adminDelUser = async (uid: string) => {
    if (!confirm('Изтриване на този потребител?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: apiHeaders(),
        body: JSON.stringify({ userId: uid }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Потребителят е изтрит');
        loadUsers();
      } else {
        showToast(data.error || 'Грешка', true);
      }
    } catch {
      showToast('Грешка при изтриване', true);
    }
  };

  const deletePost = async (pid: string) => {
    if (!confirm('Изтриване на тази публикация?')) return;
    try {
      const res = await fetch(`/api/posts/${pid}`, {
        method: 'DELETE',
        headers: apiHeaders(),
      });
      if (res.ok) {
        showToast('Публикацията е изтрита');
        if (refreshDb) await refreshDb();
      } else {
        const data = await res.json();
        showToast(data.error || 'Грешка', true);
      }
    } catch {
      showToast('Грешка при изтриване', true);
    }
  };

  const togglePin = async (pid: string) => {
    const post = posts.find((p: any) => p.id === pid);
    if (!post) return;
    try {
      const res = await fetch(`/api/posts/${pid}`, {
        method: 'PATCH',
        headers: apiHeaders(),
        body: JSON.stringify({ pinned: !post.pinned }),
      });
      if (res.ok) {
        showToast(!post.pinned ? 'Закачена' : 'Откачена');
        if (refreshDb) await refreshDb();
      } else {
        const data = await res.json();
        showToast(data.error || 'Грешка', true);
      }
    } catch {
      showToast('Грешка', true);
    }
  };

  const renderSec = () => {
    if(sec === 'dashboard') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Преглед</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="premium-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--accent)]" />
            <div className="text-[30px] font-medium text-[var(--accent)] mb-1">{users.length}</div>
            <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Потребители</div>
          </div>
          <div className="premium-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--amber)]" />
            <div className="text-[30px] font-medium text-[var(--amber)] mb-1">{posts.length}</div>
            <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Публикации</div>
          </div>
          <div className="premium-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--emerald)]" />
            <div className="text-[30px] font-medium text-[var(--emerald)] mb-1">{posts.reduce((s:number,p:any)=>s+(p.comments||[]).length,0)}</div>
            <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Коментари</div>
          </div>
          <div className="premium-card p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--rose)]" />
            <div className="text-[30px] font-medium text-[var(--rose)] mb-1">{EVENTS_DATA.length}</div>
            <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Събития</div>
          </div>
        </div>
      </div>
    );
    
    if (sec === 'users') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Потребители ({users.length})</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[var(--bg-soft)] border-b border-[var(--border)]">
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Потребител</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Имейл</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Роля</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">План</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {usersLoading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[var(--text-secondary)]">Зареждане...</td></tr>
                ) : users.map((u:any) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-soft)]/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={u.initials || u.full_name?.charAt(0) || '?'} size="sm" />
                        <span className="font-semibold text-[13px] text-[var(--ink-900)]">{u.full_name || 'Потребител'}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)]">{u.email}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant={u.role === 'admin' ? 'danger' : 'default'} className="px-2 py-0.5 rounded-full text-[10px]">
                        {u.role === 'admin' ? 'Админ' : u.role}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)] capitalize">{u.plan}</td>
                    <td className="py-2.5 px-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => adminDelUser(u.id)} className="text-[var(--rose)] hover:bg-[var(--rose-light)]/50 h-7 px-2 group">
                        <Trash2 size={14} className="opacity-70 group-hover:opacity-100" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
    
    if (sec === 'posts') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Публикации ({posts.length})</h2>
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[var(--bg-soft)] border-b border-[var(--border)]">
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Автор</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Съдържание</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Харесвания</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Закачена</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {posts.map((p:any) => {
                  const a = p.profiles || { full_name: '?' };
                  return (
                    <tr key={p.id} className="hover:bg-[var(--bg-soft)]/50 transition-colors">
                      <td className="py-2.5 px-4 text-[13px] font-semibold text-[var(--ink-900)] whitespace-nowrap">{a.full_name}</td>
                      <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)] max-w-[300px] truncate">{p.text}</td>
                      <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)]">{(p.post_likes || []).length}</td>
                      <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)]">{p.pinned ? 'Да' : '-'}</td>
                      <td className="py-2.5 px-4 text-right flex justify-end gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => togglePin(p.id)} className="h-7 px-2 text-[var(--text-secondary)] hover:text-[var(--ink-900)]">
                          {p.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deletePost(p.id)} className="text-[var(--rose)] hover:bg-[var(--rose-light)]/50 h-7 px-2 group">
                          <Trash2 size={14} className="opacity-70 group-hover:opacity-100" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
    
    if (sec === 'events-a') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Събития ({EVENTS_DATA.length})</h2>
        <div className="flex flex-col gap-3">
          {EVENTS_DATA.map((e:any) => (
            <div key={e.id} className="premium-card p-4 flex justify-between items-center flex-wrap gap-3">
              <div>
                <div className="font-medium text-[15px] text-[var(--ink-900)] mb-0.5 leading-tight">{e.title}</div>
                <div className="text-[12px] text-[var(--text-secondary)] font-medium">{e.day} {e.mo} &middot; {e.time} &middot; {e.spots} места</div>
              </div>
              <Badge variant="success" className="px-2.5 py-1 whitespace-nowrap rounded-full text-[10px]">Активно</Badge>
            </div>
          ))}
        </div>
      </div>
    );
    
    if (sec === 'prompts-a') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Библиотека ({PROMPTS.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMPTS.map((p:any) => (
            <div key={p.id} className="premium-card p-5 flex flex-col h-full">
              <div className="font-medium text-[14px] text-[var(--ink-900)] mb-2 leading-snug">{p.title}</div>
              <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4 flex-1">{p.text}</div>
              <div className="inline-flex items-center bg-[var(--bg-soft)] border border-[var(--border)] px-2.5 py-1 rounded-full text-[12px] font-semibold text-[var(--text-secondary)] self-start">
                {p.saves} запазвания
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    if (sec === 'coaching') return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-[20px] font-medium tracking-tight text-[var(--ink-900)] mb-6">Coaching заявки ({coachingRequests.length})</h2>
        <div className="flex flex-col gap-3">
          {coachingRequests.map((r: any) => (
            <div key={r.id} className="premium-card p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-[15px] text-[var(--ink-900)]">{r.name}</div>
                  <div className="text-[12px] text-[var(--text-secondary)]">{r.email}</div>
                </div>
                <Badge variant={r.status === 'pending' ? 'warning' : r.status === 'contacted' ? 'info' : 'default'} className="rounded-full text-[10px]">{r.status}</Badge>
              </div>
              <div className="text-[13px] text-[var(--text-secondary)] mb-2">{r.message}</div>
              <div className="text-[12px] text-[var(--text-tertiary)]">Бюджет: {r.budget || 'Не е посочен'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-72px)] w-full section-shell py-6 grain">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-[220px] shrink-0">
          <div className="sticky top-[88px]">
            <div className="label-caps mb-3 px-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Администрация
            </div>
            <div className="space-y-0.5">
              {[
                { id: 'dashboard', label: 'Преглед', icon: LayoutDashboard },
                { id: 'users', label: 'Потребители', icon: Users },
                { id: 'posts', label: 'Публикации', icon: MessageSquare },
                { id: 'coaching', label: 'Coaching', icon: Sparkles },
                { id: 'events-a', label: 'Събития', icon: Calendar },
                { id: 'prompts-a', label: 'Библиотека', icon: Sparkles }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSec(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1
                    ${sec === item.id 
                      ? 'bg-[var(--surface-strong)] shadow-sm text-[var(--ink-900)] border border-[var(--border)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--ink-900)] hover:bg-[var(--bg-soft)] border border-transparent'
                    }
                  `}
                >
                  <item.icon size={16} className={sec === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {renderSec()}
        </div>
      </div>
    </div>
  );
}
