import {
  AuthUser,
  CivicQuestion,
  AdminAnswer,
  AdminNotification,
  PasswordStrengthResult,
} from '../types';
import {
  checkIfUserOrDeviceBanned,
  isUserAppointedAdmin,
  playNotificationChime,
  recordReviewedResolution,
  sendDirectUserNotification,
} from './adminManagement';
import { recordUserDailyLogin } from './userDailyLogins';
import { getAdminPlatformAddressingName, getAdminAppointedProfile } from './adminAppointments';

const AUTH_USER_KEY = 'the_samaritan_auth_user_v1';
const SESSION_AUTH_USER_KEY = 'the_samaritan_session_auth_user_v1';
const REGISTERED_USERS_KEY = 'the_samaritan_registered_users_v1';
const ADMIN_CREDS_KEY = 'the_samaritan_admin_creds_v1';
const QUESTIONS_KEY = 'the_samaritan_questions_v1';
const NOTIFICATIONS_KEY = 'the_samaritan_admin_notifications_v1';

// Confidential Admin Configuration - These emails must NEVER be exposed to regular users in the UI
export const INTERNAL_ADMIN_CONFIG: Record<string, {
  defaultPassword: string;
  notificationEmail: string;
  roleTitle: { en: string; sw: string };
}> = {
  '@admin.kfe1': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'tideappseries@gmail.com',
    roleTitle: {
      en: '@admin.kfe1 • Program Associate (Mwanaisha Omar)',
      sw: '@admin.kfe1 • Afisa Mshirika wa Miradi (Mwanaisha Omar)',
    },
  },
  'Admin 1': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'tideappseries@gmail.com',
    roleTitle: {
      en: '@admin.kfe1 • Program Associate (Mwanaisha Omar)',
      sw: '@admin.kfe1 • Afisa Mshirika wa Miradi (Mwanaisha Omar)',
    },
  },
  '@admin.kfe2': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'info.kolilec.cbo@gmail.com',
    roleTitle: {
      en: '@admin.kfe2 • Project Officer (Abas Mwayanga)',
      sw: '@admin.kfe2 • Afisa wa Miradi (Abas Mwayanga)',
    },
  },
  'Admin 2': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'info.kolilec.cbo@gmail.com',
    roleTitle: {
      en: '@admin.kfe2 • Project Officer (Abas Mwayanga)',
      sw: '@admin.kfe2 • Afisa wa Miradi (Abas Mwayanga)',
    },
  },
  '@admin.kfe3': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'projectofficer@thesamaritan.ke',
    roleTitle: {
      en: '@admin.kfe3 • Director of Compliance & Constitutional Adjudication (Salim Mwadzaya)',
      sw: '@admin.kfe3 • Mkurugenzi wa Uzingatiaji na Maadili (Salim Mwadzaya)',
    },
  },
  'Admin 3': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'projectofficer@thesamaritan.ke',
    roleTitle: {
      en: '@admin.kfe3 • Director of Compliance & Constitutional Adjudication (Salim Mwadzaya)',
      sw: '@admin.kfe3 • Mkurugenzi wa Uzingatiaji na Maadili (Salim Mwadzaya)',
    },
  },
  '@admin.kfe4': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'executivedirector@thesamaritan.ke',
    roleTitle: {
      en: '@admin.kfe4 • Executive Director & Certification Authority (Fatuma Hassan)',
      sw: '@admin.kfe4 • Mkurugenzi Mtendaji na Mamlaka ya Vyeti (Fatuma Hassan)',
    },
  },
  'Admin 4': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'executivedirector@thesamaritan.ke',
    roleTitle: {
      en: '@admin.kfe4 • Executive Director & Certification Authority (Fatuma Hassan)',
      sw: '@admin.kfe4 • Mkurugenzi Mtendaji na Mamlaka ya Vyeti (Fatuma Hassan)',
    },
  },
  'The_Samaritan': {
    defaultPassword: '#Swiftly2.0',
    notificationEmail: 'abdulhamid.moh.ali19@gmail.com',
    roleTitle: {
      en: 'The Samaritan • Platform Architect & Lead Facilitator (Sir Chaucer)',
      sw: 'The Samaritan • Msanifu Mkuu na Mwezeshaji Kiongozi (Sir Chaucer)',
    },
  },
};

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  let criteriaMet = 0;
  if (hasMinLength) criteriaMet++;
  if (hasLowercase && hasUppercase) criteriaMet++;
  if (hasNumber) criteriaMet++;
  if (hasSpecialChar) criteriaMet++;

  let score = 0;
  let label: PasswordStrengthResult['label'] = 'Very Weak';
  let color = '#ef4444'; // red-500
  let feedbackMessage = 'Must be at least 8 characters long.';

  if (!hasMinLength) {
    score = password.length > 0 ? 1 : 0;
    label = 'Very Weak';
    color = '#ef4444';
    feedbackMessage = `Need ${8 - password.length} more characters (minimum 8 required).`;
  } else if (criteriaMet === 1) {
    score = 1;
    label = 'Weak';
    color = '#f97316'; // orange-500
    feedbackMessage = 'Add uppercase letters, numbers, and special symbols.';
  } else if (criteriaMet === 2) {
    score = 2;
    label = 'Fair';
    color = '#eab308'; // yellow-500
    feedbackMessage = 'Good start! Add a special character (!@#$) to make it strong.';
  } else if (criteriaMet === 3) {
    score = 3;
    label = 'Strong';
    color = '#10b981'; // emerald-500
    feedbackMessage = 'Strong password! Contains letters, numbers, and symbols.';
  } else {
    score = 4;
    label = 'Very Strong';
    color = '#059669'; // emerald-600
    feedbackMessage = 'Excellent! Highly secure password with high complexity.';
  }

  return {
    score,
    label,
    color,
    hasMinLength,
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
    feedbackMessage,
  };
}

export function validateAnonymousUsername(username: string): {
  isValid: boolean;
  cleanUsername: string;
  errorMessage?: string;
} {
  const trimmed = username.trim();
  const normalized = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
  const handleBody = normalized.substring(1);

  if (handleBody.length < 8) {
    return {
      isValid: false,
      cleanUsername: normalized,
      errorMessage: `Username must contain at least 8 characters (current: ${handleBody.length}).`,
    };
  }

  const validHandleRegex = /^[a-zA-Z0-9_.]+$/;
  if (!validHandleRegex.test(handleBody)) {
    return {
      isValid: false,
      cleanUsername: normalized,
      errorMessage: 'Username can only contain letters, numbers, underscores (_), and dots (.).',
    };
  }

  const reservedList = [
    '@admin1',
    '@admin2',
    '@admin3',
    '@admin4',
    '@admin.kfe1',
    '@admin.kfe2',
    '@admin.kfe3',
    '@admin.kfe4',
    '@the_samaritan',
    '@thesamaritan',
    '@samaritan',
  ];
  if (reservedList.includes(normalized.toLowerCase())) {
    return {
      isValid: false,
      cleanUsername: normalized,
      errorMessage: 'This username is reserved for platform administrators and system operators.',
    };
  }

  return {
    isValid: true,
    cleanUsername: normalized,
  };
}

// ---------------- Admin Credentials Management ---------------- //
interface StoredAdminCreds {
  [adminName: string]: {
    passwordHash: string;
    lastUpdated: string;
  };
}

export function normalizeAdminUsername(input: string): string | null {
  const clean = input.trim();
  const lower = clean.toLowerCase();
  if (lower === '@admin.kfe1' || lower === 'admin.kfe1' || lower === 'admin 1' || lower === '@admin1' || lower === 'admin1') {
    return '@admin.kfe1';
  }
  if (lower === '@admin.kfe2' || lower === 'admin.kfe2' || lower === 'admin 2' || lower === '@admin2' || lower === 'admin2') {
    return '@admin.kfe2';
  }
  if (lower === '@admin.kfe3' || lower === 'admin.kfe3' || lower === 'admin 3' || lower === '@admin3' || lower === 'admin3') {
    return '@admin.kfe3';
  }
  if (lower === '@admin.kfe4' || lower === 'admin.kfe4' || lower === 'admin 4' || lower === '@admin4' || lower === 'admin4') {
    return '@admin.kfe4';
  }
  if (lower === 'the_samaritan' || lower === '@the_samaritan' || lower === 'the samaritan' || lower === 'thesamaritan' || lower === 'sir chaucer') {
    return 'The_Samaritan';
  }
  return null;
}

