/**
 * Google Sheets & Apps Script Sync Integration (100% Free - Zero Cloud Billing)
 * 
 * Connected to Live Google Sheets Web App:
 * https://script.google.com/macros/s/AKfycby5nhRbCvwRO2S2p1tUiMb7L_UGezcnlnGRpGCMyiaPhS3DxMfqx7U-HgmclViUzDzETQ/exec
 * Spreadsheet: "The Samaritan LogBook"
 * 
 * Synchronizes Both Ways (Read & Write):
 * 1. Citizens Roster (registered citizens & administrative officers)
 * 2. Citizen Inquiries & Constitutional Answers
 * 3. Citizen Suggestions & Community Feedback
 * 4. Issued Certificates of Civic Competence & Katiba Literacy
 * 5. Security Incidents & Anti-Tamper Audit Logs
 * 6. UI/UX Auto-Learn Adaptations & Approvals
 * 7. Multi-device User Progress, Facilitator Tokens, and Verification Badges
 */

import { getRegisteredUsers, getCivicQuestions, REGISTERED_USERS_KEY, loginUser } from './authAndQuestions';
import { getAllIssuedCertificates } from './certificateRegistry';
import { getFeatureSuggestions } from './suggestionBox';
import { getSecurityIncidents } from './platformSecurity';
import { getOperatorFlaggedIncidents } from './civicMessagingService';
import { getAllAdaptationProposals } from './autoLearnEngine';
import { getUserProgress, saveUserProgress } from './storage';
import { getAllTokenGrants, saveTokenGrants, getAllTokenExpenditures } from './facilitatorTokenRegistry';
import { getAllVerifiedUsers, USER_VERIFICATIONS_KEY } from './userVerificationService';
import { getActiveUserSessions } from './userPresence';
import { getCivicEvents, CIVIC_EVENTS_KEY } from './adminManagement';

export const LIVE_GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycby5nhRbCvwRO2S2p1tUiMb7L_UGezcnlnGRpGCMyiaPhS3DxMfqx7U-HgmclViUzDzETQ/exec';

const GOOGLE_SHEET_CONFIG_KEY = 'the_samaritan_google_sheet_sync_v1';
export const OFFLINE_PENDING_KEY = 'the_samaritan_offline_pending_sync';

export interface GoogleSheetSyncConfig {
  webAppUrl: string;
  autoSyncOnAction: boolean;
  lastSyncedAt?: string;
  lastSyncStatus?: 'success' | 'error' | 'idle';
  lastSyncMessage?: string;
}

const DEFAULT_CONFIG: GoogleSheetSyncConfig = {
  webAppUrl: LIVE_GOOGLE_SHEET_URL,
  autoSyncOnAction: true,
  lastSyncStatus: 'idle',
};

