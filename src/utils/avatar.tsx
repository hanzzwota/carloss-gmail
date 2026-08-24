import React from 'react';

const AVATAR_COLORS = [
  'bg-purple-600 text-white',
  'bg-indigo-600 text-white',
  'bg-blue-600 text-white',
  'bg-cyan-600 text-white',
  'bg-emerald-600 text-white',
  'bg-teal-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-violet-600 text-white',
  'bg-sky-600 text-white',
];

export function getAvatarInitial(nameOrEmail?: string): string {
  if (!nameOrEmail) return 'U';
  const clean = nameOrEmail.trim();
  if (!clean) return 'U';
  return clean.charAt(0).toUpperCase();
}

export function getAvatarColorClass(nameOrEmail?: string): string {
  if (!nameOrEmail) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < nameOrEmail.length; i++) {
    hash = nameOrEmail.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface UserAvatarProps {
  nameOrEmail?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  nameOrEmail,
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  const initial = getAvatarInitial(nameOrEmail);
  const colorClass = getAvatarColorClass(nameOrEmail);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg font-bold',
    xl: 'w-20 h-20 text-3xl font-extrabold',
  };

  if (avatarUrl && !avatarUrl.includes('default-user')) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs ${className}`}>
        <img src={avatarUrl} alt={nameOrEmail || 'Avatar'} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold tracking-tight shrink-0 shadow-2xs select-none ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
};
