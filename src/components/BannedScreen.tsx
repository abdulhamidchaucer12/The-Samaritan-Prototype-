import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  HelpCircle,
  RefreshCw,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Crown,
  FileText,
} from 'lucide-react';
import { BannedUserRecord, CitizenBanAppeal } from '../types';
import {
  submitCitizenBanAppeal,
  getCitizenBanAppeals,
} from '../utils/adminManagement';

interface BannedScreenProps {
  banRecord?: BannedUserRecord;
  language: 'en' | 'sw';
  onRefresh: () => void;
}

export const BannedScreen: React.FC<BannedScreenProps> = ({
  banRecord,
  language,
  onRefresh,
}) => {
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [appealFeedback, setAppealFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if citizen already has a pending appeal
  const citizenAppeals = getCitizenBanAppeals();
  const currentAppeal = banRecord
    ? citizenAppeals.find(
        (a) => a.username.toLowerCase() === banRecord.username.toLowerCase().replace(/^@/, '')
      )
    : undefined;

  // Calculate remaining time if temporary
  let remainingText = '';
  if (banRecord?.banType === 'temporary' && banRecord.expiresAt) {
    const msLeft = new Date(banRecord.expiresAt).getTime() - Date.now();
    if (msLeft > 0) {
      const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      remainingText =
        language === 'en'
          ? `${days} day${days > 1 ? 's' : ''} remaining (Expires: ${new Date(banRecord.expiresAt).toLocaleDateString()})`
          : `Zimesalia siku ${days} (Inamalizika: ${new Date(banRecord.expiresAt).toLocaleDateString()})`;
    } else {
      remainingText = language === 'en' ? 'Suspension expired. Click refresh to restore access.' : 'Muda wa kusimamishwa umekwisha. Bofya upya kurejesha ufikiaji.';
    }
  }

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banRecord?.username) return;
    setIsSubmitting(true);
    setAppealFeedback(null);

    const res = submitCitizenBanAppeal(banRecord.username, appealText);
    setIsSubmitting(false);

    if (res.success) {
      setAppealFeedback({
        type: 'success',
        message:
          language === 'en'
            ? 'Appeal submitted successfully! Transmitted directly to Executive Administration and The_Samaritan.'
            : 'Rufaa imewasilishwa! Imetumwa moja kwa moja kwa Uongozi Mkuu na The_Samaritan.',
      });
      setAppealText('');
      setTimeout(() => {
        setIsAppealModalOpen(false);
        onRefresh();
      }, 2000);
    } else {
      setAppealFeedback({
        type: 'error',
        message: res.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600 animate-pulse" />

        <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Access Restricted' : 'Ufikiaji Umezuiwa'}</span>
            </div>

            {banRecord?.isSuperBan && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>The_Samaritan Super Authority</span>
              </div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white">
            {banRecord?.banType === 'temporary'
              ? language === 'en'
                ? 'Temporary Account Suspension'
                : 'Akaunti Imesimamishwa kwa Muda'
              : language === 'en'
              ? 'Platform Access Revoked'
              : 'Upatikanaji wa Mfumo Umesitishwa'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'en'
              ? 'Your account has been suspended under Article 10 and Chapter Six of the Constitution of Kenya 2010. You cannot log into the platform during this period.'
              : 'Akaunti yako imesimamishwa kulingana na Kifungu cha 10 na Sura ya Sita ya Katiba ya Kenya 2010. Huwezi kuingia kwenye mfumo wakati huu.'}
          </p>
        </div>

        {banRecord && (
          <div className="bg-slate-950/80 rounded-2xl p-4 text-left border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-slate-800/80 pb-1.5 text-slate-400">
              <span>{language === 'en' ? 'Account Handle:' : 'Jina la Akaunti:'}</span>
              <span className="font-mono text-slate-200 font-bold">
                {banRecord.username ? (banRecord.username.startsWith('@') ? banRecord.username : `@${banRecord.username}`) : 'Anonymous User'}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-800/80 pb-1.5 text-slate-400">
              <span>{language === 'en' ? 'Restriction Type:' : 'Aina ya Zuio:'}</span>
              <span className="font-bold flex items-center gap-1 text-slate-200">
                {banRecord.banType === 'temporary' ? (
                  <>
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300">{language === 'en' ? 'Temporary Suspension' : 'Kusimamishwa kwa Muda'}</span>
                  </>
                ) : (
                  <span className="text-red-400">{language === 'en' ? 'Permanent Restriction' : 'Zuio la Kudumu'}</span>
                )}
              </span>
            </div>

            {banRecord.banType === 'temporary' && remainingText && (
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5 text-slate-400">
                <span>{language === 'en' ? 'Time Remaining:' : 'Muda Uliosalia:'}</span>
                <span className="text-amber-300 font-bold font-mono text-[11px]">{remainingText}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-slate-800/80 pb-1.5 text-slate-400">
              <span>{language === 'en' ? 'Enforced By:' : 'Imewekwa na:'}</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                {banRecord.isSuperBan && <Crown className="w-3 h-3" />}
                {banRecord.bannedBy}
              </span>
            </div>

            <div className="pt-1">
              <span className="text-slate-400 block mb-0.5">{language === 'en' ? 'Reason Cited:' : 'Sababu:'}</span>
              <p className="text-red-300 italic text-[11px] leading-relaxed">{banRecord.reason}</p>
            </div>
          </div>
        )}

        {/* Appeal Status or Button */}
        {currentAppeal ? (
          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-xs text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{language === 'en' ? 'Article 47 Appeal Status' : 'Hali ya Rufaa (Kifungu 47)'}</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  currentAppeal.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : currentAppeal.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {currentAppeal.status === 'pending'
                  ? language === 'en' ? 'Under Review' : 'Inakaguliwa'
                  : currentAppeal.status === 'approved'
                  ? language === 'en' ? 'Approved & Granted' : 'Imekubaliwa'
                  : language === 'en' ? 'Appeal Rejected' : 'Imekataliwa'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] italic">"{currentAppeal.appealText}"</p>
            <p className="text-[10px] text-slate-400">
              {language === 'en' ? 'Submitted: ' : 'Iliwasilishwa: '}
              {new Date(currentAppeal.submittedAt).toLocaleDateString()}
            </p>
            {currentAppeal.resolutionNotes && (
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-slate-400 block">{language === 'en' ? 'Executive Resolution:' : 'Uamuzi wa Uongozi:'}</span>
                {currentAppeal.resolutionNotes}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200 text-left space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-300">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{language === 'en' ? 'Article 47 Due Process & Right of Reply' : 'Haki ya Kikatiba ya Rufaa (Kifungu 47)'}</span>
            </p>
            <p className="text-[11px] text-amber-100/80 leading-relaxed">
              {language === 'en'
                ? 'Under Article 47 (Fair Administrative Action), every citizen has the constitutional right to be heard and request administrative reconsideration.'
                : 'Chini ya Kifungu cha 47 (Utawala wa Haki), kila mwananchi anayo haki ya kikatiba kusikilizwa na kuomba mapitio ya uamuzi.'}
            </p>
            <button
              onClick={() => setIsAppealModalOpen(true)}
              className="mt-1 w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Submit Due Process Appeal' : 'Wasilisha Rufaa ya Kikatiba'}</span>
            </button>
          </div>
        )}

        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 active:scale-98"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Check Access Status' : 'Angalia Hali ya Ufikiaji'}</span>
        </button>
      </div>

      {/* Article 47 Due Process Appeal Modal */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-serif text-white">
                  {language === 'en' ? 'Article 47 Due Process Appeal' : 'Rufaa ya Utawala wa Haki (Kifungu 47)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAppealModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Your appeal will be transmitted directly to Admin 3, Admin 4, and The_Samaritan for formal review against Article 10 and Chapter Six standards.'
                : 'Rufaa yako itatumwa moja kwa moja kwa Admin 3, Admin 4, na The_Samaritan kwa mapitio rasmi kulingana na viwango vya Kifungu cha 10 na Sura ya Sita.'}
            </p>

            {appealFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  appealFeedback.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/60 border border-red-500/40 text-red-200'
                }`}
              >
                {appealFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{appealFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAppeal} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {language === 'en' ? 'Your Statement / Explanation:' : 'Maelezo Yako ya Rufaa:'}
                </label>
                <textarea
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                  rows={4}
                  required
                  placeholder={
                    language === 'en'
                      ? 'Explain the circumstances, your commitment to civic respect, or why this restriction should be lifted...'
                      : 'Eleza mazingira, nia yako ya kuheshimu miongozo ya kijamii, au sababu za kuondolewa kwa zuio hili...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  {language === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || appealText.trim().length < 15}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? language === 'en' ? 'Submitting...' : 'Inawasilisha...'
                      : language === 'en' ? 'Transmit Appeal' : 'Tuma Rufaa'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
