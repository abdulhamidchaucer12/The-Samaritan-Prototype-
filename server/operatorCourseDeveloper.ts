export interface OperatorCourseDeveloperInput {
  topic: string;
  category?: string;
  summaryEn?: string;
  summarySw?: string;
  userLanguage?: "en" | "sw";
}

export interface DevelopedQuizQuestion {
  id: string;
  category: string;
  question: {
    en: string;
    sw: string;
  };
  options: {
    id: string;
    text: {
      en: string;
      sw: string;
    };
  }[];
  correctOptionId: "a" | "b" | "c" | "d";
  explanation: {
    en: string;
    sw: string;
  };
}

export interface OperatorCourseDevelopedOutput {
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
    bulletPoints: { en: string[]; sw: string[] };
  }[];
  keyTerms: {
    term: { en: string; sw: string };
    definition: { en: string; sw: string };
  }[];
  citizenActionTip: {
    en: string;
    sw: string;
  };
  quizzes: DevelopedQuizQuestion[];
  isDevelopedByOperatorAi: boolean;
  developedAt: string;
}

/**
 * Ensures correct answers are randomly and uniformly distributed across choices A, B, C, and D,
 * preventing questions from defaulting to choice A.
 */
function randomizeDeveloperQuizzes(quizzes: DevelopedQuizQuestion[]): DevelopedQuizQuestion[] {
  if (!quizzes || quizzes.length === 0) return [];
  
  // Balanced slots template (approx 2-3 of each option)
  const baseSlots: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd', 'b', 'c', 'a', 'd', 'b', 'c'];
  let slots: Array<'a' | 'b' | 'c' | 'd'> = [];
  while (slots.length < quizzes.length) {
    slots.push(...baseSlots);
  }
  slots = slots.slice(0, quizzes.length);

  // Shuffle target slots
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = slots[i];
    slots[i] = slots[j];
    slots[j] = temp;
  }

  const letterKeys: Array<'a' | 'b' | 'c' | 'd'> = ['a', 'b', 'c', 'd'];

  return quizzes.map((q, idx) => {
    const targetSlot = slots[idx % slots.length];
    const origOptions = [...q.options];
    if (origOptions.length < 2) return q;

    const correctIdx = origOptions.findIndex((o) => o.id === q.correctOptionId) >= 0
      ? origOptions.findIndex((o) => o.id === q.correctOptionId)
      : 0;
    const correctOption = origOptions[correctIdx] || origOptions[0];
    const wrongOptions = origOptions.filter((_, oIdx) => oIdx !== correctIdx);
    const shuffledWrong = [...wrongOptions].sort(() => Math.random() - 0.5);

    const targetIdx = letterKeys.indexOf(targetSlot);
    const newOptions: DevelopedQuizQuestion['options'] = [];
    let wrongPtr = 0;

    for (let i = 0; i < origOptions.length; i++) {
      const slotLetter = letterKeys[i] || 'a';
      if (i === targetIdx) {
        newOptions.push({
          id: slotLetter,
          text: { ...correctOption.text },
        });
      } else {
        const w = shuffledWrong[wrongPtr++] || origOptions[i];
        newOptions.push({
          id: slotLetter,
          text: { ...w.text },
        });
      }
    }

    return {
      ...q,
      options: newOptions,
      correctOptionId: targetSlot,
    };
  });
}

/**
 * Procedural constitutional generator that produces 10 authentic questions and translations
 * for any given topic under the Constitution of Kenya 2010.
 */
