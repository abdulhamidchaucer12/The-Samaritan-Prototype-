/**
 * Local Database & Excel Backup Utility
 * Provides offline Excel (.xlsx) data export, import, and synchronization
 * for all Samaritan civic platform data:
 * - Registered Citizens Roster
 * - Citizen Inquiries & Constitutional Answers
 * - Facilitator Token Ledger
 * - Facilitator Certificates
 * - System Audit / Incident Logs
 * 
 * Runs 100% locally in browser without external cloud dependencies or billing.
 */

import * as XLSX from 'xlsx';
import { getRegisteredUsers, getCivicQuestions } from './authAndQuestions';
import { getAllTokenGrants } from './facilitatorTokenRegistry';
import { getAllIssuedCertificates } from './certificateRegistry';
import { getBannedUsers } from './adminManagement';
import { getOperatorFlaggedIncidents } from './civicMessagingService';

export interface DatabaseExportSummary {
  exportedAt: string;
  totalUsers: number;
  totalQuestions: number;
  totalGrants: number;
  totalCertificates: number;
  totalIncidents: number;
}

/**
 * Exports complete civic database to an Excel (.xlsx) workbook with multiple structured sheets
 */
export function exportDatabaseToExcel(fileNamePrefix = 'The_Samaritan_Civic_Database'): DatabaseExportSummary {
  const users = getRegisteredUsers();
  const questions = getCivicQuestions();
  const tokenGrants = getAllTokenGrants();
  const certificates = getAllIssuedCertificates();
  const bannedUsers = getBannedUsers();
  const incidents = getOperatorFlaggedIncidents();

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // 1. Citizens Roster Sheet
  const usersData = users.map((u) => ({
    Username: u.username,
    County: u.county || 'Kwale',
    SubCounty: u.subCounty || 'N/A',
    CreatedAt: u.createdAt || 'N/A',
  }));
  const usersSheet = XLSX.utils.json_to_sheet(usersData.length ? usersData : [{ Status: 'No users registered' }]);
  XLSX.utils.book_append_sheet(workbook, usersSheet, 'Citizens_Roster');

  // 2. Questions & Constitutional Answers Sheet
  const questionsData = questions.map((q) => ({
    ID: q.id,
    Title: q.title,
    Details: q.details,
    Category: q.category,
    AskedBy: q.askedByAnonymousHandle,
    LocationCounty: q.locationCounty || 'National',
    Status: q.status,
    CreatedAt: q.createdAt,
    AnswersCount: q.answers ? q.answers.length : 0,
    FirstAnswerAdmin: q.answers && q.answers.length > 0 ? q.answers[0].answeredBy : 'Pending',
    FirstAnswerArticles: q.answers && q.answers.length > 0 ? (q.answers[0].constitutionalArticle || 'N/A') : 'Pending',
  }));
  const questionsSheet = XLSX.utils.json_to_sheet(
    questionsData.length ? questionsData : [{ Status: 'No citizen inquiries' }]
  );
  XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Citizen_Inquiries');

  // 3. Facilitator Token Ledger Sheet
  const tokensData = tokenGrants.map((t) => ({
    GrantID: t.id,
    Recipient: t.recipientUsername,
    Amount: t.amount,
    Reason: t.reason,
    GrantedBy: t.grantedBy,
    GrantedAt: t.grantedAt,
    TrainingBatch: t.trainingBatch || 'General',
  }));
  const tokensSheet = XLSX.utils.json_to_sheet(tokensData.length ? tokensData : [{ Status: 'No token grants' }]);
  XLSX.utils.book_append_sheet(workbook, tokensSheet, 'Token_Ledger');

  // 4. Certificates Registry Sheet
  const certsData = certificates.map((c) => ({
    CertificateID: c.id,
    CourseID: c.courseId,
    RecipientName: c.recipientName,
    UserKey: c.userKey,
    Score: `${c.score}/${c.total}`,
    Grade: c.grade,
    IssuedAt: c.issuedAt,
    Status: c.status || 'issued',
  }));
  const certsSheet = XLSX.utils.json_to_sheet(certsData.length ? certsData : [{ Status: 'No certificates' }]);
  XLSX.utils.book_append_sheet(workbook, certsSheet, 'Certificates_Issued');

  // 5. Banned Users & Incident Audit Sheet
  const incidentsData = incidents.map((inc) => ({
    IncidentID: inc.id,
    Sender: inc.senderUsername,
    Recipient: inc.recipientUsername,
    Category: inc.category,
    RiskScore: inc.riskScore,
    FlaggedKeywords: (inc.flaggedKeywords || []).join(', '),
    Status: inc.status,
    Timestamp: inc.timestamp,
    ExplanationEn: inc.explanationEn,
  }));
  const incidentsSheet = XLSX.utils.json_to_sheet(
    incidentsData.length ? incidentsData : [{ Status: 'No security incidents' }]
  );
  XLSX.utils.book_append_sheet(workbook, incidentsSheet, 'Incident_Audit');

  // 6. Access Bans Sheet
  const bansData = bannedUsers.map((b) => ({
    Username: b.username,
    DeviceId: b.deviceId || 'N/A',
    Reason: b.reason,
    BanType: b.banType,
    BannedAt: b.bannedAt,
    BannedBy: b.bannedBy,
  }));
  const bansSheet = XLSX.utils.json_to_sheet(bansData.length ? bansData : [{ Status: 'No banned accounts' }]);
  XLSX.utils.book_append_sheet(workbook, bansSheet, 'Access_Bans');

  // Generate file download
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `${fileNamePrefix}_${dateStr}.xlsx`;
  XLSX.writeFile(workbook, filename);

  return {
    exportedAt: new Date().toISOString(),
    totalUsers: users.length,
    totalQuestions: questions.length,
    totalGrants: tokenGrants.length,
    totalCertificates: certificates.length,
    totalIncidents: incidents.length,
  };
}

/**
 * Reads an uploaded Excel file (.xlsx) and parses data from its sheets
 */
export async function readExcelDatabaseFile(file: File): Promise<{
  sheetsFound: string[];
  citizensCount: number;
  inquiriesCount: number;
  data: Record<string, any[]>;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        if (!buffer) {
          throw new Error('Empty file content');
        }
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const sheetsFound = workbook.SheetNames;
        const parsedData: Record<string, any[]> = {};

        sheetsFound.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          parsedData[sheetName] = XLSX.utils.sheet_to_json(sheet);
        });

        const citizens = parsedData['Citizens_Roster'] || [];
        const inquiries = parsedData['Citizen_Inquiries'] || [];

        resolve({
          sheetsFound,
          citizensCount: citizens.length,
          inquiriesCount: inquiries.length,
          data: parsedData,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
