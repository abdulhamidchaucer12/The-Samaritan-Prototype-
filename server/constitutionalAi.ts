export interface ConstitutionalQuestionInput {
  title: string;
  details: string;
  category?: string;
  county?: string;
  userLanguage?: "en" | "sw";
}

export interface OperatorAnswerOutput {
  answeredBy: "Operator";
  adminTitle: {
    en: string;
    sw: string;
  };
  answerText: {
    en: string;
    sw: string;
  };
  constitutionalArticle: string;
  howToUseArticles: {
    en: string;
    sw: string;
  };
  recommendedOfficeId?: string;
  isAiGenerated: boolean;
  answeredAt: string;
}

// Fallback constitutional knowledge base for Kenya Constitution 2010
function generateFallbackConstitutionalAnswer(
  input: ConstitutionalQuestionInput
): OperatorAnswerOutput {
  const combined = `${input.title} ${input.details} ${input.category || ""}`.toLowerCase();

  // Category or topic matching: Police / Arrest / Bail
  if (
    combined.includes("police") ||
    combined.includes("arrest") ||
    combined.includes("bail") ||
    combined.includes("bond") ||
    combined.includes("cell") ||
    combined.includes("station") ||
    combined.includes("bribe")
  ) {
    const howToUseEn = `1) At the moment of arrest, cite Article 49(1)(a) and demand that the arresting officer state clearly in a language you understand the exact reason for arrest and record it in the Occurrence Book (OB).
2) Exercise Article 49(1)(b) to remain silent until your advocate or a trusted relative is present. You are not required to sign statements under duress.
3) If held beyond 24 hours without being brought to court, your advocate or family can cite Article 49(1)(f) to file an urgent habeas corpus petition in the nearest High Court.
4) If bail is denied or extortion is attempted, remind the station commander (OCS) that police bond/bail is a constitutional guarantee under Article 49(1)(h) unless compelling state security grounds exist, and report misconduct to the Independent Policing Oversight Authority (IPOA) quoting Article 29 & Section 25 of the IPOA Act.`;

    const howToUseSw = `1) Wakati wa kukamatwa, taja Kifungu cha 49(1)(a) na uamuru afisa aliyekukamata aeleze bayana kwa lugha unayoelewa sababu halisi ya kukamatwa na kuiweka kwenye Kitabu cha Matukio (OB).
2) Tumia Kifungu cha 49(1)(b) kukaa kimya bila kushurutishwa kutoa maelezo hadi wakili au jamaa yako awepo.
3) Ukizuiliwa kituoni zaidi ya saa 24 bila kufikishwa mahakamani, jamaa au wakili anaweza kutumia Kifungu cha 49(1)(f) kufungua kesi ya dharura ya Habeas Corpus Mahakama Kuu kuamuru uachiliwe mara moja.
4) Polisi wakikataa dhamana au wakiomba hongo, wakumbushe Mkuu wa Kituo (OCS) kuwa dhamana ni haki ya kikatiba chini ya Kifungu cha 49(1)(h), na uwasilishe malalamiko kwa IPOA ukinukuu Kifungu cha 29 cha Katiba.`;

    return {
      answeredBy: "Operator",
      adminTitle: {
        en: "Operator • AI Constitutional Assistant",
        sw: "Opereta • Msaidizi wa Kikatiba wa AI",
      },
      answerText: {
        en: `Under Article 49 of the Constitution of Kenya 2010, every arrested citizen has fundamental rights: 1) To be informed promptly in a language you understand the exact reason for arrest. 2) To remain silent and consult an advocate or family immediately. 3) Not to be compelled to make any confession. 4) To be brought before a court of law within 24 hours (or next court day if arrested on weekend). 5) To be released on reasonable bond or bail unless there are compelling reasons recorded by the court.

📌 How to use these articles in your situation:
${howToUseEn}`,
        sw: `Chini ya Kifungu cha 49 cha Katiba ya Kenya 2010, kila mwananchi aliyekamatwa na polisi ana haki zifuatazo: 1) Kufahamishwa mara moja kwa lugha anayoelewa sababu halisi ya kukamatwa. 2) Haki ya kukaa kimya na kuwasiliana na wakili au familia yake mara moja. 3) Kutoruhusiwa kulazimishwa kukiri kosa lolote. 4) Kufikishwa mahakamani ndani ya saa 24. 5) Haki ya kuachiliwa kwa dhamana ya kuridhisha.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`,
      },
      constitutionalArticle: "Article 49, Article 29 & IPOA Act 2011",
      howToUseArticles: {
        en: howToUseEn,
        sw: howToUseSw,
      },
      recommendedOfficeId: "police",
      isAiGenerated: true,
      answeredAt: new Date().toISOString(),
    };
  }

  // Category or topic matching: MCA / Ward Development
  if (
    combined.includes("mca") ||
    combined.includes("ward") ||
    combined.includes("assembly") ||
    combined.includes("divert") ||
    combined.includes("tender")
  ) {
    const howToUseEn = `1) Cite Article 35 (Access to Information) and Section 96 of the County Governments Act to formally write to the County Chief Officer and County Assembly Clerk demanding the approved County Annual Development Plan (ADP) and ward budget allocation.
2) Quote Article 185 to demonstrate that MCAs are exclusively legislators and oversight officers with zero legal mandate to award tenders, control project funds, or unilaterally divert projects.
3) Invoke Article 10 (National Values) and Section 135 of the Public Finance Management Act (PFMA) in a written citizen petition submitted to the County Assembly Speaker to invalidate any unapproved project diversion.
4) Organize a delegation of ward residents to present your findings at the next County Budget and Economic Forum (CBEF) public participation baraza.`;

    const howToUseSw = `1) Nukuu Kifungu cha 35 (Haki ya Kupata Taarifa) na Kifungu cha 96 cha Sheria ya Serikali za Kaunti kuandika barua rasmi kwa Afisa Mkuu wa Kaunti kudai nakala ya Mpango wa Maendeleo wa Mwaka (ADP) na bajeti iliyotengwa kwa mradi wa wadi.
2) Nukuu Kifungu cha 185 kuthibitisha kuwa Diwani (MCA) ana jukumu la kutunga sheria na kusimamia tu, hana mamlaka ya kisheria kugawa zabuni au kuhamisha mradi kiholela.
3) Nukuu Kifungu cha 10 na Kifungu cha 135 cha Sheria ya PFMA kwenye ombi rasmi la wananchi linalowasilishwa kwa Spika wa Bunge la Kaunti kusimamisha mabadiliko hayo haramu.
4) Panga ujumbe wa wananchi wa wadi kuhudhuria mkutano wa Baraza la Bajeti na Uchumi la Kaunti (CBEF) kupinga mradi kuchepushwa bila ridhaa ya umma.`;

    return {
      answeredBy: "Operator",
      adminTitle: {
        en: "Operator • AI Constitutional Assistant",
        sw: "Opereta • Msaidizi wa Kikatiba wa AI",
      },
      answerText: {
        en: `Under Article 185 of the Constitution of Kenya, a Member of County Assembly (MCA) is exclusively an oversight, legislative, and representation officer—NOT an executive accounting officer. MCAs do NOT award tenders, disburse cash, or unilaterally divert approved ward projects. Diverting public project funds without public participation violates Article 10, Article 201, and Section 135 of the Public Finance Management Act (PFMA).

📌 How to use these articles in your situation:
${howToUseEn}`,
        sw: `Chini ya Kifungu cha 185 cha Katiba ya Kenya, Diwani (MCA) ana wajibu wa kutunga sheria, uwakilishi na kusimamia serikali ya kaunti—yeye si afisa mtendaji au mtoa zabuni. Diwani haruhusiwi kisheria kugeuza au kuhamisha mradi wa wadi uliopitishwa na wananchi. Kufanya hivyo ni kosa kubwa chini ya Kifungu cha 10 na Kifungu cha 201 cha Katiba, pamoja na Kifungu cha 135 cha Sheria ya Usimamizi wa Fedha za Umma (PFMA).

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`,
      },
      constitutionalArticle: "Article 10, Article 185 & PFMA Sec. 135",
      howToUseArticles: {
        en: howToUseEn,
        sw: howToUseSw,
      },
      recommendedOfficeId: "mca",
      isAiGenerated: true,
      answeredAt: new Date().toISOString(),
    };
  }

  // Category or topic matching: MP / NG-CDF / Secondary Education
  if (
    combined.includes("cdf") ||
    combined.includes("mp") ||
    combined.includes("school") ||
    combined.includes("national")
  ) {
    const howToUseEn = `1) Quote the Fourth Schedule (Part 1) to clarify boundaries: show that your MP's NG-CDF fund is legally confined to national functions (public secondary schools, security outposts, education bursaries), not devolved county roads or clinics.
2) Invoke Article 35 and Section 39 of the NG-CDF Act 2015 to visit the Constituency NG-CDF office and inspect the official project list, contractor details, and allocated budget allocations.
3) Use Article 10 to demand that the NG-CDF Committee conduct open constituency barazas before picking bursary beneficiaries or classroom projects.
4) If funds are misapplied or nepotism occurs, draft a formal petition quoting Chapter 6 (Leadership & Integrity) and file it with the NG-CDF Board in Nairobi and the Ethics and Anti-Corruption Commission (EACC).`;

    const howToUseSw = `1) Nukuu Ratiba ya Nne (Sehemu ya 1) kutenganisha majukumu: onyesha kwamba fedha za NG-CDF za Mbunge zimefungwa kisheria kwa miradi ya kitaifa (shule za upili, vituo vya usalama, na ufadhili wa karo za elimu), si barabara za vijijini au zahanati.
2) Tumia Kifungu cha 35 na Kifungu cha 39 cha Sheria ya NG-CDF kutembelea ofisi ya CDF ya eneo bunge na kukagua orodha rasmi ya miradi, wakandarasi, na kiasi cha fedha kilichotengwa.
3) Tumia Kifungu cha 10 kudai kamati ya NG-CDF ifanye mabaraza ya wazi ya umma kabla ya kutoa hundi za bursary au miradi ya madarasa.
4) Iwapo kuna ubadhirifu au upendeleo, andika malalamiko rasmi ukinukuu Sura ya Sita (Uongozi na Uadilifu) kwa Bodi ya Kitaifa ya NG-CDF na Tume ya EACC.`;

    return {
      answeredBy: "Operator",
      adminTitle: {
        en: "Operator • AI Constitutional Assistant",
        sw: "Opereta • Msaidizi wa Kikatiba wa AI",
      },
      answerText: {
        en: `Under the Fourth Schedule of the Constitution of Kenya and the NG-CDF Act 2015, the National Government-Constituency Development Fund (NG-CDF) under your Member of Parliament (MP) is legally restricted to National Government functions—primarily secondary school infrastructure, security infrastructure (police posts), and educational bursaries.

📌 How to use these articles in your situation:
${howToUseEn}`,
        sw: `Chini ya Ratiba ya Nne ya Katiba na Sheria ya NG-CDF ya 2015, Mfuko wa Maendeleo ya Maeneo Bunge (NG-CDF) unaosimamiwa na Mbunge wako (MP) unahusika tu na majukumu ya kitaifa—hasa madarasa ya shule za upili, vituo vya usalama vya polisi na ufadhili wa karo (bursary).

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`,
      },
      constitutionalArticle: "Fourth Schedule Part 1 & NG-CDF Act 2015",
      howToUseArticles: {
        en: howToUseEn,
        sw: howToUseSw,
      },
      recommendedOfficeId: "mp",
      isAiGenerated: true,
      answeredAt: new Date().toISOString(),
    };
  }

  // Category or topic matching: Health / Dispensary / Hospitals
  if (
    combined.includes("hospital") ||
    combined.includes("dispensary") ||
    combined.includes("health") ||
    combined.includes("medicine") ||
    combined.includes("doctor")
  ) {
    const howToUseEn = `1) Invoke Article 43(1)(a) (Right to Health) and Article 43(2) (Emergency Medical Treatment) to insist that no public clinic or hospital can turn away an emergency patient or deny standard care.
2) Cite Fourth Schedule Part 2(2) in a letter addressed to the County Executive Committee Member (CECM) for Health and the County Governor, holding them constitutionally accountable for local clinic medicine stockouts.
3) Use Article 119 to present a petition signed by affected community members to the County Assembly Health Committee, urging them to summon the CECM and Chief Officer for questioning on healthcare budget execution.
4) If negligence or maladministration leads to harm or continuous denial of basic medicines, file a complaint with the Commission on Administrative Justice (Ombudsman) under Article 59 citing administrative failure.`;

    const howToUseSw = `1) Tumia Kifungu cha 43(1)(a) (Haki ya Afya) na Kifungu cha 43(2) (Huduma ya Dharura) kusisitiza kwamba kituo chochote cha afya hakiwezi kumkataa mgonjwa wa dharura au kukosa kutoa huduma za kimsingi.
2) Nukuu Ratiba ya Nne Sehemu ya 2(2) katika barua kwa Waziri wa Afya wa Kaunti (CECM) na Gavana, ukiwawajibisha kikatiba kuhusu uhaba wa dawa katika zahanati za eneo lenu.
3) Tumia Kifungu cha 119 kuwasilisha ombi lililotiwa saini na wananchi kwa Kamati ya Afya ya Bunge la Kaunti ili kumwita CECM kueleza kwa nini bajeti ya dawa haijatekelezwa.
4) Iwapo kuna uzembe mkubwa au kukataliwa huduma, wasilisha malalamishi kwa Tume ya Utawala wa Haki (Ombudsman) chini ya Kifungu cha 59 cha Katiba.`;

    return {
      answeredBy: "Operator",
      adminTitle: {
        en: "Operator • AI Constitutional Assistant",
        sw: "Opereta • Msaidizi wa Kikatiba wa AI",
      },
      answerText: {
        en: `Under Article 43(1)(a) of the Constitution of Kenya, every citizen has the fundamental right to the highest attainable standard of health, which includes health care services. Under the Fourth Schedule Part 2(2), county health facilities and pharmacies are 100% devolved functions managed by the County Governor and the County Executive Committee Member (CECM) for Health.

📌 How to use these articles in your situation:
${howToUseEn}`,
        sw: `Chini ya Kifungu cha 43(1)(a) cha Katiba, kila mwananchi ana haki ya kupata huduma bora zaidi za afya. Chini ya Ratiba ya Nne, Sehemu ya 2(2), vituo vya afya na zahanati vya kaunti vimegatuliwa asilimia mia moja na vinasimamiwa na Gavana wa Kaunti na Waziri wa Afya wa Kaunti (CECM).

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`,
      },
      constitutionalArticle: "Article 43(1)(a) & Fourth Schedule Part 2(2)",
      howToUseArticles: {
        en: howToUseEn,
        sw: howToUseSw,
      },
      recommendedOfficeId: "governor",
      isAiGenerated: true,
      answeredAt: new Date().toISOString(),
    };
  }

  // General constitutional governance answer
  const howToUseEn = `1) Exercise Article 1(1) and Article 10 by actively attending County public participation barazas, budget consultative forums, and town halls to record your objections or approvals.
2) Quote Article 35 (Right of Access to Information) and the Access to Information Act 2016 to formally submit a written request for public records, audit reports, or project tender documents. Public offices have a legal duty to reply within 21 days.
3) Use Article 119 to submit a direct citizen petition to Parliament or your County Assembly asking them to investigate an issue affecting your community.
4) If a public official acts dishonestly, unconstitutionally, or abuses authority, cite Chapter 6 (Leadership and Integrity) to petition the Ethics and Anti-Corruption Commission (EACC) and the Commission on Administrative Justice (Ombudsman).`;

  const howToUseSw = `1) Tumia Kifungu cha 1(1) na Kifungu cha 10 kwa kuhudhuria mabaraza ya ushiriki wa umma ya kaunti na vikao vya bajeti ili kurekodi maoni au pingamizi zako rasmi.
2) Nukuu Kifungu cha 35 (Haki ya Kupata Taarifa) na Sheria ya Kupata Taarifa ya 2016 kuandika barua rasmi ya kudai ripoti za fedha, zabuni au miradi. Idara za umma zinalazimika kujibu ndani ya siku 21.
3) Tumia Kifungu cha 119 kuwasilisha ombi la wananchi (citizen petition) kwa Bunge la Kitaifa au Bunge la Kaunti ili wachunguze jambo linalowaathiri.
4) Afisa wa umma akikiuka sheria au kutumia mamlaka vibaya, nukuu Sura ya Sita (Uongozi na Uadilifu) kuwasilisha malalamishi kwa Tume ya EACC na Ombudsman.`;

  return {
    answeredBy: "Operator",
    adminTitle: {
      en: "Operator • AI Constitutional Assistant",
      sw: "Opereta • Msaidizi wa Kikatiba wa AI",
    },
    answerText: {
      en: `Under Article 1 and Article 10 of the Constitution of Kenya 2010, all sovereign power belongs to the people of Kenya. National values including public participation, transparency, social justice, and integrity must guide all state decisions. Under Article 35, you have an unassailable right to access any public document or budget held by any county or national department.

📌 How to use these articles in your situation:
${howToUseEn}`,
      sw: `Chini ya Kifungu cha 1 na Kifungu cha 10 cha Katiba ya Kenya 2010, mamlaka yote ya kiserikali ni ya wananchi wa Kenya. Maadili ya kitaifa kama vile ushiriki wa umma, uwazi, usawa na uadilifu lazima izingatiwe na ofisi zote za umma. Chini ya Kifungu cha 35, una haki ya kupata taarifa yoyote na ripoti za bajeti serikalini.

📌 Jinsi ya kutumia vifungu hivi katika hali yako:
${howToUseSw}`,
    },
    constitutionalArticle: "Article 1, Article 10 & Article 35",
    howToUseArticles: {
      en: howToUseEn,
      sw: howToUseSw,
    },
    recommendedOfficeId: "ombudsman",
    isAiGenerated: true,
    answeredAt: new Date().toISOString(),
  };
}

export async function generateConstitutionalAiAnswer(
  input: ConstitutionalQuestionInput
): Promise<OperatorAnswerOutput> {
  return generateFallbackConstitutionalAnswer(input);
}
