import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Building,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  Split,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { howGovernmentWorksTopics } from '../data/howGovernmentWorksData';

interface HowGovernmentWorksProps {
  language: Language;
  onNavigateToExplorer?: () => void;
}

export const HowGovernmentWorks: React.FC<HowGovernmentWorksProps> = ({
  language,
  onNavigateToExplorer,
}) => {
  const t = translations[language];
  const [activeTopicId, setActiveTopicId] = useState<string>('constitution');

  const currentTopic =
    howGovernmentWorksTopics.find((t) => t.id === activeTopicId) ||
    howGovernmentWorksTopics[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Civic Guidebook' : 'Mwongozo wa Utawala'}</span>
        </div>
        <h1 className="text-3xl font-extrabold font-serif text-stone-900 tracking-tight">
          {t.howGov.title}
        </h1>
        <p className="text-stone-600 mt-2 text-base max-w-3xl leading-relaxed">
          {t.howGov.subtitle}
        </p>
      </div>

      {/* Navigation Pills for the 6 Core Topics */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {howGovernmentWorksTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeTopicId === topic.id
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>{topic.title[language]}</span>
          </button>
        ))}
      </div>

      {/* Topic Content Card */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="space-y-2 border-b border-stone-100 pb-5">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            {currentTopic.title[language]}
          </h2>
          <p className="text-emerald-800 text-sm font-semibold">
            {currentTopic.subtitle[language]}
          </p>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed pt-2">
            {currentTopic.content[language]}
          </p>
        </div>

        {/* Pillars / Features if present */}
        {currentTopic.keyPillars.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {language === 'en' ? 'Foundational Pillars' : 'Nguzo Kuu za Kikatiba'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentTopic.keyPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    {pillar.title[language]}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {pillar.description[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special comparison for Schedule 4 (National vs County functions) */}
        {currentTopic.comparisons && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Split className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold font-serif text-stone-900">
                {language === 'en'
                  ? 'Fourth Schedule: Comparison of Responsibilities'
                  : 'Jedwali la Nne: Ulinganifu wa Majukumu'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* National Column */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm uppercase tracking-wider">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>
                    {language === 'en'
                      ? 'National Government (State House & Ministries)'
                      : 'Serikali ya Kitaifa (Ikulu na Wizara za Taifa)'}
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentTopic.comparisons.national[language].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* County Column */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  <span>
                    {language === 'en'
                      ? 'County Governments (47 Counties - e.g. Kwale)'
                      : 'Serikali za Kaunti (Kaunti 47 - Mfano: Kwale)'}
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700">
                  {currentTopic.comparisons.county[language].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-step roadmap for Public Participation */}
        {currentTopic.steps && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {language === 'en' ? 'Step-by-Step Action Roadmap' : 'Hatua kwa Hatua za Utekelezaji'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentTopic.steps.map((step) => (
                <div
                  key={step.step}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-2 relative hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center mb-1">
                    {step.step}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">
                    {step.title[language]}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {step.description[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Step Banner */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            {language === 'en'
              ? 'Ready to test your comprehension of constitutional governance?'
              : 'Uko tayari kupima ufahamu wako kuhusu utawala wa kikatiba?'}
          </p>
          {onNavigateToExplorer && (
            <button
              onClick={onNavigateToExplorer}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>{language === 'en' ? 'Explore Specific Offices' : 'Chunguza Ofisi Husika'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
