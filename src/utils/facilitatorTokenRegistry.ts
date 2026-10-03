import {
  FacilitatorTokenGrant,
  FacilitatorTrainingCertificate,
  SamaritanTreasuryState,
  TokenExpenditure,
} from '../types';
import { sendDirectUserNotification } from './adminManagement';

const TOKENS_STORAGE_KEY = 'the_samaritan_facilitator_tokens_v1';
const REDEEMED_CERTS_KEY = 'the_samaritan_facilitator_certs_v1';
const TOKEN_EXPENDITURES_KEY = 'the_samaritan_token_expenditures_v1';
const COURSE_QUIZ_TOKEN_REWARDS_KEY = 'the_samaritan_course_quiz_token_rewards_v1';
export const SAMARITAN_QUOTA_STORAGE_KEY = 'the_samaritan_annual_quota_v1';

export const SAMARITAN_ANNUAL_QUOTA = 30_000_000;

// Empty for real user testing: No seeded dummy grants
const INITIAL_GRANTS: FacilitatorTokenGrant[] = [];

const DUMMY_GRANT_IDS = new Set(['tok_init_1', 'tok_init_2', 'tok_init_3', 'tok_init_4']);

/**
 * Ensures The_Samaritan automatically possesses 30,000,000 tokens
 * that automatically renew every single calendar year (on Jan 1st or when year rolls over).
 */
export function getSamaritanTreasury(forceReset = false): SamaritanTreasuryState {
  if (typeof window === 'undefined') {
    const currentYear = new Date().getFullYear();
    return {
      year: currentYear,
      initialQuota: SAMARITAN_ANNUAL_QUOTA,
      balance: SAMARITAN_ANNUAL_QUOTA,
      totalAllocatedThisYear: 0,
      lastRenewedAt: new Date().toISOString(),
      nextRenewalDate: new Date(currentYear + 1, 0, 1).toISOString(),
      isUnlimitedAuthority: true,
    };
  }

  const currentYear = new Date().getFullYear();
  try {
    const raw = localStorage.getItem(SAMARITAN_QUOTA_STORAGE_KEY);
    if (raw && !forceReset) {
      const state: SamaritanTreasuryState = JSON.parse(raw);
      // Auto-renewal check: if calendar year has elapsed, automatically replenish with 30,000,000 tokens!
      if (state.year < currentYear) {
        const renewedState: SamaritanTreasuryState = {
          year: currentYear,
          initialQuota: SAMARITAN_ANNUAL_QUOTA,
          balance: SAMARITAN_ANNUAL_QUOTA,
          totalAllocatedThisYear: 0,
          lastRenewedAt: new Date().toISOString(),
          nextRenewalDate: new Date(currentYear + 1, 0, 1).toISOString(),
          isUnlimitedAuthority: true,
        };
        localStorage.setItem(SAMARITAN_QUOTA_STORAGE_KEY, JSON.stringify(renewedState));
        window.dispatchEvent(new CustomEvent('the_samaritan_treasury_renewed', { detail: renewedState }));
        return renewedState;
      }
      return state;
    }
  } catch (err) {
    console.error('Error reading Samaritan treasury:', err);
  }

  // Initialize fresh annual quota of 30,000,000 tokens
  const nextRenewalDate = new Date(currentYear + 1, 0, 1).toISOString();
  const freshState: SamaritanTreasuryState = {
    year: currentYear,
    initialQuota: SAMARITAN_ANNUAL_QUOTA,
    balance: SAMARITAN_ANNUAL_QUOTA,
    totalAllocatedThisYear: 0,
    lastRenewedAt: new Date().toISOString(),
    nextRenewalDate,
    isUnlimitedAuthority: true,
  };
  try {
    localStorage.setItem(SAMARITAN_QUOTA_STORAGE_KEY, JSON.stringify(freshState));
  } catch {
    // fallback
  }
  return freshState;
}

/**
 * Deducts allocated tokens from The_Samaritan's annual treasury.
 * As supreme authority, The_Samaritan has UNLIMITED allocation authority.
 */
function recordSamaritanAllocation(amount: number): SamaritanTreasuryState {
  const current = getSamaritanTreasury();
  const newAllocated = (current.totalAllocatedThisYear || 0) + amount;
  // If allocation exceeds standard 30M, The_Samaritan's unlimited executive authority
  // transparently authorizes supplementary reserve allocations while maintaining positive ledger balance.
  const newBalance = Math.max(0, current.balance - amount);

  const updated: SamaritanTreasuryState = {
    ...current,
    balance: newBalance,
    totalAllocatedThisYear: newAllocated,
    isUnlimitedAuthority: true,
  };

  try {
    localStorage.setItem(SAMARITAN_QUOTA_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('the_samaritan_treasury_updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to update Samaritan treasury:', err);
  }

  return updated;
}

export function getAllTokenGrants(): FacilitatorTokenGrant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TOKENS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const list: FacilitatorTokenGrant[] = JSON.parse(raw);
    const filtered = list.filter((g) => !DUMMY_GRANT_IDS.has(g.id));
    if (filtered.length !== list.length) {
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch {
    return [];
  }
}

export function saveTokenGrants(grants: FacilitatorTokenGrant[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(grants));
    window.dispatchEvent(new CustomEvent('the_samaritan_tokens_updated'));
  } catch (err) {
    console.error('Failed to save tokens:', err);
  }
}

