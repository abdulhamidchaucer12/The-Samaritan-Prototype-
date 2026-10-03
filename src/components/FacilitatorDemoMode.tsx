import React, { useState, useEffect, useCallback } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Globe,
  X,
} from 'lucide-react';
import { Language, FacilitatorSlide } from '../types';
import { translations } from '../data/translations';

interface FacilitatorDemoModeProps {
  language: Language;
  onToggleLanguage?: (lang: Language) => void;
  onExit?: () => void;
}

export const FacilitatorDemoMode: React.FC<FacilitatorDemoModeProps> = ({
  language,
  onToggleLanguage,
  onExit,
}) => {
  const t = translations[language];
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const slides: FacilitatorSlide[] = [
    {
      id: 'slide_1',
      stepNumber: 1,
      title: {
        en: 'Sovereign Power Belongs to the People of Kenya',
        sw: 'Mamlaka Yote Huru ya Dola Ni ya Wananchi wa Kenya',
      },
      subTitle: {
        en: 'The constitutional bedrock of democratic governance in Kenya',
        sw: 'Msingi thabiti wa kikatiba wa utawala wa kidemokrasia Kenya',
      },
      keyTakeaways: {
        en: [
          'All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with the Constitution.',
          'Citizens may exercise this power directly or through their democratically elected representatives.',
          'Sovereign power is exercised at both the National and County levels.',
          'Every public officer is a servant of the people, not their master (Chapter Six).',
        ],
        sw: [
          'Mamlaka yote huru ni ya wananchi wa Kenya na yataendeshwa kwa mujibu wa Katiba pekee.',
          'Wananchi wanaweza kutumia mamlaka haya moja kwa moja au kupitia wawakilishi wao waliowachagua.',
          'Mamlaka huru yanatumika katika ngazi zote mbili: Kitaifa na Kaunti.',
          'Kila afisa wa umma ni mtumishi wa wananchi na si bwana wao (Sura ya Sita).',
        ],
      },
      talkingPoints: {
        en: [
          'Emphasize that the Constitution puts citizens at the peak of power.',
          'Public officers hold power in trust, not by divine right.',
          'Remind community members that public funds are taxpayers money.',
        ],
        sw: [
          'Sisitiza kwamba Katiba inamweka mwananchi kileleni mwa mamlaka.',
          'Viongozi wamepewa dhamana tu na wananchi kupitia kura na sheria.',
          'Wakumbushe wananchi kwamba fedha za miradi yote ni kodi zao wenyewe.',
        ],
      },
      interactivePrompt: {
        en: 'In our village or ward, do we see public officers acting as servants of the people, or do we fear questioning how community funds are spent?',
        sw: 'Katika kijiji au wadi yetu, je, tunawaona viongozi kama watumishi wa wananchi, au tunaogopa kuhoji jinsi fedha za umma zinavyotumika?',
      },
      constitutionalArticle: 'Article 1 & 2',
    },
    {
      id: 'slide_2',
      stepNumber: 2,
      title: {
        en: 'The Three Arms of Government & Separation of Powers',
        sw: 'Mihimili Mitatu ya Dola na Mgawanyo wa Madaraka',
      },
      subTitle: {
        en: 'Preventing tyranny and safeguarding accountability through constitutional checks',
        sw: 'Kuzuia ubabe na kulinda uwajibikaji kupitia udhibiti wa kikatiba',
      },
      keyTakeaways: {
        en: [
          'The Executive (President, Cabinet, Civil Service) implements laws and manages public administration.',
          'The Legislature (Parliament & County Assemblies) makes laws, allocates revenue, and conducts oversight.',
          'The Judiciary (Chief Justice, Supreme Court, Judges & Magistrates) interprets law and protects constitutional rights.',
          'No single arm has absolute power; each arm checks and balances the others.',
        ],
        sw: [
          'Mtendaji (Rais, Baraza la Mawaziri, Watumishi wa Umma) anatekeleza sheria na kusimamia huduma.',
          'Bunge (Bunge la Kitaifa, Seneti na Bunge la Kaunti) linatunga sheria, linaidhinisha bajeti na kuangazia matumizi.',
          'Mahakama (Jaji Mkuu, Mahakama ya Juu, Majaji na Mahakimu) inatafsiri sheria na kulinda haki za raia.',
          'Hakuna mhimili wenye mamlaka kamili peke yake; kila mhimili unauangalia na kuudhibiti mwingine.',
        ],
      },
      talkingPoints: {
        en: [
          'Explain why the courts can declare an unconstitutional executive order or bill null and void.',
          'Explain why Parliament vets and approves Cabinet Secretaries and judges before appointment.',
        ],
        sw: [
          'Eleza kwanini mahakama ina uwezo wa kusitisha sheria inayokiuka Katiba.',
          'Fafanua kwanini Bunge lazima liahirishe na kumkagua waziri kabla ya kuteuliwa na Rais.',
        ],
      },
      interactivePrompt: {
        en: 'Why is it dangerous if one person or one arm controls both law-making, spending, and the courts?',
        sw: 'Kwanini ni hatari sana iwapo mtu mmoja au mhimili mmoja unadhibiti utungaji sheria, matumizi ya fedha, na mahakama zote?',
      },
      constitutionalArticle: 'Articles 129, 93, & 159',
    },
    {
      id: 'slide_3',
      stepNumber: 3,
      title: {
        en: 'Two Levels of Devolution: Distinct Yet Interdependent',
        sw: 'Ngazi Mbili za Ugatuzi: Tofauti Lakini Zinazoshirikiana',
      },
      subTitle: {
        en: 'Bringing power, resources, and public services directly to local communities',
        sw: 'Kusogeza mamlaka, rasilimali na huduma za umma karibu na wananchi mashinani',
      },
      keyTakeaways: {
        en: [
          'National Government handles Defense, Foreign Affairs, National Police, Major Highways, and National Economic Policy.',
          '47 County Governments handle County Health Facilities, Agriculture & Livestock, County Roads, Pre-primary (ECD), and Local Markets.',
          'Counties are NOT subservient departments of Nairobi; they have autonomous elected leadership.',
          'Both levels must conduct their relations on the basis of consultation and mutual cooperation (Article 6 & 189).',
        ],
        sw: [
          'Serikali ya Kitaifa inashughulikia Ulinzi, Mambo ya Nje, Polisi, Barabara Kuu, na Sera Kuu za Kiuchumi.',
          'Serikali 47 za Kaunti zinashughulikia Vituo vya Afya na Hospitali za Kaunti, Kilimo, Barabara za Mashinani, Elimu ya Awali (ECD), na Masoko.',
          'Kaunti SI idara za Nairobi; zina uongozi uliochaguliwa na wananchi kwa mamlaka kamili ya kikatiba.',
          'Ngazi zote mbili lazima zifanye kazi kwa mashauriano na ushirikiano bila kuingiliana kinyume cha sheria.',
        ],
      },
      talkingPoints: {
        en: [
          'Use Kwale County examples: Msambweni Referral Hospital vs Coast General Hospital, or Matuga farm extension services vs national security.',
        ],
        sw: [
          'Tumia mifano halisi ya Kaunti ya Kwale: Hospitali ya Rufaa ya Msambweni na zahanati za vijijini dhidi ya ulinzi wa kitaifa.',
        ],
      },
      interactivePrompt: {
        en: 'If a dispensary in our village runs out of medicine, who is constitutionally responsible: the Governor or the President?',
        sw: 'Iwapo zahanati kijijini kwetu itakosa dawa, nani anawajibika kikatiba kisheria: Gavana au Rais?',
      },
      constitutionalArticle: 'Article 6 & Schedule 4',
    },
    {
      id: 'slide_4',
      stepNumber: 4,
      title: {
        en: 'Real-Life Civic Clarity: MP vs MCA',
        sw: 'Ufafanuzi Halisi wa Uraia: Mbunge (MP) dhidi ya Diwani (MCA)',
      },
      subTitle: {
        en: 'Ending community misconceptions on who builds what and who to petition',
        sw: 'Kukomesha mkanganyiko wa wananchi kuhusu nani anajenga nini na nani wa kumdai',
      },
      keyTakeaways: {
        en: [
          'MP (National Assembly) represents Constituency in Parliament, oversees National Government, and oversees NG-CDF (Schools & Police Posts).',
          'MCA represents the Ward in County Assembly, passes county by-laws, and oversees County Governor and Ward development funds.',
          'An MP does NOT repair village feeder roads or run county dispensaries (that is the County Government/Governor).',
          'An MCA does NOT fund secondary school boarding bursaries or command the police.',
        ],
        sw: [
          'Mbunge (Bunge la Kitaifa) anawakilisha Eneo Bunge, anasimamia mawaziri wa kitaifa, na mfuko wa NG-CDF (Madarasa na Vituo vya Polisi).',
          'Diwani (MCA) anawakilisha Wadi katika Bunge la Kaunti, anatunga sheria ndogo za kaunti, na kumsimamia Gavana na miradi ya wadi.',
          'Mbunge HAREKEBISHI barabara ndogo za vijijini wala kusimamia zahanati (hilo ni jukumu la Serikali ya Kaunti/Gavana).',
          'Diwani HASIMAMII polisi wala fedha za elimu ya sekondari ya kitaifa.',
        ],
      },
      talkingPoints: {
        en: [
          'This is the single most common confusion in rural barazas. Citizens often demand roads and dispensaries from MPs while MCAs escape scrutiny.',
        ],
        sw: [
          'Huu ndio mkanganyiko mkubwa zaidi kwenye mabaraza ya mashinani. Wananchi mara nyingi wanadai zahanati kwa wabunge huku madiwani wakisahaulika.',
        ],
      },
      interactivePrompt: {
        en: 'When you have a dispute about classroom construction in a local primary school, whom should you approach first: MP or MCA?',
        sw: 'Ukiwa na malalamiko kuhusu ujenzi wa madarasa ya shule ya msingi kijijini, utamwendea nani kwanza: Mbunge au Diwani?',
      },
      constitutionalArticle: 'Articles 95 & 185',
    },
    {
      id: 'slide_5',
      stepNumber: 5,
      title: {
        en: 'Public Participation: Your Constitutional Right and Duty',
        sw: 'Ushiriki wa Umma: Haki na Wajibu Wako wa Kikatiba',
      },
      subTitle: {
        en: 'How ordinary citizens directly influence budgets, laws, and development projects',
        sw: 'Jinsi wananchi wa kawaida wanavyoamua bajeti, sheria na miradi ya maendeleo',
      },
      keyTakeaways: {
        en: [
          'Public participation is a national value under Article 10. Any law or budget passed without it is unconstitutional.',
          'County budget cycle includes: CIDP (5 years), ADP (Annual), and Budget Estimates (April–June).',
          'Citizens have the right to submit written memorandums, attend town halls, and speak during committee hearings.',
          'Access to Information (Article 35) requires public offices to provide budgets, contracts, and project plans to citizens.',
        ],
        sw: [
          'Ushiriki wa umma ni thamani ya kitaifa chini ya Kifungu 10. Sheria au bajeti yoyote inayopitishwa bila ushiriki wa umma si halali kikatiba.',
          'Mzunguko wa bajeti ya kaunti unajumuisha: CIDP (miaka 5), ADP (kila mwaka), na Makadirio ya Bajeti (Aprili–Juni).',
          'Wananchi wana haki ya kuwasilisha barua za maoni (memorandum), kuhudhuria mikutano ya hadhara, na kuwasilisha malalamiko.',
          'Upatikanaji wa Taarifa (Kifungu 35) unazilazimu ofisi za umma kutoa nakala za bajeti, mikataba na mipango kwa raia.',
        ],
      },
      talkingPoints: {
        en: [
          'Show community members how to use The Samaritan\'s Public Participation Memorandum generator to write structured input for their ward.',
        ],
        sw: [
          'Waonyeshe wananchi jinsi ya kutumia jukwaa la The Samaritan kuandika barua rasmi ya maoni (memorandum) kwa ajili ya wadi yao.',
        ],
      },
      interactivePrompt: {
        en: 'Have you ever attended a county budget public hearing in your ward? What stopped you or what did you contribute?',
        sw: 'Je, umewahi kuhudhuria kikao cha ushiriki wa umma kuhusu bajeti katika wadi yako? Ni nini kilikuzuia au ulichangia nini?',
      },
      constitutionalArticle: 'Article 10 & 35',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape' && onExit) {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onExit]);

  return (
    <div
      className={`w-full transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 text-white overflow-y-auto p-4 sm:p-8' : 'space-y-6'
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold shadow-xs">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 font-serif">
                {t.demo.title}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Baraza Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t.demo.slideCount}: {currentSlideIndex + 1} / {slides.length} • {t.demo.keyboardTip}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleLanguage && (
            <button
              onClick={() => onToggleLanguage(language === 'en' ? 'sw' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-800" />
              <span>{language === 'en' ? 'Badili kwa Kiswahili' : 'Switch to English'}</span>
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
            title="Toggle presentation view"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Presentation View</span>
              </>
            )}
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.demo.exitDeck}</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide Thumbnails / Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              idx === currentSlideIndex
                ? 'bg-blue-900 border-blue-900 text-white shadow-md ring-2 ring-amber-400'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span
                className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                  idx === currentSlideIndex
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                0{slide.stepNumber}
              </span>
              <span
                className={`text-[9px] font-mono ${
                  idx === currentSlideIndex ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {slide.constitutionalArticle}
              </span>
            </div>
            <div
              className={`text-xs font-bold truncate ${
                idx === currentSlideIndex ? 'text-white' : 'text-slate-900'
              }`}
            >
              {slide.title[language]}
            </div>
          </button>
        ))}
      </div>

      {/* Main Slide Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden mb-6 relative">
        <div className="h-1.5 kenya-ribbon" />

        <div className="p-6 sm:p-10">
          {/* Slide Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="inline-block bg-blue-100 text-blue-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {currentSlide.constitutionalArticle}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif leading-tight">
                {currentSlide.title[language]}
              </h1>
              <p className="text-slate-600 text-base sm:text-lg mt-2 font-medium">
                {currentSlide.subTitle[language]}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 shrink-0">
              <span className="text-xs font-bold uppercase">Slide</span>
              <span className="text-2xl font-black">{currentSlide.stepNumber}</span>
            </div>
          </div>

          {/* Key Learning Bullet Points (Large, scannable for projection) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentSlide.keyTakeaways[language].map((point, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3.5 hover:bg-blue-50/40 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Baraza Discussion Prompt (Golden Accent Card) */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-amber-700" />
              <span>{t.demo.barazaPrompt}</span>
            </div>
            <p className="text-amber-950 font-serif text-base sm:text-lg font-bold leading-relaxed">
              "{currentSlide.interactivePrompt[language]}"
            </p>
          </div>

          {/* Presenter Talking Points / Notes */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{t.demo.presenterNotes}</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-5 text-sm text-slate-300 leading-relaxed">
              {currentSlide.talkingPoints[language].map((tp, idx) => (
                <li key={idx}>{tp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Slide Navigation Footer Bar */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300 shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.demo.previousSlide}</span>
          </button>

          <div className="text-xs font-bold text-slate-600">
            {currentSlideIndex + 1} of {slides.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              currentSlideIndex === slides.length - 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-blue-900 text-white hover:bg-blue-950 shadow-xs'
            }`}
          >
            <span>{t.demo.nextSlide}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
