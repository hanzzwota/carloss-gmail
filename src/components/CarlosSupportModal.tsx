import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Bug, 
  Crown, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  RefreshCw,
  Trash2,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CarlosSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'menu' | 'ai_faq' | 'bug_report' | 'owner_chat' | 'history';
}

// Helper to remove markdown asterisks (*) for clean presentation
const cleanText = (text: string): string => {
  if (!text) return '';
  return text.replace(/\*/g, '').trim();
};

// BUG PRESET KENDALA
const BUG_CATEGORIES = [
  'Gagal Generate Akun Gmail',
  'Tombol Setor Error / Tidak Merespon',
  'Status Akun / Verifikasi Macet',
  'Masalah Saldo / Penarikan DANA',
  'Tampilan Rusak / Glitch CSS',
  'Kendala Lainnya',
];

// OWNER CHAT TOPICS
const OWNER_TOPICS = [
  'Kendala Akun Khusus / Verifikasi Tertahan',
  'Kerjasama / Supplier Akun Skala Besar',
  'Kendala Pembayaran / Saldo Mendesak',
  'Saran & Masukan untuk Owner',
  'Lainnya',
];

// GUARDRAILS AI FAQ: Anti-Leak Keywords & Responses
const checkIsPrivacyViolation = (input: string): boolean => {
  const q = input.toLowerCase();
  const forbiddenPatterns = [
    'github',
    'git hub',
    'repo',
    'repository',
    'source code',
    'sourcecode',
    'kodingan',
    'pembuat web',
    'siapa developer',
    'nama pembuat',
    'atas nama siapa',
    'pemilik github',
    'api key',
    'apikey',
    'password database',
    'password admin',
    'pass admin',
    'database credentials',
    'token rahasia',
    'backend url',
    'siapa yang bikin web',
    'siapa yang buat',
  ];
  return forbiddenPatterns.some((pattern) => q.includes(pattern));
};

