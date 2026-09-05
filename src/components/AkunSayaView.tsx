import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Mail, 
  ShieldCheck, 
  ShoppingBag, 
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AkunSayaView: React.FC = () => {
  const { allGmailAccounts, currentUser, setActiveTab } = useApp();
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const myPurchasedAccounts = allGmailAccounts.filter(
    a => a.userId === currentUser?.id && a.status === 'sold'
  );

  const filtered = myPurchasedAccounts.filter(a =>
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (myPurchasedAccounts.length === 0) return;
    const all = myPurchasedAccounts.map(a => `${a.email}|${a.password}`).join('\n');
    navigator.clipboard.writeText(all);
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-none px-1 sm:px-2 pt-3 pb-24 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">Akun Saya</h1>
              <p className="text-xs text-slate-500">Daftar akun Gmail yang telah Anda beli</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl border border-indigo-200">
            {myPurchasedAccounts.length} Akun
          </span>
        </div>

        {myPurchasedAccounts.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? 'Tutup Password' : 'Lihat Password'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200 transition-all"
            >
              {copiedId === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all' ? 'Tersalin Semua!' : 'Salin Semua Akun'}</span>
            </button>
          </div>
        )}
      </div>

      {/* List Accounts */}
      <div className="space-y-3">
        {myPurchasedAccounts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800">Belum ada akun yang dibeli</p>
              <p className="text-slate-400 mt-0.5">Beli akun Gmail verified siap pakai dengan DANA.</p>
            </div>
            <button
              onClick={() => setActiveTab('beli-akun')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Buka Marketplace Beli Akun
            </button>
          </div>
        ) : (
          filtered.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-indigo-600 select-all truncate max-w-[240px]">
                  {acc.email}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                  Aktif &amp; Verified
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-slate-600">
                  Password: <strong className="text-slate-900">{showPasswords ? acc.password : '••••••••••••'}</strong>
                </span>
                <button
                  onClick={() => handleCopy(`${acc.email}|${acc.password}`, acc.id)}
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === acc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === acc.id ? 'Disalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
