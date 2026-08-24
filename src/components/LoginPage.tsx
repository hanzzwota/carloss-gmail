import React, { useState } from 'react';
import { Mail, Eye, EyeOff, AlertCircle, Shield, Scale } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LoginPageProps {
  onOpenPublicPage?: (page: 'harga' | 'carabeli' | 'kontak') => void;
  onOpenRules?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onOpenPublicPage, onOpenRules }) => {
  const { login, register } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      if (!res?.success) {
        setError(res?.message || 'Login gagal.');
      }
    }, 300);
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
      if (!res?.success) {
        setError(res?.message || 'Registrasi gagal.');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F1F5F9] flex flex-col items-center justify-center p-4 py-8 antialiased">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6 select-none">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-3 border border-blue-400/30">
          <Mail className="w-7 h-7 fill-white/20 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
          <span>S3L GMAIL</span>
          <span className="text-blue-600">Carlos69</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Platform Setor &amp; Verifikasi Akun Gmail Terpercaya
        </p>
      </div>

      {/* Main Login/Register Card */}
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl shadow-blue-950/8 border border-slate-200/80 p-6 sm:p-8 relative">
        {/* Top Security Notice */}
        <div className="mb-5 p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-medium">
            Silakan masuk atau daftar akun untuk mengakses dashboard dan fitur setoran.
          </span>
        </div>

        {/* Segmented Switcher: Masuk | Daftar */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Masuk */}
        {tab === 'login' ? (
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">Email atau Username</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email atau username"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 block">Kata Sandi</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
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
              <label className="text-xs font-semibold text-slate-800 block">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap Anda"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alamat@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">
                Kode Referral <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Contoh: REF123 (Opsional)"
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all uppercase font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Daftar Akun Sekarang</span>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Public Pages Nav Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 mt-6">
        {onOpenPublicPage && (
          <>
            <button onClick={() => onOpenPublicPage('harga')} className="hover:text-blue-600 cursor-pointer">
              Daftar Harga
            </button>
            <span>•</span>
            <button onClick={() => onOpenPublicPage('carabeli')} className="hover:text-blue-600 cursor-pointer">
              Cara Setor
            </button>
            <span>•</span>
            <button onClick={() => onOpenPublicPage('kontak')} className="hover:text-blue-600 cursor-pointer">
              Kontak
            </button>
          </>
        )}
        {onOpenRules && (
          <>
            <span>•</span>
            <button onClick={onOpenRules} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Rules &amp; Syarat</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