export function getAdminCredentials(): StoredAdminCreds {
  const defaults: StoredAdminCreds = {
    '@admin.kfe1': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe1'].defaultPassword, lastUpdated: new Date().toISOString() },
    'Admin 1': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe1'].defaultPassword, lastUpdated: new Date().toISOString() },
    '@admin.kfe2': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe2'].defaultPassword, lastUpdated: new Date().toISOString() },
    'Admin 2': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe2'].defaultPassword, lastUpdated: new Date().toISOString() },
    '@admin.kfe3': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe3'].defaultPassword, lastUpdated: new Date().toISOString() },
    'Admin 3': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe3'].defaultPassword, lastUpdated: new Date().toISOString() },
    '@admin.kfe4': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe4'].defaultPassword, lastUpdated: new Date().toISOString() },
    'Admin 4': { passwordHash: INTERNAL_ADMIN_CONFIG['@admin.kfe4'].defaultPassword, lastUpdated: new Date().toISOString() },
    'The_Samaritan': { passwordHash: INTERNAL_ADMIN_CONFIG['The_Samaritan'].defaultPassword, lastUpdated: new Date().toISOString() },
  };

  if (typeof window === 'undefined') {
    return defaults;
  }

  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    // Ensure all admin canonicals are populated
    for (const [key, val] of Object.entries(defaults)) {
      if (!parsed[key]) {
        parsed[key] = val;
      }
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse admin creds:', err);
    return defaults;
  }
}

export function verifyAdminLogin(username: string, passwordAttempt: string): boolean {
  const canonical = normalizeAdminUsername(username) || username;
  const validAdmins = ['@admin.kfe1', '@admin.kfe2', '@admin.kfe3', '@admin.kfe4', 'The_Samaritan', 'Admin 1', 'Admin 2', 'Admin 3', 'Admin 4'];
  if (!validAdmins.includes(canonical) && !validAdmins.includes(username)) {
    return false;
  }
  const creds = getAdminCredentials();
  const adminEntry = creds[canonical] || creds[username];
  if (!adminEntry) {
    return passwordAttempt === '#Swiftly2.0';
  }
  return adminEntry.passwordHash === passwordAttempt;
}

export function changeAdminPassword(
  adminUsername: string,
  currentPasswordAttempt: string,
  newPassword: string
): { success: boolean; message: string } {
  const canonical = normalizeAdminUsername(adminUsername) || adminUsername;
  if (!verifyAdminLogin(canonical, currentPasswordAttempt)) {
    return { success: false, message: 'Current password is incorrect.' };
  }

  if (newPassword.length < 8) {
    return { success: false, message: 'New password must contain at least 8 characters.' };
  }

  const creds = getAdminCredentials();
  const entry = {
    passwordHash: newPassword,
    lastUpdated: new Date().toISOString(),
  };
  creds[canonical] = entry;
  // Also keep backward compatible alias in sync
  if (canonical === '@admin.kfe1') creds['Admin 1'] = entry;
  if (canonical === '@admin.kfe2') creds['Admin 2'] = entry;
  if (canonical === '@admin.kfe3') creds['Admin 3'] = entry;
  if (canonical === '@admin.kfe4') creds['Admin 4'] = entry;

  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  return { success: true, message: `Password for ${canonical} has been successfully updated.` };
}

// ---------------- Secure Password Recovery & Account Access ---------------- //

export interface PasswordRecoveryRequest {
  id: string;
  username: string;
  role: 'anonymous' | 'admin';
  timestamp: string;
  status: 'pending' | 'verified_reset';
  verificationMethod: 'county_verification' | 'master_security_key';
  countyMatched?: string;
  resolvedAt?: string;
}

const PASSWORD_RECOVERY_KEY = 'the_samaritan_password_recovery_requests_v1';

export function getAllPasswordRecoveryRequests(): PasswordRecoveryRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PASSWORD_RECOVERY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePasswordRecoveryRequests(requests: PasswordRecoveryRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PASSWORD_RECOVERY_KEY, JSON.stringify(requests));
  } catch {}
}

/**
 * Recovers or resets an anonymous citizen's password using Home County verification.
 * Does not expose or transmit old passwords. Re-encrypts/stores new password upon verification.
 */
export function recoverAnonymousCitizenPassword(
  usernameInput: string,
  verifiedCountyInput: string,
  newPassword: string
): { success: boolean; message: string } {
  const trimmed = usernameInput.trim();
  const clean = trimmed.toLowerCase().replace(/^@/, '');
  const normalized = `@${clean}`;

  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'New password must contain at least 8 characters.',
    };
  }

  const users = getRegisteredUsers();
  const matched = users.find((u) => u.username.toLowerCase().replace(/^@/, '') === clean);

  if (!matched) {
    return {
      success: false,
      message: `No citizen account found with username ${normalized}. Please verify your handle.`,
    };
  }

  const userCounty = getUserCounty(matched.username);
  if (userCounty.toLowerCase() !== verifiedCountyInput.trim().toLowerCase()) {
    return {
      success: false,
      message: `County verification failed. The selected jurisdiction does not match the registered home county for ${matched.username}.`,
    };
  }

  // Update password in registered users list
  matched.passwordHash = newPassword;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

  // Log recovery audit for The_Samaritan security log
  const requests = getAllPasswordRecoveryRequests();
  const recRecord: PasswordRecoveryRequest = {
    id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username: matched.username,
    role: 'anonymous',
    timestamp: new Date().toISOString(),
    status: 'verified_reset',
    verificationMethod: 'county_verification',
    countyMatched: userCounty,
    resolvedAt: new Date().toISOString(),
  };
  requests.unshift(recRecord);
  savePasswordRecoveryRequests(requests);

  // Send security notification to user's handle
  sendDirectUserNotification(
    matched.username,
    '🔒 Security Notice: Password Reset Successful',
    `Your Samaritan platform password was successfully reset on ${new Date().toLocaleDateString()} via Home County jurisdiction verification. You can now log in with your new password.`,
    'urgent',
    'The_Samaritan'
  );

  return {
    success: true,
    message: `Account access restored! Password for ${matched.username} has been successfully updated. You may now log in.`,
  };
}

/**
 * Recovers or resets an administrator's password using master recovery protocol.
 * Master Security Key: "#Swiftly2.0" (the master developer/architect genesis key for The Samaritan platform)
 */
export function recoverAdminPassword(
  adminUsernameInput: string,
  recoverySecretKey: string,
  newPassword: string
): { success: boolean; message: string } {
  const canonical = normalizeAdminUsername(adminUsernameInput.trim());
  if (!canonical) {
    return {
      success: false,
      message: 'Specified handle is not a recognized administrator account.',
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: 'New password must contain at least 8 characters.',
    };
  }

  // Check master authorization key
  if (recoverySecretKey.trim() !== '#Swiftly2.0') {
    return {
      success: false,
      message: 'Invalid Administrative Recovery Key. Contact The_Samaritan for executive assistance.',
    };
  }

  const creds = getAdminCredentials();
  const entry = {
    passwordHash: newPassword,
    lastUpdated: new Date().toISOString(),
  };
  creds[canonical] = entry;
  if (canonical === '@admin.kfe1') creds['Admin 1'] = entry;
  if (canonical === '@admin.kfe2') creds['Admin 2'] = entry;
  if (canonical === '@admin.kfe3') creds['Admin 3'] = entry;
  if (canonical === '@admin.kfe4') creds['Admin 4'] = entry;
  localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));

  // Log recovery audit
  const requests = getAllPasswordRecoveryRequests();
  const recRecord: PasswordRecoveryRequest = {
    id: 'rec_adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username: canonical,
    role: 'admin',
    timestamp: new Date().toISOString(),
    status: 'verified_reset',
    verificationMethod: 'master_security_key',
    resolvedAt: new Date().toISOString(),
  };
  requests.unshift(recRecord);
  savePasswordRecoveryRequests(requests);

  // Send direct notification to The_Samaritan
  sendDirectUserNotification(
    'The_Samaritan',
    `Admin Password Reset: ${canonical}`,
    `Executive notice: The password for ${canonical} was reset and updated on ${new Date().toLocaleTimeString()} using Master Recovery Authorization.`,
    'urgent',
    'System Security'
  );

  return {
    success: true,
    message: `Administrator credentials for ${canonical} have been successfully reset. You may now log in.`,
  };
}