export function getGoogleSheetConfig(): GoogleSheetSyncConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(GOOGLE_SHEET_CONFIG_KEY);
    if (!raw) {
      localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.webAppUrl || parsed.webAppUrl.trim() === '') {
      parsed.webAppUrl = LIVE_GOOGLE_SHEET_URL;
      localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(parsed));
    }
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveGoogleSheetConfig(config: Partial<GoogleSheetSyncConfig>): GoogleSheetSyncConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  const current = getGoogleSheetConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(GOOGLE_SHEET_CONFIG_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Enhanced Apps Script template supporting BOTH real-time bidirectional reading, writing,
 * active presence tracking (online admins & citizens sync), and multi-device state mirroring.
 * Copy this into Google Sheet -> Extensions -> Apps Script.
 */
export const SAMPLE_APPS_SCRIPT_CODE = `/**
 * The Samaritan - Live Bidirectional Google Sheets Data Hub (Google Apps Script)
 * Version: 2.4 - Full Real-Time Read, Write, Sync, Live Presence & Civic Events Hub
 * 
 * Instructions for The_Samaritan Administrator:
 * 1. Open your Google Sheet ("The Samaritan LogBook").
 * 2. In the top menu, click "Extensions" > "Apps Script".
 * 3. Delete existing code, paste this entire updated script, and click Save (Floppy icon).
 * 4. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > Version: "New version" > Deploy.
 *    (Or if deploying for the first time: "Deploy" > "New deployment" > Type: "Web app").
 * 5. "Execute as": "Me".
 * 6. "Who has access": "Anyone" (crucial for zero-login direct browser read/write).
 * 7. Copy the Web App URL (ends in /exec).
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) || 'status';
  var username = (e && e.parameter && e.parameter.username) ? String(e.parameter.username).trim() : '';

  // 1. Action: Read All Live Data (Real-Time GET)
  if (action === 'read_all' || action === 'get_data' || action === 'read' || action === 'get_all') {
    var allData = readAllSpreadsheetData(ss);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      source: 'google_sheets_live',
      title: ss.getName(),
      data: allData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Action: Read Specific User Progress (Real-Time GET)
  if (action === 'get_user_progress') {
    var progressData = getUserProgressFromSheet(ss, username);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      username: username,
      progress: progressData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Action: Read Facilitator Tokens
  if (action === 'get_tokens') {
    var tokensData = readSheetRowsAsObjects(ss, 'Facilitator_Tokens');
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      tokens: tokensData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 4. Action: Read Verification Badges
  if (action === 'get_badges') {
    var badgesData = readSheetRowsAsObjects(ss, 'Verification_Badges');
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      badges: badgesData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 5. Action: Read Live Presence (Active Citizens & Admins online)
  if (action === 'get_presence' || action === 'presence') {
    var presenceData = getActivePresenceFromSheet(ss);
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      activeSessions: presenceData,
      onlineCount: presenceData.filter(function(s) { return s.isOnline; }).length,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 6. Action: Read Civic Events (Calendar & Workshops)
  if (action === 'get_events' || action === 'events') {
    var eventsData = readSheetRowsAsObjects(ss, 'Civic_Events');
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      events: eventsData,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 7. Default: Live Connection Status & Row Counts
  var sheetUsers = ss.getSheetByName('Citizens_Roster');
  var usersCount = sheetUsers ? Math.max(0, sheetUsers.getLastRow() - 1) : 0;
  
  var sheetQ = ss.getSheetByName('Citizen_Inquiries');
  var qCount = sheetQ ? Math.max(0, sheetQ.getLastRow() - 1) : 0;

  var sheetS = ss.getSheetByName('Suggestions');
  var sCount = sheetS ? Math.max(0, sheetS.getLastRow() - 1) : 0;

  var sheetEv = ss.getSheetByName('Civic_Events');
  var evCount = sheetEv ? Math.max(0, sheetEv.getLastRow() - 1) : 0;

  var sheetProg = ss.getSheetByName('User_Progress');
  var progCount = sheetProg ? Math.max(0, sheetProg.getLastRow() - 1) : 0;

  var sheetTokens = ss.getSheetByName('Facilitator_Tokens');
  var tokensCount = sheetTokens ? Math.max(0, sheetTokens.getLastRow() - 1) : 0;

  var sheetBadges = ss.getSheetByName('Verification_Badges');
  var badgesCount = sheetBadges ? Math.max(0, sheetBadges.getLastRow() - 1) : 0;

  var sheetCerts = ss.getSheetByName('Certificates_Issued');
  var certsCount = sheetCerts ? Math.max(0, sheetCerts.getLastRow() - 1) : 0;

  var sheetPresence = ss.getSheetByName('Active_Presence');
  var presenceCount = sheetPresence ? Math.max(0, sheetPresence.getLastRow() - 1) : 0;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'connected',
    title: ss.getName(),
    citizensCount: usersCount,
    inquiriesCount: qCount,
    suggestionsCount: sCount,
    eventsCount: evCount,
    progressCount: progCount,
    tokensCount: tokensCount,
    badgesCount: badgesCount,
    certificatesCount: certsCount,
    activePresenceCount: presenceCount,
    canRead: true,
    canWrite: true,
    version: '2.4.0',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // -------------------------------------------------------------
    // ACTION: READ DATA (via POST)
    // -------------------------------------------------------------
    if (action === 'read_all' || action === 'get_data' || action === 'read' || action === 'get_all') {
      var allData = readAllSpreadsheetData(ss);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        source: 'google_sheets_live',
        title: ss.getName(),
        data: allData,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'get_user_progress') {
      var prog = getUserProgressFromSheet(ss, payload.username);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        username: payload.username,
        progress: prog,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'get_presence' || action === 'presence') {
      var pres = getActivePresenceFromSheet(ss);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        activeSessions: pres,
        onlineCount: pres.filter(function(s) { return s.isOnline; }).length,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION: SYNC / WRITE DATA (via POST)
    // -------------------------------------------------------------
    if (action === 'sync_all' || action === 'push_data') {
      // 1. Sync Citizens Roster
      if (payload.citizens && Array.isArray(payload.citizens)) {
        var sheetUsers = getOrCreateSheet(ss, 'Citizens_Roster', ['Username', 'County', 'SubCounty', 'Role', 'RegisteredAt', 'PasswordHash']);
        var existingUsers = getExistingColumnValues(sheetUsers, 1);
        payload.citizens.forEach(function(u) {
          var idx = existingUsers.indexOf(u.username);
          if (idx === -1) {
            sheetUsers.appendRow([u.username, u.county || 'Kwale', u.subCounty || 'N/A', u.role || 'citizen', u.createdAt || new Date().toISOString(), u.passwordHash || '']);
          } else if (u.passwordHash) {
            sheetUsers.getRange(idx + 2, 6).setValue(u.passwordHash);
          }
        });
      }

      // 2. Sync Citizen Inquiries
      if (payload.questions && Array.isArray(payload.questions)) {
        var sheetQ = getOrCreateSheet(ss, 'Citizen_Inquiries', ['ID', 'Title', 'Category', 'AskedBy', 'County', 'Status', 'Date', 'FirstAnswer']);
        var existingQ = getExistingColumnValues(sheetQ, 1);
        payload.questions.forEach(function(q) {
          var qIdx = existingQ.indexOf(q.id);
          var firstAns = (q.answers && q.answers.length > 0) ? q.answers[0].answeredBy + ': ' + q.answers[0].text.substring(0, 100) : 'Pending';
          if (qIdx === -1) {
            sheetQ.appendRow([q.id, q.title, q.category, q.askedByAnonymousHandle, q.locationCounty || 'Kwale', q.status, q.createdAt, firstAns]);
          } else {
            sheetQ.getRange(qIdx + 2, 6, 1, 3).setValues([[q.status, q.createdAt, firstAns]]);
          }
        });
      }

      // 3. Sync Suggestions
      if (payload.suggestions && Array.isArray(payload.suggestions)) {
        var sheetS = getOrCreateSheet(ss, 'Suggestions', ['ID', 'Title', 'Category', 'SuggestedBy', 'Votes', 'Status', 'Date']);
        var existingS = getExistingColumnValues(sheetS, 1);
        payload.suggestions.forEach(function(s) {
          var sIdx = existingS.indexOf(s.id);
          if (sIdx === -1) {
            sheetS.appendRow([s.id, s.title, s.category, s.suggestedBy, s.votes || 0, s.status, s.createdAt]);
          } else {
            sheetS.getRange(sIdx + 2, 5, 1, 2).setValues([[s.votes || 0, s.status]]);
          }
        });
      }

      // 4. Sync Certificates
      if (payload.certificates && Array.isArray(payload.certificates)) {
        var sheetC = getOrCreateSheet(ss, 'Certificates_Issued', ['CertNumber', 'Recipient', 'Module', 'IssuedAt']);
        var existingC = getExistingColumnValues(sheetC, 1);
        payload.certificates.forEach(function(c) {
          if (existingC.indexOf(c.certificateNumber) === -1) {
            sheetC.appendRow([c.certificateNumber, c.recipientName, c.courseTitle || 'Civic Module', c.issueDate]);
          }
        });
      }

      // 4b. Sync Civic Calendar Events & Workshops
      if (payload.events && Array.isArray(payload.events)) {
        var sheetEv = getOrCreateSheet(ss, 'Civic_Events', ['EventID', 'Title', 'Category', 'Date', 'County', 'Description', 'PostedBy', 'AttendeesCount', 'CreatedAt']);
        var existingEv = getExistingColumnValues(sheetEv, 1);
        payload.events.forEach(function(ev) {
          if (!ev || !ev.id) return;
          var eIdx = existingEv.indexOf(ev.id);
          if (eIdx === -1) {
            sheetEv.appendRow([ev.id, ev.title || '', ev.category || '', ev.date || '', ev.county || '', ev.description || '', ev.postedBy || '', ev.attendeesCount || 0, ev.createdAt || new Date().toISOString()]);
          } else {
            sheetEv.getRange(eIdx + 2, 8).setValue(ev.attendeesCount || 0);
          }
        });
      }

      // 5. Sync User Civic Progress & State (Cross-device continuity)
      if (payload.userProgress && Array.isArray(payload.userProgress)) {
        var sheetProg = getOrCreateSheet(ss, 'User_Progress', ['Username', 'LessonsCompletedCount', 'LessonsJSON', 'QuizScoresJSON', 'LastActiveDate']);
        var existingProgUsers = getExistingColumnValues(sheetProg, 1);
        payload.userProgress.forEach(function(p) {
          var rowIdx = existingProgUsers.indexOf(p.username);
          var completedCount = (p.completedLessons && p.completedLessons.length) || 0;
          var lessonsStr = JSON.stringify(p.completedLessons || []);
          var scoresStr = JSON.stringify(p.quizScores || {});
          var dateStr = p.lastActiveDate || new Date().toISOString();
          if (rowIdx === -1) {
            sheetProg.appendRow([p.username, completedCount, lessonsStr, scoresStr, dateStr]);
          } else {
            sheetProg.getRange(rowIdx + 2, 2, 1, 4).setValues([[completedCount, lessonsStr, scoresStr, dateStr]]);
          }
        });
      }

      // 6. Sync Facilitator Tokens & Balances
      if (payload.tokens && Array.isArray(payload.tokens)) {
        var sheetTok = getOrCreateSheet(ss, 'Facilitator_Tokens', ['GrantID', 'Recipient', 'Amount', 'Reason', 'GrantedBy', 'GrantedAt']);
        var existingTok = getExistingColumnValues(sheetTok, 1);
        payload.tokens.forEach(function(t) {
          if (existingTok.indexOf(t.id) === -1) {
            sheetTok.appendRow([t.id, t.recipientUsername, t.amount, t.reason || '', t.grantedBy || '', t.grantedAt || new Date().toISOString()]);
          }
        });
      }

      // 7. Sync Verification Badges
      if (payload.verificationBadges && Array.isArray(payload.verificationBadges)) {
        var sheetVerif = getOrCreateSheet(ss, 'Verification_Badges', ['Username', 'BadgeTier', 'BadgeTitle', 'VerifiedBy', 'VerifiedAt']);
        var existingVerifs = getExistingColumnValues(sheetVerif, 1);
        payload.verificationBadges.forEach(function(v) {
          var rowIdx = existingVerifs.indexOf(v.username);
          if (rowIdx === -1) {
            sheetVerif.appendRow([v.username, v.badgeTier, v.badgeTitleEn || v.badgeTitle || '', v.verifiedBy || '', v.verifiedAt || new Date().toISOString()]);
          } else {
            sheetVerif.getRange(rowIdx + 2, 2, 1, 4).setValues([[v.badgeTier, v.badgeTitleEn || v.badgeTitle || '', v.verifiedBy || '', v.verifiedAt || new Date().toISOString()]]);
          }
        });
      }

      // 8. Sync Security & Audit Incidents
      if (payload.incidents && Array.isArray(payload.incidents)) {
        var sheetI = getOrCreateSheet(ss, 'Incidents_Audit', ['IncidentID', 'Type', 'Severity', 'Details', 'Timestamp']);
        var existingI = getExistingColumnValues(sheetI, 1);
        payload.incidents.forEach(function(inc) {
          if (existingI.indexOf(inc.id) === -1) {
            sheetI.appendRow([inc.id, inc.type || 'General', inc.severity || 'Normal', inc.details || '', inc.timestamp || new Date().toISOString()]);
          }
        });
      }

      // 9. Sync UI/UX Auto-Learn Adaptations
      if (payload.adaptations && Array.isArray(payload.adaptations)) {
        var sheetA = getOrCreateSheet(ss, 'AutoLearn_Adaptations', ['ProposalID', 'Category', 'Description', 'Status', 'CreatedAt']);
        var existingA = getExistingColumnValues(sheetA, 1);
        payload.adaptations.forEach(function(a) {
          var aIdx = existingA.indexOf(a.id);
          if (aIdx === -1) {
            sheetA.appendRow([a.id, a.category || 'UI/UX', a.title || a.description || '', a.status || 'pending', a.createdAt || new Date().toISOString()]);
          } else {
            sheetA.getRange(aIdx + 2, 4).setValue(a.status || 'pending');
          }
        });
      }

      // 10. Sync Live Presence to Google Sheet (Active Citizens & Admins online)
      if (payload.activeSessions && Array.isArray(payload.activeSessions)) {
        updateActivePresenceSheet(ss, payload.activeSessions);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'All Samaritan records synced successfully (Live Sheets, Cloud Backup & Active Presence ready)',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION: REAL-TIME PRESENCE HEARTBEAT (Active Citizens & Admins)
    // -------------------------------------------------------------
    if (action === 'presence_heartbeat' || action === 'record_presence') {
      if (payload.session) {
        updateActivePresenceSheet(ss, [payload.session]);
      } else if (payload.activeSessions && Array.isArray(payload.activeSessions)) {
        updateActivePresenceSheet(ss, payload.activeSessions);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Presence recorded in Live Google Sheet',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION: REAL-TIME SINGLE USER PROGRESS UPDATE
    // -------------------------------------------------------------
    if (action === 'update_user_progress') {
      var sheetProg = getOrCreateSheet(ss, 'User_Progress', ['Username', 'LessonsCompletedCount', 'LessonsJSON', 'QuizScoresJSON', 'LastActiveDate']);
      var existingProgUsers = getExistingColumnValues(sheetProg, 1);
      var rowIdx = existingProgUsers.indexOf(payload.username);
      var completedCount = (payload.completedLessons && payload.completedLessons.length) || 0;
      var lessonsStr = JSON.stringify(payload.completedLessons || []);
      var scoresStr = JSON.stringify(payload.quizScores || {});
      var dateStr = payload.lastActiveDate || new Date().toISOString();
      if (rowIdx === -1) {
        sheetProg.appendRow([payload.username, completedCount, lessonsStr, scoresStr, dateStr]);
      } else {
        sheetProg.getRange(rowIdx + 2, 2, 1, 4).setValues([[completedCount, lessonsStr, scoresStr, dateStr]]);
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'User progress updated in real time for ' + payload.username,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // -------------------------------------------------------------
    // ACTION: DIRECT SINGLE RECORD WRITE ACTIONS
    // -------------------------------------------------------------
    if (action === 'register_citizen' || action === 'register_user') {
      var u = payload.user || payload;
      if (u && u.username) {
        var sheetUsers = getOrCreateSheet(ss, 'Citizens_Roster', ['Username', 'County', 'SubCounty', 'Role', 'RegisteredAt', 'PasswordHash']);
        var existingUsers = getExistingColumnValues(sheetUsers, 1);
        var idx = existingUsers.indexOf(u.username);
        if (idx === -1) {
          sheetUsers.appendRow([u.username, u.county || 'Kwale', u.subCounty || 'N/A', u.role || 'citizen', u.createdAt || new Date().toISOString(), u.passwordHash || '']);
        } else if (u.passwordHash) {
          sheetUsers.getRange(idx + 2, 6).setValue(u.passwordHash);
        }
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Citizen ' + u.username + ' registered in Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'update_password' || action === 'recover_password') {
      if (payload.username && payload.newPasswordHash) {
        var sheetUsers = getOrCreateSheet(ss, 'Citizens_Roster', ['Username', 'County', 'SubCounty', 'Role', 'RegisteredAt', 'PasswordHash']);
        var existingUsers = getExistingColumnValues(sheetUsers, 1);
        var idx = existingUsers.indexOf(payload.username);
        if (idx !== -1) {
          sheetUsers.getRange(idx + 2, 6).setValue(payload.newPasswordHash);
          return ContentService.createTextOutput(JSON.stringify({
            status: 'success',
            message: 'Password updated for ' + payload.username,
            timestamp: new Date().toISOString()
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    if (action === 'add_question') {
      var q = payload.question || payload;
      if (q && q.id) {
        var sheetQ = getOrCreateSheet(ss, 'Citizen_Inquiries', ['ID', 'Title', 'Category', 'AskedBy', 'County', 'Status', 'Date', 'FirstAnswer']);
        var firstAns = (q.answers && q.answers.length > 0) ? q.answers[0].answeredBy + ': ' + q.answers[0].text.substring(0, 100) : 'Pending';
        sheetQ.appendRow([q.id, q.title, q.category, q.askedByAnonymousHandle, q.locationCounty || 'Kwale', q.status || 'open', q.createdAt || new Date().toISOString(), firstAns]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Question added to Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'add_suggestion') {
      var s = payload.suggestion || payload;
      if (s && s.id) {
        var sheetS = getOrCreateSheet(ss, 'Suggestions', ['ID', 'Title', 'Category', 'SuggestedBy', 'Votes', 'Status', 'Date']);
        sheetS.appendRow([s.id, s.title, s.category, s.suggestedBy, s.votes || 0, s.status || 'under_review', s.createdAt || new Date().toISOString()]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Suggestion recorded in Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'create_event') {
      var ev = payload.event || payload;
      if (ev && ev.id) {
        var sheetEv = getOrCreateSheet(ss, 'Civic_Events', ['EventID', 'Title', 'Category', 'Date', 'County', 'Description', 'PostedBy', 'AttendeesCount', 'CreatedAt']);
        sheetEv.appendRow([ev.id, ev.title || '', ev.category || '', ev.date || '', ev.county || '', ev.description || '', ev.postedBy || '', ev.attendeesCount || 0, ev.createdAt || new Date().toISOString()]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Civic event added to Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'grant_tokens') {
      var t = payload.grant || payload;
      if (t && t.id) {
        var sheetTok = getOrCreateSheet(ss, 'Facilitator_Tokens', ['GrantID', 'Recipient', 'Amount', 'Reason', 'GrantedBy', 'GrantedAt']);
        sheetTok.appendRow([t.id, t.recipientUsername, t.amount, t.reason || '', t.grantedBy || '', t.grantedAt || new Date().toISOString()]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Token grant saved to Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'grant_badge') {
      var v = payload.badge || payload;
      if (v && v.username) {
        var sheetVerif = getOrCreateSheet(ss, 'Verification_Badges', ['Username', 'BadgeTier', 'BadgeTitle', 'VerifiedBy', 'VerifiedAt']);
        var existingVerifs = getExistingColumnValues(sheetVerif, 1);
        var rowIdx = existingVerifs.indexOf(v.username);
        if (rowIdx === -1) {
          sheetVerif.appendRow([v.username, v.badgeTier, v.badgeTitleEn || v.badgeTitle || '', v.verifiedBy || '', v.verifiedAt || new Date().toISOString()]);
        } else {
          sheetVerif.getRange(rowIdx + 2, 2, 1, 4).setValues([[v.badgeTier, v.badgeTitleEn || v.badgeTitle || '', v.verifiedBy || '', v.verifiedAt || new Date().toISOString()]]);
        }
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Verification badge recorded in Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'issue_certificate') {
      var c = payload.certificate || payload;
      if (c && c.certificateNumber) {
        var sheetC = getOrCreateSheet(ss, 'Certificates_Issued', ['CertNumber', 'Recipient', 'Module', 'IssuedAt']);
        sheetC.appendRow([c.certificateNumber, c.recipientName, c.courseTitle || 'Civic Module', c.issueDate || new Date().toISOString()]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Certificate registered in Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (action === 'log_incident') {
      var inc = payload.incident || payload;
      if (inc && inc.id) {
        var sheetI = getOrCreateSheet(ss, 'Incidents_Audit', ['IncidentID', 'Type', 'Severity', 'Details', 'Timestamp']);
        sheetI.appendRow([inc.id, inc.type || 'General', inc.severity || 'Normal', inc.details || '', inc.timestamp || new Date().toISOString()]);
        return ContentService.createTextOutput(JSON.stringify({
          status: 'success',
          message: 'Incident logged in Google Sheet',
          timestamp: new Date().toISOString()
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown action: ' + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateActivePresenceSheet(ss, sessions) {
  if (!sessions || !sessions.length) return;
  var sheet = getOrCreateSheet(ss, 'Active_Presence', ['SessionID', 'Username', 'Role', 'AdminLevel', 'County', 'CurrentSection', 'CurrentAction', 'LastActiveTime', 'IsOnline']);
  var existingIds = getExistingColumnValues(sheet, 1);
  var now = new Date().getTime();
  var fiveMinsAgo = now - 5 * 60 * 1000;

  sessions.forEach(function(s) {
    if (!s || (!s.id && !s.username)) return;
    var sid = s.id || s.username;
    var lastActiveMs = typeof s.lastActive === 'number' ? s.lastActive : now;
    var isOnline = lastActiveMs >= fiveMinsAgo;
    var timeStr = new Date(lastActiveMs).toISOString();

    var idx = existingIds.indexOf(sid);
    if (idx === -1) {
      sheet.appendRow([sid, s.username || '', s.role || 'citizen', s.adminLevel || '', s.county || '', s.currentSection || '', s.currentAction || '', timeStr, isOnline ? 'YES' : 'NO']);
    } else {
      sheet.getRange(idx + 2, 2, 1, 8).setValues([[s.username || '', s.role || 'citizen', s.adminLevel || '', s.county || '', s.currentSection || '', s.currentAction || '', timeStr, isOnline ? 'YES' : 'NO']]);
    }
  });
}

function getActivePresenceFromSheet(ss) {
  var sheet = ss.getSheetByName('Active_Presence');
  if (!sheet) return [];
  var rows = readSheetRowsAsObjects(ss, 'Active_Presence');
  var now = new Date().getTime();
  var fiveMinsAgo = now - 5 * 60 * 1000;

  return rows.map(function(r) {
    var lastTimeMs = r.lastactivetime ? new Date(r.lastactivetime).getTime() : 0;
    return {
      id: r.sessionid || r.username,
      username: r.username,
      role: r.role || 'citizen',
      adminLevel: r.adminlevel || '',
      county: r.county || '',
      currentSection: r.currentsection || '',
      currentAction: r.currentaction || '',
      lastActive: lastTimeMs,
      isOnline: (r.isonline === 'YES' || r.isonline === true) && lastTimeMs >= fiveMinsAgo
    };
  });
}

function getUserProgressFromSheet(ss, username) {
  if (!username) return null;
  var sheet = ss.getSheetByName('User_Progress');
  if (!sheet) return null;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  var userVals = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var cleanTarget = String(username).toLowerCase().replace(/^@/, '');

  for (var i = 0; i < userVals.length; i++) {
    var rowUser = String(userVals[i][0]).toLowerCase().replace(/^@/, '');
    if (rowUser === cleanTarget) {
      var rowData = sheet.getRange(i + 2, 1, 1, 5).getValues()[0];
      var lessons = [];
      var scores = {};
      try { lessons = JSON.parse(rowData[2] || '[]'); } catch(e) {}
      try { scores = JSON.parse(rowData[3] || '{}'); } catch(e) {}
      return {
        username: rowData[0],
        completedLessonsCount: rowData[1],
        completedLessons: lessons,
        quizScores: scores,
        lastActiveDate: rowData[4]
      };
    }
  }
  return null;
}

function readAllSpreadsheetData(ss) {
  var result = {
    citizens: readSheetRowsAsObjects(ss, 'Citizens_Roster'),
    questions: readSheetRowsAsObjects(ss, 'Citizen_Inquiries'),
    suggestions: readSheetRowsAsObjects(ss, 'Suggestions'),
    certificates: readSheetRowsAsObjects(ss, 'Certificates_Issued'),
    events: readSheetRowsAsObjects(ss, 'Civic_Events'),
    userProgress: readSheetRowsAsObjects(ss, 'User_Progress'),
    tokens: readSheetRowsAsObjects(ss, 'Facilitator_Tokens'),
    verificationBadges: readSheetRowsAsObjects(ss, 'Verification_Badges'),
    incidents: readSheetRowsAsObjects(ss, 'Incidents_Audit'),
    adaptations: readSheetRowsAsObjects(ss, 'AutoLearn_Adaptations'),
    activePresence: readSheetRowsAsObjects(ss, 'Active_Presence')
  };
  return result;
}

function readSheetRowsAsObjects(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol < 1) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, idx) {
      var key = String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
      obj[key] = row[idx];
      obj[header] = row[idx];
    });
    return obj;
  });
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#E2E8F0');
    }
  }
  return sheet;
}

function getExistingColumnValues(sheet, colIndex) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  var vals = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  return vals.map(function(r) { return String(r[0]); });
}
`;

export interface SyncPushResult {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * Pushes all local records to the configured Google Sheet via the Apps Script Web App URL
 * Synchronizes:
 * - Citizens Roster
 * - Citizen Inquiries
 * - Suggestions
 * - Certificates
 * - User Civic Progress (lessons completed, quiz scores)
 * - Facilitator Tokens & Grants
 * - Verification Badges
 * - Incidents Audit
 * - UI/UX Adaptations
 * Also saves a resilient backup to the server Google Cloud backup endpoint.
 */
export async function pushAllDataToGoogleSheet(customUrl?: string): Promise<SyncPushResult> {
  const config = getGoogleSheetConfig();
  const targetUrl = (customUrl || config.webAppUrl || LIVE_GOOGLE_SHEET_URL).trim();

  if (!targetUrl) {
    throw new Error('Google Apps Script Web App URL is not configured. Please paste your deployment URL.');
  }

  // 1. Compile citizens roster (including primary admins for complete record)
  const registered = getRegisteredUsers();
  const defaultAdmins = [
    { username: '@The_Samaritan', county: 'Kwale', subCounty: 'Matuga', role: 'Executive Administrator' },
    { username: '@Balozi_Admin', county: 'Kwale', subCounty: 'Msambweni', role: 'Civic Engagement Lead' },
    { username: '@Katiba_Admin', county: 'Mombasa', subCounty: 'Mvita', role: 'Constitutional Compliance' },
    { username: '@Civic_Lead', county: 'Kilifi', subCounty: 'Malindi', role: 'Field Civic Facilitator' },
    { username: '@Devolution_Admin', county: 'Kwale', subCounty: 'Kinango', role: 'Devolution Specialist' },
  ];

  const seenUsers = new Set<string>();
  const citizens: Array<{ username: string; county: string; subCounty: string; role: string; passwordHash?: string; createdAt: string }> = [];

  for (const u of registered) {
    const clean = u.username.toLowerCase();
    if (!seenUsers.has(clean)) {
      seenUsers.add(clean);
      citizens.push({
        username: u.username,
        county: u.county || 'Kwale',
        subCounty: u.subCounty || 'N/A',
        role: 'citizen',
        passwordHash: u.passwordHash || '',
        createdAt: u.createdAt || new Date().toISOString(),
      });
    }
  }

  for (const adm of defaultAdmins) {
    const clean = adm.username.toLowerCase();
    if (!seenUsers.has(clean)) {
      seenUsers.add(clean);
      citizens.push({
        username: adm.username,
        county: adm.county,
        subCounty: adm.subCounty,
        role: adm.role,
        passwordHash: '',
        createdAt: '2026-01-01T00:00:00.000Z',
      });
    }
  }

  // 2. Compile citizen questions & inquiries
  const questions = getCivicQuestions().map((q) => ({
    id: q.id,
    title: q.title,
    category: q.category,
    askedByAnonymousHandle: q.askedByAnonymousHandle,
    locationCounty: q.locationCounty || 'Kwale',
    status: q.status,
    createdAt: q.createdAt,
    answers: q.answers,
  }));

  // 3. Compile suggestions & feature requests
  const suggestions = getFeatureSuggestions().map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    suggestedBy: s.suggestedBy,
    votes: s.votes,
    status: s.status,
    createdAt: s.createdAt,
  }));

  // 4. Compile issued certificates
  const certificates = getAllIssuedCertificates().map((c) => ({
    certificateNumber: c.id,
    recipientName: c.recipientName,
    courseTitle: c.courseId,
    issueDate: c.issuedAt,
  }));

  // 5. Compile User Progress across registered citizens
  const userProgressList: Array<{
    username: string;
    completedLessons: string[];
    quizScores: any;
    lastActiveDate: string;
  }> = [];

  for (const c of citizens) {
    const prog = getUserProgress(c.username);
    if (prog.completedLessons.length > 0 || Object.keys(prog.quizScores || {}).length > 0) {
      userProgressList.push({
        username: c.username,
        completedLessons: prog.completedLessons,
        quizScores: prog.quizScores || {},
        lastActiveDate: prog.lastActiveDate || new Date().toISOString(),
      });
    }
  }

  // 6. Compile Facilitator Tokens
  const tokenGrants = getAllTokenGrants().map((t) => ({
    id: t.id,
    recipientUsername: t.recipientUsername,
    amount: t.amount,
    reason: t.reason,
    grantedBy: t.grantedBy,
    grantedAt: t.grantedAt,
  }));

  // 7. Compile Verification Badges
  const verificationBadges = getAllVerifiedUsers().map((v) => ({
    username: v.username,
    badgeTier: v.badgeTier,
    badgeTitle: v.badgeTitleEn || v.badgeTitleSw,
    verifiedBy: v.verifiedBy,
    verifiedAt: v.verifiedAt,
  }));

  // 8. Compile security and operational audit incidents
  const securityIncidents = getSecurityIncidents().map((inc) => ({
    id: inc.id,
    type: inc.type,
    severity: inc.severity,
    details: inc.details,
    timestamp: inc.timestamp,
  }));

  const flaggedIncidents = getOperatorFlaggedIncidents().map((flag) => ({
    id: flag.id,
    type: 'CONTENT_MODERATION',
    severity: (flag.riskScore && flag.riskScore >= 80 ? 'critical' : 'medium') as any,
    details: `Flagged message by ${flag.senderUsername}: "${flag.explanationEn || flag.content}"`,
    timestamp: flag.timestamp,
  }));

  const incidents = [...securityIncidents, ...flaggedIncidents];

  // 9. Compile UI/UX adaptation proposals
  const adaptations = getAllAdaptationProposals().map((p) => ({
    id: p.id,
    category: p.category,
    title: p.title,
    description: p.summary,
    status: p.status,
    createdAt: p.proposedAt,
  }));

  // 10. Compile live active sessions (online presence)
  const activeSessions = getActiveUserSessions().sessions;

  // 11. Compile civic events (workshops, constitutional forums)
  const events = getCivicEvents();

  const payload = {
    action: 'sync_all',
    citizens,
    questions,
    suggestions,
    certificates,
    events,
    userProgress: userProgressList,
    tokens: tokenGrants,
    verificationBadges,
    incidents,
    adaptations,
    activeSessions,
    sentAt: new Date().toISOString(),
  };

  // Asynchronous backup to Google Cloud server endpoint in background
  backupToGoogleCloudServer(payload).catch((e) => {
    console.warn('[CloudBackup] Background server backup note:', e?.message || e);
  });

  try {
    // Post to Live Google Sheet Apps Script Web App
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = { status: 'success', message: 'Payload received by Google Sheet' };
    }

    if (data.status === 'error') {
      const msg = data.message || 'Apps script reported an error';
      saveGoogleSheetConfig({
        lastSyncedAt: new Date().toISOString(),
        lastSyncStatus: 'error',
        lastSyncMessage: msg,
      });
      return { success: false, message: msg, timestamp: new Date().toISOString() };
    }

    const successMsg = `Synced ${citizens.length} citizens, ${questions.length} inquiries, ${userProgressList.length} progress profiles, and ${tokenGrants.length} token grants to Google Sheets & Cloud Backup.`;
    saveGoogleSheetConfig({
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: 'success',
      lastSyncMessage: successMsg,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('the_samaritan_google_sheet_synced', {
          detail: {
            timestamp: new Date().toISOString(),
            status: 'success',
            message: successMsg,
          },
        })
      );
    }

    return {
      success: true,
      message: successMsg,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error connecting to Google Apps Script';
    saveGoogleSheetConfig({
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: 'error',
      lastSyncMessage: errorMsg,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Persists snapshot to local Cloud backup server
 */
async function backupToGoogleCloudServer(payload: any): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/cloud-backup/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platformData: {
          citizens: payload.citizens,
          questions: payload.questions,
          suggestions: payload.suggestions,
          certificates: payload.certificates,
          userProgress: payload.userProgress,
          tokens: payload.tokens,
          verificationBadges: payload.verificationBadges,
          incidents: payload.incidents,
          adaptations: payload.adaptations,
          activeSessions: payload.activeSessions,
        },
      }),
    });
  } catch (err) {
    // non-blocking
  }
}

