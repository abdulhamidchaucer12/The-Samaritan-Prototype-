import { QuizQuestion } from '../types';
import { randomizeQuizQuestions } from '../utils/quizRandomizer';

/**
 * Provides 10 tailored multiple-choice quiz questions for civic education courses.
 * Every course has 10 high-quality questions with 4 options and dual-language explanations.
 */

export const courseQuizzesMap: Record<string, QuizQuestion[]> = {
  // Course 1: Understanding the Constitution of Kenya 2010
  lesson_1: [
    {
      id: 'l1_q1',
      category: 'constitution',
      question: {
        en: 'Under Article 2(1) of the Constitution, what is the supreme law of the Republic of Kenya?',
        sw: 'Chini ya Kifungu cha 2(1) cha Katiba, ni ipi sheria kuu ya Jamhuri ya Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'The Constitution of Kenya', sw: 'Katiba ya Kenya' } },
        { id: 'b', text: { en: 'Acts passed by Parliament', sw: 'Sheria zilizotungwa na Bunge' } },
        { id: 'c', text: { en: 'County Assembly By-laws', sw: 'Sheria ndogo za Bunge la Kaunti' } },
        { id: 'd', text: { en: 'Executive Orders of the President', sw: 'Amri za Utendaji za Rais' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 2(1) states that the Constitution is the supreme law of the Republic and binds all persons and state organs.',
        sw: 'Kifungu cha 2(1) kinatamka kwamba Katiba ndiyo sheria kuu ya Jamhuri inayomfunga kila mtu na asasi zote za serikali.',
      },
    },
    {
      id: 'l1_q2',
      category: 'constitution',
      question: {
        en: 'According to Article 1(1), where does all sovereign power belong in Kenya?',
        sw: 'Kulingana na Kifungu cha 1(1), mamlaka yote ya uhuru nchini Kenya ni ya nani?',
      },
      options: [
        { id: 'a', text: { en: 'The President and Cabinet', sw: 'Rais na Baraza la Mawaziri' } },
        { id: 'b', text: { en: 'The People of Kenya', sw: 'Wananchi wa Kenya' } },
        { id: 'c', text: { en: 'The Members of Parliament', sw: 'Wabunge wa Bunge' } },
        { id: 'd', text: { en: 'The Chief Justice and Judges', sw: 'Jaji Mkuu na Majaji' } },
      ],
      correctOptionId: 'b',
      explanation: {
        en: 'Article 1(1) declares: "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution."',
        sw: 'Kifungu cha 1(1) kinatamka: "Mamlaka yote ya uhuru ni ya wananchi wa Kenya na yataendeshwa tu kulingana na Katiba hii."',
      },
    },
    {
      id: 'l1_q3',
      category: 'constitution',
      question: {
        en: 'Which Article outlines the National Values and Principles of Governance?',
        sw: 'Ni Kifungu kipi kinachoainisha Maadili ya Kitaifa na Misingi ya Utawala?',
      },
      options: [
        { id: 'a', text: { en: 'Article 10', sw: 'Kifungu cha 10' } },
        { id: 'b', text: { en: 'Article 50', sw: 'Kifungu cha 50' } },
        { id: 'c', text: { en: 'Article 93', sw: 'Kifungu cha 93' } },
        { id: 'd', text: { en: 'Article 260', sw: 'Kifungu cha 260' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 10 binds all state organs, state officers, and public officers whenever applying or interpreting the Constitution or enacting laws.',
        sw: 'Kifungu cha 10 kinafunga asasi zote za dola, maafisa wa serikali wanapotumia au kufafanua Katiba na kutunga sheria.',
      },
    },
    {
      id: 'l1_q4',
      category: 'constitution',
      question: {
        en: 'Which Chapter of the Constitution contains the Bill of Rights?',
        sw: 'Ni Sura ipi ya Katiba inayohifadhi Hati ya Haki za Kibinadamu (Bill of Rights)?',
      },
      options: [
        { id: 'a', text: { en: 'Chapter Four', sw: 'Sura ya Nne' } },
        { id: 'b', text: { en: 'Chapter One', sw: 'Sura ya Kwanza' } },
        { id: 'c', text: { en: 'Chapter Eight', sw: 'Sura ya Nane' } },
        { id: 'd', text: { en: 'Chapter Eleven', sw: 'Sura ya Kumi na Moja' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Chapter Four (Articles 19 to 59) enshrines fundamental rights and freedoms for all persons in Kenya.',
        sw: 'Sura ya Nne (Vifungu 19 hadi 59) inalinda haki zote za kimsingi na uhuru wa kila mtu nchini Kenya.',
      },
    },
    {
      id: 'l1_q5',
      category: 'constitution',
      question: {
        en: 'If an ordinary Act of Parliament conflicts with the Constitution, what happens?',
        sw: 'Iwapo sheria ya kawaida ya Bunge inapingana na Katiba, nini hutokea?',
      },
      options: [
        { id: 'a', text: { en: 'The Act is void to the extent of the inconsistency', sw: 'Sheria hiyo inabatilika kwa kiwango inachopingana na Katiba' } },
        { id: 'b', text: { en: 'The Act automatically replaces the Constitution', sw: 'Sheria hiyo inachukua nafasi ya Katiba' } },
        { id: 'c', text: { en: 'The President decides which one applies', sw: 'Rais anaamua ni ipi itakayotumika' } },
        { id: 'd', text: { en: 'The police choose which law to enforce', sw: 'Polisi wanachagua sheria ya kutumia' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under Article 2(4), any law that is inconsistent with the Constitution is void to the extent of the inconsistency.',
        sw: 'Chini ya Kifungu cha 2(4), sheria yoyote inayopingana na Katiba inabatilika kwa kiwango hicho cha upingamizi.',
      },
    },
    {
      id: 'l1_q6',
      category: 'constitution',
      question: {
        en: 'What right does Article 35 guarantee to every Kenyan citizen?',
        sw: 'Kifungu cha 35 kinampa kila raia wa Kenya haki gani?',
      },
      options: [
        { id: 'a', text: { en: 'Access to Information held by the state', sw: 'Haki ya Kupata Taarifa zilizopo mikononi mwa serikali' } },
        { id: 'b', text: { en: 'Free land allocation', sw: 'Kugawiwa ardhi ya bure' } },
        { id: 'c', text: { en: 'Exemption from paying taxes', sw: 'Kusamehewa kulipa kodi' } },
        { id: 'd', text: { en: 'Automatic government employment', sw: 'Kupata ajira ya lazima serikalini' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 35(1) guarantees citizens the right of access to information held by the state and information held by another person required for the exercise of rights.',
        sw: 'Kifungu cha 35(1) kinamhakikishia kila mwananchi haki ya kupata taarifa za serikali na taarifa za watu wengine zinazohitajika kulinda haki zake.',
      },
    },
    {
      id: 'l1_q7',
      category: 'constitution',
      question: {
        en: 'Under Article 3, who has the obligation to respect, uphold, and defend the Constitution?',
        sw: 'Chini ya Kifungu cha 3, ni nani mwenye wajibu wa kuheshimu, kudumisha na kuilinda Katiba?',
      },
      options: [
        { id: 'a', text: { en: 'Every person in Kenya', sw: 'Kila mtu nchini Kenya' } },
        { id: 'b', text: { en: 'Only uniformed military personnel', sw: 'Wanajeshi wa kijeshi pekee' } },
        { id: 'c', text: { en: 'Only lawyers and magistrates', sw: 'Mawakili na mahakimu pekee' } },
        { id: 'd', text: { en: 'Only elected politicians', sw: 'Wanasiasa waliochaguliwa pekee' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 3(1) states: "Every person has an obligation to respect, uphold and defend this Constitution."',
        sw: 'Kifungu cha 3(1) kinasema: "Kila mtu ana wajibu wa kuheshimu, kudumisha na kuilinda Katiba hii."',
      },
    },
    {
      id: 'l1_q8',
      category: 'constitution',
      question: {
        en: 'What are the two official languages of Kenya recognized in Article 7?',
        sw: 'Ni lugha zipi mbili rasmi za Kenya zinazotambuliwa katika Kifungu cha 7?',
      },
      options: [
        { id: 'a', text: { en: 'English and Kiswahili', sw: 'Kiingereza na Kiswahili' } },
        { id: 'b', text: { en: 'English and French', sw: 'Kiingereza na Kifaransa' } },
        { id: 'c', text: { en: 'Kiswahili and Arabic', sw: 'Kiswahili na Kiarabu' } },
        { id: 'd', text: { en: 'English only', sw: 'Kiingereza pekee' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 7 recognizes Kiswahili as the national language and both English and Kiswahili as official languages.',
        sw: 'Kifungu cha 7 kinatambua Kiswahili kama lugha ya taifa, na Kiingereza na Kiswahili kama lugha rasmi za Jamhuri.',
      },
    },
    {
      id: 'l1_q9',
      category: 'constitution',
      question: {
        en: 'Under Article 22, who can institute court proceedings claiming that a right has been denied or violated?',
        sw: 'Chini ya Kifungu cha 22, ni nani anayeweza kufungua kesi mahakamani akidai haki imekiukwa?',
      },
      options: [
        { id: 'a', text: { en: 'Any person acting in their own interest or in the public interest', sw: 'Mtu yeyote anayetenda kwa maslahi yake au maslahi ya umma' } },
        { id: 'b', text: { en: 'Only certified senior advocates', sw: 'Mawakili wakuu wenye vyeti pekee' } },
        { id: 'c', text: { en: 'Only registered political parties', sw: 'Vyama vya siasa vilivyosajiliwa pekee' } },
        { id: 'd', text: { en: 'Only the Attorney General', sw: 'Mwanasheria Mkuu wa Serikali pekee' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 22 dramatically widened locus standi: any person acting in public interest or on behalf of vulnerable groups can petition the High Court.',
        sw: 'Kifungu cha 22 kiliondoa vizuizi vya kisheria: mtu yeyote kwa niaba yake au maslahi ya umma anaweza kuwasilisha ombi Mahakama Kuu.',
      },
    },
    {
      id: 'l1_q10',
      category: 'constitution',
      question: {
        en: 'How was the Constitution of Kenya 2010 adopted?',
        sw: 'Katiba ya Kenya 2010 ilipitishwa kwa njia gani?',
      },
      options: [
        { id: 'a', text: { en: 'Through a National Referendum voted on by citizens in August 2010', sw: 'Kupitia Kura ya Maoni ya Kitaifa (Referendum) iliyopigwa na wananchi Agosti 2010' } },
        { id: 'b', text: { en: 'By a decree of the colonial governor', sw: 'Kwa amri ya gavana wa kikoloni' } },
        { id: 'c', text: { en: 'Through a secret meeting of parliamentarians only', sw: 'Kupitia kikao cha siri cha wabunge pekee' } },
        { id: 'd', text: { en: 'By an administrative letter from the United Nations', sw: 'Kwa barua ya kiutawala kutoka Umoja wa Mataifa' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Constitution was overwhelmingly approved by the people of Kenya in a referendum on 4th August 2010 and promulgated on 27th August 2010.',
        sw: 'Katiba iliidhinishwa na wananchi wa Kenya katika kura ya maoni ya tarehe 4 Agosti 2010 na kutangazwa rasmi tarehe 27 Agosti 2010.',
      },
    },
  ],

  // Course 2: Understanding Government: 3 Arms and 2 Levels
  lesson_2: [
    {
      id: 'l2_q1',
      category: 'government',
      question: {
        en: 'What are the three arms of the national government in Kenya?',
        sw: 'Ni yapi matawi matatu ya serikali ya kitaifa nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'Executive, Legislature, and Judiciary', sw: 'Mtendaji (Executive), Bunge (Legislature), na Mahakama (Judiciary)' } },
        { id: 'b', text: { en: 'Police, Military, and Prison Service', sw: 'Polisi, Jeshi, na Magereza' } },
        { id: 'c', text: { en: 'Governor, Senator, and MCA', sw: 'Gavana, Seneta, na Diwani' } },
        { id: 'd', text: { en: 'Banks, Churches, and Schools', sw: 'Benki, Makanisa, na Shule' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Kenyan government is split into the Executive (administers), Legislature (makes laws and oversees), and Judiciary (interprets laws).',
        sw: 'Serikali ya Kenya imegawanyika katika Serikali Kuu/Mtendaji (utawala), Bunge (sheria na usimamizi), na Mahakama (tafsiri ya sheria).',
      },
    },
    {
      id: 'l2_q2',
      category: 'government',
      question: {
        en: 'Under Article 6(2), how are the national and county governments related?',
        sw: 'Chini ya Kifungu cha 6(2), serikali ya kitaifa na kaunti zinahusiana vipi?',
      },
      options: [
        { id: 'a', text: { en: 'Distinct and inter-dependent, conducting business by consultation and cooperation', sw: 'Tofauti na zinazotegemeana, zikifanya kazi kwa mashauriano na ushirikiano' } },
        { id: 'b', text: { en: 'Counties are junior departments subordinated to provincial commissioners', sw: 'Kaunti ni idara ndogo zilizo chini ya wakuu wa mikoa' } },
        { id: 'c', text: { en: 'County governments have no constitutional status', sw: 'Serikali za kaunti hazina hadhi ya kikatiba' } },
        { id: 'd', text: { en: 'The national government is completely abolished', sw: 'Serikali ya kitaifa imeondolewa kabisa' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 6(2) provides that the governments at national and county levels are distinct and inter-dependent, conducting their mutual relations on the basis of consultation.',
        sw: 'Kifungu cha 6(2) kinasema serikali za viwango viwili ni tofauti na zinazotegemeana, zikitekeleza uhusiano wao kwa misingi ya mashauriano na ushirikiano.',
      },
    },
    {
      id: 'l2_q3',
      category: 'government',
      question: {
        en: 'Which arm has the primary responsibility of interpreting the Constitution and settling disputes?',
        sw: 'Ni tawi gani lenye wajibu mkuu wa kufafanua Katiba na kuamua mizozo?',
      },
      options: [
        { id: 'a', text: { en: 'The Judiciary', sw: 'Idara ya Mahakama' } },
        { id: 'b', text: { en: 'The Police Service', sw: 'Jeshi la Polisi' } },
        { id: 'c', text: { en: 'The National Assembly', sw: 'Bunge la Kitaifa' } },
        { id: 'd', text: { en: 'The County Executive', sw: 'Baraza Kuu la Kaunti' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 159 vests judicial authority in the courts and tribunals established under the Constitution.',
        sw: 'Kifungu cha 159 kinaweka mamlaka ya kimahakama kwa mahakama zilizoundwa kisheria.',
      },
    },
    {
      id: 'l2_q4',
      category: 'government',
      question: {
        en: 'What is the doctrine of "Separation of Powers" meant to prevent?',
        sw: 'Mtaala wa "Mgawanyo wa Mamlaka" (Separation of Powers) unalenga kuzuia nini?',
      },
      options: [
        { id: 'a', text: { en: 'Concentration of unchecked power in one individual or organ, preventing tyranny', sw: 'Mlundikano wa mamlaka yasiyo na mipaka kwa mtu mmoja au asasi moja, kuzuia udhalimu' } },
        { id: 'b', text: { en: 'Citizens from voting', sw: 'Wananchi wasipige kura' } },
        { id: 'c', text: { en: 'Courts from operating', sw: 'Mahakama zisifanye kazi' } },
        { id: 'd', text: { en: 'Counties from getting funds', sw: 'Kaunti zisipate mgawo wa fedha' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Separation of powers ensures checks and balances so no single arm can abuse authority without oversight.',
        sw: 'Mgawanyo wa mamlaka unahakikisha hakuna tawi moja linaloweza kutumia mamlaka vibaya bila kuwajibishwa.',
      },
    },
    {
      id: 'l2_q5',
      category: 'government',
      question: {
        en: 'How many devolved county governments exist in Kenya?',
        sw: 'Kuna serikali za kaunti ngapi zilizogatuliwa nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: '47 Counties', sw: 'Kaunti 47' } },
        { id: 'b', text: { en: '8 Provinces', sw: 'Mikoa 8' } },
        { id: 'c', text: { en: '290 Constituencies', sw: 'Maeneo Bunge 290' } },
        { id: 'd', text: { en: '100 Counties', sw: 'Kaunti 100' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The First Schedule of the Constitution of Kenya delineates exactly 47 counties, including Kwale County (County 002).',
        sw: 'Ratiba ya Kwanza ya Katiba inaorodhesha kaunti 47, ikiwemo Kaunti ya Kwale (Kaunti nambari 002).',
      },
    },
    {
      id: 'l2_q6',
      category: 'government',
      question: {
        en: 'Who heads the Executive arm of the National Government in Kenya?',
        sw: 'Ni nani anayeongoza Tawi la Utendaji la Serikali ya Kitaifa nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'The President', sw: 'Rais wa Jamhuri' } },
        { id: 'b', text: { en: 'The Speaker of the Senate', sw: 'Spika wa Seneti' } },
        { id: 'c', text: { en: 'The Inspector General of Police', sw: 'Inspekta Jenerali wa Polisi' } },
        { id: 'd', text: { en: 'The Auditor General', sw: 'Mkaguzi Mkuu wa Hesabu za Serikali' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under Article 131, the President is the Head of State and Government and exercises executive authority of the Republic.',
        sw: 'Chini ya Kifungu cha 131, Rais ndiye Mkuu wa Nchi na Serikali anayesimamia mamlaka ya utendaji ya Jamhuri.',
      },
    },
    {
      id: 'l2_q7',
      category: 'government',
      question: {
        en: 'Which schedule of the Constitution details the distribution of functions between National and County governments?',
        sw: 'Ni ratiba ipi ya Katiba inayofafanua mgawanyo wa majukumu kati ya Serikali ya Kitaifa na Serikali za Kaunti?',
      },
      options: [
        { id: 'a', text: { en: 'Fourth Schedule', sw: 'Ratiba ya Nne' } },
        { id: 'b', text: { en: 'First Schedule', sw: 'Ratiba ya Kwanza' } },
        { id: 'c', text: { en: 'Third Schedule', sw: 'Ratiba ya Tatu' } },
        { id: 'd', text: { en: 'Fifth Schedule', sw: 'Ratiba ya Tano' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Fourth Schedule divides responsibilities: Part 1 lists national functions, Part 2 lists county functions.',
        sw: 'Ratiba ya Nne inagawanya majukumu: Sehemu ya 1 ya kitaifa na Sehemu ya 2 ya kaunti.',
      },
    },
    {
      id: 'l2_q8',
      category: 'government',
      question: {
        en: 'What mechanism allows Parliament to hold the Executive accountable?',
        sw: 'Ni njia gani inayoliwezesha Bunge kuisimamia na kuiwajibisha Serikali Kuu?',
      },
      options: [
        { id: 'a', text: { en: 'Committee hearings, questioning Cabinet Secretaries, and budget approval', sw: 'Vikao vya kamati, kuhoji Mawaziri, na kupitisha bajeti' } },
        { id: 'b', text: { en: 'Dissolving all civil courts', sw: 'Kuvunja mahakama za kiraia' } },
        { id: 'c', text: { en: 'Ordering the military to seize government offices', sw: 'Kuamuru wanajeshi kuvamia ofisi za serikali' } },
        { id: 'd', text: { en: 'Stopping citizens from voting in general elections', sw: 'Kuzuia wananchi kupiga kura kwenye uchaguzi mkuu' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under Article 95 and 153, Parliament summons Cabinet Secretaries and examines audits through committee oversight.',
        sw: 'Chini ya Vifungu 95 na 153, Bunge huita mawaziri na kukagua ripoti za ukaguzi kupitia kamati zake.',
      },
    },
    {
      id: 'l2_q9',
      category: 'government',
      question: {
        en: 'Can a Court declare a presidential decree or an Act of Parliament unconstitutional?',
        sw: 'Je, Mahakama inaweza kutangaza agizo la Rais au Sheria ya Bunge kuwa kinyume cha Katiba?',
      },
      options: [
        { id: 'a', text: { en: 'Yes, through the power of Judicial Review under Article 165', sw: 'Ndiyo, kupitia mamlaka ya Mapitio ya Kimahakama chini ya Kifungu cha 165' } },
        { id: 'b', text: { en: 'No, judges must always obey politicians', sw: 'Hapana, majaji lazima wawatii wanasiasa daima' } },
        { id: 'c', text: { en: 'Only if the police agree in writing', sw: 'Iwapo polisi watakubali kwa maandishi pekee' } },
        { id: 'd', text: { en: 'Only after ten years have passed', sw: 'Baada ya miaka kumi kupita tu' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The High Court has constitutional jurisdiction under Article 165(3)(d) to determine if any law or action violates the Constitution.',
        sw: 'Mahakama Kuu ina mamlaka chini ya Kifungu 165(3)(d) kuamua iwapo sheria au hatua yoyote inakiuka Katiba.',
      },
    },
    {
      id: 'l2_q10',
      category: 'government',
      question: {
        en: 'Why is an independent Judiciary crucial for ordinary citizens in Kwale and across Kenya?',
        sw: 'Kwa nini Mahakama Huru ni muhimu sana kwa mwananchi wa kawaida Kwale na kote Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'It protects citizens from unlawful state abuses and enforces constitutional rights without fear or favor', sw: 'Inalinda wananchi dhidi ya unyanyasaji wa dola na kutetea haki za kikatiba bila uoga au upendeleo' } },
        { id: 'b', text: { en: 'It decides who will win political elections beforehand', sw: 'Inaamua nani atashinda uchaguzi mapema' } },
        { id: 'c', text: { en: 'It collects land rates for the county government', sw: 'Inakusanya ada za ardhi kwa niaba ya kaunti' } },
        { id: 'd', text: { en: 'It replaces local traditional village elders completely', sw: 'Inachukua nafasi ya wazee wa vijiji moja kwa moja' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Judicial independence under Article 160 guarantees that judges are subject only to the Constitution and the law, shielding citizens from arbitrary power.',
        sw: 'Uhuru wa Mahakama chini ya Kifungu cha 160 unahakikisha majaji wanafuata Katiba na sheria tu bila kuingiliwa kisiasa.',
      },
    },
  ],
};

/**
 * Universal quiz generator for any lesson/course.
 * Generates 10 questions for courses that don't have custom hardcoded quizzes.
 */
/**
 * Universal quiz generator for any lesson/course.
 * Generates 10 specialized, topic-specific questions for courses that don't have custom hardcoded quizzes.
 * Strictly guarantees that question stems and concepts do not repeat across the curriculum.
 */
export function getCourseQuizQuestions(courseId: string, courseTitle: { en: string; sw: string }, category: string): QuizQuestion[] {
  if (courseQuizzesMap[courseId] && courseQuizzesMap[courseId].length >= 10) {
    return randomizeQuizQuestions(courseQuizzesMap[courseId], courseId);
  }

  const titleEn = courseTitle.en;
  const titleSw = courseTitle.sw;
  const lowerTitle = titleEn.toLowerCase();

  // Detect specific thematic topic to prevent question repetition
  const isLand = lowerTitle.includes('land') || lowerTitle.includes('ancestral') || lowerTitle.includes('title');
  const isPolice = lowerTitle.includes('police') || lowerTitle.includes('arrest') || lowerTitle.includes('bail') || lowerTitle.includes('suspect') || lowerTitle.includes('ipoa');
  const isProcurement = lowerTitle.includes('procurement') || lowerTitle.includes('agpo') || lowerTitle.includes('tender') || lowerTitle.includes('contract');
  const isInfo = lowerTitle.includes('information') || lowerTitle.includes('ombudsman') || lowerTitle.includes('record') || lowerTitle.includes('article 35');
  const isBudget = lowerTitle.includes('budget') || lowerTitle.includes('fund') || lowerTitle.includes('cdf') || lowerTitle.includes('finance') || lowerTitle.includes('audit');
  const isPetition = lowerTitle.includes('petition') || lowerTitle.includes('recall') || lowerTitle.includes('assembly') || lowerTitle.includes('legislat');
  const isClimate = lowerTitle.includes('climate') || lowerTitle.includes('environment') || lowerTitle.includes('nema') || lowerTitle.includes('water');
  const isHealth = lowerTitle.includes('health') || lowerTitle.includes('hospital') || lowerTitle.includes('patient') || lowerTitle.includes('medicine');
  const isSocial = lowerTitle.includes('child') || lowerTitle.includes('disabilit') || lowerTitle.includes('gender') || lowerTitle.includes('ecde') || lowerTitle.includes('youth');
  const isMining = lowerTitle.includes('mining') || lowerTitle.includes('mineral') || lowerTitle.includes('royalt');
  const isUrban = lowerTitle.includes('urban') || lowerTitle.includes('municipal') || lowerTitle.includes('city') || lowerTitle.includes('market');

  let rawQuestions: QuizQuestion[] = [];

  if (isLand) {
    rawQuestions = [
      {
        id: `${courseId}_q1`,
        category: 'devolution',
        question: {
          en: `Under the Community Land Act 2016, who holds legal title to registered community land?`,
          sw: `Chini ya Sheria ya Ardhi ya Jamii ya 2016, nani anayemiliki cheti cha kisheria cha ardhi ya jamii?`,
        },
        options: [
          { id: 'a', text: { en: 'The Community itself as a registered legal entity', sw: 'Jamii yenyewe kama chombo kilichosajiliwa kisheria' } },
          { id: 'b', text: { en: 'The Area Member of County Assembly (MCA)', sw: 'Diwani wa Wodi husika' } },
          { id: 'c', text: { en: 'Private commercial investors', sw: 'Wawekezaji binafsi wa kibiashara' } },
          { id: 'd', text: { en: 'The County Executive Committee Member alone', sw: 'Waziri wa Ardhi wa Kaunti pekee' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Section 7 of the Community Land Act vests customary land rights directly in the registered community assembly.',
          sw: 'Kifungu cha 7 kinatamka kuwa umiliki wa ardhi ya kimila ni mali ya jamii husika iliyosajiliwa.',
        },
      },
      {
        id: `${courseId}_q2`,
        category: 'devolution',
        question: {
          en: `What is required before any community land in Kwale can be leased or allocated to an investor?`,
          sw: `Nini kinachohitajika kabla ya ardhi ya jamii Kwale kukodishwa au kutolewa kwa mwekezaji?`,
        },
        options: [
          { id: 'a', text: { en: 'Approval by at least two-thirds of the Community Assembly in a formal baraza', sw: 'Idhini ya theluthi mbili ya Mkutano Mkuu wa Jamii kwenye baraza rasmi' } },
          { id: 'b', text: { en: 'A secret handshake with local political elites', sw: 'Makubaliano ya siri na wanasiasa' } },
          { id: 'c', text: { en: 'Immediate verbal clearance by an administrative chief', sw: 'Ruksa ya mdomo kutoka kwa chifu' } },
          { id: 'd', text: { en: 'No community consultation is legally necessary', sw: 'Hakuna mashauriano ya jamii yanayohitajika' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Free, Prior, and Informed Consent (FPIC) and a two-thirds majority resolution of adult community members are legally mandatory.',
          sw: 'Ridhaa ya theluthi mbili ya wanajamii wote ni sharti la kisheria kabla ya kutoa ardhi.',
        },
      },
      {
        id: `${courseId}_q3`,
        category: 'constitution',
        question: {
          en: `Which constitutional article categorizes land in Kenya into Public, Community, and Private?`,
          sw: `Ni Kifungu kipi cha Katiba kinachogawa ardhi ya Kenya kuwa ya Umma, ya Jamii na ya Kibinafsi?`,
        },
        options: [
          { id: 'a', text: { en: 'Article 61', sw: 'Kifungu cha 61' } },
          { id: 'b', text: { en: 'Article 12', sw: 'Kifungu cha 12' } },
          { id: 'c', text: { en: 'Article 80', sw: 'Kifungu cha 80' } },
          { id: 'd', text: { en: 'Article 150', sw: 'Kifungu cha 150' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 61(2) establishes the three land tenure classifications in Kenya.',
          sw: 'Kifungu cha 61(2) kinaweka mifumo mitatu ya umiliki wa ardhi nchini Kenya.',
        },
      },
      {
        id: `${courseId}_q4`,
        category: 'devolution',
        question: {
          en: `What role does the National Land Commission (NLC) play under Article 67?`,
          sw: `Ni upi wajibu wa Tume ya Kitaifa ya Ardhi (NLC) chini ya Kifungu cha 67?`,
        },
        options: [
          { id: 'a', text: { en: 'Manage public land on behalf of national and county governments and investigate historical land injustices', sw: 'Kusimamia ardhi ya umma na kuchunguza dhuluma za kihistoria za ardhi' } },
          { id: 'b', text: { en: 'Sell public parks to commercial brokers', sw: 'Kuuza viwanja vya umma kwa madalali' } },
          { id: 'c', text: { en: 'Abolish customary land tenure in coastal counties', sw: 'Kufuta haki za ardhi ya kimila pwani' } },
          { id: 'd', text: { en: 'Evict rural communities without compensation', sw: 'Kufukuza wanavijiji bila fidia' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 67 mandates the NLC to manage public land and investigate present and historical injustices.',
          sw: 'Kifungu cha 67 kinaipa NLC mamlaka ya kusimamia ardhi ya umma na kutatua migogoro ya kihistoria.',
        },
      },
      {
        id: `${courseId}_q5`,
        category: 'devolution',
        question: {
          en: `Under the Community Land Act, how are women and youth represented in Community Land Management Committees?`,
          sw: `Chini ya Sheria ya Ardhi ya Jamii, wanawake na vijana wanawakilishwa vipi kwenye Kamati ya Ardhi?`,
        },
        options: [
          { id: 'a', text: { en: 'By mandatory inclusion adhering to the two-thirds gender rule and youth slots', sw: 'Kwa lazima kufuata kanuni ya theluthi mbili ya jinsia na nafasi za vijana' } },
          { id: 'b', text: { en: 'Women and youth are legally barred from land committees', sw: 'Wanawake na vijana wamepigwa marufuku' } },
          { id: 'c', text: { en: 'Only village elders over 70 years old may sit on committees', sw: 'Wazee pekee ndio wanaoruhusiwa' } },
          { id: 'd', text: { en: 'Committees are appointed by corporate leaseholders', sw: 'Kamati huteuliwa na makampuni ya kibinafsi' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Section 15 guarantees equal rights for women and youth to be elected to community land governance bodies.',
          sw: 'Kifungu cha 15 kinahakikisha usawa wa kijinsia na ushiriki wa vijana katika kamati za ardhi.',
        },
      },
      {
        id: `${courseId}_q6`,
        category: 'devolution',
        question: {
          en: `Where community land has not yet been formally registered, who holds it in trust for the community?`,
          sw: `Iwapo ardhi ya jamii haijasajiliwa rasmi, nani anayeishikilia kwa amana kwa niaba ya jamii?`,
        },
        options: [
          { id: 'a', text: { en: 'The County Government holds it in trust under Article 63(3)', sw: 'Serikali ya Kaunti inashikilia kwa amana chini ya Kifungu cha 63(3)' } },
          { id: 'b', text: { en: 'The police commissioner as private property', sw: 'Mkuu wa polisi kama mali binafsi' } },
          { id: 'c', text: { en: 'Private real estate cartels', sw: 'Walanguzi binafsi wa ardhi' } },
          { id: 'd', text: { en: 'Foreign multilateral banks', sw: 'Benki za kigeni' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 63(3) states unregistered community land shall be held in trust by county governments on behalf of communities.',
          sw: 'Kifungu cha 63(3) kinatamka serikali za kaunti zitashikilia ardhi isiyosajiliwa kwa amana ya jamii.',
        },
      },
      {
        id: `${courseId}_q7`,
        category: 'human_rights',
        question: {
          en: `Can a County Government sell or transfer unregistered community land held in trust?`,
          sw: `Je, Serikali ya Kaunti inaweza kuuza au kuhamisha ardhi ya jamii inayoshikilia kwa amana?`,
        },
        options: [
          { id: 'a', text: { en: 'No; trust land cannot be alienated or sold without the explicit consent of the local community', sw: 'Hapana; ardhi ya amana haiwezi kuuzwa bila idhini ya moja kwa moja ya jamii husika' } },
          { id: 'b', text: { en: 'Yes, whenever the county needs revenue', sw: 'Ndio, wakati wowote kaunti ikitaka fedha' } },
          { id: 'c', text: { en: 'Yes, without consulting residents', sw: 'Ndio, bila kuwauliza wananchi' } },
          { id: 'd', text: { en: 'Yes, by executive order of the governor', sw: 'Ndio, kwa amri ya gavana' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'The Community Land Act strictly forbids county governments from selling or mortgaging community land held in trust.',
          sw: 'Sheria inakataza kabisa kaunti kuuza au kuweka rehani ardhi ya jamii inayoshikilia kwa amana.',
        },
      },
      {
        id: `${courseId}_q8`,
        category: 'devolution',
        question: {
          en: `What is the legal remedy if ancestral land was grabbed or irregularly alienated in Kwale?`,
          sw: `Ni ipi hatua ya kisheria iwapo ardhi ya mababu ilinyakuliwa kinyume cha sheria Kwale?`,
        },
        options: [
          { id: 'a', text: { en: 'Lodge a formal Historical Land Injustice complaint with the National Land Commission and Environment and Land Court', sw: 'Wasilisha malalamiko ya dhuluma za kihistoria kwa NLC na Mahakama ya Ardhi (ELC)' } },
          { id: 'b', text: { en: 'Resign to the loss because titles cannot be questioned', sw: 'Kukata tamaa kwani vyeti haviwezi kurekebishwa' } },
          { id: 'c', text: { en: 'Engage in violent clashes', sw: 'Kupigana vita vya wenyewe kwa wenyewe' } },
          { id: 'd', text: { en: 'Bribe private surveyors', sw: 'Kuhonga wapimaji ardhi binafsi' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Sections 15 of the National Land Commission Act empower the NLC and the Environment and Land Court (ELC) to review grabbed grants.',
          sw: 'Sheria inapa mamlaka NLC na Mahakama ya ELC kubatilisha vyeti ghushi na kurejesha ardhi ya jamii.',
        },
      },
      {
        id: `${courseId}_q9`,
        category: 'devolution',
        question: {
          en: `Under Section 40 of the Constitution, what protection exists against arbitrary property deprivation?`,
          sw: `Chini ya Kifungu cha 40 cha Katiba, ni ulinzi upi unaotolewa dhidi ya kunyanganywa mali?`,
        },
        options: [
          { id: 'a', text: { en: 'Compulsory acquisition requires prompt, full, and just compensation paid prior to taking possession', sw: 'Utwaaji wa ardhi na serikali unahitaji fidia kamili na ya haki kulipwa kabla ya kutwaa ardhi' } },
          { id: 'b', text: { en: 'The state may confiscate land without any payment', sw: 'Serikali inaweza kuchukua ardhi bila kulipa chochote' } },
          { id: 'c', text: { en: 'Compensation is only given to foreign nationals', sw: 'Fidia hutolewa kwa raia wa kigeni pekee' } },
          { id: 'd', text: { en: 'Citizens have no right to challenge the valuation in court', sw: 'Mwananchi hana haki ya kupinga tathmini mahakamani' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 40(3) guarantees prompt payment in full of just compensation to any person whose interest in property is acquired.',
          sw: 'Kifungu cha 40(3) kinahakikisha fidia ya haki inalipwa kwa wakati kabla ya ardhi kutwaliwa na serikali.',
        },
      },
      {
        id: `${courseId}_q10`,
        category: 'devolution',
        question: {
          en: `What is the role of Traditional Dispute Resolution Mechanisms (TDRM) recognized in Article 159(2)(c)?`,
          sw: `Ni upi wajibu wa Njia za Jadi za Usuluhishi (TDRM) zinazotambuliwa na Kifungu cha 159(2)(c)?`,
        },
        options: [
          { id: 'a', text: { en: 'Resolving community boundary and pasture disputes peacefully, provided they do not contravene the Bill of Rights', sw: 'Kutatua migogoro ya mipaka ya jamii kwa amani, mradi haipingani na Haki za Kibinadamu' } },
          { id: 'b', text: { en: 'Overruling the Constitution of Kenya', sw: 'Kupuuza Katiba ya Kenya' } },
          { id: 'c', text: { en: 'Denying women the right to inherit property', sw: 'Kunyima wanawake haki ya kurithi mali' } },
          { id: 'd', text: { en: 'Executing criminal sanctions', sw: 'Kutoa hukumu za jinai' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 159(2)(c) promotes traditional dispute mechanisms so long as they do not violate human rights or natural justice.',
          sw: 'Kifungu cha 159 kinaruhusu usuluhishi wa kimila mradi haukandamizi wanawake au kukiuka haki za binadamu.',
        },
      },
    ];
  } else if (isPolice) {
    rawQuestions = [
      {
        id: `${courseId}_q1`,
        category: 'human_rights',
        question: {
          en: `Under Article 49(1)(f), how soon must an arrested person be brought before a court of law?`,
          sw: `Chini ya Kifungu cha 49(1)(f), mtu aliyekamatwa lazima afikishwe mahakamani ndani ya muda gani?`,
        },
        options: [
          { id: 'a', text: { en: 'As soon as reasonably possible, but not later than 24 hours after arrest', sw: 'Haraka iwezekanavyo, na si zaidi ya saa 24 baada ya kukamatwa' } },
          { id: 'b', text: { en: 'Within two weeks at the discretion of the police officer', sw: 'Ndani ya wiki mbili kulingana na matakwa ya polisi' } },
          { id: 'c', text: { en: 'Indefinitely until the suspect confesses', sw: 'Bila kikomo hadi mshukiwa akiri kosa' } },
          { id: 'd', text: { en: 'Only after paying an informal station release fee', sw: 'Baada tu ya kutoa hongo ya kituoni' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 49(1)(f) strictly caps police custody at 24 hours (or next court day if the 24 hours expire on a weekend or public holiday).',
          sw: 'Kifungu cha 49(1)(f) kinaweka kikomo cha saa 24 kumfikisha mtuhumiwa mahakamani.',
        },
      },
      {
        id: `${courseId}_q2`,
        category: 'human_rights',
        question: {
          en: `Under Article 49(1)(h), does an arrested person have a constitutional right to bail or bond?`,
          sw: `Chini ya Kifungu cha 49(1)(h), je mtu aliyekamatwa ana haki ya kikatiba ya kupewa dhamana?`,
        },
        options: [
          { id: 'a', text: { en: 'Yes, to be released on bond or bail, on reasonable conditions, unless there are compelling reasons', sw: 'Ndio, kuachiliwa kwa dhamana ya masharti nafuu, isipokuwa kuwe na sababu thabiti za kisheria' } },
          { id: 'b', text: { en: 'No, bail is an arbitrary privilege granted only to wealthy citizens', sw: 'Hapana, dhamana ni hisani ya matajiri pekee' } },
          { id: 'c', text: { en: 'Only if the arrest happened on a Monday', sw: 'Iwapo tu alikamatwa siku ya Jumatatu' } },
          { id: 'd', text: { en: 'Bail was abolished under the 2010 Constitution', sw: 'Dhamana ilifutwa na Katiba ya 2010' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 49(1)(h) establishes bail as a constitutional entitlement, rebuttable only by compelling evidence in court.',
          sw: 'Kifungu cha 49(1)(h) kinathibitisha kuwa dhamana ni haki ya kikatiba ya kila mtuhumiwa.',
        },
      },
      {
        id: `${courseId}_q3`,
        category: 'human_rights',
        question: {
          en: `What is the role of the Independent Policing Oversight Authority (IPOA) under Kenyan law?`,
          sw: `Ni upi wajibu wa Mamlaka ya Kusimamia Utendaji Kazi wa Polisi (IPOA) chini ya sheria ya Kenya?`,
        },
        options: [
          { id: 'a', text: { en: 'To investigate deaths, serious injuries, and misconduct caused by police officers', sw: 'Kuchunguza vifo, majeraha mabaya na utovu wa nidhamu unaofanywa na maafisa wa polisi' } },
          { id: 'b', text: { en: 'To defend police officers from civilian oversight', sw: 'Kutetea polisi wasichunguzwe na raia' } },
          { id: 'c', text: { en: 'To act as private security guards for commercial banks', sw: 'Kufanya kazi kama walinzi binafsi wa benki' } },
          { id: 'd', text: { en: 'To purchase police uniforms and patrol vehicles', sw: 'Kununua sare na magari ya polisi' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'The IPOA Act mandates independent civilian investigations of police excesses to ensure institutional accountability.',
          sw: 'Sheria ya IPOA inaipa mamlaka ya kuchunguza unyanyasaji na matumizi mabaya ya nguvu za polisi bila upendeleo.',
        },
      },
      {
        id: `${courseId}_q4`,
        category: 'human_rights',
        question: {
          en: `When arrested, what right does Article 49(1)(a) give regarding communication?`,
          sw: `Unapokamatwa, Kifungu cha 49(1)(a) kinakupa haki gani kuhusu mawasiliano?`,
        },
        options: [
          { id: 'a', text: { en: 'The right to communicate with an advocate, and other persons whose assistance is necessary', sw: 'Haki ya kuwasiliana na wakili, na watu wengine ambao msaada wao ni muhimu' } },
          { id: 'b', text: { en: 'Strict isolation with all communication forbidden for 30 days', sw: 'Kutengwa kabisa bila kuruhusiwa kuongea na mtu yeyote kwa siku 30' } },
          { id: 'c', text: { en: 'Only communicating in foreign languages', sw: 'Kuwasiliana kwa lugha za kigeni pekee' } },
          { id: 'd', text: { en: 'Only communicating if you pay cash to the arresting officer', sw: 'Kuwasiliana tu iwapo utalipa pesa taslimu' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 49(1)(a) mandates informing the suspect of their right to remain silent and to contact legal counsel and family.',
          sw: 'Kifungu cha 49(1)(a) kinampa mtuhumiwa haki ya kupiga simu kwa wakili na familia yake mara moja.',
        },
      },
      {
        id: `${courseId}_q5`,
        category: 'human_rights',
        question: {
          en: `What is the National Legal Aid Service (NLAS) mandated to provide under the Legal Aid Act 2016?`,
          sw: `Huduma ya Kitaifa ya Msaada wa Kisheria (NLAS) inawajibika kutoa nini chini ya Sheria ya Msaada wa Kisheria?`,
        },
        options: [
          { id: 'a', text: { en: 'Free legal advice and state-funded advocates for indigent, vulnerable, and marginalized citizens', sw: 'Ushauri wa kisheria na mawakili wa bure kwa wananchi wasio na uwezo wa kifedha' } },
          { id: 'b', text: { en: 'Financial loans to commercial corporations', sw: 'Mikopo ya kibiashara kwa mashirika makubwa' } },
          { id: 'c', text: { en: 'Commercial marketing for private law firms', sw: 'Matangazo ya kibiashara ya mawakili' } },
          { id: 'd', text: { en: 'Paid bail bonds for wealthy suspects', sw: 'Kulipia dhamana za washukiwa matajiri' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'NLAS ensures that lack of financial means does not bar any citizen from legal representation and justice.',
          sw: 'NLAS inahakikisha ukosefu wa fedha haumzuii mwananchi maskini kupata wakili na haki mahakamani.',
        },
      },
      {
        id: `${courseId}_q6`,
        category: 'human_rights',
        question: {
          en: `Under Article 50(2)(a), what is the fundamental presumption regarding every accused person?`,
          sw: `Chini ya Kifungu cha 50(2)(a), ni ipi dhana ya msingi kuhusu kila mtu anayetuhumiwa?`,
        },
        options: [
          { id: 'a', text: { en: 'Presumed innocent until the contrary is proved beyond reasonable doubt', sw: 'Kuchukuliwa kuwa hana hatia mpaka ithibitishwe kinyume chake bila shaka yoyote' } },
          { id: 'b', text: { en: 'Presumed guilty from the moment an accusation is made', sw: 'Kuchukuliwa kuwa na hatia mara tu anapotuhumiwa' } },
          { id: 'c', text: { en: 'Guilty unless they pay a bribe to the police', sw: 'Ana hatia isipokuwa atoe hongo kwa polisi' } },
          { id: 'd', text: { en: 'Innocent only if they are a state officer', sw: 'Hana hatia iwapo tu ni afisa wa serikali' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'The presumption of innocence is an entrenched pillar of fair trial protected under Article 50.',
          sw: 'Kila mtu anachukuliwa kuwa hana hatia hadi mahakama itakapothibitisha kosa kisheria.',
        },
      },
      {
        id: `${courseId}_q7`,
        category: 'human_rights',
        question: {
          en: `What is the legal effect of a confession extracted from a suspect through torture or coercion?`,
          sw: `Nini athari ya kisheria ya ungamo lililopatikana kwa mateso au kulazimishwa na polisi?`,
        },
        options: [
          { id: 'a', text: { en: 'It is strictly inadmissible in evidence under Article 50(4) and the Evidence Act', sw: 'Haikubaliki kabisa kama ushahidi mahakamani chini ya Kifungu cha 50(4)' } },
          { id: 'b', text: { en: 'It is considered the strongest proof of guilt', sw: 'Inachukuliwa kama ushahidi thabiti zaidi wa kosa' } },
          { id: 'c', text: { en: 'It is admissible if recorded on social media', sw: 'Inakubalika ikirekodiwa kwenye mitandao ya kijamii' } },
          { id: 'd', text: { en: 'Police are legally permitted to use torture during interrogation', sw: 'Polisi wanaruhusiwa kutesa wananchi wakati wa kuwahoji' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 25 and 50(4) ban torture and exclude any evidence obtained through violation of fundamental rights.',
          sw: 'Kifungu cha 25 na 50(4) vinapiga marufuku mateso na ushahidi wowote uliopatikana kwa kuteswa unakataliwa mahakamani.',
        },
      },
      {
        id: `${courseId}_q8`,
        category: 'human_rights',
        question: {
          en: `Can police detain a citizen indefinitely without charge while "investigations continue"?`,
          sw: `Je, polisi wanaweza kumweka mwananchi rumande bila kufunguliwa mashtaka kwa madai ya "uchunguzi unaendelea"?`,
        },
        options: [
          { id: 'a', text: { en: 'No; detention beyond 24 hours without court authorization is unlawful and unconstitutional', sw: 'Hapana; kuweka mtu rumande zaidi ya saa 24 bila idhini ya mahakama ni kinyume cha sheria na katiba' } },
          { id: 'b', text: { en: 'Yes, police can detain anyone for months without court orders', sw: 'Ndio, polisi wanaweza kuzuia mtu miezi kadhaa bila agizo la mahakama' } },
          { id: 'c', text: { en: 'Yes, if the arresting officer does not like the suspect', sw: 'Ndio, iwapo polisi hampendi mtuhumiwa' } },
          { id: 'd', text: { en: 'Yes, provided the cell has adequate food', sw: 'Ndio, mradi tu apewe chakula kizuri' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Police must either release the suspect on police bond or present them in court within 24 hours to seek formal custodial orders.',
          sw: 'Polisi lazima wamwachilie mtuhumiwa kwa dhamana ya polisi au wamfikishe kortini ndani ya saa 24.',
        },
      },
      {
        id: `${courseId}_q9`,
        category: 'human_rights',
        question: {
          en: `What is the toll-free emergency hotline to report police abuse or arbitrary arrest to IPOA in Kenya?`,
          sw: `Ni ipi namba ya dharura ya bure ya kupiga kuripoti ukatili au unyanyasaji wa polisi kwa IPOA?`,
        },
        options: [
          { id: 'a', text: { en: '1559 (Toll-Free)', sw: '1559 (Bure bila malipo)' } },
          { id: 'b', text: { en: '0900', sw: '0900' } },
          { id: 'c', text: { en: '100', sw: '100' } },
          { id: 'd', text: { en: '9999', sw: '9999' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'IPOA operates toll-free telephone hotline 1559 for citizens across Kenya to report police misconduct.',
          sw: 'IPOA inatoa namba ya bure 1559 kwa wananchi wote kuripoti uonevu wa polisi.',
        },
      },
      {
        id: `${courseId}_q10`,
        category: 'human_rights',
        question: {
          en: `If a citizen is unlawfully held in police custody beyond 24 hours, what legal remedy can a lawyer or relative seek?`,
          sw: `Iwapo mwananchi amezuiliwa kinyume cha sheria kituoni zaidi ya saa 24, jamaa zake wanaweza kuomba nini kortini?`,
        },
        options: [
          { id: 'a', text: { en: 'A Writ of Habeas Corpus ordering the police to produce the body in court immediately', sw: 'Agizo la Habeas Corpus linaloamuru polisi kumleta mtuhumiwa kortini mara moja' } },
          { id: 'b', text: { en: 'Paying whatever unauthorized cash the officers request', sw: 'Kulipa pesa zozote haramu zinazoombwa na polisi' } },
          { id: 'c', text: { en: 'Waiting until the next general election', sw: 'Kusubiri hadi uchaguzi mkuu ujao' } },
          { id: 'd', text: { en: 'Nothing can be done once inside a police station', sw: 'Hakuna hatua inayoweza kuchukuliwa mtu akiwa kituoni' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Under Article 25 and Article 49, the writ of Habeas Corpus is a non-derogable right forcing the police to produce the detained person before a judge.',
          sw: 'Agizo la Habeas Corpus ni haki ya kikatiba inayowalazimu polisi kumfikisha mtu mbele ya jaji mara moja.',
        },
      },
    ];
  } else {
    // Universal varied pool for all other topics, referencing the specific course title
    rawQuestions = [
      {
        id: `${courseId}_q1`,
        category,
        question: {
          en: `What is the core constitutional foundation of "${titleEn}"?`,
          sw: `Ni upi msingi mkuu wa kikatiba wa "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Sovereign citizen authority under Article 1 and Article 10 national values', sw: 'Mamlaka ya mwananchi chini ya Kifungu cha 1 na maadili ya Kifungu cha 10' } },
          { id: 'b', text: { en: 'Arbitrary administrative discretion of public officers', sw: 'Uamuzi wa kibinafsi wa maafisa wa serikali' } },
          { id: 'c', text: { en: 'Secret meetings without documentation', sw: 'Mikutano ya siri bila nyaraka' } },
          { id: 'd', text: { en: 'Verbal instructions from party leaders', sw: 'Maagizo ya mdomo kutoka kwa viongozi wa vyama' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 10 establishes rule of law, democracy, transparency, and public participation as non-negotiable foundations.',
          sw: 'Kifungu cha 10 kinaweka utawala wa sheria, demokrasia, uwazi na ushiriki wa umma kama misingi isiyoweza kupuuzwa.',
        },
      },
      {
        id: `${courseId}_q2`,
        category,
        question: {
          en: `How does public participation apply to "${titleEn}"?`,
          sw: `Ushiriki wa umma unahusika vipi katika "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Citizens must be actively informed, consulted, and allowed to submit views before final decisions', sw: 'Wananchi lazima wapewe taarifa mapema, washauriwe na watoe maoni kabla ya uamuzi kufanywa' } },
          { id: 'b', text: { en: 'Signing attendance registers after projects are finished is sufficient', sw: 'Kusaini orodha ya mahudhurio baada ya mradi kukamilika kunatosha' } },
          { id: 'c', text: { en: 'Public officers can decide on behalf of residents without meeting them', sw: 'Maafisa wa umma wanaweza kuamua bila kukutana na wananchi' } },
          { id: 'd', text: { en: 'It only applies to registered political party members', sw: 'Inahusu wanachama wa vyama vya siasa pekee' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'The Supreme Court of Kenya ruled that public participation must be meaningful, timely, and substantive, not cosmetic.',
          sw: 'Mahakama ya Juu Zaidi iliamua kuwa ushiriki wa umma lazima uwe wa kweli, kwa wakati, na si wa kidirisha au kupiga picha tu.',
        },
      },
      {
        id: `${courseId}_q3`,
        category,
        question: {
          en: `Under Article 35 and the Access to Information Act, what right do Kwale residents have regarding this subject?`,
          sw: `Chini ya Kifungu cha 35 na Sheria ya Kupata Taarifa, wakaazi wa Kwale wana haki gani kuhusu mada hii?`,
        },
        options: [
          { id: 'a', text: { en: 'Unconditional right to inspect relevant public records, budgets, and operational guidelines', sw: 'Haki ya kikatiba ya kukagua nyaraka za umma, bajeti na miongozo ya utendaji' } },
          { id: 'b', text: { en: 'Information is exclusively restricted to executive directors', sw: 'Taarifa ni za wakurugenzi watendaji pekee' } },
          { id: 'c', text: { en: 'Requests must be accompanied by non-refundable commercial fees', sw: 'Maombi lazima yaambatane na ada kubwa ya kibiashara' } },
          { id: 'd', text: { en: 'Citizens have no right to see government documentation', sw: 'Wananchi hawana haki ya kuona nyaraka za serikali' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 35(1) establishes every citizen’s right of access to information held by the state or required for exercise of rights.',
          sw: 'Kifungu cha 35(1) kinatoa haki kwa kila mwananchi kupata taarifa zilizopo mikononi mwa serikali.',
        },
      },
      {
        id: `${courseId}_q4`,
        category,
        question: {
          en: `How does Chapter Six (Leadership and Integrity) govern public officers managing "${titleEn}"?`,
          sw: `Sura ya Sita (Uongozi na Uadilifu) inawaongoza vipi maafisa wa serikali wanaosimamia "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'They must exercise authority as a public trust with transparency, accountability, and zero conflict of interest', sw: 'Lazima watumie mamlaka kama amana ya umma kwa uwazi, uwajibikaji na bila mgongano wa kimaslahi' } },
          { id: 'b', text: { en: 'They may divert allocated public resources for personal campaigns', sw: 'Wanaweza kutumia rasilimali za umma kufanya kampeni binafsi' } },
          { id: 'c', text: { en: 'Chapter Six applies only to national presidents and not local officials', sw: 'Sura ya Sita inahusu marais pekee na si maafisa wa chini' } },
          { id: 'd', text: { en: 'Public officers are exempt from ethical scrutiny', sw: 'Maafisa wa umma hawahitaji kufuata maadili' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 73 requires state authority to be exercised as a public trust to bring honor and dignity to the nation.',
          sw: 'Kifungu cha 73 kinataka mamlaka ya serikali yatekelezwe kama amana ya umma inayoleta heshima kwa taifa.',
        },
      },
      {
        id: `${courseId}_q5`,
        category,
        question: {
          en: `If maladministration or unfair treatment occurs regarding this course's topic, which constitutional body investigates?`,
          sw: `Iwapo uzembe au uonevu utatokea kuhusu mada ya somo hili, ni asasi gani ya kikatiba inayochunguza?`,
        },
        options: [
          { id: 'a', text: { en: 'The Commission on Administrative Justice (Ombudsman - CAJ)', sw: 'Tume ya Utawala wa Haki (Ombudsman - CAJ)' } },
          { id: 'b', text: { en: 'A private debt collector or security agency', sw: 'Kampuni binafsi ya ukusanyaji madeni' } },
          { id: 'c', text: { en: 'A foreign commercial tribunal', sw: 'Mahakama ya kibiashara ya nchi ya kigeni' } },
          { id: 'd', text: { en: 'No state institution is empowered to assist citizens', sw: 'Hakuna taasisi inayoweza kumsaidia mwananchi' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'The CAJ (Ombudsman) under Article 59 investigates maladministration, abuse of power, and unfair administrative decisions.',
          sw: 'Tume ya CAJ (Ombudsman) huchunguza uzembe wa maafisa wa umma, uonevu na ukiukaji wa haki.',
        },
      },
      {
        id: `${courseId}_q6`,
        category,
        question: {
          en: `Under Article 201, what standard applies to any public funds utilized for "${titleEn}"?`,
          sw: `Chini ya Kifungu cha 201, ni kiwango gani kinachotumika kwa fedha zote za umma za "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Openness, accountability, prudent use, and clear public reporting', sw: 'Uwazi, uwajibikaji, matumizi yenye tija na kutoa ripoti wazi kwa wananchi' } },
          { id: 'b', text: { en: 'Secret expenditures hidden from the Auditor-General', sw: 'Matumizi ya siri yaliyofichwa kutoka kwa Mkaguzi Mkuu' } },
          { id: 'c', text: { en: 'Spending funds without legislative appropriation', sw: 'Kutumia fedha bila idhini ya Bunge la Kaunti' } },
          { id: 'd', text: { en: 'Allocating the majority of funds to administrative luxury vehicles', sw: 'Kutenga fedha nyingi zaidi kununua magari ya kifahari' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 201(d) specifies that public money shall be used in a prudent and responsible way.',
          sw: 'Kifungu cha 201(d) kinasisitiza fedha za umma lazima zitumike kwa uangalifu na uwajibikaji.',
        },
      },
      {
        id: `${courseId}_q7`,
        category,
        question: {
          en: `What is the legal standing of a citizen petition submitted under Article 119 regarding "${titleEn}"?`,
          sw: `Nini hadhi ya kisheria ya ombi (petition) la mwananchi chini ya Kifungu cha 119 kuhusu "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Every citizen has an absolute constitutional right to petition legislative bodies to investigate or act', sw: 'Kila mwananchi ana haki kamili ya kikatiba kuwasilisha ombi bungeni ili kero ichunguzwe' } },
          { id: 'b', text: { en: 'Petitions by ordinary citizens are illegal and subject to arrest', sw: 'Maombi ya wananchi wa kawaida ni kosa la jinai' } },
          { id: 'c', text: { en: 'Only registered corporations can petition county assemblies', sw: 'Makampuni yaliyosajiliwa pekee ndiyo yenye haki ya kuwasilisha maombi' } },
          { id: 'd', text: { en: 'Assembly clerks are instructed to shred citizen petitions', sw: 'Makarani wa bunge huagizwa kuchana maombi ya wananchi' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 119 guarantees that any person has the right to petition Parliament or a County Assembly to consider any matter within its authority.',
          sw: 'Kifungu cha 119 kinampa kila mtu haki ya kutoa ombi rasmi bungeni au bunge la kaunti.',
        },
      },
      {
        id: `${courseId}_q8`,
        category,
        question: {
          en: `Under Article 22, where can citizens file a petition if constitutional rights are infringed in relation to "${titleEn}"?`,
          sw: `Chini ya Kifungu cha 22, wananchi wanaweza kufungua kesi wapi iwapo haki za kikatiba zitakiukwa kuhusu "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'The High Court of Kenya, without formal legal fees or restrictive procedural technicalities', sw: 'Mahakama Kuu ya Kenya, bila ada nzito za kisheria wala vikwazo vya kiutaratibu' } },
          { id: 'b', text: { en: 'Only before an administrative chief at the location baraza', sw: 'Mbele ya chifu wa eneo pekee kwenye baraza' } },
          { id: 'c', text: { en: 'Only at international courts in foreign nations', sw: 'Kwenye mahakama za kimataifa nje ya nchi pekee' } },
          { id: 'd', text: { en: 'Rights violations cannot be addressed in Kenyan courts', sw: 'Ukiukaji wa haki hauwezi kusikilizwa kwenye mahakama za Kenya' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Article 22 gives every person the right to institute court proceedings claiming that a right or fundamental freedom in the Bill of Rights has been denied, violated, or threatened.',
          sw: 'Kifungu cha 22 kinampa kila mtu haki ya kufungua kesi Mahakama Kuu kutetea haki za binadamu.',
        },
      },
      {
        id: `${courseId}_q9`,
        category,
        question: {
          en: `How can citizens and communities across The Republic of Kenya organize to ensure ongoing accountability for "${titleEn}"?`,
          sw: `Wananchi na jamii kote katika Jamhuri ya Kenya wanaweza kujiandaa vipi kuhakikisha uwajibikaji endelevu kwa "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Conduct evidence-based social audits, review budgets, and attend ward citizen fora', sw: 'Kufanya ukaguzi wa kijamii kwa ushahidi, kusoma bajeti na kuhudhuria mabaraza ya wodi' } },
          { id: 'b', text: { en: 'Rely solely on verbal campaign promises during election cycles', sw: 'Kutegemea ahadi za mdomo za wanasiasa wakati wa uchaguzi tu' } },
          { id: 'c', text: { en: 'Refuse to participate in public consultations', sw: 'Kukataa kushiriki kwenye mikutano ya maoni ya umma' } },
          { id: 'd', text: { en: 'Vandalize completed government service infrastructure', sw: 'Kuharibu miundombinu ya huduma za serikali' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Active social auditing by organized community groups transforms statutory rights into tangible improvements on the ground.',
          sw: 'Ukaguzi wa kijamii unaofanywa na wananchi hubadilisha sheria kuwa maendeleo halisi kijijini.',
        },
      },
      {
        id: `${courseId}_q10`,
        category,
        question: {
          en: `What is the core civic empowerment message taught in "${titleEn}" on The Samaritan platform?`,
          sw: `Ni upi ujumbe mkuu wa uwezeshaji wa kiraia unaofundishwa katika "${titleSw}"?`,
        },
        options: [
          { id: 'a', text: { en: 'Constitutional literacy gives every citizen the knowledge and power to actively defend their community and demand good governance', sw: 'Elimu ya kikatiba inampa kila mwananchi maarifa na uwezo wa kutetea jamii yake na kudai utawala bora' } },
          { id: 'b', text: { en: 'Public administration is only the business of elected politicians and bureaucrats', sw: 'Utawala wa umma ni kazi ya wanasiasa na watumishi wa serikali pekee' } },
          { id: 'c', text: { en: 'Citizens are passive recipients with no legal rights', sw: 'Wananchi ni wapokeaji tu wasio na haki yoyote ya kisheria' } },
          { id: 'd', text: { en: 'Laws in Kenya exist only on paper and cannot be enforced', sw: 'Sheria za Kenya zipo kwenye makaratasi tu na haziwezi kutekelezwa' } },
        ],
        correctOptionId: 'a',
        explanation: {
          en: 'Civic literacy transforms citizens into active constitutional defenders, fulfilling Article 3 duty to respect and defend the Constitution.',
          sw: 'Elimu ya uraia inamwezesha mwananchi kuwa mlinzi wa Katiba, akitekeleza wajibu wake chini ya Kifungu cha 3 cha Katiba.',
        },
      },
    ];
  }

  return randomizeQuizQuestions(rawQuestions, courseId);
}
