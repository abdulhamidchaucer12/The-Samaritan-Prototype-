// Certificate Registry & Anti-Duplicate Issuance System
// Enforces that the same user cannot generate or alter the same certificate twice for a course.

export interface IssuedCertificateRecord {
  id: string; // Unique serial number e.g. KFE-CIVIC-2026-L1-4921
  courseId: string;
  userKey: string; // Normalized user handle or device signature
  recipientName: string;
  score: number;
  total: number;
  grade: string;
  issuedAt: string; // ISO date string
  formattedDate: string;
  downloadCount: number;
  checksum: string;
  status?: 'issued' | 'verified' | 'revoked';
  verifiedByAdmin?: string;
  verifiedAt?: string;
}

const ISSUED_CERTIFICATES_KEY = 'the_samaritan_issued_certificates_v2';
const USER_DEVICE_KEY = 'the_samaritan_device_sig_v1';

function getDeviceSignature(): string {
  if (typeof window === 'undefined') return 'server_session';
  let sig = localStorage.getItem(USER_DEVICE_KEY);
  if (!sig) {
    sig = 'cit_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem(USER_DEVICE_KEY, sig);
  }
  return sig;
}

export function getUserIdentifier(username?: string | null): string {
  if (username && username.trim().length > 0) {
    return username.trim().toLowerCase();
  }
  return getDeviceSignature();
}

export function getAllIssuedCertificates(): IssuedCertificateRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ISSUED_CERTIFICATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading issued certificates:', e);
    return [];
  }
}

export function saveIssuedCertificates(records: IssuedCertificateRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ISSUED_CERTIFICATES_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving issued certificates:', e);
  }
}

/**
 * Checks if a certificate has already been issued to this user for the specified course.
 */
export function getIssuedCertificate(
  courseId: string,
  userKey: string
): IssuedCertificateRecord | null {
  const records = getAllIssuedCertificates();
  const normalizedKey = userKey.trim().toLowerCase();
  
  const found = records.find(
    (r) => r.courseId === courseId && r.userKey.toLowerCase() === normalizedKey
  );
  return found || null;
}

/**
 * Registers an official certificate.
 * Returns failure if the user already generated a certificate for this course.
 */
export function registerAndIssueCertificate(
  courseId: string,
  userKey: string,
  recipientName: string,
  score: number,
  total: number = 10
): { success: boolean; record: IssuedCertificateRecord; isDuplicate: boolean; message: string } {
  const normalizedKey = userKey.trim().toLowerCase();
  const cleanName = recipientName.trim();

  // 1. Check if already issued
  const existing = getIssuedCertificate(courseId, normalizedKey);
  if (existing) {
    return {
      success: false,
      record: existing,
      isDuplicate: true,
      message: `A course certificate has already been officially issued to "${existing.recipientName}". In accordance with certification standards, duplicate generation is not permitted for the same user.`,
    };
  }

  // 2. Generate unique serial number & checksum
  const year = new Date().getFullYear();
  const cleanCourseCode = courseId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const serialNumber = `KFE-CIVIC-${year}-${cleanCourseCode}-${randomSuffix}`;
  
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 90 ? 'Distinction with Honors' : percentage >= 70 ? 'Distinction' : 'Credit';

  const newRecord: IssuedCertificateRecord = {
    id: serialNumber,
    courseId,
    userKey: normalizedKey,
    recipientName: cleanName || 'Kenyan Citizen',
    score,
    total,
    grade,
    issuedAt: now.toISOString(),
    formattedDate,
    downloadCount: 1,
    checksum: btoa(`${serialNumber}:${cleanName}:${score}:${now.getTime()}`).slice(0, 16),
  };

  const records = getAllIssuedCertificates();
  records.push(newRecord);
  saveIssuedCertificates(records);

  return {
    success: true,
    record: newRecord,
    isDuplicate: false,
    message: 'Official certificate generated and registered successfully.',
  };
}

/**
 * Increment the download count when an already-issued certificate is downloaded again.
 */
export function incrementCertificateDownloadCount(serialNumber: string): void {
  const records = getAllIssuedCertificates();
  const idx = records.findIndex((r) => r.id === serialNumber);
  if (idx !== -1) {
    records[idx].downloadCount += 1;
    saveIssuedCertificates(records);
  }
}