const generateAIResponse = (userPrompt: string, settings: any): string => {
  const q = userPrompt.toLowerCase();

  // 1. PRIVACY & SECURITY GUARDRAIL
  if (checkIsPrivacyViolation(userPrompt)) {
    return 'Informasi Privat & Rahasia:\n\nMaaf, demi menjaga privasi pengembang, keamanan platform, dan integritas sistem kami, informasi mengenai akun GitHub, repositori kode sumber, maupun kredensial internal sistem bersifat rahasia dan TIDAK DAPAT DIBAGIKAN kepada umum.\n\nSilakan ajukan pertanyaan seputar aturan setor, format password, atau tata cara penarikan saldo DANA.';
  }

  // 2. Rules / Password Wajib
  if (q.includes('password') || q.includes('sandi') || q.includes('pass')) {
    return `Password Wajib Penyetoran:\n\nPassword wajib yang harus digunakan saat membuat akun Gmail adalah ${settings.mandatoryPassword || 'sgsg1122'}.\n\nPastikan format saat setor: email@gmail.com|${settings.mandatoryPassword || 'sgsg1122'}. Akun dengan password yang berbeda akan otomatis ditolak oleh sistem verifikasi admin.`;
  }

  // 3. Rate / Harga Beli Akun
  if (q.includes('rate') || q.includes('harga') || q.includes('berapa')) {
    return `Rate Harga Beli Saat Ini:\n\nRate pembelian Gmail adalah Rp ${(settings.ratePerAkun || 4500).toLocaleString('id-ID')} / Akun.\n\nSaldo akan langsung ditambahkan ke akun Anda setelah setoran diverifikasi & di-ACC oleh Admin.`;
  }

  // 4. Cara Stor / Format
  if (q.includes('cara stor') || q.includes('format') || q.includes('setor') || q.includes('kirim email')) {
    return `Tata Cara Menyetor Akun Gmail:\n\n1. Masuk ke menu Stor.\n2. Klik Generate Gmail untuk mengambil daftar alamat email resmi dari stok admin.\n3. Buat akun Gmail sesuai email tersebut dengan password wajib ${settings.mandatoryPassword || 'sgsg1122'}.\n4. Masukkan ke kotak setoran dengan format:\nemail@gmail.com|${settings.mandatoryPassword || 'sgsg1122'}\n5. Klik tombol Kirim Setoran dan tunggu verifikasi admin!`;
  }

  // 5. Penarikan / Withdraw DANA
  if (q.includes('tarik') || q.includes('withdraw') || q.includes('dana') || q.includes('cair')) {
    return `Ketentuan Penarikan Saldo (DANA):\n\n- Minimal penarikan saldo adalah Rp 4.000.\n- Metode pencairan khusus DANA (tanpa potongan biaya admin).\n- Pastikan nomor DANA dan nama pemilik akun telah diisi dengan benar di profil.\n- Proses pencairan diproses cepat oleh admin saat jam operasional.`;
  }

  // 6. Bug Robot
  if (q.includes('robot') || q.includes('bug robot') || q.includes('checkpoint') || q.includes('cp')) {
    return `Status Akun Bug Robot:\n\nStatus 'Bug Robot' diberikan jika akun Gmail yang disetor terdeteksi meminta verifikasi nomor HP (Checkpoint / CP) atau aktivitas otomatis yang dibatasi Google.\n\nJika merasa akun valid, Anda dapat melapor lewat menu Laporkan Bug & Kendala di Carlos Support untuk pengecekan ulang manual oleh tim admin.`;
  }

  // 7. Jam Operasional / Jadwal Buka
  if (q.includes('jam') || q.includes('buka') || q.includes('tutup') || q.includes('jadwal')) {
    return `Jadwal & Status Operasional:\n\nStatus setoran saat ini: ${settings.isStorOpen ? 'SEDANG DIBUKA' : 'SEDANG DITUTUP'}.\n\n${settings.infoDashboard || 'Open Senin - Jumat mulai Jam 07:00 WIB. Pantau saluran WhatsApp resmi Carlos69 untuk info buka/tutup slot setoran harian!'}`;
  }

  // Default AI response
  return `Asisten Carlos Support:\n\nTerima kasih telah bertanya! Saya dapat membantu menjawab seputar:\n- Password Wajib: ${settings.mandatoryPassword || 'sgsg1122'}\n- Rate Pembelian: Rp ${(settings.ratePerAkun || 4500).toLocaleString('id-ID')}/akun\n- Format Setor: email|password\n- Penarikan DANA: Minimal Rp 4.000\n\nJika Anda ingin melaporkan kendala teknis atau berbicara langsung dengan owner, silakan pilih menu Laporkan Bug atau Hubungi Owner.`;
};

