import React, { useState } from 'react';
import { 
  Wallet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock, 
  ShieldCheck, 
  Save, 
  X,
  ArrowDownLeft,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WithdrawalRequest } from '../types';

export const SaldoView: React.FC = () => {
  const { 
    currentUser, 
    requestWithdrawal, 
    withdrawals, 
    saveDanaNumber 
  } = useApp();

  const [savedDanaInput, setSavedDanaInput] = useState(currentUser?.danaNumber || '');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [danaName, setDanaName] = useState(currentUser?.danaAccountName || currentUser?.name || '');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const saldo = currentUser?.saldo || 0;
  const minWithdraw = 4000;
  const remainingForMin = Math.max(0, minWithdraw - saldo);

  const userWithdrawals = withdrawals.filter(w => 
    currentUser?.role === 'admin' ? true : w.userId === currentUser?.id
  );

  const handleSaveDana = (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedDanaInput.trim()) {
      alert('Masukkan nomor DANA yang valid.');
      return;
    }
    saveDanaNumber(savedDanaInput.trim());
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (isNaN(amt) || amt < minWithdraw) {
      alert(`Minimal penarikan saldo adalah Rp ${minWithdraw.toLocaleString('id-ID')}`);
      return;
    }
    if (amt > saldo) {
      alert(`Saldo tidak mencukupi (Saldo Anda: Rp ${saldo.toLocaleString('id-ID')})`);
      return;
    }
    if (!savedDanaInput.trim()) {
      alert('Harap isi nomor DANA tujuan.');
      return;
    }

    setWithdrawLoading(true);
    setTimeout(() => {
      const res = requestWithdrawal(amt, savedDanaInput.trim(), danaName);
      setWithdrawLoading(false);
      if (res?.success) {
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      } else {
        alert(res?.message || 'Gagal mengajukan penarikan.');
      }
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* 1. BLUE HERO SALDO CARD (MATCHING SCREENSHOT 3) */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
            Saldo saat ini
          </div>

          <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
            Rp{saldo.toLocaleString('id-ID')}
          </div>

          <button
            onClick={() => {
              if (saldo < minWithdraw) {
                alert(`Saldo Anda belum mencapai minimum penarikan (Rp ${minWithdraw.toLocaleString('id-ID')}).`);
                return;
              }
              setShowWithdrawModal(true);
            }}
            className="w-full py-3 rounded-2xl bg-white text-indigo-700 hover:bg-blue-50 active:scale-98 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Tarik Saldo</span>
          </button>

          {/* Info callout on balance */}
          <div className="text-[11px] text-blue-100 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/20 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-blue-200 shrink-0 mt-0.5" />
            <span>
              {saldo >= minWithdraw ? (
                <>Saldo kamu <strong>Rp{saldo.toLocaleString('id-ID')}</strong>, siap ditarik ke akun DANA Anda.</>
              ) : (
                <>Saldo kamu <strong>Rp{saldo.toLocaleString('id-ID')}</strong>, kurang <strong>Rp{remainingForMin.toLocaleString('id-ID')}</strong> lagi untuk mencapai minimum penarikan <strong>Rp4.000</strong>.</>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STATUS PENARIKAN ROW */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">Status Penarikan:</span>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Dibuka
        </span>
      </div>

      {/* 3. NOMOR DANA TERSIMPAN BOX (MATCHING SCREENSHOT 3) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Nomor DANA Tersimpan</span>
          </h2>
          {currentUser?.danaNumber && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              Tersimpan
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Simpan nomor DANA Anda agar tidak perlu mengetik ulang setiap penarikan. Hanya angka, 10–15 digit.
        </p>

        <form onSubmit={handleSaveDana} className="flex gap-2">
          <input
            type="text"
            required
            pattern="[0-9]{10,15}"
            value={savedDanaInput}
            onChange={(e) => setSavedDanaInput(e.target.value)}
            placeholder="083164982848"
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* 4. RIWAYAT PENARIKAN LIST (MATCHING SCREENSHOT 3) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Riwayat Penarikan
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            {userWithdrawals.length} Transaksi
          </span>
        </div>

        <div className="space-y-3">
          {userWithdrawals.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              Belum ada riwayat penarikan saldo.
            </div>
          ) : (
            userWithdrawals.map((wd) => {
              const isSuccess = wd.status === 'success';
              const isPending = wd.status === 'pending';
              const isRejected = wd.status === 'rejected';

              return (
                <div
                  key={wd.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-slate-500 font-mono">{wd.createdAt}</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                        {wd.accountNumber} <span className="text-slate-600 font-normal">({wd.accountName})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900 font-mono">
                        Rp{wd.amount.toLocaleString('id-ID')}
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSuccess ? 'bg-emerald-100 text-emerald-800' :
                        isPending ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {isSuccess ? '✅ Disetujui' : isPending ? '⏳ Diproses' : '❌ Ditolak'}
                      </span>
                    </div>
                  </div>

                  {wd.providerInfo && (
                    <div className="text-[10px] text-slate-500 font-mono bg-white p-2 rounded-xl border border-slate-200/80 leading-relaxed break-all">
                      {wd.providerInfo}
                    </div>
                  )}

                  {isRejected && wd.rejectReason && (
                    <div className="text-[10px] text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-100">
                      Alasan Ditolak: {wd.rejectReason}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. MODAL TARIK SALDO DANA (DANA ONLY) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Tarik Saldo ke DANA</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Akun DANA
                </label>
                <input
                  type="text"
                  required
                  value={savedDanaInput}
                  onChange={(e) => setSavedDanaInput(e.target.value)}
                  placeholder="083164982848"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Akun DANA
                </label>
                <input
                  type="text"
                  required
                  value={danaName}
                  onChange={(e) => setDanaName(e.target.value)}
                  placeholder="Nama Akun DANA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Nominal Penarikan (Rp)</label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(saldo.toString())}
                    className="text-[11px] text-indigo-600 font-bold hover:underline"
                  >
                    Tarik Semua ({saldo.toLocaleString('id-ID')})
                  </button>
                </div>
                <input
                  type="number"
                  required
                  min={minWithdraw}
                  max={saldo}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Minimal Rp ${minWithdraw.toLocaleString('id-ID')}`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
                <span>Biaya Admin:</span>
                <span className="font-bold">Rp 0 (Gratis)</span>
              </div>

              <button
                type="submit"
                disabled={withdrawLoading || saldo < minWithdraw}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {withdrawLoading ? (
                  <span>Mengirim Permintaan...</span>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Konfirmasi Tarik Saldo</span>
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