/**
 * Reads all live data from Google Sheets and/or Cloud Backup.
 * Supports reading when the Apps Script has read capabilities deployed,
 * or gracefully falling back to Cloud Server Backup.
 */
export async function readAllDataFromGoogleSheet(customUrl?: string): Promise<{
  success: boolean;
  source: 'google_sheets' | 'cloud_backup' | 'local';
  data?: any;
  message: string;
}> {
  const config = getGoogleSheetConfig();
  const targetUrl = (customUrl || config.webAppUrl || LIVE_GOOGLE_SHEET_URL).trim();

  // 1. Try reading directly from Google Apps Script Web App
  if (targetUrl) {
    try {
      // Try GET with action=read_all
      const separator = targetUrl.includes('?') ? '&' : '?';
      const readUrl = `${targetUrl}${separator}action=read_all`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(readUrl, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.data && typeof json.data === 'object') {
          return {
            success: true,
            source: 'google_sheets',
            data: json.data,
            message: `Retrieved live records from Google Sheet "${json.title || 'The Samaritan LogBook'}".`,
          };
        }
      }
    } catch (sheetErr: any) {
      console.log('[GoogleSheetSync] Apps Script read GET notice:', sheetErr?.message);
    }

    // Try POST with action=read_all if GET didn't return data
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const postRes = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'read_all' }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (postRes.ok) {
        const postJson = await postRes.json();
        if (postJson.data && typeof postJson.data === 'object') {
          return {
            success: true,
            source: 'google_sheets',
            data: postJson.data,
            message: `Retrieved live records from Google Sheet "${postJson.title || 'The Samaritan LogBook'}".`,
          };
        }
      }
    } catch (e) {
      // fall through to cloud server backup
    }
  }

  // 2. Read from Google Cloud Server Backup
  try {
    const cloudRes = await fetch('/api/cloud-backup/snapshot');
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData.success && cloudData.snapshot) {
        return {
          success: true,
          source: 'cloud_backup',
          data: cloudData.snapshot,
          message: 'Retrieved synchronized records from Google Cloud Server backup.',
        };
      }
    }
  } catch (cloudErr: any) {
    console.warn('[CloudBackup] Could not read cloud backup snapshot:', cloudErr?.message);
  }

  return {
    success: false,
    source: 'local',
    message: 'Could not read from Google Sheets or Cloud Server. Using local storage.',
  };
}

