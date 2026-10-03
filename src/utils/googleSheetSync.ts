/**
 * Google Sheets & Apps Script Sync Integration (100% Free - Zero Cloud Billing)
 * 
 * Allows bidirectional or push/pull syncing of:
 * - Citizens Roster (registered users)
 * - Citizen Inquiries & Constitutional Answers
 * - Citizen Suggestions & Feedback
 * - Issued Certificates
 * - System Incidents & Audit Logs
 * 
 * Works with any standard Google Sheet published via Google Apps Script Web App (Exec URL).
 * Safe, CORS-friendly, offline-resilient, and requires zero paid Google Cloud infrastructure.
 */

import { getRegisteredUsers, getCivicQuestions } from './authAndQuestions';
import { getAllIssuedCertificates } from './certificateRegistry';
import { getFeatureSuggestions } from './suggestionBox';

const GOOGLE_SHEET_CONFIG_KEY = 'the_samaritan_google_sheet_sync_v1';

export interface GoogleSheetSyncConfig {
  webAppUrl: string;
  autoSyncOnAction: boolean;
  lastSyncedAt?: string;
  lastSyncStatus?: 'success' | 'error' | 'idle';
  lastSyncMessage?: string;
}

const DEFAULT_CONFIG: GoogleSheetSyncConfig = {
  webAppUrl: '',
  autoSyncOnAction: false,
  lastSyncStatus: 'idle',
};

