import { AuthUser, UserDirectNotification, MessageAttachment } from '../types';
import { banUser, unbanUser, checkIfUserOrDeviceBanned, USER_NOTIFICATIONS_KEY } from './adminManagement';

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
  attachment?: MessageAttachment;
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

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function detectAttachmentType(fileName: string, mimeType: string = ''): 'pdf' | 'doc' | 'excel' | 'image' | 'file' {
  const lowerName = (fileName || '').toLowerCase();
  const lowerMime = (mimeType || '').toLowerCase();
  if (lowerName.endsWith('.pdf') || lowerMime.includes('pdf')) return 'pdf';
  if (
    lowerName.endsWith('.doc') ||
    lowerName.endsWith('.docx') ||
    lowerName.endsWith('.txt') ||
    lowerName.endsWith('.rtf') ||
    lowerMime.includes('word') ||
    lowerMime.includes('text/plain')
  ) {
    return 'doc';
  }
  if (
    lowerName.endsWith('.xls') ||
    lowerName.endsWith('.xlsx') ||
    lowerName.endsWith('.csv') ||
    lowerMime.includes('excel') ||
    lowerMime.includes('spreadsheet') ||
    lowerMime.includes('csv')
  ) {
    return 'excel';
  }
  if (
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.webp') ||
    lowerName.endsWith('.gif') ||
    lowerName.endsWith('.svg') ||
    lowerMime.startsWith('image/')
  ) {
    return 'image';
  }
  return 'file';
}

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

const NOTIFIED_MSG_IDS_KEY = 'the_samaritan_notified_msg_ids_v1';

export function getNotifiedMessageIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = sessionStorage.getItem(NOTIFIED_MSG_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function markMessageIdAsNotified(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getNotifiedMessageIds();
    current.add(id);
    sessionStorage.setItem(NOTIFIED_MSG_IDS_KEY, JSON.stringify(Array.from(current)));
  } catch (e) {}
}

/**
 * Plays a gentle, pleasant dual-tone Web Audio chime when a message is received in real time.
 */
export function playMessageNotificationSound(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    // Tone 1: E5 (659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Tone 2: A5 (880Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Non-blocking if audio not permitted
  }
}

/**
 * Ensures an incoming direct message creates or updates an official user direct notification
 * so that the header notification bell updates its badge counter and the drawer displays it.
 */
export function recordDirectMessageNotification(msg: CivicDirectMessage): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    const list: UserDirectNotification[] = raw ? JSON.parse(raw) : [];

    const notifId = 'msg_notif_' + msg.id;
    const existingIdx = list.findIndex((n) => n.id === notifId || n.directMessageId === msg.id);

    const notif: UserDirectNotification = {
      id: notifId,
      targetUsername: msg.recipientUsername,
      recipientUsername: msg.recipientUsername,
      sentBy: msg.senderUsername,
      senderTitle: 'Citizen Peer',
      title: `Message from @${msg.senderUsername}`,
      message: msg.content.length > 90 ? msg.content.substring(0, 90) + '...' : msg.content,
      category: 'message',
      directMessageId: msg.id,
      timestamp: msg.timestamp,
      isRead: msg.isRead,
      replies: [],
    };

    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...notif };
    } else {
      list.unshift(notif);
    }

    localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(list.slice(0, 100)));
    window.dispatchEvent(
      new CustomEvent('the_samaritan_user_notification_received', { detail: notif })
    );
    window.dispatchEvent(new CustomEvent('the_samaritan_user_notification_sent'));
  } catch (e) {
    console.warn('[Messaging] Failed recording notification for direct message:', e);
  }
}

/**
 * Transmits a direct message to the cloud endpoint so all devices and recipient sessions immediately receive it
 */
export async function pushMessageToCloud(msg: CivicDirectMessage): Promise<void> {
  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
  } catch (err) {
    console.warn('[Messaging] Failed to push message to cloud backend:', err);
  }
}

/**
 * Polls the cloud endpoint for real-time messages and notifies the recipient immediately
 */
