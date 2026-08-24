import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Mail, 
  CreditCard, 
  Inbox, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Trash2, 
  Save, 
  Eye, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  Smartphone,
  Layers,
  ArrowRight,
  X,
  FileText,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Copy,
  Zap,
  Bot,
  ToggleLeft,
  ToggleRight,
  Bug,
  Crown,
  MessageSquare,
  Headphones,
  ExternalLink,
  Send,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../utils/avatar';
import { WithdrawalRequest, GmailSubmission, GmailAccountItem, User, AdminEmailStock, AutoCheckResult, SupportTicket, SupportMessage } from '../types';
import { sendDiscordWebhook } from '../utils/discord';

export const AdminView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    allGmailAccounts, 
    submissions, 
    withdrawals, 
    settings, 
    adminEmailStocks,
    supportTickets,
    adminReplySupportTicket,
    adminUpdateTicketStatus,
    adminAddEmailStock,
    adminDeleteEmailStock,
    adminClearUnusedStock,
    adminApproveBatch, 
    adminRejectBatch, 
    adminApproveAllPending, 
    adminApproveSingleAccount, 
    adminRejectSingleAccount, 
    adminMarkBugRobot,
    adminUpdateAllSetoran,
    adminAddAllPendingSaldo,
    adminCommitStagedSetoran,
    adminBlockUser, 
    adminUnblockUser, 
    adminProcessWithdrawal, 
    adminUpdateSettings, 
    adminToggleStorOpen,
    adminToggleSupportAi,
    adminDeleteUser,
    adminResetAllDatabase,
    setIsAdminMode,
    setActiveTab,
    addToast
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'users' | 'setoran' | 'pembayaran' | 'stok' | 'support' | 'settings'>('users');

  // Payout Mode & Update All State (Instant vs Delay)
  const [payoutMode, setPayoutMode] = useState<'instant' | 'delay'>('instant');
  const [delaySeconds, setDelaySeconds] = useState<number>(5);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [bulkProgressMessage, setBulkProgressMessage] = useState('');
  const [bulkCountdown, setBulkCountdown] = useState(0);
  const [autoCheckResultModal, setAutoCheckResultModal] = useState<AutoCheckResult | null>(null);

  // Filter & Search untuk Tab Daftar User (Sesuai Foto 1)
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [userSortFilter, setUserSortFilter] = useState<'saldo' | 'kualitas' | 'total' | 'nama'>('saldo');
  const [userQualityFilter, setUserQualityFilter] = useState<'all' | 'elite' | 'good' | 'low'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Filter Setoran Tab
  const [setoranStatusFilter, setSetoranStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'bug_robot'>('all');
  const [setoranSearch, setSetoranSearch] = useState('');

  // Filter Support Tab
  const [supportTypeFilter, setSupportTypeFilter] = useState<'all' | 'bug_report' | 'owner_chat' | 'general'>('all');
  const [supportStatusFilter, setSupportStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<SupportTicket | null>(null);
  const [adminTicketReplyText, setAdminTicketReplyText] = useState('');

  // Stock Management Input
  const [stockInputText, setStockInputText] = useState('');

  // Action Modals State
  const [rejectWdTarget, setRejectWdTarget] = useState<WithdrawalRequest | null>(null);
  const [rejectWdReason, setRejectWdReason] = useState('Nomor DANA tidak terdaftar / Tidak valid');

  const [approveWdTarget, setApproveWdTarget] = useState<WithdrawalRequest | null>(null);

  const [rejectBatchTarget, setRejectBatchTarget] = useState<GmailSubmission | null>(null);
  const [rejectBatchReason, setRejectBatchReason] = useState('Email sudah terdaftar di platform lain / password salah');

  // Modal Alasan Penolakan Akun (Diperlukan agar admin wajib mengisi / memilih alasan)
  const [rejectAccountTarget, setRejectAccountTarget] = useState<GmailAccountItem | null>(null);
  const [rejectAccountReason, setRejectAccountReason] = useState('Email sudah terdaftar di platform lain');
  const [customRejectReason, setCustomRejectReason] = useState('');

  const [blockUserTarget, setBlockUserTarget] = useState<User | null>(null);
  const [blockUserReason, setBlockUserReason] = useState('Kualitas akun (trusted) rendah / melanggar ketentuan');

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  // Settings Edit Form & Discord Webhooks
  const [namaDashboard, setNamaDashboard] = useState(settings.namaDashboard || 'Carlos69');
  const [ratePerAkun, setRatePerAkun] = useState<string | number>(settings.ratePerAkun || 4500);
  const [mandatoryPassword, setMandatoryPassword] = useState(settings.mandatoryPassword || 'sgsg1122');
  const [linkSaluran, setLinkSaluran] = useState(settings.linkSaluran || '');
  const [infoDashboard, setInfoDashboard] = useState(settings.infoDashboard || '');
  const [isStorOpen, setIsStorOpen] = useState(settings.isStorOpen ?? true);
  const [storStatusMessage, setStorStatusMessage] = useState(settings.storStatusMessage || '');
  const [syaratKetentuan, setSyaratKetentuan] = useState(settings.syaratKetentuan || '');
  const [rulesHariIni, setRulesHariIni] = useState(settings.rulesHariIni || '');

  const [discordWebhookStock, setDiscordWebhookStock] = useState(settings.discordWebhookStock || '');
  const [discordWebhookBug, setDiscordWebhookBug] = useState(settings.discordWebhookBug || '');
  const [discordWebhookGeneral, setDiscordWebhookGeneral] = useState(settings.discordWebhookGeneral || '');
  const [discordWebhookOwner, setDiscordWebhookOwner] = useState(settings.discordWebhookOwner || '');
  const [testingWebhookKey, setTestingWebhookKey] = useState<string | null>(null);

  // Synchronize local form when entering settings tab
  React.useEffect(() => {
    if (activeAdminTab === 'settings') {
      setNamaDashboard(settings.namaDashboard || 'Carlos69');
      setRatePerAkun(settings.ratePerAkun || 4500);
      setMandatoryPassword(settings.mandatoryPassword || 'sgsg1122');
      setLinkSaluran(settings.linkSaluran || '');
      setInfoDashboard(settings.infoDashboard || '');
      setIsStorOpen(settings.isStorOpen ?? true);
      setStorStatusMessage(settings.storStatusMessage || '');
      setSyaratKetentuan(settings.syaratKetentuan || '');
      setRulesHariIni(settings.rulesHariIni || '');
      setDiscordWebhookStock(settings.discordWebhookStock || '');
      setDiscordWebhookBug(settings.discordWebhookBug || '');
      setDiscordWebhookGeneral(settings.discordWebhookGeneral || '');
      setDiscordWebhookOwner(settings.discordWebhookOwner || '');
    }
  }, [activeAdminTab, settings]);

  // Stats
  const totalUsers = allUsers.filter(u => u.role !== 'admin').length;
  const totalAccountsSold = allGmailAccounts.filter(a => a.status === 'accepted').length;
  const totalRevenue = withdrawals.filter(w => w.status === 'success').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending').length;
  const pendingAccountsCount = allGmailAccounts.filter(a => a.status === 'pending').length;
  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const unusedStockCount = adminEmailStocks.filter(s => !s.isUsed).length;
  const usedStockCount = adminEmailStocks.filter(s => s.isUsed).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRate = typeof ratePerAkun === 'string' 
      ? parseInt(ratePerAkun.replace(/[^0-9]/g, ''), 10) 
      : Number(ratePerAkun);
    const finalRate = isNaN(parsedRate) || parsedRate <= 0 ? 4500 : parsedRate;

    const payload = {
      namaDashboard: namaDashboard.trim() || 'Carlos69',
      ratePerAkun: finalRate,
      mandatoryPassword: mandatoryPassword.trim() || 'sgsg1122',
      linkSaluran: linkSaluran.trim(),
      infoDashboard: infoDashboard.trim(),
      isStorOpen: settings.isStorOpen,
      storStatusMessage: storStatusMessage.trim(),
      syaratKetentuan: syaratKetentuan.trim(),
      rulesHariIni: rulesHariIni.trim(),
      discordWebhookStock: discordWebhookStock.trim(),
      discordWebhookBug: discordWebhookBug.trim(),
      discordWebhookGeneral: discordWebhookGeneral.trim(),
      discordWebhookOwner: discordWebhookOwner.trim(),
    };

    setRatePerAkun(finalRate);
    adminUpdateSettings(payload);
  };

  const handleTestDiscordWebhook = async (channelKey: 'stock' | 'bug' | 'general' | 'owner', url: string) => {
    if (!url || !url.trim().startsWith('http')) {
      addToast('URL Tidak Valid', 'Masukkan URL Webhook Discord yang valid terlebih dahulu.', 'warning');
      return;
    }

    setTestingWebhookKey(channelKey);
    const titles = {
      stock: '🔔 [TES WEBHOOK] Alert Stok Generate Carlos69',
      bug: '🐛 [TES WEBHOOK] Channel Laporan Bug Carlos69',
      general: '💬 [TES WEBHOOK] Channel Bantuan Umum Carlos69',
      owner: '👑 [TES WEBHOOK] Channel Khusus Owner Carlos69',
    };

    const res = await sendDiscordWebhook({
      webhookUrl: url.trim(),
      title: titles[channelKey],
      description: `Ini adalah pesan tes koneksi otomatis dari **Dashboard Admin Carlos69**.\nWebhook untuk channel **${channelKey.toUpperCase()}** berhasil terhubung dan siap menerima notifikasi!`,
      color: channelKey === 'bug' ? 0xef4444 : channelKey === 'owner' ? 0xf59e0b : 0x3b82f6,
      fields: [
        { name: 'Status', value: '🟢 Terhubung (Online)', inline: true },
        { name: 'Waktu Tes', value: new Date().toLocaleString('id-ID'), inline: true },
      ],
      authorName: 'Carlos69 Webhook Tester',
    });

    setTestingWebhookKey(null);

    if (res.success) {
      addToast('Tes Sukses', `Pesan tes berhasil dikirim ke Discord (${channelKey.toUpperCase()})!`, 'success');
    } else {
      addToast('Tes Gagal', res.message, 'error');
    }
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockInputText.trim()) return;
    const res = adminAddEmailStock(stockInputText);
    if (res.success) {
      setStockInputText('');
    }
  };

  const handleConfirmRejectWd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectWdTarget) return;
    adminProcessWithdrawal(rejectWdTarget.id, 'rejected', rejectWdReason.trim() || 'Ditolak oleh admin');
    setRejectWdTarget(null);
  };

  const handleConfirmApproveWd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approveWdTarget) return;
    adminProcessWithdrawal(approveWdTarget.id, 'success');
    setApproveWdTarget(null);
  };

  const handleConfirmRejectBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectBatchTarget) return;
    adminRejectBatch(rejectBatchTarget.id, rejectBatchReason.trim() || 'Email sudah terdaftar di platform lain');
    setRejectBatchTarget(null);
  };

  const handleConfirmRejectAccountModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectAccountTarget) return;
    const finalReason = customRejectReason.trim() || rejectAccountReason || 'Email sudah terdaftar di platform lain';

    // Update staged decision
    setStagedDecisions((prev) => ({
      ...prev,
      [rejectAccountTarget.id]: {
        status: 'rejected',
        reason: finalReason,
      },
    }));

    addToast(
      'Akun Ditandai Ditolak (Ditahan)',
      `Akun ${rejectAccountTarget.email} ditolak dengan alasan: "${finalReason}". Klik Update All untuk konfirmasi.`,
      'error'
    );

    setRejectAccountTarget(null);
    setCustomRejectReason('');
  };

  const handleConfirmBlockUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockUserTarget) return;
    adminBlockUser(blockUserTarget.id, blockUserReason.trim() || 'Pelanggaran ketentuan');
    setBlockUserTarget(null);
  };

  // Staging decisions for Setoran verification (Ditahan di menu sampai admin klik Update All)
  const [stagedDecisions, setStagedDecisions] = useState<Record<string, { status: 'accepted' | 'rejected' | 'bug_robot'; reason?: string }>>({});

  const stagedKeys = Object.keys(stagedDecisions);
  const stagedCount = stagedKeys.length;
  const stagedAcceptedCount = stagedKeys.filter((k) => stagedDecisions[k].status === 'accepted').length;
  const stagedRejectedCount = stagedKeys.filter((k) => stagedDecisions[k].status === 'rejected').length;
  const stagedBugRobotCount = stagedKeys.filter((k) => stagedDecisions[k].status === 'bug_robot').length;
  const stagedSaldo = stagedAcceptedCount * (settings.ratePerAkun || 4500);

  // Toggle individual account stage (✓ / ❌ / 🤖)
  const handleToggleStageAccount = (acc: GmailAccountItem, status: 'accepted' | 'rejected' | 'bug_robot', defaultReason?: string) => {
    setStagedDecisions((prev) => {
      const next = { ...prev };
      if (next[acc.id] && next[acc.id].status === status) {
        delete next[acc.id];
      } else {
        const reason = defaultReason || (
          status === 'bug_robot'
            ? 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin'
            : status === 'rejected'
            ? 'Email sudah terdaftar di platform lain / password salah'
            : undefined
        );
        next[acc.id] = { status, reason };
      }
      return next;
    });
  };

  // Stage whole batch (Terima Batch / Tolak Batch / Bug Robot Batch)
  const handleStageBatch = (sub: GmailSubmission, status: 'accepted' | 'rejected' | 'bug_robot', defaultReason?: string) => {
    setStagedDecisions((prev) => {
      const next = { ...prev };
      const reason = defaultReason || (
        status === 'bug_robot'
          ? 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin'
          : status === 'rejected'
          ? 'Email sudah terdaftar di platform lain / password salah'
          : undefined
      );

      sub.accounts.forEach((acc) => {
        if (acc.status === 'pending') {
          next[acc.id] = { status, reason };
        }
      });
      return next;
    });

    addToast(
      status === 'accepted'
        ? 'Batch Ditandai DI-ACC'
        : status === 'bug_robot'
        ? 'Batch Ditandai BUG ROBOT'
        : 'Batch Ditandai DITOLAK',
      `Ditahan di menu. Klik "Update All" untuk menerapkan ke saldo akun user.`,
      status === 'accepted' ? 'success' : 'warning'
    );
  };

  const handleClearAllStaging = () => {
    setStagedDecisions({});
    addToast('Draft Direset', 'Semua perubahan yang ditahan dibatalkan.', 'info');
  };

  // ⚡ EKSEKUSI COMMIT PERUBAHAN YANG DITAHAN ATAU AUTO-VERIFIKASI KE USER
  const handleRunCommitOrUpdateAll = async () => {
    if (isProcessingBulk) return;
    setIsProcessingBulk(true);

    if (payoutMode === 'delay') {
      setBulkProgressMessage(`Memproses Update All ke akun user dengan antrean delay (${delaySeconds} detik)...`);
      setBulkCountdown(delaySeconds);
      const interval = setInterval(() => {
        setBulkCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBulkProgressMessage('Menerapkan Update All ke akun user secara INSTAN...');
    }

    try {
      if (stagedCount > 0) {
        const res = await adminCommitStagedSetoran(stagedDecisions, payoutMode, delaySeconds);
        setStagedDecisions({});
        setAutoCheckResultModal(res);
      } else {
        const res = await adminUpdateAllSetoran(payoutMode, delaySeconds);
        setAutoCheckResultModal(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingBulk(false);
      setBulkProgressMessage('');
      setBulkCountdown(0);
    }
  };

  const handleRunUpdateAll = async () => {
    return handleRunCommitOrUpdateAll();
  };

  // 💰 EKSEKUSI PENAMBAHAN ALL SALDO KE AKUN USER (INSTANT / DELAY)
  const handleAddAllSaldo = async () => {
    if (isProcessingBulk) return;
    setIsProcessingBulk(true);

    if (payoutMode === 'delay') {
      setBulkProgressMessage(`Mencairkan All Saldo ke akun user dengan delay (${delaySeconds} detik)...`);
      setBulkCountdown(delaySeconds);
      const interval = setInterval(() => {
        setBulkCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBulkProgressMessage('Mencairkan All Saldo ke akun user secara INSTAN...');
    }

    try {
      if (stagedCount > 0) {
        const res = await adminCommitStagedSetoran(stagedDecisions, payoutMode, delaySeconds);
        setStagedDecisions({});
        setAutoCheckResultModal(res);
      } else {
        const res = await adminUpdateAllSetoran(payoutMode, delaySeconds);
        setAutoCheckResultModal(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingBulk(false);
      setBulkProgressMessage('');
      setBulkCountdown(0);
    }
  };

  // Filter users list
  const filteredUsers = allUsers
    .filter((u) => u.role !== 'admin')
    .filter((u) => {
      if (userStatusFilter === 'active') return u.status === 'active';
      if (userStatusFilter === 'blocked') return u.status === 'blocked';
      return true;
    })
    .filter((u) => {
      if (userQualityFilter === 'elite') return (u.qualityScore || 0) >= 95;
      if (userQualityFilter === 'good') return (u.qualityScore || 0) >= 80 && (u.qualityScore || 0) < 95;
      if (userQualityFilter === 'low') return (u.qualityScore || 0) < 80;
      return true;
    })
    .filter((u) => {
      if (!userSearchQuery) return true;
      const q = userSearchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
      );
    })
    .sort((a, b) => {
      if (userSortFilter === 'saldo') return b.saldo - a.saldo;
      if (userSortFilter === 'kualitas') return (b.qualityScore || 0) - (a.qualityScore || 0);
      if (userSortFilter === 'total') return (b.totalSubmissions || 0) - (a.totalSubmissions || 0);
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 pb-28 font-sans antialiased">
      {/* ================= TOP NAV BAR (DARK SLATE BLUE) ================= */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 text-base">
              C69
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base tracking-tight">
                  Admin Panel Carlos69
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v6.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Pusat Kontrol Setoran &amp; Verifikasi Real-Time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Toggle Buka/Tutup Setoran Button */}
            <button
              onClick={() => adminToggleStorOpen()}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                settings.isStorOpen
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
              }`}
              title="Klik untuk ubah status buka/tutup setoran bagi seluruh user"
            >
              <span className={`w-2 h-2 rounded-full ${settings.isStorOpen ? 'bg-white animate-ping' : 'bg-white'}`} />
              <span>{settings.isStorOpen ? '🟢 SETORAN BUKA' : '🔴 SETORAN TUTUP'}</span>
            </button>

            {/* Switch to User View */}
            <button
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab('beranda');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Mode User</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveAdminTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'users'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Pengguna ({totalUsers})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('setoran')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer relative ${
                activeAdminTab === 'setoran'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Setoran Masuk</span>
              {pendingSubmissionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('pembayaran')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer relative ${
                activeAdminTab === 'pembayaran'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Penarikan DANA</span>
              {pendingWithdrawalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-900 text-[10px] font-black">
                  {pendingWithdrawalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('stok')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'stok'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Stok Pool Generate ({unusedStockCount})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('support')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer relative ${
                activeAdminTab === 'support'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Carlos Support &amp; Tiket</span>
              {openTicketsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                  {openTicketsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeAdminTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Pengaturan &amp; Rate</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN BODY ================= */}
      <main className="max-w-7xl mx-auto px-4 pt-5 space-y-5">
        
        {/* ================= TAB: DAFTAR PENGGUNA (SESUAI FOTO 1) ================= */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            {/* Top Toolbar: Search + Filter Pills + Sorting */}
            <div className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-3.5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Cari user (Nama, Email, UID, Nomor HP)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Status Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setUserStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    Semua ({allUsers.filter(u => u.role !== 'admin').length})
                  </button>
                  <button
                    onClick={() => setUserStatusFilter('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'active'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    onClick={() => setUserStatusFilter('blocked')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      userStatusFilter === 'blocked'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    Diblokir
                  </button>
                </div>
              </div>

              {/* Secondary Filter Row: Sort Options */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Urutkan:</span>
                  <button
                    onClick={() => setUserSortFilter('saldo')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      userSortFilter === 'saldo' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Saldo Tertinggi
                  </button>
                  <button
                    onClick={() => setUserSortFilter('kualitas')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      userSortFilter === 'kualitas' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Trusted Tertinggi
                  </button>
                  <button
                    onClick={() => setUserSortFilter('total')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      userSortFilter === 'total' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Total Setoran
                  </button>
                </div>

                <div className="text-slate-400 text-[11px] font-mono">
                  Menampilkan <strong className="text-white">{filteredUsers.length}</strong> pengguna
                </div>
              </div>
            </div>

            {/* List User Cards (Sesuai Layout Foto 1) */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center bg-[#1E293B] rounded-3xl border border-slate-800 text-slate-400 text-xs">
                  Tidak ada data pengguna yang cocok dengan pencarian / filter.
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isBlocked = user.status === 'blocked';
                  return (
                    <div
                      key={user.id}
                      className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-all"
                    >
                      {/* Top Header Card: Avatar + Name + Email + Role Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-white text-base leading-tight">{user.name}</h3>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/80">
                                USER
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          isBlocked
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          {isBlocked ? 'DIBLOKIR' : 'AKTIF'}
                        </span>
                      </div>

                      {/* Middle Data Rows: Saldo & Info Tambahan */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 font-sans">Saldo Akun:</div>
                          <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                            Rp {user.saldo.toLocaleString('id-ID')}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 font-sans">Kualitas Akun:</div>
                          <div className="text-xs font-bold text-blue-300 mt-0.5">
                            {user.qualityScore || 100}% • Trusted
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 font-sans">Total Disetor:</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {user.totalSubmissions || 0} Akun
                          </div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                          <div className="text-[10px] text-slate-400 font-sans">Nomor DANA:</div>
                          <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                            {user.danaNumber || '-'}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Blokir / Unblock / Detail */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        {isBlocked ? (
                          <button
                            type="button"
                            onClick={() => adminUnblockUser(user.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Buka Blokir User</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBlockUserTarget(user)}
                            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Blokir User</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: SETORAN MASUK (SESUAI FOTO 4 & 6) ================= */}
        {activeAdminTab === 'setoran' && (
          <div className="space-y-5">
            {/* 1. KONTROL PANEL AUTO-VERIFIKASI & SALDO (INSTANT / DELAY) */}
            <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 rounded-3xl p-5 sm:p-6 border border-blue-800/50 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-black text-white tracking-tight">
                      Panel Kontrol Auto-Verifikasi &amp; Penambahan Saldo
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Fitur otomatis untuk memeriksa kecocokan akun dengan stok generate admin, menambah saldo user sesuai rate (<strong className="text-emerald-400 font-mono">Rp {settings.ratePerAkun.toLocaleString('id-ID')}/akun</strong>), serta menolak otomatis akun yang tidak sesuai.
                  </p>
                </div>

                {/* Mode Selector: Instant vs Delay */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/70">
                  <span className="text-[11px] font-bold text-slate-400 px-2">Mode Saldo:</span>
                  <button
                    onClick={() => setPayoutMode('instant')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      payoutMode === 'instant'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ Instan</span>
                  </button>

                  <button
                    onClick={() => setPayoutMode('delay')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      payoutMode === 'delay'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>⏳ Delay</span>
                  </button>

                  {payoutMode === 'delay' && (
                    <select
                      value={delaySeconds}
                      onChange={(e) => setDelaySeconds(Number(e.target.value))}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-300 focus:outline-none cursor-pointer"
                    >
                      <option value={3}>3 Detik</option>
                      <option value={5}>5 Detik</option>
                      <option value={10}>10 Detik</option>
                      <option value={30}>30 Detik</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Progress Countdown Bar when processing */}
              {isProcessingBulk && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/50 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      <span>{bulkProgressMessage}</span>
                    </span>
                    {bulkCountdown > 0 && (
                      <span className="font-mono text-amber-400">{bulkCountdown}s tersisa</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                  </div>
                </div>
              )}

              {/* TWO PRIMARY ACTION BUTTONS: UPDATE ALL & TAMBAH ALL SALDO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* BUTTON 1: UPDATE ALL STATUS GMAIL */}
                <button
                  onClick={handleRunUpdateAll}
                  disabled={isProcessingBulk}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-between gap-2 cursor-pointer transition-all border border-blue-400/30"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wide uppercase">⚡ Update All Status Gmail</div>
                      <div className="text-[10px] text-blue-100 font-normal">
                        Auto-cek stok generate, tolak yg beda, ACC &amp; beri saldo
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-200 shrink-0" />
                </button>

                {/* BUTTON 2: TAMBAH ALL SALDO KE AKUN USER */}
                <button
                  onClick={handleAddAllSaldo}
                  disabled={isProcessingBulk}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-between gap-2 cursor-pointer transition-all border border-emerald-400/30"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-wide uppercase">
                        💰 Tambah All Saldo ke User ({payoutMode === 'instant' ? 'Instan' : `Delay ${delaySeconds}s`})
                      </div>
                      <div className="text-[10px] text-emerald-100 font-normal">
                        Tambah saldo ke user sesuai rate &amp; jumlah akun di-ACC
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-200 shrink-0" />
                </button>
              </div>
            </div>

            {/* Header List Setoran + Status Setoran Buka/Tutup Control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <h3 className="text-sm font-bold text-white">Daftar Antrean Setoran</h3>
                <p className="text-xs text-slate-400">Total {submissions.length} batch setoran terdaftar di sistem</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setSetoranStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      setoranStatusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSetoranStatusFilter('pending')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      setoranStatusFilter === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setSetoranStatusFilter('accepted')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      setoranStatusFilter === 'accepted' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Disetujui
                  </button>
                  <button
                    onClick={() => setSetoranStatusFilter('rejected')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      setoranStatusFilter === 'rejected' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ditolak
                  </button>
                  <button
                    onClick={() => setSetoranStatusFilter('bug_robot')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      setoranStatusFilter === 'bug_robot' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bug Robot
                  </button>
                </div>

                {stagedCount > 0 ? (
                  <button
                    onClick={handleRunCommitOrUpdateAll}
                    disabled={isProcessingBulk}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-98 text-white text-xs font-black rounded-full shadow-lg shadow-emerald-900/50 cursor-pointer flex items-center gap-1.5 uppercase transition-all animate-pulse"
                  >
                    <Zap className="w-4 h-4" />
                    <span>UPDATE ALL ({stagedCount})</span>
                  </button>
                ) : pendingAccountsCount > 0 ? (
                  <button
                    onClick={handleRunCommitOrUpdateAll}
                    disabled={isProcessingBulk}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-black rounded-full shadow-md shadow-emerald-950/40 cursor-pointer flex items-center gap-1.5 uppercase transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ACC SEMUA PENDING ({pendingAccountsCount})</span>
                  </button>
                ) : null}
              </div>
            </div>

            {/* STAGED FLOATING BANNER (Notice changes are held until Update All) */}
            {stagedCount > 0 && (
              <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-blue-950/90 border border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex flex-wrap items-center gap-2">
                      <span>{stagedAcceptedCount} Ditandai ACC</span>
                      <span>• {stagedRejectedCount} Ditandai Tolak</span>
                      {stagedBugRobotCount > 0 && <span>• {stagedBugRobotCount} Ditandai Bug Robot</span>}
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        SALDO DITAHAN (Belum Masuk User)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Potensi Saldo Cair: <strong className="text-emerald-400 font-mono">Rp {stagedSaldo.toLocaleString('id-ID')}</strong>. Tekan tombol <strong className="text-white">Update All Sekarang</strong> untuk menerapkan resmi ke akun user.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleClearAllStaging}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal Draft
                  </button>
                  <button
                    onClick={handleRunCommitOrUpdateAll}
                    disabled={isProcessingBulk}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Update All Sekarang (+Rp {stagedSaldo.toLocaleString('id-ID')})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Setoran Items List */}
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="p-8 text-center bg-[#1E293B] rounded-3xl border border-slate-800 text-slate-400 text-xs">
                  Tidak ada setoran masuk (0 setoran pending)
                </div>
              ) : (
                submissions.map((sub) => {
                  const isPending = sub.status === 'pending';
                  const isApproved = sub.status === 'approved';
                  const isPartially = sub.status === 'partially_approved';
                  const isRejected = sub.status === 'rejected';

                  // Account filter in submission
                  const visibleAccounts = sub.accounts.filter((acc) => {
                    if (setoranStatusFilter === 'all') return true;
                    if (setoranStatusFilter === 'pending') return acc.status === 'pending';
                    if (setoranStatusFilter === 'accepted') return acc.status === 'accepted';
                    if (setoranStatusFilter === 'rejected') return acc.status === 'rejected';
                    if (setoranStatusFilter === 'bug_robot') return acc.status === 'bug_robot';
                    return true;
                  });

                  if (visibleAccounts.length === 0 && setoranStatusFilter !== 'all') {
                    return null;
                  }

                  return (
                    <div
                      key={sub.id}
                      className="bg-[#131C31] rounded-3xl p-5 border border-slate-800/90 space-y-3.5 shadow-lg"
                    >
                      {/* Top Row: Batch ID, Status, Seller info & Amount */}
                      <div className="flex items-start justify-between gap-3 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-base tracking-tight">{sub.batchId}</span>
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                              isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              isPartially ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              isPending ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {isPartially ? 'SEBAGIAN DISETUJUI' : sub.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Seller: <strong className="text-slate-200">{sub.userName}</strong> ({sub.userEmail}) • {sub.createdAt}
                          </div>
                          {sub.rejectReason && (
                            <div className="text-xs text-rose-400 font-semibold mt-1.5 bg-rose-950/40 p-2 rounded-xl border border-rose-900/60">
                              Alasan Penolakan: {sub.rejectReason}
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base font-black text-emerald-400 font-mono tracking-tight">
                            Rp {sub.totalAmount.toLocaleString('id-ID')}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{sub.totalCount} Akun Gmail</div>
                        </div>
                      </div>

                      {/* Account list with check (✓), cross (X), and robot (🤖) buttons - Minimalist & Scrollable */}
                      <div className="bg-[#0B132B]/80 rounded-2xl p-2.5 border border-slate-800/80">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1 pb-2 border-b border-slate-800/60 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                            <span>Daftar Akun Setoran ({visibleAccounts.length} Akun)</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Gunakan scroll jika daftar akun panjang
                          </span>
                        </div>

                        <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-1.5 pr-1">
                          {visibleAccounts.map((acc, idx) => {
                            const staged = stagedDecisions[acc.id];
                            const isStagedAccepted = staged?.status === 'accepted';
                            const isStagedRejected = staged?.status === 'rejected';
                            const isStagedBugRobot = staged?.status === 'bug_robot';

                            return (
                              <div
                                key={idx}
                                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                                  isStagedAccepted
                                    ? 'bg-emerald-950/40 border-emerald-600/60'
                                    : isStagedRejected
                                    ? 'bg-rose-950/40 border-rose-600/60'
                                    : isStagedBugRobot
                                    ? 'bg-purple-950/40 border-purple-600/60'
                                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                {/* Left: Index + Email + Password & Status Badge */}
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs">
                                    <span className="text-slate-500 text-[10px] font-bold">#{idx + 1}</span>
                                    <span className="select-all text-slate-100 font-bold truncate">{acc.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(acc.email);
                                        addToast('Disalin', `${acc.email} disalin ke clipboard`, 'info');
                                      }}
                                      className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
                                      title="Salin Email"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <span className="text-slate-400 text-[11px] shrink-0 bg-slate-800/80 px-1.5 py-0.2 rounded">
                                      Pass: {acc.password}
                                    </span>
                                  </div>

                                  <div>
                                    {isStagedAccepted ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse font-mono">
                                        ✅ SIAP DI-ACC (Ditahan)
                                      </span>
                                    ) : isStagedRejected ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse font-mono truncate max-w-[250px]" title={staged?.reason}>
                                        ❌ SIAP DITOLAK: {staged?.reason || 'Ditolak'}
                                      </span>
                                    ) : isStagedBugRobot ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse font-mono">
                                        🤖 SIAP BUG ROBOT (Ditahan)
                                      </span>
                                    ) : acc.status === 'accepted' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                                        ✅ DISETUJUI (+Rp {acc.price.toLocaleString('id-ID')})
                                      </span>
                                    ) : acc.status === 'bug_robot' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 font-mono">
                                        🤖 BUG ROBOT
                                      </span>
                                    ) : acc.status === 'rejected' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono truncate max-w-[250px]" title={acc.rejectReason}>
                                        ❌ {acc.rejectReason ? `Alasan: ${acc.rejectReason}` : 'DITOLAK'}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded text-[9px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">
                                        ⏳ PENDING
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Quick Action Icon Buttons (✓, ❌, 🤖) */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* 1. Green Checkmark Action Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStageAccount(acc, 'accepted')}
                                    title={isStagedAccepted ? 'Batalkan ACC (Ditahan)' : 'ACC Akun Ini (Ditahan)'}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                                      isStagedAccepted
                                        ? 'bg-emerald-500 text-white ring-2 ring-emerald-400 shadow-md shadow-emerald-500/40 scale-105'
                                        : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-xs'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>

                                  {/* 2. Red X Action Button (Opens Rejection Modal with presets) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (isStagedRejected) {
                                        handleToggleStageAccount(acc, 'rejected');
                                      } else {
                                        setRejectAccountTarget(acc);
                                      }
                                    }}
                                    title={isStagedRejected ? 'Batalkan Tolak' : 'Pilih Alasan & Tolak Akun Ini'}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                                      isStagedRejected
                                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md shadow-rose-600/40 scale-105'
                                        : 'bg-slate-800 hover:bg-rose-950/60 text-rose-500 hover:text-rose-400 border border-slate-700/60 hover:border-rose-700/60'
                                    }`}
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>

                                  {/* 3. Purple Robot Action Button (Bug Robot) */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStageAccount(acc, 'bug_robot', 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin')}
                                    title={isStagedBugRobot ? 'Batalkan Bug Robot' : 'Tandai Status Bug Robot'}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                                      isStagedBugRobot
                                        ? 'bg-purple-600 text-white ring-2 ring-purple-400 shadow-md shadow-purple-600/40 scale-105'
                                        : 'bg-slate-800 hover:bg-purple-950/60 text-purple-400 hover:text-purple-300 border border-slate-700/60 hover:border-purple-700/60'
                                    }`}
                                  >
                                    <Bot className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Admin Batch Actions */}
                      {sub.status === 'pending' && (
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleStageBatch(sub, 'accepted')}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                            <span>Terima Batch (+Rp {sub.totalAmount.toLocaleString('id-ID')})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectBatchTarget(sub);
                            }}
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-98 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/40 transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Tolak Batch</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStageBatch(sub, 'bug_robot')}
                            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 active:scale-98 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/40 transition-all"
                          >
                            <Bot className="w-4 h-4" />
                            <span>Bug Robot</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: PEMBAYARAN (DANA) ================= */}
        {activeAdminTab === 'pembayaran' && (
          <div className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Daftar Pembayaran &amp; Penarikan Saldo (DANA)</span>
                </h2>
                <p className="text-xs text-slate-400">Kelola konfirmasi transfer penarikan saldo seller ke nomor DANA</p>
              </div>

              {pendingWithdrawalsCount > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pendingWithdrawalsCount} Menunggu Konfirmasi</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-900/50">
                  <tr>
                    <th className="p-3">No</th>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Nomor DANA User</th>
                    <th className="p-3">Nominal (Rp)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Keterangan / Alasan Penolakan</th>
                    <th className="p-3 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-slate-400">
                        Belum ada permintaan pembayaran penarikan (0 penarikan)
                      </td>
                    </tr>
                  ) : (
                    withdrawals.map((wd, index) => (
                      <tr key={wd.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-mono text-slate-400">{index + 1}</td>
                        <td className="p-3 font-mono text-slate-400 text-[11px]">{wd.createdAt}</td>
                        <td className="p-3">
                          <div className="font-bold text-white">{wd.userName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{wd.userEmail}</div>
                        </td>
                        <td className="p-3 font-mono">
                          <div className="font-bold text-blue-400">{wd.accountNumber}</div>
                          <div className="text-[10px] text-slate-400 font-sans">a/n {wd.accountName}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          Rp {wd.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            wd.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                            wd.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            {wd.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 max-w-[220px]">
                          {wd.status === 'rejected' && wd.rejectReason ? (
                            <div className="text-rose-400 bg-rose-950/40 p-2 rounded-xl border border-rose-900/60 text-[11px]">
                              <strong className="block font-bold">Alasan Ditolak:</strong>
                              <span>{wd.rejectReason}</span>
                            </div>
                          ) : wd.status === 'success' ? (
                            <div className="text-emerald-400 font-mono text-[10px] bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-900/40 break-all">
                              {wd.providerInfo || `Ref: ${wd.txId}`}
                            </div>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">Menunggu ACC</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {wd.status === 'pending' && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setApproveWdTarget(wd)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>ACC Transfer</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectWdTarget(wd)}
                                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB: STOK POOL GENERATE ================= */}
        {activeAdminTab === 'stok' && (
          <div className="space-y-5">
            {/* Input Tambah Stok Email */}
            <div className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-blue-400" />
                    <span>Tambah Stok Email ke Pool Generate</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Masukkan daftar alamat email (1 baris 1 email). Email ini akan dipakai saat user klik "Generate Email" di menu Stor.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-blue-950 text-blue-300 px-3 py-1 rounded-xl border border-blue-800/80">
                    {unusedStockCount} Tersedia / {adminEmailStocks.length} Total
                  </span>
                </div>
              </div>

              <form onSubmit={handleAddStock} className="space-y-3">
                <textarea
                  value={stockInputText}
                  onChange={(e) => setStockInputText(e.target.value)}
                  placeholder={`dhmgkamalperdana3899@gmail.com\nikmoandrewraksa3596@gmail.com\nrmigjessicaallen6975@gmail.com`}
                  rows={6}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {stockInputText.split('\n').filter(l => l.trim().includes('@')).length} email terdeteksi
                  </span>
                  <button
                    type="submit"
                    disabled={!stockInputText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan ke Stok Pool</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Table Daftar Stok Email */}
            <div className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white">Daftar Stok Email dalam Sistem</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-900/50">
                    <tr>
                      <th className="p-3">Email</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Diambil Oleh</th>
                      <th className="p-3">Waktu Ambil / Dibuat</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {adminEmailStocks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">
                          Belum ada stok email. Silakan isi form di atas!
                        </td>
                      </tr>
                    ) : (
                      adminEmailStocks.slice(0, 30).map((stk) => (
                        <tr key={stk.id} className="hover:bg-slate-800/40">
                          <td className="p-3 text-indigo-300 select-all font-bold">{stk.email}</td>
                          <td className="p-3 font-sans">
                            {stk.isUsed ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                                SUDAH DIGENERATE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                                TERSEDIA
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-sans text-slate-300">
                            {stk.usedByUserName ? (
                              <div>
                                <span className="font-bold text-white">{stk.usedByUserName}</span>
                                <span className="text-[10px] text-slate-500 block font-mono">{stk.usedByUserId}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            {stk.usedAt || stk.createdAt}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => adminDeleteEmailStock(stk.id)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: CARLOS SUPPORT & TIKET ================= */}
        {activeAdminTab === 'support' && (
          <div className="space-y-4">
            {/* Top Bar: Summary + Filters */}
            <div className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 space-y-3.5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-blue-400" />
                    <span>Pusat Layanan Carlos Support &amp; Tiket</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kelola laporan bug, pesan owner, dan pertanyaan pengguna dari bot/web
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adminToggleSupportAi()}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                      settings.isSupportAiEnabled !== false
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                    }`}
                  >
                    <span>{settings.isSupportAiEnabled !== false ? '🤖 Support AI: AKTIF 🟢' : '🤖 Support AI: NONAKTIF 🔴'}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-normal">
                      {settings.isSupportAiEnabled !== false ? 'Klik utk Matikan' : 'Klik utk Aktifkan'}
                    </span>
                  </button>
                  <span className="px-3 py-1 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono">
                    Total: {supportTickets.length} Tiket
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 text-xs font-bold font-mono">
                    Pending: {openTicketsCount}
                  </span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Tipe:</span>
                {[
                  { id: 'all', label: 'Semua Tipe' },
                  { id: 'bug_report', label: '🐛 Bug Report' },
                  { id: 'owner_chat', label: '👑 Chat Owner' },
                  { id: 'general', label: '💬 Umum' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSupportTypeFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      supportTypeFilter === f.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                <span className="text-[11px] font-bold text-slate-400 ml-3 mr-1">Status:</span>
                {[
                  { id: 'all', label: 'Semua Status' },
                  { id: 'open', label: '🟡 Open' },
                  { id: 'in_progress', label: '🔵 In Progress' },
                  { id: 'resolved', label: '🟢 Selesai' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSupportStatusFilter(s.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      supportStatusFilter === s.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket List Cards */}
            <div className="space-y-3">
              {supportTickets.length === 0 ? (
                <div className="p-10 text-center bg-[#1E293B] rounded-3xl border border-slate-800 text-slate-400 space-y-2">
                  <Headphones className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Belum ada tiket support yang masuk ke sistem.</p>
                </div>
              ) : (
                supportTickets
                  .filter((t) => {
                    if (supportTypeFilter !== 'all' && t.type !== supportTypeFilter) return false;
                    if (supportStatusFilter !== 'all' && t.status !== supportStatusFilter) return false;
                    return true;
                  })
                  .map((t) => {
                    const isBug = t.type === 'bug_report';
                    const isOwner = t.type === 'owner_chat';
                    const isResolved = t.status === 'resolved';
                    const isInProgress = t.status === 'in_progress';
                    const isOpen = t.status === 'open';

                    return (
                      <div
                        key={t.id}
                        className={`bg-[#131C31] rounded-3xl p-5 border space-y-3 shadow-lg transition-all ${
                          isOpen 
                            ? 'border-amber-500/40 bg-gradient-to-r from-[#131C31] to-amber-950/20' 
                            : 'border-slate-800/90'
                        }`}
                      >
                        {/* Header: Ticket ID, Category, User Info & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-sm">
                              {t.ticketNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              isBug ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              isOwner ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {isBug ? '🐛 BUG' : isOwner ? '👑 OWNER' : '💬 UMUM'}: {t.category}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              dari <strong className="text-white">{t.userName}</strong> ({t.userEmail})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={t.status}
                              onChange={(e) => {
                                adminUpdateTicketStatus(t.id, e.target.value as any);
                                addToast('Status Diperbarui', `Tiket ${t.ticketNumber} diubah menjadi ${e.target.value}`, 'success');
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border focus:outline-none cursor-pointer ${
                                isResolved ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60' :
                                isInProgress ? 'bg-blue-950/80 text-blue-300 border-blue-600/60' :
                                'bg-amber-950/80 text-amber-300 border-amber-600/60'
                              }`}
                            >
                              <option value="open">🟡 Open</option>
                              <option value="in_progress">🔵 In Progress</option>
                              <option value="resolved">🟢 Resolved</option>
                              <option value="closed">⚪ Closed</option>
                            </select>
                          </div>
                        </div>

                        {/* Title & Preview Message */}
                        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800/80 space-y-1.5">
                          <div className="font-bold text-xs text-slate-200">{t.title}</div>
                          <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {t.messages[0]?.content}
                          </p>

                          {/* Screenshot preview if attached */}
                          {t.messages[0]?.imageUrl && (
                            <div className="pt-2">
                              <span className="text-[10px] text-slate-400 block mb-1 font-bold">Screenshot Terlampir:</span>
                              <img
                                src={t.messages[0].imageUrl}
                                alt="Screenshot Lampiran"
                                className="max-h-40 rounded-xl border border-slate-700 bg-black/40 object-contain"
                              />
                            </div>
                          )}
                        </div>

                        {/* Footer: Meta & Action */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-[11px] text-slate-500">
                            {t.messages.length} Pesan dalam thread • Dibuat: {t.createdAt}
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedAdminTicket(t)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Buka Percakapan &amp; Balas</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB: PENGATURAN & RATE ================= */}
        {activeAdminTab === 'settings' && (
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 space-y-6 shadow-xl max-w-3xl mx-auto">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-400" />
                <span>Pengaturan Sistem &amp; Rate Pembayaran</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi harga beli per akun, status penerimaan setoran, password wajib, saluran WA, dan Discord Webhooks
              </p>
            </div>

            {/* Buka/Tutup Setoran Card Switch */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              settings.isStorOpen
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}>
              <div>
                <div className="text-sm font-black flex items-center gap-2">
                  <span>{settings.isStorOpen ? '🟢 STATUS: SETORAN DIBUKA' : '🔴 STATUS: SETORAN DITUTUP'}</span>
                </div>
                <div className="text-xs mt-1 text-slate-300">
                  {settings.isStorOpen
                    ? 'User dapat membuka menu Stor dan mengirimkan akun Gmail.'
                    : 'Menu Stor ditutup bagi user. User tidak dapat mengirimkan setoran.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => adminToggleStorOpen()}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg cursor-pointer transition-all ${
                  settings.isStorOpen ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {settings.isStorOpen ? 'TUTUP SETORAN' : 'BUKA SETORAN'}
              </button>
            </div>

            {/* Aktif/Nonaktif Carlos Support AI Card Switch */}
            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              settings.isSupportAiEnabled !== false
                ? 'bg-blue-950/40 border-blue-500/60 text-blue-200'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}>
              <div>
                <div className="text-sm font-black flex items-center gap-2 text-white">
                  <span>{settings.isSupportAiEnabled !== false ? '🤖 STATUS: CARLOS SUPPORT AI AKTIF 🟢' : '🤖 STATUS: CARLOS SUPPORT AI NONAKTIF 🔴'}</span>
                </div>
                <div className="text-xs mt-1 text-slate-300">
                  {settings.isSupportAiEnabled !== false
                    ? 'User dapat menggunakan asisten AI, membuat tiket kendala, dan melapor ke Discord.'
                    : 'Fitur Carlos Support AI dinonaktifkan sementara untuk semua pengguna.'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => adminToggleSupportAi()}
                className={`px-4 py-2 rounded-xl text-xs font-black text-white shadow-lg cursor-pointer transition-all ${
                  settings.isSupportAiEnabled !== false ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {settings.isSupportAiEnabled !== false ? 'NONAKTIFKAN AI' : 'AKTIFKAN AI'}
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Nama Dashboard / Platform</label>
                  <input
                    type="text"
                    value={namaDashboard}
                    onChange={(e) => setNamaDashboard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Rate Harga Beli / Akun (Rp)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={ratePerAkun}
                    onChange={(e) => setRatePerAkun(e.target.value)}
                    placeholder="Contoh: 4500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Password Wajib Setoran</label>
                  <input
                    type="text"
                    value={mandatoryPassword}
                    onChange={(e) => setMandatoryPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Link Saluran WhatsApp</label>
                  <input
                    type="text"
                    value={linkSaluran}
                    onChange={(e) => setLinkSaluran(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pesan Pengumuman Dashboard</label>
                <textarea
                  value={infoDashboard}
                  onChange={(e) => setInfoDashboard(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pesan Banner Saat Storan Ditutup</label>
                <textarea
                  value={storStatusMessage}
                  onChange={(e) => setStorStatusMessage(e.target.value)}
                  rows={2}
                  placeholder="Storan DITUTUP sementara oleh Admin. Mohon tunggu admin membuka kembali!"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              {/* DISCORD WEBHOOKS CONFIGURATION (DIFFERENT CHANNELS FOR BUG, OWNER, STOCK) */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-900/40 space-y-4">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>Integrasi Discord Webhook Bot (Multi-Channel Alerts)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Masukkan Webhook URL Discord untuk tiap channel agar notifikasi bug, pesan owner, dan alert stok habis diteruskan ke channel yang sesuai.
                </p>

                {/* 1. Webhook Stok Habis */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-300">1. Webhook Alert Stok Generate Habis</label>
                    <button
                      type="button"
                      onClick={() => handleTestDiscordWebhook('stock', discordWebhookStock)}
                      disabled={testingWebhookKey === 'stock' || !discordWebhookStock}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      {testingWebhookKey === 'stock' ? <RefreshCw className="w-3 h-3 animate-spin" /> : '⚡ Tes Webhook'}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={discordWebhookStock}
                    onChange={(e) => setDiscordWebhookStock(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-slate-700 text-xs text-white font-mono placeholder-slate-600 focus:border-indigo-500"
                  />
                </div>

                {/* 2. Webhook Channel Bug */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-rose-300">2. Webhook Channel Laporan Bug (Bug Channel)</label>
                    <button
                      type="button"
                      onClick={() => handleTestDiscordWebhook('bug', discordWebhookBug)}
                      disabled={testingWebhookKey === 'bug' || !discordWebhookBug}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      {testingWebhookKey === 'bug' ? <RefreshCw className="w-3 h-3 animate-spin" /> : '⚡ Tes Webhook'}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={discordWebhookBug}
                    onChange={(e) => setDiscordWebhookBug(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-slate-700 text-xs text-white font-mono placeholder-slate-600 focus:border-rose-500"
                  />
                </div>

                {/* 3. Webhook Channel Owner */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-amber-300">3. Webhook Channel Chat Owner (Owner Direct)</label>
                    <button
                      type="button"
                      onClick={() => handleTestDiscordWebhook('owner', discordWebhookOwner)}
                      disabled={testingWebhookKey === 'owner' || !discordWebhookOwner}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      {testingWebhookKey === 'owner' ? <RefreshCw className="w-3 h-3 animate-spin" /> : '⚡ Tes Webhook'}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={discordWebhookOwner}
                    onChange={(e) => setDiscordWebhookOwner(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-slate-700 text-xs text-white font-mono placeholder-slate-600 focus:border-amber-500"
                  />
                </div>

                {/* 4. Webhook Channel General */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-blue-300">4. Webhook Channel Bantuan Umum</label>
                    <button
                      type="button"
                      onClick={() => handleTestDiscordWebhook('general', discordWebhookGeneral)}
                      disabled={testingWebhookKey === 'general' || !discordWebhookGeneral}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                    >
                      {testingWebhookKey === 'general' ? <RefreshCw className="w-3 h-3 animate-spin" /> : '⚡ Tes Webhook'}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={discordWebhookGeneral}
                    onChange={(e) => setDiscordWebhookGeneral(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0B132B] border border-slate-700 text-xs text-white font-mono placeholder-slate-600 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Rules Hari Ini (Dashboard User)</label>
                  <textarea
                    value={rulesHariIni}
                    onChange={(e) => setRulesHariIni(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Syarat &amp; Ketentuan Setoran</label>
                  <textarea
                    value={syaratKetentuan}
                    onChange={(e) => setSyaratKetentuan(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  Simpan Semua Pengaturan &amp; Webhook
                </button>
              </div>
            </form>

            {/* DANGER ZONE: RESET ALL DATABASE */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Zona Berbahaya (Reset Database)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tombol di bawah ini akan mereset seluruh setoran, antrean verifikasi, riwayat penarikan, dan saldo seluruh akun kembali ke Rp 0 seperti semula.
              </p>
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Seluruh Database ke 0 (Setoran &amp; Saldo 0)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL ALASAN PENOLAKAN AKUN GMAIL (WAJIB PILIH / ISI ALASAN) */}
      {rejectAccountTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-rose-600/60 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Alasan Penolakan Akun Gmail</span>
              </div>
              <button
                onClick={() => {
                  setRejectAccountTarget(null);
                  setCustomRejectReason('');
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Akun: <strong className="text-white font-mono">{rejectAccountTarget.email}</strong></div>
              <div className="text-slate-400">Password: <strong className="text-slate-300 font-mono">{rejectAccountTarget.password}</strong></div>
            </div>

            <form onSubmit={handleConfirmRejectAccountModal} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih Alasan Penolakan:</label>
                <div className="space-y-1.5">
                  {[
                    'Email sudah terdaftar di platform lain',
                    'Email tidak sesuai hasil generate stok admin',
                    'Password salah / tidak bisa login',
                    'Akun terkena Checkpoint (CP) / 2FA aktif',
                    'Akun dinonaktifkan oleh Google',
                  ].map((presetReason, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setRejectAccountReason(presetReason);
                        setCustomRejectReason('');
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer flex items-center justify-between ${
                        rejectAccountReason === presetReason && !customRejectReason
                          ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{presetReason}</span>
                      {rejectAccountReason === presetReason && !customRejectReason && (
                        <Check className="w-4 h-4 text-rose-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Atau Tulis Alasan Kustom:</label>
                  <textarea
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    rows={2}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-rose-500"
                    placeholder="Contoh: Akun terdeteksi bermasalah / CP..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectAccountTarget(null);
                    setCustomRejectReason('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg cursor-pointer transition-all"
                >
                  Tolak Akun Ini
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TOLAK BATCH */}
      {rejectBatchTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-rose-600/60 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Tolak Seluruh Batch ({rejectBatchTarget.batchId})</span>
              </div>
              <button onClick={() => setRejectBatchTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">User: <strong className="text-white">{rejectBatchTarget.userName}</strong></div>
              <div className="text-slate-400">Total Akun: <strong className="text-white font-mono">{rejectBatchTarget.totalCount} Akun</strong></div>
            </div>

            <form onSubmit={handleConfirmRejectBatch} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih / Tulis Alasan Penolakan:</label>
                <div className="space-y-1.5 mb-2">
                  {[
                    'Email sudah terdaftar di platform lain',
                    'Email tidak sesuai hasil generate stok admin',
                    'Password salah / 2FA aktif',
                    'Akun checkpoint / butuh verifikasi no HP',
                  ].map((quickReason, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectBatchReason(quickReason)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all cursor-pointer ${
                        rejectBatchReason === quickReason
                          ? 'bg-rose-950/60 border-rose-600 text-rose-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {quickReason}
                    </button>
                  ))}
                </div>

                <textarea
                  value={rejectBatchReason}
                  onChange={(e) => setRejectBatchReason(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-rose-500"
                  placeholder="Ketik alasan lainnya..."
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectBatchTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  Tolak Seluruh Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TOLAK PENARIKAN DANA */}
      {rejectWdTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>Tolak Penarikan Saldo DANA</span>
              </div>
              <button onClick={() => setRejectWdTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">User: <strong className="text-white">{rejectWdTarget.userName}</strong></div>
              <div className="text-slate-400">Nomor DANA: <strong className="text-blue-400 font-mono">{rejectWdTarget.accountNumber}</strong></div>
              <div className="text-slate-400">Nominal: <strong className="text-emerald-400 font-mono">Rp {rejectWdTarget.amount.toLocaleString('id-ID')}</strong></div>
            </div>

            <form onSubmit={handleConfirmRejectWd} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih / Tulis Alasan Penolakan:</label>
                <div className="space-y-1.5 mb-2">
                  {[
                    'Nomor DANA tidak terdaftar / Tidak valid',
                    'Akun DANA Limit / Tidak bisa terima saldo',
                    'Nama Akun DANA tidak sesuai identitas',
                    'Indikasi setoran tidak valid / Checkpoint',
                  ].map((quickReason, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRejectWdReason(quickReason)}
                      className={`w-full text-left p-2 rounded-xl text-[11px] border transition-all cursor-pointer ${
                        rejectWdReason === quickReason
                          ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {quickReason}
                    </button>
                  ))}
                </div>

                <textarea
                  value={rejectWdReason}
                  onChange={(e) => setRejectWdReason(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-rose-500"
                  placeholder="Ketik alasan lainnya..."
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectWdTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
                >
                  Konfirmasi Tolak &amp; Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ACC PENARIKAN DANA */}
      {approveWdTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Konfirmasi ACC Transfer DANA</span>
              </div>
              <button onClick={() => setApproveWdTarget(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <strong className="text-white">{approveWdTarget.userName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor DANA Tujuan:</span>
                <strong className="text-blue-400 font-mono text-sm">{approveWdTarget.accountNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Atas Nama:</span>
                <strong className="text-slate-200">{approveWdTarget.accountName}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5">
                <span className="text-slate-400">Total Ditransfer:</span>
                <strong className="text-emerald-400 font-mono text-sm">Rp {approveWdTarget.amount.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pastikan Anda telah mengirimkan saldo ke akun DANA di atas. Status akan ditandai <strong>SUKSES</strong> dan notifikasi otomatis dikirimkan ke user.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApproveWdTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApproveWd}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                ACC &amp; Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LAPORAN HASIL UPDATE ALL & AUTO-VERIFIKASI */}
      {autoCheckResultModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-blue-600/60 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>Laporan Hasil Update All &amp; Auto-Verifikasi</span>
              </div>
              <button
                onClick={() => setAutoCheckResultModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Diproses</div>
                <div className="text-lg font-black text-white font-mono">{autoCheckResultModal.totalProcessed}</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-center">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Disetujui (ACC)</div>
                <div className="text-lg font-black text-emerald-400 font-mono">{autoCheckResultModal.totalApproved}</div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/60 text-center">
                <div className="text-[10px] text-rose-400 font-bold uppercase">Ditolak</div>
                <div className="text-lg font-black text-rose-400 font-mono">{autoCheckResultModal.totalRejected}</div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-950/50 border border-blue-800/60 text-center">
                <div className="text-[10px] text-blue-300 font-bold uppercase">Saldo Ditambahkan</div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-1">
                  +Rp {autoCheckResultModal.totalSaldoAdded.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300">
              Rincian hasil verifikasi otomatis berdasarkan kecocokan <strong>stok generate admin</strong> &amp; <strong>password wajib</strong>:
            </div>

            {/* Detail items list table */}
            <div className="flex-1 overflow-y-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-2 space-y-1.5 min-h-[160px]">
              {autoCheckResultModal.details.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada data rincian akun dalam pemrosesan ini.
                </div>
              ) : (
                autoCheckResultModal.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                  >
                    <div className="truncate">
                      <span className="font-bold text-white select-all">{item.email}</span>
                      <span className="text-slate-400 text-[11px] block font-sans">
                        User: <strong className="text-slate-300">{item.userName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'accepted' ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          ✅ Disetujui (+Rp {item.amountAdded.toLocaleString('id-ID')})
                        </span>
                      ) : item.status === 'bug_robot' ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40">
                          🤖 Bug Robot
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 truncate max-w-[220px]">
                          ❌ {item.reason || 'Ditolak'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Mode Eksekusi: <strong className="text-white uppercase font-mono">{autoCheckResultModal.mode}</strong>
              </span>

              <button
                type="button"
                onClick={() => setAutoCheckResultModal(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer transition-all"
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BLOKIR AKUN USER */}
      {blockUserTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-rose-600/60 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Ban className="w-5 h-5" />
                <span>Blokir Akun Pengguna</span>
              </div>
              <button onClick={() => setBlockUserTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="text-slate-400">Nama User: <strong className="text-white">{blockUserTarget.name}</strong></div>
              <div className="text-slate-400">Email: <strong className="text-blue-400 font-mono">{blockUserTarget.email}</strong></div>
              <div className="text-slate-400">UID: <strong className="text-slate-300 font-mono text-[11px]">{blockUserTarget.id}</strong></div>
              <div className="text-slate-400">Saldo saat ini: <strong className="text-emerald-400 font-mono">Rp {blockUserTarget.saldo.toLocaleString('id-ID')}</strong></div>
            </div>

            <form onSubmit={handleConfirmBlockUser} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih / Ketik Alasan Pemblokiran:</label>
                <div className="space-y-1.5 mb-2">
                  {[
                    'Kualitas setoran rendah / 0% Trusted',
                    'Email CP / Password tidak sesuai aturan',
                    'Menyetor email bukan dari hasil generate',
                    'Pelanggaran syarat & ketentuan sistem',
                  ].map((quickReason, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBlockUserReason(quickReason)}
                      className={`w-full text-left p-2 rounded-xl text-[11px] border transition-all cursor-pointer ${
                        blockUserReason === quickReason
                          ? 'bg-rose-950/60 border-rose-600 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {quickReason}
                    </button>
                  ))}
                </div>

                <textarea
                  value={blockUserReason}
                  onChange={(e) => setBlockUserReason(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-rose-500"
                  placeholder="Ketik alasan lainnya..."
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockUserTarget(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  Konfirmasi Blokir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERCAKAPAN & BALAS CARLOS SUPPORT TIKET */}
      {selectedAdminTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl flex flex-col h-[85vh] max-h-[700px] overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                  {selectedAdminTicket.type === 'bug_report' ? <Bug className="w-4 h-4 text-rose-400" /> :
                   selectedAdminTicket.type === 'owner_chat' ? <Crown className="w-4 h-4 text-amber-400" /> :
                   <MessageSquare className="w-4 h-4 text-blue-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-sm">
                      {selectedAdminTicket.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {selectedAdminTicket.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Pengirim: <strong className="text-white">{selectedAdminTicket.userName}</strong> ({selectedAdminTicket.userEmail})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAdminTicket.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    adminUpdateTicketStatus(selectedAdminTicket.id, newStatus);
                    setSelectedAdminTicket((prev) => prev ? { ...prev, status: newStatus } : null);
                    addToast('Status Diperbarui', `Status tiket diubah ke ${newStatus}`, 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="open">🟡 Open</option>
                  <option value="in_progress">🔵 In Progress</option>
                  <option value="resolved">🟢 Resolved</option>
                  <option value="closed">⚪ Closed</option>
                </select>

                <button
                  onClick={() => {
                    setSelectedAdminTicket(null);
                    setAdminTicketReplyText('');
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {selectedAdminTicket.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isAdmin = msg.sender === 'admin' || msg.sender === 'owner';
                const isBot = msg.sender === 'bot';

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isAdmin && (
                      <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-slate-700">
                        {isBot ? <Bot className="w-4 h-4 text-blue-400" /> : msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                      isAdmin
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : isBot
                        ? 'bg-slate-900 text-slate-200 border border-blue-900/40 rounded-tl-xs'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-xs'
                    }`}>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className={`text-[10px] font-bold ${isAdmin ? 'text-blue-200' : 'text-slate-400'}`}>
                          {msg.senderName} ({msg.sender.toUpperCase()})
                        </span>
                        <span className={`text-[9px] ${isAdmin ? 'text-blue-200' : 'text-slate-500'}`}>
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {msg.imageUrl && (
                        <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-700 bg-black/40">
                          <span className="text-[9px] text-slate-400 p-1 block bg-slate-800/80">Lampiran Screenshot User:</span>
                          <img src={msg.imageUrl} alt="Lampiran screenshot user" className="max-h-56 w-full object-contain" />
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Crown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Preset Replies */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-t border-slate-800/80 shrink-0">
              {[
                'Terima kasih atas laporannya, kendala ini sedang kami investigasi.',
                'Masalah telah diperbaiki oleh tim teknis. Silakan dicoba kembali ya!',
                'Mohon pastikan format setoran email sesuai dengan password wajib.',
                'Saldo telah dicek dan disesuaikan ke akun Anda.',
              ].map((quick, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAdminTicketReplyText(quick)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 whitespace-nowrap cursor-pointer"
                >
                  {quick.slice(0, 30)}...
                </button>
              ))}
            </div>

            {/* Admin Reply Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminTicketReplyText.trim() || !selectedAdminTicket) return;
                const text = adminTicketReplyText.trim();
                setAdminTicketReplyText('');
                const res = adminReplySupportTicket(selectedAdminTicket.id, text);
                if (res?.success) {
                  const nowStr = new Date().toLocaleString('id-ID');
                  setSelectedAdminTicket((prev) => {
                    if (!prev) return null;
                    const newAdminMsg: SupportMessage = {
                      id: `msg-${Date.now()}`,
                      sender: 'admin',
                      senderName: 'Admin Carlos69',
                      content: text,
                      timestamp: nowStr,
                    };
                    return {
                      ...prev,
                      status: 'in_progress',
                      updatedAt: nowStr,
                      lastReplyBy: 'admin',
                      messages: [...prev.messages, newAdminMsg],
                    };
                  });
                }
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-800 shrink-0"
            >
              <textarea
                value={adminTicketReplyText}
                onChange={(e) => setAdminTicketReplyText(e.target.value)}
                rows={2}
                placeholder="Tulis balasan resmi sebagai Admin Carlos69..."
                className="flex-1 p-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!adminTicketReplyText.trim()}
                className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Balas User</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI RESET DATABASE */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-rose-600/80 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Konfirmasi Reset Database Total</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda benar-benar yakin ingin mereset seluruh database? Tindakan ini akan <strong>menghapus seluruh antrean setoran, riwayat akun, riwayat penarikan, dan mengembalikan saldo semua user ke Rp 0</strong>.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  adminResetAllDatabase();
                  setShowResetConfirmModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg cursor-pointer transition-all"
              >
                Ya, Reset Seluruhnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
