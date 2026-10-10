/**
 * The Samaritan Platform - User Data Privacy, Data Download, & Profile Deletion Service
 * 
 * Compliant with:
 * - Constitution of Kenya 2010 (Article 31 - Right to Privacy, Article 35 - Access to Information)
 * - Kenya Data Protection Act, No. 24 of 2019 (Sections 25, 26, 32, 34, 40)
 * 
 * Features:
 * 1. Primary Admin Protection:
 *    The 5 primary founding admins (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4, and The_Samaritan)
 *    are immutable institutional custodians and cannot be deleted.
 * 2. Profile & Data Deletion for all other users:
 *    Requires strict confirmation with both username and password.
 *    Completely wipes all personal traces, progress, tokens, verification requests, and session logs.
 * 3. Comprehensive Data Download:
 *    Available for ALL users including all primary and appointed admins.
 *    Exports complete structured JSON file with verified certificate IDs, progress, tokens, and telemetry.
 * 4. Privacy Policy Metadata & Legal Tenets.
 */

import { AuthUser } from '../types';
import {
  getRegisteredUsers,
  getUserCounty,
  getUserSubCounty,
  getUserAvatar,
} from './authAndQuestions';
import { getUserProgress } from './storage';
import { getUserTokenBalance } from './facilitatorTokenRegistry';
import {
  getUserVerification,
  getUserPendingRequest,
  getUserLatestRequest,
} from './userVerificationService';

// The 5 Primary Founding Administrator Handles & Canonical Aliases
export const PRIMARY_ADMIN_ACCOUNTS = [
  '@admin.kfe1',
  'admin.kfe1',
  'admin 1',
  'admin1',
  '@admin.kfe2',
  'admin.kfe2',
  'admin 2',
  'admin2',
  '@admin.kfe3',
  'admin.kfe3',
  'admin 3',
  'admin3',
  '@admin.kfe4',
  'admin.kfe4',
  'admin 4',
  'admin4',
  'the_samaritan',
  '@the_samaritan',
  'the samaritan',
  'thesamaritan',
  'sir chaucer',
] as const;

/**
 * Checks if a given username corresponds to one of the 5 founding primary admins.
 */
export function isPrimaryAdminAccount(username?: string | null): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  return PRIMARY_ADMIN_ACCOUNTS.some((admin) => {
    const adminClean = admin.toLowerCase().replace(/^@/, '');
    return clean === adminClean;
  });
}

export interface UserComprehensiveDataExport {
  exportMetadata: {
    platform: string;
    exportTimestamp: string;
    formatVersion: string;
    legalBasis: string;
    dataController: string;
    dpoContact: string;
  };
  citizenProfile: {
    username: string;
    role: string;
    adminLevel?: string;
    isPrimaryAdmin: boolean;
    county: string;
    subCounty?: string;
    avatarUrl?: string | null;
    createdAt?: string;
    lastActiveDate: string;
  };
  civicEducationProgress: {
    completedLessonsCount: number;
    completedLessonIds: string[];
    quizScores: Record<string, any>;
    courseQuizScores?: Record<string, any>;
    certificatesEarned: Record<string, any>;
    bookmarkedOffices: string[];
    recentlyViewedOffices: string[];
  };
  facilitatorTokensAndCredits: {
    availableBalance: number;
    totalAwarded: number;
    transactionsCount: number;
  };
  civicVerificationStatus: {
    isVerified: boolean;
    badgeTier?: string;
    badgeTitle?: string;
    verifiedBy?: string;
    verifiedAt?: string;
    pendingRequest?: any;
    latestRequest?: any;
  };
  directNotificationsHistory: any[];
  userDailyVisits: {
    streakDays: number;
    totalVisits: number;
    lastVisitDate: string;
  };
  privacyAndDataProtectionRights: {
    article31ConstitutionKenya: string;
    dataProtectionAct2019Compliance: string;
    zeroSellingGuarantee: string;
    rightToErasure: string;
    rightToPortability: string;
  };
}

/**
 * Collects and compiles the comprehensive data packet for any user or admin.
 */
