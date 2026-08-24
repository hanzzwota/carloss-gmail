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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            {type === 'support' ? (
              <Briefcase className="w-5 h-5 text-indigo-600" />
            ) : (
              <MessagesSquare className="w-5 h-5 text-sky-600" />
            )}
            <h2 className="text-sm font-bold text-slate-900">
              {type === 'support' ? 'Customer Support & Bantuan' : 'Komunitas Seller & Buyer S3L'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {type === 'support' ? (
            <div className="space-y-3.5">
              <div className="p-4 bg-indigo-900 text-white rounded-2xl space-y-1.5 border border-indigo-800">
                <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Layanan Bantuan 24 Jam</div>
                <div className="text-base font-bold">Pusat Resolusi Masalah Setoran &amp; DANA</div>
                <p className="text-xs text-indigo-200">
                  Mengalami kendala akun ditolak salah atau pencairan DANA tertunda? Tim support kami siap membantu.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div>Chat CS Saluran WhatsApp</div>
                      <div className="text-[10px] text-emerald-200 font-normal">Respon cepat dalam 5–15 menit</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">Format Laporan Kendala:</div>
                  <div className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                    ID Setoran / Nomor DANA : [Isi Disini]<br />
                    Kendala : [Penjelasan Singkat]<br />
                    Tangkapan Layar / Bukti : [Lampirkan]
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1.5 border border-slate-800">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Komunitas Terbuka</div>
                <div className="text-base font-bold">Gabung dengan Ribuan Seller Gmail</div>
                <p className="text-xs text-slate-300">
                  Dapatkan info tips pembuatan Gmail tanpa no HP (Anti CP), trik IP, dan pengumuman kuota harian.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onOpenSaluranWA}
                  className="w-full p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div>Saluran Resmi WhatsApp</div>
                      <div className="text-[10px] text-emerald-200 font-normal">Update harian &amp; event bonus</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </button>

                <a
                  href="https://t.me/carlos69official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Send className="w-5 h-5" />
                    <div className="text-left">
                      <div>Grup Diskusi Telegram</div>
                      <div className="text-[10px] text-sky-200 font-normal">Sharing pengalaman sesama seller</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
