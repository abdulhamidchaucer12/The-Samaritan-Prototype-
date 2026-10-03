import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Clock, Radio, UserCheck } from 'lucide-react';
import {
  getAdminOnlineStatus,
  recordAdminActivity,
  getCurrentAuthUser,
  AdminOnlineInfo,
} from '../utils/authAndQuestions';
import { Language } from '../types';

interface AdminOnlineStatusBadgeProps {
  language: Language;
  variant?: 'compact' | 'detailed' | 'card';
  className?: string;
}

export const AdminOnlineStatusBadge: React.FC<AdminOnlineStatusBadgeProps> = ({
  language,
  variant = 'compact',
  className = '',
}) => {
  const [status, setStatus] = useState<AdminOnlineInfo>(() => getAdminOnlineStatus());
  const currentUser = getCurrentAuthUser();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    // Initial fetch
    setStatus(getAdminOnlineStatus());

    // Update status every 30 seconds
    const interval = setInterval(() => {
      setStatus(getAdminOnlineStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAdminHeartbeat = () => {
    if (isAdmin) {
      recordAdminActivity(currentUser?.username);
      setStatus(getAdminOnlineStatus());
    }
  };

  if (variant === 'compact') {
    const isOperator = status.onlineAdminsCount === 0;
    const defaultColorClasses = status.isOnline
      ? isOperator
        ? 'bg-blue-50 text-blue-950 border-blue-200 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700/60 shadow-2xs'
        : 'bg-emerald-50 text-emerald-950 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-600/60 shadow-2xs'
      : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700';

    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
          className ? className : defaultColorClasses
        }`}
        title={status.dutySchedule[language]}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOperator ? 'bg-blue-500' : 'bg-emerald-500'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOperator ? 'bg-blue-600' : 'bg-emerald-500'
            }`}
          />
        </span>
        <span className="truncate">
          {status.onlineAdminsCount > 1
            ? language === 'en'
              ? `${status.onlineAdminsCount} admins online`
              : `Wasimamizi ${status.onlineAdminsCount} wako mtandaoni`
            : status.onlineAdminsCount === 1
            ? language === 'en'
              ? '1 admin online'
              : 'Msimamizi 1 yuko mtandaoni'
            : language === 'en'
            ? 'Operator online'
            : 'Opereta yuko mtandaoni'}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    const isOperator = status.onlineAdminsCount === 0;

    return (
      <div
        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
          isOperator
            ? 'bg-blue-50/90 border-blue-200 text-blue-950 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-100'
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isOperator ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isOperator ? (
              <Shield className="w-3.5 h-3.5" />
            ) : (
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold flex items-center gap-1.5 truncate">
              <span>
                {status.onlineAdminsCount > 1
                  ? language === 'en'
                    ? `${status.onlineAdminsCount} admins online`
                    : `Wasimamizi ${status.onlineAdminsCount} wako mtandaoni`
                  : status.onlineAdminsCount === 1
                  ? language === 'en'
                    ? '1 admin online'
                    : 'Msimamizi 1 yuko mtandaoni'
                  : language === 'en'
                  ? 'Operator online'
                  : 'Opereta yuko mtandaoni'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping shrink-0 ${
                  isOperator ? 'bg-blue-600' : 'bg-emerald-600'
                }`}
              />
            </div>
            <div className="text-[11px] opacity-80 truncate">
              {status.dutySchedule[language]}
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleAdminHeartbeat}
            className="shrink-0 px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-stone-100 dark:hover:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-lg text-[11px] font-bold text-stone-800 dark:text-stone-200 shadow-2xs transition-colors flex items-center gap-1"
          >
            <UserCheck className="w-3 h-3 text-emerald-600" />
            <span>{language === 'en' ? 'Signal On Duty' : 'Sasisha Upo Hewani'}</span>
          </button>
        )}
      </div>
    );
  }

  // Card Variant
  const isOperator = status.onlineAdminsCount === 0;

  return (
    <div
      className={`p-4 rounded-2xl border shadow-xs space-y-2 ${
        isOperator
          ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border-blue-300 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-800'
          : 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-300 dark:from-emerald-950/40 dark:to-teal-950/40 dark:border-emerald-800'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOperator ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOperator ? 'bg-blue-500' : 'bg-emerald-500'
              }`}
            />
          </span>
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
            {status.onlineAdminsCount > 1
              ? language === 'en'
                ? `${status.onlineAdminsCount} admins online`
                : `Wasimamizi ${status.onlineAdminsCount} wako mtandaoni`
              : status.onlineAdminsCount === 1
              ? language === 'en'
                ? '1 admin online'
                : 'Msimamizi 1 yuko mtandaoni'
              : language === 'en'
              ? 'Operator online'
              : 'Opereta yuko mtandaoni'}
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
            isOperator
              ? 'bg-blue-200/80 text-blue-950 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-emerald-200/80 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-200'
          }`}
        >
          {isOperator ? '24/7 Live' : 'Active'}
        </span>
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
        {status.onlineAdminsCount > 0
          ? language === 'en'
            ? `${status.onlineAdminsCount} civic administrator(s) are active on duty. Citizen inquiries and AI citations are reviewed swiftly in real time.`
            : `Wasimamizi wa kiraia ${status.onlineAdminsCount} wapo mtandaoni. Maswali ya wananchi na manukuu ya AI yanakaguliwa mara moja.`
          : language === 'en'
          ? 'AI Constitutional Operator is active 24/7. Citizen inquiries are analyzed under the Constitution of Kenya 2010 and queued for administrative review.'
          : 'Opereta wa Kikatiba wa AI yuko hewani 24/7. Maswali ya wananchi yanachambuliwa chini ya Katiba ya Kenya 2010 na kuwekwa tayari kwa ukaguzi wa wasimamizi.'}
      </p>
    </div>
  );
};
