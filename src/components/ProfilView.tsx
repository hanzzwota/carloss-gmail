import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Trash2, 
  Key, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Save, 
  X, 
  Lock,
  Ban,
  CheckCircle2,
  Clock3,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../utils/avatar';

export const ProfilView: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    changePassword, 
    logout, 
    switchUser, 
    allUsers 
  } = useApp();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [copiedUid, setCopiedUid] = useState(false);

  const [isEditingDana, setIsEditingDana] = useState(false);
  const [editDanaInput, setEditDanaInput] = useState(currentUser?.danaNumber || '');

  if (!currentUser) return null;

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentUser.id);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      alert('Kata sandi minimal 6 karakter.');
      return;
    }
    if (newPass !== confirmPass) {
      alert('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    changePassword(newPass);
    setShowPasswordModal(false);
    setNewPass('');
    setConfirmPass('');
  };

  const handleSaveDana = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ danaNumber: editDanaInput });
    setIsEditingDana(false);
  };

  return (
    <div className="w-full max-w-none px-1 sm:px-2 pt-3 pb-24 space-y-4">
      {/* Blocked warning banner if user blocked */}
      {currentUser.status === 'blocked' && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl text-xs font-bold flex items-start gap-2.5 shadow-sm">
          <Ban className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <div className="text-sm font-black text-rose-900">AKUN ANDA TELAH DIBLOKIR</div>
            <p className="font-normal mt-1 leading-relaxed">
              Alasan: {currentUser.blockedReason || 'Kualitas setoran (trusted) 0% atau pelanggaran sistem'}.
            </p>
          </div>
        </div>
      )}

      {/* 1. HEADER PROFILE CARD - GRADIENT BLUE TO CYAN (MATCHING SCREENSHOT 4) */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center space-y-2.5">
          {/* Avatar circle with letter initial & camera icon */}
          <div className="relative">
            <UserAvatar
              nameOrEmail={currentUser.email || currentUser.name}
              avatarUrl={currentUser.avatar}
              size="xl"
              className="border-4 border-white/80 shadow-lg text-4xl"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white shadow-xs">
              <Camera className="w-3 h-3" />
            </div>
          </div>

          <div>
            <h1 className="text-lg font-extrabold tracking-tight">{currentUser.name}</h1>
            <p className="text-xs text-blue-100 font-mono mt-0.5">{currentUser.email}</p>
          </div>

          {/* Photo Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                const url = prompt('Masukkan URL foto profil baru:');
                if (url) updateUserProfile({ avatar: url });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs border border-white/30"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Ganti Foto</span>
            </button>

            {currentUser.avatar && (
              <button
                onClick={() => updateUserProfile({ avatar: undefined })}
                className="px-3 py-1.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs border border-rose-400/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PROFILE FIELDS TABLE (MATCHING SCREENSHOT 4) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 divide-y divide-slate-100">
        {/* UID */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">UID</span>
          <div 
            onClick={handleCopyUid}
            className="flex items-center gap-1 font-mono text-slate-900 font-medium truncate max-w-[200px] cursor-pointer hover:text-indigo-600"
            title="Klik untuk salin UID"
          >
            <span className="truncate">{currentUser.id}</span>
            {copiedUid ? <Check className="w-3 h-3 text-emerald-600 shrink-0" /> : <Copy className="w-3 h-3 text-slate-400 shrink-0" />}
          </div>
        </div>

        {/* EMAIL */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">EMAIL</span>
          <span className="font-mono text-slate-900 font-medium truncate">{currentUser.email}</span>
        </div>

        {/* NOMOR DANA */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">NOMOR DANA</span>
          {isEditingDana ? (
            <form onSubmit={handleSaveDana} className="flex items-center gap-1">
              <input
                type="text"
                value={editDanaInput}
                onChange={(e) => setEditDanaInput(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-mono font-bold w-32"
              />
              <button type="submit" className="p-1 bg-indigo-600 text-white rounded-lg">
                <Save className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <span 
              onClick={() => setIsEditingDana(true)}
              className="font-mono text-slate-900 font-bold cursor-pointer hover:text-indigo-600"
              title="Klik untuk ubah"
            >
              {currentUser.danaNumber || 'Belum diisi (Klik Ubah)'}
            </span>
          )}
        </div>

        {/* ROLE */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">ROLE</span>
          <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] uppercase ${
            currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
          }`}>
            {currentUser.role}
          </span>
        </div>

        {/* TANGGAL GABUNG */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">TANGGAL GABUNG</span>
          <span className="font-mono text-slate-900">{currentUser.joinedAt}</span>
        </div>

        {/* KATA SANDI DIUBAH */}
        <div className="py-2.5 flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">KATA SANDI DIUBAH</span>
          <span className="font-mono text-slate-500">{currentUser.passwordChangedAt || 'Belum pernah'}</span>
        </div>
      </div>

      {/* 3. STATISTIK TOTAL GRID 2X2 (MATCHING SCREENSHOT 4) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <span>🏆</span>
          <span>Statistik Total</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* TOTAL STORAN */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Storan</div>
            <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
              {currentUser.totalSubmissions}
            </div>
          </div>

          {/* DITERIMA */}
          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-700 uppercase">Diterima</div>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
              {currentUser.acceptedCount}
            </div>
          </div>

          {/* DITOLAK */}
          <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200">
            <div className="text-[10px] font-bold text-rose-700 uppercase">Ditolak</div>
            <div className="text-lg font-black text-rose-700 font-mono mt-0.5">
              {currentUser.rejectedCount}
            </div>
          </div>

          {/* PENDING */}
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
            <div className="text-[10px] font-bold text-amber-700 uppercase">Pending</div>
            <div className="text-lg font-black text-amber-700 font-mono mt-0.5">
              {currentUser.pendingCount}
            </div>
          </div>
        </div>
      </div>

      {/* 4. KEAMANAN AKUN (MATCHING SCREENSHOT 4) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>🔑</span>
          <span>Keamanan Akun</span>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            <span>Buat Kata Sandi / Ubah Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 5. LOGOUT */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      {/* MODAL UBAH PASSWORD */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Ubah Kata Sandi</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ulangi kata sandi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Simpan Kata Sandi Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
