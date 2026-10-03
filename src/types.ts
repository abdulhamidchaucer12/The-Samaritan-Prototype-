/**
 * The Samaritan - Civic Education & Government Literacy Platform
 * Types definition
 * Implemented for Kwale Focus Empowerment CBO (KFE)
 * Developer: Abdulhamid Chaucer
 * Implementation Scope: The Republic of Kenya
 * Implementation Period: Ongoing
 */

export type Language = 'en' | 'sw';

export type Theme = 'light' | 'dark';

export type GovernmentLevel = 'national' | 'county' | 'independent' | 'public_service';

export type GovernmentBranch = 'executive' | 'legislature' | 'judiciary' | 'commission' | 'oversight';

export type SelectionMethod = 'elected' | 'nominated' | 'appointed' | 'constitutional_process' | 'statutory_process';

export interface OfficeProfile {
  id: string;
  name: {
    en: string;
    sw: string;
  };
  level: GovernmentLevel;
  branch: GovernmentBranch;
  selectionMethod: SelectionMethod;
  summary: {
    en: string;
    sw: string;
  };
  responsibilities: {
    en: string[];
    sw: string[];
  };
  whatItDoesNotDo: {
    en: string[];
    sw: string[];
  };
  howSelected: {
    en: string;
    sw: string;
  };
  qualifications: {
    en: string[];
    sw: string[];
  };
  termOfOffice: {
    en: string;
    sw: string;
  };
  oversightAndAccountability: {
    en: string;
    sw: string;
  };
  removalProcess?: {
    en: string;
    sw: string;
  };
  legalReferences: {
    en: string[];
    sw: string[];
  };
  citizenEngagement: {
    en: string;
    sw: string;
  };
  relatedOfficeIds: string[];
  iconName: string;
  badgeColor?: string;
  keyStats?: {
    totalNumber?: string;
    establishedBy?: string;
  };
  lastReviewedDate?: string;
  contentVersion?: string;
}

export interface LessonSection {
  id?: string;
  constitutionalArticle?: string;
  title: {
    en: string;
    sw: string;
  };
  content: {
    en: string;
    sw: string;
  };
  bulletPoints?: {
    en: string[];
    sw: string[];
  };
  callout?: {
    en: string;
    sw: string;
  };
}

export interface CivicLesson {
  id: string;
  lessonNumber: number;
  title: {
    en: string;
    sw: string;
  };
  summary: {
    en: string;
    sw: string;
  };
  category: 'constitution' | 'government' | 'elections' | 'integrity' | 'participation' | 'devolution' | 'human_rights' | (string & {});
  readTimeMinutes: number;
  sections: LessonSection[];
  keyTerms: {
    term: { en: string; sw: string };
    definition: { en: string; sw: string };
  }[];
  citizenActionTip: {
    en: string;
    sw: string;
  };
  isDailyCourse?: boolean;
  isSupplementary?: boolean;
  isCustom?: boolean;
  developedByAi?: boolean;
  authorAdmin?: string;
  author?: string;
  publishedDate?: string;
  dayBadge?: string;
  quizzes?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: {
    en: string;
    sw: string;
  };
  options: {
    id: string;
    text: {
      en: string;
      sw: string;
    };
  }[];
  correctOptionId: string;
  correctAnswer?: number;
  correctAnswerIndex?: number;
  constitutionalArticle?: string;
  explanation: {
    en: string;
    sw: string;
  };
  category: 'general' | 'county' | 'parliament' | 'judiciary' | 'participation' | 'rights' | 'constitution' | 'government' | string;
  isScenario?: boolean;
}

export interface UserCivicProgress {
  completedLessons: string[];
  courseQuizScores?: Record<string, { score: number; total: number; date: string; passed: boolean }>;
  courseCertificatesEarned?: Record<string, { earnedDate: string; certificateId: string; recipientName: string; score: number }>;
  quizScores: Record<string, { score: number; total: number; date: string }>;
  bookmarkedOffices: string[];
  recentlyViewedOffices: string[];
  lastActiveDate: string;
  offlinePackDownloaded: boolean;
  offlinePackDate?: string;
  notes?: Record<string, string>;
}