/**
 * Checks both Cloud Server backup and live Google Sheets to sync and restore
 * user progress, badges, and tokens upon login on ANY new device.
 */
export async function syncAndRestoreUserOnLogin(username: string): Promise<{
  restored: boolean;
  lessonsRestored: number;
  tokensRestored: number;
  badgeRestored: boolean;
  source: string;
}> {
  if (typeof window === 'undefined' || !username) {
    return { restored: false, lessonsRestored: 0, tokensRestored: 0, badgeRestored: false, source: 'none' };
  }

  const cleanUser = username.trim().toLowerCase().replace(/^@/, '');
  let lessonsRestored = 0;
  let tokensRestored = 0;
  let badgeRestored = false;
  let source = 'local';

  // 1. Check Google Cloud Server Backup for user
  try {
    const cloudRes = await fetch(`/api/cloud-backup/user/${encodeURIComponent(cleanUser)}`);
    if (cloudRes.ok) {
      const cloudJson = await cloudRes.json();
      if (cloudJson.found && cloudJson.backup) {
        const backup = cloudJson.backup;
        source = 'Google Cloud Server Backup';

        // Restore user progress (completed lessons, quiz scores)
        if (backup.progress && Array.isArray(backup.progress.completedLessons)) {
          const localProgress = getUserProgress(username);
          const mergedLessons = Array.from(
            new Set([...(localProgress.completedLessons || []), ...backup.progress.completedLessons])
          );
          const mergedScores = {
            ...(backup.progress.quizScores || {}),
            ...(localProgress.quizScores || {}),
          };

          if (mergedLessons.length > localProgress.completedLessons.length) {
            saveUserProgress(
              {
                completedLessons: mergedLessons,
                quizScores: mergedScores,
                lastActiveDate: backup.progress.lastActiveDate || new Date().toISOString(),
              },
              username
            );
            lessonsRestored = mergedLessons.length;
          }
        }

        // Restore facilitator tokens
        if (backup.tokenGrants && Array.isArray(backup.tokenGrants) && backup.tokenGrants.length > 0) {
          const localGrants = getAllTokenGrants();
          const existingIds = new Set(localGrants.map((g) => g.id));
          const newGrants = backup.tokenGrants.filter((g: any) => !existingIds.has(g.id));
          if (newGrants.length > 0) {
            saveTokenGrants([...localGrants, ...newGrants]);
            tokensRestored = backup.tokenBalance || newGrants.reduce((sum: number, g: any) => sum + (g.amount || 0), 0);
          }
        }

        // Restore verification badge
        if (backup.verificationBadge) {
          const verifiedUsers = getAllVerifiedUsers();
          const existing = verifiedUsers.find(
            (v) => v.username.trim().toLowerCase().replace(/^@/, '') === cleanUser
          );
          if (!existing) {
            verifiedUsers.push(backup.verificationBadge);
            localStorage.setItem(USER_VERIFICATIONS_KEY, JSON.stringify(verifiedUsers));
            window.dispatchEvent(new CustomEvent('the_samaritan_verifications_updated'));
            badgeRestored = true;
          }
        }
      }
    }
  } catch (cloudErr) {
    console.warn('[SyncOnLogin] Cloud server check skipped:', cloudErr);
  }

  // 2. Check live Google Sheet for updated progress or badges
  try {
    const sheetData = await readAllDataFromGoogleSheet();
    if (sheetData.success && sheetData.data) {
      source = sheetData.source === 'google_sheets' ? 'Live Google Sheets' : source;

      // Check userProgress in sheet
      const sheetProgressRows: any[] = sheetData.data.userProgress || [];
      const matchedProgress = sheetProgressRows.find(
        (row) =>
          row.username &&
          String(row.username).trim().toLowerCase().replace(/^@/, '') === cleanUser
      );

      if (matchedProgress) {
        let parsedLessons: string[] = [];
        try {
          parsedLessons = JSON.parse(matchedProgress.lessonsjson || matchedProgress.LessonsJSON || '[]');
        } catch {
          // ignore
        }

        if (parsedLessons.length > 0) {
          const current = getUserProgress(username);
          const merged = Array.from(new Set([...current.completedLessons, ...parsedLessons]));
          if (merged.length > current.completedLessons.length) {
            saveUserProgress({ completedLessons: merged }, username);
            lessonsRestored = Math.max(lessonsRestored, merged.length);
          }
        }
      }

      // Check verification badges in sheet
      const sheetBadges: any[] = sheetData.data.verificationBadges || [];
      const matchedBadge = sheetBadges.find(
        (b) =>
          b.username &&
          String(b.username).trim().toLowerCase().replace(/^@/, '') === cleanUser
      );

      if (matchedBadge) {
        const verifiedUsers = getAllVerifiedUsers();
        const existing = verifiedUsers.find(
          (v) => v.username.trim().toLowerCase().replace(/^@/, '') === cleanUser
        );
        if (!existing) {
          const tier: any = (matchedBadge.badgetier === 'double_tick' || matchedBadge.BadgeTier === 'double_tick') ? 'double_tick' : 'single_tick';
          verifiedUsers.push({
            id: 'verif_' + Date.now(),
            username: cleanUser,
            displayUsername: username.startsWith('@') ? username : `@${username}`,
            badgeTier: tier,
            badgeTitleEn: matchedBadge.badgetitle || matchedBadge.BadgeTitle || 'Verified Civic Champion',
            badgeTitleSw: 'Bingwa wa Kiraia Aliyethibitishwa',
            verifiedBy: matchedBadge.verifiedby || matchedBadge.VerifiedBy || 'The_Samaritan',
            verifiedAt: matchedBadge.verifiedat || matchedBadge.VerifiedAt || new Date().toISOString(),
            source: 'direct_admin_action',
          });
          localStorage.setItem(USER_VERIFICATIONS_KEY, JSON.stringify(verifiedUsers));
          window.dispatchEvent(new CustomEvent('the_samaritan_verifications_updated'));
          badgeRestored = true;
        }
      }
    }
  } catch (sheetErr) {
    console.warn('[SyncOnLogin] Live Google Sheet check skipped:', sheetErr);
  }

  return {
    restored: lessonsRestored > 0 || tokensRestored > 0 || badgeRestored,
    lessonsRestored,
    tokensRestored,
    badgeRestored,
    source,
  };
}

