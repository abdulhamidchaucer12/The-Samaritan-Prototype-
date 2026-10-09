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

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 1. Enterprise Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
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
