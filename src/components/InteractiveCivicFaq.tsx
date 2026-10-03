import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Search,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Scale,
  Landmark,
  FileText,
  DollarSign,
  Users,
} from 'lucide-react';
import { civicFaqData, civicFaqCategories, CivicFaqItem } from '../data/civicFaqData';
import { Language } from '../types';
import { AdminOnlineStatusBadge } from './AdminOnlineStatusBadge';

interface InteractiveCivicFaqProps {
  language: Language;
  onAskCustomQuestion?: () => void;
  onSelectRelatedQuestion?: (questionTitle: string) => void;
}

export const InteractiveCivicFaq: React.FC<InteractiveCivicFaqProps> = ({
  language,
  onAskCustomQuestion,
  onSelectRelatedQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-devolution-1');

  const filteredFaqs = useMemo(() => {
    return civicFaqData.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.question.en.toLowerCase().includes(q) ||
        item.question.sw.toLowerCase().includes(q) ||
        item.detailedAnswer.en.toLowerCase().includes(q) ||
        item.detailedAnswer.sw.toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.summary.sw.toLowerCase().includes(q) ||
        item.keyArticles.some((art) => art.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (cat: CivicFaqItem['category']) => {
    switch (cat) {
      case 'devolution':
        return <Landmark className="w-3.5 h-3.5 text-emerald-700" />;
      case 'rights':
        return <Scale className="w-3.5 h-3.5 text-blue-700" />;
      case 'representation':
        return <Users className="w-3.5 h-3.5 text-purple-700" />;
      case 'public_funds':
        return <DollarSign className="w-3.5 h-3.5 text-amber-700" />;
      case 'judiciary':
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-stone-700" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              {language === 'en' ? 'CONSTITUTIONAL KNOWLEDGE BASE' : 'KITI CHA ELIMU YA KIKATIBA'}
            </span>

            {/* Admin Online Status Badge */}
            <AdminOnlineStatusBadge language={language} variant="compact" />
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-extrabold tracking-tight">
            {language === 'en'
              ? 'Interactive Civic & Government Literacy FAQ'
              : 'Maswali Yanayoulizwa Sana Kuhusu Serikali na Katiba'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
            {language === 'en'
              ? 'Explore verified accordion answers explaining county powers, citizen rights, elected leader mandates, and public finance under the Constitution of Kenya 2010.'
              : 'Gundua majibu yaliyothibitishwa yanayoeleza mamlaka ya serikali ya kaunti, haki za raia, wajibu wa viongozi, na usimamizi wa fedha za umma chini ya Katiba ya Kenya 2010.'}
          </p>

          {/* Quick Search Input */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search questions (e.g. devolution, arrest rights, MCA, bursaries, Article 49)...'
                    : 'Tafuta maswali (mfano ugavi wa madaraka, haki za kukamatwa, diwani, bursary)...'
                }
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-white/10 text-white placeholder:text-stone-400 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-stone-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {civicFaqCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-teal-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{cat.label[language]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-teal-700 text-teal-100' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {cat.id === 'all'
                  ? civicFaqData.length
                  : civicFaqData.filter((i) => i.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">
              {language === 'en'
                ? `No FAQ questions found matching "${searchQuery}"`
                : `Hakuna maswali yaliyopatikana kwa utafutaji "${searchQuery}"`}
            </p>
            {onAskCustomQuestion && (
              <button
                onClick={onAskCustomQuestion}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {language === 'en'
                    ? 'Ask this as a New Question to the Community & Admin'
                    : 'Uliza swali hili jipya kwa Jamii na Wasimamizi'}
                </span>
              </button>
            )}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-teal-700/60 shadow-md ring-1 ring-teal-700/20'
                    : 'border-stone-200 hover:border-stone-300 shadow-xs'
                }`}
              >
                {/* Accordion Toggle Header */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 transition-colors hover:bg-stone-50/60"
                  aria-expanded={isExpanded}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                        {getCategoryIcon(faq.category)}
                        <span>{faq.category.replace('_', ' ')}</span>
                      </span>

                      {faq.keyArticles.slice(0, 2).map((art, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-mono font-bold"
                        >
                          {art}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug">
                      {faq.question[language]}
                    </h3>

                    {!isExpanded && (
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {faq.summary[language]}
                      </p>
                    )}
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded
                        ? 'bg-teal-800 text-white rotate-180'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expandable Content Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-4 bg-stone-50/40">
                    {/* Summary Callout */}
                    <div className="p-3.5 rounded-xl bg-teal-50/90 border border-teal-200 text-xs sm:text-sm text-teal-950 font-medium leading-relaxed">
                      {faq.summary[language]}
                    </div>

                    {/* Detailed Constitutional Explanation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-stone-500" />
                        <span>
                          {language === 'en'
                            ? 'Constitutional Analysis & Practical Law:'
                            : 'Uchambuzi wa Kikatiba na Sheria:'}
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                        {faq.detailedAnswer[language]}
                      </p>
                    </div>

                    {/* Relevant Articles List */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-stone-500 mr-1">
                        {language === 'en' ? 'Provisions:' : 'Vifungu vya Sheria:'}
                      </span>
                      {faq.keyArticles.map((art, aIdx) => (
                        <span
                          key={aIdx}
                          className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-mono text-[11px] font-semibold"
                        >
                          {art}
                        </span>
                      ))}
                    </div>

                    {/* Citizen Action Tip */}
                    <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{language === 'en' ? 'Citizen Action Tip' : 'Ushauri kwa Mwananchi'}</span>
                      </div>
                      <p className="leading-relaxed">{faq.actionableTip[language]}</p>
                    </div>

                    {/* Bottom Action Footer: Link to Community Q&A */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
                      <span className="text-stone-500">
                        {language === 'en'
                          ? 'Need further local advice for your sub-county?'
                          : 'Unahitaji ushauri zaidi wa eneo lako la kaunti?'}
                      </span>

                      {onAskCustomQuestion && (
                        <button
                          onClick={() => {
                            if (onSelectRelatedQuestion) {
                              onSelectRelatedQuestion(faq.question[language]);
                            }
                            onAskCustomQuestion();
                          }}
                          className="font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 underline underline-offset-2"
                        >
                          <span>
                            {language === 'en'
                              ? 'Ask in Civic Q&A Hub'
                              : 'Uliza kwenye Kituo cha Maswali'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Assistance & Suggestion Box Link */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif font-bold text-sm text-stone-900">
            {language === 'en'
              ? "Didn't find what you were looking for?"
              : 'Hujapata jibu la swali lako hapa?'}
          </h4>
          <p className="text-xs text-stone-600">
            {language === 'en'
              ? 'Post an anonymous question to get prompt feedback from our AI Operator and verified civic administrators.'
              : 'Weka swali lako bila kutaja jina lako ili upate jibu la haraka kutoka kwa Opereta wa AI na wasimamizi wa kiraia.'}
          </p>
        </div>

        {onAskCustomQuestion && (
          <button
            onClick={onAskCustomQuestion}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'en' ? 'Ask Citizen Question' : 'Uliza Swali la Raia'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