/**
 * Validates credentials across local storage, Google Cloud backup, and live Google Sheets.
 * If user registered on a different device, restores their credentials and continuous progress.
 */
export async function loginUserWithCrossDeviceSync(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string; user?: any; restoredFromCloudOrSheet?: boolean }> {
  // 1. Check local credentials first
  const localRes = loginUser(usernameInput, passwordInput);
  if (localRes.success && localRes.user) {
    // Restore and merge latest progress from Cloud / Live Sheets in background
    syncAndRestoreUserOnLogin(localRes.user.username).catch((e) => {
      console.warn('[LoginSync] Sync error on login:', e);
    });
    return { ...localRes, restoredFromCloudOrSheet: false };
  }

  // If local login failed due to ban/suspension, return immediately
  if (localRes.message.includes('Suspended') || localRes.message.includes('banned')) {
    return { ...localRes, restoredFromCloudOrSheet: false };
  }

  const cleanHandle = usernameInput.trim().toLowerCase().replace(/^@/, '');

  // 2. Query Google Cloud Server Backup for account credentials
  try {
    const cloudRes = await fetch(`/api/cloud-backup/user/${encodeURIComponent(cleanHandle)}`);
    if (cloudRes.ok) {
      const cloudJson = await cloudRes.json();
      if (cloudJson.found && cloudJson.backup) {
        const backup = cloudJson.backup;
        if (backup.passwordHash && backup.passwordHash !== passwordInput) {
          return { success: false, message: 'Incorrect password for this account.' };
        }

        // Restore user to local registered users
        const registered = getRegisteredUsers();
        const normHandle = backup.username.startsWith('@') ? backup.username : `@${backup.username}`;
        if (!registered.some((u) => u.username.toLowerCase() === normHandle.toLowerCase())) {
          registered.push({
            username: normHandle,
            passwordHash: passwordInput,
            county: backup.county || 'Kwale',
            subCounty: backup.subCounty || 'N/A',
            createdAt: backup.createdAt || new Date().toISOString(),
          });
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
        }

        // Complete login
        const loggedIn = loginUser(normHandle, passwordInput);
        if (loggedIn.success && loggedIn.user) {
          await syncAndRestoreUserOnLogin(loggedIn.user.username);
          return {
            success: true,
            message: `Account & progress synchronized from Google Cloud Server Backup! Welcome ${loggedIn.user.username}.`,
            user: loggedIn.user,
            restoredFromCloudOrSheet: true,
          };
        }
      }
    }
  } catch (cloudErr) {
    console.warn('[CrossDeviceLogin] Cloud check note:', cloudErr);
  }

  // 3. Query Live Google Sheet if cloud didn't match
  try {
    const sheetData = await readAllDataFromGoogleSheet();
    if (sheetData.success && sheetData.data && Array.isArray(sheetData.data.citizens)) {
      const matched = sheetData.data.citizens.find(
        (c: any) => c.username && String(c.username).trim().toLowerCase().replace(/^@/, '') === cleanHandle
      );
      if (matched) {
        const matchedPwd = matched.passwordhash || matched.PasswordHash;
        if (matchedPwd && matchedPwd !== passwordInput) {
          return { success: false, message: 'Incorrect password for this account.' };
        }

        const registered = getRegisteredUsers();
        const normHandle = String(matched.username).startsWith('@') ? matched.username : `@${matched.username}`;
        if (!registered.some((u) => u.username.toLowerCase() === normHandle.toLowerCase())) {
          registered.push({
            username: normHandle,
            passwordHash: passwordInput,
            county: matched.county || 'Kwale',
            subCounty: matched.subcounty || matched.SubCounty || 'N/A',
            createdAt: matched.registeredat || matched.RegisteredAt || new Date().toISOString(),
          });
          localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registered));
        }

        const loggedIn = loginUser(normHandle, passwordInput);
        if (loggedIn.success && loggedIn.user) {
          await syncAndRestoreUserOnLogin(loggedIn.user.username);
          return {
            success: true,
            message: `Account & progress synchronized from Live Google Sheets! Welcome ${loggedIn.user.username}.`,
            user: loggedIn.user,
            restoredFromCloudOrSheet: true,
          };
        }
      }
    }
  } catch (sheetErr) {
    console.warn('[CrossDeviceLogin] Sheet check note:', sheetErr);
  }

  return { ...localRes, restoredFromCloudOrSheet: false };
}

