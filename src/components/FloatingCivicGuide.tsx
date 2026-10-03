import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  X,
  BookOpen,
  Award,
  Building2,
  HelpCircle,
  Bell,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  UserCheck,
  GripVertical,
  RotateCcw,
} from 'lucide-react';
import { CivicUser, Language } from '../types';
import { isUserAppointedAdmin, getUserRoleMeta } from '../utils/adminManagement';

interface FloatingCivicGuideProps {
  currentUser?: CivicUser | null;
  language: Language;
  onNavigateTab?: (tab: string) => void;
}

export const FloatingCivicGuide: React.FC<FloatingCivicGuideProps> = ({
  currentUser,
  language,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hasDismissedWelcome, setHasDismissedWelcome] = useState(() => {
    return localStorage.getItem('the_samaritan_guide_prompt_dismissed') === 'true';
  });

  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragResetKey, setDragResetKey] = useState(0);
  const [dragBounds, setDragBounds] = useState(() => ({
    left: typeof window !== 'undefined' ? -(window.innerWidth - 140) : -300,
    right: 15,
    top: typeof window !== 'undefined' ? -(window.innerHeight - 100) : -500,
    bottom: 15,
  }));

  useEffect(() => {
    const handleResize = () => {
      setDragBounds({
        left: -(window.innerWidth - 140),
        right: 15,
        top: -(window.innerHeight - 100),
        bottom: 15,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    };
  }, []);

  // Check if first-time user
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('the_samaritan_guided_tour_completed');
    if (!hasSeenTour && !hasDismissedWelcome) {
      // Auto show a subtle indicator
      const timer = setTimeout(() => {
        // Can keep banner visible
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasDismissedWelcome]);

  // Determine user role and administration tier
  const username = currentUser?.username;
  const roleMeta = username ? getUserRoleMeta(username) : null;
  const isTemporaryAdmin = username ? isUserAppointedAdmin(username) : false;
  const isAdmin = currentUser?.role === 'admin' || (roleMeta && roleMeta.adminLevel !== 'citizen');
  const adminLevel = isTemporaryAdmin
    ? 'temporary'
    : roleMeta?.adminLevel || (currentUser?.role === 'admin' ? 'standard' : 'citizen');

  // Define guide content for Citizens (NO admin features mentioned)
  const citizenGuideSteps = [
    {
      id: 'welcome',
      title: language === 'en' ? 'Welcome to The Samaritan' : 'Karibu Katiba na Uraia: The Samaritan',
      icon: Compass,
      color: 'emerald',
      content:
        language === 'en'
          ? 'The Samaritan is an independent, non-partisan civic learning platform developed by Kwale Focus Empowerment CBO. It demystifies the Constitution of Kenya 2010, government structures, public participation, and your fundamental rights in straightforward English and Kiswahili.'
          : 'The Samaritan ni jukwaa huru la elimu ya uraia lililotengenezwa na Kwale Focus Empowerment CBO. Linalenga kufafanua Katiba ya Kenya 2010, miundo ya serikali, ushiriki wa umma na haki zako za kikatiba kwa lugha rahisi ya Kiingereza na Kiswahili.',
      tab: 'home',
      tabLabel: language === 'en' ? 'Go to Home' : 'Nenda Mwanzo',
    },
    {
      id: 'lessons',
      title: language === 'en' ? 'Civic Courses & Daily Drops' : 'Masomo ya Uraia na ya Kila Siku',
      icon: BookOpen,
      color: 'teal',
      content:
        language === 'en'
          ? 'Access 10 comprehensive foundational modules covering devolution, public finance, Bill of Rights, and representation. Plus, 3 new specialized daily courses are automatically added every single day, along with supplementary community courses!'
          : 'Soma mitaala 10 ya msingi inayofafanua ugatuzi, usimamizi wa fedha za umma, Haki za Binadamu na uwakilishi. Zaidi ya hayo, masomo mapya 3 huongezwa kiotomatiki kila siku pamoja na masomo ya ziada ya jamii!',
      tab: 'lessons',
      tabLabel: language === 'en' ? 'Explore Lessons' : 'Fungua Masomo',
    },
    {
      id: 'quiz-cert',
      title: language === 'en' ? '10-Question Quizzes & Official Certificates' : 'Chemsha Bongo na Vyeti Rasmi',
      icon: Award,
      color: 'amber',
      content:
        language === 'en'
          ? 'Every course includes an interactive 10-question quiz. Score 70% or above to instantly earn an official, margin-to-margin printable Certificate of Competency, co-signed by the Executive Director and Platform Architect with unique verification hashes.'
          : 'Kila somo lina chemsha bongo ya maswali 10. Ukipata alama 70% au zaidi, unapata mara moja Cheti rasmi cha Uwezo chenye saini za Mkurugenzi Mkuu na Msanifu wa Mfumo, tayari kupakuliwa na kuchapishwa.',
      tab: 'quiz',
      tabLabel: language === 'en' ? 'Take a Quiz' : 'Fanya Jaribio',
    },
    {
      id: 'government',
      title: language === 'en' ? 'How Government Works (35 Public Offices)' : 'Miundo ya Serikali (Ofisi 35 za Umma)',
      icon: Building2,
      color: 'blue',
      content:
        language === 'en'
          ? 'Explore all 35 constitutional public offices in Kenya across Executive, Legislature, Judiciary, County Governments, and Independent Commissions. Learn who holds power, their legal mandates, and how citizens hold them accountable.'
          : 'Fahamu ofisi zote 35 za kikatiba za umma nchini Kenya katika Serikali Kuu, Bunge, Mahakama, Serikali za Kaunti na Tume Huru. Jua nani ana mamlaka, wajibu wao wa kisheria na jinsi ya kuwawajibisha.',
      tab: 'explorer',
      tabLabel: language === 'en' ? 'Explore Offices' : 'Chunguza Ofisi',
    },
    {
      id: 'qa-hub',
      title: language === 'en' ? 'Ask Civic Leaders & Suggest Ideas' : 'Uliza Maswali na Toa Mapendekezo',
      icon: HelpCircle,
      color: 'purple',
      content:
        language === 'en'
          ? 'Have a legal or constitutional question about your ward, county budget, or human rights? Post questions in the Civic Hub (publicly or anonymously) to get answers from certified civic leaders. You can also vote on questions and submit feedback.'
          : 'Una swali la kikatiba kuhusu wodi yako, bajeti ya kaunti au haki za binadamu? Uliza swali lako kwenye Jukwaa la Kiraia (kwa jina au bila jina) ili ujibiwe na viongozi walioidhinishwa wa uraia.',
      tab: 'qa',
      tabLabel: language === 'en' ? 'Open Q&A Hub' : 'Fungua Maswali',
    },
    {
      id: 'notifications',
      title: language === 'en' ? 'Direct Notices & Replying to Leadership' : 'Taarifa Rasmi na Majibu kwa Uongozi',
      icon: Bell,
      color: 'indigo',
      content:
        language === 'en'
          ? 'Check the Bell icon in the header for administrative dispatches and announcements. You can now reply directly to any notice sent by administration, maintaining an active two-way civic conversation!'
          : 'Bofya kengele iliyo juu kupokea taarifa rasmi za uongozi. Sasa unaweza kujibu moja kwa moja ujumbe wowote unaotumiwa na wasimamizi!',
      tab: 'home',
      tabLabel: language === 'en' ? 'Got It' : 'Nimeelewa',
    },
  ];

  // Define guide content for Administrators by tier
  const adminGuideSteps = [
    {
      id: 'admin-role',
      title:
        language === 'en'
          ? `Your Admin Role: ${roleMeta?.roleTitle.en || 'Administrator'}`
          : `Wadhifa Wako: ${roleMeta?.roleTitle.sw || 'Msimamizi'}`,
      icon: ShieldCheck,
      color: 'amber',
      content:
        adminLevel === 'super'
          ? language === 'en'
            ? 'As Platform Architect & Super Admin (The Samaritan), you oversee the entire platform architecture: appointing temporary admins, managing immutable foundational courses, overseeing certificate verification, and monitoring executive security telemetry.'
            : 'Kama Msanifu wa Mfumo na Msimamizi Mkuu, unasimamia mfumo mzima: kuteua wasimamizi wa muda, kulinda mitaala mikuu ya uraia, kusimamia usajili wa vyeti na usalama wa mfumo.'
          : adminLevel === 'executive'
          ? language === 'en'
            ? 'As an Executive Administrator, you oversee community civic curriculum, review project delivery, approve localized training events, co-sign citizen certificates, and broadcast official dispatches to citizens.'
            : 'Kama Msimamizi Mkuu Mtendaji, unasimamia mitaala ya jamii, unakagua utekelezaji wa miradi, unatia saini vyeti vya wananchi na kutuma taarifa rasmi kwa wananchi.'
          : adminLevel === 'standard'
          ? language === 'en'
            ? 'As a Standard Civic Administrator, you answer citizen questions in the Civic Hub, publish supplementary courses with Operator AI, and organize grassroots civic education forums.'
            : 'Kama Msimamizi wa Kawaida, unajibu maswali ya wananchi kwenye jukwaa, unachapisha masomo ya ziada na kuhamasisha wananchi mashinani.'
          : language === 'en'
          ? 'You have been appointed as a Temporary Civic Administrator with a verified Blue Badge for 3 months. You can answer citizen queries, review discussion topics, and participate in community mobilization.'
          : 'Umeteuliwa kuwa Msimamizi wa Muda wa Uraia ukiwa na Beji ya Bluu kwa miezi 3. Unaweza kujibu maswali ya wananchi na kusaidia uhamasishaji.',
      tab: 'admin',
      tabLabel: language === 'en' ? 'Admin Dashboard' : 'Dashibodi ya Uongozi',
    },
    {
      id: 'admin-delete-restrictions',
      title:
        language === 'en'
          ? 'Safety & Deletion Safeguards'
          : 'Ulinzi wa Mfumo na Mipaka ya Kufuta',
      icon: isTemporaryAdmin ? ShieldAlert : Lock,
      color: isTemporaryAdmin ? 'red' : 'blue',
      content: isTemporaryAdmin
        ? language === 'en'
          ? 'IMPORTANT SECURITY PROTOCOL: Appointed temporary administrators strictly DO NOT have the power to delete anything on the platform (courses, questions, civic events, or user records). All administrative actions are logged in the executive audit trail.'
          : 'ILANI MUHIMU YA USALAMA: Wasimamizi wa muda HAWANA mamlaka ya kufuta chochote kwenye mfumo (masomo, maswali, matukio au taarifa za watumiaji). Kila hatua inarekodiwa kwenye kumbukumbu za mfumo.'
        : adminLevel === 'standard'
        ? language === 'en'
          ? 'Standard administrators cannot delete foundational courses or administrative records authored by executive leadership. Only executive admins can delete specific records, and foundational lessons remain permanently protected.'
          : 'Wasimamizi wa kawaida hawawezi kufuta masomo ya msingi au taarifa zilizoandikwa na uongozi mkuu. Masomo ya kimsingi yamelindwa kikamilifu.'
        : language === 'en'
        ? 'Executive & Super Administrators maintain strict deletion access. Even executive admins cannot remove foundational lessons to protect public curriculum integrity. Deletion privileges are non-transferable.'
        : 'Uongozi Mkuu unalinda mitaala dhidi ya ufutaji usioidhinishwa. Masomo ya kimsingi ya Katiba yamelindwa yasifutwe ili kuhakikisha uadilifu.',
      tab: 'admin',
      tabLabel: language === 'en' ? 'Review Permissions' : 'Kagua Mamlaka',
    },
    {
      id: 'admin-notifications',
      title:
        language === 'en'
          ? 'Direct Dispatches & Citizen Replies'
          : 'Taarifa za Moja kwa Moja na Majibu ya Wananchi',
      icon: Bell,
      color: 'indigo',
      content:
        language === 'en'
          ? 'When issuing official direct notifications to specific citizens, recipients can now reply directly inside their notification drawer. You can monitor and respond to their feedback to ensure responsive governance.'
          : 'Unapotuma ujumbe rasmi kwa mwananchi, mpokeaji anaweza kujibu moja kwa moja ndani ya droo yake ya taarifa. Hii inaruhusu mawasiliano ya pande zote kati ya uongozi na jamii.',
      tab: 'admin',
      tabLabel: language === 'en' ? 'Dispatches Center' : 'Kituo cha Taarifa',
    },
  ];

  const steps = isAdmin ? adminGuideSteps : citizenGuideSteps;
  const currentStep = steps[activeStep] || steps[0];

  const handleDismissPrompt = () => {
    setHasDismissedWelcome(true);
    localStorage.setItem('the_samaritan_guide_prompt_dismissed', 'true');
  };

  const handleFinishTour = () => {
    localStorage.setItem('the_samaritan_guided_tour_completed', 'true');
    setIsOpen(false);
  };

  const handleNavigate = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Draggable Trigger Pill */}
      <motion.div
        key={dragResetKey}
        drag
        dragMomentum={false}
        dragElastic={0.12}
        dragConstraints={dragBounds}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
          dragTimeoutRef.current = setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        whileDrag={{ scale: 1.06 }}
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 pointer-events-auto touch-none select-none"
      >
        {/* Subtle Welcome Toast for first-time citizens */}
        {!hasDismissedWelcome && !isOpen && (
          <div className="bg-slate-900/95 text-white border border-emerald-500/40 p-3 rounded-2xl shadow-xl max-w-xs text-xs space-y-1.5 animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                {isAdmin
                  ? language === 'en'
                    ? 'Admin Guidelines'
                    : 'Mwongozo wa Uongozi'
                  : language === 'en'
                  ? 'New to The Samaritan?'
                  : 'Mgeni hapa?'}
              </span>
              <button
                onClick={handleDismissPrompt}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {isAdmin
                ? language === 'en'
                  ? `Review your ${adminLevel} tier permissions and safeguards.`
                  : `Kagua mamlaka na mwongozo wa ngazi yako ya uongozi.`
                : language === 'en'
                ? 'Click here for a 1-minute visual guide to courses, quizzes, and public offices.'
                : 'Bofya hapa kwa mwongozo wa haraka wa masomo, vyeti na ofisi za serikali.'}
            </p>
          </div>
        )}

        <button
          onClick={() => {
            if (isDraggingRef.current) return;
            setIsOpen(true);
            handleDismissPrompt();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setDragResetKey((k) => k + 1);
          }}
          className={`flex items-center gap-2 pl-2.5 pr-4 py-2.5 rounded-full shadow-lg transition-all cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 ${
            isAdmin
              ? isTemporaryAdmin
                ? 'bg-blue-700 hover:bg-blue-600 text-white border border-blue-400 shadow-blue-900/30'
                : 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold border border-amber-300 shadow-amber-900/30'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/60 shadow-emerald-900/30'
          }`}
          title={
            language === 'en'
              ? 'Draggable Guide: Drag anywhere on screen to prevent blocking features • Click to open (Double-click to reset)'
              : 'Mwongozo unaoweza kuburutwa: Buruta popote ili kuzuia kufunika maelezo • Bofya kufungua (Bofya mara mbili kurejesha)'
          }
          aria-label={
            language === 'en'
              ? 'Open Civic Platform Guide (Draggable)'
              : 'Fungua Mwongozo wa Mfumo (Unaoweza kuburutwa)'
          }
        >
          <GripVertical className="w-3.5 h-3.5 opacity-60 hover:opacity-100 shrink-0" />
          <Compass className="w-4 h-4 animate-spin-slow shrink-0" />
          <span className="text-xs font-bold whitespace-nowrap">
            {isAdmin
              ? language === 'en'
                ? isTemporaryAdmin
                  ? 'Admin Guide (Blue)'
                  : 'Admin Guide'
                : 'Mwongozo wa Uongozi'
              : language === 'en'
              ? 'Platform Guide'
              : 'Mwongozo wa Mfumo'}
          </span>
          {!hasDismissedWelcome && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          )}
        </button>
      </motion.div>

      {/* Floating Guide Modal / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isAdmin
                      ? isTemporaryAdmin
                        ? 'bg-blue-500/20 border border-blue-400/40 text-blue-300'
                        : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                      : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                  }`}
                >
                  <currentStep.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {isAdmin
                        ? language === 'en'
                          ? `Admin Level: ${adminLevel.toUpperCase()}`
                          : `Ngazi ya Utawala: ${adminLevel.toUpperCase()}`
                        : language === 'en'
                        ? 'Citizen Guide'
                        : 'Mwongozo wa Mwananchi'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({activeStep + 1} / {steps.length})
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 flex-1">
              {/* Special callout banner if temporary admin */}
              {isTemporaryAdmin && currentStep.id === 'admin-delete-restrictions' && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-900">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">
                      {language === 'en'
                        ? 'Deletion Restricted for Temporary Admins'
                        : 'Ufutaji Umepigwa Marufuku kwa Wasimamizi wa Muda'}
                    </p>
                    <p className="text-red-700 leading-relaxed">
                      {language === 'en'
                        ? 'Under platform governance rules, temporary administrators cannot delete courses, questions, civic events, or user records.'
                        : 'Kulingana na kanuni za mfumo, wasimamizi wa muda hawawezi kufuta masomo, maswali, matukio au taarifa za watumiaji.'}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-700 leading-relaxed">
                {currentStep.content}
              </p>

              {/* Quick Action Navigation button */}
              {currentStep.tab && onNavigateTab && (
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigate(currentStep.tab)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>{currentStep.tabLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Step indicator dots */}
              <div className="flex items-center justify-center gap-1.5 pt-3">
                {steps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeStep
                        ? 'w-6 bg-slate-900'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-30 text-xs font-semibold flex items-center gap-1 hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Previous' : 'Nyuma'}</span>
              </button>

              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>{language === 'en' ? 'Next' : 'Mbele'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishTour}
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Finish Tour' : 'Kamilisha'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
