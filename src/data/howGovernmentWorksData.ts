export interface GovernanceTopic {
  id: string;
  title: {
    en: string;
    sw: string;
  };
  subtitle: {
    en: string;
    sw: string;
  };
  content: {
    en: string;
    sw: string;
  };
  keyPillars: {
    title: { en: string; sw: string };
    description: { en: string; sw: string };
    icon: string;
  }[];
  comparisons?: {
    national: { en: string[]; sw: string[] };
    county: { en: string[]; sw: string[] };
  };
  steps?: {
    step: number;
    title: { en: string; sw: string };
    description: { en: string; sw: string };
  }[];
}

export const howGovernmentWorksTopics: GovernanceTopic[] = [
  // 1. Constitution
  {
    id: 'constitution',
    title: {
      en: 'The Constitution of Kenya, 2010',
      sw: 'Katiba ya Kenya, 2010',
    },
    subtitle: {
      en: 'The supreme foundation of all governance, rights, and public institutions',
      sw: 'Msingi mkuu wa uongozi, haki za binadamu na taasisi zote za umma nchini',
    },
    content: {
      en: 'Promulgated on August 27, 2010, the Constitution replaced the 1969 colonial-era charter. It declares that all sovereign power belongs to the people of Kenya. Any law or government action that contradicts the Constitution is automatically invalid.',
      sw: 'Ilipotangazwa tarehe 27 Agosti 2010, Katiba ilichukua nafasi ya katiba ya zamani ya 1969. Inatamka wazi kuwa mamlaka yote ya nchi ni ya wananchi wa Kenya. Sheria au kitendo chochote cha serikali kinachopingana na Katiba ni batili kisheria.',
    },
    keyPillars: [
      {
        title: { en: 'Sovereignty of the People (Art. 1)', sw: 'Mamlaka Kuu ya Wananchi (Kif. 1)' },
        description: {
          en: 'Power is exercised directly through democratic elections or delegated to state organs.',
          sw: 'Mamlaka hutumiwa moja kwa moja kupitia kura au kukabidhiwa kwa viongozi.',
        },
        icon: 'Crown',
      },
      {
        title: { en: 'National Values (Art. 10)', sw: 'Maadili ya Kitaifa (Kif. 10)' },
        description: {
          en: 'Patriotism, rule of law, democracy, public participation, human dignity, and integrity.',
          sw: 'Uzalendo, utawala wa sheria, ushiriki wa umma, utu wa mwanadamu, na uadilifu.',
        },
        icon: 'Sparkles',
      },
      {
        title: { en: 'The Bill of Rights (Chapter 4)', sw: 'Mswada wa Haki (Sura ya 4)' },
        description: {
          en: 'Guarantees civil, political, economic, and social rights (health, education, water, housing).',
          sw: 'Inalinda haki za kiraia, kisiasa, na kijamii (afya, elimu, maji safi na makazi bora).',
        },
        icon: 'Shield',
      },
    ],
  },

  // 2. Three Arms
  {
    id: 'arms',
    title: {
      en: 'The Three Arms of Government',
      sw: 'Mihimili Mitatu ya Serikali',
    },
    subtitle: {
      en: 'How state power is divided between Executive, Legislature, and Judiciary',
      sw: 'Jinsi mamlaka ya dola yanavyogawanywa kati ya Serikali Kuu, Bunge, na Mahakama',
    },
    content: {
      en: 'No single person or office holds all the power. The Three Arms operate independently with distinct roles to ensure no arm oversteps its constitutional bounds.',
      sw: 'Hakuna kiongozi wala ofisi moja yenye mamlaka yote. Mihimili hii mitatu inafanya kazi kwa uhuru na majukumu maalum ili kuzuia mhimili mmoja kuwadhulumu wananchi.',
    },
    keyPillars: [
      {
        title: { en: '1. The Executive', sw: '1. Serikali Mtendaji' },
        description: {
          en: 'Headed by the President at national level and Governor at county level. Proposes policy, manages civil service, and enforces laws.',
          sw: 'Inaongozwa na Rais kitaifa na Gavana kaunti. Inapendekeza sera, kusimamia watumishi na kutekeleza sheria.',
        },
        icon: 'Building',
      },
      {
        title: { en: '2. The Legislature', sw: '2. Mhimili wa Kutunga Sheria (Bunge)' },
        description: {
          en: 'Composed of Parliament (National Assembly & Senate) and County Assemblies. Enacts laws, budgets funds, and conducts executive oversight.',
          sw: 'Inajumuisha Bunge (Bunge la Kitaifa na Seneti) na Mabunge ya Kaunti. Hutunga sheria, kuidhinisha bajeti na kuwasimamia mawaziri.',
        },
        icon: 'FileText',
      },
      {
        title: { en: '3. The Judiciary', sw: '3. Idara ya Mahakama' },
        description: {
          en: 'Headed by the Chief Justice. Composed of Supreme Court, Court of Appeal, High Court, and Magistrates. Interprets law and dispenses justice.',
          sw: 'Inaongozwa na Jaji Mkuu. Inaundwa na Mahakama ya Juu, Rufaa, Mahakama Kuu na Mahakimu. Inafafanua sheria na kutoa haki.',
        },
        icon: 'Scale',
      },
    ],
  },

  // 3. Two Levels of Devolution
  {
    id: 'levels',
    title: {
      en: 'Two Levels of Government: Devolution in Kenya',
      sw: 'Ngazi Mbili za Serikali: Ugatuzi Nchini Kenya',
    },
    subtitle: {
      en: 'Understanding the distinct yet interdependent relationship between National and 47 County Governments',
      sw: 'Kuelewa uhusiano wa kujitegemea na kushirikiana kati ya Serikali ya Kitaifa na Kaunti 47',
    },
    content: {
      en: 'Devolution decentralised power and state resources from Nairobi to 47 counties. Under Article 6, both levels of government are distinct, autonomous in their constitutional domains, but interdependent through consultative forums.',
      sw: 'Ugatuzi ulipeleka mamlaka na rasilimali za taifa kutoka Nairobi hadi kaunti 47. Chini ya Kifungu cha 6, ngazi zote mbili za serikali ziko huru katika maeneo yao ya kikatiba, lakini zinashirikiana kupitia mashauriano.',
    },
    keyPillars: [
      {
        title: { en: 'Equitable Resource Sharing', sw: 'Ugavi Sawa wa Rasilimali' },
        description: {
          en: 'Counties receive an annual unconditional equitable share (at least 15% of audited national revenue).',
          sw: 'Kaunti zinapokea fungu la moja kwa moja la kila mwaka (angalau 15% ya mapato ya taifa).',
        },
        icon: 'DollarSign',
      },
      {
        title: { en: 'Proximity of Public Services', sw: 'Huduma Karibu na Mwananchi' },
        description: {
          en: 'Decisions regarding healthcare clinics, village feeder roads, and local agriculture are made locally.',
          sw: 'Maamuzi ya zahanati, barabara za vijijini na masoko yanafanywa ndani ya kaunti yako.',
        },
        icon: 'MapPin',
      },
      {
        title: { en: 'Community Voice in Planning', sw: 'Sauti ya Jamii Katika Mipango' },
        description: {
          en: 'Every county must formulate a 5-year County Integrated Development Plan (CIDP) based on ward citizen input.',
          sw: 'Kila kaunti lazima iandae Mpango wa Miaka 5 (CIDP) kulingana na maoni ya wananchi wa wadi.',
        },
        icon: 'Users',
      },
    ],
  },

  // 4. Schedule 4 Division of Functions
  {
    id: 'schedule4',
    title: {
      en: 'Schedule 4: Who Does What?',
      sw: 'Jedwali la 4: Nani Anafanya Nini?',
    },
    subtitle: {
      en: 'The constitutional division of functions between National and County Governments',
      sw: 'Mgawanyo wa kikatiba wa majukumu kati ya Serikali ya Kitaifa na Serikali za Kaunti',
    },
    content: {
      en: 'Many citizens get frustrated trying to demand services from the wrong office. The Fourth Schedule of the Constitution clearly lists which responsibilities belong to the National Government and which belong to County Governments.',
      sw: 'Wananchi wengi hukata tamaa kwa kudai huduma katika ofisi isiyo sahihi. Jedwali la Nne la Katiba linaweka wazi ni huduma zipi ziko chini ya Serikali ya Kitaifa na zipi ni za Kaunti.',
    },
    keyPillars: [],
    comparisons: {
      national: {
        en: [
          'National Security (Kenya Defence Forces, National Police Service, Intelligence).',
          'Foreign affairs, international trade, immigration, and citizenship.',
          'National education policy, primary & secondary curriculum, universities, and teacher management (TSC).',
          'National trunk roads & highways (KeNHA).',
          'National referral hospitals (Kenyatta National Hospital, Moi Teaching & Referral, Mathari).',
          'Energy, mineral exploration, and national economic policy.',
          'Judiciary and Supreme legal affairs (Attorney-General, ODPP).',
        ],
        sw: [
          'Usalama wa Taifa (Majeshi ya Ulinzi KDF, Polisi, na Ujasusi NIS).',
          'Mambo ya nje, uhusiano wa kimataifa, pasipoti na uhamiaji.',
          'Sera ya elimu ya shule za msingi/upili, vyuo vikuu na uajiri wa walimu (TSC).',
          'Barabara kuu za kitaifa (KeNHA).',
          'Hospitali kuu za rufaa za kitaifa (Kenyatta, Moi Referral, n.k.).',
          'Nishati ya umeme, madini, na sera ya kiuchumi ya taifa.',
          'Mahakama na usimamizi mkuu wa sheria (Mwanasheria Mkuu, ODPP).',
        ],
      },
      county: {
        en: [
          'County health facilities (dispensaries, health centres, level 4 county hospitals, ambulances).',
          'County roads, street lighting, and local public transport facilities.',
          'Agriculture, livestock sales yards, abattoirs, crop disease control, and fisheries.',
          'Early Childhood Development Education (ECDE centres) and village polytechnics.',
          'Water supply, storm-water management, sanitation, and refuse removal.',
          'Trade development, county market construction, and single business permits.',
          'County planning, land survey, mapping, and housing development.',
        ],
        sw: [
          'Vituo vya afya vya kaunti (zahanati, vituo vya afya, hospitali za kaunti level 4, ambulansi).',
          'Barabara za vijijini/ndani ya kaunti, taa za barabarani na maegesho.',
          'Kilimo, minada ya mifugo, machinjio, na udhibiti wa magonjwa ya mazao.',
          'Elimu ya chekechea (ECDE) na vyuo vya ufundi stadi vya vijijini (polytechnics).',
          'Usambazaji wa maji ya matumizi, usafi wa mazingira na uzoaji taka.',
          'Maendeleo ya biashara, ujenzi wa masoko na utoaji leseni za biashara.',
          'Upangaji miji wa kaunti, upimaji ardhi na makazi ya kaunti.',
        ],
      },
    },
  },

  // 5. Checks and Balances
  {
    id: 'checks',
    title: {
      en: 'Checks and Balances: Preventing Abuse of Power',
      sw: 'Ukaguzi na Mizania: Kuzuia Matumizi Mabaya ya Mamlaka',
    },
    subtitle: {
      en: 'How each constitutional organ watches and limits the other to protect citizens',
      sw: 'Jinsi kila chombo cha dola kinavyomkagua na kumwekea mipaka mwenzake kulinda wananchi',
    },
    content: {
      en: 'Checks and balances ensure that no branch of government becomes a tyrant. Power checks power:',
      sw: 'Mfumo wa ukaguzi na mizania unahakikisha hakuna chombo cha serikali kinachoweza kuwa dikteta. Mamlaka yanadhibiti mamlaka:',
    },
    keyPillars: [
      {
        title: { en: 'Parliament Checks Executive', sw: 'Bunge Humkagua Rais na Mawaziri' },
        description: {
          en: 'Approves budgets, vets senior appointees, can summon ministers, and can impeach the President, CSs, or Governors.',
          sw: 'Huidhinisha bajeti, hupiga msasa wateule, linaweza kuita mawaziri na kumwondoa Rais au Gavana.',
        },
        icon: 'Users',
      },
      {
        title: { en: 'Judiciary Checks Both Arms', sw: 'Mahakama Huzikagua Mihimili Yote Miwili' },
        description: {
          en: 'Can declare any unconstitutional presidential executive order or parliamentary law null and void.',
          sw: 'Inaweza kutangaza sheria yoyote ya bunge au amri ya Rais kuwa batili ikiwa inavunja Katiba.',
        },
        icon: 'Scale',
      },
      {
        title: { en: 'Citizens Check All Organs', sw: 'Wananchi Huwakagua Wote' },
        description: {
          en: 'Through regular secret-ballot elections, public participation, petitions, peaceful protest (Art. 37), and judicial review.',
          sw: 'Kupitia kura za uchaguzi mkuu, ushiriki wa umma, maombi rasmi, maandamano ya amani (Kif. 37) na kesi za kikatiba.',
        },
        icon: 'HeartHandshake',
      },
    ],
  },

  // 6. Public Participation Guide
  {
    id: 'participation',
    title: {
      en: 'Practical Steps for Public Participation',
      sw: 'Hatua za Vitendo za Kushiriki Katika Serikali',
    },
    subtitle: {
      en: 'A step-by-step citizen guide to influencing county and national decisions',
      sw: 'Mwongozo wa hatua kwa hatua kwa mwananchi kushawishi maamuzi ya serikali',
    },
    content: {
      en: 'Citizens often feel excluded because they do not know the timeline or format. Here is how you can practically take part:',
      sw: 'Wananchi wengi hukosa nafasi kwa sababu hawajui tarehe au taratibu. Hapa kuna mwongozo wa kushiriki:',
    },
    keyPillars: [],
    steps: [
      {
        step: 1,
        title: { en: 'Look Out for Notices', sw: 'Fuatilia Matangazo Rasmi' },
        description: {
          en: 'Watch for public hearing notices in newspapers, radio, ward notice boards, and county social media channels.',
          sw: 'Tazama matangazo ya mikutano ya hadhara magazetini, redioni, mbao za matangazo za wadi na tovuti za kaunti.',
        },
      },
      {
        step: 2,
        title: { en: 'Organize as a Community Group', sw: 'Jiungeni Kama Kikundi cha Jamii' },
        description: {
          en: 'Mobilize fellow youth, women, farmers, or small traders to agree on top 3 community priorities (e.g. water pipeline, maternity facility).',
          sw: 'Wapange vijana wenzako, wazazi au wafanyabiashara wadogo mkubaliane vipaumbele 3 muhimu vya kijiji chenu.',
        },
      },
      {
        step: 3,
        title: { en: 'Draft a Written Memorandum', sw: 'Andikeni Maoni Rasmi ya Maandishi' },
        description: {
          en: 'Write down your community needs clearly. State why it is urgent and how many residents will benefit. Submit it to the meeting facilitators and keep a stamped receiving copy.',
          sw: 'Andikeni mahitaji yenu kwa uwazi. Elezeni kwa nini ni ya haraka na wananchi wangapi watafaidika. Wasilisheni na muweke nakala iliyogongwa muhuri.',
        },
      },
      {
        step: 4,
        title: { en: 'Track the Budget Implementation', sw: 'Fuatilieni Utekelezaji wa Bajeti' },
        description: {
          en: 'Follow up with your Ward MCA and County Executive to ensure the proposed project was included in the approved County Budget Estimates.',
          sw: 'Fuatilieni na Diwani wenu (MCA) na serikali ya kaunti ili kuhakikisha mradi wenu umejumuishwa kwenye bajeti iliyopitishwa.',
        },
      },
    ],
  },
];
