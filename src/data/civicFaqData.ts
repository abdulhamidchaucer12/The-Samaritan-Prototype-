export interface CivicFaqItem {
  id: string;
  category: 'devolution' | 'rights' | 'representation' | 'public_funds' | 'judiciary';
  question: {
    en: string;
    sw: string;
  };
  summary: {
    en: string;
    sw: string;
  };
  detailedAnswer: {
    en: string;
    sw: string;
  };
  keyArticles: string[];
  actionableTip: {
    en: string;
    sw: string;
  };
}

export const civicFaqCategories = [
  { id: 'all', label: { en: 'All Topics', sw: 'Mada Zote' } },
  { id: 'devolution', label: { en: 'Devolution & Counties', sw: 'Ugavi wa Madaraka na Kaunti' } },
  { id: 'rights', label: { en: 'Bill of Rights', sw: 'Haki za Msingi za Raia' } },
  { id: 'representation', label: { en: 'Elected Leaders', sw: 'Viongozi Waliochaguliwa' } },
  { id: 'public_funds', label: { en: 'Public Funds & Taxes', sw: 'Fedha za Umma na Ushuru' } },
  { id: 'judiciary', label: { en: 'Courts & Justice', sw: 'Mahakama na Haki' } },
] as const;

export const civicFaqData: CivicFaqItem[] = [
  {
    id: 'faq-devolution-1',
    category: 'devolution',
    question: {
      en: 'What is Devolution, and what are the separate roles of National vs County Governments?',
      sw: 'Ugavi wa Madaraka (Devolution) ni nini, na mgawanyo wa majukumu kati ya Serikali ya Kitaifa na ya Kaunti ukoje?',
    },
    summary: {
      en: 'Devolution decentralizes executive and legislative power from Nairobi into 47 distinct county governments (Article 174).',
      sw: 'Ugavi wa madaraka unagawanya uwezo wa kiutawala kutoka Nairobi hadi serikali 47 za kaunti (Kifungu cha 174).',
    },
    detailedAnswer: {
      en: 'Under Chapter 11 and the Fourth Schedule of the Constitution of Kenya 2010, the National Government handles foreign affairs, national security, immigration, national transport corridors, and higher education. The County Government manages county healthcare facilities, early childhood education (ECDE), local feeder roads, agriculture extension, county planning, refuse collection, village water projects, and trade licensing. Neither government is subordinate to the other; they are distinct and interdependent, conducting their business through mutual consultation and cooperation (Article 6(2)).',
      sw: 'Chini ya Sura ya 11 na Ratiba ya Nne ya Katiba ya Kenya 2010, Serikali ya Kitaifa inasimamia masuala ya kigeni, ulinzi wa taifa, polisi, uhamiaji, na vyuo vikuu. Serikali ya Kaunti inasimamia zahanati na hospitali za ngazi ya kaunti, chekechea (ECDE), barabara ndogo za mashambani, kilimo na mifugo, usafi wa mazingira, miradi ya maji vijijini, na leseni za biashara ndogo. Hakuna serikali iliyo chini ya nyingine; ni serikali mahususi zinazotegemeana na kufanya kazi kwa mashauriano na ushirikiano.',
    },
    keyArticles: ['Article 6(2)', 'Article 174', 'Article 175', 'Fourth Schedule'],
    actionableTip: {
      en: 'If your village health dispensary lacks medicine or your feeder road is impassable, report directly to your County Executive Committee Member (CECM) and Ward MCA, not your MP.',
      sw: 'Kama zahanati ya kijiji chako haina dawa au barabara ya kijijini imeharibika, dai huduma kutoka kwa Waziri wa Kaunti (CECM) na Diwani (MCA), si Mbunge wa Bunge la Kitaifa (MP).',
    },
  },
  {
    id: 'faq-public-participation',
    category: 'devolution',
    question: {
      en: 'Can a citizen actually influence county budgets through Public Participation?',
      sw: 'Je, mwananchi wa kawaida anaweza kuathiri bajeti ya kaunti kupitia Ushiriki wa Umma (Public Participation)?',
    },
    summary: {
      en: 'Yes. Article 10 and Article 196 make public participation a mandatory constitutional requirement for any county budget, law, or policy to be valid.',
      sw: 'Ndiyo. Kifungu cha 10 na 196 vinaweka ushiriki wa umma kuwa kigezo kikuu cha kikatiba cha kufanya bajeti, sheria au sera ya kaunti kuwa halali.',
    },
    detailedAnswer: {
      en: 'The Supreme Court and High Court have repeatedly overturned county budgets and acts where genuine citizen input was omitted. Every year in September (County Annual Development Plan), February (County Fiscal Strategy Paper), and April (County Budget Estimates), counties like Kwale must host open ward forums. Citizens can submit written memoranda demanding allocations for specific water boreholes, school bursaries, or maternity clinics.',
      sw: 'Mahakama Kuu na Mahakama ya Juu zimefutilia mbali bajeti na sheria za kaunti ambazo hazikufuata ushiriki wa dhati wa wananchi. Kila mwaka mwezi Septemba (Mpango wa Maendeleo ya Kaunti - CADP), Februari (CFSP), na Aprili (Makadirio ya Bajeti), kaunti huandaa mabaraza ya wazi ya wadi. Wananchi wana haki ya kuwasilisha maombi ya maandishi ya miradi kama visima vya maji, zahanati na ufadhili wa masomo.',
    },
    keyArticles: ['Article 10(2)(a)', 'Article 196(1)(b)', 'Article 201', 'County Governments Act Sec 87'],
    actionableTip: {
      en: 'Organize your community group or CBO (like Kwale Focus Empowerment) to co-author a single unified memorandum with budget priorities and present it at your Ward Baraza.',
      sw: 'Unda kikundi cha jamii au shirika la kijamii (kama KFE) muandike kumbukumbu moja yenye vipaumbele vya wadi yenu na kuiwasilisha rasmi kwenye Baraza la Wadi.',
    },
  },
  {
    id: 'faq-mca-powers',
    category: 'representation',
    question: {
      en: 'What does a Member of County Assembly (MCA) do versus the County Governor?',
      sw: 'Diwani (MCA) ana majukumu gani ikilinganishwa na Gavana wa Kaunti?',
    },
    summary: {
      en: 'The Governor heads the County Executive (implements projects), while the MCA heads the County Legislative & Oversight body (approves funds and inspects work).',
      sw: 'Gavana anaongoza Halmashauri Kuu ya Kaunti (kutekeleza miradi), naye Diwani (MCA) yuko kwenye Bunge la Kaunti (kutunga sheria, kuidhinisha bajeti, na kusimamia fedha).',
    },
    detailedAnswer: {
      en: 'The Governor (Article 179) manages county departments, hires staff through the County Public Service Board, and directs expenditures. The MCA (Article 185) represents ward interests in the County Assembly, vets gubernatorial appointees (County Ministers/CECMs), debates and enacts county legislation, approves the county budget, and investigates stalled county projects. MCAs do not implement construction contracts themselves; doing so breaches separation of powers and procurement law.',
      sw: 'Gavana (Kifungu cha 179) anasimamia idara za kaunti, kuajiri wafanyikazi kupitia Bodi ya Utumishi wa Umma ya Kaunti, na kuelekeza matumizi. Diwani (Kifungu cha 185) anawakilisha wadi yake bungeni, kuchunguza mawaziri wa gavana (CECMs), kutunga sheria za kaunti, kuidhinisha bajeti na kuangazia miradi iliyokwama. Diwani hana mamlaka ya kujenga miradi au kupeana zabuni yeye binafsi.',
    },
    keyArticles: ['Article 179', 'Article 183', 'Article 185', 'Public Procurement Act'],
    actionableTip: {
      en: 'Demand committee inspection reports from your MCA regarding any stalled water pipeline, dispensary, or market shed in your ward.',
      sw: 'Mwombe Diwani wako ripoti za kamati ya bunge kuhusu mradi wowote wa soko, zahanati au maji uliokwama katika wadi yenu.',
    },
  },
  {
    id: 'faq-senator-vs-mp',
    category: 'representation',
    question: {
      en: 'What is the exact difference between a Senator, an MP (National Assembly), and a Woman Representative?',
      sw: 'Tofauti hasa kati ya Seneta, Mbunge wa Bunge la Kitaifa (MP), na Mwakilishi wa Wanawake (Woman Rep) ni ipi?',
    },
    summary: {
      en: 'A Senator protects county interests and county shareable revenue; an MP represents constituency matters and monitors national ministries; a Woman Rep represents county-wide affirmative action.',
      sw: 'Seneta anasimamia maslahi ya kaunti na mgawanyo wa mapato; Mbunge anawakilisha eneo bunge na kusimamia mawaziri wa kitaifa; Mwakilishi wa Wanawake anawakilisha kaunti nzima kwa miradi ya usawa wa kijinsia na kundi maalum.',
    },
    detailedAnswer: {
      en: 'Article 96 establishes that the Senate determines national revenue allocation among counties and conducts accountability hearings for governors. Article 95 assigns the National Assembly sole power to vote on national taxation, approve Cabinet Secretaries, allocate the National Government-Constituency Development Fund (NG-CDF), and oversee national ministries like Police and Education. The County Woman Representative (Article 97(1)(b)) sits in the National Assembly as a full MP representing county-wide affirmative action and managing the National Government Affirmative Action Fund (NGAAF).',
      sw: 'Kifungu cha 96 kinaeleza kuwa Seneta analinda maslahi ya kaunti na kuamua mgao wa fedha za kaunti, pamoja na kuwawajibisha magavana kwenye kamati ya Senate CPAIC. Kifungu cha 95 kinaeleza kuwa Mbunge wa Kitaifa anapitisha ushuru wa taifa, kusimamia wizara za kitaifa, na kusimamia fedha za NG-CDF. Mwakilishi wa Wanawake anachaguliwa na kaunti nzima lakini anahudumu katika Bunge la Kitaifa akisimamia mfuko wa NGAAF kwa ajili ya wanawake, vijana na watu wanaoishi na ulemavu.',
    },
    keyArticles: ['Article 95', 'Article 96', 'Article 97(1)(b)', 'CDF Act'],
    actionableTip: {
      en: 'For secondary school laboratory grants or security police posts, contact your MP (NG-CDF). For county revenue oversight and county boundary disputes, petition your Senator.',
      sw: 'Kwa ujenzi wa madarasa ya shule za upili na vituo vya polisi, wasiliana na Mbunge (NG-CDF). Kwa ukaguzi wa fedha za kaunti na masuala ya ugavi wa mapato, mwandikie Seneta wako.',
    },
  },
  {
    id: 'faq-arrest-rights',
    category: 'rights',
    question: {
      en: 'What are my constitutional rights if stopped or arrested by the police in Kenya?',
      sw: 'Je, haki zangu za kikatiba ni zipi nikisimamishwa au kukamatwa na polisi nchini Kenya?',
    },
    summary: {
      en: 'Under Article 49, you have the right to remain silent, be informed promptly of the reason for arrest, communicate with an advocate or family member, and be produced in court within 24 hours.',
      sw: 'Chini ya Kifungu cha 49, una haki ya kunyamaza, kuarifiwa sababu ya kukamatwa mara moja, kuwasiliana na wakili au familia, na kufikishwa mahakamani ndani ya saa 24.',
    },
    detailedAnswer: {
      en: 'Police officers must identify themselves and state the specific offence for which you are being held. You must not be compelled to make any confession or admission that could be used against you. If arrested, you must be held in humane conditions with access to medical care and water. Police cash bail must be reasonable. If 24 hours expires on a weekend or public holiday, you must be produced in court on the first subsequent working day before the end of court hours.',
      sw: 'Afisa wa polisi lazima ajitambulishe na kukueleza kosa unalotuhumiwa nalo. Huwezi kulazimishwa kutoa ungamo la hatia au kukiri kosa. Unapaswa kuwekwa katika mazingira ya kibinadamu na kupewa maji na matibabu yakihitajika. Dhamana ya polisi (police cash bail) inapaswa kuwa ya kiasi cha kuridhisha. Huwezi kuzuiliwa zaidi ya saa 24 bila kufikishwa mahakamani.',
    },
    keyArticles: ['Article 29 (Freedom & Security of Person)', 'Article 49 (Rights of Arrested Persons)', 'Article 50 (Fair Hearing)'],
    actionableTip: {
      en: 'Always memorize or keep written contact details of a legal aid officer, trusted family contact, or Kenya National Commission on Human Rights (KNCHR) toll-free hotline (0800 720 627).',
      sw: 'Daima kumbuka nambari ya simu ya jamaa wa karibu au Tume ya Kitaifa ya Haki za Binadamu (KNCHR nambari ya bure: 0800 720 627).',
    },
  },
  {
    id: 'faq-access-to-info',
    category: 'rights',
    question: {
      en: 'Can a citizen legally demand copies of government tender documents and expenditure reports?',
      sw: 'Je, mwananchi anaruhusiwa kisheria kudai nakala za mikataba ya zabuni za serikali na ripoti za matumizi ya fedha?',
    },
    summary: {
      en: 'Yes. Article 35 of the Constitution and the Access to Information Act 2016 guarantee citizens the right to demand information held by the state.',
      sw: 'Ndiyo. Kifungu cha 35 cha Katiba na Sheria ya Kupata Taarifa ya 2016 vinampa kila mwananchi haki ya kudai na kupata taarifa zilizopo mikononi mwa serikali.',
    },
    detailedAnswer: {
      en: 'Every Kenyan citizen has an enforceable constitutional right to request and receive public records, contracts, budgets, audit reviews, and project feasibility files from any national ministry, county department, parastatal, or state agency. Public agencies must respond within 21 days (or 48 hours if it concerns life or liberty). If a public officer refuses to disclose unclassified information, you can appeal to the Commission on Administrative Justice (Ombudsman).',
      sw: 'Kila mwananchi wa Kenya ana haki ya kisheria ya kuomba na kupewa rekodi za umma, mikataba ya ujenzi, bajeti, ukaguzi wa mkaguzi mkuu wa hesabu, na taarifa za miradi. Idara ya serikali inatakiwa kujibu ndani ya siku 21 (au saa 48 ikiwa inahusu uhai au uhuru wa mtu). Afisa akikataa kutoa taarifa, unaweza kukata rufaa kwa Tume ya Ombudsman (CAJ).',
    },
    keyArticles: ['Article 35', 'Access to Information Act 2016', 'Commission on Administrative Justice Act'],
    actionableTip: {
      en: 'Write a simple formal letter headed "Request for Information under Article 35" specifying the project name and deliver it to the County Secretary with an acknowledgment stamp.',
      sw: 'Andika barua rasmi yenye kichwa "Ombi la Taarifa chini ya Kifungu cha 35 cha Katiba", taja mradi unaoutilia shaka, na uiwasilishe kwa Katibu wa Kaunti upate muhuri wa kupokelewa.',
    },
  },
  {
    id: 'faq-ward-bursaries',
    category: 'public_funds',
    question: {
      en: 'How are County Ward Bursaries and NG-CDF Bursaries supposed to be awarded fairly?',
      sw: 'Ufadhili wa masomo wa Kaunti (Bursary) na NG-CDF unapaswa kupewa wananchi kwa njia gani ya haki?',
    },
    summary: {
      en: 'Bursaries must be awarded strictly through public ward vetting committees based on verified vulnerability, orphanhood, and academic continuity, not political affiliation.',
      sw: 'Misaada ya masomo ya serikali inapaswa kutolewa kupitia kamati huru za wadi zilizochaguliwa na jamii kwa kuzingatia uhitaji halisi na yatima, bila ubaguzi wa kisiasa.',
    },
    detailedAnswer: {
      en: 'Public bursary funds originate from taxpayers money under the Public Finance Management Act (PFMA) 2012. Ward Bursary Committees must comprise community representatives (religious leaders, youth, persons with disabilities, women). Discrimination based on whether a parent voted for an elected official violates Article 27 (equality and freedom from discrimination) and Article 73 (leadership and integrity).',
      sw: 'Fedha za bursary zinatokana na kodi za wananchi chini ya Sheria ya Usimamizi wa Fedha za Umma (PFMA) 2012. Kamati ya Bursary ya Wadi lazima iwe na wawakilishi wa jamii (viongozi wa dini, vijana, walemavu, wanawake). Kumbagua mwanafunzi kisa wazazi wake hawakumpigia kura kiongozi fulani ni kosa la kikatiba chini ya Kifungu cha 27 na Kifungu cha 73.',
    },
    keyArticles: ['Article 27', 'Article 73', 'Public Finance Management Act 2012'],
    actionableTip: {
      en: 'Ensure your application is accompanied by official fee structures and death certificates/vulnerability letters. If unfairly rejected while meeting criteria, submit a complaint to the County Education CECM or Ombudsman.',
      sw: 'Ambatanisha barua rasmi ya ada ya shule na barua ya chifu au cheti cha kifo cha mzazi. Ukikataliwa kwa upendeleo, wasilisha malalamiko kwa Waziri wa Elimu wa Kaunti au Ombudsman.',
    },
  },
  {
    id: 'faq-bribery-eacc',
    category: 'public_funds',
    question: {
      en: 'What should a citizen do when asked for a bribe at a government office (e.g. land registry, hospital, or police post)?',
      sw: 'Mwananchi anapaswa kufanya nini anapodaiwa hongo kwenye ofisi ya serikali (mfano ardhi, hospitali au kituo cha polisi)?',
    },
    summary: {
      en: 'Demanding or paying a bribe is a criminal offense under the Bribery Act 2016 and Anti-Corruption and Economic Crimes Act (ACECA).',
      sw: 'Kudai au kutoa rushwa ni kosa kubwa la jinai chini ya Sheria ya Kuzuia Rushwa ya 2016 na Sheria ya Uhujumu Uchumi (ACECA).',
    },
    detailedAnswer: {
      en: 'Chapter 6 of the Constitution requires public officers to serve with honesty and selfless dedication. Never pay a bribe to receive a public service that is provided by law. Take note of the officers name, service badge number, office room, exact date and time, and the amount demanded. You can report directly and confidentially to the Ethics and Anti-Corruption Commission (EACC) toll-free hotline 0800 722 203 or report to the Ombudsman.',
      sw: 'Sura ya Sita ya Katiba inataka watumishi wa umma kuhudumia wananchi kwa uadilifu bila unyonyaji. Kamwe usitoe hongo ili kupata huduma ya kisheria. Kumbuka jina la afisa, nambari ya beji, chumba cha ofisi, tarehe na saa, na kiasi anachotaka. Unaweza kuripoti kwa siri kwa Tume ya Maadili na Kupambana na Ufisadi (EACC nambari ya bure: 0800 722 203) au kwa Tume ya Ombudsman.',
    },
    keyArticles: ['Chapter Six (Article 73 & 75)', 'Bribery Act 2016', 'ACECA 2003'],
    actionableTip: {
      en: 'Request an official government payment invoice (such as eCitizen paybill or official county treasury receipt). Unofficial cash or M-Pesa payments to individual officer phone numbers are unlawful.',
      sw: 'Dai ankara rasmi ya malipo ya serikali (mfano nambari ya eCitizen au stakabadhi ya halmashauri ya kaunti). Usilipe pesa taslimu mkononi mwa afisa.',
    },
  },
  {
    id: 'faq-small-claims-court',
    category: 'judiciary',
    question: {
      en: 'How does the Small Claims Court work for commercial disputes and unpaid debts under KES 1 Million?',
      sw: 'Mahakama ya Madai Madogo (Small Claims Court) inafanya vipi kazi kwa migogoro ya madeni chini ya Shilingi Milioni Moja?',
    },
    summary: {
      en: 'The Small Claims Court provides fast, cheap, simplified justice for disputes up to KES 1,000,000, resolving cases within 60 days without requiring an advocate.',
      sw: 'Mahakama ya Madai Madogo inatoa haki ya haraka na gharama nafuu kwa madai hadi KES 1,000,000, ikitatua kesi ndani ya siku 60 bila ulazima wa kuajiri wakili.',
    },
    detailedAnswer: {
      en: 'Established under the Small Claims Court Act, this court resolves civil disputes such as unpaid supply deliveries, tenant-landlord deposit disputes, small contract breaches, and personal loans. Filing fees are minimal, strict technical legal rules do not delay hearings, and the presiding adjudicator must deliver judgment within 60 days of case filing. You can file your claim directly in person or via the Judiciary e-filing portal.',
      sw: 'Iliyoanzishwa chini ya Sheria ya Mahakama ya Madai Madogo, inashughulikia madai ya mikataba midogo, kodi za nyumba, malipo ya bidhaa zilizotolewa, na madeni ya kibinafsi. Ada za kusajili kesi ni ndogo sana, taratibu ngumu za kisheria hazicheleweshi kesi, na hakimu anapaswa kutoa uamuzi ndani ya siku 60. Unaweza kusajili kesi mwenyewe kupitia mtandao wa mahakama wa e-filing.',
    },
    keyArticles: ['Article 159(2) (Judicial Authority & Expedited Justice)', 'Small Claims Court Act 2016'],
    actionableTip: {
      en: 'Keep written evidence (receipts, delivery notes, WhatsApp chat confirmations, M-Pesa statements) before filing at your nearest Law Courts.',
      sw: 'Weka ushahidi thabiti wa maandishi (stakabadhi, jumbe za WhatsApp, taarifa za M-Pesa) kabla ya kusajili dai lako katika mahakama iliyo karibu nawe.',
    },
  },
  {
    id: 'faq-recalling-elected-leader',
    category: 'representation',
    question: {
      en: 'Can citizens recall an ineffective Member of Parliament (MP) or MCA before the 5-year term ends?',
      sw: 'Je, wananchi wanaweza kumwondoa mamlakani (Recall) Mbunge au Diwani kabla ya muhula wa miaka 5 kuisha?',
    },
    summary: {
      en: 'Yes. Article 104 guarantees citizens the right to recall their elected legislators in the National Assembly, Senate, or County Assembly.',
      sw: 'Ndiyo. Kifungu cha 104 cha Katiba kinawapa wananchi haki ya kumwondoa mbunge au diwani asiyetekeleza wajibu wake kabla ya muda wake kukamilika.',
    },
    detailedAnswer: {
      en: 'Under Article 104 of the Constitution and Section 45 of the Elections Act, a recall petition may be initiated on grounds of physical or mental incapacity, gross misconduct, violation of Chapter Six (Leadership and Integrity), or mismanagement of public funds. A recall petition must be signed by registered voters in the constituency or ward (historically requiring at least 30% of registered voters) and submitted to the Independent Electoral and Boundaries Commission (IEBC).',
      sw: 'Chini ya Kifungu cha 104 na Sheria ya Uchaguzi, mchakato wa kumwondoa kiongozi unaweza kuanzishwa kwa sababu za uvunjaji wa maadili ya uongozi (Sura ya Sita), ubadhirifu wa fedha za umma, au kukiuka katiba. Maombi ya kumwondoa kiongozi hukusanya saini za wapiga kura waliosajiliwa na kuwasilishwa kwa Tume Huru ya Uchaguzi na Mipaka (IEBC).',
    },
    keyArticles: ['Article 104', 'Elections Act Section 45-48', 'Chapter Six'],
    actionableTip: {
      en: 'Document specific constitutional violations or audit infractions before mobilizing community petition signatures.',
      sw: 'Nyaraka makosa maalum ya kikatiba au ripoti rasmi za mkaguzi mkuu wa hesabu kabla ya kuanzisha zoezi la kukusanya saini za wananchi.',
    },
  },
];
