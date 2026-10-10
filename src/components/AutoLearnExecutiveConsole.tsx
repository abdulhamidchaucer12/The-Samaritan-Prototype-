import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  XCircle,
  RotateCcw,
  Activity,
  Layers,
  Wand2,
  TrendingUp,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Eye,
  Smartphone,
  Sun,
  Languages,
  Search,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import {
  getAllAdaptationProposals,
  approveAdaptationProposal,
  denyAdaptationProposal,
  revertAdaptationProposal,
  evaluateInteractionTelemetryAndPropose,
  getAllTelemetryEvents,
  UIUXAdaptationProposal,
  InteractionTelemetryEvent,
} from '../utils/autoLearnEngine';

interface AutoLearnExecutiveConsoleProps {
  language: Language;
  currentUser: AuthUser;
}

export const AutoLearnExecutiveConsole: React.FC<AutoLearnExecutiveConsoleProps> = ({
  language,
  currentUser,
}) => {
  const [proposals, setProposals] = useState<UIUXAdaptationProposal[]>(() =>
    getAllAdaptationProposals()
  );
  const [telemetry, setTelemetry] = useState<InteractionTelemetryEvent[]>(() =>
    getAllTelemetryEvents()
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const isSamaritan = Boolean(
    currentUser.username &&
      ['the_samaritan', '@the_samaritan', 'the samaritan'].includes(
        currentUser.username.toLowerCase().trim()
      )
  );

  const reloadData = () => {
    setProposals(getAllAdaptationProposals());
    setTelemetry(getAllTelemetryEvents());
  };

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener('the_samaritan_adaptation_proposals_updated', handleUpdate);
    window.addEventListener('the_samaritan_active_adaptations_changed', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_adaptation_proposals_updated', handleUpdate);
      window.removeEventListener('the_samaritan_active_adaptations_changed', handleUpdate);
    };
  }, []);

  const handleApprove = (propId: string) => {
    const res = approveAdaptationProposal(propId, currentUser.username);
    setFeedback(res.message);
    reloadData();
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleDeny = (propId: string) => {
    const res = denyAdaptationProposal(propId, currentUser.username);
    setFeedback(res.message);
    reloadData();
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleRevert = (propId: string) => {
    const res = revertAdaptationProposal(propId, currentUser.username);
    setFeedback(res.message);
    reloadData();
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleForceSynthesis = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const generated = evaluateInteractionTelemetryAndPropose();
      setIsSynthesizing(false);
      reloadData();
      if (generated) {
        setFeedback(
          language === 'en'
            ? `New adaptation proposal synthesized: "${generated.title}". Notification dispatched to The_Samaritan.`
            : `Pendekezo jipya limeundwa: "${generated.titleSw}". Taarifa imetumwa kwa The_Samaritan.`
        );
      } else {
        setFeedback(
          language === 'en'
            ? 'Continuous evaluation complete: No new anomalous friction patterns detected.'
            : 'Ukaguzi umekamilika: Hakuna msuguano mpya uliogunduliwa kwa sasa.'
        );
      }
      setTimeout(() => setFeedback(null), 5000);
    }, 600);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'civic_reading_focus':
        return <Eye className="w-4 h-4 text-purple-600" />;
      case 'touch_target_density':
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'high_contrast_shield':
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 'swahili_prominence':
        return <Languages className="w-4 h-4 text-blue-600" />;
      case 'search_speed_dock':
        return <Search className="w-4 h-4 text-teal-600" />;
      default:
        return <Wand2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const approvedCount = proposals.filter((p) => p.status === 'approved').length;
  const pendingCount = proposals.filter((p) => p.status === 'pending_review').length;
  const rejectedCount = proposals.filter((p) => p.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-slate-900 text-white font-bold text-xs flex items-center gap-2 shadow-lg animate-in fade-in border border-purple-500/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-purple-950/80 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>
                {language === 'en'
                  ? 'Continuous Learning & UI/UX Self-Evolution'
                  : 'Kujifunza Kiotomatiki na Mageuzi ya Mwonekano'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
              {language === 'en'
                ? 'Autonomous Platform Learning Engine'
                : 'Mfumo wa Kujifunza na Kuboresha Mwonekano'}
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/80 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'The platform observes citizen interactions (reading durations, viewport sizes, quiz retries, search queries). When friction is discovered, a formal proposal is submitted to The_Samaritan account. Upon approval, UI/UX dynamically auto-adapts; if denied, the platform strictly remains as is.'
                : 'Mfumo hufuatilia mienendo ya wananchi (muda wa kusoma, ukubwa wa skrini, maswali yanayorudiwa, utafutaji). Kukiwa na uhitaji wa kuboresha, taarifa hutumwa kwa The_Samaritan. Akiidhinisha, mfumo hubadilika papo hapo; akipinga, mfumo unabaki jinsi ulivyo.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isSynthesizing}
              onClick={handleForceSynthesis}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition cursor-pointer shadow-md disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>
                {language === 'en' ? 'Synthesize Telemetry Now' : 'Changanua Mienendo Sasa'}
              </span>
            </button>
          </div>
        </div>

        {/* Telemetry Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-purple-900/50">
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40">
            <span className="text-[10px] font-black uppercase text-purple-300 block">
              Observed Events
            </span>
            <span className="text-lg font-mono font-black text-white">
              {telemetry.length}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40">
            <span className="text-[10px] font-black uppercase text-amber-300 block">
              Pending Decisions
            </span>
            <span className="text-lg font-mono font-black text-amber-300">
              {pendingCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40">
            <span className="text-[10px] font-black uppercase text-emerald-300 block">
              Auto-Adapted UI
            </span>
            <span className="text-lg font-mono font-black text-emerald-300">
              {approvedCount}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-800/40">
            <span className="text-[10px] font-black uppercase text-rose-300 block">
              Maintained As-Is
            </span>
            <span className="text-lg font-mono font-black text-rose-300">
              {rejectedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>
              {language === 'en'
                ? 'Synthesized UI/UX Adaptation Proposals'
                : 'Mapendekezo ya Marekebisho ya Mwonekano'}
            </span>
          </h4>
          <span className="text-xs text-slate-500">
            {language === 'en'
              ? `${proposals.length} total learning vectors`
              : `${proposals.length} mapendekezo yote`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {proposals.map((prop) => {
            const isApproved = prop.status === 'approved';
            const isRejected = prop.status === 'rejected';
            const isPending = prop.status === 'pending_review';

            return (
              <div
                key={prop.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 bg-white dark:bg-slate-900 ${
                  isApproved
                    ? 'border-emerald-300 shadow-sm ring-1 ring-emerald-400/30'
                    : isRejected
                    ? 'border-slate-200 opacity-80'
                    : 'border-purple-300 shadow-md ring-1 ring-purple-400/30'
                }`}
              >
                {/* Proposal Top Meta */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center shrink-0">
                      {getCategoryIcon(prop.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 px-2 py-0.5 rounded-md">
                          {prop.category.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Confidence: {prop.confidenceScore}%
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 mt-0.5">
                        {language === 'en' ? prop.title : prop.titleSw}
                      </h5>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isRejected
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    }`}
                  >
                    {isApproved
                      ? language === 'en'
                        ? 'Auto-Adapted'
                        : 'Imetekelezwa'
                      : isRejected
                      ? language === 'en'
                        ? 'Remains As-Is'
                        : 'Imebakishwa'
                      : language === 'en'
                      ? 'Awaiting Decision'
                      : 'Inasubiri Uamuzi'}
                  </span>
                </div>

                {/* Summary & Telemetry Rationale */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'en' ? prop.summary : prop.summarySw}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {language === 'en' ? 'Observed Telemetry Trigger:' : 'Kichocheo cha Data:'}
                    </span>
                    <span className="font-mono">{prop.observedInteractionsCount} interactions</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {prop.triggerMetric}
                  </p>
                </div>

                {/* Suggested UI Modifications */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {language === 'en' ? 'Dynamic UI Actions:' : 'Hatua za Mwonekano:'}
                  </span>
                  {prop.suggestedUiChanges.map((change, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-[11px] flex items-center justify-between"
                    >
                      <code className="text-[10px] font-mono text-purple-800 dark:text-purple-300 font-bold">
                        {change.targetElement}
                      </code>
                      <span className="text-slate-500 text-[10px]">{change.description}</span>
                    </div>
                  ))}
                </div>

                {/* Decision Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {isPending ? (
                    isSamaritan ? (
                      <div className="w-full flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(prop.id)}
                          className="grow flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-xs cursor-pointer"
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
                          onClick={() => handleDeny(prop.id)}
                          className="grow flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-xs cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>
                            {language === 'en'
                              ? 'Deny (Remain As Is)'
                              : 'Kataa (Baki Kama Ilivyo)'}
                          </span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>
                          {language === 'en'
                            ? 'Submitted to The_Samaritan for review'
                            : 'Imewasilishwa kwa The_Samaritan'}
                        </span>
                      </span>
                    )
                  ) : isApproved ? (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>
                          {language === 'en'
                            ? 'Active in Production UI'
                            : 'Inafanya Kazi Moja kwa Moja'}
                        </span>
                      </div>
                      {isSamaritan && (
                        <button
                          type="button"
                          onClick={() => handleRevert(prop.id)}
                          className="text-[11px] text-slate-500 hover:text-rose-600 font-bold underline cursor-pointer"
                        >
                          {language === 'en' ? 'Revert to Default' : 'Rejesha Awali'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-rose-700 dark:text-rose-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>
                          {language === 'en'
                            ? 'Denied: System Remains As Is'
                            : 'Imekataliwa: Mfumo Unabaki Kama Ulivyo'}
                        </span>
                      </div>
                      {isSamaritan && (
                        <button
                          type="button"
                          onClick={() => handleApprove(prop.id)}
                          className="text-[11px] text-purple-600 hover:text-purple-800 font-bold underline cursor-pointer"
                        >
                          {language === 'en' ? 'Reconsider & Approve' : 'Fikiria Upya na Idhinisha'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
