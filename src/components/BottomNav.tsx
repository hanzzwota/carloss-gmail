import React from 'react';
import { 
  Home, 
  Send, 
  Clock, 
  Wallet, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, isAdminMode } = useApp();

  if (isAdminMode && activeTab === 'admin') {
    return null; // Don't show regular bottom nav on admin panel
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fffefb] border-t-2.5 border-slate-900 shadow-[0_-3px_0_0_#0f172a]">
      <div className="max-w-xl md:max-w-2xl mx-auto grid grid-cols-5 h-16 px-1">
        {/* 1. Beranda */}
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'beranda' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'beranda' ? 'bg-amber-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : ''
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black tracking-tight mt-0.5">Beranda</span>
        </button>

        {/* 2. Stor */}
        <button
          onClick={() => setActiveTab('stor')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'stor' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'stor' ? 'bg-emerald-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : ''
          }`}>
            <Send className="w-5 h-5 -rotate-12" />
          </div>
          <span className="text-[10px] font-black tracking-tight mt-0.5">Stor</span>
        </button>

        {/* 3. Riwayat */}
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'riwayat' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'riwayat' ? 'bg-indigo-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : ''
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black tracking-tight mt-0.5">Riwayat</span>
        </button>

        {/* 4. Saldo */}
        <button
          onClick={() => setActiveTab('saldo')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'saldo' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'saldo' ? 'bg-rose-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : ''
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black tracking-tight mt-0.5">Saldo</span>
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'profil' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            activeTab === 'profil' ? 'bg-sky-300 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]' : ''
          }`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black tracking-tight mt-0.5">Profil</span>
        </button>
      </div>
    </nav>
  );
};