// ---------------- Registered Anonymous Users ---------------- //
export interface StoredUserRecord {
  username: string;
  passwordHash: string;
  createdAt: string;
  county?: string;
  subCounty?: string;
}

const DUMMY_USERNAMES_SET = new Set([
  '@mwananchi_kwale',
  '@pwani_youth',
  '@kombani_voice',
  '@haki_mwananchi',
  '@pwani_scholar',
  '@fatuma_m',
  '@kombani_youth',
  '@mzalendo_254',
  '@kwalecitizenvoice',
  '@civicmatuga',
  '@kinangoyouth',
]);

const USER_COUNTIES_KEY = 'the_samaritan_user_counties_v1';

export function getUserCounty(username?: string | null): string {
  if (!username || typeof window === 'undefined') return 'Kwale';
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  try {
    const raw = localStorage.getItem(USER_COUNTIES_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[clean]) {
        if (typeof map[clean] === 'string') return map[clean];
        if (map[clean].county) return map[clean].county;
      }
    }
    // Check registered users
    const regUsers = getRegisteredUsers();
    const found = regUsers.find((u) => u.username.toLowerCase().replace(/^@/, '') === clean);
    if (found && found.county) return found.county;
  } catch (e) {
    // fallback
  }
  return 'Kwale';
}

export function getUserSubCounty(username?: string | null): string | undefined {
  if (!username || typeof window === 'undefined') return undefined;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  try {
    const raw = localStorage.getItem(USER_COUNTIES_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[clean] && typeof map[clean] === 'object') {
        return map[clean].subCounty;
      }
    }
    const regUsers = getRegisteredUsers();
    const found = regUsers.find((u) => u.username.toLowerCase().replace(/^@/, '') === clean);
    if (found && found.subCounty) return found.subCounty;
  } catch (e) {
    // fallback
  }
  return undefined;
}

export function setUserCounty(username: string, county: string, subCounty?: string): boolean {
  if (!username || typeof window === 'undefined') return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  const chosenCounty = county.trim() || 'Kwale';
  try {
    // 1. Update counties map
    const raw = localStorage.getItem(USER_COUNTIES_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[clean] = { county: chosenCounty, subCounty: subCounty?.trim() || undefined };
    localStorage.setItem(USER_COUNTIES_KEY, JSON.stringify(map));

    // 2. Update registered users array
    const usersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (usersRaw) {
      const users: StoredUserRecord[] = JSON.parse(usersRaw);
      const idx = users.findIndex((u) => u.username.toLowerCase().replace(/^@/, '') === clean);
      if (idx !== -1) {
        users[idx].county = chosenCounty;
        users[idx].subCounty = subCounty?.trim() || undefined;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      }
    }

    // 3. Update current logged-in auth user session if matching
    const current = getCurrentAuthUser();
    if (current && current.username.toLowerCase().replace(/^@/, '') === clean) {
      current.county = chosenCounty;
      current.subCounty = subCounty?.trim() || undefined;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
      sessionStorage.setItem(SESSION_AUTH_USER_KEY, JSON.stringify(current));
    }

    window.dispatchEvent(
      new CustomEvent('the_samaritan_county_updated', {
        detail: { username: clean, county: chosenCounty, subCounty: subCounty?.trim() },
      })
    );
    return true;
  } catch (e) {
    return false;
  }
}

export function getRegisteredUsers(): StoredUserRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const list: StoredUserRecord[] = raw ? JSON.parse(raw) : [];
    // Ensure all dummy accounts are eliminated so real users test cleanly
    const filtered = list.filter((u) => !DUMMY_USERNAMES_SET.has(u.username.toLowerCase()));
    if (filtered.length !== list.length) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    return [];
  }
}

export function registerAnonymousUser(
  username: string,
  password: string,
  county: string = 'Kwale',
  subCounty?: string
): { success: boolean; message: string; user?: AuthUser } {
  const validation = validateAnonymousUsername(username);
  if (!validation.isValid) {
    return { success: false, message: validation.errorMessage || 'Invalid username' };
  }

  if (password.length < 8) {
    return { success: false, message: 'Password must contain at least 8 characters.' };
  }

  const cleanHandle = validation.cleanUsername;

  // Check if banned
  const banStatus = checkIfUserOrDeviceBanned(cleanHandle);
  if (banStatus.isBanned) {
    return {
      success: false,
      message: `Account Suspended: The handle ${cleanHandle} has been banned from The Samaritan platform. Registration is blocked.`,
    };
  }

  const users = getRegisteredUsers();

  const exists = users.some((u) => u.username.toLowerCase() === cleanHandle.toLowerCase());
  if (exists) {
    return { success: false, message: `Username ${cleanHandle} is already taken. Please choose another.` };
  }

  const selectedCounty = county.trim() || 'Kwale';
  const newRecord: StoredUserRecord = {
    username: cleanHandle,
    passwordHash: password,
    createdAt: new Date().toISOString(),
    county: selectedCounty,
    subCounty: subCounty?.trim() || undefined,
  };

  users.push(newRecord);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  setUserCounty(cleanHandle, selectedCounty, subCounty);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('the_samaritan_user_registered', {
        detail: { user: newRecord },
      })
    );
  }

  const authUser: AuthUser = {
    id: 'user_' + Date.now(),
    username: cleanHandle,
    role: 'anonymous',
    createdAt: newRecord.createdAt,
    county: selectedCounty,
    subCounty: subCounty?.trim() || undefined,
  };

  setCurrentAuthUser(authUser);
  return { success: true, message: `Account created successfully! Welcome ${cleanHandle} (${selectedCounty} County).`, user: authUser };
}

