import React, { useState } from 'react';
import { Mail, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
}) => {
  const { login, register } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form Fields
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  if (!isOpen) return null;

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Mohon masukkan email atau username dan kata sandi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email.trim(), password.trim());
      setIsLoading(false);
      if (res?.success) {
        onClose();
      } else {
        setError(res?.message || 'Login gagal.');
      }
    }, 400);
  };

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Mohon masukkan nama lengkap.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register(name.trim(), email.trim().toLowerCase(), password.trim(), referralCode.trim());
      setIsLoading(false);
      if (res?.success) {
        onClose();
      } else {
        setError(res?.message || 'Pendaftaran gagal.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md my-auto flex flex-col items-center animate-in zoom-in-95 duration-150">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-4 select-none">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2.5 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#0f172a] flex items-center justify-center text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5 bg-amber-300 px-3 py-1 rounded-xl border-2.5 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#0f172a]">
            <span>S3L GMAIL</span>
            <span className="text-indigo-700">Carlos69</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#fffefb] w-full rounded-2xl border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] p-6 sm:p-8 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-rose-300 hover:bg-rose-400 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 flex items-center justify-center transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Tutup"
          >
            <X className="w-5 h-5 font-black" />
          </button>

          {/* Segmented Switcher: Masuk | Daftar */}
          <div className="bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-amber-300 text-slate-900 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-slate-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Masuk */}
          {tab === 'login' ? (
            <form onSubmit={handleSubmitLogin} className="space-y-4">
              {/* Input Email / Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 block">Email atau Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email atau username"
                  className="w-full px-4 py-3 rounded-xl bg-white border-2.5 border-slate-900 text-xs text-slate-900 font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                  required
                />
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-900 block">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white border-2.5 border-slate-900 text-xs text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Masuk */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Masuk Sekarang</span>
                )}
              </button>
            </form>
          ) : (
            /* Form Daftar */
            <form onSubmit={handleSubmitRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full px-4 py-3 rounded-xl bg-white border-2.5 border-slate-900 text-xs text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 block">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alamat@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border-2.5 border-slate-900 text-xs text-slate-900 font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 block">
                  Kode Referral <span className="text-slate-600 font-medium">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: REF123 (Opsional)"
                  className="w-full px-4 py-3 rounded-xl bg-white border-2.5 border-slate-900 text-xs font-mono uppercase text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-900 block">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white border-2.5 border-slate-900 text-xs text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_0px_#0f172a] transition-all font-bold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Daftar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Daftar Sekarang</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-[#fffefb] rounded-2xl p-6 max-w-sm w-full space-y-4 border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a]">
            <h3 className="text-sm font-black text-slate-900">Lupa Kata Sandi?</h3>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              Untuk reset kata sandi, silakan hubungi admin atau customer support resmi Carlos69 melalui Saluran WhatsApp dengan menyertakan alamat email Anda.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-[2.5px_2.5px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
