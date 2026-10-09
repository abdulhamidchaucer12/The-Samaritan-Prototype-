import { Language } from '../types';
import { getUserProgress } from './storage';
import { getAllCivicCourses } from './dailyCourses';
import { recordMeritGraduation, isUserMeritGraduate, getMeritGraduateRecord, MeritGraduateRecord } from './meritGraduation';

export interface GrandExamQuestion {
  id: string;
  questionNumber: number; // 1 to 40
  category: 'constitution' | 'devolution' | 'human_rights' | 'participation' | 'integrity' | 'government' | 'elections' | 'public_finance' | 'police_oversight' | 'environment';
  marks: 1; // 1 mark each = 40 marks total
  question: {
    en: string;
    sw: string;
  };
  scenario?: {
    en: string;
    sw: string;
  };
  options: {
    id: 'a' | 'b' | 'c' | 'd';
    text: {
      en: string;
      sw: string;
    };
  }[];
  correctOptionId: 'a' | 'b' | 'c' | 'd';
  explanation: {
    en: string;
    sw: string;
  };
  constitutionalArticle: string;
  sourceTopic: string;
  difficulty: 'foundation' | 'scenario' | 'advanced_analysis';
}

export interface GrandExamSitting {
  examId: string;
  username: string;
  generatedAt: string;
  totalMarks: 40;
  timeLimitMinutes: 40; // 40 minutes for 40 questions
  questions: GrandExamQuestion[];
  userAnswers: Record<string, 'a' | 'b' | 'c' | 'd'>;
  flaggedQuestions: string[];
  startedAt?: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  score?: number; // out of 40
  percentage?: number;
  passed?: boolean; // score > 30
  graduationRecord?: MeritGraduateRecord;
}

const GRAND_EXAM_STORAGE_PREFIX = 'the_samaritan_grand_exam_sitting_v1_';

/**
 * 40 Curated Comprehensive Exam Questions tailored across all 100 Civic Courses
 * addressing foundational constitutional law, practical grassroots scenarios,
 * and advanced judicial precedents.
 */
