import { QuizQuestion } from '../types';

/**
 * Resolves the correct option index for any question format.
 */
export function getQuestionCorrectIndex(q: QuizQuestion | any): number {
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
}

/**
 * Simple pseudo-random generator based on a string seed.
 * Ensures consistent option order during a single course quiz session,
 * avoiding option shuffling on component re-renders.
 */
function createSeededRandom(seedStr: string): () => number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let s = Math.abs(hash) || 123456789;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Shuffles the options of a single question and updates correctOptionId and indices,
 * placing the correct answer at a target position (or randomly) across choices A, B, C, D.
 */
export function randomizeSingleQuestion<T extends QuizQuestion>(
  question: T,
  targetSlot?: number, // 0='a', 1='b', 2='c', 3='d'
  seed?: string
): T {
  if (!question || !question.options || question.options.length <= 1) {
    return question;
  }

  const origOptions = [...question.options];
  const correctIdx = getQuestionCorrectIndex(question);
  const correctOption = origOptions[correctIdx] || origOptions[0];
  const wrongOptions = origOptions.filter((_, idx) => idx !== correctIdx);

  const numOptions = origOptions.length;
  let chosenSlot: number;

  if (typeof targetSlot === 'number' && targetSlot >= 0 && targetSlot < numOptions) {
    chosenSlot = targetSlot;
  } else if (seed) {
    const rng = createSeededRandom(seed);
    chosenSlot = Math.floor(rng() * numOptions);
  } else {
    chosenSlot = Math.floor(Math.random() * numOptions);
  }

  // Shuffle wrong options deterministically or randomly
  const rngWrong = seed ? createSeededRandom(seed + '_distractors') : null;
  const shuffledWrong = [...wrongOptions].sort(() => {
    return rngWrong ? rngWrong() - 0.5 : Math.random() - 0.5;
  });

  // Re-build options array with clean option IDs: 'a', 'b', 'c', 'd'
  const letterKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
  const newOptions: any[] = [];
  let wrongPointer = 0;

  for (let i = 0; i < numOptions; i++) {
    const newOptId = letterKeys[i] || `opt_${i}`;
    if (i === chosenSlot) {
      newOptions.push({
        ...correctOption,
        id: newOptId,
      });
    } else {
      const wrong = shuffledWrong[wrongPointer++] || origOptions[i];
      newOptions.push({
        ...wrong,
        id: newOptId,
      });
    }
  }

  const chosenSlotId = letterKeys[chosenSlot] || 'a';

  return {
    ...question,
    options: newOptions,
    correctOptionId: chosenSlotId,
    correctAnswer: chosenSlot,
    correctAnswerIndex: chosenSlot,
  };
}

/**
 * Randomizes an entire list of questions (e.g. 10 questions) ensuring a balanced,
 * truly random distribution across choices A, B, C, and D.
 * 
 * In a 10-question quiz:
 * - Guarantees choices A, B, C, and D are distributed evenly (~2-3 questions each).
 * - Avoids clustering on choice A.
 */
export function randomizeQuizQuestions<T extends QuizQuestion>(
  questions: T[],
  contextSeed?: string
): T[] {
  if (!questions || questions.length === 0) return [];

  // Balanced slot template for 10 questions:
  // Two 0's (A), three 1's (B), three 2's (C), two 3's (D)
  const baseDistribution = [0, 1, 2, 3, 1, 2, 0, 3, 1, 2];
  
  let slots: number[] = [];
  while (slots.length < questions.length) {
    slots.push(...baseDistribution);
  }
  slots = slots.slice(0, questions.length);

  // Permute slots array
  const rngPermute = contextSeed ? createSeededRandom(contextSeed + '_permute') : null;
  for (let i = slots.length - 1; i > 0; i--) {
    const r = rngPermute ? rngPermute() : Math.random();
    const j = Math.floor(r * (i + 1));
    const temp = slots[i];
    slots[i] = slots[j];
    slots[j] = temp;
  }

  // Strictly avoid repeating questions within the same quiz set
  const seenTexts = new Set<string>();
  const uniqueQuestions: T[] = [];
  for (const q of questions) {
    const stem = (typeof q.question === 'string' ? q.question : q.question?.en || '').toLowerCase().trim();
    if (!seenTexts.has(stem)) {
      seenTexts.add(stem);
      uniqueQuestions.push(q);
    }
  }

  return uniqueQuestions.map((q, idx) => {
    const targetSlot = slots[idx % slots.length];
    const qSeed = contextSeed ? `${contextSeed}_q${idx}_${q.id || 'item'}` : undefined;
    return randomizeSingleQuestion(q, targetSlot, qSeed);
  });
}

/**
 * Deduplicates an array of quiz questions by English question text to guarantee zero repetition.
 */
export function deduplicateQuizQuestions<T extends QuizQuestion>(questions: T[]): T[] {
  const seenStems = new Set<string>();
  const result: T[] = [];
  for (const q of questions) {
    const stem = (typeof q.question === 'string' ? q.question : q.question?.en || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    if (!seenStems.has(stem)) {
      seenStems.add(stem);
      result.push(q);
    }
  }
  return result;
}
