import { CivicLesson } from '../types';

export const lessonsData: CivicLesson[] = [
  // Lesson 1
  {
    id: 'lesson_1',
    lessonNumber: 1,
    title: {
      en: 'Understanding the Constitution of Kenya 2010',
      sw: 'Kuelewa Katiba ya Kenya 2010',
    },
    summary: {
      en: 'Learn what a constitution is, why Kenya promulgated the 2010 Constitution, and how it protects citizens as the supreme law of the land.',
      sw: 'Jifunze maana ya katiba, kwa nini Kenya ilitunga Katiba ya 2010, na jinsi inavyomlinda kila mwananchi kama sheria kuu ya nchi.',
    },
    category: 'constitution',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. What is a Constitution?',
          sw: '1. Katiba ni nini?',
        },
        content: {
          en: 'A constitution is the supreme law of a country. It sets out the foundational rules by which a nation is governed, establishes state organs, defines their powers and limitations, and guarantees the fundamental rights and freedoms of all citizens.',
          sw: 'Katiba ni sheria kuu na ya juu zaidi katika nchi. Inaweka misingi na kanuni za jinsi taifa linavyoongozwa, inaunda vyombo vya dola, inabainisha mipaka ya mamlaka yao, na inalinda haki za msingi za kila mwananchi.',
        },
        callout: {
          en: 'Article 2(1): "This Constitution is the supreme law of the Republic and binds all persons and all State organs at both levels of government."',
          sw: 'Kifungu cha 2(1): "Katiba hii ndiyo sheria kuu ya Jamhuri na inamfunga kila mtu na vyombo vyote vya dola katika ngazi zote mbili za serikali."',
        },
      },
      {
        title: {
          en: '2. Why Kenya Enacted the 2010 Constitution',
          sw: '2. Kwa Nini Kenya Ilipitisha Katiba ya 2010?',
        },
        content: {
          en: 'Before 2010, Kenya had an imperial presidency where power was centralized in Nairobi, basic rights were routinely infringed, and resources were distributed unequally. The 2010 Constitution was passed by a massive 67% referendum vote to:',
          sw: 'Kabla ya 2010, Kenya ilikuwa na mfumo uliompa Rais mamlaka makubwa mno (imperial presidency), madaraka yalilundikwa Nairobi, haki za binadamu zilivunjwa, na rasilimali ziligawanywa kwa upendeleo. Wananchi walipiga kura ya maoni kwa 67% kubadili mfumo huo ili:',
        },
        bulletPoints: {
          en: [
            'End absolute executive power through strict checks and balances.',
            'Devolve governance and resources to 47 county governments so decisions are made closer to the people.',
            'Enshrine an expansive Bill of Rights (Chapter 4) that cannot be taken away arbitrarily.',
            'Establish independent commissions (IEBC, EACC, Auditor-General, Judiciary) to curb corruption and abuse of office.',
          ],
          sw: [
            'Kukomesha mamlaka ya kiimla ya Rais kwa kuweka mfumo dhabiti wa ukaguzi na mizania.',
            'Kugatuza mamlaka na rasilimali kwa serikali 47 za kaunti ili maamuzi yafanywe karibu na mwananchi.',
            'Kuweka Mswada wa Haki (Sura ya 4) unaolinda uhai, utu, elimu, afya, na uhuru wa kusema.',
            'Kuanzisha tume huru (IEBC, EACC, Mkaguzi Mkuu, Mahakama) kukabili rushwa na matumizi mabaya ya ofisi.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Sovereignty of the People', sw: 'Mamlaka Kuu ya Wananchi' },
        definition: {
          en: 'Article 1 states all sovereign power belongs to the people of Kenya. State officers only exercise delegated power.',
          sw: 'Kifungu cha 1 kinasema mamlaka yote ya nchi ni ya wananchi wa Kenya. Viongozi wanatumia tu mamlaka waliyokabidhiwa kwa niaba ya wananchi.',
        },
      },
      {
        term: { en: 'Constitutional Supremacy', sw: 'Ukuu wa Katiba' },
        definition: {
          en: 'Any law or action that is inconsistent with the Constitution is invalid and null and void.',
          sw: 'Sheria au kitendo chochote kinachopingana na Katiba ni batili na hakina nguvu ya kisheria.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Always remember: The President, Governors, MPs, and Police are your public servants, not your rulers. You have a constitutional right to question how they spend your taxes.',
      sw: 'Kumbuka kila wakati: Rais, Magavana, Wabunge, na Polisi ni watumishi wa umma, si watawala wako. Una haki ya kikatiba ya kuhoji jinsi wanavyotumia kodi zako.',
    },
  },

  // Lesson 2
  {
    id: 'lesson_2',
    lessonNumber: 2,
    title: {
      en: 'Understanding Government: 3 Arms and 2 Levels',
      sw: 'Kuelewa Serikali: Mihimili 3 na Ngazi 2',
    },
    summary: {
      en: 'Explore the architectural division of Kenya\'s government: Executive, Legislature, and Judiciary, functioning across National and County levels.',
      sw: 'Chunguza muundo wa serikali ya Kenya: Mhimili wa Utendaji, Bunge, na Mahakama, inayofanya kazi katika ngazi ya Kitaifa na Kaunti.',
    },
    category: 'government',
    readTimeMinutes: 6,
    sections: [
      {
        title: {
          en: '1. The Three Arms of Government',
          sw: '1. Mihimili Mitatu ya Serikali',
        },
        content: {
          en: 'To prevent dictatorship, government power is divided into three distinct branches with separate roles:',
          sw: 'Ili kuzuia udikteta au mtu mmoja kujilimbikizia mamlaka, serikali imegawanywa katika sehemu tatu kuu zenye majukumu tofauti:',
        },
        bulletPoints: {
          en: [
            'The Executive (President, Cabinet, Civil Service, Police): Implements laws and runs daily state operations.',
            'The Legislature (Parliament - National Assembly & Senate, plus County Assemblies): Enacts laws, approves budgets, and conducts oversight.',
            'The Judiciary (Supreme Court, Court of Appeal, High Court, Magistrates, Kadhis): Interprets laws, administers justice, and resolves disputes impartially.',
          ],
          sw: [
            'Serikali Kuu / Utendaji (Rais, Mawaziri, Watumishi wa Umma): Hutekeleza sheria na kuendesha shughuli za kila siku za nchi.',
            'Bunge (Bunge la Kitaifa, Seneti, na Mabunge ya Kaunti): Hutunga sheria, kuidhinisha bajeti, na kusimamia serikali kuu.',
            'Idara ya Mahakama (Mahakama ya Juu, Mahakama ya Rufaa, Mahakama Kuu, Mahakama za Hakimu na Kadhi): Hufafanua sheria na kutoa haki bila upendeleo.',
          ],
        },
      },
      {
        title: {
          en: '2. Two Distinct and Interdependent Levels',
          sw: '2. Ngazi Mbili Tofauti Zenye Kutegemeana',
        },
        content: {
          en: 'Article 6 establishes two levels of government: the National Government and 47 County Governments. They are distinct in their constitutional mandates, yet interdependent, conducting their mutual relations on the basis of consultation and cooperation.',
          sw: 'Kifungu cha 6 cha Katiba kinaanzisha ngazi mbili za serikali: Serikali ya Kitaifa na Serikali 47 za Kaunti. Zina mamlaka tofauti kikatiba, lakini zinategemeana na zinafanya kazi kwa mashauriano na ushirikiano.',
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Separation of Powers', sw: 'Mgawanyo wa Mamlaka' },
        definition: {
          en: 'No single branch can dominate the other; each branch has constitutional limits to prevent tyranny.',
          sw: 'Hakuna mhimili wowote unaoweza kujifanya mkuu kuliko mwingine; kila mhimili una mipaka ya kikatiba.',
        },
      },
      {
        term: { en: 'Interdependence', sw: 'Kutegemeana' },
        definition: {
          en: 'The national government cannot treat county governments as subordinate branch offices; both must dialogue through IBEC and CoG.',
          sw: 'Serikali ya kitaifa haiwezi kuzichukulia kaunti kama idara zake za chini; lazima zishauriane kisheria.',
        },
      },
    ],
    citizenActionTip: {
      en: 'When raising a problem, identify whether it belongs to County Government (e.g. clinic medicines, rural water, garbage) or National Government (e.g. national identity cards, police, secondary school curriculum).',
      sw: 'Unapotaka kutatuliwa changamoto, jua kama ni ya Serikali ya Kaunti (dawa zahanatini, maji ya kijijini, masoko) au Serikali ya Kitaifa (vitambulisho vya taifa, polisi, sheria ya elimu).',
    },
  },

  // Lesson 3
  {
    id: 'lesson_3',
    lessonNumber: 3,
    title: {
      en: 'Elections and the Electoral Process in Kenya',
      sw: 'Uchaguzi na Mchakato wa Upigaji Kura Kenya',
    },
    summary: {
      en: 'Understand how citizens choose their leaders every 5 years, the 6 ballot papers in a general election, voter rights, and by-elections.',
      sw: 'Fahamu jinsi wananchi wanavyochagua viongozi kila baada ya miaka 5, karatasi 6 za kura kwenye uchaguzi mkuu, haki za mpiga kura na chaguzi ndogo.',
    },
    category: 'elections',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. The Six Ballots on Election Day',
          sw: '1. Karatasi Sita za Kura Siku ya Uchaguzi',
        },
        content: {
          en: 'During Kenya\'s general election held on the second Tuesday in August every fifth year, every registered voter receives six distinct ballot papers:',
          sw: 'Katika uchaguzi mkuu unaofanyika Jumanne ya pili ya mwezi Agosti kila baada ya miaka mitano, kila mpiga kura anapewa karatasi sita za kura:',
        },
        bulletPoints: {
          en: [
            '1. President of Kenya (White ballot)',
            '2. Member of the National Assembly / Constituency MP (Green ballot)',
            '3. Senator (Yellow ballot)',
            '4. County Woman Representative (Purple ballot)',
            '5. County Governor (Blue ballot)',
            '6. Member of County Assembly / Ward MCA (Beige ballot)',
          ],
          sw: [
            '1. Rais wa Jamhuri ya Kenya (Karatasi nyeupe)',
            '2. Mbunge wa Bunge la Kitaifa / Eneo Bunge (Karatasi ya kijani)',
            '3. Seneta wa Kaunti (Karatasi ya manjano)',
            '4. Mwakilishi wa Wanawake wa Kaunti (Karatasi ya zambarau)',
            '5. Gavana wa Kaunti (Karatasi ya bluu)',
            '6. Diwani / MCA wa Wadi (Karatasi ya hudhurungi)',
          ],
        },
      },
      {
        title: {
          en: '2. Principles of the Electoral System',
          sw: '2. Misingi ya Mfumo wa Uchaguzi',
        },
        content: {
          en: 'Under Article 81, voting is universal, secret, and free from violence, intimidation, or bribery. Elections must be transparent, impartial, and accurately administered by IEBC.',
          sw: 'Chini ya Kifungu cha 81, kura ni ya siri, huru na bila vitisho, vurugu wala hongo ya pesa. Uchaguzi lazima uwe wa uwazi, haki na uendeshwe kwa uadilifu na IEBC.',
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'By-Election', sw: 'Uchaguzi Mdogo' },
        definition: {
          en: 'An election held when an elected seat falls vacant due to death, resignation, court nullification, or impeachment before the regular 5-year cycle.',
          sw: 'Uchaguzi unaofanyika kiti cha uongozi kinapobaki wazi kwa kifo, kujiuzulu, kubatilishwa na mahakama au kuondolewa kabla ya miaka 5.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Selling your vote for cash or handouts compromises 5 years of school bursaries, road repairs, and hospital medicine. Vote based on policy and track record.',
      sw: 'Kuuza kura yako kwa pesa au unga kunaharibu miaka mitano ya maendeleo ya shule, barabara na dawa hospitalini. Piga kura kwa sera na uadilifu.',
    },
  },

  // Lesson 4
  {
    id: 'lesson_4',
    lessonNumber: 4,
    title: {
      en: 'Nominations, Appointments, and Parliamentary Vetting',
      sw: 'Uteuzi, Kuajiriwa, na Msasa wa Bunge',
    },
    summary: {
      en: 'Learn the difference between elected leaders, nominated officials, and appointed state officers, and why public vetting matters.',
      sw: 'Jifunze tofauti ya viongozi waliochaguliwa, walioteuliwa kisiasa (nominated), na watumishi wa umma walioajiriwa, na umuhimu wa usaili wa bunge.',
    },
    category: 'government',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. Three Ways Public Officers Enter Office',
          sw: '1. Njia Tatu Viongozi Wanavyoingia Ofisini',
        },
        content: {
          en: 'Understanding how someone was placed into public office tells you who holds them accountable:',
          sw: 'Kuelewa jinsi kiongozi alivyoingia madarakani kunakusaidia kujua ni nani anayeweza kumwajibisha:',
        },
        bulletPoints: {
          en: [
            'Elected: Voted directly by the people (President, Governor, Senator, MP, Woman Rep, MCA). Answerable to voters.',
            'Nominated (Affirmative Action): Selected by political parties based on proportional voter support to represent youth, women, workers, and PWDs in Parliament and County Assemblies (Articles 97, 98, 177).',
            'Appointed / Competitive: Recruited through advertisement, shortlisted by PSC/JSC, and vetted by Parliament (Cabinet Secretaries, Principal Secretaries, Chief Justice, Commissioners). Answerable to law and appointing organs.',
          ],
          sw: [
            'Waliochaguliwa: Walipigiwa kura na wananchi (Rais, Gavana, Seneta, Mbunge, Mwakilishi wa Wanawake, MCA). Huwajibika kwa wapiga kura.',
            'Walioteuliwa (Viti Maalum): Waliteuliwa na vyama vya siasa kulingana na kura kilizopata ili kuwakilisha vijana, wanawake na walemavu bungeni.',
            'Walioajiriwa / Kuteuliwa Kitaalamu: Walifanyiwa usaili wa ushindani (PSC/JSC) na kupigwa msasa na Bunge (Mawaziri, Makatibu Wakuu, Majaji, Makamishna).',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Public Vetting', sw: 'Upigaji Msasa wa Umma' },
        definition: {
          en: 'Constitutional process where nominees for top public offices appear before elected representatives in televised hearings where citizens submit affidavits on their suitability.',
          sw: 'Mchakato wa kikatiba ambapo wateule wa vyeo vikuu hufika mbele ya kamati ya bunge na wananchi wanaruhusiwa kuwasilisha malalamiko ya uadilifu wao.',
        },
      },
    ],
    citizenActionTip: {
      en: 'When the National Assembly or County Assembly advertises vetting of Cabinet or County Minister nominees, any citizen can submit a sworn affidavit detailing why an unqualified or corrupt nominee should be rejected.',
      sw: 'Bunge linapotangaza majina ya mawaziri wanaofanyiwa usaili, mwananchi yeyote ana haki ya kuwasilisha ushahidi rasmi unaoonyesha kwa nini mteule fisadi asikubaliwe.',
    },
  },

  // Lesson 5
  {
    id: 'lesson_5',
    lessonNumber: 5,
    title: {
      en: 'Leadership and Integrity (Chapter 6 of the Constitution)',
      sw: 'Uongozi na Uadilifu (Sura ya 6 ya Katiba)',
    },
    summary: {
      en: 'Discover the ethical standards every Kenyan leader must uphold: service to the people, conflict of interest prohibitions, and financial accountability.',
      sw: 'Gundua maadili na kanuni ambazo kila kiongozi wa Kenya lazima azingatie: kuwatumikia wananchi, kuzuia mgongano wa kimaslahi, na uwazi wa kifedha.',
    },
    category: 'integrity',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. Public Office is a Public Trust',
          sw: '1. Mamlaka ya Umma ni Dhamana ya Wananchi',
        },
        content: {
          en: 'Article 73 declares that authority assigned to a state officer is a public trust to be exercised in a manner that demonstrates respect for the people, brings honour to the nation, and promotes public confidence.',
          sw: 'Kifungu cha 73 kinasisitiza kuwa madaraka anayopewa kiongozi wa umma ni dhamana anayopewa na wananchi, na anapaswa kuyatumia kwa njia inayoheshimu watu na kuleta heshima kwa taifa.',
        },
        bulletPoints: {
          en: [
            'Personal integrity, competence, and selfless devotion to duty.',
            'Decisions must be based solely on the public interest, never nepotism, bribery, or favoritism.',
            'Accountability to the public for decisions and actions.',
            'Discipline and commitment in service to the people.',
          ],
          sw: [
            'Uadilifu wa kibinafsi, uwezo na kujitolea bila ubinafsi.',
            'Maamuzi lazima yalenge maslahi ya umma pekee, bila upendeleo wa kikabila, kindugu au rushwa.',
            'Kuwajibika kwa wananchi kwa maamuzi na vitendo vyote.',
            'Nidhamu na kujitolea kuwatumikia wananchi kwa ukarimu.',
          ],
        },
      },
      {
        title: {
          en: '2. Prohibited Conduct for State Officers',
          sw: '2. Mambo Yaliyokatazwa kwa Viongozi wa Umma',
        },
        content: {
          en: 'Under Article 75 and 76, a state officer shall not:',
          sw: 'Chini ya Vifungu vya 75 na 76, kiongozi wa serikali haruhusiwi:',
        },
        bulletPoints: {
          en: [
            'Award public tenders to their own private businesses or direct family members (Conflict of Interest).',
            'Maintain a foreign bank account without explicit approval from EACC.',
            'Accept gifts, donations, or free flights that could influence official duties.',
            'Use public funds, government vehicles, or state staff for personal political campaigns.',
          ],
          sw: [
            'Kujipatia zabuni za serikali au kuzipeleka kwa makampuni ya ndugu zake (Mgongano wa Kimaslahi).',
            'Kuwa na akaunti ya benki nje ya nchi bila idhini rasmi ya EACC.',
            'Kupokea zawadi za thamani au fadhila zinazoweza kumuathiri kimaamuzi.',
            'Kutumia magari ya serikali, mafuta au wafanyakazi wa umma kwenye kampeni za kisiasa.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Conflict of Interest', sw: 'Mgongano wa Kimaslahi' },
        definition: {
          en: 'When a public officer has a personal financial or family interest that could improperly influence the performance of their official duties.',
          sw: 'Hali ambapo kiongozi ana maslahi binafsi au ya kifedha yanayoweza kuharibu haki katika utoaji wa maamuzi ya umma.',
        },
      },
    ],
    citizenActionTip: {
      en: 'If you see government vehicles being used at political rallies or school building tenders awarded to an official\'s company, report it directly to the Ethics and Anti-Corruption Commission (EACC).',
      sw: 'Ukiona gari la serikali likitumiwa kwenye mikutano ya kisiasa au zabuni za shule zikipewa kampuni ya afisa wa serikali, ripoti mara moja kwa EACC.',
    },
  },

  // Lesson 6
  {
    id: 'lesson_6',
    lessonNumber: 6,
    title: {
      en: 'Public Participation: Your Voice in Government Decisions',
      sw: 'Ushiriki wa Umma: Sauti Yako Kwenye Maamuzi ya Serikali',
    },
    summary: {
      en: 'Master how public participation works in Kenya, why any law passed without citizen consultation is illegal, and how to participate in county budget meetings.',
      sw: 'Jifunze jinsi ushiriki wa umma unavyofanya kazi, kwa nini sheria yoyote inayopitishwa bila maoni ya wananchi ni batili, na jinsi ya kushiriki vikao vya bajeti.',
    },
    category: 'participation',
    readTimeMinutes: 6,
    sections: [
      {
        title: {
          en: '1. Public Participation is a Constitutional Requirement',
          sw: '1. Ushiriki wa Umma ni Sharti la Kikatiba',
        },
        content: {
          en: 'Under Article 10(2)(a), public participation is one of Kenya\'s binding national values. Kenya\'s courts have repeatedly nullified national and county taxes, policies, and laws because the government failed to conduct meaningful citizen consultations.',
          sw: 'Chini ya Kifungu cha 10(2)(a), ushiriki wa umma ni moja ya misingi mikuu ya kitaifa. Mahakama za Kenya zimekuwa zikifutilia mbali kodi na sheria zilizopitishwa kwa haraka kwa sababu serikali haikuwashirikisha wananchi ipasavyo.',
        },
      },
      {
        title: {
          en: '2. The County Budget Calendar and Where to Engage',
          sw: '2. Kalenda ya Bajeti ya Kaunti na Mahali pa Kushiriki',
        },
        content: {
          en: 'County governments cannot spend single public shilling without public hearings at these key milestones:',
          sw: 'Serikali za kaunti haziwezi kutumia hata shilingi moja ya umma bila mikutano ya wananchi kwenye hatua hizi:',
        },
        bulletPoints: {
          en: [
            'September: Annual Development Plan (ADP) hearings in your ward.',
            'February: County Fiscal Strategy Paper (CFSP) setting spending priorities.',
            'April–May: County Budget Estimates hearings at ward level before County Assembly approval.',
            'June: County Finance Bill hearings where market rates, parking fees, and trade licenses are determined.',
          ],
          sw: [
            'Septemba: Mikutano ya Mpango wa Maendeleo wa Mwaka (ADP) katika wadi yako.',
            'Februari: Waraka wa Mkakati wa Fedha wa Kaunti (CFSP) unaoweka vipaumbele vya bajeti.',
            'Aprili–Mei: Mikutano ya Makadirio ya Bajeti ya Kaunti kabla ya kuidhinishwa na madiwani.',
            'Juni: Mswada wa Fedha wa Kaunti (Finance Bill) ambapo viwango vya ushuru wa masoko na leseni za biashara hupangwa.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Meaningful Consultation', sw: 'Mashauriano Yenye Maana' },
        definition: {
          en: 'Government must publish draft documents early, explain them in accessible language (English/Kiswahili), and provide a genuine opportunity for citizens to influence outcomes.',
          sw: 'Serikali lazima ichapishe nyaraka mapema, ieleze kwa lugha inayoeleweka, na itoe nafasi ya kweli kwa maoni ya wananchi kuzingatiwa.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Attend your local ward budget forum with fellow community members or youth groups. Submit written memoranda demanding water points, dispensary medicines, or bursary transparency. Keep a stamped copy!',
      sw: 'Hudhuria mikutano ya bajeti ya wadi ukiwa na wenzako au kikundi cha jamii. Wasilisheni maombi ya maandishi ya visima vya maji, dawa zahanatini, au ufadhili wa masomo. Hakikisha mnapata nakala iliyogongwa muhuri!',
    },
  },

  // Lesson 7
  {
    id: 'lesson_7',
    lessonNumber: 7,
    title: {
      en: 'Access to Information: The Right to Know',
      sw: 'Haki ya Kupata Taarifa: Haki Yako ya Kujua',
    },
    summary: {
      en: 'How to legally request contracts, budgets, and project records from any government office under Article 35 and the Access to Information Act.',
      sw: 'Jinsi ya kuomba mikataba ya miradi, ripoti za bajeti, na kumbukumbu kutoka ofisi yoyote ya serikali chini ya Kifungu cha 35 na Sheria ya Haki ya Taarifa.',
    },
    category: 'human_rights',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. Constitutional Right under Article 35',
          sw: '1. Haki ya Kikatiba Chini ya Kifungu cha 35',
        },
        content: {
          en: 'Every Kenyan citizen has the right to access information held by the state, and information held by another person required for the exercise or protection of any right or fundamental freedom.',
          sw: 'Kila mwananchi wa Kenya ana haki ya kupata taarifa inayoshikiliwa na serikali, na taarifa yoyote inayoshikiliwa na mtu au kampuni binafsi inayohitajika kwa ajili ya kulinda haki zake za msingi.',
        },
      },
      {
        title: {
          en: '2. Step-by-Step: How to Request Information',
          sw: '2. Hatua kwa Hatua: Jinsi ya Kuomba Taarifa',
        },
        content: {
          en: 'Under the Access to Information Act 2016, requesting information is straightforward:',
          sw: 'Chini ya Sheria ya Upatikanaji wa Taarifa ya 2016, kuomba taarifa ni rahisi:',
        },
        bulletPoints: {
          en: [
            'Write a letter to the designated Access to Information Officer or Chief Officer of the ministry/county.',
            'State clearly the specific documents you need (e.g. "Bill of quantities for the stalled dispensary in ward X").',
            'The public officer MUST provide the information within 21 working days (or within 48 hours if it concerns life or liberty).',
            'If they refuse or fail to reply, appeal immediately to the Commission on Administrative Justice (Ombudsman). Refusing lawful access is a criminal offense.',
          ],
          sw: [
            'Andika barua rasmi kwa Afisa wa Taarifa au Katibu Mkuu wa idara husika ya serikali au kaunti.',
            'Bainisha nyaraka unazoomba (mfano: "Mkataba na gharama za ujenzi wa zahanati iliyokwama katika wadi X").',
            'Afisa wa umma LAZIMA atoe taarifa hiyo ndani ya siku 21 za kazi (au ndani ya saa 48 ikiwa inahusu maisha ya mtu).',
            'Wakikataa au kukaa kimya, wasilisha rufaa kwa Tume ya Ombudsman. Kukataa kutoa taarifa ni kosa la jinai.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Proactive Disclosure', sw: 'Utoaji wa Taarifa kwa Hiari' },
        definition: {
          en: 'The legal duty of public bodies to publish budgets, tenders, and policies on websites and public notice boards without waiting to be asked.',
          sw: 'Wajibu wa kisheria wa serikali kuweka bajeti, zabuni, na sera wazi mtandaoni na kwenye mbao za matangazo bila kusubiri kuombwa.',
        },
      },
    ],
    citizenActionTip: {
      en: 'You do not need to give a complicated explanation for why you want public budgets. The law presumes public documents belong to you as a taxpayer.',
      sw: 'Huna haja ya kutoa sababu ngumu kwa nini unaomba ripoti ya bajeti ya serikali. Sheria inatambua kuwa nyaraka zote za umma ni mali ya walipa kodi.',
    },
  },

  // Lesson 8
  {
    id: 'lesson_8',
    lessonNumber: 8,
    title: {
      en: 'Public Accountability: Tools to Demand Results',
      sw: 'Uwajibikaji wa Umma: Mbinu za Kudai Matokeo',
    },
    summary: {
      en: 'Learn lawful and effective methods to demand accountability: citizen petitions, social audits, the Auditor-General\'s reports, and the right of recall.',
      sw: 'Jifunze njia halali na zenye ufanisi za kudai uwajibikaji: maombi rasmi (petitions), ukaguzi wa jamii, ripoti za Mkaguzi Mkuu, na haki ya kumng\'oa kiongozi.',
    },
    category: 'participation',
    readTimeMinutes: 6,
    sections: [
      {
        title: {
          en: '1. Citizen Petitions (Article 119)',
          sw: '1. Maombi Rasmi ya Wananchi (Kifungu cha 119)',
        },
        content: {
          en: 'Every person has a right to petition Parliament or a County Assembly to consider any matter within its authority, including enacting, amending, or repealing any legislation, or investigating administrative failures.',
          sw: 'Kila mwananchi ana haki ya kikatiba kuwasilisha ombi rasmi (petition) bungeni au kwenye Bunge la Kaunti kuomba suala lolote lichunguzwe, sheria ibadilishwe, au afisa aliyeharibu kazi achukuliwe hatua.',
        },
      },
      {
        title: {
          en: '2. The Power of Auditor-General Reports',
          sw: '2. Nguvu ya Ripoti za Mkaguzi Mkuu wa Hesabu',
        },
        content: {
          en: 'Every year, the Auditor-General publishes detailed reports exposing ghost workers, uncompleted projects paid for, and diverted public funds in each county and ministry. Citizens can use these public findings as documentary proof when filing petitions or holding leaders to account.',
          sw: 'Kila mwaka, Mkaguzi Mkuu huchapisha ripoti zinazofichua wafanyakazi hewa, miradi iliyolipwa lakini haijajengwa, na fedha zilizopotea. Wananchi wanaweza kutumia ripoti hizi kama ushahidi madhubuti wa kisheria.',
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Social Audit', sw: 'Ukaguzi wa Kijamii' },
        definition: {
          en: 'A process where community members physically inspect public project sites (e.g. water pipeline, classroom) comparing physical reality against budgeted specifications.',
          sw: 'Mchakato ambapo wananchi wa eneo husika wanaenda kutembelea mradi (mfano: bomba la maji au darasa) na kulinganisha kilichopo na kile kilicholipwa kwenye bajeti.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Partner with local community-based organizations like Kwale Focus Empowerment (KFE) to conduct joint social audits and submit structured petitions with verified facts.',
      sw: 'Shirikiana na mashirika ya kijamii kama Kwale Focus Empowerment (KFE) kufanya ukaguzi wa kijamii kwa pamoja na kuwasilisha maombi yenye ushahidi uliothibitishwa.',
    },
  },

  // Lesson 9
  {
    id: 'lesson_9',
    lessonNumber: 9,
    title: {
      en: 'Understanding County Government and Devolution',
      sw: 'Kuelewa Serikali ya Kaunti na Ugatuzi',
    },
    summary: {
      en: 'Explore the two arms of county government (Executive and Assembly), devolved functions under Schedule 4, and how county revenue is allocated.',
      sw: 'Chunguza pande mbili za serikali ya kaunti (Serikali Mtendaji na Bunge la Kaunti), huduma zilizogatuliwa chini ya Jedwali la 4, na jinsi mapato ya kaunti yanavyogawanywa.',
    },
    category: 'devolution',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. Two Arms of County Government',
          sw: '1. Pande Mbili za Serikali ya Kaunti',
        },
        content: {
          en: 'Just like the national level, county government has two arms that check each other:',
          sw: 'Sawa na serikali ya kitaifa, serikali ya kaunti ina pande mbili zinazokaguliwa na kudhibitiwa:',
        },
        bulletPoints: {
          en: [
            'County Executive: Led by the Governor, Deputy Governor, and County Executive Committee Members (CECMs). Manages departments and implements programmes.',
            'County Assembly: Composed of elected Ward MCAs, nominated members, and headed by an impartial Speaker. Passes county bylaws, approves county budgets, and vets the Governor\'s appointees.',
          ],
          sw: [
            'Serikali Mtendaji ya Kaunti: Inaongozwa na Gavana, Naibu Gavana, na Mawaziri wa Kaunti (CECMs). Inasimamia idara na miradi.',
            'Bunge la Kaunti: Linaongozwa na Spika wa Bunge la Kaunti na linaundwa na Madiwani (MCAs). Hutunga sheria ndogo za kaunti, kuidhinisha bajeti na kuwasimamia mawaziri.',
          ],
        },
      },
      {
        title: {
          en: '2. Devolved Functions (Schedule 4)',
          sw: '2. Huduma Zilizogatuliwa (Jedwali la 4)',
        },
        content: {
          en: 'Key functions devolved entirely to counties include county health facilities & ambulances, county roads and street lighting, agriculture & livestock disease control, early childhood education (ECDE) & polytechnics, local water supply, and trade licensing.',
          sw: 'Huduma muhimu zilizopelekwa kaunti ni pamoja na zahanati na hospitali za kaunti, barabara za vijijini na taa za barabarani, kilimo na mifugo, chekechea (ECDE) na vyuo vya ufundi vya vijiji, usambazaji wa maji ya ndani, na leseni za biashara.',
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Equitable Share', sw: 'Mgao Sawa wa Mapato' },
        definition: {
          en: 'The constitutional minimum of at least 15% of all national audited revenue sent unconditionally to the 47 counties each financial year.',
          sw: 'Kiwango cha chini cha kikatiba cha angalau 15% ya mapato yote ya taifa yanayotumwa moja kwa moja kwa kaunti 47 kila mwaka.',
        },
      },
    ],
    citizenActionTip: {
      en: 'If your local hospital lacks basic medicine or maternal supplies, hold your County Governor and County CEC for Health accountable — not the national Ministry of Health in Nairobi!',
      sw: 'Ikiwa hospitali ya eneo lako haina dawa au vifaa vya wajawazito, muwajibishe Gavana wa Kaunti yako na Waziri wake wa Afya — si Wizara ya Afya ya kitaifa iliyoko Nairobi!',
    },
  },

  // Lesson 10
  {
    id: 'lesson_10',
    lessonNumber: 10,
    title: {
      en: 'Youth, Women, and Marginalised Groups in Governance',
      sw: 'Vijana, Wanawake, na Makundi Maalum Katika Uongozi',
    },
    summary: {
      en: 'Discover affirmative action mechanisms, youth quotas, women representation, and how young citizens can lead and influence public service.',
      sw: 'Gundua mifumo ya usawa wa kijinsia, nafasi za vijana, uwakilishi wa wanawake, na jinsi vijana wanavyoweza kuongoza na kushiriki katika utumishi wa umma.',
    },
    category: 'participation',
    readTimeMinutes: 5,
    sections: [
      {
        title: {
          en: '1. Constitutional Guarantees for Inclusion',
          sw: '1. Ulinzi wa Kikatiba kwa Ajili ya Usawa',
        },
        content: {
          en: 'The 2010 Constitution specifically mandates inclusion of historically marginalised groups:',
          sw: 'Katiba ya 2010 inaamuru wazi kujumuishwa kwa makundi yaliyokuwa yametengwa zamani:',
        },
        bulletPoints: {
          en: [
            'Article 27(8): The Two-Thirds Gender Principle — not more than two-thirds of the members of any elective or appointive body shall be of the same gender.',
            'Article 55: The state must take affirmative action measures to ensure youth have access to relevant education, political representation, and employment.',
            'Article 54: At least 5% of members in elective and appointive public bodies must be persons with disabilities (PWDs).',
            'Access to Government Procurement Opportunities (AGPO): 30% of all public government tenders must be reserved exclusively for enterprises owned by youth, women, and PWDs.',
          ],
          sw: [
            'Kifungu cha 27(8): Kanuni ya Thuluthi Mbili ya Jinsia — si zaidi ya theluthi mbili ya nafasi zote za kuchaguliwa au kuteuliwa ziwe za jinsia moja.',
            'Kifungu cha 55: Serikali lazima ichukue hatua maalum kuhakikisha vijana wanapata uwakilishi wa kisiasa, elimu bora na fursa za ajira.',
            'Kifungu cha 54: Angalau 5% ya nafasi zote za kazi na uongozi zitengwe kwa watu wanaoishi na ulemavu.',
            'Mpango wa AGPO: 30% ya zabuni zote za serikali ya kitaifa na kaunti lazima zitengwe kwa ajili ya vijana, wanawake na walemavu.',
          ],
        },
      },
      {
        title: {
          en: '2. How Youth Can Lead in Public Life',
          sw: '2. Jinsi Vijana Wanavyoweza Kuongoza Kwenye Jamii',
        },
        content: {
          en: 'Young people in Kwale and nationwide can register youth enterprises for AGPO certificates, contest elective positions, lead community vigilance groups, and actively monitor public bursary disbursements.',
          sw: 'Vijana wa Kwale na kote nchini wanaweza kusajili makampuni na kupata vyeti vya AGPO, kugombea nafasi za uongozi, kuunda vikundi vya kutetea haki za jamii, na kufuatilia utoaji wa fedha za ufadhili wa masomo (bursary).',
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Affirmative Action', sw: 'Hatua za Kurekebisha Usawa' },
        definition: {
          en: 'Deliberate positive policies created to remedy past discrimination and ensure equal opportunities for disadvantaged groups.',
          sw: 'Sera maalum zilizowekwa kisheria kurekebisha ubaguzi wa zamani na kuhakikisha makundi yaliyotengwa yanapata fursa sawa za uongozi.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Form or join a registered youth or women\'s group in your ward. Apply for AGPO certification at the National Treasury or County Procurement Office to bid for local school renovation or supply tenders.',
      sw: 'Unda au jiunge na kikundi cha vijana au wanawake kilichosajiliwa kwenye wadi yako. Omba cheti cha AGPO katika ofisi za ununuzi za serikali ili muweze kushiriki zabuni za ndani.',
    },
  },
];
