import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  GmailAccountItem, 
  GmailSubmission, 
  WithdrawalRequest, 
  Transaction, 
  PlatformSettings, 
  ActivityLog, 
  GeneratedGmail, 
  AppNotification, 
  Announcement,
  AdminEmailStock,
  AutoCheckResult,
  SupportTicket,
  SupportMessage
} from '../types';
import { playNotificationSound } from '../utils/sound';
import { sendDiscordWebhook } from '../utils/discord';

interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  allUsers: User[];
  submissions: GmailSubmission[];
  allGmailAccounts: GmailAccountItem[];
  withdrawals: WithdrawalRequest[];
  transactions: Transaction[];
  settings: PlatformSettings;
  activityLogs: ActivityLog[];
  generatedGmails: GeneratedGmail[];
  notifications: AppNotification[];
  announcements: Announcement[];
  adminEmailStocks: AdminEmailStock[];
  supportTickets: SupportTicket[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
  liveEvent: string | null;

  // Auth Operations
  login: (identifier: string, pass: string) => { success: boolean; message: string };
  loginWithGoogle: (accountInfo?: { name: string; email: string; avatar?: string }) => void;
  register: (name: string, email: string, pass: string, referralCode?: string) => { success: boolean; message: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  saveDanaNumber: (danaNum: string, accountName?: string) => void;
  changePassword: (newPass: string) => void;

  // User Operations
  submitBulkGmail: (rawText: string, note?: string) => { success: boolean; message: string; count?: number };
  requestWithdrawal: (amount: number, danaNumber: string, accountName: string) => { success: boolean; message: string };
  buyGmailPackage: (qty: number, buyerDanaNumber: string) => { success: boolean; message: string };
  generateNewGmails: (count: number) => { success: boolean; message: string; count: number };
  deleteGeneratedGmail: (id: string) => void;
  clearMyGeneratedGmails: () => void;

  // Support Ticket Operations
  createSupportTicket: (params: {
    type: 'ai_faq' | 'bug_report' | 'owner_chat' | 'general';
    category: string;
    title: string;
    initialMessage: string;
    screenshotUrl?: string;
  }) => Promise<{ success: boolean; ticket: SupportTicket; message: string }>;
  sendTicketUserMessage: (ticketId: string, content: string, imageUrl?: string) => Promise<{ success: boolean; message: string }>;
  adminReplySupportTicket: (ticketId: string, content: string) => { success: boolean; message: string };
  adminUpdateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => { success: boolean; message: string };

  // Admin Operations
  adminAddEmailStock: (rawEmails: string) => { success: boolean; count: number; message: string };
  adminDeleteEmailStock: (id: string) => void;
  adminClearUnusedStock: () => void;
  adminApproveBatch: (batchId: string) => void;
  adminRejectBatch: (batchId: string, reason: string) => void;
  adminApproveSingleAccount: (accountId: string) => void;
  adminRejectSingleAccount: (accountId: string, reason: string) => void;
  adminMarkBugRobot: (accountId: string, reason?: string) => void;
  adminApproveAllPending: () => void;
  adminUpdateAllSetoran: (mode?: 'instant' | 'delay', delaySec?: number) => Promise<AutoCheckResult>;
  adminAddAllPendingSaldo: (mode?: 'instant' | 'delay', delaySec?: number) => Promise<{ totalUsers: number; totalSaldo: number; totalAccounts: number }>;
  adminCommitStagedSetoran: (
    stagedDecisions: Record<string, { status: 'accepted' | 'rejected' | 'bug_robot'; reason?: string }>,
    mode?: 'instant' | 'delay',
    delaySec?: number
  ) => Promise<AutoCheckResult>;
  adminBlockUser: (userId: string, reason: string) => void;
  adminUnblockUser: (userId: string) => void;
  adminProcessWithdrawal: (withdrawalId: string, status: 'success' | 'rejected', reason?: string) => void;
  adminUpdateSettings: (newSettings: Partial<PlatformSettings>) => void;
  adminToggleStorOpen: (isOpen?: boolean) => void;
  adminDeleteUser: (userId: string) => void;
  adminResetAllDatabase: () => void;

  // Global Notification & Toast
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const STORAGE_KEY_USER = 'carlos69_current_user_v6';
const STORAGE_KEY_USERS = 'carlos69_all_users_v6';
const STORAGE_KEY_ACCOUNTS = 'carlos69_gmail_accounts_v6';
const STORAGE_KEY_SUBMISSIONS = 'carlos69_submissions_v6';
const STORAGE_KEY_WITHDRAWALS = 'carlos69_withdrawals_v6';
const STORAGE_KEY_SETTINGS = 'carlos69_settings_v6';
const STORAGE_KEY_LOGS = 'carlos69_activity_logs_v6';
const STORAGE_KEY_GENERATED = 'carlos69_generated_gmails_v6';
const STORAGE_KEY_NOTIFS = 'carlos69_notifications_v6';
const STORAGE_KEY_EMAIL_STOCK = 'carlos69_admin_email_stocks_v6';
const STORAGE_KEY_TICKETS = 'carlos69_support_tickets_v6';

// Fallback helper to migrate from old keys if needed
const getSavedStorage = (key: string, fallbackKey: string) => {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
    const oldVal = localStorage.getItem(fallbackKey);
    if (oldVal) return JSON.parse(oldVal);
    return null;
  } catch {
    return null;
  }
};

const SEED_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-seed-001',
    ticketNumber: '#BUG-8041',
    userId: 'c0494446-0255-4c04-bbf9-33512ed0fb2b',
    userName: 'gystar aguq',
    userEmail: 'gystaraguq@gmail.com',
    type: 'bug_report',
    category: 'Gagal Generate Akun',
    title: 'Stok generate sempat kosong saat klik generate',
    status: 'resolved',
    messages: [
      {
        id: 'msg-seed-1',
        sender: 'user',
        senderName: 'gystar aguq',
        content: 'Halo min, tadi waktu klik tombol generate sempat muncul notif stok habis.',
        timestamp: '24/08/2026, 09:12:00',
      },
      {
        id: 'msg-seed-2',
        sender: 'bot',
        senderName: 'Carlos Support Bot',
        content: 'Terima kasih atas laporan Anda! Laporan bug #BUG-8041 telah diteruskan ke Discord tim developer. Mohon tunggu konfirmasi admin.',
        timestamp: '24/08/2026, 09:12:01',
      },
      {
        id: 'msg-seed-3',
        sender: 'admin',
        senderName: 'Admin Carlos69',
        content: 'Sudah kami tambahkan stok baru ya kak, silakan dicoba generate kembali.',
        timestamp: '24/08/2026, 09:15:30',
      }
    ],
    createdAt: '24/08/2026, 09:12:00',
    updatedAt: '24/08/2026, 09:15:30',
    lastReplyBy: 'admin',
  }
];

// SEED ADMIN & INITIAL USERS
const SEED_ADMIN: User = {
  id: 'usr-admin-001',
  name: 'Admin Carlos69 Pusat',
  username: 'Ryuu0508',
  email: 'admin@carlos69.com',
  password: 'Hanzz0508',
  role: 'admin',
  danaNumber: '081199990000',
  danaAccountName: 'ADMIN CARLOS69 PUSAT',
  saldo: 0,
  status: 'active',
  qualityScore: 100,
  trustBadge: 'Super Administrator',
  phone: '081199990000',
  joinedAt: '01/01/2026',
  referralCode: 'ADMIN-CARLOS69',
  passwordChangedAt: '10/01/2026',
  totalSubmissions: 0,
  acceptedCount: 0,
  pendingCount: 0,
  rejectedCount: 0,
};

const INITIAL_USERS: User[] = [
  SEED_ADMIN,
  {
    id: 'ab95e9f0-efa3-4dc7-b414-4d027d0b56f9',
    name: 'Hanzz Wota',
    username: 'Hanzz0508',
    email: 'hanzzwota@gmail.com',
    password: 'Hanzz0508',
    role: 'user',
    danaNumber: '083164982848',
    danaAccountName: 'Lina',
    saldo: 0,
    status: 'active',
    qualityScore: 91,
    trustBadge: '91% • Trusted Seller',
    phone: '083164982848',
    joinedAt: '18/08/2026',
    referralCode: 'CARLOS-HANZZ69',
    passwordChangedAt: 'Belum pernah',
    totalSubmissions: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  },
  {
    id: 'c0494446-0255-4c04-bbf9-33512ed0fb2b',
    name: 'gystar aguq',
    username: 'gystaraguq',
    email: 'gystaraguq@gmail.com',
    password: 'Password123!',
    role: 'user',
    danaNumber: '085298765432',
    danaAccountName: 'Gystar Aguq',
    saldo: 0,
    status: 'active',
    qualityScore: 89,
    trustBadge: '89% • Good Seller',
    phone: '085298765432',
    joinedAt: '10/08/2026',
    referralCode: 'GYSTAR-01',
    totalSubmissions: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  },
  {
    id: '61748f2a-ec81-42c9-aa14-40699b731b99',
    name: 'Andra lesmana',
    username: 'andralesmana',
    email: 'andraa.lesmanaa01@gmail.com',
    password: 'Password123!',
    role: 'user',
    danaNumber: '081234567890',
    danaAccountName: 'Andra Lesmana',
    saldo: 0,
    status: 'active',
    qualityScore: 100,
    trustBadge: '100% • Elite Seller',
    phone: '081234567890',
    joinedAt: '05/08/2026',
    referralCode: 'ANDRA-02',
    totalSubmissions: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  },
  {
    id: '00f0955d-2938-4154-9799-2084315f900c',
    name: 'Ricanwardana',
    username: 'ricanganteng',
    email: 'ricanganteng2@gmail.com',
    password: 'Password123!',
    role: 'user',
    danaNumber: '087812345678',
    danaAccountName: 'Rican Wardana',
    saldo: 0,
    status: 'active',
    qualityScore: 98,
    trustBadge: '98% • Elite Seller',
    phone: '087812345678',
    joinedAt: '01/08/2026',
    referralCode: 'RICAN-03',
    totalSubmissions: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  },
  {
    id: '4d6ede2d-a32a-4d95-b79f-51313fb744c3',
    name: 'ridho anjay',
    username: 'ridhoanjay',
    email: 'useradj653@gmail.com',
    password: 'Password123!',
    role: 'user',
    danaNumber: '089612349999',
    danaAccountName: 'Ridho Anjay',
    saldo: 0,
    status: 'active',
    qualityScore: 90,
    trustBadge: '90% • Trusted Seller',
    phone: '089612349999',
    joinedAt: '12/08/2026',
    referralCode: 'RIDHO-04',
    totalSubmissions: 0,
    acceptedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  },
];

