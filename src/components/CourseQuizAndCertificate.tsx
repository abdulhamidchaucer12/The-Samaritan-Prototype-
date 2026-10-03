import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Shield,
  BookOpen,
  User,
  Check,
  FileCheck,
  Lock,
  AlertCircle,
  FileDown,
  CheckCircle,
  Coins,
} from 'lucide-react';
import { CivicLesson, Language, QuizQuestion } from '../types';
import { getCourseQuizQuestions } from '../data/courseQuizzes';
import { randomizeQuizQuestions } from '../utils/quizRandomizer';
import {
  getUserProgress,
  recordCourseQuizScore,
  markLessonCompleted,
} from '../utils/storage';
import {
  getIssuedCertificate,
  registerAndIssueCertificate,
  incrementCertificateDownloadCount,
  getUserIdentifier,
  IssuedCertificateRecord,
} from '../utils/certificateRegistry';
import { generateCertificatePdf } from '../utils/pdfCertificate';
import { getCurrentAuthUser } from '../utils/authAndQuestions';
import { getCertificateSignatories } from '../utils/certificateSignatories';
import {
  awardTokensForCourseQuizCompletion,
  hasUserEarnedQuizTokensForCourse,
} from '../utils/facilitatorTokenRegistry';
import { KfeClearBoxIcon } from './KfeClearBoxIcon';
import { KfeLogo } from './KfeLogo';

interface CourseQuizAndCertificateProps {
  course: CivicLesson;
  language: Language;
  onBackToCourse: () => void;
  onCompleted?: () => void;
}

