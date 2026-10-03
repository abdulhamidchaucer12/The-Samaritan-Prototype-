/**
 * Bilingual UI translations for The Samaritan (English & Kenyan Kiswahili)
 * Implementing Organisation: Kwale Focus Empowerment CBO (KFE)
 * Developer Credit: Abdulhamid Chaucer
 * Implementation Scope: The Republic of Kenya
 * Implementation Period: Ongoing
 */

export interface TranslationSchema {
  appTitle: string;
  tagline: string;
  appTagline: string;
  orgName: string;
  nonPartisanNotice: string;
  common: {
    online: string;
    offline: string;
    offlineReady: string;
    close: string;
    back: string;
    save: string;
    print: string;
    share: string;
    copy: string;
    copied: string;
    download: string;
    lightMode: string;
    darkMode: string;
    highContrastDark: string;
  };
  nav: {
    home: string;
    explorer: string;
    compare: string;
    howGovWorks: string;
    lessons: string;
    quiz: string;
    citizenAction: string;
    myLearning: string;
    qa: string;
    demoMode: string;
    feedback: string;
  };
  home: {
    kfeTag: string;
    searchPlaceholder: string;
    exploreButton: string;
    learnButton: string;
    quizButton: string;
    compareButton: string;
    nationalDevolvedTitle: string;
    nationalDevolvedDesc: string;
    barazaReadyTag: string;
  };
  explorer: {
    title: string;
    subtitle: string;
    filterBranch: string;
    allBranches: string;
    executive: string;
    legislative: string;
    judiciary: string;
    commission: string;
    filterLevel: string;
    allLevels: string;
    national: string;
    county: string;
    learnMore: string;
    howSelected: string;
    termOfOffice: string;
    powers: string;
    whatItDoesNotDo: string;
    accountability: string;
    citizenEngagement: string;
    bookmark: string;
    bookmarked: string;
    compareThis: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    selectFirst: string;
    selectSecond: string;
    popularComparisons: string;
    mpVsMca: string;
    govVsCc: string;
    senVsMp: string;
    dppVsDci: string;
    aspect: string;
    level: string;
    branch: string;
    coreRole: string;
    limits: string;
    appointment: string;
    term: string;
    removal: string;
    citizenRole: string;
  };
  howGov: {
    title: string;
    subtitle: string;
    separationOfPowers: string;
    separationDesc: string;
    devolutionTitle: string;
    devolutionDesc: string;
  };
  lessons: {
    title: string;
    subtitle: string;
    progress: string;
    lesson: string;
    readTime: string;
    keyTerms: string;
    citizenActionTip: string;
    completed: string;
    markComplete: string;
    startLesson: string;
  };
  quiz: {
    category: string;
    title: string;
    subtitle: string;
    tryAgain: string;
    question: string;
    correct: string;
    incorrect: string;
    nextQuestion: string;
    seeResults: string;
    score: string;
    explanation: string;
  };
  citizenAction: {
    title: string;
    subtitle: string;
    contactsDirectory: string;
    memoGenerator: string;
    memoTitle: string;
    memoDesc: string;
  };
  myLearning: {
    title: string;
    subtitle: string;
    lessonsCompleted: string;
    quizScore: string;
    bookmarkedOffices: string;
    certificateTitle: string;
    certificateDesc: string;
    claimCertificate: string;
    offlinePackTitle: string;
    offlinePackStatus: string;
  };
  demo: {
    title: string;
    subtitle: string;
    badge: string;
    nextSlide: string;
    prevSlide: string;
    previousSlide: string;
    slideCount: string;
    keyboardTip: string;
    exitDeck: string;
    presenterNotes: string;
    barazaPrompt: string;
    articleRef: string;
    fullscreen: string;
  };
  feedback: {
    title: string;
    subtitle: string;
    sendInquiry: string;
    requestWorkshop: string;
    name: string;
    emailOrPhone: string;
    countyOrSubcounty: string;
    message: string;
    submit: string;
    successMessage: string;
    contactKfeDirectly: string;
  };
  kfe: {
    name: string;
    tagline: string;
    about: string;
    mission: string;
    values: string;
    location: string;
    postal: string;
    email: string;
    phones: string;
    scope: string;
    period: string;
    developer: string;
  };
  offline: {
    modalTitle: string;
    downloadPack: string;
  };
  footer: {
    aboutTitle: string;
    aboutDesc: string;
    kfeTitle: string;
    kfeLocation: string;
    disclaimer: string;
    sourcesTitle: string;
    sourcesList: string;
    lastUpdated: string;
    developerCredit: string;
    implementationPeriod: string;
    implementationScope: string;
  };
}

