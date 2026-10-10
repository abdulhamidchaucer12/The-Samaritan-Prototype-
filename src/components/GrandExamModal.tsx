import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag,
  ArrowRight,
  ArrowLeft,
  X,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Crown,
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  ChevronRight,
  HelpCircle,
  Coins,
} from 'lucide-react';
import { Language } from '../types';
import {
  GrandExamSitting,
  GrandExamQuestion,
  generate40MarksTimedExam,
  getSavedGrandExamSitting,
  saveGrandExamSitting,
  submitGrandExam,
  hasUserStudiedAll100Courses,
} from '../utils/grandExamEngine';
import {
  isUserMeritGraduate,
  getMeritGraduateRecord,
  MeritGraduateRecord,
} from '../utils/meritGraduation';
import { printCertificate } from '../utils/printHelper';

interface GrandExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  username?: string | null;
  onGraduationSuccess?: (record: MeritGraduateRecord) => void;
}

export const GrandExamModal: React.FC<GrandExamModalProps> = ({
  isOpen,
  onClose,
  language,
  username,
  onGraduationSuccess,
}) => {
  const cleanUsername = username ? username.trim().toLowerCase().replace(/^@/, '') : 'guest';

  // Check existing graduation record
  const existingGraduate = useMemo(() => {
    return getMeritGraduateRecord(cleanUsername);
  }, [cleanUsername]);

  // Exam phase: 'briefing' | 'active' | 'review_before_submit' | 'results'
  const [phase, setPhase] = useState<'briefing' | 'active' | 'review_before_submit' | 'results'>(
    () => (existingGraduate ? 'results' : 'briefing')
  );

  const [sitting, setSitting] = useState<GrandExamSitting | null>(() => {
    return getSavedGrandExamSitting(cleanUsername);
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(40 * 60); // 40 minutes
  const [recipientName, setRecipientName] = useState<string>(
    existingGraduate?.recipientName || username || 'Kenyan Civic Scholar'
  );
  const [graduationRecord, setGraduationRecord] = useState<MeritGraduateRecord | null>(
    existingGraduate || null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    totalMarks: 40;
    passed: boolean;
    percentage: number;
  } | null>(() => {
    if (existingGraduate) {
      return {
        score: existingGraduate.score,
        totalMarks: 40,
        passed: true,
        percentage: existingGraduate.percentage,
      };
    }
    return null;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If already graduated, open directly into results/certificate
  useEffect(() => {
    if (existingGraduate) {
      setGraduationRecord(existingGraduate);
      setPhase('results');
      setExamResult({
        score: existingGraduate.score,
        totalMarks: 40,
        passed: true,
        percentage: existingGraduate.percentage,
      });
    }
  }, [existingGraduate]);

  // Timer countdown during active exam
  useEffect(() => {
    if (phase === 'active' && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, secondsRemaining]);

  const handleStartExam = () => {
    let currentSitting = sitting;
    if (!currentSitting) {
      currentSitting = generate40MarksTimedExam(cleanUsername);
      setSitting(currentSitting);
    }
    currentSitting.startedAt = currentSitting.startedAt || new Date().toISOString();
    saveGrandExamSitting(currentSitting);

    setSecondsRemaining(currentSitting.timeLimitMinutes * 60);
    setCurrentQuestionIndex(0);
    setPhase('active');
  };

  const handleTimeExpired = () => {
    // Auto-submit when time expires
    handleSubmitExam();
  };

  const handleSelectOption = (questionId: string, optionId: 'a' | 'b' | 'c' | 'd') => {
    if (!sitting) return;
    const updatedAnswers = {
      ...sitting.userAnswers,
      [questionId]: optionId,
    };
    const updatedSitting: GrandExamSitting = {
      ...sitting,
      userAnswers: updatedAnswers,
    };
    setSitting(updatedSitting);
    saveGrandExamSitting(updatedSitting);
  };

  const handleToggleFlag = (questionId: string) => {
    if (!sitting) return;
    const flags = new Set(sitting.flaggedQuestions || []);
    if (flags.has(questionId)) {
      flags.delete(questionId);
    } else {
      flags.add(questionId);
    }
    const updatedSitting: GrandExamSitting = {
      ...sitting,
      flaggedQuestions: Array.from(flags),
    };
    setSitting(updatedSitting);
    saveGrandExamSitting(updatedSitting);
  };

  const handleSubmitExam = async () => {
    if (!sitting) return;
    setIsSubmitting(true);

    try {
      sitting.completedAt = new Date().toISOString();
      sitting.timeSpentSeconds = 40 * 60 - secondsRemaining;

      const result = await submitGrandExam(sitting, recipientName);

      setExamResult({
        score: result.score,
        totalMarks: 40,
        passed: result.passed,
        percentage: result.percentage,
      });

      if (result.passed && result.graduationRecord) {
        setGraduationRecord(result.graduationRecord);
        if (onGraduationSuccess) {
          onGraduationSuccess(result.graduationRecord);
        }
      }

      setPhase('results');
    } catch (err) {
      console.error('Failed submitting grand exam:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeExam = () => {
    const fresh = generate40MarksTimedExam(cleanUsername);
    setSitting(fresh);
    setSecondsRemaining(40 * 60);
    setCurrentQuestionIndex(0);
    setPhase('active');
  };

  const formatTimer = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentQuestion: GrandExamQuestion | undefined =
    sitting?.questions?.[currentQuestionIndex];

  const totalAnswered = sitting ? Object.keys(sitting.userAnswers || {}).length : 0;
  const isFlagged = currentQuestion ? sitting?.flaggedQuestions?.includes(currentQuestion.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-slate-50 to-emerald-500/10 dark:from-amber-950/30 dark:via-slate-900 dark:to-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                  {language === 'en' ? 'Grand Civic Merit Exam' : 'Mtihani Mkuu wa Uraia'}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  40 Marks • 40 Mins
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 font-serif leading-tight">
                {language === 'en'
                  ? '100 Civic Courses Comprehensive Mastery Examination'
                  : 'Mtihani Kamili wa Kuhitimu Masomo 100 ya Uraia'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ============================================================= */}
          {/* PHASE 1: BRIEFING & INSTRUCTIONS                              */}
          {/* ============================================================= */}
          {phase === 'briefing' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Crown className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black font-serif text-slate-900 dark:text-slate-100">
                  {language === 'en'
                    ? 'Congratulations on Completing 100 Civic Courses!'
                    : 'Hongera kwa Kukamilisha Masomo 100 ya Uraia!'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'en'
                    ? 'You have studied the complete Kenyan Civic Curriculum. To graduate and receive your Certificate of Merit with your personal Profile Verification QR Code, you must sit this 40-marks timed final examination.'
                    : 'Umekamilisha mtaala mzima wa masomo 100 ya uraia nchini Kenya. Ili kuhitimu na kupokea Cheti chako cha Sifa chenye Msimbo wa QR, fanya mtihani huu maalum wa alama 40.'}
                </p>
              </div>

              {/* Requirements & Reward Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center space-y-1">
                  <Clock className="w-5 h-5 text-amber-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    40 Minutes Timed
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    1 minute per question
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Pass Mark: &gt; 30 / 40
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Minimum 31 marks (77.5%)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-center space-y-1">
                  <Coins className="w-5 h-5 text-purple-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    Triple Honors Award
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cert + QR + Badge + 5,000 TKNS
                  </span>
                </div>
              </div>

              {/* Instructions Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
                <strong className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {language === 'en' ? 'Examination Protocol & Integrity Rules:' : 'Miongozo na Masharti ya Mtihani:'}
                </strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>40 randomized multiple-choice questions curated across all 100 courses studied.</li>
                  <li>Questions cover Constitution, Human Rights, Devolution, Public Finance, and Incident Oversight.</li>
                  <li>You can flag questions to review them before final submission.</li>
                  <li>Once started, the timer cannot be paused. When the 40 minutes expire, your answers will auto-submit.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {language === 'en'
                      ? 'Begin 40-Marks Timed Exam Now'
                      : 'Anza Mtihani wa Alama 40 Sasa'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* PHASE 2: ACTIVE TIMED EXAMINATION                            */}
          {/* ============================================================= */}
          {phase === 'active' && sitting && currentQuestion && (
            <div className="space-y-5">
              {/* Sticky Top Status Bar: Timer & Question Matrix */}
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4 shadow-lg sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-sm shadow-xs">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>
                  <span className="text-xs text-slate-300 hidden sm:inline">
                    {secondsRemaining < 300 ? '⚠️ Less than 5 mins remaining!' : 'Time Remaining'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 font-bold">
                    Answered: <strong className="text-emerald-400">{totalAnswered}</strong> / 40
                  </span>
                  <button
                    type="button"
                    onClick={() => setPhase('review_before_submit')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Finish & Submit
                  </button>
                </div>
              </div>

              {/* Question Navigation Matrix (1 to 40) */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Question Palette (1 - 40)
                  </span>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Flagged
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400" /> Unanswered
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
                  {sitting.questions.map((q, idx) => {
                    const isAnswered = Boolean(sitting.userAnswers[q.id]);
                    const isCurrent = idx === currentQuestionIndex;
                    const isQFlagged = sitting.flaggedQuestions?.includes(q.id);

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-blue-500 scale-105 font-black z-10'
                            : ''
                        } ${
                          isQFlagged
                            ? 'bg-amber-500 text-slate-950'
                            : isAnswered
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                      #{currentQuestionIndex + 1}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        Category: {currentQuestion.category.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {currentQuestion.constitutionalArticle}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isFlagged
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>

                {/* Scenario details if any */}
                {currentQuestion.scenario && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                    <strong className="block font-bold text-[10px] uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Real-World Civic Scenario:
                    </strong>
                    <p className="leading-relaxed">
                      {currentQuestion.scenario[language] || currentQuestion.scenario.en}
                    </p>
                  </div>
                )}

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentQuestion.question[language] || currentQuestion.question.en}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = sitting.userAnswers[currentQuestion.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-950 dark:text-blue-100 shadow-xs font-semibold ring-1 ring-blue-500'
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 uppercase ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {option.id}
                        </span>
                        <span className="leading-relaxed pt-0.5">
                          {option.text[language] || option.text.en}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="text-xs text-slate-400 font-bold">
                    {currentQuestionIndex + 1} of 40
                  </div>

                  {currentQuestionIndex < 39 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(39, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPhase('review_before_submit')}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Review & Submit</span>
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* PHASE 3: REVIEW BEFORE FINAL SUBMIT                           */}
          {/* ============================================================= */}
          {phase === 'review_before_submit' && sitting && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black font-serif text-slate-900 dark:text-slate-100">
                  Ready to Submit Your Final 40-Marks Exam?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review your answers before grading. Passing mark is &gt; 30/40 to receive the Certificate of Merit.
                </p>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-2xl font-black text-emerald-600 block">{totalAnswered}</span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Answered</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                  <span className="text-2xl font-black text-amber-600 block">
                    {sitting.flaggedQuestions?.length || 0}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Flagged</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-2xl font-black text-slate-700 dark:text-slate-300 block">
                    {40 - totalAnswered}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Unanswered</span>
                </div>
              </div>

              {40 - totalAnswered > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    You have {40 - totalAnswered} unanswered questions. Every mark counts toward the &gt;30 pass mark!
                  </span>
                </div>
              )}

              {/* Recipient Name for Certificate of Merit */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Official Full Name on Certificate of Merit:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter your legal full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPhase('active')}
                  className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Return to Questions
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Grading 40 Answers...' : 'Submit Final Exam Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* PHASE 4: RESULTS, CERTIFICATE OF MERIT & QR CODE SHOWCASE     */}
          {/* ============================================================= */}
          {phase === 'results' && examResult && (
            <div className="space-y-6 max-w-3xl mx-auto py-2">
              {examResult.passed ? (
                /* ================= PASS STATE (>30 MARKS) ================= */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl ring-4 ring-amber-400/30">
                      <Crown className="w-9 h-9" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>OFFICIAL MERIT DISTINCTION HONORS</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-slate-100">
                      Grand Civic Graduation Achieved!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                      You scored <strong className="text-emerald-600 font-black">{examResult.score} / 40</strong> Marks ({examResult.percentage}%).
                      Your mastery of all 100 civic courses qualifies you for the supreme honors package.
                    </p>
                  </div>

                  {/* 3 Rewards Unlocked Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          Certificate of Merit
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          With Profile Verification QR Code
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0">
                        <Crown className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          Double Verification Badge
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Gold Double-Tick (✓✓) on account
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                        <Coins className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                          +5,000 Facilitator Tokens
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Minted directly into balance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Printable & Downloadable Certificate of Merit Container */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between no-print">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Official Certificate of Merit Preview
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => printCertificate('printable-grand-merit-certificate')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Certificate</span>
                        </button>
                      </div>
                    </div>

                    {/* Frame Target for Print */}
                    <div
                      id="printable-grand-merit-certificate"
                      className="printable-certificate-target bg-white p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-600/70 shadow-2xl relative text-center space-y-4"
                    >
                      {/* Top Kenya Ribbon */}
                      <div className="absolute top-0 left-0 right-0 h-2 kenya-ribbon" />

                      <div className="flex items-center justify-center gap-2 text-amber-800">
                        <Crown className="w-7 h-7 text-amber-600" />
                        <span className="font-serif font-extrabold tracking-widest text-sm sm:text-base uppercase">
                          KWALE FOCUS EMPOWERMENT • THE SAMARITAN PLATFORM
                        </span>
                      </div>

                      <div className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500">
                        NATIONAL CIVIC LITERACY COMMISSION • EXECUTIVE GOVERNANCE
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-950 tracking-tight">
                        CERTIFICATE OF CIVIC MERIT
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 italic">
                        This is to certify with highest national honors that
                      </p>

                      <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-serif border-b-2 border-amber-500 inline-block px-8 pb-1">
                        {graduationRecord?.recipientName || recipientName}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
                        has successfully studied and completed all <strong>100 Kenyan Civic Courses</strong> and passed the
                        comprehensive timed final examination with Distinction (<strong>{examResult.score}/40 Marks</strong>),
                        demonstrating mastery of the Constitution of Kenya 2010, public finance, devolution, integrity, and human rights defense.
                      </p>

                      {/* Certificate Footer with Live Auto-Installed QR Code */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs text-slate-700 items-center">
                        <div className="text-left sm:text-center space-y-1">
                          <span className="font-bold text-slate-900 block">Date of Honors</span>
                          <span className="text-[11px] text-slate-600">
                            {new Date().toLocaleDateString('en-KE', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            Status: Verified Scholar
                          </span>
                        </div>

                        {/* Center: Live Profile Verification QR Code */}
                        <div className="flex flex-col items-center space-y-1">
                          {graduationRecord?.qrDataUrl ? (
                            <img
                              src={graduationRecord.qrDataUrl}
                              alt="Scan to verify user profile"
                              className="w-24 h-24 rounded-xl border-2 border-slate-800 p-1 bg-white shadow-md"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                              <QrCode className="w-10 h-10" />
                            </div>
                          )}
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">
                            Scan to Verify Profile
                          </span>
                        </div>

                        <div className="text-right sm:text-center space-y-1">
                          <span className="font-bold text-slate-900 block">Certificate ID</span>
                          <span className="text-[11px] font-mono text-slate-800 block">
                            {graduationRecord?.certificateId || 'KFE-MERIT-2026-HONORS'}
                          </span>
                          <span className="text-[10px] text-amber-800 font-bold block">
                            Signatory: The_Samaritan
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= FAIL STATE (<= 30 MARKS) ================= */
                <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <AlertTriangle className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-black font-serif text-slate-900 dark:text-slate-100">
                    Grand Exam Result: {examResult.score} / 40 Marks
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    You scored <strong>{examResult.score} marks</strong> ({examResult.percentage}%).
                    To receive the Certificate of Merit and Executive Double Verification Badge, a score of <strong>greater than 30 marks (&gt;30/40)</strong> is required.
                  </p>

                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 max-w-md mx-auto text-xs text-amber-900 dark:text-amber-200">
                    <span>
                      Review your civic courses on police oversight, public finance, and devolution, then retake the timed exam!
                    </span>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      Study More Courses
                    </button>
                    <button
                      type="button"
                      onClick={handleRetakeExam}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake 40-Marks Exam</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