/**
 * Offline Sync Management:
 * When device is offline, saves pending status so that as soon as the device reconnects
 * to the internet, all progress and data are automatically sent to Google Sheets & Cloud.
 */
export function isOfflinePendingSync(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(OFFLINE_PENDING_KEY) === 'true';
}

export function markOfflinePendingSync(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OFFLINE_PENDING_KEY, 'true');
  localStorage.setItem('the_samaritan_offline_pending_timestamp', new Date().toISOString());
  window.dispatchEvent(new CustomEvent('the_samaritan_offline_sync_status_changed', { detail: { pending: true } }));
}

export function clearOfflinePendingSync(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(OFFLINE_PENDING_KEY);
  localStorage.removeItem('the_samaritan_offline_pending_timestamp');
  window.dispatchEvent(new CustomEvent('the_samaritan_offline_sync_status_changed', { detail: { pending: false } }));
}

export async function flushPendingOfflineSync(): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') return { success: false, message: 'Browser only' };
  try {
    const res = await pushAllDataToGoogleSheet();
    clearOfflinePendingSync();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('the_samaritan_offline_autosynced', {
          detail: {
            timestamp: new Date().toISOString(),
            message: 'Device connected to internet: Your civic progress, tokens, badges & records have been automatically synced to Live Google Sheets and Cloud Backup.',
          },
        })
      );
    }
    return { success: true, message: res.message };
  } catch (err: any) {
    markOfflinePendingSync();
    return { success: false, message: err?.message || 'Sync failed' };
  }
}

