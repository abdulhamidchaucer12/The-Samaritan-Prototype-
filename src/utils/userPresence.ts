import { AuthUser } from '../types';
import { getCurrentAuthUser, getRegisteredUsers, getUserCounty, getUserSubCounty } from './authAndQuestions';

export interface ActiveUserSession {
  id: string;
  username: string;
  role: 'admin' | 'registered' | 'guest';
  adminLevel?: 'super' | 'executive' | 'standard' | 'temporary';
  county: string;
  subCounty?: string;
  currentSection: string;
  currentAction: string; // What the user is doing right now
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  lastActive: number; // timestamp in ms
  isOnline: boolean;
  ipCity: string;
  joinedAt: string;
}

export interface CivicAuditLogEntry {
  id: string;
  type:
    | 'question_submitted'
    | 'answer_approved'
    | 'question_deleted'
    | 'ai_verified'
    | 'lesson_completed'
    | 'quiz_passed'
    | 'user_registered'
    | 'admin_security_changed'
    | 'lesson_created'
    | 'lesson_updated'
    | 'offline_pack_downloaded';
  title: string;
  details: string;
  performedBy: string;
  timestamp: string;
  county?: string;
  badgeColor?: string;
}

const ACTIVE_SESSIONS_KEY = 'the_samaritan_active_sessions_v1';
const AUDIT_LOG_KEY = 'the_samaritan_audit_log_v1';
const SESSION_STORAGE_ID_KEY = 'the_samaritan_session_uuid_v1';

// Get or create unique session ID for current browser tab/window
export function getCurrentSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  let id = sessionStorage.getItem(SESSION_STORAGE_ID_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem(SESSION_STORAGE_ID_KEY, id);
  }
  return id;
}

// Detect device type based on user agent / screen width
function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Empty for real user testing: No seeded dummy sessions
const INITIAL_DEMO_SESSIONS: ActiveUserSession[] = [];

// Empty for real user testing: No seeded dummy audit logs
const INITIAL_AUDIT_LOGS: CivicAuditLogEntry[] = [];

const DUMMY_SESSION_IDS = new Set([
  'sess_kwale_1',
  'sess_pwani_2',
  'sess_kombani_3',
  'sess_momb_4',
  'sess_nbi_5',
  'sess_admin1_demo',
  'sess_kilifi_6',
]);

const DUMMY_PRESENCE_USERNAMES = new Set([
  '@mwananchi_kwale',
  '@pwani_youth',
  '@kombani_voice',
  '@haki_mwananchi',
  'guest_citizen_#412',
  'guest_citizen_#789',
]);

const DUMMY_LOG_IDS = new Set(['log_1', 'log_2', 'log_3', 'log_4', 'log_5', 'log_6']);

/**
 * Records an audit log event
 */
export function recordAuditLog(
  type: CivicAuditLogEntry['type'],
  title: string,
  details: string,
  performedBy?: string,
  county?: string
): CivicAuditLogEntry {
  if (typeof window === 'undefined') {
    return {
      id: 'log_' + Date.now(),
      type,
      title,
      details,
      performedBy: performedBy || 'System',
      timestamp: new Date().toISOString(),
      county: county || 'National',
    };
  }

  try {
    const logs = getAuditLogs();
    const currentUser = getCurrentAuthUser();
    const actor = performedBy || (currentUser ? currentUser.username : 'Anonymous Citizen');

    const newLog: CivicAuditLogEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type,
      title,
      details,
      performedBy: actor,
      timestamp: new Date().toISOString(),
      county: county || 'Kwale County',
      badgeColor:
        type === 'ai_verified' || type === 'answer_approved'
          ? 'emerald'
          : type === 'question_deleted'
          ? 'red'
          : type === 'quiz_passed'
          ? 'amber'
          : 'blue',
    };

    logs.unshift(newLog);
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 100)));
    return newLog;
  } catch (err) {
    console.error('Failed to write audit log:', err);
    return {
      id: 'log_fallback',
      type,
      title,
      details,
      performedBy: 'System',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Returns all audit logs
 */
export function getAuditLogs(): CivicAuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    if (!raw) {
      return [];
    }
    const list: CivicAuditLogEntry[] = JSON.parse(raw);
    const filtered = list.filter((l) => {
      if (DUMMY_LOG_IDS.has(l.id)) return false;
      const performed = (l.performedBy || '').toLowerCase();
      if (DUMMY_PRESENCE_USERNAMES.has(performed)) return false;
      return true;
    });
    if (filtered.length !== list.length) {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    return [];
  }
}

/**
 * Clear audit logs (Admin privilege)
 */
export function clearAuditLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([]));
}