export interface FacilitatorSlide {
  id: string;
  stepNumber: number;
  title: {
    en: string;
    sw: string;
  };
  subTitle: {
    en: string;
    sw: string;
  };
  keyTakeaways: {
    en: string[];
    sw: string[];
  };
  talkingPoints: {
    en: string[];
    sw: string[];
  };
  interactivePrompt: {
    en: string;
    sw: string;
  };
  constitutionalArticle: string;
}

export interface FeedbackSubmission {
  id: string;
  senderName: string;
  contact: string;
  location: string;
  feedbackType: 'general' | 'baraza_request' | 'content_suggestion' | 'partnership';
  message: string;
  dateSubmitted: string;
}

export interface AdminAnswer {
  id: string;
  answeredBy: 'Admin 1' | 'Admin 2' | 'Admin 3' | 'Admin 4' | 'Operator' | string;
  adminTitle: {
    en: string;
    sw: string;
  };
  answerText: {
    en: string;
    sw: string;
  };
  constitutionalArticle?: string;
  recommendedOfficeId?: string;
  howToUseArticles?: {
    en: string;
    sw: string;
  };
  answeredAt: string;
  lastEditedAt?: string;
  isAiGenerated?: boolean;
  isVerified?: boolean;
  verifiedBy?: 'Admin 1' | 'Admin 2' | 'Admin 3' | 'Admin 4' | string;
  verifiedAt?: string;
  adminRemarks?: string;
}

export interface CivicQuestion {
  id: string;
  title: string;
  details: string;
  category: 'county' | 'national' | 'cdf_funds' | 'police_rights' | 'integrity' | 'participation' | 'general';
  locationCounty?: string;
  askedByAnonymousHandle: string;
  createdAt: string;
  status: 'pending' | 'answered';
  answers: AdminAnswer[];
  upvotes: number;
  isPinned?: boolean;
}

export interface AuthUser {
  id: string;
  username: string; // e.g. "@mwananchi_kwale", "The_Samaritan", "@admin.kfe1", "@admin.kfe2", "@admin.kfe3", "@admin.kfe4"
  role: 'anonymous' | 'admin';
  adminLevel?: 'super' | 'executive' | 'standard' | 'temporary'; // The_Samaritan = super, Admin 3 & 4 = executive, Admin 1 & 2 = standard, Appointed = temporary
  appointedUntil?: string; // 3 months ISO expiration
  createdAt: string;
  avatarUrl?: string; // custom profile picture URL or base64 data URL
  county?: string; // One of Kenya's 47 counties or nationwide
  subCounty?: string;
}

export type CivicUser = AuthUser;

export interface AdminNotification {
  id: string;
  type: 'question' | 'quiz_completed' | 'system';
  questionId?: string;
  questionTitle?: string;
  courseId?: string;
  courseTitle?: string;
  score?: number;
  total?: number;
  submittedByHandle: string;
  timestamp: string;
  notifiedAdmins: ('Admin 1' | 'Admin 2' | 'Admin 3' | 'Admin 4' | string)[];
  readByAdmin1?: boolean;
  readByAdmin2?: boolean;
  readByAdmin3?: boolean;
  readByAdmin4?: boolean;
  reviewed?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  resolutionCategory?: 'ombudsman_referral' | 'constitutional_clarification' | 'administrative_guidance' | 'duplicate_submission' | 'standard_review';
  resolutionNotes?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
}

