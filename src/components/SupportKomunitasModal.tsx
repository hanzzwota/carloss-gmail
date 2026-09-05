import React from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  Briefcase, 
  MessagesSquare, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  Zap 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SupportKomunitasModalProps {
  type: 'support' | 'komunitas' | null;
  onClose: () => void;
  onOpenSaluranWA: () => void;
}

export const SupportKomunitasModal: React.FC<SupportKomunitasModalProps> = ({
  type,
  onClose,
  onOpenSaluranWA
}) => {
  const { settings } = useApp();

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffefb] w-full max-w-md rounded-2xl border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        <div className="p-4 border-b-2.5 border-slate-900 flex items-center justify-between bg-amber-300">
          <div className="flex items-center gap-2">
            {type === 'support' ? (
              <Briefcase className="w-5 h-5 text-slate-900" />
            ) : (
              <MessagesSquare className="w-5 h-5 text-slate-900" />
            )}
            <h2 className="text-sm font-black text-slate-900">
              {type === 'support' ? 'Customer Support & Bantuan' : 'Komunitas Seller & Buyer S3L'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-900 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-800 leading-relaxed">
          {type === 'support' ? (
            <div className="space-y-3.5">
              <div className="p-4 bg-[#0F172A] text-white rounded-xl border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#6366f1] space-y-1.5">
                <div className="text-[11px] font-black text-indigo-400 uppercase tracking-wider">Layanan Bantuan 24 Jam</div>
                <div className="text-base font-black text-amber-300">Pusat Resolusi Masalah Setoran &amp; DANA</div>
                <p className="text-xs text-slate-200 font-medium">
                  Mengalami kendala akun ditolak salah atau pencairan DANA tertunda? Tim support kami siap membantu.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-xl text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] flex items-center justify-between transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-slate-900" />
                    <div className="text-left">
                      <div>Chat CS Saluran WhatsApp</div>
                      <div className="text-[10px] text-slate-800 font-semibold">Respon cepat dalam 5–15 menit</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-900" />
                </button>

                <div className="p-3.5 bg-amber-200 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-[11px] text-slate-900 space-y-1.5 font-bold">
                  <div className="font-black text-slate-900 uppercase">Format Laporan Kendala:</div>
                  <div className="font-mono text-[10px] text-slate-900 bg-white p-2.5 rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
                    ID Setoran / Nomor DANA : [Isi Disini]<br />
                    Kendala : [Penjelasan Singkat]<br />
                    Tangkapan Layar / Bukti : [Lampirkan]
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-4 bg-[#0F172A] text-white rounded-xl border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#6366f1] space-y-1.5">
                <div className="text-[11px] font-black text-sky-300 uppercase tracking-wider">Komunitas Terbuka</div>
                <div className="text-base font-black text-amber-300">Gabung dengan Ribuan Seller Gmail</div>
                <p className="text-xs text-slate-200 font-medium">
                  Dapatkan info tips pembuatan Gmail tanpa no HP (Anti CP), trik IP, dan pengumuman kuota harian.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-xl text-xs font-black border-2.5 border-slate-900 shadow-[3.5px_3.5px_0px_0px_#0f172a] flex items-center justify-between transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5 text-slate-900" />
                    <div className="text-left">
                      <div>Saluran WhatsApp Carlos69</div>
                      <div className="text-[10px] text-slate-800 font-semibold">Update slot & pengumuman gratis</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-900" />
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
                      <div>Grup Telegram Official</div>
                      <div className="text-[10px] text-slate-800 font-semibold">Diskusi & tanya jawab sesama seller</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-900" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t-2.5 border-slate-900 bg-amber-100 flex items-center justify-end">
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
