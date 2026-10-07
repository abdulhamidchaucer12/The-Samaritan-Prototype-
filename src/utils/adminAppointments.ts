export interface AdminAppointedProfile {
  adminHandle: string; // e.g. '@admin.kfe1', '@admin.kfe2', '@admin.kfe3', '@admin.kfe4', 'The_Samaritan'
  appointedName: string; // e.g. "Mwanaisha Omar"
  officialPosition: string; // e.g. "Program Associate"
  officialPositionSw: string; // e.g. "Afisa Mshirika wa Miradi"
  assignedScope: string; // e.g. "Civic Education & Curricula Oversight (Nationwide)"
  phone?: string;
  notes?: string;
  appointedBy: string; // 'The_Samaritan'
  appointedAt: string;
}

const APPOINTED_PROFILES_KEY = 'the_samaritan_appointed_admin_profiles_v1';
const USER_NOTIFICATIONS_KEY = 'the_samaritan_user_notifications_v1';

export const DEFAULT_ADMIN_APPOINTMENTS: Record<string, AdminAppointedProfile> = {
  '@admin.kfe1': {
    adminHandle: '@admin.kfe1',
    appointedName: 'Mwanaisha Omar',
    officialPosition: 'Program Associate',
    officialPositionSw: 'Afisa Mshirika wa Miradi',
    assignedScope: 'Curriculum Integrity, Lesson Authoring & Nationwide Civic Literacy',
    phone: '+254 700 112 233',
    notes: 'Directly appointed by The_Samaritan to lead civic course development, legal accuracy under Article 10, and citizen learning outcomes across Kenya.',
    appointedBy: 'The_Samaritan',
    appointedAt: '2026-01-10T08:00:00.000Z',
  },
  '@admin.kfe2': {
    adminHandle: '@admin.kfe2',
    appointedName: 'Abas Mwayanga',
    officialPosition: 'Project Officer',
    officialPositionSw: 'Afisa wa Miradi',
    assignedScope: 'County Community Mobilization, Q&A Verification & Devolution Barazas',
    phone: '+254 711 334 455',
    notes: 'Directly appointed by The_Samaritan to coordinate grassroots community engagement, citizen inquiries verification, and devolved governance public participation across all 47 counties.',
    appointedBy: 'The_Samaritan',
    appointedAt: '2026-01-10T08:00:00.000Z',
  },
  '@admin.kfe3': {
    adminHandle: '@admin.kfe3',
    appointedName: 'Salim Mwadzaya',
    officialPosition: 'Director of Compliance & Constitutional Adjudication',
    officialPositionSw: 'Mkurugenzi wa Uzingatiaji na Maadili ya Kikatiba',
    assignedScope: 'Due Process Enforcement, Appeals Review & Platform Integrity',
    phone: '+254 722 556 677',
    notes: 'Directly appointed by The_Samaritan to adjudicate Article 47 due process appeals, supervise system integrity, and enforce Chapter Six leadership standards.',
    appointedBy: 'The_Samaritan',
    appointedAt: '2026-01-10T08:00:00.000Z',
  },
  '@admin.kfe4': {
    adminHandle: '@admin.kfe4',
    appointedName: 'Fatuma Hassan',
    officialPosition: 'Executive Director & Certification Authority',
    officialPositionSw: 'Mkurugenzi Mtendaji na Mamlaka ya Vyeti',
    assignedScope: 'Institutional Governance, Cryptographic Registry & Strategic Partnerships',
    phone: '+254 733 778 899',
    notes: 'Directly appointed by The_Samaritan to oversee institutional administration, accredited certificate issuance, and countywide & national stakeholder partnerships.',
    appointedBy: 'The_Samaritan',
    appointedAt: '2026-01-10T08:00:00.000Z',
  },
  'The_Samaritan': {
    adminHandle: 'The_Samaritan',
    appointedName: 'Sir Chaucer (Abdulhamid Chaucer)',
    officialPosition: 'Platform Architect & Lead Civic Facilitator',
    officialPositionSw: 'Msanifu Mkuu wa Mfumo na Mwezeshaji Kiongozi',
    assignedScope: 'Supreme Administrative Authority & National Civic Education Architecture',
    phone: '+254 790 000 001',
    notes: 'Supreme administrative account and developer of The Samaritan platform. Exercises universal appointment powers and master oversight.',
    appointedBy: 'The_Samaritan',
    appointedAt: '2026-01-01T00:00:00.000Z',
  },
};

