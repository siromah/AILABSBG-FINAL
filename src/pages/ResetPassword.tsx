import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Lock } from 'lucide-react';

export function ResetPassword() {
  const { updatePassword, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password.length < 8) {
      setError('Паролата трябва да е поне 8 символа.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage('Паролата е обновена успешно.');

    setTimeout(() => {
      navigate('/profile', { replace: true });
    }, 900);
  }

  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--surface-strong)] border border-[var(--border)] shadow-sm rounded-3xl p-8 md:p-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[var(--emerald-light)] text-[var(--emerald)] flex items-center justify-center mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-[28px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">Нова парола</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">Моля, въведете новата си парола по-долу.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Нова парола</label>
            <Input
              type="password"
              value={password}
              placeholder="Въведете нова парола"
              autoComplete="new-password"
              onChange={(event:any) => setPassword(event.target.value)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-medium text-[var(--ink-900)]">Потвърдете паролата</label>
            <Input
              type="password"
              value={confirmPassword}
              placeholder="Потвърдете паролата"
              autoComplete="new-password"
              onChange={(event:any) => setConfirmPassword(event.target.value)}
              className="h-12 border-[var(--border)] bg-[var(--bg-soft)] rounded-xl"
            />
          </div>

          {error && <p className="text-[14px] text-[var(--rose)] font-medium mt-2">{error}</p>}
          {message && <p className="text-[14px] text-[var(--emerald)] bg-[var(--emerald-light)] border border-[var(--emerald)]/20 px-4 py-3 rounded-xl font-medium mt-2">{message}</p>}

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 text-[15px]" disabled={loading || !isConfigured}>
              {loading ? 'Обновяване...' : 'Обнови паролата'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
