import QRCode from 'qrcode';
import { awardTokensToUser } from './facilitatorTokenRegistry';
import { sendDirectUserNotification } from './adminManagement';
import { IssuedCertificateRecord, registerIssuedCertificate } from './certificateRegistry';

export const MERIT_GRADUATES_STORAGE_KEY = 'the_samaritan_merit_graduates_v1';
export const MERIT_EXAM_SITTINGS_KEY = 'the_samaritan_merit_exam_sittings_v1';

export interface MeritGraduateRecord {
  username: string;
  recipientName: string;
  graduatedAt: string;
  score: number; // out of 40 (must be > 30)
  totalMarks: 40;
  percentage: number;
  certificateId: string;
  tokensAwarded: 5000;
  qrProfileUrl: string;
  qrDataUrl: string;
  badgeAwarded: 'gold_double_tick';
}

export function getAllMeritGraduates(): Record<string, MeritGraduateRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(MERIT_GRADUATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read merit graduates:', err);
    return {};
  }
}

export function saveMeritGraduates(records: Record<string, MeritGraduateRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MERIT_GRADUATES_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new CustomEvent('the_samaritan_merit_graduated'));
    window.dispatchEvent(new CustomEvent('the_samaritan_role_updated'));
  } catch (err) {
    console.error('Failed to save merit graduates:', err);
  }
}

export function isUserMeritGraduate(username?: string | null): boolean {
  if (!username) return false;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  if (!clean) return false;
  const graduates = getAllMeritGraduates();
  return Boolean(graduates[clean]);
}

export function getMeritGraduateRecord(username?: string | null): MeritGraduateRecord | null {
  if (!username) return null;
  const clean = username.trim().toLowerCase().replace(/^@/, '');
  if (!clean) return null;
  const graduates = getAllMeritGraduates();
  return graduates[clean] || null;
}

/**
 * Generates the QR profile verification URL for a user
 */
export function buildUserProfileQrUrl(username: string, certId?: string): string {
  const clean = username.trim().replace(/^@/, '');
  const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://the-samaritan.ke';
  const certParam = certId ? `&meritCert=${encodeURIComponent(certId)}` : '';
  return `${baseUrl}/?tab=profile&user=${encodeURIComponent(clean)}${certParam}`;
}

/**
 * Generates a high-resolution QR code data URL (PNG) that points to the user's profile on The Samaritan platform.
 */
export async function generateProfileQrDataUrl(username: string, certId?: string): Promise<{ qrUrl: string; qrDataUrl: string }> {
  const qrUrl = buildUserProfileQrUrl(username, certId);
  try {
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#1e293b', // Deep slate for high scan reliability
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
    return { qrUrl, qrDataUrl };
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    // Fallback QR data placeholder
    return { qrUrl, qrDataUrl: '' };
  }
}

/**
 * Awards the complete Graduation Package when a user completes all 100 civic courses
 * and scores more than 30 marks (> 30 / 40) on the final timed exam:
 * 1. Certificate of Merit (with auto-installed QR code to user profile)
 * 2. Executive Double Verification Badge (gold_double_tick)
 * 3. 5000 Tokens in their account
 */
export async function recordMeritGraduation(
  username: string,
  score: number,
  recipientName?: string
): Promise<{ success: boolean; record?: MeritGraduateRecord; message: string }> {
  const cleanUsername = username.trim().replace(/^@/, '');
  if (!cleanUsername) {
    return { success: false, message: 'Invalid username for graduation.' };
  }

  if (score <= 30) {
    return {
      success: false,
      message: `A score greater than 30 marks (>30/40) is required for the Certificate of Merit. You scored ${score}/40.`,
    };
  }

  const cleanName = recipientName?.trim() || cleanUsername;
  const certificateId = `KFE-MERIT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // 1. Generate auto-installed QR code for the Certificate of Merit
  const { qrUrl, qrDataUrl } = await generateProfileQrDataUrl(cleanUsername, certificateId);

  // 2. Register Certificate of Merit in Certificate Registry
  const now = new Date();
  const certRecord: IssuedCertificateRecord = {
    id: certificateId,
    courseId: 'grand_100_civic_courses_merit',
    userKey: cleanUsername,
    recipientName: cleanName,
    score,
    total: 40,
    grade: score >= 38 ? 'Distinction With High Honors' : 'Distinction',
    issuedAt: now.toISOString(),
    formattedDate: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    downloadCount: 1,
    checksum: `MERIT-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: 'verified',
  };
  registerIssuedCertificate(certRecord);

  // 3. Save Merit Graduate Record (enabling double verification badge)
  const graduates = getAllMeritGraduates();
  const gradRecord: MeritGraduateRecord = {
    username: cleanUsername,
    recipientName: cleanName,
    graduatedAt: new Date().toISOString(),
    score,
    totalMarks: 40,
    percentage: Math.round((score / 40) * 100),
    certificateId,
    tokensAwarded: 5000,
    qrProfileUrl: qrUrl,
    qrDataUrl,
    badgeAwarded: 'gold_double_tick',
  };

  graduates[cleanUsername.toLowerCase()] = gradRecord;
  saveMeritGraduates(graduates);

  // 4. Automatically award 5,000 Samaritan Facilitator Tokens to user's account
  awardTokensToUser(
    cleanUsername,
    5000,
    `Grand Merit Award for 100 Civic Courses Completion & Grand Exam Distinction (${score}/40 Marks)`,
    'Merit Graduation 100-Courses',
    'The_Samaritan'
  );

  // 5. Send celebratory direct in-app notification to the graduate
  sendDirectUserNotification(
    cleanUsername,
    `🎓 GRAND CIVIC MERIT DISTINCTION: You scored ${score}/40 on the 100 Civic Courses Final Exam! In recognition of your mastery of the complete Kenyan Civic Curriculum, you have officially received: 1) The Certificate of Merit with your personal Profile Verification QR Code, 2) The Executive Double Verification Badge (Gold Double-Tick) on your account, and 3) 5,000 Samaritan Facilitator Tokens!`,
    'system_announcement'
  );

  return {
    success: true,
    record: gradRecord,
    message: `Congratulations! Certificate of Merit, Executive Double Verification Badge, and 5,000 Tokens awarded to @${cleanUsername}.`,
  };
}