/**
 * Normalizes any admin handle or alias (e.g. "Admin 1" -> "@admin.kfe1")
 */
export function normalizeAdminKey(handleOrAlias: string): string {
  const clean = handleOrAlias.trim();
  if (clean === 'Admin 1' || clean === '@admin.kfe1') return '@admin.kfe1';
  if (clean === 'Admin 2' || clean === '@admin.kfe2') return '@admin.kfe2';
  if (clean === 'Admin 3' || clean === '@admin.kfe3') return '@admin.kfe3';
  if (clean === 'Admin 4' || clean === '@admin.kfe4') return '@admin.kfe4';
  if (clean === 'The_Samaritan' || clean === 'The Samaritan' || clean === '@The_Samaritan') return 'The_Samaritan';
  return clean;
}

/**
 * Retrieves all current admin appointments from persistent storage
 */
export function getAdminAppointmentProfiles(): Record<string, AdminAppointedProfile> {
  try {
    const raw = localStorage.getItem(APPOINTED_PROFILES_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTED_PROFILES_KEY, JSON.stringify(DEFAULT_ADMIN_APPOINTMENTS));
      return DEFAULT_ADMIN_APPOINTMENTS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ADMIN_APPOINTMENTS, ...parsed };
  } catch (e) {
    return DEFAULT_ADMIN_APPOINTMENTS;
  }
}

/**
 * Gets a specific admin's appointed profile
 */
export function getAdminAppointedProfile(handleOrAlias: string): AdminAppointedProfile {
  const normalized = normalizeAdminKey(handleOrAlias);
  const profiles = getAdminAppointmentProfiles();
  if (profiles[normalized]) return profiles[normalized];

  // Fallback defaults
  return {
    adminHandle: normalized,
    appointedName: normalized,
    officialPosition: 'Civic Administrator',
    officialPositionSw: 'Msimamizi wa Kiraia',
    assignedScope: 'Devolution & Civic Education Support',
    appointedBy: 'The_Samaritan',
    appointedAt: new Date().toISOString(),
  };
}

/**
 * Appoints or updates an admin's name, position, and scope.
 * EXCLUSIVE AUTHORITY: Only The_Samaritan can execute this!
 */
