import { FormEvent, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function Login() {
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    typeof location.state === 'object' &&
    location.state &&
    'from' in location.state
      ? String(location.state.from)
      : '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!isConfigured) {
      setError('Входът все още не е конфигуриран.');
      return;
    }

    if (!isEmail(email)) {
      setError('Въведи валиден имейл адрес.');
      return;
    }

    if (!password) {
      setError('Въведи паролата си.');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-[var(--surface-strong)] border border-[var(--border)] shadow-sm rounded-3xl p-8 md:p-10">
        <div className="text-center mb-10">
          <h1 className="text-[30px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">Отново си тук</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">Влез, за да продължиш към AILABSBG.</p>
        </div>

        {!isConfigured && (
          <div className="bg-[var(--amber-light)] text-[var(--amber-text)] px-4 py-3 rounded-xl text-[14px] mb-6 border border-[var(--amber)]/20">
            Входът не е конфигуриран. Добави VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Имейл адрес</label>
            <Input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="you@company.com"
              onChange={(event:any) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-medium text-[var(--ink-900)]">Парола</label>
              <Link to="/forgot-password" className="text-[13px] font-medium text-[var(--accent)] hover:underline">
                Забравена парола?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Въведи паролата си"
                autoComplete="current-password"
                onChange={(event:any) => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
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

          {error && <p className="text-[14px] text-[var(--rose)] font-medium mt-2">{error}</p>}

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 text-[15px]" disabled={loading || !isConfigured}>
              {loading ? 'Влизам...' : 'Вход'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-[var(--text-secondary)]">
          Нямаш акаунт?{' '}
          <Link to="/register" className="font-semibold text-[var(--ink-900)] hover:text-[var(--accent)] transition-colors">
            Създай акаунт
          </Link>
        </div>
      </div>
    </main>
  );
}
