import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { KeyRound } from 'lucide-react';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ForgotPassword() {
  const { resetPassword, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isConfigured) {
      setError('Възстановяването на парола не е конфигурирано.');
      return;
    }

    if (!isEmail(email)) {
      setError('Моля, въведете валиден имейл адрес.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage('Моля, проверете имейла си за линк за възстановяване на паролата.');
  }

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--surface-strong)] border border-[var(--border)] shadow-sm rounded-3xl p-8 md:p-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-light)]/10 text-[var(--accent)] flex items-center justify-center mb-4">
            <KeyRound size={24} />
          </div>
          <h1 className="text-[28px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">Възстановяване на парола</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">Въведете имейла си и ще ви изпратим линк за възстановяване.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {error && <p className="text-[14px] text-[var(--rose)] font-medium mt-2">{error}</p>}
          {message && <p className="text-[14px] text-[var(--emerald)] bg-[var(--emerald-light)] border border-[var(--emerald)]/20 px-4 py-3 rounded-xl font-medium mt-2">{message}</p>}

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 text-[15px]" disabled={loading || !isConfigured}>
              {loading ? 'Изпращане...' : 'Изпрати линк'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-[var(--text-secondary)]">
          <Link to="/login" className="font-semibold text-[var(--ink-900)] hover:text-[var(--accent)] transition-colors">
            Обратно към входа
          </Link>
        </div>
      </div>
    </main>
  );
}
