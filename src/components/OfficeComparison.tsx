import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Shield,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  UserCheck,
  Scale,
  Printer,
  Sparkles,
} from 'lucide-react';
import { OfficeProfile, Language } from '../types';
import { translations } from '../data/translations';
import { printDocument } from '../utils/printHelper';

interface OfficeComparisonProps {
  offices: OfficeProfile[];
  language: Language;
  preselectedOfficeId?: string;
  onSelectOffice: (officeId: string) => void;
}

export const OfficeComparison: React.FC<OfficeComparisonProps> = ({
  offices,
  language,
  preselectedOfficeId,
  onSelectOffice,
}) => {
  const t = translations[language];

  // Default to MP vs MCA, or preselected
  const [firstOfficeId, setFirstOfficeId] = useState<string>(
    preselectedOfficeId || 'member_national_assembly'
  );
  const [secondOfficeId, setSecondOfficeId] = useState<string>(
    preselectedOfficeId === 'mca' ? 'member_national_assembly' : 'mca'
  );

  const officeA = offices.find((o) => o.id === firstOfficeId) || offices[0];
  const officeB = offices.find((o) => o.id === secondOfficeId) || offices[1] || offices[0];

  const presets = [
    {
      label: t.comparison.mpVsMca,
      idA: 'member_national_assembly',
      idB: 'mca',
    },
    {
      label: t.comparison.govVsCc,
      idA: 'governor',
      idB: 'county_commissioner',
    },
    {
      label: t.comparison.senVsMp,
      idA: 'senator',
      idB: 'member_national_assembly',
    },
    {
      label: t.comparison.dppVsDci,
      idA: 'odpp',
      idB: 'dci',
    },
  ];

  const [mobileViewTab, setMobileViewTab] = useState<'both' | 'a' | 'b'>('both');

  const handlePrint = () => {
    printDocument('printable-office-comparison');
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Banner with KFE & Kenyan themed accents */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Civic Clarity Tool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
            {t.comparison.title}
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            {t.comparison.subtitle}
          </p>
        </div>
      </div>

      {/* Preset Comparison Buttons */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t.comparison.popularComparisons}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setFirstOfficeId(preset.idA);
                setSecondOfficeId(preset.idB);
              }}
              className={`text-left p-3 rounded-lg border text-xs font-medium transition-all min-h-[44px] flex items-center ${
                firstOfficeId === preset.idA && secondOfficeId === preset.idB
                  ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
          <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider mb-2">
            {t.comparison.selectFirst}
          </label>
          <select
            value={firstOfficeId}
            onChange={(e) => setFirstOfficeId(e.target.value)}
            className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          >
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name[language]} ({o.level})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
          <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
            {t.comparison.selectSecond}
          </label>
          <select
            value={secondOfficeId}
            onChange={(e) => setSecondOfficeId(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 min-h-[44px]"
          >
            {offices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name[language]} ({o.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile view switcher for small screens */}
      <div className="md:hidden flex items-center bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileViewTab('both')}
          className={`flex-1 py-2 px-2 text-center rounded-lg transition-all min-h-[38px] ${
            mobileViewTab === 'both'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'en' ? 'Side by Side' : 'Pamoja'}
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('a')}
          className={`flex-1 py-2 px-2 text-center rounded-lg transition-all min-h-[38px] truncate ${
            mobileViewTab === 'a'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {officeA.name[language]}
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('b')}
          className={`flex-1 py-2 px-2 text-center rounded-lg transition-all min-h-[38px] truncate ${
            mobileViewTab === 'b'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {officeB.name[language]}
        </button>
      </div>

      {/* Comparison Table / Cards */}
      <div
        id="printable-office-comparison"
        className="printable-document-target bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden mb-8"
      >
        {/* Table Top Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200 bg-slate-50">
          <div className={`p-5 border-b md:border-b-0 md:border-r border-slate-200 bg-blue-50/40 ${
            mobileViewTab === 'b' ? 'hidden md:block' : 'block'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                {officeA.level} • {officeA.branch}
              </span>
              <button
                onClick={() => onSelectOffice(officeA.id)}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                {t.explorer.learnMore} →
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              {officeA.name[language]}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {officeA.legalReferences[language].join(' • ')}
            </p>
          </div>

          <div className={`p-5 bg-emerald-50/40 ${
            mobileViewTab === 'a' ? 'hidden md:block' : 'block'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                {officeB.level} • {officeB.branch}
              </span>
              <button
                onClick={() => onSelectOffice(officeB.id)}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                {t.explorer.learnMore} →
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              {officeB.name[language]}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {officeB.legalReferences[language].join(' • ')}
            </p>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y divide-slate-100 text-sm">
          {/* Row 1: Core Responsibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6 hover:bg-slate-50/50 transition-colors">
            <div className={mobileViewTab === 'b' ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-2 font-bold text-blue-950 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{t.comparison.coreRole}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                  {officeA.name[language]}
                </span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-700 text-xs sm:text-sm">
                {officeA.responsibilities[language].slice(0, 4).map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
            <div className={`md:border-l md:border-slate-200 md:pl-6 ${
              mobileViewTab === 'a' ? 'hidden md:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 font-bold text-emerald-950 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t.comparison.coreRole}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {officeB.name[language]}
                </span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-700 text-xs sm:text-sm">
                {officeB.responsibilities[language].slice(0, 4).map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: What It Does NOT Do (Critical Civic Distinction) */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6 bg-amber-50/30">
            <div className={mobileViewTab === 'b' ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-2 font-bold text-red-950 mb-2">
                <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{t.comparison.limits}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                  {officeA.name[language]}
                </span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-700 text-xs sm:text-sm">
                {officeA.whatItDoesNotDo[language].map((item, i) => (
                  <li key={i} className="text-red-900/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`md:border-l md:border-slate-200 md:pl-6 ${
              mobileViewTab === 'a' ? 'hidden md:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 font-bold text-red-950 mb-2">
                <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{t.comparison.limits}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {officeB.name[language]}
                </span>
              </div>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-700 text-xs sm:text-sm">
                {officeB.whatItDoesNotDo[language].map((item, i) => (
                  <li key={i} className="text-red-900/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 3: Selection / How Appointed */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6 hover:bg-slate-50/50 transition-colors">
            <div className={mobileViewTab === 'b' ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.appointment}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                  {officeA.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {officeA.howSelected[language]}
              </p>
            </div>
            <div className={`md:border-l md:border-slate-200 md:pl-6 ${
              mobileViewTab === 'a' ? 'hidden md:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">
                <UserCheck className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.appointment}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {officeB.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {officeB.howSelected[language]}
              </p>
            </div>
          </div>

          {/* Row 4: Term & Removal */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6 hover:bg-slate-50/50 transition-colors">
            <div className={mobileViewTab === 'b' ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.term}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                  {officeA.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm mb-3">
                {officeA.termOfOffice[language]}
              </p>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.removal}</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {officeA.removalProcess
                  ? officeA.removalProcess[language]
                  : language === 'en'
                    ? 'Subject to constitutional and statutory grounds.'
                    : 'Kulingana na misingi ya kikatiba na sheria.'}
              </p>
            </div>
            <div className={`md:border-l md:border-slate-200 md:pl-6 ${
              mobileViewTab === 'a' ? 'hidden md:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.term}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {officeB.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm mb-3">
                {officeB.termOfOffice[language]}
              </p>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-slate-600" />
                <span>{t.comparison.removal}</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                {officeB.removalProcess
                  ? officeB.removalProcess[language]
                  : language === 'en'
                    ? 'Subject to constitutional and statutory grounds.'
                    : 'Kulingana na misingi ya kikatiba na sheria.'}
              </p>
            </div>
          </div>

          {/* Row 5: Citizen Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6 bg-slate-50/70">
            <div className={mobileViewTab === 'b' ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-blue-700" />
                <span>{t.comparison.citizenRole}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 uppercase font-mono">
                  {officeA.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {officeA.citizenEngagement[language]}
              </p>
            </div>
            <div className={`md:border-l md:border-slate-200 md:pl-6 ${
              mobileViewTab === 'a' ? 'hidden md:block' : 'block'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{t.comparison.citizenRole}</span>
                <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                  {officeB.name[language]}
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                {officeB.citizenEngagement[language]}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            {language === 'en'
              ? 'Derived from the Constitution of Kenya 2010 & Statutory Laws'
              : 'Imenukuliwa kutoka Katiba ya Kenya 2010 na Sheria za Nchi'}
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.common.print}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