export const CourseQuizAndCertificate: React.FC<CourseQuizAndCertificateProps> = ({
  course,
  language,
  onBackToCourse,
  onCompleted,
}) => {
  const currentUser = getCurrentAuthUser();
  const userKey = getUserIdentifier(currentUser?.username);

  // Helper to extract option text safely regardless of schema format
  const getOptionText = (opt: any, lang: Language): string => {
    if (!opt) return '';
    if (typeof opt === 'string') return opt;
    if (opt.text) {
      if (typeof opt.text === 'string') return opt.text;
      return opt.text[lang] || opt.text.en || opt.text.sw || '';
    }
    if (opt[lang]) return opt[lang];
    if (opt.en) return opt.en;
    if (opt.sw) return opt.sw;
    return String(opt);
  };

  // Helper to resolve the correct answer index safely
  const getCorrectIndex = (q: any): number => {
    if (!q) return 0;
    if (typeof q.correctAnswer === 'number') return q.correctAnswer;
    if (typeof q.correctAnswerIndex === 'number') return q.correctAnswerIndex;
    if (typeof q.correctOptionId === 'string') {
      const foundIdx = q.options?.findIndex((o: any) => o.id === q.correctOptionId);
      if (foundIdx !== undefined && foundIdx !== -1) return foundIdx;
      const letterCode = q.correctOptionId.toLowerCase().charCodeAt(0) - 97;
      if (letterCode >= 0 && letterCode < (q.options?.length || 4)) return letterCode;
    }
    return 0;
  };

  const questions = useMemo<QuizQuestion[]>(() => {
    const customList = course.quizzes || (course as any).quiz;
    const rawList =
      customList && customList.length >= 10
        ? customList
        : getCourseQuizQuestions(course.id, course.title, course.category);
    return randomizeQuizQuestions(rawList, course.id);
  }, [course.id, course.quizzes, (course as any).quiz, course.title, course.category]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'certificate'>('quiz');

  // Load prior records
  const priorProgress = getUserProgress();
  const priorScoreNumber = priorProgress.courseQuizScores?.[course.id]?.score;
  const [issuedRecord, setIssuedRecord] = useState<IssuedCertificateRecord | null>(() => {
    return getIssuedCertificate(course.id, userKey);
  });

  const [recipientName, setRecipientName] = useState<string>(() => {
    if (issuedRecord) return issuedRecord.recipientName;
    if (currentUser?.username && !currentUser.username.startsWith('@')) {
      return currentUser.username;
    }
    return '';
  });

  const [finalScore, setFinalScore] = useState<number>(() => {
    if (issuedRecord) return issuedRecord.score;
    return priorScoreNumber ?? 0;
  });

  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // Reset quiz state when course changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsAnswerRevealed(false);
  }, [course.id]);

  useEffect(() => {
    // Check if certificate already exists or quiz already passed
    const existing = getIssuedCertificate(course.id, userKey);
    if (existing) {
      setIssuedRecord(existing);
      setRecipientName(existing.recipientName);
      setFinalScore(existing.score);
      setIsQuizCompleted(true);
    } else if (typeof priorScoreNumber === 'number' && priorScoreNumber >= 6) {
      setIsQuizCompleted(true);
      setFinalScore(priorScoreNumber);
    }
  }, [course.id, userKey, priorScoreNumber]);

  const currentQ = questions[currentIdx] || questions[0];
  const selectedChoice = selectedAnswers[currentIdx];

  const handleSelectChoice = (choiceIdx: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: choiceIdx }));
    setIsAnswerRevealed(true);
  };

  const handleNext = () => {
    setIsAnswerRevealed(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      let calculatedScore = 0;
      questions.forEach((q, idx) => {
        const correctIdx = getCorrectIndex(q);
        if (selectedAnswers[idx] === correctIdx) {
          calculatedScore += 1;
        }
      });

      setFinalScore(calculatedScore);
      setIsQuizCompleted(true);

      // Save score and progress
      recordCourseQuizScore(course.id, calculatedScore, questions.length);
      markLessonCompleted(course.id);
      if (onCompleted) onCompleted();

      // Automatically earn 5 tokens if scored 80% or more!
      const percentage = Math.round((calculatedScore / questions.length) * 100);
      if (percentage >= 80 && currentUser?.username) {
        const titleStr =
          language === 'sw' && course.title.sw ? course.title.sw : course.title.en;
        awardTokensForCourseQuizCompletion(
          currentUser.username,
          course.id,
          titleStr,
          percentage
        );
      }

      // Switch to certificate view
      setActiveTab('certificate');
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsAnswerRevealed(false);
    setIsQuizCompleted(false);
    setActionNotice(null);
    setActiveTab('quiz');
  };

  // Generate & Download PDF (Single Generation Rule Enforced)
  const handleGenerateAndDownloadPdf = (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);

    // 1. If already issued to this user, just trigger download without re-generating duplicates
    if (issuedRecord) {
      incrementCertificateDownloadCount(issuedRecord.id);
      generateCertificatePdf({
        record: issuedRecord,
        courseTitleEn: course.title.en,
        courseTitleSw: course.title.sw,
      });
      setActionNotice({
        type: 'info',
        message:
          language === 'en'
            ? `Certificate PDF downloaded (Serial: ${issuedRecord.id}). Note: You have officially generated this certificate.`
            : `Cheti cha PDF kimepakuliwa (Nambari ya Usajili: ${issuedRecord.id}). Kumbuka: Umeshakizalisha cheti hiki rasmi.`,
      });
      return;
    }

    // 2. Validate recipient name
    const trimmedName = recipientName.trim();
    if (trimmedName.length < 3) {
      setActionNotice({
        type: 'warning',
        message:
          language === 'en'
            ? 'Please enter your full name (at least 3 characters) for the official certificate.'
            : 'Tafadhali ingiza jina lako kamili (angalau herufi 3) kwa ajili ya cheti rasmi.',
      });
      return;
    }

    // 3. Register and issue certificate (enforces one certificate per user per course)
    const result = registerAndIssueCertificate(
      course.id,
      userKey,
      trimmedName,
      finalScore,
      questions.length
    );

    if (result.success && result.record) {
      setIssuedRecord(result.record);
      // Generate and trigger download
      generateCertificatePdf({
        record: result.record,
        courseTitleEn: course.title.en,
        courseTitleSw: course.title.sw,
      });

      setActionNotice({
        type: 'success',
        message:
          language === 'en'
            ? `Official Certificate PDF generated and downloaded successfully! Credential locked to "${result.record.recipientName}".`
            : `Cheti rasmi cha PDF kimezalishwa na kupakuliwa! Kimefungwa rasmi kwa jina "${result.record.recipientName}".`,
      });
    } else {
      setActionNotice({
        type: 'warning',
        message:
          result.message ||
          (language === 'en'
            ? 'A certificate has already been issued for this user.'
            : 'Cheti kimeshatolewa tayari kwa mtumiaji huyu.'),
      });
    }
  };

  const formattedDate = issuedRecord
    ? issuedRecord.formattedDate
    : new Date().toLocaleDateString(language === 'en' ? 'en-KE' : 'sw-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Navigation Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <button
          onClick={onBackToCourse}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Back to Course Reading' : 'Rudi Kusoma Somo'}</span>
        </button>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <span>{language === 'en' ? 'Course Quiz (10 Questions)' : 'Chemsha Bongo (Maswali 10)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'certificate'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Course Certificate' : 'Cheti cha Somo'}</span>
            {issuedRecord && (
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: QUIZ VIEW */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-stone-700">
                {language === 'en'
                  ? `Course Assessment: Question ${currentIdx + 1} of ${questions.length}`
                  : `Tathmini ya Somo: Swali la ${currentIdx + 1} kati ya ${questions.length}`}
              </span>
              <span className="text-teal-700 font-mono">
                {Math.round(((currentIdx + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-700 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.title[language]}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 leading-snug">
                {currentQ.question[language]}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedChoice === optIdx;
                const correctIdx = getCorrectIndex(currentQ);
                const isCorrect = optIdx === correctIdx;
                const showStatus = isAnswerRevealed;

                let btnClass = 'border-stone-200 hover:border-teal-400 hover:bg-stone-50 text-stone-800';
                if (showStatus) {
                  if (isCorrect) {
                    btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    btnClass = 'border-red-400 bg-red-50 text-red-950';
                  } else {
                    btnClass = 'border-stone-200 opacity-60 text-stone-600';
                  }
                } else if (isSelected) {
                  btnClass = 'border-teal-600 bg-teal-50 text-teal-950 font-bold';
                }

                const optionLabel = getOptionText(opt, language);

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswerRevealed}
                    onClick={() => handleSelectChoice(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm cursor-pointer ${btnClass}`}
                  >
                    <span className="w-6 h-6 rounded-full border border-stone-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 font-medium">{optionLabel}</span>
                    {showStatus && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {showStatus && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Section */}
            {isAnswerRevealed && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2 animate-in fade-in duration-200">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{language === 'en' ? 'Constitutional Analysis:' : 'Ufafanuzi wa Kikatiba:'}</span>
                </div>
                <p className="leading-relaxed font-normal">{currentQ.explanation[language]}</p>
                {currentQ.constitutionalArticle && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 font-mono bg-amber-200/50 px-2 py-0.5 rounded-md">
                    <span>{currentQ.constitutionalArticle}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
              <button
                disabled={currentIdx === 0}
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx((prev) => prev - 1);
                    setIsAnswerRevealed(selectedAnswers[currentIdx - 1] !== undefined);
                  }
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Previous' : 'Iliyopita'}</span>
              </button>

              {isAnswerRevealed ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <span>
                    {currentIdx < questions.length - 1
                      ? language === 'en'
                        ? 'Next Question'
                        : 'Swali Linalofuata'
                      : language === 'en'
                      ? 'Finish & View Certificate'
                      : 'Kamilisha na Uone Cheti'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs text-stone-400 italic">
                  {language === 'en' ? 'Select an answer to proceed' : 'Chagua jibu ili kuendelea'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CERTIFICATE VIEW WITH INSTANT PDF DOWNLOAD */}
      {activeTab === 'certificate' && (
        <div className="space-y-6">
          {/* 80%+ Score 5-Token Automatic Reward Banner */}
          {Math.round(((finalScore || 0) / (questions.length || 1)) * 100) >= 80 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-teal-500/15 border-2 border-amber-400/80 dark:border-amber-500/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                      {language === 'en'
                        ? '🏆 Distinction Score: 5 Facilitator Tokens Earned!'
                        : '🏆 Ufaulu Bora (80%+): Umepata Sarafu 5 za Uwezeshaji!'}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100">
                      {Math.round(((finalScore || 0) / (questions.length || 1)) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {language === 'en'
                      ? '5 Samaritan Facilitator Tokens have been automatically credited to your account! You can now use them to upload photos in conversations, redeem training certificates, or share with fellow citizens.'
                      : 'Sarafu 5 za Uwezeshaji zimeingizwa kiotomatiki kwenye akaunti yako! Zitumie kupakia picha kwenye mazungumzo, kuchukua vyeti vya uwezeshaji, au kuwashirikisha wananchi wenzako.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('open_facilitator_tokens_modal'))
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shrink-0 shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Manage Tokens' : 'Dhibiti Sarafu'}</span>
              </button>
            </div>
          )}

          {/* Action Notices */}
          {actionNotice && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm border flex items-start gap-3 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : actionNotice.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-blue-50 border-blue-300 text-blue-950'
              }`}
            >
              {actionNotice.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : actionNotice.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <FileCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{actionNotice.message}</div>
            </div>
          )}

          {/* Certificate Submission & PDF Download Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>
                    {language === 'en'
                      ? 'Official PDF Certificate Download'
                      : 'Kupakua Cheti Rasmi cha PDF'}
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {language === 'en'
                    ? 'Generate an authentic high-resolution PDF certificate ready for download.'
                    : 'Zalisha cheti cha ubora wa juu cha PDF kilicho tayari kupakuliwa.'}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {issuedRecord ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {language === 'en' ? 'Official Record Issued' : 'Cheti Kimeshatolewa Rasmi'}
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      {language === 'en' ? 'Ready to Issue' : 'Kiko Tayari Kutolewa'}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Single Generation Rule Notice */}
            {issuedRecord ? (
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-700 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold mb-0.5">
                    {language === 'en'
                      ? 'Single Generation Policy Enforced'
                      : 'Sera ya Cheti Kimoja kwa Kila Mtumiaji'}
                  </strong>
                  {language === 'en'
                    ? `This course certificate was officially issued to "${issuedRecord.recipientName}" on ${issuedRecord.formattedDate} (Serial: ${issuedRecord.id}). To preserve academic integrity, duplicate certificates cannot be generated for the same user. You can re-download your official PDF at any time.`
                    : `Cheti hiki cha somo kilitolewa rasmi kwa "${issuedRecord.recipientName}" tarehe ${issuedRecord.formattedDate} (Nambari ya Usajili: ${issuedRecord.id}). Ili kulinda uadilifu wa kitaaluma, huwezi kubadilisha jina au kuzalisha cheti cha pili cha somo hili. Unaweza kupakua PDF yako rasmi wakati wowote.`}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">
                    {language === 'en' ? 'Verification Rule' : 'Sheria ya Uthibitishaji'}:
                  </strong>
                  {language === 'en'
                    ? 'Enter your name accurately. Once generated, your official certificate is permanently registered to your account to prevent duplicate certificate creation.'
                    : 'Ingiza jina lako kwa usahihi. Ukishatengeneza, cheti chako kitafungwa rasmi na kurekodiwa ili kuzuia mtu kuzalisha vyeti viwili kwa somo moja.'}
                </div>
              </div>
            )}

            {/* Form for Name Submission & Download */}
            <form onSubmit={handleGenerateAndDownloadPdf} className="space-y-4 pt-1">
              <div className="grid sm:grid-cols-3 gap-3 items-end">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                    {language === 'en'
                      ? 'Full Recipient Name on Certificate:'
                      : 'Jina Kamili Litakaloandikwa Kwenye Cheti:'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      disabled={!!issuedRecord}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder={
                        language === 'en'
                          ? 'e.g. Hassan Mohamed Athman'
                          : 'mfano: Hassan Mohamed Athman'
                      }
                      className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border font-bold text-stone-900 transition-colors ${
                        issuedRecord
                          ? 'bg-stone-100 border-stone-200 cursor-not-allowed text-stone-700'
                          : 'bg-white border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500'
                      }`}
                    />
                    {issuedRecord && (
                      <div className="absolute right-3 top-2.5 text-[11px] font-bold text-stone-500 flex items-center gap-1 bg-stone-200 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3 text-stone-600" />
                        <span>{language === 'en' ? 'Locked' : 'Kimefungwa'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <FileDown className="w-4 h-4 text-slate-950" />
                    <span>
                      {issuedRecord
                        ? language === 'en'
                          ? 'Download PDF Certificate'
                          : 'Pakua Cheti cha PDF'
                        : language === 'en'
                        ? 'Submit & Download PDF'
                        : 'Wasilisha na Upakue PDF'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">
                    {language === 'en' ? 'Assessment Score:' : 'Alama ya Mtihani:'}
                  </span>
                  <span className="font-mono font-bold text-teal-800">
                    {finalScore}/10 ({Math.round((finalScore / 10) * 100)}%)
                  </span>
                  {issuedRecord && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[11px]">
                        Downloads: {issuedRecord.downloadCount}
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Retake Quiz' : 'Rudia Mtihani'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* VISUAL CERTIFICATE PREVIEW */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border-8 border-double border-amber-600/70 shadow-2xl relative max-w-4xl mx-auto text-center overflow-hidden">
            {/* Kenya National Ribbon at top edge */}
            <div className="absolute top-0 left-0 right-0 h-2 kenya-ribbon" />

            {/* Header: Republic of Kenya & Kwale Focus Empowerment */}
            <div className="flex items-center justify-center gap-3 text-amber-800 mb-1 pt-2">
              <KfeLogo className="w-10 h-10 shrink-0" />
              <div className="text-left">
                <span className="font-serif font-extrabold tracking-widest text-base sm:text-lg block leading-tight text-amber-900">
                  KWALE FOCUS EMPOWERMENT CBO
                </span>
                <span className="text-[10px] text-stone-500 font-bold tracking-wider uppercase font-mono">
                  Official Implementing Organisation • Community Based Organisation
                </span>
              </div>
            </div>

            <div className="text-[11px] uppercase tracking-widest text-stone-500 font-bold mb-4 font-mono">
              THE SAMARITAN • CIVIC EDUCATION & GOVERNMENT LITERACY INITIATIVE
            </div>

            {/* Certificate Title */}
            <div className="py-2 border-y border-amber-200/80 mb-6">
              <h1 className="text-xl sm:text-3xl font-serif font-extrabold text-stone-900 tracking-tight">
                CERTIFICATE OF CIVIC COURSE COMPETENCY
              </h1>
              <p className="text-xs text-amber-900/80 font-medium italic mt-1">
                Issued under the Constitutional Literacy & Devolved Governance Framework
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 italic mb-2">
              This is to solemnly certify that
            </p>

            {/* Recipient Full Name */}
            <div className="py-2 border-b-2 border-stone-900 max-w-lg mx-auto mb-4">
              <span className="text-2xl sm:text-3xl font-serif font-extrabold text-teal-950 tracking-wide">
                {recipientName || (language === 'en' ? 'Kenyan Citizen' : 'Mwananchi wa Kenya')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed mb-4">
              has completed the curriculum requirements, analyzed constitutional provisions, and
              successfully achieved competency in the specialized civic course:
            </p>

            {/* Course Title Badge */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 max-w-2xl mx-auto mb-6">
              <h3 className="font-bold font-serif text-base sm:text-lg text-stone-900">
                {course.title.en}
              </h3>
              <p className="text-xs text-stone-600 italic mt-0.5">
                {course.title.sw}
              </p>
              {/* Score showing percentage attained by the user */}
              <div className="mt-2 flex items-center justify-center gap-4 text-xs font-mono text-teal-800">
                <span className="font-bold">Assessment Score: {Math.round((finalScore / 10) * 100)}%</span>
                <span>•</span>
                <span>Status: Distinction</span>
              </div>
            </div>

            {/* Signatures & Seal Row */}
            {(() => {
              const sigs = getCertificateSignatories();
              return (
                <div className="grid grid-cols-3 items-end pt-6 border-t border-stone-200 max-w-2xl mx-auto text-center gap-4">
                  <div className="space-y-1">
                    <div className="font-serif italic text-base text-stone-800 border-b border-stone-400 pb-1">
                      {sigs.signatory1Name}
                    </div>
                    <div className="text-[10px] text-stone-600 font-bold uppercase tracking-wider">
                      {sigs.signatory1TitleEn}
                    </div>
                    <div className="text-[9px] text-stone-400">{sigs.signatory1Org}</div>
                  </div>

                  {/* Official KFE Clear Box Authenticity Seal Stamp */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-b from-sky-50 to-amber-50/50 flex flex-col items-center justify-center text-amber-800 shadow-sm p-1">
                      <KfeClearBoxIcon className="w-8 h-8 shrink-0" />
                      <span className="text-[7px] font-extrabold tracking-tight uppercase font-mono text-amber-900 mt-0.5">
                        AUTHENTIC SEAL
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-400 mt-1">
                      {issuedRecord
                        ? issuedRecord.id
                        : `Serial: KFE-${course.id.toUpperCase().replace(/[^A-Z0-9]/g, '')}-2026`}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-serif italic text-base text-stone-800 border-b border-stone-400 pb-1">
                      {sigs.signatory2Name}
                    </div>
                    <div className="text-[10px] text-stone-600 font-bold uppercase tracking-wider">
                      {sigs.signatory2TitleEn}
                    </div>
                    <div className="text-[9px] text-stone-400">{sigs.signatory2Org}</div>
                  </div>
                </div>
              );
            })()}

            {/* Bottom national stripe */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 kenya-ribbon" />
          </div>
        </div>
      )}
    </div>
  );
};
