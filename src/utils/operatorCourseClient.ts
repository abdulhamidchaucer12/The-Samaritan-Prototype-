import { QuizQuestion, CivicLesson } from '../types';
import { randomizeQuizQuestions } from './quizRandomizer';

export interface OperatorDevelopedCoursePayload {
  title: {
    en: string;
    sw: string;
  };
  summary: {
    en: string;
    sw: string;
  };
  category: string;
  readTimeMinutes: number;
  sections: {
    id: string;
    title: { en: string; sw: string };
    content: { en: string; sw: string };
    constitutionalArticle: string;
    bulletPoints?: { en: string[]; sw: string[] };
  }[];
  keyTerms: {
    term: { en: string; sw: string };
    definition: { en: string; sw: string };
  }[];
  citizenActionTip: {
    en: string;
    sw: string;
  };
  quizzes: QuizQuestion[];
  isDevelopedByOperatorAi: boolean;
  developedAt: string;
}

/**
 * Client-side fallback generator in case backend server is unreachable
 */
function generateClientFallback(
  topic: string,
  category: string = 'constitution',
  summaryEn?: string,
  summarySw?: string
): OperatorDevelopedCoursePayload {
  const cleanTopic = topic.trim();
  const lower = cleanTopic.toLowerCase();
  let primaryArticle = 'Article 10, 185 & 201';
  let topicSw = cleanTopic;

  if (lower.includes('health') || lower.includes('dispensary') || lower.includes('hospital') || lower.includes('afya')) {
    primaryArticle = 'Article 43(1)(a) & County Governments Act';
    topicSw = `Haki ya Huduma za Afya ya Msingi (${cleanTopic})`;
  } else if (lower.includes('land') || lower.includes('ardhi') || lower.includes('title')) {
    primaryArticle = 'Article 60, 63 & 67 (NLC)';
    topicSw = `Haki za Ardhi ya Jamii na Umiliki (${cleanTopic})`;
  } else if (lower.includes('bursary') || lower.includes('school') || lower.includes('elimu')) {
    primaryArticle = 'Article 43(1)(f) & Article 53';
    topicSw = `Utoaji wa Bursary na Haki ya Elimu (${cleanTopic})`;
  } else if (lower.includes('police') || lower.includes('arrest') || lower.includes('bail')) {
    primaryArticle = 'Article 49 & IPOA Act';
    topicSw = `Ulinzi wa Polisi na Haki za Mshukiwa (${cleanTopic})`;
  } else if (lower.includes('budget') || lower.includes('tender') || lower.includes('pesa')) {
    primaryArticle = 'Article 201 & PFMA 2012';
    topicSw = `Usimamizi wa Fedha na Bajeti ya Kaunti (${cleanTopic})`;
  } else {
    topicSw = `Elimu ya Kikatiba: ${cleanTopic}`;
  }

  const sEn =
    summaryEn?.trim() ||
    `Specialized civic education module examining ${cleanTopic} under the Constitution of Kenya 2010. Provides citizens with practical oversight mechanisms, statutory procedures, and constitutional remedies.`;
  const sSw =
    summarySw?.trim() ||
    `Somo maalum la uraia linalochambua ${topicSw} chini ya Katiba ya Kenya 2010. Linampa mwananchi uelewa thabiti wa kisheria na mbinu za kuwawajibisha viongozi wa umma.`;

  const quizzes: QuizQuestion[] = [
    {
      id: `q_dev_${Date.now()}_1`,
      category,
      question: {
        en: `Under the Constitution of Kenya 2010, what is the supreme legal standard governing ${cleanTopic}?`,
        sw: `Chini ya Katiba ya Kenya 2010, ni upi msingi mkuu wa kisheria unaoongoza suala la ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: `Sovereignty of the people, rule of law, and public accountability (${primaryArticle})`,
            sw: `Mamlaka ya wananchi, utawala wa sheria na uwajibikaji kwa umma (${primaryArticle})`,
          },
        },
        {
          id: 'b',
          text: {
            en: 'Informal directives issued at political rallies',
            sw: 'Maagizo yasiyo rasmi yanayotolewa kwenye mikutano ya kisiasa',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Arbitrary decisions made by unauthorized departmental brokers',
            sw: 'Maamuzi ya kiholela ya madalali wasio na mamlaka',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Secret guidelines concealed from citizen inspection',
            sw: 'Mwongozo wa siri uliofichwa usionwe na wananchi',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: `Under ${primaryArticle}, all public administration must observe constitutionalism, openness, and strict statutory adherence.`,
        sw: `Chini ya ${primaryArticle}, usimamizi wote wa umma lazima uzingatie utawala wa sheria na uwazi kwa wananchi.`,
      },
    },
    {
      id: `q_dev_${Date.now()}_2`,
      category,
      question: {
        en: `Which national value under Article 10 is mandatory whenever authorities make decisions on ${cleanTopic}?`,
        sw: `Ni thamani ipi ya kitaifa chini ya Kifungu cha 10 ya lazima wakati viongozi wanapofanya maamuzi kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Public participation, transparency, and social justice',
            sw: 'Ushiriki wa umma, uwazi na haki ya kijamii',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Executive immunity and confidential files',
            sw: 'Kinga ya kiutawala na usiri wa nyaraka',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Unilateral decree without community input',
            sw: 'Maamuzi ya upande mmoja bila maoni ya jamii',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Delegation of sovereign power to private contractors',
            sw: 'Kukabidhi mamlaka ya wananchi kwa makampuni binafsi',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 10(2) strictly mandates public participation and transparency in all public policy decisions.',
        sw: 'Kifungu cha 10(2) kinaamuru ushiriki wa umma na uwazi katika maamuzi yote ya kiserikali.',
      },
    },
    {
      id: `q_dev_${Date.now()}_3`,
      category,
      question: {
        en: `What formal constitutional tool can citizens utilize to challenge non-compliance regarding ${cleanTopic}?`,
        sw: `Ni chombo gani rasmi cha kikatiba wananchi wanaweza kukitumia kupinga ukiukaji wa sheria kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Submitting a formal petition under Article 37 & 119 or seeking judicial review under Article 47',
            sw: 'Kuwasilisha ombi rasmi chini ya Kifungu cha 37 na 119 au kufungua kesi chini ya Kifungu cha 47',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Paying cash facilitation fees to administrative clerks',
            sw: 'Kutoa pesa za hongo kwa makarani wa serikali',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Vandalizing public infrastructure in neighboring wards',
            sw: 'Kuharibu miundombinu ya umma katika wodi jirani',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Abandoning community civic dialogue completely',
            sw: 'Kutelekeza kabisa mazungumzo ya kiraia na jamii',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 119 provides every citizen the right to petition public authorities, protected by fair administrative action under Article 47.',
        sw: 'Kifungu cha 119 kinampa mwananchi haki ya kuwasilisha maombi rasmi serikalini na kupokea majibu ya haki chini ya Kifungu cha 47.',
      },
    },
    {
      id: `q_dev_${Date.now()}_4`,
      category,
      question: {
        en: `Under Article 35 of the Constitution, what is the right of citizens regarding public records on ${cleanTopic}?`,
        sw: `Chini ya Kifungu cha 35 cha Katiba, ni ipi haki ya wananchi kuhusu rekodi za umma za ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Every citizen has the right of access to information held by the State',
            sw: 'Kila mwananchi ana haki ya kupata taarifa zote zinazoshikiliwa na Serikali',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Public files are personal property of elected politicians',
            sw: 'Faili za umma ni mali binafsi ya wanasiasa waliochaguliwa',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Access is restricted only to approved political party members',
            sw: 'Ruksa inatolewa tu kwa wanachama wa vyama maalum vya kisiasa',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Citizens must obtain commercial clearance before seeing public data',
            sw: 'Mwananchi lazima apate kibali cha kibiashara kabla ya kuona taarifa za umma',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 35 guarantees right of access to information held by the state or any agency, enforceable in law.',
        sw: 'Kifungu cha 35 kinathibitisha haki ya kila mwananchi kupata taarifa zinazoshikiliwa na serikali.',
      },
    },
    {
      id: `q_dev_${Date.now()}_5`,
      category,
      question: {
        en: `Which constitutional commission handles complaints regarding administrative injustice or delay in ${cleanTopic}?`,
        sw: `Ni tume ipi ya kikatiba inayoshughulikia malalamiko ya uonevu au ucheleweshaji wa kiutawala kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Commission on Administrative Justice (Ombudsman)',
            sw: 'Tume ya Haki ya Kiutawala (Ombudsman)',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Privatized debt collection agencies',
            sw: 'Mashirika binafsi ya kukusanya madeni',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Political party campaign coordination committees',
            sw: 'Kamati za kuratibu kampeni za vyama vya kisiasa',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Foreign commercial trading companies',
            sw: 'Makampuni ya kigeni ya kibiashara',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Commission on Administrative Justice (Ombudsman) investigates maladministration and official neglect under Article 59(4).',
        sw: 'Ofisi ya Ombudsman (CAJ) inachunguza ucheleweshaji, uzembe na uonevu wa maafisa wa serikali.',
      },
    },
    {
      id: `q_dev_${Date.now()}_6`,
      category,
      question: {
        en: `Under Article 201, what financial principle governs all public allocations for ${cleanTopic}?`,
        sw: `Chini ya Kifungu cha 201, ni kanuni ipi ya kifedha inayoongoza mgao wote wa umma kwa ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Openness, accountability, and prudent public expenditure',
            sw: 'Uwazi, uwajibikaji, na matumizi ya uangalifu na busara',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Complete financial secrecy with no independent audits',
            sw: 'Usiri mkubwa wa kifedha bila kukaguliwa na Mkaguzi Mkuu wa Hesabu',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Direct unvouched cash handouts to loyalists',
            sw: 'Kugawa pesa taslimu bila stakabadhi kwa wafuasi wa kisiasa',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Exemption from statutory public procurement oversight',
            sw: 'Kusamehewa kufuata sheria za ununuzi na ugavi wa umma',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 201(d) dictates that public money shall be used prudently and clear fiscal reports made public.',
        sw: 'Kifungu cha 201(d) kinaamuru matumizi ya busara ya fedha za umma na kutoa ripoti wazi kwa wananchi.',
      },
    },
    {
      id: `q_dev_${Date.now()}_7`,
      category,
      question: {
        en: `What is the role of the County Assembly (MCAs) concerning administrative delivery in ${cleanTopic}?`,
        sw: `Ni upi wajibu wa Bunge la Kaunti (Madiwani) kuhusu utekelezaji wa huduma za ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Legislative scrutiny, budget allocation, and committee oversight (Article 185)',
            sw: 'Kutunga sheria, kupitisha bajeti, na usimamizi wa kamati za bunge (Kifungu cha 185)',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Directly handling procurement tenders and driving construction graders',
            sw: 'Kusimamia zabuni wao wenyewe na kuendesha mitambo ya ujenzi',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Running private accounting ledgers outside the County Treasury',
            sw: 'Kuwa na vitabu vya siri vya hesabu nje ya Hazina ya Kaunti',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Suppressing community inquiries and barring public hearings',
            sw: 'Kuzima maswali ya wananchi na kuzuia vikao vya wazi vya bunge',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 185(3) empowers the County Assembly to exercise oversight over county executive organs, while avoiding direct operational execution.',
        sw: 'Kifungu cha 185(3) kinaweka wazi kuwa Bunge la Kaunti lina wajibu wa kusimamia serikali ya kaunti bila kuingilia utekelezaji wa miradi kibinafsi.',
      },
    },
    {
      id: `q_dev_${Date.now()}_8`,
      category,
      question: {
        en: `How can marginalized groups (women, youth, PWDs) ensure inclusion in programs regarding ${cleanTopic}?`,
        sw: `Makundi yaliyotengwa (wanawake, vijana, walemavu) yanawezaje kuhakikisha yanashirikishwa katika ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Invoking affirmative action rights under Articles 27, 54, 55, and 56 through organized community caucuses',
            sw: 'Kutumia haki za upendeleo maalum chini ya Vifungu vya 27, 54, 55 na 56 kupitia vikundi vya kijiji',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Accepting exclusion as a traditional necessity',
            sw: 'Kukubali kutengwa kama utaratibu wa kitamaduni',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Boycotting ward budget forums and village barazas',
            sw: 'Kususia mikutano ya bajeti ya wodi na baraza za kijiji',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Relying exclusively on unwritten promises from political operatives',
            sw: 'Kutegemea ahadi za maneno pekee bila mikataba rasmi',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Constitution commands affirmative action to include vulnerable and historically marginalized communities.',
        sw: 'Katiba inalazimisha serikali kuchukua hatua za upendeleo chanya kulinda makundi maalum katika jamii.',
      },
    },
    {
      id: `q_dev_${Date.now()}_9`,
      category,
      question: {
        en: `What documentation must an active citizen gather when preparing an accountability query on ${cleanTopic}?`,
        sw: `Ni nyaraka gani mwananchi anapaswa kuziandaa anapoandika barua ya kuhoji ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Official project notices, dates, photographic evidence, and constitutional clauses',
            sw: 'Matangazo rasmi ya miradi, tarehe, picha halisi na vifungu maalum vya Katiba',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Unverified hearsay heard at village marketplaces',
            sw: 'Uvumi usio na uthibitisho unaosemwa masokoni',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Anonymous social media insults',
            sw: 'Matusi yasiyo na jina yanayotumwa mitandaoni',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Emotional accusations without reference to statutes',
            sw: 'Shutuma za hasira zisizotaja sheria yoyote',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Evidence-based civic petitions carry statutory authority and demand formal administrative resolution.',
        sw: 'Nyaraka zenye ushahidi na nukuu za sheria huwa na uzito mkubwa unaowajibisha serikali kutoa majibu.',
      },
    },
    {
      id: `q_dev_${Date.now()}_10`,
      category,
      question: {
        en: `What is the paramount constitutional principle regarding citizen power over ${cleanTopic}?`,
        sw: `Ni ipi kanuni kuu ya kikatiba kuhusu nguvu ya mwananchi juu ya ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'All sovereign power belongs to the people of Kenya; continuous vigilance protects community welfare (Article 1)',
            sw: 'Mamlaka yote ni ya wananchi wa Kenya; ufuatiliaji wa daima unalinda maendeleo ya jamii (Kifungu cha 1)',
          },
        },
        {
          id: 'b',
          text: {
            en: 'State officers hold unchecked authority over citizens',
            sw: 'Viongozi wa serikali wana mamlaka yasiyo na kikomo juu ya wananchi',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Taxpayers have no legal right to scrutinize public spending',
            sw: 'Walipakodi hawana haki ya kuhoji matumizi ya fedha za umma',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Elections are the only avenue for citizen civic expression',
            sw: 'Uchaguzi ndiyo njia pekee ya mwananchi kutoa maoni yake',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 1 establishes that all sovereign power belongs to the people of Kenya and is exercised on trust by state officers.',
        sw: 'Kifungu cha 1 kinathibitisha kuwa mamlaka yote ya nchi ni ya wananchi, na viongozi ni watumishi wao tu.',
      },
    },
  ];

  return {
    title: {
      en: cleanTopic,
      sw: topicSw,
    },
    summary: {
      en: sEn,
      sw: sSw,
    },
    category,
    readTimeMinutes: 8,
    sections: [
      {
        id: 'sec_1',
        title: {
          en: `Foundational Rights & Statutory Mandate (${primaryArticle})`,
          sw: `Misingi ya Kisheria na Haki za Mwananchi (${primaryArticle})`,
        },
        content: {
          en: `Under the Constitution of Kenya 2010, ${cleanTopic} is governed by the principles of democratic accountability and human dignity. Public entities must maintain transparent records and conduct open public forums.`,
          sw: `Chini ya Katiba ya Kenya 2010, ${topicSw} inaongozwa na misingi ya uwajibikaji na heshima ya utu. Asasi zote za umma lazima ziweke wazi taarifa zao kwa wananchi.`,
        },
        constitutionalArticle: primaryArticle,
        bulletPoints: {
          en: [
            'Administrative fairness and prompt service under Article 47.',
            'Compulsory citizen participation in decision making under Article 10.',
            'Open records and public reporting under Article 35.',
          ],
          sw: [
            'Haki ya kutendewa kwa usawa na huduma za haraka chini ya Kifungu cha 47.',
            'Ushiriki wa lazima wa wananchi katika maamuzi chini ya Kifungu cha 10.',
            'Uwazi wa nyaraka na ripoti za umma chini ya Kifungu cha 35.',
          ],
        },
      },
      {
        id: 'sec_2',
        title: {
          en: 'Citizen Enforcement & Administrative Redress',
          sw: 'Utekelezaji wa Mwananchi na Hatua za Kudai Haki',
        },
        content: {
          en: `When procedures are neglected, citizens are empowered to draft formal petitions to the County Assembly Clerk, report irregularities to the Ombudsman (CAJ), or petition the High Court.`,
          sw: `Mambo yanapoenda kinyume na sheria, wananchi wana uwezo wa kuandika malalamiko kwa Karani wa Bunge la Kaunti, kuripoti kwa CAJ (Ombudsman) au kufungua kesi Mahakama Kuu.`,
        },
        constitutionalArticle: 'Article 119 & 258',
        bulletPoints: {
          en: [
            'Document dates, names of officers, and specific grievances.',
            'Reference constitutional clauses in formal correspondence.',
            'Form neighborhood monitoring groups for collective action.',
          ],
          sw: [
            'Hifadhi kumbukumbu za tarehe, majina ya maafisa na kasoro zote.',
            'Taja vifungu vya Katiba katika barua zote za kiofisi.',
            'Unda kamati za kijiji ili kusimama pamoja kama jamii moja.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Sovereignty', sw: 'Mamlaka ya Wananchi' },
        definition: {
          en: 'The supreme power of citizens established under Article 1.',
          sw: 'Nguvu kuu ya wananchi iliyowekwa chini ya Kifungu cha 1.',
        },
      },
      {
        term: { en: 'Social Accountability', sw: 'Uwajibikaji wa Kijamii' },
        definition: {
          en: 'Citizen-led actions that hold public officers accountable for resources.',
          sw: 'Hatua za wananchi kuwawajibisha viongozi kwa rasilimali za umma.',
        },
      },
    ],
    citizenActionTip: {
      en: `Visit your local Ward Administrator office to submit a formal citizen memorandum regarding ${cleanTopic}.`,
      sw: `Tembelea ofisi ya Msimamizi wa Wadi yako kuwasilisha maoni rasmi kuhusu ${topicSw}.`,
    },
    quizzes: randomizeQuizQuestions(quizzes),
    isDevelopedByOperatorAi: true,
    developedAt: new Date().toISOString(),
  };
}

/**
 * Dispatches to backend endpoint or falls back smoothly if offline
 */
export async function requestOperatorCourseDevelopment(
  topic: string,
  category: string = 'constitution',
  summaryEn?: string,
  summarySw?: string,
  userLanguage: 'en' | 'sw' = 'en'
): Promise<OperatorDevelopedCoursePayload> {
  try {
    const response = await fetch('/api/operator-develop-course', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        category,
        summaryEn,
        summarySw,
        userLanguage,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.developedCourse) {
        return {
          ...data.developedCourse,
          quizzes: randomizeQuizQuestions(data.developedCourse.quizzes || []),
        };
      }
    }
  } catch (err) {
    console.warn('[Client] Backend Operator AI call failed, using client fallback:', err);
  }

  // Robust fallback
  return generateClientFallback(topic, category, summaryEn, summarySw);
}
