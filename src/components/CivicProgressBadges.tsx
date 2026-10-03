import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Scale,
  ShieldCheck,
  Trophy,
  Lock,
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  RotateCcw,
  Sliders,
  X,
  ArrowRight,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { playNotificationChime } from '../utils/adminManagement';

export interface MilestoneDefinition {
  id: string;
  percent: number;
  title: {
    en: string;
    sw: string;
  };
  rankTitle: {
    en: string;
    sw: string;
  };
  description: {
    en: string;
    sw: string;
  };
  icon: React.ElementType;
  accentColor: string;
  borderActive: string;
  bgActive: string;
  glowActive: string;
  pillBg: string;
  pillText: string;
}

export const CIVIC_MILESTONES: MilestoneDefinition[] = [
  {
    id: 'milestone-25',
    percent: 25,
    title: {
      en: 'Civic Initiate',
      sw: 'Mwanzo wa Uraia',
    },
    rankTitle: {
      en: '25% Civic Foundation',
      sw: 'Asilimia 25: Msingi wa Uraia',
    },
    description: {
      en: 'Mastered foundational knowledge of Kenya’s sovereign power (Article 1) and county devolution structures.',
      sw: 'Umejifunza misingi ya mamlaka ya wananchi (Kifungu cha 1) na ugatuzi wa kaunti.',
    },
    icon: Compass,
    accentColor: 'text-emerald-500',
    borderActive: 'border-emerald-500/80',
    bgActive: 'bg-emerald-50/80 dark:bg-emerald-950/30',
    glowActive: 'shadow-emerald-500/20',
    pillBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    pillText: '25% Milestone',
  },
  {
    id: 'milestone-50',
    percent: 50,
    title: {
      en: 'Constitutional Explorer',
      sw: 'Mchunguzi wa Katiba',
    },
    rankTitle: {
      en: '50% Halfway Explorer',
      sw: 'Asilimia 50: Nusu ya Safari',
    },
    description: {
      en: 'Comprehensive grasp of the 3 arms of government, independent commissions, and county leadership mandates.',
      sw: 'Ufahamu wa kina wa mihimili mitatu ya serikali, tume huru, na majukumu ya uongozi wa kaunti.',
    },
    icon: Scale,
    accentColor: 'text-sky-500',
    borderActive: 'border-sky-500/80',
    bgActive: 'bg-sky-50/80 dark:bg-sky-950/30',
    glowActive: 'shadow-sky-500/20',
    pillBg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200',
    pillText: '50% Milestone',
  },
  {
    id: 'milestone-75',
    percent: 75,
    title: {
      en: 'Democracy Advocate',
      sw: 'Mtetezi wa Demokrasia',
    },
    rankTitle: {
      en: '75% Advanced Literacy',
      sw: 'Asilimia 75: Umahiri wa Juu',
    },
    description: {
      en: 'Proficient in public participation (Article 10), access to information (Article 35), and citizen petition mechanisms.',
      sw: 'Umahiri katika ushiriki wa umma (Kifungu 10), upatikanaji wa taarifa (Kifungu 35), na maombi ya kisheria.',
    },
    icon: ShieldCheck,
    accentColor: 'text-amber-500',
    borderActive: 'border-amber-500/80',
    bgActive: 'bg-amber-50/80 dark:bg-amber-950/30',
    glowActive: 'shadow-amber-500/20',
    pillBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200',
    pillText: '75% Milestone',
  },
  {
    id: 'milestone-100',
    percent: 100,
    title: {
      en: 'Patriotic Scholar',
      sw: 'Mzalendo Bingwa',
    },
    rankTitle: {
      en: '100% Total Civic Mastery',
      sw: 'Asilimia 100: Umahiri Kamili',
    },
    description: {
      en: 'Completed the entire civic learning journey. Empowered citizen leader prepared to champion transparent governance.',
      sw: 'Umekamilisha safari yote ya elimu ya uraia. Kiongozi aliye tayari kusimamia utawala bora na uwazi.',
    },
    icon: Trophy,
    accentColor: 'text-amber-500',
    borderActive: 'border-amber-500',
    bgActive: 'bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/30',
    glowActive: 'shadow-amber-500/30',
    pillBg: 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white',
    pillText: '100% Mastery',
  },
];

interface CivicProgressBadgesProps {
  language: Language;
  progressPercent: number;
  currentUser?: AuthUser | null;
  onClaimCertificate?: () => void;
  onContinueLearning?: () => void;
}

