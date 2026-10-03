import { AuthUser } from '../types';
import { banUser, unbanUser, checkIfUserOrDeviceBanned } from './adminManagement';

export interface CivicDirectMessage {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  status: 'sent' | 'delivered' | 'blocked_by_operator';
  isSuspicious?: boolean;
  operatorFlagReason?: string;
  operatorCategory?: string;
  riskScore?: number;
  tokensUsed?: number;
}

export interface OperatorFlaggedIncident {
  id: string;
  messageId: string;
  senderUsername: string;
  recipientUsername: string;
  content: string;
  timestamp: string;
  category: string;
  categoryLabelEn: string;
  categoryLabelSw: string;
  explanationEn: string;
  explanationSw: string;
  riskScore: number;
  flaggedKeywords: string[];
  status: 'pending_samaritan_review' | 'approved_unbanned' | 'completely_banned';
  reviewedAt?: string;
  reviewedBy?: string;
  samaritanNotes?: string;
}

const DIRECT_MESSAGES_KEY = 'the_samaritan_direct_messages_v1';
const OPERATOR_INCIDENTS_KEY = 'the_samaritan_operator_incidents_v1';

export function getAllDirectMessages(): CivicDirectMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DIRECT_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveDirectMessages(messages: CivicDirectMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DIRECT_MESSAGES_KEY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('civic_messages_updated'));
  } catch (err) {}
}

export function getDirectMessagesBetween(
  username1?: string | null,
  username2?: string | null
): CivicDirectMessage[] {
  if (!username1 || !username2) return [];
  const u1 = username1.trim().toLowerCase().replace(/^@/, '');
  const u2 = username2.trim().toLowerCase().replace(/^@/, '');

  const all = getAllDirectMessages();
  return all.filter((m) => {
    const s = m.senderUsername.trim().toLowerCase().replace(/^@/, '');
    const r = m.recipientUsername.trim().toLowerCase().replace(/^@/, '');
    return (s === u1 && r === u2) || (s === u2 && r === u1);
  });
}

export function getUserConversations(
  myUsername?: string | null
): { peerUsername: string; lastMessage: CivicDirectMessage; unreadCount: number }[] {
  if (!myUsername) return [];
  const cleanMe = myUsername.trim().toLowerCase().replace(/^@/, '');
  const all = getAllDirectMessages();

  const map = new Map<string, { lastMessage: CivicDirectMessage; unreadCount: number }>();

  for (const m of all) {
    const s = m.senderUsername.trim().toLowerCase().replace(/^@/, '');
    const r = m.recipientUsername.trim().toLowerCase().replace(/^@/, '');

    if (s === cleanMe || r === cleanMe) {
      const peer = s === cleanMe ? m.recipientUsername : m.senderUsername;
      const isUnread = r === cleanMe && !m.isRead && m.status !== 'blocked_by_operator';

      const existing = map.get(peer);
      if (!existing || new Date(m.timestamp).getTime() > new Date(existing.lastMessage.timestamp).getTime()) {
        map.set(peer, {
          lastMessage: m,
          unreadCount: (existing?.unreadCount || 0) + (isUnread ? 1 : 0),
        });
      } else if (isUnread) {
        existing.unreadCount += 1;
      }
    }
  }

  return Array.from(map.entries()).map(([peerUsername, data]) => ({
    peerUsername,
    lastMessage: data.lastMessage,
    unreadCount: data.unreadCount,
  }));
}

export function markConversationAsRead(myUsername: string, peerUsername: string): void {
  if (!myUsername || !peerUsername) return;
  const cleanMe = myUsername.trim().toLowerCase().replace(/^@/, '');
  const cleanPeer = peerUsername.trim().toLowerCase().replace(/^@/, '');

  const all = getAllDirectMessages();
  let modified = false;

  for (const m of all) {
    const s = m.senderUsername.trim().toLowerCase().replace(/^@/, '');
    const r = m.recipientUsername.trim().toLowerCase().replace(/^@/, '');
    if (s === cleanPeer && r === cleanMe && !m.isRead) {
      m.isRead = true;
      modified = true;
    }
  }

  if (modified) {
    saveDirectMessages(all);
  }
}

// ---------------- The Operator AI Incident Storage & Oversight ---------------- //

export function getOperatorFlaggedIncidents(): OperatorFlaggedIncident[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OPERATOR_INCIDENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveOperatorFlaggedIncidents(incidents: OperatorFlaggedIncident[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OPERATOR_INCIDENTS_KEY, JSON.stringify(incidents));
    window.dispatchEvent(new CustomEvent('the_samaritan_operator_incident_submitted'));
  } catch (err) {}
}

/**
 * Fast Client-side fallback heuristics if backend is unreachable
 */
