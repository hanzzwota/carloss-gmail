export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'user' | 'admin';
  danaNumber: string;
  danaAccountName?: string;
  saldo: number;
  status: 'active' | 'blocked';
  blockedReason?: string;
  qualityScore: number; // Trusted percentage (0-100)
  trustBadge: string;
  phone: string;
  joinedAt: string;
  referralCode: string;
  referredBy?: string;
  passwordChangedAt?: string;
  totalSubmissions: number;
  acceptedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface GmailAccountItem {
  id: string;
  email: string;
  password: string;
  recoveryEmail?: string;
  twoFaBackup?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'bug_robot' | 'blocked' | 'sold';
  rejectReason?: string;
  trusted: number; // 0 - 100%
  price: number;
  userId?: string;
  userName?: string;
  storDate?: string;
  verifikasiDate?: string;
  isSetoran?: boolean;
}

export interface GmailSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  batchId: string;
  accounts: GmailAccountItem[];
  totalCount: number;
  pricePerAccount: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'partially_approved' | 'rejected' | 'bug_robot';
  notes?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
  rejectReason?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: 'DANA'; // Strict DANA only as requested
  accountNumber: string; // Nomor DANA
  accountName: string;
  status: 'pending' | 'success' | 'rejected';
  rejectReason?: string;
  txId: string;
  createdAt: string;
  completedAt?: string;
  providerInfo?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageName: string;
  totalPrice: number;
  quantity: number;
  paymentMethod: 'DANA';
  paymentStatus: 'pending' | 'success' | 'failed';
  transactionDate: string;
  danaNumber: string;
}

export interface PlatformSettings {
  id: string;
  namaDashboard: string;
  linkSaluran: string;
  ratePerAkun: number;
  mandatoryPassword: string;
  infoDashboard: string;
  isStorOpen: boolean;
  storStatusMessage: string;
  syaratKetentuan: string;
  rulesHariIni: string;
  isSupportAiEnabled?: boolean;
  supportAiStatusMessage?: string;
  discordWebhookStock?: string;
  discordWebhookBug?: string;
  discordWebhookGeneral?: string;
  discordWebhookOwner?: string;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'bot' | 'admin' | 'owner';
  senderName: string;
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'ai_faq' | 'bug_report' | 'owner_chat' | 'general';
  category: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  screenshotUrl?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  lastReplyBy?: 'user' | 'admin' | 'bot' | 'owner';
}

export interface ActivityLog {
  id: string;
  accountId?: string;
  userId?: string;
  action: 'auto_block' | 'manual_block' | 'approve' | 'reject' | 'settings_update' | 'withdrawal' | 'stock_add';
  timestamp: string;
  description: string;
}

export interface AdminEmailStock {
  id: string;
  email: string;
  isUsed: boolean;
  usedByUserId?: string;
  usedByUserName?: string;
  usedAt?: string;
  createdAt: string;
}

export interface GeneratedGmail {
  id: string;
  email: string;
  isDeposited: boolean;
  createdAt: string;
  userId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface AutoCheckResult {
  totalProcessed: number;
  totalApproved: number;
  totalRejected: number;
  totalBugRobot?: number;
  totalSaldoAdded: number;
  mode: 'instant' | 'delay';
  delaySeconds?: number;
  details: {
    email: string;
    userName: string;
    userId: string;
    status: 'accepted' | 'rejected' | 'bug_robot';
    reason?: string;
    amountAdded: number;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  dotsColor: string;
  date: string;
}