/**
 * Award tokens to any user or admin.
 * The_Samaritan account possesses UNLIMITED token allocation authority to other users.
 */
export function awardTokensToUser(
  recipientUsername: string,
  amount: number,
  reason: string,
  trainingBatch: string = 'Samaritan Physical Trainings',
  grantedBy: string = 'The_Samaritan'
): { success: boolean; message: string; grant?: FacilitatorTokenGrant; treasury?: SamaritanTreasuryState } {
  const cleanUsername = recipientUsername.trim();
  if (!cleanUsername) {
    return { success: false, message: 'Recipient username is required.' };
  }
  if (!amount || amount <= 0) {
    return { success: false, message: 'Token amount must be greater than zero.' };
  }

  // Deduct/record against The_Samaritan's annual treasury (with unlimited authority)
  const treasury = recordSamaritanAllocation(amount);

  const grants = getAllTokenGrants();
  const newGrant: FacilitatorTokenGrant = {
    id: 'grant_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    recipientUsername: cleanUsername,
    amount,
    reason: reason.trim() || 'Exemplary civic participation and baraza physical training attendance',
    grantedBy: 'The_Samaritan',
    grantedAt: new Date().toISOString(),
    trainingBatch: trainingBatch.trim(),
  };

  grants.unshift(newGrant);
  saveTokenGrants(grants);

  return {
    success: true,
    message: `[The_Samaritan Unlimited Grant] Successfully allocated ${amount.toLocaleString()} Samaritan Facilitator Token(s) to ${cleanUsername}.`,
    grant: newGrant,
    treasury,
  };
}

// ---------------- Token Expenditures & Ledger ---------------- //

export function getAllTokenExpenditures(): TokenExpenditure[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TOKEN_EXPENDITURES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTokenExpenditures(expenditures: TokenExpenditure[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_EXPENDITURES_KEY, JSON.stringify(expenditures));
    window.dispatchEvent(new CustomEvent('the_samaritan_tokens_updated'));
  } catch (err) {
    console.error('Failed to save token expenditures:', err);
  }
}

export function getUserTokenBalance(username?: string | null): {
  totalAwarded: number;
  totalRedeemed: number;
  availableBalance: number;
  grants: FacilitatorTokenGrant[];
  expenditures: TokenExpenditure[];
  isUnlimitedAuthority?: boolean;
  annualQuota?: number;
  nextRenewalDate?: string;
} {
  if (!username) {
    return {
      totalAwarded: 0,
      totalRedeemed: 0,
      availableBalance: 0,
      grants: [],
      expenditures: [],
    };
  }
  const clean = username.trim().toLowerCase().replace(/^@/, '');

  // Special handling for The_Samaritan account: holds 30,000,000 annual tokens auto-renewing yearly!
  if (clean === 'the_samaritan') {
    const treasury = getSamaritanTreasury();
    const allGrants = getAllTokenGrants();
    const samaritanGrants = allGrants.filter(
      (g) => g.recipientUsername.toLowerCase().replace(/^@/, '') === 'the_samaritan'
    );
    const allExp = getAllTokenExpenditures();
    const samaritanExp = allExp.filter(
      (e) => e.username.toLowerCase().replace(/^@/, '') === 'the_samaritan'
    );

    return {
      totalAwarded: SAMARITAN_ANNUAL_QUOTA + (treasury.totalAllocatedThisYear || 0),
      totalRedeemed: 0,
      availableBalance: treasury.balance,
      grants: samaritanGrants,
      expenditures: samaritanExp,
      isUnlimitedAuthority: true,
      annualQuota: SAMARITAN_ANNUAL_QUOTA,
      nextRenewalDate: treasury.nextRenewalDate,
    };
  }

  const allGrants = getAllTokenGrants();
  const userGrants = allGrants.filter(
    (g) => g.recipientUsername.toLowerCase().replace(/^@/, '') === clean
  );
  const totalAwarded = userGrants.reduce((acc, g) => acc + g.amount, 0);

  // Certificates redeemed
  const certs = getAllFacilitatorCertificates();
  const userCerts = certs.filter(
    (c) => c.recipientUsername.toLowerCase().replace(/^@/, '') === clean
  );
  const totalRedeemedCerts = userCerts.reduce((acc, c) => acc + c.tokensRedeemed, 0);

  // Other expenditures (peer transfers out)
  const allExp = getAllTokenExpenditures();
  const userExp = allExp.filter(
    (e) => e.username.toLowerCase().replace(/^@/, '') === clean
  );
  const totalOtherExp = userExp.reduce((acc, e) => acc + e.amount, 0);

  const totalRedeemed = totalRedeemedCerts + totalOtherExp;
  const availableBalance = Math.max(0, totalAwarded - totalRedeemed);

  return {
    totalAwarded,
    totalRedeemed,
    availableBalance,
    grants: userGrants,
    expenditures: userExp,
  };
}

