import React, { useEffect } from 'react';
import { Users, X, ArrowRight, Shield, Radio, Sparkles } from 'lucide-react';
import { Language, AuthUser } from '../types';
import { ActiveUserSession } from '../utils/userPresence';
import { UserBadge } from './UserBadge';
import { getUserCounty } from '../utils/authAndQuestions';

interface LoginOnlineUsersToastProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  language: Language;
  onViewOnlineUsers: () => void;
  otherOnlineUsers: ActiveUserSession[];
}

export const LoginOnlineUsersToast: React.FC<LoginOnlineUsersToastProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onViewOnlineUsers,
  otherOnlineUsers,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    // Auto-dismiss after 12 seconds if not interacted
    const timer = setTimeout(() => {
      onClose();
    }, 12000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  const count = otherOnlineUsers.length;

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/80 dark:border-emerald-500/60 shadow-2xl rounded-2xl overflow-hidden p-4 text-slate-900 dark:text-slate-100">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <UserBadge username={currentUser.username} size="md" showAvatar />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-2xs" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate font-serif">
                  {language === 'en' ? `Welcome, ${currentUser.username}!` : `Karibu, ${currentUser.username}!`}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  ONLINE 🟢
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                {count > 0 ? (
                  language === 'en' ? (
                    <span>
                      <strong>{count} other user{count > 1 ? 's' : ''}</strong> {count > 1 ? 'are' : 'is'} active online right now!
                    </span>
                  ) : (
                    <span>
                      Watumiaji wengine <strong>{count}</strong> wapo mtandaoni sasa!
                    </span>
                  )
                ) : (
                  language === 'en' ? (
                    'You are connected live to The Samaritan national civic network.'
                  ) : (
                    'Umeunganishwa moja kwa moja kwenye mtandao wa The Samaritan.'
                  )
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title={language === 'en' ? 'Dismiss' : 'Funga'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Avatars Row if other users exist */}
        {count > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
            <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
              {otherOnlineUsers.slice(0, 5).map((u) => {
                const county = u.county || getUserCounty(u.username);
                return (
                  <div
                    key={u.id}
                    className="inline-block ring-2 ring-white dark:ring-slate-900 rounded-full"
                    title={`${u.username} • ${county} (${u.currentAction || u.currentSection})`}
                  >
                    <UserBadge username={u.username} size="sm" showAvatar />
                  </div>
                );
              })}
              {count > 5 && (
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  +{count - 5}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right truncate">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {otherOnlineUsers[0]?.username}
              </span>
              {count > 1 ? ` +${count - 1} more` : ''}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onViewOnlineUsers();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'See Who\'s Online' : 'Tazama Walio Mtandaoni'}</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'en' ? 'Later' : 'Baadaye'}
          </button>
        </div>
      </div>
    </div>
  );
};
