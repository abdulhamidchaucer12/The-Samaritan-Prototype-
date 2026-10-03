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
  const cleanActor = actor.trim();
  const isSamaritan =
    cleanActor === 'The_Samaritan' ||
    cleanActor === 'The Samaritan' ||
    cleanActor === '@The_Samaritan';

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

  // Automatically transmit official appointment notice to the appointed administrator
  try {
    const rawNotifs = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
    const newNotice = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      recipientUsername: normalizedTarget,
      senderHandle: 'The_Samaritan',
      senderTitle: 'Platform Architect & Lead Civic Facilitator',
      title: 'Official Executive Appointment from The_Samaritan',
      message: `You have been officially designated as ${updatedRecord.officialPosition} (${updatedRecord.appointedName}) by The_Samaritan. Scope: ${updatedRecord.assignedScope}. All platform activities and verifications now reflect your appointed title.`,
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
    message: `Appointment Confirmed: ${normalizedTarget} is now officially designated as ${updatedRecord.officialPosition} (${updatedRecord.appointedName}).`,
    record: updatedRecord,
  };
}

/**
 * Returns a human-friendly string for display across badges, Q&A, certificates, and dashboard
 */
export function getFormattedAdminDisplay(
  handleOrAlias: string,
  language: 'en' | 'sw' = 'en'
): { name: string; position: string; fullTitle: string } {
  const profile = getAdminAppointedProfile(handleOrAlias);
  const position = language === 'sw' ? profile.officialPositionSw : profile.officialPosition;
  const fullTitle = `${profile.adminHandle} • ${position} (${profile.appointedName})`;
  return {
    name: profile.appointedName,
    position,
    fullTitle,
  };
}
