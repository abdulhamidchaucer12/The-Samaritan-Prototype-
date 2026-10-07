import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle,
  Building2,
  Users,
  Scale,
  ShieldCheck,
  Compass,
  FileText,
  MapPin,
  ArrowRight,
  Sparkles,
  ArrowLeftRight,
  Award,
  Presentation,
  HelpCircle,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { translations } from '../data/translations';
import { officesData } from '../data/officesData';
import { lessonsData } from '../data/lessonsData';
import { getAllCivicCourses } from '../utils/dailyCourses';
import { getCurrentAuthUser } from '../utils/authAndQuestions';
import {
  formatUserHeroGreeting,
  registerSessionVisitIfLoggedIn,
} from '../utils/userDailyLogins';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';

interface HomeHeroProps {
  language: Language;
  onSelectTab: (tab: string) => void;
  onSelectOffice: (officeId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  currentUser?: AuthUser | null;
  onOpenCommunityFeed?: () => void;
  onOpenOnlineModal?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  language,
  onSelectTab,
  onSelectOffice,
  onSelectLesson,
  currentUser,
  onOpenCommunityFeed,
  onOpenOnlineModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language];

  const effectiveUser = currentUser !== undefined ? currentUser : getCurrentAuthUser();
  const [, setGreetingUpdateTick] = useState(0);

  useEffect(() => {
    if (effectiveUser?.username) {
      registerSessionVisitIfLoggedIn(effectiveUser.username);
    }
    const handleUpdate = () => {
      setGreetingUpdateTick((prev) => prev + 1);
    };
    window.addEventListener('the_samaritan_login_count_updated', handleUpdate);
    window.addEventListener('the_samaritan_signatories_updated', handleUpdate);
    window.addEventListener('the_samaritan_admin_names_updated', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_login_count_updated', handleUpdate);
      window.removeEventListener('the_samaritan_signatories_updated', handleUpdate);
      window.removeEventListener('the_samaritan_admin_names_updated', handleUpdate);
    };
  }, [effectiveUser?.username]);

  const greetingText = formatUserHeroGreeting(effectiveUser);

  const allAvailableCourses = getAllCivicCourses();
  const totalCoursesCount = allAvailableCourses.length;