export interface BannedUserRecord {
  id: string;
  username: string;
  deviceId?: string;
  bannedAt: string;
  bannedBy: 'Admin 3' | 'Admin 4' | 'The_Samaritan' | string;
  reason: string;
  banType?: 'permanent' | 'temporary';
  durationDays?: number;
  expiresAt?: string; // ISO date string for auto-expiry
  isSuperBan?: boolean; // When elevated or enacted by The_Samaritan, only The_Samaritan can lift
  appealStatus?: 'none' | 'pending' | 'rejected' | 'approved';
  appealCount?: number;
  lastAppealText?: string;
  lastAppealAt?: string;
}

export interface CitizenBanAppeal {
  id: string;
  banId: string;
  username: string;
  appealText: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  resolutionNotes?: string;
  superAuthorityAction?: boolean;
}

export interface AppointedAdminRecord {
  id: string;
  username: string;
  appointedBy: 'Admin 3' | 'Admin 4' | string;
  appointedAt: string;
  expiresAt: string; // 3 months duration
  status: 'active' | 'expired' | 'revoked';
  notes?: string;
}

export interface NotificationReply {
  id: string;
  senderUsername: string;
  senderRole: 'citizen' | 'admin';
  senderTitle?: string;
  message: string;
  timestamp: string;
}

export interface UserDirectNotification {
  id: string;
  targetUsername: string;
  recipientUsername?: string;
  sentBy: 'Admin 3' | 'Admin 4' | string;
  senderTitle: string;
  title: string;
  message: string;
  category: 'notice' | 'commendation' | 'appointment' | 'urgent';
  timestamp: string;
  isRead: boolean;
  replies?: NotificationReply[];
}

export interface CivicEvent {
  id: string;
  title: {
    en: string;
    sw: string;
  };
  description: {
    en: string;
    sw: string;
  };
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 1:00 PM EAT"
  location: string;
  county?: string; // Kenya 47 counties e.g. 'Kwale', 'Nairobi', 'Mombasa', 'Kilifi', 'Nationwide'
  subCounty?: string;
  category: 'budget_baraza' | 'public_hearing' | 'civic_training' | 'youth_forum' | 'assembly_session';
  postedBy: 'Admin 3' | 'Admin 4' | string;
  createdAt: string;
  attendeesCount: number;
  rsvpdUsernames: string[];
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean; // >= 8 chars
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  feedbackMessage: string;
}

export interface CivicMonthlyReport {
  id: string;
  title: string;
  month: string;
  generatedAt: string;
  generatedBy: string;
  metrics: {
    totalQuestions: number;
    answeredQuestions: number;
    quizCompletions: number;
    averageScore: number;
    certificatesIssued: number;
    activeSessionsCount: number;
    subCountyDistribution: Record<string, number>;
  };
  summary: string;
  recommendations: string[];
}

export interface FacilitatorTokenGrant {
  id: string;
  recipientUsername: string;
  amount: number;
  reason: string;
  grantedBy: 'The_Samaritan' | string;
  grantedAt: string;
  trainingBatch?: string;
}

export interface FacilitatorTrainingCertificate {
  id: string;
  serialNumber: string; // e.g. SAM-FACILITATOR-2026-XXXX
  recipientUsername: string;
  recipientFullName: string;
  tokensRedeemed: number;
  issuedAt: string;
  trainingTopic: string;
  authorizedBy: string; // "Abdulhamid Chaucer (The Samaritan Lead Developer & Facilitator)"
  location: string;
  status: 'active' | 'verified' | 'revoked';
}

export interface SamaritanTreasuryState {
  year: number;
  quotaYear?: number;
  initialQuota: number;
  balance: number;
  totalAllocatedThisYear: number;
  lastRenewedAt: string;
  nextRenewalDate: string;
  isUnlimitedAuthority: boolean;
}

export type TokenExpenditureType =
  | 'cert_redemption'
  | 'transfer_out';

export interface TokenExpenditure {
  id: string;
  username: string;
  amount: number;
  type: TokenExpenditureType;
  description: string;
  metadata?: {
    recipientUsername?: string;
    note?: string;
    courseId?: string;
  };
  timestamp: string;
}