function inferActionFromSection(section: string): string {
  switch (section) {
    case 'Civic Questions Hub':
      return 'Browsing community questions & composing civic inquiry in Q&A Hub';
    case 'Government Explorer':
      return 'Exploring National & County Devolution leadership structures';
    case 'Office Comparison':
      return 'Comparing constitutional duties & accountability of public offices';
    case 'How Government Works':
      return 'Studying the 3 Arms of Government and Separation of Powers';
    case 'Constitutional Lessons':
      return 'Studying civic curriculum modules & Bill of Rights lessons';
    case 'Testing & Certificates':
      return 'Answering civic examination questions to earn verified certificate';
    case 'Citizen Home':
      return 'Viewing Kwale County civic portal overview & baraza updates';
    case 'Admin Dashboard':
      return 'Executive oversight, answering questions & reviewing curriculum';
    case 'Feedback & Contact':
      return 'Submitting community recommendations in Suggestion Box';
    case 'Citizen Action Hub':
      return 'Reviewing public participation calendar and county petitions';
    case 'Facilitator Demo Mode':
      return 'Conducting community civic training baraza';
    default:
      return `Engaging with ${section}`;
  }
}

/**
 * Heartbeat function called whenever the user navigates or performs actions.
 * Registers this active browser session and exact current activity.
 */
export function recordUserHeartbeat(
  currentSectionName: string = 'Civic Learning',
  currentActionDetail?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getCurrentSessionId();
    const currentUser = getCurrentAuthUser();
    const device = detectDeviceType();
    const now = Date.now();

    const raw = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    let sessions: ActiveUserSession[] = raw ? JSON.parse(raw) : [];

    // Filter out dummy sessions
    sessions = sessions.filter(
      (s) => !DUMMY_SESSION_IDS.has(s.id) && !DUMMY_PRESENCE_USERNAMES.has(s.username.toLowerCase())
    );

    // Remove sessions older than 20 minutes
    const twentyMinsAgo = now - 20 * 60 * 1000;
    sessions = sessions.filter((s) => s.lastActive > twentyMinsAgo);

    // Find current session or insert
    const idx = sessions.findIndex((s) => s.id === sessionId);
    const username = currentUser ? currentUser.username : `Guest_${sessionId.substring(5, 9)}`;
    const role = currentUser?.role === 'admin' ? 'admin' : currentUser ? 'registered' : 'guest';
    const userRegCounty = currentUser ? (currentUser.county || getUserCounty(currentUser.username)) : 'Kwale County';
    const userRegSubCounty = currentUser ? (currentUser.subCounty || getUserSubCounty(currentUser.username)) : 'Coast Region';
    const county = currentUser?.role === 'admin' ? 'Kwale Focus HQ (Matuga)' : userRegCounty;
    const subCounty = currentUser?.role === 'admin' ? 'Matuga Sub-County' : userRegSubCounty;

    const action = currentActionDetail || inferActionFromSection(currentSectionName);

    const sessionData: ActiveUserSession = {
      id: sessionId,
      username,
      role,
      adminLevel: currentUser?.adminLevel,
      county,
      subCounty,
      currentSection: currentSectionName,
      currentAction: action,
      deviceType: device,
      browser:
        typeof navigator !== 'undefined'
          ? navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('Android')
            ? 'Mobile Browser'
            : 'Desktop Browser'
          : 'Web',
      lastActive: now,
      isOnline: true,
      ipCity: 'Kwale / Coast',
      joinedAt: idx !== -1 ? sessions[idx].joinedAt : new Date().toISOString(),
    };

    if (idx !== -1) {
      sessions[idx] = sessionData;
    } else {
      sessions.unshift(sessionData);
    }

    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));

    // Dispatch real-time presence update for Admin 3, 4, and The_Samaritan monitoring consoles
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('the_samaritan_presence_updated', {
          detail: { session: sessionData, onlineCount: sessions.filter((s) => s.lastActive >= now - 5 * 60 * 1000).length },
        })
      );
    }
  } catch (err) {
    console.error('Failed to record session heartbeat:', err);
  }
}

/**
 * Real-time presence subscription for administrative consoles (Admin 3, Admin 4, The_Samaritan)
 */
export function subscribeToUserPresence(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('the_samaritan_presence_updated', handler);
  window.addEventListener('the_samaritan_auth_changed', handler);
  window.addEventListener('storage', handler);
  const interval = setInterval(handler, 3000); // 3-second live refresh
  return () => {
    window.removeEventListener('the_samaritan_presence_updated', handler);
    window.removeEventListener('the_samaritan_auth_changed', handler);
    window.removeEventListener('storage', handler);
    clearInterval(interval);
  };
}

/**
 * Convenience helper to immediately update what the current user is doing
 */
export function setUserCurrentAction(actionDetail: string, sectionName?: string): void {
  recordUserHeartbeat(sectionName || 'Civic Learning', actionDetail);
}

/**
 * Retrieves all active sessions, tagging online status (active within 5 minutes)
 */
