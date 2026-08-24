import React, { useState } from 'react';
import { 
  Bell, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  Sparkles,
  Zap,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../utils/avatar';

interface HeaderProps {
  onOpenSaluranWA: () => void;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onOpenPublicPage: (page: 'harga' | 'carabeli' | 'kontak') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSaluranWA, onOpenAuth, onOpenPublicPage }) => {
  const { 
    currentUser, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsRead, 
    setActiveTab, 
    activeTab,
    isAdminMode, 
    setIsAdminMode,
    settings,
    logout
  } = useApp();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo: Blue Mail Icon + S3L Carlos69 */}
        <div 
          onClick={() => setActiveTab('beranda')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 font-bold tracking-tight">
            <span className="text-slate-900 text-sm font-semibold">S3L GMAIL</span>
            <span className="text-blue-600 text-sm font-black">{settings.namaDashboard || 'CARLOS69'}</span>
          </div>
        </div>

        {/* Public Navigation Menu: Beranda | Harga | Cara Beli | Kontak */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'beranda' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => onOpenPublicPage('harga')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Harga
          </button>
          <button
            onClick={() => onOpenPublicPage('carabeli')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cara Beli
          </button>
          <button
            onClick={() => onOpenPublicPage('kontak')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Kontak
          </button>
        </nav>

        {/* Right Actions: Login/Daftar OR User Pill & Saluran WA */}
        <div className="flex items-center gap-2">
          {/* Saluran WA Pill */}
          <button
            onClick={onOpenSaluranWA}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Saluran WA</span>
          </button>

          {/* If NOT logged in: Tombol Login & Daftar */}
          {!currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-95 text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Daftar</span>
              </button>
            </div>
          ) : (
            <>
              {/* Quick Admin/User toggle chip */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    setActiveTab(isAdminMode ? 'beranda' : 'admin');
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    isAdminMode 
                      ? 'bg-slate-900 text-blue-400 border border-slate-700 shadow-xs' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                  title="Ganti Mode Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAdminMode ? 'Mode Admin' : 'Panel Admin'}</span>
                </button>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  title="Notifikasi"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown Panel */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-xs text-slate-900">Notifikasi Real-Time</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Baca Semua
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">
                          Belum ada notifikasi
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.linkTab) {
                                setActiveTab(n.linkTab);
                                setShowNotifDropdown(false);
                              }
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                              !n.read ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className={`text-xs font-bold ${
                                n.type === 'success' ? 'text-emerald-700' :
                                n.type === 'error' ? 'text-rose-600' :
                                n.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                              }`}>
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {n.createdAt.split(' ')[1] || n.createdAt}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate hidden xs:inline">
                    {currentUser.name}
                  </span>
                  <UserAvatar
                    nameOrEmail={currentUser.email || currentUser.name}
                    avatarUrl={currentUser.avatar}
                    size="sm"
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
                    <div className="px-3.5 py-2">
                      <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200">
                        {currentUser.trustBadge || '100% • Seller'}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('profil');
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Profil Saya</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('saldo');
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                      >
                        <span>Saldo: Rp{currentUser.saldo.toLocaleString('id-ID')}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setIsAdminMode(true);
                            setActiveTab('admin');
                            setShowUserDropdown(false);
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs font-bold text-blue-700 hover:bg-blue-50 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Panel Admin</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
