import React, { useState } from 'react';
import { 
  Send, 
  Copy, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Check, 
  X, 
  Zap, 
  LogIn, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface StorViewProps {
  onOpenRules: () => void;
  onOpenSaluranWA: () => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
}

// Helper robust parser for extracting emails
const parseGmailInputList = (rawText: string, defaultPassword = 'sgsg1122') => {
  if (!rawText) return [];
  const rawLines = rawText.split(/[\r\n;]+/).map((l) => l.trim()).filter(Boolean);
  const result: { email: string; password: string }[] = [];
  const seen = new Set<string>();

  for (const line of rawLines) {
    const tokens = line.split(/[,\t]+/).map((t) => t.trim()).filter(Boolean);
    for (const token of tokens) {
      if (!token.includes('@')) continue;

      let email = '';
      let password = defaultPassword;

      if (token.includes('|')) {
        const parts = token.split('|');
        email = parts[0].trim();
        password = parts[1] ? parts[1].trim() : defaultPassword;
      } else if (token.includes(':') && !token.startsWith('http')) {
        const parts = token.split(':');
        email = parts[0].trim();
        password = parts[1] ? parts[1].trim() : defaultPassword;
      } else {
        const spaceParts = token.split(/\s+/);
        if (spaceParts.length >= 2 && spaceParts[0].includes('@')) {
          email = spaceParts[0].trim();
          password = spaceParts[1].trim();
        } else {
          email = token.trim();
        }
      }

      email = email.replace(/[<>'"\s]/g, '').toLowerCase();
      if (email.includes('@') && !seen.has(email)) {
        seen.add(email);
        result.push({ email, password: password || defaultPassword });
      }
    }
  }

  return result;
};

export const StorView: React.FC<StorViewProps> = ({ onOpenRules, onOpenSaluranWA, onOpenAuth }) => {
  const { 
    currentUser, 
    settings, 
    generatedGmails, 
    generateNewGmails, 
    deleteGeneratedGmail, 
    clearMyGeneratedGmails,
    submitBulkGmail,
    setActiveTab,
    addToast
  } = useApp();

  const [bulkText, setBulkText] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [lastSubmissionSuccess, setLastSubmissionSuccess] = useState<{ batchId: string; count: number; totalAmount: number } | null>(null);

  // Modal Generate State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateCount, setGenerateCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Parse current text
  const parsedAccounts = parseGmailInputList(bulkText, settings.mandatoryPassword || 'sgsg1122');
  const linesCount = parsedAccounts.length;

  // Filter generated emails for this user
  const myGeneratedGmails = generatedGmails.filter(
    g => !g.userId || (currentUser && g.userId === currentUser.id)
  );

  const totalGenerated = myGeneratedGmails.length;
  const unDepositedCount = myGeneratedGmails.filter(g => !g.isDeposited).length;

  const handleCopySingle = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    addToast('Tersalin', `Email ${email} telah disalin ke clipboard!`, 'info');
    setTimeout(() => setCopiedEmail(null), 1800);
  };

  const handleCopyAll = () => {
    if (myGeneratedGmails.length === 0) {
      addToast('Info', 'Belum ada email yang digenerate.', 'info');
      return;
    }
    const text = myGeneratedGmails.map(g => g.email).join('\n');
    navigator.clipboard.writeText(text);
    setCopyFeedback('Semua Gmail tersalin!');
    addToast('Berhasil Salin', `${myGeneratedGmails.length} Gmail disalin ke clipboard!`, 'success');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCopyUndeposited = () => {
    const unDeposited = myGeneratedGmails.filter(g => !g.isDeposited);
    if (unDeposited.length === 0) {
      setCopyFeedback('Semua akun sudah distor!');
      addToast('Info', 'Semua email hasil generate sudah distor.', 'info');
      setTimeout(() => setCopyFeedback(null), 2000);
      return;
    }
    const text = unDeposited.map(g => g.email).join('\n');
    navigator.clipboard.writeText(text);
    setCopyFeedback(`${unDeposited.length} Gmail belum distor tersalin!`);
    addToast('Berhasil Salin', `${unDeposited.length} Gmail belum distor tersalin!`, 'success');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handlePasteUndepositedToForm = () => {
    const unDeposited = myGeneratedGmails.filter(g => !g.isDeposited);
    if (unDeposited.length === 0) {
      addToast('Info', 'Tidak ada Gmail yang belum distor.', 'info');
      return;
    }
    const textToPaste = unDeposited.map(g => `${g.email}|${settings.mandatoryPassword}`).join('\n');
    setBulkText(textToPaste);
    addToast('Otomatis Ditempel', `${unDeposited.length} akun dimasukkan ke kotak setoran dengan password wajib.`, 'success');
  };

  const handleExecuteGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Perhatian', 'Silakan login terlebih dahulu untuk generate akun!', 'warning');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (generateCount <= 0) {
      addToast('Peringatan', 'Masukkan jumlah akun minimal 1.', 'warning');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const res = generateNewGmails(Number(generateCount));
      setIsGenerating(false);
      if (res?.success) {
        setShowGenerateModal(false);
      } else {
        addToast('Gagal Generate', res?.message || 'Gagal generate email', 'error');
      }
    }, 250);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!currentUser) {
      addToast('Perhatian', 'Silakan masuk / login akun terlebih dahulu untuk menyetor!', 'warning');
      if (onOpenAuth) {
        onOpenAuth('login');
      }
      return;
    }

    if (!settings.isStorOpen) {
      addToast('Penyetoran Ditutup', settings.storStatusMessage || 'Penyetoran sedang ditutup sementara oleh Admin. Pantau saluran untuk info buka slot.', 'warning');
      return;
    }

    if (currentUser.status === 'blocked') {
      addToast('Akun Diblokir', 'Akun Anda saat ini dinonaktifkan dari sistem penyetoran.', 'error');
      return;
    }

    if (linesCount === 0) {
      addToast('Peringatan', 'Harap masukkan atau tempel minimal satu alamat Gmail yang valid di kotak setoran.', 'warning');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const res = submitBulkGmail(bulkText, extraNotes);
      setSubmitting(false);
      if (res?.success) {
        const batchNum = '#ST-' + Math.floor(100000 + Math.random() * 900000);
        setLastSubmissionSuccess({
          batchId: batchNum,
          count: linesCount,
          totalAmount: linesCount * settings.ratePerAkun,
        });
        setBulkText('');
        setExtraNotes('');
      } else {
        addToast('Gagal Mengirim', res?.message || 'Gagal mengirim setoran', 'error');
      }
    }, 400);
  };

  return (
    <div className="w-full max-w-none px-1 sm:px-2 pt-3 pb-24 space-y-4">
      {/* 1. STATUS STORAN BANNER (GREEN = OPEN, RED = CLOSED) */}
      <div className={`p-4 border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] rounded-2xl text-xs flex items-start gap-3 transition-all ${
        settings.isStorOpen 
          ? 'bg-emerald-200 text-slate-900' 
          : 'bg-rose-200 text-slate-900'
      }`}>
        <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 border border-slate-900 ${settings.isStorOpen ? 'bg-emerald-600 animate-ping' : 'bg-rose-600'}`} />
        <div className="space-y-1 flex-1">
          <div className="font-black text-xs flex items-center justify-between text-slate-900">
            <span>{settings.isStorOpen ? '🟢 SETORAN SEDANG DIBUKA' : '🔴 SETORAN SEDANG DITUTUP SEMENTARA'}</span>
            <span className={`px-2 py-0.5 rounded-lg border-2 border-slate-900 text-[10px] font-black ${settings.isStorOpen ? 'bg-amber-300 text-slate-900' : 'bg-rose-300 text-slate-900'}`}>
              {settings.isStorOpen ? 'Buka Slot' : 'Tutup Slot'}
            </span>
          </div>
          <p className="text-[11px] font-semibold leading-relaxed">
            {settings.storStatusMessage || settings.infoDashboard}
          </p>
          <button
            onClick={onOpenSaluranWA}
            className="text-[11px] font-black text-indigo-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            More info di saluran →
          </button>
        </div>
      </div>

      {/* 2. SUCCESS NOTICE BANNER IF RECENTLY SUBMITTED */}
      {lastSubmissionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-3xl space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Setoran Berhasil Terkirim!</span>
            </div>
            <button
              onClick={() => setLastSubmissionSuccess(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            Sebanyak <strong>{lastSubmissionSuccess.count} akun Gmail</strong> telah disetor dan sedang dalam antrean verifikasi Admin. Estimasi saldo: <strong>Rp {lastSubmissionSuccess.totalAmount.toLocaleString('id-ID')}</strong>.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setActiveTab('riwayat')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Lihat Status Riwayat</span>
            </button>
            <button
              onClick={() => setLastSubmissionSuccess(null)}
              className="px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold rounded-xl cursor-pointer transition-all"
            >
              Setor Lagi
            </button>
          </div>
        </div>
      )}

      {/* 3. RULES CALLOUT BANNER */}
      <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-base">📜</span>
          <div>
            <span className="font-bold text-slate-800">Cek Rules dulu sebelum stor</span>
            <p className="text-[10px] text-slate-500">Wajib dibaca agar Gmail tidak ditolak.</p>
          </div>
        </div>
        <button
          onClick={onOpenRules}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          Buka Rules
        </button>
      </div>

      {/* 4. SETOR DAFTAR GMAIL CARD */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Setor Daftar Gmail</h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Tempel daftar, satu Gmail per baris. Duplikat otomatis dihapus. Hanya Gmail hasil "Generate Gmail" milik akun ini yang bisa disetor.
          </p>
        </div>

        {/* 5. YELLOW ALERT: PASSWORD WAJIB */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <span>🔑</span>
            <span>
              Password wajib untuk Gmail yang disetor: <strong className="font-mono font-bold bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-950">{settings.mandatoryPassword}</strong>
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Pastikan setiap Gmail menggunakan password di atas. Gmail dengan password berbeda akan ditolak.
          </p>
        </div>

        {/* 6. GENERATED GMAIL BOX */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          {/* Header Row: Generated Gmail & Total / Belum Distor */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Generated Gmail</span>
            </span>
            <span className="text-[11px] font-mono font-medium text-slate-500">
              Total: {totalGenerated} · Belum distor: {unDepositedCount}
            </span>
          </div>

          {/* Feedback Toast */}
          {copyFeedback && (
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{copyFeedback}</span>
            </div>
          )}

          {/* List of Generated Items */}
          {myGeneratedGmails.length === 0 ? (
            <div className="text-center py-5 px-3 bg-white rounded-2xl border border-dashed border-slate-300 space-y-3">
              <p className="text-xs text-slate-500">
                Belum ada email yang digenerate.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!currentUser && onOpenAuth) {
                    addToast('Perhatian', 'Silakan login terlebih dahulu untuk generate akun!', 'warning');
                    onOpenAuth('login');
                    return;
                  }
                  setShowGenerateModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Gmail</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Item Rows */}
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                {myGeneratedGmails.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all text-xs font-mono group"
                  >
                    <div 
                      onClick={() => handleCopySingle(g.email)}
                      className="flex items-center gap-2 flex-1 cursor-pointer truncate mr-2"
                      title="Ketuk untuk menyalin"
                    >
                      <button type="button" className="text-slate-400 group-hover:text-blue-600 shrink-0">
                        {copiedEmail === g.email ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <span className="truncate text-slate-800 font-medium">{g.email}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        g.isDeposited ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {g.isDeposited ? 'Sudah Distor' : 'Belum Distor'}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteGeneratedGmail(g.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Helper */}
              <p className="text-[11px] text-slate-500 pt-1">
                Ketuk salin satu per satu atau gunakan tombol di bawah:
              </p>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Semua Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyUndeposited}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 active:scale-[0.99] text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Gmail Belum Distor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGenerateModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-blue-200 hover:bg-blue-50/50 active:scale-[0.99] text-blue-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Generate Lagi</span>
                </button>

                {/* Sub Action Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePasteUndepositedToForm}
                    className="py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tempel Otomatis</span>
                  </button>

                  <button
                    type="button"
                    onClick={clearMyGeneratedGmails}
                    className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Daftar</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 7. FORM TEXTAREA FOR BULK SETOR */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Tempel Akun Gmail yang Sudah Dibuat:
              </label>
              <span className={`text-[11px] font-mono font-bold ${linesCount > 0 ? 'text-blue-700' : 'text-slate-400'}`}>
                {linesCount} Akun Terdeteksi
              </span>
            </div>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={`contoh1@gmail.com\ncontoh2@gmail.com\n\natau format:\ncontoh1@gmail.com|${settings.mandatoryPassword}`}
              rows={6}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />

            {/* Live Generated Validation Helper */}
            {linesCount > 0 && (
              <div className="mt-2 space-y-1.5">
                {(() => {
                  const validSet = new Set(myGeneratedGmails.map(g => g.email.trim().toLowerCase()));
                  const validCount = parsedAccounts.filter(p => validSet.has(p.email.toLowerCase())).length;
                  const invalidCount = parsedAccounts.length - validCount;

                  return (
                    <div className="p-2.5 rounded-xl border text-xs font-mono">
                      {invalidCount === 0 ? (
                        <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 p-2 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Semua {validCount} akun sesuai dengan hasil generate (Valid untuk ACC).</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="text-emerald-700 bg-emerald-50/70 border border-emerald-200 p-1.5 rounded-lg flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{validCount} Akun sesuai hasil generate (Akan Di-ACC)</span>
                          </div>
                          <div className="text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block">⚠️ {invalidCount} Akun Belum Ada di Hasil Generate!</strong>
                              <span className="text-[10px] font-sans block mt-0.5">
                                Hanya email yang digenerate oleh akun ini yang akan disetujui. Akun lain otomatis ditolak sistem.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Catatan untuk Admin (Opsional):
            </label>
            <input
              type="text"
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              placeholder="Contoh: Fresh akun baru dibuat hari ini"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submission summary calculation */}
          <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600 font-sans">Total Potensi Saldo:</span>
            <span className="text-sm font-black text-emerald-600">
              Rp {(linesCount * settings.ratePerAkun).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Submit Button */}
          {!currentUser ? (
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-bold shadow-lg shadow-amber-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Untuk Kirim Setoran</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-4 rounded-2xl text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide active:scale-98 ${
                !settings.isStorOpen
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                  : linesCount === 0
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25 opacity-90'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
              }`}
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {!settings.isStorOpen
                      ? 'Penyetoran Ditutup (Cek Status)'
                      : linesCount > 0
                      ? `Kirim Setoran (${linesCount} Akun)`
                      : 'Kirim Setoran'}
                  </span>
                </>
              )}
            </button>
          )}
        </form>
      </div>

      {/* ✨ GENERATE GMAIL MODAL */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <h3 className="text-base font-bold text-slate-900">Generate Gmail</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Masukkan jumlah Gmail yang ingin dibuat.
            </p>

            <form onSubmit={handleExecuteGenerate} className="space-y-4">
              {/* Preset Number Pills: 5 | 10 | 25 | 50 | 100 */}
              <div className="flex items-center gap-1.5 justify-between">
                {[5, 10, 25, 50, 100].map((num) => {
                  const isSelected = generateCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGenerateCount(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Number Input Field */}
              <div>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={generateCount}
                  onChange={(e) => setGenerateCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 text-center focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                />
              </div>

              {/* Generate Action Button with Check Icon */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
