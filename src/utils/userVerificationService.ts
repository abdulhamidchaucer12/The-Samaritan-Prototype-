import {
  UserVerificationRecord,
  VerificationRequest,
  VerificationBadgeTier,
} from '../types';
import { getUserProgress } from './storage';
import { getUserTokenBalance } from './facilitatorTokenRegistry';
import { sendDirectUserNotification } from './adminManagement';
import { lessonsData } from '../data/lessonsData';

export const USER_VERIFICATIONS_KEY = 'the_samaritan_user_verifications_v1';
export const VERIFICATION_REQUESTS_KEY = 'the_samaritan_verification_requests_v1';

// Foundational Course IDs (Must be completed to apply for verification badge)
export const FOUNDATIONAL_COURSE_IDS = [
  'lesson_1',
  'lesson_2',
  'lesson_3',
  'lesson_4',
  'lesson_5',
  'lesson_6',
  'lesson_7',
  'lesson_8',
  'lesson_9',
  'lesson_10',
];

export const REQUIRED_TOKENS_FOR_VERIFICATION = 50;

/**
 * Normalizes username for consistent lookups (lowercased without @ prefix)
 */
export function cleanUsername(username?: string | null): string {
  if (!username) return '';
  return username.trim().toLowerCase().replace(/^@/, '');
}

/**
 * Retrieves all verified users from persistent storage
 */
export function getAllVerifiedUsers(): UserVerificationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_VERIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load user verifications:', err);
    return [];
  }
}

function saveVerifiedUsers(list: UserVerificationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_VERIFICATIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('the_samaritan_verifications_updated'));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_names_updated'));
  } catch (err) {
    console.error('Failed to save user verifications:', err);
  }
}

/**
 * Looks up a user's verification badge record
 */
export function getUserVerification(username?: string | null): UserVerificationRecord | null {
  if (!username) return null;
  const clean = cleanUsername(username);
  if (!clean) return null;
  const all = getAllVerifiedUsers();
  return all.find((v) => cleanUsername(v.username) === clean) || null;
}

/**
 * Directly verifies any user to receive a verification badge (single or double tick).
 * The Samaritan can verify any user without requiring them to be an admin or meet any other parameters.
 */
export function verifyUser(
  username: string,
  badgeTier: VerificationBadgeTier,
  options?: {
    verifiedBy?: string;
    badgeTitleEn?: string;
    badgeTitleSw?: string;
    notes?: string;
    source?: 'direct_admin_action' | 'request_granted' | 'merit_graduate';
  }
): { success: boolean; message: string; record?: UserVerificationRecord } {
  const clean = cleanUsername(username);
  if (!clean) {
    return { success: false, message: 'Please provide a valid username.' };
  }

  const verifiedBy = options?.verifiedBy || 'The_Samaritan';
  const source = options?.source || 'direct_admin_action';
  const displayUsername = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;

  const defaultTitleEn =
    badgeTier === 'double_tick'
      ? 'Verified Civic Scholar (Double Ticks)'
      : 'Verified Citizen (Single Tick)';

  const defaultTitleSw =
    badgeTier === 'double_tick'
      ? 'Msomi wa Uraia Aliyethibitishwa (Mihuri Miwili)'
      : 'Mwananchi Aliyethibitishwa (Mhuri Mmoja)';

  const all = getAllVerifiedUsers();
  const existingIndex = all.findIndex((v) => cleanUsername(v.username) === clean);

  const newRecord: UserVerificationRecord = {
    id: `verif_${clean}_${Date.now()}`,
    username: clean,
    displayUsername,
    badgeTier,
    verifiedBy,
    verifiedAt: new Date().toISOString(),
    badgeTitleEn: options?.badgeTitleEn?.trim() || defaultTitleEn,
    badgeTitleSw: options?.badgeTitleSw?.trim() || defaultTitleSw,
    notes: options?.notes?.trim() || (source === 'direct_admin_action' ? 'Executive verification granted directly by The_Samaritan.' : 'Civic verification request approved.'),
    source,
  };

  if (existingIndex >= 0) {
    all[existingIndex] = newRecord;
  } else {
    all.unshift(newRecord);
  }

  saveVerifiedUsers(all);

  // Send an in-app direct notification to the verified citizen
  const badgeName = badgeTier === 'double_tick' ? 'Double Tick Verified Badge (✓✓)' : 'Single Tick Verified Badge (✓)';
  sendDirectUserNotification(
    clean,
    `Official Civic Verification Granted!`,
    `Congratulations ${displayUsername}! You have been officially verified by The_Samaritan on The Samaritan platform with the ${badgeName}. Your verification status and badge now reflect across all platform discussions, inquiries, and civic activities.`,
    'commendation',
    verifiedBy
  );

  return {
    success: true,
    message: `Successfully verified ${displayUsername} with the ${badgeTier === 'double_tick' ? 'Double Ticks' : 'Single Tick'} badge!`,
    record: newRecord,
  };
}

