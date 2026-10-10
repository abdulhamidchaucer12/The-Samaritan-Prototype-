import { CivicLesson, QuizQuestion } from '../types';
import { lessonsData } from '../data/lessonsData';
import { getCourseQuizQuestions } from '../data/courseQuizzes';

const DAILY_COURSES_STORAGE_KEY = 'the_samaritan_daily_courses_v3';
const DAILY_COURSES_STATE_KEY = 'the_samaritan_daily_state_v3';

/**
 * Curated repository of specialized Kenyan Civic Courses for automatic daily release.
 * Rotates and expands deterministically based on date.
 */
interface CourseBlueprint {
  titleEn: string;
  titleSw: string;
  summaryEn: string;
  summarySw: string;
  category: 'constitution' | 'government' | 'elections' | 'integrity' | 'participation' | 'devolution' | 'human_rights';
  readTimeMinutes: number;
  sections: {
    titleEn: string;
    titleSw: string;
    contentEn: string;
    contentSw: string;
    article?: string;
    constitutionalArticle?: string;
    bulletsEn: string[];
    bulletsSw: string[];
  }[];
  keyTerms: {
    en: string;
    sw: string;
    defEn: string;
    defSw: string;
  }[];
  actionTipEn: string;
  actionTipSw: string;
}

const DAILY_COURSE_TEMPLATES: CourseBlueprint[] = [
  // 1. County Budget Cycle
  {
    titleEn: 'County Budget Cycle & Ward Public Participation',
    titleSw: 'Mzunguko wa Bajeti ya Kaunti na Ushiriki wa Umma',
    summaryEn: 'Master the 4 stages of the County Budget under the Public Finance Management Act (PFMA 2012) and how to submit project proposals at the ADP and CFSP stages across all 47 counties in The Republic of Kenya.',
    summarySw: 'Jifunze hatua 4 za Bajeti ya Kaunti chini ya Sheria ya PFMA 2012 na jinsi ya kuwasilisha maombi ya miradi ya maendeleo katika wodi yako popote nchini Kenya.',
    category: 'devolution',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'The 4 Stages of the County Budget Process',
        titleSw: 'Hatua Nne za Mchakato wa Bajeti ya Kaunti',
        contentEn: 'Every financial year starts on July 1 and ends on June 30. The budget moves through Formulation (by County Executive), Approval (by County Assembly), Implementation (by departments), and Audit/Oversight (by Auditor General and Assembly).',
        contentSw: 'Kila mwaka wa fedha huanza Julai 1 na kuisha Juni 30. Bajeti hupitia hatua nne: Maandalizi (Serikali Kuu ya Kaunti), Uidhinishaji (Bunge la Kaunti), Utekelezaji (Idara za Kaunti), na Ukaguzi (Mkaguzi Mkuu na Bunge).',
        article: 'Article 201 & PFMA Section 125',
        bulletsEn: [
          'August 30: County Annual Development Plan (ADP) submitted for citizen input.',
          'February 28: County Fiscal Strategy Paper (CFSP) setting ceilings for each sector.',
          'April 30: Detailed County Budget Estimates submitted to County Assembly.',
          'June 30: County Appropriation Act enacted by MCAs.',
        ],
        bulletsSw: [
          'Agosti 30: Mpango wa Maendeleo wa Kila Mwaka (ADP) huwasilishwa kwa wananchi.',
          'Februari 28: Waraka wa Mikakati ya Fedha (CFSP) unaoweka viwango vya mgao.',
          'Aprili 30: Makadirio kamili ya Bajeti hupelekwa Bungeni kwa Diwani.',
          'Juni 30: Sheria ya Ugawaji wa Fedha ya Kaunti kupitishwa rasmi.',
        ],
      },
      {
        titleEn: 'How to Submit a Project Proposal to the Ward Administrator',
        titleSw: 'Jinsi ya Kuwasilisha Ombi la Mradi kwa Msimamizi wa Wadi',
        contentEn: 'Citizens must not wait until June to ask for boreholes or maternity wings. Project proposals must be entered during the ADP barazas held between August and October in each ward.',
        contentSw: 'Wananchi hawapaswi kusubiri hadi Juni kuomba visima au zahanati. Maombi yote lazima yawasilishwe kwenye baraza za ADP kati ya Agosti na Oktoba katika kila wodi.',
        article: 'County Governments Act Sec. 87 & 115',
        bulletsEn: [
          'Organize village meetings to prioritize 1-2 urgent projects with broad community agreement.',
          'Write a formal memorandum detailing exact GPS/village location and estimated beneficiaries.',
          'Request stamped acknowledgment copy from the Ward Administrator and keep for assembly follow-up.',
        ],
        bulletsSw: [
          'Andaa kikao cha kijiji na kuweka kipaumbele cha miradi 1 au 2 ya dharura.',
          'Andika barua rasmi ikitaja kijiji na idadi ya wananchi watakaonufaika.',
          'Pata nakala iliyogongwa muhuri na Msimamizi wa Wadi kwa ufuatiliaji.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'ADP (Annual Development Plan)',
        sw: 'ADP (Mpango wa Kila Mwaka wa Maendeleo)',
        defEn: 'The 1-year operational plan extracted from the 5-year CIDP listing specific ward projects to be funded.',
        defSw: 'Mpango wa mwaka mmoja unaoorodhesha miradi maalum ya wodi itakayogharimiwa kwenye bajeti.',
      },
      {
        en: 'CFSP (County Fiscal Strategy Paper)',
        sw: 'CFSP (Waraka wa Mikakati ya Fedha)',
        defEn: 'The policy document allocating financial ceilings across health, water, agriculture, and infrastructure.',
        defSw: 'Waraka unaoweka viwango vya juu vya bajeti kwa kila sekta (afya, maji, kilimo n.k.).',
      },
    ],
    actionTipEn: 'Ask your Ward Administrator for the public notice dates of the next Ward Budget Baraza. Attend with 5 neighbors and submit a written memorandum.',
    actionTipSw: 'Uliza Msimamizi wa Wadi yako tarehe za Baraza la Bajeti linalokuja. Hudhuria na majirani 5 na ukabidhi maoni kwa maandishi.',
  },

  // 2. Community Land Act
  {
    titleEn: 'Community Land Act & Ancestral Land Rights in Kenya',
    titleSw: 'Sheria ya Ardhi ya Jamii na Haki za Umiliki Nchini Kenya',
    summaryEn: 'Understand how the Community Land Act 2016 protects ancestral holdings, stops unlawful grabbing, and empowers community assemblies across Kenya\'s counties.',
    summarySw: 'Fahamu jinsi Sheria ya Ardhi ya Jamii ya 2016 inavyolinda ardhi za mababu, kuzuia unyakuzi, na kuwapa wananchi mamlaka ya maamuzi katika kaunti zote 47.',
    category: 'human_rights',
    readTimeMinutes: 11,
    sections: [
      {
        titleEn: 'What is Community Land under Article 63?',
        titleSw: 'Ardhi ya Jamii ni Nini Chini ya Kifungu cha 63?',
        contentEn: 'Article 63 provides that community land vests in and is held by communities identified on the basis of ethnicity, culture, or similar community of interest. It includes communal grazing areas, sacred groves (Kaya forests), shrines, and ancestral settlements.',
        contentSw: 'Kifungu cha 63 kinaeleza kuwa ardhi ya jamii inamilikiwa na jamii husika kulingana na utamaduni au maslahi ya pamoja. Inajumuisha malisho, misitu ya Kaya, maeneo ya ibada na makazi ya asili.',
        article: 'Article 63 & Community Land Act 2016',
        bulletsEn: [
          'County Governments only hold unregistered community land in trust for the community; they do NOT own it.',
          'County governments cannot sell, lease, or convert community land without approval of the Community Assembly.',
          'Community land can be registered under a Community Land Management Committee (CLMC) elected by residents.',
        ],
        bulletsSw: [
          'Serikali ya Kaunti inashikilia ardhi ya jamii kama mdhamini tu; HAIMILIKI ardhi hiyo.',
          'Kaunti haiwezi kuuza, kukodisha, au kutoa ardhi ya jamii bila idhini ya Mkutano Mkuu wa Jamii.',
          'Ardhi ya jamii inaweza kusajiliwa chini ya Kamati ya Usimamizi iliyochaguliwa na wanakijiji.',
        ],
      },
      {
        titleEn: 'Steps to Register Community Land in Your Village',
        titleSw: 'Hatua za Kusajili Ardhi ya Jamii Kijijini Mwako',
        contentEn: 'To secure community land against land grabbing, communities across Kenya\'s 47 counties can form a registered Community Land Management Committee.',
        contentSw: 'Kuzuia unyakuzi wa ardhi, wanajamii kote nchini wanaweza kufuata utaratibu wa kisheria kusajili ardhi yao rasmi.',
        article: 'Section 7, Community Land Act 2016',
        bulletsEn: [
          'Convene a general meeting of all resident community members (including youth, women, and elders).',
          'Adopt a community constitution and elect a Community Land Management Committee (7 to 15 members).',
          'Submit the application and minutes to the Community Land Registrar at the Ministry of Lands.',
          'Receive the Certificate of Community Land Ownership, granting permanent indefeasible title.',
        ],
        bulletsSw: [
          'Ita mkutano mkuu wa jamii yote (ukijumuisha vijana, wanawake na wazee).',
          'Pitisha katiba ya jamii na chagua Kamati ya Usimamizi ya wanachama 7 hadi 15.',
          'Wasilisha fomu na kumbukumbu za mkutano kwa Msajili wa Ardhi ya Jamii.',
          'Pata Cheti Rasmi cha Umiliki wa Ardhi ya Jamii kinachotoa hati miliki ya kudumu.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Kaya Forests',
        sw: 'Misitu ya Kaya',
        defEn: 'Sacred ancestral coastal forests protected under the National Museums and Heritage Act and Community Land Act.',
        defSw: 'Misitu ya asili ya kiutamaduni ya Pwani inayolindwa kisheria kama urithi wa kitaifa na ardhi ya jamii.',
      },
      {
        en: 'Indefeasible Title',
        sw: 'Hati Miliki Isiyoweza Kufutwa',
        defEn: 'A government-issued title deed that provides legally undeniable proof of collective ownership.',
        defSw: 'Hati miliki rasmi ya serikali inayotoa ushahidi kamili wa kisheria usiopingika wa umiliki wa ardhi.',
      },
    ],
    actionTipEn: 'Check if your village communal land is mapped on your County Land Information Management System. Report any unauthorized fencing to the NLC and County Land CECM.',
    actionTipSw: 'Hakikisha eneo lenu la jamii limeorodheshwa kwenye rekodi za ardhi za kaunti. Toa taarifa mara moja kuhusu ua wowote usio halali.',
  },

  // 3. Suspect Rights & Police Accountability
  {
    titleEn: 'Article 49 & Suspect Rights: Bail, Bond, and Legal Aid',
    titleSw: 'Kifungu cha 49 na Haki za Mshukiwa: Dhamana na Msaada wa Kisheria',
    summaryEn: 'Know your exact constitutional rights when questioned, searched, or detained at a police station under Article 49 of the Constitution.',
    summarySw: 'Fahamu haki zako halisi za kikatiba unapoulizwa, unaposimamishwa au unapozuiliwa katika kituo cha polisi chini ya Kifungu cha 49.',
    category: 'human_rights',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'The 24-Hour Constitutional Clock',
        titleSw: 'Muda wa Saa 24 wa Kikatiba Mahakamani',
        contentEn: 'Article 49(1)(f) strictly commands that an arrested person must be brought before an open court of law within 24 hours of arrest. If the 24 hours expire on a weekend or public holiday, before the end of the next court day.',
        contentSw: 'Kifungu cha 49(1)(f) kinaamuru bila mjadala kuwa mshukiwa lazima afikishwe mahakamani ndani ya saa 24 tangu kukamatwa kwake. Ikiwa saa 24 zitaishia wikendi, lazima afikishwe siku ya kwanza ya kazi.',
        article: 'Article 49(1)(f)',
        bulletsEn: [
          'Police holding a suspect beyond 24 hours without court authorization is unlawful imprisonment.',
          'Suspects have the constitutional right to remain silent and not be compelled to confess.',
          'Right to communicate immediately with an advocate and family members to notify them of location.',
        ],
        bulletsSw: [
          'Polisi kuzuia mshukiwa zaidi ya saa 24 bila amri ya hakimu ni uvunjaji mkubwa wa sheria.',
          'Mshukiwa ana haki ya kukaa kimya na asilazimishwe kukiri kosa lolote.',
          'Haki ya kuwasiliana na wakili na wanafamilia mara moja kujulisha waliko.',
        ],
      },
      {
        titleEn: 'Police Bond vs. Court Bail',
        titleSw: 'Tofauti ya Dhamana ya Kituoni (Police Bond) na Dhamana ya Mahakama (Bail)',
        contentEn: 'Police cash bail at the station is an administrative guarantee to return when called. Under Criminal Procedure Code Section 23, station commanders are required to grant police bail for all bailable offenses.',
        contentSw: 'Dhamana ya polisi kituoni (Police Bond) ni dhamana ya kumwachilia mshukiwa kwa sharti la kurudi kituoni au kufika mahakamani. Polisi hawapaswi kuitumia kama njia ya kudai hongo.',
        article: 'Article 49(1)(h) & Bail Policy Guidelines',
        bulletsEn: [
          'Always demand an official Kenya Police official cash bail receipt (GP 53).',
          'Never pay unreceipted cash directly into personal mobile phones of arresting officers.',
          'If bail is arbitrarily denied, record officer badge numbers and report immediately to IPOA on toll-free 1559.',
        ],
        bulletsSw: [
          'Dai risiti rasmi ya Polisi ya Kenya (GP 53) unapotoa pesa ya dhamana.',
          'Usitume kamwe pesa kwenye namba ya simu ya afisa bila risiti ya serikali.',
          'Dhamana ikikataliwa bila sababu, chukua namba ya afisa na upigie IPOA namba ya bure 1559.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Habeas Corpus',
        sw: 'Habeas Corpus (Amri ya Kutoa Mfungwa)',
        defEn: 'A high court order compelling the police or state to produce a detained person in court immediately.',
        defSw: 'Amri ya Mahakama Kuu inayowalazimu polisi kumfikisha mahakamani mtu anayeshikiliwa kinyume cha sheria.',
      },
      {
        en: 'National Legal Aid Service (NLAS)',
        sw: 'Huduma ya Kitaifa ya Msaada wa Kisheria (NLAS)',
        defEn: 'A government agency providing free advocates and legal representation to indigent and vulnerable citizens.',
        defSw: 'Shirika la serikali linalotoa mawakili wa bure kwa wananchi wasio na uwezo wa kifedha.',
      },
    ],
    actionTipEn: 'Memorize the IPOA hotline: 1559 (Toll-Free). If you or a relative is detained unlawfully, alert a paralegal or petition the nearest High Court station in your county.',
    actionTipSw: 'Hifadhi namba ya dharura ya IPOA: 1559 (Bure). Mtu akizuiliwa kinyume cha sheria, wasiliana na afisa wa sheria mara moja.',
  },

  // 4. Access to Information Act
  {
    titleEn: 'Access to Information Act 2016: How to Request Government Records',
    titleSw: 'Sheria ya Kupata Taarifa 2016: Jinsi ya Kudai Nyaraka za Serikali',
    summaryEn: 'Learn how to enforce Article 35 by drafting legal Access to Information requests to county departments, ministries, and contractors.',
    summarySw: 'Jifunze jinsi ya kutumia Kifungu cha 35 kuandika barua rasmi ya kisheria ya kuomba nyaraka za bajeti, mikataba na miradi ya kaunti.',
    category: 'participation',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'The Legal Obligation to Disclose Public Records',
        titleSw: 'Wajibu wa Kisheria wa Kutoa Taarifa za Umma',
        contentEn: 'Under Section 4 and Section 9 of the Access to Information Act 2016, public officers are legally compelled to respond to citizen information requests within 21 days (or 48 hours if it concerns human life or liberty).',
        contentSw: 'Chini ya Kifungu cha 4 na cha 9 cha Sheria ya Kupata Taarifa ya 2016, maafisa wa serikali wanalazimika kisheria kujibu ombi la taarifa ndani ya siku 21 (au saa 48 ikiwa inahusu uhai au uhuru).',
        article: 'Article 35 & Access to Information Act Sec. 9',
        bulletsEn: [
          'Requests do not require explaining your personal reason; public records belong to you by right.',
          'Information can be requested in English or Kiswahili, in writing or electronically.',
          'Public agencies must designate an Information Access Officer to receive and process requests.',
        ],
        bulletsSw: [
          'Hauhitaji kutoa sababu binafsi; nyaraka za serikali ni mali ya umma kikatiba.',
          'Ombi linaweza kuwa kwa Kiingereza au Kiswahili, kwa barua au barua pepe.',
          'Kila taasisi ya umma inatakiwa kuwa na Afisa Maalum wa Taarifa (Information Access Officer).',
        ],
      },
      {
        titleEn: 'What to Do if a Public Office Refuses or Delays',
        titleSw: 'Hatua za Kuchukua Ofisi Ikikataa au Kuchelewesha Majibu',
        contentEn: 'If an agency fails to reply within 21 days or improperly claims confidentiality, citizens have an immediate right of appeal to the Commission on Administrative Justice (Ombudsman).',
        contentSw: 'Ikiwa taasisi itashindwa kujibu ndani ya siku 21 au ikidai taarifa ni siri, una haki ya kukata rufaa mara moja kwa Tume ya Ombudsman (CAJ).',
        article: 'Section 14 & 28, Access to Information Act',
        bulletsEn: [
          'Keep your stamped receiving copy or email delivery receipt as evidence.',
          'Lodge a free complaint with the Ombudsman (complaints@ombudsman.go.ke or SMS 15700).',
          'The Ombudsman has the statutory authority to order disclosure and fine non-compliant officers up to KES 500,000.',
        ],
        bulletsSw: [
          'Hifadhi nakala yenye muhuri au uthibitisho wa barua pepe kama ushahidi.',
          'Wasilisha malalamiko ya bure kwa Ombudsman kupitia complaints@ombudsman.go.ke au SMS 15700.',
          'Ombudsman ana nguvu kisheria kuamuru taarifa zitolewe na kumpiga faini afisa mkaidi hadi KES 500,000.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Proactive Disclosure',
        sw: 'Kutoa Taarifa Kabla ya Kuombwa',
        defEn: 'The legal duty of government bodies to publish budgets, tenders, and contracts online and in public notice boards without waiting for requests.',
        defSw: 'Wajibu wa kisheria wa serikali kuweka wazi bajeti na mikataba mtandaoni na mbao za matangazo bila kusubiri ombi.',
      },
      {
        en: 'CAJ (Commission on Administrative Justice)',
        sw: 'CAJ (Tume ya Utawala wa Haki / Ombudsman)',
        defEn: 'The constitutional oversight commission mandated to enforce the Access to Information Act.',
        defSw: 'Tume ya kikatiba yenye jukumu la kusimamia na kutekeleza Sheria ya Kupata Taarifa nchini.',
      },
    ],
    actionTipEn: 'Use The Samaritan Citizen Action Hub to generate a legally formatted Section 8 Access to Information letter for any stalled project in your ward.',
    actionTipSw: 'Tumia Kituo cha Hatua za Mwananchi kwenye mfumo huu kuunda barua rasmi ya kudai taarifa za mradi wowote uliokwama.',
  },

  // 5. AGPO Procurement
  {
    titleEn: 'Public Procurement & 30% AGPO Opportunities for Youth & Women',
    titleSw: 'Manunuzi ya Umma na Fursa za Asilimia 30 za AGPO kwa Vijana na Wanawake',
    summaryEn: 'Understand the legal requirement reserving 30% of all public procurement tenders in all 47 County Governments and national state organs for Youth, Women, and PWDs.',
    summarySw: 'Fahamu haki ya kisheria inayotenga asilimia 30 ya zabuni zote za serikali za kaunti na serikali kuu kwa vijana, wanawake na watu wenye ulemavu kote nchini Kenya.',
    category: 'devolution',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'The 30% AGPO Legal Mandate',
        titleSw: 'Agizo la Kisheria la Asilimia 30 ya AGPO',
        contentEn: 'Under Article 227 of the Constitution and Section 157 of the Public Procurement and Asset Disposal Act (PPADA 2015), every government entity must allocate at least 30% of its annual procurement budget to youth, women, and persons with disabilities.',
        contentSw: 'Chini ya Kifungu cha 227 cha Katiba na Kifungu cha 157 cha Sheria ya PPADA 2015, kila taasisi ya serikali lazima itenge angalau 30% ya bajeti yake ya ununuzi kwa vijana, wanawake na walemavu.',
        article: 'Article 227 & PPADA Section 157',
        bulletsEn: [
          'Applies to county government departments, municipal boards, and national ministries.',
          'Requires only an AGPO certificate, KRA PIN, and registered business name.',
          'Exempts target groups from heavy tender security bond fees typically demanded from large corporations.',
        ],
        bulletsSw: [
          'Inahusu idara zote za kaunti zote 47, bodi za miji na wizara za kitaifa.',
          'Inahitaji tu cheti cha AGPO, KRA PIN, na jina la biashara lililosajiliwa.',
          'Inawaondolea vijana ada kubwa za dhamana ya zabuni (tender security bonds).',
        ],
      },
      {
        titleEn: 'Monitoring Procurement Integrity in Your Ward',
        titleSw: 'Kufuatilia Uadilifu wa Zabuni Katika Wodi Yako',
        contentEn: 'Citizens have the right to monitor the Public Procurement Information Portal (PPIP) to verify if county contracts were awarded fairly and openly.',
        contentSw: 'Wananchi wana haki ya kuingia kwenye tovuti ya PPIP kuona nani alipewa zabuni, kwa kiasi gani na kama ilitangazwa kwa uwazi.',
        article: 'PPADA Section 67 & PPIP Regulations',
        bulletsEn: [
          'All tenders and awarded contracts must be published on www.tenders.go.ke with exact tender sums.',
          'Secret awards without competition violate Article 227(1) values of fairness and transparency.',
          'Suspected bid rigging or bribery must be reported to the Public Procurement Regulatory Authority (PPRA) and EACC.',
        ],
        bulletsSw: [
          'Zabuni zote na mikataba iliyotolewa lazima iwekwe hadharani kwenye tovuti ya tenders.go.ke.',
          'Kutoa zabuni kwa siri bila ushindani ni kukiuka Kifungu cha 227 cha Katiba.',
          'Wizi au hongo kwenye zabuni huripotiwa kwa Mamlaka ya PPRA na EACC.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'AGPO',
        sw: 'AGPO (Access to Government Procurement Opportunities)',
        defEn: 'Affirmative action initiative enabling enterprise development for youth, women, and PWDs.',
        defSw: 'Mpango maalum wa serikali wa kuwezesha vijana, wanawake na walemavu kupata zabuni za serikali.',
      },
      {
        en: 'PPRA',
        sw: 'PPRA (Mamlaka ya Kudhibiti Manunuzi ya Umma)',
        defEn: 'The regulatory authority enforcing fair competition and transparency in public purchasing.',
        defSw: 'Mamlaka inayohakikisha ununuzi wa umma unafuata sheria na haki bila upendeleo.',
      },
    ],
    actionTipEn: 'Visit your County Government website procurement section or the National Treasury AGPO portal (agpo.go.ke) to register your youth or women group.',
    actionTipSw: 'Tembelea tovuti ya agpo.go.ke kusajili kikundi chako cha vijana au wanawake kupata cheti cha zabuni bila malipo.',
  },

  // 6. Recalling Leaders & Petitions
  {
    titleEn: 'County Assembly Petitions & The Right of Recall',
    titleSw: 'Maombi Katika Bunge la Kaunti na Haki ya Kuwawajibisha Viongozi',
    summaryEn: 'Discover the constitutional mechanics of submitting formal petitions to any County Assembly in The Republic of Kenya and the statutory procedures for recalling non-performing legislators.',
    summarySw: 'Fahamu taratibu za kikatiba za kuwasilisha maombi kwenye Bunge la Kaunti yoyote nchini Kenya na sheria za kuwawajibisha au kuwafuta kazi wawakilishi wasiotekeleza wajibu.',
    category: 'government',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'How to Submit a Petition to the County Assembly',
        titleSw: 'Jinsi ya Kuwasilisha Ombi kwa Bunge la Kaunti',
        contentEn: 'Under Article 119 and Section 88 of the County Governments Act, every citizen or group across The Republic of Kenya has the direct right to petition the Speaker of their County Assembly to investigate grievances, summon county officials, or amend by-laws.',
        contentSw: 'Chini ya Kifungu cha 119 na Kifungu cha 88 cha Sheria ya Serikali za Kaunti, kila mwananchi ana haki ya kuwasilisha ombi rasmi kwa Spika wa Bunge la Kaunti ili kuchunguza kero au kuwaita mawaziri.',
        article: 'Article 119 & County Governments Act Sec. 88',
        bulletsEn: [
          'Address the petition directly to the Clerk or Speaker of your County Assembly.',
          'Clearly state the facts, previous failed attempts to resolve with the executive, and the specific prayer (action requested).',
          'The petition is read on the Assembly floor and committed to the relevant Sectoral Committee within 14 days.',
        ],
        bulletsSw: [
          'Elekeza barua ya ombi moja kwa moja kwa Karani au Spika wa Bunge la Kaunti yako.',
          'Eleza kwa uwazi matatizo yaliyopo, majaribio ya awali, na hatua maalum unazoliomba bunge kuchukua.',
          'Ombi husomwa bungeni na kupelekwa kwa kamati husika ya kisekta ndani ya siku 14.',
        ],
      },
      {
        titleEn: 'The Right of Recall under Article 104',
        titleSw: 'Haki ya Kumwondoa Mbunge au Diwani Chini ya Kifungu cha 104',
        contentEn: 'Article 104 guarantees that the electorate has the right to recall their Member of Parliament or Member of County Assembly before the end of their 5-year term if they violate Chapter 6 or fail duties.',
        contentSw: 'Kifungu cha 104 kinatoa haki ya kikatiba kwa wananchi kumwondoa (recall) Mbunge au Diwani wao kabla ya kumalizika kwa muhula wake wa miaka 5 akikiuka Katiba.',
        article: 'Article 104 & Elections Act Sections 45-48',
        bulletsEn: [
          'Requires grounds such as gross violation of Chapter 6 (Integrity) or persistent absenteeism.',
          'Initiated through a petition signed by registered voters representing at least 30% of the ward or constituency.',
          'IEBC organizes a formal recall vote where citizens vote on whether the leader should vacate office.',
        ],
        bulletsSw: [
          'Inahitaji sababu kama kukiuka maadili ya Sura ya 6 au kukosa kuhudhuria vikao vya bunge.',
          'Huanzishwa kwa saini za angalau asilimia 30 ya wapiga kura waliosajiliwa kwenye wodi au eneo bunge.',
          'Tume ya IEBC huandaa kura ya maoni ili wananchi waamue iwapo kiongozi huyo aondoke ofisini.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Prayer in a Petition',
        sw: 'Ombi Maalum (Prayer)',
        defEn: 'The specific conclusion of a petition detailing the exact legal remedy or action citizens are requesting from parliament.',
        defSw: 'Mwisho wa ombi ambapo wananchi wanaeleza haswa hatua wanazotaka bunge liamuru zitekelezwe.',
      },
      {
        en: 'Recall Clause',
        sw: 'Kipengele cha Kumfuta Kiongozi Kazi (Recall)',
        defEn: 'Constitutional safeguard preventing elected representatives from ignoring their constituents for 5 full years.',
        defSw: 'Kizuizi cha kikatiba kinachomzuia kiongozi aliyechaguliwa kupuuza wananchi wake kwa miaka 5 bila kuwajibika.',
      },
    ],
    actionTipEn: 'Review your County Assembly Standing Orders online or at your Assembly library to understand committee petition hearing procedures.',
    actionTipSw: 'Fika katika Maktaba ya Bunge la Kaunti yako au tovuti yao kujua jinsi kamati za bunge zinavyosikiliza maoni ya wananchi.',
  },

  // 7. County Climate Change Regulations & Ward Resilience
  {
    titleEn: 'County Climate Change Regulations & Ward Adaptation Funds',
    titleSw: 'Kanuni za Mabadiliko ya Hali ya Hewa na Hazina za Wadi',
    summaryEn: 'Learn how County Climate Change Regulations allocate at least 2% of the development budget to ward-level climate resilience, water security, and drought mitigation across Kenya.',
    summarySw: 'Fahamu jinsi kanuni za hali ya hewa za serikali za kaunti zinavyotenga asilimia 2 ya bajeti kwa miradi ya maji, ukame na mazingira vijijini kote nchini Kenya.',
    category: 'devolution',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'The 2% Ward Climate Change Fund Mandate',
        titleSw: 'Mgao wa Asilimia 2 wa Hazina ya Hali ya Hewa ya Wadi',
        contentEn: 'County Governments across Kenya enact Climate Change Acts establishing dedicated ward climate adaptation committees (WCCC). At least 2% of the county development budget is ring-fenced specifically for citizen-prioritized resilience projects.',
        contentSw: 'Serikali za Kaunti kote nchini Kenya zinapitisha Sheria za Mabadiliko ya Hali ya Hewa zinazounda kamati za wodi (WCCC). Angalau asilimia 2 ya bajeti ya maendeleo inatengwa kwa miradi inayopendekezwa na wananchi.',
        constitutionalArticle: 'Article 42 & Article 69',
        bulletsEn: [
          'Ward Climate Change Committees (WCCC) are elected directly by community members at village barazas.',
          'Funds support water pans, borehole solarization, mangrove restoration, and drought-resistant seeds.',
          'Citizens review and audit climate expenditure quarterly in ward forums.',
        ],
        bulletsSw: [
          'Kamati za WCCC huchaguliwa moja kwa moja na wanakijiji kwenye mikutano ya wazi.',
          'Fedha hizo hugharimia mabwawa ya maji, sola za visima, upandaji mikoko na mbegu za ukame.',
          'Wananchi hukagua matumizi ya fedha za hali ya hewa kila robo mwaka.',
        ],
      },
      {
        titleEn: 'How to Join or Petition Your Ward Climate Committee',
        titleSw: 'Jinsi ya Kujiunga au Kuwasilisha Ombi kwa Kamati ya Wadi',
        contentEn: 'Community groups, farmers, fisherfolk, and women groups have statutory representation on WCCCs. Notice of elections is issued by the Sub-County Climate Director.',
        contentSw: 'Vikundi vya kijamii, wakulima, wavuvi na wanawake wana uwakilishi wa kisheria katika kamati za WCCC. Taarifa ya uchaguzi hutolewa na Mkurugenzi wa Mazingira.',
        article: 'Climate Change Act 2016 Section 19',
        bulletsEn: [
          'Submit community vulnerability assessments before the annual budget cycle in August.',
          'Attend public climate prioritization barazas and vote on urgent village water investments.',
          'Track implementation via the County Climate Directorate project portal.',
        ],
        bulletsSw: [
          'Wasilisha ripoti ya changamoto za mazingira kijijini kabla ya mwezi Agosti.',
          'Hudhuria mikutano ya wazi kupiga kura kuhusu miradi ya dharura ya maji.',
          'Fuatilia utekelezaji kupitia ofisi ya mazingira ya kaunti.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'WCCC (Ward Climate Change Committee)',
        sw: 'Kamati ya Hali ya Hewa ya Wadi',
        defEn: 'Elected grassroots community committee managing local climate resilience investments.',
        defSw: 'Kamati ya mashinani iliyochaguliwa na wananchi kusimamia miradi ya kuhimili mabadiliko ya hali ya hewa.',
      },
      {
        en: 'Climate Resilience',
        sw: 'Ustahimilivu wa Hali ya Hewa',
        defEn: 'The capacity of a community to withstand droughts, flash floods, and agricultural shocks.',
        defSw: 'Uwezo wa jamii kukabiliana na ukame, mafuriko au changamoto za kilimo bila kuangamia.',
      },
    ],
    actionTipEn: 'Visit your Ward Administrator’s office to ask for the roster and meeting calendar of your Ward Climate Change Committee.',
    actionTipSw: 'Fika katika ofisi ya Msimamizi wa Wadi kuomba orodha ya wajumbe na kalenda ya mikutano ya kamati ya hali ya hewa ya wadi yako.',
  },

  // 8. Whistleblower Protection & Anti-Corruption Reporting
  {
    titleEn: 'Whistleblower Protection & Reporting Corruption to EACC',
    titleSw: 'Ulinzi wa Wafichuzi na Kuripoti Ufisadi kwa EACC',
    summaryEn: 'Understand legal protections under the Witness Protection Act and Anti-Corruption and Economic Crimes Act (ACECA) when exposing fund embezzlement.',
    summarySw: 'Elewa ulinzi wa kisheria chini ya Sheria ya Ulinzi wa Mashahidi na Sheria ya Ufisadi wakati unapofichua wizi wa fedha za umma.',
    category: 'integrity',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'Your Legal Rights as a Whistleblower in Kenya',
        titleSw: 'Haki Zako za Kisheria kama Mfichuzi nchini Kenya',
        contentEn: 'Article 10 and Chapter Six obligate citizens to protect public resources. Under Section 65 of ACECA and the Witness Protection Act, whistleblowers cannot be victimized, fired, or prosecuted for disclosing corrupt practices in good faith.',
        contentSw: 'Kifungu cha 10 na Sura ya Sita vinampa mwananchi wajibu wa kulinda mali ya umma. Chini ya Sheria ya ACECA na Ulinzi wa Mashahidi, mfichuzi hawezi kufutwa kazi wala kushtakiwa kwa kuripoti ufisadi kwa nia njema.',
        constitutionalArticle: 'Chapter Six & ACECA Section 65',
        bulletsEn: [
          'Anonymous reports are legally admissible and must be investigated by EACC and DCI.',
          'Witness Protection Agency (WPA) provides identity shielding and relocation in high-risk cases.',
          'Retaliation by employers or public officers carries heavy criminal penalties.',
        ],
        bulletsSw: [
          'Taarifa zisizo na majina zinatambuliwa kisheria na lazima zichunguzwe na EACC.',
          'Wakala wa Ulinzi wa Mashahidi (WPA) hutoa ulinzi wa siri na makazi salama.',
          'Kisasi dhidi ya mfichuzi ni kosa la jinai linaloadhibiwa vikali.',
        ],
      },
      {
        titleEn: 'How to Compile Admissible Evidence',
        titleSw: 'Jinsi ya Kukusanya Ushahidi Unaoaminika Kisheria',
        contentEn: 'Effective reports contain verifiable facts rather than rumors: payment vouchers, tender notices, contractor names, photos of incomplete works, and delivery receipt anomalies.',
        contentSw: 'Ripoti yenye mafanikio inajumuisha ushahidi halisi: vocha za malipo, matangazo ya zabuni, majina ya wakandarasi na picha za miradi hewa au duni.',
        article: 'Article 35 & EACC Act Section 11',
        bulletsEn: [
          'Document dates, project names, and tender registration numbers from site signboards.',
          'Submit via the secure EACC online portal, toll-free hotline 1533, or Huduma Centre EACC desk.',
          'Keep your secret reference tracking number safe for investigation updates.',
        ],
        bulletsSw: [
          'Rekodi tarehe, jina la mradi na nambari ya zabuni kutoka kwenye kibao cha ujenzi.',
          'Wasilisha kupitia wavuti ya EACC, nambari ya bure 1533 au dawati la EACC Huduma Centre.',
          'Hifadhi nambari ya siri ya ufuatiliaji ili kujua maendeleo ya uchunguzi.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'ACECA (Anti-Corruption & Economic Crimes Act)',
        sw: 'Sheria ya Kupambana na Ufisadi na Uhalifu wa Kiuchumi',
        defEn: 'The primary statute empowering EACC to investigate bribery, abuse of office, and illicit enrichment.',
        defSw: 'Sheria kuu inayoipa EACC mamlaka ya kuchunguza rushwa, matumizi mabaya ya ofisi na utajiri haramu.',
      },
      {
        en: 'Public Interest Disclosure',
        sw: 'Ufichuzi kwa Maslahi ya Umma',
        defEn: 'Reporting malfeasance in a public institution to safeguard taxpayer funds.',
        defSw: 'Kutoa taarifa za ukiukaji wa sheria katika ofisi ya serikali kulinda fedha za walipakodi.',
      },
    ],
    actionTipEn: 'Save EACC hotline 1533 on your phone and report any demand for bribes at county licensing or land registries immediately.',
    actionTipSw: 'Hifadhi nambari ya simu ya EACC 1533 na uripoti mara moja afisa yeyote anayeomba hongo kwenye ardhi au leseni za biashara.',
  },

  // 9. County Health Services & Patient Rights
  {
    titleEn: 'County Health Services & Patient Rights under the Kenya Health Act',
    titleSw: 'Huduma za Afya za Kaunti na Haki za Mgonjwa Chini ya Sheria ya Afya',
    summaryEn: 'Master your constitutional rights to emergency medical treatment, essential medicines, medical records, and hospital oversight under Article 43.',
    summarySw: 'Fahamu haki zako za kikatiba za matibabu ya dharura, dawa muhimu, rekodi za matibabu na usimamizi wa hospitali chini ya Kifungu cha 43.',
    category: 'human_rights',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'The Constitutional Right to Health & Emergency Care',
        titleSw: 'Haki ya Kikatiba ya Afya na Matibabu ya Dharura',
        contentEn: 'Article 43(1)(a) provides that every person has the right to the highest attainable standard of health. Article 43(2) strictly states: A person shall not be denied emergency medical treatment by any health institution, public or private.',
        contentSw: 'Kifungu cha 43(1)(a) kinatamka kwamba kila mtu ana haki ya kiwango cha juu zaidi cha afya. Kifungu cha 43(2) kinasisitiza: Mtu yeyote hatanyimwa matibabu ya dharura na kituo chochote cha afya, cha umma au cha kibinafsi.',
        constitutionalArticle: 'Article 43(1)(a) & Article 43(2)',
        bulletsEn: [
          'Hospitals cannot detain patients or bodies over unpaid medical bills (High Court precedent).',
          'Emergency stabilization is mandatory before any financial deposit is requested.',
          'Patients have a right to full explanation of diagnosis, medicines, and potential complications.',
        ],
        bulletsSw: [
          'Hospitali haziruhusiwi kuzuia wagonjwa au miili ya marehemu kwa sababu ya madeni ya bili.',
          'Uokoaji wa dharura ni lazima ufanyike kabla ya kuomba malipo yoyote.',
          'Mgonjwa ana haki ya kuelezwa kwa lugha anayoelewa kuhusu ugonjwa wake na dawa anazopewa.',
        ],
      },
      {
        titleEn: 'Hospital Management Boards & Citizen Oversight',
        titleSw: 'Bodi za Usimamizi wa Hospitali na Uangalizi wa Wananchi',
        contentEn: 'Every Level 4 and Level 5 hospital across Kenya (e.g. County Referral and Sub-County Hospitals) must have a Hospital Management Board comprising citizen community representatives.',
        contentSw: 'Kila hospitali ya Level 4 na Level 5 kote nchini Kenya (kama vile Hospitali za Rufaa za Kaunti na Hospitali za Kaunti Ndogo) lazima iwe na Bodi ya Usimamizi inayojumuisha wawakilishi wa wananchi.',
        article: 'Kenya Health Act 2017 Section 31',
        bulletsEn: [
          'Citizens can lodge complaints against drug stockouts or negligence to the County Health Executive.',
          'Board meetings review facility revenues, drug supply chains, and staff discipline.',
          'Social audits can be conducted on facility improvement fund (FIF) allocations.',
        ],
        bulletsSw: [
          'Wananchi wanaweza kuwasilisha malalamiko ya uhaba wa dawa au uzembe kwa Waziri wa Afya wa Kaunti.',
          'Bodi hukutana kutathmini mapato ya hospitali, usambazaji wa dawa na nidhamu ya wafanyakazi.',
          'Ukaguzi wa kijamii unaweza kufanywa kuhusu matumizi ya hazina ya uboreshaji wa hospitali (FIF).',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Emergency Medical Treatment',
        sw: 'Matibabu ya Dharura',
        defEn: 'Immediate medical stabilization required to prevent loss of life or permanent disability.',
        defSw: 'Hatua za haraka za kitiba zinazohitajika kuokoa maisha au kuzuia ulemavu wa kudumu.',
      },
      {
        en: 'FIF (Facility Improvement Fund)',
        sw: 'Hazina ya Uboreshaji wa Vituo vya Afya',
        defEn: 'Revenue collected by health facilities that must be retained directly to buy medicines and maintain equipment.',
        defSw: 'Mapato ya hospitali yanayotakiwa kubaki hapo hapo ili kununua dawa na kukarabati mitambo.',
      },
    ],
    actionTipEn: 'If a health dispensary in your ward lacks essential drugs, ask the in-charge for the Facility Committee chairperson contact and file a formal inquiry.',
    actionTipSw: 'Kama zahanati ya eneo lako haina dawa muhimu, muulize muuguzi mkuu mawasiliano ya mwenyekiti wa kamati ya kituo na uwasilishe malalamiko rasmi.',
  },

  // 10. Urban Areas & Cities Act: Municipal Boards
  {
    titleEn: 'Urban Areas and Cities Act: Municipal Boards & Citizen Forums',
    titleSw: 'Sheria ya Miji na Majiji: Bodi za Manispaa na Mabaraza ya Wananchi',
    summaryEn: 'How residents, business operators, and neighborhood associations across municipalities and urban boards in Kenya can elect citizen representatives and influence urban plans.',
    summarySw: 'Jinsi wakazi, wafanyabiashara na vyama vya mitaa katika miji na manispaa kote nchini wanavyoweza kuchagua wawakilishi na kushiriki mipango ya manispaa.',
    category: 'devolution',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'Municipal Boards & Citizen Representation',
        titleSw: 'Bodi za Manispaa na Uwakilishi wa Wananchi',
        contentEn: 'Under the Urban Areas and Cities Act (amended 2019), municipalities across all counties in Kenya are governed by Municipal Boards. Four out of nine board members must be competitively nominated by registered citizen associations.',
        contentSw: 'Chini ya Sheria ya Miji na Majiji (iliyofanyiwa marekebisho 2019), manispaa na miji kote nchini husimamiwa na Bodi za Manispaa. Wajumbe wanne kati ya tisa lazima wateuliwe kutoka vyama vya wananchi.',
        constitutionalArticle: 'Fourth Schedule Part 2 & UACA Section 13',
        bulletsEn: [
          'Professional associations, business chambers, youth networks, and neighbourhood groups nominate board members.',
          'Municipal Boards manage street lighting, solid waste collection, town roads, and zoning bylaws.',
          'Board meetings and annual municipal budget hearings are strictly open to the public.',
        ],
        bulletsSw: [
          'Vyama vya wafanyabiashara, mitandao ya vijana na mitaa huteua wajumbe wa bodi.',
          'Bodi ya Manispaa husimamia taa za barabarani, usafi wa taka, barabara za mji na leseni.',
          'Mikutano ya bodi na vikao vya bajeti ya mji viko wazi kwa wananchi wote kuhudhuria.',
        ],
      },
      {
        titleEn: 'Citizen Petitions on Town Planning & Drainage',
        titleSw: 'Maombi ya Wananchi Kuhusu Mipango Miji na Mifereji ya Maji',
        contentEn: 'Urban residents have statutory rights to petition the Municipal Manager regarding illegal construction on access roads, blocked stormwater drains, or unauthorized commercial developments.',
        contentSw: 'Wakazi wa miji wana haki ya kisheria ya kuwasilisha maombi kwa Meneja wa Manispaa kuhusu ujenzi haramu barabarani au kuziba kwa mifereji ya maji ya mvua.',
        article: 'UACA Section 22',
        bulletsEn: [
          'Submit written objections during public notices of physical planning and zoning changes.',
          'Demand inspection of approved building plans from the Municipal Physical Planning Department.',
          'Form registered residents welfare associations (RWAs) for unified legal standing.',
        ],
        bulletsSw: [
          'Wasilisha pingamizi kwa maandishi wakati wa matangazo ya mabadiliko ya mipango miji.',
          'Dai kuona vibali vya ujenzi kutoka idara ya mipango miji ya manispaa.',
          'Unda chama cha wakazi kilichosajiliwa (RWA) ili kuwa na nguvu ya kisheria.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Municipal Charter',
        sw: 'Hati ya Manispaa',
        defEn: 'The legal charter granted by the Governor defining municipal boundaries, board powers, and citizen rights.',
        defSw: 'Hati ya kisheria inayotolewa na Gavana inayobainisha mipaka ya mji na mamlaka ya bodi.',
      },
      {
        en: 'Physical & Land Use Planning',
        sw: 'Mipango ya Matumizi ya Ardhi',
        defEn: 'Statutory zoning regulating residential, commercial, industrial, and recreational land usage in towns.',
        defSw: 'Ugawaji wa kisheria wa maeneo ya makazi, biashara, viwanda na maeneo ya wazi mijini.',
      },
    ],
    actionTipEn: 'Check the municipal notice board at your Municipal Board or Town Office for pending planning applications and zoning barazas.',
    actionTipSw: 'Kagua ubao wa matangazo katika ofisi ya Manispaa au Mji wa eneo lako kuona maombi ya mipango miji na mikutano ya wazi.',
  },

  // 11. Article 37: Right to Assembly & Picketing
  {
    titleEn: 'Article 37: Right to Peaceful Assembly, Picketing, and Petitions',
    titleSw: 'Kifungu cha 37: Haki ya Kukusanyika kwa Amani na Maandamano',
    summaryEn: 'The constitutional boundaries of police notification vs. permission and citizen rights during peaceful demonstrations under Kenyan law.',
    summarySw: 'Mipaka ya kikatiba ya kutoa taarifa kwa polisi na haki za mwananchi wakati wa maandamano ya amani bila silaha chini ya sheria za Kenya.',
    category: 'human_rights',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'Notification vs. Permission: What the Law Says',
        titleSw: 'Kutoa Taarifa dhidi ya Kuomba Kibali: Sheria Inasemaje?',
        contentEn: 'Article 37 establishes that every person has the right, peaceably and unarmed, to assemble, to demonstrate, to picket, and to present petitions to public authorities. In Kenya, citizens only notify the police; police do not grant permission.',
        contentSw: 'Kifungu cha 37 kinatamka kuwa kila mtu ana haki, kwa amani na bila silaha, kukusanyika, kuandamana, na kuwasilisha maombi kwa mamlaka za umma. Nchini Kenya, wananchi hutoa taarifa tu kwa polisi; polisi hawatoi kibali.',
        constitutionalArticle: 'Article 37 & Public Order Act Section 5',
        bulletsEn: [
          'Written notice must be submitted to the Officer Commanding Police Station (OCS) 3 to 14 days in advance.',
          'Police have a constitutional duty to provide security and protect peaceful demonstrators from counter-disruptors.',
          'Demonstrators must remain unarmed, peaceful, and respectful of public order and private property.',
        ],
        bulletsSw: [
          'Barua ya taarifa huwasilishwa kwa mkuu wa kituo cha polisi (OCS) siku 3 hadi 14 kabla ya maandamano.',
          'Polisi wana wajibu wa kikatiba kutoa ulinzi na kuwazuia wahuni kuvuruga maandamano ya amani.',
          'Waandamanaji hawapaswi kubeba silaha zozote na lazima walinde mali ya umma na watu binafsi.',
        ],
      },
      {
        titleEn: 'What to Do if Unlawfully Dispersed',
        titleSw: 'Hatua za Kuchukua Iwapo Maandamano Yatasambaratishwa Kinyume cha Sheria',
        contentEn: 'If police use unauthorized lethal force or teargas on peaceful assemblies, citizens and civil society can document evidence and file human rights petitions before the High Court and IPOA.',
        contentSw: 'Iwapo polisi watatumia nguvu kupita kiasi au mabomu ya machozi dhidi ya waandamanaji wa amani, wananchi wanaweza kurekodi ushahidi na kuwasilisha malalamiko kwa IPOA na Mahakama Kuu.',
        article: 'Article 22 & National Police Service Act Schedule 6',
        bulletsEn: [
          'Record officer service numbers (EP numbers), vehicle registration plates, and precise time stamps.',
          'Lodge a formal complaint with the Independent Policing Oversight Authority (IPOA).',
          'Seek medical examination (P3 Form) immediately at a government hospital in case of injuries.',
        ],
        bulletsSw: [
          'Rekodi nambari za huduma za maafisa (nambari za beji), nambari za gari na wakati kamili.',
          'Wasilisha malalamiko rasmi kwa Mamlaka ya Kusimamia Polisi (IPOA).',
          'Pata fomu ya matibabu ya P3 mara moja hospitali ya serikali iwapo umejeruhiwa.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Picketing',
        sw: 'Mgomo wa Amani (Picketing)',
        defEn: 'Stationing oneself outside an office or workplace to peacefully express grievance or dissuade others from entering.',
        defSw: 'Kusimama kwa amani nje ya ofisi au eneo la kazi kuonyesha kutoridhika au kudai haki.',
      },
      {
        en: 'Proportionality of Force',
        sw: 'Kiwango Sahihi cha Nguvu',
        defEn: 'Statutory doctrine requiring police to use only the minimum force necessary to restore order, prioritizing negotiation.',
        defSw: 'Kanuni ya kisheria inayowataka polisi kutumia nguvu kidogo iwezekanavyo na kutanguliza mazungumzo.',
      },
    ],
    actionTipEn: 'When organizing a peaceful village walk or petition handover, always carry stamped copies of your police notification letter.',
    actionTipSw: 'Unapoandaa maandamano ya amani au kukabidhi ombi, beba nakala yenye muhuri wa polisi kuthibitisha kuwa ulitoa taarifa mapema.',
  },

  // 12. Children Rights & County ECDE Centers
  {
    titleEn: 'Children Rights & County Early Childhood Education (ECDE)',
    titleSw: 'Haki za Watoto na Vituo vya Elimu ya Chekechea ya Kaunti (ECDE)',
    summaryEn: 'Examine county constitutional obligations for Early Childhood Development Education (ECDE) and citizen duties to protect children from abuse under Article 53.',
    summarySw: 'Chunguza wajibu wa kikatiba wa serikali ya kaunti kuhusu vituo vya chekechea (ECDE) na ulinzi wa haki za watoto chini ya Kifungu cha 53.',
    category: 'human_rights',
    readTimeMinutes: 8,
    sections: [
      {
        titleEn: 'The Constitutional Guarantees for Children',
        titleSw: 'Haki za Kikatiba za Mtoto nchini Kenya',
        contentEn: 'Article 53 guarantees every child the right to a name, nationality, basic nutrition, shelter, healthcare, and free and compulsory basic education. Under the Fourth Schedule, Pre-primary education (ECDE) is 100% a devolved county function.',
        contentSw: 'Kifungu cha 53 kinampa kila mtoto haki ya jina, uraia, lishe bora, malazi, matibabu na elimu ya msingi bila malipo. Chini ya Ratiba ya Nne, elimu ya chekechea (ECDE) ni jukumu la serikali ya kaunti.',
        constitutionalArticle: 'Article 53 & Fourth Schedule Part 2 (9)',
        bulletsEn: [
          'County governments must build safe ECDE classrooms, provide learning materials, and employ qualified teachers.',
          'No child should be locked out of pre-primary school due to unauthorized levies or school fees.',
          'A child’s best interests are of paramount importance in every matter concerning the child.',
        ],
        bulletsSw: [
          'Serikali ya kaunti lazima ijenge madarasa salama ya chekechea, itoe vifaa na kuajiri walimu wenye sifa.',
          'Mtoto yeyote hapaswi kufukuzwa shule ya chekechea kwa sababu ya karo au michango isiyo rasmi.',
          'Maslahi bora ya mtoto ndiyo kipaumbele kikuu katika kila jambo linalomhusu mtoto.',
        ],
      },
      {
        titleEn: 'Reporting Child Labor & Abuse in Coastal Communities',
        titleSw: 'Kuripoti Ajira ya Watoto na Dhuluma katika Jamii za Pwani',
        contentEn: 'The Children Act 2022 imposes mandatory reporting obligations on teachers, religious leaders, and citizens regarding child neglect, beach child labor, and defilement.',
        contentSw: 'Sheria ya Watoto ya 2022 inamlazimu kila mwalimu, kiongozi wa dini na mwananchi kuripoti visa vya kutelekezwa kwa watoto, ajira ufukweni na dhuluma za kijinsia.',
        article: 'Children Act 2022 Section 24',
        bulletsEn: [
          'Report child rights violations to Childline Kenya via the toll-free emergency number 116.',
          'Sub-County Children Officers can intervene directly and place vulnerable children in rescue centers.',
          'Chiefs and village elders have a legal duty to return school-dropouts to classroom.',
        ],
        bulletsSw: [
          'Ripoti unyanyasaji wa watoto kwa Childline Kenya kupitia nambari ya bure 116.',
          'Maafisa wa Watoto wa Kaunti Ndogo wana mamlaka ya kuokoa watoto walio hatarini.',
          'Chifu na wazee wa mtaa wana wajibu wa kisheria kuhakikisha kila mtoto anarejea shuleni.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'ECDE (Early Childhood Development Education)',
        sw: 'Elimu ya Awali ya Mtoto (Chekechea)',
        defEn: 'Foundation schooling for children aged 3-5 devolved to county governments under the Constitution.',
        defSw: 'Elimu ya msingi ya watoto wenye umri wa miaka 3 hadi 5 inayosimamiwa na serikali za kaunti.',
      },
      {
        en: 'Best Interests of the Child',
        sw: 'Maslahi Bora ya Mtoto',
        defEn: 'The primary legal standard guiding courts and administrators to prioritize the safety and welfare of children.',
        defSw: 'Kipimo kikuu cha kisheria kinachozitaka mahakama na serikali kutanguliza ustawi wa mtoto daima.',
      },
    ],
    actionTipEn: 'Dial toll-free 116 immediately if you witness any school-aged child being forced into early labor or denied schooling in your area.',
    actionTipSw: 'Piga simu bila malipo 116 mara moja ukiona mtoto anayepaswa kuwa shuleni akilazimishwa kufanya kazi ngumu au kunyimwa masomo.',
  },

  // 13. NG-CDF Citizen Audits
  {
    titleEn: 'National Government-Constituency Development Fund (NG-CDF) Audits',
    titleSw: 'Ukaguzi wa Fedha za Maendeleo ya Eneo Bunge (NG-CDF) na Wananchi',
    summaryEn: 'How to monitor CDF allocations for high school classrooms, security posts, and bursaries across Kenya\'s 290 constituencies.',
    summarySw: 'Jinsi ya kufuatilia fedha za CDF za madarasa ya sekondari, vituo vya polisi na ufadhili wa masomo (bursary) katika maeneo bunge yote 290 ya Kenya.',
    category: 'government',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'The Statutory Mandate of NG-CDF',
        titleSw: 'Agizo la Kisheria la Fedha za NG-CDF',
        contentEn: 'NG-CDF receives at least 2.5% of national ordinary revenue shared among 290 constituencies. Under the NG-CDF Act, funds are restricted to National Government functions: secondary schools, tertiary institutes, security infrastructure, and student bursaries.',
        contentSw: 'NG-CDF hupokea angalau asilimia 2.5 ya mapato ya kitaifa yanayogawanywa kwa maeneo bunge 290. Fedha hizo hutumika kwa shule za upili, vyuo, usalama na bursary za wanafunzi.',
        constitutionalArticle: 'Article 206 & NG-CDF Act 2015',
        bulletsEn: [
          'Constituency Committees must conduct open public proposal meetings in every ward.',
          'Project Management Committees (PMCs) comprising local parents and elders manage physical site construction.',
          'At least 35% of CDF allocations can be disbursed for equitable student education bursaries.',
        ],
        bulletsSw: [
          'Kamati ya NG-CDF ya Eneo Bunge lazima ifanye mikutano ya wazi katika kila wodi.',
          'Kamati za Usimamizi wa Miradi (PMC) za wazazi na wakazi ndizo zinazosimamia ujenzi shuleni.',
          'Angalau asilimia 35 ya mgao wa CDF inaweza kutumika kutoa ufadhili wa masomo (bursary).',
        ],
      },
      {
        titleEn: 'Conducting a Social Audit on CDF Projects',
        titleSw: 'Kufanya Ukaguzi wa Kijamii wa Miradi ya CDF',
        contentEn: 'Citizens have the right under Article 35 to inspect bills of quantities (BQs) and payment vouchers for classroom constructions to ensure substandard materials or phantom projects are not financed.',
        contentSw: 'Wananchi wana haki ya kikatiba ya kukagua makadirio ya ujenzi (BQ) na risiti za malipo ili kuzuia matumizi ya vifaa duni au miradi hewa shuleni.',
        article: 'Article 35 & Public Audit Act Section 33',
        bulletsEn: [
          'Check the Auditor General’s yearly audit report for your constituency on oagkenya.go.ke.',
          'Compare project costs against the actual physical specifications on site.',
          'Lodge formal audit queries with the National Assembly NG-CDF Select Committee.',
        ],
        bulletsSw: [
          'Soma ripoti ya Mkaguzi Mkuu wa Hesabu za Serikali kwenye tovuti ya oagkenya.go.ke.',
          'Linganisha gharama zilizotajwa na ubora wa jengo halisi lililopo shuleni.',
          'Wasilisha malalamiko kwa Kamati ya Bunge ya Kitaifa inayosimamia CDF.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'PMC (Project Management Committee)',
        sw: 'Kamati ya Usimamizi wa Mradi',
        defEn: 'Elected local community committee directly supervising contractor procurement and daily site works.',
        defSw: 'Kamati ya wazazi na wanakijiji wanaosimamia mkandarasi na ujenzi wa darasa shuleni.',
      },
      {
        en: 'Constituency Bursary Register',
        sw: 'Daftari la Ufadhili wa Masomo',
        defEn: 'Public record of all approved bursary applicants and disbursement cheques that must be displayed openly.',
        defSw: 'Orodha ya wazi ya wanafunzi wote waliopata hundi za karo na kiasi cha fedha walichopewa.',
      },
    ],
    actionTipEn: 'Visit your constituency NG-CDF office in your sub-county to request the latest bursary beneficiary list and ward project allocations.',
    actionTipSw: 'Fika katika ofisi ya CDF ya eneo bunge lako kuomba orodha ya wanafunzi waliopata bursary na miradi iliyotengewa fedha wodi mwako.',
  },

  // 14. Mining Act 2016 & Mineral Royalties Split
  {
    titleEn: 'Mining Act 2016: Local Mineral Royalties Split (70/20/10)',
    titleSw: 'Sheria ya Madini 2016: Mgao wa Mapato ya Madini (70/20/10)',
    summaryEn: 'How resource-rich communities across Kenya\'s counties (mining, quarrying, geothermal, oil, minerals) are legally entitled to 10% community royalties and 20% county royalties.',
    summarySw: 'Jinsi jamii za maeneo ya madini na maliasili nchini Kenya zinavyostahili kisheria asilimia 10 ya mrabaha na kaunti asilimia 20.',
    category: 'constitution',
    readTimeMinutes: 11,
    sections: [
      {
        titleEn: 'The Statutory 70 / 20 / 10 Royalty Sharing Formula',
        titleSw: 'Mfumo wa Kisheria wa Ugawaji wa Mrabaha (70 / 20 / 10)',
        contentEn: 'Section 183 of the Mining Act 2016 establishes that all mineral royalties collected by the National Government must be shared: 70% to the National Government, 20% to the County Government, and 10% directly to the local community where mining occurs.',
        contentSw: 'Kifungu cha 183 cha Sheria ya Madini ya 2016 kinaweka utaratibu wa kugawa mrabaha: Asilimia 70 kwa Serikali Kuu, Asilimia 20 kwa Serikali ya Kaunti, na Asilimia 10 moja kwa moja kwa jamii husika ya machimbo.',
        constitutionalArticle: 'Article 69(1)(a) & Mining Act Section 183',
        bulletsEn: [
          'The 10% community share must be paid into a dedicated Community Mineral Development Account.',
          'Community Development Agreement Committees (CDAC) plan local water, health, and scholarship projects.',
          'Mining companies cannot operate without a legally ratified Community Development Agreement (CDA).',
        ],
        bulletsSw: [
          'Mgao wa asilimia 10 wa jamii huwekwa katika akaunti maalum ya maendeleo ya jamii.',
          'Kamati ya CDAC inapanga miradi ya maji, zahanati na ufadhili wa masomo kwa watoto wa eneo hilo.',
          'Kampuni ya madini hairuhusiwi kuchimba bila makubaliano rasmi ya kisheria na jamii (CDA).',
        ],
      },
      {
        titleEn: 'Environmental Restoration & Community Protections',
        titleSw: 'Urekebishaji wa Mazingira na Ulinzi wa Jamii',
        contentEn: 'Mining license holders must post an environmental restoration bond and sign Free, Prior, and Informed Consent agreements before displacing any residents or disturbing water aquifers.',
        contentSw: 'Wamiliki wa leseni za uchimbaji lazima waweke dhamana ya fedha ya kurudisha mazingira katika hali yake na wapate idhini ya wazi ya wananchi kabla ya kuwahamisha.',
        article: 'Mining Act Section 176',
        bulletsEn: [
          'Compensation for displaced landowners must reflect current commercial market value plus resettlement disturbance allowances.',
          'Environmental impact monitoring reports must be submitted annually to NEMA and published for public review.',
          'Youth from local villages have statutory priority for non-specialized employment opportunities.',
        ],
        bulletsSw: [
          'Fidia ya ardhi lazima ilingane na bei halisi ya soko ya sasa pamoja na gharama za uhamisho.',
          'Ripoti za athari za kimazingira lazima zikabidhiwe kwa NEMA na kuwekwa wazi kwa wananchi.',
          'Vijana wa eneo husika wana kipaumbele cha kisheria cha kupata ajira katika mgodi huo.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'CDA (Community Development Agreement)',
        sw: 'Makubaliano ya Maendeleo ya Jamii',
        defEn: 'Binding legal contract between mining company and host community allocating social investments.',
        defSw: 'Mkataba wa kisheria unaoilazimu kampuni ya uchimbaji kufadhili miradi ya kijamii.',
      },
      {
        en: 'Mineral Royalty',
        sw: 'Mrabaha wa Madini',
        defEn: 'Statutory fee paid by mining extractors to the government for the commercial extraction of natural resources.',
        defSw: 'Malipo ya kisheria yanayolipwa serikalini na kampuni ya madini kulingana na kiasi cha madini yaliyochimbwa.',
      },
    ],
    actionTipEn: 'Ask your county mining liaison officer for copies of the Community Development Agreement governing extractive concessions in your sub-county.',
    actionTipSw: 'Muulize afisa wa madini wa kaunti nakala ya Makubaliano ya Jamii (CDA) yanayosimamia migodi katika eneo lako.',
  },

  // 15. NEMA Environmental Impact Assessment Hearings
  {
    titleEn: 'Environmental Management (EMCA): NEMA EIA Public Hearings',
    titleSw: 'Usimamizi wa Mazingira (EMCA): Mikutano ya NEMA ya Ushiriki wa Umma',
    summaryEn: 'How coastal residents can legally stop destructive projects, inspect Environmental Impact Assessment (EIA) study reports, and testify at NEMA hearings.',
    summarySw: 'Jinsi wananchi wanavyoweza kuzuia miradi inayoharibu mazingira, kukagua ripoti za EIA na kutoa ushuhuda kwenye mikutano ya NEMA.',
    category: 'constitution',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'Article 42 & Mandatory EIA Study Reports',
        titleSw: 'Kifungu cha 42 na Ripoti za Lazima za Tathmini ya Mazingira (EIA)',
        contentEn: 'Article 42 guarantees every person the right to a clean and healthy environment. Under the Environmental Management and Coordination Act (EMCA), no major infrastructure, factory, dam, or hotel can begin without an approved NEMA license preceded by public hearings.',
        contentSw: 'Kifungu cha 42 kinampa kila mtu haki ya mazingira safi na yenye afya. Chini ya Sheria ya EMCA, hakuna mradi mkubwa, kiwanda, bwawa au hoteli inayoweza kuanza bila leseni ya NEMA iliyotanguliwa na mikutano ya wananchi.',
        constitutionalArticle: 'Article 42 & EMCA Section 58',
        bulletsEn: [
          'NEMA must publish notice of EIA study reports in the Kenya Gazette and two daily newspapers.',
          'Citizens have 30 days to submit written objections regarding pollution, beach access, or mangrove clearing.',
          'Lead agencies must conduct physical barazas in the affected village before issuing any license.',
        ],
        bulletsSw: [
          'NEMA lazima itangaze ripoti ya EIA kwenye Gazeti Rasmi la Serikali na magazeti mawili ya kitaifa.',
          'Wananchi wana siku 30 kuwasilisha pingamizi kuhusu uchafuzi, njia za ufukweni au kukata mikoko.',
          'NEMA lazima ifanye mikutano ya wazi na wanakijiji wa eneo husika kabla ya kutoa leseni yoyote.',
        ],
      },
      {
        titleEn: 'Appealing to the National Environment Tribunal (NET)',
        titleSw: 'Kukata Rufaa kwenye Mahakama ya Mazingira (NET)',
        contentEn: 'If NEMA issues a license ignoring community environmental objections, affected citizens can lodge an appeal at the National Environment Tribunal (NET). Under Section 129 of EMCA, filing an appeal automatically halts project construction until judgment is delivered.',
        contentSw: 'NEMA ikitoa leseni bila kujali malalamiko ya wananchi, wakaazi wanaweza kukata rufaa kwenye Mahakama ya NET. Kufungua rufaa kunasimamisha mradi mara moja hadi kesi iamuliwe.',
        article: 'EMCA Section 129',
        bulletsEn: [
          'Automatic stop-work order (status quo) takes effect immediately upon filing appeal documents.',
          'Tribunal fees are subsidized to protect citizen public-interest environmental litigation.',
          'High Court Environment and Land Court has jurisdiction to award environmental damages.',
        ],
        bulletsSw: [
          'Agizo la kusitisha ujenzi mara moja huanza kutumika punde tu nyaraka za rufaa zinapowasilishwa.',
          'Gharama za kufungua kesi zimepunguzwa ili kuruhusu wananchi kutetea mazingira yao.',
          'Mahakama ya Mazingira na Ardhi ina mamlaka ya kuamuru fidia kwa jamii iliyoathirika.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'EIA (Environmental Impact Assessment)',
        sw: 'Tathmini ya Athari kwa Mazingira',
        defEn: 'Comprehensive scientific and sociological study analyzing prospective harms of a proposed development.',
        defSw: 'Utafiti wa kina unaochunguza madhara yanayoweza kusababishwa na mradi unaopangwa kujengwa.',
      },
      {
        en: 'Stop Order (Injunction)',
        sw: 'Agizo la Kusitisha Ujenzi',
        defEn: 'Legal directive ordering project developers to cease all physical excavations and tree fellings.',
        defSw: 'Agizo la kisheria linalomlazimu mwekezaji kusimamisha mara moja ujenzi na ukataji miti.',
      },
    ],
    actionTipEn: 'Monitor the NEMA Kenya public notices website monthly to review pending project licenses across Kenya\'s counties.',
    actionTipSw: 'Kagua tovuti ya matangazo ya NEMA mara kwa mara kuona maombi ya leseni za uwekezaji yanayopendekezwa katika kaunti yako.',
  },

  // 16. Persons with Disabilities Act & Article 54
  {
    titleEn: 'Persons with Disabilities Act & Article 54 Inclusivity in Public Projects',
    titleSw: 'Sheria ya Watu Wenye Ulemavu na Ushirikishwaji Chini ya Kifungu cha 54',
    summaryEn: 'How to enforce the 5% public employment rule, accessible infrastructure ramps in county facilities, and assistive devices budget across all 47 counties of Kenya.',
    summarySw: 'Jinsi ya kutekeleza sheria ya asilimia 5 ya ajira kwa watu wenye ulemavu, njia za viti vya magurudumu na bajeti ya vifaa saidizi katika kaunti zote 47 za Kenya.',
    category: 'human_rights',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'The 5% Employment & AGPO Reservation Mandate',
        titleSw: 'Mgao wa Asilimia 5 wa Ajira na Zabuni za AGPO',
        contentEn: 'Article 54(2) mandates that the State shall ensure the progressive implementation of the principle that at least five percent of the members of the public in appointive and elective bodies are persons with disabilities.',
        contentSw: 'Kifungu cha 54(2) kinailazimu serikali kuhakikisha kuwa angalau asilimia tano ya nafasi zote za kuteuliwa na kuchaguliwa zinatengewa watu wanaoishi na ulemavu.',
        constitutionalArticle: 'Article 54 & Persons with Disabilities Act',
        bulletsEn: [
          'County Public Service Boards must maintain a transparent registry of PWD staff recruitments.',
          'Under AGPO, a reserved quota of 30% government procurement contracts goes to women, youth, and PWDs.',
          'PWD entrepreneurs are legally exempt from paying income tax up to statutory limits upon NCPWD registration.',
        ],
        bulletsSw: [
          'Bodi ya Utumishi wa Umma ya Kaunti lazima iweke wazi idadi ya watumishi wenye ulemavu walioajiriwa.',
          'Kwenye zabuni za AGPO, sehemu maalum ya mikataba inatengwa kwa wafanyabiashara wenye ulemavu.',
          'Wafanyabiashara wenye ulemavu wamesamehewa kodi ya mapato baada ya kusajiliwa na Baraza la NCPWD.',
        ],
      },
      {
        titleEn: 'Physical Accessibility in Public Buildings',
        titleSw: 'Upatikanaji wa Njia za Watu Wenye Viti vya Magurudumu Majengoni',
        contentEn: 'All public buildings, hospitals, courtrooms, and county assemblies must have barrier-free wheelchair ramps, braille signage, and adapted sanitation facilities under Section 21 of the Persons with Disabilities Act.',
        contentSw: 'Majengo yote ya serikali, hospitali, mahakama na mabunge lazima yawe na miinuko ya viti vya magurudumu (ramps), maandishi ya braille na vyoo maalum vinavyofikika.',
        article: 'PWDA Section 21',
        bulletsEn: [
          'Building approvals can be challenged in court if architectural designs exclude universal accessibility.',
          'Sign language interpretation must be provided at major county public participation forums and assemblies.',
          'National Council for Persons with Disabilities (NCPWD) issues compliance orders against non-compliant premises.',
        ],
        bulletsSw: [
          'Vibali vya ujenzi vinaweza kusimamishwa kortini iwapo ramani haina njia za watu wenye ulemavu.',
          'Watafsiri wa lugha ya alama lazima wawepo katika mikutano mikuu ya bajeti na ushiriki wa umma.',
          'Baraza la NCPWD lina mamlaka ya kisheria kufunga majengo ya umma yanayobagua watu wenye ulemavu.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'NCPWD',
        sw: 'Baraza la Kitaifa la Watu Wenye Ulemavu',
        defEn: 'The state agency managing disability registration, assistive devices distribution, and tax exemption certificates.',
        defSw: 'Shirika la serikali linalosajili watu wenye ulemavu, kutoa vifaa saidizi na vyeti vya msamaha wa kodi.',
      },
      {
        en: 'Reasonable Accommodation',
        sw: 'Marekebisho Yanayofaa Kazi',
        defEn: 'Necessary modifications provided to enable a person with a disability to enjoy human rights and perform duties equally.',
        defSw: 'Marekebisho maalum kazini au shuleni yanayomwezesha mtu mwenye ulemavu kufanya kazi zake bila vikwazo.',
      },
    ],
    actionTipEn: 'Ensure any relative with a disability is registered at the NCPWD county office in your county headquarters to receive assistive equipment and educational bursary support.',
    actionTipSw: 'Hakikisha mtu yeyote mwenye ulemavu katika familia yako amesajiliwa na ofisi ya NCPWD katika makao makuu ya kaunti yako ili apate vifaa na ufadhili wa masomo.',
  },

  // 17. National Cohesion & Anti-Hate Speech
  {
    titleEn: 'National Cohesion and Integration Act: Combating Hate Speech & Ethnic Incitement',
    titleSw: 'Sheria ya Uwiano wa Kitaifa: Kupambana na Matamshi ya Chuki na Uchochezi',
    summaryEn: 'How the NCIC Act criminalizes ethnic profiling, discriminatory hiring in county governments, and political hate speech.',
    summarySw: 'Jinsi Sheria ya NCIC inavyopiga marufuku ubaguzi wa kikabila, upendeleo wa ajira katika kaunti na matamshi ya chuki ya wanasiasa.',
    category: 'integrity',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'Criminal Penalties for Hate Speech & Incitement',
        titleSw: 'Adhabu za Jinai kwa Matamshi ya Chuki na Uchochezi',
        contentEn: 'Section 13 and Section 62 of the NCIC Act make it a criminal offence to use threatening, abusive, or insulting words or publish material intending to stir up ethnic hatred. Violations carry up to Ksh 1 million fine or 3 years imprisonment.',
        contentSw: 'Kifungu cha 13 na 62 cha Sheria ya NCIC kinaweka wazi kuwa kutumia maneno ya matusi, vitisho au uchochezi wa kikabila ni kosa la jinai linaloadhibiwa kwa faini ya hadi Shilingi Milioni Moja au kifungo cha miaka 3.',
        constitutionalArticle: 'Article 27 & Article 33(2)',
        bulletsEn: [
          'Freedom of speech under Article 33 explicitly does NOT extend to hate speech or advocacy of hatred.',
          'Audio and video clips from political rallies or WhatsApp groups are admissible in court as digital evidence.',
          'Politicians convicted of hate speech can be disqualified from holding public office under Chapter Six.',
        ],
        bulletsSw: [
          'Uhuru wa kujieleza chini ya Kifungu cha 33 haujumuishi matamshi ya chuki au uchochezi wa uhasama.',
          'Kanda za video na sauti kutoka kwenye mikutano au WhatsApp zinakubaliwa kortini kama ushahidi.',
          'Mwanasiasa anayepatikana na hatia ya chuki anaweza kuzuiwa kuwania uongozi chini ya Sura ya Sita.',
        ],
      },
      {
        titleEn: 'The 70/30 Ethnic Balance Rule in County Employment',
        titleSw: 'Kanuni ya Asilimia 70/30 ya Ajira za Kaunti',
        contentEn: 'Section 65 of the County Governments Act requires that at least 30% of all vacant posts in county public service must be filled by individuals who are not from the dominant ethnic community of that county.',
        contentSw: 'Kifungu cha 65 cha Sheria ya Serikali za Kaunti kinataka angalau asilimia 30 ya nafasi zote za ajira za kaunti zipewe watu wasiotoka jamii kubwa yenye wenyeji wengi katika kaunti hiyo.',
        article: 'County Governments Act Section 65',
        bulletsEn: [
          'County Public Service Boards that practice exclusive ethnic nepotism violate national values under Article 10.',
          'The NCIC publishes annual diversity audits for all 47 counties to expose non-compliant administrations.',
          'Citizens can petition the Senate or High Court to compel equitable recruitment reforms.',
        ],
        bulletsSw: [
          'Bodi za Kaunti zinazoajiri kwa ukabila zinakiuka maadili ya taifa chini ya Kifungu cha 10.',
          'NCIC huchapisha ripoti ya kila mwaka ya uwiano wa kikabila katika kaunti zote 47.',
          'Wananchi wanaweza kuwasilisha malalamiko Seneti au Mahakama Kuu kulazimisha usawa wa ajira.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Hate Speech',
        sw: 'Matamshi ya Chuki',
        defEn: 'Advocacy of hatred that constitutes incitement to discrimination, hostility, or violence based on ethnic origin.',
        defSw: 'Kauli au matendo yanayochochea uhasama, ubaguzi au ghasia dhidi ya jamii fulani ya kikabila.',
      },
      {
        en: 'Diversity Audit',
        sw: 'Ukaguzi wa Uwiano wa Kikabila',
        defEn: 'Official statutory investigation measuring ethnic representation across all ranks of public employment.',
        defSw: 'Uchunguzi wa kisheria unaopima mgawanyo wa ajira za serikali kwa jamii zote za Kenya bila ubaguzi.',
      },
    ],
    actionTipEn: 'Report any politician or social media user inciting inter-community hostility to the National Cohesion and Integration Commission (NCIC) online portal.',
    actionTipSw: 'Ripoti mwanasiasa au mtumiaji yeyote wa mitandao anayechochea ukabila kwa Tume ya Uwiano wa Kitaifa (NCIC).',
  },

  // 18. Small Claims Court: Swift Justice Under 60 Days
  {
    titleEn: 'Small Claims Court: Resolving Community Disputes Under Ksh 1M in 60 Days',
    titleSw: 'Mahakama ya Madai Madogo: Kusuluhisha Kesi Chini ya Sh Milioni 1 Ndani ya Siku 60',
    summaryEn: 'How citizens and small traders across Kenya can recover debts, resolve rent disputes, and settle commercial contracts cheaply without expensive lawyers.',
    summarySw: 'Jinsi wananchi na wafanyabiashara wadogo kote nchini Kenya wanavyoweza kurejesha madeni na migogoro ya kodi ya nyumba kwa haraka bila gharama za mawakili.',
    category: 'government',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'How the Small Claims Court Functions',
        titleSw: 'Jinsi Mahakama ya Madai Madogo Inavyofanya Kazi',
        contentEn: 'Established under the Small Claims Court Act 2016, this court handles civil claims up to Ksh 1,000,000. It must hear and deliver final judgment within 60 days of filing. Formal court procedures are relaxed, and citizens can represent themselves.',
        contentSw: 'Mahakama ya Madai Madogo hushughulikia kesi za madeni na mikataba hadi Shilingi 1,000,000. Kesi lazima isikilizwe na uamuzi utolewe ndani ya siku 60. Wananchi wanaweza kujisimamia wenyewe bila wakili.',
        constitutionalArticle: 'Article 48 & Small Claims Court Act',
        bulletsEn: [
          'Court filing fees are low and scaled proportionally to the amount claimed (often under Ksh 1,000).',
          'Covers commercial contracts, unpaid rent, damaged property, salary arrears, and personal loans.',
          'Parties are encouraged to use Court-Annexed Mediation to reach voluntary settlements.',
        ],
        bulletsSw: [
          'Ada za kufungua kesi ni ndogo sana kulingana na kiasi cha madai (mara nyingi chini ya Sh 1,000).',
          'Inahusisha mikataba ya biashara, kodi ya nyumba, mali iliyoharibiwa, mishahara na mikopo ya watu binafsi.',
          'Wadaawa wanahimizwa kutumia upatanishi wa mahakama (Mediation) kufikia makubaliano ya amani.',
        ],
      },
      {
        titleEn: 'Steps to File a Claim at Small Claims Courts across Kenya',
        titleSw: 'Hatua za Kufungua Kesi Mahakama za Madai Madogo nchini Kenya',
        contentEn: 'You do not need to hire an advocate. Filing is done electronically via the Judiciary e-filing portal (efiling.court.go.ke) or physically at the Small Claims Court Registry at your local Law Courts.',
        contentSw: 'Huna haja ya kulipa wakili. Kufungua kesi hufanywa kwa mtandao kupitia mfumo wa e-filing wa Idara ya Mahakama au kusajili moja kwa moja kwenye mahakama iliyo karibu nawe.',
        article: 'Small Claims Court Act Section 23',
        bulletsEn: [
          'Attach proof of transaction: M-PESA statements, signed promissory notes, WhatsApp agreements, or receipts.',
          'Defendant is served electronically or by registered post and has 15 days to file a defense response.',
          'Judgments have the full legal force of a High Court decree and can be executed through court bailiffs.',
        ],
        bulletsSw: [
          'Ambatisha ushahidi: ujumbe wa M-PESA, makubaliano ya maandishi, picha za WhatsApp au risiti.',
          'Mshtakiwa anapewa taarifa rasmi na ana siku 15 kuwasilisha majibu yake kortini.',
          'Uamuzi una nguvu kamili ya kisheria na mali ya mdaiwa inaweza kupigwa mnada akikaidi kulipa.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Small Claim',
        sw: 'Dai Dogo la Kifedha',
        defEn: 'A monetary dispute not exceeding Ksh 1,000,000 designed for expedited judicial resolution.',
        defSw: 'Mgogoro wa kifedha usiozidi Shilingi Milioni Moja unaosuluhishwa kwa haraka ndani ya siku 60.',
      },
      {
        en: 'Court-Annexed Mediation',
        sw: 'Upatanishi wa Mahakama',
        defEn: 'A neutral, confidential discussion guided by a certified mediator to resolve disputes without a contested trial.',
        defSw: 'Mazungumzo ya siri yanayoongozwa na mpatanishi aliyesajiliwa na mahakama ili kumaliza mgogoro bila uhasama.',
      },
    ],
    actionTipEn: 'If a debtor owes you money with written or mobile money proof, visit the nearest Small Claims Court desk instead of resorting to unlawful self-help or police debt collection.',
    actionTipSw: 'Kama mtu anadaiwa na una ushahidi wa M-PESA au maandishi, fungua kesi Mahakama ya Madai Madogo ya eneo lako badala ya kutumia polisi au vurugu za kibinafsi.',
  },

  // 19. County Policing Authorities & Community Safety
  {
    titleEn: 'County Policing Authorities (CPA) & Community Safety Forums',
    titleSw: 'Mamlaka za Polisi za Kaunti (CPA) na Mabaraza ya Usalama wa Jamii',
    summaryEn: 'How community elders, youth, women, and business representatives can join CPAs under the National Police Service Act to oversee police accountability.',
    summarySw: 'Jinsi wazee, vijana, wanawake na wafanyabiashara wanavyoweza kujiunga na kamati za CPA kusimamia usalama na uwajibikaji wa polisi.',
    category: 'integrity',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'What is the County Policing Authority (CPA)?',
        titleSw: 'Mamlaka ya Polisi ya Kaunti (CPA) ni Nini?',
        contentEn: 'Section 41 of the National Police Service Act establishes a County Policing Authority in every county, chaired by the Governor. It bridges county residents, the County Commissioner, and the County Police Commander.',
        contentSw: 'Kifungu cha 41 cha Sheria ya Polisi kinaweka Mamlaka ya Polisi ya Kaunti (CPA) inayoongozwa na Gavana. Inaleta pamoja wananchi, Kamishna wa Kaunti na Kamanda wa Polisi.',
        constitutionalArticle: 'Article 244 & NPS Act Section 41',
        bulletsEn: [
          'Six community members are competitively appointed to represent youth, women, business, PWDs, and religious leaders.',
          'CPAs monitor police performance, combat extrajudicial actions, and develop county crime prevention strategies.',
          'Quarterly public policing forums allow residents to raise security concerns directly with police commanders.',
        ],
        bulletsSw: [
          'Wananchi sita huteuliwa kuwakilisha vijana, wanawake, wafanyabiashara, walemavu na viongozi wa dini.',
          'CPA hukagua utendaji wa polisi, kuzuia mauaji ya kiholela na kupanga mikakati ya usalama kaunti.',
          'Mabaraza ya usalama ya kila robo mwaka yanawapa wananchi nafasi ya kuhoji makamanda wa polisi.',
        ],
      },
      {
        titleEn: 'Nyumba Kumi & Community-Oriented Policing',
        titleSw: 'Nyumba Kumi na Polisi Jamii',
        contentEn: 'Community policing operates on mutual trust between police and residents. Citizens are eyes and ears but do not possess arrest powers without handing suspects to lawful officers.',
        contentSw: 'Ulinzi wa polisi jamii unategemea kuaminiana kati ya wananchi na polisi. Wananchi hutoa taarifa lakini hawana mamlaka ya kujichukulia sheria mkononi.',
        article: 'Article 244(e) & NPS Act Section 96',
        bulletsEn: [
          'Mob justice is strictly illegal and constitutes murder under the Penal Code.',
          'Community forums review illegal brews, youth radicalization, and beach security.',
          'Police officers must treat informants with confidentiality and non-disclosure.',
        ],
        bulletsSw: [
          'Kupiga washukiwa (mob justice) ni kosa kubwa la jinai la mauaji chini ya sheria za Kenya.',
          'Mabaraza ya kijiji hujadili pombe haramu, usalama wa vijana na ulinzi wa watalii ufukweni.',
          'Polisi wana wajibu wa kisheria kulinda siri ya wanakijiji wanaotoa taarifa za uhalifu.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'CPA (County Policing Authority)',
        sw: 'Mamlaka ya Polisi ya Kaunti',
        defEn: 'Statutory oversight body co-chaired by county leadership to ensure citizen priorities shape local security.',
        defSw: 'Chombo cha kisheria kinachoshirikisha serikali ya kaunti na polisi kusimamia usalama wa wananchi.',
      },
      {
        en: 'Community Policing',
        sw: 'Ulinzi wa Polisi Jamii',
        defEn: 'Collaborative partnership between law enforcement and citizens to proactively resolve crime and neighborhood disorder.',
        defSw: 'Ushirikiano wa dhati kati ya polisi na jamii kutatua vyanzo vya uhalifu na kulinda amani.',
      },
    ],
    actionTipEn: 'Find out the dates of your sub-county Community Policing Forum and attend to voice village safety concerns directly to your local OCS.',
    actionTipSw: 'Uliza tarehe za Baraza la Polisi Jamii la eneo lako na uhudhurie kueleza changamoto za usalama moja kwa moja kwa OCS.',
  },

  // 20. Public Officer Wealth Declarations
  {
    titleEn: 'Public Officer Wealth Declarations & Conflict of Interest Register',
    titleSw: 'Tamko la Mali la Maafisa wa Umma na Daftari la Mgongano wa Maslahi',
    summaryEn: 'How Article 76 and the Public Officer Ethics Act (POEA) mandate biennial asset declarations to expose illicit enrichment and conflict of interest.',
    summarySw: 'Jinsi Kifungu cha 76 na Sheria ya Maadili ya Maafisa wa Umma vinavyolazimisha tamko la mali kila baada ya miaka miwili kuzuia ufisadi.',
    category: 'integrity',
    readTimeMinutes: 10,
    sections: [
      {
        titleEn: 'Biennial Asset & Liability Declarations',
        titleSw: 'Tamko la Mali na Madeni Kila Miaka Miwili',
        contentEn: 'Under Section 26 of the Public Officer Ethics Act, every public officer (including Governors, MCAs, County Executives, and procurement officers) must submit a complete declaration of income, assets, and liabilities every two years, including those of their spouses and dependent children.',
        contentSw: 'Chini ya Kifungu cha 26 cha Sheria ya Maadili ya Maafisa wa Umma, kila mtumishi wa serikali lazima awasilishe tamko kamili la mali, mapato na madeni yake, mke au mume na watoto wake kila miaka miwili.',
        constitutionalArticle: 'Article 76 & POEA Section 26',
        bulletsEn: [
          'Unexplained wealth that is disproportionate to an officer’s lawful known income can be seized by the High Court.',
          'Assets Recovery Agency (ARA) and EACC can apply for forfeiture of corruptly acquired mansions, land, and accounts.',
          'Giving false or misleading statements in a wealth declaration is a felony punishable by imprisonment.',
        ],
        bulletsSw: [
          'Utajiri wowote unaozidi kipato halali cha afisa unaweza kutaifishwa na Mahakama Kuu kwa manufaa ya serikali.',
          'Mamlaka ya Kurejesha Mali (ARA) na EACC zinaweza kutaifisha majumba, ardhi na akaunti za kifisadi.',
          'Kudanganya kwenye fomu ya tamko la mali ni kosa kubwa la jinai linalopelekea kifungo jela.',
        ],
      },
      {
        titleEn: 'Citizen Access to Asset Declarations under Article 35',
        titleSw: 'Haki ya Mwananchi Kukagua Tamko la Mali Chini ya Kifungu cha 35',
        contentEn: 'Citizens who suspect an elected leader or county chief officer of embezzlement can submit a formal application to the responsible commission (EACC or County Public Service Board) showing reasonable grounds to inspect the officer’s asset declaration.',
        contentSw: 'Mwananchi anayeshuku kiongozi au mkurugenzi wa kaunti kwa wizi anaweza kuomba rasmi kwa EACC au Bodi ya Utumishi kukagua fomu ya mali ya kiongozi huyo.',
        article: 'POEA Section 30 & Access to Information Act',
        bulletsEn: [
          'Demonstrate public interest in monitoring tenders awarded to companies owned by officers’ immediate families.',
          'Conflict of interest must be disclosed before any tender evaluation or budget appropriation is voted upon.',
          'Public officers cannot open foreign bank accounts without written permission from EACC.',
        ],
        bulletsSw: [
          'Eleza maslahi ya umma katika kuchunguza zabuni zilizopewa kampuni za jamaa za kiongozi husika.',
          'Afisa lazima atangaze mgongano wa kimaslahi kabla ya kuamua zabuni au kupitisha mgao wa bajeti.',
          'Afisa wa umma haruhusiwi kufungua akaunti ya benki ng’ambo bila idhini ya maandishi ya EACC.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Unexplained Wealth',
        sw: 'Utajiri Usio na Maelezo Halali',
        defEn: 'Assets whose value significantly exceeds the lawful income of a public officer without legitimate commercial proof.',
        defSw: 'Mali au pesa nyingi zinazomilikiwa na kiongozi ambazo haziwezi kuelezwa zilitoka wapi kihalali.',
      },
      {
        en: 'Conflict of Interest',
        sw: 'Mgongano wa Kimaslahi',
        defEn: 'When an official’s personal commercial interests compete with their official public duties to the community.',
        defSw: 'Hali ambapo maslahi binafsi ya kibiashara ya afisa yanakinzana na majukumu yake kwa umma.',
      },
    ],
    actionTipEn: 'Demand that all ward project signboards list the directors of the awarded contractor to verify that no public officer has an undisclosed conflict of interest.',
    actionTipSw: 'Dai kwamba vibao vya miradi yote vitaje wamiliki wa kampuni iliyoshinda zabuni ili kuzuia viongozi kujipa kandarasi za umma kisiri.',
  },

  // 21. Human Rights Advocacy
  {
    titleEn: 'Human Rights Advocacy: Community Monitoring, Rights Defense, and Citizen Empowerment',
    titleSw: 'Utetezi wa Haki za Binadamu: Ufuatiliaji wa Jamii, Kulinda Haki na Uwezeshaji wa Wananchi',
    summaryEn: 'Master grassroots human rights advocacy under Chapter 4 of the Constitution. Learn how community paralegals and active citizens monitor violations, protect vulnerable groups, engage duty bearers, and petition the KNCHR and High Court across The Republic of Kenya.',
    summarySw: 'Jifunze mbinu za kutetea haki za binadamu mashinani chini ya Sura ya 4 ya Katiba. Fahamu jinsi ya kufuatilia ukiukaji wa haki, kuwalinda wanyonge, kuwawajibisha wenye madaraka, na kuwasilisha maombi kwa KNCHR na Mahakama Kuu kote nchini Kenya.',
    category: 'human_rights',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'Constitutional Anchoring: Chapter 4 Bill of Rights & Article 22 Enforcement',
        titleSw: 'Msingi wa Kikatiba: Mswada wa Haki (Sura ya 4) na Utetezi chini ya Kifungu cha 22',
        contentEn: 'Under Article 21, the State has a binding obligation to respect, protect, promote, and fulfill fundamental rights. Article 22 guarantees that any person acting in their own interest or on behalf of others or in the public interest has the right to institute High Court proceedings without filing fees or restrictive technical barriers.',
        contentSw: 'Chini ya Kifungu cha 21, Serikali ina wajibu wa lazima kuheshimu, kulinda, kuendeleza na kutimiza haki za kimsingi. Kifungu cha 22 kinampa kila mwananchi haki ya kufungua kesi Mahakama Kuu bila ada au vikwazo vya kiutaratibu.',
        article: 'Article 19, 21 & 22',
        bulletsEn: [
          'No court filing fees can be used to bar citizens from filing Article 22 human rights petitions.',
          'Community paralegals and civil society groups possess full locus standi to represent victims.',
          'High Court remedies include injunctions, declarations of invalidity, and financial compensation.',
        ],
        bulletsSw: [
          'Ada za mahakama haziwezi kutumika kuzuia wananchi kufungua kesi za kutetea haki za binadamu.',
          'Wasaidizi wa kisheria na mashirika ya kijamii yana haki kamili ya kuwawakilisha waathiriwa kortini.',
          'Maamuzi ya Mahakama Kuu yanajumuisha amri za kuzuia dhuluma, kubatilisha maamuzi haramu na kutoa fidia.',
        ],
      },
      {
        titleEn: 'Grassroots Monitoring Tools & Protection of Human Rights Defenders',
        titleSw: 'Mbinu za Ufuatiliaji Mashinani na Ulinzi wa Watetezi wa Haki',
        contentEn: 'Grassroots monitors document rights violations factually and engage statutory oversight bodies including the Kenya National Commission on Human Rights (KNCHR) and the Commission on Administrative Justice (Ombudsman - CAJ).',
        contentSw: 'Watetezi wa haki mashinani huandika ukiukaji wa haki kwa ushahidi kamili na kuwasiliana na Tume ya Kitaifa ya Haki za Binadamu (KNCHR) na Ofisi ya Ombudsman (CAJ).',
        article: 'Article 59 & KNCHR Act',
        bulletsEn: [
          'Document dates, names, service numbers, and evidence objectively without hearsay.',
          'Provide early legal aid and safe referrals for victims of gender-based violence or arbitrary arrest.',
          'Maintain encrypted digital emergency channels and alert civil society defender networks if facing threats.',
        ],
        bulletsSw: [
          'Weka rekodi ya tarehe, majina, nambari za sare na ushahidi bila uvumi.',
          'Toa msaada wa kwanza wa kisheria na rufaa salama kwa waathiriwa wa dhuluma za kijinsia au kukamatwa kiholela.',
          'Tumia njia salama za mawasiliano na taarifu mitandao ya watetezi wa haki unapokabiliwa na hatari.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Human Rights Defender (HRD)',
        sw: 'Mteteezi wa Haki za Binadamu',
        defEn: 'Any person who peacefully promotes and protects universally recognized human rights and fundamental freedoms.',
        defSw: 'Mtu yeyote anayechukua hatua za amani kukuza na kulinda haki za binadamu kwa wote.',
      },
      {
        en: 'Public Interest Litigation (PIL)',
        sw: 'Kesi kwa Maslahi ya Umma',
        defEn: 'Court action instituted to enforce the rights of the broader public or disadvantaged groups.',
        defSw: 'Kesi inayofunguliwa mahakamani kulinda haki za jamii nzima badala ya maslahi ya kibinafsi.',
      },
    ],
    actionTipEn: 'Form a human rights vigilance team in your ward. Report severe rights abuses to KNCHR toll-free SMS 22359 or file an urgent Article 22 petition at the nearest High Court station.',
    actionTipSw: 'Unda kamati ya ulinzi wa haki za binadamu kwenye wodi yako. Ripoti dhuluma kwa KNCHR (SMS ya bure 22359) au fungua kesi chini ya Kifungu cha 22.',
  },

  // 22. Using Social Media as a Narrative Tool for Peace
  {
    titleEn: 'Using Social Media as a Narrative Tool for Peace & Digital Cohesion',
    titleSw: 'Kutumia Mitandao ya Kijamii kama Chombo cha Amani na Mshikamano wa Kidijitali',
    summaryEn: 'Learn how to use social media (WhatsApp, X, Facebook, TikTok) as a constructive civic tool for peacebuilding. Understand Article 33 freedom of expression, boundaries on hate speech, countering propaganda, and narrative reframing for national cohesion across The Republic of Kenya.',
    summarySw: 'Jifunze jinsi ya kutumia mitandao ya kijamii (WhatsApp, X, Facebook, TikTok) kujenga amani na mshikamano. Fahamu Kifungu cha 33 cha uhuru wa kujieleza, mipaka dhidi ya matamshi ya chuki, kukabili propaganda, na kueneza ukweli kote nchini Kenya.',
    category: 'participation',
    readTimeMinutes: 8,
    sections: [
      {
        titleEn: 'Article 33 Freedom of Expression & Constitutional Boundaries',
        titleSw: 'Kifungu cha 33 Uhuru wa Kujieleza na Mipaka ya Kikatiba',
        contentEn: 'While Article 33(1) guarantees freedom of expression, Article 33(2) explicitly provides that this right does not extend to propaganda for war, incitement to violence, hate speech, or advocacy of ethnic hatred. Spreading ethnic slurs or incitement violates the National Cohesion and Integration Act.',
        contentSw: 'Wakati Kifungu cha 33(1) kinalinda uhuru wa kutoa maoni, Kifungu cha 33(2) kinaweka wazi kuwa uhuru huu haujumuishi propaganda za vita, kuchochea fujo, matamshi ya chuki au uchochezi wa kikabila.',
        article: 'Article 33(1) & 33(2)',
        bulletsEn: [
          'Hate speech and ethnic incitement carry criminal penalties under Section 13 and 62 of the NCIC Act.',
          'Publishing fabricated alarms is an offense under the Computer Misuse and Cybercrimes Act.',
          'Every citizen is bound under Article 10 to promote national unity and peaceful coexistence.',
        ],
        bulletsSw: [
          'Matamshi ya chuki na uchochezi wa kikabila ni makosa ya jinai chini ya Sheria ya NCIC.',
          'Kusambaza habari za uzushi wa makusudi ni kosa chini ya Sheria ya Makosa ya Mitandao.',
          'Kila mwananchi anawajibika chini ya Kifungu cha 10 kuendeleza umoja wa kitaifa na amani.',
        ],
      },
      {
        titleEn: 'Strategic Peace Storytelling & Countering Disinformation',
        titleSw: 'Kusimulia Masimulizi ya Amani na Kukabili Upotoshaji Mtandaoni',
        contentEn: 'Citizens and youth influencers can actively counter inflammatory rumors by verifying sources, framing inclusive peace narratives, and promoting constructive cross-community barazas.',
        contentSw: 'Wananchi na vijana wanaweza kukabili uvumi wa uchochezi kwa kuhakiki vyanzo, kueneza masimulizi ya amani, na kuunganisha jamii mtandaoni.',
        article: 'Article 10 & NCIC Act',
        bulletsEn: [
          'Verify facts before forwarding messages in WhatsApp groups or retweeting sensational claims.',
          'Share stories highlighting cross-ethnic cooperation on community water, health, and economic projects.',
          'Tag fact-checkers and official government oversight portals when debunking manipulated media.',
        ],
        bulletsSw: [
          'Hakiki ukweli kabla ya kusambaza ujumbe kwenye WhatsApp au kurudia kutuma habari za kutisha.',
          'Tangaza habari zinazoonyesha ushirikiano wa amani wa jamii mbalimbali kwenye miradi ya maendeleo.',
          'Taja vyanzo rasmi vya kisheria na ripoti za serikali unapopinga picha au video za kupotosha.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Digital Cohesion',
        sw: 'Mshikamano wa Kidijitali',
        defEn: 'Deploying digital communications deliberately to cultivate mutual respect, reduce ethnic polarization, and bridge community divides.',
        defSw: 'Kutumia mitandao ya kijamii kwa makusudi kujenga heshima, kupunguza ubaguzi na kuleta mshikamano.',
      },
      {
        en: 'Disinformation Counter-narrative',
        sw: 'Simulizi ya Kukabili Uzushi',
        defEn: 'A fact-based, culturally resonant communication designed to neutralize malicious propaganda.',
        defSw: 'Ujumbe wenye ukweli unaotolewa kubatilisha na kuzima uvumi na propaganda hasi.',
      },
    ],
    actionTipEn: 'Practice digital hygiene! Refuse to forward unverified tribal or political rumors in family and community WhatsApp chats. Share constructive civic literacy materials instead.',
    actionTipSw: 'Kuwa mlinzi wa amani mtandaoni! Usisambaze uvumi wa kikabila au uchochezi kwenye vikundi vya WhatsApp. Sambaza elimu ya kikatiba na ukweli.',
  },

  // 23. How to Write an Incident Report
  {
    titleEn: 'How to Write an Incident Report: Fact Documentation, Evidentiary Standards, and Citizen Accountability',
    titleSw: 'Jinsi ya Kuandika Ripoti ya Tukio: Nyaraka za Ukweli, Viwango vya Ushahidi na Uwajibikaji',
    summaryEn: 'A practical, structured guide for citizens and monitors to draft legally robust incident reports. Master the 5 Ws, chronological logging, evidence preservation, chain of custody, and reporting to IPOA, EACC, and courts across Kenya.',
    summarySw: 'Mwongozo wa vitendo kwa wananchi na watetezi wa haki kuandika ripoti rasmi ya tukio yenye mashiko ya kisheria. Jifunze mpangilio wa matukio, kuhifadhi ushahidi wa picha na video, na kuwasilisha kwa IPOA, EACC na mahakamani.',
    category: 'integrity',
    readTimeMinutes: 9,
    sections: [
      {
        titleEn: 'The 5 Ws & Contemporaneous Chronological Logging',
        titleSw: 'Mambo 5 Makuu (5 Ws) na Mpangilio wa Matukio Papo Hapo',
        contentEn: 'An incident report must be compiled contemporaneously when an occurrence happens. Under the Evidence Act (Cap 80), notes recorded immediately hold prime judicial weight because memory fades and details blur over time.',
        contentSw: 'Ripoti ya tukio lazima iandikwe mara moja tukio linapotokea. Chini ya Sheria ya Ushahidi (Cap 80), kumbukumbu za papo hapo zina uzito mkubwa kortini kwa sababu maelezo hayapotei.',
        article: 'Article 35 & Evidence Act Cap 80',
        bulletsEn: [
          'Who: Record full names, titles, vehicle registration plates, and police uniform service numbers.',
          'What & When: Detailed chronological log with exact 24-hour timestamps and precise observable actions.',
          'Where: Exact physical location, landmarks, ward, sub-county, and GPS coordinates.',
          'Distinguish Facts from Opinions: Quote exact words spoken; avoid speculation or emotional exaggeration.',
        ],
        bulletsSw: [
          'Nani (Who): Rekodi majina kamili, vyeo, nambari za magari, na nambari za sare za polisi (force numbers).',
          'Nini na Lini: Mpangilio wa matukio kwa saa na dakika na vitendo halisi vilivyotendeka.',
          'Wapi (Where): Mahali kamili, alama za eneo, kijiji, wodi na kuratibu za ramani (GPS).',
          'Tofautisha Ukweli na Hisia: Nukuu maneno halisi yaliyosemwa bila kuongeza chumvi au makisio.',
        ],
      },
      {
        titleEn: 'Preserving Chain of Custody & Secure Submission to Oversight Organs',
        titleSw: 'Kulinda Mnyororo Salama wa Ushahidi na Kuwasilisha Kwenye Vyombo vya Sheria',
        contentEn: 'Physical and digital evidence must have an unbroken chain of custody. Certified copies should be lodged with the relevant statutory authority while keeping receipted stamped duplicates.',
        contentSw: 'Ushahidi wa kidijitali na nyaraka lazima uhifadhiwe bila kuchezewa. Nakala zilizoidhinishwa lazima zipelekwe kwenye ofisi husika na kubakiza nakala iliyogongwa muhuri.',
        article: 'Article 244 & IPOA Act Sec. 25',
        bulletsEn: [
          'Retain original photo/video files with intact digital metadata (timestamp, GPS coordinates).',
          'Obtain certified hospital P3 medical examination forms for assault cases.',
          'Lodge stamped copies with IPOA (police misconduct), EACC (extortion/bribery), or KNCHR (human rights violations).',
        ],
        bulletsSw: [
          'Hifadhi picha halisi bila kufuta maelezo ya kidijitali (metadata ya muda na eneo).',
          'Pata fomu ya matibabu ya P3 kutoka hospitali ya serikali kwa kesi za kupigwa au kujeruhiwa.',
          'Wasilisha nakala iliyogongwa muhuri kwa IPOA (ukatili wa polisi), EACC (rushwa), au KNCHR (haki za binadamu).',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Chain of Custody',
        sw: 'Mnyororo Salama wa Ushahidi',
        defEn: 'The chronological documentation showing custody, control, and transfer of evidence to guarantee it has not been tampered with.',
        defSw: 'Rekodi inayoonyesha jinsi ushahidi ulivyokusanywa na kukabidhiwa bila kubadilishwa wala kuchafuliwa.',
      },
      {
        en: 'Contemporaneous Evidence',
        sw: 'Ushahidi wa Papo Hapo',
        defEn: 'Records compiled at the exact time of an incident, recognized by courts as highly authentic and credible.',
        defSw: 'Nyaraka zilizoandikwa papo hapo wakati tukio linafanyika zenye thamani kubwa ya kisheria.',
      },
    ],
    actionTipEn: 'Save a standardized incident reporting checklist on your smartphone. In any encounter with misconduct, note down officers’ badge numbers, vehicle plates, exact time, and names of independent eyewitnesses.',
    actionTipSw: 'Hifadhi kiolezo cha ripoti ya tukio kwenye simu yako. Kisa kikitokea, andika nambari za sare za maafisa, nambari ya gari, muda kamili na majina ya mashahidi.',
  },

  // 24. Chapter 1: Sovereignty of the People & Supremacy of the Constitution
  {
    titleEn: 'Chapter 1: Sovereignty of the People & Supremacy of the Constitution (Articles 1-3)',
    titleSw: 'Sura ya 1: Mamlaka Kuu ya Wananchi na Ukuu wa Katiba (Vifungu 1-3)',
    summaryEn: 'Explore the fundamental bedrock of Kenya\'s constitutional democracy: all sovereign power belongs to the people of Kenya, exercised directly or through democratically elected representatives under Articles 1, 2, and 3.',
    summarySw: 'Chunguza msingi mkuu wa demokrasia ya kikatiba ya Kenya: mamlaka yote ya uhuru ni ya wananchi wa Kenya, yakitumiwa moja kwa moja au kupitia wawakilishi waliochaguliwa chini ya Vifungu 1, 2, na 3.',
    category: 'constitution',
    readTimeMinutes: 8,
    sections: [
      {
        titleEn: 'Article 1 & 2: Direct vs Delegated Sovereign Power',
        titleSw: 'Kifungu cha 1 na 2: Mamlaka ya Moja kwa Moja dhidi ya Mamlaka ya Kukasimiwa',
        contentEn: 'Article 1(1) states that all sovereign power belongs to the people of Kenya. The people may exercise their sovereign power either directly (through voting, referenda, public participation, recall) or through their democratically elected representatives in Parliament and County Assemblies. Article 2 confirms that the Constitution is supreme over all persons and state organs.',
        contentSw: 'Kifungu cha 1(1) kinatamka kwamba mamlaka yote ya uhuru ni ya wananchi wa Kenya. Wananchi wanaweza kutumia mamlaka haya moja kwa moja au kupitia wawakilishi wao. Kifungu cha 2 kinathibitisha kuwa Katiba ndiyo sheria kuu zaidi.',
        article: 'Article 1 & 2',
        bulletsEn: [
          'State officers are trustees, not rulers; they exercise power only on behalf of citizens.',
          'Any law, customary practice, or executive decree inconsistent with the Constitution is void to the extent of the inconsistency.',
          'No person may claim or exercise state authority except as authorized under the Constitution.',
        ],
        bulletsSw: [
          'Viongozi wa umma ni wadhamini tu, si watawala; wanatumia mamlaka kwa niaba ya wananchi.',
          'Sheria au amri yoyote inayopingana na Katiba ni batili kisheria.',
          'Hakuna mtu anayeweza kujipa mamlaka ya serikali kinyume na Katiba.',
        ],
      },
      {
        titleEn: 'Article 3: The Civic Duty to Defend the Constitution',
        titleSw: 'Kifungu cha 3: Wajibu wa Raia Kulinda na Kutetea Katiba',
        contentEn: 'Article 3 imposes an active obligation on every citizen to respect, uphold, and defend the Constitution. Any attempt to establish a government otherwise than in compliance with this Constitution is unlawful.',
        contentSw: 'Kifungu cha 3 kinaweka wajibu kwa kila mwananchi kuiheshimu na kuitetea Katiba. Jaribio lolote la kuanzisha serikali kinyume na Katiba ni kosa la uhaini.',
        article: 'Article 3',
        bulletsEn: [
          'Citizens have a legal right and patriotic duty to resist unconstitutional orders.',
          'Constitutional defense encompasses attending barazas, voting, and peaceful assembly under Article 37.',
          'Civil society and community leaders have a duty to educate citizens on their sovereign rights.',
        ],
        bulletsSw: [
          'Mwananchi ana haki na wajibu wa kikatiba wa kupinga maagizo haramu yanayokiuka Katiba.',
          'Kulinda Katiba kunajumuisha kushiriki mabaraza, kupiga kura na kuandamana kwa amani.',
          'Viongozi wa jamii wana wajibu wa kuelimisha wananchi kuhusu mamlaka yao kuu.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Popular Sovereignty',
        sw: 'Mamlaka ya Wananchi',
        defEn: 'The constitutional doctrine that the legitimacy of the state is created and sustained by the will and consent of its people.',
        defSw: 'Kanuni kwamba mamlaka ya serikali yanatoka kwa ridhaa na maamuzi ya wananchi.',
      },
      {
        en: 'Constitutional Supremacy',
        sw: 'Ukuu wa Katiba',
        defEn: 'The legal status placing the Constitution above all other legislation, court decisions, and executive proclamations.',
        defSw: 'Nafasi ya kisheria inayoweka Katiba juu ya sheria zote na amri zote za serikali.',
      },
    ],
    actionTipEn: 'Remember in every civic engagement: You are the sovereign employer of elected leaders. Demand accountability and cite Article 1 and 2 in your community memoranda.',
    actionTipSw: 'Kumbuka kila wakati: Wewe ndiye mwenye mamlaka mkuu uliyewaajiri viongozi. Dai uwajibikaji na unukuu Kifungu cha 1 na 2 kwenye barua zako.',
  },

  // 25. Chapter 2: The Republic & National Values
  {
    titleEn: 'Chapter 2: The Republic & Article 10 National Values of Governance (Articles 4-11)',
    titleSw: 'Sura ya 2: Jamhuri na Maadili ya Kitaifa ya Utawala (Kifungu 10 & Vifungu 4-11)',
    summaryEn: 'Deep dive into Kenya\'s national character and Article 10 national values: patriotism, rule of law, democracy, human dignity, social justice, equity, integrity, transparency, accountability, and sustainable development.',
    summarySw: 'Chambua muundo wa Jamhuri ya Kenya na maadili ya kitaifa ya Kifungu cha 10: uzalendo, utawala wa sheria, demokrasia, utu, haki ya kijamii, usawa, uadilifu, uwazi, uwajibikaji, na maendeleo endelevu.',
    category: 'constitution',
    readTimeMinutes: 8,
    sections: [
      {
        titleEn: 'The Binding Legal Effect of Article 10',
        titleSw: 'Nguvu ya Kisheria ya Maadili ya Kitaifa (Kifungu cha 10)',
        contentEn: 'Article 10 binds all State organs, State officers, public officers, and all persons whenever any of them applies or interprets the Constitution, enacts, applies, or interprets any law, or makes or implements public policy decisions.',
        contentSw: 'Kifungu cha 10 kinabana vyombo vyote vya dola, viongozi na wananchi wote wanapotumia au kufafanua Katiba, kutunga sheria, au kutekeleza sera za umma.',
        article: 'Article 10(1) & 10(2)',
        bulletsEn: [
          'Patriotism, national unity, sharing and devolution of power, rule of law, democracy, and participation of the people.',
          'Human dignity, equity, social justice, inclusiveness, equality, human rights, non-discrimination, and protection of the marginalised.',
          'Good governance, integrity, transparency, accountability, and sustainable development.',
        ],
        bulletsSw: [
          'Uzalendo, umoja wa kitaifa, ugatuzi wa mamlaka, utawala wa sheria, demokrasia, na ushiriki wa wananchi.',
          'Utu wa mwanadamu, usawa, haki ya kijamii, kujumuisha wote, haki za binadamu, kutobagua, na kulinda wanyonge.',
          'Utawala bora, uadilifu, uwazi, uwajibikaji, na maendeleo endelevu.',
        ],
      },
      {
        titleEn: 'Enforcing Article 10 in Court & Public Administration',
        titleSw: 'Kutekeleza Kifungu cha 10 Mahakamani na Katika Utawala wa Umma',
        contentEn: 'Courts have repeatedly struck down laws and policies passed without genuine public participation or violating equality principles, confirming Article 10 is directly justiciable and enforceable.',
        contentSw: 'Mahakama zimefuta mara nyingi sheria na sera zilizopitishwa bila ushiriki wa kweli wa wananchi, ikithibitisha kwamba Kifungu cha 10 kina nguvu kamili ya kisheria.',
        article: 'Article 10 & High Court Jurisprudence',
        bulletsEn: [
          'Any government decision made without transparency or public participation is vulnerable to constitutional quashing.',
          'Appointments that fail to reflect ethnic, regional, gender, and disability diversity violate Article 10.',
          'Citizens can cite Article 10 to demand reasons for administrative actions affecting their welfare.',
        ],
        bulletsSw: [
          'Uamuzi wowote wa serikali unaofanywa bila uwazi au ushiriki wa wananchi unaweza kufutwa na Mahakama Kuu.',
          'Uteuzi wa kazi za umma usiozingatia usawa wa kikanda, kijinsia na walemavu unakiuka Kifungu cha 10.',
          'Wananchi wanaweza kutumia Kifungu cha 10 kudai maelezo ya kina kuhusu maamuzi ya serikali.',
        ],
      },
    ],
    keyTerms: [
      {
        en: 'Justiciability of Values',
        sw: 'Nguvu ya Kisheria ya Maadili',
        defEn: 'The legal rule that constitutional values in Article 10 are not mere aspirations but enforceable legal standards in Kenyan courts.',
        defSw: 'Kanuni kwamba maadili ya Kifungu cha 10 si maneno tu bali ni sheria kamili zinazoweza kutekelezwa kortini.',
      },
      {
        en: 'Substantive Public Participation',
        sw: 'Ushiriki wa Dhati wa Umma',
        defEn: 'Meaningful, well-informed engagement where citizen input is genuinely considered before decisions are finalized.',
        defSw: 'Ushiriki halisi ambapo maoni ya wananchi yanasikilizwa na kupewa uzito kabla ya uamuzi kufanywa.',
      },
    ],
    actionTipEn: 'Audit county development plans against Article 10 values! If an infrastructure project excludes women, youth, or PWDs, challenge it formally using Article 10 equity provisions.',
    actionTipSw: 'Kagua mipango ya kaunti kwa kutumia maadili ya Kifungu cha 10! Mradi ukibagua wanawake, vijana au walemavu, upinge kisheria kwa misingi ya usawa.',
  },
];

/**
 * Normalizes a lesson title to pure lowercase alphanumerics for comparison.
 */
export function normalizeCivicTitle(title: string | { en: string; sw?: string }): string {
  const text = typeof title === 'string' ? title : title?.en || '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if a candidate title already exists among existing courses.
 * Compares both English and Swahili titles with high fidelity to prevent any repetition.
 */
export function isCivicLessonDuplicate(
  candidateTitle: string | { en: string; sw?: string },
  existingCourses: CivicLesson[]
): boolean {
  const normEn = normalizeCivicTitle(candidateTitle);
  const normSw = typeof candidateTitle === 'object' && candidateTitle.sw ? normalizeCivicTitle(candidateTitle.sw) : '';
  if (!normEn && !normSw) return false;

  return existingCourses.some((c) => {
    const existingNormEn = normalizeCivicTitle(c.title);
    const existingNormSw = normalizeCivicTitle(typeof c.title === 'object' ? c.title.sw || '' : '');
    if (normEn && (existingNormEn === normEn || existingNormSw === normEn)) return true;
    if (normSw && (existingNormEn === normSw || existingNormSw === normSw)) return true;
    return false;
  });
}

/**
 * Procedural generator for infinite daily drops beyond templates with GUARANTEED NON-REPETITION.
 * Checks occupiedTitles and chooses an untouched civic specialization.
 */
function generateProceduralDailyCourse(
  dateStr: string,
  indexInDay: number,
  lessonNum: number,
  occupiedTitles: Set<string>
): CivicLesson {
  const categories: CivicLesson['category'][] = ['constitution', 'devolution', 'human_rights', 'participation', 'integrity', 'government', 'elections'];
  const cat = categories[(lessonNum + indexInDay) % categories.length];

  const proceduralPool = [
    {
      en: 'County Assembly Oversight Committees & Summons Powers',
      sw: 'Kamati za Bunge la Kaunti za Uangalizi na Mamlaka ya Kuitisha Maafisa',
      sumEn: 'How MCAs on Public Accounts and Investments Committees question department executive directors on unverified expenditures.',
      sumSw: 'Jinsi madiwani katika Kamati za Hesabu za Umma wanavyohoji mawaziri wa kaunti kuhusu matumizi yenye shaka.',
    },
    {
      en: 'Public Benefit Organizations (PBO) Act & Community Groups in Kenya',
      sw: 'Sheria ya Mashirika ya Kijamii (PBO) na Vikundi vya Mashinani Nchini Kenya',
      sumEn: 'Statutory registration, operational freedoms, and funding protections for grassroots community-based organizations under PBO Act.',
      sumSw: 'Usajili wa kisheria, uhuru wa utendaji na ulinzi wa fedha za vikundi vya kijamii chini ya Sheria ya PBO.',
    },
    {
      en: 'Article 38 Political Rights: Independent Candidates & Fair Nominations',
      sw: 'Kifungu cha 38 Haki za Kisiasa: Wagombea Binafsi na Mchujo Huru',
      sumEn: 'The constitutional freedoms of every citizen to vie as an independent candidate and demand transparent party primaries.',
      sumSw: 'Haki ya kikatiba ya kila mwananchi kuwania uongozi bila chama na kudai kura ya mchujo ya haki na uwazi.',
    },
    {
      en: 'County Spatial Planning & Protecting Public Commons & Access Corridors',
      sw: 'Mipango ya Anga ya Kaunti na Kulinda Njia za Umma na Maeneo ya Jamii',
      sumEn: 'How citizens across Kenya can assert historical easements and legally preserve public rights of way, riparian reserves, and community commons.',
      sumSw: 'Jinsi wananchi kote nchini Kenya wanavyoweza kulinda kisheria njia za umma, mito na maeneo ya wazi bila kuzuiwa.',
    },
    {
      en: 'Article 201 Public Finance Principles: Fiscal Responsibility & Intergenerational Equity',
      sw: 'Kifungu cha 201 Misingi ya Fedha za Umma: Uwajibikaji na Haki ya Vizazi Vijavyo',
      sumEn: 'Constitutional mandates ensuring borrowing does not burden future generations and revenue is shared equitably.',
      sumSw: 'Misingi ya kikatiba inayohakikisha mikopo haiumizi vizazi vijavyo na kwamba mapato yanagawanywa kwa usawa.',
    },
    {
      en: 'Judicial Review & Article 22: Challenging Unconstitutional County Bylaws',
      sw: 'Ukaguzi wa Mahakama na Kifungu cha 22: Kupinga Sheria Haramu za Kaunti',
      sumEn: 'Step-by-step citizen legal actions to obtain High Court orders of Certiorari, Prohibition, and Mandamus against bad public decisions.',
      sumSw: 'Hatua za kisheria za wananchi kuomba amri za Mahakama Kuu kufuta maamuzi mabovu au sheria kandamizi za kaunti.',
    },
    {
      en: 'Disaster Risk Management & Ward Emergency Response Funds',
      sw: 'Usimamizi wa Maafa na Hazina za Dharura za Wadi za Kaunti',
      sumEn: 'How emergency relief food and flood reconstruction funds must be accounted for openly without political diversion.',
      sumSw: 'Jinsi chakula cha msaada na fedha za dharura za mafuriko zinavyopaswa kusambazwa kwa uwazi bila siasa.',
    },
    {
      en: 'Youth and Women Access to Government Procurement Opportunities (AGPO) Certification',
      sw: 'Uthibitisho wa AGPO kwa Vijana na Wanawake Kupata Zabuni za Serikali',
      sumEn: 'How to register a youth enterprise, obtain tax compliance certificates, and bid for 30% reserved county tenders.',
      sumSw: 'Jinsi ya kusajili biashara ya vijana, kupata cheti cha KRA na kuomba zabuni za asilimia 30 zilizotengwa na kaunti.',
    },
    // Dedicated Human Rights Advocacy Modules
    {
      en: 'Grassroots Human Rights Advocacy: Community Paralegal Defense & Protection',
      sw: 'Utetezi wa Haki za Binadamu Mashinani: Usaidizi wa Kisheria na Ulinzi wa Jamii',
      sumEn: 'How community paralegals organize legal aid clinics, monitor local violations, and coordinate rapid response protection for vulnerable residents.',
      sumSw: 'Jinsi wasaidizi wa kisheria wanavyoendesha kliniki za msaada wa kisheria, kufuatilia ukiukaji wa haki, na kulinda wanyonge mashinani.',
    },
    {
      en: 'Public Interest Litigation (PIL): Filing Constitutional Petitions under Article 22',
      sw: 'Kesi kwa Maslahi ya Umma (PIL): Kuwasilisha Maombi ya Kikatiba chini ya Kifungu cha 22',
      sumEn: 'The procedural blueprint for citizens to institute High Court petitions defending communal water, land, and environmental rights without court fees.',
      sumSw: 'Mwongozo wa wananchi kufungua kesi Mahakama Kuu kulinda haki za maji, ardhi na mazingira bila kizuizi cha ada za mahakama.',
    },
    {
      en: 'Human Rights Advocacy for Persons with Disabilities and Marginalized Communities',
      sw: 'Utetezi wa Haki za Binadamu kwa Watu Wenye Ulemavu na Jamii Zilizotengwa',
      sumEn: 'Practical strategies to audit public accessibility, demand Article 54 employment quotas, and petition NCPWD for assistive devices.',
      sumSw: 'Mbinu za kutathmini majengo ya umma, kudai nafasi za kazi za asilimia 5, na kushirikiana na NCPWD kupata vifaa saidizi.',
    },
    // Dedicated Social Media for Peace Modules
    {
      en: 'Using Social Media as a Narrative Tool for Peace: Countering Online Disinformation',
      sw: 'Kutumia Mitandao ya Kijamii Kujenga Amani: Kukabili Uzushi na Propaganda za Mtandaoni',
      sumEn: 'How youth leaders and civic educators can build digital peacebuilding campaigns, verify viral claims, and de-escalate tensions on WhatsApp and TikTok.',
      sumSw: 'Jinsi viongozi wa vijana wanavyoweza kuendesha kampeni za amani mitandaoni, kuhakiki habari, na kutuliza uhasama kwenye vikundi vya kidijitali.',
    },
    {
      en: 'Digital Peacebuilding & Cross-County Youth Dialogues on Social Media',
      sw: 'Mshikamano wa Kidijitali na Mazungumzo ya Vijana wa Kaunti Mbalimbali Mtandaoni',
      sumEn: 'Cultivating digital empathy and cross-ethnic unity through collaborative storytelling and peace narrative hashtags.',
      sumSw: 'Kujenga maelewano na umoja wa kikabila kupitia masimulizi chanya ya vijana na kampeni za amani mtandaoni.',
    },
    {
      en: 'Fact-Checking Public Accounts & Demystifying Government Propaganda Online',
      sw: 'Kuhakiki Ukweli wa Hesabu za Serikali na Kufichua Taarifa za Upotoshaji Mtandaoni',
      sumEn: 'Using open-source government portals, budget circulars, and Auditor-General reports to counter false political narratives on social media.',
      sumSw: 'Kutumia ripoti rasmi za Mkaguzi Mkuu na nyaraka za bajeti kutoa ukweli unaopinga uvumi na uzushi wa kisiasa mtandaoni.',
    },
    // Dedicated Incident Reporting Modules
    {
      en: 'How to Write an Incident Report: Evidentiary Standards & IPOA Police Misconduct Inquiries',
      sw: 'Jinsi ya Kuandika Ripoti ya Tukio: Viwango vya Ushahidi na Ukatili wa Jeshi la Polisi',
      sumEn: 'Step-by-step documentation of arbitrary arrests, uniform badge numbers, exact timestamps, and filing formal complaints with IPOA and KNCHR.',
      sumSw: 'Mwongozo wa kuandika ripoti ya kukamatwa kiholela, kurekodi nambari za polisi, tarehe, na kuwasilisha kwa IPOA na KNCHR.',
    },
    {
      en: 'Preserving Digital Evidence & Chain of Custody for Human Rights Incident Reports',
      sw: 'Kulinda Ushahidi wa Kidijitali na Mlolongo wa Ushahidi katika Ripoti za Matukio',
      sumEn: 'How to preserve video and photo EXIF metadata, secure witness audio recordings, and maintain tamper-proof logs admissible under the Evidence Act.',
      sumSw: 'Jinsi ya kuhifadhi picha na video bila kufuta metadata ya muda na GPS ili zikubalike mahakamani chini ya Sheria ya Ushahidi.',
    },
    {
      en: 'Drafting an Anti-Corruption Incident Report for EACC & Whistleblower Portals',
      sw: 'Kuandika Ripoti ya Tukio la Rushwa kwa ajili ya EACC na Mifumo ya Kutoa Taarifa',
      sumEn: 'How to compile factual, unembellished records of extortion, bribery demands, or tender irregularities for statutory anti-corruption probes.',
      sumSw: 'Jinsi ya kuandika ushahidi kamili wa madai ya hongo au ukiukaji wa zabuni kwa ajili ya uchunguzi wa Tume ya Maadili (EACC).',
    },
    // Entire Constitution of Kenya 2010 Chapters (Nationwide across The Republic of Kenya)
    {
      en: 'Chapter 3: Kenyan Citizenship Rights, Dual Nationality & Civil Registration (Articles 12-18)',
      sw: 'Sura ya 3: Uraia wa Kenya, Uraia wa Nchi Mbili na Usajili wa Raia (Vifungu 12-18)',
      sumEn: 'The constitutional protection against deprivation of citizenship by birth, dual nationality rights, and demanding birth certificates and ID cards without discrimination.',
      sumSw: 'Haki ya kikatiba ya kutonyanganywa uraia wa kuzaliwa, uraia wa nchi mbili, na kupata vitambulisho na vyeti vya kuzaliwa bila ubaguzi.',
    },
    {
      en: 'Chapter 4: The Bill of Rights - Non-Derogable Rights & Emergency Safeguards (Articles 19-25)',
      sw: 'Sura ya 4: Hati ya Haki - Haki Zisizoweza Kusitishwa Hata Wakati wa Hali ya Hatari (Vifungu 19-25)',
      sumEn: 'Absolute protection from torture, slavery, unfair trials, and detention without habeas corpus guarantees across Kenya.',
      sumSw: 'Ulinzi kamili dhidi ya mateso, utumwa, kesi zisizo za haki na haki ya kuletwa kortini mara moja (habeas corpus) kote nchini Kenya.',
    },
    {
      en: 'Chapter 4: Economic and Social Rights under Article 43: Healthcare, Water, Food & Sanitation',
      sw: 'Sura ya 4: Haki za Kiuchumi na Kijamii chini ya Kifungu cha 43: Afya, Maji, Chakula na Makazi',
      sumEn: 'How citizens in all 47 counties can cite Article 43 to demand essential medicines, clean piped water, dignified sanitation, and social safety nets.',
      sumSw: 'Jinsi wananchi katika kaunti zote 47 wanavyoweza kutumia Kifungu cha 43 kudai dawa hospitalini, maji safi na makazi bora.',
    },
    {
      en: 'Chapter 4: Fair Administrative Action & Reasoned Decision Notices (Article 47)',
      sw: 'Sura ya 4: Utawala wa Haki na Haki ya Kupewa Sababu za Kimaandishi (Kifungu 47)',
      sumEn: 'The legal duty of every public office to give written reasons within reasonable time when administrative actions adversely affect citizens.',
      sumSw: 'Wajibu wa kisheria wa kila afisa wa serikali kutoa sababu kwa maandishi anapofanya uamuzi unaomwathiri mwananchi.',
    },
    {
      en: 'Chapter 5: Land Policy & Protecting Public, Community and Private Holdings (Articles 60-68)',
      sw: 'Sura ya 5: Sera ya Ardhi na Kulinda Ardhi ya Umma, Jamii na Kibinafsi (Vifungu 60-68)',
      sumEn: 'Constitutional land tenure principles, National Land Commission audits, and stopping unlawful conversion of public lands across Kenya.',
      sumSw: 'Misingi ya umiliki wa ardhi kikatiba, uchunguzi wa Tume ya NLC na kuzuia unyakuzi wa ardhi za umma na jamii kote nchini.',
    },
    {
      en: 'Chapter 5: Environment & Natural Resources: Enforcing Article 70 Citizen Remedies',
      sw: 'Sura ya 5: Mazingira na Maliasili: Hatua za Kisheria za Wananchi chini ya Kifungu cha 70',
      sumEn: 'How any person can petition courts to stop ecological destruction and chemical dumping without having to demonstrate personal loss.',
      sumSw: 'Jinsi mwananchi yeyote anavyoweza kuomba amri ya mahakama kuzuia uharibifu wa mazingira bila kulazimika kuonyesha hasara binafsi.',
    },
    {
      en: 'Chapter 6: Leadership and Integrity: Public Trust & Citizen Vetting of Officers (Articles 73-80)',
      sw: 'Sura ya 6: Uongozi na Uadilifu: Dhamana ya Umma na Wananchi Kuwakagua Viongozi (Vifungu 73-80)',
      sumEn: 'Citizen mechanisms to challenge ethically tainted appointments, demand conflict of interest disclosures, and petition for impeachment.',
      sumSw: 'Mbinu za wananchi kupinga uteuzi wa viongozi wasio na maadili, kudai uwazi wa maslahi binafsi na kuwawajibisha kisheria.',
    },
    {
      en: 'Chapter 7: Representation of the People: Universal Suffrage & Electoral Audits (Articles 81-92)',
      sw: 'Sura ya 7: Uwakilishi wa Wananchi: Haki ya Kupiga Kura na Ukaguzi wa Uchaguzi (Vifungu 81-92)',
      sumEn: 'Voter registration rights, polling station scrutiny, two-thirds gender rule compliance, and independent candidates under Article 88.',
      sumSw: 'Haki ya kujiandikisha kupiga kura, kulinda kura vituoni, kanuni ya thuluthi mbili ya jinsia na wagombea binafsi.',
    },
    {
      en: 'Chapter 8: The Legislature: Bicameral Lawmaking & Article 118 Public Hearings (Articles 93-128)',
      sw: 'Sura ya 8: Bunge la Taifa na Seneti: Utungaji wa Sheria na Mikutano ya Umma (Vifungu 93-128)',
      sumEn: 'How the Senate and National Assembly deliberate bills and why laws passed without public participation are null and void.',
      sumSw: 'Jinsi Bunge la Kitaifa na Seneti yanavyotunga sheria na kwa nini sheria inayopitishwa bila ushiriki wa wananchi ni batili kisheria.',
    },
    {
      en: 'Chapter 9: The Executive: Presidential Authority, Cabinet & ODPP Independence (Articles 129-158)',
      sw: 'Sura ya 9: Mhimili wa Utendaji: Mamlaka ya Rais, Baraza la Mawaziri na Uhuru wa ODPP (Vifungu 129-158)',
      sumEn: 'The constitutional boundaries of presidential decrees, Cabinet Secretary vetting, and independent prosecution under Article 157.',
      sumSw: 'Mipaka ya kikatiba ya amri za utendaji za Rais, msasa wa mawaziri bungeni na uhuru wa Mkurugenzi wa Mashtaka ya Umma.',
    },
    {
      en: 'Chapter 10: The Judiciary: Judicial Authority & Alternative Dispute Resolution (Articles 159-173)',
      sw: 'Sura ya 10: Mahakama: Mamlaka ya Kutoa Haki na Utatuzi Mbadala wa Migogoro (Vifungu 159-173)',
      sumEn: 'Article 159 principles that judicial authority belongs to the people, justice shall not be delayed, and traditional dispute resolution must respect human rights.',
      sumSw: 'Misingi ya Kifungu cha 159 kwamba mamlaka ya mahakama yanatoka kwa wananchi, haki isicheleweshwe na upatanishi wa amani uheshimu utu.',
    },
    {
      en: 'Chapter 11: Devolved Government: Objects of Devolution & County Assemblies (Articles 174-200)',
      sw: 'Sura ya 11: Serikali za Kaunti: Madhumuni ya Ugatuzi na Mabunge ya Kaunti (Vifungu 174-200)',
      sumEn: 'Empowering communities through 47 devolved county governments, ward-level representation, and intergovernmental relations across Kenya.',
      sumSw: 'Kuwawezesha wananchi kupitia serikali 47 za kaunti, uwakilishi wa wodi na ushirikiano wa kitaifa na ugatuzi nchini Kenya.',
    },
    {
      en: 'Chapter 12: Public Finance: Article 201 Principles & National Equitable Sharing (Articles 201-231)',
      sw: 'Sura ya 12: Fedha za Umma: Misingi ya Kifungu cha 201 na Mgawanyo Sawa wa Mapato (Vifungu 201-231)',
      sumEn: 'Tracking the Division of Revenue Act, County Allocation of Revenue Act (CARA), Controller of Budget quarterly releases, and Auditor-General reports.',
      sumSw: 'Kufuatilia Sheria ya Mgawanyo wa Mapato (CARA), idhini ya Mdhibiti wa Bajeti na ripoti za kila robo mwaka za matumizi ya fedha.',
    },
    {
      en: 'Chapter 13: Values and Principles of Public Service & Meritocracy (Article 232)',
      sw: 'Sura ya 13: Maadili na Misingi ya Utumishi wa Umma na Ajira kwa Uwezo (Kifungu 232)',
      sumEn: 'How citizens can demand merit-based recruitment, transparent promotions, and ethical public administration across all 47 counties.',
      sumSw: 'Jinsi wananchi wanavyoweza kudai ajira zenye usawa, kupinga upendeleo na kuhakikisha watumishi wa umma wanatoa huduma bora.',
    },
    {
      en: 'Chapter 14: National Security Principles & Democratic Civilian Oversight (Articles 238-247)',
      sw: 'Sura ya 14: Usalama wa Taifa na Usimamizi wa Kidemokrasia wa Wananchi (Vifungu 238-247)',
      sumEn: 'The constitutional doctrine that national security must respect democracy, human rights, and the rule of law under civilian authority.',
      sumSw: 'Misingi ya kikatiba kwamba vyombo vya usalama lazima viheshimu haki za binadamu, utawala wa sheria na mamlaka ya kiraia.',
    },
    {
      en: 'Chapter 15: Independent Commissions & Offices: Guardians of Constitutional Sovereignty (Articles 248-254)',
      sw: 'Sura ya 15: Tume Huru na Ofisi Huru: Walinzi wa Mamlaka ya Wananchi (Vifungu 248-254)',
      sumEn: 'How independent commissions (KNCHR, CAJ, EACC, CRA, SRC) protect the public from executive overreach and guarantee constitutional compliance.',
      sumSw: 'Jinsi tume huru za kikatiba zinavyomlinda mwananchi dhidi ya unyanyasaji wa wakuu na kuhakikisha uzingatiaji wa Katiba.',
    },
    {
      en: 'Chapter 16: Amendment of the Constitution: Popular Initiative Safeguards (Articles 255-257)',
      sw: 'Sura ya 16: Marekebisho ya Katiba: Ulinzi wa Mpango wa Wananchi na Kura ya Maoni (Vifungu 255-257)',
      sumEn: 'The rigorous legal thresholds required to amend protected clauses, 1 million voter signatures, and approval by 24 County Assemblies.',
      sumSw: 'Masharti magumu ya kisheria ya kurekebisha Katiba, sahihi milioni moja za wapiga kura na idhini ya mabunge ya kaunti 24.',
    },
    {
      en: 'Chapter 17: General Provisions & Citizen Standing to Enforce the Constitution (Article 258)',
      sw: 'Sura ya 17: Masharti ya Jumla na Haki Kamili ya Mwananchi Kulinda Katiba (Kifungu 258)',
      sumEn: 'Article 258 open standing: Every Kenyan has the inalienable legal right to institute court proceedings to defend the Constitution without proving personal loss.',
      sumSw: 'Kifungu cha 258: Kila mwananchi wa Kenya ana haki kamili ya kufungua kesi mahakamani kutetea Katiba bila kulazimika kuonyesha aliumia binafsi.',
    },
  ];

  // Find a topic from proceduralPool whose normalized title is not yet occupied
  let chosenTopic = proceduralPool.find((tp) => !occupiedTitles.has(normalizeCivicTitle(tp.en)));

  // If all are occupied, generate an advanced specialized topic with lessonNum differentiation so it NEVER repeats
  if (!chosenTopic) {
    const baseTopic = proceduralPool[(lessonNum + indexInDay) % proceduralPool.length];
    chosenTopic = {
      en: `${baseTopic.en} (Advanced Civic Action Series #${lessonNum})`,
      sw: `${baseTopic.sw} (Mfululizo wa Juu wa Utekelezaji #${lessonNum})`,
      sumEn: `${baseTopic.sumEn} This module provides practical citizen implementation strategies for advanced devolution accountability.`,
      sumSw: `${baseTopic.sumSw} Somo hili linatoa mbinu za kiutendaji za wananchi za kuimarisha ugatuzi na uwajibikaji.`,
    };
  }

  const lesson: CivicLesson = {
    id: `daily_${dateStr.replace(/-/g, '')}_${lessonNum}`,
    lessonNumber: lessonNum,
    title: {
      en: chosenTopic.en,
      sw: chosenTopic.sw,
    },
    summary: {
      en: chosenTopic.sumEn,
      sw: chosenTopic.sumSw,
    },
    category: cat,
    readTimeMinutes: 9,
    isDailyCourse: true,
    publishedDate: dateStr,
    dayBadge: `Daily Drop #${lessonNum}`,
    sections: [
      {
        id: 'sec_1',
        title: {
          en: 'Constitutional Anchoring & Legal Mandates',
          sw: 'Msingi wa Kikatiba na Agizo la Kisheria',
        },
        content: {
          en: `This course examines the practical citizen tools for "${chosenTopic.en}". Under the Constitution of Kenya 2010, power is exercised for the benefit of citizens, anchored on national values of equity, public participation, and transparency.`,
          sw: `Somo hili linafafanua njia za kisheria za wananchi kuhusu "${chosenTopic.sw}". Chini ya Katiba ya Kenya 2010, mamlaka yote yanatumiwa kwa manufaa ya wananchi kwa misingi ya uwazi na haki.`,
        },
        constitutionalArticle: 'Article 10, Article 35 & Fourth Schedule',
        bulletPoints: {
          en: [
            'All public departments must publish operational guidelines and budget expenditure allocations.',
            'Citizens are constitutionally entitled to submit petitions, attend oversight committee hearings, and demand accountability.',
            'Decisions made without public consultation are subject to judicial review and constitutional nullification.',
          ],
          sw: [
            'Idara zote za serikali lazima ziweke wazi miongozo ya utendaji na bajeti zao.',
            'Wananchi wana haki ya kisheria ya kuwasilisha maombi na kuhudhuria vikao vya bunge.',
            'Maamuzi yoyote yanayofanywa bila kushauri wananchi yanaweza kufutwa na Mahakama Kuu.',
          ],
        },
      },
      {
        id: 'sec_2',
        title: {
          en: 'Citizen Oversight & Community Implementation',
          sw: 'Usimamizi wa Mwananchi na Utekelezaji Jamii',
        },
        content: {
          en: 'Constitutional democracy requires continuous community vigilance. By organizing structured citizen groups and using standard administrative petitions, citizens across The Republic of Kenya achieve long-term public service delivery.',
          sw: 'Demokrasia ya kikatiba inahitaji ufuatiliaji endelevu wa wananchi. Kwa kujiunga kwenye vikundi na kuandika barua rasmi, wananchi kote nchini Kenya wanafanikisha maendeleo ya kweli.',
        },
        bulletPoints: {
          en: [
            'Form community monitoring teams to inspect ongoing infrastructure projects.',
            'Document anomalies with photographs and dates, citing relevant statutory clauses.',
            'Present unified community resolutions to your Area MCA, Ward Administrator, and Sub-County Director.',
          ],
          sw: [
            'Unda kamati za ufuatiliaji za kijiji kukagua miradi inayoendelea.',
            'Piga picha na rekodi tarehe na kasoro zote zilizopo ukitaja sheria husika.',
            'Wasilisha maazimio ya pamoja ya kijiji kwa Diwani, Msimamizi wa Wadi na Mkurugenzi.',
          ],
        },
      },
    ],
    keyTerms: [
      {
        term: { en: 'Constitutionalism', sw: 'Utawala wa Kikatiba' },
        definition: {
          en: 'The principle that government authority is strictly derived from and limited by the Constitution.',
          sw: 'Kanuni kwamba mamlaka ya serikali yanatoka na kuwekewa mipaka na Katiba pekee.',
        },
      },
      {
        term: { en: 'Social Audit', sw: 'Ukaguzi wa Kijamii' },
        definition: {
          en: 'A process where community members directly review government project records and physical work on the ground.',
          sw: 'Mchakato ambapo wananchi wenyewe wanakagua rekodi za serikali na ubora wa mradi uwanjani.',
        },
      },
    ],
    citizenActionTip: {
      en: 'Schedule a quarterly community review baraza in your village to assess public projects and draft action items for your Ward Administrator.',
      sw: 'Panga baraza la kila robo mwaka kijijini mwenu kutathmini miradi ya serikali na kukabidhi maoni kwa msimamizi wa wodi.',
    },
  };

  lesson.quizzes = getCourseQuizQuestions(lesson.id, lesson.title, lesson.category);
  return lesson;
}

/**
 * Builds courses for a specific date with guaranteed unique, non-colliding lesson numbers
 * AND strictly avoids repeating any lesson topic already covered anywhere in the curriculum.
 */
function buildCoursesForDate(
  dateStr: string,
  assignedLessonNumbers: number[],
  existingDailyCourses: CivicLesson[] = []
): CivicLesson[] {
  const result: CivicLesson[] = [];
  const supplementary = getSupplementaryCourses();

  // Aggregate all occupied lesson titles across Foundational, Supplementary, and existing Daily courses
  const occupiedTitles = new Set<string>();
  lessonsData.forEach((l) => occupiedTitles.add(normalizeCivicTitle(l.title)));
  supplementary.forEach((s) => occupiedTitles.add(normalizeCivicTitle(s.title)));
  existingDailyCourses.forEach((c) => occupiedTitles.add(normalizeCivicTitle(c.title)));

  for (let i = 0; i < assignedLessonNumbers.length; i++) {
    const lessonNum = assignedLessonNumbers[i];

    // Find the next blueprint from DAILY_COURSE_TEMPLATES that hasn't been used yet
    let chosenTemplate = DAILY_COURSE_TEMPLATES.find((tpl) => !occupiedTitles.has(normalizeCivicTitle(tpl.titleEn)));

    if (chosenTemplate) {
      occupiedTitles.add(normalizeCivicTitle(chosenTemplate.titleEn));
      const courseId = `daily_${dateStr.replace(/-/g, '')}_${lessonNum}`;
      const lesson: CivicLesson = {
        id: courseId,
        lessonNumber: lessonNum,
        title: { en: chosenTemplate.titleEn, sw: chosenTemplate.titleSw },
        summary: { en: chosenTemplate.summaryEn, sw: chosenTemplate.summarySw },
        category: chosenTemplate.category,
        readTimeMinutes: chosenTemplate.readTimeMinutes,
        isDailyCourse: true,
        publishedDate: dateStr,
        dayBadge: `Today's Drop • ${dateStr}`,
        sections: chosenTemplate.sections.map((sec, sIdx) => ({
          id: `sec_${sIdx + 1}`,
          title: { en: sec.titleEn, sw: sec.titleSw },
          content: { en: sec.contentEn, sw: sec.contentSw },
          constitutionalArticle: sec.constitutionalArticle || sec.article,
          bulletPoints: { en: sec.bulletsEn, sw: sec.bulletsSw },
        })),
        keyTerms: chosenTemplate.keyTerms.map((kt) => ({
          term: { en: kt.en, sw: kt.sw },
          definition: { en: kt.defEn, sw: kt.defSw },
        })),
        citizenActionTip: {
          en: chosenTemplate.actionTipEn,
          sw: chosenTemplate.actionTipSw,
        },
      };

      lesson.quizzes = getCourseQuizQuestions(courseId, lesson.title, lesson.category);
      result.push(lesson);
    } else {
      // If all 20+ templates have been used, generate procedural lesson with guaranteed unique topic
      const procLesson = generateProceduralDailyCourse(dateStr, i, lessonNum, occupiedTitles);
      occupiedTitles.add(normalizeCivicTitle(procLesson.title));
      result.push(procLesson);
    }
  }

  return result;
}

/**
 * Returns today's ISO date string in YYYY-MM-DD.
 */
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

const CUSTOM_LESSONS_STORAGE_KEY = 'the_samaritan_custom_lessons_v1';

/**
 * Retrieves all administrator-created supplementary courses
 */
export function getSupplementaryCourses(): CivicLesson[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LESSONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((c: any) => c.isPublished !== false);
    }
  } catch (err) {
    console.error('Failed to load custom supplementary courses:', err);
  }
  return [];
}

/**
 * Finds the next N unique available lesson numbers starting from 11 that are NOT
 * taken by any foundational lesson or uploaded supplementary course.
 */
export function getNextAvailableLessonNumbers(count: number, currentDailyCourses: CivicLesson[] = []): number[] {
  const occupied = new Set<number>();

  // 1. Foundational lessons (1-10)
  lessonsData.forEach((l) => occupied.add(l.lessonNumber));

  // 2. Administrator-uploaded Supplementary courses (Must NEVER be collided with)
  const supplementary = getSupplementaryCourses();
  supplementary.forEach((s) => occupied.add(s.lessonNumber));

  // 3. Existing daily courses
  currentDailyCourses.forEach((c) => occupied.add(c.lessonNumber));

  const available: number[] = [];
  let candidate = 11;
  while (available.length < count) {
    if (!occupied.has(candidate)) {
      available.push(candidate);
      occupied.add(candidate); // Reserve for this generation batch
    }
    candidate++;
  }

  return available;
}

/**
 * Primary engine that automatically ensures 3 new courses exist for today.
 * Persists dynamically to localStorage so previous daily drops remain accessible.
 * Strictly guarantees that daily courses NEVER conflict with lesson numbers of supplementary courses,
 * AND guarantees that NO duplicate courses exist in the library.
 */
export function getDailyCivicCourses(): CivicLesson[] {
  if (typeof window === 'undefined') return [];

  const todayStr = getTodayDateString();

  try {
    const storedCoursesRaw = localStorage.getItem(DAILY_COURSES_STORAGE_KEY);
    let storedCourses: CivicLesson[] = storedCoursesRaw ? JSON.parse(storedCoursesRaw) : [];

    // 1. ACTIVE DEDUPLICATION PASS: Remove any duplicate daily courses or title overlaps with foundational/supplementary
    const supplementary = getSupplementaryCourses();
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();

    lessonsData.forEach((l) => seenTitles.add(normalizeCivicTitle(l.title)));
    supplementary.forEach((s) => seenTitles.add(normalizeCivicTitle(s.title)));

    const dedupedCourses: CivicLesson[] = [];
    let hadDuplicates = false;

    for (const c of storedCourses) {
      const normTitle = normalizeCivicTitle(c.title);
      if (!seenTitles.has(normTitle) && !seenIds.has(c.id)) {
        seenTitles.add(normTitle);
        seenIds.add(c.id);
        dedupedCourses.push(c);
      } else {
        hadDuplicates = true;
      }
    }

    storedCourses = dedupedCourses;

    // 2. Reconcile and guarantee existing daily courses do not collide with any uploaded supplementary course
    const supplementaryNumbers = new Set(supplementary.map((s) => s.lessonNumber));
    let hasNumberConflict = false;

    const reservedNumbers = new Set<number>();
    lessonsData.forEach((l) => reservedNumbers.add(l.lessonNumber));
    supplementary.forEach((s) => reservedNumbers.add(s.lessonNumber));

    storedCourses.forEach((course) => {
      if (supplementaryNumbers.has(course.lessonNumber) || reservedNumbers.has(course.lessonNumber)) {
        // Find next unused number
        let candidate = 11;
        while (reservedNumbers.has(candidate)) {
          candidate++;
        }
        course.lessonNumber = candidate;
        reservedNumbers.add(candidate);
        hasNumberConflict = true;
      } else {
        reservedNumbers.add(course.lessonNumber);
      }
    });

    if (hadDuplicates || hasNumberConflict) {
      localStorage.setItem(DAILY_COURSES_STORAGE_KEY, JSON.stringify(storedCourses));
    }

    // 3. Check if courses for today already exist and enforce 100-courses total cap
    const MAX_TOTAL_CIVIC_COURSES = 100;
    const currentTotal = lessonsData.length + supplementary.length + storedCourses.length;
    const isCapReached = currentTotal >= MAX_TOTAL_CIVIC_COURSES;
    const hasTodayCourses = storedCourses.some((c) => c.publishedDate === todayStr);

    if (!hasTodayCourses && !isCapReached) {
      // Need to add up to 3 new courses without exceeding 100 total civic courses!
      const remainingSlots = Math.max(0, MAX_TOTAL_CIVIC_COURSES - currentTotal);
      const countToAdd = Math.min(3, remainingSlots);

      if (countToAdd > 0) {
        const availableNums = getNextAvailableLessonNumbers(countToAdd, storedCourses);
        const newCourses = buildCoursesForDate(todayStr, availableNums, storedCourses);

        storedCourses = [...storedCourses, ...newCourses];
        localStorage.setItem(DAILY_COURSES_STORAGE_KEY, JSON.stringify(storedCourses));
        localStorage.setItem(DAILY_COURSES_STATE_KEY, JSON.stringify({ lastAddedDate: todayStr }));
      }
    }

    // 4. Attach 10-question quizzes to all stored courses if missing
    storedCourses.forEach((course) => {
      if (!course.quizzes || course.quizzes.length < 10) {
        course.quizzes = getCourseQuizQuestions(course.id, course.title, course.category);
      }
    });

    return storedCourses;
  } catch (err) {
    console.error('Failed to manage daily civic courses:', err);
    // Fallback: build today's 3 courses on the fly with safe numbers
    const fallbackNums = getNextAvailableLessonNumbers(3);
    return buildCoursesForDate(todayStr, fallbackNums);
  }
}

/**
 * Returns ALL civic courses: Foundational 10 + all daily courses + supplementary courses.
 * Guaranteed that every course has 10 quiz questions and no duplicate courses exist.
 */
export function getAllCivicCourses(): CivicLesson[] {
  const daily = getDailyCivicCourses();
  const supplementary = getSupplementaryCourses();

  // Ensure foundational lessons have their 10 quizzes attached
  const foundationalWithQuizzes = lessonsData.map((l) => {
    if (!l.quizzes || l.quizzes.length < 10) {
      return {
        ...l,
        quizzes: getCourseQuizQuestions(l.id, l.title, l.category),
      };
    }
    return l;
  });

  const combinedRaw = [...foundationalWithQuizzes, ...daily, ...supplementary];
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const combined: CivicLesson[] = [];

  for (const c of combinedRaw) {
    const norm = normalizeCivicTitle(c.title);
    if (!seenIds.has(c.id) && !seenTitles.has(norm)) {
      seenIds.add(c.id);
      seenTitles.add(norm);
      combined.push(c);
    }
  }

  return combined;
}

/**
 * Returns strictly the 3 courses published today.
 */
export function getTodaysNewCourses(): CivicLesson[] {
  const allDaily = getDailyCivicCourses();
  const todayStr = getTodayDateString();
  const todays = allDaily.filter((c) => c.publishedDate === todayStr);
  if (todays.length > 0) return todays;
  // If somehow empty, return the last 3 daily courses
  return allDaily.slice(-3);
}

/**
 * Manual trigger if a user or facilitator wants to generate another 3 courses right away.
 * Strictly guarantees unique, non-colliding lesson numbers that never overlap supplementary courses,
 * AND guarantees that NO lesson repetition occurs.
 */
export function addThreeMoreCoursesNow(): CivicLesson[] {
  if (typeof window === 'undefined') return [];
  const existing = getDailyCivicCourses();
  const supplementary = getSupplementaryCourses();
  const totalCount = lessonsData.length + supplementary.length + existing.length;
  if (totalCount >= 100) {
    // 100 courses cap achieved: automatically stop generating daily courses
    return existing;
  }
  const remaining = Math.max(0, 100 - totalCount);
  const countToAdd = Math.min(3, remaining);
  if (countToAdd <= 0) return existing;

  const todayStr = getTodayDateString();
  const availableNums = getNextAvailableLessonNumbers(countToAdd, existing);

  const nextBatch = buildCoursesForDate(todayStr, availableNums, existing);
  const updated = [...existing, ...nextBatch];

  localStorage.setItem(DAILY_COURSES_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Checks if the complete 100-courses civic curriculum cap has been reached.
 */
export function is100CoursesCapReached(): boolean {
  return getAllCivicCourses().length >= 100;
}

