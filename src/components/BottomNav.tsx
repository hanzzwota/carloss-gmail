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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16">
        {/* 1. Beranda */}
        <button
          onClick={() => setActiveTab('beranda')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'beranda' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'beranda' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Beranda</span>
        </button>

        {/* 2. Stor */}
        <button
          onClick={() => setActiveTab('stor')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'stor' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className={`w-5 h-5 transition-transform ${activeTab === 'stor' ? 'scale-110 -rotate-12' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Stor</span>
        </button>

        {/* 3. Riwayat */}
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'riwayat' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className={`w-5 h-5 transition-transform ${activeTab === 'riwayat' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Riwayat</span>
        </button>

        {/* 4. Saldo */}
        <button
          onClick={() => setActiveTab('saldo')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'saldo' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wallet className={`w-5 h-5 transition-transform ${activeTab === 'saldo' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Saldo</span>
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'profil' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 transition-transform ${activeTab === 'profil' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold mt-1">Profil</span>
        </button>
      </div>
    </nav>
  );
};