export const translations: Record<'en' | 'sw', TranslationSchema> = {
  en: {
    appTitle: 'The Samaritan',
    tagline: 'Know Your Government. Understand Your Rights. Shape Your Future.',
    appTagline: 'Know Your Government. Understand Your Rights. Shape Your Future.',
    orgName: 'Kwale Focus Empowerment CBO (KFE)',
    nonPartisanNotice: 'Strictly Non-Partisan & Educational Civic Platform',

    common: {
      online: 'Online',
      offline: 'Offline Mode',
      offlineReady: '100% Offline Ready (PWA)',
      close: 'Close',
      back: 'Back',
      save: 'Save',
      print: 'Print',
      share: 'Share',
      copy: 'Copy Text',
      copied: 'Copied!',
      download: 'Download',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode (Low-Light Reading)',
      highContrastDark: 'High-Contrast Dark Mode',
    },

    nav: {
      home: 'Home',
      explorer: 'Government Explorer',
      compare: 'Compare Offices',
      howGovWorks: 'How Government Works',
      lessons: 'Civic Lessons',
      quiz: 'Civic Quiz',
      citizenAction: 'Citizen Action Hub',
      myLearning: 'My Learning',
      qa: 'Civic Q&A',
      demoMode: 'Facilitator Deck',
      feedback: 'Contact & Feedback',
    },

    home: {
      kfeTag: 'KFE Civic Initiative',
      searchPlaceholder: 'Search by office title, acronym or constitutional article (e.g. Governor, MCA, Art. 179)...',
      exploreButton: 'Explore 35 Public Offices',
      learnButton: 'Start 10 Civic Lessons',
      quizButton: 'Test Your Civic Knowledge',
      compareButton: 'Compare Offices Side-by-Side',
      nationalDevolvedTitle: 'Two Levels of Government, Distinct Yet Interdependent',
      nationalDevolvedDesc: 'The Constitution of Kenya establishes two autonomous levels: National Government and 47 County Governments, designed to work through consultation and cooperation.',
      barazaReadyTag: 'Community Baraza & Workshop Ready',
    },

    explorer: {
      title: 'Government Office Explorer',
      subtitle: 'Authoritative guide to Kenya\'s 35 elected, nominated, appointed, and independent constitutional public offices',
      filterBranch: 'Branch of State',
      allBranches: 'All Branches',
      executive: 'Executive',
      legislative: 'Legislature',
      judiciary: 'Judiciary',
      commission: 'Independent Commissions',
      filterLevel: 'Level of Devolution',
      allLevels: 'All Levels',
      national: 'National',
      county: 'County',
      learnMore: 'View Office Profile',
      howSelected: 'Selection & Appointment Method',
      termOfOffice: 'Term of Office',
      powers: 'Constitutional Powers & Core Mandate',
      whatItDoesNotDo: 'What This Office Does NOT Do (Common Misconceptions)',
      accountability: 'Oversight, Checks & Accountability',
      citizenEngagement: 'How Citizens Can Engage & Exercise Rights',
      bookmark: 'Bookmark Office',
      bookmarked: 'Bookmarked',
      compareThis: 'Compare Office',
    },

    comparison: {
      title: 'Side-by-Side Office Comparison',
      subtitle: 'Clear common citizen confusion between public offices with contrasting responsibilities, qualifications, and limitations.',
      selectFirst: 'Select First Office',
      selectSecond: 'Select Second Office',
      popularComparisons: 'Common Citizen Comparisons',
      mpVsMca: 'Member of Parliament (MP) vs Member of County Assembly (MCA)',
      govVsCc: 'County Governor vs County Commissioner',
      senVsMp: 'Senator vs National Assembly MP',
      dppVsDci: 'Director of Public Prosecutions (ODPP) vs Directorate of Criminal Investigations (DCI)',
      aspect: 'Governance Aspect',
      level: 'Government Level',
      branch: 'State Branch',
      coreRole: 'Core Constitutional Role',
      limits: 'What It Does NOT Do',
      appointment: 'How Chosen / Appointed',
      term: 'Term of Office',
      removal: 'Removal / Impeachment Process',
      citizenRole: 'Citizen Engagement Channels',
    },

    howGov: {
      title: 'How Government Works in Kenya',
      subtitle: 'Visual constitutional architecture of sovereign power, separation of powers, and Kenya\'s two devolved levels.',
      separationOfPowers: 'Separation of Powers & Constitutional Checks',
      separationDesc: 'Executive executes law, Legislature enacts laws & oversees, Judiciary interprets law without interference.',
      devolutionTitle: 'Devolution & Schedule Four Functions',
      devolutionDesc: 'Clear division between National functions (Defense, Foreign Affairs, National Police) and County functions (County Health, Agriculture, County Roads, Pre-primary ECD).',
    },

    lessons: {
      title: 'Civic Education Curriculum',
      subtitle: '10 structured, community-tested lessons on the Constitution, leadership integrity, devolution, and citizen rights.',
      progress: 'Curriculum Progress',
      lesson: 'Lesson',
      readTime: 'min read',
      keyTerms: 'Key Constitutional Terms',
      citizenActionTip: 'Practical Citizen Action Step',
      completed: 'Completed',
      markComplete: 'Mark as Complete',
      startLesson: 'Read Lesson',
    },

    quiz: {
      category: 'Civic Literacy Assessment',
      title: 'Interactive Civic Quiz & Community Scenarios',
      subtitle: 'Test your understanding of Kenya\'s constitutional structure, public participation rights, and public offices.',
      tryAgain: 'Retake Quiz',
      question: 'Question',
      correct: 'Correct Answer',
      incorrect: 'Incorrect',
      nextQuestion: 'Next Question',
      seeResults: 'View Detailed Scorecard',
      score: 'Score',
      explanation: 'Constitutional Rationale & Source',
    },

    citizenAction: {
      title: 'Citizen Action & Accountability Hub',
      subtitle: 'Empowering Kenyans with formal tools for public participation, Access to Information (Art. 35) requests, and official watchdog contacts.',
      contactsDirectory: 'Official Watchdog, Commission & Oversight Directory',
      memoGenerator: 'Public Participation Memorandum Generator',
      memoTitle: 'Draft Formal Public Participation Submission',
      memoDesc: 'Generate a structured memorandum for County CIDP, ADP, Annual Budget hearings, or National Assembly public hearings.',
    },

    myLearning: {
      title: 'My Civic Learning Dashboard',
      subtitle: 'Track your personal progress through civic lessons, quiz scores, bookmarked offices, and earn your certificate.',
      lessonsCompleted: 'Lessons Completed',
      quizScore: 'Highest Quiz Score',
      bookmarkedOffices: 'Bookmarked Offices',
      certificateTitle: 'Certificate of Civic Literacy',
      certificateDesc: 'Complete all 10 civic lessons to unlock your personalized, printable Certificate of Civic Literacy issued under Kwale Focus Empowerment CBO.',
      claimCertificate: 'Generate My Certificate',
      offlinePackTitle: 'Offline Storage Status',
      offlinePackStatus: 'Offline Pack Active (Ready for Barazas & Rural Areas without Network)',
    },

    demo: {
      title: 'Facilitator Slide-Deck & Baraza Demonstration Mode',
      subtitle: 'Designed for KFE civic educators, youth champions, and community facilitators to present at barazas, schools, and town halls.',
      badge: 'Community Facilitator Mode',
      nextSlide: 'Next Slide',
      prevSlide: 'Previous Slide',
      previousSlide: 'Previous Slide',
      slideCount: 'Slide',
      keyboardTip: 'Use ← / → keys or buttons',
      exitDeck: 'Exit Deck',
      presenterNotes: 'Facilitator Talking Points',
      barazaPrompt: 'Community Baraza Discussion Prompt',
      articleRef: 'Constitutional Anchor',
      fullscreen: 'Projector Fullscreen',
    },

    feedback: {
      title: 'Community Feedback & Inquiries',
      subtitle: 'Have a question about public governance, need civic training in your area, or want to share community feedback?',
      sendInquiry: 'Send Civic Inquiry or Question',
      requestWorkshop: 'Request Civic Workshop / Baraza in Your Area',
      name: 'Your Name / Group Name',
      emailOrPhone: 'Phone Number or Email',
      countyOrSubcounty: 'County & Sub-County (e.g. Kwale - Matuga / Msambweni)',
      message: 'Your Question, Request or Feedback',
      submit: 'Submit Message',
      successMessage: 'Thank you! Your submission has been received. Our team will follow up promptly.',
      contactKfeDirectly: 'Connect Directly with Kwale Focus Empowerment CBO',
    },

    kfe: {
      name: 'Kwale Focus Empowerment CBO (KFE)',
      tagline: 'Empowering Underserved Communities with Sustainable Solutions through Innovation',
      about: 'Kwale Focus Empowerment CBO (KFE) is a youth-led community-based organisation founded in January 2020. Headquartered in Kwale County, KFE champions community resilience, civic education, youth and women leadership, environmental conservation, and social accountability.',
      mission: 'To empower underserved communities with sustainable solutions through innovation.',
      values: 'Integrity, Accountability, Diversity, Respect, and Community-First Action.',
      location: 'Majengo Mapya Village, Kombani Sub-Location, Matuga Sub-County, along Likoni–Lunga Lunga Road (next to Kombani Homes Limited), Kwale County, Kenya',
      postal: 'P.O. Box 111-80403 Kwale, Kenya',
      email: 'info.kwalefocuscbo@gmail.com',
      phones: '+254 795 293 820 / +254 724 507 536',
      scope: 'The Republic of Kenya',
      period: 'Ongoing',
      developer: 'Abdulhamid Chaucer',
    },

    offline: {
      modalTitle: 'Offline Storage & PWA Management',
      downloadPack: 'Save Offline Pack to Device',
    },

    footer: {
      aboutTitle: 'About The Samaritan',
      aboutDesc: 'The Samaritan is a bilingual digital civic education and government literacy platform implemented by Kwale Focus Empowerment CBO (KFE). It makes complex constitutional structures accessible in English and Kiswahili to youth, women, learners, and community leaders.',
      kfeTitle: 'Kwale Focus Empowerment CBO (KFE)',
      kfeLocation: 'Majengo Mapya Village, Kombani, Kwale County, Kenya',
      disclaimer: 'Legal & Educational Disclaimer: The Samaritan is an educational civic information platform. It does not replace official legal sources, government notices or professional legal advice. Laws, procedures and institutional structures may change and should be verified against current official sources.',
      sourcesTitle: 'Primary Constitutional & Legal Sources',
      sourcesList: 'Constitution of Kenya 2010 • County Governments Act 2012 • Public Finance Management Act 2012 • Leadership & Integrity Act 2012 • Access to Information Act 2016 • Commission on Administrative Justice Act 2011.',
      lastUpdated: 'Content Verified & Active: September 2026',
      developerCredit: 'Developed with dedication by Abdulhamid Chaucer for Kwale Focus Empowerment CBO',
      implementationPeriod: 'Implementation Period: Ongoing',
      implementationScope: 'Implementation Scope: The Republic of Kenya',
    },
  },

  sw: {
    appTitle: 'The Samaritan',
    tagline: 'Jua Serikali Yako. Elewa Haki Zako. Boresha Mustakabali Wako.',
    appTagline: 'Jua Serikali Yako. Elewa Haki Zako. Boresha Mustakabali Wako.',
    orgName: 'Kwale Focus Empowerment CBO (KFE)',
    nonPartisanNotice: 'Jukwaa la Kielimu na Lisiloegemea Upande Wowote wa Kisiasa',

    common: {
      online: 'Mtandaoni',
      offline: 'Bila Mtandao',
      offlineReady: 'Inafanya Kazi Bila Mtandao (PWA)',
      close: 'Funga',
      back: 'Rudi',
      save: 'Hifadhi',
      print: 'Chapa (Print)',
      share: 'Sambaza',
      copy: 'Nakili Maandishi',
      copied: 'Imenakiliwa!',
      download: 'Pakua',
      lightMode: 'Muonekano wa Mwangaza',
      darkMode: 'Hali ya Giza (Kusoma Gizani)',
      highContrastDark: 'Muonekano wa Giza Wenye Uwazi wa Juu',
    },

    nav: {
      home: 'Mwanzo',
      explorer: 'Chunguza Serikali',
      compare: 'Linganisha Ofisi',
      howGovWorks: 'Mfumo wa Serikali',
      lessons: 'Masomo ya Uraia',
      quiz: 'Chemsha Bongo',
      citizenAction: 'Kitovu cha Hatua',
      myLearning: 'Masomo Yangu',
      qa: 'Maswali ya Raia',
      demoMode: 'Mwongozo wa Mwezeshaji',
      feedback: 'Wasiliana na KFE',
    },

    home: {
      kfeTag: 'Mpango wa Uraia wa KFE',
      searchPlaceholder: 'Tafuta ofisi au kifungu cha katiba (mfano: Gavana, MCA, Kifungu 179)...',
      exploreButton: 'Chunguza Ofisi 35 za Umma',
      learnButton: 'Anza Masomo 10 ya Uraia',
      quizButton: 'Pima Maarifa Yako ya Uraia',
      compareButton: 'Linganisha Ofisi Mbili kwa Pamoja',
      nationalDevolvedTitle: 'Ngazi Mbili za Serikali, Tofauti Lakini Zinafanya Kazi Pamoja',
      nationalDevolvedDesc: 'Katiba ya Kenya inaweka ngazi mbili: Serikali ya Kitaifa na Serikali 47 za Kaunti, zilizoundwa kufanya kazi kwa mashauriano na ushirikiano bila kuingiliana kinyume cha sheria.',
      barazaReadyTag: 'Tayari kwa Mabaraza ya Jamii na Warsha',
    },

    explorer: {
      title: 'Chunguza Ofisi za Serikali',
      subtitle: 'Mwongozo sahihi wa ofisi 35 za umma zilizochaguliwa, kuteuliwa na taasisi huru za kikatiba nchini Kenya',
      filterBranch: 'Mhimili wa Serikali',
      allBranches: 'Mihimili Yote',
      executive: 'Serikali Kuu / Mtendaji',
      legislative: 'Bunge',
      judiciary: 'Mahakama',
      commission: 'Tume Huru na Uangalizi',
      filterLevel: 'Ngazi ya Ugatuzi',
      allLevels: 'Ngazi Zote',
      national: 'Kitaifa',
      county: 'Kaunti',
      learnMore: 'Tazama Wasifu Kamili wa Ofisi',
      howSelected: 'Jinsi Anavyoingia Ofisini',
      termOfOffice: 'Muda wa Kuhudumu',
      powers: 'Mamlaka na Majukumu Makuu ya Kikatiba',
      whatItDoesNotDo: 'Mambo Ambayo Ofisi Hii HAIFANYI (Upotoshaji wa Kawaida)',
      accountability: 'Uangalizi na Uwajibikaji',
      citizenEngagement: 'Jinsi Mwananchi Anavyoweza Kushiriki na Kudai Haki',
      bookmark: 'Weka Alama',
      bookmarked: 'Imewekwa Alama',
      compareThis: 'Linganisha Ofisi Hii',
    },

    comparison: {
      title: 'Ulinganisho wa Ofisi za Umma Sambamba',
      subtitle: 'Ondoa mkanganyiko wa kawaida kati ya ofisi za umma zenye majukumu, viwango na mipaka tofauti.',
      selectFirst: 'Chagua Ofisi ya Kwanza',
      selectSecond: 'Chagua Ofisi ya Pili',
      popularComparisons: 'Milinganisho Maarufu ya Wananchi',
      mpVsMca: 'Mbunge wa Bunge la Kitaifa (MP) dhidi ya Diwani (MCA)',
      govVsCc: 'Gavana wa Kaunti dhidi ya Kamishna wa Kaunti (County Commissioner)',
      senVsMp: 'Seneta dhidi ya Mbunge wa Bunge la Kitaifa',
      dppVsDci: 'Mkurugenzi wa Mashtaka (ODPP) dhidi ya Idara ya Upelelezi (DCI)',
      aspect: 'Kipengele cha Utawala',
      level: 'Ngazi ya Serikali',
      branch: 'Mhimili wa Dola',
      coreRole: 'Jukumu Kuu la Kikatiba',
      limits: 'Mambo Asiyofanya',
      appointment: 'Jinsi Anavyochaguliwa au Kuteuliwa',
      term: 'Muda wa Kuhudumu',
      removal: 'Utaratibu wa Kuondolewa Ofisini',
      citizenRole: 'Njia za Mwananchi Kushiriki',
    },

    howGov: {
      title: 'Jinsi Serikali Inavyofanya Kazi Kenya',
      subtitle: 'Muundo wa picha wa mamlaka ya wananchi, mgawanyo wa madaraka, na ngazi mbili za ugatuzi.',
      separationOfPowers: 'Mgawanyo wa Madaraka na Uangalizi wa Kikatiba',
      separationDesc: 'Mtendaji anatekeleza sheria, Bunge linatunga sheria na kusimamia matumizi, Mahakama inatafsiri sheria kwa uhuru kamili.',
      devolutionTitle: 'Ugatuzi na Majukumu ya Jedwali la Nne',
      devolutionDesc: 'Mgawanyo dhahiri kati ya majukumu ya Kitaifa (Ulinzi, Mambo ya Nje, Polisi) na Kaunti (Afya ya Kaunti, Kilimo, Barabara za Kaunti, Elimu ya Awali ya Watoto ECD).',
    },

    lessons: {
      title: 'Mtaala wa Elimu ya Uraia',
      subtitle: 'Masomo 10 yaliyopangwa kwa urahisi kuhusu Katiba, uongozi na uadilifu, ugatuzi, na haki za mwananchi.',
      progress: 'Maendeleo ya Masomo',
      lesson: 'Somo la',
      readTime: 'dakika za kusoma',
      keyTerms: 'Istilahi Muhimu za Kikatiba',
      citizenActionTip: 'Hatua ya Vitendo ya Mwananchi',
      completed: 'Limekamilika',
      markComplete: 'Weka Alama ya Kukamilika',
      startLesson: 'Soma Somo',
    },

    quiz: {
      category: 'Tathmini ya Maarifa ya Uraia',
      title: 'Chemsha Bongo na Mifano Halisi ya Jamii',
      subtitle: 'Pima uelewa wako wa muundo wa serikali ya Kenya, ushiriki wa umma, na haki za kikatiba.',
      tryAgain: 'Jaribu Tena',
      question: 'Swali',
      correct: 'Jibu Sahihi Kabisa',
      incorrect: 'Si Sahihi',
      nextQuestion: 'Swali Linalofuata',
      seeResults: 'Tazama Kadi ya Matokeo',
      score: 'Alama',
      explanation: 'Msingi wa Kikatiba na Chanzo cha Sheria',
    },

    citizenAction: {
      title: 'Kitovu cha Hatua za Mwananchi na Uwajibikaji',
      subtitle: 'Kuwawezesha wananchi zana za kuandaa barua rasmi za maoni (memorandum), maombi ya taarifa chini ya Kifungu 35, na anwani za tume huru.',
      contactsDirectory: 'Orodha Rasmi ya Tume za Uangalizi na Uwajibikaji',
      memoGenerator: 'Zana ya Kutayarisha Memorandum ya Ushiriki wa Umma',
      memoTitle: 'Andaa Barua Rasmi ya Maoni ya Bajeti au Sheria',
      memoDesc: 'Tengeneza maoni rasmi kwa ajili ya mikutano ya bajeti ya Kaunti (CIDP, ADP) au vikao vya Bunge la Kitaifa.',
    },

    myLearning: {
      title: 'Dashibodi ya Masomo Yangu ya Uraia',
      subtitle: 'Fuatilia masomo uliyosoma, alama za chemsha bongo, ofisi ulizohifadhi, na pata cheti chako cha elimu ya uraia.',
      lessonsCompleted: 'Masomo Yaliyokamilika',
      quizScore: 'Alama za Juu za Chemsha Bongo',
      bookmarkedOffices: 'Ofisi Zilizohifadhiwa',
      certificateTitle: 'Cheti cha Umahiri wa Elimu ya Uraia',
      certificateDesc: 'Kamilisha masomo yote 10 ya uraia ili ufungue cheti chako rasmi kinachoweza kuchapishwa, kilichotolewa chini ya Kwale Focus Empowerment CBO.',
      claimCertificate: 'Pakua Cheti Changu',
      offlinePackTitle: 'Hali ya Hifadhi Bila Mtandao',
      offlinePackStatus: 'Kifurushi kiko Tayari Kwenye Kifaa (Inafaa kwa mabaraza vijijini bila intaneti)',
    },

    demo: {
      title: 'Kadi za Mwezeshaji na Hali ya Maonyesho ya Baraza',
      subtitle: 'Imeundwa maalum kwa ajili ya waelimishaji wa KFE na wanaharakati wa vijijini kuongoza mabaraza, shule na mikutano ya umma.',
      badge: 'Hali ya Mwezeshaji wa Baraza',
      nextSlide: 'Somo / Kadi Inayofuata',
      prevSlide: 'Kadi Iliyopita',
      previousSlide: 'Kadi Iliyopita',
      slideCount: 'Kadi',
      keyboardTip: 'Tumia vitufe vya ← / → au vishale',
      exitDeck: 'Toka Maonyeshoni',
      presenterNotes: 'Mambo Makuu ya Kusisitiza kwa Jamii',
      barazaPrompt: 'Swali la Majadiliano ya Baraza la Wananchi',
      articleRef: 'Kifungu cha Katiba Kinachohusika',
      fullscreen: 'Onyesha Skrini Kamili',
    },

    feedback: {
      title: 'Maoni ya Jamii na Mawasiliano',
      subtitle: 'Je, una swali kuhusu utawala wa umma, unahitaji mafunzo ya uraia eneo lako, au unataka kutoa maoni kwa KFE?',
      sendInquiry: 'Tuma Swali au Ushauri wa Uraia',
      requestWorkshop: 'Omba Warsha au Baraza la Uraia Kijijini Kwako',
      name: 'Jina Lako / Jina la Kikundi',
      emailOrPhone: 'Nambari ya Simu au Barua Pepe',
      countyOrSubcounty: 'Kaunti na Eneo Bunge (mfano: Kwale - Matuga / Msambweni)',
      message: 'Swali Lako, Ombi au Maoni',
      submit: 'Wasilisha Ujumbe',
      successMessage: 'Asante sana! Ujumbe wako umepokelewa. Timu yetu ya KFE itawasiliana nawe hivi punde.',
      contactKfeDirectly: 'Wasiliana Moja kwa Moja na Kwale Focus Empowerment CBO',
    },

    kfe: {
      name: 'Kwale Focus Empowerment CBO (KFE)',
      tagline: 'Kuziwezesha Jamii Zisizojiweza kwa Suluhu Endelevu Kupitia Ubunifu',
      about: 'Kwale Focus Empowerment CBO (KFE) ni shirika linaloongozwa na vijana lililoanzishwa mnamo Januari 2020. Makao yake makuu yako Kaunti ya Kwale, likiongoza ustahimilivu wa jamii, elimu ya uraia, uongozi wa vijana na wanawake, uhifadhi wa mazingira, na uwajibikaji wa kijamii.',
      mission: 'Kuziwezesha jamii zisizojiweza kwa suluhu endelevu kupitia ubunifu.',
      values: 'Uadilifu, Uwajibikaji, Utofauti, Heshima, na Kutanguliza Jamii.',
      location: 'Kijiji cha Majengo Mapya, Kombani, Eneo Bunge la Matuga, kando ya Barabara ya Likoni–Lunga Lunga (karibu na Kombani Homes Limited), Kaunti ya Kwale, Kenya',
      postal: 'S.L.P 111-80403 Kwale, Kenya',
      email: 'info.kwalefocuscbo@gmail.com',
      phones: '+254 795 293 820 / +254 724 507 536',
      scope: 'Jamhuri ya Kenya',
      period: 'Inaendelea (Ongoing)',
      developer: 'Abdulhamid Chaucer',
    },

    offline: {
      modalTitle: 'Hifadhi ya Kifurushi Bila Mtandao (PWA)',
      downloadPack: 'Hifadhi Kifurushi Kwenye Simu/Kifaa',
    },

    footer: {
      aboutTitle: 'Kuhusu The Samaritan',
      aboutDesc: 'The Samaritan ni jukwaa la kidijitali la lugha mbili la elimu ya uraia linaloendeshwa na shirika la Kwale Focus Empowerment CBO (KFE). Linawawezesha wananchi wa Kaunti ya Kwale na Kenya nzima kuelewa uongozi wa serikali, haki za kikatiba, na ushiriki wa umma.',
      kfeTitle: 'Kwale Focus Empowerment CBO (KFE)',
      kfeLocation: 'Kijiji cha Majengo Mapya, Kombani, Kaunti ya Kwale, Kenya',
      disclaimer: 'Ilani ya Kisheria na Kielimu: The Samaritan ni jukwaa la kuelimisha umma kuhusu masuala ya uraia. Halichukui nafasi ya sheria rasmi, matangazo ya serikali au ushauri wa kisheria. Sheria, taratibu na mifumo ya kiserikali inaweza kubadilika na inapaswa kuthibitishwa kwenye vyanzo rasmi vya serikali.',
      sourcesTitle: 'Vyanzo Vikuu vya Kikatiba na Kisheria',
      sourcesList: 'Katiba ya Kenya 2010 • Sheria ya Serikali za Kaunti 2012 • Sheria ya Usimamizi wa Fedha za Umma (PFMA) 2012 • Sheria ya Uongozi na Uadilifu 2012 • Sheria ya Upatikanaji wa Taarifa 2016 • Sheria ya Tume ya Haki za Utawala 2011.',
      lastUpdated: 'Maudhui Yamethibitishwa: Septemba 2026',
      developerCredit: 'Imetengenezwa kwa kujitolea na Abdulhamid Chaucer kwa ajili ya Kwale Focus Empowerment CBO',
      implementationPeriod: 'Muda wa Mradi: Unaendelea (Ongoing)',
      implementationScope: 'Eneo la Utekelezaji: Jamhuri ya Kenya',
    },
  },
};