export function appointAdminProfile(
  adminHandle: string,
  data: {
    appointedName: string;
    officialPosition: string;
    officialPositionSw?: string;
    assignedScope?: string;
    phone?: string;
    notes?: string;
  },
  actor: string
): { success: boolean; message: string; record?: AdminAppointedProfile } {
  const cleanActor = (actor || '').trim();
  const lowerActor = cleanActor.toLowerCase().replace(/^@/, '');
  const isSamaritan =
    cleanActor === 'The_Samaritan' ||
    cleanActor === 'The Samaritan' ||
    cleanActor === '@The_Samaritan' ||
    lowerActor === 'the_samaritan' ||
    lowerActor === 'the samaritan' ||
    lowerActor === 'sir chaucer';

  if (!isSamaritan) {
    return {
      success: false,
      message: 'Permission Denied: Only The_Samaritan possesses Super Authority to appoint names and positions for administrators.',
    };
  }

  const normalizedTarget = normalizeAdminKey(adminHandle);
  const currentProfiles = getAdminAppointmentProfiles();
  const existing = currentProfiles[normalizedTarget] || {
    adminHandle: normalizedTarget,
    appointedName: '',
    officialPosition: '',
    officialPositionSw: '',
    assignedScope: '',
    appointedBy: 'The_Samaritan',
    appointedAt: new Date().toISOString(),
  };

  const updatedRecord: AdminAppointedProfile = {
    ...existing,
    appointedName: data.appointedName.trim() || existing.appointedName,
    officialPosition: data.officialPosition.trim() || existing.officialPosition,
    officialPositionSw:
      data.officialPositionSw?.trim() ||
      data.officialPosition.trim() ||
      existing.officialPositionSw,
    assignedScope: data.assignedScope?.trim() || existing.assignedScope,
    phone: data.phone?.trim() || existing.phone,
    notes: data.notes?.trim() || existing.notes,
    appointedBy: 'The_Samaritan',
    appointedAt: new Date().toISOString(),
  };

  currentProfiles[normalizedTarget] = updatedRecord;
  localStorage.setItem(APPOINTED_PROFILES_KEY, JSON.stringify(currentProfiles));

  // Automatically transmit official appointment notice
  try {
    const rawNotifs = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
    const isSelfTarget = normalizedTarget === 'The_Samaritan';
    const newNotice = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      recipientUsername: normalizedTarget,
      senderHandle: 'The_Samaritan',
      senderTitle: 'Platform Architect & Lead Civic Facilitator',
      title: isSelfTarget ? 'Self-Identity Allocation Updated' : 'Official Executive Appointment from The_Samaritan',
      message: isSelfTarget
        ? `Your The_Samaritan account identity has been updated to ${updatedRecord.officialPosition} (${updatedRecord.appointedName}). Platform addressing now reflects this allocation.`
        : `You have been officially designated as ${updatedRecord.officialPosition} (${updatedRecord.appointedName}) by The_Samaritan. Scope: ${updatedRecord.assignedScope}. All platform activities and verifications now reflect your appointed title.`,
      category: 'appointment',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    notifs.unshift(newNotice);
    localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(notifs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('the_samaritan_notifications_updated', { detail: newNotice }));
    }
  } catch (e) {
    // ignore
  }

  return {
    success: true,
    message: normalizedTarget === 'The_Samaritan'
      ? `Self-Allocation Confirmed: Your identity has been set to ${updatedRecord.officialPosition} (${updatedRecord.appointedName}).`
      : `Appointment Confirmed: ${normalizedTarget} is now officially designated as ${updatedRecord.officialPosition} (${updatedRecord.appointedName}).`,
    record: updatedRecord,
  };
}

/**
 * Gets the first name Y of an appointed administrator.
 * e.g. "Mwanaisha Omar" -> "Mwanaisha"
 * e.g. "Abas Mwayanga" -> "Abas"
 * e.g. "Salim Mwadzaya" -> "Salim"
 * e.g. "Fatuma Hassan" -> "Fatuma"
 * For The_Samaritan: returns first name from allocated profile or "Chaucer"
 */
export function getAdminAllocatedFirstName(handleOrAlias: string): string {
  const normalized = normalizeAdminKey(handleOrAlias);
  if (normalized === 'The_Samaritan') {
    const profile = getAdminAppointedProfile('The_Samaritan');
    const fullName = (profile.appointedName || '').trim();
    if (!fullName) return 'Chaucer';
    const cleaned = fullName.replace(/\s*\([^)]*\)/g, '').trim() || fullName;
    const parts = cleaned.split(/\s+/);
    if (
      parts.length > 1 &&
      ['sir', 'dr', 'dr.', 'prof', 'prof.', 'hon', 'hon.', 'mr', 'mr.', 'ms', 'ms.'].includes(parts[0].toLowerCase())
    ) {
      return parts[1];
    }
    return parts[0] || 'Chaucer';
  }

  const profile = getAdminAppointedProfile(normalized);
  const fullName = (profile.appointedName || '').trim();
  if (!fullName) {
    if (normalized === '@admin.kfe1') return '1';
    if (normalized === '@admin.kfe2') return '2';
    if (normalized === '@admin.kfe3') return '3';
    if (normalized === '@admin.kfe4') return '4';
    return '';
  }
  const firstName = fullName.split(/\s+/)[0] || '';
  return firstName;
}

