import React from 'react';
import { 
  X, 
  Tag, 
  HelpCircle, 
  PhoneCall, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Wallet,
  Building,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PublicPagesModalProps {
  page: 'harga' | 'carabeli' | 'kontak' | null;
  onClose: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onOpenSaluranWA: () => void;
}

export const PublicPagesModal: React.FC<PublicPagesModalProps> = ({
  page,
  onClose,
  onOpenAuth,
  onOpenSaluranWA,
}) => {
  const { settings } = useApp();

  if (!page) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            {page === 'harga' && <Tag className="w-5 h-5 text-indigo-600" />}
            {page === 'carabeli' && <HelpCircle className="w-5 h-5 text-emerald-600" />}
            {page === 'kontak' && <PhoneCall className="w-5 h-5 text-sky-600" />}
            <h2 className="text-sm font-bold text-slate-900 capitalize">
              {page === 'harga' ? 'Daftar Harga & Komisi Gmail' : page === 'carabeli' ? 'Panduan & Cara Jual-Beli' : 'Hubungi Kami & Saluran Resmi'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* PAGE 1: HARGA */}
          {page === 'harga' && (
            <div className="space-y-4">
              <div className="bg-indigo-900 text-white p-5 rounded-2xl relative overflow-hidden border border-indigo-800">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Rate Setor Saat Ini</div>
                <div className="text-3xl font-extrabold my-1 font-mono text-white">
                  Rp {settings.ratePerAkun.toLocaleString('id-ID')} <span className="text-xs text-indigo-300 font-normal">/ Akun Gmail</span>
                </div>
                <p className="text-xs text-indigo-200 mt-2">
                  Saldo langsung masuk ke dompet Anda secara otomatis setelah verifikasi admin selesai.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                <div className="bg-slate-50 p-3 font-bold text-slate-800 flex justify-between text-xs">
                  <span>Kategori Akun</span>
                  <span>Harga / Rate</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Setor Gmail Fresh (Password sgsg1122)</div>
                    <div className="text-[11px] text-slate-400">Akun baru dibuat dengan format wajib</div>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 text-xs">Rp {settings.ratePerAkun.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Beli Akun Gmail Siap Pakai</div>
                    <div className="text-[11px] text-slate-400">Verified PVA & Bebas Checkpoint</div>
                  </div>
                  <span className="font-mono font-bold text-indigo-600 text-xs">Rp 6.000</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">Bonus Tier Trusted &gt; 90%</div>
                    <div className="text-[11px] text-slate-400">Untuk seller dengan reputasi tinggi</div>
                  </div>
                  <span className="font-mono font-bold text-purple-600 text-xs">+ Rp 250 / akun</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-900 text-xs">Bebas Biaya Admin Penarikan</div>
                  <div className="text-[11px] text-emerald-700">Tarik saldo ke DANA 100% utuh tanpa potongan biaya administrasi.</div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: CARA BELI / CARA STOR */}
          {page === 'carabeli' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Alur Setor Akun Gmail:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <div className="font-bold text-slate-900">Generate Gmail & Buat Akun</div>
                      <div className="text-slate-500 text-[11px]">Buka tab "Stor", salin salah satu email generated atau gunakan email Anda, lalu buat di Google dengan kata sandi wajib <strong className="text-indigo-600 font-mono">{settings.mandatoryPassword}</strong>.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <div className="font-bold text-slate-900">Tempel di Kotak Setoran Bulk</div>
                      <div className="text-slate-500 text-[11px]">Tempel daftar email satu per baris di formulir setoran. Duplikat akan otomatis dihapus oleh sistem.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <div className="font-bold text-slate-900">Verifikasi & Saldo Masuk</div>
                      <div className="text-slate-500 text-[11px]">Admin memeriksa akun dalam 24–30 jam. Saldo langsung cair ke dompet dan bisa ditarik ke nomor DANA Anda.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Alur Pembelian Gmail Siap Pakai:
                </h3>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
                  <div>1. Masuk ke menu <strong>Beli Akun</strong>.</div>
                  <div>2. Pilih jumlah paket yang diinginkan.</div>
                  <div>3. Masukkan nomor DANA Anda dan konfirmasi pembayaran.</div>
                  <div>4. Kredensial (email & password) langsung muncul di menu <strong>Akun Saya</strong>.</div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: KONTAK */}
          {page === 'kontak' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2 border border-slate-800">
                <div className="w-12 h-12 bg-indigo-600/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm">Pusat Bantuan & Komunitas Carlos69</h3>
                <p className="text-[11px] text-slate-300">
                  Dapatkan info slot buka/tutup storan, pengumuman harga, dan update terbaru langsung di saluran resmi kami.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div>Saluran Resmi WhatsApp</div>
                      <div className="text-[10px] text-emerald-200 font-normal">Update slot storan & informasi harian</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://t.me/carlos69official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-md shadow-sky-600/20"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-5 h-5" />
                    <div className="text-left">
                      <div>Telegram Channel Carlos69</div>
                      <div className="text-[10px] text-sky-200 font-normal">Komunitas seller & buyer se-Indonesia</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Jam Operasional Layanan:</div>
                <div>Senin – Jumat: 07:00 – 16:00 WIB</div>
                <div>Sabtu – Minggu: Slow Response (Verifikasi otomatis tetap berjalan)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">{settings.namaDashboard || 'CARLOS69'} OFFICIAL</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