const SEED_SETTINGS: PlatformSettings = {
  id: 'set-001',
  namaDashboard: 'Carlos69',
  linkSaluran: 'https://whatsapp.com/channel/0029Vb4F9G1J3RujV8yE6l',
  ratePerAkun: 4500,
  mandatoryPassword: 'sgsg1122',
  infoDashboard: 'Open Senin - Jumat Open Jam 07:00 Close ( Ga nentu ) Estimasi close ( 14:00 - 16:00 ) More info di saluran',
  isStorOpen: true,
  storStatusMessage: 'Storan dibuka! Silakan stor akun Gmail sesuai aturan password sgsg1122.',
  syaratKetentuan: `1. Akun Gmail yang disetor wajib fresh / berumur dengan status aktif.\n2. Gunakan password wajib yang telah ditentukan sistem admin: sgsg1122.\n3. Jangan menyetor akun yang terkena checkpoint (CP) atau membutuhkan verifikasi nomor telepon.\n4. Pembayaran hasil setor diproses langsung ke saldo dan dapat ditarik instan ke DANA.\n5. Akun dengan reputasi (trusted) 0% otomatis diblokir sistem.`,
  rulesHariIni: `Wajib baca: Pastikan akun Gmail yang Anda buat menggunakan password wajib sgsg1122. Akun dengan password berbeda otomatis ditolak sistem verifikasi!`,
};