export async function syncDirectMessagesWithCloud(myUsername?: string | null): Promise<CivicDirectMessage[]> {
  if (typeof window === 'undefined') return [];
  const cleanMe = (myUsername || '').trim().toLowerCase().replace(/^@/, '');

  try {
    const query = cleanMe ? `?username=${encodeURIComponent(cleanMe)}` : '';
    const res = await fetch(`/api/messages${query}`);
    if (!res.ok) return getAllDirectMessages();

    const data = await res.json();
    if (!data.success || !Array.isArray(data.messages)) return getAllDirectMessages();

    const cloudMsgs: CivicDirectMessage[] = data.messages;
    const localMsgs = getAllDirectMessages();
    const map = new Map<string, CivicDirectMessage>();

    for (const m of localMsgs) {
      map.set(m.id, m);
    }

    const notifiedSet = getNotifiedMessageIds();
    let hasNewIncoming = false;
    let newlyReceivedMessage: CivicDirectMessage | null = null;

    for (const cm of cloudMsgs) {
      const existing = map.get(cm.id);
      if (!existing) {
        map.set(cm.id, cm);
        // Check if this is a newly received message addressed to current user
        const r = (cm.recipientUsername || '').trim().toLowerCase().replace(/^@/, '');
        const s = (cm.senderUsername || '').trim().toLowerCase().replace(/^@/, '');
        if (cleanMe && r === cleanMe && s !== cleanMe && !cm.isRead && cm.status === 'delivered') {
          if (!notifiedSet.has(cm.id)) {
            hasNewIncoming = true;
            newlyReceivedMessage = cm;
            markMessageIdAsNotified(cm.id);
            recordDirectMessageNotification(cm);
          }
        }
      } else {
        // Merge latest read/status state
        map.set(cm.id, {
          ...existing,
          ...cm,
          isRead: existing.isRead || cm.isRead,
        });
      }
    }

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    localStorage.setItem(DIRECT_MESSAGES_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('civic_messages_updated'));

    if (hasNewIncoming && newlyReceivedMessage) {
      playMessageNotificationSound();
      window.dispatchEvent(
        new CustomEvent('the_samaritan_message_received', {
          detail: { message: newlyReceivedMessage },
        })
      );
    }

    return merged;
  } catch (err) {
    return getAllDirectMessages();
  }
}

/**
 * Initializes continuous real-time synchronization between active users
 */
export function startRealTimeMessageSync(
  getCurrentUsername: () => string | null
): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Initial immediate sync
  syncDirectMessagesWithCloud(getCurrentUsername());

  // 2. Fast background poll (every 2.5s)
  const intervalId = setInterval(() => {
    syncDirectMessagesWithCloud(getCurrentUsername());
  }, 2500);

  // 3. Instant local cross-tab sync via storage events
  const handleStorage = (e: StorageEvent) => {
    if (e.key === DIRECT_MESSAGES_KEY) {
      window.dispatchEvent(new CustomEvent('civic_messages_updated'));
    } else if (e.key === USER_NOTIFICATIONS_KEY) {
      window.dispatchEvent(new CustomEvent('the_samaritan_user_notification_sent'));
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener('storage', handleStorage);
  };
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
    fetch('/api/messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ myUsername, peerUsername }),
    }).catch(() => {});
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
  content: string,
  attachment?: MessageAttachment
): Promise<{
  success: boolean;
  message: string;
  data?: CivicDirectMessage;
  incident?: OperatorFlaggedIncident;
  isBanned?: boolean;
}> {
  const cleanContent = content.trim();
  if (!cleanContent && !attachment) {
    return { success: false, message: 'Message content or attachment cannot be empty.' };
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
    attachment,
  };

  const all = getAllDirectMessages();
  all.push(newMsg);
  saveDirectMessages(all);

  // Instantly mirror to cloud backend for real-time delivery to other peers & devices
  pushMessageToCloud(newMsg).catch(() => {});

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
