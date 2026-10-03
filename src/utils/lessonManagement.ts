import { CivicLesson, LessonSection, QuizQuestion } from '../types';
import { getAllCivicCourses, normalizeCivicTitle, isCivicLessonDuplicate } from './dailyCourses';
import { getCourseQuizQuestions } from '../data/courseQuizzes';
import { recordAuditLog } from './userPresence';
import { isUserAppointedAdmin } from './adminManagement';

const CUSTOM_LESSONS_KEY = 'the_samaritan_custom_lessons_v1';
const LESSONS_OVERRIDE_KEY = 'the_samaritan_lessons_override_v1';

export interface LessonAdminMeta {
  isPublished: boolean;
  authorAdmin?: string;
  lastUpdated?: string;
  isCustom?: boolean;
}

export interface AdminLessonExtended extends CivicLesson {
  isPublished?: boolean;
  isCustom?: boolean;
  authorAdmin?: string;
  lastUpdated?: string;
}

/**
 * Retrieves all lessons with admin metadata (foundational + daily + custom)
 */
export function getAdminLessons(): AdminLessonExtended[] {
  if (typeof window === 'undefined') return [];

  try {
    const baseCourses = getAllCivicCourses();
    const customRaw = localStorage.getItem(CUSTOM_LESSONS_KEY);
    const overridesRaw = localStorage.getItem(LESSONS_OVERRIDE_KEY);

    const customLessons: AdminLessonExtended[] = customRaw ? JSON.parse(customRaw) : [];
    const overrides: Record<string, Partial<AdminLessonExtended>> = overridesRaw ? JSON.parse(overridesRaw) : {};

    // Merge base courses with overrides
    const mappedBase: AdminLessonExtended[] = baseCourses.map((c) => {
      const override = overrides[c.id] || {};
      return {
        ...c,
        isPublished: override.isPublished !== undefined ? override.isPublished : true,
        authorAdmin: override.authorAdmin || 'Curriculum Board / KFE',
        lastUpdated: override.lastUpdated || c.publishedDate || '2026-09-01',
        isCustom: false,
        ...override,
      };
    });

    // Merge custom lessons and deduplicate by id
    const combinedRaw = [...customLessons, ...mappedBase];
    const seenIds = new Set<string>();
    const combined: AdminLessonExtended[] = [];

    for (const l of combinedRaw) {
      if (!seenIds.has(l.id)) {
        seenIds.add(l.id);
        combined.push(l);
      }
    }

    // Ensure quizzes are present
    combined.forEach((l) => {
      if (!l.quizzes || l.quizzes.length < 5) {
        l.quizzes = getCourseQuizQuestions(l.id, l.title, l.category);
      }
    });

    return combined;
  } catch (err) {
    console.error('Failed to load admin lessons:', err);
    return [];
  }
}

/**
 * Checks if a proposed lesson title or topic duplicates an existing lesson in the curriculum.
 */
export function checkLessonDuplicate(candidateTitle: string | { en: string; sw?: string }): {
  isDuplicate: boolean;
  matchedLesson?: AdminLessonExtended;
} {
  const existing = getAdminLessons();
  const normEn = normalizeCivicTitle(candidateTitle);
  const normSw = typeof candidateTitle === 'object' && candidateTitle.sw ? normalizeCivicTitle(candidateTitle.sw) : '';

  if (!normEn && !normSw) return { isDuplicate: false };

  const matched = existing.find((l) => {
    const existingNormEn = normalizeCivicTitle(l.title);
    const existingNormSw = normalizeCivicTitle(typeof l.title === 'object' ? l.title.sw || '' : '');
    if (normEn && (existingNormEn === normEn || existingNormSw === normEn)) return true;
    if (normSw && (existingNormEn === normSw || existingNormSw === normSw)) return true;
    return false;
  });

  return {
    isDuplicate: Boolean(matched),
    matchedLesson: matched,
  };
}

/**
 * Creates a brand new custom lesson by an administrator
 */
