import React from 'react';
import { 
  X, 
  ScrollText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSaluranWA: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, onOpenSaluranWA }) => {
  const { settings } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fffefb] w-full max-w-lg rounded-2xl border-2.5 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b-2.5 border-slate-900 flex items-center justify-between bg-amber-300">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-slate-900" />
            <h2 className="text-sm font-black text-slate-900">Syarat, Ketentuan & Rules</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-900 flex items-center justify-center hover:bg-slate-100 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <X className="w-4 h-4 font-black" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-800 leading-relaxed">
          {/* Rules Hari Ini Box */}
          <div className="p-3.5 bg-amber-200 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-1.5">
            <div className="flex items-center gap-1.5 font-black text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
              <span>RULES HARI INI:</span>
            </div>
            <p className="text-slate-900 font-bold text-[11px] leading-relaxed">
              {settings.rulesHariIni || 'Wajib menggunakan password wajib yang telah ditentukan sistem. Format email harus valid @gmail.com.'}
            </p>
          </div>

          {/* Mandatory Password Notice */}
          <div className="p-3.5 bg-indigo-200 rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-between">
            <div>
              <span className="font-black text-slate-900">Password Wajib Setoran:</span>
              <p className="text-[11px] text-slate-800 font-bold">Gunakan selalu password ini saat membuat Gmail</p>
            </div>
            <span className="font-mono font-black text-sm bg-amber-300 text-slate-900 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]">
              {settings.mandatoryPassword}
            </span>
          </div>

          {/* Full Terms & Conditions */}
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              Ketentuan Umum Layanan {settings.namaDashboard || 'Carlos69'}:
            </h3>
            <div className="p-3.5 bg-white rounded-xl border-2.5 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] text-slate-900 font-semibold whitespace-pre-line leading-relaxed text-[11px]">
              {settings.syaratKetentuan}
            </div>
          </div>

          {/* Verification & Withdrawal FAQ */}
          <div className="space-y-2 pt-2 border-t-2 border-slate-900">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              FAQ & Informasi Pembayaran:
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-900 font-bold">
              <li><strong>Estimasi Pengecekan:</strong> 24–30 jam setelah disetor.</li>
              <li><strong>Metode Penarikan:</strong> Khusus DANA tanpa biaya administrasi (0%).</li>
              <li><strong>Minimal Tarik Saldo:</strong> Rp 4.000.</li>
              <li><strong>Sanksi Trusted 0%:</strong> Akun yang terdeteksi 0% trusted otomatis diblokir sistem.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2.5 border-slate-900 bg-amber-100 flex items-center justify-between">
          <button
            onClick={onOpenSaluranWA}
            className="text-xs text-indigo-800 font-black hover:underline flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#0f172a]"
          >
            <span>Buka Saluran WA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
