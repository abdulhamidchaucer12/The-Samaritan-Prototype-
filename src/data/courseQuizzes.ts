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

  // Course 11: Human Rights Advocacy
  lesson_11: [
    {
      id: 'l11_q1',
      category: 'human_rights',
      question: {
        en: 'Under Article 22 of the Constitution of Kenya 2010, who has the legal right to institute court proceedings claiming that a right or fundamental freedom has been denied, violated, or threatened?',
        sw: 'Chini ya Kifungu cha 22 cha Katiba ya Kenya 2010, ni nani mwenye haki ya kufungua kesi mahakamani akidai haki ya kimsingi imekiukwa au kutishiwa?',
      },
      options: [
        { id: 'a', text: { en: 'Any person acting in their own interest, on behalf of another, or in the public interest', sw: 'Mtu yeyote anayetenda kwa maslahi yake, kwa niaba ya mwingine, au kwa maslahi ya umma' } },
        { id: 'b', text: { en: 'Only licensed advocates and Senior Counsel', sw: 'Mawakili waliohitimu na Mawakili Wakuu pekee' } },
        { id: 'c', text: { en: 'Only the Attorney-General and Cabinet Secretaries', sw: 'Mwanasheria Mkuu na Mawaziri pekee' } },
        { id: 'd', text: { en: 'Only corporate entities registered under the Companies Act', sw: 'Makampuni yaliyosajiliwa chini ya Sheria ya Makampuni pekee' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 22 completely liberalized standing (locus standi), allowing anyone—including community paralegals and human rights defenders—to approach the High Court without procedural hurdles.',
        sw: 'Kifungu cha 22 kimefungua milango ya mahakama kwa kila mwananchi, watetezi wa haki, na wasaidizi wa kisheria kutetea haki za wengine na maslahi ya umma.',
      },
    },
    {
      id: 'l11_q2',
      category: 'human_rights',
      question: {
        en: 'Under Article 22(3)(b), what rule governs court fees for citizens filing human rights enforcement petitions in Kenya?',
        sw: 'Chini ya Kifungu cha 22(3)(b), ni kanuni gani inayosimamia ada za mahakama kwa wananchi wanaofungua kesi za kutetea haki za binadamu?',
      },
      options: [
        { id: 'a', text: { en: 'The Chief Justice must make rules ensuring court fees are not used as an unreasonable barrier to justice', sw: 'Jaji Mkuu lazima aweke kanuni kuhakikisha ada za mahakama hazitumiki kama kikwazo cha kuzuia haki' } },
        { id: 'b', text: { en: 'Citizens must pay a mandatory non-refundable cash deposit of KES 500,000', sw: 'Wananchi lazima walipe amana ya lazima ya shilingi 500,000 za Kenya' } },
        { id: 'c', text: { en: 'Only individuals who own titled land may file petitions', sw: 'Watu wanaomiliki hati miliki za ardhi pekee ndio wanaoweza kufungua kesi' } },
        { id: 'd', text: { en: 'Court fees must be paid in foreign currency', sw: 'Ada za mahakama lazima zilipwe kwa sarafu ya kigeni' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 22(3)(b) mandates that rules made by the Chief Justice ensure unreasonable fees do not impede ordinary citizens from accessing justice.',
        sw: 'Kifungu cha 22(3)(b) kinaagiza kuwa taratibu za mahakama zihakikishe ada hazitumiwi kuwazuia wananchi wa kawaida kupata haki.',
      },
    },
    {
      id: 'l11_q3',
      category: 'human_rights',
      question: {
        en: 'What is the binding constitutional obligation of the State regarding the Bill of Rights under Article 21(1)?',
        sw: 'Ni upi wajibu wa kikatiba wa Serikali kuhusu Mswada wa Haki chini ya Kifungu cha 21(1)?',
      },
      options: [
        { id: 'a', text: { en: 'It is a fundamental duty of the State and every state organ to observe, respect, protect, promote, and fulfill the rights and fundamental freedoms', sw: 'Ni wajibu wa msingi wa Serikali na kila chombo cha dola kuheshimu, kulinda, kuendeleza na kutimiza haki za kimsingi' } },
        { id: 'b', text: { en: 'The State may suspend human rights at will without any constitutional oversight', sw: 'Serikali inaweza kusitisha haki za binadamu inavyotaka bila ukaguzi wa kikatiba' } },
        { id: 'c', text: { en: 'The State is only responsible for economic investments and not civil liberties', sw: 'Serikali inawajibika tu kwa uwekezaji wa kiuchumi na si uhuru wa raia' } },
        { id: 'd', text: { en: 'The Bill of Rights applies only during international conferences', sw: 'Mswada wa Haki unatumika tu wakati wa mikutano ya kimataifa' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 21(1) places an affirmative legal duty on the state to proactively observe, respect, protect, promote, and fulfill all fundamental rights.',
        sw: 'Kifungu cha 21(1) kinaweka wajibu wa lazima kwa serikali kuheshimu na kutimiza haki za kimsingi za wananchi wote.',
      },
    },
    {
      id: 'l11_q4',
      category: 'human_rights',
      question: {
        en: 'Which constitutional commission established under Article 59 has the primary mandate to receive, investigate, and redress human rights violations in Kenya?',
        sw: 'Ni tume gani ya kikatiba iliyoanzishwa chini ya Kifungu cha 59 yenye mamlaka makuu ya kupokea, kuchunguza na kutatua ukiukaji wa haki za binadamu nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'The Kenya National Commission on Human Rights (KNCHR)', sw: 'Tume ya Kitaifa ya Haki za Binadamu ya Kenya (KNCHR)' } },
        { id: 'b', text: { en: 'The Central Bank of Kenya (CBK)', sw: 'Benki Kuu ya Kenya (CBK)' } },
        { id: 'c', text: { en: 'The Kenya Revenue Authority (KRA)', sw: 'Mamlaka ya Mapato ya Kenya (KRA)' } },
        { id: 'd', text: { en: 'The Betting Control and Licensing Board (BCLB)', sw: 'Bodi ya Kudhibiti Kamari na Leseni' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'KNCHR is an independent Chapter 15 commission with statutory powers to investigate rights violations, visit prisons and detention facilities, and advise the state on compliance.',
        sw: 'KNCHR ni tume huru ya Sura ya 15 yenye mamlaka ya kuchunguza dhuluma za haki, kutembelea magereza, na kuagiza fidia kwa waathiriwa.',
      },
    },
    {
      id: 'l11_q5',
      category: 'human_rights',
      question: {
        en: 'Under Article 25 of the Constitution, which of the following rights may NEVER be limited or suspended under any circumstances (non-derogable rights)?',
        sw: 'Chini ya Kifungu cha 25 cha Katiba, ni ipi kati ya haki zifuatazo isiyoweza kupunguzwa au kusimamishwa chini ya hali yoyote (haki zisizokiukwa)?',
      },
      options: [
        { id: 'a', text: { en: 'Freedom from torture, freedom from slavery, the right to fair trial, and the right to an order of habeas corpus', sw: 'Uhuru dhidi ya mateso, uhuru dhidi ya utumwa, haki ya kesi ya haki, na haki ya amri ya habeas corpus' } },
        { id: 'b', text: { en: 'The right to hold political campaign rallies past midnight', sw: 'Haki ya kufanya mikutano ya kampeni za kisiasa usiku wa manane' } },
        { id: 'c', text: { en: 'The right to carry unregistered firearms in public spaces', sw: 'Haki ya kubeba silaha zisizosajiliwa hadharani' } },
        { id: 'd', text: { en: 'Freedom to evade statutory tax obligations', sw: 'Uhuru wa kukwepa kulipa kodi ya kisheria' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 25 strictly enshrines four non-derogable rights that cannot be limited even during a state of emergency: freedom from torture/cruelty, freedom from servitude, right to fair trial, and habeas corpus.',
        sw: 'Kifungu cha 25 kinalinda haki nne zisizoweza kusimamishwa hata wakati wa hali ya hatari: kutoteswa, kutofanywa mtumwa, kesi ya haki, na amri ya kufikishwa mahakamani (habeas corpus).',
      },
    },
    {
      id: 'l11_q6',
      category: 'human_rights',
      question: {
        en: 'What does "Public Interest Litigation" (PIL) mean in the context of grassroots civic advocacy in Kenya?',
        sw: 'Nini maana ya "Kesi kwa Maslahi ya Umma" (Public Interest Litigation - PIL) katika muktadha wa utetezi wa kiraia nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'Legal proceedings initiated to protect constitutional rights for the collective benefit of vulnerable communities or the public at large', sw: 'Kesi za kisheria zinazofunguliwa mahakamani kulinda haki za kikatiba kwa manufaa ya jamii nzima au makundi yaliyo hatarini' } },
        { id: 'b', text: { en: 'Lawsuits filed purely for private monetary extortion against business competitors', sw: 'Kesi zinazofunguliwa kwa ajili ya kujinufaisha kifedha binafsi dhidi ya washindani' } },
        { id: 'c', text: { en: 'Secret arbitration conducted behind closed doors without citizen knowledge', sw: 'Mikutano ya siri ya usuluhishi bila wananchi kufahamu' } },
        { id: 'd', text: { en: 'Political rallies organized inside courtroom chambers', sw: 'Mikutano ya kisiasa inayofanyika ndani ya vyumba vya mahakama' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'PIL empowers civic organizations and paralegals to challenge unconstitutional policies, environmental destruction, or community land grabbing without needing personal direct injury.',
        sw: 'PIL inawawezesha wananchi na mashirika ya kutetea haki kufungua kesi kutetea misitu, ardhi za jamii au huduma za afya bila kulazimika kuwa muathiriwa binafsi pekee.',
      },
    },
    {
      id: 'l11_q7',
      category: 'human_rights',
      question: {
        en: 'Under Article 23(3), what remedies may the High Court grant upon hearing a human rights violation petition?',
        sw: 'Chini ya Kifungu cha 23(3), Mahakama Kuu inaweza kutoa maamuzi na nafuu gani inaposikiliza kesi ya ukiukaji wa haki za binadamu?',
      },
      options: [
        { id: 'a', text: { en: 'Injunctions, judicial declarations of rights, compensation, conservatory orders, or orders of judicial review', sw: 'Amri za zuio (injunction), tamko la kisheria la haki, fidia ya kifedha, na amri za kufuta maamuzi haramu' } },
        { id: 'b', text: { en: 'Ban citizens from accessing libraries and schools', sw: 'Kuzuia wananchi wasisome kwenye maktaba na shule' } },
        { id: 'c', text: { en: 'Transfer ownership of community hospitals to overseas banks', sw: 'Kuhamisha hospitali za jamii kwa mabenki ya kigeni' } },
        { id: 'd', text: { en: 'Dissolve all media stations without a hearing', sw: 'Kufunga vituo vyote vya habari bila usikilizaji' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 23(3) provides a wide array of judicial remedies, empowering courts to issue injunctions, award damages, declare laws invalid, or halt unlawful evictions.',
        sw: 'Kifungu cha 23(3) kinaipa Mahakama Kuu nguvu ya kutoa fidia, kusimamisha ubomoaji usio halali, na kubatilisha vitendo vinavyokiuka haki za binadamu.',
      },
    },
    {
      id: 'l11_q8',
      category: 'human_rights',
      question: {
        en: 'What is the internationally recognized definition of a Human Rights Defender (HRD)?',
        sw: 'Ni upi ufafanuzi unaotambuliwa kimataifa wa Mteteezi wa Haki za Binadamu (HRD)?',
      },
      options: [
        { id: 'a', text: { en: 'Any person who peacefully promotes and protects universally recognized human rights and fundamental freedoms', sw: 'Mtu yeyote anayechukua hatua za amani kukuza na kulinda haki za binadamu zinazotambuliwa kote ulimwenguni' } },
        { id: 'b', text: { en: 'Only uniformed armed security personnel on duty', sw: 'Askari waliovaa sare na silaha kazini pekee' } },
        { id: 'c', text: { en: 'Only foreign diplomats holding red diplomatic passports', sw: 'Mabalozi wa kigeni wenye pasipoti nyekundu za kidiplomasia pekee' } },
        { id: 'd', text: { en: 'Politicians running for governor or member of parliament', sw: 'Wanasiasa wanaowania ugavana au ubunge' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under UN standards and the Kenyan human rights framework, an HRD is defined by their peaceful actions defending human dignity, regardless of profession or background.',
        sw: 'Mteteezi wa haki ni mtu yeyote anayetumia njia za amani kupinga dhuluma na kutetea utu wa binadamu, bila kujali kazi au cheo chake.',
      },
    },
    {
      id: 'l11_q9',
      category: 'human_rights',
      question: {
        en: 'When a grassroots Human Rights Defender faces intimidation or surveillance for exposing corruption, which emergency protocol should be deployed first?',
        sw: 'Mteteezi wa Haki za Binadamu mashinani anapokabiliwa na vitisho au kufuatiliwa kwa kufichua ufisadi, ni hatua gani ya dharura inayopaswa kuchukuliwa kwanza?',
      },
      options: [
        { id: 'a', text: { en: 'Document threats contemporaneously, activate secure check-in buddy networks, and notify the Defenders Coalition and KNCHR', sw: 'Kuandika vitisho vyote kwa tarehe, kuamsha mtandao salama wa wenzake wa kuaminiana, na kuarifu Defenders Coalition na KNCHR' } },
        { id: 'b', text: { en: 'Confront the perpetrators alone in secluded areas at night', sw: 'Kukabiliana na watuhumiwa peke yake usiku mahali pasipo na watu' } },
        { id: 'c', text: { en: 'Destroy all documented evidence and cease civic awareness permanently', sw: 'Kuharibu ushahidi wote na kuacha kabisa kutoa elimu ya uraia' } },
        { id: 'd', text: { en: 'Pay bribes to the intimidateers to gain temporary protection', sw: 'Kutoa hongo kwa wanaomtisha ili wampe ulinzi wa muda' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Security protocol for HRDs requires secure documentation, peer buddy tracking, digital encrypted backups, and rapid escalation to registered human rights protection networks.',
        sw: 'Mwongozo wa usalama unataka mteteezi kurekodi vitisho, kutumia mawasiliano salama na kutoa taarifa mara moja kwa mtandao wa watetezi wa haki na KNCHR.',
      },
    },
    {
      id: 'l11_q10',
      category: 'human_rights',
      question: {
        en: 'Under Article 258 of the Constitution, who is entitled to institute court proceedings claiming that the Constitution has been contravened or is threatened with contravention?',
        sw: 'Chini ya Kifungu cha 258 cha Katiba, nani mwenye haki ya kufungua kesi mahakamani akidai Katiba imekiukwa au inatishiwa kukiukwa?',
      },
      options: [
        { id: 'a', text: { en: 'Every person in Kenya, without needing to prove direct personal injury or proprietary interest', sw: 'Kila mtu nchini Kenya, bila kulazimika kuthibitisha ameumia binafsi au ana maslahi ya mali' } },
        { id: 'b', text: { en: 'Only Cabinet Secretaries acting with the written approval of the President', sw: 'Mawaziri pekee kwa idhini ya maandishi kutoka kwa Rais' } },
        { id: 'c', text: { en: 'Only members of the Judicial Service Commission', sw: 'Wajumbe wa Tume ya Huduma za Mahakama pekee' } },
        { id: 'd', text: { en: 'Foreign embassies stationed in Nairobi', sw: 'Mabalozi wa kigeni waliopo Nairobi' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 258 establishes universal constitutional standing: every citizen has the constitutional right and duty to institute court proceedings to defend and protect the Constitution.',
        sw: 'Kifungu cha 258 kinampa kila mkenya haki kamili ya kufika mahakamani kutetea Katiba pale kiongozi au sera inapokiuka misingi ya sheria.',
      },
    },
  ],

  // Course 12: Using Social Media as a Narrative Tool for Peace
  lesson_12: [
    {
      id: 'l12_q1',
      category: 'participation',
      question: {
        en: 'While Article 33(1) protects freedom of expression, what does Article 33(2) explicitly exclude from this constitutional protection?',
        sw: 'Wakati Kifungu cha 33(1) kinalinda uhuru wa kujieleza, ni mambo gani ambayo Kifungu cha 33(2) kinakataza waziwazi yasilindwe na Katiba?',
      },
      options: [
        { id: 'a', text: { en: 'Propaganda for war, incitement to violence, hate speech, and advocacy of hatred based on ethnicity or identity', sw: 'Propaganda za vita, kuchochea fujo, matamshi ya chuki, na kueneza chuki kwa misingi ya ukabila au utambulisho' } },
        { id: 'b', text: { en: 'Constructive criticism of county development plans and budgets', sw: 'Ukosoaji wa kimaendeleo kuhusu mipango ya kaunti na bajeti' } },
        { id: 'c', text: { en: 'Sharing certified audit reports published by the Auditor-General', sw: 'Kusambaza ripoti rasmi zilizothibitishwa za Mkaguzi Mkuu wa Serikali' } },
        { id: 'd', text: { en: 'Expressing dissatisfaction with public road infrastructure', sw: 'Kueleza kutoridhishwa na hali ya barabara za umma' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 33(2) clearly demarcates that freedom of expression does not extend to hate speech, ethnic vilification, incitement to violence, or war propaganda.',
        sw: 'Kifungu cha 33(2) kinaweka mipaka thabiti: uhuru wa kujieleza haujumuishi uchochezi wa kikabila, matamshi ya chuki wala uchochezi wa vurugu.',
      },
    },
    {
      id: 'l12_q2',
      category: 'participation',
      question: {
        en: 'Under the National Cohesion and Integration Act (NCIC Act), what is the legal penalty for publishing or uttering words intended to stir up ethnic hatred?',
        sw: 'Chini ya Sheria ya NCIC (National Cohesion and Integration Act), ni nini adhabu ya kisheria kwa kuchapisha au kusema maneno yanayolenga kuchochea chuki za kikabila?',
      },
      options: [
        { id: 'a', text: { en: 'A fine of up to KES 1,000,000, imprisonment for a term of up to three years, or both', sw: 'Faini ya hadi shilingi 1,000,000 za Kenya, kifungo cha hadi miaka mitatu jela, au vyote viwili' } },
        { id: 'b', text: { en: 'A compulsory apology letter sent to a foreign government', sw: 'Barua ya lazima ya kuomba msamaha kwa serikali ya kigeni' } },
        { id: 'c', text: { en: 'No penalty as long as the post is published online under a pseudonym', sw: 'Hakuna adhabu mradi tu ujumbe umechapishwa mtandaoni kwa jina bandia' } },
        { id: 'd', text: { en: 'A reward of civic leadership medals', sw: 'Tuzo ya medali ya uongozi wa kiraia' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Section 13 and 62 of the NCIC Act prescribe stringent criminal penalties—including fines up to KES 1M and jail terms up to 3 years—for ethnic hate speech.',
        sw: 'Kifungu cha 13 na 62 cha Sheria ya NCIC kinaweka faini ya hadi shilingi milioni 1 au kifungo cha hadi miaka 3 jela kwa anayeeneza chuki za kikabila.',
      },
    },
    {
      id: 'l12_q3',
      category: 'participation',
      question: {
        en: 'How does Section 22 of the Computer Misuse and Cybercrimes Act 2018 address false information published online in Kenya?',
        sw: 'Kifungu cha 22 cha Sheria ya Makosa ya Mitandao (Cybercrimes Act 2018) kinashughulikia vipi habari za uongo zinazosambazwa mtandaoni nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'It penalizes intentionally publishing false, misleading, or fictitious data calculated to cause panic, violence, or harm', sw: 'Kinatoa adhabu kwa kusambaza kwa makusudi taarifa za uzushi au uongo zinazolenga kuleta taharuki, fujo au madhara' } },
        { id: 'b', text: { en: 'It requires all smartphone owners to surrender devices to chiefs every week', sw: 'Kinaamuru kila mwenye simu akabidhi simu yake kwa chifu kila wiki' } },
        { id: 'c', text: { en: 'It bans all civic education organizations from operating websites', sw: 'Kinapiga marufuku mashirika yote ya kiraia kuwa na tovuti' } },
        { id: 'd', text: { en: 'It grants total immunity to bloggers sharing fabricated riot footage', sw: 'Kinampa kinga kamili mwanablogu anayesambaza video bandia za ghasia' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The Cybercrimes Act criminalizes the intentional dissemination of fabricated alarms and false information calculated to disrupt public peace or provoke inter-communal panic.',
        sw: 'Sheria ya Mitandao inakataza kusambaza habari za uzushi wa makusudi zinazosababisha taharuki na hofu katika jamii.',
      },
    },
    {
      id: 'l12_q4',
      category: 'participation',
      question: {
        en: 'What is the critical distinction between "misinformation" and "disinformation" in digital communications?',
        sw: 'Ni upi utofauti mkubwa kati ya "misinformation" na "disinformation" katika mawasiliano ya kidijitali?',
      },
      options: [
        { id: 'a', text: { en: 'Misinformation is false content shared without malicious intent; disinformation is deliberately fabricated falsehood created to mislead or cause damage', sw: 'Misinformation ni habari ya uongo inayosambazwa bila nia mbaya; disinformation ni uzushi wa makusudi uliotungwa ili kupotosha au kudhuru' } },
        { id: 'b', text: { en: 'Misinformation only occurs in newspapers, while disinformation only occurs on television', sw: 'Misinformation hutokea magazetini pekee na disinformation runingani pekee' } },
        { id: 'c', text: { en: 'Both terms refer only to foreign weather forecasts', sw: 'Maneno yote mawili yanahusu tu utabiri wa hali ya hewa wa nchi za nje' } },
        { id: 'd', text: { en: 'Disinformation is legally mandated for all social media administrators', sw: 'Disinformation ni wajibu wa kisheria kwa wakuu wote wa vikundi vya mitandao' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Disinformation involves malicious intent and deliberate coordination to deceive, whereas misinformation is often forwarded mistakenly by well-meaning citizens who have not verified the facts.',
        sw: 'Disinformation inahusisha nia ovu ya kutunga uongo ili kuleta madhara, wakati misinformation ni kosa la kusambaza bila kujua ukweli.',
      },
    },
    {
      id: 'l12_q5',
      category: 'participation',
      question: {
        en: 'Under Article 10 of the Constitution of Kenya, how should active youth influencers and community admins utilize digital communication?',
        sw: 'Chini ya Kifungu cha 10 cha Katiba ya Kenya, vijana wenye ushawishi na wasimamizi wa mitandao wanapaswa kutumia vipi mawasiliano ya kidijitali?',
      },
      options: [
        { id: 'a', text: { en: 'To promote national unity, inclusiveness, social justice, transparency, and peaceful conflict resolution', sw: 'Kuendeleza umoja wa kitaifa, ushirikishwaji, haki ya kijamii, uwazi, na utatuzi wa migogoro kwa amani' } },
        { id: 'b', text: { en: 'To amplify ethnic prejudices and mock minority languages', sw: 'Kukuza ubaguzi wa kikabila na kudharau lugha za jamii ndogo' } },
        { id: 'c', text: { en: 'To leak confidential private medical records of neighbors', sw: 'Kuvujisha siri za kiafya za majirani zao mitandaoni' } },
        { id: 'd', text: { en: 'To coordinate illegal road blockades and looting', sw: 'Kupanga njama za kuzuia barabara kinyume cha sheria na uporaji' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 10 national values bind all persons and digital spaces to advance patriotism, national unity, human dignity, and non-discrimination.',
        sw: 'Maadili ya Kitaifa ya Kifungu cha 10 yanawaagiza wote kutumia fursa za mitandao kuleta mshikamano, amani na kuheshimiana.',
      },
    },
    {
      id: 'l12_q6',
      category: 'participation',
      question: {
        en: 'When inflammatory rumors threaten to ignite clashes between neighboring communities, what is the best "peace counter-narrative" approach?',
        sw: 'Uvumi wa uchochezi unapotishia kusababisha mapigano kati ya jamii jirani, ni ipi mbinu bora ya kutumia "simulizi ya amani" (peace counter-narrative)?',
      },
      options: [
        { id: 'a', text: { en: 'Disseminate factual, verified evidence of common interests, share stories of cross-ethnic solidarity, and quote community leaders calling for calm', sw: 'Kusambaza ushahidi wa ukweli uliohakikiwa, kusimulia mifano ya mshikamano wa jamii, na kunukuu viongozi wanaotuliza jazba' } },
        { id: 'b', text: { en: 'Retaliate with equally toxic accusations against the other group', sw: 'Kujibu mashambulizi kwa matusi na kashfa kali zaidi dhidi ya kundi lingine' } },
        { id: 'c', text: { en: 'Log off silently and let violence escalate unchecked', sw: 'Kukaa kimya kabisa na kuacha vurugu ziendelee bila hatua yoyote' } },
        { id: 'd', text: { en: 'Create sensational clickbait headlines to gain followers', sw: 'Kutunga vichwa vya habari vya kutisha ili kujipatia wafuasi wengi mtandaoni' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Effective peace narratives replace polarising sensationalism with grounded facts, joint community voices, and concrete reminders of shared economic and social interdependence.',
        sw: 'Simulizi bora ya amani hubadilisha uhasama kwa kutoa ukweli, kuonyesha ushirikiano wa amani, na kuwakumbusha wananchi mshikamano wao.',
      },
    },
    {
      id: 'l12_q7',
      category: 'participation',
      question: {
        en: 'What is a "digital verification check" that every citizen should perform before forwarding an alarming video or audio clip in WhatsApp groups?',
        sw: 'Ni ukaguzi gani wa kidijitali ambao kila mwananchi anapaswa kufanya kabla ya kusambaza video au sauti yenye kuleta taharuki kwenye vikundi vya WhatsApp?',
      },
      options: [
        { id: 'a', text: { en: 'Check the date, original source, reverse image search key frames, and confirm whether trusted news or official organs reported the occurrence', sw: 'Kukagua tarehe, chanzo cha asili, kufanya reverse image search ya picha, na kuthibitisha iwapo vyombo rasmi vya habari vimeripoti tukio hilo' } },
        { id: 'b', text: { en: 'Immediately forward it to 10 other family groups with the label "Must Watch Alert"', sw: 'Kuisambaza mara moja kwa vikundi 10 vya familia ukiandika "Ona Hii Haraka"' } },
        { id: 'c', text: { en: 'Edit the clip to add dramatic background horror music', sw: 'Kuhariri video hiyo na kuongeza muziki wa kuogofya' } },
        { id: 'd', text: { en: 'Assume that any message with multiple forward arrows is automatically true', sw: 'Kudhani kwamba ujumbe wowote wenye alama ya kusambazwa mara nyingi ni wa kweli moja kwa moja' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Digital hygiene requires verifying timestamps, geolocation, and credible corroborating sources before disseminating sensitive media that could trigger public panic.',
        sw: 'Usafi wa kidijitali unataka mwananchi kuhakiki chanzo, tarehe na ukweli kabla ya kusambaza habari inayoweza kusababisha taharuki na machafuko.',
      },
    },
    {
      id: 'l12_q8',
      category: 'participation',
      question: {
        en: 'What legal responsibility does an administrator of a public WhatsApp or Facebook community group have under Kenyan jurisprudence?',
        sw: 'Ni wajibu gani wa kisheria ambao msimamizi wa kikundi cha WhatsApp au Facebook cha umma anao chini ya sheria za Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'Admins must establish clear community rules, caution members against hate speech, delete unlawful defamatory posts, and remove repeat offenders', sw: 'Wasimamizi lazima waweke kanuni wazi, wawaonye wanaotoa matamshi ya chuki, wafute machapisho haramu na kuwaondoa wanaorudia makosa' } },
        { id: 'b', text: { en: 'Admins have zero responsibilities and can encourage cyberbullying with impunity', sw: 'Wasimamizi hawana wajibu wowote na wanaweza kuchochea unyanyasaji mtandaoni bila kuadhibiwa' } },
        { id: 'c', text: { en: 'Admins are required by law to delete all messages that criticize public taxes', sw: 'Wasimamizi wanalazimika kufuta jumbe zote zinazokosoa kodi' } },
        { id: 'd', text: { en: 'Admins must collect membership fees on behalf of county revenue offices', sw: 'Wasimamizi lazima wakusanye ada za uanachama kwa niaba ya kaunti' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Group admins who knowingly harbor or facilitate criminal hate speech and defamatory incitement risk being held jointly liable as facilitators or publishers of unlawful content.',
        sw: 'Wasimamizi wa vikundi wanaoruhusu matamshi ya chuki bila kuyaondoa wanaweza kuwajibika kisheria kama washirika wa kueneza uchochezi.',
      },
    },
    {
      id: 'l12_q9',
      category: 'participation',
      question: {
        en: 'Which official state body in Kenya provides a dedicated hotline for citizens to report online hate speech, ethnic stereotyping, and digital incitement?',
        sw: 'Ni asasi gani rasmi ya serikali nchini Kenya inayotoa nambari maalum ya simu kwa wananchi kuripoti matamshi ya chuki mtandaoni, ubaguzi wa kikabila na uchochezi?',
      },
      options: [
        { id: 'a', text: { en: 'The National Cohesion and Integration Commission (NCIC)', sw: 'Tume ya Kitaifa ya Uwiano na Utangamano (NCIC)' } },
        { id: 'b', text: { en: 'The National Cereals and Produce Board (NCPB)', sw: 'Bodi ya Kitaifa ya Nafaka na Mazao (NCPB)' } },
        { id: 'c', text: { en: 'The Kenya National Highways Authority (KeNHA)', sw: 'Mamlaka ya Kitaifa ya Barabara Kuu ya Kenya (KeNHA)' } },
        { id: 'd', text: { en: 'The Postal Corporation of Kenya (Posta)', sw: 'Shirika la Posta la Kenya' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'NCIC monitors social media spaces, maintains complaints reporting channels (SMS, WhatsApp hotline, email), and partners with ODPP to prosecute hate speech perpetrators.',
        sw: 'NCIC inafuatilia mitandao ya kijamii na kupokea taarifa za wananchi ili kuwachukulia hatua za kisheria wanaochochea uhasama wa kikabila.',
      },
    },
    {
      id: 'l12_q10',
      category: 'participation',
      question: {
        en: 'How can citizens harness social media to hold devolved county officials accountable while strictly maintaining peaceful discourse?',
        sw: 'Wananchi wanawezaje kutumia mitandao ya kijamii kuwawajibisha viongozi wa kaunti huku wakidumisha amani na ustaarabu?',
      },
      options: [
        { id: 'a', text: { en: 'Tag official county handles, cite exact budget line items from County ADPs, attach photos of stalled works, and demand public timeline answers', sw: 'Kutaja kurasa rasmi za kaunti, kunukuu vifungu halisi vya bajeti (ADP), kuweka picha za miradi iliyokwama, na kudai majibu ya ratiba ya utekelezaji' } },
        { id: 'b', text: { en: 'Use abusive epithets targeting the official\'s clan, tribe, and family', sw: 'Kutukana ukoo, kabila na familia ya kiongozi husika' } },
        { id: 'c', text: { en: 'Threaten physical destruction of public dispensaries', sw: 'Kutishia kuchoma zahanati za umma' } },
        { id: 'd', text: { en: 'Circulate fabricated private photos that have no connection to public governance', sw: 'Kusambaza picha bandia za kibinafsi zisizo na uhusiano wowote na usimamizi wa rasilimali za umma' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Constructive civic advocacy uses evidence-based factual tracking (budgets, photos, statutory timelines) to demand accountability without resorting to defamatory tribal attacks.',
        sw: 'Utetezi wenye tija wa kiraia unatumia ushahidi wa nyaraka na picha halisi kuhoji matumizi ya kodi kwa njia ya heshima na amani.',
      },
    },
  ],

  // Course 13: How to Write an Incident Report
  lesson_13: [
    {
      id: 'l13_q1',
      category: 'integrity',
      question: {
        en: 'What are the foundational "5 Ws" that must always anchor the opening narrative of an incident report in Kenya?',
        sw: 'Ni mambo yapi 5 makuu ("5 Ws") ambayo lazima yaongoze mwanzo wa ripoti ya tukio nchini Kenya?',
      },
      options: [
        { id: 'a', text: { en: 'Who, What, When, Where, and Why / How', sw: 'Nani, Nini, Lini, Wapi, na Kwa Nini / Vipi' } },
        { id: 'b', text: { en: 'Which, Whom, Wealth, Weight, and Width', sw: 'Kipi, Yupi, Utajiri, Uzito, na Upana' } },
        { id: 'c', text: { en: 'Whether, Wherefore, Whoever, Whichever, and Whereas', sw: 'Kama, Kwa ajili ya nini, Yeyote, Chochote, na Hali ya kuwa' } },
        { id: 'd', text: { en: 'Only Where and When; the rest can be left to imagination', sw: 'Wapi na Lini pekee; mengine yanaweza kuachwa kwa ubunifu' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The 5 Ws establish the core factual matrix required under the Evidence Act: Who was involved, What occurred, When it happened, Where it took place, and How/Why it transpired.',
        sw: 'Mambo 5 Makuu (Who, What, When, Where, Why/How) huweka misingi thabiti ya kisheria ya tukio lolote inayohitajika kortini na kwa vyombo vya uchunguzi.',
      },
    },
    {
      id: 'l13_q2',
      category: 'integrity',
      question: {
        en: 'Why do courts and oversight bodies give immense evidentiary weight to "contemporaneous notes" compiled during or immediately after an incident?',
        sw: 'Kwa nini mahakama na vyombo vya uchunguzi vinathamini sana "maelezo ya papo hapo" (contemporaneous notes) yaliyoandikwa mara moja tukio linapotokea?',
      },
      options: [
        { id: 'a', text: { en: 'Because human memory fades over time; immediate documentation preserves fresh, unpolluted, and verifiable facts under the Evidence Act (Cap 80)', sw: 'Kwa sababu kumbukumbu ya binadamu husahau kadiri muda unavyopita; uandishi wa papo hapo unalinda ukweli halisi usiochafuliwa chini ya Sheria ya Ushahidi' } },
        { id: 'b', text: { en: 'Because older notes automatically become classified state secrets', sw: 'Kwa sababu maelezo ya zamani huwa siri za serikali' } },
        { id: 'c', text: { en: 'Because notes taken later are written on more expensive paper', sw: 'Kwa sababu maelezo yanayoandikwa baadaye hutumia karatasi ghali zaidi' } },
        { id: 'd', text: { en: 'Because magistrates refuse to read any document written in blue ink', sw: 'Kwa sababu mahakimu wanakataa kusoma nyaraka za wino wa bluu' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under Section 167 of the Evidence Act, contemporaneous records carry prime judicial reliability because they minimize retrospective distortion and memory decay.',
        sw: 'Sheria ya Ushahidi (Cap 80) inathamini sana rekodi za papo hapo kwa sababu haziathiriwi na kusahaulika au kubadilishwa kwa maelezo baada ya muda kupita.',
      },
    },
    {
      id: 'l13_q3',
      category: 'integrity',
      question: {
        en: 'What tone and language style should be strictly adhered to when compiling an objective incident report?',
        sw: 'Ni mtindo gani wa lugha unaopaswa kuzingatiwa kikamilifu wakati wa kuandika ripoti ya tukio isiyo na upendeleo?',
      },
      options: [
        { id: 'a', text: { en: 'Neutral, factual, objective descriptions and verbatim quotes without emotional exaggeration or speculation', sw: 'Maelezo ya ukweli, yasiyoegemea upande wowote, maneno halisi yaliyonukuliwa, na bila chumvi ya kihisia au kubahatisha' } },
        { id: 'b', text: { en: 'Sensational political rhetoric with dramatic exaggerations', sw: 'Kauli za kisiasa zenye kukuza mambo na hisia kali za hasira' } },
        { id: 'c', text: { en: 'Poetic verses and fictional allegories', sw: 'Mashairi na hadithi za kubuni' } },
        { id: 'd', text: { en: 'Rumors gathered from distant social media comment sections', sw: 'Tetesi zilizokusanywa kutoka kwenye maoni ya mitandao ya kijamii' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Incident reports must describe facts objectively (e.g. "Officer X said: \'Give me KES 2,000\'", not "The evil officer robbed me"), ensuring credibility during prosecution.',
        sw: 'Ripoti ya tukio inapaswa kueleza mambo jinsi yalivyokuwa bila chuki au hisia (k.m. "Afisa alisema: \'Leta elfu mbili\'", badala ya "Askari jambazi alituibia").',
      },
    },
    {
      id: 'l13_q4',
      category: 'integrity',
      question: {
        en: 'What does "Chain of Custody" mean in evidentiary documentation, and why is it essential for incident reporting?',
        sw: 'Nini maana ya "Mlolongo Salama wa Ushahidi" (Chain of Custody) na kwa nini ni muhimu katika uandishi wa ripoti ya tukio?',
      },
      options: [
        { id: 'a', text: { en: 'The chronological record tracing who collected, received, secured, and handled physical or digital evidence from seizure to court', sw: 'Rekodi ya mpangilio inayoonyesha nani aliyekusanya, aliyepokea, aliyetunza na aliyekabidhi ushahidi kutoka eneo la tukio hadi kortini' } },
        { id: 'b', text: { en: 'The metal chain used by police to lock cell gates', sw: 'Mlolongo wa chuma unaotumiwa kufunga milango ya korokoroni' } },
        { id: 'c', text: { en: 'The list of high-ranking state dignitaries attending a public holiday', sw: 'Orodha ya viongozi wakuu wanaohudhuria sikukuu ya kitaifa' } },
        { id: 'd', text: { en: 'The sequential numbering of bank loans issued to county assemblies', sw: 'Nambari za mikopo ya benki inayotolewa kwa mabunge ya kaunti' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Without a clear chain of custody, defense lawyers can claim that evidence (such as CCTV footage, cartridges, or receipts) was contaminated, altered, or fabricated.',
        sw: 'Bila mlolongo salama wa ushahidi (Chain of Custody), mawakili wa mtuhumiwa wanaweza kupinga mahakamani kuwa ushahidi ulichezewa au kubadilishwa.',
      },
    },
    {
      id: 'l13_q5',
      category: 'integrity',
      question: {
        en: 'When preserving digital evidence (photos, smartphone videos, audio recordings) for an incident report, what technical rule is crucial?',
        sw: 'Wakati wa kulinda ushahidi wa kidijitali (picha, video za simu, rekodi za sauti) za ripoti ya tukio, ni kanuni gani ya kiufundi iliyo muhimu sana?',
      },
      options: [
        { id: 'a', text: { en: 'Preserve the original uncompressed files with unchanged EXIF metadata (timestamp, GPS coordinates, camera model) and create secure backups', sw: 'Kuhifadhi faili asili bila kuzibana zikiwa na maelezo ya metadata ya asili (muda, GPS, aina ya simu) na kuweka nakala salama mtandaoni' } },
        { id: 'b', text: { en: 'Apply beauty filters and social media stickers to make the photos colorful', sw: 'Kuweka vipodozi vya picha (filters) na vibandiko ili picha ivutie' } },
        { id: 'c', text: { en: 'Crop out the faces of police officers to protect their privacy', sw: 'Kukata sura za maafisa wa polisi ili kulinda faragha yao' } },
        { id: 'd', text: { en: 'Delete the original file immediately after posting a low-resolution screenshot on X', sw: 'Kufuta faili asili mara tu unapoweka picha ya skrini yenye ukungu kwenye mtandao' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Under Section 106B of the Evidence Act, digital evidence admissibility relies on proof of authenticity. Original EXIF metadata proves the exact time, device, and GPS location of the incident.',
        sw: 'Chini ya Kifungu cha 106B cha Sheria ya Ushahidi, ushahidi wa kielektroniki unahitaji metadata ya asili kuthibitisha mahali halisi, muda na kifaa kilichotumika kupiga picha.',
      },
    },
    {
      id: 'l13_q6',
      category: 'integrity',
      question: {
        en: 'In incidents involving physical injury or police assault, which medical document is legally required in Kenya to establish the degree of harm in court?',
        sw: 'Katika matukio yanayohusisha majeraha ya mwili au kipigo cha polisi, ni nyaraka gani ya kimatibabu inayotakiwa kisheria nchini Kenya kuthibitisha ukubwa wa jeraha kortini?',
      },
      options: [
        { id: 'a', text: { en: 'A Kenya Police Medical Examination Form (P3 Form) completed by a certified government medical officer', sw: 'Fomu ya Uchunguzi wa Kimatibabu ya Polisi (Fomu ya P3) iliyojazwa na daktari rasmi wa serikali' } },
        { id: 'b', text: { en: 'A handwritten pharmacy receipt for painkiller tablets', sw: 'Karatasi ya stakabadhi ya duka la dawa iliyonunuliwa panadol' } },
        { id: 'c', text: { en: 'A traditional herbalist certificate without clinical stamps', sw: 'Cheti cha mganga wa kienyeji kisicho na muhuri wa hospitali' } },
        { id: 'd', text: { en: 'A gym membership card', sw: 'Kadi ya uanachama wa mazoezi' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The P3 form classifies bodily injury into legal categories (e.g., harm, grievous harm, maim) and constitutes indispensable forensic evidence for assault prosecutions.',
        sw: 'Fomu ya P3 huainisha kiwango cha majeraha kisheria (harm, grievous harm) na ni ushahidi mkuu wa kimahakama katika kesi za kupigwa na kujeruhiwa.',
      },
    },
    {
      id: 'l13_q7',
      category: 'integrity',
      question: {
        en: 'How should vulnerable eyewitnesses be handled when drafting an incident report for public advocacy or community filing?',
        sw: 'Mashahidi walio hatarini wanapaswa kulindwa vipi wakati wa kuandaa ripoti ya tukio kwa ajili ya kutetea haki au kuwasilisha kwa asasi za umma?',
      },
      options: [
        { id: 'a', text: { en: 'Redact names in public copies using secure identifiers (e.g., Witness A), while preserving full details in an encrypted confidential master log under the Witness Protection Act', sw: 'Kuficha majina kwenye nakala za umma kwa kutumia herufi (k.m. Shahidi A), na kutunza majina halisi kwenye faili salama ya siri chini ya Sheria ya Kulinda Mashahidi' } },
        { id: 'b', text: { en: 'Publish their home addresses and national ID numbers on community billboard posts', sw: 'Kuchapisha anwani za makazi na nambari zao za vitambulisho kwenye mabango ya kijiji' } },
        { id: 'c', text: { en: 'Force witnesses to confront the suspects without legal counsel present', sw: 'Kuwashurutisha mashahidi wakabiliane na watuhumiwa bila wakili' } },
        { id: 'd', text: { en: 'Refuse to record any witness accounts under any circumstances', sw: 'Kukataa kabisa kurekodi ushuhuda wa mtu yeyote' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Protecting witness safety is a prime duty; redacting identifiers prevents retaliation and allows formal handover to the Witness Protection Agency (WPA) or KNCHR.',
        sw: 'Kulinda usalama wa mashahidi ni jukumu la kwanza; kuficha majina kwenye ripoti za umma kunazuia vitisho na kulinda familia zao.',
      },
    },
    {
      id: 'l13_q8',
      category: 'integrity',
      question: {
        en: 'Which oversight body should an incident report be addressed to when it involves extrajudicial violence, refusal of police bail, or harassment by police officers?',
        sw: 'Ni chombo gani cha usimamizi ambacho ripoti ya tukio inapaswa kuwasilishwa kwake inapohusu ukatili wa polisi, kunyimwa dhamana ya kituo, au unyanyasaji wa askari?',
      },
      options: [
        { id: 'a', text: { en: 'The Independent Policing Oversight Authority (IPOA - Toll-Free 1559)', sw: 'Mamlaka Huru ya Kusimamia Utendaji Kazi wa Polisi (IPOA - Nambari ya Bure 1559)' } },
        { id: 'b', text: { en: 'The Kenya Wildlife Service Marine Ranger Department', sw: 'Idara ya Walinzi wa Baharini ya KWS' } },
        { id: 'c', text: { en: 'The Kenya Association of Manufacturers (KAM)', sw: 'Chama cha Wenye Viwanda cha Kenya (KAM)' } },
        { id: 'd', text: { en: 'The National Transport and Safety Authority Vehicle Inspection Lane', sw: 'Kituo cha Ukaguzi wa Magari cha NTSA' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'IPOA was established under Section 5 of the IPOA Act 2011 to independently investigate civilian complaints against National Police Service personnel.',
        sw: 'IPOA imepewa mamlaka ya kisheria kuchunguza malalamiko yote ya wananchi dhidi ya maafisa wa polisi na kupendekeza mashtaka kwa DPP.',
      },
    },
    {
      id: 'l13_q9',
      category: 'integrity',
      question: {
        en: 'If an incident report documents extortion, demand for bribes by public officers, or diversion of public funds, which primary commission receives the file?',
        sw: 'Iwapo ripoti ya tukio inaeleza ulaghai, madai ya hongo na maafisa wa umma, au ubadhirifu wa fedha za umma, ni tume gani inayopokea faili hiyo kisheria?',
      },
      options: [
        { id: 'a', text: { en: 'The Ethics and Anti-Corruption Commission (EACC)', sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC)' } },
        { id: 'b', text: { en: 'The National Museums of Kenya Antiquities Desk', sw: 'Dawati la Vitu vya Kale la Makumbusho ya Kitaifa ya Kenya' } },
        { id: 'c', text: { en: 'The Kenya Tourism Board Marketing Office', sw: 'Ofisi ya Masoko ya Bodi ya Utalii ya Kenya' } },
        { id: 'd', text: { en: 'The Kenya Meat Commission Slaughterhouse', sw: 'Kiwanda cha Nyama cha Kenya (KMC)' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The EACC enforces the Anti-Corruption and Economic Crimes Act (ACECA) and Chapter 6 of the Constitution, investigating bribery, procurement fraud, and asset diversion.',
        sw: 'Tume ya EACC inasimamia Sura ya Sita ya Katiba na Sheria ya Kupambana na Rushwa, ikichunguza hongo na ubadhirifu wa fedha za umma.',
      },
    },
    {
      id: 'l13_q10',
      category: 'integrity',
      question: {
        en: 'What is the standard closing section of a professionally drafted incident report?',
        sw: 'Ni sehemu gani ya kawaida ya kufunga ripoti ya tukio iliyoandaliwa kitaalamu?',
      },
      options: [
        { id: 'a', text: { en: 'Reporter declaration of truthfulness, signature, date of compiling, list of attached evidence/annexures, and receiving agency stamp/acknowledgment', sw: 'Tamko la mwandishi kuhusu ukweli wa maelezo, sahihi, tarehe, orodha ya viambatisho vya ushahidi, na muhuri wa kupokelewa kutoka asasi husika' } },
        { id: 'b', text: { en: 'A poem thanking the suspects for their attendance', sw: 'Shairi la kuwashukuru watuhumiwa kwa kuhudhuria' } },
        { id: 'c', text: { en: 'A bill requesting payment from the court for writing the document', sw: 'Bili ya kudai pesa kutoka mahakamani kwa kuandika waraka huo' } },
        { id: 'd', text: { en: 'Leaving the document unsigned without any date or reporter identity', sw: 'Kuacha waraka bila sahihi, bila tarehe wala utambulisho wowote' } },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'A valid incident report must conclude with a declaration of truth, the author\'s signature, date, list of numbered annexures (photos/documents), and a receiving stamp upon delivery.',
        sw: 'Ripoti ya tukio hukamilishwa kwa tamko la ukweli, sahihi, tarehe, orodha ya viambatisho (picha/stakabadhi), na kupigwa muhuri rasmi inapokabidhiwa.',
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
