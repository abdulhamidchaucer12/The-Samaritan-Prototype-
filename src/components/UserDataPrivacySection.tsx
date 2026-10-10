import React, { useState } from 'react';
import {
  Shield,
  Download,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Building,
  Scale,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { AuthUser, Language } from '../types';
import {
  isPrimaryAdminAccount,
  downloadUserCivicData,
  deleteUserAccountAndData,
  PRIVACY_POLICY_SECTIONS,
  buildUserComprehensiveDataPacket,
  UserComprehensiveDataExport,
} from '../utils/userDataPrivacy';

interface UserDataPrivacySectionProps {
  currentUser: AuthUser;
  language: Language;
  onLogout: () => void;
}

export const UserDataPrivacySection: React.FC<UserDataPrivacySectionProps> = ({
  currentUser,
  language,
  onLogout,
}) => {
  const isPrimary = isPrimaryAdminAccount(currentUser.username);

  // Download state
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<UserComprehensiveDataExport | null>(null);

  // Privacy Policy state
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>('legal_basis');

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUsernameInput, setDeleteUsernameInput] = useState('');
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Download
  const handleDownload = () => {
    const res = downloadUserCivicData(currentUser);
    if (res.success) {
      setDownloadSuccess(res.filename);
      setTimeout(() => setDownloadSuccess(null), 5000);
    }
  };

  // Handle Preview
  const handleOpenPreview = () => {
    const data = buildUserComprehensiveDataPacket(currentUser);
    setPreviewData(data);
    setShowPreviewModal(true);
  };

  // Handle Deletion Execution
  const handleExecuteDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    setDeleteSuccess(null);
    setIsDeleting(true);

    const result = deleteUserAccountAndData(
      currentUser,
      deleteUsernameInput,
      deletePasswordInput
    );

    setIsDeleting(false);

    if (result.success) {
      setDeleteSuccess(result.message);
      // Wait briefly so user sees the success notice, then invoke onLogout
      setTimeout(() => {
        setShowDeleteModal(false);
        onLogout();
      }, 2500);
    } else {
      setDeleteError(result.message);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-2.5 pb-1 border-b border-slate-200 dark:border-slate-800">
        <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif">
          {language === 'en'
            ? 'Data Rights, Portability & Privacy Governance'
            : 'Haki za Data, Upakuaji na Utawala wa Faragha'}
        </h3>
      </div>

      {/* 1. DATA PORTABILITY / DOWNLOAD MY DATA CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-emerald-200 dark:border-emerald-900/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en' ? 'Download Your Civic Data' : 'Pakua Data Zako za Kiraia'}
            </h4>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {language === 'en' ? 'Article 35 & Data Act §34' : 'Ibara ya 35 & Sheria ya Data §34'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'In compliance with the Kenya Data Protection Act 2019 and Article 35 of the Constitution, you have the right to obtain a full, machine-readable digital export of your civic profile, completed lessons, certificates, token ledger, verification records, and notifications.'
            : 'Kwa mujibu wa Sheria ya Kulinda Data ya Kenya 2019 na Ibara ya 35 ya Katiba, una haki ya kupata nakala kamili ya kidijitali ya masomo uliyosoma, vyeti, salio la ishara za uwezeshaji, na arifa zako zote.'}
        </p>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'en'
                ? `Downloaded successfully: ${downloadSuccess}`
                : `Imepakuliwa kwa mafanikio: ${downloadSuccess}`}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'Download Complete Data (JSON)'
                : 'Pakua Data Kamili (JSON)'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenPreview}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>{language === 'en' ? 'Inspect Data Summary' : 'Kagua Muhtasari wa Data'}</span>
          </button>
        </div>
      </div>

      {/* 2. PRIVACY POLICY IN USER'S PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 font-serif">
              {language === 'en'
                ? 'The Samaritan Civic Privacy Policy'
                : 'Sera ya Faragha ya The Samaritan'}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setPrivacyExpanded(!privacyExpanded)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {privacyExpanded
                ? language === 'en'
                  ? 'Collapse'
                  : 'Funga'
                : language === 'en'
                ? 'Read Full Policy'
                : 'Soma Sera Kamili'}
            </span>
            {privacyExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {language === 'en'
            ? 'We uphold strict zero-commercialization standards: citizen information is never sold, leased, or harvested for advertising. All civic participation is anchored in Article 31 of the Constitution of Kenya.'
            : 'Tunazingatia viwango vikali vya kutofanya biashara na taarifa: taarifa za mwananchi haziuzwi wala kutumiwa kwa matangazo. Ushiriki wote umejengwa juu ya Ibara ya 31 ya Katiba ya Kenya.'}
        </p>

        {/* Collapsible Policy Content */}
        {privacyExpanded && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {PRIVACY_POLICY_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`text-left p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSectionId === sec.id
                      ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="line-clamp-1">
                    {language === 'en' ? sec.titleEn : sec.titleSw}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Section Detail */}
            {activeSectionId && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                {(() => {
                  const sec = PRIVACY_POLICY_SECTIONS.find((s) => s.id === activeSectionId);
                  if (!sec) return null;
                  return (
                    <>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                          {language === 'en' ? sec.titleEn : sec.titleSw}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {language === 'en' ? sec.contentEn : sec.contentSw}
                      </p>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. PROFILE & DATA DELETION / SAFEGUARD CARD */}
      {isPrimary ? (
        /* Primary Founding Admin Safeguard View */
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-sm font-serif">
              {language === 'en'
                ? 'Founding Administrative Protection Active'
                : 'Ulinzi wa Wasimamizi Waasisi Upo Kazini'}
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'en'
              ? `Account "${currentUser.username}" is one of the 5 foundational primary administrators (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4, The_Samaritan). Per institutional governance protocols and certificate verification integrity, primary administrator accounts cannot be deleted.`
              : `Akaunti ya "${currentUser.username}" ni miongoni mwa wasimamizi 5 wakuu waasisi. Kulingana na miongozo ya utawala na uadilifu wa vyeti, akaunti hizi za waasisi haziwezi kufutwa.`}
          </p>

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center gap-2 text-[11px] text-blue-900 dark:text-blue-300">
            <Info className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              {language === 'en'
                ? 'You may update passwords and administrative profile names at any time from your executive console.'
                : 'Unaweza kusasisha nywila na majina ya kiutawala wakati wowote kutoka kwenye dashibodi yako.'}
            </span>
          </div>
        </div>
      ) : (
        /* Regular Citizen & Appointed User Account Deletion View */
        <div className="bg-red-50/40 dark:bg-red-950/20 rounded-3xl p-5 sm:p-6 border border-red-200 dark:border-red-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-bold text-sm text-red-950 dark:text-red-200 font-serif">
                {language === 'en'
                  ? 'Delete Profile & Purge Civic Data'
                  : 'Futa Wasifu na Data Yote ya Kiraia'}
              </h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
              {language === 'en' ? 'Data Act 2019 §40' : 'Sheria ya Data 2019 §40'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {language === 'en'
              ? 'Under Section 40 (Right to Erasure), you can permanently delete your profile and purge all course progress, exam scores, certificates, and tokens. For security and anti-tamper compliance, you must verify your identity with your username and password.'
              : 'Chini ya Kifungu cha 40 (Haki ya Kusahaulika), unaweza kufuta kabisa wasifu wako, masomo, vyeti na alama zote. Kwa ajili ya usalama, ni lazima uthibitishe utambulisho wako kwa jina la mtumiaji na nenosiri lako.'}
          </p>

          <button
            type="button"
            onClick={() => {
              setDeleteUsernameInput('');
              setDeletePasswordInput('');
              setDeleteError(null);
              setDeleteSuccess(null);
              setShowDeleteModal(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'Request Account & Data Deletion'
                : 'Omba Kufuta Wasifu na Data Yote'}
            </span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PREVIEW DATA SUMMARY */}
      {/* ========================================================================= */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 font-serif">
                  {language === 'en' ? 'Civic Data Export Preview' : 'Hakiki Data ya Kiraia'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Account Handle
                  </span>
                  <span className="font-black text-slate-900 dark:text-slate-100">
                    {previewData.citizenProfile.username}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    County Jurisdiction
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {previewData.citizenProfile.county}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Completed Courses
                  </span>
                  <span className="font-bold">
                    {previewData.civicEducationProgress.completedLessonsCount} / 100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Facilitator Tokens
                  </span>
                  <span className="font-bold text-amber-600">
                    {previewData.facilitatorTokensAndCredits.availableBalance} Tokens
                  </span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-xs uppercase text-slate-400 mb-1">
                  Certificates Earned
                </h5>
                {Object.keys(previewData.civicEducationProgress.certificatesEarned).length > 0 ? (
                  <div className="space-y-1.5">
                    {Object.entries(
                      previewData.civicEducationProgress.certificatesEarned
                    ).map(([courseId, cert]: any) => (
                      <div
                        key={courseId}
                        className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {courseId}
                          </span>
                          <span className="text-[10px] font-mono text-amber-800 dark:text-amber-400">
                            {cert.certificateId}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600">
                          Score: {cert.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No certificates issued yet.</p>
                )}
              </div>

              <div>
                <h5 className="font-bold text-xs uppercase text-slate-400 mb-1">
                  Direct Notifications Received
                </h5>
                <span className="font-semibold">
                  {previewData.directNotificationsHistory.length} notification(s) logged
                </span>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-400">
                <strong>Legal Basis:</strong> {previewData.exportMetadata.legalBasis}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {language === 'en' ? 'Close' : 'Funga'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleDownload();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Download JSON' : 'Pakua JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM ACCOUNT & DATA DELETION (WITH USERNAME & PASSWORD) */}
      {/* ========================================================================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-red-300 dark:border-red-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h4 className="font-bold text-base font-serif">
                  {language === 'en'
                    ? 'Confirm Permanent Deletion'
                    : 'Thibitisha Kufuta Kabisa'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDeletion} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 leading-relaxed">
                {language === 'en'
                  ? 'Warning: This will irreversibly erase your profile, all 100 civic course progress records, earned certificates, and token credits. This action CANNOT be undone.'
                  : 'Onyo: Hatua hii itafuta kabisa wasifu wako, masomo 100, vyeti na ishara zako zote. Hatua hii HAIWEZI kubatilishwa.'}
              </div>

              {deleteError && (
                <div className="p-3 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              )}

              {deleteSuccess && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{deleteSuccess}</span>
                </div>
              )}

              {/* Input 1: Confirm Username */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {language === 'en'
                    ? `1. Confirm Username (Type "${currentUser.username}")`
                    : `1. Thibitisha Jina (Andika "${currentUser.username}")`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={deleteUsernameInput}
                    onChange={(e) => setDeleteUsernameInput(e.target.value)}
                    placeholder={currentUser.username}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600 pl-8 font-mono"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Input 2: Confirm Password */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {language === 'en'
                    ? '2. Enter Your Account Password'
                    : '2. Weka Nenosiri Lako'}
                </label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    required
                    value={deletePasswordInput}
                    onChange={(e) => setDeletePasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600 pl-8 pr-8"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showDeletePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deleteUsernameInput || !deletePasswordInput}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>
                    {isDeleting
                      ? language === 'en'
                        ? 'Deleting...'
                        : 'Inafuta...'
                      : language === 'en'
                      ? 'Permanently Delete'
                      : 'Futa Kabisa'}
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
