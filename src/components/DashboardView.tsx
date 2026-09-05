import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Clock, 
  Send, 
  Wallet, 
  ScrollText, 
  Briefcase, 
  MessagesSquare, 
  Trophy, 
  Gift, 
  Scale, 
  ChevronRight, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Megaphone,
  ChevronLeft,
  X,
  AlertTriangle,
  ExternalLink,
  Share2,
  Bot,
  Sparkles,
  Bug,
  Crown,
  Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardViewProps {
  onOpenTarikSaldo: () => void;
  onOpenRules: () => void;
  onOpenSupport: () => void;
  onOpenKomunitas: () => void;
  onOpenCarlosSupport: (mode?: 'menu' | 'ai_faq' | 'bug_report' | 'owner_chat' | 'history') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenTarikSaldo,
  onOpenRules,
  onOpenSupport,
  onOpenKomunitas,
  onOpenCarlosSupport,
}) => {
  const { 
    currentUser, 
    settings, 
    setActiveTab, 
    announcements,
    addToast 
  } = useApp();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Dynamic user data
  const user = currentUser || {
    name: 'Tamu',
    saldo: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    qualityScore: 90,
    trustBadge: '90% • Trusted Seller',
    referralCode: 'CARLOS-DEMO',
  };

  const handleNextAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
  };

  const handlePrevAnnouncement = () => {
    setAnnouncementIdx((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleCopyReferral = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      addToast('Kode Tersalin', `Kode referral ${user.referralCode} berhasil disalin!`, 'success');
    }
  };

  const currentAnnounce = announcements[announcementIdx] || announcements[0];

  return (
    <div className="space-y-4 pb-24 w-full max-w-none px-1 sm:px-2 pt-3">
      {/* 0. WARNING BANNER IF TRUSTED <= 20% */}
      {user.qualityScore <= 20 && user.qualityScore > 0 && (
        <div className="p-3.5 bg-rose-200 border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rounded-xl text-slate-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-800 mt-0.5" />
          <div>
            <div className="font-black text-rose-950">Peringatan Kualitas Akun Rendah</div>
            <p className="text-[11px] font-semibold leading-relaxed mt-0.5">
              Akun Anda hampir diblokir (Trusted {user.qualityScore}%). Akun dengan trusted 0% otomatis diblokir oleh sistem. Segera tingkatkan kualitas setoran Gmail Anda.
            </p>
          </div>
        </div>
      )}

      {/* 1. MASTER SALDO CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white p-5 sm:p-6 border-2.5 border-slate-900 shadow-[4px_4px_0px_0px_#6366f1]">
        <div className="relative z-10">
          {/* Saldo Header */}
          <div className="flex items-center justify-between text-slate-300 text-xs font-black tracking-wider uppercase mb-1">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>SALDO ANDA</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-900 border-2 border-slate-900 text-[10px] font-black flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping" />
              Online
            </span>
          </div>

          {/* Big Balance Amount */}
          <div className="text-3xl sm:text-4xl font-black tracking-tight my-2 text-amber-300 font-mono">
            Rp{user.saldo.toLocaleString('id-ID')}
          </div>

          {/* Price Subtitle */}
          <div className="text-xs text-slate-200 font-bold mb-4 flex items-center gap-1.5">
            <span className="text-slate-300">Harga / Gmail:</span>
            <span className="font-black text-slate-900 bg-amber-300 px-2 py-0.5 rounded-lg border-2 border-slate-900 font-mono shadow-[1.5px_1.5px_0px_0px_#0f172a]">
              Rp{settings.ratePerAkun.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Geometric Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenTarikSaldo}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-black transition-all border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-900" />
              <span>Tarik Saldo</span>
            </button>

            <button
              onClick={() => setActiveTab('riwayat')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition-all border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-slate-900" />
              <span>Riwayat</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATUS SETORAN BANNER (BUKA: HIJAU / TUTUP: MERAH) */}
      {settings.isStorOpen ? (
        <div className="p-3.5 bg-emerald-200 border-2.5 border-slate-900 rounded-2xl text-slate-900 flex items-center justify-between shadow-[3.5px_3.5px_0px_0px_#0f172a]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-slate-900 animate-pulse shrink-0" />
            <div>
              <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <span>STATUS SETORAN: DIBUKA</span>
              </div>
              <div className="text-[11px] text-slate-800 font-bold">
                Admin sedang menerima setoran • Rp {settings.ratePerAkun.toLocaleString('id-ID')}/akun
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('stor')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all shrink-0"
          >
            Setor Sekarang
          </button>
        </div>
      ) : (
        <div className="p-3.5 bg-rose-200 border-2.5 border-slate-900 rounded-2xl text-slate-900 flex items-center justify-between shadow-[3.5px_3.5px_0px_0px_#0f172a]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 border border-slate-900 shrink-0" />
            <div>
              <div className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                <span>STATUS SETORAN: DITUTUP</span>
              </div>
              <div className="text-[11px] text-slate-800 font-bold">
                {settings.storStatusMessage || 'Setoran sedang ditutup sementara oleh admin.'}
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-400 text-slate-900 border-2 border-slate-900 text-[10px] font-black shrink-0 shadow-[1px_1px_0px_0px_#0f172a]">
            Tutup
          </span>
        </div>
      )}

      {/* 2. PRIMARY ACTION ROW (4 ITEMS) */}
      <div className="bg-white rounded-2xl p-4 border-2.5 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
        <div className="grid grid-cols-4 gap-2">
          {/* Stor */}
          <button
            onClick={() => setActiveTab('stor')}
            className="flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-all border border-blue-100/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Send className="w-5 h-5 -rotate-12 translate-x-0.5" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">Stor</span>
          </button>

          {/* Riwayat */}
          <button
            onClick={() => setActiveTab('riwayat')}
            className="flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-all border border-emerald-100/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">Riwayat</span>
          </button>

          {/* Saldo */}
          <button
            onClick={() => setActiveTab('saldo')}
            className="flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-all border border-amber-100/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">Saldo</span>
          </button>

          {/* Rules */}
          <button
            onClick={onOpenRules}
            className="flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-all border border-purple-100/60 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <ScrollText className="w-5 h-5" />
              </div>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">Rules</span>
          </button>
        </div>
      </div>

      {/* 3. SECONDARY MENU ROW (CARLOS AI, SUPPORT, KOMUNITAS, SALURAN WA) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
        <div className="grid grid-cols-4 gap-2">
          {/* Carlos AI Support */}
          <button
            onClick={() => onOpenCarlosSupport('menu')}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl hover:bg-blue-50/60 transition-all group cursor-pointer border border-blue-100/60 relative overflow-hidden"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                settings.isSupportAiEnabled !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`} />
            </div>
            <span className="text-xs font-bold text-blue-700 mt-1.5 whitespace-nowrap text-center">
              Carlos AI
            </span>
          </button>

          {/* Zero Support */}
          <button
            onClick={onOpenSupport}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-slate-100"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-1.5 whitespace-nowrap text-center">
              Support
            </span>
          </button>

          {/* Komunitas */}
          <button
            onClick={onOpenKomunitas}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-slate-100"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <MessagesSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-1.5 whitespace-nowrap text-center">
              Komunitas
            </span>
          </button>

          {/* Saluran WhatsApp */}
          <a
            href={settings.linkSaluran}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer border border-slate-100 text-decoration-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-700 mt-1.5 whitespace-nowrap text-center">
              Saluran WA
            </span>
          </a>
        </div>
      </div>

      {/* CARLOS SUPPORT AI INTERACTIVE DASHBOARD CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-4.5 border border-blue-900/60 shadow-lg text-white space-y-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Bot className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">Carsloss Support AI</span>
                {settings.isSupportAiEnabled !== false ? (
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online 24/7
                  </span>
                ) : (
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Offline
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-200">
                Carsloss Support AI, &quot;Pusat Bantuan Cerdas&quot;
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenCarlosSupport('menu')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Buka Chat
          </button>
        </div>

        {/* Quick Action Grid inside the card */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-blue-900/50">
          <button
            onClick={() => onOpenCarlosSupport('ai_faq')}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-left transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Tanya AI</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 group-hover:text-slate-300">
              Aturan &amp; Rate
            </div>
          </button>

          <button
            onClick={() => onOpenCarlosSupport('bug_report')}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-left transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Lapor Bug</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 group-hover:text-slate-300">
              Laporan Kendala
            </div>
          </button>

          <button
            onClick={() => onOpenCarlosSupport('owner_chat')}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-left transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Chat Owner</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 group-hover:text-slate-300">
              Resmi CS
            </div>
          </button>
        </div>
      </div>

      {/* 4. SYARAT & KETENTUAN BANNER */}
      <div 
        onClick={onOpenRules}
        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Scale className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight">Syarat &amp; Ketentuan</div>
            <div className="text-[11px] text-slate-500 font-normal">Baca ketentuan dan peraturan harian platform</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* 5. STATS 2x2 GRID */}
      <div className="grid grid-cols-2 gap-3">
        {/* DITERIMA */}
        <div 
          onClick={() => setActiveTab('riwayat')}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DITERIMA</div>
            <div className="text-base font-extrabold text-slate-900 font-mono">{user.acceptedCount || 0}</div>
          </div>
        </div>

        {/* PENDING */}
        <div 
          onClick={() => setActiveTab('riwayat')}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-amber-300 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PENDING</div>
            <div className="text-base font-extrabold text-slate-900 font-mono">{user.pendingCount || 0}</div>
          </div>
        </div>

        {/* DITOLAK */}
        <div 
          onClick={() => setActiveTab('riwayat')}
          className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex items-center gap-3 cursor-pointer hover:border-rose-300 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <XCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DITOLAK</div>
            <div className="text-base font-extrabold text-slate-900 font-mono">{user.rejectedCount || 0}</div>
          </div>
        </div>

        {/* HARGA / AKUN */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HARGA / AKUN</div>
            <div className="text-base font-extrabold text-slate-900 font-mono">
              Rp{settings.ratePerAkun.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* 6. ANNOUNCEMENT CAROUSEL */}
      {showAnnouncement && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-5 shadow-sm border border-slate-800">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                <Megaphone className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-300 font-mono">
                {currentAnnounce.title}
              </span>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {currentAnnounce.content}
          </p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>{currentAnnounce.date}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevAnnouncement}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-slate-300">
                {announcementIdx + 1}/{announcements.length}
              </span>
              <button
                onClick={handleNextAnnouncement}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