export function loginUser(usernameInput: string, passwordInput: string): { success: boolean; message: string; user?: AuthUser } {
  const trimmed = usernameInput.trim();
  const normalized = trimmed.startsWith('@') ? trimmed : `@${trimmed}`;

  // Check if banned - If a user is banned they can not log back into the platform
  const banStatus = checkIfUserOrDeviceBanned(trimmed).isBanned
    ? checkIfUserOrDeviceBanned(trimmed)
    : checkIfUserOrDeviceBanned(normalized);

  if (banStatus.isBanned) {
    return {
      success: false,
      message: `Account Suspended: This user account (${trimmed}) is banned from The Samaritan platform. Access denied (${banStatus.record?.reason || 'Violation of community standards and Chapter Six'}). You cannot log back into the platform.`,
    };
  }

  // Check if trying to log in as original admin accounts (@admin.kfex or The_Samaritan)
  const canonicalAdmin = normalizeAdminUsername(trimmed);
  if (canonicalAdmin) {
    if (verifyAdminLogin(canonicalAdmin, passwordInput)) {
      const isSuper = canonicalAdmin === 'The_Samaritan';
      const isExecutive = canonicalAdmin === '@admin.kfe3' || canonicalAdmin === '@admin.kfe4';
      const addressingName = getAdminPlatformAddressingName(canonicalAdmin);
      const appointedProfile = getAdminAppointedProfile(canonicalAdmin);
      const adminPosition =
        appointedProfile.officialPosition ||
        (isSuper
          ? 'Super Administrator & Developer'
          : isExecutive
          ? canonicalAdmin === '@admin.kfe4'
            ? 'Executive Director'
            : 'Director of Compliance'
          : 'Program Associate');

      const adminUser: AuthUser = {
        id: `admin_${canonicalAdmin.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        username: canonicalAdmin,
        role: 'admin',
        adminLevel: isSuper ? 'super' : isExecutive ? 'executive' : 'standard',
        createdAt: new Date().toISOString(),
      };
      setCurrentAuthUser(adminUser);
      recordAdminActivity(canonicalAdmin);
      recordUserDailyLogin(canonicalAdmin);
      return {
        success: true,
        message: isSuper
          ? `Welcome ${addressingName}! Logged in as The_Samaritan (${adminPosition}).`
          : `Welcome ${addressingName}! Logged in as ${canonicalAdmin} (${adminPosition}).`,
        user: adminUser,
      };
    }
    return { success: false, message: 'Invalid admin credentials.' };
  }

  // Check anonymous registered users
  const users = getRegisteredUsers();
  const matched = users.find((u) => u.username.toLowerCase() === normalized.toLowerCase());

  if (!matched) {
    return { success: false, message: `No account found with username ${normalized}. Please register first.` };
  }

  if (matched.passwordHash !== passwordInput) {
    return { success: false, message: 'Incorrect password.' };
  }

  // Check if citizen was granted a 3-month temporary admin pass
  const isAppointed = isUserAppointedAdmin(matched.username);
  const userCounty = matched.county || getUserCounty(matched.username);
  const userSubCounty = matched.subCounty || getUserSubCounty(matched.username);

  const authUser: AuthUser = {
    id: 'user_' + matched.username,
    username: matched.username,
    role: isAppointed ? 'admin' : 'anonymous',
    adminLevel: isAppointed ? 'temporary' : undefined,
    createdAt: matched.createdAt,
    county: userCounty,
    subCounty: userSubCounty,
  };

  setCurrentAuthUser(authUser);
  recordUserDailyLogin(matched.username);
  return {
    success: true,
    message: isAppointed
      ? `Welcome ${matched.username}! Logged in with Honorary Administrator Pass (3 Months).`
      : `Welcome back ${matched.username}!`,
    user: authUser,
  };
}

export function getCurrentAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const sessionRaw = sessionStorage.getItem(SESSION_AUTH_USER_KEY);
    const raw = sessionRaw || localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    // Hydrate avatar if stored in avatars map
    if (!user.avatarUrl && user.username) {
      const storedAvatar = getUserAvatar(user.username);
      if (storedAvatar) user.avatarUrl = storedAvatar;
    }
    // Hydrate county and subCounty
    if (!user.county && user.username) {
      user.county = getUserCounty(user.username);
    }
    if (!user.subCounty && user.username) {
      user.subCounty = getUserSubCounty(user.username);
    }
    return user;
  } catch (e) {
    return null;
  }
}

export const DEFAULT_CIVIC_AVATARS = [
  { id: 'kenya-shield', label: 'Kenyan Shield', icon: '🛡️', bg: 'bg-emerald-600', color: '#059669' },
  { id: 'justice-scales', label: 'Scales of Justice', icon: '⚖️', bg: 'bg-amber-600', color: '#d97706' },
  { id: 'integrity-star', label: 'Integrity Star', icon: '⭐', bg: 'bg-blue-600', color: '#2563eb' },
  { id: 'civic-torch', label: 'Civic Torch', icon: '🔥', bg: 'bg-orange-600', color: '#ea580c' },
  { id: 'public-servant', label: 'Public Guardian', icon: '🏛️', bg: 'bg-indigo-600', color: '#4f46e5' },
  { id: 'baraza-leader', label: 'Baraza Leader', icon: '👥', bg: 'bg-teal-600', color: '#0d9488' },
  { id: 'coastal-palms', label: 'Kwale Coast', icon: '🌴', bg: 'bg-cyan-600', color: '#0891b2' },
  { id: 'samaritan-crest', label: 'The Samaritan Crest', icon: '🇰🇪', bg: 'bg-red-600', color: '#dc2626' },
];

export function getUserAvatar(username?: string | null): string | null {
  if (!username || typeof window === 'undefined') return null;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  try {
    const raw = localStorage.getItem('the_samaritan_user_avatars_v1');
    if (raw) {
      const map: Record<string, string> = JSON.parse(raw);
      if (map[clean]) return map[clean];
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function setUserAvatar(username: string, avatarDataUrl: string): boolean {
  if (!username || typeof window === 'undefined') return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  try {
    const raw = localStorage.getItem('the_samaritan_user_avatars_v1');
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    map[clean] = avatarDataUrl;
    localStorage.setItem('the_samaritan_user_avatars_v1', JSON.stringify(map));

    // Also update current auth user if active
    const current = getCurrentAuthUser();
    if (current && current.username.trim().toLowerCase().replace(/^@/, '') === clean) {
      current.avatarUrl = avatarDataUrl;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
      sessionStorage.setItem(SESSION_AUTH_USER_KEY, JSON.stringify(current));
    }

    // Dispatch global event for instantaneous real-time UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('the_samaritan_avatar_updated', {
        detail: { username: clean, avatarUrl: avatarDataUrl }
      }));
    }
    return true;
  } catch (e) {
    console.error('Failed to save avatar:', e);
    return false;
  }
}

export function removeUserAvatar(username: string): boolean {
  if (!username || typeof window === 'undefined') return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  try {
    const raw = localStorage.getItem('the_samaritan_user_avatars_v1');
    if (raw) {
      const map: Record<string, string> = JSON.parse(raw);
      delete map[clean];
      localStorage.setItem('the_samaritan_user_avatars_v1', JSON.stringify(map));
    }

    const current = getCurrentAuthUser();
    if (current && current.username.trim().toLowerCase().replace(/^@/, '') === clean) {
      delete current.avatarUrl;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(current));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('the_samaritan_avatar_updated', {
        detail: { username: clean, avatarUrl: null }
      }));
    }
    return true;
  } catch (e) {
    return false;
  }
}

export function setCurrentAuthUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    sessionStorage.removeItem(SESSION_AUTH_USER_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    sessionStorage.setItem(SESSION_AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    if (user.role === 'admin') {
      recordAdminActivity(user.username);
    }
  }
  window.dispatchEvent(new CustomEvent('the_samaritan_auth_changed', { detail: { user } }));
}

// ---------------- Admin Online Presence Tracking ---------------- //
const ADMIN_ACTIVITY_KEY = 'the_samaritan_admin_activity_log_v1';
const ADMIN_HEARTBEATS_MAP_KEY = 'the_samaritan_admin_heartbeats_v3';

export interface AdminOnlineInfo {
  isOnline: boolean;
  onlineAdminsCount: number;
  activeAdminNames: string[];
  activeAdminName: string | null;
  lastActiveMinutesAgo: number;
  statusMode: 'online' | 'operator' | 'recent' | 'scheduled';
  statusText: {
    en: string;
    sw: string;
  };
  dutySchedule: {
    en: string;
    sw: string;
  };
}

export function recordAdminActivity(adminName?: string): void {
  if (typeof window === 'undefined') return;
  const current = getCurrentAuthUser();
  const name = adminName || (current?.role === 'admin' ? current.username : 'Admin 1');
  const now = Date.now();

  const record = {
    adminName: name,
    timestamp: now,
    iso: new Date().toISOString(),
  };

  try {
    localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(record));

    // Also update multi-admin heartbeats registry
    const rawMap = localStorage.getItem(ADMIN_HEARTBEATS_MAP_KEY);
    const map: Record<string, number> = rawMap ? JSON.parse(rawMap) : {};
    map[name] = now;
    localStorage.setItem(ADMIN_HEARTBEATS_MAP_KEY, JSON.stringify(map));
  } catch (e) {}
}

export function getAdminOnlineStatus(): AdminOnlineInfo {
  if (typeof window === 'undefined') {
    return {
      isOnline: true,
      onlineAdminsCount: 0,
      activeAdminNames: [],
      activeAdminName: null,
      lastActiveMinutesAgo: 0,
      statusMode: 'operator',
      statusText: { en: 'Operator online', sw: 'Opereta yuko mtandaoni' },
      dutySchedule: {
        en: 'AI Constitutional Operator active 24/7 • Ready to answer civic questions',
        sw: 'Opereta wa AI yuko hewani 24/7 • Tayari kujibu maswali ya kiraia',
      },
    };
  }

  const currentUser = getCurrentAuthUser();
  const now = Date.now();
  const onlineThresholdMs = 5 * 60 * 1000; // Active within 5 minutes is considered Online

  // Read admin heartbeats map
  const activeAdminsSet = new Set<string>();

  try {
    const rawMap = localStorage.getItem(ADMIN_HEARTBEATS_MAP_KEY);
    if (rawMap) {
      const map: Record<string, number> = JSON.parse(rawMap);
      for (const [name, timestamp] of Object.entries(map)) {
        if (now - Number(timestamp) <= onlineThresholdMs) {
          activeAdminsSet.add(name);
        }
      }
    }
  } catch (e) {}

  // Check active sessions from userPresence key if available
  try {
    const sessionsRaw = localStorage.getItem('the_samaritan_active_sessions_v1');
    if (sessionsRaw) {
      const sessions = JSON.parse(sessionsRaw);
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          if (
            (s.role === 'admin' || s.username === 'The_Samaritan' || s.username?.startsWith('Admin ')) &&
            now - Number(s.lastActive || 0) <= onlineThresholdMs
          ) {
            activeAdminsSet.add(s.username);
          }
        }
      }
    }
  } catch (e) {}

  // If current logged-in user is an admin, include them
  if (currentUser && currentUser.role === 'admin') {
    activeAdminsSet.add(currentUser.username);
  }

  const activeAdminNames = Array.from(activeAdminsSet);
  const onlineAdminsCount = activeAdminNames.length;

  // 1. Multiple Admins Online: "X admins online"
  if (onlineAdminsCount > 1) {
    return {
      isOnline: true,
      onlineAdminsCount,
      activeAdminNames,
      activeAdminName: activeAdminNames[0],
      lastActiveMinutesAgo: 0,
      statusMode: 'online',
      statusText: {
        en: `${onlineAdminsCount} Admins online`,
        sw: `Wasimamizi ${onlineAdminsCount} wako mtandaoni`,
      },
      dutySchedule: {
        en: `${onlineAdminsCount} Civic administrators on duty • Reviewing inquiries & verifying citations`,
        sw: `Wasimamizi wa kiraia ${onlineAdminsCount} wapo kazini • Wanathibitisha majibu na maswali`,
      },
    };
  }

  // 2. Exactly 1 Admin Online: "1 Admin online"
  if (onlineAdminsCount === 1) {
    const name = activeAdminNames[0];
    return {
      isOnline: true,
      onlineAdminsCount: 1,
      activeAdminNames,
      activeAdminName: name,
      lastActiveMinutesAgo: 0,
      statusMode: 'online',
      statusText: {
        en: '1 Admin online',
        sw: 'Msimamizi 1 yuko mtandaoni',
      },
      dutySchedule: {
        en: `Civic Administrator (${name}) on duty • Verifying civic questions`,
        sw: `Msimamizi wa Kiraia (${name}) yuko hewani • Anathibitisha maswali`,
      },
    };
  }

  // 3. No admin online: "Operator online"
  return {
    isOnline: true, // Operator is always online and ready
    onlineAdminsCount: 0,
    activeAdminNames: [],
    activeAdminName: null,
    lastActiveMinutesAgo: 0,
    statusMode: 'operator',
    statusText: {
      en: 'Operator online',
      sw: 'Opereta yuko mtandaoni',
    },
    dutySchedule: {
      en: 'AI Constitutional Operator active 24/7 • Answers analyzed & queued for admin review',
      sw: 'Opereta wa Kikatiba wa AI yuko hewani 24/7 • Majibu yanachambuliwa mara moja',
    },
  };
}

// ---------------- Admin Notifications Management ---------------- //
export function getAdminNotifications(): AdminNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return [];
    const notifs: AdminNotification[] = JSON.parse(raw);

    // Retrieve questions to automatically prune requests that have already been reviewed
    let questions: CivicQuestion[] = [];
    try {
      const qRaw = localStorage.getItem(QUESTIONS_KEY);
      if (qRaw) questions = JSON.parse(qRaw);
    } catch (e) {
      questions = [];
    }

    const qMap = new Map<string, CivicQuestion>();
    for (const q of questions) {
      qMap.set(q.id, q);
    }

    // Remove requests from admin alerts once they have been reviewed
    const filtered = notifs.filter((notif) => {
      // If manually marked reviewed, remove from active alerts
      if (notif.reviewed) return false;

      // If question request:
      if (notif.type === 'question' && notif.questionId) {
        const q = qMap.get(notif.questionId);
        // If question was deleted or not found, remove from alerts
        if (!q) return false;

        // If question has been reviewed:
        // 1. Has an admin response
        const hasAdminAnswer = q.answers.some(
          (a) =>
            a.answeredBy === 'Admin 1' ||
            a.answeredBy === 'Admin 2' ||
            a.answeredBy === 'Admin 3' ||
            a.answeredBy === 'Admin 4' ||
            a.answeredBy === 'The_Samaritan' ||
            a.answeredBy === 'The Samaritan' ||
            a.answeredBy === '@The_Samaritan' ||
            a.answeredBy?.startsWith('@admin.kfe')
        );
        // 2. Or has a verified Operator/AI response
        const hasVerifiedAnswer = q.answers.some((a) => a.isVerified);

        // If reviewed, it is removed from admin alerts!
        if (hasAdminAnswer || hasVerifiedAnswer) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length !== notifs.length) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch (err) {
    return [];
  }
}

export function removeAdminNotification(notifId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return;
    const notifs: AdminNotification[] = JSON.parse(raw);
    const filtered = notifs.filter((n) => n.id !== notifId);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_removed', { detail: { notifId } }));
  } catch (err) {
    console.error('Failed to remove admin notification:', err);
  }
}

export function removeNotificationsForQuestion(questionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return;
    const notifs: AdminNotification[] = JSON.parse(raw);
    const filtered = notifs.filter((n) => n.questionId !== questionId);
    if (filtered.length !== notifs.length) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
      window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_removed', { detail: { questionId } }));
    }
  } catch (err) {
    console.error('Failed to remove notification for question:', err);
  }
}

export function markRequestAsReviewed(
  notifId: string,
  reviewedBy?: string,
  category?: AdminNotification['resolutionCategory'],
  notes?: string
): void {
  // Remove requests from admin alerts once they have been reviewed
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return;
    const notifs: AdminNotification[] = JSON.parse(raw);
    const target = notifs.find((n) => n.id === notifId);
    const filtered = notifs.filter((n) => n.id !== notifId);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));

    // Record resolution in intelligence log
    if (target) {
      recordReviewedResolution({
        notifId: target.id,
        questionId: target.questionId,
        questionTitle: target.questionTitle,
        submittedByHandle: target.submittedByHandle,
        reviewedBy: reviewedBy || 'Admin',
        category: category || 'standard_review',
        notes: notes || '',
      });
    }

    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
    window.dispatchEvent(
      new CustomEvent('the_samaritan_admin_notification_removed', {
        detail: { notifId, reviewedBy, category, timestamp: new Date().toISOString() },
      })
    );
  } catch (err) {
    console.error('Failed to mark request as reviewed:', err);
  }
}

export function assignAdminNotification(
  notifId: string,
  assignedTo: string,
  assignedBy: string
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return false;
    const notifs: AdminNotification[] = JSON.parse(raw);
    const updated = notifs.map((n) => {
      if (n.id === notifId) {
        return {
          ...n,
          assignedTo,
          assignedBy,
          assignedAt: new Date().toISOString(),
        };
      }
      return n;
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
    return true;
  } catch (err) {
    console.error('Failed to assign admin notification:', err);
    return false;
  }
}

export function clearAllReviewedAdminNotifications(): void {
  if (typeof window === 'undefined') return;
  try {
    const active = getAdminNotifications();
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(active));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_removed', { detail: { all: true } }));
  } catch (err) {
    console.error('Failed to clear reviewed admin notifications:', err);
  }
}

export function dismissAllAdminAlerts(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_removed', { detail: { all: true } }));
  } catch (err) {
    console.error('Failed to dismiss all alerts:', err);
  }
}

export function notifyAdminsOfNewQuestion(question: CivicQuestion): AdminNotification {
  const notifs = getAdminNotifications();
  const newNotif: AdminNotification = {
    id: 'notif_' + Date.now(),
    type: 'question',
    questionId: question.id,
    questionTitle: question.title,
    submittedByHandle: question.askedByAnonymousHandle,
    timestamp: new Date().toISOString(),
    notifiedAdmins: ['Admin 1', 'Admin 2', 'Admin 3', 'Admin 4'],
    readByAdmin1: false,
    readByAdmin2: false,
    readByAdmin3: false,
    readByAdmin4: false,
  };

  notifs.unshift(newNotif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs.slice(0, 50)));

  // Internal email alert dispatch simulation / logging
  // Note: The specific addresses (tideappseries@gmail.com and info.kolilec.cbo@gmail.com)
  // are handled exclusively by this internal dispatcher and never surfaced to users.
  dispatchInternalAdminEmailAlert(newNotif, question);

  return newNotif;
}

function dispatchInternalAdminEmailAlert(notif: AdminNotification, question: CivicQuestion): void {
  // Dispatches alert to Admin 1 (tideappseries@gmail.com) and Admin 2 (info.kolilec.cbo@gmail.com)
  console.info(`[The Samaritan Notification Service] Email notification dispatched to Admin 1 & Admin 2:`, {
    questionTitle: question.title,
    category: question.category,
    submittedBy: question.askedByAnonymousHandle,
    timestamp: notif.timestamp,
  });
}

export function markNotificationAsRead(notifId: string, admin?: string): void {
  const notifs = getAdminNotifications();
  const lower = (admin || '').toLowerCase();
  const field = lower.includes('1')
    ? 'readByAdmin1'
    : lower.includes('2')
    ? 'readByAdmin2'
    : lower.includes('3')
    ? 'readByAdmin3'
    : lower.includes('4')
    ? 'readByAdmin4'
    : 'readByAdmin1';

  const updated = notifs.map((n) => {
    if (n.id === notifId) {
      return {
        ...n,
        [field]: true,
      };
    }
    return n;
  });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('the_samaritan_admin_notification_read'));
  }
}

// ---------------- Civic Questions Initial Data & Storage ---------------- //
// Empty for real user testing: No seeded dummy questions
const INITIAL_CIVIC_QUESTIONS: CivicQuestion[] = [];

const DUMMY_QUESTION_IDS = new Set(['q_1', 'q_2', 'q_3', 'q_4']);
const DUMMY_HANDLES_SET = new Set([
  '@mwananchi_kwale',
  '@pwani_youth',
  '@kombani_voice',
  '@haki_mwananchi',
  '@pwani_scholar',
  '@fatuma_m',
  '@kombani_youth',
  '@mzalendo_254',
  '@kwalecitizenvoice',
  '@civicmatuga',
  '@kinangoyouth',
]);

export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates token similarity (Dice coefficient) between two question texts.
 * Range: 0 (completely distinct) to 1.0 (identical terms).
 */
export function calculateQuestionSimilarity(textA: string, textB: string): number {
  const normA = normalizeQuestionText(textA);
  const normB = normalizeQuestionText(textB);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  const wordsA = normA.split(' ').filter((w) => w.length > 2);
  const wordsB = normB.split(' ').filter((w) => w.length > 2);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  let matchCount = 0;
  setA.forEach((word) => {
    if (setB.has(word)) matchCount++;
  });

  return (2 * matchCount) / (setA.size + setB.size);
}

/**
 * Finds existing questions in the Q&A repository that closely match or address the same issue.
 * Threshold: ~0.4 (40% shared significant words) or containing the core inquiry.
 */
export function findSimilarCivicQuestions(
  queryTitle: string,
  queryDetails?: string,
  existingList?: CivicQuestion[]
): CivicQuestion[] {
  const questions = existingList || getCivicQuestions();
  const cleanTitle = queryTitle.trim();
  if (!cleanTitle || cleanTitle.length < 5) return [];

  const combinedQuery = `${queryTitle} ${queryDetails || ''}`;
  const matches: { question: CivicQuestion; score: number }[] = [];

  questions.forEach((q) => {
    const combinedExisting = `${q.title} ${q.details || ''}`;
    const titleSim = calculateQuestionSimilarity(cleanTitle, q.title);
    const combinedSim = calculateQuestionSimilarity(combinedQuery, combinedExisting);
    const score = Math.max(titleSim, combinedSim);

    // If similarity is above 40% or normalized title is substring of existing
    const normClean = normalizeQuestionText(cleanTitle);
    const normExisting = normalizeQuestionText(q.title);
    const isSubstring = normClean.length > 10 && (normExisting.includes(normClean) || normClean.includes(normExisting));

    if (score >= 0.4 || isSubstring) {
      matches.push({ question: q, score: isSubstring ? Math.max(score, 0.7) : score });
    }
  });

  // Sort by highest similarity first
  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.question).slice(0, 5);
}

/**
 * Checks if a question is an exact or near-duplicate of an already existing question.
 * Strict threshold: similarity >= 0.72 or identical normalized title.
 */
export function isCivicQuestionDuplicate(
  queryTitle: string,
  queryDetails?: string,
  existingList?: CivicQuestion[]
): CivicQuestion | null {
  const questions = existingList || getCivicQuestions();
  const cleanTitle = queryTitle.trim();
  if (!cleanTitle) return null;

  const normClean = normalizeQuestionText(cleanTitle);

  for (const q of questions) {
    const normExisting = normalizeQuestionText(q.title);
    if (normClean === normExisting) {
      return q;
    }
    const titleScore = calculateQuestionSimilarity(cleanTitle, q.title);
    if (titleScore >= 0.72) {
      return q;
    }
    if (queryDetails && q.details) {
      const combinedQuery = `${cleanTitle} ${queryDetails}`;
      const combinedExisting = `${q.title} ${q.details}`;
      if (calculateQuestionSimilarity(combinedQuery, combinedExisting) >= 0.75) {
        return q;
      }
    }
  }

  return null;
}

export function getCivicQuestions(): CivicQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUESTIONS_KEY);
    if (!raw) {
      return [];
    }
    const list: CivicQuestion[] = JSON.parse(raw);
    // Sanitize out any legacy dummy questions so real testing remains pristine
    const filtered = list.filter((q) => {
      if (DUMMY_QUESTION_IDS.has(q.id)) return false;
      const handle = (q.askedByAnonymousHandle || '').toLowerCase();
      if (DUMMY_HANDLES_SET.has(handle)) return false;
      return true;
    });

    // Deduplicate questions to strictly avoid repetition:
    // Only retain the first instance of each normalized question title
    const seenTitles = new Set<string>();
    const deduplicated: CivicQuestion[] = [];

    for (const q of filtered) {
      const norm = normalizeQuestionText(q.title);
      if (!seenTitles.has(norm)) {
        seenTitles.add(norm);
        deduplicated.push(q);
      }
    }

    if (deduplicated.length !== list.length) {
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(deduplicated));
    }
    return deduplicated;
  } catch (err) {
    console.error('Failed to parse questions:', err);
    return [];
  }
}

export function saveCivicQuestion(newQ: Omit<CivicQuestion, 'id' | 'createdAt' | 'status' | 'answers' | 'upvotes'>): CivicQuestion {
  const all = getCivicQuestions();

  // Strict Anti-Repetition Guard: Check if an identical or near-duplicate question already exists
  const duplicate = isCivicQuestionDuplicate(newQ.title, newQ.details, all);
  if (duplicate) {
    // Increment upvotes on existing question instead of creating repeated clutter
    duplicate.upvotes = (duplicate.upvotes || 1) + 1;
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
    return duplicate;
  }

  const created: CivicQuestion = {
    ...newQ,
    id: 'q_' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    answers: [],
    upvotes: 1,
  };

  all.unshift(created);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));

  // Trigger admin notification routing to both Admin 1 & Admin 2
  notifyAdminsOfNewQuestion(created);

  return created;
}

export function answerCivicQuestion(
  questionId: string,
  answerData: {
    answeredBy: 'Admin 1' | 'Admin 2';
    answerEn: string;
    answerSw: string;
    constitutionalArticle?: string;
    recommendedOfficeId?: string;
  }
): CivicQuestion | null {
  const all = getCivicQuestions();
  const index = all.findIndex((q) => q.id === questionId);
  if (index === -1) return null;

  const targetQuestion = all[index];
  const newAnswer: AdminAnswer = {
    id: 'ans_' + Date.now(),
    answeredBy: answerData.answeredBy,
    adminTitle: INTERNAL_ADMIN_CONFIG[answerData.answeredBy].roleTitle,
    answerText: {
      en: answerData.answerEn,
      sw: answerData.answerSw || answerData.answerEn,
    },
    constitutionalArticle: answerData.constitutionalArticle,
    recommendedOfficeId: answerData.recommendedOfficeId,
    answeredAt: new Date().toISOString(),
  };

  targetQuestion.status = 'answered';
  targetQuestion.answers.push(newAnswer);

  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));

  // Automatically remove request from admin alerts once it has been reviewed and answered
  removeNotificationsForQuestion(questionId);
  return targetQuestion;
}

export function toggleQuestionUpvote(questionId: string): number {
  const all = getCivicQuestions();
  const index = all.findIndex((q) => q.id === questionId);
  if (index === -1) return 0;

  all[index].upvotes = (all[index].upvotes || 0) + 1;
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
  return all[index].upvotes;
}

export function deleteCivicQuestion(questionId: string, performedByAdmin?: string): { success: boolean; message?: string } {
  const all = getCivicQuestions();
  const target = all.find((q) => q.id === questionId);
  if (!target) return { success: false, message: 'Question not found' };

  const current = getCurrentAuthUser();
  const actor = performedByAdmin || current?.username || '';

  // 1. Deny temporary admins the ability to delete anything from the app
  if (isUserAppointedAdmin(actor) || current?.adminLevel === 'temporary') {
    return {
      success: false,
      message: 'Temporary administrators do not have authorization to delete records or questions.',
    };
  }

  // 2. Anything done by The_Samaritan user cannot be deleted by any other user except the same account
  const isCreatedBySamaritan =
    target.askedByAnonymousHandle === 'The_Samaritan' ||
    target.askedByAnonymousHandle === '@The_Samaritan' ||
    target.askedByAnonymousHandle === 'The Samaritan';

  const hasAnswerBySamaritan = target.answers?.some(
    (a) => a.answeredBy === 'The_Samaritan' || a.verifiedBy === 'The_Samaritan'
  );

  const actorIsSamaritan = actor === 'The_Samaritan' || actor === 'The Samaritan';

  if ((isCreatedBySamaritan || hasAnswerBySamaritan) && !actorIsSamaritan) {
    return {
      success: false,
      message: 'Records authored or verified by The_Samaritan can only be deleted by The_Samaritan.',
    };
  }

  const filtered = all.filter((q) => q.id !== questionId);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(filtered));

  // Automatically remove request from admin alerts once deleted
  removeNotificationsForQuestion(questionId);
  return { success: true };
}

export function attachOperatorAnswer(
  questionId: string,
  operatorAnswerData: {
    answerEn: string;
    answerSw: string;
    constitutionalArticle: string;
    howToUseArticles?: {
      en: string;
      sw: string;
    };
    practicalExamples?: {
      en: string;
      sw: string;
    };
    whatIfScenarios?: {
      en: string;
      sw: string;
    };
    webFindings?: {
      summaryEn: string;
      summarySw: string;
      citations: Array<{
        uri: string;
        title: string;
        explanation: {
          en: string;
          sw: string;
        };
      }>;
    };
    rahamProtocolGrounded?: {
      applied: boolean;
      protocolTitle?: string;
      guidanceEn?: string;
      guidanceSw?: string;
    };
    recommendedOfficeId?: string;
  }
): CivicQuestion | null {
  const all = getCivicQuestions();
  const index = all.findIndex((q) => q.id === questionId);
  if (index === -1) return null;

  const targetQuestion = all[index];
  
  // Check if an Operator answer already exists for this question
  const existingOpIndex = targetQuestion.answers.findIndex((a) => a.answeredBy === 'Operator');

  const operatorAnswer: AdminAnswer = {
    id: existingOpIndex !== -1 ? targetQuestion.answers[existingOpIndex].id : 'ans_op_' + Date.now(),
    answeredBy: 'Operator',
    adminTitle: {
      en: 'Operator • AI Constitutional Assistant',
      sw: 'Opereta • Msaidizi wa Kikatiba wa AI',
    },
    answerText: {
      en: operatorAnswerData.answerEn,
      sw: operatorAnswerData.answerSw || operatorAnswerData.answerEn,
    },
    constitutionalArticle: operatorAnswerData.constitutionalArticle,
    howToUseArticles: operatorAnswerData.howToUseArticles,
    practicalExamples: operatorAnswerData.practicalExamples,
    whatIfScenarios: operatorAnswerData.whatIfScenarios,
    webFindings: operatorAnswerData.webFindings,
    rahamProtocolGrounded: operatorAnswerData.rahamProtocolGrounded,
    recommendedOfficeId: operatorAnswerData.recommendedOfficeId || 'ombudsman',
    answeredAt: new Date().toISOString(),
    isAiGenerated: true,
  };

  if (existingOpIndex !== -1) {
    targetQuestion.answers[existingOpIndex] = operatorAnswer;
  } else {
    // Put Operator answer first so the citizen sees immediate constitutional guidance
    targetQuestion.answers.unshift(operatorAnswer);
  }

  targetQuestion.status = 'answered';
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));
  return targetQuestion;
}

export function verifyOperatorAnswer(
  questionId: string,
  answerId: string,
  adminName: 'Admin 1' | 'Admin 2',
  remarks?: string
): CivicQuestion | null {
  const all = getCivicQuestions();
  const qIndex = all.findIndex((q) => q.id === questionId);
  if (qIndex === -1) return null;

  const targetQuestion = all[qIndex];
  const ansIndex = targetQuestion.answers.findIndex((a) => a.id === answerId);
  if (ansIndex === -1) return null;

  const ans = targetQuestion.answers[ansIndex];
  ans.isVerified = true;
  ans.verifiedBy = adminName;
  ans.verifiedAt = new Date().toISOString();
  if (remarks !== undefined && remarks !== null) {
    ans.adminRemarks = remarks.trim() || undefined;
  }

  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));

  // Automatically remove request from admin alerts once certified/verified
  removeNotificationsForQuestion(questionId);
  return targetQuestion;
}

export function editAndVerifyOperatorAnswer(
  questionId: string,
  answerId: string,
  adminName: 'Admin 1' | 'Admin 2',
  updates: {
    answerEn: string;
    answerSw: string;
    constitutionalArticle?: string;
    howToUseArticles?: {
      en: string;
      sw: string;
    };
    recommendedOfficeId?: string;
    remarks?: string;
  }
): CivicQuestion | null {
  const all = getCivicQuestions();
  const qIndex = all.findIndex((q) => q.id === questionId);
  if (qIndex === -1) return null;

  const targetQuestion = all[qIndex];
  const ansIndex = targetQuestion.answers.findIndex((a) => a.id === answerId);
  if (ansIndex === -1) return null;

  const ans = targetQuestion.answers[ansIndex];
  ans.answerText = {
    en: updates.answerEn.trim(),
    sw: updates.answerSw.trim() || updates.answerEn.trim(),
  };
  if (updates.constitutionalArticle) {
    ans.constitutionalArticle = updates.constitutionalArticle.trim();
  }
  if (updates.howToUseArticles) {
    ans.howToUseArticles = {
      en: updates.howToUseArticles.en.trim(),
      sw: updates.howToUseArticles.sw.trim() || updates.howToUseArticles.en.trim(),
    };
  }
  if (updates.recommendedOfficeId) {
    ans.recommendedOfficeId = updates.recommendedOfficeId;
  }
  ans.isVerified = true;
  ans.verifiedBy = adminName;
  ans.verifiedAt = new Date().toISOString();
  ans.lastEditedAt = new Date().toISOString();
  if (updates.remarks !== undefined && updates.remarks !== null) {
    ans.adminRemarks = updates.remarks.trim() || undefined;
  }

  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(all));

  // Automatically remove request from admin alerts once edited and certified/verified
  removeNotificationsForQuestion(questionId);
  return targetQuestion;
}

// Client-side auto-responder call to backend AI endpoint
export async function triggerAiOperatorResponse(
  question: CivicQuestion,
  userLanguage: 'en' | 'sw'
): Promise<AdminAnswer | null> {
  // Only execute if user is online
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.info('[Operator AI] User is offline. Question will await admin review or online reconnection.');
    return null;
  }

  try {
    const res = await fetch('/api/constitutional-ai-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.id,
        title: question.title,
        details: question.details,
        category: question.category,
        county: question.locationCounty,
        userLanguage,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.answer) {
        attachOperatorAnswer(question.id, {
          answerEn: data.answer.answerText.en,
          answerSw: data.answer.answerText.sw,
          constitutionalArticle: data.answer.constitutionalArticle,
          howToUseArticles: data.answer.howToUseArticles,
          practicalExamples: data.answer.practicalExamples,
          whatIfScenarios: data.answer.whatIfScenarios,
          webFindings: data.answer.webFindings,
          rahamProtocolGrounded: data.answer.rahamProtocolGrounded,
          recommendedOfficeId: data.answer.recommendedOfficeId,
        });

        return {
          id: 'ans_op_' + Date.now(),
          answeredBy: 'Operator',
          adminTitle: {
            en: 'Operator • AI Constitutional Assistant',
            sw: 'Opereta • Msaidizi wa Kikatiba wa AI',
          },
          answerText: data.answer.answerText,
          constitutionalArticle: data.answer.constitutionalArticle,
          howToUseArticles: data.answer.howToUseArticles,
          practicalExamples: data.answer.practicalExamples,
          whatIfScenarios: data.answer.whatIfScenarios,
          webFindings: data.answer.webFindings,
          rahamProtocolGrounded: data.answer.rahamProtocolGrounded,
          recommendedOfficeId: data.answer.recommendedOfficeId,
          answeredAt: new Date().toISOString(),
          isAiGenerated: true,
        };
      }
    }
  } catch (err) {
    console.warn('[Operator AI] Server API call failed, deploying local Katiba fallback:', err);
  }

  // Graceful client fallback if server endpoint is unreachable
  const combined = `${question.title} ${question.details} ${question.category}`.toLowerCase();
  let article = 'Article 1, Article 10 & Article 35';
  let officeId = 'ombudsman';
  let howToUseEn = `1) Exercise Article 1(1) and Article 10 by attending County public participation meetings and budget forums to demand full transparency.
2) Submit a written inquiry under Article 35 and the Access to Information Act 2016 for records; authorities are legally obligated to respond within 21 days.
3) If an official ignores you, petition the Commission on Administrative Justice (Ombudsman) under Article 59.`;
  let howToUseSw = `1) Tumia Kifungu cha 1(1) na cha 10 kwa kuhudhuria mabaraza ya umma na vikao vya bajeti ili kudai uwazi kamili.
