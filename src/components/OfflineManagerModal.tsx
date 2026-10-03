import React, { useState } from 'react';
import {
  X,
  DownloadCloud,
  FileDown,
  CheckCircle,
  HardDrive,
  Wifi,
  Smartphone,
  BookOpen,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import {
  downloadOfflinePackToStorage,
  exportPrintableHandbookText,
  getUserProgress,
} from '../utils/storage';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  isOnline: boolean;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  language,
  isOnline,
}) => {
  const t = translations[language];
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [packStats, setPackStats] = useState<{ sizeKb: number; timestamp: string } | null>(
    null
  );

  const progress = getUserProgress();

  if (!isOpen) return null;

  const handleDownloadPack = async () => {
    setIsDownloading(true);
    try {
      const stats = await downloadOfflinePackToStorage();
      setPackStats(stats);
      setDownloadSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportHandbook = () => {
    const textContent = exportPrintableHandbookText(language);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `The_Samaritan_Civic_Handbook_${language.toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {t.offline.modalTitle}
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            {language === 'en'
              ? 'Save all lessons, profiles, and quizzes to your device for zero-data offline learning.'
              : 'Hifadhi masomo, ofisi na chemsha bongo zote kwenye kifaa chako utumie bila intaneti.'}
          </p>
        </div>

        {/* Network & Local Storage Status */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
          <div className="space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] block font-bold">
              {language === 'en' ? 'Network Connection' : 'Muunganisho wa Mtandao'}
            </span>
            <div className="flex items-center gap-1.5 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className={isOnline ? 'text-emerald-800' : 'text-amber-800'}>
                {isOnline ? t.common.online : t.common.offline}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-stone-400 uppercase tracking-wider text-[10px] block font-bold">
              {language === 'en' ? 'Offline Pack Status' : 'Hali ya Kifurushi'}
            </span>
            <div className="flex items-center gap-1.5 font-bold">
              {progress.offlinePackDownloaded || downloadSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">
                    {language === 'en' ? 'Saved to Device' : 'Kimehifadhiwa Kwenye Kifaa'}
                  </span>
                </>
              ) : (
                <span className="text-stone-500">
                  {language === 'en' ? 'Not yet cached' : 'Bado hakijapakuliwa'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action 1: Download Offline Pack */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-900">
                {t.offline.downloadPack}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Caches all 17 government office profiles, 10 civic lessons, and interactive quiz scenarios in local storage (~150 KB).'
                  : 'Huhifadhi ofisi zote 17, masomo 10 ya uraia na chemsha bongo kwenye simu au kompyuta yako (~150 KB).'}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPack}
            disabled={isDownloading}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isDownloading ? (
              <span>{language === 'en' ? 'Caching Pack...' : 'Inapakua...'}</span>
            ) : downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>
                  {language === 'en' ? 'Offline Pack Ready!' : 'Kifurushi Kiko Tayari!'}
                </span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>{t.offline.downloadPack}</span>
              </>
            )}
          </button>
        </div>

        {/* Action 2: Export Printable Civic Handbook */}
        <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-900">
                {language === 'en'
                  ? 'Export Printable Civic Handbook (.txt)'
                  : 'Pakua Kitabu cha Uraia cha Kuchapisha (.txt)'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'en'
                  ? 'Generates a clean text document of all lessons and offices designed for community facilitators, teachers, and study circles in Kwale.'
                  : 'Hutoa faili ya maandishi ya masomo yote inayofaa walimu, viongozi wa jamii na vikundi vya majadiliano.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleExportHandbook}
            className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'Download English Handbook'
                : 'Pakua Kitabu cha Kiswahili'}
            </span>
          </button>
        </div>

        {/* Action 3: PWA Installation Tip */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 space-y-2">
          <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Smartphone className="w-3.5 h-3.5 text-teal-700" />
            <span>
              {language === 'en'
                ? 'How to install as an App (PWA):'
                : 'Jinsi ya kusakinisha kama Programu (App):'}
            </span>
          </div>
          <p className="text-teal-900 leading-relaxed">
            {language === 'en'
              ? 'On Android Chrome: Tap the 3 dots (⋮) menu > "Install app" or "Add to Home screen". On iPhone Safari: Tap the Share button > "Add to Home Screen". The Samaritan will launch like a native mobile app even without internet.'
              : 'Kwenye simu ya Android (Chrome): Bonyeza vidoti 3 (⋮) kisha chagua "Install app" au "Add to Home screen". Kwenye iPhone (Safari): Bonyeza alama ya Shiriki (Share) kisha "Add to Home Screen". The Samaritan itafanya kazi kama application ya kawaida bila intaneti.'}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