/**
 * Returns how the platform officially addresses this administrator:
 * For Admin 1 to Admin 4: "Admin Y" with Y being the first name of the admin!
 * e.g. If Admin 1 is allocated name "Mwanaisha Omar", Y is "Mwanaisha" -> addressed as "Admin Mwanaisha"
 * e.g. If Admin 2 is allocated name "Abas Mwayanga", Y is "Abas" -> addressed as "Admin Abas"
 * e.g. If Admin 3 is allocated name "Salim Mwadzaya", Y is "Salim" -> addressed as "Admin Salim"
 * e.g. If Admin 4 is allocated name "Fatuma Hassan", Y is "Fatuma" -> addressed as "Admin Fatuma"
 * For The_Samaritan: returns the allocated self-name/title (default: "Sir Chaucer")
 * For others: returns the handle/alias
 */
export function getAdminPlatformAddressingName(handleOrAlias?: string | null): string {
  if (!handleOrAlias) return 'Admin';
  const clean = handleOrAlias.trim();
  const lower = clean.toLowerCase().replace(/^@/, '');
  
  if (
    lower === 'the_samaritan' ||
    lower === 'the samaritan' ||
    lower === 'sir chaucer' ||
    clean === 'The_Samaritan'
  ) {
    const profile = getAdminAppointedProfile('The_Samaritan');
    const appointed = (profile.appointedName || '').trim();
    if (appointed) {
      const match = appointed.match(/^([^(]+)/);
      const titleName = match ? match[1].trim() : appointed;
      return titleName || appointed;
    }
    return 'Sir Chaucer';
  }

  const normalized = normalizeAdminKey(clean);
  const firstName = getAdminAllocatedFirstName(normalized);
  if (firstName && firstName !== '1' && firstName !== '2' && firstName !== '3' && firstName !== '4') {
    return `Admin ${firstName}`;
  }

  // Fallbacks if no specific first name
  if (normalized === '@admin.kfe1' || lower === 'admin 1' || lower === 'admin.kfe1' || lower === 'admin1') {
    return 'Admin 1';
  }
  if (normalized === '@admin.kfe2' || lower === 'admin 2' || lower === 'admin.kfe2' || lower === 'admin2') {
    return 'Admin 2';
  }
  if (normalized === '@admin.kfe3' || lower === 'admin 3' || lower === 'admin.kfe3' || lower === 'admin3') {
    return 'Admin 3';
  }
  if (normalized === '@admin.kfe4' || lower === 'admin 4' || lower === 'admin.kfe4' || lower === 'admin4') {
    return 'Admin 4';
  }

  return clean;
}

/**
 * Allocates or re-assigns the name for oneself (The_Samaritan) or Admin 1 through Admin 4.
 * Exclusive Super Authority: Only The_Samaritan can allocate names.
 */
export function allocateAdminName(
  adminKey: '@admin.kfe1' | '@admin.kfe2' | '@admin.kfe3' | '@admin.kfe4' | 'The_Samaritan' | string,
  allocatedFullName: string,
  actor: string,
  extra?: {
    officialPosition?: string;
    officialPositionSw?: string;
    assignedScope?: string;
    notes?: string;
  }
): { success: boolean; message: string; addressingName: string; record?: AdminAppointedProfile } {
  const normalizedKey = normalizeAdminKey(adminKey);
  const cleanActor = (actor || '').trim().toLowerCase().replace(/^@/, '');
  const isSamaritan = cleanActor === 'the_samaritan' || cleanActor === 'the samaritan' || cleanActor === 'sir chaucer';

  if (!isSamaritan) {
    return {
      success: false,
      message: 'Super Authority Restriction: Only The_Samaritan possesses executive power to allocate names to administrators.',
      addressingName: getAdminPlatformAddressingName(normalizedKey),
    };
  }

  const trimmedName = allocatedFullName.trim();
  if (!trimmedName) {
    return {
      success: false,
      message: 'Full name cannot be empty. Please enter the name for this administrator.',
      addressingName: getAdminPlatformAddressingName(normalizedKey),
    };
  }

  const result = appointAdminProfile(
    normalizedKey,
    {
      appointedName: trimmedName,
      officialPosition: extra?.officialPosition || getAdminAppointedProfile(normalizedKey).officialPosition,
      officialPositionSw: extra?.officialPositionSw || getAdminAppointedProfile(normalizedKey).officialPositionSw,
      assignedScope: extra?.assignedScope || getAdminAppointedProfile(normalizedKey).assignedScope,
      notes: extra?.notes || getAdminAppointedProfile(normalizedKey).notes,
    },
    'The_Samaritan'
  );

  const addressingName = getAdminPlatformAddressingName(normalizedKey);

  // If allocating for oneself (The_Samaritan), update active session's displayName if stored
  if (normalizedKey === 'The_Samaritan' && typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('the_samaritan_auth_user_v1');
      if (raw) {
        const u = JSON.parse(raw);
        if (u && (u.username === 'The_Samaritan' || u.username?.toLowerCase() === '@the_samaritan')) {
          u.displayName = addressingName;
          localStorage.setItem('the_samaritan_auth_user_v1', JSON.stringify(u));
        }
      }
      const rawSession = sessionStorage.getItem('the_samaritan_session_auth_user_v1');
      if (rawSession) {
        const su = JSON.parse(rawSession);
        if (su && (su.username === 'The_Samaritan' || su.username?.toLowerCase() === '@the_samaritan')) {
          su.displayName = addressingName;
          sessionStorage.setItem('the_samaritan_session_auth_user_v1', JSON.stringify(su));
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('the_samaritan_admin_names_updated', {
        detail: {
          adminKey: normalizedKey,
          appointedName: trimmedName,
          addressingName,
          record: result.record,
        },
      })
    );
  }

  return {
    success: result.success,
    message:
      normalizedKey === 'The_Samaritan'
        ? `Self-Allocation Confirmed: Your name in The_Samaritan account has been officially set to "${trimmedName}". The Platform will address you as "${addressingName}".`
        : `Allocation Confirmed: ${normalizedKey} has been officially designated as "${trimmedName}". When logging into the platform, they will now be addressed as "${addressingName}".`,
    addressingName,
    record: result.record,
  };
}

/**
 * Resets all administrator appointments back to default Kenyan devolution profiles.
 * Exclusive Super Authority: Only The_Samaritan.
 */
export function resetAdminAppointmentsToDefault(
  actor: string
): { success: boolean; message: string } {
  const cleanActor = (actor || '').trim().toLowerCase().replace(/^@/, '');
  const isSamaritan = cleanActor === 'the_samaritan' || cleanActor === 'the samaritan';

  if (!isSamaritan) {
    return {
      success: false,
      message: 'Permission Denied: Only The_Samaritan can reset administrative appointments.',
    };
  }

  localStorage.setItem(APPOINTED_PROFILES_KEY, JSON.stringify(DEFAULT_ADMIN_APPOINTMENTS));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('the_samaritan_admin_names_updated', {
        detail: { reset: true, profiles: DEFAULT_ADMIN_APPOINTMENTS },
      })
    );
  }

  return {
    success: true,
    message: 'All administrative profiles have been restored to default Kenyan devolution leadership defaults.',
  };
}

/**
 * Returns a human-friendly string for display across badges, Q&A, certificates, and dashboard
 */
export function getFormattedAdminDisplay(
  handleOrAlias: string,
  language: 'en' | 'sw' = 'en'
): { name: string; position: string; fullTitle: string; addressingName: string } {
  const profile = getAdminAppointedProfile(handleOrAlias);
  const position = language === 'sw' ? profile.officialPositionSw : profile.officialPosition;
  const addressingName = getAdminPlatformAddressingName(handleOrAlias);
  const fullTitle = `${addressingName} (${profile.adminHandle}) • ${position} [${profile.appointedName}]`;
  return {
    name: profile.appointedName,
    position,
    fullTitle,
    addressingName,
  };
}