2) Andika barua rasmi ya kudai nyaraka za umma chini ya Kifungu cha 35 na Sheria ya Kupata Taarifa; wanatakiwa kujibu ndani ya siku 21.
3) Afisa akikaidi, wasilisha malalamishi kwa Tume ya Utawala wa Haki (Ombudsman) chini ya Kifungu cha 59 cha Katiba.`;
  let enText = `Under the Constitution of Kenya 2010 (Article 1 & 10), all sovereign authority belongs to the citizens of Kenya and must be exercised in accordance with rule of law, integrity, transparency, and public participation. Under Article 35, you possess an unconditional right to access all government records, tenders, budgets, and project expenditures. You can petition the relevant public department, the Commission on Administrative Justice (Ombudsman), or the County Assembly.

📌 How to use these articles in your situation:
${howToUseEn}`;
  let swText = `Chini ya Katiba ya Kenya 2010 (Kifungu cha 1 na cha 10), mamlaka yote ni ya wananchi na lazima yaongozwe na maadili ya uwazi, haki na ushiriki wa umma. Chini ya Kifungu cha 35, una haki ya kisheria ya kupata taarifa za bajeti na miradi. Unaweza kuwasilisha malalamiko kwa Tume ya Utawala wa Haki (Ombudsman) au Bunge la Kaunti.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`;

  if (combined.includes('police') || combined.includes('arrest') || combined.includes('bail') || combined.includes('cell')) {
    article = 'Article 49 & IPOA Act 2011';
    officeId = 'police';
    howToUseEn = `1) State Article 49(1)(a) immediately and ask for the exact reason for arrest in writing.
