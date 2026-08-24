import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  Copy, 
  Check, 
  Filter, 
  Eye, 
  EyeOff, 
  X, 
  ChevronRight,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GmailAccountItem } from '../types';

export const RiwayatView: React.FC = () => {
  const { allGmailAccounts, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'bug_robot'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter accounts for current user (admin sees all, user sees theirs)
  const userAccounts = allGmailAccounts.filter(a =>
    currentUser?.role === 'admin' ? true : a.userId === currentUser?.id
  );

  const filteredAccounts = userAccounts.filter(acc => {
    // Status filter
    if (statusFilter !== 'all' && acc.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        acc.email.toLowerCase().includes(q) ||
        (acc.rejectReason && acc.rejectReason.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari Gmail atau alasan..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Pills Row 1: Status (Semua, Pending, Diterima, Ditolak, Bug Robot) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock3 className="w-3.5 h-3.5" /> Pending
        </button>
        <button
          onClick={() => setStatusFilter('accepted')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            statusFilter === 'accepted'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Diterima
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" /> Ditolak
        </button>
        <button
          onClick={() => setStatusFilter('bug_robot')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            statusFilter === 'bug_robot'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-3.5 h-3.5" /> Bug Robot
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredAccounts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-400 text-xs shadow-xs">
            Tidak ada riwayat akun yang cocok dengan filter
          </div>
        ) : (
          filteredAccounts.map((acc) => {
            const isAccepted = acc.status === 'accepted';
            const isRejected = acc.status === 'rejected';
            const isBugRobot = acc.status === 'bug_robot';
            const isPending = acc.status === 'pending';

            return (
              <div
                key={acc.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-blue-300 transition-all space-y-2.5"
              >
                {/* Header: Email + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div 
                    onClick={() => handleCopyEmail(acc.email, acc.id)}
                    className="font-mono text-xs font-bold text-slate-900 truncate max-w-[220px] cursor-pointer hover:text-blue-600 flex items-center gap-1.5"
                    title="Klik untuk salin email"
                  >
                    <span className="truncate">{acc.email}</span>
                    {copiedId === acc.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 flex items-center gap-1 font-mono ${
                    isAccepted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    isRejected ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    isBugRobot ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isAccepted ? 'bg-emerald-500' :
                      isRejected ? 'bg-rose-500' :
                      isBugRobot ? 'bg-purple-500' :
                      'bg-amber-500 animate-ping'
                    }`} />
                    {isAccepted ? 'DITERIMA (+Rp ' + (acc.price || 4500).toLocaleString('id-ID') + ')' :
                     isRejected ? 'DITOLAK' :
                     isBugRobot ? 'BUG ROBOT' :
                     'PENDING'}
                  </span>
                </div>

                {/* Timestamps */}
                <div className="text-[11px] text-slate-500 font-mono space-y-0.5 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Stor:</span>
                    <span>{acc.storDate || 'Hari ini'}</span>
                  </div>
                  {acc.verifikasiDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Verifikasi:</span>
                      <span>{acc.verifikasiDate}</span>
                    </div>
                  )}
                </div>

                {/* Reject Reason Callout Box (Sesuai Permintaan User) */}
                {isRejected && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <div className="font-bold text-rose-900 flex items-center gap-1">
                        <span>❌ Status: DITOLAK</span>
                      </div>
                      <div className="text-rose-800 text-[11px] font-medium mt-0.5">
                        Alasan: <span className="font-bold">{acc.rejectReason || 'Email sudah terdaftar di platform lain'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bug Robot Callout Box */}
                {isBugRobot && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-800 text-xs flex items-start gap-2.5">
                    <Bot className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
                    <div>
                      <div className="font-bold text-purple-900 flex items-center gap-1">
                        <span>🤖 Status: BUG ROBOT</span>
                      </div>
                      <div className="text-purple-800 text-[11px] font-medium mt-0.5">
                        {acc.rejectReason || 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
