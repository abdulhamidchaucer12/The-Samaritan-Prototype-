import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Language, QuizQuestion } from '../types';
import { translations } from '../data/translations';
import { quizData } from '../data/quizData';
import { recordQuizScore, getUserProgress } from '../utils/storage';

interface QuizSectionProps {
  language: Language;
  onNavigateToLessons?: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  language,
  onNavigateToLessons,
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  const currentQuestion: QuizQuestion = quizData[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return; // Prevent changing after answer
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    const isCorrect = optionId === currentQuestion.correctOptionId;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setQuizFinished(true);
      recordQuizScore('general_civic_quiz', score + (selectedOptionId === currentQuestion.correctOptionId ? 0 : 0), quizData.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers({});
  };

  const scorePercent = Math.round((score / quizData.length) * 100);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="border-b border-stone-200 pb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{t.quiz.category}</span>
        </div>
        <h1 className="text-3xl font-extrabold font-serif text-stone-900 tracking-tight">
          {t.quiz.title}
        </h1>
        <p className="text-stone-600 text-sm max-w-xl mx-auto leading-relaxed">
          {t.quiz.subtitle}
        </p>
      </div>

      {quizFinished ? (
        /* QUIZ SUMMARY & RESULTS SCREEN */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              {language === 'en' ? 'Quiz Completed!' : 'Umekamilisha Chemsha Bongo!'}
            </h2>
            <p className="text-stone-600 text-sm">
              {language === 'en'
                ? 'Here is your civic knowledge evaluation:'
                : 'Tathmini ya ufahamu wako wa uraia:'}
            </p>
          </div>

          {/* Big Score Card */}
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 max-w-sm mx-auto space-y-2">
            <div className="text-5xl font-black text-emerald-800 font-serif">
              {score} / {quizData.length}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {scorePercent}% {language === 'en' ? 'Score' : 'Alama'}
            </div>
            <p className="text-xs text-stone-600 pt-1">
              {scorePercent >= 80
                ? language === 'en'
                  ? 'Excellent! You have a strong grasp of constitutional governance.'
                  : 'Hodari sana! Unaelewa vizuri muundo wa serikali na Katiba.'
                : scorePercent >= 50
                ? language === 'en'
                  ? 'Good effort! Review the 10 civic lessons to strengthen your knowledge.'
                  : 'Umefanya vizuri! Soma tena masomo 10 ya uraia kuongeza ujuzi.'
                : language === 'en'
                ? 'Keep learning! Civic literacy takes practice and study.'
                : 'Endelea kujifunza! Elimu ya uraia inahitaji kusoma na kufanya mazoezi.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.quiz.tryAgain}</span>
            </button>

            {onNavigateToLessons && (
              <button
                onClick={onNavigateToLessons}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'en' ? 'Review Lessons' : 'Rejelea Masomo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE QUESTION CARD */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 border-b border-stone-100 pb-4">
            <span className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                {t.quiz.question} {currentIndex + 1} of {quizData.length}
              </span>
              {currentQuestion.isScenario && (
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded uppercase text-[10px]">
                  {language === 'en' ? 'Real Life Scenario' : 'Mfano Halisi'}
                </span>
              )}
            </span>
            <span className="font-bold text-emerald-800">
              {language === 'en' ? 'Score:' : 'Alama:'} {score}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-snug">
              {currentQuestion.question[language]}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.id === currentQuestion.correctOptionId;

              let optionStyle =
                'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';

              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle =
                    'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    'bg-rose-100 border-rose-400 text-rose-950 line-through';
                } else {
                  optionStyle = 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <span className="leading-relaxed">{option.text[language]}</span>
                  {hasAnswered && (
                    <span className="shrink-0 ml-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-700" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Feedback Box */}
          {hasAnswered && (
            <div
              className={`p-5 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                selectedOptionId === currentQuestion.correctOptionId
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                {selectedOptionId === currentQuestion.correctOptionId ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>{t.quiz.correct}!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{t.quiz.incorrect}</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed font-medium">
                {currentQuestion.explanation[language]}
              </p>
            </div>
          )}

          {/* Next Question / Finish Button */}
          {hasAnswered && (
            <div className="pt-3 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer animate-in fade-in"
              >
                <span>
                  {currentIndex < quizData.length - 1
                    ? t.quiz.nextQuestion
                    : t.quiz.seeResults}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