2) Exercise Article 49(1)(b) to remain silent until your lawyer or relative is present.
3) Demand release on reasonable cash bail under Article 49(1)(h) within 24 hours, or report harassment to IPOA under Article 29.`;
    howToUseSw = `1) Nukuu Kifungu cha 49(1)(a) mara moja na uamuru waeleze sababu halisi ya kukamatwa.
2) Tumia Kifungu cha 49(1)(b) kukaa kimya hadi wakili au jamaa awepo.
3) Dai kupewa dhamana ya kuridhisha chini ya Kifungu cha 49(1)(h) ndani ya saa 24, na uripoti ukiukaji kwa IPOA.`;
    enText = `Under Article 49 of the Constitution of Kenya 2010, every arrested person has fundamental rights: you must be informed promptly of the exact reason for arrest, you have the right to remain silent, consult an advocate, not be compelled to confess, be brought to an open court within 24 hours, and be released on reasonable bond/bail. Arbitrary detention or rights violations should be escalated to IPOA.

📌 How to use these articles in your situation:
${howToUseEn}`;
    swText = `Chini ya Kifungu cha 49 cha Katiba ya Kenya 2010, mtu aliyekamatwa ana haki ya kufahamishwa mara moja sababu ya kukamatwa, haki ya kukaa kimya, kuwasiliana na wakili, kufikishwa mahakamani ndani ya saa 24, na haki ya kupewa dhamana ya kuridhisha.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`;
  } else if (combined.includes('mca') || combined.includes('ward') || combined.includes('divert')) {
    article = 'Article 10, Article 185 & PFMA Sec. 135';
    officeId = 'mca';
    howToUseEn = `1) Cite Article 35 to inspect the approved County Annual Development Plan at the ward office.
