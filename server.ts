import express from "express";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import dotenv from "dotenv";
import { generateConstitutionalAiAnswer } from "./server/constitutionalAi";
import { developCourseWithOperatorAi } from "./server/operatorCourseDeveloper";
import { monitorMessageWithOperatorAi } from "./server/operatorSentinel";
import {
  getRahamProtocolDocuments,
  addRahamProtocolDocument,
  deleteRahamProtocolDocument,
} from "./server/rahamProtocol";
import {
  saveUserCloudBackup,
  getUserCloudBackup,
  saveFullCloudPlatformSnapshot,
  getFullCloudPlatformSnapshot,
  recordCloudPresence,
  getCloudPresence,
  removeCloudPresenceSession,
  saveCloudDirectMessage,
  getCloudDirectMessages,
  markCloudMessagesRead,
  saveCloudNotification,
  getCloudNotifications,
  markCloudNotificationRead,
  saveCloudSupplementaryCourse,
  getCloudSupplementaryCourses,
} from "./server/cloudBackup";
import { handleRahamAdminChat } from "./server/rahamAiAssistant";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 1. Enterprise Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), payment=()");
    res.setHeader("X-Samaritan-Security-Shield", "Military-Grade-Sentinel-Active");
    next();
  });

  // 2. Prototype Pollution & Injection Defense Middleware
  const cleanObject = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(cleanObject);
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleaned[key] = cleanObject(obj[key]);
    }
    return cleaned;
  };

  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      req.body = cleanObject(req.body);
    }
    next();
  });

  // 3. In-Memory Sliding Window Rate Limiter
  interface RateLimitBucket {
    tokens: number;
    lastRefill: number;
  }
  const rateLimitStore = new Map<string, RateLimitBucket>();

  const createRateLimiter = (limitPerMinute: number = 60) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
      const key = `${ip}:${req.baseUrl || ''}${req.path}`;
      const now = Date.now();

      let bucket = rateLimitStore.get(key);
      if (!bucket) {
        bucket = { tokens: limitPerMinute, lastRefill: now };
        rateLimitStore.set(key, bucket);
      } else {
        const elapsed = (now - bucket.lastRefill) / 1000;
        const refill = elapsed * (limitPerMinute / 60);
        bucket.tokens = Math.min(limitPerMinute, bucket.tokens + refill);
        bucket.lastRefill = now;
      }

      if (bucket.tokens < 1) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({
          error: 'Security Rate Limit Exceeded',
          message: 'The Samaritan Sentinel Shield has throttled requests from this IP to prevent abuse. Please retry in 60 seconds.',
        });
      }

      bucket.tokens -= 1;
      next();
    };
  };

  const generalApiLimiter = createRateLimiter(120);
  const aiGenerationLimiter = createRateLimiter(25);
  const dataMutationLimiter = createRateLimiter(30);

  // Apply general limiter to /api
  app.use('/api', generalApiLimiter);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      platform: "The Samaritan Civic Education Platform",
      aiAvailable: !!process.env.GEMINI_API_KEY,
      security: {
        sentinelShield: "active",
        headers: "enforced",
        rateLimiter: "sliding_window_active",
        antiInjection: "enforced",
      },
    });
  });

  // Automated Constitutional AI Answer endpoint for Operator
  app.post("/api/constitutional-ai-answer", aiGenerationLimiter, async (req, res) => {
    try {
      const { title, details, category, county, userLanguage } = req.body;

      if (!title || !details) {
        return res.status(400).json({
          error: "Question title and details are required.",
        });
      }

      const operatorAnswer = await generateConstitutionalAiAnswer({
        title,
        details,
        category,
        county,
        userLanguage: userLanguage === "sw" ? "sw" : "en",
      });

      return res.json({
        success: true,
        answer: operatorAnswer,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed to generate Operator answer:", error);
      return res.status(500).json({
        error: "Failed to generate constitutional answer.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Operator AI Course & 10-Question Developer endpoint
  app.post("/api/operator-develop-course", aiGenerationLimiter, async (req, res) => {
    try {
      const { topic, category, summaryEn, summarySw, userLanguage } = req.body;

      if (!topic || typeof topic !== "string" || !topic.trim()) {
        return res.status(400).json({
          error: "Course topic or title is required for Operator AI development.",
        });
      }

      const developedCourse = await developCourseWithOperatorAi({
        topic: topic.trim(),
        category: category || "constitution",
        summaryEn,
        summarySw,
        userLanguage: userLanguage === "sw" ? "sw" : "en",
      });

      return res.json({
        success: true,
        developedCourse,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed to develop course with Operator AI:", error);
      return res.status(500).json({
        error: "Failed to develop course with Operator AI.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // The Operator AI - Peer-to-Peer Message Safety & Civic Integrity Sentinel
  app.post("/api/operator-monitor-message", aiGenerationLimiter, async (req, res) => {
    try {
      const { content, senderUsername, recipientUsername } = req.body;

      if (!content || !senderUsername || !recipientUsername) {
        return res.status(400).json({
          error: "Content, senderUsername, and recipientUsername are required.",
        });
      }

      const analysis = await monitorMessageWithOperatorAi({
        content,
        senderUsername,
        recipientUsername,
      });

      return res.json({
        success: true,
        analysis,
      });
    } catch (error: any) {
      console.error("[Server Error] Operator Sentinel message analysis failed:", error);
      return res.status(500).json({
        error: "Failed to analyze message safety.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // The Raham Protocol Knowledgebase - Managed by The_Samaritan to guide Operator AI
  app.get("/api/raham-protocol", (req, res) => {
    try {
      const documents = getRahamProtocolDocuments();
      return res.json({
        success: true,
        documents,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed to retrieve Raham Protocol materials:", error);
      return res.status(500).json({
        error: "Failed to retrieve Raham Protocol materials.",
        message: error?.message || "Internal server error",
      });
    }
  });

  app.post("/api/raham-protocol", dataMutationLimiter, (req, res) => {
    try {
      const {
        title,
        category,
        statutoryAnchors,
        summary,
        fullContent,
        whatIfScenarios,
        practicalExamples,
        uploadedBy,
        sourceType,
        mediaType,
        attachments,
        externalLink,
        fileName,
        fileDataUrl,
        fileSizeBytes,
      } = req.body;
      if (!title || (!fullContent && !fileName && !externalLink)) {
        return res.status(400).json({
          error: "Title and content (or document/link) are required to append to The Raham Protocol.",
        });
      }

      const doc = addRahamProtocolDocument({
        title,
        category: category || "custom",
        statutoryAnchors: statutoryAnchors || "Constitution of Kenya 2010",
        summary: summary || title,
        fullContent: fullContent || `Material document "${fileName || title}" registered in The Raham Protocol.`,
        whatIfScenarios,
        practicalExamples,
        uploadedBy: uploadedBy || "The_Samaritan",
        isActive: true,
        sourceType: sourceType || "upload",
        mediaType: mediaType || (fileName ? "document" : externalLink ? "link" : "text"),
        attachments: attachments || [],
        externalLink,
        fileName,
        fileDataUrl,
        fileSizeBytes,
      });

      return res.json({
        success: true,
        document: doc,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed to add Raham Protocol document:", error);
      return res.status(500).json({
        error: "Failed to add to The Raham Protocol.",
        message: error?.message || "Internal server error",
      });
    }
  });

  app.delete("/api/raham-protocol/:id", dataMutationLimiter, (req, res) => {
    try {
      const { id } = req.params;
      // Strict alphanumeric identifier validation to prevent path traversal or injection
      if (!id || !/^[a-zA-Z0-9_\-]+$/.test(id)) {
        return res.status(400).json({
          error: "Invalid document identifier format.",
        });
      }
      const success = deleteRahamProtocolDocument(id);
      return res.json({
        success,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed to delete Raham Protocol document:", error);
      return res.status(500).json({
        error: "Failed to remove from The Raham Protocol.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // -------------------------------------------------------------
  // Google Cloud Server Backup & Cross-Device Sync Endpoints
  // -------------------------------------------------------------
  app.post("/api/cloud-backup/sync", async (req, res) => {
    try {
      const { username, progress, tokenBalance, tokenGrants, verificationBadge, issuedCertificates, dailyVisits, county, subCounty, avatarUrl, platformData } = req.body;

      if (!username && !platformData) {
        return res.status(400).json({ error: "Username or platform snapshot data required." });
      }

      let updatedUser = null;
      if (username) {
        updatedUser = saveUserCloudBackup(username, {
          progress,
          tokenBalance,
          tokenGrants,
          verificationBadge,
          issuedCertificates,
          dailyVisits,
          county,
          subCounty,
          avatarUrl,
        });
      }

      if (platformData && typeof platformData === "object") {
        saveFullCloudPlatformSnapshot(platformData);
      }

      return res.json({
        success: true,
        message: "Successfully mirrored progress and credentials to cloud backup.",
        timestamp: new Date().toISOString(),
        userBackup: updatedUser,
      });
    } catch (error: any) {
      console.error("[Server Error] Cloud backup sync failed:", error);
      return res.status(500).json({
        error: "Failed to persist to cloud backup.",
        message: error?.message || "Internal server error",
      });
    }
  });

  app.get("/api/cloud-backup/user/:username", (req, res) => {
    try {
      const { username } = req.params;
      if (!username) {
        return res.status(400).json({ error: "Username parameter is required." });
      }

      const backup = getUserCloudBackup(username);
      return res.json({
        success: true,
        found: !!backup,
        backup,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving user cloud backup:", error);
      return res.status(500).json({
        error: "Failed to retrieve cloud backup for user.",
        message: error?.message || "Internal server error",
      });
    }
  });

  app.get("/api/cloud-backup/snapshot", (req, res) => {
    try {
      const snapshot = getFullCloudPlatformSnapshot();
      return res.json({
        success: true,
        snapshot,
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving platform snapshot:", error);
      return res.status(500).json({
        error: "Failed to retrieve full platform cloud snapshot.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Real-Time Cloud Presence Sync:
  // Post user/admin heartbeat to the cloud so all online devices and live sheets can immediately see genuine presence
  app.post("/api/cloud-backup/presence", (req, res) => {
    try {
      const session = req.body;
      if (!session || (!session.id && !session.username)) {
        return res.status(400).json({ error: "Session payload with id or username is required." });
      }
      const activeSessions = recordCloudPresence(session);
      return res.json({
        success: true,
        activeSessions,
        onlineCount: activeSessions.filter((s) => s.isOnline).length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed recording cloud presence:", error);
      return res.status(500).json({
        error: "Failed to record presence in cloud.",
        message: error?.message || "Internal server error",
      });
    }
  });

  app.get("/api/cloud-backup/presence", (req, res) => {
    try {
      const activeSessions = getCloudPresence();
      return res.json({
        success: true,
        activeSessions,
        onlineCount: activeSessions.filter((s) => s.isOnline).length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving cloud presence:", error);
      return res.status(500).json({
        error: "Failed to retrieve presence from cloud.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Dedicated endpoint to remove allocated guest session or mark offline when user logs in with their own name
  app.post("/api/cloud-backup/presence/offline", (req, res) => {
    try {
      const { id, username } = req.body || {};
      if (!id && !username) {
        return res.status(400).json({ error: "Session id or username required to mark offline." });
      }
      const activeSessions = removeCloudPresenceSession({ id, username });
      return res.json({
        success: true,
        activeSessions,
        onlineCount: activeSessions.filter((s) => s.isOnline).length,
        message: "Session successfully removed and set offline.",
      });
    } catch (error: any) {
      console.error("[Server Error] Failed marking presence offline:", error);
      return res.status(500).json({
        error: "Failed to mark presence offline.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // ---------------------------------------------------------------
  // Real-Time Peer-to-Peer Messages & Recipient Notification APIs
  // ---------------------------------------------------------------

  // Retrieve messages (optionally filtered by username or timestamp)
  app.get("/api/messages", (req, res) => {
    try {
      const username = req.query.username as string | undefined;
      const since = req.query.since as string | undefined;
      const messages = getCloudDirectMessages(username, since);
      return res.json({
        success: true,
        messages,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving direct messages:", error);
      return res.status(500).json({
        error: "Failed to retrieve messages.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Post a direct message to be instantly available to recipient
  app.post("/api/messages", dataMutationLimiter, (req, res) => {
    try {
      const { message } = req.body;
      if (!message || !message.senderUsername || !message.recipientUsername || (!message.content && !message.attachment)) {
        return res.status(400).json({ error: "Missing required message fields (senderUsername, recipientUsername, content or attachment)." });
      }

      const cleanMsg = {
        id: message.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        senderUsername: message.senderUsername.trim(),
        recipientUsername: message.recipientUsername.trim(),
        content: (message.content || '').trim(),
        timestamp: message.timestamp || new Date().toISOString(),
        isRead: Boolean(message.isRead),
        status: message.status || 'delivered',
        isSuspicious: Boolean(message.isSuspicious),
        operatorFlagReason: message.operatorFlagReason,
        operatorCategory: message.operatorCategory,
        riskScore: message.riskScore,
        attachment: message.attachment ? {
          id: message.attachment.id || 'att_' + Date.now(),
          name: String(message.attachment.name || 'document').slice(0, 150),
          type: message.attachment.type || 'file',
          mimeType: message.attachment.mimeType || 'application/octet-stream',
          size: Number(message.attachment.size) || 0,
          dataUrl: String(message.attachment.dataUrl || ''),
        } : undefined,
      };

      const result = saveCloudDirectMessage(cleanMsg);

      // Automatically construct and store recipient notification in cloud if safe and delivered
      if (cleanMsg.status === 'delivered') {
        const notifSnippet = cleanMsg.content
          ? (cleanMsg.content.length > 90 ? cleanMsg.content.substring(0, 90) + '...' : cleanMsg.content)
          : (cleanMsg.attachment ? `📎 Document: ${cleanMsg.attachment.name}` : 'New message');

        const notif = {
          id: 'msg_notif_' + cleanMsg.id,
          targetUsername: cleanMsg.recipientUsername,
          recipientUsername: cleanMsg.recipientUsername,
          sentBy: cleanMsg.senderUsername,
          senderTitle: 'Citizen Peer',
          title: `New message from @${cleanMsg.senderUsername}`,
          message: notifSnippet,
          category: 'message',
          timestamp: cleanMsg.timestamp,
          isRead: false,
          directMessageId: cleanMsg.id,
        };
        saveCloudNotification(notif);
      }

      return res.json({
        success: true,
        message: cleanMsg,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed saving direct message:", error);
      return res.status(500).json({
        error: "Failed to persist message.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Mark conversation messages read
  app.post("/api/messages/mark-read", (req, res) => {
    try {
      const { myUsername, peerUsername } = req.body || {};
      if (!myUsername || !peerUsername) {
        return res.status(400).json({ error: "myUsername and peerUsername are required." });
      }
      markCloudMessagesRead(myUsername, peerUsername);
      return res.json({ success: true, message: "Messages marked as read." });
    } catch (error: any) {
      console.error("[Server Error] Failed marking messages read:", error);
      return res.status(500).json({ error: "Failed to update read state." });
    }
  });

  // Get notifications from cloud
  app.get("/api/notifications", (req, res) => {
    try {
      const username = req.query.username as string | undefined;
      const notifications = getCloudNotifications(username);
      return res.json({
        success: true,
        notifications,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving notifications:", error);
      return res.status(500).json({ error: "Failed to retrieve notifications." });
    }
  });

  // Post notification to cloud
  app.post("/api/notifications", dataMutationLimiter, (req, res) => {
    try {
      const { notification } = req.body;
      if (!notification || !notification.targetUsername || !notification.title) {
        return res.status(400).json({ error: "Notification payload is missing required fields." });
      }
      saveCloudNotification(notification);
      return res.json({ success: true, notification });
    } catch (error: any) {
      console.error("[Server Error] Failed saving notification:", error);
      return res.status(500).json({ error: "Failed to save notification." });
    }
  });

  // Mark notification read in cloud
  app.post("/api/notifications/mark-read", (req, res) => {
    try {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "Notification id is required." });
      markCloudNotificationRead(id);
      return res.json({ success: true, id });
    } catch (error: any) {
      console.error("[Server Error] Failed marking notification read:", error);
      return res.status(500).json({ error: "Failed to update notification status." });
    }
  });

  // ---------------------------------------------------------------
  // Supplementary Courses Cloud Backup & Global Sharing APIs
  // ---------------------------------------------------------------

  // Retrieve all supplementary courses backed up in the cloud
  app.get("/api/supplementary-courses", (req, res) => {
    try {
      const courses = getCloudSupplementaryCourses();
      return res.json({
        success: true,
        courses,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed retrieving supplementary courses:", error);
      return res.status(500).json({
        error: "Failed to retrieve supplementary courses.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Save/Publish a supplementary course to the cloud for all users
  app.post("/api/supplementary-courses", dataMutationLimiter, (req, res) => {
    try {
      const course = req.body.course || req.body;
      if (!course || !course.title) {
        return res.status(400).json({ error: "Supplementary course payload is missing title or details." });
      }

      const saved = saveCloudSupplementaryCourse(course);
      return res.json({
        success: true,
        course: saved,
        serverTime: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("[Server Error] Failed saving supplementary course:", error);
      return res.status(500).json({
        error: "Failed to save supplementary course to cloud.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // ---------------------------------------------------------------
  // Raham AI Copilot for Administrators & The_Samaritan Omni Engine
  // ---------------------------------------------------------------
  app.post("/api/raham/chat", dataMutationLimiter, async (req, res) => {
    try {
      const { message, history, adminUsername, adminRole, mode } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message prompt is required." });
      }

      const response = await handleRahamAdminChat({
        message,
        history: Array.isArray(history) ? history : [],
        adminUsername: adminUsername || "Admin",
        adminRole: adminRole || "admin",
        mode,
      });

      return res.json(response);
    } catch (error: any) {
      console.error("[Server Error] Failed processing Raham AI chat:", error);
      return res.status(500).json({
        error: "Failed to process Raham AI chat request.",
        message: error?.message || "Internal server error",
      });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const customLogger = createLogger();
    const origError = customLogger.error.bind(customLogger);
    customLogger.error = (msg, options) => {
      if (typeof msg === "string" && (msg.includes("ws") || msg.includes("WebSocket") || msg.includes("[vite]"))) return;
      origError(msg, options);
    };
    const origWarn = customLogger.warn.bind(customLogger);
    customLogger.warn = (msg, options) => {
      if (typeof msg === "string" && (msg.includes("ws") || msg.includes("WebSocket") || msg.includes("[vite]"))) return;
      origWarn(msg, options);
    };

    // Serve a silent, compliant Vite client stub for /@vite/client
    // This prevents websocket connection retries and benign [vite] noise in AI Studio preview
    app.get("/@vite/client", (req, res) => {
      res.setHeader("Content-Type", "application/javascript");
      res.send(`
// Silent Vite Client Stub for AI Studio Dev Environment
const sheetsMap = new Map();
let lastInsertedStyle;

export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => {
        lastInsertedStyle = void 0;
      }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement("afterend", style);
    }
    lastInsertedStyle = style;
  } else {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}

export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    if (style.parentNode) style.parentNode.removeChild(style);
    sheetsMap.delete(id);
  }
}

export function injectQuery(url, queryToInject) {
  return url + (url.indexOf("?") === -1 ? "?" : "&") + queryToInject;
}

export function createHotContext() {
  return {
    accept() {},
    prune() {},
    dispose() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
    data: {}
  };
}

export class ErrorOverlay extends HTMLElement {}
if (typeof customElements !== "undefined" && !customElements.get("vite-error-overlay")) {
  try {
    customElements.define("vite-error-overlay", ErrorOverlay);
  } catch(e) {}
}

export default {
  updateStyle,
  removeStyle,
  injectQuery,
  createHotContext,
  ErrorOverlay
};
      `);
    });

    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
      customLogger,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Samaritan Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
