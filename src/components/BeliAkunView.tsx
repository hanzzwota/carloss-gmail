import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Smartphone, 
  Lock, 
  Mail, 
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BeliAkunView: React.FC = () => {
  const { allGmailAccounts, currentUser, buyGmailPackage, setActiveTab, addToast } = useApp();

  const [selectedQty, setSelectedQty] = useState<number>(5);
  const [buyerDanaNumber, setBuyerDanaNumber] = useState(currentUser?.danaNumber || '');
  const [loading, setLoading] = useState(false);

  const pricePerAccount = 6000;
  const availableStock = allGmailAccounts.filter(a => a.status === 'accepted').length;
  const totalPrice = selectedQty * pricePerAccount;

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerDanaNumber.trim()) {
      addToast('Nomor DANA Kosong', 'Masukkan nomor DANA Anda untuk verifikasi pembayaran.', 'warning');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = buyGmailPackage(selectedQty, buyerDanaNumber.trim());
      setLoading(false);
      if (res?.success) {
        setActiveTab('beranda');
      } else {
        addToast('Gagal Pembelian', res?.message || 'Terjadi kesalahan saat memproses pembelian.', 'error');
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-indigo-800">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Stok Tersedia: {availableStock} Akun
            </span>
            <span className="text-xs text-indigo-300 font-mono">DANA Instan</span>
          </div>

          <h1 className="text-lg font-black text-white tracking-tight">Beli Akun Gmail Siap Pakai</h1>
          <p className="text-xs text-indigo-200 leading-relaxed">
            Akun Gmail terverifikasi, no checkpoint (CP), langsung aktif dan siap digunakan untuk kebutuhan bisnis Anda.
          </p>
        </div>
      </div>

      {/* Package Selection */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pilih Paket Pembelian
          </h2>
          <span className="text-xs text-indigo-600 font-bold font-mono">
            Rp {pricePerAccount.toLocaleString('id-ID')} / Akun
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[1, 5, 10, 20, 50, 100].map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => setSelectedQty(qty)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedQty === qty
                  ? 'border-indigo-600 bg-indigo-50/90 text-indigo-900 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="text-sm font-black font-mono">{qty} Akun</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Rp {(qty * pricePerAccount).toLocaleString('id-ID')}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleBuy} className="space-y-3.5 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Metode Pembayaran (Hanya DANA)
            </label>
            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-blue-900">DANA Express Payment</div>
                  <div className="text-[10px] text-blue-700">Verifikasi instan tanpa admin fee</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nomor Akun DANA Anda *
            </label>
            <input
              type="text"
              required
              value={buyerDanaNumber}
              onChange={(e) => setBuyerDanaNumber(e.target.value)}
              placeholder="083164982848"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500"
            />
          </div>

          {/* Price Summary */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Paket:</span>
              <span className="font-bold">{selectedQty} Akun Gmail</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Harga per Akun:</span>
              <span>Rp {pricePerAccount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
              <span>Total Pembayaran:</span>
              <span className="text-indigo-600 font-mono font-black">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || availableStock < selectedQty}
            className={`w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              availableStock >= selectedQty && !loading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span>Memproses Pembayaran DANA...</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Bayar Sekarang (Rp {totalPrice.toLocaleString('id-ID')})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
