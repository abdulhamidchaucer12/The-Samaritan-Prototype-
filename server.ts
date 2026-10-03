import express from "express";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import dotenv from "dotenv";
import { generateConstitutionalAiAnswer } from "./server/constitutionalAi";
import { developCourseWithOperatorAi } from "./server/operatorCourseDeveloper";
import { monitorMessageWithOperatorAi } from "./server/operatorSentinel";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      platform: "The Samaritan Civic Education Platform",
      aiAvailable: !!process.env.GEMINI_API_KEY,
    });
  });

  // Automated Constitutional AI Answer endpoint for Operator
  app.post("/api/constitutional-ai-answer", async (req, res) => {
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
  app.post("/api/operator-develop-course", async (req, res) => {
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
  app.post("/api/operator-monitor-message", async (req, res) => {
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
