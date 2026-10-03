import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Lightbulb,
  ThumbsUp,
  X,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Shield,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  FeatureSuggestion,
  getFeatureSuggestions,
  submitFeatureSuggestion,
  voteOnFeatureSuggestion,
  updateSuggestionStatus,
} from '../utils/suggestionBox';
import { getCurrentAuthUser } from '../utils/authAndQuestions';
import { Language } from '../types';

interface SuggestionBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SuggestionBoxModal: React.FC<SuggestionBoxModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'submit'>('browse');
  const [suggestions, setSuggestions] = useState<FeatureSuggestion[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form states
  const currentUser = getCurrentAuthUser();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FeatureSuggestion['category']>('tools');
  const [targetModule, setTargetModule] = useState('Devolution & Courses');
  const [description, setDescription] = useState('');
  const [authorHandle, setAuthorHandle] = useState(() => {
    return currentUser ? currentUser.username : '';
  });
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Admin & Samaritan status update state
  const isSamaritan = currentUser?.username === 'The_Samaritan';
  const isAdmin = currentUser?.role === 'admin' || isSamaritan;
  const [editingAdminNoteId, setEditingAdminNoteId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSuggestions(getFeatureSuggestions());
      setFeedbackNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVote = (suggestionId: string) => {
    const voterId = currentUser ? currentUser.username : 'guest_voter';
    const result = voteOnFeatureSuggestion(suggestionId, voterId);
    if (result.success) {
      setSuggestions(getFeatureSuggestions());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackNotice(null);

    const handle = authorHandle.trim() || (currentUser ? currentUser.username : 'Civic Member');
    const res = submitFeatureSuggestion(title, description, category, handle, targetModule);

    if (res.success && res.suggestion) {
      setSuggestions(getFeatureSuggestions());
      setTitle('');
      setDescription('');
      setFeedbackNotice({
        type: 'success',
        message:
          language === 'en'
            ? 'Thank you! Your suggestion has been added to the civic development backlog.'
            : 'Asante sana! Pendekezo lako limewasilishwa rasmi kwa timu ya maendeleo ya jukwaa.',
      });
      setTimeout(() => {
        setActiveTab('browse');
      }, 1200);
    } else {
      setFeedbackNotice({
        type: 'error',
        message: res.message,
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: FeatureSuggestion['status']) => {
    if (!isAdmin) return;
    updateSuggestionStatus(id, newStatus);
    setSuggestions(getFeatureSuggestions());
  };

  const handleSaveAdminNote = (id: string) => {
    if (!isAdmin) return;
    updateSuggestionStatus(id, suggestions.find((s) => s.id === id)?.status || 'under_review', adminNoteInput);
    setSuggestions(getFeatureSuggestions());
    setEditingAdminNoteId(null);
    setAdminNoteInput('');
  };

  const filteredSuggestions = suggestions.filter((s) => {
    const matchCat = selectedFilter === 'all' || s.category === selectedFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchCat && matchStatus;
  });

  const getStatusBadge = (status: FeatureSuggestion['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            <span>{language === 'en' ? 'Completed' : 'Imetekelezwa'}</span>
          </span>
        );
      case 'planned':
        return (
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-700" />
            <span>{language === 'en' ? 'Planned' : 'Imepangwa'}</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>{language === 'en' ? 'Under Review' : 'Inakaguliwa'}</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px] flex items-center gap-1">
            <span>{language === 'en' ? 'Received' : 'Imepokelewa'}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full my-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white p-5 sm:p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h2 className="font-serif font-bold text-lg sm:text-xl">
                {language === 'en' ? 'Civic Platform Suggestion Box' : 'Sanduku la Mapendekezo ya Jukwaa'}
              </h2>
            </div>
            <p className="text-xs text-stone-300">
              {language === 'en'
                ? 'Propose new features, civic courses, or tools you want on The Samaritan.'
                : 'Pendekeza vipengele vipya, masomo au zana unazotaka kuona kwenye The Samaritan.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-200 px-6 pt-3 bg-stone-50 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'browse'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === 'en'
                ? `Community Ideas (${suggestions.length})`
                : `Mawazo ya Jamii (${suggestions.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'submit'
                ? 'border-teal-800 text-teal-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Suggest a Feature' : 'Toa Pendekezo Jipya'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: BROWSE IDEAS */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['all', 'tools', 'curriculum', 'language', 'mobile'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                        selectedFilter === cat
                          ? 'bg-teal-800 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {isSamaritan && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>The_Samaritan Developer Access: Full Backlog Visibility</span>
                    </span>
                  )}
                  <span className="text-[11px] text-stone-500">
                    {filteredSuggestions.length} {language === 'en' ? 'suggestions' : 'mapendekezo'}
                  </span>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                {filteredSuggestions.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <Lightbulb className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs text-stone-600">
                      {language === 'en'
                        ? 'No suggestions in this category yet. Be the first to submit!'
                        : 'Hakuna mapendekezo katika kategoria hii bado. Kuwa wa kwanza kupendekeza!'}
                    </p>
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="px-3 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'en' ? 'Submit Idea' : 'Wasilisha Wazo'}</span>
                    </button>
                  </div>
                ) : (
                  filteredSuggestions.map((item) => {
                    const voterId = currentUser ? currentUser.username : 'guest_voter';
                    const hasVoted = item.voterIds.includes(voterId);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-stone-200 hover:border-stone-300 bg-white shadow-xs space-y-3 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {getStatusBadge(item.status)}
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono text-[10px] capitalize">
                                {item.category}
                              </span>
                              {item.targetModule && (
                                <span className="text-[10px] text-stone-400 font-medium">
                                  • {item.targetModule}
                                </span>
                              )}
                            </div>
                            <h3 className="font-serif font-bold text-sm text-stone-900">
                              {item.title}
                            </h3>
                            <p className="text-xs text-stone-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Upvote Button */}
                          <button
                            onClick={() => handleVote(item.id)}
                            className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl border transition-all shrink-0 ${
                              hasVoted
                                ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs'
                                : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
                            }`}
                            title={language === 'en' ? 'Click to upvote' : 'Bonyeza kupiga kura'}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${hasVoted ? 'text-teal-700 fill-teal-700' : 'text-stone-500'}`}
                            />
                            <span className="text-xs font-mono font-bold mt-1">{item.votes}</span>
                          </button>
                        </div>

                        {/* Admin Feedback note if any */}
                        {item.adminNote && (
                          <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                            <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-[11px] block">
                                {language === 'en' ? 'Admin Team Note:' : 'Ufafanuzi wa Wasimamizi:'}
                              </strong>
                              <span className="text-[11px] leading-snug">{item.adminNote}</span>
                            </div>
                          </div>
                        )}

                        {/* Admin Controls if admin is logged in */}
                        {isAdmin && (
                          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-stone-500">Status:</span>
                              {(['received', 'under_review', 'planned', 'completed'] as const).map(
                                (st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleStatusChange(item.id, st)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                                      item.status === st
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                                  >
                                    {st.replace('_', ' ')}
                                  </button>
                                )
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setEditingAdminNoteId(item.id);
                                setAdminNoteInput(item.adminNote || '');
                              }}
                              className="text-[11px] font-bold text-blue-900 hover:underline"
                            >
                              {item.adminNote ? 'Edit Note' : '+ Add Admin Note'}
                            </button>
                          </div>
                        )}

                        {/* Admin Note Inline Editor */}
                        {isAdmin && editingAdminNoteId === item.id && (
                          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                            <input
                              type="text"
                              value={adminNoteInput}
                              onChange={(e) => setAdminNoteInput(e.target.value)}
                              placeholder="Add official progress update or feedback..."
                              className="w-full text-xs p-2 bg-white border border-blue-300 rounded-lg focus:outline-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingAdminNoteId(null)}
                                className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-200 rounded"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveAdminNote(item.id)}
                                className="px-3 py-1 text-xs font-bold bg-blue-900 text-white rounded"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                          <span>Suggested by {item.suggestedBy}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SUBMIT A NEW SUGGESTION */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {feedbackNotice && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    feedbackNotice.type === 'success'
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                      : 'bg-red-50 text-red-950 border border-red-300'
                  }`}
                >
                  {feedbackNotice.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{feedbackNotice.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'en' ? 'Feature / Idea Title:' : 'Kichwa cha Wazo / Pendekezo:'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'e.g. Kiswahili Voice Narration for Lessons'
                      : 'mfano: Sauti za Kiswahili za Kusoma Masomo'
                  }
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {language === 'en' ? 'Category:' : 'Aina ya Wazo:'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
                  >
                    <option value="tools">Civic Tools & Calculators</option>
                    <option value="curriculum">Course Lessons & Katiba</option>
                    <option value="language">Kiswahili & Local Dialects</option>
                    <option value="mobile">Mobile & Offline Access</option>
                    <option value="qna">Q&A and Verification Hub</option>
                    <option value="other">Other Platform Feature</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {language === 'en' ? 'Target Section:' : 'Sehemu Inayohusika:'}
                  </label>
                  <input
                    type="text"
                    value={targetModule}
                    onChange={(e) => setTargetModule(e.target.value)}
                    placeholder="e.g. Devolution Hub, Quiz, Certificates"
                    className="w-full text-xs px-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'en' ? 'Detailed Explanation:' : 'Maelezo ya Kina:'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Describe how this feature will help citizens, youth, or women in Kwale understand devolved governance better...'
                      : 'Eleza jinsi kipengele hiki kitakavyosaidia wananchi kuelewa vizuri uongozi wa ugavi wa madaraka...'
                  }
                  className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'en' ? 'Suggested By (Handle / Name):' : 'Imependekezwa Na:'}
                </label>
                <input
                  type="text"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  placeholder="e.g. @CivicCitizen or Hassan M."
                  className="w-full text-xs px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  {language === 'en'
                    ? 'You can remain anonymous or use your handle.'
                    : 'Unaweza kuacha wazi au kutumia jina lako la kawaida.'}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'en' ? 'Cancel' : 'Ghairi'}
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Submit Suggestion' : 'Wasilisha Pendekezo'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
