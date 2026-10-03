import React from 'react';
import { CheckCircle2, Shield, Award, User as UserIcon } from 'lucide-react';
import { getUserRoleMeta } from '../utils/adminManagement';
import { getUserAvatar } from '../utils/authAndQuestions';

interface UserBadgeProps {
  username?: string | null;
  showRoleLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  forceGold?: boolean;
  forceBlue?: boolean;
  hideName?: boolean;
  showAvatar?: boolean;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  username,
  showRoleLabel = false,
  size = 'sm',
  className = '',
  forceGold = false,
  forceBlue = false,
  hideName = false,
  showAvatar = false,
}) => {
  if (!username) return null;

  const roleMeta = getUserRoleMeta(username);
  const badgeType = forceGold ? 'gold' : forceBlue ? 'blue' : roleMeta.badgeType;
  const isBoldGold = roleMeta.isBoldGold;
  const userAvatar = showAvatar ? getUserAvatar(username) : null;

  // Sizes for the verified icon
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const avatarSizes = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const textSizes = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      {/* Profile Picture / Avatar */}
      {showAvatar && (
        <span className={`${avatarSizes[size]} rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 shadow-2xs`}>
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={username}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{username.replace('@', '').slice(0, 1).toUpperCase()}</span>
          )}
        </span>
      )}

      {/* Username with styling */}
      {!hideName && (
        <span
          className={`tracking-tight ${textSizes[size]} ${
            isBoldGold
              ? 'font-extrabold text-amber-500 dark:text-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.25)]'
              : badgeType === 'blue'
              ? 'font-semibold text-blue-700 dark:text-blue-300'
              : 'font-semibold text-slate-800 dark:text-slate-200'
          }`}
        >
          {username}
        </span>
      )}

      {/* Badges */}
      {badgeType === 'gold_double_tick' && (
        <span
          title={`${username} • Verified Executive Super Badge (Gold with Double Ticks)`}
          className="inline-flex items-center text-amber-500 hover:text-amber-600 transition-transform hover:scale-110"
        >
          {/* Golden Twitter/X-like badge with two internal ticks */}
          <span className="relative inline-flex items-center justify-center">
            {/* Scalloped / Rosette badge background SVG with gold fill */}
            <svg
              viewBox="0 0 24 24"
              className={`${iconSizes[size]} text-amber-500 fill-amber-500 drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]`}
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4z" />
            </svg>
            {/* Two clean ticks inside */}
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 w-full h-full text-slate-950 stroke-slate-950 fill-none stroke-[2.8]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* First left tick */}
              <polyline points="5.5 12.5 8.5 15.5 14 9.5" />
              {/* Second right overlapping tick */}
              <polyline points="10 12.5 13 15.5 18.5 9.5" />
            </svg>
          </span>
        </span>
      )}

      {(badgeType === 'gold_bold' || badgeType === 'gold') && (
        <span
          title={`${username} • Verified Civic Administrator (Gold Badge)`}
          className="inline-flex items-center text-amber-500 hover:text-amber-600 transition-colors"
        >
          <CheckCircle2
            className={`${iconSizes[size]} text-amber-500 fill-amber-100 dark:fill-amber-950/80 stroke-[2.5]`}
          />
        </span>
      )}

      {badgeType === 'blue' && (
        <span
          title={`${username} • Verified Temporary Civic Administrator (Blue Badge)`}
          className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <CheckCircle2
            className={`${iconSizes[size]} text-blue-600 fill-blue-100 dark:fill-blue-950/80 stroke-[2.5]`}
          />
        </span>
      )}

      {/* Role Pill */}
      {showRoleLabel && roleMeta.adminLevel !== 'citizen' && (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isBoldGold
              ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
              : badgeType === 'gold'
              ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              : 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
          }`}
        >
          {isBoldGold ? <Award className="w-2.5 h-2.5" /> : <Shield className="w-2.5 h-2.5" />}
          <span>{roleMeta.roleTitle.en}</span>
        </span>
      )}
    </span>
  );
};
