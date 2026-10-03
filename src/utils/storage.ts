import { UserCivicProgress, Language, Theme } from '../types';
import { officesData } from '../data/officesData';
import { lessonsData } from '../data/lessonsData';
import { quizData } from '../data/quizData';

const PROGRESS_KEY = 'the_samaritan_progress_v1';
const LANG_KEY = 'the_samaritan_lang_v1';
const THEME_KEY = 'the_samaritan_theme_v2';
const OFFLINE_PACK_KEY = 'the_samaritan_offline_pack_v1';
const AUTH_USER_KEY = 'the_samaritan_auth_user_v1';

export function getActiveUserKey(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username) {
        return parsed.username.trim().toLowerCase().replace(/^@/, '');
      }
    }
  } catch (e) {}
  return 'guest';
}

function getScopedProgressKey(username?: string | null): string {
  const clean = username ? username.trim().toLowerCase().replace(/^@/, '') : getActiveUserKey();
  if (!clean || clean === 'guest') {
    return PROGRESS_KEY;
  }
  return `${PROGRESS_KEY}_u_${clean}`;
}

const defaultProgress: UserCivicProgress = {
  completedLessons: [],
  quizScores: {},
  bookmarkedOffices: [],
  recentlyViewedOffices: [],
  lastActiveDate: new Date().toISOString(),
  offlinePackDownloaded: false,
};

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    // Light theme is the primary, automatic default on all devices (mobile, tablet, desktop)
    // Only return 'dark' if user explicitly toggled it in the UI
    if (saved === 'dark') return 'dark';
  } catch {
    // Ignore error
  }
  return 'light';
}

export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', theme);
    }
  } catch {
    // Ignore error
  }
}

export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'sw' || saved === 'en') return saved;
  return 'en';
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANG_KEY, lang);
}

export function getUserProgress(username?: string | null): UserCivicProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const key = getScopedProgressKey(username);
    const raw = localStorage.getItem(key);
    if (!raw) {
      // If guest progress exists and user just logged in with no progress, optionally adopt
      if (key !== PROGRESS_KEY) {
        const guestRaw = localStorage.getItem(PROGRESS_KEY);
        if (guestRaw) {
          try {
            const guestParsed = JSON.parse(guestRaw);
            // Save initial copy to user profile if non-empty
            if (guestParsed.completedLessons?.length > 0 || Object.keys(guestParsed.quizScores || {}).length > 0) {
              localStorage.setItem(key, JSON.stringify({ ...defaultProgress, ...guestParsed }));
              return { ...defaultProgress, ...guestParsed };
            }
          } catch (e) {}
        }
      }
      return defaultProgress;
    }
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return defaultProgress;
  }
}

export function saveUserProgress(progress: Partial<UserCivicProgress>, username?: string | null): UserCivicProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const key = getScopedProgressKey(username);
    const current = getUserProgress(username);
    const updated: UserCivicProgress = {
      ...current,
      ...progress,
      lastActiveDate: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('the_samaritan_progress_updated', { detail: { username, progress: updated } }));
    }
    return updated;
  } catch (e) {
    console.error('Failed to save user progress:', e);
    return defaultProgress;
  }
}

export function toggleBookmarkOffice(officeId: string): boolean {
  const current = getUserProgress();
  const exists = current.bookmarkedOffices.includes(officeId);
  const updatedBookmarks = exists
    ? current.bookmarkedOffices.filter((id) => id !== officeId)
    : [...current.bookmarkedOffices, officeId];

  saveUserProgress({ bookmarkedOffices: updatedBookmarks });
  return !exists;
}

export function recordOfficeView(officeId: string): void {
  const current = getUserProgress();
  const filtered = current.recentlyViewedOffices.filter((id) => id !== officeId);
  const updated = [officeId, ...filtered].slice(0, 8);
  saveUserProgress({ recentlyViewedOffices: updated });
}

export function markLessonCompleted(lessonId: string): void {
  const current = getUserProgress();
  if (!current.completedLessons.includes(lessonId)) {
    saveUserProgress({ completedLessons: [...current.completedLessons, lessonId] });
  }
}

export function recordQuizScore(categoryId: string, score: number, total: number): void {
  const current = getUserProgress();
  const updatedScores = {
    ...current.quizScores,
    [categoryId]: {
      score,
      total,
      date: new Date().toLocaleDateString(),
    },
  };
  saveUserProgress({ quizScores: updatedScores });
}

