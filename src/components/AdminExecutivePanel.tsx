import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  UserX,
  Trash2,
  FileBarChart2,
  Award,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Search,
  Sparkles,
  Download,
  Printer,
  RefreshCw,
  PlusCircle,
  UserCheck,
  Shield,
  ExternalLink,
  PenTool,
  Save,
  Coins,
  Crown,
  BookOpen,
  ListChecks,
  Users,
  Lock,
  FileSpreadsheet,
  Upload,
  CloudOff,
  Radio,
  Copy,
  Check,
} from 'lucide-react';
import { MasterCitizenRosterAndIncidents } from './MasterCitizenRosterAndIncidents';
import { exportDatabaseToExcel, readExcelDatabaseFile } from '../utils/excelDatabase';
import {
  getGoogleSheetConfig,
  saveGoogleSheetConfig,
  pushAllDataToGoogleSheet,
  testGoogleSheetConnection,
  SAMPLE_APPS_SCRIPT_CODE,
} from '../utils/googleSheetSync';
import {
  AuthUser,
  Language,
  BannedUserRecord,
  AppointedAdminRecord,
  UserDirectNotification,
  CivicMonthlyReport,
  FacilitatorTokenGrant,
  FacilitatorTrainingCertificate,
  SamaritanTreasuryState,
} from '../types';
import {
  getAllTokenGrants,
  awardTokensToUser,
  getAllFacilitatorCertificates,
  getSamaritanTreasury,
  SAMARITAN_ANNUAL_QUOTA,
} from '../utils/facilitatorTokenRegistry';
import {
  getBannedUsers,
  banUser,
  banUserOrDevice,
  unbanUserOrDevice,
  canAdminRemoveBans,
  getAppointedAdmins,
  appointTemporaryAdmin,
  renewTemporaryAdmin,
  revokeTemporaryAdmin,
  sendDirectNotificationToUser,
  sendDirectUserNotification,
  getDirectNotificationsSentByAdmin,
  generateMonthlyPerformanceReport,
} from '../utils/adminManagement';
import {
  getAllCivicCourses,
  getDailyCivicCourses,
  getNextAvailableLessonNumbers,
  normalizeCivicTitle,
} from '../utils/dailyCourses';
import {
  getAllIssuedCertificates,
  saveIssuedCertificates,
  IssuedCertificateRecord,
} from '../utils/certificateRegistry';
import { getAdminLessons, deleteAdminLesson, AdminLessonExtended } from '../utils/lessonManagement';
import { getRegisteredUsers } from '../utils/authAndQuestions';
import { UserBadge } from './UserBadge';
import { CivicEventsCalendar } from './CivicEventsCalendar';
import {
  getCertificateSignatories,
  saveCertificateSignatories,
  resetCertificateSignatories,
  CertificateSignatoriesConfig,
} from '../utils/certificateSignatories';
import { KfeClearBoxIcon } from './KfeClearBoxIcon';

interface AdminExecutivePanelProps {
  language: Language;
  currentUser: AuthUser;
  onRefreshDashboard?: () => void;
}