export const GRAND_EXAM_QUESTION_BANK: Omit<GrandExamQuestion, 'questionNumber'>[] = [
  // 1. Constitution & Article 1 Sovereign Power
  {
    id: 'gq_01',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'Sovereign Power & Article 1',
    constitutionalArticle: 'Article 1 & Article 2',
    difficulty: 'foundation',
    question: {
      en: 'According to Article 1 of the Constitution of Kenya 2010, in whom does all sovereign power reside?',
      sw: 'Kulingana na Kifungu cha 1 cha Katiba ya Kenya 2010, mamlaka yote ya nchi ni ya nani?',
    },
    options: [
      { id: 'a', text: { en: 'The President and Cabinet Secretaries', sw: 'Rais na Mawaziri wa Baraza la Mawaziri' } },
      { id: 'b', text: { en: 'The People of Kenya, exercised directly or through democratically elected representatives', sw: 'Wananchi wa Kenya, yakitekelezwa moja kwa moja au kupitia wawakilishi waliochaguliwa' } },
      { id: 'c', text: { en: 'The National Assembly and Senate Speakers', sw: 'Maspika wa Bunge la Kitaifa na Seneti' } },
      { id: 'd', text: { en: 'The Chief Justice and Supreme Court of Kenya', sw: 'Jaji Mkuu na Mahakama ya Juu ya Kenya' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Article 1(1) affirms: "All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution."',
      sw: 'Kifungu cha 1(1) kinatamka: "Mamlaka yote ya nchi ni ya wananchi wa Kenya na yatatekelezwa tu kwa mujibu wa Katiba hii."',
    },
  },

  // 2. Article 10 National Values & Public Participation
  {
    id: 'gq_02',
    category: 'participation',
    marks: 1,
    sourceTopic: 'National Values & Public Participation',
    constitutionalArticle: 'Article 10(2)',
    difficulty: 'scenario',
    scenario: {
      en: 'A county executive introduces a supplementary budget reallocating KES 150M from a planned rural clinic without holding public barazas.',
      sw: 'Afisa mkuu wa kaunti anawasilisha bajeti ya ziada inayohamisha Milioni 150 kutoka kwa mradi wa zahanati ya kijiji bila mabaraza ya wananchi.',
    },
    question: {
      en: 'Under Article 10, why is this budget reallocation legally vulnerable in court?',
      sw: 'Chini ya Kifungu cha 10, kwa nini uhamishaji huu wa bajeti unaweza kufutwa na mahakama?',
    },
    options: [
      { id: 'a', text: { en: 'Only the Auditor-General can authorize county health expenses', sw: 'Ni Mkaguzi Mkuu pekee anayeweza kuidhinisha matumizi ya afya ya kaunti' } },
      { id: 'b', text: { en: 'Public participation is a mandatory national value that binds all state organs when making public decisions', sw: 'Ushiriki wa wananchi ni thamani ya kitaifa inayofunga idara zote za serikali kabla ya uamuzi kufanywa' } },
      { id: 'c', text: { en: 'Rural health funds can only be reallocated during national elections', sw: 'Fedha za afya ya vijijini zinaweza kuhamishwa tu wakati wa uchaguzi mkuu' } },
      { id: 'd', text: { en: 'County executives do not have authority to write budget proposals', sw: 'Maafisa wa kaunti hawana mamlaka ya kuandika makadirio ya bajeti' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Article 10(2)(a) establishes "democracy and participation of the people" as non-negotiable national values. In Robert Gakuru v Governor of Kiambu, courts affirmed that decisions made without meaningful citizen input are constitutionally void.',
      sw: 'Kifungu cha 10(2)(a) kinaweka ushiriki wa wananchi kama msingi wa kikatiba usiopingika. Mahakama Kuu ilithibitisha kwamba uamuzi wowote bila wananchi kubatilishwa.',
    },
  },

  // 3. Article 22 & Abolition of Locus Standi
  {
    id: 'gq_03',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'Public Interest Standing & Mutunga Rules',
    constitutionalArticle: 'Article 22 & Supreme Court Precedents',
    difficulty: 'advanced_analysis',
    question: {
      en: 'What did the 2010 Constitution achieve regarding "locus standi" (legal standing) under Article 22?',
      sw: 'Katiba ya 2010 ilifanikisha nini kuhusu "locus standi" (haki ya kusimama kortini) chini ya Kifungu cha 22?',
    },
    options: [
      { id: 'a', text: { en: 'Only registered land owners can sue for environmental or communal rights', sw: 'Wamiliki wa ardhi pekee wenye hati ndio wanaoweza kushtaki kulinda mazingira' } },
      { id: 'b', text: { en: 'Any person acting in public interest or representing a group can approach the High Court without proving personal loss', sw: 'Mtu yeyote anayetenda kwa maslahi ya umma au anayewakilisha jamii anaweza kufungua kesi Mahakama Kuu bila kuonyesha hasara binafsi' } },
      { id: 'c', text: { en: 'Petitioners must pay minimum KES 50,000 court security deposits before filing', sw: 'Mlalaji lazima alipe amana ya Shilingi 50,000 kabla ya kusikilizwa' } },
      { id: 'd', text: { en: 'Only the Attorney General has standing to defend public resources in Kenya', sw: 'Mwanasheria Mkuu pekee ndiye mwenye haki ya kutetea rasilimali za umma' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Article 22 completely abolished strict locus standi. Any resident, paralegal, or community group can institute court proceedings claiming that a right in the Bill of Rights has been denied, violated, or threatened.',
      sw: 'Kifungu cha 22 kiliondoa kabisa kizuizi cha locus standi. Mwananchi au kikundi chochote kinaweza kuomba Mahakama Kuu kuzuia ukiukaji wa haki za kikatiba.',
    },
  },

  // 4. Article 49 Rights of Arrested Persons
  {
    id: 'gq_04',
    category: 'police_oversight',
    marks: 1,
    sourceTopic: 'Article 49 Arrest Safeguards & 24-Hour Rule',
    constitutionalArticle: 'Article 49(1)(f)',
    difficulty: 'foundation',
    question: {
      en: 'Within how many hours must an arrested person in Kenya be brought before an open court of law under Article 49(1)(f)?',
      sw: 'Ndani ya saa ngapi mtu aliyekamatwa nchini Kenya lazima afikishwe mbele ya mahakama chini ya Kifungu cha 49(1)(f)?',
    },
    options: [
      { id: 'a', text: { en: 'Within 72 hours, excluding weekends', sw: 'Ndani ya saa 72, bila kuhesabu wikendi' } },
      { id: 'b', text: { en: 'Within 24 hours, or the end of the next court day if 24 hours fall on a weekend/holiday', sw: 'Ndani ya saa 24, au mwisho wa siku inayofuata ya kazi ikiwa zitaishia wikendi/sikukuu' } },
      { id: 'c', text: { en: 'Within 7 days for preliminary police investigations', sw: 'Ndani ya siku 7 kwa ajili ya uchunguzi wa awali wa polisi' } },
      { id: 'd', text: { en: 'At the sole discretion of the Station Officer in Charge (OCS)', sw: 'Kulingana na uamuzi wa Mkuu wa Kituo cha Polisi (OCS)' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Article 49(1)(f) commands that an arrested person must be brought before a court not later than 24 hours after being arrested, protecting citizens from arbitrary detention.',
      sw: 'Kifungu cha 49(1)(f) kinaamuru kwamba mtu aliyekamatwa lazima afikishwe mahakamani ndani ya saa 24, kuzuia kuweka watu kizuizini kinyume cha sheria.',
    },
  },

  // 5. Police Cash Bail & Station Extortion
  {
    id: 'gq_05',
    category: 'police_oversight',
    marks: 1,
    sourceTopic: 'Police Bond vs Bribes',
    constitutionalArticle: 'Article 49(1)(h) & Criminal Procedure Code',
    difficulty: 'scenario',
    scenario: {
      en: 'A station officer demands KES 10,000 sent via personal mobile money for "weekend release" of a bodaboda rider arrested for lacking a reflective jacket.',
      sw: 'Afisa wa kituo anadai Shilingi 10,000 zitumwe kwa nambari yake ya kibinafsi ya simu ili kumwachilia mhudumu wa bodaboda aliyekamatwa bila jaketi.',
    },
    question: {
      en: 'What is the legally required procedure for police cash bail in Kenya?',
      sw: 'Utaratibu sahihi wa kisheria wa kutoa dhamana ya pesa taslimu kituoni (cash bail) ni upi?',
    },
    options: [
      { id: 'a', text: { en: 'Officers can collect private cash bail on behalf of the station welfare fund', sw: 'Maafisa wanaweza kuchukua fedha za kibinafsi kwa hazina ya kituo' } },
      { id: 'b', text: { en: 'Police cash bail must be documented in the official register and issued with a duplicate government receipt (F.O. 20 / GP 53)', sw: 'Dhamana ya polisi lazima iandikwe kwenye kitabu rasmi na kutolewa risiti rasmi ya serikali (F.O. 20 au GP 53)' } },
      { id: 'c', text: { en: 'Cash bail is completely illegal in Kenya; only land title deeds can be used', sw: 'Dhamana ya pesa ni haramu nchini Kenya; hati miliki za ardhi pekee zinazokubalika' } },
      { id: 'd', text: { en: 'Bodaboda riders are excluded from constitutional bail rights', sw: 'Wahudumu wa bodaboda hawana haki ya kupewa dhamana ya kikatiba' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Under National Police Service Standing Orders and Judiciary Bail & Bond Guidelines, police bail must always be receipted officially. Demanding undocumented funds into personal phones is extortion and a felony under the Anti-Corruption Act.',
      sw: 'Dhamana ya polisi lazima iwe na risiti rasmi ya serikali. Kudai pesa mkononi au kwenye nambari binafsi ni kosa la jinai la rushwa na unyang\'anyi.',
    },
  },

  // 6. Article 35 Access to Information
  {
    id: 'gq_06',
    category: 'participation',
    marks: 1,
    sourceTopic: 'Access to Information Act 2016',
    constitutionalArticle: 'Article 35 & Access to Information Act Sec. 9',
    difficulty: 'foundation',
    question: {
      en: 'Under the Access to Information Act 2016, what is the statutory deadline for a public body to respond to a citizen information request?',
      sw: 'Chini ya Sheria ya Kupata Taarifa ya 2016, muda wa mwisho wa kisheria kwa idara ya serikali kujibu ombi la taarifa la mwananchi ni upi?',
    },
    options: [
      { id: 'a', text: { en: '21 days (or 48 hours if it concerns human life or liberty)', sw: 'Siku 21 (au saa 48 ikiwa inahusu uhai au uhuru wa mtu)' } },
      { id: 'b', text: { en: '90 days after parliamentary approval', sw: 'Siku 90 baada ya bunge kuidhinisha' } },
      { id: 'c', text: { en: '6 months after the end of the financial year', sw: 'Miezi 6 baada ya mwaka wa fedha kukamilika' } },
      { id: 'd', text: { en: 'Public bodies have no legal timeline to reply to citizens', sw: 'Idara za umma hazina kikomo chochote cha muda kisheria' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 9 of the Access to Information Act 2016 provides a strict 21-day timeline for standard requests, and within 48 hours when information concerns human liberty or security.',
      sw: 'Kifungu cha 9 kinatoa ukomo wa siku 21 kujibu ombi la kawaida la mwananchi, na ndani ya saa 48 ikiwa inahusu usalama au uhuru wa maisha.',
    },
  },

  // 7. County Annual Development Plan (ADP)
  {
    id: 'gq_07',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'County Budget Cycle & ADP Deadlines',
    constitutionalArticle: 'PFMA 2012 Section 126',
    difficulty: 'foundation',
    question: {
      en: 'By which statutory date must every County Executive table the Annual Development Plan (ADP) in the County Assembly?',
      sw: 'Kufikia tarehe gani ya kisheria Serikali ya Kaunti lazima iwasilishe Mpango wa Maendeleo wa Kila Mwaka (ADP) Bungeni?',
    },
    options: [
      { id: 'a', text: { en: 'August 30th of each year', sw: 'Tarehe 30 Agosti ya kila mwaka' } },
      { id: 'b', text: { en: 'December 31st of each year', sw: 'Tarehe 31 Desemba ya kila mwaka' } },
      { id: 'c', text: { en: 'April 30th of each year', sw: 'Tarehe 30 Aprili ya kila mwaka' } },
      { id: 'd', text: { en: 'June 30th of each year', sw: 'Tarehe 30 Juni ya kila mwaka' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 126(3) of the Public Finance Management Act 2012 mandates the County Executive Committee member for finance to submit the ADP to the County Assembly by no later than 30th August.',
      sw: 'Kifungu cha 126(3) cha Sheria ya PFMA kinaamuru Waziri wa Fedha wa Kaunti kuwasilisha ADP Bungeni kufikia tarehe 30 Agosti kila mwaka.',
    },
  },

  // 8. Role of Member of County Assembly (MCA)
  {
    id: 'gq_08',
    category: 'devolution',
    marks: 1,
    sourceTopic: 'MCA Oversight vs Executive Spending',
    constitutionalArticle: 'Article 185',
    difficulty: 'scenario',
    scenario: {
      en: 'An MCA informs youth in a village baraza that they personally own the county road construction machinery and will decide which contractor gets paid.',
      sw: 'Diwani anawaambia vijana kwenye baraza kwamba yeye binafsi ndiye anayemiliki mitambo ya barabara na ataamua mkandarasi anayelipwa.',
    },
    question: {
      en: 'Why is the MCA\'s statement unconstitutional under Article 185 and the County Governments Act?',
      sw: 'Kwa nini kauli ya Diwani inakiuka Katiba chini ya Kifungu cha 185 na Sheria ya Serikali za Kaunti?',
    },
    options: [
      { id: 'a', text: { en: 'MCAs are legislative and oversight officers, not executive accounting or spending officers', sw: 'Madiwani wana wajibu wa kutunga sheria na kusimamia, si kugawa zabuni au kulipa fedha za miradi' } },
      { id: 'b', text: { en: 'Only MPs have the right to operate county road excavators', sw: 'Wabunge pekee ndio wenye haki ya kuendesha mitambo ya barabara' } },
      { id: 'c', text: { en: 'MCAs can only spend funds if the governor is out of the country', sw: 'Madiwani wanaweza kutumia fedha tu ikiwa gavana yuko nje ya nchi' } },
      { id: 'd', text: { en: 'Village roads are under the direct management of the National Police Service', sw: 'Barabara za vijijini zinasimamiwa moja kwa moja na Jeshi la Polisi' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 185 defines the County Assembly as a legislative and oversight organ. Under separation of powers, MCAs cannot award tenders or handle executive expenditure without committing a conflict of interest violation under Chapter Six.',
      sw: 'Kifungu cha 185 kinaweka Bunge la Kaunti kama chombo cha kutunga sheria na uangalizi. Madiwani hawaruhusiwi kutekeleza kazi za kiutendaji au zabuni.',
    },
  },

  // 9. Chapter 6 Leadership and Integrity
  {
    id: 'gq_09',
    category: 'integrity',
    marks: 1,
    sourceTopic: 'Chapter 6 State Officer Ethics & Impeachment',
    constitutionalArticle: 'Article 73 & Article 75',
    difficulty: 'foundation',
    question: {
      en: 'Under Article 73 of the Constitution, how must authority assigned to a State officer be exercised?',
      sw: 'Chini ya Kifungu cha 73 cha Katiba, mamlaka aliyopewa kiongozi wa umma lazima yatekelezwe vipi?',
    },
    options: [
      { id: 'a', text: { en: 'To maximize personal wealth and commercial investments while in office', sw: 'Kujitajirisha kibinafsi na kulinda biashara zake akiwa afisini' } },
      { id: 'b', text: { en: 'As a public trust to be exercised with respect for the people, integrity, and accountability', sw: 'Kama dhamana ya umma inayopaswa kutekelezwa kwa heshima kwa wananchi, uadilifu na uwajibikaji' } },
      { id: 'c', text: { en: 'In accordance with the private interests of political party financiers', sw: 'Kulingana na maelekezo ya wafadhili wa chama cha kisiasa' } },
      { id: 'd', text: { en: 'Without any audit scrutiny from the Ethics and Anti-Corruption Commission', sw: 'Bila ukaguzi wowote kutoka kwa Tume ya Maadili (EACC)' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Article 73(1) commands that authority assigned to a State officer is a public trust to be exercised in a manner that demonstrates respect for the people, brings honor to the nation, and promotes public confidence.',
      sw: 'Kifungu cha 73(1) kinatamka kuwa mamlaka ya kiongozi wa umma ni dhamana anayopewa kuwatumikia wananchi kwa uadilifu, nidhamu na heshima.',
    },
  },

  // 10. Access to Government Procurement Opportunities (AGPO)
  {
    id: 'gq_10',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'AGPO 30% Procurement Quota',
    constitutionalArticle: 'Article 227 & Public Procurement Act 2015',
    difficulty: 'foundation',
    question: {
      en: 'What percentage of all public procurement tenders is legally reserved for Youth, Women, and Persons with Disabilities (AGPO) in Kenya?',
      sw: 'Ni asilimia ngapi ya zabuni zote za umma iliyotengwa kisheria kwa Vijana, Wanawake, na Walemavu (AGPO) nchini Kenya?',
    },
    options: [
      { id: 'a', text: { en: 'At least 30% of total public procurement spend', sw: 'Angalau asilimia 30 ya zabuni zote za umma' } },
      { id: 'b', text: { en: 'Only 5% if surplus funds exist', sw: 'Asilimia 5 tu ikiwa fedha za ziada zimesalia' } },
      { id: 'c', text: { en: '50% reserved exclusively for national ministries', sw: 'Asilimia 50 kwa wizara za kitaifa pekee' } },
      { id: 'd', text: { en: 'AGPO quotas are voluntary guidelines with no legal binding force', sw: 'AGPO ni miongozo ya hiari isiyo na nguvu ya kisheria' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Under Article 227 and Section 157 of the Public Procurement and Asset Disposal Act 2015, public entities must allocate not less than 30% of their annual procurement spend to enterprises owned by youth, women, and PWDs.',
      sw: 'Sheria ya Ununuzi wa Umma (PPADA 2015) inalazimu kila taasisi ya serikali kutenga angalau 30% ya zabuni zake kwa vijana, wanawake na walemavu.',
    },
  },

  // 11. Article 43 Economic and Social Rights
  {
    id: 'gq_11',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'Article 43 Health & Water Rights',
    constitutionalArticle: 'Article 43(1)',
    difficulty: 'scenario',
    scenario: {
      en: 'A level 4 county hospital turns away an emergency accident victim claiming they must first pay KES 5,000 cash before any doctor can attend to them.',
      sw: 'Hospitali ya kaunti inamkataa majeruhi wa dharura wa ajali kwa madai kwamba lazima alipe Shilingi 5,000 kabla daktari hajamgusa.',
    },
    question: {
      en: 'Which specific constitutional provision does the hospital directly violate?',
      sw: 'Hospitali hiyo inakiuka moja kwa moja kifungu kipi cha katiba?',
    },
    options: [
      { id: 'a', text: { en: 'Article 43(2): "A person shall not be denied emergency medical treatment."', sw: 'Kifungu cha 43(2): "Mtu yeyote hatanyimwa matibabu ya dharura."' } },
      { id: 'b', text: { en: 'Article 114 Money Bills procedure', sw: 'Kifungu cha 114 kuhusu miswada ya fedha' } },
      { id: 'c', text: { en: 'Article 88 IEBC election boundaries regulations', sw: 'Kifungu cha 88 kuhusu mipaka ya uchaguzi ya IEBC' } },
      { id: 'd', text: { en: 'County hospitals are exempt from the Bill of Rights during night hours', sw: 'Hospitali za kaunti hazifungwi na Hati ya Haki nyakati za usiku' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 43(2) is unequivocal: no person in Kenya shall be denied emergency medical treatment by any health facility, public or private.',
      sw: 'Kifungu cha 43(2) kiko wazi: mtu yeyote hatanyimwa matibabu ya dharura katika kituo chochote cha afya cha umma au cha kibinafsi.',
    },
  },

  // 12. Community Land Act 2016 & Collective Titling
  {
    id: 'gq_12',
    category: 'environment',
    marks: 1,
    sourceTopic: 'Community Land Act 2016 & Ancestral Tenure',
    constitutionalArticle: 'Article 63 & Community Land Act',
    difficulty: 'advanced_analysis',
    question: {
      en: 'Under Article 63 of the Constitution and the Community Land Act 2016, how is unregistered community land held?',
      sw: 'Chini ya Kifungu cha 63 cha Katiba na Sheria ya Ardhi ya Jamii ya 2016, ardhi ya jamii ambayo haijasajiliwa inashikiliwa vipi?',
    },
    options: [
      { id: 'a', text: { en: 'Held in trust by county governments on behalf of the resident communities, and cannot be alienated without community consent', sw: 'Inashikiliwa kwa amana na serikali ya kaunti kwa niaba ya jamii, na haiwezi kuuzwa bila idhini ya jamii' } },
      { id: 'b', text: { en: 'Automatically becomes private property of the sitting County Governor', sw: 'Inakuwa mali ya kibinafsi ya Gavana wa Kaunti aliyeko afisini' } },
      { id: 'c', text: { en: 'Transferred immediately to private commercial mining conglomerates', sw: 'Inakabidhiwa mara moja kampuni za kibinafsi za uchimbaji madini' } },
      { id: 'd', text: { en: 'Becomes public military training grounds without legal notice', sw: 'Inageuzwa kuwa eneo la mafunzo ya kijeshi bila ilani yoyote' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 63(3) dictates that any unregistered community land shall be held in trust by county governments on behalf of the communities for whom it is held. County governments cannot sell or convert it to private land.',
      sw: 'Kifungu cha 63(3) kinabainisha kuwa ardhi ya jamii ambayo haijasajiliwa inashikiliwa kwa amana na serikali za kaunti kwa niaba ya jamii zenyewe.',
    },
  },

  // 13. Environmental Rights & Article 70 Enforcement
  {
    id: 'gq_13',
    category: 'environment',
    marks: 1,
    sourceTopic: 'Article 42 & Article 70 Environmental Remedies',
    constitutionalArticle: 'Article 42 & Article 70',
    difficulty: 'foundation',
    question: {
      en: 'What legal remedies can a court grant under Article 70 when a citizen proves environmental contamination or destruction?',
      sw: 'Mahakama inaweza kutoa maagizo gani chini ya Kifungu cha 70 mwananchi akithibitisha uharibifu wa mazingira?',
    },
    options: [
      { id: 'a', text: { en: 'An injunction to halt harmful activities, order environmental restoration, or award compensation', sw: 'Amri ya kusitisha uchafuzi, amri ya kurekebisha mazingira, au fidia kwa waathiriwa' } },
      { id: 'b', text: { en: 'Only an advisory warning with no financial or legal consequences', sw: 'Onyo la maneno tu lisilo na uzito wowote wa kisheria au kifedha' } },
      { id: 'c', text: { en: 'Dismiss the petition unless the citizen owns 100 acres in the affected area', sw: 'Kutupilia mbali kesi ikiwa mwananchi hamiliki ekari 100 katika eneo hilo' } },
      { id: 'd', text: { en: 'Transfer the affected river or land to an overseas offshore company', sw: 'Kuhamisha mto au ardhi iliyoathiriwa kwa kampuni ya kigeni' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 70 empowers the High Court to issue orders to prevent, stop, or discontinue any act harmful to the environment, compel restoration, and provide compensation.',
      sw: 'Kifungu cha 70 kinapa mahakama uwezo wa kutoa amri za kusitisha uchafuzi mara moja, kurejesha mazingira katika hali yake, na kutoa fidia.',
    },
  },

  // 14. Independent Policing Oversight Authority (IPOA) Act
  {
    id: 'gq_14',
    category: 'police_oversight',
    marks: 1,
    sourceTopic: 'IPOA Mandate & Sec. 25 Complaints',
    constitutionalArticle: 'IPOA Act 2011 Section 25',
    difficulty: 'foundation',
    question: {
      en: 'What is the primary statutory function of the Independent Policing Oversight Authority (IPOA) in Kenya?',
      sw: 'Jukumu kuu la kisheria la Mamlaka Huru ya Kusimamia Utendaji Kazi wa Polisi (IPOA) nchini Kenya ni lipi?',
    },
    options: [
      { id: 'a', text: { en: 'To purchase weapons and ammunition for the National Police Service', sw: 'Kununua silaha na risasi kwa ajili ya Jeshi la Polisi' } },
      { id: 'b', text: { en: 'To investigate deaths, serious injuries, and misconduct caused by police officers independently', sw: 'Kuchunguza vifo, majeraha mabaya na utovu wa nidhamu unaofanywa na maafisa wa polisi kwa uhuru kamili' } },
      { id: 'c', text: { en: 'To represent police officers in commercial civil land disputes', sw: 'Kuwawakilisha polisi katika kesi za kibinafsi za migogoro ya ardhi' } },
      { id: 'd', text: { en: 'To manage county traffic lights and parking fee collections', sw: 'Kusimamia taa za barabarani na ada za maegesho ya magari' } },
    ],
    correctOptionId: 'b',
    explanation: {
      en: 'Section 5 and Section 25 of the IPOA Act 2011 mandate IPOA to investigate police brutality, unlawful deaths, and human rights violations committed by members of the police service.',
      sw: 'IPOA iliundwa na sheria ya bunge kuchunguza ukatili, vifo mikononi mwa polisi na dhuluma za maafisa bila upendeleo.',
    },
  },

  // 15. Fourth Schedule Devolution Division of Functions
  {
    id: 'gq_15',
    category: 'devolution',
    marks: 1,
    sourceTopic: 'Fourth Schedule Devolution Functions',
    constitutionalArticle: 'Fourth Schedule Part 2',
    difficulty: 'foundation',
    question: {
      en: 'Which of the following functions is fully devolved to County Governments under Part 2 of the Fourth Schedule?',
      sw: 'Kati ya majukumu yafuatayo, lipi lililogatuliwa kikamilifu kwa Serikali za Kaunti chini ya Sehemu ya 2 ya Ratiba ya Nne?',
    },
    options: [
      { id: 'a', text: { en: 'County health services (dispensaries, level 4-5 hospitals, and public health)', sw: 'Huduma za afya za kaunti (zahanati, hospitali za kaunti na afya ya umma)' } },
      { id: 'b', text: { en: 'National defense and military forces', sw: 'Ulinzi wa nchi na jeshi la ulinzi (KDF)' } },
      { id: 'c', text: { en: 'Foreign affairs and international diplomacy', sw: 'Mambo ya nje na uhusiano wa kimataifa' } },
      { id: 'd', text: { en: 'National currency and monetary policy', sw: 'Sarafu ya taifa na sera za kifedha za Benki Kuu' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Under Fourth Schedule Part 2, County Governments manage county health services, county transport, agriculture, trade development, and pre-primary education (ECDE).',
      sw: 'Ratiba ya Nne inakabidhi serikali za kaunti usimamizi kamili wa huduma za afya, kilimo, biashara za ndani, barabara za vijijini na elimu ya chekechea (ECDE).',
    },
  },

  // 16. NG-CDF Boundaries & National Functions
  {
    id: 'gq_16',
    category: 'government',
    marks: 1,
    sourceTopic: 'NG-CDF Act 2015 vs County Functions',
    constitutionalArticle: 'NG-CDF Act 2015 & Fourth Schedule Part 1',
    difficulty: 'scenario',
    scenario: {
      en: 'A citizen approaches their Member of Parliament (MP) demanding that the NG-CDF fund build a county village borehole and repair local dispensary beds.',
      sw: 'Mwananchi anamwendea Mbunge wake akidai kwamba fedha za NG-CDF zitumike kuchimba kisima cha kijiji na kununua vitanda vya zahanati.',
    },
    question: {
      en: 'Why is this request outside the legal mandate of the NG-CDF under the NG-CDF Act 2015?',
      sw: 'Kwa nini ombi hili liko nje ya majukumu ya kisheria ya NG-CDF chini ya Sheria ya NG-CDF ya 2015?',
    },
    options: [
      { id: 'a', text: { en: 'NG-CDF is strictly restricted to national government functions (such as secondary schools and security posts), while health and water are devolved county functions under the Governor', sw: 'NG-CDF imetengwa kwa majukumu ya serikali ya kitaifa (kama shule za upili na usalama), wakati afya na maji ni majukumu ya kaunti chini ya Gavana' } },
      { id: 'b', text: { en: 'MPs are not allowed to spend any development money in rural areas', sw: 'Wabunge hawaruhusiwi kutumia fedha zozote za maendeleo vijijini' } },
      { id: 'c', text: { en: 'Boreholes can only be funded by international charitable donations', sw: 'Visima vya maji vinaweza kufadhiliwa tu na mashirika ya kigeni' } },
      { id: 'd', text: { en: 'Dispensary beds can only be procured by the High Court Registrar', sw: 'Vitanda vya zahanati vinaweza kununuliwa tu na Msajili wa Mahakama Kuu' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Following the High Court and Court of Appeal rulings on NG-CDF, the fund can only support national government constitutional functions (primarily basic secondary education infrastructure and national security installations).',
      sw: 'Mahakama iliamua kwamba fedha za NG-CDF zitumike tu kwa majukumu ya kitaifa kama elimu ya sekondari na vituo vya polisi, si miradi ya kaunti kama zahanati na maji.',
    },
  },

  // 17. Commission on Administrative Justice (Ombudsman)
  {
    id: 'gq_17',
    category: 'government',
    marks: 1,
    sourceTopic: 'Ombudsman & Maladministration Inquiries',
    constitutionalArticle: 'Article 59 & CAJ Act 2011',
    difficulty: 'foundation',
    question: {
      en: 'When should a citizen file a formal complaint with the Commission on Administrative Justice (Office of the Ombudsman)?',
      sw: 'Ni lini mwananchi anapaswa kuwasilisha malalamiko kwa Tume ya Utawala wa Haki (Ofisi ya Ombudsman)?',
    },
    options: [
      { id: 'a', text: { en: 'When experiencing administrative injustice, unreasonable delays, arrogance, or refusal by public officials to provide lawful service', sw: 'Anapokumbana na ucheleweshaji usio na sababu, jeuri ya maafisa wa serikali, au kukataliwa huduma ya kisheria' } },
      { id: 'b', text: { en: 'Only when filing criminal murder charges against foreign ambassadors', sw: 'Wakati wa kushtaki mabalozi wa nchi za kigeni kwa makosa ya jinai' } },
      { id: 'c', text: { en: 'To register commercial copyright patents for computer software', sw: 'Kusajili hati miliki za kibiashara za programu za kompyuta' } },
      { id: 'd', text: { en: 'To challenge national election presidential tallies within 7 days', sw: 'Kupinga matokeo ya uchaguzi wa urais ndani ya siku saba' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'The Ombudsman is mandated to inquire into allegations of maladministration, delay, discourtesy, incompetence, and abuse of administrative power in all public offices.',
      sw: 'Ombudsman huchunguza utendaji mbovu wa kazi, ucheleweshaji wa makusudi wa huduma, dharau, na matumizi mabaya ya mamlaka katika ofisi za umma.',
    },
  },

  // 18. Social Audit Methodology
  {
    id: 'gq_18',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'Social Audit Committees & Bill of Quantities',
    constitutionalArticle: 'Article 35 & Article 201',
    difficulty: 'scenario',
    scenario: {
      en: 'A village committee conducts a social audit on an uncompleted 5km murram road and finds the contractor only laid 1.5km but claimed full KES 12M payment.',
      sw: 'Kamati ya kijiji inafanya ukaguzi wa mradi wa barabara ya kilomita 5 na kugundua mkandarasi alijenga kilomita 1.5 pekee lakini akadai malipo kamili ya Milioni 12.',
    },
    question: {
      en: 'What primary statutory document should the community requisition under Article 35 to verify contractual obligations?',
      sw: 'Ni nyaraka gani kuu ya kisheria ambayo jamii inapaswa kudai chini ya Kifungu cha 35 kuthibitisha majukumu ya mkandarasi?',
    },
    options: [
      { id: 'a', text: { en: 'The Bill of Quantities (BQ), signed contract specifications, and interim completion certificates', sw: 'Waraka wa Makadirio ya Vifaa (Bill of Quantities - BQ), mkataba wa ujenzi na vyeti vya ukamilishaji kazi' } },
      { id: 'b', text: { en: 'The personal bank account passbook of the contractor\'s spouse', sw: 'Kitabu cha benki cha mke au mume wa mkandarasi' } },
      { id: 'c', text: { en: 'A private letter from the area chief stamped with secret wax', sw: 'Barua ya siri ya chifu wa eneo iliyotiwa nta ya siri' } },
      { id: 'd', text: { en: 'Only national intelligence clearances', sw: 'Vyeti vya idara ya ujasusi ya taifa' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'The Bill of Quantities (BQ) and procurement contract outline the exact scope, materials, dimensions, and financial stages. Citizens have the right under Article 35 to inspect these public project records.',
      sw: 'Waraka wa BQ na mkataba wa zabuni unaeleza vipimo kamili vya barabara na vifaa. Wananchi wana haki kamili ya kukagua nyaraka hizi za umma.',
    },
  },

  // 19. Freedom of Expression & Boundaries
  {
    id: 'gq_19',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'Article 33 Freedom of Expression Boundaries',
    constitutionalArticle: 'Article 33(2)',
    difficulty: 'foundation',
    question: {
      en: 'Under Article 33(2) of the Constitution, which of the following is explicitly EXCLUDED from the freedom of expression?',
      sw: 'Chini ya Kifungu cha 33(2) cha Katiba, lipi kati ya yafuatayo LIMEZUIWA waziwazi na halilindwi na uhuru wa kujieleza?',
    },
    options: [
      { id: 'a', text: { en: 'Propaganda for war, incitement to violence, hate speech, or advocacy of hatred', sw: 'Propaganda ya vita, uchochezi wa ghasia, matamshi ya chuki, au kueneza chuki dhidi ya jamii' } },
      { id: 'b', text: { en: 'Criticizing public budget spending in a county assembly baraza', sw: 'Kukosoa matumizi ya bajeti katika mkutano wa bunge la kaunti' } },
      { id: 'c', text: { en: 'Publishing academic research on historical human rights abuses', sw: 'Kuchapisha tafiti za kitaaluma kuhusu ukiukaji wa haki za binadamu' } },
      { id: 'd', text: { en: 'Expressing peaceful political opinions during election campaigns', sw: 'Kueleza maoni ya kisiasa kwa njia ya amani wakati wa kampeni' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 33(2) states that freedom of expression does not extend to propaganda for war, incitement to violence, hate speech, or advocacy of hatred based on ethnic origin or discrimination.',
      sw: 'Kifungu cha 33(2) kinaweka mipaka kwamba uhuru wa kujieleza hauhusu propaganda za vita, uchochezi wa vurugu, matamshi ya chuki au ubaguzi wa kikabila.',
    },
  },

  // 20. Contemporaneous Logging for Incident Reports
  {
    id: 'gq_20',
    category: 'police_oversight',
    marks: 1,
    sourceTopic: 'Evidentiary Standards & The 5 Ws and H',
    constitutionalArticle: 'Evidence Act (Cap 80) & Criminal Procedure Code',
    difficulty: 'scenario',
    scenario: {
      en: 'A civic monitor witnesses police using excessive teargas inside a peaceful market baraza, injuring elders and fruit vendors.',
      sw: 'Mfuatiliaji wa haki anashuhudia polisi wakitumia vitoa machozi kupita kiasi kwenye mkutano wa amani sokoni na kuumiza wazee na wachuuzi.',
    },
    question: {
      en: 'What is the "Golden Rule of Contemporaneous Documentation" for an admissible incident report?',
      sw: 'Kanuni ya dhahabu ya uandishi wa ripoti ya tukio (Contemporaneous Documentation) ili ikubalike mahakamani ni ipi?',
    },
    options: [
      { id: 'a', text: { en: 'Record the exact Who, What, When, Where, Why, and How within 2 hours while recollections and physical evidence are fresh', sw: 'Kurekodi kwa usahihi Nani, Nini, Lini, Wapi, Kwa Nini, na Vipi ndani ya saa 2 kumbukumbu na ushahidi zikiwa bado mbichi' } },
      { id: 'b', text: { en: 'Wait at least 3 months to see if the police issue an apology first', sw: 'Kusubiri angalau miezi mitatu kuona kama polisi wataomba msamaha kwanza' } },
      { id: 'c', text: { en: 'Delete all photo EXIF metadata to reduce file storage sizes on phones', sw: 'Kufuta taarifa zote za muda na kamera kwenye picha ili kupunguza ukubwa wa faili' } },
      { id: 'd', text: { en: 'Write fictional statements using pseudonyms without dates', sw: 'Kuandika majina ya kubuni bila tarehe wala saa' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Under the Evidence Act (Cap 80), contemporaneous notes written immediately during or after an occurrence carry the highest evidentiary probative weight in judicial proceedings.',
      sw: 'Chini ya Sheria ya Ushahidi, kumbukumbu zilizoandikwa papo hapo wakati wa tukio ndizo zenye uzito wa juu zaidi wa kisheria mahakamani.',
    },
  },

  // 21. Article 119 Citizen Petition Rights
  {
    id: 'gq_21',
    category: 'participation',
    marks: 1,
    sourceTopic: 'Citizen Petitions under Article 119',
    constitutionalArticle: 'Article 119',
    difficulty: 'foundation',
    question: {
      en: 'What right is guaranteed to every citizen under Article 119 of the Constitution?',
      sw: 'Ni haki gani anayopewa kila mwananchi chini ya Kifungu cha 119 cha Katiba?',
    },
    options: [
      { id: 'a', text: { en: 'The right to petition Parliament or County Assemblies to consider any matter within its authority', sw: 'Haki ya kuwasilisha ombi rasmi (petition) Bungeni au Bunge la Kaunti kushughulikia jambo lolote' } },
      { id: 'b', text: { en: 'The right to dissolve the Judiciary without court approval', sw: 'Haki ya kuvunja Idara ya Mahakama bila idhini ya jaji' } },
      { id: 'c', text: { en: 'The right to refuse paying national revenue taxes unilaterally', sw: 'Haki ya kukataa kulipa kodi ya mapato ya serikali bila sababu' } },
      { id: 'd', text: { en: 'The right to appoint personal relatives as county ministers', sw: 'Haki ya kuteua ndugu zake kuwa mawaziri wa serikali ya kaunti' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 119(1) provides that every person has a right to petition Parliament or a County Assembly to consider any matter within its authority, including enacting, amending or repealing legislation.',
      sw: 'Kifungu cha 119(1) kinampa kila mwananchi haki ya kupeleka ombi rasmi Bungeni kutunga sheria, kurekebisha sheria au kushughulikia kero ya umma.',
    },
  },

  // 22. Mutunga Rules on Constitutional Court Filing Fees
  {
    id: 'gq_22',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'Mutunga Rules (Constitution of Kenya Protection of Rights Rules)',
    constitutionalArticle: 'Article 22 & Mutunga Rules 2013',
    difficulty: 'advanced_analysis',
    question: {
      en: 'How do the Chief Justice\'s Mutunga Rules protect indigent citizens seeking constitutional justice in Kenya?',
      sw: 'Kanuni za Jaji Mkuu za Mutunga zinamkinga vipi mwananchi asiye na uwezo anapotafuta haki ya kikatiba kortini?',
    },
    options: [
      { id: 'a', text: { en: 'Constitutional petitions under Article 22 cannot be rejected or denied access solely due to an inability to pay court filing fees', sw: 'Kesi za kikatiba chini ya Kifungu cha 22 haziwezi kukataliwa kwa sababu ya kukosa ada ya kulipa mahakamani' } },
      { id: 'b', text: { en: 'Citizens are given free luxury vehicles to attend court sessions in Nairobi', sw: 'Wananchi wanapewa magari ya kifahari ya bure kuhudhuria vikao vya korti' } },
      { id: 'c', text: { en: 'Petitions must only be argued in Latin without translation', sw: 'Kesi zote lazima ziendeshwe kwa lugha ya Kilatini bila tafsiri' } },
      { id: 'd', text: { en: 'Filing fees must be paid in gold coins directly to the registrar', sw: 'Ada lazima zilipwe kwa sarafu za dhahabu moja kwa moja kwa msajili' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'The Constitution of Kenya (Protection of Rights and Fundamental Freedoms) Practice and Procedure Rules dictate that no person shall be denied access to justice in rights petitions on grounds of fees.',
      sw: 'Kanuni za Mahakama zinaamuru kwamba hakuna mwananchi atakayenyimwa haki ya kikatiba kwa sababu ya kukosa ada ya kufungua kesi.',
    },
  },

  // 23. Kenya National Commission on Human Rights (KNCHR)
  {
    id: 'gq_23',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'KNCHR Constitutional Commission Mandate',
    constitutionalArticle: 'Article 59 & KNCHR Act',
    difficulty: 'foundation',
    question: {
      en: 'What constitutional power does the Kenya National Commission on Human Rights (KNCHR) possess regarding human rights abuses?',
      sw: 'Tume ya Kitaifa ya Haki za Binadamu (KNCHR) ina mamlaka gani ya kikatiba kuhusu ukiukaji wa haki za binadamu?',
    },
    options: [
      { id: 'a', text: { en: 'Power to investigate violations on its own initiative (suo motu), summon witnesses, and visit places of detention unannounced', sw: 'Mamlaka ya kuanzisha uchunguzi wenyewe (suo motu), kuitisha mashahidi na kukagua vituo vya mahabusu bila taarifa' } },
      { id: 'b', text: { en: 'Power to disband county governments during budget strikes', sw: 'Mamlaka ya kuvunja serikali za kaunti wakati wa migomo ya bajeti' } },
      { id: 'c', text: { en: 'Power to impose criminal prison sentences without trial', sw: 'Mamlaka ya kufunga watu jela bila kuwapeleka mahakamani' } },
      { id: 'd', text: { en: 'Power to issue commercial international flight licenses', sw: 'Mamlaka ya kutoa leseni za ndege za kibiashara za kimataifa' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'KNCHR has quasi-judicial powers to summon witnesses, demand production of documents, inspect state prisons and police cells unhindered, and institute court actions.',
      sw: 'KNCHR ina mamlaka ya kuitisha mashahidi, kukagua mahabusu na magereza ya serikali bila kizuizi, na kufungua kesi kutetea haki za binadamu.',
    },
  },

  // 24. County Fiscal Strategy Paper (CFSP)
  {
    id: 'gq_24',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'CFSP Budget Ceilings',
    constitutionalArticle: 'PFMA Section 117',
    difficulty: 'foundation',
    question: {
      en: 'What is the role of the County Fiscal Strategy Paper (CFSP) submitted by February 28th in the county budget cycle?',
      sw: 'Wajibu wa Waraka wa Mikakati ya Fedha (CFSP) unaowasilishwa kufikia Februari 28 katika mzunguko wa bajeti ya kaunti ni upi?',
    },
    options: [
      { id: 'a', text: { en: 'It establishes broad sector spending ceilings (e.g. allocating how much total money goes to Health vs Roads)', sw: 'Unaweka viwango vya juu vya mgao wa fedha kwa kila sekta (kama vile afya, maji na barabara)' } },
      { id: 'b', text: { en: 'It dissolves the county assembly if MCAs fail to pass the bill in 24 hours', sw: 'Unavunja bunge la kaunti ikiwa madiwani hawatapitisha mswada kwa saa 24' } },
      { id: 'c', text: { en: 'It prints currency notes for the county governor\'s office', sw: 'Unachapisha noti za pesa kwa ajili ya ofisi ya gavana wa kaunti' } },
      { id: 'd', text: { en: 'It cancels all county trade licenses issued in the previous year', sw: 'Unafuta leseni zote za biashara zilizotolewa mwaka uliopita' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 117 of the PFMA requires the CFSP to set priority sectors and financial allocations/ceilings for departments, providing the framework for detailed April budget estimates.',
      sw: 'CFSP inaweka viwango vya mgao wa fedha kwa kila idara ya kaunti, ikitoa mwongozo wa makadirio kamili ya bajeti ya mwezi Aprili.',
    },
  },

  // 25. National Cohesion and Integration Act 2008
  {
    id: 'gq_25',
    category: 'integrity',
    marks: 1,
    sourceTopic: 'Countering Ethnic Polarization & Hate Speech',
    constitutionalArticle: 'NCIC Act 2008 & County Governments Act Sec. 65',
    difficulty: 'scenario',
    scenario: {
      en: 'A county public service board conducts recruitments where 95% of all newly employed staff belong to one dominant ethnic group.',
      sw: 'Bodi ya huduma za umma ya kaunti inaajiri wafanyakazi ambapo 95% wanatoka kwenye kabila moja pekee linalotawala eneo hilo.',
    },
    question: {
      en: 'Which statutory quota under Section 65 of the County Governments Act is directly violated?',
      sw: 'Ni sheria gani ya mgao wa nafasi za kazi chini ya Kifungu cha 65 cha Sheria ya Serikali za Kaunti inayokiukwa moja kwa moja?',
    },
    options: [
      { id: 'a', text: { en: 'At least 30% of all county public service recruits must be from non-dominant ethnic communities in the county', sw: 'Angalau asilimia 30 ya wafanyakazi wa kaunti lazima watoke kwenye jamii ndogo zisizotawala kaunti hiyo' } },
      { id: 'b', text: { en: 'All 100% of employees must be chosen by lottery draw on national television', sw: 'Wafanyakazi wote 100% lazima wachaguliwe kwa bahati nasibu kwenye runinga' } },
      { id: 'c', text: { en: 'Counties cannot employ any citizens under age 40', sw: 'Kaunti haziruhusiwi kuajiri raia yeyote aliye chini ya umri wa miaka 40' } },
      { id: 'd', text: { en: 'Public service recruitments are exempt from diversity requirements', sw: 'Ajira za kaunti hazifungwi na kanuni za uwakilishi wa jamii mbalimbali' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 65(1)(e) of the County Governments Act 2012 strictly mandates that at least 30% of county public service vacancies must be allocated to candidates who are not from the dominant ethnic group in the county.',
      sw: 'Kifungu cha 65(1)(e) kinalazimu angalau 30% ya nafasi za kazi za kaunti kutengwa kwa jamii ndogo ili kuzuia upendeleo wa kikabila na kuboresha mshikamano.',
    },
  },

  // 26. Article 201 Equitable Resource Sharing
  {
    id: 'gq_26',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'Article 201 Principles of Public Finance',
    constitutionalArticle: 'Article 201(b)',
    difficulty: 'foundation',
    question: {
      en: 'Under Article 201(b) of the Constitution, what principle governs the sharing of public burdens and benefits?',
      sw: 'Chini ya Kifungu cha 201(b) cha Katiba, ni kanuni gani inayoongoza mgawanyo wa mzigo wa kodi na manufaa ya maendeleo?',
    },
    options: [
      { id: 'a', text: { en: 'Revenue shall be shared equitably between national and county governments, and burdens must be shared equitably between present and future generations', sw: 'Mapato yagawanywe kwa usawa kati ya serikali ya taifa na za kaunti, na mzigo ugawanywe kwa haki kati ya kizazi cha sasa na kijacho' } },
      { id: 'b', text: { en: 'Rich counties must keep all taxes and contribute nothing to equalization funds', sw: 'Kaunti tajiri zibaki na kodi zote na zisichangie chochote kwenye hazina ya usawa' } },
      { id: 'c', text: { en: 'Current generations should borrow maximum loans and leave all repayment to future citizens', sw: 'Kizazi cha sasa kikope mikopo mikubwa na kuwaachia wananchi wa kesho deni lote' } },
      { id: 'd', text: { en: 'Public finance principles apply only to private banking corporations', sw: 'Misingi ya fedha za umma inatumika tu kwa benki za kibinafsi' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 201(b) establishes intergenerational equity and fair distribution: the burden of tax and public debt shall be shared equitably between present and future generations.',
      sw: 'Kifungu cha 201(b) kinasisitiza haki ya vizazi: mzigo wa madeni na kodi lazima ugawanywe kwa usawa ili kutowatwika wananchi wa kesho madeni yasiyolipika.',
    },
  },

  // 27. Article 37 Freedom of Assembly, Demonstration & Picketing
  {
    id: 'gq_27',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'Article 37 Peaceful Picketing vs Police Permits',
    constitutionalArticle: 'Article 37 & Public Order Act',
    difficulty: 'scenario',
    scenario: {
      en: 'Police officers break up a peaceful citizen demonstration protesting water shortages in Kwale, claiming the protesters did not receive "police permission".',
      sw: 'Polisi wanatawanya maandamano ya amani ya wananchi wakidai maji Kwale, kwa madai kuwa hawakupewa "ruhusa ya polisi".',
    },
    question: {
      en: 'What is the correct constitutional position under Article 37 and High Court jurisprudence regarding demonstrations in Kenya?',
      sw: 'Msimamo sahihi wa kikatiba chini ya Kifungu cha 37 na maamuzi ya Mahakama Kuu kuhusu maandamano ni upi?',
    },
    options: [
      { id: 'a', text: { en: 'Every person has the right, peaceably and unarmed, to assemble, demonstrate, and present petitions. Citizens only notify the police for security escorts; police do not grant permission.', sw: 'Kila mtu ana haki ya kukusanyika na kuandamana kwa amani bila silaha. Wananchi hutoa tu taarifa kwa polisi kwa ulinzi; polisi hawatoi ruhusa ya kikatiba.' } },
      { id: 'b', text: { en: 'Demonstrations are strictly forbidden in all 47 counties of Kenya', sw: 'Maandamano yamepigwa marufuku katika kaunti zote 47 za Kenya' } },
      { id: 'c', text: { en: 'Citizens must pay KES 200,000 demonstration permit fees to the Station Commander', sw: 'Wananchi lazima walipe ada ya Shilingi 200,000 kwa Mkuu wa Kituo kabla ya kuandamana' } },
      { id: 'd', text: { en: 'Only political party officials with diplomatic passports can picket', sw: 'Viongozi wa vyama vya kisiasa pekee wenye pasipoti maalum ndio wanaoweza kuandamana' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 37 grants an unqualified right to assemble and picket peaceably and unarmed. Under the Public Order Act as interpreted in High Court rulings, the requirement is notification for police to provide security, not administrative permission.',
      sw: 'Kifungu cha 37 kinatoa haki ya kuandamana kwa amani bila silaha. Sheria inataka taarifa ya usalama kwa polisi, si kuomba ruhusa ya kibinafsi kutoka kwa polisi.',
    },
  },

  // 28. Whistleblower Protection & Anti-Corruption Reporting
  {
    id: 'gq_28',
    category: 'integrity',
    marks: 1,
    sourceTopic: 'Whistleblower Protection & EACC Mandate',
    constitutionalArticle: 'ACECA 2003 & Witness Protection Act',
    difficulty: 'foundation',
    question: {
      en: 'What legal protection is afforded to a citizen who reports corruption or bribery to the Ethics and Anti-Corruption Commission (EACC)?',
      sw: 'Ni ulinzi gani wa kisheria unaopewa mwananchi anayeripoti ufisadi au hongo kwa Tume ya Maadili (EACC)?',
    },
    options: [
      { id: 'a', text: { en: 'Protection from civil or criminal liability and retaliation under the Anti-Corruption and Economic Crimes Act and Witness Protection Act', sw: 'Ulinzi dhidi ya kufunguliwa mashtaka, kushtakiwa au kulipiziwa kisasi chini ya Sheria ya Kuzuia Ufisadi na Sheria ya Kulinda Mashahidi' } },
      { id: 'b', text: { en: 'Immediate dismissal from all government employment', sw: 'Kufutwa kazi mara moja kutoka kwa ajira yoyote ya serikali' } },
      { id: 'c', text: { en: 'The EACC publishes the whistleblower\'s home address on social media', sw: 'EACC kuchapisha anwani ya nyumba ya mtoa taarifa mitandaoni' } },
      { id: 'd', text: { en: 'The whistleblower must pay the accused official a monthly apology fee', sw: 'Mtoa taarifa kulipa afisa anayeshukiwa ada ya kila mwezi ya kuomba msamaha' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 65 of the Anti-Corruption and Economic Crimes Act (ACECA 2003) and the Witness Protection Act protect whistleblowers and informants from victimisation, civil actions, and employer retaliation.',
      sw: 'Sheria ya Kuzuia Ufisadi na Sheria ya Kulinda Mashahidi inatoa kinga kamili kwa watoa taarifa dhidi ya kufunguliwa kesi au kuonewa kazini.',
    },
  },

  // 29. Two-Thirds Gender Rule
  {
    id: 'gq_29',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'Article 27(8) & Article 81 Two-Thirds Gender Principle',
    constitutionalArticle: 'Article 27(8) & Article 81(b)',
    difficulty: 'foundation',
    question: {
      en: 'What does the constitutional "Two-Thirds Gender Principle" mandate across all appointive and elective public bodies?',
      sw: 'Kanuni ya kikatiba ya "Thuluthi Mbili ya Jinsia" (Two-Thirds Gender Rule) inalazimu nini katika vyombo vyote vya umma vya kuteuliwa na kuchaguliwa?',
    },
    options: [
      { id: 'a', text: { en: 'Not more than two-thirds of the members of any elective or appointive public body shall be of the same gender', sw: 'Isizidi thuluthi mbili (2/3) ya wajumbe wa chombo chochote cha umma kuwa wa jinsia moja' } },
      { id: 'b', text: { en: 'All county assembly committees must be composed of 100% men', sw: 'Kamati zote za bunge la kaunti ziwe na wanaume pekee 100%' } },
      { id: 'c', text: { en: 'Women are barred from holding finance positions in government', sw: 'Wanawake wazuiwe kushikilia nyadhifa za fedha serikalini' } },
      { id: 'd', text: { en: 'The rule applies only to non-governmental sports clubs', sw: 'Kanuni hii inatumika tu kwa vilabu vya michezo vya kibinafsi' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 27(8) and Article 81(b) specify that the State shall take legislative and other measures to implement the principle that not more than two-thirds of the members of elective or appointive bodies shall be of the same gender.',
      sw: 'Kifungu cha 27(8) na 81(b) kinaamuru kwamba chombo chochote cha serikali au cha kuchaguliwa kisizidishe thuluthi mbili ya jinsia moja.',
    },
  },

  // 30. National Legal Aid Service (NLAS) Act 2016
  {
    id: 'gq_30',
    category: 'human_rights',
    marks: 1,
    sourceTopic: 'Legal Aid Act 2016 & Pro Bono Defense',
    constitutionalArticle: 'Legal Aid Act 2016 & Article 48',
    difficulty: 'foundation',
    question: {
      en: 'Under the Legal Aid Act 2016, who qualifies to receive free legal advice and representation from the National Legal Aid Service (NLAS)?',
      sw: 'Chini ya Sheria ya Msaada wa Kisheria ya 2016, ni nani anayestahili kupata mawakili na ushauri wa bure kutoka NLAS?',
    },
    options: [
      { id: 'a', text: { en: 'Indigent citizens, children, persons with disabilities, and vulnerable marginalized groups who cannot afford private advocates', sw: 'Wananchi wasio na uwezo wa kifedha, watoto, walemavu, na makundi yaliyo katika mazingira magumu' } },
      { id: 'b', text: { en: 'Only multi-millionaire commercial real estate developers', sw: 'Wafanyabiashara matajiri pekee wanaomiliki majengo makubwa ya kifahari' } },
      { id: 'c', text: { en: 'Foreign diplomatic ambassadors living in Nairobi', sw: 'Mabalozi wa kigeni wanaoishi jijini Nairobi' } },
      { id: 'd', text: { en: 'Legal aid is prohibited in all criminal courts in Kenya', sw: 'Msaada wa kisheria umepigwa marufuku mahakama zote za Kenya' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'The Legal Aid Act 2016 establishes NLAS to ensure equality before the law under Article 48 by providing free advocates to indigent citizens, accused persons facing serious charges, and vulnerable groups.',
      sw: 'Sheria ya Msaada wa Kisheria inahakikisha wananchi maskini, watoto na walemavu wanapata uwakilishi wa mawakili wa bure kortini kutekeleza Kifungu cha 48 cha haki kwa wote.',
    },
  },

  // 31. Auditor-General Independence & Reports
  {
    id: 'gq_31',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'Article 229 Auditor-General Mandate',
    constitutionalArticle: 'Article 229 & Public Audit Act',
    difficulty: 'advanced_analysis',
    question: {
      en: 'What constitutional protection guarantees the independence of the Office of the Auditor-General under Article 229 and Article 249?',
      sw: 'Ni ulinzi gani wa kikatiba unaohakikisha uhuru wa Ofisi ya Mkaguzi Mkuu wa Hesabu za Serikali chini ya Kifungu cha 229 na 249?',
    },
    options: [
      { id: 'a', text: { en: 'The Auditor-General is subject only to the Constitution and the law, and is not subject to direction or control by any person or authority', sw: 'Mkaguzi Mkuu anafuata Katiba na sheria pekee, na hawezi kuamrishwa au kuelekezwa na mtu yeyote au mamlaka yoyote' } },
      { id: 'b', text: { en: 'The Auditor-General must seek daily permission from the Governor before auditing counties', sw: 'Mkaguzi Mkuu lazima aombe ruhusa kila siku kutoka kwa Gavana kabla ya kukagua kaunti' } },
      { id: 'c', text: { en: 'Audits can only be performed if the ruling political party approves the findings', sw: 'Ukaguzi unaweza kufanyika tu ikiwa chama tawala kimekubali matokeo' } },
      { id: 'd', text: { en: 'County audit reports are kept top secret and never tabled in assemblies', sw: 'Ripoti za ukaguzi wa kaunti huwekwa siri kuu na hazipelekwi bungeni' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 249(2) explicitly provides that constitutional commissions and independent offices are subject only to the Constitution and the law, and are independent of direction or control by any person or authority.',
      sw: 'Kifungu cha 249(2) kinatamka kwamba Tume za Kikatiba na Ofisi Huru haziko chini ya ushawishi au amri ya mtu yeyote na zinalindwa kikatiba kufanya ukaguzi bila woga.',
    },
  },

  // 32. Article 23 Constitutional Remedies
  {
    id: 'gq_32',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'Article 23 Judicial Conservatory Orders',
    constitutionalArticle: 'Article 23(3)',
    difficulty: 'advanced_analysis',
    question: {
      en: 'What is a "conservatory order" issued by the High Court under Article 23(3)(c)?',
      sw: 'Amri ya kihafidhina ("conservatory order") inayotolewa na Mahakama Kuu chini ya Kifungu cha 23(3)(c) ni nini?',
    },
    options: [
      { id: 'a', text: { en: 'A rapid interim injunction to freeze an unconstitutional action (e.g. halt illegal demolition) and preserve the status quo until the main petition is heard', sw: 'Amri ya haraka ya mahakama ya kusimamisha hatua haramu (kama ubomoaji haramu) na kuhifadhi hali ilivyo hadi kesi ya msingi isikilizwe' } },
      { id: 'b', text: { en: 'A final order sentencing the accused to life imprisonment immediately', sw: 'Hukumu ya mwisho inayomfunga mtu maisha gerezani papo hapo' } },
      { id: 'c', text: { en: 'An order allowing foreign companies to extract timber without environmental permits', sw: 'Amri inayoruhusu kampuni za kigeni kukata miti bila kibali' } },
      { id: 'd', text: { en: 'A certificate given to citizens when paying land rates at county revenue desks', sw: 'Cheti anachopewa mwananchi anapolipa ushuru wa ardhi kaunti' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Under Article 23(3)(c), the High Court can grant conservatory orders to prevent irreversible harm to citizens or public resources while the legality of a government action is adjudicated.',
      sw: 'Amri ya kihafidhina (conservatory order) huzuia madhara yasiyoweza kurekebishwa kutokea wakati kesi ya kikatiba inapoendelea kusikilizwa mahakamani.',
    },
  },

  // 33. Chain of Custody for Digital Evidence
  {
    id: 'gq_33',
    category: 'police_oversight',
    marks: 1,
    sourceTopic: 'Digital Evidence Integrity & Section 106B Evidence Act',
    constitutionalArticle: 'Evidence Act Section 106B',
    difficulty: 'advanced_analysis',
    question: {
      en: 'Under Section 106B of the Evidence Act, what is required to make digital video, phone audio, and photographs admissible in a Kenyan court?',
      sw: 'Chini ya Kifungu cha 106B cha Sheria ya Ushahidi, ni nini kinachohitajika ili video za simu, sauti na picha zikubalike mahakamani kama ushahidi halali?',
    },
    options: [
      { id: 'a', text: { en: 'A certificate of electronic evidence identifying the electronic device, confirming unbroken chain of custody, and verifying files were not edited or tampered with', sw: 'Cheti cha ushahidi wa kielektroniki kinachotaja kifaa, kuthibitisha mlolongo wa ulinzi wa faili, na kwamba faili hazikubadilishwa' } },
      { id: 'b', text: { en: 'Videos must be filmed exclusively on 35mm Hollywood film cameras', sw: 'Video lazima zirekodiwe kwa kamera za zamani za mikanda ya filamu' } },
      { id: 'c', text: { en: 'Digital recordings are never admissible under any circumstance in Kenyan courts', sw: 'Rekodi za kidijitali haziruhusiwi kamwe mahakamani nchini Kenya' } },
      { id: 'd', text: { en: 'The arresting police officer must personally star in the video recording', sw: 'Afisa aliyekamata mshukiwa lazima awe ameigiza katika video hiyo' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 106B requires an electronic certificate signed by the person in custody of the device or system, certifying the integrity and operating condition of the recording device.',
      sw: 'Kifungu cha 106B kinataka cheti cha kielektroniki kinachothibitisha kwamba picha au video haikubadilishwa na ilihifadhiwa kwa uadilifu.',
    },
  },

  // 34. County Assembly Summons Powers
  {
    id: 'gq_34',
    category: 'devolution',
    marks: 1,
    sourceTopic: 'Article 195 Powers of County Assemblies',
    constitutionalArticle: 'Article 195',
    difficulty: 'foundation',
    question: {
      en: 'What powers do County Assemblies and their committees have to enforce attendance and call witnesses under Article 195?',
      sw: 'Bunge la Kaunti na kamati zake zina mamlaka gani ya kisheria ya kuita mashahidi na kudai nyaraka chini ya Kifungu cha 195?',
    },
    options: [
      { id: 'a', text: { en: 'The same powers as the High Court to summon any person, examine witnesses on oath, and compel production of public documents', sw: 'Mamlaka sawa na ya Mahakama Kuu ya kumuita mtu yeyote, kumwapisha, na kumlazimisha kutoa nyaraka za umma' } },
      { id: 'b', text: { en: 'Assemblies have no power; officials can ignore summons without consequence', sw: 'Bunge halina mamlaka yoyote; maafisa wanaweza kupuuza wito bila adhabu' } },
      { id: 'c', text: { en: 'Assemblies can only summon individuals during national holidays', sw: 'Mabunge yanaweza tu kuita watu wakati wa sikukuu za kitaifa' } },
      { id: 'd', text: { en: 'Assemblies can only summon children under 10 years of age', sw: 'Mabunge yanaweza tu kuita watoto walio chini ya miaka kumi' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 195 gives County Assemblies and their committees the same powers as the High Court in enforcing attendance of witnesses, examining them under oath, and compelling production of evidence.',
      sw: 'Kifungu cha 195 kinapa Bunge la Kaunti nguvu sawa na za Mahakama Kuu katika kuamuru mashahidi kufika bungeni na kuwasilisha stakabadhi rasmi.',
    },
  },

  // 35. De-escalating Online Hate Speech & Propaganda
  {
    id: 'gq_35',
    category: 'participation',
    marks: 1,
    sourceTopic: 'Digital Peacebuilding & The Counter-Narrative Formula',
    constitutionalArticle: 'Article 10 & Article 33',
    difficulty: 'scenario',
    scenario: {
      en: 'An anonymous TikTok and WhatsApp video goes viral in a county falsely claiming that an incoming youth group from a neighboring community is planning to seize communal grazing land.',
      sw: 'Video ya uzushi inasambaa kwa kasi kwenye TikTok na WhatsApp ikidai uongo kuwa kundi la vijana kutoka kabila jirani linapanga kunyakua ardhi ya malisho.',
    },
    question: {
      en: 'What is the most effective civic de-escalation response under peacebuilding best practices?',
      sw: 'Mbinu sahihi na yenye ufanisi zaidi ya wananchi kutuliza uhasama na kujenga amani mtandaoni ni ipi?',
    },
    options: [
      { id: 'a', text: { en: 'Deploy verified counter-narratives citing official land records, share unified statements from elders and youth champions, and report hate clips to the NCIC hotline', sw: 'Kusambaza taarifa rasmi za ukweli za ardhi, kutoa video za wazee na viongozi wa vijana wakihubiri amani, na kuripoti video za chuki kwa NCIC' } },
      { id: 'b', text: { en: 'Retweet and forward the hate video to 50 more WhatsApp groups to increase outrage', sw: 'Kusambaza video hiyo ya chuki kwenye vikundi 50 zaidi ili kuongeza hasira' } },
      { id: 'c', text: { en: 'Organize physical retaliatory roadblocks immediately', sw: 'Kuweka vizuizi barabarani vya kulipiza kisasi' } },
      { id: 'd', text: { en: 'Disconnect all village power supplies permanently', sw: 'Kukata umeme wa kijiji chote kabisa' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Effective peacebuilding counter-narratives avoid quoting or amplifying hate speech directly, instead reframing the dialogue around shared constitutional rights, verified facts, and official mediation channels.',
      sw: 'Mbinu bora ya kujenga amani mtandaoni ni kusambaza ukweli uliothibitishwa, kushirikisha wazee na viongozi wa pande zote, na kuripoti uchochezi kwa mamlaka husika.',
    },
  },

  // 36. Public Participation Thresholds (Robert Gakuru Ruling)
  {
    id: 'gq_36',
    category: 'participation',
    marks: 1,
    sourceTopic: 'Constitutional Standard for Meaningful Public Participation',
    constitutionalArticle: 'Article 10 & High Court Precedents',
    difficulty: 'advanced_analysis',
    question: {
      en: 'In landmark constitutional rulings such as Robert Gakuru and British American Tobacco v CS Health, what criteria must public participation meet to be legally valid in Kenya?',
      sw: 'Kwenye maamuzi ya Mahakama Kuu kama Robert Gakuru na BAT v CS Health, ushiriki wa umma lazima utimize vigezo gani ili ukubalike kisheria?',
    },
    options: [
      { id: 'a', text: { en: 'It must be qualitative, meaningful, preceded by adequate public notice and accessible draft documents, allowing reasonable opportunity to influence the outcome', sw: 'Lazima uwe wa kina, wa maana, utanguliwe na ilani ya kutosha na nyaraka wazi, ukiwapa wananchi fursa ya kweli ya kubadili uamuzi' } },
      { id: 'b', text: { en: 'Inviting two government friends to sign an attendance sheet in an office is legally sufficient', sw: 'Kualika marafiki wawili wa serikali kusaini karatasi ya mahudhurio ofisini inatosha kisheria' } },
      { id: 'c', text: { en: 'Public participation can only occur between 1:00 AM and 3:00 AM', sw: 'Ushiriki wa umma unaweza kufanyika tu kati ya saa saba na saa tisa usiku' } },
      { id: 'd', text: { en: 'Only citizens with master’s degrees have the legal right to give feedback on county bills', sw: 'Raia wenye shahada ya uzamili pekee ndio wenye haki ya kutoa maoni ya miswada ya kaunti' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Courts have firmly established that public participation cannot be a cosmetic check-box exercise. Citizens must receive adequate advance notice, readable materials, and a genuine platform to shape policies.',
      sw: 'Mahakama zimeamua kuwa ushiriki wa wananchi hauwezi kuwa kiini-macho au karatasi ya kuridhisha tu; wananchi lazima wapewe taarifa mapema na maoni yao yazingatiwe.',
    },
  },

  // 37. Article 160 Independence of the Judiciary
  {
    id: 'gq_37',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'Judicial Independence & Shielding Citizens',
    constitutionalArticle: 'Article 160',
    difficulty: 'foundation',
    question: {
      en: 'How does Article 160 safeguard judges and judicial officers in the execution of their duties?',
      sw: 'Kifungu cha 160 kinalinda vipi majaji na mahakimu katika kutekeleza majukumu yao?',
    },
    options: [
      { id: 'a', text: { en: 'In exercising judicial authority, courts shall be subject only to the Constitution and the law, and shall not be subject to the control or direction of any person or authority', sw: 'Katika kutekeleza mamlaka ya mahakama, majaji watafuata Katiba na sheria pekee, na hawatatawaliwa au kuelekezwa na mtu yeyote au mamlaka yoyote' } },
      { id: 'b', text: { en: 'Judges must vote with the ruling political coalition in every commercial case', sw: 'Majaji lazima waunge mkono chama tawala katika kila kesi ya biashara' } },
      { id: 'c', text: { en: 'Judicial salaries can be unilaterally eliminated whenever the President desires', sw: 'Mishahara ya majaji inaweza kufutwa wakati wowote Rais anapotaka' } },
      { id: 'd', text: { en: 'Police commanders have authority to overrule High Court bail orders', sw: 'Wakuu wa polisi wana mamlaka ya kufuta maamuzi ya dhamana ya Mahakama Kuu' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 160(1) guarantees that judicial authority is independent and subject only to the Constitution and the law, shielding citizens from arbitrary executive or political interference.',
      sw: 'Kifungu cha 160(1) kinahakikisha uhuru wa mahakama ili kuwalinda wananchi dhidi ya maamuzi ya kidhalimu ya wanasiasa au vyombo vya serikali.',
    },
  },

  // 38. Universal Suffrage & Polling Station Scrutiny
  {
    id: 'gq_38',
    category: 'elections',
    marks: 1,
    sourceTopic: 'Article 86 Electoral System Integrity',
    constitutionalArticle: 'Article 86',
    difficulty: 'foundation',
    question: {
      en: 'Under Article 86 of the Constitution, what voting standards must the Independent Electoral and Boundaries Commission (IEBC) ensure in every election?',
      sw: 'Chini ya Kifungu cha 86 cha Katiba, ni viwango gani vya uchaguzi ambavyo Tume ya IEBC lazima ivihakikishe katika kila uchaguzi?',
    },
    options: [
      { id: 'a', text: { en: 'Voting is simple, transparent, accurate, and results from each polling station are counted, tabulated, and announced openly by presiding officers', sw: 'Upigaji kura uwe rahisi, wa uwazi, sahihi, na matokeo kutoka kila kituo yahesabiwe na kutangazwa wazi na maafisa wasimamizi vituoni' } },
      { id: 'b', text: { en: 'Ballot boxes are transported to secret unannounced locations before any votes are counted', sw: 'Masanduku ya kura yapelekwe maeneo ya siri kabla kura hazijahesabiwa' } },
      { id: 'c', text: { en: 'Only government state officers are allowed inside polling centers', sw: 'Maafisa wa serikali pekee wanaoruhusiwa kuingia vituoni mwa kupiga kura' } },
      { id: 'd', text: { en: 'Elections are held once every 25 years in Kenya', sw: 'Uchaguzi unafanyika mara moja kila baada ya miaka 25 nchini Kenya' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 86 establishes the constitutional bedrock of voting in Kenya: transparent voting, accurate counting, and prompt polling station public announcements.',
      sw: 'Kifungu cha 86 kinaweka wazi kwamba kura zihesabiwe vituoni kwa uwazi mbele ya mawakala na wananchi ili kuzuia wizi wa kura.',
    },
  },

  // 39. Public Finance Audits & Fighting Tender Diversions
  {
    id: 'gq_39',
    category: 'public_finance',
    marks: 1,
    sourceTopic: 'Section 135 PFMA Budget Reallocation Limits',
    constitutionalArticle: 'PFMA Section 135',
    difficulty: 'scenario',
    scenario: {
      en: 'A county official attempts to divert funds from an approved community maternity clinic to purchase luxury sports utility vehicles for political campaign escorts.',
      sw: 'Afisa wa kaunti anajaribu kuhamisha fedha zilizoidhinishwa za zahanati ya uzazi ili kununua magari ya kifahari ya msafara wa kisiasa.',
    },
    question: {
      en: 'What statutory penalty does a public officer face under the Public Finance Management Act for unlawfully authorizing expenditure without appropriation?',
      sw: 'Afisa wa umma anakabiliwa na adhabu gani ya kisheria chini ya Sheria ya PFMA kwa kuidhinisha matumizi ya fedha kinyume cha bajeti iliyopitishwa?',
    },
    options: [
      { id: 'a', text: { en: 'Personal financial liability, disqualification from public office, and criminal prosecution under Section 196 of the PFMA', sw: 'Kulipa hasara kwa fedha zake binafsi, kufukuzwa kazi ya umma, na kufunguliwa mashtaka ya jinai chini ya Kifungu cha 196 cha PFMA' } },
      { id: 'b', text: { en: 'A commendation medal for creative public financial management', sw: 'Medali ya pongezi kwa kuwa mbunifu katika kutumia fedha za umma' } },
      { id: 'c', text: { en: 'Automatic promotion to National Treasury cabinet secretary', sw: 'Kupandishwa cheo mara moja kuwa waziri wa fedha wa kitaifa' } },
      { id: 'd', text: { en: 'Public officers are immune from all financial laws in Kenya', sw: 'Maafisa wa umma wanalindwa wasiguswe na sheria zozote za fedha' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Section 196 and Section 197 of the PFMA 2012 criminalize unauthorized reallocations and wasteful spending, imposing personal surcharges and jail terms on offending accounting officers.',
      sw: 'Kifungu cha 196 cha Sheria ya PFMA kinaamuru kwamba afisa anayeidhinisha matumizi haramu atawajibishwa kibinafsi kulipa fedha hizo na kufungwa jela.',
    },
  },

  // 40. The Raham Protocol & Collective Citizen Vigilance
  {
    id: 'gq_40',
    category: 'constitution',
    marks: 1,
    sourceTopic: 'The Raham Protocol: Citizen Vigilance & Grassroots Defense',
    constitutionalArticle: 'Article 3 & Article 10',
    difficulty: 'advanced_analysis',
    question: {
      en: 'What fundamental civic duty is enshrined under Article 3 of the Constitution of Kenya 2010?',
      sw: 'Ni wajibu gani mkuu wa kiraia uliowekwa chini ya Kifungu cha 3 cha Katiba ya Kenya 2010?',
    },
    options: [
      { id: 'a', text: { en: 'Every person has an obligation to respect, uphold, and defend the Constitution', sw: 'Kila mtu ana wajibu wa kuheshimu, kuitunza, na kuilinda Katiba ya nchi' } },
      { id: 'b', text: { en: 'Citizens must obey illegal orders from armed officers without question', sw: 'Wananchi lazima watii amri haramu za askari wenye silaha bila kuuliza' } },
      { id: 'c', text: { en: 'Constitutional awareness should be left only to judges in courtrooms', sw: 'Kufahamu katiba kuachiwe majaji pekee katika vyumba vya mahakama' } },
      { id: 'd', text: { en: 'Citizens are prohibited from asking about public funds in their counties', sw: 'Wananchi wamepigwa marufuku kuuliza kuhusu matumizi ya fedha katika kaunti zao' } },
    ],
    correctOptionId: 'a',
    explanation: {
      en: 'Article 3(1) commands: "Every person has an obligation to respect, uphold and defend this Constitution." Active civic vigilance, community audits, and rights defense are the constitutional duty of every Kenyan citizen.',
      sw: 'Kifungu cha 3(1) kinatamka wazi: "Kila mtu ana wajibu wa kuheshimu, kuitunza na kuilinda Katiba hii." Ulinzi wa katiba ni wajibu mtakatifu wa kila mwananchi wa Kenya.',
    },
  },
];

/**
 * Checks if a user has completed/studied all 100 civic courses in the platform curriculum.
 */
export function hasUserStudiedAll100Courses(username?: string | null): {
  hasStudiedAll: boolean;
  completedCount: number;
  totalCourses: number;
  remainingCount: number;
  progressPercent: number;
} {
  const allCourses = getAllCivicCourses();
  const totalCourses = Math.min(100, Math.max(allCourses.length, 100));
  const progress = getUserProgress(username);
  const completedIds = new Set(progress.completedLessons || []);
  
  // Count how many of the 100 courses are in completedIds
  const completedCount = allCourses.filter((c) => completedIds.has(c.id)).length;
  const effectiveCompleted = Math.max(completedCount, (progress.completedLessons || []).length);
  const hasStudiedAll = effectiveCompleted >= 100;
  const remainingCount = Math.max(0, 100 - effectiveCompleted);
  const progressPercent = Math.min(100, Math.round((effectiveCompleted / 100) * 100));

  return {
    hasStudiedAll,
    completedCount: Math.min(100, effectiveCompleted),
    totalCourses: 100,
    remainingCount,
    progressPercent,
  };
}

/**
 * Automatically generates a personalized 40 marks timed exam based on
 * the user's study progress, lessons learnt, and past quiz performance.
 */
export function generate40MarksTimedExam(username?: string | null): GrandExamSitting {
  const cleanUsername = username ? username.trim().toLowerCase().replace(/^@/, '') : 'guest';
  const progress = getUserProgress(username);
  const quizScores = progress.courseQuizScores || {};

  // Inspect performance to identify reinforcement topics vs mastered topics
  const weakCategories = new Set<string>();
  const strongCategories = new Set<string>();

  Object.entries(quizScores).forEach(([courseId, record]) => {
    if (record.score / record.total < 0.8) {
      if (courseId.includes('police') || courseId.includes('arrest') || courseId.includes('bail')) weakCategories.add('police_oversight');
      if (courseId.includes('budget') || courseId.includes('adp') || courseId.includes('audit')) weakCategories.add('public_finance');
      if (courseId.includes('devolution') || courseId.includes('ward') || courseId.includes('mca')) weakCategories.add('devolution');
      if (courseId.includes('land') || courseId.includes('environment')) weakCategories.add('environment');
    } else {
      if (courseId.includes('constitution')) strongCategories.add('constitution');
      if (courseId.includes('human_rights')) strongCategories.add('human_rights');
    }
  });

  // Assign numbers 1 to 40 sequentially
  const questions: GrandExamQuestion[] = GRAND_EXAM_QUESTION_BANK.map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
    // Slightly adjust difficulty tag based on user mastery
    difficulty: weakCategories.has(q.category)
      ? 'foundation'
      : strongCategories.has(q.category)
      ? 'advanced_analysis'
      : q.difficulty,
  }));

  const examSitting: GrandExamSitting = {
    examId: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    generatedAt: new Date().toISOString(),
    totalMarks: 40,
    timeLimitMinutes: 40,
    questions,
    userAnswers: {},
    flaggedQuestions: [],
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${GRAND_EXAM_STORAGE_PREFIX}${cleanUsername}`, JSON.stringify(examSitting));
    } catch (e) {
      console.error('Failed to cache grand exam sitting:', e);
    }
  }

  return examSitting;
}

/**
 * Retrieves the currently active or saved exam sitting for the user,
 * or generates one if they have studied all 100 courses.
 */
export function getSavedGrandExamSitting(username?: string | null): GrandExamSitting | null {
  const cleanUsername = username ? username.trim().toLowerCase().replace(/^@/, '') : 'guest';
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${GRAND_EXAM_STORAGE_PREFIX}${cleanUsername}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse grand exam sitting:', err);
  }

  return null;
}

/**
 * Saves in-progress answers or final exam results to storage.
 */
export function saveGrandExamSitting(sitting: GrandExamSitting): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${GRAND_EXAM_STORAGE_PREFIX}${sitting.username}`, JSON.stringify(sitting));
  } catch (err) {
    console.error('Failed to save grand exam sitting:', err);
  }
}

/**
 * Submits the completed 40-marks exam, grades answers, and if score > 30,
 * automatically records merit graduation with Certificate of Merit, QR code,
 * double verification badge, and 5000 tokens!
 */
export async function submitGrandExam(
  sitting: GrandExamSitting,
  recipientName?: string
): Promise<{
  sitting: GrandExamSitting;
  passed: boolean;
  score: number;
  totalMarks: 40;
  percentage: number;
  graduationRecord?: MeritGraduateRecord;
}> {
  let score = 0;
  sitting.questions.forEach((q) => {
    const chosen = sitting.userAnswers[q.id];
    if (chosen && chosen === q.correctOptionId) {
      score += 1;
    }
  });

  const passed = score > 30; // Strictly > 30 marks (e.g. 31 to 40)
  const percentage = Math.round((score / 40) * 100);

  sitting.score = score;
  sitting.percentage = percentage;
  sitting.passed = passed;
  sitting.completedAt = new Date().toISOString();

  let graduationRecord: MeritGraduateRecord | undefined = undefined;

  if (passed) {
    const res = await recordMeritGraduation(sitting.username, score, recipientName);
    if (res.success && res.record) {
      graduationRecord = res.record;
      sitting.graduationRecord = res.record;
    }
  }

  saveGrandExamSitting(sitting);
  return {
    sitting,
    passed,
    score,
    totalMarks: 40,
    percentage,
    graduationRecord,
  };
}
