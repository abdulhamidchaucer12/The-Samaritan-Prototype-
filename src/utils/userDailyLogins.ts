import { AuthUser } from '../types';
import { getCertificateSignatories } from './certificateSignatories';
import { getAdminPlatformAddressingName } from './adminAppointments';

/**
 * Daily login tracking for authenticated users.
 * Tracks logins by local calendar day (YYYY-MM-DD).
 */

const DAILY_LOGINS_STORAGE_KEY = 'the_samaritan_user_daily_logins_v2';
const SESSION_VISIT_KEY_PREFIX = 'the_samaritan_session_login_recorded_';

export interface DailyLoginRecord {
  date: string; // YYYY-MM-DD
  count: number; // number of logins on this date
  lastLoginTime: number; // timestamp
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the login count for the specified user today.
 */
export function getDailyLoginCount(username?: string | null): number {
  if (typeof window === 'undefined' || !username) return 0;
  try {
    const raw = localStorage.getItem(DAILY_LOGINS_STORAGE_KEY);
    if (!raw) return 0;
    const records: Record<string, DailyLoginRecord> = JSON.parse(raw);
    const key = username.toLowerCase().trim();
    const userRecord = records[key];
    if (!userRecord) return 0;
    const today = getTodayDateString();
    if (userRecord.date !== today) return 0;
    return userRecord.count || 0;
  } catch {
    return 0;
  }
}

/**
 * Increments the daily login count for the user on today's date.
 * Called on explicit login or new session login.
 */
export function recordUserDailyLogin(username?: string | null): number {
  if (typeof window === 'undefined' || !username) return 0;
  try {
    const raw = localStorage.getItem(DAILY_LOGINS_STORAGE_KEY);
    const records: Record<string, DailyLoginRecord> = raw ? JSON.parse(raw) : {};
    const key = username.toLowerCase().trim();
    const today = getTodayDateString();
    const existing = records[key];

    let newCount = 1;
    if (existing && existing.date === today) {
      newCount = (existing.count || 0) + 1;
    }

    records[key] = {
      date: today,
      count: newCount,
      lastLoginTime: Date.now(),
    };

    localStorage.setItem(DAILY_LOGINS_STORAGE_KEY, JSON.stringify(records));

    // Also mark in sessionStorage that this session has been counted
    try {
      sessionStorage.setItem(`${SESSION_VISIT_KEY_PREFIX}${key}_${today}`, String(newCount));
    } catch {
      // ignore
    }

    window.dispatchEvent(
      new CustomEvent('the_samaritan_login_count_updated', {
        detail: { username, count: newCount, date: today },
      })
    );

    return newCount;
  } catch {
    return 1;
  }
}

/**
 * Ensures that if a user opens the app while already logged in,
 * their session today is registered (at least count = 1, or if returning in a new session, count increments).
 */
export function registerSessionVisitIfLoggedIn(username?: string | null): number {
  if (typeof window === 'undefined' || !username) return 0;
  try {
    const key = username.toLowerCase().trim();
    const today = getTodayDateString();
    const sessionKey = `${SESSION_VISIT_KEY_PREFIX}${key}_${today}`;
    const sessionRecorded = sessionStorage.getItem(sessionKey);

    if (sessionRecorded) {
      // Already recorded this session, just return current count
      return getDailyLoginCount(username);
    }

    // New session on this day for this logged-in user
    return recordUserDailyLogin(username);
  } catch {
    return getDailyLoginCount(username);
  }
}

/**
 * Determines if the user is logged in for the second time henceforth during the same day.
 */
export function isUserLoggedInSecondTimeHenceforth(username?: string | null): boolean {
  if (!username) return false;
  const count = getDailyLoginCount(username);
  return count >= 2;
}

/**
 * Returns the resolved greeting display name for a user:
 * - The_Samaritan -> "Sir Chaucer"
 * - Admin 3 -> Signatory 1 name (e.g. "Amina Ntsiki Bedzengah")
 * - Admin 4 -> Signatory 2 name (e.g. "Mesalim Ali Rambo")
 * - Logged in user -> user.username
 * - Guest / Anonymous visitor -> "user"
 */
export function getGreetingDisplayName(user?: AuthUser | null): string {
  if (!user || !user.username) {
    return 'user';
  }

  const trimmed = user.username.trim();
  const lower = trimmed.toLowerCase();

  // The_Samaritan -> dynamically allocated name for oneself (e.g. "Sir Chaucer")
  if (
    lower === 'the_samaritan' ||
    lower === 'the samaritan' ||
    lower === '@the_samaritan' ||
    lower === 'thesamaritan' ||
    lower === 'sir chaucer'
  ) {
    return getAdminPlatformAddressingName('The_Samaritan');
  }

  // Admin 1 to Admin 4 -> Addressed by the platform as "Admin Y" with Y being the first name of the admin!
  if (
    user.role === 'admin' ||
    lower.startsWith('admin') ||
    lower.startsWith('@admin') ||
    lower.includes('kfe')
  ) {
    return getAdminPlatformAddressingName(trimmed);
  }

  return trimmed;
}

/**
 * Formats the full greeting:
 * "Hello user"
 * If user is logged in for the second time henceforth during the same day,
 * add comma after the username and add "Welcome back!"
 * e.g. "Hello Sir Chaucer, Welcome back!"
 */
export function formatUserHeroGreeting(user?: AuthUser | null): string {
  const displayName = getGreetingDisplayName(user);
  const isSecondTimeHenceforth = user?.username ? isUserLoggedInSecondTimeHenceforth(user.username) : false;

  if (isSecondTimeHenceforth) {
    return `Hello ${displayName}, Welcome back!`;
  }

  return `Hello ${displayName}`;
}