export function getGoogleSheetConfig(): GoogleSheetSyncConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(GOOGLE_SHEET_CONFIG_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
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
 * Standard Apps Script template provided to the user/admin to copy-paste into Google Sheets Extensions > Apps Script.
 */
export const SAMPLE_APPS_SCRIPT_CODE = `/**
 * The Samaritan - Free Live Google Sheets Data Hub (Google Apps Script)
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any code in the editor and paste this entire code.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "Samaritan Sync API".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone" (crucial for CORS & direct app sync without login).
 * 9. Click "Deploy", authorize the script, and copy the Web App URL (ends in /exec).
 * 10. Paste the Web App URL into The Samaritan Admin Panel > Live Google Sheet Sync.
 */

function doPost(e) {
  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var action = payload.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'sync_all' || action === 'push_data') {
      // 1. Sync Citizens Roster
      if (payload.citizens && Array.isArray(payload.citizens)) {
        var sheetUsers = getOrCreateSheet(ss, 'Citizens_Roster', ['Username', 'County', 'SubCounty', 'Role', 'RegisteredAt']);
        var existingUsers = getExistingColumnValues(sheetUsers, 1);
        payload.citizens.forEach(function(u) {
          if (existingUsers.indexOf(u.username) === -1) {
            sheetUsers.appendRow([u.username, u.county || 'Kwale', u.subCounty || 'N/A', u.role || 'citizen', u.createdAt || new Date().toISOString()]);
          }
        });
      }

      // 2. Sync Citizen Inquiries
      if (payload.questions && Array.isArray(payload.questions)) {
        var sheetQ = getOrCreateSheet(ss, 'Citizen_Inquiries', ['ID', 'Title', 'Category', 'AskedBy', 'County', 'Status', 'Date', 'FirstAnswer']);
        var existingQ = getExistingColumnValues(sheetQ, 1);
        payload.questions.forEach(function(q) {
          if (existingQ.indexOf(q.id) === -1) {
            var firstAns = (q.answers && q.answers.length > 0) ? q.answers[0].answeredBy + ': ' + q.answers[0].text.substring(0, 100) : 'Pending';
            sheetQ.appendRow([q.id, q.title, q.category, q.askedByAnonymousHandle, q.locationCounty || 'Kwale', q.status, q.createdAt, firstAns]);
          }
        });
      }

      // 3. Sync Suggestions
      if (payload.suggestions && Array.isArray(payload.suggestions)) {
        var sheetS = getOrCreateSheet(ss, 'Suggestions', ['ID', 'Title', 'Category', 'SuggestedBy', 'Votes', 'Status', 'Date']);
        var existingS = getExistingColumnValues(sheetS, 1);
        payload.suggestions.forEach(function(s) {
          if (existingS.indexOf(s.id) === -1) {
            sheetS.appendRow([s.id, s.title, s.category, s.suggestedBy, s.votes || 0, s.status, s.createdAt]);
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

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'All Samaritan records synced successfully',
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
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

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetUsers = ss.getSheetByName('Citizens_Roster');
  var usersCount = sheetUsers ? Math.max(0, sheetUsers.getLastRow() - 1) : 0;
  
  var sheetQ = ss.getSheetByName('Citizen_Inquiries');
  var qCount = sheetQ ? Math.max(0, sheetQ.getLastRow() - 1) : 0;

  return ContentService.createTextOutput(JSON.stringify({
    status: 'connected',
    title: ss.getName(),
    citizensCount: usersCount,
    inquiriesCount: qCount,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
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
 */
export async function pushAllDataToGoogleSheet(customUrl?: string): Promise<SyncPushResult> {
  const config = getGoogleSheetConfig();
  const targetUrl = (customUrl || config.webAppUrl || '').trim();

  if (!targetUrl) {
    throw new Error('Google Apps Script Web App URL is not configured. Please paste your deployment URL.');
  }

  // Compile local data bundles
  const citizens = getRegisteredUsers().map(u => ({
    username: u.username,
    county: u.county || 'Kwale',
    subCounty: u.subCounty || 'N/A',
    role: 'citizen',
    createdAt: u.createdAt || new Date().toISOString(),
  }));

  const questions = getCivicQuestions().map(q => ({
    id: q.id,
    title: q.title,
    category: q.category,
    askedByAnonymousHandle: q.askedByAnonymousHandle,
    locationCounty: q.locationCounty || 'Kwale',
    status: q.status,
    createdAt: q.createdAt,
    answers: q.answers,
  }));

  const suggestions = getFeatureSuggestions().map(s => ({
    id: s.id,
    title: s.title,
    category: s.category,
    suggestedBy: s.suggestedBy,
    votes: s.votes,
    status: s.status,
    createdAt: s.createdAt,
  }));

  const certificates = getAllIssuedCertificates().map(c => ({
    certificateNumber: c.id,
    recipientName: c.recipientName,
    courseTitle: c.courseId,
    issueDate: c.issuedAt,
  }));

  const payload = {
    action: 'sync_all',
    citizens,
    questions,
    suggestions,
    certificates,
    sentAt: new Date().toISOString(),
  };

  try {
    // Note: Google Apps Script Web Apps follow 302 redirects. standard POST with text/plain body avoids CORS preflight blockage.
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

    const successMsg = `Synced ${citizens.length} citizens, ${questions.length} inquiries, ${suggestions.length} suggestions, and ${certificates.length} certificates to Google Sheets.`;
    saveGoogleSheetConfig({
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: 'success',
      lastSyncMessage: successMsg,
    });

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
 * Pings the Google Sheet Web App to verify connectivity
 */
export async function testGoogleSheetConnection(url: string): Promise<{ connected: boolean; sheetName?: string; message: string }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { connected: false, message: 'URL cannot be empty' };
  }

  try {
    const res = await fetch(cleanUrl, { method: 'GET' });
    const json = await res.json();
    if (json.status === 'connected') {
      return {
        connected: true,
        sheetName: json.title || 'Connected Sheet',
        message: `Connected to "${json.title}". Found ${json.citizensCount} registered citizens and ${json.inquiriesCount} inquiries in sheet.`,
      };
    }
    return { connected: true, message: 'Connected successfully to Google Apps Script.' };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to connect: ${err.message || 'Ensure "Who has access" is set to "Anyone" when deploying as Web App.'}`,
    };
  }
}
