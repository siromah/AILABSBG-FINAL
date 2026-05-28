import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Register() {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isConfigured) {
      setError('Регистрацията все още не е конфигурирана.');
      return;
    }

    if (fullName.trim().length < 2) {
      setError('Въведи името си.');
      return;
    }

    if (!isEmail(email)) {
      setError('Въведи валиден имейл адрес.');
      return;
    }

    if (password.length < 8) {
      setError('Паролата трябва да е поне 8 символа.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }

    if (!acceptedTerms) {
      setError('Трябва да приемеш Условията и Политиката за поверителност.');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, fullName.trim());
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage('Провери имейла си, за да потвърдиш акаунта.');
      return;
    }

    navigate('/profile', { replace: true });
  }

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--surface-strong)] border border-[var(--border)] shadow-sm rounded-3xl p-8 md:p-10">
        <div className="text-center mb-10">
          <h1 className="text-[30px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">Създай акаунт</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">Присъедини се към Craative, за да отключиш всички функции.</p>
        </div>

        {!isConfigured && (
          <div className="bg-[var(--amber-light)] text-[var(--amber-text)] px-4 py-3 rounded-xl text-[14px] mb-6 border border-[var(--amber)]/20">
            Регистрацията не е конфигурирана в момента.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Име</label>
            <Input
              type="text"
              value={fullName}
              autoComplete="name"
              placeholder="Твоето име"
              onChange={(event:any) => setFullName(event.target.value)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Имейл адрес</label>
            <Input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="you@company.com"
              onChange={(event:any) => setEmail(event.target.value)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Парола</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Създай парола"
                autoComplete="new-password"
                onChange={(event:any) => setPassword(event.target.value)}
                className="h-12 border-[var(--border)] bg-[var(--bg-soft)] pr-12 rounded-xl"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Скрий паролата' : 'Покажи паролата'}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--ink-900)] p-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Потвърдете паролата</label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder="Потвърди паролата"
              autoComplete="new-password"
              onChange={(event:any) => setConfirmPassword(event.target.value)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          <label className="flex items-start gap-3 mt-4 pt-2 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                className="peer appearance-none w-5 h-5 border-2 border-[var(--border-strong)] rounded bg-[var(--bg)] checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-colors"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[14px] text-[var(--text-secondary)] leading-snug">
              Съгласен съм с <Link to="/terms" className="text-[var(--accent)] hover:underline">Условията</Link> и <Link to="/privacy" className="text-[var(--accent)] hover:underline">Политиката за поверителност</Link>.
            </span>
          </label>

          {error && <p className="text-[14px] text-[var(--rose)] font-medium mt-2">{error}</p>}
          {message && <p className="text-[14px] text-[var(--emerald)] bg-[var(--emerald-light)] border border-[var(--emerald)]/20 px-4 py-3 rounded-xl font-medium mt-2">{message}</p>}

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 text-[15px]" disabled={loading || !isConfigured}>
              {loading ? 'Създавам акаунт...' : 'Създай акаунт'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-[var(--text-secondary)]">
          Вече имаш акаунт?{' '}
          <Link to="/login" className="font-semibold text-[var(--ink-900)] hover:text-[var(--accent)] transition-colors">
            Вход
          </Link>
        </div>
      </div>
    </main>
  );
}
