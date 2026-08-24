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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Syarat, Ketentuan & Rules</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* Rules Hari Ini Box */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>RULES HARI INI:</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {settings.rulesHariIni || 'Wajib menggunakan password wajib yang telah ditentukan sistem. Format email harus valid @gmail.com.'}
            </p>
          </div>

          {/* Mandatory Password Notice */}
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-indigo-900">Password Wajib Setoran:</span>
              <p className="text-[11px] text-indigo-700">Gunakan selalu password ini saat membuat Gmail</p>
            </div>
            <span className="font-mono font-black text-sm bg-indigo-600 text-white px-3 py-1 rounded-xl shadow-xs">
              {settings.mandatoryPassword}
            </span>
          </div>

          {/* Full Terms & Conditions */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Ketentuan Umum Layanan {settings.namaDashboard || 'Carlos69'}:
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed text-[11px]">
              {settings.syaratKetentuan}
            </div>
          </div>

          {/* Verification & Withdrawal FAQ */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              FAQ & Informasi Pembayaran:
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-600">
              <li><strong>Estimasi Pengecekan:</strong> 24–30 jam setelah disetor.</li>
              <li><strong>Metode Penarikan:</strong> Khusus DANA tanpa biaya administrasi (0%).</li>
              <li><strong>Minimal Tarik Saldo:</strong> Rp 4.000.</li>
              <li><strong>Sanksi Trusted 0%:</strong> Akun yang terdeteksi 0% trusted otomatis diblokir sistem.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onOpenSaluranWA}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Saluran WA</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
