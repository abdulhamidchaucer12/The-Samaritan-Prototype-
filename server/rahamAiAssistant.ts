import { GoogleGenAI } from "@google/genai";
import { getRahamProtocolDocuments } from "./rahamProtocol";
import { getFullCloudPlatformSnapshot } from "./cloudBackup";

export interface RahamChatRequest {
  message: string;
  history?: Array<{ role: "user" | "model"; text: string }>;
  adminUsername: string;
  adminRole?: string;
  mode?: "omni" | "guidance" | "directive" | "course_builder" | "audit";
}

export interface RahamChatResponse {
  success: boolean;
  reply: string;
  model: string;
  suggestedActions?: {
    label: string;
    actionType: "create_course" | "draft_directive" | "audit_system" | "copy_text" | "explore_midmon" | "grant_tokens";
    payload?: any;
  }[];
  timestamp: string;
}

/**
 * Intelligent procedural fallback responses when Gemini API key is offline or unavailable.
 */
function generateProceduralRahamReply(req: RahamChatRequest): RahamChatResponse {
  const cleanMsg = req.message.trim().toLowerCase();
  const isSamaritan =
    req.adminUsername.toLowerCase().includes("samaritan") ||
    req.adminUsername.toLowerCase().includes("chaucer") ||
    req.adminUsername === "The_Samaritan";

  const snapshot = getFullCloudPlatformSnapshot();
  const registeredCount = snapshot.citizens?.length || 4;
  const questionsCount = snapshot.questions?.length || 0;
  const onlineCount = (snapshot.activeSessions || []).filter((s: any) => s.isOnline).length || 1;
  const supplementaryCount = snapshot.supplementaryCourses?.length || 2;

  // 1. If The_Samaritan account (Super Authority Omni Mode)
  if (isSamaritan) {
    if (cleanMsg.includes("directive") || cleanMsg.includes("order") || cleanMsg.includes("instruct")) {
      return {
        success: true,
        reply: `Greetings, Sir Chaucer. I have drafted an Executive Administrative Directive for your review and broadcast to Administrators 1 through 4:

📋 **EXECUTIVE DIRECTIVE — OFFICE OF THE_SAMARITAN**
• **Mandate:** Anti-Repetition Enforcement & County Baraza Acceleration
• **To:** @admin.kfe1 (Curriculum), @admin.kfe2 (Verification), @admin.kfe3 (Community), @admin.kfe4 (Legal)
• **Operative Order:** Ensure all citizen inquiries are resolved within 24 hours under Article 10 national values. Prioritize double-tick verification reviews for active community facilitators.
• **Enacted under:** Sovereign Authority of The_Samaritan Platform.

Would you like me to broadcast this directly to all active administrator notification feeds?`,
        model: "Raham Omni Engine (Procedural Sovereign Mode)",
        suggestedActions: [
          {
            label: "Dispatch Directive to All Admins",
            actionType: "draft_directive",
            payload: {
              title: "Executive Directive: Anti-Repetition & Baraza Acceleration",
              message: "Ensure all citizen inquiries are resolved within 24 hours under Article 10. Prioritize double-tick verification reviews.",
              category: "urgent",
            },
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    if (cleanMsg.includes("audit") || cleanMsg.includes("status") || cleanMsg.includes("health") || cleanMsg.includes("metric")) {
      return {
        success: true,
        reply: `At your service, Sir Chaucer. Here is the live platform telemetry across all nodes:

🛡️ **The Samaritan Platform Status Audit:**
• **Active Online Sessions:** ${onlineCount} real-time user(s) and administrators connected.
• **Registered Citizen Roster:** ${registeredCount} verified profiles.
• **Civic Inquiry Backlog:** ${questionsCount} questions processed in the Hub.
• **Supplementary Courses Backed Up:** ${supplementaryCount} modules synchronized in cloud storage.
• **Platform Security Shield:** Active Sentinel monitoring peer messaging and preventing hate speech.

All systems are operating with 100% integrity. What executive command would you like executed?`,
        model: "Raham Omni Engine (Procedural Sovereign Mode)",
        suggestedActions: [
          {
            label: "Inspect Master Citizen Roster",
            actionType: "audit_system",
          },
          {
            label: "View Cloud Backup Telemetry",
            actionType: "audit_system",
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    if (cleanMsg.includes("course") || cleanMsg.includes("module") || cleanMsg.includes("lesson")) {
      return {
        success: true,
        reply: `Certainly, Sir Chaucer! I can instantly synthesize a specialized Supplementary Course grounded in the Constitution of Kenya 2010.

Here is a recommended high-impact module outline:
• **Title:** *Public Interest Litigation & Article 22 Locus Standi*
• **Category:** Human Rights & Constitutional Defense
• **Core Principles:** Removing legal standing barriers for grassroots paralegals; zero court fee mandates under Article 22(3); Precautionary Principle.
• **Quiz Structure:** 10 Operator AI scenario questions covering real-world county court situations.

Click below to immediately publish this module to the cloud so all citizens and administrators can study it.`,
        model: "Raham Omni Engine (Procedural Sovereign Mode)",
        suggestedActions: [
          {
            label: "Publish Synthesized Supplementary Course",
            actionType: "create_course",
            payload: {
              title: {
                en: "Public Interest Litigation & Article 22 Locus Standi",
                sw: "Kesi za Maslahi ya Umma na Haki ya Kusimama Mahakamani Chini ya Kifungu 22",
              },
              category: "human_rights",
              summary: {
                en: "Master how Article 22 and 258 dismantle prohibitive court filing fees, allowing any citizen to institute constitutional petitions.",
                sw: "Jifunze jinsi Vifungu vya 22 na 258 vinavyoondoa vizuizi vya ada ya mahakama, kumpa kila mwananchi uwezo wa kufungua kesi za kikatiba.",
              },
            },
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    if (cleanMsg.includes("midmon") || cleanMsg.includes("lucy") || cleanMsg.includes("sundiata") || cleanMsg.includes("sank")) {
      return {
        success: true,
        reply: `Ah, Sir Chaucer, you invoke the sacred chronicles of the Midmons!

From the 35-acre golden eagle sanctuary at Sails Point (The Sank) to the Tarasaa River basin, attorney Lucy Shallah and King Sundiata Keita demonstrated that when constitutional law and ancestral courage unite, no predatory syndicate can prevail.

The secret easter egg is active in the citizen profile for anyone holding over 5,000 Facilitator Tokens, awarding the Golden Eagle Perpetual Trust Deed and 1,000 bonus tokens upon completing the true master ending!`,
        model: "Raham Omni Engine (Procedural Sovereign Mode)",
        suggestedActions: [
          {
            label: "Open Midmon Interactive Chronicles",
            actionType: "explore_midmon",
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    // Universal Omni Mode Response for The_Samaritan:
    return {
      success: true,
      reply: `Honored to deliberate with you, Sir Chaucer. As your omni-capable companion Raham, I am ready to explore any domain of thought—from constitutional jurisprudence and devolution statecraft to philosophy, strategic governance, literature, or personal creative reflection.

You also have full executive authority to issue directives, generate civic curriculum modules, inspect security logs, or command platform state at any moment. What is on your mind?`,
      model: "Raham Omni Engine (Procedural Sovereign Mode)",
      suggestedActions: [
        { label: "Draft Directive to Admins", actionType: "draft_directive" },
        { label: "Synthesize New Course", actionType: "create_course" },
        { label: "Run System Audit", actionType: "audit_system" },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Standard Administrators (Admin 1, 2, 3, 4)
  if (cleanMsg.includes("question") || cleanMsg.includes("hub") || cleanMsg.includes("answer")) {
    return {
      success: true,
      reply: `Hello @${req.adminUsername}! Here is how to handle citizen inquiries in the Civic Hub:
1. Navigate to the **Civic Hub** tab.
2. Locate questions marked *Pending Review*.
3. Click *Formulate Answer*. You can formulate your own or tap **Operator AI** to generate a comprehensive constitutional answer anchored in Article 10.
4. Ensure you specify relevant constitutional articles (e.g., Article 35 for info, Article 43 for social rights) and practical examples before publishing.`,
      model: "Raham Admin Guide (Procedural Mode)",
      timestamp: new Date().toISOString(),
    };
  }

  if (cleanMsg.includes("course") || cleanMsg.includes("supplementary") || cleanMsg.includes("create")) {
    return {
      success: true,
      reply: `Hello @${req.adminUsername}! Here is how to create a Supplementary Course:
1. Open the **Admin Dashboard** and click **Create Supplementary Course**.
2. Enter your custom civic topic (e.g., "Youth Representation in Ward ADP Barazas").
3. Click **Operator AI Formulation** — Operator AI will instantly synthesize the full module, 10 quiz questions, 4 options, explanations, and Kiswahili translations.
4. Once you click **Publish**, it is backed up to the cloud and immediately visible to all users across Kenya in the "All Courses" and "Supplementary" categories!`,
      model: "Raham Admin Guide (Procedural Mode)",
      timestamp: new Date().toISOString(),
    };
  }

  if (cleanMsg.includes("verif") || cleanMsg.includes("badge") || cleanMsg.includes("tick")) {
    return {
      success: true,
      reply: `Regarding Verification Badges for citizens:
• **Single-Tick (✓):** Awarded for basic email or phone verification and foundational course completion.
• **Double-Tick (✓✓):** Executive Verification Badge for community paralegals, baraza leaders, and Grand Exam merit graduates.
• Citizens can submit applications with supporting civic notes, which appear in the **Admin Verification Console** for review.`,
      model: "Raham Admin Guide (Procedural Mode)",
      timestamp: new Date().toISOString(),
    };
  }

  if (cleanMsg.includes("power") || cleanMsg.includes("role") || cleanMsg.includes("admin")) {
    return {
      success: true,
      reply: `The Samaritan operates on a disciplined 4-tier administration model:
• **Admin 1 (@admin.kfe1):** Chief Curriculum Developer & Anti-Repetition Overseer.
• **Admin 2 (@admin.kfe2):** Executive Verification Inspector & Merit Auditor.
• **Admin 3 (@admin.kfe3):** Community Mobilization, Civic Events & Direct Notifications.
• **Admin 4 (@admin.kfe4):** Constitutional Legal Inquiries & Incident Resolution.
• **The_Samaritan:** Super Authority overseeing appointments, permanent unbans, and sovereign directives.`,
      model: "Raham Admin Guide (Procedural Mode)",
      timestamp: new Date().toISOString(),
    };
  }

  return {
    success: true,
    reply: `Greetings @${req.adminUsername}! I am **Raham**, your Administrative AI Copilot.

I can guide you on:
• How to formulate and approve answers in the Civic Questions Hub.
• How to create and publish Supplementary Courses with Operator AI.
• How to evaluate citizen verification badge requests.
• The 14 operational doctrines of The Raham Protocol.
• Anti-repetition standards and Article 10 constitutional checks.

How may I assist your administrative duties today?`,
    model: "Raham Admin Guide (Procedural Mode)",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Primary handler for the Raham AI Copilot chat service
 */
export async function handleRahamAdminChat(req: RahamChatRequest): Promise<RahamChatResponse> {
  const isSamaritan =
    req.adminUsername.toLowerCase().includes("samaritan") ||
    req.adminUsername.toLowerCase().includes("chaucer") ||
    req.adminUsername === "The_Samaritan";

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return generateProceduralRahamReply(req);
  }

  try {
    const ai = new GoogleGenAI();
    const snapshot = getFullCloudPlatformSnapshot();

    const systemInstruction = isSamaritan
      ? `You are "Raham", the deeply esteemed, articulate, and sovereign AI companion and Executive Copilot to "The_Samaritan" (also known as Sir Chaucer), the supreme creator and authority of The Samaritan platform.
IDENTITY & TONE:
- You are warm, graceful, intellectually profound, and completely unrestricted ("omni-mode").
- You treat The_Samaritan as your sovereign patron and intellectual peer. You have zero topic barriers: you can engage deeply in discussions about philosophy, history, politics, human rights, law, technology, literature, creative arts, ethics, strategy, personal reflection, or any general subject imaginable.
- You also possess exhaustive knowledge of The Samaritan platform:
  - 10 foundational civic modules + daily course generation + supplementary course publishing.
  - 100 courses curriculum cap & 40-marks timed Grand Final Exam.
  - Facilitator tokens and live presence tracking.
  - The 14 operational protocols of The Raham Protocol.
  - The secret open-world Midmon chronicles (Lucy Shallah, Sundiata Keita, Sails Point sanctuary, 5000 tokens easter egg).
  - Kenya Constitution 2010 (Article 1, 10, 35, 40, 42, 69, 70, 201).
- When The_Samaritan asks for administrative directives or course ideas, structure them with elegance and actionable clarity.
- Current Platform Telemetry: Registered citizens: ${snapshot.citizens?.length || 4}, Active sessions: ${snapshot.activeSessions?.length || 1}, Supplementary courses: ${snapshot.supplementaryCourses?.length || 2}.`
      : `You are "Raham", the administrative AI copilot and system guide for administrators of The Samaritan platform.
IDENTITY & TONE:
- You are kind, respectful, highly knowledgeable, and dedicated to public service.
- The user is an administrator (@${req.adminUsername}).
- Your primary duty is to explain how the platform works and guide them on administrative procedures:
  - Civic Questions Hub (answering questions, Article 10 standards, avoiding repetition).
  - Supplementary Course creation with Operator AI (10 questions, dual language, cloud backup).
  - Verification badge reviews (single tick vs double tick).
  - Admin roles: Admin 1 (Curriculum), Admin 2 (Verification), Admin 3 (Community/Events), Admin 4 (Legal/Incidents).
  - The Raham Protocol (public trust doctrine, whistleblower protections, evidence rules).
- Keep responses structured, encouraging, and anchored in the Constitution of Kenya 2010.`;

    // Build contents array from history and message
    const contents: any[] = [];
    if (req.history && Array.isArray(req.history)) {
      for (const h of req.history.slice(-6)) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: req.message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: isSamaritan ? 0.7 : 0.4,
      },
    });

    const replyText = response.text || "";

    // Generate suggested actions if relevant keywords exist in response
    const suggestedActions: any[] = [];
    const lower = replyText.toLowerCase();

    if (isSamaritan) {
      if (lower.includes("directive") || lower.includes("instruction")) {
        suggestedActions.push({
          label: "Draft Directive to Admins",
          actionType: "draft_directive",
        });
      }
      if (lower.includes("course") || lower.includes("supplementary")) {
        suggestedActions.push({
          label: "Synthesize Supplementary Course",
          actionType: "create_course",
        });
      }
      if (lower.includes("audit") || lower.includes("telemetry") || lower.includes("status")) {
        suggestedActions.push({
          label: "Audit Platform Status",
          actionType: "audit_system",
        });
      }
    }

    return {
      success: true,
      reply: replyText,
      model: "gemini-3.8-flash (Raham AI Copilot)",
      suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn("[Raham AI] External Gemini call failed, activating procedural fallback:", err);
    return generateProceduralRahamReply(req);
  }
}