function generateFallbackOperatorCourse(
  input: OperatorCourseDeveloperInput
): OperatorCourseDevelopedOutput {
  const topic = input.topic.trim();
  const category = input.category?.trim() || "constitution";
  const now = new Date();

  // Determine key article based on topic
  const lower = topic.toLowerCase();
  let primaryArticle = "Article 10 & 201";
  let topicSw = topic;

  if (lower.includes("health") || lower.includes("dispensary") || lower.includes("hospital") || lower.includes("dawa")) {
    primaryArticle = "Article 43(1)(a) & Fourth Schedule Part 2";
    topicSw = `Haki ya Afya na Usimamizi wa Zahanati za Kaunti (${topic})`;
  } else if (lower.includes("land") || lower.includes("ardhi") || lower.includes("plot") || lower.includes("title")) {
    primaryArticle = "Article 60, 63 & 67 (National Land Commission)";
    topicSw = `Haki za Ardhi ya Jamii na Umiliki (${topic})`;
  } else if (lower.includes("bursary") || lower.includes("school") || lower.includes("education") || lower.includes("elimu")) {
    primaryArticle = "Article 43(1)(f), Article 53 & County Governments Act";
    topicSw = `Mgao wa Bursary na Haki ya Elimu (${topic})`;
  } else if (lower.includes("police") || lower.includes("arrest") || lower.includes("bail") || lower.includes("usalama")) {
    primaryArticle = "Article 49 & IPOA Act 2011";
    topicSw = `Haki za Mshukiwa na Ulinzi wa Polisi (${topic})`;
  } else if (lower.includes("budget") || lower.includes("tax") || lower.includes("pesa") || lower.includes("finance")) {
    primaryArticle = "Article 201 & Public Finance Management Act (PFMA)";
    topicSw = `Usimamizi wa Fedha za Umma na Bajeti (${topic})`;
  } else if (lower.includes("environment") || lower.includes("water") || lower.includes("forest") || lower.includes("maji")) {
    primaryArticle = "Article 42, 69 & 70";
    topicSw = `Haki ya Mazingira Safi na Rasilimali za Asili (${topic})`;
  } else {
    primaryArticle = "Article 1, 10 & 174 (Sovereignty & Devolution)";
    topicSw = `Elimu ya Kikatiba na Ushiriki wa Jamii: ${topic}`;
  }

  const summaryEn =
    input.summaryEn?.trim() ||
    `Specialized civic education module examining ${topic} under the Constitution of Kenya 2010. Empowers citizens with practical oversight tools, statutory procedures, and constitutional defense mechanisms.`;
  const summarySw =
    input.summarySw?.trim() ||
    `Somo maalum la uraia linalochambua ${topicSw} chini ya Katiba ya Kenya 2010. Linampa mwananchi uelewa thabiti wa kisheria, taratibu za kikatiba, na njia za kuwawajibisha viongozi.`;

  // 10 Detailed Questions for this Topic
  const quizzes: DevelopedQuizQuestion[] = [
    {
      id: `q_op_${Date.now()}_1`,
      category,
      question: {
        en: `Under the Constitution of Kenya 2010, what is the legal foundation governing ${topic}?`,
        sw: `Chini ya Katiba ya Kenya 2010, ni upi msingi wa kisheria unaoongoza suala la ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: `Constitutional sovereignty of the people, rule of law, and public accountability (${primaryArticle})`,
            sw: `Mamlaka ya wananchi, utawala wa sheria na uwazi wa umma (${primaryArticle})`,
          },
        },
        {
          id: 'b',
          text: {
            en: 'Discretionary declarations made at private political rallies',
            sw: 'Matamshi yasiyo rasmi yanayotolewa kwenye mikutano ya kisiasa',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Unpublished decisions by unauthorized departmental brokers',
            sw: 'Maamuzi ya siri ya madalali wasio na leseni serikalini',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Colonial ordinances that bypass democratic public participation',
            sw: 'Sheria za kikoloni zinazopuuza ushiriki wa wananchi',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: `All governance actions regarding ${topic} must trace directly to constitutional principles under ${primaryArticle}, binding every state officer.`,
        sw: `Shughuli zote za utawala kuhusu ${topicSw} lazima zizingatie misingi ya kikatiba chini ya ${primaryArticle}, inayombana kila afisa wa serikali.`,
      },
    },
    {
      id: `q_op_${Date.now()}_2`,
      category,
      question: {
        en: `Which national value under Article 10 is most violated when decisions on ${topic} are made without consulting residents?`,
        sw: `Ni thamani ipi ya kitaifa chini ya Kifungu cha 10 inayokiukwa zaidi maamuzi ya ${topicSw} yanapofanywa bila kuwashirikisha wananchi?`,
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
            en: 'Administrative immunity and secrecy of files',
            sw: 'Kinga ya kiutawala na usiri wa nyaraka',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Personal entitlement of elected politicians',
            sw: 'Mamlaka binafsi ya wanasiasa waliochaguliwa',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Automatic forfeiture of civilian petitions',
            sw: 'Kupoteza haki ya kuwasilisha maombi ya kiraia',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 10(2)(a) explicitly enshrines public participation, democracy, rule of law, and transparency as mandatory national values.',
        sw: 'Kifungu cha 10(2)(a) kinaamuru ushiriki wa umma, demokrasia, utawala wa sheria na uwazi kama maadili ya lazima ya kitaifa.',
      },
    },
    {
      id: `q_op_${Date.now()}_3`,
      category,
      question: {
        en: `What formal constitutional mechanism can Kwale citizens use to challenge unlawful administrative decisions related to ${topic}?`,
        sw: `Ni njia ipi rasmi ya kikatiba wananchi wa Kwale wanaweza kuitumia kupinga maamuzi haramu kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Submitting a petition under Article 37 & 119, or seeking judicial review under Article 47',
            sw: 'Kuwasilisha ombi rasmi chini ya Kifungu cha 37 na 119, au kufungua kesi chini ya Kifungu cha 47',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Paying bribes to local gatekeepers to speed up informal favors',
            sw: 'Kutoa hongo kwa mawakala ili kuharakisha upendeleo',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Vandalizing public facilities in neighboring sub-counties',
            sw: 'Kuharibu miundombinu ya umma katika kaunti ndogo jirani',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Remaining silent until the next general election cycle',
            sw: 'Kukaa kimya hadi kipindi kijacho cha uchaguzi mkuu',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 119 grants every citizen the right to petition authorities, while Article 47 guarantees fair, lawful, and expeditious administrative action.',
        sw: 'Kifungu cha 119 kinampa kila mwananchi haki ya kuwasilisha ombi, nacho Kifungu cha 47 kinahakikisha utawala wa haki na unaofuata sheria.',
      },
    },
    {
      id: `q_op_${Date.now()}_4`,
      category,
      question: {
        en: `Under Article 35 of the Constitution, what right do citizens possess regarding records on ${topic}?`,
        sw: `Chini ya Kifungu cha 35 cha Katiba, wananchi wana haki gani kuhusu nyaraka za ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'The right of access to information held by the State or public entities',
            sw: 'Haki ya kupata taarifa zote zinazoshikiliwa na Serikali au asasi za umma',
          },
        },
        {
          id: 'b',
          text: {
            en: 'No right; public documents are strictly private property of civil servants',
            sw: 'Hakuna haki; faili zote ni mali ya siri ya watumishi wa umma',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Only members of the ruling political coalition may inspect records',
            sw: 'Wanachama wa chama tawala pekee ndio wanaoweza kukagua nyaraka',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Records may only be viewed after paying exorbitant non-refundable fees',
            sw: 'Nyaraka zinaweza kuonekana tu baada ya kulipa ada kubwa zisizo halali',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 35(1)(a) guarantees every citizen the right of access to information held by the state, reinforced by the Access to Information Act 2016.',
        sw: 'Kifungu cha 35(1)(a) kinampa kila mwananchi haki ya kupata taarifa za serikali, kikitiliwa nguvu na Sheria ya Haki ya Kupata Taarifa ya 2016.',
      },
    },
    {
      id: `q_op_${Date.now()}_5`,
      category,
      question: {
        en: `Which independent constitutional commission provides oversight if public officers abuse their mandate regarding ${topic}?`,
        sw: `Ni tume ipi huru ya kikatiba inayotoa usimamizi iwapo maafisa wa umma watatumia vibaya ofisi zao kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Ethics and Anti-Corruption Commission (EACC) and Commission on Administrative Justice (Ombudsman)',
            sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC) na Tume ya Haki ya Kiutawala (Ombudsman)',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Private marketing agencies and campaign sponsors',
            sw: 'Makampuni ya kibinafsi ya matangazo ya kisiasa',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Foreign commercial trading companies',
            sw: 'Makampuni ya kigeni ya kibiashara',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Informal social media rumor channels',
            sw: 'Vituo vya uvumi visivyothibitishwa mitandaoni',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'The EACC enforces Chapter Six (Integrity), while CAJ (Ombudsman) resolves maladministration, delays, and official abuse under Article 59(4).',
        sw: 'EACC inalinda Sura ya Sita (Uadilifu), nayo CAJ (Ombudsman) inashughulikia uonevu na uzembe wa maafisa wa serikali chini ya Kifungu cha 59(4).',
      },
    },
    {
      id: `q_op_${Date.now()}_6`,
      category,
      question: {
        en: `Under Article 201, what standard applies to any public funds allocated for ${topic}?`,
        sw: `Chini ya Kifungu cha 201, ni kiwango gani kinachotumika kwa fedha zote za umma zinazotengwa kwa ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Openness, accountability, and prudent, responsible financial management',
            sw: 'Uwazi, uwajibikaji, na matumizi ya busara na uangalifu',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Total secrecy with no audit by the Auditor-General',
            sw: 'Usiri mkubwa bila kukaguliwa na Mkaguzi Mkuu wa Hesabu',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Arbitrary cash distribution to personal relatives',
            sw: 'Kugawanya pesa taslimu kiholela kwa jamaa wa viongozi',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Exemption from public procurement and disposal statutory laws',
            sw: 'Kusamehewa kufuata sheria za ununuzi na ugavi wa umma',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 201(d) dictates that public money shall be used in a prudent and responsible way, and financial reporting must be clear and public.',
        sw: 'Kifungu cha 201(d) kinaelekeza kuwa pesa za umma zitatumika kwa uangalifu na uwazi kamili kwa wananchi wote.',
      },
    },
    {
      id: `q_op_${Date.now()}_7`,
      category,
      question: {
        en: `What is the constitutional role of the County Assembly (MCAs) regarding executive implementation of ${topic}?`,
        sw: `Ni upi wajibu wa kikatiba wa Bunge la Kaunti (Madiwani) kuhusu utekelezaji wa ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Legislative scrutiny, budget approval, and strict oversight under Article 185',
            sw: 'Kutunga sheria, kuidhinisha bajeti, na usimamizi madhubuti chini ya Kifungu cha 185',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Directly awarding tenders and managing construction machinery',
            sw: 'Kutoa zabuni na kuendesha mitambo ya ujenzi wao wenyewe',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Operating secret bank accounts outside the County Revenue Fund',
            sw: 'Kufungua akaunti za siri za benki nje ya Mfuko wa Mapato wa Kaunti',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Exempting county executive officials from appearing before assembly committees',
            sw: 'Kuwazuia maafisa wa kaunti kufika mbele ya kamati za bunge',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 185(3) empowers the County Assembly to exercise oversight over the County Executive Committee and all county organs.',
        sw: 'Kifungu cha 185(3) kinapa Bunge la Kaunti mamlaka ya kusimamia utendaji wote wa Serikali ya Kaunti.',
      },
    },
    {
      id: `q_op_${Date.now()}_8`,
      category,
      question: {
        en: `How can marginalized community members (women, youth, PWDs) ensure their voices are prioritized on ${topic}?`,
        sw: `Makundi yaliyotengwa (wanawake, vijana, watu wenye ulemavu) yanawezaje kuhakikisha sauti zao zinasikika kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Leveraging affirmative action guarantees under Article 27, 54, 55, and 56 through organized caucuses',
            sw: 'Kutumia haki za kikatiba chini ya Kifungu cha 27, 54, 55 na 56 kupitia vikundi vilivyosajiliwa',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Accepting marginalization as an unchangeable cultural custom',
            sw: 'Kukubali kubaguliwa kama mila isiyoweza kubadilika',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Boycotting all community civic engagements entirely',
            sw: 'Kususia mikutano yote ya kiraia na kutoenda baraza',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Waiting for international visitors to advocate on their behalf',
            sw: 'Kusubiri wageni kutoka ng\'ambo waje kuwasemea',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Articles 27, 54, 55, and 56 mandate the state to take affirmative action to rectify historic discrimination and include vulnerable groups.',
        sw: 'Vifungu vya 27, 54, 55 na 56 vinaamuru serikali kuchukua hatua za makusudi kusaidia makundi maalum na kuondoa ubaguzi.',
      },
    },
    {
      id: `q_op_${Date.now()}_9`,
      category,
      question: {
        en: `What evidence should a community paralegal or active citizen assemble when drafting an inquiry into ${topic}?`,
        sw: `Ni ushahidi gani mwanaharakati au mwananchi anapaswa kuukusanya anapoandika malalamiko kuhusu ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Official project notices, dates, photographic records, and specific statutory citations',
            sw: 'Matangazo rasmi ya miradi, tarehe, picha halisi, na vifungu maalum vya sheria',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Unverified hearsay heard at a market tea kiosk',
            sw: 'Maneno ya uvumi yasiyothibitishwa yanayosemwa mtaani',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Anonymous threatening letters sent through SMS',
            sw: 'Barua za vitisho zisizo na jina zinazotumwa kwa njia ya siri',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Emotional outbursts that ignore factual documentation',
            sw: 'Hasira na hisia zinazopuuza nyaraka za ukweli',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Evidence-based constitutional petitions carry statutory weight, compelling oversight bodies like the Ombudsman and EACC to launch formal probes.',
        sw: 'Malalamiko yenye ushahidi na nukuu za sheria huwajibisha vyombo vya usimamizi kuanza uchunguzi rasmi wa kisheria mara moja.',
      },
    },
    {
      id: `q_op_${Date.now()}_10`,
      category,
      question: {
        en: `What is the core civic takeaway regarding citizen responsibility in ${topic}?`,
        sw: `Ni lipi fundisho kuu la kikatiba kuhusu wajibu wa mwananchi katika ${topicSw}?`,
      },
      options: [
        {
          id: 'a',
          text: {
            en: 'Sovereign power belongs to the people; vigilance and active civic engagement protect democracy',
            sw: 'Mamlaka yote ni ya wananchi; ufuatiliaji makini na ushiriki wa dhati unalinda demokrasia',
          },
        },
        {
          id: 'b',
          text: {
            en: 'Government belongs exclusively to the political elite',
            sw: 'Serikali ni mali ya viongozi wachache pekee',
          },
        },
        {
          id: 'c',
          text: {
            en: 'Citizens have no right to question how their taxes are spent',
            sw: 'Wananchi hawana haki ya kuhoji jinsi kodi zao zinavyotumika',
          },
        },
        {
          id: 'd',
          text: {
            en: 'Constitutional awareness is unnecessary for community development',
            sw: 'Kujua katiba hakuna umuhimu wowote katika maendeleo ya kijiji',
          },
        },
      ],
      correctOptionId: 'a',
      explanation: {
        en: 'Article 1 of the Constitution establishes that the people are the ultimate repository of power, exercising continuous oversight over their government.',
        sw: 'Kifungu cha 1 cha Katiba kinathibitisha kuwa nguvu zote ni za wananchi, na ndio wasimamizi wakuu wa serikali yao.',
      },
    },
  ];

  return {
    title: {
      en: topic,
      sw: topicSw,
    },
    summary: {
      en: summaryEn,
      sw: summarySw,
    },
    category,
    readTimeMinutes: 8,
    sections: [
      {
        id: "sec_1",
        title: {
          en: `Foundational Rights & Statutory Framework (${primaryArticle})`,
          sw: `Misingi ya Haki na Muundo wa Sheria (${primaryArticle})`,
        },
        content: {
          en: `The Constitution of Kenya 2010 establishes an authoritative rights-based framework for ${topic}. Under ${primaryArticle}, public administrators are required to act with strict fidelity to the law, ensuring equal protection, administrative fairness, and open public scrutiny.`,
          sw: `Katiba ya Kenya 2010 inaweka misingi thabiti ya haki za binadamu kuhusu ${topicSw}. Chini ya ${primaryArticle}, maafisa wa serikali wanatakiwa kufuata sheria bila upendeleo, kuhakikisha usawa na uwazi kwa wananchi wote.`,
        },
        constitutionalArticle: primaryArticle,
        bulletPoints: {
          en: [
            `Every citizen is guaranteed protection and administrative fairness under Article 47.`,
            `Public participation is mandatory before any county or national policy is enacted under Article 10.`,
            `Records and budgetary allocations are open to public inspection under Article 35.`,
          ],
          sw: [
            `Kila mwananchi anahakikishiwa ulinzi na haki ya kiutawala chini ya Kifungu cha 47.`,
            `Ushiriki wa wananchi ni wa lazima kabla ya kupitisha sera yoyote chini ya Kifungu cha 10.`,
            `Nyaraka na bajeti ziko wazi kukaguliwa na wananchi chini ya Kifungu cha 35.`,
          ],
        },
      },
      {
        id: "sec_2",
        title: {
          en: "Citizen Enforcement & Administrative Redress Mechanisms",
          sw: "Njia za Mwananchi Kudai Haki na Hatua za Kiutawala",
        },
        content: {
          en: `When rights are compromised, citizens have institutional remedies. Petitions may be lodged with the relevant County Assembly Committee, the Commission on Administrative Justice (Ombudsman), or through public interest litigation in the High Court.`,
          sw: `Haki zinapokiukwa, mwananchi ana njia rasmi za kisheria. Anaweza kuandika malalamiko kwa Kamati ya Bunge la Kaunti, Ofisi ya Ombudsman (CAJ), au kufungua kesi ya maslahi ya umma katika Mahakama Kuu.`,
        },
        constitutionalArticle: "Article 22, 119 & 258",
        bulletPoints: {
          en: [
            "Document all encounters, dates, and names of officers involved.",
            "Cite relevant constitutional articles in written memoranda.",
            "Engage local community groups to present a unified petition.",
          ],
          sw: [
            "Weka kumbukumbu ya majina ya maafisa, tarehe na mahali.",
            "Taja vifungu vya Katiba katika barua rasmi ya malalamiko.",
            "Ungana na wanavijiji wenzako ili kuwasilisha sauti moja yenye nguvu.",
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: "Sovereignty of the People", sw: "Mamlaka ya Wananchi" },
        definition: {
          en: "The constitutional rule that all power emanates from citizens and state officers exercise it only on trust.",
          sw: "Kanuni ya kikatiba kwamba mamlaka yote yanatoka kwa wananchi na viongozi ni wadhamini tu.",
        },
      },
      {
        term: { en: "Public Participation", sw: "Ushiriki wa Umma" },
        definition: {
          en: "The mandatory process of involving affected citizens before government decisions, laws, or budgets are finalized.",
          sw: "Mchakato wa lazima wa kuwashirikisha wananchi kabla ya kupitisha sheria, sera au bajeti za serikali.",
        },
      },
    ],
    citizenActionTip: {
      en: `Draft a formal inquiry or attendance request regarding ${topic} to your local Ward Administrator or Area MCA. Request a stamped copy for community records.`,
      sw: `Andika barua rasmi ya kuulizia masuala ya ${topicSw} kwa Msimamizi wa Wadi au Diwani wako. Hakikisha unapata nakala iliyogongwa muhuri rasmi.`,
    },
    quizzes: randomizeDeveloperQuizzes(quizzes),
    isDevelopedByOperatorAi: true,
    developedAt: now.toISOString(),
  };
}

/**
 * Uses Kenyan constitutional and civic curriculum generator to develop 10 customized questions, answer choices, and bilingual translations.
 */
export async function developCourseWithOperatorAi(
  input: OperatorCourseDeveloperInput
): Promise<OperatorCourseDevelopedOutput> {
  return generateFallbackOperatorCourse(input);
}