export const CivicProgressBadges: React.FC<CivicProgressBadgesProps> = ({
  language,
  progressPercent,
  currentUser,
  onClaimCertificate,
  onContinueLearning,
}) => {
  // Simulated progress override for The_Samaritan (Super Admin & Developer)
  const [simulatedPercent, setSimulatedPercent] = useState<number | null>(null);
  const isTheSamaritan =
    currentUser?.username === 'The_Samaritan' || currentUser?.username === 'The Samaritan';

  const effectivePercent = simulatedPercent !== null ? simulatedPercent : progressPercent;

  // Active celebration modal state
  const [celebratedMilestone, setCelebratedMilestone] = useState<MilestoneDefinition | null>(null);

  // Track milestones that have already auto-triggered in this session to avoid loop
  const [autoCelebratedMap, setAutoCelebratedMap] = useState<Record<number, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = sessionStorage.getItem('the_samaritan_auto_celebrated_milestones');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Check for auto-trigger when effectivePercent crosses 25%, 50%, 75%, or 100%
  useEffect(() => {
    // Find the highest milestone unlocked that hasn't been auto-celebrated in this session
    const unlockedMilestones = CIVIC_MILESTONES.filter((m) => effectivePercent >= m.percent);
    if (unlockedMilestones.length === 0) return;

    const highestUnlocked = unlockedMilestones[unlockedMilestones.length - 1];
    if (!autoCelebratedMap[highestUnlocked.percent]) {
      // Trigger animation celebration!
      setCelebratedMilestone(highestUnlocked);
      playNotificationChime();

      setAutoCelebratedMap((prev) => {
        const next = { ...prev, [highestUnlocked.percent]: true };
        try {
          sessionStorage.setItem(
            'the_samaritan_auto_celebrated_milestones',
            JSON.stringify(next)
          );
        } catch {
          // ignore
        }
        return next;
      });
    }
  }, [effectivePercent]);

  const handleManualTrigger = (milestone: MilestoneDefinition) => {
    setCelebratedMilestone(milestone);
    playNotificationChime();
  };

  const handleCloseCelebration = () => {
    setCelebratedMilestone(null);
  };

  return (
    <section
      id="civic-progress-badges-container"
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
    >
      {/* Decorative Kenyan accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            <span>
              {language === 'en' ? 'Civic Milestone Badges' : 'Nishani za Safari ya Uraia'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
            {language === 'en'
              ? 'Your Constitutional Journey Milestones'
              : 'Hatua za Safari Yako ya Kikatiba'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {language === 'en'
              ? 'Earn prestigious badges as you reach 25%, 50%, 75%, and 100% of your civic curriculum.'
              : 'Pata nishani za heshima unapofikisha 25%, 50%, 75%, na 100% ya mafunzo yako ya uraia.'}
          </p>
        </div>

        {/* Real-time Progress Ring Counter */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div className="relative flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                className="text-slate-200 dark:text-slate-700 stroke-current"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                className="text-emerald-500 stroke-current transition-all duration-700 ease-out"
                strokeWidth="3"
                strokeDasharray={100}
                strokeDashoffset={100 - (effectivePercent * 100) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-900 dark:text-white font-mono">
              {effectivePercent}%
            </span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Current Journey' : 'Safari ya Sasa'}
            </div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {effectivePercent >= 100
                ? language === 'en'
                  ? 'All Badges Unlocked'
                  : 'Nishani Zote Zimefunguliwa'
                : `${effectivePercent}% ${language === 'en' ? 'Completed' : 'Imekamilika'}`}
            </div>
          </div>
        </div>
      </div>

      {/* Connected Progress Line Tracker */}
      <div className="mb-8 px-2 sm:px-4">
        <div className="relative flex items-center justify-between">
          {/* Background rail */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full" />

          {/* Active filled track */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, effectivePercent))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Milestone markers */}
          {CIVIC_MILESTONES.map((m) => {
            const isUnlocked = effectivePercent >= m.percent;
            return (
              <div
                key={m.id}
                className="relative z-10 flex flex-col items-center"
                title={`${m.percent}% - ${m.title[language]}`}
              >
                <motion.button
                  id={`milestone-node-${m.percent}`}
                  onClick={() => handleManualTrigger(m)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[11px] transition-all duration-300 shadow-sm ${
                    isUnlocked
                      ? 'bg-slate-900 text-white border-2 border-amber-400 ring-4 ring-amber-400/20'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <span>{m.percent}</span>
                  )}
                </motion.button>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {m.percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Milestone Badges Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CIVIC_MILESTONES.map((milestone) => {
          const isUnlocked = effectivePercent >= milestone.percent;
          const IconComponent = milestone.icon;

          return (
            <motion.div
              key={milestone.id}
              id={`badge-card-${milestone.percent}`}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isUnlocked
                  ? `${milestone.borderActive} ${milestone.bgActive} shadow-md ${milestone.glowActive}`
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 opacity-80'
              }`}
            >
              {/* Pulsing Aura if Unlocked */}
              {isUnlocked && (
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-400/10 blur-xl pointer-events-none"
                />
              )}

              <div>
                {/* Top Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${milestone.pillBg}`}
                  >
                    {milestone.pillText}
                  </span>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Unlocked' : 'Imefunguliwa'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>
                        {milestone.percent - effectivePercent}%{' '}
                        {language === 'en' ? 'remaining' : 'bado'}
                      </span>
                    </span>
                  )}
                </div>

                {/* Animated Badge Icon Display */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <motion.div
                      animate={
                        isUnlocked
                          ? {
                              scale: [1, 1.06, 1],
                              rotate: [0, 2, -2, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${
                        isUnlocked
                          ? 'bg-white dark:bg-slate-900 border-amber-400/80 text-amber-500'
                          : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.div>

                    {isUnlocked && (
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-serif leading-tight">
                      {milestone.title[language]}
                    </h3>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {milestone.rankTitle[language]}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {milestone.description[language]}
                </p>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                {isUnlocked ? (
                  <button
                    id={`trigger-badge-btn-${milestone.percent}`}
                    onClick={() => handleManualTrigger(milestone)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {language === 'en' ? 'Trigger Celebration' : 'Onyesha Sherehe'}
                    </span>
                  </button>
                ) : (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-400 dark:bg-slate-500 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, (effectivePercent / milestone.percent) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* The_Samaritan Journey Simulator & Milestone Inspector (Hidden from normal users) */}
      {isTheSamaritan && (
        <div
          id="the-samaritan-milestone-simulator"
          className="mt-6 pt-5 border-t border-amber-300 dark:border-amber-800 bg-amber-500/10 dark:bg-amber-950/20 rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                The_Samaritan Milestone Inspector & Animation Tester
              </span>
            </div>
            {simulatedPercent !== null && (
              <button
                onClick={() => setSimulatedPercent(null)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Real Progress ({progressPercent}%)</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-700 dark:text-slate-300 mr-1">
              Simulate Progress Thresholds:
            </span>
            {[0, 25, 50, 75, 100].map((val) => (
              <button
                key={val}
                id={`simulate-percent-${val}`}
                onClick={() => {
                  setSimulatedPercent(val);
                  if (val > 0) {
                    const matched = CIVIC_MILESTONES.find((m) => m.percent === val);
                    if (matched) handleManualTrigger(matched);
                  }
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  effectivePercent === val
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-amber-500'
                }`}
              >
                {val === 0 ? '0% (Reset)' : `${val}% Milestone`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Celebratory Animation Modal Overlay */}
      <AnimatePresence>
        {celebratedMilestone && (
          <div
            id="milestone-celebration-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          >
            {/* Confetti Shimmer Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                    y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 20,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -100,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2.2 + Math.random() * 1.5,
                    repeat: Infinity,
                    delay: Math.random() * 0.8,
                    ease: 'easeOut',
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    [
                      'bg-amber-400',
                      'bg-emerald-400',
                      'bg-sky-400',
                      'bg-rose-400',
                      'bg-indigo-400',
                    ][i % 5]
                  }`}
                />
              ))}
            </div>

            {/* Modal Dialog Box */}
            <motion.div
              id="milestone-celebration-modal"
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400/90 text-center overflow-hidden z-10"
            >
              {/* Kenyan Top Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

              {/* Close Button */}
              <button
                id="close-celebration-btn"
                onClick={handleCloseCelebration}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Central Badge Icon */}
              <div className="flex justify-center mb-4 mt-2">
                <div className="relative">
                  {/* Glowing pulsing aura */}
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-3xl bg-amber-400/30 blur-xl"
                  />

                  {/* Icon Card */}
                  <motion.div
                    animate={{
                      rotate: [0, -6, 6, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-xl flex items-center justify-center text-slate-950"
                  >
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                      <celebratedMilestone.icon className="w-10 h-10 text-amber-500" />
                    </div>
                  </motion.div>

                  {/* Sparkle badge */}
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Milestone Banner Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {celebratedMilestone.percent}%{' '}
                  {language === 'en' ? 'Journey Achieved!' : 'Mafanikio ya Safari!'}
                </span>
              </div>

              {/* Title & Rank */}
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white mb-1">
                {celebratedMilestone.title[language]}
              </h3>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                {celebratedMilestone.rankTitle[language]}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {celebratedMilestone.description[language]}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {celebratedMilestone.percent === 100 && onClaimCertificate ? (
                  <button
                    id="celebration-claim-cert-btn"
                    onClick={() => {
                      handleCloseCelebration();
                      onClaimCertificate();
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:brightness-105 transition-all text-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      {language === 'en' ? 'Claim Official Certificate' : 'Chukua Cheti Rasmi'}
                    </span>
                  </button>
                ) : onContinueLearning ? (
                  <button
                    id="celebration-continue-btn"
                    onClick={() => {
                      handleCloseCelebration();
                      onContinueLearning();
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-slate-800 dark:hover:bg-slate-700 transition-all text-sm"
                  >
                    <span>
                      {language === 'en' ? 'Continue Civic Journey' : 'Endelea na Masomo'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  id="celebration-dismiss-btn"
                  onClick={handleCloseCelebration}
                  className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {language === 'en' ? 'Dismiss' : 'Funga'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