  // Quick search filtering
  const matchingOffices = searchQuery.trim()
    ? officesData.filter(
        (o) =>
          o.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.summary[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.legalReferences[language].some((ref) =>
            ref.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : [];

  const matchingLessons = searchQuery.trim()
    ? allAvailableCourses.filter(
        (l) =>
          l.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.summary[language].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-12">
      {/* Hero Section with Kenyan National Green & Gold Accent */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-stone-950 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-emerald-800/40">
        {/* Subtle decorative background watermark */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* User Greeting Pill (Replaced organization pill and removed AI icon) */}
          <div
            id="hero-user-greeting"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-500/30 text-emerald-200 text-xs font-semibold tracking-wide shadow-xs"
          >
            <span id="hero-greeting-text">{greetingText}</span>
          </div>

          {/* Main Title */}
          <h1 id="hero-main-title" className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-white leading-tight">
            {language === 'en' ? 'Know Your Government.' : 'Jua Serikali Yako.'}
          </h1>

          <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {language === 'en'
              ? 'Demystifying Kenya’s constitutional offices, elected leaders, public participation processes, and accountability systems in clear English and Kiswahili.'
              : 'Kufafanua ofisi za kikatiba za Kenya, viongozi waliochaguliwa na kuteuliwa, ushiriki wa umma na jinsi ya kuwajibisha serikali kwa Kiingereza na Kiswahili rahisi.'}
          </p>

          {/* Interactive Search Bar */}
          <div className="max-w-2xl mx-auto pt-2 text-left">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-stone-400 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 p-4 max-h-80 overflow-y-auto space-y-3 z-30 relative animate-in fade-in">
                {matchingOffices.length === 0 && matchingLessons.length === 0 ? (
                  <p className="text-sm text-stone-500 py-3 text-center">
                    {language === 'en'
                      ? 'No matching offices or lessons found. Try "Governor", "MCA", "Budget", or "Rights".'
                      : 'Hakuna ofisi au somo lililopatikana. Jaribu "Gavana", "Diwani", "Bajeti", au "Haki".'}
                  </p>
                ) : (
                  <>
                    {matchingOffices.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                          {language === 'en' ? 'Government Offices' : 'Ofisi za Umma'} ({matchingOffices.length})
                        </div>
                        <div className="space-y-1">
                          {matchingOffices.slice(0, 5).map((o) => (
                            <div
                              key={o.id}
                              onClick={() => {
                                onSelectOffice(o.id);
                                setSearchQuery('');
                              }}
                              className="p-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer flex items-center justify-between group transition-colors"
                            >
                              <div>
                                <span className="font-semibold text-sm text-stone-900 group-hover:text-emerald-900">
                                  {o.name[language]}
                                </span>
                                <span className="ml-2 text-xs text-stone-500 capitalize">
                                  • {o.branch} • {o.level}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingLessons.length > 0 && (
                      <div className="pt-2 border-t border-stone-100">
                        <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">
                          {language === 'en' ? 'Civic Education Lessons' : 'Masomo ya Uraia'} ({matchingLessons.length})
                        </div>
                        <div className="space-y-1">
                          {matchingLessons.slice(0, 4).map((l) => (
                            <div
                              key={l.id}
                              onClick={() => {
                                onSelectLesson(l.id);
                                setSearchQuery('');
                              }}
                              className="p-2.5 rounded-lg hover:bg-teal-50 cursor-pointer flex items-center justify-between group transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                                  {l.lessonNumber ? `#${l.lessonNumber}` : '•'}
                                </span>
                                <span className="font-semibold text-sm text-stone-900 group-hover:text-teal-900">
                                  {l.title[language]}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('explorer')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{t.home.exploreButton}</span>
            </button>
            <button
              onClick={() => onSelectTab('lessons')}
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-300" />
              <span>
                {language === 'en'
                  ? `Civic Lessons (${totalCoursesCount})`
                  : `Masomo ya Uraia (${totalCoursesCount})`}
              </span>
            </button>
            <button
              onClick={() => onSelectTab('quiz')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.home.quizButton}</span>
            </button>
            <button
              onClick={() => onSelectTab('qa')}
              className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>{language === 'en' ? 'Ask Admins (Q&A)' : 'Uliza Maswali (Q&A)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Online Users Presence Bar */}
      <OnlineUsersPresenceBar
        currentUser={effectiveUser}
        language={language}
        onOpenCommunityFeed={onOpenCommunityFeed}
        onOpenOnlineModal={onOpenOnlineModal}
      />

      {/* 4 Key Civic Fact Highlights */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1 hover:border-emerald-300 transition-colors">
          <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-serif">47</span>
          <h4 className="font-bold text-sm text-stone-800">
            {language === 'en' ? 'County Governments' : 'Serikali za Kaunti'}
          </h4>
          <p className="text-xs text-stone-500">
            {language === 'en' ? 'Devolved power since 2013' : 'Madaraka na huduma mashinani'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1 hover:border-emerald-300 transition-colors">
          <span className="text-3xl sm:text-4xl font-black text-teal-700 font-serif">3</span>
          <h4 className="font-bold text-sm text-stone-800">
            {language === 'en' ? 'Arms of Government' : 'Mihimili ya Dola'}
          </h4>
          <p className="text-xs text-stone-500">
            {language === 'en' ? 'Executive, Legislature, Judiciary' : 'Utendaji, Bunge, Mahakama'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1 hover:border-emerald-300 transition-colors">
          <span className="text-3xl sm:text-4xl font-black text-amber-700 font-serif">{totalCoursesCount}</span>
          <h4 className="font-bold text-sm text-stone-800">
            {language === 'en' ? 'Available Civic Courses' : 'Masomo Yote ya Uraia'}
          </h4>
          <p className="text-xs text-stone-500">
            {language === 'en' ? 'Foundational, daily drops & supplementary' : 'Mtaala mkuu, ya kila siku na ya ziada'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs text-center space-y-1 hover:border-emerald-300 transition-colors">
          <span className="text-3xl sm:text-4xl font-black text-emerald-800 font-serif">100%</span>
          <h4 className="font-bold text-sm text-stone-800">
            {language === 'en' ? 'Non-Partisan' : 'Bila Upendeleo'}
          </h4>
          <p className="text-xs text-stone-500">
            {language === 'en' ? 'Grounded in Katiba 2010' : 'Imejengwa juu ya Katiba'}
          </p>
        </div>
      </section>

      {/* Quick Category Gateway */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif text-stone-900">
              {language === 'en' ? 'Explore Government Structures' : 'Chunguza Miundo ya Serikali'}
            </h2>
            <p className="text-stone-500 text-sm">
              {language === 'en'
                ? 'Understand the exact role of every public office and who to hold accountable'
                : 'Fahamu kazi ya kila ofisi ya umma na nani wa kumwajibisha'}
            </p>
          </div>
          <button
            onClick={() => onSelectTab('explorer')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'View All 35 Public Offices' : 'Tazama Ofisi Zote 35 za Umma'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: County Devolution */}
          <div
            onClick={() => onSelectTab('explorer')}
            className="group p-5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-emerald-800">
                {language === 'en' ? 'County Governments' : 'Serikali za Kaunti'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'en'
                  ? 'Governors, County Ministers (CECMs), and Chief Officers managing local hospitals, water, and roads.'
                  : 'Magavana, Mawaziri wa Kaunti, na Makatibu wanaoendesha huduma za afya, maji, na masoko.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-emerald-700">
              <span>{language === 'en' ? 'Explore county offices' : 'Chunguza ofisi za kaunti'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Legislature / MCAs & MPs */}
          <div
            onClick={() => onSelectTab('explorer')}
            className="group p-5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-teal-800">
                {language === 'en' ? 'Parliaments & MCAs' : 'Bunge na Madiwani'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'en'
                  ? 'National Assembly, Senate, and Ward MCAs who write the laws, allocate budgets, and oversee governors.'
                  : 'Wabunge, Maseneta, na Madiwani wa Wadi wanaotunga sheria, kuidhinisha bajeti na kukagua serikali.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-teal-700">
              <span>{language === 'en' ? 'Explore legislative offices' : 'Chunguza wabunge na madiwani'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: The Courts */}
          <div
            onClick={() => onSelectTab('explorer')}
            className="group p-5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-blue-800">
                {language === 'en' ? 'Courts & Judiciary' : 'Mahakama na Haki'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'en'
                  ? 'Supreme Court, High Court, and Magistrates who protect constitutional rights and resolve legal disputes.'
                  : 'Mahakama ya Juu, Mahakama Kuu na Mahakimu wanaolinda haki za kikatiba na kuamua kesi.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-blue-700">
              <span>{language === 'en' ? 'Explore justice system' : 'Chunguza idara ya mahakama'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Commissions & Watchdogs */}
          <div
            onClick={() => onSelectTab('explorer')}
            className="group p-5 bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800">
                {language === 'en' ? 'Commissions & Watchdogs' : 'Tume Huru na Wakaguzi'}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'en'
                  ? 'Auditor-General, EACC, Ombudsman, and IEBC guarding against corruption and protecting public funds.'
                  : 'Mkaguzi Mkuu, EACC, Ombudsman, na IEBC wanaolinda kodi za wananchi na kupambana na ufisadi.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-amber-700">
              <span>{language === 'en' ? 'Explore commissions' : 'Chunguza tume huru'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Interactive Civic Tools Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-blue-700" />
              <span>{language === 'en' ? 'Civic Tools & Action' : 'Zana za Uraia na Hatua'}</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              {language === 'en' ? 'Interactive Citizen Toolkit' : 'Zana Shirikishi za Mwananchi'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 0: Citizen Q&A */}
          <div
            onClick={() => onSelectTab('qa')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group border border-blue-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                {language === 'en' ? 'Citizen Civic Q&A' : 'Maswali na Majibu ya Raia'}
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                {language === 'en'
                  ? 'Ask questions anonymously about public funds, MCAs, or police rights. Verified responses answered by Admin 1 & Admin 2.'
                  : 'Uliza maswali bila jina lako halisi kuhusu fedha za umma, wadi au polisi. Majibu ya kikatiba na Wasimamizi (Admin 1 & 2).'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>{language === 'en' ? 'Ask a Question' : 'Uliza Swali'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          {/* Card 1: Side-by-Side Office Comparison */}
          <div
            onClick={() => onSelectTab('compare')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group border border-blue-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                {language === 'en' ? 'Office Comparison Tool' : 'Linganisha Ofisi za Umma'}
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                {language === 'en'
                  ? 'Compare roles side-by-side: MP vs MCA, Governor vs County Commissioner, DPP vs DCI, and understand exact jurisdictions.'
                  : 'Linganisha majukumu sambamba: Mbunge dhidi ya Diwani, Gavana na Kamishna, DPP na DCI ili kujua mamlaka halisi.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>{language === 'en' ? 'Launch Comparison' : 'Anza Ulinganishaji'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: My Learning & Official Certificate */}
          <div
            onClick={() => onSelectTab('myLearning')}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group border border-emerald-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                {language === 'en' ? 'Civic Progress & Certificate' : 'Maendeleo na Cheti cha Uraia'}
              </h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                {language === 'en'
                  ? 'Track your module completions, save constitutional bookmarks, and generate an official printable KFE Civic Certificate.'
                  : 'Fuatilia masomo uliyokamilisha, hifadhi kumbukumbu za kikatiba, na uzalishe Cheti Rasmi cha KFE cha Uraia.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span>{language === 'en' ? 'View Dashboard & Seal' : 'Tazama Cheti Chako'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Community Facilitator Deck */}
          <div
            onClick={() => onSelectTab('demoMode')}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-900 to-stone-900 text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group border border-amber-800"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                <Presentation className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">
                {language === 'en' ? 'Community Facilitator Deck' : 'Mfumo wa Muwezeshaji Barazani'}
              </h3>
              <p className="text-xs text-amber-100/80 leading-relaxed">
                {language === 'en'
                  ? 'Optimized slide deck for barazas, school halls, and civic workshops with full keyboard navigation and high-contrast presentation.'
                  : 'Slaidi maalum kwa ajili ya mikutano ya baraza, shule na warsha za uraia zenye maneno makubwa na uwazi wa juu.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-300">
              <span>{language === 'en' ? 'Open Presentation' : 'Fungua Slaidi'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Republic of Kenya Nationwide Civic Empowerment Spotlight Banner */}
      <section className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'en'
                  ? 'The Republic of Kenya • Nationwide Civic Empowerment'
                  : 'Jamhuri ya Kenya • Mwangaza wa Uraia Kitaifa'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-emerald-950">
              {language === 'en'
                ? 'Empowering Citizen Communities Across All 47 Counties'
                : 'Kuziwezesha Jamii za Wananchi Kote Katika Kaunti Zote 47'}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {language === 'en'
                ? 'The Samaritan civic platform operates with an overarching implementation scope across The Republic of Kenya. From Coastal counties to the Rift Valley, Western, Central, Nairobi, and Northern frontier counties, we directly train youth groups, women\'s chamas, community elders, and secondary school learners to master the entire Constitution of Kenya 2010, participate in devolved county budget hearings, audit public expenditures, and defend fundamental human rights.'
                : 'Mfumo wa elimu ya uraia wa The Samaritan unahudumu nchi nzima katika Jamhuri ya Kenya. Kuanzia ukanda wa Pwani hadi Bonde la Ufa, Magharibi, Kati, Nairobi, na Kaunti za Kaskazini, tunafunza vijana, vikundi vya wanawake, wazee wa mitaa, na wanafunzi kuelewa Katiba yote ya Kenya 2010, kushiriki bajeti za kaunti zote 47, na kulinda haki za kikatiba.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 font-medium text-emerald-800">
                {language === 'en' ? 'Coast Region' : 'Kanda ya Pwani'}
              </span>
              <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 font-medium text-emerald-800">
                {language === 'en' ? 'Rift Valley & Western' : 'Bonde la Ufa na Magharibi'}
              </span>
              <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 font-medium text-emerald-800">
                {language === 'en' ? 'Central & Nairobi' : 'Mlima Kenya na Nairobi'}
              </span>
              <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 font-medium text-emerald-800">
                {language === 'en' ? 'Northern & Eastern' : 'Kaskazini na Mashariki'}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'Need to Take Action?' : 'Unataka Kuchukua Hatua?'}</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'en'
                ? 'Learn how to write an official citizen memorandum for any County Assembly or report public resource misuse.'
                : 'Jifunze jinsi ya kuandika barua rasmi ya maoni (memorandum) kwa Bunge lolote la Kaunti au kuripoti fedha za umma zilizopotea.'}
            </p>
            <button
              onClick={() => onSelectTab('action')}
              className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{language === 'en' ? 'Open Citizen Action Toolkit' : 'Fungua Zana za Mwananchi'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
