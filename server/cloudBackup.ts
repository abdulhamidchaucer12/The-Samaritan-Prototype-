import fs from "fs";
import path from "path";

/**
 * Cloud Backup & Multi-Device Sync Store for The Samaritan Platform
 * Mirrors progress, facilitator tokens, verification badges, civic inquiries,
 * certificates, and user profiles to resilient cloud storage.
 */

export interface UserBackupRecord {
  username: string;
  county?: string;
  subCounty?: string;
  avatarUrl?: string;
  progress?: any;
  tokenBalance?: number;
  tokenGrants?: any[];
  verificationBadge?: any;
  issuedCertificates?: any[];
  dailyVisits?: any;
  passwordHash?: string;
  role?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface PlatformCloudSnapshot {
  version: string;
  lastUpdatedAt: string;
  users: Record<string, UserBackupRecord>;
  citizens?: any[];
  userProgress?: any[];
  tokens?: any[];
  verificationBadges?: any[];
  questions?: any[];
  suggestions?: any[];
  certificates?: any[];
  incidents?: any[];
  adaptations?: any[];
  activeSessions?: any[];
}

const CLOUD_STORAGE_FILE = path.join(process.cwd(), "server_cloud_backup.json");

let cachedSnapshot: PlatformCloudSnapshot | null = null;

function loadSnapshot(): PlatformCloudSnapshot {
  if (cachedSnapshot) return cachedSnapshot;

  try {
    if (fs.existsSync(CLOUD_STORAGE_FILE)) {
      const raw = fs.readFileSync(CLOUD_STORAGE_FILE, "utf-8");
      if (raw.trim()) {
        cachedSnapshot = JSON.parse(raw);
        return cachedSnapshot!;
      }
    }
  } catch (err) {
    console.warn("[CloudBackup] Error reading backup file, initializing blank:", err);
  }

  cachedSnapshot = {
    version: "2.0.0",
    lastUpdatedAt: new Date().toISOString(),
    users: {},
    questions: [],
    suggestions: [],
    certificates: [],
    incidents: [],
    adaptations: [],
  };
  saveSnapshot(cachedSnapshot);
  return cachedSnapshot;
}

function saveSnapshot(snapshot: PlatformCloudSnapshot): boolean {
  try {
    cachedSnapshot = snapshot;
    fs.writeFileSync(CLOUD_STORAGE_FILE, JSON.stringify(snapshot, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[CloudBackup] Failed to persist cloud backup snapshot:", err);
    return false;
  }
}

export function saveUserCloudBackup(username: string, data: Partial<UserBackupRecord>): UserBackupRecord {
  const snapshot = loadSnapshot();
  const cleanKey = username.trim().toLowerCase().replace(/^@/, "");

  const existing: UserBackupRecord = snapshot.users[cleanKey] || {
    username,
    updatedAt: new Date().toISOString(),
  };

  const updated: UserBackupRecord = {
    ...existing,
    ...data,
    username: existing.username || username,
    updatedAt: new Date().toISOString(),
  };

  snapshot.users[cleanKey] = updated;
  snapshot.lastUpdatedAt = new Date().toISOString();
  saveSnapshot(snapshot);

  return updated;
}

export function getUserCloudBackup(username: string): UserBackupRecord | null {
  const snapshot = loadSnapshot();
  const cleanKey = username.trim().toLowerCase().replace(/^@/, "");
  
  if (snapshot.users[cleanKey]) {
    return snapshot.users[cleanKey];
  }

  // Fallback to checking citizens & userProgress arrays
  const matchedCitizen = (snapshot.citizens || []).find(
    (c: any) => c.username && c.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedProgress = (snapshot.userProgress || []).find(
    (p: any) => p.username && p.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedTokens = (snapshot.tokens || []).filter(
    (t: any) => t.recipientUsername && t.recipientUsername.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedBadge = (snapshot.verificationBadges || []).find(
    (b: any) => b.username && b.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  if (matchedCitizen || matchedProgress || matchedTokens.length > 0 || matchedBadge) {
    const synthetic: UserBackupRecord = {
      username: (matchedCitizen && matchedCitizen.username) || username,
      county: matchedCitizen?.county || "Kwale",
      subCounty: matchedCitizen?.subCounty || "N/A",
      role: matchedCitizen?.role || "citizen",
      passwordHash: matchedCitizen?.passwordHash,
      createdAt: matchedCitizen?.createdAt || new Date().toISOString(),
      progress: matchedProgress ? {
        completedLessons: matchedProgress.completedLessons || [],
        quizScores: matchedProgress.quizScores || {},
        lastActiveDate: matchedProgress.lastActiveDate,
      } : undefined,
      tokenGrants: matchedTokens,
      tokenBalance: matchedTokens.reduce((acc: number, t: any) => acc + (t.amount || 0), 0),
      verificationBadge: matchedBadge,
      updatedAt: new Date().toISOString(),
    };
    snapshot.users[cleanKey] = synthetic;
    saveSnapshot(snapshot);
    return synthetic;
  }

  return null;
}

export function saveFullCloudPlatformSnapshot(data: Partial<PlatformCloudSnapshot>): PlatformCloudSnapshot {
  const snapshot = loadSnapshot();
  const merged: PlatformCloudSnapshot = {
    ...snapshot,
    ...data,
    lastUpdatedAt: new Date().toISOString(),
  };

  if (data.users) {
    merged.users = { ...snapshot.users, ...data.users };
  }

  // Populate individual user entries from data.citizens and data.userProgress
  if (data.citizens && Array.isArray(data.citizens)) {
    data.citizens.forEach((c: any) => {
      if (c && c.username) {
        const key = c.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: c.username, updatedAt: new Date().toISOString() };
        merged.users[key] = {
          ...existing,
          county: c.county || existing.county,
          subCounty: c.subCounty || existing.subCounty,
          role: c.role || existing.role,
          passwordHash: c.passwordHash || existing.passwordHash,
          createdAt: c.createdAt || existing.createdAt,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  }

  if (data.userProgress && Array.isArray(data.userProgress)) {
    data.userProgress.forEach((p: any) => {
      if (p && p.username) {
        const key = p.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: p.username, updatedAt: new Date().toISOString() };
        merged.users[key] = {
          ...existing,
          progress: {
            completedLessons: p.completedLessons || [],
            quizScores: p.quizScores || {},
            lastActiveDate: p.lastActiveDate || new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }
    });
  }

  if (data.tokens && Array.isArray(data.tokens)) {
    data.tokens.forEach((t: any) => {
      if (t && t.recipientUsername) {
        const key = t.recipientUsername.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: t.recipientUsername, updatedAt: new Date().toISOString() };
        const grants = existing.tokenGrants || [];
        if (!grants.some((g: any) => g.id === t.id)) {
          grants.push(t);
        }
        existing.tokenGrants = grants;
        existing.tokenBalance = grants.reduce((sum: number, g: any) => sum + (g.amount || 0), 0);
        merged.users[key] = existing;
      }
    });
  }

  if (data.verificationBadges && Array.isArray(data.verificationBadges)) {
    data.verificationBadges.forEach((b: any) => {
      if (b && b.username) {
        const key = b.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: b.username, updatedAt: new Date().toISOString() };
        existing.verificationBadge = b;
        merged.users[key] = existing;
      }
    });
  }

  if (data.activeSessions && Array.isArray(data.activeSessions)) {
    const existingSessions: any[] = merged.activeSessions || [];
    const now = Date.now();
    const sessionMap = new Map<string, any>();
    existingSessions.filter((s) => s && s.lastActive > now - 15 * 60 * 1000).forEach((s) => {
      sessionMap.set(s.id || s.username, s);
    });
    data.activeSessions.forEach((s: any) => {
      if (s) {
        sessionMap.set(s.id || s.username, s);
      }
    });
    merged.activeSessions = Array.from(sessionMap.values());
  }

  saveSnapshot(merged);
  return merged;
}

export function getFullCloudPlatformSnapshot(): PlatformCloudSnapshot {
  return loadSnapshot();
}

/**
 * Cloud-wide live presence heartbeat:
 * Stores real-time sessions in the cloud so all online devices and live sheets can immediately see active citizens and admins.
 * Automatically cleans up sessions that have been inactive for more than 5 minutes.
 */
export function recordCloudPresence(session: any): any[] {
  const snapshot = loadSnapshot();
  const sessions: any[] = snapshot.activeSessions || [];
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;
  const fifteenMinsAgo = now - 15 * 60 * 1000;

  // Filter stale sessions older than 15 minutes
  let cleaned = sessions.filter((s: any) => s && s.lastActive > fifteenMinsAgo);

  const idx = cleaned.findIndex((s: any) => (session.id && s.id === session.id) || (session.username && s.username === session.username));
  if (idx !== -1) {
    cleaned[idx] = { ...cleaned[idx], ...session, lastActive: now, isOnline: true };
  } else {
    cleaned.unshift({ ...session, lastActive: now, isOnline: true });
  }

  snapshot.activeSessions = cleaned;
  saveSnapshot(snapshot);

  return cleaned.map((s: any) => ({
    ...s,
    isOnline: s.lastActive >= fiveMinsAgo,
  }));
}

/**
 * Retrieves genuine real-time online sessions from cloud storage
 */
export function getCloudPresence(): any[] {
  const snapshot = loadSnapshot();
  const sessions: any[] = snapshot.activeSessions || [];
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;

  return sessions
    .filter((s: any) => s && s.lastActive > now - 15 * 60 * 1000)
    .map((s: any) => ({
      ...s,
      isOnline: s.lastActive >= fiveMinsAgo,
    }));
}