export function buildUserComprehensiveDataPacket(user: AuthUser): UserComprehensiveDataExport {
  const username = user.username;
  const cleanUser = username.trim().toLowerCase().replace(/^@/, '');
  const progress = getUserProgress(username);
  const tokenData = getUserTokenBalance(username);
  const verification = getUserVerification(username);
  const pendingReq = getUserPendingRequest(username);
  const latestReq = getUserLatestRequest(username);

  // Retrieve user direct notifications
  let userNotifs: any[] = [];
  try {
    const rawNotifs = localStorage.getItem('the_samaritan_user_notifications_v1');
    if (rawNotifs) {
      const parsed = JSON.parse(rawNotifs);
      userNotifs = parsed.filter(
        (n: any) =>
          n.targetUsername &&
          n.targetUsername.trim().toLowerCase().replace(/^@/, '') === cleanUser
      );
    }
  } catch (e) {
    // ignore
  }

  // Retrieve login visits
  let dailyVisitData = { streakDays: 1, totalVisits: 1, lastVisitDate: new Date().toISOString() };
  try {
    const rawVisits = localStorage.getItem('the_samaritan_user_daily_logins_v2');
    if (rawVisits) {
      const parsed = JSON.parse(rawVisits);
      if (parsed[cleanUser] || parsed[username]) {
        const item = parsed[cleanUser] || parsed[username];
        dailyVisitData = {
          streakDays: item.streak || 1,
          totalVisits: item.totalLogins || 1,
          lastVisitDate: item.lastLoginDate || new Date().toISOString(),
        };
      }
    }
  } catch (e) {
    // ignore
  }

  const exportPacket: UserComprehensiveDataExport = {
    exportMetadata: {
      platform: 'The Samaritan - Digital Civic Education & Government Literacy Platform',
      exportTimestamp: new Date().toISOString(),
      formatVersion: '2.0.0-PROD',
      legalBasis:
        'Constitution of Kenya 2010 (Article 31 & 35) & Kenya Data Protection Act, No. 24 of 2019 (Sections 26 & 34)',
      dataController: 'Kwale Focus Empowerment CBO (KFE)',
      dpoContact: 'privacy@thesamaritan.ke / executivedirector@thesamaritan.ke',
    },
    citizenProfile: {
      username: user.username,
      role: user.role,
      adminLevel: user.adminLevel,
      isPrimaryAdmin: isPrimaryAdminAccount(user.username),
      county: getUserCounty(user.username) || user.county || 'Kwale County',
      subCounty: getUserSubCounty(user.username) || user.subCounty,
      avatarUrl: getUserAvatar(user.username) || user.avatarUrl,
      createdAt: user.createdAt,
      lastActiveDate: progress.lastActiveDate || new Date().toISOString(),
    },
    civicEducationProgress: {
      completedLessonsCount: progress.completedLessons.length,
      completedLessonIds: progress.completedLessons,
      quizScores: progress.quizScores || {},
      courseQuizScores: progress.courseQuizScores || {},
      certificatesEarned: progress.courseCertificatesEarned || {},
      bookmarkedOffices: progress.bookmarkedOffices || [],
      recentlyViewedOffices: progress.recentlyViewedOffices || [],
    },
    facilitatorTokensAndCredits: {
      availableBalance: tokenData.availableBalance,
      totalAwarded: tokenData.totalAwarded,
      transactionsCount: (tokenData.grants?.length || 0) + (tokenData.expenditures?.length || 0),
    },
    civicVerificationStatus: {
      isVerified: !!verification,
      badgeTier: verification?.badgeTier,
      badgeTitle: verification?.badgeTitleEn,
      verifiedBy: verification?.verifiedBy,
      verifiedAt: verification?.verifiedAt,
      pendingRequest: pendingReq,
      latestRequest: latestReq,
    },
    directNotificationsHistory: userNotifs,
    userDailyVisits: dailyVisitData,
    privacyAndDataProtectionRights: {
      article31ConstitutionKenya:
        'Every citizen has the right to privacy, which includes the right not to have their communications infringed or private affairs unnecessarily disclosed.',
      dataProtectionAct2019Compliance:
        'Personal data is processed strictly for civic education tracking, certification issuance, and grassroots community barazas without external data sharing.',
      zeroSellingGuarantee:
        'The Samaritan strictly guarantees that citizen data is never sold, leased, rented, or transferred to third-party commercial or political entities.',
      rightToErasure:
        'Under Section 40 of the Data Protection Act 2019, citizens may request immediate and permanent erasure of their account and all associated civic records.',
      rightToPortability:
        'Citizens are entitled to receive a structured, machine-readable digital copy of their personal data and certification records at any time.',
    },
  };

  return exportPacket;
}