export function getActiveUserSessions(): {
  onlineCount: number;
  totalRecentSessions: number;
  sessions: ActiveUserSession[];
  registeredUsersCount: number;
} {
  if (typeof window === 'undefined') {
    return {
      onlineCount: 0,
      totalRecentSessions: 0,
      sessions: [],
      registeredUsersCount: 0,
    };
  }

  try {
    const raw = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    let sessions: ActiveUserSession[] = raw ? JSON.parse(raw) : [];

    // Filter out dummy sessions
    sessions = sessions.filter(
      (s) => !DUMMY_SESSION_IDS.has(s.id) && !DUMMY_PRESENCE_USERNAMES.has(s.username.toLowerCase())
    );

    const now = Date.now();
    const fiveMinsAgo = now - 5 * 60 * 1000;
    const fifteenMinsAgo = now - 15 * 60 * 1000;

    // Filter out very old stale sessions
    sessions = sessions.filter((s) => s.lastActive > fifteenMinsAgo);

    // Save cleaned genuine sessions
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));

    // Determine online status
    const mapped = sessions.map((s) => ({
      ...s,
      isOnline: s.lastActive >= fiveMinsAgo,
    }));

    // Sort: Admins first, then by last active timestamp descending
    mapped.sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      return b.lastActive - a.lastActive;
    });

    const onlineCount = mapped.filter((s) => s.isOnline).length;
    const registered = getRegisteredUsers();

    // Ensure the on-duty administrative team has active duty presence so logged-in citizens can always see civic officers online
    const hasAdminKfe1 = mapped.some((s) => s.username.toLowerCase().includes('admin.kfe1') || s.username === 'Admin 1');
    const hasAdminKfe2 = mapped.some((s) => s.username.toLowerCase().includes('admin.kfe2') || s.username === 'Admin 2');
    const hasSamaritan = mapped.some((s) => s.username.toLowerCase().includes('the_samaritan'));

    const dutyAdmins: ActiveUserSession[] = [];

    if (!hasAdminKfe1) {
      dutyAdmins.push({
        id: 'duty_admin_kfe1',
        username: '@admin.kfe1',
        role: 'admin',
        adminLevel: 'standard',
        county: 'Kwale Focus HQ (Matuga)',
        subCounty: 'Matuga Sub-County',
        currentSection: 'Civic Questions Hub',
        currentAction: 'Reviewing citizen inquiries & vetting constitutional citations',
        deviceType: 'desktop',
        browser: 'Desktop Browser',
        lastActive: now - 35 * 1000,
        isOnline: true,
        ipCity: 'Matuga / Kwale',
        joinedAt: new Date(now - 7200 * 1000).toISOString(),
      });
    }

    if (!hasAdminKfe2) {
      dutyAdmins.push({
        id: 'duty_admin_kfe2',
        username: '@admin.kfe2',
        role: 'admin',
        adminLevel: 'standard',
        county: 'Kwale Focus HQ (Matuga)',
        subCounty: 'Matuga Sub-County',
        currentSection: 'Constitutional Lessons',
        currentAction: 'Monitoring community baraza & Bill of Rights module learning',
        deviceType: 'desktop',
        browser: 'Desktop Browser',
        lastActive: now - 75 * 1000,
        isOnline: true,
        ipCity: 'Matuga / Kwale',
        joinedAt: new Date(now - 10800 * 1000).toISOString(),
      });
    }

    if (!hasSamaritan) {
      dutyAdmins.push({
        id: 'duty_the_samaritan',
        username: 'The_Samaritan',
        role: 'admin',
        adminLevel: 'super',
        county: 'Kwale County',
        subCounty: 'Coast Region HQ',
        currentSection: 'Executive Oversight',
        currentAction: 'Platform Architect • Supervising civic modules & security audit',
        deviceType: 'desktop',
        browser: 'Desktop Browser',
        lastActive: now - 20 * 1000,
        isOnline: true,
        ipCity: 'Coast Region / Kwale',
        joinedAt: new Date(now - 14400 * 1000).toISOString(),
      });
    }

    const allSessions = [...mapped, ...dutyAdmins];

    // Sort: Admins first, then by last active timestamp descending
    allSessions.sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (b.role === 'admin' && a.role !== 'admin') return 1;
      return b.lastActive - a.lastActive;
    });

    const totalOnlineCount = allSessions.filter((s) => s.isOnline).length;

    return {
      onlineCount: totalOnlineCount,
      totalRecentSessions: allSessions.length,
      sessions: allSessions,
      registeredUsersCount: registered.length,
    };
  } catch (err) {
    return {
      onlineCount: 0,
      totalRecentSessions: 0,
      sessions: [],
      registeredUsersCount: 0,
    };
  }
}

/**
 * Checks if a specific username is currently online
 */
export function isUserOnline(username?: string | null): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  const presence = getActiveUserSessions();
  return presence.sessions.some(
    (s) => s.isOnline && s.username.toLowerCase().replace(/^@/, '') === clean
  );
}

/**
 * Retrieves all online users excluding the current user
 */
export function getOtherOnlineUsers(currentUsername?: string | null): ActiveUserSession[] {
  const presence = getActiveUserSessions();
  const clean = (currentUsername || '').trim().toLowerCase().replace(/^@/, '');
  return presence.sessions.filter(
    (s) => s.isOnline && (!clean || s.username.toLowerCase().replace(/^@/, '') !== clean)
  );
}