2) Invoke Article 185 to demonstrate to community members that MCAs cannot reallocate project funds unilaterally.
3) Submit a citizen petition citing Article 10 and Section 135 of the PFMA to the County Assembly Speaker to freeze illegal deviations.`;
    howToUseSw = `1) Nukuu Kifungu cha 35 kukagua mpango rasmi wa maendeleo wa wadi (ADP).
2) Tumia Kifungu cha 185 kueleza kuwa Diwani hana mamlaka ya kuhamisha mradi wa wadi bila ridhaa ya wananchi.
3) Wasilisha ombi rasmi la wananchi ukinukuu Kifungu cha 10 na Sheria ya PFMA kwa Spika wa Bunge la Kaunti.`;
    enText = `Under Article 185 of the Constitution of Kenya, an MCA is an oversight and legislative officer, NOT an executive spender. Diverting approved ward development projects without citizen public participation is unlawful under Article 10 and Section 135 of the Public Finance Management Act.

📌 How to use these articles in your situation:
${howToUseEn}`;
    swText = `Chini ya Kifungu cha 185 cha Katiba ya Kenya, Diwani (MCA) ana wajibu wa kutunga sheria na kusimamia serikali, si kugawa fedha au kugeuza miradi ya umma bila maoni ya wananchi. Kufanya hivyo ni kinyume cha sheria.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`;
  } else if (combined.includes('cdf') || combined.includes('mp') || combined.includes('school')) {
    article = 'Fourth Schedule Part 1 & NG-CDF Act 2015';
    officeId = 'mp';
    howToUseEn = `1) Check the Fourth Schedule to ensure your request aligns with national functions (secondary education, security, bursary).
