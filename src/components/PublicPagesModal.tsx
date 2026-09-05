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
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffefb] w-full max-w-lg rounded-2xl border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b-2.5 border-slate-900 flex items-center justify-between bg-amber-300">
          <div className="flex items-center gap-2">
            {page === 'harga' && <Tag className="w-5 h-5 text-slate-900" />}
            {page === 'carabeli' && <HelpCircle className="w-5 h-5 text-slate-900" />}
            {page === 'kontak' && <PhoneCall className="w-5 h-5 text-slate-900" />}
            <h2 className="text-xs sm:text-sm font-black text-slate-900 capitalize">
              {page === 'harga' ? 'Daftar Harga & Komisi Gmail' : page === 'carabeli' ? 'Panduan & Cara Jual-Beli' : 'Hubungi Kami & Saluran Resmi'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-900 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-800 leading-relaxed">
          {/* PAGE 1: HARGA */}
          {page === 'harga' && (
            <div className="space-y-4">
              <div className="bg-[#0F172A] text-white p-5 rounded-xl border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#6366f1] relative overflow-hidden">
                <div className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">Rate Setor Saat Ini</div>
                <div className="text-3xl font-black my-1 font-mono text-amber-300">
                  Rp {settings.ratePerAkun.toLocaleString('id-ID')} <span className="text-xs text-slate-300 font-bold">/ Akun Gmail</span>
                </div>
                <p className="text-xs text-slate-200 mt-2 font-medium">
                  Saldo langsung masuk ke dompet Anda secara otomatis setelah verifikasi admin selesai.
                </p>
              </div>

              <div className="border-2.5 border-slate-900 rounded-xl overflow-hidden divide-y-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] bg-white">
                <div className="bg-amber-200 p-3 font-black text-slate-900 flex justify-between text-xs border-b-2 border-slate-900">
                  <span>Kategori Akun</span>
                  <span>Harga / Rate</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">Setor Gmail Fresh (Password sgsg1122)</div>
                    <div className="text-[11px] text-slate-600 font-medium">Akun baru dibuat dengan format wajib</div>
                  </div>
                  <span className="font-mono font-black bg-emerald-300 text-slate-900 px-2 py-0.5 rounded-md border-2 border-slate-900 text-xs">Rp {settings.ratePerAkun.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">Beli Akun Gmail Siap Pakai</div>
                    <div className="text-[11px] text-slate-600 font-medium">Verified PVA & Bebas Checkpoint</div>
                  </div>
                  <span className="font-mono font-black bg-indigo-300 text-slate-900 px-2 py-0.5 rounded-md border-2 border-slate-900 text-xs">Rp 6.000</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">Bonus Tier Trusted &gt; 90%</div>
                    <div className="text-[11px] text-slate-600 font-medium">Untuk seller dengan reputasi tinggi</div>
                  </div>
                  <span className="font-mono font-black bg-purple-300 text-slate-900 px-2 py-0.5 rounded-md border-2 border-slate-900 text-xs">+ Rp 250 / akun</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-200 border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-black text-slate-900 text-xs">Bebas Biaya Admin Penarikan</div>
                  <div className="text-[11px] text-slate-800 font-bold">Tarik saldo ke DANA 100% utuh tanpa potongan biaya administrasi.</div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: CARA BELI / CARA STOR */}
          {page === 'carabeli' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-700" />
                  Alur Setor Akun Gmail:
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-white flex items-center justify-center font-black text-xs shrink-0">1</span>
                    <div>
                      <div className="font-black text-slate-900">Generate Gmail & Buat Akun</div>
                      <div className="text-slate-800 text-[11px] font-semibold mt-0.5">Buka tab "Stor", salin salah satu email generated atau gunakan email Anda, lalu buat di Google dengan kata sandi wajib <strong className="bg-amber-300 text-slate-900 px-1 rounded border border-slate-900 font-mono">{settings.mandatoryPassword}</strong>.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-white flex items-center justify-center font-black text-xs shrink-0">2</span>
                    <div>
                      <div className="font-black text-slate-900">Tempel di Kotak Setoran Bulk</div>
                      <div className="text-slate-800 text-[11px] font-semibold mt-0.5">Tempel daftar email satu per baris di formulir setoran. Duplikat akan otomatis dihapus oleh sistem.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a]">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-white flex items-center justify-center font-black text-xs shrink-0">3</span>
                    <div>
                      <div className="font-black text-slate-900">Verifikasi & Saldo Masuk</div>
                      <div className="text-slate-800 text-[11px] font-semibold mt-0.5">Admin memeriksa akun dalam 24–30 jam. Saldo langsung cair ke dompet dan bisa ditarik ke nomor DANA Anda.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t-2 border-slate-900">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-700" />
                  Alur Pembelian Gmail Siap Pakai:
                </h3>
                <div className="p-3.5 bg-emerald-200 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-[11px] text-slate-900 font-bold space-y-1">
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
              <div className="p-4 bg-[#0F172A] text-white rounded-2xl text-center space-y-2 border-2.5 border-slate-900 shadow-[4px_4px_0px_0px_#6366f1]">
                <div className="w-12 h-12 bg-indigo-600 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] text-white rounded-xl flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-black text-sm">Pusat Bantuan & Komunitas Carlos69</h3>
                <p className="text-[11px] text-slate-300 font-medium">
                  Dapatkan info slot buka/tutup storan, pengumuman harga, dan update terbaru langsung di saluran resmi kami.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-xl text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] flex items-center justify-between transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-slate-900" />
                    <div className="text-left">
                      <div>Saluran Resmi WhatsApp</div>
                      <div className="text-[10px] text-slate-800 font-semibold">Update slot storan & informasi harian</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </button>

                <a
                  href="https://t.me/carlos69official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 bg-sky-300 hover:bg-sky-400 text-slate-900 rounded-xl text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] flex items-center justify-between transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-5 h-5 text-slate-900" />
                    <div className="text-left">
                      <div>Telegram Channel Carlos69</div>
                      <div className="text-[10px] text-slate-800 font-semibold">Komunitas seller & buyer se-Indonesia</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-900" />
                </a>
              </div>

              <div className="p-3.5 bg-amber-200 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-[11px] text-slate-900 font-bold space-y-1">
                <div className="font-black text-slate-900 uppercase">Jam Operasional Layanan:</div>
                <div>Senin – Jumat: 07:00 – 16:00 WIB</div>
                <div>Sabtu – Minggu: Slow Response (Verifikasi otomatis tetap berjalan)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2.5 border-slate-900 bg-amber-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-900 font-black font-mono">{settings.namaDashboard || 'CARLOS69'} OFFICIAL</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
