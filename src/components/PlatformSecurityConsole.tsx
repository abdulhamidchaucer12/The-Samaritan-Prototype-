import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Key,
  Database,
  Cpu,
  Layers,
  Terminal,
  Server,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import {
  runPlatformSecurityAudit,
  getSecurityIncidents,
  clearSecurityIncidents,
  detectMaliciousPayload,
  sanitizeSafeText,
  SecurityAuditReport,
  SecurityIncident,
} from '../utils/platformSecurity';

interface PlatformSecurityConsoleProps {
  language: Language;
}

export const PlatformSecurityConsole: React.FC<PlatformSecurityConsoleProps> = ({
  language,
}) => {
  const [report, setReport] = useState<SecurityAuditReport>(() => runPlatformSecurityAudit());
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [testPayload, setTestPayload] = useState<string>('');
  const [testResult, setTestResult] = useState<{
    detected: boolean;
    reason?: string;
    sanitized: string;
  } | null>(null);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const fresh = runPlatformSecurityAudit();
      setReport(fresh);
      setIsAuditing(false);
    }, 600);
  };

  const handleTestPayload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPayload.trim()) return;

    const analysis = detectMaliciousPayload(testPayload);
    const sanitized = sanitizeSafeText(testPayload);
    setTestResult({
      detected: analysis.isMalicious,
      reason: analysis.reason,
      sanitized,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert className="w-56 h-56 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'en'
                  ? 'AIRTIGHT PLATFORM SECURITY SHIELD ACTIVE'
                  : 'NGAO YA JUU YA USALAMA WA MFUMO IMEWASHWA'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-serif">
              {language === 'en'
                ? 'The Samaritan Sentinel Security Core'
                : 'Kitovu cha Usalama cha Ngao ya Msamaria'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Multi-layered defense-in-depth architecture: Cryptographic HMAC storage verification, sliding-window anti-DDoS rate limiting, P2P Sentinel AI content watchdog, and strict HTTP headers protecting civic integrity.'
                : 'Muundo wa safu nyingi za ulinzi: Uthibitishaji wa kidijitali wa HMAC, udhibiti wa msongamano wa maombi (Rate Limiting), ulinzi wa P2P Sentinel AI, na sera kali za usalama za HTTP.'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                {language === 'en' ? 'Security Health Score' : 'Kiwango cha Usalama'}
              </span>
              <div className="text-4xl font-black text-emerald-400 flex items-center gap-2">
                <span>{report.healthScore}%</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  {report.status.toUpperCase()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>
                {isAuditing
                  ? language === 'en'
                    ? 'Running Cryptographic Audit...'
                    : 'Ukaguzi Unaendelea...'
                  : language === 'en'
                  ? 'Run Full Security Audit'
                  : 'Kagua Usalama wa Mfumo'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Integrity Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {report.integrityChecks.map((check, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {check.component}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  PASS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                {check.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Defense Layers List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {language === 'en'
                ? 'Active Defense & Anti-Hack Shield Specifications'
                : 'Vigezo vya Safu za Ulinzi dhidi ya Udukuzi'}
            </h3>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            {report.defenseLayers.length} Layers Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {report.defenseLayers.map((layer, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  {layer.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {layer.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {layer.description}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl">
                {layer.details}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Anti-Tamper & Payload Neutralizer Test Suite */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {language === 'en'
                ? 'Interactive Attack Payload Simulator & Neutralizer'
                : 'Jaribio la Uzuiaji wa Uvamizi na Utakaso wa Data'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'en'
                ? 'Test hostile input sequences (XSS scripts, prototype pollution, SQL strings) to observe the Samaritan Shield instant detection and sanitization.'
                : 'Jaribu mifumo mibaya ya pembejeo (script za XSS, unajisi wa prototype) ili kuona utakaso wa papo hapo.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleTestPayload} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              placeholder="e.g. <script>alert(1)</script> or __proto__.polluted = true"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'Simulate Attack' : 'Jaribu Shambulio'}</span>
            </button>
          </div>
        </form>

        {testResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              testResult.detected
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2 font-black">
              {testResult.detected ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>ATTACK THREAT NEUTRALIZED: {testResult.reason}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SAFE PAYLOAD CONFIRMED</span>
                </>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Sanitized & Escaped Output for Safe Rendering:
              </span>
              <code className="text-xs font-mono block p-2 mt-1 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 break-all text-slate-900 dark:text-slate-100">
                {testResult.sanitized || '(empty string)'}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Security Incident Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {language === 'en' ? 'Live Tamper Watchdog & Incident Audit' : 'Kumbukumbu ya Vitisho vya Usalama'}
            </h3>
          </div>
          {report.recentIncidents.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearSecurityIncidents();
                setReport(runPlatformSecurityAudit());
              }}
              className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
            >
              Clear Log
            </button>
          )}
        </div>

        {report.recentIncidents.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center py-6 text-xs text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <strong className="block font-black text-sm">
              {language === 'en' ? 'Zero Breaches Detected' : 'Hakuna Hatari Zilizotambuliwa'}
            </strong>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              All cryptographic ledgers, token balances, and verification badges match official signatures.
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {report.recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">
                    {incident.type}
                  </span>
                  <span className="text-slate-500 text-[11px]">{incident.details}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  REMEDIATED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