export function recordCourseQuizScore(
  courseId: string,
  score: number,
  total: number
): { passed: boolean; score: number; total: number } {
  const current = getUserProgress();
  const passed = score >= Math.ceil(total * 0.7); // 70% pass threshold for certificate
  const updated = {
    ...(current.courseQuizScores || {}),
    [courseId]: {
      score,
      total,
      date: new Date().toLocaleDateString(),
      passed,
    },
  };
  saveUserProgress({ courseQuizScores: updated });
  return { passed, score, total };
}

export function recordCourseCertificateEarned(
  courseId: string,
  recipientName: string,
  score: number
): { certificateId: string; earnedDate: string; recipientName: string; score: number } {
  const current = getUserProgress();
  const certificateId = `KFE-CIVIC-${new Date().getFullYear()}-${courseId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const earnedDate = new Date().toLocaleDateString();
  const record = {
    certificateId,
    earnedDate,
    recipientName: recipientName.trim() || 'Kenyan Citizen',
    score,
  };
  const updatedCertificates = {
    ...(current.courseCertificatesEarned || {}),
    [courseId]: record,
  };
  saveUserProgress({ courseCertificatesEarned: updatedCertificates });
  return record;
}

export function downloadOfflinePackToStorage(): Promise<{ sizeKb: number; timestamp: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pack = {
        version: '1.0.0',
        cachedAt: new Date().toISOString(),
        offices: officesData,
        lessons: lessonsData,
        quizzes: quizData,
      };
      const jsonStr = JSON.stringify(pack);
      try {
        localStorage.setItem(OFFLINE_PACK_KEY, jsonStr);
        saveUserProgress({
          offlinePackDownloaded: true,
          offlinePackDate: new Date().toLocaleDateString(),
        });
      } catch (err) {
        console.warn('LocalStorage full, pack cached in runtime memory:', err);
      }
      resolve({
        sizeKb: Math.round(jsonStr.length / 1024),
        timestamp: new Date().toLocaleDateString(),
      });
    }, 600);
  });
}

export function exportPrintableHandbookText(lang: Language): string {
  let output = `=================================================================\n`;
  output += `THE SAMARITAN - DIGITAL CIVIC EDUCATION & GOVERNMENT LITERACY\n`;
  output += `Implementing Organisation: Kwale Focus Empowerment CBO (KFE)\n`;
  output += `Tagline: Know Your Government. Understand Your Rights. Shape Your Future.\n`;
  output += `Language: ${lang === 'en' ? 'English' : 'Kiswahili'}\n`;
  output += `Generated on: ${new Date().toLocaleDateString()}\n`;
  output += `=================================================================\n\n`;

  output += `--- PART 1: CIVIC EDUCATION LESSONS ---\n\n`;
  lessonsData.forEach((l) => {
    output += `[LESSON ${l.lessonNumber}]: ${l.title[lang]}\n`;
    output += `Summary: ${l.summary[lang]}\n\n`;
    l.sections.forEach((s) => {
      output += `  * ${s.title[lang]}\n`;
      output += `    ${s.content[lang]}\n`;
      if (s.bulletPoints?.[lang]) {
        s.bulletPoints[lang].forEach((b) => {
          output += `     - ${b}\n`;
        });
      }
      output += `\n`;
    });
    output += `  Citizen Action Tip: ${l.citizenActionTip[lang]}\n\n`;
    output += `-----------------------------------------------------------------\n\n`;
  });

  output += `--- PART 2: GOVERNMENT OFFICES PROFILES ---\n\n`;
  officesData.forEach((o) => {
    output += `OFFICE: ${o.name[lang]} (${o.level.toUpperCase()} LEVEL - ${o.branch.toUpperCase()})\n`;
    output += `Summary: ${o.summary[lang]}\n`;
    output += `Selection Method: ${o.howSelected[lang]}\n`;
    output += `Term: ${o.termOfOffice[lang]}\n`;
    output += `What it Does NOT do: \n`;
    o.whatItDoesNotDo[lang].forEach((w) => {
      output += `  x ${w}\n`;
    });
    output += `Citizen Engagement: ${o.citizenEngagement[lang]}\n`;
    output += `-----------------------------------------------------------------\n\n`;
  });

  return output;
}