/**
 * Initiates the client-side download of the comprehensive data JSON file.
 */
export function downloadUserCivicData(user: AuthUser): { success: boolean; filename: string } {
  try {
    const dataPacket = buildUserComprehensiveDataPacket(user);
    const cleanUser = user.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `the_samaritan_data_export_${cleanUser}_${timestampStr}.json`;

    const blob = new Blob([JSON.stringify(dataPacket, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (err) {
    console.error('[UserDataPrivacy] Failed to download data:', err);
    return { success: false, filename: '' };
  }
}

/**
 * Validates credentials and permanently deletes the user's account and all data.
 * The 5 primary admins are strictly excluded.
 */
export function deleteUserAccountAndData(
  currentUser: AuthUser,
  confirmationUsername: string,
  passwordInput: string
): { success: boolean; message: string; requiresLogout?: boolean } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window environment unavailable.' };
  }

  // 1. PRIMARY ADMIN EXCLUSION CHECK
  if (isPrimaryAdminAccount(currentUser.username)) {
    return {
      success: false,
      message:
        'Primary Founding Admin Accounts (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4, and The_Samaritan) cannot be deleted. These foundational administrative credentials are permanently preserved under constitutional governance safeguards.',
    };
  }

  // 2. USERNAME CONFIRMATION CHECK
  const cleanEnteredUser = confirmationUsername.trim().toLowerCase().replace(/^@/, '');
  const cleanCurrentUser = currentUser.username.trim().toLowerCase().replace(/^@/, '');

  if (cleanEnteredUser !== cleanCurrentUser) {
    return {
      success: false,
      message: `The entered username (${confirmationUsername}) does not match your current account handle (${currentUser.username}).`,
    };
  }

  // 3. PASSWORD VERIFICATION CHECK
  const users = getRegisteredUsers();
  const registeredMatch = users.find(
    (u) => u.username.trim().toLowerCase().replace(/^@/, '') === cleanCurrentUser
  );

  let passwordVerified = false;

  if (registeredMatch) {
    if (registeredMatch.passwordHash === passwordInput) {
      passwordVerified = true;
    }
  } else {
    // If not in registered users (e.g. temporary appointee), check admin creds or stored pass
    try {
      const rawCreds = localStorage.getItem('the_samaritan_admin_creds_v1');
      if (rawCreds) {
        const creds = JSON.parse(rawCreds);
        if (
          (creds[currentUser.username]?.passwordHash === passwordInput ||
            creds[`@${currentUser.username}`]?.passwordHash === passwordInput)
        ) {
          passwordVerified = true;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!passwordVerified) {
    return {
      success: false,
      message: 'Incorrect password. Account deletion requires exact password verification.',
    };
  }

  // 4. EXECUTE FULL DATA PURGE
  try {
    // A. Remove from registered users list
    const updatedUsers = users.filter(
      (u) => u.username.trim().toLowerCase().replace(/^@/, '') !== cleanCurrentUser
    );
    localStorage.setItem('the_samaritan_registered_users_v1', JSON.stringify(updatedUsers));

    // B. Remove scoped progress
    localStorage.removeItem(`the_samaritan_progress_v1_u_${cleanCurrentUser}`);

    // C. Remove user avatar
    try {
      const rawAvatars = localStorage.getItem('the_samaritan_user_avatars_v1');
      if (rawAvatars) {
        const avatars = JSON.parse(rawAvatars);
        delete avatars[currentUser.username];
        delete avatars[`@${cleanCurrentUser}`];
        delete avatars[cleanCurrentUser];
        localStorage.setItem('the_samaritan_user_avatars_v1', JSON.stringify(avatars));
      }
    } catch {}

    // D. Remove user county & subcounty
    try {
      const rawCounties = localStorage.getItem('the_samaritan_user_counties_v1');
      if (rawCounties) {
        const counties = JSON.parse(rawCounties);
        delete counties[currentUser.username];
        delete counties[`@${cleanCurrentUser}`];
        delete counties[cleanCurrentUser];
        localStorage.setItem('the_samaritan_user_counties_v1', JSON.stringify(counties));
      }
    } catch {}

    // E. Remove tokens
    try {
      const rawTokens = localStorage.getItem('the_samaritan_facilitator_tokens_v1');
      if (rawTokens) {
        const tokens = JSON.parse(rawTokens);
        delete tokens[currentUser.username];
        delete tokens[`@${cleanCurrentUser}`];
        delete tokens[cleanCurrentUser];
        localStorage.setItem('the_samaritan_facilitator_tokens_v1', JSON.stringify(tokens));
      }
    } catch {}

    // F. Remove verifications & verification requests
    try {
      const rawVerifs = localStorage.getItem('the_samaritan_user_verifications_v1');
      if (rawVerifs) {
        const verifs = JSON.parse(rawVerifs);
        delete verifs[currentUser.username];
        delete verifs[`@${cleanCurrentUser}`];
        delete verifs[cleanCurrentUser];
        localStorage.setItem('the_samaritan_user_verifications_v1', JSON.stringify(verifs));
      }

      const rawReqs = localStorage.getItem('the_samaritan_verification_requests_v1');
      if (rawReqs) {
        const reqs = JSON.parse(rawReqs);
        const filteredReqs = reqs.filter(
          (r: any) =>
            r.username &&
            r.username.trim().toLowerCase().replace(/^@/, '') !== cleanCurrentUser
        );
        localStorage.setItem('the_samaritan_verification_requests_v1', JSON.stringify(filteredReqs));
      }
    } catch {}

    // G. Remove user direct notifications
    try {
      const rawNotifs = localStorage.getItem('the_samaritan_user_notifications_v1');
      if (rawNotifs) {
        const notifs = JSON.parse(rawNotifs);
        const filtered = notifs.filter(
          (n: any) =>
            !n.targetUsername ||
            n.targetUsername.trim().toLowerCase().replace(/^@/, '') !== cleanCurrentUser
        );
        localStorage.setItem('the_samaritan_user_notifications_v1', JSON.stringify(filtered));
      }
    } catch {}

    // H. Remove active sessions
    try {
      const rawSessions = localStorage.getItem('the_samaritan_active_sessions_v1');
      if (rawSessions) {
        const sessions = JSON.parse(rawSessions);
        const filtered = sessions.filter(
          (s: any) =>
            !s.username ||
            s.username.trim().toLowerCase().replace(/^@/, '') !== cleanCurrentUser
        );
        localStorage.setItem('the_samaritan_active_sessions_v1', JSON.stringify(filtered));
      }
    } catch {}

    // I. Remove daily logins
    try {
      const rawDaily = localStorage.getItem('the_samaritan_user_daily_logins_v2');
      if (rawDaily) {
        const daily = JSON.parse(rawDaily);
        delete daily[cleanCurrentUser];
        delete daily[currentUser.username];
        localStorage.setItem('the_samaritan_user_daily_logins_v2', JSON.stringify(daily));
      }
    } catch {}

    // J. Remove user exam sitting records
    localStorage.removeItem(`the_samaritan_grand_exam_sitting_v1_${cleanCurrentUser}`);

    // K. Log erasure in security audit log
    try {
      const rawAudit = localStorage.getItem('the_samaritan_security_audit_log_v1');
      const auditLog = rawAudit ? JSON.parse(rawAudit) : [];
      auditLog.unshift({
        id: `audit_erasure_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'USER_DATA_ERASURE',
        targetUser: currentUser.username,
        details: 'User account and all personal data permanently deleted per Section 40 Right to Erasure.',
        status: 'SUCCESS',
      });
      localStorage.setItem('the_samaritan_security_audit_log_v1', JSON.stringify(auditLog.slice(0, 100)));
    } catch {}

    // L. Clear current user session
    localStorage.removeItem('the_samaritan_auth_user_v1');
    sessionStorage.removeItem('the_samaritan_session_auth_user_v1');

    // M. Dispatch system events to update all views
    window.dispatchEvent(new CustomEvent('the_samaritan_auth_changed', { detail: { user: null } }));
    window.dispatchEvent(new CustomEvent('the_samaritan_user_deleted', { detail: { username: currentUser.username } }));
    window.dispatchEvent(new CustomEvent('the_samaritan_verifications_updated'));
    window.dispatchEvent(new CustomEvent('the_samaritan_tokens_updated'));

    return {
      success: true,
      message: `Your account (${currentUser.username}) and all associated civic data have been permanently deleted in compliance with the Kenya Data Protection Act 2019.`,
      requiresLogout: true,
    };
  } catch (err: any) {
    console.error('[UserDataPrivacy] Error during user account deletion:', err);
    return {
      success: false,
      message: `An unexpected error occurred during account deletion: ${err.message || 'Storage error'}.`,
    };
  }
}

/**
 * Full Legal Tenets of The Samaritan Platform Civic Privacy Policy
 */
export const PRIVACY_POLICY_SECTIONS = [
  {
    id: 'legal_basis',
    titleEn: '1. Constitutional & Statutory Foundation',
    titleSw: '1. Msingi wa Kikatiba na Sheria za Nchi',
    contentEn:
      'The Samaritan operates in strict accordance with Article 31 (Right to Privacy) and Article 35 (Access to Information) of the Constitution of Kenya 2010, alongside the Kenya Data Protection Act, No. 24 of 2019. Every Kenyan citizen possesses the fundamental right to civic knowledge without unwarranted surveillance, invasive data harvesting, or private communication infringement.',
    contentSw:
      'The Samaritan inafanya kazi kwa mujibu wa Ibara ya 31 (Haki ya Faragha) na Ibara ya 35 (Haki ya Kupata Taarifa) za Katiba ya Kenya 2010, pamoja na Sheria ya Kulinda Data ya Kenya Na. 24 ya 2019. Kila mwananchi ana haki ya kupata elimu ya uraia bila kufuatiliwa au kukusanywa data zake kinyume cha sheria.',
  },
  {
    id: 'zero_commercialization',
    titleEn: '2. Zero Selling & No Commercialization Guarantee',
    titleSw: '2. Ahadi ya Kutouza Wala Kufanya Biashara na Data',
    contentEn:
      'We do not sell, rent, lease, broker, or monetize citizen data to third parties, advertising networks, commercial brokers, or political organizations under any circumstance. Civic education is a public good, and citizen interaction with the Constitution must remain uncorrupted by commercial profiling.',
    contentSw:
      'Hatuuzi, hatukodishi, wala kufanya biashara yoyote na taarifa za wananchi kwa mtandao wowote wa matangazo au mashirika ya kisiasa. Elimu ya uraia ni mali ya umma, na ushiriki wa mwananchi lazima uwe safi bila kuwekewa wasifu wa kibiashara.',
  },
  {
    id: 'data_minimization',
    titleEn: '3. Data Minimization & Anonymous Participation',
    titleSw: '3. Ukusanyaji wa Chini wa Data na Utambulisho Usio Rasmi',
    contentEn:
      'Citizens may learn, read the 100 civic courses, take quizzes, and explore government offices pseudo-anonymously using self-chosen handles (e.g. @citizen_xxxx). We do not require National ID numbers, telephone numbers, or physical home addresses for civic learning.',
    contentSw:
      'Wananchi wanaweza kusoma masomo 100, kufanya mitihani, na kutafuta ofisi za serikali kwa utambulisho wa hiari (@mwananchi_xxxx). Hatuhitaji nambari ya kitambulisho cha taifa, nambari ya simu, au anwani ya makazi ili uweze kujifunza.',
  },
  {
    id: 'right_to_portability',
    titleEn: '4. Right to Data Portability (Download My Data)',
    titleSw: '4. Haki ya Kuchukua na Kupakua Data Zako (Download Data)',
    contentEn:
      'Under Section 34 of the Data Protection Act 2019, every citizen and administrator has the absolute right to download a complete, structured, machine-readable digital package of their learning records, exam certificates, tokens, verification credentials, and notifications at any time.',
    contentSw:
      'Chini ya Kifungu cha 34 cha Sheria ya Data 2019, kila mwananchi na msimamizi ana haki kamili ya kupakua faili kamili ya data zake zote za masomo, vyeti vya mitihani, ishara za uwezeshaji, na arifa wakati wowote.',
  },
  {
    id: 'right_to_erasure',
    titleEn: '5. Right to Erasure / Right to be Forgotten (Account Deletion)',
    titleSw: '5. Haki ya Kufutwa Kabisa / Kusahaulika (Kufuta Wasifu)',
    contentEn:
      'Under Section 40 of the Data Protection Act 2019, non-primary registered citizens can permanently delete their profile and all associated data records at will. Deletion requires mandatory verification using the account username and password to prevent malicious or accidental removal. Once confirmed, all progress, tokens, badges, and session records are irreversibly wiped.',
    contentSw:
      'Chini ya Kifungu cha 40 cha Sheria ya Data 2019, wananchi wote waliosajiliwa wanaweza kufuta kabisa wasifu wao na kumbukumbu zote za data. Kufuta kunahitaji uthibitisho wa lazima kwa nenosiri na jina la mtumiaji. Mara inapothibitishwa, data yote hufutwa kabisa bila kubakizwa.',
  },
  {
    id: 'primary_admin_safeguard',
    titleEn: '6. Primary Founding Administration Preservation Safeguard',
    titleSw: '6. Ulinzi wa Wasimamizi Waasisi wa Mfumo',
    contentEn:
      'The 5 primary founding admin accounts (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4, and The_Samaritan) serve as immutable public trust anchors and certification signatories. To protect system continuity, prevent administrative capture, and preserve cryptographic certificate verification, primary founding admin accounts cannot be deleted.',
    contentSw:
      'Akaunti 5 za wasimamizi wakuu waasisi (@admin.kfe1, @admin.kfe2, @admin.kfe3, @admin.kfe4, na The_Samaritan) zinatumika kama mihimili ya uaminifu wa umma na watia saini wa vyeti. Ili kulinda mwendelezo wa mfumo na kuzuia upotevu wa data ya utawala, akaunti hizi za waasisi haziwezi kufutwa.',
  },
  {
    id: 'security_tampering',
    titleEn: '7. Cryptographic Security & Sentinel Tamper Defense',
    titleSw: '7. Usalama wa Kisasa wa Kidijitali na Ngao ya Sentinel',
    contentEn:
      'All stored records, verification badges, and appointments are guarded by client-side SHA-256 Web Crypto hashing. Unauthorized tampering or unauthorized local modification triggers immediate quarantine under platform integrity rules.',
    contentSw:
      'Kumbukumbu zote, nembo za uthibitisho, na majukumu zinalindwa kwa nambari fiche za SHA-256. Majaribio yoyote ya kubadilisha data kinyume cha sheria yananaswa mara moja na Ngao ya Sentinel.',
  },
  {
    id: 'contact_dpo',
    titleEn: '8. Data Controller Contact & Grievances',
    titleSw: '8. Mawasiliano ya Msimamizi wa Data na Malalamiko',
    contentEn:
      'Data Controller: Kwale Focus Empowerment CBO (KFE)\nDesignated DPO: Compliance Directorate\nOfficial Inquiries: privacy@thesamaritan.ke | info.kolilec.cbo@gmail.com\nHeadquarters: Kwale County, Kenya',
    contentSw:
      'Msimamizi wa Data: Kwale Focus Empowerment CBO (KFE)\nAfisa wa Faragha: Kurugenzi ya Uzingatiaji na Sheria\nBarua Pepe: privacy@thesamaritan.ke | info.kolilec.cbo@gmail.com\nMakao Makuu: Kaunti ya Kwale, Kenya',
  },
];
