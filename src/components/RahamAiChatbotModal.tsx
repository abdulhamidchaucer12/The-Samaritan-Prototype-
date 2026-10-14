import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  Crown,
  ShieldCheck,
  Check,
  Copy,
  Brain,
  Layers,
  FilePlus,
  Radio,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Download,
  Paperclip,
  FileText,
  FileSpreadsheet,
  FileCode,
  Coins,
} from 'lucide-react';
import { AuthUser, Language, RahamChatMessage, MessageAttachment } from '../types';
import { createCustomLesson } from '../utils/lessonManagement';
import { sendDirectUserNotification } from '../utils/adminManagement';
import { awardTokensToUser } from '../utils/facilitatorTokenRegistry';
import { detectAttachmentType, formatFileSize } from '../utils/civicMessagingService';

interface RahamAiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  language: Language;
}

export const RahamAiChatbotModal: React.FC<RahamAiChatbotModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language,
}) => {
  const isSamaritan =
    currentUser?.username === 'The_Samaritan' ||
    currentUser?.username.toLowerCase().includes('samaritan') ||
    currentUser?.username.toLowerCase().includes('chaucer');

  const [messages, setMessages] = useState<RahamChatMessage[]>(() => {
    return [
      {
        id: 'msg_initial',
        sender: 'raham',
        text: isSamaritan
          ? `Honored to be at your service, Sir Chaucer. I am Raham, your Sovereign Executive AI Copilot. 

With full Omni Mode active, you may converse with me on any subject imaginable—from constitutional law and governance strategy to philosophy, history, literature, or personal deliberations. I also stand ready to synthesize civic modules, draft administrative directives, or audit platform systems under your command.

What would you like to explore or direct today?`
          : `Hello @${currentUser?.username || 'Admin'}! I am Raham, your Administrative AI Copilot.

I am here to assist you with the day-to-day operation of The Samaritan platform:
• Reviewing and answering citizen inquiries in the Civic Hub
• Creating Supplementary Courses with Operator AI
• Evaluating citizen verification badge applications
• Enforcing Article 10 national values and The Raham Protocol

How can I help you with your administrative duties today?`,
        timestamp: new Date().toISOString(),
        model: isSamaritan ? 'Raham Omni Engine' : 'Raham Admin Guide',
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [activeMode, setActiveMode] = useState<
    'omni' | 'guidance' | 'directive' | 'course_builder' | 'audit' | 'scholar' | 'lore'
  >(isSamaritan ? 'omni' : 'guidance');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Read aloud using browser speech synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  // Voice speech dictation via Web Speech API
  const handleToggleVoiceDictation = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(
        language === 'en'
          ? 'Voice recognition is not supported in this browser. Please use keyboard input.'
          : 'Utambuzi wa sauti hautumiki kwenye kivinjari hiki. Tafadhali andika kwa kibodi.'
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'en' ? 'en-US' : 'sw-KE';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0]?.[0]?.transcript || '';
        if (transcript) {
          setInputPrompt((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Light document attachment handler (PDF, DOC, EXCEL, IMAGES, TEXT up to 5MB)
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(
        language === 'en'
          ? 'File size exceeds 5MB limit. Please attach a lighter document.'
          : 'Ukubwa wa faili unazidi 5MB. Tafadhali chagua faili dogo.'
      );
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const detected = detectAttachmentType(file.name, file.type);
      setPendingAttachment({
        id: 'att_' + Date.now(),
        name: file.name,
        type: detected,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: reader.result as string,
      });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  // Export conversation transcript
  const handleExportTranscript = () => {
    const transcriptHeader = `# Raham AI Sovereign Executive Transcript\nExported: ${new Date().toLocaleString()}\nUser: @${currentUser?.username || 'Admin'}\nRole: ${currentUser?.role || 'Admin'}\n\n======================================================\n\n`;
    const transcriptBody = messages
      .map(
        (m) =>
          `[${new Date(m.timestamp).toLocaleTimeString()}] ${
            m.sender === 'user' ? `@${currentUser?.username || 'User'}` : `Raham AI (${m.model || 'Engine'})`
          }:\n${m.text}\n`
      )
      .join('\n------------------------------------------------------\n\n');

    const fullBlob = new Blob([transcriptHeader + transcriptBody], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(fullBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Raham_AI_Session_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setActionFeedback('📥 Conversation transcript downloaded as Markdown.');
  };

  const handleSendMessage = async (customPrompt?: string) => {
    let textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend && !pendingAttachment) return;
    if (isLoading) return;

    // If an attachment is attached, include attachment context
    let attachedFileMeta: MessageAttachment | null = null;
    if (pendingAttachment) {
      attachedFileMeta = pendingAttachment;
      textToSend = textToSend
        ? `${textToSend}\n\n[Attached Document: "${pendingAttachment.name}" (${pendingAttachment.type.toUpperCase()}, ${formatFileSize(pendingAttachment.size)})]`
        : `[Attached Document for Review: "${pendingAttachment.name}" (${pendingAttachment.type.toUpperCase()}, ${formatFileSize(pendingAttachment.size)})]`;
      setPendingAttachment(null);
    }

    const userMsg: RahamChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);
    setActionFeedback(null);

    // Prepare history payload
    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.text,
    }));

    try {
      const res = await fetch('/api/raham/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          adminUsername: currentUser?.username || 'Admin',
          adminRole: currentUser?.role || 'admin',
          mode: activeMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.reply) {
        const rahamMsg: RahamChatMessage = {
          id: 'rhm_' + Date.now(),
          sender: 'raham',
          text: data.reply,
          timestamp: data.timestamp || new Date().toISOString(),
          model: data.model || 'Raham AI',
          suggestedActions: data.suggestedActions,
        };

        setMessages((prev) => [...prev, rahamMsg]);

        if (isSpeechEnabled) {
          speakText(data.reply);
        }
      } else {
        throw new Error(data.error || 'Invalid response from Raham AI');
      }
    } catch (err: any) {
      const errorMsg: RahamChatMessage = {
        id: 'rhm_err_' + Date.now(),
        sender: 'raham',
        text: `I encountered an unexpected connection latency: ${err?.message || 'Network error'}. I am maintaining secure local operational standby. Please re-enter your inquiry or command.`,
        timestamp: new Date().toISOString(),
        model: 'Raham Local Standby',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Suggested Actions
  const handleActionClick = (action: { label: string; actionType: string; payload?: any }) => {
    if (action.actionType === 'create_course') {
      try {
        const newLesson = createCustomLesson(
          {
            title: action.payload?.title || {
              en: 'Public Interest Litigation & Article 22 Locus Standi',
              sw: 'Kesi za Maslahi ya Umma na Haki ya Kusimama Mahakamani Chini ya Kifungu 22',
            },
            summary: action.payload?.summary || {
              en: 'Master how Article 22 and 258 dismantle prohibitive court filing fees, allowing any citizen to institute constitutional petitions.',
              sw: 'Jifunze jinsi Vifungu vya 22 na 258 vinavyoondoa vizuizi vya ada ya mahakama, kumpa kila mwananchi uwezo wa kufungua kesi za kikatiba.',
            },
            category: action.payload?.category || 'human_rights',
            readTimeMinutes: 8,
            isPublished: true,
            isSupplementary: true,
            developedByAi: true,
            sections: [
              {
                id: 'sec_1',
                title: {
                  en: '1. Eliminating Standing Barriers (Locus Standi)',
                  sw: '1. Kuondoa Vizuizi vya Kusimama Mahakamani',
                },
                content: {
                  en: 'Under Article 22(1) and 258(1) of the Constitution of Kenya 2010, every person has the right to institute court proceedings claiming that a right or fundamental freedom has been denied, violated, or threatened.',
                  sw: 'Chini ya Kifungu cha 22(1) na 258(1) cha Katiba ya Kenya 2010, kila mtu ana haki ya kufungua kesi akidai kuwa haki au uhuru wa kimsingi umenyimwa, umekiukwa au unatishiwa.',
                },
                constitutionalArticle: 'Article 22 & Article 258',
              },
            ],
            keyTerms: [
              {
                term: { en: 'Locus Standi', sw: 'Haki ya Kusimama Mahakamani' },
                definition: {
                  en: 'The legal capacity of an individual or group to institute court proceedings in public interest.',
                  sw: 'Uwezo wa kisheria wa mtu au kundi kufungua kesi mahakamani kwa ajili ya maslahi ya umma.',
                },
              },
            ],
            citizenActionTip: {
              en: 'Citizens can petition the High Court directly without paying commercial court fees when alleging Bill of Rights violations.',
              sw: 'Wananchi wanaweza kuwasilisha maombi Mahakama Kuu bila kulipa ada kubwa za kibiashara wanapolinda Mswada wa Haki.',
            },
          },
          currentUser?.username || 'The_Samaritan'
        );

        setActionFeedback(`✨ Supplementary Course Published: "${newLesson.title.en}" is now live and backed up for all users!`);
      } catch (err: any) {
        setActionFeedback(`Notice: ${err.message}`);
      }
    } else if (action.actionType === 'draft_directive') {
      const admins = ['admin.kfe1', 'admin.kfe2', 'admin.kfe3', 'admin.kfe4'];
      admins.forEach((adm) => {
        sendDirectUserNotification(
          adm,
          'Urgent Executive Directive from The_Samaritan',
          action.payload?.message ||
            'Prioritize double-tick verification reviews and ensure citizen questions are resolved within 24 hours under Article 10.',
          'urgent'
        );
      });
    } else if (action.actionType === 'grant_tokens') {
      const targetUser = action.payload?.target || 'all_citizens';
      const amount = action.payload?.amount || 500;
      awardTokensToUser(
        targetUser,
        amount,
        'Sovereign Facilitator Token Grant from The_Samaritan via Raham AI',
        'The_Samaritan'
      );
      setActionFeedback(`🪙 Sovereign Grant: Awarded ${amount} Facilitator Tokens to @${targetUser}!`);
    } else if (action.actionType === 'audit_system') {
      window.dispatchEvent(new CustomEvent('open_online_users_modal'));
      setActionFeedback(`🔍 Opened Live Citizen Roster and System Presence Console.`);
    } else if (action.actionType === 'explore_midmon') {
      onClose();
      window.dispatchEvent(new CustomEvent('the_samaritan_navigate_tab', { detail: { tab: 'profile' } }));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm(language === 'en' ? 'Reset chat history with Raham?' : 'Futa kumbukumbu ya mazungumzo na Raham?')) {
      setMessages([
        {
          id: 'msg_reset',
          sender: 'raham',
          text: isSamaritan
            ? 'Conversation reset. I am ready for your next counsel or strategic inquiry, Sir Chaucer.'
            : 'Conversation reset. How can I assist your administration duties, Admin?',
          timestamp: new Date().toISOString(),
          model: 'Raham AI',
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all ${
            isFullScreen
              ? 'h-[96vh] max-w-[98vw]'
              : 'h-[88vh] max-h-[850px] max-w-4xl'
          } ${
            isSamaritan
              ? 'border-amber-500/40 shadow-amber-500/10'
              : 'border-teal-500/30 shadow-teal-500/10'
          }`}
        >
          {/* Top Bar Header */}
          <div
            className={`p-4 border-b flex items-center justify-between gap-3 shrink-0 ${
              isSamaritan
                ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-purple-950 text-white border-amber-500/30'
                : 'bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white border-teal-500/30'
            }`}
          >
            {/* Avatar & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/assets/raham_ai_avatar.jpg"
                  alt="Raham AI"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-md"
                  onError={(e) => {
                    // Fallback to root path if assets prefix fails
                    (e.target as HTMLImageElement).src = '/raham_ai_avatar.jpg';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-serif font-black text-base sm:text-lg text-white flex items-center gap-1.5 truncate">
                    <span>Raham AI</span>
                    {isSamaritan ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3 text-slate-950" />
                        Omni Executive
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-bold uppercase tracking-wider border border-teal-400/30">
                        Admin Copilot
                      </span>
                    )}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-300 truncate">
                  {isSamaritan
                    ? 'Sovereign Copilot to The_Samaritan • Unlimited Free Domain Dialogue'
                    : `Administrative Copilot & System Guide for @${currentUser?.username}`}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Voice Speech Toggle */}
              <button
                type="button"
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className={`p-2 rounded-xl transition-colors ${
                  isSpeechEnabled
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={isSpeechEnabled ? 'Voice readout enabled' : 'Enable voice readout'}
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset History */}
              <button
                type="button"
                onClick={handleClearChat}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              {/* Export Transcript */}
              <button
                type="button"
                onClick={handleExportTranscript}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Download conversation transcript (Markdown)"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Reset History */}
              <button
                type="button"
                onClick={handleClearChat}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Selector for The_Samaritan */}
          {isSamaritan && (
            <div className="bg-slate-900 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
              <span className="text-amber-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Brain className="w-3.5 h-3.5" />
                Mode:
              </span>
              <button
                onClick={() => setActiveMode('omni')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'omni'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🌟 Omni Mode (Chat About Anything)
              </button>
              <button
                onClick={() => setActiveMode('scholar')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'scholar'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ⚖️ Constitutional Scholar
              </button>
              <button
                onClick={() => setActiveMode('directive')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'directive'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                📋 Executive Directives
              </button>
              <button
                onClick={() => setActiveMode('course_builder')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'course_builder'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🎓 Course Synthesizer
              </button>
              <button
                onClick={() => setActiveMode('audit')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'audit'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🛡️ System Audit & Security
              </button>
              <button
                onClick={() => setActiveMode('lore')}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  activeMode === 'lore'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🦅 Midmon World Chronicles
              </button>
            </div>
          )}

          {/* Quick Prompt Chips */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            <span className="text-slate-400 font-bold shrink-0">Prompts:</span>
            {isSamaritan ? (
              <>
                <button
                  onClick={() => handleSendMessage('Draft an executive directive to Administrators 1-4 regarding Article 10')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  📜 Draft Directive to Admins
                </button>
                <button
                  onClick={() => handleSendMessage('Synthesize a new supplementary course on community paralegal defense and locus standi')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  🎓 Synthesize Course
                </button>
                <button
                  onClick={() => handleSendMessage('Give me a full system telemetry and citizen roster health audit')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  🛡️ System Telemetry Audit
                </button>
                <button
                  onClick={() => handleSendMessage('Award 500 facilitator tokens to all citizens as an Easter celebration grant')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  🪙 Award Tokens Grant
                </button>
                <button
                  onClick={() => handleSendMessage('Tell me about Lucy Shallah, Sundiata Keita, and the Midmon world easter egg saga')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  🦅 Midmon Lore & Kurukan Fuga
                </button>
                <button
                  onClick={() => handleSendMessage('Let us explore the intersection of civic ethics, sovereign jurisprudence, and philosophy')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-300/50 hover:border-amber-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  💡 Philosophical Dialogue
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleSendMessage('How do I approve and formulate answers for civic questions in the Hub?')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-teal-300/50 hover:border-teal-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  ❓ Answer Civic Questions
                </button>
                <button
                  onClick={() => handleSendMessage('How do I create a Supplementary Course with Operator AI?')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-teal-300/50 hover:border-teal-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  📚 Create Supplementary Course
                </button>
                <button
                  onClick={() => handleSendMessage('What is the procedure for verifying a citizen for double-tick badge?')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-teal-300/50 hover:border-teal-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  ✓✓ Double-Tick Verification
                </button>
                <button
                  onClick={() => handleSendMessage('What are my assigned powers and duties as an administrator?')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-teal-300/50 hover:border-teal-400 text-slate-700 dark:text-slate-200 shrink-0 font-medium transition-colors"
                >
                  📋 My Admin Powers
                </button>
              </>
            )}
          </div>

          {/* Action Feedback Banner if an action was clicked */}
          {actionFeedback && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-300 dark:border-emerald-800 px-4 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <span>{actionFeedback}</span>
              <button
                onClick={() => setActionFeedback(null)}
                className="text-emerald-600 hover:text-emerald-800 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Conversation Thread */}
          <div className="grow overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                >
                  <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%]">
                    {!isUser && (
                      <img
                        src="/assets/raham_ai_avatar.jpg"
                        alt="Raham"
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400 shrink-0 mt-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/raham_ai_avatar.jpg';
                        }}
                      />
                    )}

                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2.5 shadow-xs ${
                        isUser
                          ? isSamaritan
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                            : 'bg-teal-800 text-white font-medium rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      {/* Message Text with simple formatting */}
                      <div className="whitespace-pre-wrap font-sans selection:bg-amber-200 selection:text-amber-900">
                        {msg.text}
                      </div>

                      {/* Suggested Interactive Actions */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
                          {msg.suggestedActions.map((act, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Footer with Timestamp and Copy/TTS buttons */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 px-11 font-mono">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {!isUser && msg.model && <span>• {msg.model}</span>}

                    {!isUser && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer flex items-center gap-0.5"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => speakText(msg.text)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          title="Listen to response"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <img
                  src="/assets/raham_ai_avatar.jpg"
                  alt="Raham"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400 shrink-0 mt-0.5 animate-pulse"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/raham_ai_avatar.jpg';
                  }}
                />
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="font-mono text-[11px] ml-1">
                    {isSamaritan ? 'Raham is consulting the sovereign knowledgebase...' : 'Raham is generating administrative guidance...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 space-y-2">
            {/* Pending Document Attachment Preview */}
            {pendingAttachment && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-xs">
                <div className="flex items-center gap-2 truncate">
                  {pendingAttachment.type === 'image' && (
                    <img src={pendingAttachment.dataUrl} alt="preview" className="w-8 h-8 rounded-lg object-cover border" />
                  )}
                  {pendingAttachment.type === 'pdf' && <FileText className="w-5 h-5 text-red-600 shrink-0" />}
                  {pendingAttachment.type === 'excel' && <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {pendingAttachment.type === 'doc' && <FileCode className="w-5 h-5 text-blue-600 shrink-0" />}
                  {pendingAttachment.type === 'file' && <FileText className="w-5 h-5 text-slate-600 shrink-0" />}
                  <div className="truncate">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[280px]">
                      {pendingAttachment.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatFileSize(pendingAttachment.size)} • {pendingAttachment.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingAttachment(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              {/* Paperclip attachment button */}
              <label
                className="p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors shrink-0"
                title={language === 'en' ? 'Attach Document or Image (PDF, DOC, XLS, PNG, JPG)' : 'Ambatisha Waraka au Picha'}
              >
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileAttachment}
                  className="hidden"
                />
              </label>

              {/* Voice Speech Dictation */}
              <button
                type="button"
                onClick={handleToggleVoiceDictation}
                className={`p-3 rounded-2xl border transition-colors shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to dictate voice prompt'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <div className="grow relative">
                <textarea
                  ref={textareaRef}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder={
                    pendingAttachment
                      ? (language === 'en' ? `Ask Raham about ${pendingAttachment.name}...` : `Uliza Raham kuhusu ${pendingAttachment.name}...`)
                      : isSamaritan
                        ? 'Ask or direct Raham on any subject (constitutional law, philosophy, system commands, or general conversation)...'
                        : 'Ask Raham about the system, question moderation, verification, or administrative procedures...'
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || (!inputPrompt.trim() && !pendingAttachment)}
                className={`p-3 rounded-2xl text-white font-bold transition-all shadow-md shrink-0 disabled:opacity-50 cursor-pointer ${
                  isSamaritan
                    ? 'bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950'
                    : 'bg-teal-800 hover:bg-teal-700'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