export function createCustomLesson(
  lessonInput: Omit<AdminLessonExtended, 'id' | 'lessonNumber' | 'isCustom'> & {
    quizzes?: QuizQuestion[];
    isSupplementary?: boolean;
    developedByAi?: boolean;
  },
  adminName: 'Admin 1' | 'Admin 2' | string = 'Admin 1'
): AdminLessonExtended {
  // Anti-Repetition Guard: Check if a lesson with this title or topic already exists
  const dupCheck = checkLessonDuplicate(lessonInput.title);
  if (dupCheck.isDuplicate && dupCheck.matchedLesson) {
    const titleText = typeof lessonInput.title === 'string' ? lessonInput.title : lessonInput.title.en;
    throw new Error(
      `Repetition prevented: A lesson on "${titleText}" already exists as Lesson #${dupCheck.matchedLesson.lessonNumber} ("${typeof dupCheck.matchedLesson.title === 'string' ? dupCheck.matchedLesson.title : dupCheck.matchedLesson.title.en}"). Please choose a distinct civic topic.`
    );
  }

  const existing = getAdminLessons();
  const customRaw = localStorage.getItem(CUSTOM_LESSONS_KEY);
  const customLessons: AdminLessonExtended[] = customRaw ? JSON.parse(customRaw) : [];

  // Gather all taken lesson numbers to guarantee no collision with daily courses or foundational lessons
  const occupiedNumbers = new Set<number>();
  existing.forEach((l) => occupiedNumbers.add(l.lessonNumber));

  try {
    const dailyRaw = localStorage.getItem('the_samaritan_daily_courses_v2');
    if (dailyRaw) {
      const dailyParsed: { lessonNumber?: number }[] = JSON.parse(dailyRaw);
      dailyParsed.forEach((d) => {
        if (typeof d.lessonNumber === 'number') {
          occupiedNumbers.add(d.lessonNumber);
        }
      });
    }
  } catch (e) {
    // ignore
  }

  let nextNumber = 11;
  while (occupiedNumbers.has(nextNumber)) {
    nextNumber++;
  }
  const newId = `custom_lesson_${Date.now()}`;

  const assignedQuizzes =
    lessonInput.quizzes && lessonInput.quizzes.length >= 5
      ? lessonInput.quizzes
      : getCourseQuizQuestions(newId, lessonInput.title, lessonInput.category);

  const fullLesson: AdminLessonExtended = {
    ...lessonInput,
    id: newId,
    lessonNumber: nextNumber,
    isCustom: true,
    isSupplementary: true, // Marked as Supplementary Course
    developedByAi: lessonInput.developedByAi ?? true,
    isPublished: lessonInput.isPublished !== undefined ? lessonInput.isPublished : true,
    authorAdmin: adminName,
    lastUpdated: new Date().toISOString().slice(0, 10),
    quizzes: assignedQuizzes,
  };

  customLessons.unshift(fullLesson);
  localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(customLessons));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('civic_lessons_updated', { detail: { lessonId: newId } }));
  }

  // Log in audit log
  recordAuditLog(
    'lesson_created',
    `Supplementary Course Created: ${lessonInput.title.en}`,
    `Administrator ${adminName} published module in "${lessonInput.category}" category with 10 Operator AI quiz questions.`,
    adminName
  );

  return fullLesson;
}

/**
 * Updates an existing lesson (either standard or custom)
 */
export function updateAdminLesson(
  lessonId: string,
  updates: Partial<AdminLessonExtended>,
  adminName: string = 'Admin 1'
): boolean {
  try {
    const customRaw = localStorage.getItem(CUSTOM_LESSONS_KEY);
    const customLessons: AdminLessonExtended[] = customRaw ? JSON.parse(customRaw) : [];
    const customIdx = customLessons.findIndex((l) => l.id === lessonId);

    if (customIdx !== -1) {
      customLessons[customIdx] = {
        ...customLessons[customIdx],
        ...updates,
        lastUpdated: new Date().toISOString().slice(0, 10),
        authorAdmin: adminName,
      };
      localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(customLessons));
    } else {
      // Standard or daily lesson override
      const overridesRaw = localStorage.getItem(LESSONS_OVERRIDE_KEY);
      const overrides: Record<string, Partial<AdminLessonExtended>> = overridesRaw ? JSON.parse(overridesRaw) : {};
      overrides[lessonId] = {
        ...(overrides[lessonId] || {}),
        ...updates,
        lastUpdated: new Date().toISOString().slice(0, 10),
        authorAdmin: adminName,
      };
      localStorage.setItem(LESSONS_OVERRIDE_KEY, JSON.stringify(overrides));
    }

    recordAuditLog(
      'lesson_updated',
      `Lesson Updated: ${updates.title?.en || lessonId}`,
      `Administrator ${adminName} updated content and parameters.`,
      adminName
    );

    return true;
  } catch (err) {
    console.error('Failed to update lesson:', err);
    return false;
  }
}

/**
 * Toggles publish / draft state of a lesson
 */
export function toggleLessonPublishState(lessonId: string, adminName: string = 'Admin 1'): boolean {
  const all = getAdminLessons();
  const target = all.find((l) => l.id === lessonId);
  if (!target) return false;

  const newState = !target.isPublished;
  updateAdminLesson(lessonId, { isPublished: newState }, adminName);
  return newState;
}

/**
 * Deletes a custom lesson (standard lessons can be unpublished instead)
 */
export function deleteAdminLesson(lessonId: string, adminName: string = 'Admin 1'): boolean {
  try {
    // 1. Deny temporary admins the ability to delete anything from the app
    if (isUserAppointedAdmin(adminName)) {
      console.warn(`[Permission Denied] Temporary admin ${adminName} cannot delete lessons.`);
      return false;
    }

    const customRaw = localStorage.getItem(CUSTOM_LESSONS_KEY);
    if (!customRaw) return false;

    let customLessons: AdminLessonExtended[] = JSON.parse(customRaw);
    const target = customLessons.find((l) => l.id === lessonId);
    if (!target) {
      // If standard lesson, unpublish rather than hard delete
      updateAdminLesson(lessonId, { isPublished: false }, adminName);
      return true;
    }

    // 2. Anything done by The_Samaritan user cannot be deleted by any other user except the same account
    if (
      (target.authorAdmin === 'The_Samaritan' || target.authorAdmin === 'The Samaritan') &&
      adminName !== 'The_Samaritan' &&
      adminName !== 'The Samaritan'
    ) {
      console.warn(`[Permission Denied] Module created by The_Samaritan can only be deleted by The_Samaritan.`);
      return false;
    }

    customLessons = customLessons.filter((l) => l.id !== lessonId);
    localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(customLessons));

    recordAuditLog(
      'lesson_updated',
      `Custom Lesson Deleted: ${target.title.en}`,
      `Administrator ${adminName} deleted custom learning module.`,
      adminName
    );

    return true;
  } catch (err) {
    console.error('Failed to delete lesson:', err);
    return false;
  }
}