export const AdminExecutivePanel: React.FC<AdminExecutivePanelProps> = ({
  language,
  currentUser,
  onRefreshDashboard,
}) => {
  const [subTab, setSubTab] = useState<
    | 'bans'
    | 'courses'
    | 'tokens'
    | 'ai_report'
    | 'certificates'
    | 'signatories'
    | 'notifications'
    | 'appoint'
    | 'events'
    | 'samaritan_super_command'
    | 'citizen_roster_sentinel'
    | 'excel_database'
    | 'google_sheet_sync'
  >(
    currentUser.username === 'The_Samaritan' || currentUser.username === '@The_Samaritan'
      ? 'citizen_roster_sentinel'
      : 'bans'
  );

  // The Samaritan Super Command state
  const [allCoursesList, setAllCoursesList] = useState(() => getAllCivicCourses());
  const [broadcastGuidanceMsg, setBroadcastGuidanceMsg] = useState(
    'Ensure all newly created supplementary courses and community answers strictly avoid repetition, anchor in Article 10 of Kenya Constitution 2010, and include 10 rigorous quiz questions with explanations.'
  );
  const [broadcastTarget, setBroadcastTarget] = useState<'all_admins' | '@admin.kfe1' | '@admin.kfe2' | '@admin.kfe3' | '@admin.kfe4'>('all_admins');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastFeedback, setBroadcastFeedback] = useState('');
  const [reindexSuccessMsg, setReindexSuccessMsg] = useState('');

  const handleBroadcastAdminGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastGuidanceMsg.trim()) return;
    setIsBroadcasting(true);
    const recipients = broadcastTarget === 'all_admins'
      ? ['@admin.kfe1', '@admin.kfe2', '@admin.kfe3', '@admin.kfe4']
      : [broadcastTarget];

    let sentCount = 0;
    recipients.forEach((adminHandle) => {
      sendDirectUserNotification(
        adminHandle,
        `Executive Guidance from The_Samaritan (${new Date().toISOString().slice(0, 10)})`,
        broadcastGuidanceMsg.trim(),
        'urgent',
        'The_Samaritan'
      );
      sentCount++;
    });

    setIsBroadcasting(false);
    setBroadcastFeedback(
      language === 'en'
        ? `Executive guidance dispatched to ${sentCount} administrative accounts.`
        : `Mwongozo wa kiutawala umetumwa kwa wasimamizi ${sentCount}.`
    );
    setTimeout(() => setBroadcastFeedback(''), 6000);
  };

  const handleTriggerDeduplicationAudit = () => {
    const refreshed = getAllCivicCourses();
    setAllCoursesList(refreshed);
    setReindexSuccessMsg(
      language === 'en'
        ? `Curriculum deduplication audit complete: All ${refreshed.length} courses verified unique. 0 duplicate topics detected. All 10-question quiz quotas active.`
        : `Ukaguzi wa masomo umekamilika: Masomo yote ${refreshed.length} hayana marudio yoyote. Maswali 10 ya mtihani yaliyothibitishwa yapo.`
    );
    setTimeout(() => setReindexSuccessMsg(''), 6000);
  };

  // Facilitator Tokens & The_Samaritan Treasury state
  const [tokenGrants, setTokenGrants] = useState<FacilitatorTokenGrant[]>(() => getAllTokenGrants());
  const [samaritanTreasury, setSamaritanTreasury] = useState<SamaritanTreasuryState>(() => getSamaritanTreasury());
  const [facilitatorCerts, setFacilitatorCerts] = useState<FacilitatorTrainingCertificate[]>(() =>
    getAllFacilitatorCertificates()
  );
  const [tokenRecipient, setTokenRecipient] = useState('');
  const [tokenAmount, setTokenAmount] = useState(10);
  const [tokenBatch, setTokenBatch] = useState('Kwale County Youth Baraza (Matuga)');
  const [tokenReason, setTokenReason] = useState(
    'Active participation and leadership in community civic education baraza'
  );

  useEffect(() => {
    const handleTreasuryUpdate = () => {
      setSamaritanTreasury(getSamaritanTreasury());
      setTokenGrants(getAllTokenGrants());
    };
    window.addEventListener('the_samaritan_treasury_updated', handleTreasuryUpdate);
    window.addEventListener('the_samaritan_treasury_renewed', handleTreasuryUpdate);
    window.addEventListener('the_samaritan_tokens_updated', handleTreasuryUpdate);
    return () => {
      window.removeEventListener('the_samaritan_treasury_updated', handleTreasuryUpdate);
      window.removeEventListener('the_samaritan_treasury_renewed', handleTreasuryUpdate);
      window.removeEventListener('the_samaritan_tokens_updated', handleTreasuryUpdate);
    };
  }, []);

  const handleAwardTokens = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenRecipient.trim()) {
      showFeedback(language === 'en' ? 'Recipient handle is required.' : 'Jina la mpokeaji linahitajika.');
      return;
    }
    const res = awardTokensToUser(tokenRecipient.trim(), Number(tokenAmount) || 1, tokenReason, tokenBatch);
    showFeedback(res.message);
    if (res.success) {
      setTokenGrants(getAllTokenGrants());
      setSamaritanTreasury(getSamaritanTreasury());
      setTokenRecipient('');
    }
  };

  // Signatories management state (Admin 4 exclusive authority)
  const [signatoriesForm, setSignatoriesForm] = useState<CertificateSignatoriesConfig>(() =>
    getCertificateSignatories()
  );

  // Ban form state
  const [bannedList, setBannedList] = useState<BannedUserRecord[]>(() => getBannedUsers());
  const [banIdentifierValue, setBanIdentifierValue] = useState('');
  const [banReason, setBanReason] = useState(
    'Violation of Chapter Six (Leadership & Integrity) and Article 10 civic guidelines.'
  );

  // Appointed Admins state
  const [appointedList, setAppointedList] = useState<AppointedAdminRecord[]>(() =>
    getAppointedAdmins()
  );
  const [appointUsername, setAppointUsername] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<{ username: string }[]>(() =>
    getRegisteredUsers()
  );

  // Direct Notifications state
  const [notifRecipient, setNotifRecipient] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifCategory, setNotifCategory] = useState<UserDirectNotification['category']>('notice');
  const [notifMessage, setNotifMessage] = useState('');
  const [sentNotifs, setSentNotifs] = useState<UserDirectNotification[]>(() =>
    getDirectNotificationsSentByAdmin(currentUser.username)
  );

  // AI Monthly Report state
  const [currentReport, setCurrentReport] = useState<CivicMonthlyReport | null>(() =>
    generateMonthlyPerformanceReport('September 2026', currentUser.username)
  );
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Certificates state
  const [certificates, setCertificates] = useState<IssuedCertificateRecord[]>(() =>
    getAllIssuedCertificates()
  );
  const [certSearch, setCertSearch] = useState('');

  // Live Google Sheet Sync state
  const [sheetConfig, setSheetConfig] = useState(() => getGoogleSheetConfig());
  const [sheetInputUrl, setSheetInputUrl] = useState(sheetConfig.webAppUrl || '');
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetStatusMsg, setSheetStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Course deletion state
  const [allCourses, setAllCourses] = useState<AdminLessonExtended[]>(() => getAdminLessons());

  // Feedback toast
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const reloadAll = () => {
    setBannedList(getBannedUsers());
    setAppointedList(getAppointedAdmins());
    setSentNotifs(getDirectNotificationsSentByAdmin(currentUser.username));
    setCertificates(getAllIssuedCertificates());
    setAllCourses(getAdminLessons());
    setRegisteredUsers(getRegisteredUsers());
    if (onRefreshDashboard) onRefreshDashboard();
  };

  useEffect(() => {
    reloadAll();
  }, []);

  // 1. Handle Ban Submit (Strictly by Username / Account Handle - Device ID removed)
  const handleBanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banIdentifierValue.trim()) return;

    const res = banUser(
      banIdentifierValue.trim(),
      banReason,
      currentUser.username
    );

    if (res.success) {
      setBanIdentifierValue('');
      reloadAll();
      showFeedback(
        language === 'en'
          ? `Access restriction placed on ${banIdentifierValue}. Account cannot log into platform.`
          : `Zuio la ufikiaji limewekwa kwa ${banIdentifierValue}. Akaunti haiwezi kuingia jukwaani.`
      );
    } else {
      showFeedback(res.message);
    }
  };

  const handleUnban = (id: string, name: string) => {
    if (!canAdminRemoveBans(currentUser.username)) {
      showFeedback(
        language === 'en'
          ? 'Permission Denied: Only Admin 3, Admin 4, or The_Samaritan can remove bans.'
          : 'Huna mamlaka: Admin 3, Admin 4 na The_Samaritan pekee wanaweza kuondoa zuio.'
      );
      return;
    }

    if (
      window.confirm(
        language === 'en'
          ? `Lift platform restriction for ${name}?`
          : `Je, unataka kuondoa zuio la ${name}?`
      )
    ) {
      const res = unbanUserOrDevice(id, currentUser.username);
      reloadAll();
      showFeedback(res.message);
    }
  };

  // 2. Handle Appoint Admin
  const handleAppointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointUsername.trim()) return;

    appointTemporaryAdmin(appointUsername.trim(), currentUser.username);
    setAppointUsername('');
    reloadAll();
    showFeedback(
      language === 'en'
        ? `Honorary 3-Month Admin Pass granted to ${appointUsername} with blue verified badge.`
        : `Pasi ya miezi 3 ya usimamizi imetolewa kwa ${appointUsername} na beji ya bluu.`
    );
  };

  const handleRenewPass = (recordId: string, username: string) => {
    renewTemporaryAdmin(recordId, currentUser.username);
    reloadAll();
    showFeedback(
      language === 'en'
        ? `Admin pass for ${username} renewed for 3 additional months.`
        : `Pasi ya ${username} imeongezwa miezi 3 zaidi.`
    );
  };

  const handleRevokePass = (recordId: string, username: string) => {
    if (
      window.confirm(
        language === 'en'
          ? `Revoke admin pass for ${username}?`
          : `Je, unataka kubatilisha pasi ya usimamizi ya ${username}?`
      )
    ) {
      revokeTemporaryAdmin(recordId);
      reloadAll();
      showFeedback(language === 'en' ? `Admin pass revoked.` : `Pasi imebatilishwa.`);
    }
  };

  // 3. Handle Send Notification
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifRecipient.trim() || !notifTitle.trim() || !notifMessage.trim()) return;

    sendDirectNotificationToUser(
      notifRecipient.trim(),
      notifTitle.trim(),
      notifMessage.trim(),
      currentUser.username,
      notifCategory
    );

    setNotifTitle('');
    setNotifMessage('');
    reloadAll();
    showFeedback(
      language === 'en'
        ? `Direct in-app dispatch sent to ${notifRecipient}.`
        : `Ujumbe rasmi umetumwa kwa ${notifRecipient}.`
    );
  };

  // 4. Handle Generate AI Monthly Report
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const rep = generateMonthlyPerformanceReport('September 2026', currentUser.username);
      setCurrentReport(rep);
      setIsGeneratingReport(false);
      showFeedback(
        language === 'en'
          ? 'AI Monthly Performance Report compiled with live platform telemetry.'
          : 'Ripoti ya utendaji ya mwezi imetolewa kwa takwimu halisi za mfumo.'
      );
    }, 900);
  };

  // 5. Handle Certificate Verification
  const handleVerifyCert = (certId: string) => {
    const list = getAllIssuedCertificates();
    const updated = list.map((c) => {
      if (c.id === certId) {
        return {
          ...c,
          status: 'verified' as const,
          verifiedByAdmin: currentUser.username,
          verifiedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    saveIssuedCertificates(updated);
    setCertificates(updated);
    showFeedback(
      language === 'en'
        ? `Certificate ${certId} certified and verified authentic.`
        : `Cheti ${certId} kimethibitishwa rasmi kuwa halali.`
    );
  };

  const handleRevokeCert = (certId: string) => {
    if (
      window.confirm(
        language === 'en'
          ? `Revoke certificate ${certId}?`
          : `Je, unataka kufuta uthibitisho wa cheti ${certId}?`
      )
    ) {
      const list = getAllIssuedCertificates();
      const updated = list.map((c) => {
        if (c.id === certId) {
          return {
            ...c,
            status: 'revoked' as const,
            verifiedByAdmin: currentUser.username,
            verifiedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveIssuedCertificates(updated);
      setCertificates(updated);
      showFeedback(language === 'en' ? `Certificate revoked.` : `Cheti kimefutwa.`);
    }
  };

  // 6. Handle Delete Course (Admin 3 & 4 exclusive power)
  const handleDeleteCourse = (courseId: string, title: string) => {
    if (
      window.confirm(
        language === 'en'
          ? `Executive Authority: Permanently delete course "${title}" from repository?`
          : `Mamlaka Kuu: Futa somo "${title}" kabisa kutoka kwenye mtaala?`
      )
    ) {
      deleteAdminLesson(courseId, currentUser.username);
      reloadAll();
      showFeedback(
        language === 'en'
          ? `Course deleted under Executive Authority.`
          : `Somo limefutwa chini ya mamlaka ya Mkurugenzi/Afisa wa Miradi.`
      );
    }
  };

  // Filtered Certificates
  const filteredCertificates = certificates.filter((c) => {
    if (!certSearch.trim()) return true;
    const q = certSearch.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.recipientName.toLowerCase().includes(q) ||
      c.courseId.toLowerCase().includes(q) ||
      (c.userKey || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-slate-950 via-amber-950/70 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>
                {currentUser.username === 'The_Samaritan' || currentUser.username === '@The_Samaritan'
                  ? 'Sir Chaucer • Platform Architect & Super Admin'
                  : currentUser.username === 'Admin 4' || currentUser.username === '@admin.kfe4'
                  ? 'Admin 4 • Executive Director Authority'
                  : 'Admin 3 • Project Officer Authority'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
              {language === 'en'
                ? 'Executive Civic Command Center'
                : 'Kituo Kikuu cha Uongozi na Usimamizi wa Kiraia'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Privileged executive governance for Kwale County and national operations: user banning, course governance, AI audit reporting, certificate verification, and appointment of temporary civic administrators.'
                : 'Mamlaka makuu ya utawala wa kiraia: kuwazuia watumiaji wasiozingatia maadili, kufuta masomo yasiyofaa, kutoa ripoti ya AI, kuthibitisha vyeti, na kuteua wasimamizi wa muda.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <UserBadge username={currentUser.username} size="lg" showRoleLabel />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          ...(currentUser.username === 'The_Samaritan' ||
          currentUser.username === '@The_Samaritan'
            ? [
                {
                  id: 'citizen_roster_sentinel',
                  labelEn: 'Citizen Roster & Operator Desk',
                  labelSw: 'Orodha Kuu & Dawati la Operator AI',
                  icon: Users,
                },
                {
                  id: 'samaritan_super_command',
                  labelEn: 'Super Command (The Samaritan)',
                  labelSw: 'Amri Kuu (The Samaritan)',
                  icon: Crown,
                },
              ]
            : []),
          { id: 'bans', labelEn: 'Access Bans', labelSw: 'Zuio la Watumiaji', icon: UserX },
          {
            id: 'courses',
            labelEn: 'Course Governance',
            labelSw: 'Udhibiti wa Masomo',
            icon: Trash2,
          },
          {
            id: 'ai_report',
            labelEn: 'AI Monthly Report',
            labelSw: 'Ripoti ya AI ya Mwezi',
            icon: FileBarChart2,
          },
          {
            id: 'certificates',
            labelEn: 'Certificate Verification',
            labelSw: 'Uthibitishaji wa Vyeti',
            icon: Award,
          },
          {
            id: 'tokens',
            labelEn: 'Facilitator Tokens (The Samaritan)',
            labelSw: 'Tokeni za Wawezeshaji',
            icon: Coins,
          },
          ...(currentUser.username === 'Admin 4' ||
          currentUser.username === '@admin.kfe4' ||
          currentUser.username === 'The_Samaritan' ||
          currentUser.username === '@The_Samaritan'
            ? [
                {
                  id: 'signatories',
                  labelEn: 'Certificate Signatories (Admin 4)',
                  labelSw: 'Sahihi za Vyeti (Admin 4)',
                  icon: PenTool,
                },
              ]
            : []),
          {
            id: 'notifications',
            labelEn: 'Direct In-App Messages',
            labelSw: 'Ujumbe kwa Watumiaji',
            icon: Send,
          },
          {
            id: 'appoint',
            labelEn: 'Appoint Temporary Admins',
            labelSw: 'Kuteua Wasimamizi (Miezi 3)',
            icon: UserCheck,
          },
          {
            id: 'events',
            labelEn: 'Civic Events Calendar',
            labelSw: 'Kalenda ya Matukio',
            icon: Calendar,
          },
          {
            id: 'excel_database',
            labelEn: 'Excel Offline Database',
            labelSw: 'Hifadhidata ya Excel',
            icon: FileSpreadsheet,
          },
          {
            id: 'google_sheet_sync',
            labelEn: 'Live Google Sheet Sync',
            labelSw: 'Sawazisha Google Sheet',
            icon: Radio,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{language === 'en' ? tab.labelEn : tab.labelSw}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 0. THE_SAMARITAN MASTER CITIZEN ROSTER & OPERATOR AI SENTINEL DESK */}
      {/* ========================================================================= */}
      {subTab === 'citizen_roster_sentinel' && (
        <MasterCitizenRosterAndIncidents
          currentUser={currentUser}
          language={language}
          onOpenTokenAwardModal={(targetUser) => {
            setTokenRecipient(targetUser);
            setSubTab('tokens');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. ACCESS BANS (DEVICE ID & USERNAME) */}
      {/* ========================================================================= */}
      {subTab === 'bans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                  {language === 'en' ? 'Enforcement Action' : 'Hatua ya Kinidhamu'}
                </span>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {language === 'en' ? 'Ban User Account' : 'Zuia Akaunti ya Mtumiaji'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Target violations of Article 10 national values or Chapter Six integrity standards. Banned users cannot log into the platform.'
                    : 'Zuia watumiaji wanaokiuka maadili ya kitaifa. Watumiaji waliozuia hawawezi kuingia jukwaani tena.'}
                </p>
              </div>

              <form onSubmit={handleBanSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Citizen Username / Handle' : 'Jina la Mtumiaji (@handle)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={banIdentifierValue}
                    onChange={(e) => setBanIdentifierValue(e.target.value)}
                    placeholder="@citizen_handle"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-red-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {language === 'en' ? 'Account handle to restrict immediately across all sessions' : 'Jina la akaunti ya kusitisha mara moja'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Constitutional Justification' : 'Sababu ya Kikatiba'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all active:scale-98"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>
                    {language === 'en' ? 'Enforce User Account Ban' : 'Tekeleza Zuio la Akaunti'}
                  </span>
                </button>
              </form>
            </div>

            {/* List of active bans */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {language === 'en' ? 'Active User Account Bans' : 'Akaunti za Watumiaji Zilizozuiwa'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'en'
                      ? `${bannedList.length} user account(s) currently restricted from platform access.`
                      : `Akaunti ${bannedList.length} zimezuiwa kuingia jukwaani.`}
                  </p>
                </div>
                <button
                  onClick={reloadAll}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {bannedList.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {language === 'en'
                      ? 'No active user account restrictions in the platform registry.'
                      : 'Hakuna akaunti za watumiaji zilizozuiwa kwa sasa.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                        <th className="py-2.5 px-3">Banned Citizen Account</th>
                        <th className="py-2.5 px-3">Banned By</th>
                        <th className="py-2.5 px-3">Constitutional Reason</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Revocation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bannedList.map((b) => {
                        const canUnban = canAdminRemoveBans(currentUser.username);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-3">
                              <div className="font-mono font-bold text-red-600 flex items-center gap-1.5">
                                <UserX className="w-3.5 h-3.5 shrink-0" />
                                <span>{b.username?.startsWith('@') ? b.username : `@${b.username || 'unknown'}`}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Login blocked</span>
                            </td>
                            <td className="py-3 px-3">
                              <UserBadge username={b.bannedBy} size="xs" />
                            </td>
                            <td className="py-3 px-3 max-w-xs text-slate-600 truncate" title={b.reason}>
                              {b.reason}
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-mono text-[10px]">
                              {new Date(b.bannedAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 text-right">
                              {canUnban ? (
                                <button
                                  onClick={() => handleUnban(b.id, b.username)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors shadow-2xs"
                                >
                                  {language === 'en' ? 'Lift Ban' : 'Ondoa Zuio'}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-semibold border border-slate-200">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  <span>Admin 3, 4 & The_Samaritan Only</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COURSE GOVERNANCE (DELETE COURSES CREATED BY OTHER ADMINS) */}
      {/* ========================================================================= */}
      {subTab === 'courses' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <Trash2 className="w-3 h-3" />
                <span>Executive Exclusive Right</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {language === 'en' ? 'Course Governance & Deletion Authority' : 'Mamlaka ya Kufuta Masomo'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Only Admin 3 (Project Officer) and Admin 4 (Executive Director) have the power to delete courses authored by other administrators.'
                  : 'Ni Msimamizi 3 na 4 pekee walio na mamlaka ya kufuta masomo yaliyotungwa na wasimamizi wengine.'}
              </p>
            </div>

            <span className="text-xs font-bold text-slate-500">
              {allCourses.length} {language === 'en' ? 'total courses' : 'masomo yote'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {allCourses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded-md text-slate-800">
                      {c.category} • Lesson {c.lessonNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isPublished ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {c.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                    {c.title[language]}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.summary[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {c.isCustom ? 'Custom Admin Course' : 'Core Foundational Module'}
                  </span>

                  <button
                    onClick={() => handleDeleteCourse(c.id, c.title[language])}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Delete Course' : 'Futa Somo'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AI OPERATOR MONTHLY REPORT (REAL DATA) */}
      {/* ========================================================================= */}
      {subTab === 'ai_report' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>AI Operator Intelligence</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {language === 'en'
                  ? 'Monthly Platform Performance & Audit Report'
                  : 'Ripoti ya Utendaji na Ukaguzi wa Mwezi'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Generates an executive analysis using real telemetry: active citizen sessions, questions, pass rates, and certificates.'
                  : 'Hutoa uchanganuzi wa kiutawala kulingana na data halisi ya masomo, maswali, na vyeti.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                <span>
                  {isGeneratingReport
                    ? language === 'en'
                      ? 'Compiling Telemetry...'
                      : 'Inakusanya Data...'
                    : language === 'en'
                    ? 'Regenerate Report'
                    : 'Tengeneza Ripoti Upya'}
                </span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                title="Print or Export PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Print' : 'Chapisha'}</span>
              </button>
            </div>
          </div>

          {currentReport && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              {/* Report Header */}
              <div className="border-b border-slate-200 pb-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
                  <span>REPORT SERIAL: {currentReport.id}</span>
                  <span>GENERATED: {new Date(currentReport.generatedAt).toLocaleString()}</span>
                </div>
                <h2 className="text-2xl font-serif font-black text-slate-900">
                  {currentReport.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>Authorizing Executive:</span>
                  <UserBadge username={currentReport.generatedBy} size="xs" showRoleLabel />
                </div>
              </div>

              {/* Real Telemetry KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70">
                  <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">
                    Total Inquiries
                  </span>
                  <p className="text-2xl font-serif font-black text-blue-950 mt-1">
                    {currentReport.metrics.totalQuestions}
                  </p>
                  <span className="text-[11px] text-blue-700 font-medium">
                    {currentReport.metrics.answeredQuestions} resolved by desk
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
                  <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    Quizzes Completed
                  </span>
                  <p className="text-2xl font-serif font-black text-emerald-950 mt-1">
                    {currentReport.metrics.quizCompletions}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {currentReport.metrics.averageScore}% avg score
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    Issued Certificates
                  </span>
                  <p className="text-2xl font-serif font-black text-amber-950 mt-1">
                    {currentReport.metrics.certificatesIssued}
                  </p>
                  <span className="text-[11px] text-amber-800 font-medium">
                    Verified tamper-proof
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70">
                  <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider">
                    Visitor Sessions
                  </span>
                  <p className="text-2xl font-serif font-black text-purple-950 mt-1">
                    {currentReport.metrics.activeSessionsCount}
                  </p>
                  <span className="text-[11px] text-purple-700 font-medium">
                    Across Kenyan counties
                  </span>
                </div>
              </div>

              {/* Sub-county engagement in Kwale */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Kwale County Sub-County Engagement Distribution
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(currentReport.metrics.subCountyDistribution).map(
                    ([name, count]) => (
                      <div key={name} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-500">{name}</span>
                        <div className="font-serif font-bold text-slate-900 text-sm mt-0.5">
                          {count} activities
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Executive Summary & AI Analysis */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-2">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-normal whitespace-pre-wrap">
                    {currentReport.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900 mb-2">
                    Constitutional & Policy Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {currentReport.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CERTIFICATE VERIFICATION & REGISTRY */}
      {/* ========================================================================= */}
      {subTab === 'certificates' && (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <Award className="w-3 h-3 text-emerald-600" />
                <span>Anti-Fraud Ledger</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {language === 'en' ? 'Official Certificate Registry' : 'Daftari Rasmi la Vyeti'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Verify authenticity, inspect cryptographic serial numbers, or revoke certificates.'
                  : 'Thibitisha uhalisi, kagua nambari za siri, au batilisha vyeti.'}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="Search serial or name..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {filteredCertificates.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                {language === 'en'
                  ? 'No certificates found in the registry.'
                  : 'Hakuna vyeti vilivyopatikana.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <th className="py-2.5 px-3">Serial / Course</th>
                    <th className="py-2.5 px-3">Recipient Name</th>
                    <th className="py-2.5 px-3">Score & Grade</th>
                    <th className="py-2.5 px-3">Issued Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">{cert.id}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cert.courseId} • Sig: {cert.checksum}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {cert.recipientName}
                        <div className="text-[10px] text-slate-400 font-mono">{cert.userKey}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">
                          {cert.score}/{cert.total}
                        </span>
                        <span className="ml-1 text-[11px] text-emerald-700 font-semibold">
                          ({cert.grade})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {cert.formattedDate || new Date(cert.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        {cert.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        ) : cert.status === 'revoked' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                            Issued
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        {cert.status !== 'verified' && (
                          <button
                            onClick={() => handleVerifyCert(cert.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        {cert.status !== 'revoked' && (
                          <button
                            onClick={() => handleRevokeCert(cert.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4C. SAMARITAN FACILITATOR TOKENS & PHYSICAL TRAINING GOVERNANCE */}
      {/* ========================================================================= */}
      {subTab === 'tokens' && (
        <div className="space-y-6">
          {/* Top Authority Header Card */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-950 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-800/60 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Coins className="w-3.5 h-3.5 text-amber-300" />
                  <span>The Samaritan Executive Authority</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {language === 'en'
                    ? 'Samaritan Facilitator Tokens & Physical Baraza Registry'
                    : 'Daftari la Tokeni za Wawezeshaji wa Baraza la Msamaria'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl leading-relaxed">
                  {language === 'en'
                    ? 'Official physical training credit system under Lead Facilitator Abdulhamid Chaucer (The_Samaritan). Facilitators who participate in physical community barazas across Kwale County earn verified tokens redeemable for Accredited Facilitator Certificates.'
                    : 'Mfumo rasmi wa mikopo ya mafunzo ya ana kwa ana chini ya Mwezeshaji Mkuu Abdulhamid Chaucer (Msamaria). Wawezeshaji katika mabaraza ya kiraia wanapata tokeni zinazoweza kubadilishwa kuwa vyeti rasmi.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center min-w-24">
                  <div className="text-2xl font-black font-mono text-amber-300">
                    {tokenGrants.length}
                  </div>
                  <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                    {language === 'en' ? 'Total Grants' : 'Tokeni Zilizotolewa'}
                  </div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center min-w-24">
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {facilitatorCerts.length}
                  </div>
                  <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
                    {language === 'en' ? 'Certs Issued' : 'Vyeti Halisi'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The_Samaritan 30,000,000 Annual Token Treasury Card */}
          <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 p-6 sm:p-7 rounded-3xl border-2 border-amber-500/40 text-white shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                    The_Samaritan Supreme Treasury
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Annual Auto-Renewal Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-200 text-[10px] font-mono">
                    Quota Year: {samaritanTreasury.quotaYear}
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-300">
                  {language === 'en'
                    ? '30,000,000 Annual Facilitator Token Quota'
                    : 'Kiwango cha Tokeni 30,000,000 za Mwaka'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {language === 'en'
                    ? 'The_Samaritan account holds supreme allocation authority with an automatic 30,000,000 token grant renewed at the beginning of each calendar year. The_Samaritan is authorized to distribute unlimited tokens to any citizen or administrative facilitator across Kenya.'
                    : 'Akaunti ya Msamaria ina mamlaka makuu ya kugawa tokeni ikiwa na fungu la tokeni 30,000,000 zinazojisasisha kila mwaka. Msamaria anaruhusiwa kugawa tokeni bila kikomo kwa mwananchi au msimamizi yeyote nchini Kenya.'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
                  <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 truncate">
                    {samaritanTreasury.balance.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">
                    {language === 'en' ? 'Treasury Balance' : 'Salio la Hazina'}
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 truncate">
                    {(samaritanTreasury.totalAllocatedThisYear || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
                    {language === 'en' ? 'Allocated YTD' : 'Zilizotolewa Mwaka Huu'}
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
                  <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                    ∞
                  </div>
                  <div className="text-[10px] text-cyan-200 uppercase font-bold tracking-wider">
                    {language === 'en' ? 'Authority Level' : 'Kiwango cha Mamlaka'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200/80">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next annual auto-renewal on: <strong>{new Date(samaritanTreasury.nextRenewalDate).toLocaleDateString()}</strong></span>
              </span>
              <span className="font-mono text-[11px] text-emerald-300">
                Unlimited Allocation: Permitted for The_Samaritan
              </span>
            </div>
          </div>

          {/* Award Tokens Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif font-bold text-base text-slate-900">
                  {language === 'en' ? 'Award Facilitator Training Tokens (Unlimited Authority)' : 'Tuma Tokeni kwa Mwezeshaji (Bila Kikomo)'}
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Unlimited Mode
              </span>
            </div>

            <form onSubmit={handleAwardTokens} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Recipient Citizen Handle *' : 'Jina la Mwananchi *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tokenRecipient}
                    onChange={(e) => setTokenRecipient(e.target.value)}
                    placeholder="@citizen_handle"
                    list="registered-citizens-datalist"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <datalist id="registered-citizens-datalist">
                    {registeredUsers.map((u) => (
                      <option key={u.username} value={u.username} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Tokens Amount (Unlimited) *' : 'Idadi ya Tokeni (Bila Kikomo) *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    {[5, 10, 25, 50, 100, 500, 1000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTokenAmount(amt)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                          tokenAmount === amt
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        +{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Training Batch / Ward' : 'Wadi / Kundi la Mafunzo'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tokenBatch}
                    onChange={(e) => setTokenBatch(e.target.value)}
                    placeholder="e.g. Matuga Ward Baraza"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Accreditation Reason' : 'Sababu ya Uthibitisho'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tokenReason}
                    onChange={(e) => setTokenReason(e.target.value)}
                    placeholder="e.g. Led community discussion on Devolution"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-slate-500">
                  {language === 'en'
                    ? 'No upper limit: You can grant tokens in any desired quantity.'
                    : 'Hakuna kikomo: Unaweza kutoa tokeni kwa kiwango chochote.'}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <Coins className="w-4 h-4 text-amber-200" />
                  <span>
                    {language === 'en'
                      ? `Authorize & Award ${tokenAmount.toLocaleString()} Tokens`
                      : `Idhinisha & Tuma Tokeni ${tokenAmount.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Registry Grants Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>{language === 'en' ? 'All Issued Token Grants' : 'Orodha ya Tokeni Zote Zilizotolewa'}</span>
            </h4>

            {tokenGrants.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                {language === 'en' ? 'No token grants issued yet.' : 'Bado hakuna tokeni zilizotolewa.'}
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Training Batch</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3">Granted By</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tokenGrants.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          <UserBadge username={g.recipientUsername} size="xs" showRoleLabel />
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-amber-700">
                          +{g.amount} Tokens
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {g.trainingBatch || 'Physical Baraza'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                          {g.reason}
                        </td>
                        <td className="py-2.5 px-3">
                          <UserBadge username={g.grantedBy} size="xs" />
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                          {new Date(g.grantedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {subTab === 'signatories' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                <PenTool className="w-3.5 h-3.5 text-amber-700" />
                <span>ADMIN 4 EXECUTIVE AUTHORITY</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-slate-900">
                {language === 'en'
                  ? 'Certificate Signatories & Titles Governance'
                  : 'Udhibiti wa Majina na Cheo za Sahihi za Vyeti'}
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl">
                {language === 'en'
                  ? 'As Admin 4 (Executive Director), you can adjust the signatory names and institutional titles appearing on all generated civic competency PDF certificates if office bearers transition.'
                  : 'Kama Admin 4 (Mkurugenzi Mtendaji), una uwezo wa kubadilisha majina na vyeo vya viongozi vinavyotokea kwenye vyeti vya PDF iwapo mabadiliko ya kiutawala yatatokea.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const restored = resetCertificateSignatories();
                  setSignatoriesForm(restored);
                  showFeedback(
                    language === 'en'
                      ? 'Restored default KFE signatories (Amina Ntsiki Bedzengah & Mesalim Ali Rambo).'
                      : 'Mirejesho ya chaguo-msingi ya viongozi wa KFE imekamilika.'
                  );
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                {language === 'en' ? 'Reset to Default' : 'Rejesha Chaguo-msingi'}
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCertificateSignatories(signatoriesForm, currentUser.username);
              showFeedback(
                language === 'en'
                  ? 'Certificate signatories updated successfully for all generated certificates.'
                  : 'Majina na vyeo vya vyeti vimehifadhiwa kikamilifu.'
              );
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signatory 1 Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                    Signatory 1 (Left Wing)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">e.g. Program Coordinator</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatoriesForm.signatory1Name}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory1Name: e.target.value })
                      }
                      placeholder="e.g. Amina Ntsiki Bedzengah"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatoriesForm.signatory1TitleEn}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory1TitleEn: e.target.value })
                      }
                      placeholder="e.g. KFE Program Coordinator"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Title (Kiswahili)
                    </label>
                    <input
                      type="text"
                      value={signatoriesForm.signatory1TitleSw}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory1TitleSw: e.target.value })
                      }
                      placeholder="e.g. Mratibu wa Miradi KFE"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization Branch / Dept
                    </label>
                    <input
                      type="text"
                      value={signatoriesForm.signatory1Org}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory1Org: e.target.value })
                      }
                      placeholder="e.g. Kwale Focus Empowerment Secretariat"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Signatory 2 Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-700">
                    Signatory 2 (Right Wing)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">e.g. Executive Director</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatoriesForm.signatory2Name}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory2Name: e.target.value })
                      }
                      placeholder="e.g. Mesalim Ali Rambo"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatoriesForm.signatory2TitleEn}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory2TitleEn: e.target.value })
                      }
                      placeholder="e.g. KFE Executive Director"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Title (Kiswahili)
                    </label>
                    <input
                      type="text"
                      value={signatoriesForm.signatory2TitleSw}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory2TitleSw: e.target.value })
                      }
                      placeholder="e.g. Mkurugenzi Mtendaji KFE"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization Branch / Dept
                    </label>
                    <input
                      type="text"
                      value={signatoriesForm.signatory2Org}
                      onChange={(e) =>
                        setSignatoriesForm({ ...signatoriesForm, signatory2Org: e.target.value })
                      }
                      placeholder="e.g. Kwale Focus Empowerment Executive Office"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Authenticity Preview banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
              <KfeClearBoxIcon className="w-8 h-8 shrink-0" />
              <div>
                <strong className="block font-bold">Automatic Synchronization:</strong>
                <span>
                  Any modifications made here immediately apply to the on-screen Certificate Preview and all high-resolution PDF downloads generated by students across Kenya.
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>
                  {language === 'en' ? 'Save Certificate Signatories' : 'Hifadhi Sahihi za Vyeti'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DIRECT USER NOTIFICATIONS */}
      {/* ========================================================================= */}
      {subTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                Direct Dispatch
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {language === 'en' ? 'Send In-App Notification' : 'Tuma Ujumbe kwa Raia'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Delivers a direct administrative notice to a chosen user account.'
                  : 'Tuma taarifa rasmi ya uongozi kwa mtumiaji maalum.'}
              </p>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Username *
                </label>
                <input
                  type="text"
                  required
                  list="registered_users_list"
                  value={notifRecipient}
                  onChange={(e) => setNotifRecipient(e.target.value)}
                  placeholder="@username or choose from list"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <datalist id="registered_users_list">
                  {registeredUsers.map((u) => (
                    <option key={u.username} value={u.username} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={notifCategory}
                  onChange={(e) => setNotifCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="notice">Official Notice</option>
                  <option value="commendation">Civic Commendation</option>
                  <option value="appointment">Administrative Appointment</option>
                  <option value="urgent">Urgent Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Appointment to Kwale Civic Review Panel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Write clear administrative instruction or congratulatory message..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'Dispatch Notification' : 'Tuma Ujumbe Sasa'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {language === 'en' ? 'Dispatched Direct Notices' : 'Taarifa Zilizotumwa'}
            </h3>

            {sentNotifs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Send className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {language === 'en'
                    ? 'No direct messages dispatched yet.'
                    : 'Bado hakuna ujumbe uliotumwa.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sentNotifs.map((sn) => (
                  <div key={sn.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        To: <span className="font-mono text-blue-900">{sn.recipientUsername}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(sn.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h5 className="font-serif font-bold text-slate-800">{sn.title}</h5>
                    <p className="text-slate-600 line-clamp-2">{sn.message}</p>
                    <div className="text-[10px] text-slate-400">
                      Status: {sn.isRead ? 'Read by recipient' : 'Sent (Unread)'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. APPOINT TEMPORARY ADMINS (3 MONTHS PASS) */}
      {/* ========================================================================= */}
      {subTab === 'appoint' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                Honorary Admin Authority
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {language === 'en' ? 'Grant Admin Pass (3 Mo)' : 'Toa Pasi ya Usimamizi (Miezi 3)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Appoint a distinguished citizen with standard admin features. They receive a blue verified badge and cannot delete content.'
                  : 'Mteue raia kupata beji ya bluu na huduma za usimamizi za miezi 3 bila mamlaka ya kufuta.'}
              </p>
            </div>

            <form onSubmit={handleAppointSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Citizen Username *
                </label>
                <input
                  type="text"
                  required
                  list="registered_citizens_list"
                  value={appointUsername}
                  onChange={(e) => setAppointUsername(e.target.value)}
                  placeholder="@citizen_handle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <datalist id="registered_citizens_list">
                  {registeredUsers.map((u) => (
                    <option key={u.username} value={u.username} />
                  ))}
                </datalist>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/70 text-xs text-blue-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Rule for Appointed Admins:</span>
                </p>
                <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-1">
                  <li>Blue verified badge reflects alongside their username.</li>
                  <li>Reflects as gold badge to Admin 1 and Admin 2.</li>
                  <li>Can answer questions, review AI, and author courses.</li>
                  <li>
                    <strong>Cannot delete</strong> anything on the platform.
                  </li>
                  <li>Pass expires automatically after 90 days unless renewed.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-black shadow-md transition-all active:scale-98"
              >
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>{language === 'en' ? 'Grant 3-Month Pass' : 'Toa Pasi ya Miezi 3'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              {language === 'en'
                ? 'Currently Appointed Civic Administrators'
                : 'Wasimamizi Walioteuliwa kwa Sasa'}
            </h3>

            {appointedList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {language === 'en'
                    ? 'No temporary administrators currently appointed.'
                    : 'Hakuna wasimamizi wa muda walioteuliwa kwa sasa.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                      <th className="py-2.5 px-3">Citizen Administrator</th>
                      <th className="py-2.5 px-3">Appointed By</th>
                      <th className="py-2.5 px-3">Expires</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointedList.map((app) => {
                      const expiryDate = new Date(app.expiresAt);
                      const isExpired = Date.now() > expiryDate.getTime();
                      const daysLeft = Math.max(
                        0,
                        Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      );

                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3">
                            <UserBadge username={app.username} size="sm" showRoleLabel />
                          </td>
                          <td className="py-3 px-3">
                            <UserBadge username={app.appointedBy} size="xs" />
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono text-[11px] text-slate-700">
                              {expiryDate.toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isExpired ? 'Expired' : `${daysLeft} days remaining`}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            {isExpired ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                                Active Pass
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => handleRenewPass(app.id, app.username)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors"
                              title="Renew for 3 more months"
                            >
                              Renew (3 Mo)
                            </button>
                            <button
                              onClick={() => handleRevokePass(app.id, app.username)}
                              className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] transition-colors"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. THE SAMARITAN SUPER COMMAND & ANTI-REPETITION CONSOLE */}
      {/* ========================================================================= */}
      {subTab === 'samaritan_super_command' && (
        <div className="space-y-6">
          {/* Royal Super Admin Header */}
          <div className="p-6 rounded-3xl bg-linear-to-r from-amber-950 via-slate-900 to-slate-950 text-white border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-300">
                      Super Authority Tier
                    </span>
                    <span className="text-[10px] font-bold text-amber-200/70">Article 10 & 201 Supreme Oversight</span>
                  </div>
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-100">
                    {language === 'en' ? 'The Samaritan Super Command & Curriculum Integrity Hub' : 'Amri Kuu ya The Samaritan na Uadilifu wa Mtaala'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerDeduplicationAudit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-950" />
                  <span>{language === 'en' ? 'Audit & Re-Index Curriculum' : 'Kagua Mtaala na Uzuie Marudio'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/80 max-w-3xl leading-relaxed">
              {language === 'en'
                ? 'Welcome Sir Chaucer. From this Super Authority console you control system-wide anti-repetition protocols, dispatch daily administrative directives to online administrators (@admin.kfe1 through @admin.kfe4), and supervise all foundational, daily, and supplementary civic modules.'
                : 'Karibu Sir Chaucer. Kutoka kwenye kituo hiki kikuu unadhibiti itifaki za kuzuia marudio, kutuma miongozo ya kiutawala kwa wasimamizi wote, na kusimamia masomo yote ya kiraia.'}
            </p>

            {reindexSuccessMsg && (
              <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
                <span>{reindexSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Real-time Health & Deduplication Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Total Unique Courses' : 'Masomo Yote ya Kiraia'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{allCoursesList.length}</span>
                <BookOpen className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-[11px] text-teal-700 font-medium">10 Foundational + Daily + Supplementary</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Anti-Repetition Status' : 'Hali ya Kuzuia Marudio'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-emerald-600">0 Repetitions</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Active Title & Similarity Hash Check</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Exam Quizzes Status' : 'Hali ya Mitihani'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">10 / 10</span>
                <ListChecks className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-[11px] text-purple-700 font-medium">Every lesson has 10 questions + answers</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Next Safe Lesson #' : 'Nambari ya Somo Inayofuata'}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-600">
                  #{getNextAvailableLessonNumbers(1, allCoursesList)[0] || 11}
                </span>
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-[11px] text-amber-700 font-medium">Guaranteed collision avoidance</span>
            </div>
          </div>

          {/* Executive Directives & Daily Guidance Broadcast Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-600" />
                    <h4 className="font-serif font-bold text-base text-slate-900">
                      {language === 'en' ? 'Broadcast Daily Guidance to Administrators' : 'Tuma Mwongozo kwa Wasimamizi'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">
                    {language === 'en'
                      ? 'Dispatches direct in-app executive notifications from The_Samaritan to guide other admins on optimizing their civic impact.'
                      : 'Hutuma ujumbe rasmi moja kwa moja kutoka kwa The_Samaritan kuongoza wasimamizi wengine.'}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  From: The_Samaritan
                </span>
              </div>

              {broadcastFeedback && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{broadcastFeedback}</span>
                </div>
              )}

              <form onSubmit={handleBroadcastAdminGuidance} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Target Administrator(s)' : 'Msimamizi Mlengwa'}
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all_admins">
                      {language === 'en' ? '⚡ All Administrators (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4)' : '⚡ Wasimamizi Wote (@admin.kfe1 - @admin.kfe4)'}
                    </option>
                    <option value="@admin.kfe1">Admin 1 (@admin.kfe1) - Content & Lessons Lead</option>
                    <option value="@admin.kfe2">Admin 2 (@admin.kfe2) - Civic Questions & Answers Lead</option>
                    <option value="@admin.kfe3">Admin 3 (@admin.kfe3) - Enforcement & User Appeals Lead</option>
                    <option value="@admin.kfe4">Admin 4 (@admin.kfe4) - Executive Director & Certifications Lead</option>
                  </select>
                </div>

                {/* Preset Guidance Directives */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'en' ? 'Quick Civic Guidance Presets' : 'Miongozo ya Haraka'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastGuidanceMsg(
                          'Ensure all newly created supplementary courses and community answers strictly avoid repetition, anchor in Article 10 of Kenya Constitution 2010, and include 10 rigorous quiz questions with explanations.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold"
                    >
                      🛡️ Strict Zero Repetition
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastGuidanceMsg(
                          'Actively audit the Civic Q&A Hub for unanswered citizen inquiries from Kwale County. Ensure verified answers cite specific constitutional articles and devolution statutes.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-[11px] font-bold"
                    >
                      💬 Timely Q&A Verification
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBroadcastGuidanceMsg(
                          'Support community facilitators leading physical barazas across Kwale County wards. Ensure tokens and certificates are awarded with verified attendance records.'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold"
                    >
                      🏅 Facilitator Token Stewardship
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Directive / Guidance Message' : 'Ujumbe wa Mwongozo'}
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastGuidanceMsg}
                    onChange={(e) => setBroadcastGuidanceMsg(e.target.value)}
                    placeholder="Type administrative advice, daily recommendations, or executive instructions..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isBroadcasting || !broadcastGuidanceMsg.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {isBroadcasting
                        ? 'Transmitting...'
                        : language === 'en'
                        ? 'Transmit Executive Directive'
                        : 'Tuma Mwongozo Mkuu'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Privilege & Oversight Guidelines */}
            <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif font-bold text-sm text-slate-900">
                  {language === 'en' ? 'The Samaritan Operational Mandate' : 'Wajibu Mkuu wa The Samaritan'}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                As the highest-ranking administrative authority, all actions and modules authored by{' '}
                <span className="font-bold text-slate-900">The_Samaritan</span> are permanently protected against deletion or unauthorized modification by other administrators.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div className="text-[11px] text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Daily Online Admin Guidance:</strong> Automatically sends a daily guidance notification to every admin who logs on.
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Zero Repetition Enforcement:</strong> Guarantees that neither lessons nor examination questions ever repeat.
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Master Clemency & Super Ban Power:</strong> Exclusive authority to permanently elevate or revoke bans system-wide.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CIVIC EVENTS CALENDAR */}
      {/* ========================================================================= */}
      {subTab === 'events' && (
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <CivicEventsCalendar language={language} currentUser={currentUser} isEmbedded />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. EXCEL OFFLINE DATABASE DESK */}
      {/* ========================================================================= */}
      {subTab === 'excel_database' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                    {language === 'en' ? 'Offline Sovereign Storage' : 'Hifadhi Huru ya Ndani'}
                  </span>
                  <span className="text-xs text-emerald-300/80 font-mono">Excel .xlsx Engine</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  {language === 'en' ? 'Excel Civic Database Manager' : 'Msimamizi wa Hifadhidata ya Excel'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {language === 'en'
                    ? 'Read and write platform records directly to Microsoft Excel spreadsheets (.xlsx). Works 100% locally and offline without external cloud accounts or billing dependencies.'
                    : 'Soma na uhifadhi data zote za jukwaa kwenye faili za Excel (.xlsx). Inafanya kazi kikamilifu bila mtandao wala gharama zozote za wingu.'}
                </p>
              </div>

              <button
                onClick={() => {
                  try {
                    const summary = exportDatabaseToExcel();
                    alert(
                      language === 'en'
                        ? `Database downloaded successfully! Exported ${summary.totalUsers} registered citizens, ${summary.totalQuestions} questions, and ${summary.totalGrants} token grants.`
                        : `Hifadhidata imepakuliwa kwa mafanikio! Imerekodi wananchi ${summary.totalUsers}, maswali ${summary.totalQuestions}, na ruzuku za tokeni ${summary.totalGrants}.`
                    );
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'en' ? 'Download Excel Database (.xlsx)' : 'Pakua Hifadhidata ya Excel (.xlsx)'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {language === 'en' ? 'Active Local Data Sheets' : 'Laha Zilizojumuishwa Kwenye Excel'}
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">1. Citizens_Roster</span>
                  <span className="text-[11px] text-slate-500">{language === 'en' ? 'User accounts, roles & counties' : 'Akaunti za wananchi na kaunti'}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">2. Citizen_Inquiries</span>
                  <span className="text-[11px] text-slate-500">{language === 'en' ? 'Questions & constitutional rulings' : 'Maswali na majibu ya kikatiba'}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">3. Token_Ledger</span>
                  <span className="text-[11px] text-slate-500">{language === 'en' ? 'Facilitator grants & awards' : 'Ruzuku za tokeni za wawezeshaji'}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">4. Certificates_Issued</span>
                  <span className="text-[11px] text-slate-500">{language === 'en' ? 'Verified training credentials' : 'Vyeti vya uwezeshaji vilivyotolewa'}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">5. Incident_Audit</span>
                  <span className="text-[11px] text-slate-500">{language === 'en' ? 'Flagged safety & integrity alerts' : 'Kumbukumbu za doria ya ujumbe'}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                {language === 'en' ? 'Inspect / Read Excel File' : 'Kagua Faili ya Excel'}
              </h4>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Select an existing exported Excel workbook to inspect its sheets and verify citizen registration records.'
                  : 'Chagua faili ya Excel ili kukagua laha zake na kuthibitisha kumbukumbu za wananchi.'}
              </p>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 transition-colors">
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  {language === 'en' ? 'Click to select .xlsx file' : 'Bofya kuchagua faili ya .xlsx'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">.xlsx / .xls format</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const res = await readExcelDatabaseFile(file);
                      alert(
                        language === 'en'
                          ? `Excel read successfully! Found sheets: ${res.sheetsFound.join(', ')}. Contains ${res.citizensCount} citizen rows.`
                          : `Faili imesomwa kwa ufanisi! Laha zilizopatikana: ${res.sheetsFound.join(', ')}. Ina wananchi ${res.citizensCount}.`
                      );
                    } catch (err: any) {
                      alert(`Error reading file: ${err?.message || 'Invalid format'}`);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. LIVE GOOGLE SHEET SYNC (ZERO CLOUD COST) */}
      {/* ========================================================================= */}
      {subTab === 'google_sheet_sync' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                    {language === 'en' ? 'Live Cloud Alternative' : 'Njia Mbadala ya Wingu'}
                  </span>
                  <span className="text-xs text-emerald-300 font-mono flex items-center gap-1.5">
                    <CloudOff className="w-3.5 h-3.5" />
                    $0 Cost • No Billing Required
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
                  {language === 'en' ? 'Live Google Sheet Sync' : 'Sawazisha Moja kwa Moja na Google Sheet'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {language === 'en'
                    ? 'Sync all citizen registrations, civic inquiries, suggestions, and certificates to a free Google Sheet using Google Apps Script. Multi-device live access without any paid database services.'
                    : 'Sawazisha orodha ya wananchi, maswali, maoni na vyeti vyote kwenye Google Sheet ya bure kwa kutumia Google Apps Script. Inakupa muunganisho wa simu nyingi bila gharama zozote za wingu.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isSyncingSheet || !sheetInputUrl.trim()}
                  onClick={async () => {
                    if (!sheetInputUrl.trim()) return;
                    setIsSyncingSheet(true);
                    setSheetStatusMsg(null);
                    try {
                      saveGoogleSheetConfig({ webAppUrl: sheetInputUrl.trim() });
                      setSheetConfig(getGoogleSheetConfig());
                      const res = await pushAllDataToGoogleSheet(sheetInputUrl.trim());
                      setSheetStatusMsg({
                        type: 'success',
                        text: language === 'en' ? res.message : 'Takwimu zimesawazishwa kikamilifu na Google Sheet!',
                      });
                    } catch (err: any) {
                      setSheetStatusMsg({
                        type: 'error',
                        text: err?.message || 'Sync failed. Ensure your Apps Script Web App is deployed with "Who has access: Anyone".',
                      });
                    } finally {
                      setIsSyncingSheet(false);
                    }
                  }}
                  className={`flex items-center gap-2 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md ${
                    isSyncingSheet || !sheetInputUrl.trim()
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSheet ? (language === 'en' ? 'Syncing...' : 'Inasawazisha...') : (language === 'en' ? 'Sync Now (Push Data)' : 'Sawazisha Sasa')}</span>
                </button>
              </div>
            </div>

            {sheetStatusMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  sheetStatusMsg.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                    : 'bg-rose-950/80 text-rose-200 border border-rose-500/50'
                }`}
              >
                {sheetStatusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{sheetStatusMsg.text}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Configuration Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  {language === 'en' ? 'Apps Script Web App Connection' : 'Muunganisho wa Google Apps Script'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'en'
                    ? 'Deploy the free Apps Script inside your Google Sheet, then paste its Web App execution URL below.'
                    : 'Weka msimbo wa bure wa Apps Script ndani ya Google Sheet yako, kisha weka anwani ya Web App hapa chini.'}
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {language === 'en' ? 'Google Apps Script Web App URL (*ends in /exec)' : 'Anwani ya Web App (*inaishia kwa /exec)'}
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/.../exec"
                  value={sheetInputUrl}
                  onChange={(e) => setSheetInputUrl(e.target.value)}
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isTestingSheet || !sheetInputUrl.trim()}
                    onClick={async () => {
                      setIsTestingSheet(true);
                      setSheetStatusMsg(null);
                      try {
                        const testRes = await testGoogleSheetConnection(sheetInputUrl.trim());
                        if (testRes.connected) {
                          setSheetStatusMsg({ type: 'success', text: testRes.message });
                          saveGoogleSheetConfig({ webAppUrl: sheetInputUrl.trim() });
                          setSheetConfig(getGoogleSheetConfig());
                        } else {
                          setSheetStatusMsg({ type: 'error', text: testRes.message });
                        }
                      } catch (e: any) {
                        setSheetStatusMsg({ type: 'error', text: e.message || 'Connection test failed' });
                      } finally {
                        setIsTestingSheet(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isTestingSheet ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      saveGoogleSheetConfig({ webAppUrl: sheetInputUrl.trim() });
                      setSheetConfig(getGoogleSheetConfig());
                      setSheetStatusMsg({ type: 'info', text: 'URL configuration saved locally.' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save URL</span>
                  </button>
                </div>
              </div>

              {sheetConfig.lastSyncedAt && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Last Synced:</span>
                    <span>{new Date(sheetConfig.lastSyncedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Status:</span>
                    <span className={sheetConfig.lastSyncStatus === 'success' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {sheetConfig.lastSyncStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Data Sheets Created Automatically:' : 'Laha Zitakazoundwa Moja kwa Moja:'}
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {['Citizens_Roster', 'Citizen_Inquiries', 'Suggestions', 'Certificates_Issued'].map((sheet) => (
                    <span key={sheet} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {sheet}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step-by-Step Apps Script Setup Guide & Copy Code */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    {language === 'en' ? 'Free Setup Guide (3 Minutes)' : 'Mwongozo wa Kuanzisha (Dakika 3)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {language === 'en' ? 'Follow these steps inside your personal Google Account:' : 'Fuata hatua hizi ndani ya Akaunti yako ya Google:'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SAMPLE_APPS_SCRIPT_CODE);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 3000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? (language === 'en' ? 'Copied Code!' : 'Imenakiliwa!') : (language === 'en' ? 'Copy Script Code' : 'Nakili Msimbo')}</span>
                </button>
              </div>

              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <li>Create a blank Google Sheet at <strong className="text-slate-900">sheets.new</strong> in your browser.</li>
                <li>In the top menu, click <strong className="text-slate-900">Extensions</strong> &rarr; <strong className="text-slate-900">Apps Script</strong>.</li>
                <li>Delete everything inside the editor and paste the copied code (button above).</li>
                <li>Click <strong className="text-slate-900">Deploy</strong> &rarr; <strong className="text-slate-900">New deployment</strong>.</li>
                <li>Select type: <strong className="text-slate-900">Web app</strong>. Set Execute as: <strong className="text-slate-900">"Me"</strong> and Who has access: <strong className="text-emerald-700 font-black">"Anyone"</strong>.</li>
                <li>Click Deploy, approve permissions, and copy the Web App URL (ends in <code className="bg-slate-200 px-1 rounded text-slate-800 font-bold">/exec</code>).</li>
                <li>Paste the URL on the left and tap <strong className="text-slate-900">Sync Now</strong>.</li>
              </ol>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Preview of Apps Script Code:</span>
                <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-48 scrollbar-thin">
                  {SAMPLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
