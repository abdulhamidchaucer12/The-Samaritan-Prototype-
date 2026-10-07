import React, { useState, useEffect } from 'react';
import {
  Shield,
  UserCheck,
  CheckCircle2,
  Crown,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Save,
  Award,
  Users,
  User,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import {
  getAdminAppointmentProfiles,
  allocateAdminName,
  resetAdminAppointmentsToDefault,
  AdminAppointedProfile,
  getAdminPlatformAddressingName,
} from '../utils/adminAppointments';

interface AdminNameAllocationConsoleProps {
  language: Language;
  currentUser?: AuthUser | null;
  onRefresh?: () => void;
}

interface AdminFormState {
  fullName: string;
  positionEn: string;
  positionSw: string;
  scope: string;
}

export const AdminNameAllocationConsole: React.FC<AdminNameAllocationConsoleProps> = ({
  language,
  currentUser,
  onRefresh,
}) => {
  const isSamaritan = Boolean(
    currentUser?.username &&
      (currentUser.username.toLowerCase() === 'the_samaritan' ||
        currentUser.username.toLowerCase() === '@the_samaritan' ||
        currentUser.username.toLowerCase() === 'the samaritan' ||
        currentUser.username.toLowerCase() === 'sir chaucer')
  );

  const [activeFilter, setActiveFilter] = useState<'all' | 'self' | 'subordinates'>('all');

  const getInitialForms = (current: Record<string, AdminAppointedProfile>): Record<string, AdminFormState> => ({
    'The_Samaritan': {
      fullName: current['The_Samaritan']?.appointedName || 'Sir Chaucer (Abdulhamid Chaucer)',
      positionEn: current['The_Samaritan']?.officialPosition || 'Platform Architect & Lead Civic Facilitator',
      positionSw: current['The_Samaritan']?.officialPositionSw || 'Msanifu Mkuu wa Mfumo na Mwezeshaji Kiongozi',
      scope:
        current['The_Samaritan']?.assignedScope ||
        'Supreme Administrative Authority & National Civic Education Architecture',
    },
    '@admin.kfe1': {
      fullName: current['@admin.kfe1']?.appointedName || 'Mwanaisha Omar',
      positionEn: current['@admin.kfe1']?.officialPosition || 'Program Associate',
      positionSw: current['@admin.kfe1']?.officialPositionSw || 'Afisa Mshirika wa Miradi',
      scope:
        current['@admin.kfe1']?.assignedScope ||
        'Curriculum Integrity, Lesson Authoring & Nationwide Civic Literacy',
    },
    '@admin.kfe2': {
      fullName: current['@admin.kfe2']?.appointedName || 'Abas Mwayanga',
      positionEn: current['@admin.kfe2']?.officialPosition || 'Project Officer',
      positionSw: current['@admin.kfe2']?.officialPositionSw || 'Afisa wa Miradi',
      scope:
        current['@admin.kfe2']?.assignedScope ||
        'County Community Mobilization, Q&A Verification & Devolution Barazas',
    },
    '@admin.kfe3': {
      fullName: current['@admin.kfe3']?.appointedName || 'Salim Mwadzaya',
      positionEn: current['@admin.kfe3']?.officialPosition || 'Director of Compliance & Constitutional Adjudication',
      positionSw: current['@admin.kfe3']?.officialPositionSw || 'Mkurugenzi wa Uzingatiaji na Maadili ya Kikatiba',
      scope:
        current['@admin.kfe3']?.assignedScope ||
        'Due Process Enforcement, Appeals Review & Platform Integrity',
    },
    '@admin.kfe4': {
      fullName: current['@admin.kfe4']?.appointedName || 'Fatuma Hassan',
      positionEn: current['@admin.kfe4']?.officialPosition || 'Executive Director & Certification Authority',
      positionSw: current['@admin.kfe4']?.officialPositionSw || 'Mkurugenzi Mtendaji na Mamlaka ya Vyeti',
      scope:
        current['@admin.kfe4']?.assignedScope ||
        'Institutional Governance, Cryptographic Registry & Strategic Partnerships',
    },
  });

  const [profiles, setProfiles] = useState<Record<string, AdminAppointedProfile>>(() =>
    getAdminAppointmentProfiles()
  );

  const [adminForms, setAdminForms] = useState<Record<string, AdminFormState>>(() => {
    const p = getAdminAppointmentProfiles();
    return getInitialForms(p);
  });

  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const reloadProfiles = () => {
    const current = getAdminAppointmentProfiles();
    setProfiles(current);
    setAdminForms(getInitialForms(current));
  };

  useEffect(() => {
    const handleUpdate = () => {
      reloadProfiles();
    };
    window.addEventListener('the_samaritan_admin_names_updated', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_admin_names_updated', handleUpdate);
    };
  }, []);

  const handleFieldChange = (key: string, field: keyof AdminFormState, val: string) => {
    setAdminForms((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
  };

  const handleSaveSingleAdmin = (
    key: 'The_Samaritan' | '@admin.kfe1' | '@admin.kfe2' | '@admin.kfe3' | '@admin.kfe4'
  ) => {
    if (!isSamaritan) {
      setFeedbackMsg({
        type: 'error',
        text:
          language === 'en'
            ? 'Super Authority Required: Only The_Samaritan can allocate administrator names.'
            : 'Mamlaka Makuu Yanahitajika: The_Samaritan pekee ndiye anayeweza kugawa majina ya wasimamizi.',
      });
      return;
    }

    const form = adminForms[key];
    if (!form || !form.fullName.trim()) {
      setFeedbackMsg({
        type: 'error',
        text: language === 'en' ? 'Please provide a valid full name.' : 'Tafadhali weka jina kamili.',
      });
      return;
    }

    setSavingKey(key);
    const result = allocateAdminName(key, form.fullName.trim(), 'The_Samaritan', {
      officialPosition: form.positionEn.trim(),
      officialPositionSw: form.positionSw.trim(),
      assignedScope: form.scope.trim(),
    });

    setSavingKey(null);

    if (result.success) {
      const isSelf = key === 'The_Samaritan';
      setFeedbackMsg({
        type: 'success',
        text:
          language === 'en'
            ? isSelf
              ? `Self-Allocation Confirmed: Your name in The_Samaritan account has been officially set to "${form.fullName.trim()}". The Platform will now address you as "${result.addressingName}" upon login and across the platform.`
              : `Confirmed: ${key} allocated to "${form.fullName.trim()}". The Platform will now address them as "${result.addressingName}" upon login.`
            : isSelf
            ? `Imethibitishwa: Jina lako katika akaunti ya The_Samaritan limetengwa kuwa "${form.fullName.trim()}". Mfumo utakutambua kama "${result.addressingName}" unapoingia.`
            : `Imethibitishwa: ${key} ametengewa jina "${form.fullName.trim()}". Mfumo sasa utamtambua kama "${result.addressingName}" atakapoingia.`,
      });
      reloadProfiles();
      if (onRefresh) onRefresh();
      setTimeout(() => setFeedbackMsg(null), 6000);
    } else {
      setFeedbackMsg({ type: 'error', text: result.message });
    }
  };

  const handleBatchSaveAll = () => {
    if (!isSamaritan) {
      setFeedbackMsg({
        type: 'error',
        text: 'Only The_Samaritan possesses Super Authority to allocate names.',
      });
      return;
    }

    setSavingKey('all');
    const keys: ('The_Samaritan' | '@admin.kfe1' | '@admin.kfe2' | '@admin.kfe3' | '@admin.kfe4')[] = [
      'The_Samaritan',
      '@admin.kfe1',
      '@admin.kfe2',
      '@admin.kfe3',
      '@admin.kfe4',
    ];

    let successCount = 0;
    keys.forEach((k) => {
      const f = adminForms[k];
      if (f && f.fullName.trim()) {
        allocateAdminName(k, f.fullName.trim(), 'The_Samaritan', {
          officialPosition: f.positionEn.trim(),
          officialPositionSw: f.positionSw.trim(),
          assignedScope: f.scope.trim(),
        });
        successCount++;
      }
    });

    setSavingKey(null);
    setFeedbackMsg({
      type: 'success',
      text:
        language === 'en'
          ? `Successfully saved name allocations for The_Samaritan (self-allocated) and all subordinate administrators! Platform addressing is now live for all accounts.`
          : `Majina ya wasimamizi wote pamoja na The_Samaritan yametengwa kwa ufanisi! Utambulisho mpya sasa unatumika kwenye mfumo mzima.`,
    });
    reloadProfiles();
    if (onRefresh) onRefresh();
    setTimeout(() => setFeedbackMsg(null), 6500);
  };

  const handleResetDefaults = () => {
    if (!isSamaritan) return;
    const confirmReset = window.confirm(
      language === 'en'
        ? 'Are you sure you want to restore the default administrative names and positions for all accounts (including The_Samaritan)?'
        : 'Je, una uhakika unataka kurejesha majina ya awali ya wasimamizi wote pamoja na The_Samaritan?'
    );
    if (!confirmReset) return;

    const res = resetAdminAppointmentsToDefault('The_Samaritan');
    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text:
          language === 'en'
            ? 'Restored default Kenyan devolution leadership names for The_Samaritan and Admin 1 through Admin 4.'
            : 'Majina ya kawaida ya viongozi wa ugatuzi yamerejeshwa kwa The_Samaritan na Wasimamizi 1 hadi 4.',
      });
      reloadProfiles();
      if (onRefresh) onRefresh();
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  // Helper for live addressing preview of The_Samaritan
  const samaritanForm = adminForms['The_Samaritan'] || {
    fullName: '',
    positionEn: '',
    positionSw: '',
    scope: '',
  };
  const samaritanTrimmed = samaritanForm.fullName.trim();
  const samaritanMatch = samaritanTrimmed.match(/^([^(]+)/);
  const samaritanPreviewAddressing = samaritanMatch
    ? samaritanMatch[1].trim()
    : samaritanTrimmed || 'Sir Chaucer';

  const subordinatesMetadata: {
    key: '@admin.kfe1' | '@admin.kfe2' | '@admin.kfe3' | '@admin.kfe4';
    label: string;
    alias: string;
    roleDescEn: string;
    roleDescSw: string;
    avatarColor: string;
  }[] = [
    {
      key: '@admin.kfe1',
      label: 'Admin 1',
      alias: '@admin.kfe1',
      roleDescEn: 'Curriculum Integrity, Course Lessons & National Civic Literacy',
      roleDescSw: 'Uadilifu wa Mtaala, Masomo ya Kiraia na Elimu ya Kitaifa',
      avatarColor: 'from-blue-600 to-indigo-700',
    },
    {
      key: '@admin.kfe2',
      label: 'Admin 2',
      alias: '@admin.kfe2',
      roleDescEn: 'County Mobilization, Q&A Verification & Devolution Barazas',
      roleDescSw: 'Uhamasishaji wa Kaunti, Maswali ya Raia na Mabaraza ya Ugatuzi',
      avatarColor: 'from-emerald-600 to-teal-700',
    },
    {
      key: '@admin.kfe3',
      label: 'Admin 3',
      alias: '@admin.kfe3',
      roleDescEn: 'Compliance, Article 47 Due Process Appeals & System Ethics',
      roleDescSw: 'Uzingatiaji, Rufaa za Haki za Kikatiba na Maadili ya Mfumo',
      avatarColor: 'from-amber-600 to-orange-700',
    },
    {
      key: '@admin.kfe4',
      label: 'Admin 4',
      alias: '@admin.kfe4',
      roleDescEn: 'Executive Director, Accredited Certification & Strategic Partnerships',
      roleDescSw: 'Mkurugenzi Mtendaji, Utoaji wa Vyeti Vilivyoidhinishwa na Ushirikiano',
      avatarColor: 'from-purple-600 to-pink-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Super Authority Executive Header Card */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300">
                  The_Samaritan Super Authority
                </span>
                <span className="text-[10px] font-bold text-amber-200/80">
                  Chapter Six & Article 10 Devolution Governance
                </span>
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-amber-100 mt-1">
                {language === 'en'
                  ? 'Administrator Name Allocation Console'
                  : 'Dawati Kuu la Kugawa Majina ya Wasimamizi'}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {isSamaritan && (
              <>
                <button
                  type="button"
                  onClick={handleBatchSaveAll}
                  disabled={savingKey === 'all'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-98"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>{language === 'en' ? 'Batch Save All (5)' : 'Hifadhi Yote (5)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors border border-slate-700 cursor-pointer flex items-center gap-1.5"
                  title="Restore default Kenyan names"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {language === 'en' ? 'Reset Defaults' : 'Rejesha Awali'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-amber-100/80 mt-3 leading-relaxed max-w-3xl">
          {language === 'en' ? (
            <span>
              The_Samaritan admin account holds exclusive Super Authority to allocate names for{' '}
              <strong>oneself</strong> as well as <strong>Admin 1 to Admin 4</strong>. When subordinate
              administrators log into the platform, they will be recognized as{' '}
              <strong>&quot;Admin Y&quot;</strong> (with <strong>Y</strong> being their first name). When you log
              into The_Samaritan account, you are officially addressed by your allocated self-name across the platform.
            </span>
          ) : (
            <span>
              Akaunti ya The_Samaritan ina mamlaka makuu ya kujitengea jina <strong>binafsi</strong> pamoja na kugawa majina
              kwa <strong>Admin 1 hadi Admin 4</strong>. Wasimamizi wanapoingia kwenye mfumo, watatambuliwa kama{' '}
              <strong>&quot;Admin Y&quot;</strong>, na unapoingia katika akaunti ya The_Samaritan utatambuliwa kwa jina lako ulilolitenga.
            </span>
          )}
        </p>

        {!isSamaritan && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {language === 'en'
                ? 'Read-only mode: Only The_Samaritan account can modify admin name allocations.'
                : 'Hali ya kusoma tu: Akaunti ya The_Samaritan pekee ndiyo inayoweza kubadilisha majina ya wasimamizi.'}
            </span>
          </div>
        )}
      </div>

      {/* Filter Tabs for Easy Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'All Accounts (5)' : 'Akaunti Zote (5)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('self')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeFilter === 'self'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>{language === 'en' ? 'The_Samaritan (Self-Allocation)' : 'The_Samaritan (Nafsi Yangu)'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('subordinates')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeFilter === 'subordinates'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Admin 1 to 4 (Subordinates)' : 'Admin 1 hadi 4 (Wasimamizi)'}</span>
        </button>
      </div>

      {/* Real-time Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-md'
              : 'bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-900 dark:text-rose-100 shadow-md'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="flex-1">{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. THE_SAMARITAN SELF-ALLOCATION CONSOLE CARD */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'self') && (
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500/60 shadow-xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

          {/* Top card banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                <Crown className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/40">
                    Self-Allocation
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-200/80">
                    The_Samaritan Account
                  </span>
                </div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-white mt-0.5">
                  {language === 'en'
                    ? 'The_Samaritan: Allocate Name for Oneself'
                    : 'The_Samaritan: Kujitengea Jina Lako Mwenyewe'}
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-xs self-start sm:self-center flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Super Account' : 'Akaunti Kuu'}</span>
            </span>
          </div>

          {/* LIVE ADDRESSING PREVIEW FOR THE_SAMARITAN */}
          <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'en'
                    ? 'Platform Addressing When You Log In:'
                    : 'Utambulisho wa Jukwaa Utakapoingia:'}
                </span>
              </span>
              <div className="text-base sm:text-lg font-black text-amber-100 font-serif">
                &quot;{samaritanPreviewAddressing}&quot;
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-500 text-slate-950 shadow-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Self-Identity: {samaritanPreviewAddressing}</span>
              </span>
            </div>
          </div>

          {/* Form Inputs for The_Samaritan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Allocated Name for Oneself */}
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-amber-200 mb-1">
                {language === 'en'
                  ? 'Allocated Name for Oneself in The_Samaritan Account *'
                  : 'Jina Lililotengwa kwa Ajili Yako katika Akaunti ya The_Samaritan *'}
              </label>
              <input
                type="text"
                disabled={!isSamaritan}
                value={samaritanForm.fullName}
                onChange={(e) => handleFieldChange('The_Samaritan', 'fullName', e.target.value)}
                placeholder="e.g. Sir Chaucer (Abdulhamid Chaucer) or Abdulhamid Chaucer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-500/50 bg-slate-900/90 text-xs font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
              />
              <span className="text-[11px] text-amber-200/70 mt-1 block">
                {language === 'en'
                  ? `Addressing extracted: "${samaritanPreviewAddressing}". You will be greeted and addressed across the platform as "${samaritanPreviewAddressing}".`
                  : `Utambulisho uliotolewa: "${samaritanPreviewAddressing}". Utatambuliwa kwenye mfumo kama "${samaritanPreviewAddressing}".`}
              </span>
            </div>

            {/* Official Position Title (EN) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'en' ? 'Official Position Title (English)' : 'Cheo Rasmi (Kiingereza)'}
              </label>
              <input
                type="text"
                disabled={!isSamaritan}
                value={samaritanForm.positionEn}
                onChange={(e) => handleFieldChange('The_Samaritan', 'positionEn', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
              />
            </div>

            {/* Official Position Title (SW) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'en' ? 'Official Position Title (Kiswahili)' : 'Cheo Rasmi (Kiswahili)'}
              </label>
              <input
                type="text"
                disabled={!isSamaritan}
                value={samaritanForm.positionSw}
                onChange={(e) => handleFieldChange('The_Samaritan', 'positionSw', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
              />
            </div>

            {/* Supreme Oversight Scope */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'en' ? 'Supreme Oversight Scope' : 'Eneo Kuu la Majukumu'}
              </label>
              <input
                type="text"
                disabled={!isSamaritan}
                value={samaritanForm.scope}
                onChange={(e) => handleFieldChange('The_Samaritan', 'scope', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Save Button for The_Samaritan */}
          {isSamaritan && (
            <div className="pt-2">
              <button
                type="button"
                disabled={savingKey === 'The_Samaritan' || !samaritanTrimmed}
                onClick={() => handleSaveSingleAdmin('The_Samaritan')}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>
                  {savingKey === 'The_Samaritan'
                    ? language === 'en'
                      ? 'Allocating Self-Name...'
                      : 'Inatenga Jina...'
                    : language === 'en'
                    ? `Allocate Self-Name & Set Platform Address to "${samaritanPreviewAddressing}"`
                    : `Hifadhi Jina Langu na Weka Utambulisho "${samaritanPreviewAddressing}"`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUBORDINATE ADMINISTRATORS (ADMIN 1 TO ADMIN 4) */}
      {/* ========================================================================= */}
      {(activeFilter === 'all' || activeFilter === 'subordinates') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 dark:text-slate-100">
                  {language === 'en'
                    ? 'Subordinate Administrators (Admin 1 to Admin 4)'
                    : 'Wasimamizi wa Chini (Admin 1 hadi 4)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'en'
                    ? 'Allocated names will format as "Admin Y" with Y being their first name.'
                    : 'Majina yaliyotengwa yatatambuliwa kama "Admin Y" huku Y likiwa jina lao la kwanza.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {subordinatesMetadata.map((adm) => {
              const form = adminForms[adm.key] || {
                fullName: '',
                positionEn: '',
                positionSw: '',
                scope: '',
              };
              const trimmedName = form.fullName.trim();
              const firstName = trimmedName ? trimmedName.split(/\s+/)[0] : '';
              const previewAddressing = firstName ? `Admin ${firstName}` : adm.label;
              const isCurrentlySaving = savingKey === adm.key || savingKey === 'all';

              return (
                <div
                  key={adm.key}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${adm.avatarColor} text-white flex items-center justify-center font-black text-sm shadow-md shrink-0`}
                        >
                          {firstName ? firstName.slice(0, 1).toUpperCase() : adm.label.replace('Admin ', 'A')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-serif">
                              {adm.label}
                            </h3>
                            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              ({adm.alias})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {language === 'en' ? adm.roleDescEn : adm.roleDescSw}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                        KFE Node
                      </span>
                    </div>

                    {/* LIVE ADDRESSING PREVIEW BADGE */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>
                            {language === 'en'
                              ? 'Platform Addressing When Logged In:'
                              : 'Utambulisho wa Mfumo Anapoingia:'}
                          </span>
                        </span>
                        <div className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 truncate font-serif">
                          &quot;{previewAddressing}&quot;
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Y = {firstName || '...'}</span>
                      </span>
                    </div>

                    {/* Form Inputs */}
                    <div className="space-y-3">
                      {/* Allocated Full Name */}
                      <div>
                        <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'en'
                            ? 'Allocated Admin Full Name *'
                            : 'Jina Kamili Lililotengwa la Msimamizi *'}
                        </label>
                        <input
                          type="text"
                          disabled={!isSamaritan}
                          value={form.fullName}
                          onChange={(e) => handleFieldChange(adm.key, 'fullName', e.target.value)}
                          placeholder={
                            language === 'en' ? 'e.g. Firstname Lastname' : 'mfano: Jina la Kwanza na Pili'
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                          {language === 'en'
                            ? `First name extracted: "${firstName || 'None'}" → Addressed as "Admin ${
                                firstName || 'Y'
                              }"`
                            : `Jina la kwanza: "${firstName || 'Bila'}" → Atatambuliwa kama "Admin ${
                                firstName || 'Y'
                              }"`}
                        </span>
                      </div>

                      {/* Official Position (EN) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'en' ? 'Official Position Title' : 'Cheo Rasmi'}
                        </label>
                        <input
                          type="text"
                          disabled={!isSamaritan}
                          value={form.positionEn}
                          onChange={(e) => handleFieldChange(adm.key, 'positionEn', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                        />
                      </div>

                      {/* Devolution Scope */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {language === 'en' ? 'Oversight Scope' : 'Eneo la Majukumu'}
                        </label>
                        <input
                          type="text"
                          disabled={!isSamaritan}
                          value={form.scope}
                          onChange={(e) => handleFieldChange(adm.key, 'scope', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  {isSamaritan && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                      <button
                        type="button"
                        disabled={isCurrentlySaving || !trimmedName}
                        onClick={() => handleSaveSingleAdmin(adm.key)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-amber-600 dark:hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4 text-amber-400" />
                        <span>
                          {isCurrentlySaving
                            ? language === 'en'
                              ? 'Allocating...'
                              : 'Inatenga...'
                            : language === 'en'
                            ? `Allocate & Set Address to "${previewAddressing}"`
                            : `Tenga na Weka Utambulisho "${previewAddressing}"`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