const FAST_CLIENT_PATTERNS = [
  {
    regex: /\b(burn|torch|attack|kill|panga|machete|choma|ua|piga|vita|maandamano ya vurugu|fukuza|dondoa)\b/i,
    category: 'incitement_violence',
    labelEn: 'Incitement to Violence & Civil Unrest',
    labelSw: 'Uchochezi wa Vurugu na Machafuko',
    explEn: 'Message promotes violent attacks or civil unrest violating Article 33(2) of the Constitution of Kenya.',
    explSw: 'Ujumbe unachochea vurugu na uvunjifu wa amani kinyume na Kifungu cha 33(2) cha Katiba ya Kenya.',
    risk: 92,
  },
  {
    regex: /\b(madoadoa|kabila fulani|washushe|ondoa hao|kikuyu|luo|kalenjin|kamba|mijikenda|digo|duruma|waswahili) (tuwapige|wasiishi|fukuza|hawafai|haribu|chuki)\b/i,
    category: 'ethnic_hate_speech',
    labelEn: 'Ethnic Hate Speech & Vilification',
    labelSw: 'Matamshi ya Chuki ya Kikabila',
    explEn: 'Message contains ethnic hate speech and vilification violating Article 27 and National Cohesion Act.',
    explSw: 'Ujumbe una chuki ya kikabila kinyume na Kifungu cha 27 cha Katiba na Sheria ya Uwiano.',
    risk: 95,
  },
  {
    regex: /\b(vote buying|sell vote|rig election|iba kura|nunua kura|feva kura|kura bandia|burn ballot|iba masanduku|vote twice)\b/i,
    category: 'electoral_malpractice',
    labelEn: 'Electoral Malpractice & Vote Tampering',
    labelSw: 'Udanganyifu wa Kura na Uchaguzi',
    explEn: 'Message attempts illegal vote trade or election rigging under the Elections Offences Act.',
    explSw: 'Ujumbe unahusisha jaribio la udanganyifu wa kura kinyume na Sheria ya Makosa ya Uchaguzi.',
    risk: 90,
  },
  {
    regex: /\b(send money or else|tuma pesa nisiku|extortion|nitakuua|tutakumaliza|blackmail|tuma mpesa ama|doxx)\b/i,
    category: 'violent_threat_extortion',
    labelEn: 'Violent Threats & Extortion',
    labelSw: 'Vitisho vya Mauaji na Unyang\'anyi',
    explEn: 'Message contains extortion or bodily threats under Penal Code Section 295.',
    explSw: 'Ujumbe una vitisho dhidi ya maisha na usalama wa mwananchi.',
    risk: 93,
  },
];

/**
 * Sends a direct peer-to-peer message monitored by The Operator AI.
 * If suspicious:
 * - Message is blocked
 * - Sender is automatically flagged and banned
 * - Incident submitted to The_Samaritan for executive review
 */
export async function sendDirectMessage(
  sender: AuthUser,
  recipientUsername: string,
  content: string
): Promise<{
  success: boolean;
  message: string;
  data?: CivicDirectMessage;
  incident?: OperatorFlaggedIncident;
  isBanned?: boolean;
}> {
  const cleanContent = content.trim();
  if (!cleanContent) {
    return { success: false, message: 'Message content cannot be empty.' };
  }

  // 1. Verify Sender is not currently banned
  const banCheck = checkIfUserOrDeviceBanned(sender.username);
  if (banCheck.isBanned) {
    return {
      success: false,
      message: `Account Suspended: You cannot send messages while under platform restriction (${banCheck.record?.reason || 'Chapter Six standard'}).`,
      isBanned: true,
    };
  }

  // 2. The Operator AI Sentinel Analysis
  let isSuspicious = false;
  let category = 'civic_subversion';
  let labelEn = 'Suspicious Civic Content';
  let labelSw = 'Maudhui Yanayotiliwa Shaka';
  let explEn = 'Message flagged by The Operator AI for constitutional non-compliance.';
  let explSw = 'Ujumbe umetambuliwa kukiuka maadili ya kikatiba na The Operator AI.';
  let riskScore = 0;
  let flaggedKeywords: string[] = [];

  // Try Server API first
  try {
    const res = await fetch('/api/operator-monitor-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: cleanContent,
        senderUsername: sender.username,
        recipientUsername,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.analysis) {
        if (data.analysis.isSuspicious) {
          isSuspicious = true;
          category = data.analysis.category || 'civic_subversion';
          labelEn = data.analysis.categoryLabel?.en || 'Suspicious Civic Content';
          labelSw = data.analysis.categoryLabel?.sw || 'Maudhui Yanayotiliwa Shaka';
          explEn = data.analysis.explanation?.en || 'Violated constitutional standards.';
          explSw = data.analysis.explanation?.sw || 'Imevunja maadili ya kikatiba.';
          riskScore = data.analysis.riskScore || 85;
          flaggedKeywords = data.analysis.flaggedKeywords || [];
        }
      }
    }
  } catch (err) {
    console.warn('[The Operator AI] Network monitor failed, activating local sentinel heuristic:', err);
  }

  // If server check didn't flag, run client heuristic safeguard
  if (!isSuspicious) {
    for (const p of FAST_CLIENT_PATTERNS) {
      const match = cleanContent.match(p.regex);
      if (match) {
        isSuspicious = true;
        category = p.category;
        labelEn = p.labelEn;
        labelSw = p.labelSw;
        explEn = p.explEn;
        explSw = p.explSw;
        riskScore = p.risk;
        flaggedKeywords = [match[0]];
        break;
      }
    }
  }

  // 3. Handle Suspicious / Malicious Message
  if (isSuspicious) {
    const messageId = 'msg_blocked_' + Date.now();
    const incidentId = 'incident_op_' + Date.now();

    // A) Automatically Flag and Ban Sender with Super Ban protection
    banUser(
      sender.username,
      `[The Operator AI Sentinel] Suspicious message flagged: ${labelEn} (${explEn}). Referred to The_Samaritan for executive adjudication.`,
      'The Operator AI',
      { banType: 'temporary', durationDays: 30, isSuperBan: true }
    );

    // B) Record Incident for The_Samaritan Account's Executive Review
    const incident: OperatorFlaggedIncident = {
      id: incidentId,
      messageId,
      senderUsername: sender.username,
      recipientUsername,
      content: cleanContent,
      timestamp: new Date().toISOString(),
      category,
      categoryLabelEn: labelEn,
      categoryLabelSw: labelSw,
      explanationEn: explEn,
      explanationSw: explSw,
      riskScore,
      flaggedKeywords,
      status: 'pending_samaritan_review',
    };

    const incidents = getOperatorFlaggedIncidents();
    incidents.unshift(incident);
    saveOperatorFlaggedIncidents(incidents);

    // C) Save blocked message record so sender sees it was intercepted
    const blockedMsg: CivicDirectMessage = {
      id: messageId,
      senderUsername: sender.username,
      recipientUsername,
      content: `[Message Intercepted by The Operator AI: ${labelEn}]`,
      timestamp: new Date().toISOString(),
      isRead: false,
      status: 'blocked_by_operator',
      isSuspicious: true,
      operatorFlagReason: explEn,
      operatorCategory: category,
      riskScore,
    };

    const all = getAllDirectMessages();
    all.push(blockedMsg);
    saveDirectMessages(all);

    return {
      success: false,
      message: `SECURITY ALERT: Your message was intercepted and flagged by The Operator AI (${labelEn}). Your account has been automatically suspended and submitted to The_Samaritan for review.`,
      data: blockedMsg,
      incident,
      isBanned: true,
    };
  }

  // 4. Safe Message - Deliver normally
  const newMsg: CivicDirectMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    senderUsername: sender.username,
    recipientUsername,
    content: cleanContent,
    timestamp: new Date().toISOString(),
    isRead: false,
    status: 'delivered',
  };

  const all = getAllDirectMessages();
  all.push(newMsg);
  saveDirectMessages(all);

  return {
    success: true,
    message: 'Message delivered successfully.',
    data: newMsg,
  };
}

