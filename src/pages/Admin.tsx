import React, { useState } from 'react';
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

export default function Admin({ db, updateDb, showToast }: any) {
  const [sec, setSec] = useState('dashboard');
  
  const users = db.users;
  const posts = db.posts;

  const adminDelUser = (uid: string) => {
    if (uid === 'admin') { showToast('Не може да се изтрие администраторски акаунт', true); return; }
    if (!confirm('Изтриване на този потребител?')) return;
    updateDb('users', users.filter((u:any) => u.id !== uid));
    showToast('Потребителят е изтрит');
  };

  const deletePost = (pid: string) => {
    if (!confirm('Изтриване на тази публикация?')) return;
    updateDb('posts', posts.filter((p:any) => p.id !== pid));
    showToast('Публикацията е изтрита');
  };

  const togglePin = (pid: string) => {
    const pIndex = posts.findIndex((x:any) => x.id === pid);
    if(pIndex !== -1) {
      const newPosts = [...posts];
      newPosts[pIndex].pinned = !newPosts[pIndex].pinned;
      updateDb('posts', newPosts);
      showToast(newPosts[pIndex].pinned ? 'Закачена' : 'Откачена');
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
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Присъединил се</th>
                  <th className="py-2.5 px-4 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((u:any) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-soft)]/50 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={u.initials} size="sm" />
                        <span className="font-semibold text-[13px] text-[var(--ink-900)]">{u.fname} {u.lname}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)]">{u.email}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant={u.isAdmin ? 'danger' : 'default'} className="px-2 py-0.5 rounded-full text-[10px]">
                        {u.isAdmin ? 'Админ' : u.role}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-[13px] text-[var(--text-tertiary)]">{u.joined}</td>
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
                  const a = users.find((u:any) => u.id === p.uid) || {fname:'?',lname:''};
                  return (
                    <tr key={p.id} className="hover:bg-[var(--bg-soft)]/50 transition-colors">
                      <td className="py-2.5 px-4 text-[13px] font-semibold text-[var(--ink-900)] whitespace-nowrap">{a.fname} {a.lname}</td>
                      <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)] max-w-[300px] truncate">{p.text}</td>
                      <td className="py-2.5 px-4 text-[13px] text-[var(--text-secondary)]">{p.likes.length}</td>
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