/**
 * Transfers tokens from one user to another.
 * Sends an immediate in-app notification to the recipient explicitly
 * revealing who the tokens were received from!
 */
export function transferTokensBetweenUsers(
  senderUsername: string,
  recipientUsername: string,
  amount: number,
  note?: string
): { success: boolean; message: string; grant?: FacilitatorTokenGrant } {
  const cleanSender = senderUsername.trim().replace(/^@/, '');
  const cleanRecipient = recipientUsername.trim().replace(/^@/, '');

  if (!cleanSender || !cleanRecipient) {
    return { success: false, message: 'Both sender and recipient usernames are required.' };
  }

  if (cleanSender.toLowerCase() === cleanRecipient.toLowerCase()) {
    return { success: false, message: 'You cannot transfer tokens to yourself.' };
  }

  const intAmount = Math.floor(amount);
  if (isNaN(intAmount) || intAmount <= 0) {
    return { success: false, message: 'Token transfer amount must be at least 1 token.' };
  }

  const senderBalance = getUserTokenBalance(cleanSender);
  const isSamaritan = cleanSender.toLowerCase() === 'the_samaritan';

  if (!isSamaritan && senderBalance.availableBalance < intAmount) {
    return {
      success: false,
      message: `Insufficient tokens. Your available balance is ${senderBalance.availableBalance} token(s), but you tried to send ${intAmount}.`,
    };
  }

  // 1. Deduct tokens from sender by recording an expenditure
  const allExp = getAllTokenExpenditures();
  const newExp: TokenExpenditure = {
    id: 'exp_xfer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username: cleanSender,
    amount: intAmount,
    type: 'transfer_out',
    description: `Transferred ${intAmount} token(s) to @${cleanRecipient}`,
    metadata: {
      recipientUsername: cleanRecipient,
      note: note?.trim(),
    },
    timestamp: new Date().toISOString(),
  };
  allExp.unshift(newExp);
  saveTokenExpenditures(allExp);

  // If sender is The_Samaritan, also record allocation against treasury
  if (isSamaritan) {
    recordSamaritanAllocation(intAmount);
  }

  // 2. Grant tokens to recipient (explicitly naming sender in grantedBy)
  const allGrants = getAllTokenGrants();
  const newGrant: FacilitatorTokenGrant = {
    id: 'grant_peer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    recipientUsername: cleanRecipient,
    amount: intAmount,
    reason: note?.trim()
      ? `Token gift from @${cleanSender}: "${note.trim()}"`
      : `Token gift from fellow citizen @${cleanSender}`,
    grantedBy: cleanSender,
    grantedAt: new Date().toISOString(),
    trainingBatch: 'Peer Civic Token Share',
  };
  allGrants.unshift(newGrant);
  saveTokenGrants(allGrants);

  // 3. Send direct in-app notification to the recipient letting them know WHO sent it!
  const notifNote = note?.trim() ? ` Message from sender: "${note.trim()}".` : '';
  sendDirectUserNotification(
    cleanRecipient,
    `Tokens Received from @${cleanSender}`,
    `You have received ${intAmount} Samaritan Facilitator Token(s) from @${cleanSender}.${notifNote} You can use these tokens to share with peers or redeem facilitator certificates!`,
    'commendation',
    cleanSender
  );

  window.dispatchEvent(
    new CustomEvent('the_samaritan_token_transferred', {
      detail: { sender: cleanSender, recipient: cleanRecipient, amount: intAmount },
    })
  );

  return {
    success: true,
    message: `Successfully transferred ${intAmount} token(s) to @${cleanRecipient}. They have been notified immediately.`,
    grant: newGrant,
  };
}

// ---------------- Course Quiz 80%+ Score 5-Token Automatic Reward ---------------- //

function getAllCourseQuizTokenRewardRecords(): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COURSE_QUIZ_TOKEN_REWARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function hasUserEarnedQuizTokensForCourse(username: string, courseId: string): boolean {
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  const records = getAllCourseQuizTokenRewardRecords();
  return (records[clean] || []).includes(courseId);
}