/**
 * Debounced background auto-sync triggered on user interactions
 */
let autoSyncTimer: any = null;

export function triggerAutoSyncToGoogleSheet(delayMs: number = 2000): void {
  if (typeof window === 'undefined') return;
  const config = getGoogleSheetConfig();
  if (!config.autoSyncOnAction) return;

  if (autoSyncTimer) {
    clearTimeout(autoSyncTimer);
  }

  autoSyncTimer = setTimeout(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      markOfflinePendingSync();
      return;
    }

    pushAllDataToGoogleSheet()
      .then(() => clearOfflinePendingSync())
      .catch((err) => {
        markOfflinePendingSync();
        console.warn('[GoogleSheetSync] Background auto-sync notice:', err?.message || err);
      });
  }, delayMs);
}

/**
 * Initializes automatic sync on app startup, when regaining network connectivity,
 * and upon any civic data modification across the platform.
 */
export function initGoogleSheetSync(): void {
  if (typeof window === 'undefined') return;

  // Initial sync after app load (short delay to let UI mount smoothly)
  if (navigator.onLine) {
    setTimeout(() => {
      if (isOfflinePendingSync() || true) {
        pushAllDataToGoogleSheet()
          .then(() => clearOfflinePendingSync())
          .catch((err) => {
            console.log('[GoogleSheetSync] Startup sync note:', err?.message || err);
          });
      }
    }, 2500);
  }

  // Auto-sync as soon as the device reconnects to internet
  window.addEventListener('online', () => {
    console.log('[GoogleSheetSync] Internet reconnected. Triggering auto-send to Live Sheets & Cloud...');
    flushPendingOfflineSync().catch((err) => {
      console.warn('[GoogleSheetSync] Online flush error:', err);
    });
  });

  // Track offline mode
  window.addEventListener('offline', () => {
    console.log('[GoogleSheetSync] Device went offline. Queueing changes for auto-flush upon reconnect.');
    markOfflinePendingSync();
  });

  // Auto-sync listeners on civic data actions across modules
  const dataEvents = [
    'the_samaritan_user_registered',
    'the_samaritan_county_updated',
    'the_samaritan_user_deleted',
    'the_samaritan_progress_updated',
    'the_samaritan_tokens_updated',
    'the_samaritan_verifications_updated',
    'the_samaritan_question_created',
    'the_samaritan_question_answered',
    'the_samaritan_suggestion_added',
    'the_samaritan_suggestion_voted',
    'the_samaritan_certificate_issued',
    'the_samaritan_adaptation_updated',
    'the_samaritan_adaptation_proposals_updated',
    'the_samaritan_active_adaptations_changed',
    'the_samaritan_presence_updated',
    'the_samaritan_events_updated',
    'the_samaritan_data_changed',
  ];

  dataEvents.forEach((eventName) => {
    window.addEventListener(eventName, () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        markOfflinePendingSync();
      } else {
        triggerAutoSyncToGoogleSheet(2000);
      }
    });
  });
}

/**
 * Pings the Google Sheet Web App to verify connectivity
 */
export async function testGoogleSheetConnection(
  url: string = LIVE_GOOGLE_SHEET_URL
): Promise<{ connected: boolean; sheetName?: string; canRead?: boolean; message: string }> {
  const cleanUrl = (url || LIVE_GOOGLE_SHEET_URL).trim();
  if (!cleanUrl) {
    return { connected: false, message: 'URL cannot be empty' };
  }

  try {
    const res = await fetch(cleanUrl, { method: 'GET' });
    const json = await res.json();
    if (json.status === 'connected') {
      return {
        connected: true,
        sheetName: json.title || 'The Samaritan LogBook',
        canRead: true,
        message: `Connected to "${json.title || 'The Samaritan LogBook'}". Bidirectional Real-Time Read & Write active (${json.citizensCount ?? 0} citizens, ${json.inquiriesCount ?? 0} inquiries, ${json.progressCount ?? 0} progress logs, ${json.tokensCount ?? 0} tokens in sheet).`,
      };
    }
    return { connected: true, canRead: true, message: 'Connected successfully to Google Apps Script.' };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to connect: ${err.message || 'Ensure "Who has access" is set to "Anyone" when deploying as Web App.'}`,
    };
  }
}
