import { QuizQuestion } from '../types';

export const quizData: QuizQuestion[] = [
  // Question 1 (from prompt)
  {
    id: 'q1',
    category: 'county',
    question: {
      en: 'Who is the elected head of a county government in Kenya?',
      sw: 'Ni nani kiongozi mkuu aliyechaguliwa wa serikali ya kaunti nchini Kenya?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Senator', sw: 'Seneta' } },
      { id: 'opt_b', text: { en: 'Governor', sw: 'Gavana' } },
      { id: 'opt_c', text: { en: 'Cabinet Secretary', sw: 'Waziri wa Serikali Kuu' } },
      { id: 'opt_d', text: { en: 'Member of Parliament', sw: 'Mbunge wa Bunge la Kitaifa' } },
    ],
    correctOptionId: 'opt_b',
    explanation: {
      en: 'Under Article 179 of the Constitution of Kenya, the County Governor is the elected chief executive officer of the county government.',
      sw: 'Chini ya Kifungu cha 179 cha Katiba ya Kenya, Gavana wa Kaunti ndiye kiongozi mkuu wa kiutendaji aliyechaguliwa wa serikali ya kaunti.',
    },
  },

  // Question 2 (from prompt)
  {
    id: 'q2',
    category: 'parliament',
    question: {
      en: 'Which institution makes national laws in Kenya?',
      sw: 'Ni taasisi gani inayotunga sheria za kitaifa nchini Kenya?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Judiciary', sw: 'Idara ya Mahakama' } },
      { id: 'opt_b', text: { en: 'Executive', sw: 'Serikali Kuu (Mtendaji)' } },
      { id: 'opt_c', text: { en: 'Parliament (National Assembly and Senate)', sw: 'Bunge (Bunge la Kitaifa na Seneti)' } },
      { id: 'opt_d', text: { en: 'County Public Service Board', sw: 'Bodi ya Utumishi wa Umma ya Kaunti' } },
    ],
    correctOptionId: 'opt_c',
    explanation: {
      en: 'Article 94 confers the legislative authority of the Republic upon Parliament, which manifests the sovereign will of the people by enacting national laws.',
      sw: 'Kifungu cha 94 kinaweka mamlaka ya kutunga sheria za Jamhuri mikononi mwa Bunge (Bunge la Kitaifa na Seneti).',
    },
  },

  // Question 3 (from prompt)
  {
    id: 'q3',
    category: 'participation',
    question: {
      en: 'What is public participation according to the Kenyan Constitution?',
      sw: 'Ushiriki wa umma ni nini kulingana na Katiba ya Kenya?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Citizens actively taking part in government decision-making processes', sw: 'Wananchi kushiriki kikamilifu katika michakato ya kutoa maamuzi ya serikali' } },
      { id: 'opt_b', text: { en: 'Political campaigning and attending rallies only', sw: 'Kufanya kampeni na kuhudhuria mikutano ya kisiasa pekee' } },
      { id: 'opt_c', text: { en: 'Private corporate board meetings', sw: 'Mikutano ya makampuni binafsi ya kibiashara' } },
      { id: 'opt_d', text: { en: 'Court proceedings between lawyers', sw: 'Mijadala ya mahakamani kati ya mawakili' } },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      en: 'Article 10 lists public participation as a fundamental national value. It ensures citizens have real input in budgets, policies, and laws before they are enacted.',
      sw: 'Kifungu cha 10 kinaorodhesha ushiriki wa umma kama msingi mkuu wa kitaifa. Kinahakikisha wananchi wanatoa maoni halisi katika bajeti, sera na sheria kabla hazijapitishwa.',
    },
  },

  // Question 4 (from prompt)
  {
    id: 'q4',
    category: 'county',
    question: {
      en: 'Which of the following is a county government institution?',
      sw: 'Kati ya zifuatazo, ni ipi taasisi ya serikali ya kaunti?',
    },
    options: [
      { id: 'opt_a', text: { en: 'County Assembly', sw: 'Bunge la Kaunti' } },
      { id: 'opt_b', text: { en: 'Senate', sw: 'Seneti' } },
      { id: 'opt_c', text: { en: 'National Assembly', sw: 'Bunge la Kitaifa' } },
      { id: 'opt_d', text: { en: 'Supreme Court', sw: 'Mahakama ya Juu Zaidi' } },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      en: 'The County Assembly is the legislative arm of a county government (Article 176–177). The Senate, National Assembly, and Supreme Court are national institutions.',
      sw: 'Bunge la Kaunti ndio mhimili wa kutunga sheria wa serikali ya kaunti (Kifungu cha 176-177). Seneti, Bunge la Kitaifa na Mahakama ya Juu ni taasisi za kitaifa.',
    },
  },

  // Question 5 - Scenario
  {
    id: 'q5',
    category: 'county',
    isScenario: true,
    question: {
      en: 'Scenario: Heavy rains have washed away an unpaved village feeder road in your ward in Kwale, making it impossible to transport farm produce to the market. Which office is primarily responsible for repairing this road?',
      sw: 'Mfano Halisi: Mvua kubwa imeharibu barabara ya kijijini (feeder road) katika wadi yako kule Kwale, na wakulima hawawezi kusafirisha mazao sokoni. Ni ofisi gani inayohusika moja kwa moja kukarabati barabara hii?',
    },
    options: [
      { id: 'opt_a', text: { en: 'The National Highways Authority (KeNHA)', sw: 'Mamlaka ya Barabara Kuu za Kitaifa (KeNHA)' } },
      { id: 'opt_b', text: { en: 'County Government (Department of Roads & Transport)', sw: 'Serikali ya Kaunti (Idara ya Barabara na Uchukuzi ya Kaunti)' } },
      { id: 'opt_c', text: { en: 'Ethics and Anti-Corruption Commission (EACC)', sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC)' } },
      { id: 'opt_d', text: { en: 'The Chief Justice', sw: 'Jaji Mkuu' } },
    ],
    correctOptionId: 'opt_b',
    explanation: {
      en: 'Under Schedule 4 of the Constitution, county roads, street lighting, and local public transport are devolved functions assigned to the County Government.',
      sw: 'Chini ya Jedwali la 4 la Katiba, barabara zote za ndani za kaunti, taa za mitaani na usafiri wa ndani ni majukumu yaliyogatuliwa kwa Serikali ya Kaunti.',
    },
  },

  // Question 6 - Rights & Access to Info
  {
    id: 'q6',
    category: 'rights',
    isScenario: true,
    question: {
      en: 'Scenario: A public clinic contractor abandoned a maternity ward project 2 years ago, but public funds were drawn. When citizens ask the county for the contract and budget details, the officer refuses to share them. Which constitutional right is being violated?',
      sw: 'Mfano Halisi: Mkandarasi wa zahanati ya umma aliacha ujenzi wa wodi ya wazazi miaka 2 iliyopita ingawa pesa zililipwa. Wananchi walipoomba mkataba na taarifa za matumizi ya fedha, afisa wa kaunti alikataa kuzitoa. Ni haki ipi ya kikatiba inayovunjwa?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Right to Access to Information (Article 35)', sw: 'Haki ya Kupata Taarifa (Kifungu cha 35)' } },
      { id: 'opt_b', text: { en: 'Freedom of Movement (Article 39)', sw: 'Uhuru wa Kutembea (Kifungu cha 39)' } },
      { id: 'opt_c', text: { en: 'Right to Clean Environment (Article 42)', sw: 'Haki ya Mazingira Safi (Kifungu cha 42)' } },
      { id: 'opt_d', text: { en: 'Right to Privacy (Article 31)', sw: 'Haki ya Faragha (Kifungu cha 31)' } },
    ],
    correctOptionId: 'opt_a',
    explanation: {
      en: 'Article 35 guarantees every citizen the right to access information held by the state. Public budgets and contracts cannot be kept secret from taxpayers.',
      sw: 'Kifungu cha 35 kinampa kila mwananchi haki ya kupata taarifa inayoshikiliwa na serikali. Bajeti na mikataba ya miradi ya umma haviwezi kufanywa siri.',
    },
  },

  // Question 7 - Separation of Powers
  {
    id: 'q7',
    category: 'general',
    question: {
      en: 'Can a Cabinet Secretary or County Minister be a sitting Member of Parliament under Kenya\'s 2010 Constitution?',
      sw: 'Je, Waziri wa Kitaifa au Waziri wa Kaunti anaweza kuwa Mbunge anayehudumu bungeni chini ya Katiba ya 2010?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Yes, all ministers must be elected MPs', sw: 'Ndiyo, mawaziri wote lazima wawe wabunge waliochaguliwa' } },
      { id: 'opt_b', text: { en: 'No, there is a strict separation between Executive and Legislature', sw: 'Hapana, kuna mgawanyo madhubuti unaotenganisha Mhimili wa Utendaji na Bunge' } },
      { id: 'opt_c', text: { en: 'Only if the President gives special permission', sw: 'Ikiwa tu Rais atatoa kibali maalum' } },
      { id: 'opt_d', text: { en: 'Only the Deputy President can be an MP', sw: 'Naibu Rais pekee ndiye anayeruhusiwa kuwa mbunge' } },
    ],
    correctOptionId: 'opt_b',
    explanation: {
      en: 'Under Article 152(3), a Cabinet Secretary cannot be a Member of Parliament. This ensures Parliament can objectively oversee ministers without a conflict of interest.',
      sw: 'Chini ya Kifungu cha 152(3), Waziri hawezi kuwa Mbunge. Hii inahakikisha Bunge linasimamia mawaziri kwa uhuru bila mgongano wa kimaslahi.',
    },
  },

  // Question 8 - Judiciary
  {
    id: 'q8',
    category: 'judiciary',
    question: {
      en: 'Which is the highest court in Kenya whose decisions are final and binding on all other courts?',
      sw: 'Ni mahakama ipi ya juu zaidi nchini Kenya ambayo maamuzi yake ni ya mwisho na yanafunga mahakama zote?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Court of Appeal', sw: 'Mahakama ya Rufaa' } },
      { id: 'opt_b', text: { en: 'High Court', sw: 'Mahakama Kuu' } },
      { id: 'opt_c', text: { en: 'Supreme Court of Kenya', sw: 'Mahakama ya Juu Zaidi ya Kenya' } },
      { id: 'opt_d', text: { en: 'Employment and Labour Relations Court', sw: 'Mahakama ya Kazi na Mahusiano ya Ajira' } },
    ],
    correctOptionId: 'opt_c',
    explanation: {
      en: 'Under Article 163, the Supreme Court is the apex court in Kenya. It has exclusive original jurisdiction to hear presidential election petitions and gives advisory opinions.',
      sw: 'Chini ya Kifungu cha 163, Mahakama ya Juu Zaidi ndiyo ya kilele. Ina mamlaka ya pekee ya kusikiliza kesi za uchaguzi wa urais na kutoa mwelekeo wa mwisho wa kisheria.',
    },
  },

  // Question 9 - Leadership & Integrity
  {
    id: 'q9',
    category: 'general',
    question: {
      en: 'Which chapter of the Constitution of Kenya is dedicated exclusively to Leadership and Integrity?',
      sw: 'Ni sura ipi ya Katiba ya Kenya inayozungumzia maalum Uongozi na Uadilifu wa watumishi wa umma?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Chapter 2', sw: 'Sura ya 2' } },
      { id: 'opt_b', text: { en: 'Chapter 4', sw: 'Sura ya 4' } },
      { id: 'opt_c', text: { en: 'Chapter 6', sw: 'Sura ya 6' } },
      { id: 'opt_d', text: { en: 'Chapter 11', sw: 'Sura ya 11' } },
    ],
    correctOptionId: 'opt_c',
    explanation: {
      en: 'Chapter 6 (Articles 73–80) outlines the conduct, responsibilities, financial ethics, and oath of office for state officers.',
      sw: 'Sura ya 6 (Vifungu 73-80) inaweka miongozo ya maadili, nidhamu, miiko ya kifedha na wajibu wa viongozi wa umma.',
    },
  },

  // Question 10 - Scenario on Accountability
  {
    id: 'q10',
    category: 'participation',
    isScenario: true,
    question: {
      en: 'Scenario: A citizen in Kwale suspects that school bursary funds allocated to their ward were distributed unfairly to cronies and relatives of the committee members. Which independent commission investigates this?',
      sw: 'Mfano Halisi: Mwananchi kule Kwale anashuku kuwa fedha za masomo (bursary) katika wadi yake ziligawiwa kwa upendeleo kwa jamaa na marafiki wa kamati badala ya wanafunzi wanaostahili. Ni tume gani huru inayochunguza suala hili?',
    },
    options: [
      { id: 'opt_a', text: { en: 'Kenya Revenue Authority (KRA)', sw: 'Mamlaka ya Mapato ya Kenya (KRA)' } },
      { id: 'opt_b', text: { en: 'Ethics and Anti-Corruption Commission (EACC)', sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC)' } },
      { id: 'opt_c', text: { en: 'Teachers Service Commission (TSC)', sw: 'Tume ya Huduma ya Walimu (TSC)' } },
      { id: 'opt_d', text: { en: 'Independent Electoral and Boundaries Commission (IEBC)', sw: 'Tume Huru ya Uchaguzi na Mipaka (IEBC)' } },
    ],
    correctOptionId: 'opt_b',
    explanation: {
      en: 'EACC is mandated under Article 79 and the Anti-Corruption and Economic Crimes Act to investigate favoritism, conflict of interest, and embezzlement of public funds like bursaries.',
      sw: 'EACC ina mamlaka chini ya Kifungu cha 79 kuchunguza upendeleo, mgongano wa kimaslahi, na wizi wa fedha za umma kama vile ufadhili wa masomo (bursary).',
    },
  },
];
