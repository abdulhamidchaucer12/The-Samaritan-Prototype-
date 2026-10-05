import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  Calendar,
  Filter,
  CheckCircle2,
  FileCheck,
  Flame,
  PlusCircle,
  Brain,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { CivicLesson, Language } from '../types';
import { translations } from '../data/translations';
import {
  getAllCivicCourses,
  getTodaysNewCourses,
  getTodayDateString,
  addThreeMoreCoursesNow,
} from '../utils/dailyCourses';
import { markLessonCompleted, getUserProgress } from '../utils/storage';
import { CourseQuizAndCertificate } from './CourseQuizAndCertificate';
import { getCategoryLabel } from '../utils/categoryManagement';
import { OnlineUsersPresenceBar } from './OnlineUsersPresenceBar';
import { getCurrentAuthUser } from '../utils/authAndQuestions';

interface LessonsViewProps {
  language: Language;
  selectedLessonId?: string | null;
  onClearSelectedLesson?: () => void;
  onNavigateToQuiz?: () => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  language,
  selectedLessonId,
  onClearSelectedLesson,
  onNavigateToQuiz,
}) => {
  const t = translations[language];

  // Dynamic state for all courses (10 foundational + daily drops + supplementary courses)
  const [allCourses, setAllCourses] = useState<CivicLesson[]>(() => getAllCivicCourses());
  const [activeLesson, setActiveLesson] = useState<CivicLesson | null>(null);
  const [courseSubView, setCourseSubView] = useState<'reading' | 'quiz_certificate'>('reading');

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    return getUserProgress().completedLessons;
  });

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'today' | 'foundational' | 'completed' | 'supplementary'>('all');
  const todayDateStr = getTodayDateString();

  // Load and sync all courses, with real-time updates when an admin publishes a supplementary course
  useEffect(() => {
    const loadCourses = () => {
      const courses = getAllCivicCourses();
      setAllCourses(courses);
    };
    loadCourses();

    const handleUpdate = () => {
      loadCourses();
    };

    window.addEventListener('civic_lessons_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('civic_lessons_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Handle selectedLessonId prop
  useEffect(() => {
    if (selectedLessonId) {
      const found = allCourses.find((l) => l.id === selectedLessonId);
      if (found) {
        setActiveLesson(found);
        setCourseSubView('reading');
      }
    }
  }, [selectedLessonId, allCourses]);

  const handleMarkComplete = (lessonId: string) => {
    markLessonCompleted(lessonId);
    if (!completedIds.includes(lessonId)) {
      setCompletedIds((prev) => [...prev, lessonId]);
    }
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = allCourses.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < allCourses.length - 1) {
      setActiveLesson(allCourses[currentIndex + 1]);
      setCourseSubView('reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (!activeLesson) return;
    const currentIndex = allCourses.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(allCourses[currentIndex - 1]);
      setCourseSubView('reading');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const todaysDrops = useMemo(() => {
    return allCourses.filter((c) => c.publishedDate === todayDateStr || c.isDailyCourse);
  }, [allCourses, todayDateStr]);

  const supplementaryCourses = useMemo(() => {
    return allCourses.filter((c) => c.isSupplementary || c.isCustom);
  }, [allCourses]);

  const filteredCourses = useMemo(() => {
    if (categoryFilter === 'today') {
      return todaysDrops;
    }
    if (categoryFilter === 'supplementary') {
      return supplementaryCourses;
    }
    if (categoryFilter === 'foundational') {
      return allCourses.filter((c) => !c.isDailyCourse && !c.isSupplementary && !c.isCustom);
    }
    if (categoryFilter === 'completed') {
      return allCourses.filter((c) => completedIds.includes(c.id));
    }
    return allCourses;
  }, [allCourses, categoryFilter, todaysDrops, supplementaryCourses, completedIds]);

  const progressPercentage = Math.round(
    (completedIds.length / allCourses.length) * 100
  );

  const handleManualAddCourses = () => {
    const updated = addThreeMoreCoursesNow();
    setAllCourses(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Progress Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Civic Curriculum & Daily Courses' : 'Mtaala wa Uraia na Masomo ya Kila Siku'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 tracking-tight">
            {t.lessons.title}
          </h1>
          <p className="text-stone-600 mt-2 text-base max-w-2xl leading-relaxed">
            {language === 'en'
              ? 'Comprehensive civic education modules covering the Constitution of Kenya 2010, County Governance, and Bill of Rights. Automatically updated with 3 new specialized courses everyday, each featuring a 10-question quiz and an official printable Certificate of Competency.'
              : 'Masomo ya kina ya elimu ya uraia kuhusu Katiba ya Kenya 2010, Serikali za Kaunti na Haki za Binadamu. Masomo mapya 3 huongezwa kiotomatiki kila siku, kila moja likiwa na chemsha bongo ya maswali 10 na Cheti rasmi cha Uwezo kinachoweza kuchapishwa.'}
          </p>
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs min-w-[260px] space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-600">{t.lessons.progress}</span>
            <span className="text-teal-700 font-bold font-mono">
              {completedIds.length} / {allCourses.length} ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-[11px] text-stone-500 flex items-center justify-between pt-0.5">
            <span>{allCourses.length} Courses Available</span>
            <span className="text-teal-800 font-bold">10 Quiz Questions / Course</span>
          </div>
        </div>
      </div>

      {/* Daily Drop Highlight Banner (Shows when not inside single lesson) */}
      {!activeLesson && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-md border border-teal-800/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 px-3 py-1 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'en'
                    ? "Today's 3 New Courses Are Live!"
                    : 'Masomo Mapya 3 ya Leo Yapo Tayari!'}
                </span>
                <span className="text-amber-200 font-mono">• {todayDateStr}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                {language === 'en'
                  ? '3 New Civic Courses Automatically Added Daily'
                  : 'Masomo Mapya 3 ya Uraia Huongezwa Kila Siku'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {language === 'en'
                  ? 'Complete any daily or foundational course and take the 10-question quiz to claim your margin-to-margin printable official certificate with zero clutter outside the certificate.'
                  : 'Soma somo lolote na ufanye chemsha bongo ya maswali 10 ili kupata cheti chako rasmi kinachochapika bila maandishi yasiyotakiwa pembeni.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setCategoryFilter('today')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
              >
                <Flame className="w-3.5 h-3.5 text-slate-950" />
                <span>{language === 'en' ? "View Today's Drops" : 'Ona Masomo ya Leo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Either Single Course Workspace or Course Grid */}
      {activeLesson ? (
        /* SINGLE COURSE WORKSPACE VIEW */
        <div className="space-y-6">
          {/* Top Course Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200 no-print">
            <button
              onClick={() => {
                setActiveLesson(null);
                if (onClearSelectedLesson) onClearSelectedLesson();
              }}
              className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-teal-900 py-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {language === 'en' ? 'Back to All Courses' : 'Rudi kwenye Masomo Yote'}
              </span>
            </button>

            {/* Sub-view switcher: Reading vs 10-Question Quiz & Certificate */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-bold">
              <button
                onClick={() => setCourseSubView('reading')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  courseSubView === 'reading'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>{language === 'en' ? 'Course Reading' : 'Kusoma Somo'}</span>
              </button>

              <button
                onClick={() => setCourseSubView('quiz_certificate')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  courseSubView === 'quiz_certificate'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'en' ? '10-Question Quiz & Certificate' : 'Mtihani wa Maswali 10 na Cheti'}</span>
              </button>
            </div>
          </div>

          {/* Render Subview */}
          {courseSubView === 'quiz_certificate' ? (
            <CourseQuizAndCertificate
              course={activeLesson}
              language={language}
              onBackToCourse={() => setCourseSubView('reading')}
              onCompleted={() => handleMarkComplete(activeLesson.id)}
            />
          ) : (
            /* COURSE READING MATERIAL ARTICLE */
            <article className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8">
              {/* Top metadata */}
              <div className="space-y-3 border-b border-stone-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full uppercase tracking-wider">
                      {t.lessons.lesson} {activeLesson.lessonNumber}
                    </span>
                    <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
                      {getCategoryLabel(activeLesson.category, language)}
                    </span>
                    {activeLesson.isDailyCourse && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Daily Drop</span>
                      </span>
                    )}
                    {(activeLesson.isSupplementary || activeLesson.isCustom) && (
                      <span className="text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Supplementary Couser</span>
                      </span>
                    )}
                    {activeLesson.developedByAi && (
                      <span className="text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Brain className="w-3 h-3 text-teal-700" />
                        <span>Operator AI Generated (10-Q)</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {activeLesson.readTimeMinutes} {t.lessons.readTime}
                    </span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 leading-tight">
                  {activeLesson.title[language]}
                </h2>

                <p className="text-stone-600 text-base leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                  {activeLesson.summary[language]}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {activeLesson.sections.map((sec, idx) => (
                  <section key={idx} className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-stone-900 font-serif">
                        {sec.title[language]}
                      </h3>
                      {sec.constitutionalArticle && (
                        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
                          {sec.constitutionalArticle}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed">
                      {sec.content[language]}
                    </p>

                    {/* Callout if any */}
                    {sec.callout && (
                      <div className="p-4 bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl text-xs font-semibold text-emerald-950 italic leading-relaxed">
                        {sec.callout[language]}
                      </div>
                    )}

                    {/* Bullet points if any */}
                    {sec.bulletPoints && (
                      <ul className="space-y-2 pt-1">
                        {sec.bulletPoints[language].map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-stone-700 flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* Key Terms Glossary Box */}
              {activeLesson.keyTerms && activeLesson.keyTerms.length > 0 && (
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    {t.lessons.keyTerms}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.keyTerms.map((kt, kIdx) => (
                      <div key={kIdx} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                        <strong className="text-xs font-bold text-teal-900 block">
                          {kt.term[language]}
                        </strong>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {kt.definition[language]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Citizen Action Tip (Call to Action) */}
              <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>{t.lessons.citizenActionTip}</span>
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {activeLesson.citizenActionTip[language]}
                </p>
              </div>

              {/* High-Impact Quiz Callout Banner */}
              <div className="p-6 bg-gradient-to-r from-stone-900 to-teal-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Official Course Certification</span>
                  </div>
                  <h4 className="text-base font-bold font-serif">
                    {language === 'en'
                      ? 'Ready to take the 10-Question Course Quiz?'
                      : 'Uko tayari kufanya Mtihani wa Maswali 10 wa Somo?'}
                  </h4>
                  <p className="text-xs text-stone-300">
                    {language === 'en'
                      ? 'Answer 10 tailored multiple-choice questions to claim your margin-to-margin printable Certificate of Competency.'
                      : 'Jibu maswali 10 maalum ili kupata Cheti chako rasmi cha Uwezo kinachoweza kuchapishwa.'}
                  </p>
                </div>

                <button
                  onClick={() => setCourseSubView('quiz_certificate')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.02] shrink-0"
                >
                  {language === 'en' ? 'Start 10-Question Quiz ➔' : 'Anza Chemsha Bongo ➔'}
                </button>
              </div>

              {/* Bottom Controls: Mark Complete, Prev, Next */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => handleMarkComplete(activeLesson.id)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    completedIds.includes(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(activeLesson.id)
                      ? t.lessons.completed
                      : t.lessons.markComplete}
                  </span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handlePrevLesson}
                    disabled={activeLesson.lessonNumber === 1}
                    className="px-3 py-2 rounded-lg border border-stone-200 text-xs font-bold text-stone-600 disabled:opacity-40 hover:bg-stone-50"
                  >
                    {language === 'en' ? 'Previous' : 'Iliyopita'}
                  </button>
                  <button
                    onClick={handleNextLesson}
                    disabled={activeLesson.lessonNumber === allCourses.length}
                    className="px-4 py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <span>{language === 'en' ? 'Next Course' : 'Somo Linalofuata'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          )}
        </div>
      ) : (
        /* ALL COURSES GRID VIEW */
        <div className="space-y-6">
          {/* Real-time Online Users Presence Bar */}
          <OnlineUsersPresenceBar
            currentUser={getCurrentAuthUser()}
            language={language}
            onOpenOnlineModal={() => window.dispatchEvent(new CustomEvent('open_online_users_modal'))}
            onOpenCommunityFeed={() => window.dispatchEvent(new CustomEvent('open_community_feed'))}
          />

          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {language === 'en' ? `All Courses (${allCourses.length})` : `Masomo Yote (${allCourses.length})`}
              </button>

              <button
                onClick={() => setCategoryFilter('today')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'today'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'en' ? `Today's Drops (${todaysDrops.length})` : `Yaliyoongezwa Leo (${todaysDrops.length})`}</span>
              </button>

              <button
                onClick={() => setCategoryFilter('supplementary')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  categoryFilter === 'supplementary'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-purple-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>
                  {language === 'en'
                    ? `Supplementary Courses (${supplementaryCourses.length})`
                    : `Masomo ya Ziada (${supplementaryCourses.length})`}
                </span>
                {supplementaryCourses.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-900 font-extrabold uppercase">
                    New
                  </span>
                )}
              </button>

              <button
                onClick={() => setCategoryFilter('foundational')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'foundational'
                    ? 'bg-teal-800 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {language === 'en' ? 'Foundational Mtaala (10)' : 'Mtaala wa Awali (10)'}
              </button>

              <button
                onClick={() => setCategoryFilter('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === 'completed'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {language === 'en' ? `Completed (${completedIds.length})` : `Yaliyokamilika (${completedIds.length})`}
              </button>
            </div>

            <div className="text-xs text-stone-500 font-mono">
              <span>Updated daily with 3 new courses</span>
            </div>
          </div>

          {/* Supplementary Course Section Showcase Banner */}
          {categoryFilter === 'supplementary' && (
            <div className="p-6 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl border border-purple-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/25 text-purple-200 border border-purple-400/30">
                    Supplementary Couser Section
                  </span>
                  <span className="text-purple-300 text-xs flex items-center gap-1 font-medium">
                    <Brain className="w-3.5 h-3.5 text-teal-300" />
                    Operator AI Curriculum
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl text-white">
                  {language === 'en' ? 'Supplementary Civic Courses' : 'Masomo ya Ziada ya Uraia'}
                </h3>
                <p className="text-xs text-purple-200/90 leading-relaxed">
                  {language === 'en'
                    ? 'Specialized civic modules submitted by administrators. Operator AI automatically develops 10 examination questions, 4 answer choices, explanations, and complete Kiswahili translations as soon as the topic is submitted.'
                    : 'Masomo maalum yaliyowasilishwa na wasimamizi. Operator AI hutunga mara moja maswali 10 ya mtihani, chaguzi 4 za majibu, ufafanuzi, na tafsiri kamili ya Kiswahili punde mada inapowasilishwa.'}
                </p>
              </div>

              <div className="text-xs font-mono text-purple-200 shrink-0 bg-purple-900/60 px-4 py-2 rounded-xl border border-purple-700/50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>{supplementaryCourses.length} {language === 'en' ? 'Modules Available' : 'Masomo Yaliyopo'}</span>
              </div>
            </div>
          )}

          {/* Empty State when no courses in selected filter */}
          {filteredCourses.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
              <h4 className="text-base font-bold text-stone-800 font-serif">
                {language === 'en' ? 'No Courses Found' : 'Hakuna Masomo Yaliyopatikana'}
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {categoryFilter === 'supplementary'
                  ? language === 'en'
                    ? 'No supplementary courses have been created yet. Administrators can submit any topic in the Admin Dashboard, and Operator AI will formulate 10 questions and publish it right here.'
                    : 'Hakuna masomo ya ziada yaliyoundwa bado. Wasimamizi wanaweza kuwasilisha mada yoyote kwenye Dashibodi ya Wasimamizi, na Operator AI itatunga maswali 10 na kuyachapisha hapa.'
                  : language === 'en'
                  ? 'No courses match the selected filter.'
                  : 'Hakuna masomo yanayolingana na kichujio kilichochaguliwa.'}
              </p>
            </div>
          )}

          {/* Courses Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((lesson) => {
              const isCompleted = completedIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setCourseSubView('reading');
                  }}
                  className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all p-5 sm:p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  {/* Subtle top indicator for daily courses */}
                  {lesson.isDailyCourse && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-teal-500" />
                  )}
                  {(lesson.isSupplementary || lesson.isCustom) && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                  )}

                  <div className="space-y-3">
                    {/* Lesson tag and status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 uppercase tracking-wider">
                          {t.lessons.lesson} {lesson.lessonNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {getCategoryLabel(lesson.category, language)}
                        </span>
                        {lesson.isDailyCourse && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>Today</span>
                          </span>
                        )}
                        {(lesson.isSupplementary || lesson.isCustom) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                            <span>Supplementary Couser</span>
                          </span>
                        )}
                        {lesson.developedByAi && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center gap-1">
                            <Brain className="w-2.5 h-2.5 text-teal-700" />
                            <span>Operator AI (10-Q)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.readTimeMinutes} min</span>
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>
                    </div>

                    {/* Title & summary */}
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-teal-900 leading-snug font-serif">
                      {lesson.title[language]}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {lesson.summary[language]}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-5 pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400 font-medium text-[11px] flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        <span>10-Q Quiz & Cert</span>
                      </span>
                      <span className="font-bold text-teal-700 group-hover:text-teal-900 flex items-center gap-0.5">
                        <span>{isCompleted ? t.lessons.completed : t.lessons.startLesson}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom callout to General Quiz */}
      {!activeLesson && onNavigateToQuiz && (
        <div className="p-6 bg-stone-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base font-serif">
              {language === 'en'
                ? 'Ready to test your civic knowledge across all topics?'
                : 'Uko tayari kupima ufahamu wako wa uraia katika mada zote?'}
            </h4>
            <p className="text-xs text-stone-400">
              {language === 'en'
                ? 'Try the interactive comprehensive quiz with real scenarios from Kwale and Kenya.'
                : 'Jaribu chemsha bongo yenye mifano halisi kutoka Kwale na Kenya.'}
            </p>
          </div>
          <button
            onClick={onNavigateToQuiz}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-md transition-colors shrink-0"
          >
            {t.home.quizButton}
          </button>
        </div>
      )}
    </div>
  );
};