const SEED_EMAIL_STOCKS: AdminEmailStock[] = [
  { id: 'stk-1', email: 'dhmgkamalperdana3899@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-2', email: 'ikmoandrewraksa3596@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-3', email: 'rmigjessicaallen6975@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-4', email: 'haiaikapermana4714@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-5', email: 'gjevhidayahsantoso7243@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-6', email: 'vzkobaguswidodo2091@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-7', email: 'plmqputriananda8821@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-8', email: 'zrtybayupratama5514@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-9', email: 'qxwdratnasari3349@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
  { id: 'stk-10', email: 'mnbvrizkymaulana9912@gmail.com', isUsed: false, createdAt: '2026-08-23 12:00' },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'INFO PENTING CARLOS69',
    content: 'Untuk yang mau stor silakan request/generate email dari stok admin di menu Stor. Gunakan password wajib sgsg1122!',
    dotsColor: 'rose',
    date: '24/08/2026',
  },
  {
    id: 'ann-2',
    title: 'INFORMASI JADWAL SETORAN',
    content: 'Open Senin - Jumat Jam 07:00 WIB. Minimal penarikan saldo ke DANA adalah Rp 4.000 tanpa potongan biaya admin.',
    dotsColor: 'emerald',
    date: '24/08/2026',
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [liveEvent, setLiveEvent] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Persistent States
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    return getSavedStorage(STORAGE_KEY_USERS, 'carlos69_all_users_v5') || INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = getSavedStorage(STORAGE_KEY_USER, 'carlos69_current_user_v5');
    return saved || null; // Require login first as requested
  });

  const [submissions, setSubmissions] = useState<GmailSubmission[]>(() => {
    return getSavedStorage(STORAGE_KEY_SUBMISSIONS, 'carlos69_submissions_v5') || [];
  });

  const [allGmailAccounts, setAllGmailAccounts] = useState<GmailAccountItem[]>(() => {
    return getSavedStorage(STORAGE_KEY_ACCOUNTS, 'carlos69_gmail_accounts_v5') || [];
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    return getSavedStorage(STORAGE_KEY_WITHDRAWALS, 'carlos69_withdrawals_v5') || [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [adminEmailStocks, setAdminEmailStocks] = useState<AdminEmailStock[]>(() => {
    return getSavedStorage(STORAGE_KEY_EMAIL_STOCK, 'carlos69_admin_email_stocks_v5') || SEED_EMAIL_STOCKS;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = getSavedStorage(STORAGE_KEY_SETTINGS, 'carlos69_settings_v5');
    return saved ? { ...SEED_SETTINGS, ...saved } : SEED_SETTINGS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    return getSavedStorage(STORAGE_KEY_LOGS, 'carlos69_activity_logs_v5') || [];
  });

  const [generatedGmails, setGeneratedGmails] = useState<GeneratedGmail[]>(() => {
    return getSavedStorage(STORAGE_KEY_GENERATED, 'carlos69_generated_gmails_v5') || [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return getSavedStorage(STORAGE_KEY_NOTIFS, 'carlos69_notifications_v5') || [];
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    return getSavedStorage(STORAGE_KEY_TICKETS, 'carlos69_support_tickets_v5') || SEED_TICKETS;
  });

  const [announcements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);

  // Backend cross-device persistence helper
  const syncToServer = useCallback(async (payload: any) => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Local fallback
    }
  }, []);

  // Synchronize from server API to support multiple users / phones / admin PC in real-time
  useEffect(() => {
    const fetchServerState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            if (Array.isArray(data.submissions) && data.submissions.length > 0) {
              setSubmissions(data.submissions);
            }
            if (Array.isArray(data.allGmailAccounts) && data.allGmailAccounts.length > 0) {
              setAllGmailAccounts(data.allGmailAccounts);
            }
            if (Array.isArray(data.allUsers) && data.allUsers.length > 0) {
              setAllUsers(data.allUsers);
            }
            if (Array.isArray(data.withdrawals) && data.withdrawals.length > 0) {
              setWithdrawals(data.withdrawals);
            }
            if (Array.isArray(data.supportTickets) && data.supportTickets.length > 0) {
              setSupportTickets(data.supportTickets);
            }
            if (data.settings && typeof data.settings === 'object' && Object.keys(data.settings).length > 0) {
              setSettings((prev) => {
                const incoming = data.settings;
                const hasChanges = Object.keys(incoming).some(
                  (k) => (incoming as any)[k] !== undefined && (incoming as any)[k] !== (prev as any)[k]
                );
                if (hasChanges) {
                  return { ...prev, ...incoming };
                }
                return prev;
              });
            }
            if (Array.isArray(data.adminEmailStocks) && data.adminEmailStocks.length > 0) {
              setAdminEmailStocks(data.adminEmailStocks);
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchServerState();
    const interval = setInterval(fetchServerState, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(allGmailAccounts));
  }, [allGmailAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GENERATED, JSON.stringify(generatedGmails));
  }, [generatedGmails]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMAIL_STOCK, JSON.stringify(adminEmailStocks));
  }, [adminEmailStocks]);

  // Toast Dispatcher (Smooth & Non-Intrusive, Max 2 Items)
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 't-' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => {
      const filtered = prev.slice(-1);
      return [...filtered, { id, title, message, type }];
    });
    setLiveEvent(`${title}: ${message}`);
    playNotificationSound(type);

    setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, [removeToast]);

  // Helper notification creator
  const createNotification = (userId: string, title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toLocaleString('id-ID'),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Log Activity
  const logActivity = (action: ActivityLog['action'], description: string, userId?: string, accountId?: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      action,
      description,
      userId,
      accountId,
      timestamp: new Date().toLocaleString('id-ID'),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (identifier: string, pass: string): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const found = allUsers.find(
      (u) => (u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId) && u.password === pass
    );

    if (!found) {
      return { success: false, message: 'Email/Username atau Kata Sandi salah!' };
    }

    if (found.status === 'blocked') {
      return { success: false, message: `Akun diblokir! Alasan: ${found.blockedReason || 'Pelanggaran ketentuan'}` };
    }

    setCurrentUser(found);
    if (found.role === 'admin') {
      setIsAdminMode(true);
      setActiveTab('admin');
    } else {
      setIsAdminMode(false);
      setActiveTab('beranda');
    }

    addToast('Selamat Datang!', `Berhasil masuk sebagai ${found.name}`, 'success');
    return { success: true, message: 'Login berhasil!' };
  };

  // Google Login / Google Account Chooser
  const loginWithGoogle = (accountInfo?: { name: string; email: string; avatar?: string }) => {
    const googleEmail = (accountInfo?.email || 'user.google@gmail.com').toLowerCase().trim();
    const googleName = accountInfo?.name || 'Google User (' + googleEmail.split('@')[0] + ')';

    let user = allUsers.find((u) => u.email.toLowerCase() === googleEmail);
    
    if (!user) {
      user = {
        id: 'usr-g-' + Date.now(),
        name: googleName,
        username: googleEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'googleuser',
        email: googleEmail,
        avatar: accountInfo?.avatar,
        role: 'user',
        danaNumber: '',
        saldo: 0,
        status: 'active',
        qualityScore: 100,
        trustBadge: '100% • Elite Seller',
        phone: '',
        joinedAt: new Date().toLocaleDateString('id-ID'),
        referralCode: 'GGL-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        totalSubmissions: 0,
        acceptedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      };
      setAllUsers((prev) => {
        const next = [...prev, user!];
        syncToServer({ allUsers: next });
        return next;
      });
    }

    setCurrentUser(user);
    setIsAdminMode(user.role === 'admin');
    setActiveTab(user.role === 'admin' ? 'admin' : 'beranda');
    addToast('Google Sign-In', `Berhasil masuk dengan akun Google: ${user.email}`, 'success');
  };

  const register = (
    name: string,
    email: string,
    pass: string,
    referralCode?: string
  ): { success: boolean; message: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const exists = allUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan login!' };
    }

    if (pass.length < 6) {
      return { success: false, message: 'Kata sandi minimal 6 karakter!' };
    }

    const username = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');

    const newUser: User = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      name: name.trim(),
      username: username || 'user' + Math.floor(Math.random() * 1000),
      email: cleanEmail,
      password: pass,
      role: 'user',
      danaNumber: '',
      saldo: 0,
      status: 'active',
      qualityScore: 100,
      trustBadge: '100% • New Seller',
      phone: '',
      joinedAt: new Date().toLocaleDateString('id-ID'),
      referralCode: 'ZERO-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      referredBy: referralCode ? referralCode.trim() : undefined,
      passwordChangedAt: 'Belum pernah',
      totalSubmissions: 0,
      acceptedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
    };

    const nextUsers = [...allUsers, newUser];
    setAllUsers(nextUsers);
    setCurrentUser(newUser);
    setIsAdminMode(false);
    setActiveTab('beranda');
    syncToServer({ allUsers: nextUsers });

    addToast('Pendaftaran Berhasil', `Akun ${newUser.name} berhasil dibuat!`, 'success');
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } catch {}

    return { success: true, message: 'Registrasi sukses!' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setActiveTab('beranda');
    addToast('Logout', 'Anda telah keluar dari sesi akun.', 'info');
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('admin');
      } else {
        setIsAdminMode(false);
        setActiveTab('beranda');
      }
      addToast('Beralih Akun', `Sekarang login sebagai ${user.name}`, 'info');
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    const nextUsers = allUsers.map((u) => (u.id === currentUser.id ? updated : u));
    setAllUsers(nextUsers);
    syncToServer({ allUsers: nextUsers });
    addToast('Profil Disimpan', 'Data akun berhasil diperbarui.', 'success');
  };

  const saveDanaNumber = (danaNum: string, accountName?: string) => {
    if (!currentUser) return;
    updateUserProfile({
      danaNumber: danaNum.trim(),
      danaAccountName: accountName ? accountName.trim() : currentUser.danaAccountName || currentUser.name,
    });
  };

  const changePassword = (newPass: string) => {
    if (!currentUser) return;
    updateUserProfile({
      password: newPass,
      passwordChangedAt: new Date().toLocaleDateString('id-ID'),
    });
  };

  // User Operations: Submit Bulk Gmail Setoran
  const submitBulkGmail = (
    rawText: string,
    note?: string
  ): { success: boolean; message: string; count?: number } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk menyetor!' };
    }

    // Check if Stor is Open
    if (!settings.isStorOpen) {
      return { 
        success: false, 
        message: settings.storStatusMessage || '⛔ Setoran sedang DITUTUP oleh admin. Mohon tunggu admin membuka kembali!' 
      };
    }

    if (currentUser.status === 'blocked') {
      return { success: false, message: 'Akun Anda dinonaktifkan dari sistem setoran.' };
    }

    const rawLines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      return { success: false, message: 'Format setoran kosong. Harap masukkan minimal 1 email.' };
    }

    const defaultPass = settings.mandatoryPassword || 'sgsg1122';
    const timestampStr = new Date().toLocaleString('id-ID');

    const parsedAccounts: GmailAccountItem[] = [];
    const seenEmails = new Set<string>();

    for (const line of rawLines) {
      const tokens = line.split(/[,\t]+/).map((t) => t.trim()).filter(Boolean);

      for (const token of tokens) {
        if (!token.includes('@')) continue;

        let email = '';
        let pass = defaultPass;

        if (token.includes('|')) {
          const parts = token.split('|');
          email = parts[0].trim();
          pass = parts[1] ? parts[1].trim() : defaultPass;
        } else if (token.includes(':') && !token.startsWith('http')) {
          const parts = token.split(':');
          email = parts[0].trim();
          pass = parts[1] ? parts[1].trim() : defaultPass;
        } else {
          const spaceParts = token.split(/\s+/);
          if (spaceParts.length >= 2 && spaceParts[0].includes('@')) {
            email = spaceParts[0].trim();
            pass = spaceParts[1].trim();
          } else {
            email = token.trim();
          }
        }

        email = email.replace(/[<>'"\s]/g, '').toLowerCase();

        if (email.includes('@') && !seenEmails.has(email)) {
          seenEmails.add(email);
          parsedAccounts.push({
            id: 'acc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            email,
            password: pass || defaultPass,
            status: 'pending',
            trusted: currentUser.qualityScore || 100,
            price: settings.ratePerAkun,
            userId: currentUser.id,
            userName: currentUser.name,
            storDate: timestampStr,
            isSetoran: true,
          });
        }
      }
    }

    if (parsedAccounts.length === 0) {
      return { success: false, message: 'Format akun tidak valid. Pastikan berisi alamat Gmail yang benar.' };
    }

    const batchId = '#ST-' + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = parsedAccounts.length * settings.ratePerAkun;

    const newSubmission: GmailSubmission = {
      id: 'sub-' + Date.now(),
      batchId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      accounts: parsedAccounts,
      totalCount: parsedAccounts.length,
      pricePerAccount: settings.ratePerAkun,
      totalAmount,
      status: 'pending',
      notes: note?.trim() || undefined,
      createdAt: timestampStr,
    };

    const nextSubmissions = [newSubmission, ...submissions];
    const nextAccounts = [...parsedAccounts, ...allGmailAccounts];

    setSubmissions(nextSubmissions);
    setAllGmailAccounts(nextAccounts);

    // Update current user stats
    const updatedUser: User = {
      ...currentUser,
      totalSubmissions: (currentUser.totalSubmissions || 0) + parsedAccounts.length,
      pendingCount: (currentUser.pendingCount || 0) + parsedAccounts.length,
    };
    setCurrentUser(updatedUser);
    const nextUsers = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setAllUsers(nextUsers);

    // Real-time server sync so Admin PC/phone receives this immediately
    syncToServer({
      submissions: nextSubmissions,
      allGmailAccounts: nextAccounts,
      allUsers: nextUsers,
    });

    logActivity('approve', `User ${currentUser.name} menyetor batch ${batchId} (${parsedAccounts.length} akun Gmail)`, currentUser.id);

    addToast(
      'Setoran Terkirim',
      `Berhasil menyetor ${parsedAccounts.length} akun Gmail (${batchId}). Menunggu verifikasi admin.`,
      'success'
    );

    return { success: true, message: 'Setoran berhasil dikirim!', count: parsedAccounts.length };
  };

  // User Operation: Request Withdrawal (DANA Only)
  const requestWithdrawal = (
    amount: number,
    danaNumber: string,
    accountName: string
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu!' };
    }

    if (amount < 4000) {
      return { success: false, message: 'Minimal penarikan saldo adalah Rp 4.000' };
    }

    if (currentUser.saldo < amount) {
      return { success: false, message: `Saldo tidak mencukupi! Saldo Anda saat ini: Rp ${currentUser.saldo.toLocaleString('id-ID')}` };
    }

    if (!danaNumber.trim()) {
      return { success: false, message: 'Nomor DANA wajib diisi!' };
    }

    const txId = 'WD-DANA-' + Math.floor(100000 + Math.random() * 900000);
    const newWd: WithdrawalRequest = {
      id: 'wd-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      amount,
      fee: 0,
      netAmount: amount,
      method: 'DANA',
      accountNumber: danaNumber.trim(),
      accountName: accountName.trim() || currentUser.name,
      status: 'pending',
      txId,
      createdAt: new Date().toLocaleString('id-ID'),
    };

    const updatedUser: User = {
      ...currentUser,
      saldo: currentUser.saldo - amount,
      danaNumber: danaNumber.trim(),
      danaAccountName: accountName.trim() || currentUser.name,
    };
    setCurrentUser(updatedUser);
    const nextUsers = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    const nextWds = [newWd, ...withdrawals];

    setAllUsers(nextUsers);
    setWithdrawals(nextWds);

    syncToServer({
      withdrawals: nextWds,
      allUsers: nextUsers,
    });

    logActivity('withdrawal', `Permintaan penarikan DANA Rp ${amount.toLocaleString('id-ID')} (${txId})`, currentUser.id);

    addToast(
      'Permintaan DANA Diterima',
      `Penarikan Rp ${amount.toLocaleString('id-ID')} ke ${danaNumber} sedang diproses admin.`,
      'info'
    );

    return { success: true, message: 'Penarikan berhasil diajukan!' };
  };

  // User: Generate Email Pool (HANYA DARI STOK RESMI ADMIN, DILARANG RANDOM/PALSU)
  const generateNewGmails = (count: number): { success: boolean; message: string; count: number } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu!', count: 0 };
    }

    if (count <= 0) {
      return { success: false, message: 'Masukkan jumlah akun yang valid (minimal 1)!', count: 0 };
    }

    const unusedStocks = adminEmailStocks.filter((stk) => !stk.isUsed);
    const nowTime = new Date().toLocaleString('id-ID');

    // JIKA STOK DARI ADMIN BENAR-BENAR KOSONG (0)
    if (unusedStocks.length === 0) {
      // Kirim Notifikasi Otomatis ke Discord Admin
      const stockWebhook = settings.discordWebhookStock || settings.discordWebhookGeneral;
      if (stockWebhook) {
        sendDiscordWebhook({
          webhookUrl: stockWebhook,
          title: '🚨 [PERINGATAN] STOK EMAIL GENERATE HABIS (0)!',
          description: `User **${currentUser.name}** (\`${currentUser.email}\`) mencoba melakukan generate **${count}** akun Gmail di menu Stor, namun stok email resmi dari Admin telah **KOSONG (0)**.\n\n⚠️ **Tindakan Diperlukan:** Harap segera tambahkan daftar stok email baru di **Dashboard Admin > Stok Pool Generate** agar user dapat menyetor!`,
          color: 0xef4444, // Red
          fields: [
            { name: '👤 User Pemohon', value: `${currentUser.name} (${currentUser.username || currentUser.email})`, inline: true },
            { name: '📦 Jumlah Diminta', value: `${count} Akun`, inline: true },
            { name: '📊 Sisa Stok Admin', value: '0 Akun (Habis)', inline: true },
            { name: '⏰ Waktu Kejadian', value: nowTime, inline: false },
          ],
          authorName: 'Carlos69 Stock Monitor Bot',
          footerText: 'Carlos69 Real-Time Stock Alert',
        });
      }

      logActivity('stock_add', `Stok email generate habis saat diminta oleh ${currentUser.name} (${count} akun)`, currentUser.id);

      addToast(
        'Stok Generate Habis',
        'Stok email generate dari admin saat ini KOSONG (0)! Notifikasi otomatis telah dikirim ke Discord Admin. Mohon tunggu admin mengisi stok baru.',
        'error'
      );

      return {
        success: false,
        message: 'Stok email generate admin saat ini KOSONG (0)! Bot Discord telah memberi tahu Admin untuk segera menambah stok baru. Mohon tunggu beberapa saat.',
        count: 0,
      };
    }

    // Ambil HANYA dari stok admin yang belum terpakai (TIDAK BOLEH MEMBUAT EMAIL RANDOM)
    let selectedStocks: AdminEmailStock[] = [];
    const isPartial = unusedStocks.length < count;

    if (isPartial) {
      selectedStocks = [...unusedStocks]; // Ambil semua yang tersisa
    } else {
      selectedStocks = unusedStocks.slice(0, count);
    }

    const remainingStockCount = unusedStocks.length - selectedStocks.length;
    const selectedIds = selectedStocks.map((s) => s.id);

    // Update status stok admin menjadi terpakai
    setAdminEmailStocks((prev) => {
      const updated = prev.map((s) => {
        if (selectedIds.includes(s.id)) {
          return {
            ...s,
            isUsed: true,
            usedByUserId: currentUser.id,
            usedByUserName: currentUser.name,
            usedAt: nowTime,
          };
        }
        return s;
      });
      syncToServer({ adminEmailStocks: updated });
      return updated;
    });

    const newGeneratedItems: GeneratedGmail[] = selectedStocks.map((s) => ({
      id: 'gen-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      email: s.email,
      isDeposited: false,
      createdAt: nowTime,
      userId: currentUser.id,
    }));

    setGeneratedGmails((prev) => [...newGeneratedItems, ...prev]);

    // Jika stok habis setelah generate ini, kirim peringatan ke Discord Admin
    if (remainingStockCount === 0) {
      const stockWebhook = settings.discordWebhookStock || settings.discordWebhookGeneral;
      if (stockWebhook) {
        sendDiscordWebhook({
          webhookUrl: stockWebhook,
          title: '⚠️ [PERINGATAN] STOK EMAIL GENERATE SEKARANG HABIS (0)!',
          description: `User **${currentUser.name}** baru saja mengambil **${selectedStocks.length}** akun Gmail. Saat ini sisa stok email admin telah **HABIS (0)**.\n\nHarap segera restock di Panel Admin!`,
          color: 0xf59e0b, // Amber
          fields: [
            { name: '👤 User Pengambil', value: `${currentUser.name}`, inline: true },
            { name: '📊 Sisa Stok Saat Ini', value: '0 Akun (KOSONG)', inline: true },
            { name: '⏰ Waktu', value: nowTime, inline: false },
          ],
          authorName: 'Carlos69 Stock Monitor Bot',
          footerText: 'Carlos69 Real-Time Stock Alert',
        });
      }
    }

    if (isPartial) {
      addToast(
        'Stok Terbatas',
        `Hanya tersedia ${selectedStocks.length} email dari stok admin (dari permintaan ${count} akun). Sisa stok sekarang habis.`,
        'warning'
      );
      return {
        success: true,
        message: `Hanya tersedia ${selectedStocks.length} akun dari stok resmi admin. Semua stok telah digenerate!`,
        count: selectedStocks.length,
      };
    }

    addToast(
      'Generate Berhasil',
      `Berhasil generate ${selectedStocks.length} akun Gmail resmi dari stok admin.`,
      'success'
    );

    return {
      success: true,
      message: `Berhasil generate ${selectedStocks.length} akun email resmi dari stok admin!`,
      count: selectedStocks.length,
    };
  };

  const deleteGeneratedGmail = (id: string) => {
    setGeneratedGmails((prev) => prev.filter((g) => g.id !== id));
  };

  const clearMyGeneratedGmails = () => {
    if (!currentUser) return;
    setGeneratedGmails((prev) => prev.filter((g) => g.userId !== currentUser.id));
    addToast('Riwayat Dibersihkan', 'Riwayat generate Anda telah dibersihkan.', 'info');
  };

  // User: Beli Paket Akun Gmail
  const buyGmailPackage = (qty: number, buyerDanaNumber: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu untuk membeli akun!' };
    }

    const available = allGmailAccounts.filter((a) => a.status === 'accepted');
    if (available.length < qty) {
      return { success: false, message: `Stok akun siap pakai tidak mencukupi! Hanya tersedia ${available.length} akun.` };
    }

    const selected = available.slice(0, qty);
    const selectedIds = selected.map((s) => s.id);
    const timestamp = new Date().toLocaleString('id-ID');

    const nextAccounts = allGmailAccounts.map((a) => {
      if (selectedIds.includes(a.id)) {
        return {
          ...a,
          status: 'sold' as const,
          userId: currentUser.id,
          userName: currentUser.name,
          verifikasiDate: timestamp,
        };
      }
      return a;
    });

    setAllGmailAccounts(nextAccounts);
    syncToServer({ allGmailAccounts: nextAccounts });

    createNotification(
      currentUser.id,
      `Pembelian ${qty} Akun Gmail Berhasil!`,
      `Paket ${qty} akun Gmail berhasil dibeli (DANA: ${buyerDanaNumber}). Akun telah ditambahkan ke data Anda.`,
      'success'
    );

    logActivity('approve', `User ${currentUser.name} membeli ${qty} akun Gmail (DANA: ${buyerDanaNumber})`, currentUser.id);
    addToast('Pembelian Berhasil', `Berhasil membeli ${qty} akun Gmail!`, 'success');
    return { success: true, message: 'Pembelian berhasil!' };
  };

  // ================= CARLOS SUPPORT & DISCORD CHAT INTEGRATION =================
  const createSupportTicket = async ({
    type,
    category,
    title,
    initialMessage,
    screenshotUrl,
  }: {
    type: 'ai_faq' | 'bug_report' | 'owner_chat' | 'general';
    category: string;
    title: string;
    initialMessage: string;
    screenshotUrl?: string;
  }): Promise<{ success: boolean; ticket: SupportTicket; message: string }> => {
    if (!currentUser) {
      return {
        success: false,
        ticket: {} as any,
        message: 'Silakan login terlebih dahulu untuk membuat tiket support!',
      };
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = type === 'bug_report' ? 'BUG' : type === 'owner_chat' ? 'OWNER' : 'TKT';
    const ticketNumber = `#${prefix}-${randomNum}`;
    const ticketId = `tkt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}-1`,
      sender: 'user',
      senderName: currentUser.name,
      content: initialMessage,
      timestamp,
      imageUrl: screenshotUrl,
    };

    let botResponse = '';
    if (type === 'bug_report') {
      botResponse = `👋 Terima kasih atas laporan Anda! Tiket laporan bug **${ticketNumber}** (${category}) telah diteruskan secara otomatis ke **Channel Discord Bug Developer**. Tim kami akan segera menganalisis dan memperbaikinya.`;
    } else if (type === 'owner_chat') {
      botResponse = `👑 Pesan prioritas Anda **${ticketNumber}** telah diteruskan langsung ke **Channel Discord Owner Carlos69**. Owner akan merespons sesegera mungkin.`;
    } else {
      botResponse = `🤖 Pesan Anda **${ticketNumber}** telah diterima oleh Carlos Support Bot. Ada yang ingin Anda diskusikan lebih lanjut?`;
    }

    const botMsg: SupportMessage = {
      id: `msg-${Date.now()}-2`,
      sender: 'bot',
      senderName: 'Carlos Support Bot',
      content: botResponse,
      timestamp,
    };

    const newTicket: SupportTicket = {
      id: ticketId,
      ticketNumber,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      type,
      category,
      title: title || `${category} - ${currentUser.name}`,
      status: 'open',
      screenshotUrl,
      messages: [userMsg, botMsg],
      createdAt: timestamp,
      updatedAt: timestamp,
      lastReplyBy: 'bot',
    };

    const nextTickets = [newTicket, ...supportTickets];
    setSupportTickets(nextTickets);
    syncToServer({ supportTickets: nextTickets });

    // FORWARD KE DISCORD WEBHOOK BERDASARKAN KATEGORI/CHANNEL
    let targetWebhook = '';
    let embedColor = 0x3b82f6; // Blue default
    let embedTitle = '';
    let authorTag = 'Carlos69 Support';

    if (type === 'bug_report') {
      targetWebhook = settings.discordWebhookBug || settings.discordWebhookGeneral || '';
      embedColor = 0xef4444; // Red
      embedTitle = `🐛 [LAPORAN BUG BARU] ${ticketNumber}`;
      authorTag = 'Bug Report Center';
    } else if (type === 'owner_chat') {
      targetWebhook = settings.discordWebhookOwner || settings.discordWebhookGeneral || '';
      embedColor = 0xf59e0b; // Gold
      embedTitle = `👑 [PESAN OWNER / CS KHUSUS] ${ticketNumber}`;
      authorTag = 'Owner Direct Channel';
    } else {
      targetWebhook = settings.discordWebhookGeneral || '';
      embedColor = 0x3b82f6; // Blue
      embedTitle = `💬 [PERTANYAAN SUPPORT] ${ticketNumber}`;
      authorTag = 'General Support Channel';
    }

    if (targetWebhook) {
      sendDiscordWebhook({
        webhookUrl: targetWebhook,
        title: embedTitle,
        description: `**Kategori:** ${category}\n**Subjek:** ${title || '-'}\n\n**Pesan User:**\n${initialMessage}`,
        color: embedColor,
        fields: [
          { name: '👤 Pengirim', value: `${currentUser.name} (\`${currentUser.email}\`)`, inline: true },
          { name: '📱 No DANA/HP', value: currentUser.danaNumber || currentUser.phone || 'Belum diisi', inline: true },
          { name: '🎫 Nomor Tiket', value: ticketNumber, inline: true },
          { name: '🕒 Waktu', value: timestamp, inline: false },
        ],
        imageUrl: screenshotUrl,
        authorName: authorTag,
        footerText: `Carlos69 Support System • Tiket ${ticketNumber}`,
      });
    }

    addToast(
      'Tiket Dibuat',
      `Tiket ${ticketNumber} berhasil dibuat dan diteruskan ke sistem Discord kami.`,
      'success'
    );

    return {
      success: true,
      ticket: newTicket,
      message: 'Tiket berhasil dikirim ke Carlos Support & Discord!',
    };
  };

  const sendTicketUserMessage = async (
    ticketId: string,
    content: string,
    imageUrl?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Silakan login terlebih dahulu.' };
    }
    if (!content.trim()) {
      return { success: false, message: 'Pesan tidak boleh kosong.' };
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const userMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name,
      content: content.trim(),
      timestamp,
      imageUrl,
    };

    let targetTicket: SupportTicket | undefined;

    const nextTickets = supportTickets.map((t) => {
      if (t.id === ticketId) {
        targetTicket = {
          ...t,
          messages: [...t.messages, userMsg],
          updatedAt: timestamp,
          lastReplyBy: 'user' as const,
        };
        return targetTicket;
      }
      return t;
    });

    setSupportTickets(nextTickets);
    syncToServer({ supportTickets: nextTickets });

    // Forward new message to Discord Webhook
    if (targetTicket) {
      let targetWebhook = '';
      if (targetTicket.type === 'bug_report') {
        targetWebhook = settings.discordWebhookBug || settings.discordWebhookGeneral || '';
      } else if (targetTicket.type === 'owner_chat') {
        targetWebhook = settings.discordWebhookOwner || settings.discordWebhookGeneral || '';
      } else {
        targetWebhook = settings.discordWebhookGeneral || '';
      }

      if (targetWebhook) {
        sendDiscordWebhook({
          webhookUrl: targetWebhook,
          title: `💬 [BALASAN USER] Tiket ${targetTicket.ticketNumber}`,
          description: `**Pengirim:** ${currentUser.name}\n\n**Pesan:**\n${content.trim()}`,
          color: 0x3b82f6,
          fields: [
            { name: '🎫 Nomor Tiket', value: targetTicket.ticketNumber, inline: true },
            { name: '📌 Kategori', value: targetTicket.category, inline: true },
            { name: '⏰ Waktu', value: timestamp, inline: false },
          ],
          imageUrl,
          authorName: 'Carlos69 Support Chat',
          footerText: `Carlos69 Support Chat • Tiket ${targetTicket.ticketNumber}`,
        });
      }
    }

    return { success: true, message: 'Pesan berhasil dikirim!' };
  };

  const adminReplySupportTicket = (
    ticketId: string,
    content: string
  ): { success: boolean; message: string } => {
    if (!content.trim()) {
      return { success: false, message: 'Pesan balasan tidak boleh kosong.' };
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const adminMsg: SupportMessage = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      senderName: 'Admin Carlos69',
      content: content.trim(),
      timestamp,
    };

    let targetUserId = '';
    let targetTicketNumber = '';

    const nextTickets = supportTickets.map((t) => {
      if (t.id === ticketId) {
        targetUserId = t.userId;
        targetTicketNumber = t.ticketNumber;
        return {
          ...t,
          status: 'in_progress' as const,
          messages: [...t.messages, adminMsg],
          updatedAt: timestamp,
          lastReplyBy: 'admin' as const,
        };
      }
      return t;
    });

    setSupportTickets(nextTickets);
    syncToServer({ supportTickets: nextTickets });

    if (targetUserId) {
      createNotification(
        targetUserId,
        `Balasan dari Admin (${targetTicketNumber})`,
        `Admin Carlos69 telah membalas tiket ${targetTicketNumber}: "${content.length > 50 ? content.slice(0, 50) + '...' : content}"`,
        'info'
      );
    }

    logActivity('approve', `Admin membalas tiket ${targetTicketNumber}`);
    addToast('Balasan Terkirim', `Balasan telah dikirim ke user untuk tiket ${targetTicketNumber}.`, 'success');
    return { success: true, message: 'Balasan berhasil dikirim!' };
  };

  const adminUpdateTicketStatus = (
    ticketId: string,
    status: 'open' | 'in_progress' | 'resolved' | 'closed'
  ): { success: boolean; message: string } => {
    const timestamp = new Date().toLocaleString('id-ID');
    const nextTickets = supportTickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status, updatedAt: timestamp };
      }
      return t;
    });
    setSupportTickets(nextTickets);
    syncToServer({ supportTickets: nextTickets });
    addToast('Status Diperbarui', `Status tiket berhasil diubah menjadi ${status.toUpperCase()}.`, 'info');
    return { success: true, message: `Status tiket diubah menjadi ${status}.` };
  };

  // Admin Operations: Stock Management
  const adminAddEmailStock = (rawEmails: string): { success: boolean; count: number; message: string } => {
    const lines = rawEmails.split(/\r?\n/).map((l) => l.trim().toLowerCase()).filter((l) => l.includes('@'));
    if (lines.length === 0) {
      return { success: false, count: 0, message: 'Tidak ada email valid yang ditemukan.' };
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const newItems: AdminEmailStock[] = lines.map((email) => ({
      id: 'stk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      email,
      isUsed: false,
      createdAt: timestamp,
    }));

    const nextStocks = [...newItems, ...adminEmailStocks];
    setAdminEmailStocks(nextStocks);
    syncToServer({ adminEmailStocks: nextStocks });

    logActivity('stock_add', `Admin menambah ${newItems.length} stok email untuk generate user`);
    addToast('Stok Email Ditambahkan', `Berhasil menambahkan ${newItems.length} email ke pool stok generate user.`, 'success');
    return { success: true, count: newItems.length, message: `Berhasil menambah ${newItems.length} stok email!` };
  };

  const adminDeleteEmailStock = (id: string) => {
    const nextStocks = adminEmailStocks.filter((s) => s.id !== id);
    setAdminEmailStocks(nextStocks);
    syncToServer({ adminEmailStocks: nextStocks });
    addToast('Stok Dihapus', 'Item stok berhasil dihapus dari pool.', 'info');
  };

  const adminClearUnusedStock = () => {
    const nextStocks = adminEmailStocks.filter((s) => s.isUsed);
    setAdminEmailStocks(nextStocks);
    syncToServer({ adminEmailStocks: nextStocks });
    addToast('Stok Dibersihkan', 'Seluruh stok email yang belum terpakai telah dibersihkan.', 'info');
  };

  // Admin Batch Actions
  const adminApproveBatch = (batchId: string) => {
    const sub = submissions.find((s) => s.id === batchId);
    if (!sub || sub.status !== 'pending') return;

    const timestamp = new Date().toLocaleString('id-ID');
    const nextSubmissions = submissions.map((s) =>
      s.id === batchId ? { ...s, status: 'approved' as const, processedAt: timestamp } : s
    );
    setSubmissions(nextSubmissions);

    const subAccountIds = sub.accounts.map((a) => a.id);
    const nextAccounts = allGmailAccounts.map((a) =>
      subAccountIds.includes(a.id) ? { ...a, status: 'accepted' as const, verifikasiDate: timestamp } : a
    );
    setAllGmailAccounts(nextAccounts);

    const nextUsers = allUsers.map((u) => {
      if (u.id === sub.userId) {
        const newSaldo = u.saldo + sub.totalAmount;
        const newAccepted = (u.acceptedCount || 0) + sub.totalCount;
        const newPending = Math.max(0, (u.pendingCount || 0) - sub.totalCount);
        const totalValid = newAccepted + (u.rejectedCount || 0);
        const newScore = totalValid > 0 ? Math.round((newAccepted / totalValid) * 100) : 100;
        return {
          ...u,
          saldo: newSaldo,
          acceptedCount: newAccepted,
          pendingCount: newPending,
          qualityScore: newScore,
          trustBadge: `${newScore}% • ${newScore >= 95 ? 'Elite Seller' : newScore >= 80 ? 'Good Seller' : 'Seller'}`,
        };
      }
      return u;
    });
    setAllUsers(nextUsers);

    if (currentUser && currentUser.id === sub.userId) {
      const u = nextUsers.find((x) => x.id === sub.userId);
      if (u) setCurrentUser(u);
    }

    syncToServer({
      submissions: nextSubmissions,
      allGmailAccounts: nextAccounts,
      allUsers: nextUsers,
    });

    createNotification(
      sub.userId,
      'Setoran Diterima! (+Rp ' + sub.totalAmount.toLocaleString('id-ID') + ')',
      `Batch setoran ${sub.batchId} (${sub.totalCount} akun) telah di-ACC oleh Admin. Saldo telah ditambahkan ke akun Anda.`,
      'success'
    );

    logActivity('approve', `Admin menyetujui batch ${sub.batchId} (+Rp ${sub.totalAmount.toLocaleString('id-ID')})`, sub.userId);
    addToast('Batch Di-ACC', `Batch ${sub.batchId} (${sub.totalCount} akun) berhasil disetujui!`, 'success');
  };

  const adminRejectBatch = (batchId: string, reason: string) => {
    const sub = submissions.find((s) => s.id === batchId);
    if (!sub || sub.status !== 'pending') return;

    const timestamp = new Date().toLocaleString('id-ID');
    const nextSubmissions = submissions.map((s) =>
      s.id === batchId ? { ...s, status: 'rejected' as const, rejectReason: reason, processedAt: timestamp } : s
    );
    setSubmissions(nextSubmissions);

    const subAccountIds = sub.accounts.map((a) => a.id);
    const nextAccounts = allGmailAccounts.map((a) =>
      subAccountIds.includes(a.id) ? { ...a, status: 'rejected' as const, rejectReason: reason, verifikasiDate: timestamp } : a
    );
    setAllGmailAccounts(nextAccounts);

    const nextUsers = allUsers.map((u) => {
      if (u.id === sub.userId) {
        const newRejected = (u.rejectedCount || 0) + sub.totalCount;
        const newPending = Math.max(0, (u.pendingCount || 0) - sub.totalCount);
        const totalValid = (u.acceptedCount || 0) + newRejected;
        const newScore = totalValid > 0 ? Math.round(((u.acceptedCount || 0) / totalValid) * 100) : 0;
        const isBlocked = newScore === 0 && totalValid >= 5;
        return {
          ...u,
          rejectedCount: newRejected,
          pendingCount: newPending,
          qualityScore: newScore,
          status: isBlocked ? 'blocked' as const : u.status,
          trustBadge: isBlocked ? '0% • BANNED' : `${newScore}% • Seller`,
        };
      }
      return u;
    });
    setAllUsers(nextUsers);

    if (currentUser && currentUser.id === sub.userId) {
      const u = nextUsers.find((x) => x.id === sub.userId);
      if (u) setCurrentUser(u);
    }

    syncToServer({
      submissions: nextSubmissions,
      allGmailAccounts: nextAccounts,
      allUsers: nextUsers,
    });

    createNotification(
      sub.userId,
      'Setoran Ditolak',
      `Batch setoran ${sub.batchId} (${sub.totalCount} akun) ditolak oleh Admin. Alasan: ${reason}`,
      'error'
    );

    logActivity('reject', `Admin menolak batch ${sub.batchId}. Alasan: ${reason}`, sub.userId);
    addToast('Batch Ditolak', `Batch ${sub.batchId} ditolak. Alasan: ${reason}`, 'error');
  };

  const adminApproveAllPending = () => {
    const pendingSubs = submissions.filter((s) => s.status === 'pending');
    if (pendingSubs.length === 0) {
      addToast('Tidak Ada Pending', 'Tidak ada setoran yang menunggu verifikasi saat ini.', 'info');
      return;
    }

    pendingSubs.forEach((sub) => {
      adminApproveBatch(sub.id);
    });

    addToast('ACC Semua Akun Selesai', `Seluruh ${pendingSubs.length} batch setoran berhasil di-ACC!`, 'success');
  };

  // ⚡ COMMIT STAGED SETORAN: Terapkan keputusan verifikasi ke user & cairkan saldo
  const adminCommitStagedSetoran = async (
    stagedDecisions: Record<string, { status: 'accepted' | 'rejected' | 'bug_robot'; reason?: string }>,
    mode: 'instant' | 'delay' = 'instant',
    delaySec: number = 5
  ): Promise<AutoCheckResult> => {
    const stagedKeys = Object.keys(stagedDecisions);
    if (stagedKeys.length === 0) {
      return adminUpdateAllSetoran(mode, delaySec);
    }

    if (mode === 'delay' && delaySec > 0) {
      await new Promise((resolve) => setTimeout(resolve, delaySec * 1000));
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const result: AutoCheckResult = {
      totalProcessed: stagedKeys.length,
      totalApproved: 0,
      totalRejected: 0,
      totalBugRobot: 0,
      totalSaldoAdded: 0,
      mode,
      delaySeconds: delaySec,
      details: [],
    };

    const userCredits: Record<string, { acceptedCount: number; rejectedCount: number; bugRobotCount: number; amount: number; userName: string }> = {};
    const updatedAccountsMap: Record<string, GmailAccountItem> = {};

    const updatedSubmissions = submissions.map((sub) => {
      let hasChangeInSub = false;
      const newAccounts = sub.accounts.map((acc) => {
        if (!stagedDecisions[acc.id]) return acc;
        hasChangeInSub = true;

        const decision = stagedDecisions[acc.id];
        const subUserId = sub.userId;
        if (!userCredits[subUserId]) {
          userCredits[subUserId] = { acceptedCount: 0, rejectedCount: 0, bugRobotCount: 0, amount: 0, userName: sub.userName };
        }

        if (decision.status === 'accepted') {
          result.totalApproved += 1;
          const rate = acc.price || settings.ratePerAkun || 4500;
          result.totalSaldoAdded += rate;
          userCredits[subUserId].acceptedCount += 1;
          userCredits[subUserId].amount += rate;

          const updatedAcc: GmailAccountItem = {
            ...acc,
            status: 'accepted',
            verifikasiDate: timestamp,
            price: rate,
          };
          updatedAccountsMap[acc.id] = updatedAcc;
          result.details.push({
            email: acc.email,
            userName: sub.userName,
            userId: subUserId,
            status: 'accepted',
            amountAdded: rate,
          });
          return updatedAcc;
        } else if (decision.status === 'bug_robot') {
          result.totalBugRobot = (result.totalBugRobot || 0) + 1;
          userCredits[subUserId].bugRobotCount += 1;
          const reason = decision.reason || 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin';

          const updatedAcc: GmailAccountItem = {
            ...acc,
            status: 'bug_robot',
            rejectReason: reason,
            verifikasiDate: timestamp,
          };
          updatedAccountsMap[acc.id] = updatedAcc;
          result.details.push({
            email: acc.email,
            userName: sub.userName,
            userId: subUserId,
            status: 'bug_robot',
            reason,
            amountAdded: 0,
          });
          return updatedAcc;
        } else {
          result.totalRejected += 1;
          userCredits[subUserId].rejectedCount += 1;
          const reason = decision.reason || 'Email sudah terdaftar di platform lain / password salah';

          const updatedAcc: GmailAccountItem = {
            ...acc,
            status: 'rejected',
            rejectReason: reason,
            verifikasiDate: timestamp,
          };
          updatedAccountsMap[acc.id] = updatedAcc;
          result.details.push({
            email: acc.email,
            userName: sub.userName,
            userId: subUserId,
            status: 'rejected',
            reason,
            amountAdded: 0,
          });
          return updatedAcc;
        }
      });

      if (!hasChangeInSub) return sub;

      const totalAccCount = newAccounts.length;
      const acceptedCount = newAccounts.filter((a) => a.status === 'accepted').length;
      const rejectedCount = newAccounts.filter((a) => a.status === 'rejected' || a.status === 'bug_robot').length;
      const pendingCount = newAccounts.filter((a) => a.status === 'pending').length;

      let subStatus = sub.status;
      let rejectReason = sub.rejectReason;

      if (pendingCount === 0) {
        if (acceptedCount === totalAccCount) {
          subStatus = 'approved';
        } else if (rejectedCount === totalAccCount) {
          subStatus = 'rejected';
          rejectReason = 'Semua akun ditolak / terkena bug robot';
        } else if (acceptedCount > 0) {
          subStatus = 'partially_approved';
        }
      } else if (acceptedCount > 0 || rejectedCount > 0) {
        subStatus = 'partially_approved';
      }

      return {
        ...sub,
        status: subStatus,
        accounts: newAccounts,
        rejectReason,
        processedAt: timestamp,
        totalAmount: acceptedCount * (settings.ratePerAkun || 4500),
      };
    });

    setSubmissions(updatedSubmissions);

    const updatedAllAccounts = allGmailAccounts.map((acc) =>
      updatedAccountsMap[acc.id] ? updatedAccountsMap[acc.id] : acc
    );
    setAllGmailAccounts(updatedAllAccounts);

    const updatedUsers = allUsers.map((u) => {
      const cred = userCredits[u.id];
      if (!cred) return u;

      const newSaldo = u.saldo + cred.amount;
      const newAccepted = (u.acceptedCount || 0) + cred.acceptedCount;
      const newRejected = (u.rejectedCount || 0) + cred.rejectedCount + cred.bugRobotCount;
      const newPending = Math.max(0, (u.pendingCount || 0) - (cred.acceptedCount + cred.rejectedCount + cred.bugRobotCount));
      const totalValid = newAccepted + newRejected;
      const newScore = totalValid > 0 ? Math.round((newAccepted / totalValid) * 100) : 100;
      const isBlocked = newScore === 0 && totalValid >= 5;

      return {
        ...u,
        saldo: newSaldo,
        acceptedCount: newAccepted,
        rejectedCount: newRejected,
        pendingCount: newPending,
        qualityScore: newScore,
        status: isBlocked ? ('blocked' as const) : u.status,
        trustBadge: isBlocked ? '0% • BANNED' : `${newScore}% • ${newScore >= 95 ? 'Elite Seller' : newScore >= 80 ? 'Good Seller' : 'Seller'}`,
      };
    });
    setAllUsers(updatedUsers);

    if (currentUser && userCredits[currentUser.id]) {
      const u = updatedUsers.find((x) => x.id === currentUser.id);
      if (u) setCurrentUser(u);
    }

    // Sync to backend API so all connected devices update immediately
    syncToServer({
      submissions: updatedSubmissions,
      allGmailAccounts: updatedAllAccounts,
      allUsers: updatedUsers,
    });

    // Send notifications to affected users
    Object.entries(userCredits).forEach(([userId, cred]) => {
      if (cred.acceptedCount > 0) {
        createNotification(
          userId,
          `Setoran Di-ACC! (+Rp ${cred.amount.toLocaleString('id-ID')})`,
          `Sebanyak ${cred.acceptedCount} akun Gmail Anda telah disetujui Admin dan saldo Rp ${cred.amount.toLocaleString('id-ID')} telah ditambahkan ke akun Anda.`,
          'success'
        );
      }
      if (cred.rejectedCount > 0) {
        createNotification(
          userId,
          `Setoran Ditolak (${cred.rejectedCount} Akun)`,
          `Sebanyak ${cred.rejectedCount} akun Gmail yang Anda setor telah ditolak oleh Admin.`,
          'error'
        );
      }
      if (cred.bugRobotCount > 0) {
        createNotification(
          userId,
          `Akun Terdeteksi Bug Robot (${cred.bugRobotCount} Akun)`,
          `Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin.`,
          'warning'
        );
      }
    });

    logActivity(
      'approve',
      `Admin menerapkan Update All (${result.totalApproved} Disetujui, ${result.totalRejected} Ditolak, ${result.totalBugRobot || 0} Bug Robot, Saldo +Rp ${result.totalSaldoAdded.toLocaleString('id-ID')}) [Mode: ${mode.toUpperCase()}]`
    );

    addToast(
      'Update All Berhasil Diterapkan!',
      `${result.totalApproved} Akun Disetujui (+Rp ${result.totalSaldoAdded.toLocaleString('id-ID')}), ${result.totalRejected} Ditolak. Saldo resmi masuk ke akun user!`,
      result.totalApproved > 0 ? 'success' : 'info'
    );

    return result;
  };

  // ⚡ AUTO-CHECK UPDATE ALL (Auto verifikasi kesesuaian stok generate)
  const adminUpdateAllSetoran = async (
    mode: 'instant' | 'delay' = 'instant',
    delaySec: number = 5
  ): Promise<AutoCheckResult> => {
    if (mode === 'delay' && delaySec > 0) {
      await new Promise((resolve) => setTimeout(resolve, delaySec * 1000));
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const pendingSubs = submissions.filter((s) => s.status === 'pending');

    const result: AutoCheckResult = {
      totalProcessed: 0,
      totalApproved: 0,
      totalRejected: 0,
      totalSaldoAdded: 0,
      mode,
      delaySeconds: delaySec,
      details: [],
    };

    if (pendingSubs.length === 0 && allGmailAccounts.filter((a) => a.status === 'pending').length === 0) {
      addToast('Update All Selesai', 'Tidak ada akun atau setoran pending yang perlu diverifikasi.', 'info');
      return result;
    }

    const userCredits: Record<string, { acceptedCount: number; rejectedCount: number; amount: number; userName: string }> = {};
    const mandatoryPass = (settings.mandatoryPassword || 'sgsg1122').toLowerCase();

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.status !== 'pending') return sub;

      const subUserId = sub.userId;
      if (!userCredits[subUserId]) {
        userCredits[subUserId] = { acceptedCount: 0, rejectedCount: 0, amount: 0, userName: sub.userName };
      }

      const verifiedAccounts = sub.accounts.map((acc) => {
        if (acc.status !== 'pending') return acc;
        result.totalProcessed += 1;

        const isPassValid = !acc.password || acc.password.toLowerCase() === mandatoryPass;

        if (isPassValid) {
          result.totalApproved += 1;
          const rate = acc.price || settings.ratePerAkun || 4500;
          result.totalSaldoAdded += rate;
          userCredits[subUserId].acceptedCount += 1;
          userCredits[subUserId].amount += rate;

          result.details.push({
            email: acc.email,
            userName: sub.userName,
            userId: subUserId,
            status: 'accepted',
            amountAdded: rate,
          });

          return {
            ...acc,
            status: 'accepted' as const,
            verifikasiDate: timestamp,
            price: rate,
          };
        } else {
          result.totalRejected += 1;
          userCredits[subUserId].rejectedCount += 1;
          const reason = `Password tidak sesuai password wajib (${mandatoryPass})`;

          result.details.push({
            email: acc.email,
            userName: sub.userName,
            userId: subUserId,
            status: 'rejected',
            reason,
            amountAdded: 0,
          });

          return {
            ...acc,
            status: 'rejected' as const,
            rejectReason: reason,
            verifikasiDate: timestamp,
          };
        }
      });

      const totalAccCount = verifiedAccounts.length;
      const acceptedCount = verifiedAccounts.filter((a) => a.status === 'accepted').length;
      const rejectedCount = verifiedAccounts.filter((a) => a.status === 'rejected').length;

      let subStatus: GmailSubmission['status'] = 'approved';
      let rejectReason: string | undefined = undefined;

      if (acceptedCount === totalAccCount) {
        subStatus = 'approved';
      } else if (rejectedCount === totalAccCount) {
        subStatus = 'rejected';
        rejectReason = 'Semua akun ditolak karena password tidak valid';
      } else {
        subStatus = 'partially_approved';
      }

      return {
        ...sub,
        status: subStatus,
        accounts: verifiedAccounts,
        rejectReason,
        processedAt: timestamp,
        totalAmount: acceptedCount * (settings.ratePerAkun || 4500),
      };
    });

    setSubmissions(updatedSubmissions);

    const accountsMap = new Map<string, GmailAccountItem>();
    updatedSubmissions.forEach((s) => {
      s.accounts.forEach((a) => accountsMap.set(a.id, a));
    });

    const updatedAllAccounts = allGmailAccounts.map((a) => accountsMap.get(a.id) || a);
    setAllGmailAccounts(updatedAllAccounts);

    const updatedUsers = allUsers.map((u) => {
      const cred = userCredits[u.id];
      if (!cred) return u;

      const newSaldo = u.saldo + cred.amount;
      const newAccepted = (u.acceptedCount || 0) + cred.acceptedCount;
      const newRejected = (u.rejectedCount || 0) + cred.rejectedCount;
      const newPending = Math.max(0, (u.pendingCount || 0) - (cred.acceptedCount + cred.rejectedCount));
      const totalValid = newAccepted + newRejected;
      const newScore = totalValid > 0 ? Math.round((newAccepted / totalValid) * 100) : 100;
      const isBlocked = newScore === 0 && totalValid >= 5;

      return {
        ...u,
        saldo: newSaldo,
        acceptedCount: newAccepted,
        rejectedCount: newRejected,
        pendingCount: newPending,
        qualityScore: newScore,
        status: isBlocked ? ('blocked' as const) : u.status,
        trustBadge: isBlocked ? '0% • BANNED' : `${newScore}% • ${newScore >= 95 ? 'Elite Seller' : newScore >= 80 ? 'Good Seller' : 'Seller'}`,
      };
    });
    setAllUsers(updatedUsers);

    if (currentUser && userCredits[currentUser.id]) {
      const u = updatedUsers.find((x) => x.id === currentUser.id);
      if (u) setCurrentUser(u);
    }

    syncToServer({
      submissions: updatedSubmissions,
      allGmailAccounts: updatedAllAccounts,
      allUsers: updatedUsers,
    });

    addToast(
      'Update All Auto-Verifikasi Selesai',
      `${result.totalApproved} Akun Disetujui (+Rp ${result.totalSaldoAdded.toLocaleString('id-ID')}), ${result.totalRejected} Ditolak. Saldo masuk ke user!`,
      'success'
    );

    return result;
  };

  const adminAddAllPendingSaldo = async (mode: 'instant' | 'delay' = 'instant', delaySec: number = 5) => {
    const checkRes = await adminUpdateAllSetoran(mode, delaySec);
    return {
      totalUsers: Object.keys(checkRes.details.reduce((acc, curr) => ({ ...acc, [curr.userId]: true }), {})).length,
      totalSaldo: checkRes.totalSaldoAdded,
      totalAccounts: checkRes.totalApproved,
    };
  };

  const adminApproveSingleAccount = (accountId: string) => {
    const acc = allGmailAccounts.find((a) => a.id === accountId);
    if (!acc) return;

    const timestamp = new Date().toLocaleString('id-ID');
    const nextAccounts = allGmailAccounts.map((a) =>
      a.id === accountId ? { ...a, status: 'accepted' as const, verifikasiDate: timestamp } : a
    );
    setAllGmailAccounts(nextAccounts);

    if (acc.userId) {
      const nextUsers = allUsers.map((u) =>
        u.id === acc.userId ? { ...u, saldo: u.saldo + acc.price, acceptedCount: (u.acceptedCount || 0) + 1 } : u
      );
      setAllUsers(nextUsers);
      if (currentUser && currentUser.id === acc.userId) {
        const u = nextUsers.find((x) => x.id === acc.userId);
        if (u) setCurrentUser(u);
      }
      syncToServer({ allGmailAccounts: nextAccounts, allUsers: nextUsers });
    }
    addToast('Akun Diterima', `Akun ${acc.email} berhasil disetujui!`, 'success');
  };

  const adminRejectSingleAccount = (accountId: string, reason: string) => {
    const acc = allGmailAccounts.find((a) => a.id === accountId);
    if (!acc) return;

    const timestamp = new Date().toLocaleString('id-ID');
    const nextAccounts = allGmailAccounts.map((a) =>
      a.id === accountId ? { ...a, status: 'rejected' as const, rejectReason: reason, verifikasiDate: timestamp } : a
    );
    setAllGmailAccounts(nextAccounts);
    syncToServer({ allGmailAccounts: nextAccounts });

    addToast('Akun Ditolak', `Akun ${acc.email} ditolak dengan alasan: ${reason}`, 'error');
  };

  const adminMarkBugRobot = (accountId: string, reason = 'Akun ini bermasalah karena terdeteksi robot, silakan hubungi admin') => {
    const acc = allGmailAccounts.find((a) => a.id === accountId);
    if (!acc) return;

    const timestamp = new Date().toLocaleString('id-ID');
    const nextAccounts = allGmailAccounts.map((a) =>
      a.id === accountId ? { ...a, status: 'bug_robot' as const, rejectReason: reason, verifikasiDate: timestamp } : a
    );
    setAllGmailAccounts(nextAccounts);

    if (acc.userId) {
      createNotification(
        acc.userId,
        'Akun Terdeteksi Bug Robot',
        `Akun ${acc.email} ditandai Bug Robot. ${reason}`,
        'warning'
      );
    }

    syncToServer({ allGmailAccounts: nextAccounts });
    addToast('Bug Robot Ditandai', `Akun ${acc.email} berhasil ditandai sebagai BUG ROBOT.`, 'warning');
  };

  const adminBlockUser = (userId: string, reason: string) => {
    const nextUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, status: 'blocked' as const, blockedReason: reason, qualityScore: 0, trustBadge: '0% • BANNED' } : u
    );
    setAllUsers(nextUsers);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, status: 'blocked', blockedReason: reason, qualityScore: 0, trustBadge: '0% • BANNED' });
    }
    syncToServer({ allUsers: nextUsers });
    logActivity('manual_block', `Admin memblokir user ${userId}. Alasan: ${reason}`, userId);
    addToast('User Diblokir', `User ID ${userId} berhasil diblokir.`, 'warning');
  };

  const adminUnblockUser = (userId: string) => {
    const nextUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, status: 'active' as const, qualityScore: 80, trustBadge: '80% • Trusted Seller' } : u
    );
    setAllUsers(nextUsers);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, status: 'active', qualityScore: 80, trustBadge: '80% • Trusted Seller' });
    }
    syncToServer({ allUsers: nextUsers });
    addToast('User Diaktifkan', `User ID ${userId} telah diaktifkan kembali.`, 'success');
  };

  const adminProcessWithdrawal = (withdrawalId: string, status: 'success' | 'rejected', reason?: string) => {
    const wd = withdrawals.find((w) => w.id === withdrawalId);
    if (!wd) return;

    const completedAt = new Date().toLocaleString('id-ID');

    if (status === 'success') {
      const refNum = 'DANA-TRF-' + Math.floor(10000000 + Math.random() * 90000000);
      const nextWds = withdrawals.map((w) =>
        w.id === withdrawalId ? { ...w, status: 'success' as const, completedAt, providerInfo: `Sukses kirim ke ${w.accountNumber} (Ref: ${refNum})` } : w
      );
      setWithdrawals(nextWds);
      syncToServer({ withdrawals: nextWds });

      createNotification(
        wd.userId,
        'Penarikan DANA Sukses! (Rp ' + wd.amount.toLocaleString('id-ID') + ')',
        `Dana Rp ${wd.amount.toLocaleString('id-ID')} telah sukses dikirimkan ke nomor DANA ${wd.accountNumber} (a/n ${wd.accountName}).`,
        'success'
      );

      addToast('Penarikan Berhasil Disetujui', `Dana Rp ${wd.amount.toLocaleString('id-ID')} sukses terkirim ke ${wd.accountNumber}`, 'success');
    } else {
      const nextWds = withdrawals.map((w) =>
        w.id === withdrawalId ? { ...w, status: 'rejected' as const, rejectReason: reason || 'Ditolak oleh admin', completedAt } : w
      );
      setWithdrawals(nextWds);

      const nextUsers = allUsers.map((u) => (u.id === wd.userId ? { ...u, saldo: u.saldo + wd.amount } : u));
      setAllUsers(nextUsers);

      if (currentUser && currentUser.id === wd.userId) {
        setCurrentUser({ ...currentUser, saldo: currentUser.saldo + wd.amount });
      }

      syncToServer({ withdrawals: nextWds, allUsers: nextUsers });

      createNotification(
        wd.userId,
        'Penarikan DANA Ditolak (Saldo Dikembalikan)',
        `Penarikan Rp ${wd.amount.toLocaleString('id-ID')} ke ${wd.accountNumber} ditolak. Alasan: ${reason || 'Data tidak sesuai'}. Saldo telah dikembalikan.`,
        'error'
      );

      addToast('Penarikan Ditolak', `Penarikan DANA ditolak. Saldo Rp ${wd.amount.toLocaleString('id-ID')} dikembalikan ke akun user.`, 'error');
    }
  };

  const adminUpdateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      syncToServer({ settings: updated });
      return updated;
    });
    logActivity('settings_update', 'Admin memperbarui pengaturan dashboard & rate');
    addToast('Pengaturan Disimpan', 'Pengaturan berhasil diperbarui secara real-time!', 'success');
  };

  const adminToggleStorOpen = (isOpen?: boolean) => {
    const nextStatus = isOpen !== undefined ? isOpen : !settings.isStorOpen;
    const updated = {
      ...settings,
      isStorOpen: nextStatus,
      storStatusMessage: nextStatus
        ? 'Storan DIBUKA! Silakan kirim akun Gmail Anda.'
        : 'Storan DITUTUP sementara oleh Admin. Mohon tunggu admin membuka kembali!',
    };
    setSettings(updated);
    syncToServer({ settings: updated });
    addToast(
      nextStatus ? 'Setoran DIBUKA 🟢' : 'Setoran DITUTUP 🔴',
      nextStatus ? 'User sekarang dapat menyetor akun Gmail.' : 'Fitur setor akun dinonaktifkan untuk seluruh user.',
      nextStatus ? 'success' : 'warning'
    );
  };

  const adminToggleSupportAi = (enabled?: boolean) => {
    const isCurrentEnabled = settings.isSupportAiEnabled !== false;
    const nextStatus = enabled !== undefined ? enabled : !isCurrentEnabled;
    const updated = {
      ...settings,
      isSupportAiEnabled: nextStatus,
      supportAiStatusMessage: nextStatus
        ? 'Layanan Carlos Support AI aktif 24/7 untuk bantuan dan pelaporan kendala.'
        : 'Layanan Carlos Support AI sedang dinonaktifkan sementara oleh Admin untuk pemeliharaan rutin.',
    };
    setSettings(updated);
    syncToServer({ settings: updated });
    logActivity('settings_update', `Admin mengubah status Carlos Support AI ke ${nextStatus ? 'AKTIF' : 'NONAKTIF'}`);
    addToast(
      nextStatus ? 'Carlos Support AI DIAKTIFKAN 🤖🟢' : 'Carlos Support AI DINONAKTIFKAN 🤖🔴',
      nextStatus ? 'Pengguna kini dapat mengakses AI Chat & Tiket Bantuan.' : 'Akses Carlos Support AI ditutup sementara untuk pengguna.',
      nextStatus ? 'success' : 'warning'
    );
  };

  const adminDeleteUser = (userId: string) => {
    const nextUsers = allUsers.filter((u) => u.id !== userId);
    setAllUsers(nextUsers);
    syncToServer({ allUsers: nextUsers });
    addToast('User Dihapus', `User ${userId} berhasil dihapus dari database.`, 'info');
  };

  const adminResetAllDatabase = () => {
    const resetUsers = allUsers.map((u) => ({
      ...u,
      saldo: 0,
      totalSubmissions: 0,
      acceptedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      qualityScore: u.role === 'admin' ? 100 : 90,
      trustBadge: u.role === 'admin' ? 'Super Administrator' : '90% • Trusted Seller',
    }));

    setAllUsers(resetUsers);
    if (currentUser) {
      const resetCurrent = resetUsers.find((u) => u.id === currentUser.id) || resetUsers[0];
      setCurrentUser(resetCurrent);
    }
    setSubmissions([]);
    setAllGmailAccounts([]);
    setWithdrawals([]);
    setTransactions([]);
    setGeneratedGmails([]);
    setActivityLogs([]);

    syncToServer({
      allUsers: resetUsers,
      submissions: [],
      allGmailAccounts: [],
      withdrawals: [],
      transactions: [],
      generatedGmails: [],
      activityLogs: [],
    });

    localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEY_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEY_WITHDRAWALS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_GENERATED);

    addToast('Database Direset', 'Seluruh setoran, penarikan, dan saldo berhasil direset ke 0!', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        submissions,
        allGmailAccounts,
        withdrawals,
        transactions,
        settings,
        activityLogs,
        generatedGmails,
        notifications,
        announcements,
        adminEmailStocks,
        supportTickets,
        activeTab,
        setActiveTab,
        isAdminMode,
        setIsAdminMode,
        toasts,
        removeToast,
        liveEvent,

        login,
        loginWithGoogle,
        register,
        logout,
        switchUser,
        updateUserProfile,
        saveDanaNumber,
        changePassword,

        submitBulkGmail,
        requestWithdrawal,
        buyGmailPackage,
        generateNewGmails,
        deleteGeneratedGmail,
        clearMyGeneratedGmails,

        createSupportTicket,
        sendTicketUserMessage,
        adminReplySupportTicket,
        adminUpdateTicketStatus,

        adminAddEmailStock,
        adminDeleteEmailStock,
        adminClearUnusedStock,
        adminApproveBatch,
        adminRejectBatch,
        adminApproveSingleAccount,
        adminRejectSingleAccount,
        adminMarkBugRobot,
        adminApproveAllPending,
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

        addToast,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