/**
 * Revokes a user's verification badge
 */
export function revokeVerification(
  username: string,
  revokedBy: string = 'The_Samaritan'
): { success: boolean; message: string } {
  const clean = cleanUsername(username);
  if (!clean) {
    return { success: false, message: 'Invalid username.' };
  }

  const all = getAllVerifiedUsers();
  const filtered = all.filter((v) => cleanUsername(v.username) !== clean);

  if (filtered.length === all.length) {
    return { success: false, message: `User @${clean} does not hold an active verification badge.` };
  }

  saveVerifiedUsers(filtered);

  // Send notification to the user
  sendDirectUserNotification(
    clean,
    'Verification Status Update',
    `Your verification badge has been revoked or modified by ${revokedBy}. Contact platform administration if you believe this was an error.`,
    'notice',
    revokedBy
  );

  return {
    success: true,
    message: `Verification badge revoked for @${clean}.`,
  };
}

/**
 * Updates an existing verified user's tier (e.g. switch between single_tick and double_tick)
 */
export function updateVerificationTier(
  username: string,
  newTier: VerificationBadgeTier,
  updatedBy: string = 'The_Samaritan'
): { success: boolean; message: string } {
  const clean = cleanUsername(username);
  const existing = getUserVerification(clean);
  if (!existing) {
    return verifyUser(username, newTier, { verifiedBy: updatedBy });
  }

  existing.badgeTier = newTier;
  existing.verifiedBy = updatedBy;
  existing.verifiedAt = new Date().toISOString();
  if (newTier === 'double_tick') {
    existing.badgeTitleEn = 'Verified Civic Scholar (Double Ticks)';
    existing.badgeTitleSw = 'Msomi wa Uraia Aliyethibitishwa (Mihuri Miwili)';
  } else {
    existing.badgeTitleEn = 'Verified Citizen (Single Tick)';
    existing.badgeTitleSw = 'Mwananchi Aliyethibitishwa (Mhuri Mmoja)';
  }

  const all = getAllVerifiedUsers().map((v) => (cleanUsername(v.username) === clean ? existing : v));
  saveVerifiedUsers(all);

  return {
    success: true,
    message: `Updated verification badge for @${clean} to ${newTier === 'double_tick' ? 'Double Ticks' : 'Single Tick'}.`,
  };
}

// ---------------- User Verification Requests ---------------- //

export function getAllVerificationRequests(): VerificationRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VERIFICATION_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load verification requests:', err);
    return [];
  }
}

function saveVerificationRequests(list: VerificationRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VERIFICATION_REQUESTS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('the_samaritan_verifications_updated'));
  } catch (err) {
    console.error('Failed to save verification requests:', err);
  }
}

/**
 * Checks whether a user meets the strict requirements to apply for a verification badge:
 * 1. Must have finished all 10 foundational civic courses
 * 2. Must hold at least 50 tokens
 */
export function checkVerificationEligibility(username?: string | null): {
  eligible: boolean;
  foundationalCount: number;
  totalFoundational: number;
  tokenBalance: number;
  tokensRequired: number;
  missingCourseIds: string[];
  reasons: string[];
} {
  const clean = cleanUsername(username);
  const totalFoundational = FOUNDATIONAL_COURSE_IDS.length; // 10

  if (!clean) {
    return {
      eligible: false,
      foundationalCount: 0,
      totalFoundational,
      tokenBalance: 0,
      tokensRequired: REQUIRED_TOKENS_FOR_VERIFICATION,
      missingCourseIds: FOUNDATIONAL_COURSE_IDS,
      reasons: ['User is not logged in.'],
    };
  }

  const progress = getUserProgress(clean);
  const completedSet = new Set(progress.completedLessons || []);
  const missingCourseIds = FOUNDATIONAL_COURSE_IDS.filter((id) => !completedSet.has(id));
  const foundationalCount = totalFoundational - missingCourseIds.length;

  const balance = getUserTokenBalance(clean);
  const tokenBalance = balance.availableBalance;

  const reasons: string[] = [];
  if (foundationalCount < totalFoundational) {
    reasons.push(
      `You have completed ${foundationalCount} of the 10 foundational civic courses. Complete all 10 foundational courses to qualify.`
    );
  }

  if (tokenBalance < REQUIRED_TOKENS_FOR_VERIFICATION) {
    reasons.push(
      `You currently have ${tokenBalance} tokens. A minimum of ${REQUIRED_TOKENS_FOR_VERIFICATION} tokens is required to request verification.`
    );
  }

  const eligible = foundationalCount >= totalFoundational && tokenBalance >= REQUIRED_TOKENS_FOR_VERIFICATION;

  return {
    eligible,
    foundationalCount,
    totalFoundational,
    tokenBalance,
    tokensRequired: REQUIRED_TOKENS_FOR_VERIFICATION,
    missingCourseIds,
    reasons,
  };
}

