import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Building,
  Users,
  Scale,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  X,
  ChevronRight,
  Info,
  ArrowLeftRight,
} from 'lucide-react';
import { OfficeProfile, Language, GovernmentBranch, GovernmentLevel } from '../types';
import { translations } from '../data/translations';
import { officesData } from '../data/officesData';
import { toggleBookmarkOffice, getUserProgress } from '../utils/storage';

interface GovernmentExplorerProps {
  language: Language;
  selectedOfficeId?: string | null;
  onClearSelectedOffice?: () => void;
  onNavigateToCompare?: (officeId: string) => void;
}

export const GovernmentExplorer: React.FC<GovernmentExplorerProps> = ({
  language,
  selectedOfficeId,
  onClearSelectedOffice,
  onNavigateToCompare,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeModalOffice, setActiveModalOffice] = useState<OfficeProfile | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    return getUserProgress().bookmarkedOffices;
  });

  // Handle passed selectedOfficeId prop
  React.useEffect(() => {
    if (selectedOfficeId) {
      const found = officesData.find((o) => o.id === selectedOfficeId);
      if (found) {
        setActiveModalOffice(found);
      }
    }
  }, [selectedOfficeId]);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmarkOffice(id);
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtering logic
  const filteredOffices = useMemo(() => {
    return officesData.filter((office) => {
      // Branch filter
      if (selectedBranch !== 'all' && office.branch !== selectedBranch) {
        return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && office.level !== selectedLevel) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = office.name[language].toLowerCase().includes(q);
        const matchesSummary = office.summary[language].toLowerCase().includes(q);
        const matchesRef = office.legalReferences[language].some((ref) =>
          ref.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesSummary && !matchesRef) {
          return false;
        }
      }
      return true;
    });
  }, [selectedBranch, selectedLevel, searchQuery, language]);

  const getBranchIcon = (branch: GovernmentBranch) => {
    switch (branch) {
      case 'executive':
        return Building;
      case 'legislature':
        return Users;
      case 'judiciary':
        return Scale;
      case 'commission':
      case 'oversight':
        return ShieldAlert;
      default:
        return Info;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="border-b border-stone-200 pb-6">
        <h1 className="text-3xl font-extrabold font-serif text-stone-900 tracking-tight">
          {t.explorer.title}
        </h1>
        <p className="text-stone-600 mt-2 text-base max-w-3xl leading-relaxed">
          {t.explorer.subtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search by office name or constitutional article (e.g. Governor, MCA, Art 179)...'
                : 'Tafuta kwa jina la ofisi au kifungu cha katiba (mfano: Gavana, MCA, Kifungu 179)...'
            }
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters: Branch and Level */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Branch Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{t.explorer.filterBranch}:</span>
            </span>
            {[
              { id: 'all', label: t.explorer.allBranches },
              { id: 'executive', label: t.explorer.executive },
              { id: 'legislature', label: t.explorer.legislative },
              { id: 'judiciary', label: t.explorer.judiciary },
              { id: 'commission', label: t.explorer.commission },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranch(b.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedBranch === b.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Level Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-semibold text-stone-500 mr-1">
              {t.explorer.filterLevel}:
            </span>
            {[
              { id: 'all', label: t.explorer.allLevels },
              { id: 'national', label: t.explorer.national },
              { id: 'county', label: t.explorer.county },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedLevel === lvl.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Bookmark Summary */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          {language === 'en'
            ? `Showing ${filteredOffices.length} of ${officesData.length} public offices`
            : `Inaonyesha ofisi ${filteredOffices.length} kati ya ${officesData.length}`}
        </span>
        {bookmarkedIds.length > 0 && (
          <span className="font-semibold text-emerald-700 flex items-center gap-1">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? `${bookmarkedIds.length} offices bookmarked`
                : `Ofisi ${bookmarkedIds.length} zimehifadhiwa`}
            </span>
          </span>
        )}
      </div>

      {/* Grid of Offices */}
      {filteredOffices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-800 text-base">
            {language === 'en' ? 'No public offices match your filter' : 'Hakuna ofisi inayolingana na kichujio chako'}
          </h3>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            {language === 'en'
              ? 'Try resetting branch and level filters, or clear your search keywords.'
              : 'Jaribu kubadilisha vichujio au kufuta maneno ya utafutaji.'}
          </p>
          <button
            onClick={() => {
              setSelectedBranch('all');
              setSelectedLevel('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700"
          >
            {language === 'en' ? 'Reset All Filters' : 'Rejesha Vichujio Vyote'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOffices.map((office) => {
            const BranchIcon = getBranchIcon(office.branch);
            const isBookmarked = bookmarkedIds.includes(office.id);

            return (
              <div
                key={office.id}
                onClick={() => setActiveModalOffice(office)}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-3">
                  {/* Top tags & bookmark */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          office.level === 'county'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {office.level}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 capitalize">
                        {office.branch}
                      </span>
                      {office.selectionMethod === 'elected' && (
                        <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {language === 'en' ? 'Elected' : 'Kura'}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleToggleBookmark(office.id, e)}
                      className="p-1 text-stone-400 hover:text-emerald-700 transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark office'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title & icon */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 group-hover:bg-emerald-100 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center shrink-0 transition-colors">
                      <BranchIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-900 leading-snug">
                        {office.name[language]}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        {office.legalReferences[language][0] || ''}
                      </p>
                    </div>
                  </div>

                  {/* Summary preview */}
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {office.summary[language]}
                  </p>
                </div>

                {/* Card footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-stone-400">
                    {office.legalReferences[language][0] || ''}
                  </span>
                  <span className="font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-0.5">
                    <span>{t.explorer.learnMore}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deep Dive Office Details Modal */}
      {activeModalOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => {
                setActiveModalOffice(null);
                if (onClearSelectedOffice) onClearSelectedOffice();
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    activeModalOffice.level === 'county'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {activeModalOffice.level} Level
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600 capitalize">
                  {activeModalOffice.branch}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  {activeModalOffice.selectionMethod}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-stone-900">
                {activeModalOffice.name[language]}
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {activeModalOffice.legalReferences[language].map((ref, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>

            {/* Selection and Term Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
              <div>
                <strong className="text-stone-500 uppercase tracking-wider text-[10px] block mb-0.5">
                  {t.explorer.howSelected}
                </strong>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {activeModalOffice.howSelected[language]}
                </p>
              </div>
              <div>
                <strong className="text-stone-500 uppercase tracking-wider text-[10px] block mb-0.5">
                  {t.explorer.termOfOffice}
                </strong>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {activeModalOffice.termOfOffice[language]}
                </p>
              </div>
            </div>

            {/* Section 1: Powers & Responsibilities */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>{t.explorer.powers}</span>
              </h3>
              <ul className="space-y-2">
                {activeModalOffice.responsibilities[language].map((power, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-700 flex items-start gap-2 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{power}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: WHAT THIS OFFICE DOES NOT DO (Critical Civic Spec) */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{t.explorer.whatItDoesNotDo}</span>
              </h3>
              <p className="text-[11px] text-rose-700 italic">
                {language === 'en'
                  ? 'Common citizen misconceptions and unlawful demands:'
                  : 'Dhana potofu za wananchi na mambo yasiyo majukumu ya ofisi hii:'}
              </p>
              <ul className="space-y-1.5 pt-1">
                {activeModalOffice.whatItDoesNotDo[language].map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-rose-900 flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Accountability & Removal */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-stone-600" />
                <span>{t.explorer.accountability}</span>
              </h3>
              <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200 leading-relaxed">
                {activeModalOffice.oversightAndAccountability[language]}
              </p>
            </div>

            {/* Section 4: Citizen Engagement Tip */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t.explorer.citizenEngagement}</span>
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {activeModalOffice.citizenEngagement[language]}
              </p>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleToggleBookmark(activeModalOffice.id, e)}
                  className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 py-2 px-3 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {bookmarkedIds.includes(activeModalOffice.id) ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      <span>{language === 'en' ? 'Saved' : 'Imehifadhiwa'}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>{language === 'en' ? 'Bookmark' : 'Hifadhi'}</span>
                    </>
                  )}
                </button>

                {onNavigateToCompare && (
                  <button
                    onClick={() => {
                      const id = activeModalOffice.id;
                      setActiveModalOffice(null);
                      if (onClearSelectedOffice) onClearSelectedOffice();
                      onNavigateToCompare(id);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Compare Side-by-Side' : 'Linganisha na Nyingine'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setActiveModalOffice(null);
                  if (onClearSelectedOffice) onClearSelectedOffice();
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Close Details' : 'Funga Maelezo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
