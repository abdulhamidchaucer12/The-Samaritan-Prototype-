import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Shield,
  Award,
  AlertCircle,
  X,
  ExternalLink,
  MessageSquare,
  Send,
  CornerDownRight,
  User,
  Coins,
  Sparkles,
  Check,
  XCircle,
  Wand2,
} from 'lucide-react';
import { UserDirectNotification, CivicUser } from '../types';
import {
  markUserNotificationAsRead,
  addReplyToUserNotification,
} from '../utils/adminManagement';
import {
  approveAdaptationProposal,
  denyAdaptationProposal,
  getAllAdaptationProposals,
} from '../utils/autoLearnEngine';
import { UserBadge } from './UserBadge';

interface UserNotificationsDrawerProps {
  notifications: UserDirectNotification[];
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'sw';
  onNotificationRead: () => void;
  currentUser?: CivicUser | null;
}

export const UserNotificationsDrawer: React.FC<UserNotificationsDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  language,
  onNotificationRead,
  currentUser,
}) => {
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyStatusMap, setReplyStatusMap] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleMarkRead = (id: string) => {
    markUserNotificationAsRead(id);
    onNotificationRead();
  };

  const handleSendReply = (notifId: string, targetNotif: UserDirectNotification) => {
    const text = replyTextMap[notifId]?.trim();
    if (!text) return;

    const senderUsername = currentUser?.username || targetNotif.targetUsername || 'Citizen Participant';
    const senderRole = currentUser?.role === 'admin' ? 'admin' : 'citizen';
    const senderTitle =
      currentUser?.role === 'admin'
        ? currentUser.adminLevel === 'super'
          ? 'Platform Architect'
          : currentUser.adminLevel === 'executive'
          ? 'Executive Director'
          : 'Civic Administrator'
        : 'Citizen Respondent';

    const result = addReplyToUserNotification(
      notifId,
      senderUsername,
      text,
      senderRole,
      senderTitle
    );

    if (result.success) {
      setReplyTextMap((prev) => ({ ...prev, [notifId]: '' }));
      setReplyStatusMap((prev) => ({
        ...prev,
        [notifId]: language === 'en' ? 'Response sent to administration!' : 'Jibu limetumwa kwa wasimamizi!',
      }));
      setTimeout(() => {
        setReplyStatusMap((prev) => {
          const copy = { ...prev };
          delete copy[notifId];
          return copy;
        });
      }, 4000);
      handleMarkRead(notifId);
      onNotificationRead();
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                {language === 'en' ? 'Direct Civic Notifications' : 'Taarifa Zako za Kiraia'}
              </h3>
              <p className="text-xs text-slate-300">
                {unreadCount > 0
                  ? language === 'en'
                    ? `${unreadCount} unread administrative dispatch(es)`
                    : `${unreadCount} ujumbe mpya kutoka kwa uongozi`
                  : language === 'en'
                  ? 'All notices read'
                  : 'Taarifa zote zimesomwa'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-semibold">
                {language === 'en'
                  ? 'No personal administrative notifications yet.'
                  : 'Bado huna taarifa za moja kwa moja kutoka kwa wasimamizi.'}
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const dateStr = new Date(notif.timestamp).toLocaleDateString('en-KE', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    notif.isRead
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-amber-50/70 border-amber-300/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            notif.category === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : notif.category === 'appointment'
                              ? 'bg-blue-100 text-blue-900'
                              : notif.category === 'commendation'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {notif.category}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                        {notif.title}
                      </h4>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{dateStr}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                    {notif.message}
                  </p>

                  {/* UI/UX Adaptation Decision Actions for The_Samaritan */}
                  {notif.category === 'system_proposal' && notif.proposalId && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                          <Wand2 className="w-4 h-4 text-purple-600" />
                          <span>
                            {language === 'en'
                              ? 'Executive Adaptation Decision Required'
                              : 'Uamuzi wa Marekebisho ya Mfumo Unahitajika'}
                          </span>
                        </div>
                        {(() => {
                          const prop = getAllAdaptationProposals().find((p) => p.id === notif.proposalId);
                          if (!prop) return null;
                          return (
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                prop.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : prop.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                              }`}
                            >
                              {prop.status.replace('_', ' ')}
                            </span>
                          );
                        })()}
                      </div>

                      {(() => {
                        const prop = getAllAdaptationProposals().find((p) => p.id === notif.proposalId);
                        const isSamaritan =
                          currentUser?.username &&
                          ['the_samaritan', '@the_samaritan', 'the samaritan'].includes(
                            currentUser.username.toLowerCase().trim()
                          );

                        if (prop && prop.status === 'approved') {
                          return (
                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>
                                {language === 'en'
                                  ? 'Proposal APPROVED: System has autoadapted this UI/UX change.'
                                  : 'Imeidhinishwa: Mfumo umetekeleza mabadiliko haya ya mwonekano moja kwa moja.'}
                              </span>
                            </div>
                          );
                        }

                        if (prop && prop.status === 'rejected') {
                          return (
                            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                              <span>
                                {language === 'en'
                                  ? 'Proposal DENIED: Platform remains strictly as is.'
                                  : 'Imekataliwa: Mfumo unaendelea kubaki jinsi ulivyo bila kubadilishwa.'}
                              </span>
                            </div>
                          );
                        }

                        if (!isSamaritan) {
                          return (
                            <p className="text-[11px] text-purple-700 italic">
                              {language === 'en'
                                ? 'Only The_Samaritan account holds authority to approve or deny UI/UX adaptations.'
                                : 'Akaunti ya The_Samaritan pekee ndiyo yenye mamlaka ya kuidhinisha au kukataa marekebisho ya mfumo.'}
                            </p>
                          );
                        }

                        return (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (currentUser?.username) {
                                  approveAdaptationProposal(notif.proposalId!, currentUser.username);
                                  handleMarkRead(notif.id);
                                  onNotificationRead();
                                }
                              }}
                              className="grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>
                                {language === 'en'
                                  ? 'Approve & Auto-Adapt'
                                  : 'Idhinisha na Ubadilishe'}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (currentUser?.username) {
                                  denyAdaptationProposal(notif.proposalId!, currentUser.username);
                                  handleMarkRead(notif.id);
                                  onNotificationRead();
                                }
                              }}
                              className="grow flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-xs cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>
                                {language === 'en'
                                  ? 'Deny (Remain As Is)'
                                  : 'Kataa (Baki Kama Ilivyo)'}
                              </span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{language === 'en' ? 'From:' : 'Kutoka:'}</span>
                      <UserBadge username={notif.sentBy} size="xs" showRoleLabel currentUser={currentUser} />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setActiveReplyId(activeReplyId === notif.id ? null : notif.id)
                        }
                        className="text-[11px] font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {notif.replies && notif.replies.length > 0
                            ? language === 'en'
                              ? `Replies (${notif.replies.length})`
                              : `Majibu (${notif.replies.length})`
                            : language === 'en'
                            ? 'Reply'
                            : 'Jibu'}
                        </span>
                      </button>

                      {notif.title.toLowerCase().includes('token') && (
                        <button
                          onClick={() => {
                            onClose();
                            window.dispatchEvent(
                              new CustomEvent('open_facilitator_tokens_modal', {
                                detail: { tab: 'overview' },
                              })
                            );
                          }}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-amber-100 transition-colors"
                        >
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span>Token Hub</span>
                        </button>
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Mark read' : 'Nimeliona'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Replies History Thread */}
                  {notif.replies && notif.replies.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-200 space-y-2 bg-white/70 p-3 rounded-xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3 text-slate-400" />
                        {language === 'en' ? 'Responses & Discussion' : 'Majibu na Majadiliano'}
                      </span>
                      <div className="space-y-2">
                        {notif.replies.map((reply) => {
                          const replyDate = new Date(reply.timestamp).toLocaleDateString(
                            'en-KE',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          );
                          const isStaff = reply.senderRole === 'admin';
                          return (
                            <div
                              key={reply.id}
                              className={`p-2.5 rounded-lg text-xs space-y-1 ${
                                isStaff
                                  ? 'bg-amber-50/80 border border-amber-200 text-slate-800'
                                  : 'bg-slate-100 border border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1 font-bold text-slate-900">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span>{reply.senderUsername}</span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                                      isStaff
                                        ? 'bg-amber-200 text-amber-900'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {reply.senderTitle || (isStaff ? 'Admin' : 'Citizen')}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {replyDate}
                                </span>
                              </div>
                              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                                {reply.message}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Inline Reply Input Box */}
                  {(activeReplyId === notif.id || (notif.replies && notif.replies.length > 0)) && (
                    <div className="pt-2 mt-2 border-t border-slate-200 space-y-2">
                      {replyStatusMap[notif.id] && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{replyStatusMap[notif.id]}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          value={replyTextMap[notif.id] || ''}
                          onChange={(e) =>
                            setReplyTextMap((prev) => ({
                              ...prev,
                              [notif.id]: e.target.value,
                            }))
                          }
                          placeholder={
                            language === 'en'
                              ? 'Write a reply to admin dispatch...'
                              : 'Andika jibu kwa taarifa hii ya uongozi...'
                          }
                          className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(notif.id, notif)}
                          disabled={!replyTextMap[notif.id]?.trim()}
                          className="px-3 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all shrink-0 cursor-pointer"
                          title={language === 'en' ? 'Send Reply' : 'Tuma Jibu'}
                        >
                          <Send className="w-4 h-4" />
                          <span className="text-[10px]">{language === 'en' ? 'Reply' : 'Jibu'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            {language === 'en'
              ? 'Official dispatches from Executive Administration'
              : 'Ujumbe rasmi kutoka kwa Wasimamizi Wakuu'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            {language === 'en' ? 'Close' : 'Funga'}
          </button>
        </div>
      </div>
    </div>
  );
};