export const CarlosSupportModal: React.FC<CarlosSupportModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'menu',
}) => {
  const { 
    currentUser, 
    settings, 
    supportTickets, 
    createSupportTicket, 
    sendTicketUserMessage,
    addToast 
  } = useApp();

  const [currentView, setCurrentView] = useState<'menu' | 'ai_faq' | 'bug_report' | 'owner_chat' | 'history' | 'ticket_detail'>('menu');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // AI Chat Local Messages State
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; text: string; timestamp: string }>>([
    {
      id: 'ai-init-1',
      sender: 'bot',
      text: `Halo ${currentUser ? currentUser.name : 'Sobat'}! Selamat datang di AI Carlos Assistant.\n\nAda yang ingin Anda tanyakan seputar aturan setor, rate harga, password wajib, atau penarikan saldo DANA? Ketik pertanyaan Anda di bawah.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Bug Report Form State
  const [bugCategory, setBugCategory] = useState(BUG_CATEGORIES[0]);
  const [bugDescription, setBugDescription] = useState('');
  const [bugScreenshot, setBugScreenshot] = useState<string>('');
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);

  // Owner Chat Form State
  const [ownerTopic, setOwnerTopic] = useState(OWNER_TOPICS[0]);
  const [ownerMessage, setOwnerMessage] = useState('');
  const [ownerScreenshot, setOwnerScreenshot] = useState<string>('');
  const [isSubmittingOwner, setIsSubmittingOwner] = useState(false);

  // Ticket Detail Reply State
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownerFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialMode);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatMessages, selectedTicketId, supportTickets]);

  if (!isOpen) return null;

  // Filter tickets for this user
  const myTickets = supportTickets.filter((t) => currentUser && t.userId === currentUser.id);
  const activeTicket = supportTickets.find((t) => t.id === selectedTicketId);

  // Check 15-Minute Cooldown logic for reports
  const checkCooldown = (): { isCooldown: boolean; remainingText: string } => {
    const LAST_KEY = `carloss_support_last_ticket_ts_${currentUser?.id || 'guest'}`;
    const lastTsStr = localStorage.getItem(LAST_KEY);
    if (!lastTsStr) return { isCooldown: false, remainingText: '' };

    const lastTs = Number(lastTsStr);
    const now = Date.now();
    const COOLDOWN_MS = 15 * 60 * 1000; // 15 menit
    const elapsed = now - lastTs;

    if (elapsed < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - elapsed;
      const minutes = Math.floor(remainingMs / (60 * 1000));
      const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
      return {
        isCooldown: true,
        remainingText: `${minutes} menit ${seconds} detik`,
      };
    }

    return { isCooldown: false, remainingText: '' };
  };

  const updateCooldownTimestamp = () => {
    const LAST_KEY = `carloss_support_last_ticket_ts_${currentUser?.id || 'guest'}`;
    localStorage.setItem(LAST_KEY, String(Date.now()));
  };

  // Handle AI Chat Submit (ALWAYS usable even if AI is turned off for admin support)
  const handleSendAiMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiInputText.trim()) return;

    const userText = aiInputText.trim();
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'ai-msg-' + Date.now(),
      sender: 'user' as const,
      text: userText,
      timestamp: timeNow,
    };

    setAiChatMessages((prev) => [...prev, newMsg]);
    setAiInputText('');
    setIsAiThinking(true);

    setTimeout(() => {
      const botReply = generateAIResponse(userText, settings);
      setAiChatMessages((prev) => [
        ...prev,
        {
          id: 'ai-bot-' + Date.now(),
          sender: 'bot' as const,
          text: botReply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAiThinking(false);
    }, 400);
  };

  // Handle Screenshot Upload (Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'bug' | 'owner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast('File Terlalu Besar', 'Ukuran gambar maksimal adalah 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (target === 'bug') {
        setBugScreenshot(base64);
      } else {
        setOwnerScreenshot(base64);
      }
      addToast('Screenshot Terlampir', 'Gambar berhasil diunggah.', 'info');
    };
    reader.readAsDataURL(file);
  };

  // Submit Bug Report
  const handleSubmitBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Perhatian', 'Silakan login terlebih dahulu untuk melapor bug.', 'warning');
      return;
    }

    if (settings.isSupportAiEnabled === false) {
      addToast(
        'Pesan Ke Admin Ditutup',
        'Layanan pesan ke Admin & Support sedang dinonaktifkan sementara oleh Admin. Anda tetap dapat bertanya ke AI Assistant.',
        'warning'
      );
      return;
    }

    const cd = checkCooldown();
    if (cd.isCooldown) {
      addToast(
        'Cooldown Laporan (15 Menit)',
        `Mohon tunggu ${cd.remainingText} sebelum mengirim laporan baru untuk mencegah spam.`,
        'warning'
      );
      return;
    }

    if (!bugDescription.trim()) {
      addToast('Peringatan', 'Harap jelaskan kendala yang Anda alami.', 'warning');
      return;
    }

    setIsSubmittingBug(true);
    const res = await createSupportTicket({
      type: 'bug_report',
      category: bugCategory,
      title: `Bug: ${bugCategory}`,
      initialMessage: bugDescription.trim(),
      screenshotUrl: bugScreenshot || undefined,
    });
    setIsSubmittingBug(false);

    if (res?.success && res.ticket) {
      updateCooldownTimestamp();
      setBugDescription('');
      setBugScreenshot('');
      setSelectedTicketId(res.ticket.id);
      setCurrentView('ticket_detail');
    }
  };

  // Submit Owner Chat
  const handleSubmitOwnerChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Perhatian', 'Silakan login terlebih dahulu.', 'warning');
      return;
    }

    if (settings.isSupportAiEnabled === false) {
      addToast(
        'Pesan Ke Admin Ditutup',
        'Layanan pesan ke Admin & Support sedang dinonaktifkan sementara oleh Admin. Anda tetap dapat bertanya ke AI Assistant.',
        'warning'
      );
      return;
    }

    const cd = checkCooldown();
    if (cd.isCooldown) {
      addToast(
        'Cooldown Laporan (15 Menit)',
        `Mohon tunggu ${cd.remainingText} sebelum mengirim pesan baru untuk mencegah spam.`,
        'warning'
      );
      return;
    }

    if (!ownerMessage.trim()) {
      addToast('Peringatan', 'Harap tulis pesan untuk Owner.', 'warning');
      return;
    }

    setIsSubmittingOwner(true);
    const res = await createSupportTicket({
      type: 'owner_chat',
      category: ownerTopic,
      title: `Pesan Owner: ${ownerTopic}`,
      initialMessage: ownerMessage.trim(),
      screenshotUrl: ownerScreenshot || undefined,
    });
    setIsSubmittingOwner(false);

    if (res?.success && res.ticket) {
      updateCooldownTimestamp();
      setOwnerMessage('');
      setOwnerScreenshot('');
      setSelectedTicketId(res.ticket.id);
      setCurrentView('ticket_detail');
    }
  };

  // Reply to ticket
  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText.trim()) return;

    if (settings.isSupportAiEnabled === false) {
      addToast(
        'Pesan Ke Admin Ditutup',
        'Pesan balasan ke Admin & Support sedang dinonaktifkan sementara oleh Admin.',
        'warning'
      );
      return;
    }

    setIsSendingReply(true);
    await sendTicketUserMessage(selectedTicketId, replyText.trim());
    setReplyText('');
    setIsSendingReply(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#fffefb] text-slate-900 w-full max-w-lg rounded-2xl border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 border-b-2.5 border-slate-900 bg-amber-300 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-white flex items-center justify-center font-black text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 tracking-tight">
                  Carlos Support
                </h2>
                {settings.isSupportAiEnabled !== false ? (
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-emerald-300 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                    Online 24 Jam
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-rose-300 text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]">
                    AI FAQ Aktif • Chat Admin Tutup
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-800 font-bold">
                Pusat Bantuan Resmi &amp; Layanan Customer Service
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {currentView !== 'menu' && (
              <button
                onClick={() => setCurrentView('menu')}
                className="px-2.5 py-1 rounded-lg bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-[11px] font-black text-slate-900 hover:bg-slate-100 transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                Menu Utama
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-900 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <X className="w-4 h-4 font-black" />
            </button>
          </div>
        </div>

        {/* ================= CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold">
          
          {/* VIEW 1: MENU UTAMA (SAPAAN BOT & PILIHAN INTERAKTIF) */}
          {currentView === 'menu' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              {/* If Support AI / Admin Messaging is Disabled by Admin */}
              {settings.isSupportAiEnabled === false && (
                <div className="p-4 bg-rose-200 border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] rounded-xl text-slate-900 space-y-2">
                  <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>Pesan Ke Admin/Support Ditutup Sementara</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-800 font-medium">
                    {settings.supportAiStatusMessage || 'Layanan pengiriman pesan langsung ke Admin/Support sedang dinonaktifkan sementara. Namun Anda tetap dapat menggunakan layanan Tanya AI di bawah untuk mendapat jawaban otomatis.'}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <a
                      href={settings.linkSaluran || 'https://whatsapp.com/channel/0029Vb4F9G1J3RujV8yE6l'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] flex items-center gap-1.5 cursor-pointer text-decoration-none transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Saluran WhatsApp Official</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Sapaan Bot */}
              <div className="p-4 bg-[#0F172A] text-white rounded-xl border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#6366f1] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 border border-slate-900 flex items-center justify-center text-white shrink-0 font-black">
                    <Bot className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div>
                    <div className="font-black text-amber-300 text-xs">Carlos Virtual Assistant</div>
                    <div className="text-[10px] text-indigo-300 font-bold">Bot Bantuan Resmi Carlos69</div>
                  </div>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Halo {currentUser ? currentUser.name : 'Sobat'}! Selamat datang di Carlos Support. Kami siap membantu menjawab pertanyaan sistem atau meneruskan laporan langsung ke Developer &amp; Owner.
                </p>
                <div className="p-2.5 rounded-lg bg-indigo-900/60 border border-indigo-500 text-[11px] text-indigo-200 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sistem terhubung langsung dengan server notifikasi real-time.</span>
                </div>
              </div>

              {/* Pilihan Menu Navigasi Percakapan */}
              <div className="space-y-2">
                <div className="text-[11px] font-black text-slate-900 px-1 uppercase tracking-wider">
                  Pilih Layanan Bantuan:
                </div>

                {/* Option 1: AI FAQ Chat (ALWAYS ENABLED even if AI/Support is toggled off) */}
                <button
                  onClick={() => setCurrentView('ai_faq')}
                  className="w-full p-3.5 rounded-xl bg-white hover:bg-amber-100 border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] transition-all text-left flex items-center justify-between group cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Pertanyaan Umum (AI Assistant)</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-300 text-slate-900 border border-slate-900">Instan</span>
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                        Tanya seputar aturan setor, password wajib, rate harga, WD DANA
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-900 font-black" />
                </button>

                {/* Option 2: Bug Report */}
                <button
                  onClick={() => {
                    if (settings.isSupportAiEnabled === false) {
                      addToast('Pesan Ke Admin Ditutup', 'Layanan laporan pesan ke Admin/Support sedang dinonaktifkan sementara oleh Admin. Gunakan fitur Tanya AI.', 'warning');
                      return;
                    }
                    setCurrentView('bug_report');
                  }}
                  className={`w-full p-3.5 rounded-xl bg-white hover:bg-rose-100 border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] transition-all text-left flex items-center justify-between group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${
                    settings.isSupportAiEnabled === false ? 'opacity-60 bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center shrink-0">
                      <Bug className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Laporkan Bug &amp; Kendala Sistem</span>
                        {settings.isSupportAiEnabled === false ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-300 text-slate-900 border border-slate-900">Tutup</span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-300 text-slate-900 border border-slate-900">Laporan Kendala</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-700 font-medium mt-0.5">
                        Kirim laporan error &amp; lampirkan screenshot kendala sistem
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-900 font-black" />
                </button>

                {/* Option 3: Owner Chat */}
                <button
                  onClick={() => {
                    if (settings.isSupportAiEnabled === false) {
                      addToast('Pesan Ke Admin Ditutup', 'Layanan pesan ke Admin/Support sedang dinonaktifkan sementara oleh Admin. Gunakan fitur Tanya AI.', 'warning');
                      return;
                    }
                    setCurrentView('owner_chat');
                  }}
                  className={`w-full p-3.5 rounded-xl bg-white hover:bg-amber-100 border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] transition-all text-left flex items-center justify-between group cursor-pointer active:translate-x-0.5 active:translate-y-0.5 ${
                    settings.isSupportAiEnabled === false ? 'opacity-60 bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                        <span>Hubungi Owner / CS Langsung</span>
                        {settings.isSupportAiEnabled === false ? (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-300 text-slate-900 border border-slate-900">Tutup</span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">Prioritas</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Kirim pesan prioritas khusus ke Owner Carlos69
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>

                {/* Option 4: Ticket History */}
                <button
                  onClick={() => setCurrentView('history')}
                  className="w-full p-3.5 rounded-2xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/70 transition-all text-left flex items-center justify-between group cursor-pointer shadow-md active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>Riwayat Tiket &amp; Balasan Saya</span>
                        {myTickets.length > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-purple-500 text-white">
                            {myTickets.length}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Lihat progres penanganan tiket dan balasan pesan dari Admin/Owner
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: AI FAQ CHAT INTERAKTIF (ALWAYS FUNCTIONAL) */}
          {currentView === 'ai_faq' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-2xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-blue-200">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Mode AI Assistant Aktif • Menjawab Otomatis</span>
                </div>
                <button
                  onClick={() => setAiChatMessages([
                    {
                      id: 'ai-reset',
                      sender: 'bot',
                      text: `Percakapan telah direset. Ada yang ingin Anda tanyakan lagi seputar S3L Gmail Carlos69?`,
                      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    }
                  ])}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Bersihkan</span>
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {aiChatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-tr-xs' 
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-xs'
                      }`}>
                        <div className="text-xs leading-relaxed whitespace-pre-wrap">
                          {cleanText(msg.text)}
                        </div>
                        <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                      {isUser && (
                        <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isAiThinking && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-slate-900/60 rounded-xl w-fit">
                    <Bot className="w-4 h-4 animate-bounce text-blue-400" />
                    <span>Carlos Bot sedang mengetik...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setAiInputText('Berapa rate harga beli per akun saat ini?');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  Rate Harga Akun
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiInputText('Apa password wajib untuk setoran?');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  Password Wajib
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiInputText('Bagaimana cara penarikan saldo ke DANA?');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  Cara Tarik DANA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiInputText('Bagaimana cara menyetor akun Gmail?');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 whitespace-nowrap cursor-pointer"
                >
                  Cara Setor
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendAiMessage} className="flex items-center gap-2 pt-1 shrink-0">
                <input
                  type="text"
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder="Ketik pertanyaan seputar aturan, rate, saldo..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!aiInputText.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: FORM LAPORAN BUG & KENDALA SISTEM */}
          {currentView === 'bug_report' && (
            <form onSubmit={handleSubmitBugReport} className="space-y-4 animate-in fade-in">
              {settings.isSupportAiEnabled === false && (
                <div className="p-3 bg-amber-950/60 border border-amber-600/60 rounded-2xl text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Layanan laporan ke Admin/Support sedang dinonaktifkan sementara oleh Admin. Anda tetap dapat menggunakan layanan Tanya AI.</span>
                </div>
              )}

              <div className="p-3.5 bg-rose-950/40 border border-rose-900/50 rounded-2xl text-rose-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-2 text-rose-300">
                  <Bug className="w-4 h-4" />
                  <span>Formulir Laporan Bug &amp; Kendala Sistem</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Laporan ini akan langsung dikirimkan ke Tim Developer untuk segera dianalisis dan diperbaiki.
                </p>
                <div className="text-[10px] text-rose-400 font-semibold pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Sistem membatasi 1 laporan per 15 menit per pengguna.</span>
                </div>
              </div>

              {/* 1. Pilih Kategori Kendala */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih Kategori Kendala:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BUG_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBugCategory(cat)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                        bugCategory === cat
                          ? 'bg-rose-600/20 border-rose-500 text-rose-300 ring-1 ring-rose-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Deskripsi Kendala Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Deskripsi Masalah / Error:</label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  rows={4}
                  placeholder="Jelaskan secara detail apa yang terjadi, langkah sebelum error muncul, atau pesan error yang tertera..."
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* 3. Upload / Lampiran Screenshot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Lampirkan Screenshot (Opsional):</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => handleImageFileChange(e, 'bug')}
                  className="hidden"
                />

                {!bugScreenshot ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border-2 border-dashed border-slate-700 hover:border-rose-500 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-6 h-6 text-rose-400" />
                    <span className="font-bold text-xs">Klik untuk Unggah Screenshot Bukti Error</span>
                    <span className="text-[10px] text-slate-500">Format PNG/JPG/WebP (Maks 2MB)</span>
                  </button>
                ) : (
                  <div className="relative p-2 bg-slate-900 rounded-2xl border border-rose-500/40 space-y-2">
                    <img
                      src={bugScreenshot}
                      alt="Preview Bug Screenshot"
                      className="max-h-48 w-full object-contain rounded-xl bg-black/40"
                    />
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] text-emerald-400 font-bold">Screenshot siap dikirim</span>
                      <button
                        type="button"
                        onClick={() => setBugScreenshot('')}
                        className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus Gambar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingBug || !bugDescription.trim() || settings.isSupportAiEnabled === false}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                {isSubmittingBug ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Meneruskan ke Server Developer...</span>
                  </>
                ) : settings.isSupportAiEnabled === false ? (
                  <span>Layanan Laporan Ditutup Oleh Admin</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>KIRIM LAPORAN BUG KE DEVELOPER</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 4: OWNER CHAT FORM */}
          {currentView === 'owner_chat' && (
            <form onSubmit={handleSubmitOwnerChat} className="space-y-4 animate-in fade-in">
              {settings.isSupportAiEnabled === false && (
                <div className="p-3 bg-amber-950/60 border border-amber-600/60 rounded-2xl text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Layanan pesan ke Admin/Support sedang dinonaktifkan sementara oleh Admin. Anda tetap dapat menggunakan layanan Tanya AI.</span>
                </div>
              )}

              <div className="p-3.5 bg-amber-950/40 border border-amber-900/50 rounded-2xl text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-2 text-amber-300">
                  <Crown className="w-4 h-4" />
                  <span>Jalur Langsung ke Owner &amp; Manajemen Carlos69</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Pesan Anda akan diprioritaskan dan diteruskan langsung ke Pihak Owner.
                </p>
                <div className="text-[10px] text-amber-400 font-semibold pt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Sistem membatasi 1 pesan per 15 menit per pengguna.</span>
                </div>
              </div>

              {/* 1. Pilih Topik Urusan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Pilih Topik Keperluan:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OWNER_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setOwnerTopic(topic)}
                      className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                        ownerTopic === topic
                          ? 'bg-amber-600/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Pesan untuk Owner */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Isi Pesan / Pertanyaan:</label>
                <textarea
                  value={ownerMessage}
                  onChange={(e) => setOwnerMessage(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan pesan Anda dengan jelas dan santun untuk Owner Carlos69..."
                  className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* 3. Lampiran Screenshot */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Lampiran Gambar Bukti (Opsional):</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={ownerFileInputRef}
                  onChange={(e) => handleImageFileChange(e, 'owner')}
                  className="hidden"
                />

                {!ownerScreenshot ? (
                  <button
                    type="button"
                    onClick={() => ownerFileInputRef.current?.click()}
                    className="w-full p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border-2 border-dashed border-slate-700 hover:border-amber-500 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-6 h-6 text-amber-400" />
                    <span className="font-bold text-xs">Unggah Gambar / Dokumen Pendukung</span>
                    <span className="text-[10px] text-slate-500">Maks 2MB</span>
                  </button>
                ) : (
                  <div className="relative p-2 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-2">
                    <img
                      src={ownerScreenshot}
                      alt="Preview Screenshot"
                      className="max-h-48 w-full object-contain rounded-xl bg-black/40"
                    />
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] text-emerald-400 font-bold">Gambar terlampir</span>
                      <button
                        type="button"
                        onClick={() => setOwnerScreenshot('')}
                        className="text-[11px] font-bold text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingOwner || !ownerMessage.trim() || settings.isSupportAiEnabled === false}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-40 text-white font-black text-xs shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                {isSubmittingOwner ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Meneruskan ke Owner...</span>
                  </>
                ) : settings.isSupportAiEnabled === false ? (
                  <span>Layanan Pesan Ditutup Oleh Admin</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>KIRIM PESAN LANGSUNG KE OWNER</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 5: RIWAYAT TIKET USER */}
          {currentView === 'history' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs">Riwayat Laporan &amp; Tiket Anda</h3>
                <span className="text-[10px] text-slate-400">{myTickets.length} Tiket terdaftar</span>
              </div>

              {myTickets.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Belum ada tiket atau laporan bantuan yang Anda buat.</p>
                  <button
                    onClick={() => {
                      if (settings.isSupportAiEnabled === false) {
                        addToast('Pesan Ke Admin Ditutup', 'Layanan laporan pesan ke Admin/Support sedang dinonaktifkan sementara oleh Admin.', 'warning');
                        return;
                      }
                      setCurrentView('bug_report');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 cursor-pointer"
                  >
                    Buat Laporan Baru
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myTickets.map((ticket) => {
                    const isBug = ticket.type === 'bug_report';
                    const isOwner = ticket.type === 'owner_chat';
                    const isResolved = ticket.status === 'resolved';
                    const isInProgress = ticket.status === 'in_progress';

                    return (
                      <div
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setCurrentView('ticket_detail');
                        }}
                        className="p-3.5 rounded-2xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 space-y-2 cursor-pointer transition-all active:scale-98 shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-white text-xs">
                              {ticket.ticketNumber}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${
                              isBug ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              isOwner ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {ticket.category}
                            </span>
                          </div>

                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                            isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                            isInProgress ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>
                            {ticket.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2">
                          {cleanText(ticket.messages[0]?.content || ticket.title)}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                          <span>{ticket.messages.length} Pesan</span>
                          <span>{ticket.updatedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: TIKET DETAIL & BALASAN CHAT */}
          {currentView === 'ticket_detail' && activeTicket && (
            <div className="h-full flex flex-col space-y-3 animate-in fade-in">
              {/* Ticket Banner Header */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-white text-xs">{activeTicket.ticketNumber}</span>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-slate-800 text-slate-300">
                      {activeTicket.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                    activeTicket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                    activeTicket.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {activeTicket.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Dibuat: {activeTicket.createdAt}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {activeTicket.messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isAdmin = msg.sender === 'admin' || msg.sender === 'owner';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white ${
                          isAdmin ? 'bg-amber-600 shadow-md shadow-amber-900/30' : 'bg-blue-600'
                        }`}>
                          {isAdmin ? <Crown className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                      )}

                      <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                        isUser 
                          ? 'bg-blue-600 text-white rounded-tr-xs' 
                          : isAdmin
                          ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 text-amber-100 border border-amber-500/40 rounded-tl-xs'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-xs'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-[10px] font-bold ${
                            isUser ? 'text-blue-200' : isAdmin ? 'text-amber-300' : 'text-blue-300'
                          }`}>
                            {msg.senderName}
                          </span>
                          <span className={`text-[9px] ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
                            {msg.timestamp}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed whitespace-pre-wrap">
                          {cleanText(msg.content)}
                        </p>

                        {msg.imageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                            <img src={msg.imageUrl} alt="Lampiran screenshot" className="max-h-48 w-full object-contain bg-black/40" />
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <UserIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendTicketReply} className="flex items-center gap-2 pt-1 shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    settings.isSupportAiEnabled === false 
                      ? "Pesan ke admin/owner sedang ditutup..." 
                      : "Kirim pesan lanjutan ke admin/owner..."
                  }
                  disabled={settings.isSupportAiEnabled === false}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSendingReply || settings.isSupportAiEnabled === false}
                  className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Balas</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Carsloss Support AI, &quot;Pusat Bantuan Cerdas&quot;</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
