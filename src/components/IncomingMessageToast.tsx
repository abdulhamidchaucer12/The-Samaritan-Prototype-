import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, Shield, User } from 'lucide-react';
import { CivicDirectMessage } from '../utils/civicMessagingService';
import { Language, AuthUser } from '../types';

interface IncomingMessageToastProps {
  language: Language;
  currentUser?: AuthUser | null;
}

interface ToastItem {
  id: string;
  message: CivicDirectMessage;
  receivedAt: number;
}

export const IncomingMessageToast: React.FC<IncomingMessageToastProps> = ({
  language,
  currentUser,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleMessageReceived = (e: any) => {
      const msg: CivicDirectMessage = e?.detail?.message;
      if (!msg) return;

      const newToast: ToastItem = {
        id: msg.id + '_' + Date.now(),
        message: msg,
        receivedAt: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 2)]);

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 7000);
    };

    window.addEventListener('the_samaritan_message_received', handleMessageReceived);
    return () => {
      window.removeEventListener('the_samaritan_message_received', handleMessageReceived);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenChat = (senderUsername: string, toastId: string) => {
    handleDismiss(toastId);
    window.dispatchEvent(
      new CustomEvent('open_direct_chat_with_peer', {
        detail: { peer: senderUsername },
      })
    );
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => {
        const msg = toast.message;
        const isFromAdmin = msg.senderUsername.toLowerCase().startsWith('admin') || msg.senderUsername === 'The_Samaritan';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-teal-500/40 dark:border-teal-400/30 rounded-2xl shadow-2xl p-4 transition-all animate-in slide-in-from-bottom-5 duration-200 text-slate-900 dark:text-slate-100 flex flex-col gap-2.5"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block leading-tight">
                    {language === 'en' ? 'New Message Received' : 'Ujumbe Mpya Umepokelewa'}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-xs text-slate-900 dark:text-slate-100">
                    {isFromAdmin ? (
                      <Shield className="w-3 h-3 text-amber-500" />
                    ) : (
                      <User className="w-3 h-3 text-slate-400" />
                    )}
                    <span>@{msg.senderUsername}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'en' ? 'Dismiss' : 'Funga'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Message Snippet */}
            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;{msg.content}&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-400">
                {language === 'en' ? 'Just now' : 'Sasa hivi'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDismiss(toast.id)}
                  className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Dismiss' : 'Ondoa'}
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenChat(msg.senderUsername, toast.id)}
                  className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{language === 'en' ? 'Reply' : 'Jibu'}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
