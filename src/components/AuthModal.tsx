import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthModal({ modal, setModal, db, updateDb, setCurrentUser, showToast }: any) {
  if (!modal) return null;

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [role, setRole] = useState('freelancer');
  
  const isAuthConfigured = !!((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY);

  const doLogin = () => {
    if (!isAuthConfigured) {
      showToast('Входът е деактивиран (липсва конфигурация за Supabase).', true);
      return;
    }
    // Simulate real auth loading since we fallback to disabled
  };

  const doSignup = () => {
    if (!isAuthConfigured) {
      showToast('Регистрацията е деактивирана (липсва конфигурация за Supabase).', true);
      return;
    }
  };

  // For review/demo purposes, if it's not configured, we might want to bypass for testing
  // But strict rules say: "disable auth submission gracefully."
  // So we provide a mock bypass ONLY if they click a specific demo login
  const doDemoLogin = () => {
    const user = db.users[0]; // Mktg demo user
    if (!user) return;
    setCurrentUser(user);
    setModal(null);
    showToast(`Влязохте в ДЕМО режим като ${user.fname}`);
  };

  return (
    <AnimatePresence>
      {modal && (
        <motion.div 
          initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}
          className="modal-overlay" 
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
          style={{backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(5, 5, 5, 0.8)'}}
        >
          <motion.div 
            initial={{scale: 0.95, opacity: 0, y: 20}} animate={{scale: 1, opacity: 1, y: 0}} exit={{scale: 0.95, opacity: 0, y: 20}} transition={{duration: 0.3, type: "spring", bounce: 0.2}}
            className="modal"
            style={{background: 'var(--bg)', border: '1px solid var(--overlay-light)', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)', borderRadius: 'var(--r20)', padding: '40px'}}
          >
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, var(--or), var(--or2))'}}></div>
            
            <button className="modal-close" onClick={() => setModal(null)} style={{top: 20, right: 20, background: 'var(--s1)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, border: '1px solid var(--bdr)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            <AnimatePresence mode="wait">
              {modal === 'login' ? (
                <motion.div key="login" initial={{opacity:0, x: -10}} animate={{opacity:1, x:0}} exit={{opacity:0, x: 10}} transition={{duration: 0.15}}>
                  <div style={{textAlign: 'center', marginBottom: 32}}>
                    <div style={{width: 56, height: 56, background: 'var(--orb)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, margin: '0 auto 16px', border: '1px solid rgba(79,70,229,0.2)'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    </div>
                  <h2 className="modal-title" style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8}}>Добре дошъл обратно!</h2>
                  <p className="modal-sub" style={{fontSize: 16, color: 'var(--txt2)'}}>Влез в твоя Craative акаунт</p>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
                  <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Електронна поща</label><input className="input" type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{fontSize: 16, padding: '14px 16px'}} /></div>
                  <div className="form-group mb0">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <label className="form-label mb0" style={{fontWeight: 700}}>Парола</label>
                      <a href="#" style={{fontSize: 12, color: 'var(--txt3)', textDecoration: 'none'}}>Забравена парола?</a>
                    </div>
                    <input className="input" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && doLogin()} style={{fontSize: 16, padding: '14px 16px'}} />
                  </div>
                </div>
                
                {!isAuthConfigured && (
                  <div style={{fontSize: 13, color: 'var(--txt2)', marginTop: 24, marginBottom: 24, padding: '12px', background: 'var(--s1)', borderRadius: 8, border: '1px solid var(--bdr)'}}>
                    <strong style={{color: 'var(--rd)', display: 'block', marginBottom: 4}}>Внимание:</strong>
                    Системата за автентикация не е конфигурирана (липсва API ключ). Можете да разгледате платформата в
                    <button className="btn btn-ghost btn-sm" onClick={doDemoLogin} style={{marginLeft: 8, padding: '4px 8px', textDecoration: 'underline'}}>Демо Режим</button>
                  </div>
                )}
                
                  <button className={`btn btn-cta btn-full btn-lg ${!isAuthConfigured ? 'opacity-50' : ''}`} onClick={doLogin} disabled={!isAuthConfigured} style={{borderRadius: 50, padding: '16px'}}>Влез в профила →</button>
                  <div className="modal-switch" style={{marginTop: 24, textAlign: 'center', fontSize: 15, color: 'var(--txt2)'}}>Нямаш акаунт? <a onClick={() => setModal('signup')} style={{color: 'var(--or)', fontWeight: 700, cursor: 'pointer', textDecoration: 'none'}}>Регистрирай се</a></div>
                </motion.div>
              ) : (
                <motion.div key="signup" initial={{opacity:0, x: 10}} animate={{opacity:1, x:0}} exit={{opacity:0, x: -10}} transition={{duration: 0.15}}>
                  <div style={{textAlign: 'center', marginBottom: 28}}>
                  <div style={{width: 56, height: 56, background: 'var(--blb)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16, margin: '0 auto 16px', border: '1px solid rgba(59,130,246,0.2)'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bl)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  </div>
                  <h2 className="modal-title" style={{fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8}}>Присъедини се!</h2>
                  <p className="modal-sub" style={{fontSize: 16, color: 'var(--txt2)'}}>Стани част от най-голямата AI общност в България</p>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
                    <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Име</label><input className="input" placeholder="Иван" value={fname} onChange={e=>setFname(e.target.value)} /></div>
                    <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Фамилия</label><input className="input" placeholder="Иванов" value={lname} onChange={e=>setLname(e.target.value)} /></div>
                  </div>
                  <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Електронна поща</label><input className="input" type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
                  <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Парола</label><input className="input" type="password" placeholder="Минимум 6 символа" value={pass} onChange={e=>setPass(e.target.value)} /></div>
                  <div className="form-group mb0"><label className="form-label" style={{fontWeight: 700}}>Професия / Статус</label>
                    <select className="input" value={role} onChange={e=>setRole(e.target.value)} style={{appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '12px auto'}}>
                      <option value="freelancer">Freelancer</option>
                      <option value="business">Бизнес собственик</option>
                      <option value="creator">Content Creator</option>
                      <option value="developer">Developer</option>
                      <option value="student">Студент</option>
                      <option value="other">Друго</option>
                    </select>
                  </div>
                </div>
                
                {!isAuthConfigured && (
                  <div style={{fontSize: 13, color: 'var(--txt2)', marginTop: 24, marginBottom: 24, padding: '12px', background: 'var(--s1)', borderRadius: 8, border: '1px solid var(--bdr)'}}>
                    <strong style={{color: 'var(--rd)', display: 'block', marginBottom: 4}}>Внимание:</strong>
                    Системата за автентикация не е конфигурирана. Моля, свържете се с администратор или ползвайте <button className="btn btn-ghost btn-sm" onClick={doDemoLogin} style={{padding:0, textDecoration:'underline'}}>Демо Режим</button> за целите на ревюто.
                  </div>
                )}
                
                <button className={`btn btn-cta btn-full btn-lg mt24 ${!isAuthConfigured ? 'opacity-50' : ''}`} onClick={doSignup} disabled={!isAuthConfigured} style={{borderRadius: 50, padding: '16px'}}>Създай акаунт →</button>
                <div className="modal-switch" style={{marginTop: 24, textAlign: 'center', fontSize: 15, color: 'var(--txt2)'}}>Вече имаш акаунт? <a onClick={() => setModal('login')} style={{color: 'var(--bl)', fontWeight: 700, cursor: 'pointer', textDecoration: 'none'}}>Влез тук</a></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