/**
 * Automatically grants 5 tokens for completing a course quiz with 80% or more score!
 */
export function awardTokensForCourseQuizCompletion(
  username: string,
  courseId: string,
  courseTitle: string,
  scorePercent: number
): {
  success: boolean;
  alreadyAwarded: boolean;
  tokens: number;
  message: string;
} {
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  if (scorePercent < 80) {
    return {
      success: false,
      alreadyAwarded: false,
      tokens: 0,
      message: `Score of ${scorePercent}% does not reach the 80% threshold required for automatic token grant.`,
    };
  }

  if (hasUserEarnedQuizTokensForCourse(clean, courseId)) {
    return {
      success: false,
      alreadyAwarded: true,
      tokens: 0,
      message: 'You have already collected your 5 completion tokens for this course.',
    };
  }

  // Grant 5 tokens
  const allGrants = getAllTokenGrants();
  const newGrant: FacilitatorTokenGrant = {
    id: 'grant_quiz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    recipientUsername: clean,
    amount: 5,
    reason: `Course Quiz Merit (${scorePercent}%): ${courseTitle}`,
    grantedBy: 'The_Samaritan',
    grantedAt: new Date().toISOString(),
    trainingBatch: 'Curriculum Quiz Excellence',
  };
  allGrants.unshift(newGrant);
  saveTokenGrants(allGrants);

  // Save record in completed quiz token registry
  const records = getAllCourseQuizTokenRewardRecords();
  if (!records[clean]) {
    records[clean] = [];
  }
  records[clean].push(courseId);
  try {
    localStorage.setItem(COURSE_QUIZ_TOKEN_REWARDS_KEY, JSON.stringify(records));
  } catch (err) {}

  // Send direct congratulatory notification from The_Samaritan
  sendDirectUserNotification(
    clean,
    '🏆 5 Tokens Earned: Course Quiz Excellence',
    `Congratulations! You completed "${courseTitle}" with a distinction score of ${scorePercent}% (>= 80%) and automatically earned 5 Samaritan Facilitator Tokens. You can now use them to redeem training certificates or share with fellow citizens!`,
    'commendation',
    'The_Samaritan'
  );

  return {
    success: true,
    alreadyAwarded: false,
    tokens: 5,
    message: `Outstanding! You achieved ${scorePercent}% and automatically earned 5 Samaritan Facilitator Tokens.`,
  };
}

// ---------------- Facilitator Physical Training Certificates ---------------- //

export function getAllFacilitatorCertificates(): FacilitatorTrainingCertificate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REDEEMED_CERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFacilitatorCertificates(certs: FacilitatorTrainingCertificate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REDEEMED_CERTS_KEY, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent('the_samaritan_facilitator_certs_updated'));
  } catch (err) {
    console.error('Failed to save facilitator certs:', err);
  }
}

export const TOKENS_REQUIRED_FOR_FACILITATOR_CERT = 5;

export function redeemTokensForFacilitatorCert(
  username: string,
  fullName: string,
  trainingTopic: string = 'Civic Education & Community Baraza Facilitation (Samaritan Physical Training)',
  location: string = 'Kwale County Civic Empowerment Centre'
): { success: boolean; message: string; certificate?: FacilitatorTrainingCertificate } {
  const balance = getUserTokenBalance(username);
  if (balance.availableBalance < TOKENS_REQUIRED_FOR_FACILITATOR_CERT) {
    return {
      success: false,
      message: `Insufficient tokens. You have ${balance.availableBalance} tokens, but ${TOKENS_REQUIRED_FOR_FACILITATOR_CERT} tokens are required for the Physical Training Facilitator Certificate.`,
    };
  }

  const cleanName = fullName.trim() || username;
  const certs = getAllFacilitatorCertificates();
  const randomSerial = Math.floor(100000 + Math.random() * 900000);
  const serial = `SAM-FACILITATOR-${new Date().getFullYear()}-${randomSerial}`;

  const newCert: FacilitatorTrainingCertificate = {
    id: 'fcert_' + Date.now(),
    serialNumber: serial,
    recipientUsername: username,
    recipientFullName: cleanName,
    tokensRedeemed: TOKENS_REQUIRED_FOR_FACILITATOR_CERT,
    issuedAt: new Date().toISOString(),
    trainingTopic,
    authorizedBy: 'Abdulhamid Chaucer (The Samaritan Lead Developer & Facilitator)',
    location,
    status: 'active',
  };

  certs.unshift(newCert);
  saveFacilitatorCertificates(certs);

  return {
    success: true,
    message: `Congratulations! ${TOKENS_REQUIRED_FOR_FACILITATOR_CERT} tokens redeemed. Facilitator Certificate of Physical Training issued with Serial #${serial}.`,
    certificate: newCert,
  };
}