/**
 * Retrieves a user's pending request if one exists
 */
export function getUserPendingRequest(username?: string | null): VerificationRequest | null {
  const clean = cleanUsername(username);
  if (!clean) return null;
  const requests = getAllVerificationRequests();
  return requests.find((r) => cleanUsername(r.username) === clean && r.status === 'pending') || null;
}

/**
 * Retrieves a user's latest verification request (any status)
 */
export function getUserLatestRequest(username?: string | null): VerificationRequest | null {
  const clean = cleanUsername(username);
  if (!clean) return null;
  const requests = getAllVerificationRequests();
  return requests.find((r) => cleanUsername(r.username) === clean) || null;
}

/**
 * Submits a citizen's request for verification badge
 */
export function submitVerificationRequest(
  username: string,
  requestedTier: VerificationBadgeTier,
  userNote?: string
): { success: boolean; message: string; request?: VerificationRequest } {
  const clean = cleanUsername(username);
  if (!clean) {
    return { success: false, message: 'Please log in to submit a verification request.' };
  }

  // 1. Verify eligibility (10 foundational courses + 50 tokens)
  const eligibility = checkVerificationEligibility(clean);
  if (!eligibility.eligible) {
    return {
      success: false,
      message: eligibility.reasons.join(' '),
    };
  }

  // 2. Check if a request is already pending
  const existingPending = getUserPendingRequest(clean);
  if (existingPending) {
    return {
      success: false,
      message: 'You already have a verification request pending executive review by The_Samaritan.',
    };
  }

  const displayUsername = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;
  const allRequests = getAllVerificationRequests();

  const newRequest: VerificationRequest = {
    id: `req_${clean}_${Date.now()}`,
    username: clean,
    displayUsername,
    requestedTier,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    foundationalCoursesCompleted: eligibility.foundationalCount,
    tokenBalanceAtRequest: eligibility.tokenBalance,
    userNote: userNote?.trim() || undefined,
  };

  allRequests.unshift(newRequest);
  saveVerificationRequests(allRequests);

  // Notify The_Samaritan about the incoming request
  sendDirectUserNotification(
    'The_Samaritan',
    `New Citizen Verification Request: ${displayUsername}`,
    `${displayUsername} has completed all 10 foundational civic courses and holds ${eligibility.tokenBalance} tokens. They have requested the ${requestedTier === 'double_tick' ? 'Double Tick' : 'Single Tick'} Verification Badge. Check The Samaritan Console to grant or deny.`,
    'notice',
    displayUsername
  );

  return {
    success: true,
    message: 'Your verification badge request has been successfully submitted to The_Samaritan for review!',
    request: newRequest,
  };
}

/**
 * The_Samaritan grants a citizen's verification request
 */
export function grantVerificationRequest(
  requestId: string,
  grantedTier: VerificationBadgeTier,
  reviewer: string = 'The_Samaritan',
  decisionNote?: string
): { success: boolean; message: string } {
  const allRequests = getAllVerificationRequests();
  const request = allRequests.find((r) => r.id === requestId);

  if (!request) {
    return { success: false, message: 'Verification request not found.' };
  }

  request.status = 'granted';
  request.grantedTier = grantedTier;
  request.reviewedBy = reviewer;
  request.reviewedAt = new Date().toISOString();
  request.decisionReason = decisionNote || 'Civic qualifications and community merit verified.';

  saveVerificationRequests(allRequests);

  // Apply the verification
  const verifyRes = verifyUser(request.username, grantedTier, {
    verifiedBy: reviewer,
    notes: decisionNote || `Granted from civic application on ${new Date().toLocaleDateString()}`,
    source: 'request_granted',
  });

  return {
    success: true,
    message: `Verification request granted! ${request.displayUsername} has received the ${grantedTier === 'double_tick' ? 'Double Ticks' : 'Single Tick'} badge.`,
  };
}

/**
 * The_Samaritan denies a citizen's verification request
 */
export function denyVerificationRequest(
  requestId: string,
  reason: string = 'Verification requirements or community activity could not be confirmed at this time.',
  reviewer: string = 'The_Samaritan'
): { success: boolean; message: string } {
  const allRequests = getAllVerificationRequests();
  const request = allRequests.find((r) => r.id === requestId);

  if (!request) {
    return { success: false, message: 'Verification request not found.' };
  }

  request.status = 'denied';
  request.reviewedBy = reviewer;
  request.reviewedAt = new Date().toISOString();
  request.decisionReason = reason;

  saveVerificationRequests(allRequests);

  // Notify the citizen with polite guidance
  sendDirectUserNotification(
    request.username,
    'Verification Application Decision',
    `Your verification badge request was reviewed by ${reviewer}. At this time, it was not approved: "${reason}". You may continue participating in civic courses and re-apply once ready.`,
    'notice',
    reviewer
  );

  return {
    success: true,
    message: `Verification request for ${request.displayUsername} has been marked as denied.`,
  };
}