/**
 * The_Samaritan Executive Action: Approve and Unban User
 * Clears the flag, revokes suspension, and restores full user privileges.
 */
export function approveAndUnbanUserBySamaritan(
  incidentId: string,
  samaritanNotes: string = 'Reviewed and approved by The_Samaritan Super Authority.'
): { success: boolean; message: string } {
  const incidents = getOperatorFlaggedIncidents();
  const inc = incidents.find((i) => i.id === incidentId);
  if (!inc) {
    return { success: false, message: 'Incident record not found.' };
  }

  // Lift user ban unconditionally under The_Samaritan Super Authority
  unbanUser(inc.senderUsername, 'The_Samaritan');

  // Update incident status
  inc.status = 'approved_unbanned';
  inc.reviewedAt = new Date().toISOString();
  inc.reviewedBy = 'The_Samaritan';
  inc.samaritanNotes = samaritanNotes;

  saveOperatorFlaggedIncidents(incidents);

  return {
    success: true,
    message: `[The_Samaritan Executive Decision] Incident #${incidentId} approved. User @${inc.senderUsername} has been cleared of suspicion and unbanned.`,
  };
}

/**
 * The_Samaritan Executive Action: Completely Ban from Platform
 * Enforces a permanent, irrevocable Super Ban on the user.
 */
export function completelyBanUserBySamaritan(
  incidentId: string,
  samaritanNotes: string = 'Permanently banned by The_Samaritan after Operator AI security review.'
): { success: boolean; message: string } {
  const incidents = getOperatorFlaggedIncidents();
  const inc = incidents.find((i) => i.id === incidentId);
  if (!inc) {
    return { success: false, message: 'Incident record not found.' };
  }

  // Enforce permanent Super Ban
  banUser(
    inc.senderUsername,
    `[The_Samaritan Permanent Ban] Permanent platform expulsion following The Operator AI incident #${incidentId} (${inc.categoryLabelEn}). ${samaritanNotes}`,
    'The_Samaritan',
    { banType: 'permanent', isSuperBan: true }
  );

  // Update incident status
  inc.status = 'completely_banned';
  inc.reviewedAt = new Date().toISOString();
  inc.reviewedBy = 'The_Samaritan';
  inc.samaritanNotes = samaritanNotes;

  saveOperatorFlaggedIncidents(incidents);

  return {
    success: true,
    message: `[The_Samaritan Executive Decision] User @${inc.senderUsername} has been completely and permanently banned from The Samaritan platform.`,
  };
}