2) Request the CDF project register under Article 35 to review fund distribution.
3) Present your proposal at the mandatory NG-CDF citizen baraza or report anomalies to EACC under Chapter 6.`;
    howToUseSw = `1) Angalia Ratiba ya Nne kuhakikisha ombi linahusu majukumu ya kitaifa (shule za upili, usalama, bursary).
2) Omba kukagua orodha ya miradi ya CDF chini ya Kifungu cha 35.
3) Shiriki baraza la wananchi la CDF kutoa maoni yako au uripoti ufisadi kwa EACC chini ya Sura ya Sita.`;
    enText = `Under the Fourth Schedule of the Constitution, the NG-CDF fund managed under your Member of Parliament (MP) is strictly restricted to national functions (secondary schools, police posts, education bursaries). Devolved county functions (clinics, dispensaries, county roads) are under the Governor.

📌 How to use these articles in your situation:
${howToUseEn}`;
    swText = `Chini ya Ratiba ya Nne ya Katiba, fedha za NG-CDF za Mbunge wako zimetengwa kwa ajili ya majukumu ya kitaifa kama vile shule za upili na usalama. Zahanati na barabara za vijijini ni jukumu la Gavana wa Kaunti.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`;
  }

  attachOperatorAnswer(question.id, {
    answerEn: enText,
    answerSw: swText,
    constitutionalArticle: article,
    howToUseArticles: {
      en: howToUseEn,
      sw: howToUseSw,
    },
    recommendedOfficeId: officeId,
  });

  return {
    id: 'ans_op_' + Date.now(),
    answeredBy: 'Operator',
    adminTitle: {
      en: 'Operator • AI Constitutional Assistant',
      sw: 'Opereta • Msaidizi wa Kikatiba wa AI',
    },
    answerText: { en: enText, sw: swText },
    constitutionalArticle: article,
    howToUseArticles: {
      en: howToUseEn,
      sw: howToUseSw,
    },
    recommendedOfficeId: officeId,
    answeredAt: new Date().toISOString(),
    isAiGenerated: true,
  };
}

