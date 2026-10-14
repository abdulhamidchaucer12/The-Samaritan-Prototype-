import fs from "fs";
import path from "path";

/**
 * Cloud Backup & Multi-Device Sync Store for The Samaritan Platform
 * Mirrors progress, facilitator tokens, verification badges, civic inquiries,
 * certificates, and user profiles to resilient cloud storage.
 */

export interface UserBackupRecord {
  username: string;
  county?: string;
  subCounty?: string;
  avatarUrl?: string;
  progress?: any;
  tokenBalance?: number;
  tokenGrants?: any[];
  verificationBadge?: any;
  issuedCertificates?: any[];
  dailyVisits?: any;
  passwordHash?: string;
  role?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface PlatformCloudSnapshot {
  version: string;
  lastUpdatedAt: string;
  users: Record<string, UserBackupRecord>;
  citizens?: any[];
  userProgress?: any[];
  tokens?: any[];
  verificationBadges?: any[];
  questions?: any[];
  suggestions?: any[];
  certificates?: any[];
  incidents?: any[];
  adaptations?: any[];
  activeSessions?: any[];
  directMessages?: any[];
  userNotifications?: any[];
  supplementaryCourses?: any[];
}

const CLOUD_STORAGE_FILE = path.join(process.cwd(), "server_cloud_backup.json");

let cachedSnapshot: PlatformCloudSnapshot | null = null;

const INITIAL_SEED_SUPPLEMENTARY_COURSES = [
  {
    id: "supp_course_11",
    lessonNumber: 11,
    title: {
      en: "The Public Trust Doctrine & Protection of Ecological Sanctuaries",
      sw: "Fundisho la Dhamana ya Umma na Uhifadhi wa Maeneo Asili ya Mazingira",
    },
    summary: {
      en: "Examine how Article 69(1) of the Constitution and the Public Trust Doctrine hold Kenya's coastal peninsulas, forests, and wildlife nesting grounds in sacred custody for current and future generations.",
      sw: "Chambua jinsi Kifungu cha 69(1) cha Katiba na Fundisho la Dhamana ya Umma vinavyolinda maeneo ya pwani, misitu, na hifadhi za viumbe pori kwa manufaa ya vizazi vya sasa na vijavyo.",
    },
    category: "constitution",
    readTimeMinutes: 7,
    isPublished: true,
    isSupplementary: true,
    isCustom: true,
    developedByAi: true,
    authorAdmin: "Curriculum Board / KFE",
    lastUpdated: "2026-10-14",
    sections: [
      {
        id: "sec_1",
        title: {
          en: "1. The Public Trust Doctrine Under Article 69",
          sw: "1. Fundisho la Dhamana ya Umma Chini ya Kifungu 69",
        },
        content: {
          en: "Under Article 69(1) of the Constitution of Kenya 2010, the State holds all natural resources and ecological havens in trust for the people of Kenya. Private developers cannot extinguish public rights over wetlands, wildlife breeding peninsulas, or ecologically fragile sanctuaries.",
          sw: "Chini ya Kifungu cha 69(1) cha Katiba ya Kenya 2010, Serikali inashikilia rasilimali zote asili na maeneo ya kiikolojia kama dhamana kwa niaba ya wananchi wa Kenya. Wamiliki binafsi hawawezi kufuta haki za umma juu ya chemchemi, mazingira ya pwani, au hifadhi za wanyamapori.",
        },
        constitutionalArticle: "Article 69(1) & Article 70",
        bulletPoints: {
          en: [
            "Natural heritage cannot be converted into private profit if doing so harms public ecological welfare.",
            "Any citizen can sue under Article 70 without showing personal financial damage.",
            "Courts apply the Precautionary Principle to halt environmentally hazardous projects.",
          ],
          sw: [
            "Urithi wa asili hauwezi kubadilishwa kuwa faida ya kibinafsi ikiwa unaharibu ustawi wa umma.",
            "Mwananchi yeyote anaweza kufungua kesi chini ya Kifungu 70 bila kulazimika kuonyesha hasara binafsi ya kifedha.",
            "Mahakama hutumia Kanuni ya Tahadhari kusimamisha miradi inayotishia mazingira.",
          ],
        },
      },
      {
        id: "sec_2",
        title: {
          en: "2. Perpetual Conservation Land Trusts",
          sw: "2. Hazina za Ardhi za Uhifadhi wa Kudumu",
        },
        content: {
          en: "Under the Trustees (Perpetual Succession) Act Cap 164, communities can incorporate perpetual conservation land trusts. Negative easements can be registered on title deeds to legally prohibit commercial subdivision, industrial chemical dumping, or deforestation forever.",
          sw: "Chini ya Sheria ya Wadhamini (Cap 164), jamii zinaweza kusajili hazina ya kudumu ya ardhi. Vizuizi vya kisheria (negative easements) huwekwa kwenye hati miliki kuzuia ugawaji wa ardhi kibiashara, utupaji wa kemikali, au uharibifu wa misitu milele.",
        },
        constitutionalArticle: "Article 60 & Trustees Act Cap 164",
      },
    ],
    keyTerms: [
      {
        term: { en: "Public Trust Doctrine", sw: "Fundisho la Dhamana ya Umma" },
        definition: {
          en: "Legal principle that certain resources like waters, air, and wildlife sanctuaries are preserved for public use.",
          sw: "Kanuni ya kisheria kwamba rasilimali fulani kama vile maji, hewa, na hifadhi za wanyama zinapaswa kutunzwa kwa manufaa ya umma.",
        },
      },
    ],
    citizenActionTip: {
      en: "If a developer encroaches on public wetlands or ancestral wildlife peninsulas, file an Article 70 conservatory motion before the Environment and Land Court.",
      sw: "Ikiwa msanidi atavamia ardhi oevu ya umma au hifadhi ya asili, wasilisha maombi ya zuio chini ya Kifungu 70 mbele ya Mahakama ya Mazingira na Ardhi.",
    },
    quizzes: [
      {
        id: "q_supp_11_1",
        category: "constitution",
        question: {
          en: "Under Article 69(1) of the Constitution of Kenya 2010, who holds natural resources in trust for the people?",
          sw: "Chini ya Kifungu cha 69(1) cha Katiba ya Kenya 2010, ni nani anayeshikilia rasilimali za asili kama dhamana kwa niaba ya wananchi?",
        },
        options: [
          { id: "a", text: { en: "The State on behalf of all present and future generations", sw: "Serikali kwa niaba ya vizazi vya sasa na vijavyo" } },
          { id: "b", text: { en: "Private corporate conglomerates exclusively", sw: "Mashirika binafsi ya kibiashara pekee" } },
          { id: "c", text: { en: "Foreign trade consulates", sw: "Balozi za kigeni za biashara" } },
          { id: "d", text: { en: "Political party secretariats", sw: "Sekretarieti za vyama vya kisiasa" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 69(1) mandates that the State shall hold and protect natural resources in sacred trust for all citizens.",
          sw: "Kifungu 69(1) kinaitaka Serikali kutunza na kulinda rasilimali za asili kama amana takatifu ya wananchi.",
        },
      },
      {
        id: "q_supp_11_2",
        category: "constitution",
        question: {
          en: "Does a citizen need to prove direct personal injury to file an environmental protection petition under Article 70?",
          sw: "Je, mwananchi anahitaji kuthibitisha madhara binafsi ili kuwasilisha kesi ya mazingira chini ya Kifungu 70?",
        },
        options: [
          { id: "a", text: { en: "Yes, they must prove financial bankruptcy", sw: "Ndiyo, lazima athibitishe kufilisika kifedha" } },
          { id: "b", text: { en: "No, Article 70(1) grants locus standi to any person acting in public interest", sw: "Hapana, Kifungu 70(1) kinampa haki mtu yeyote anayelinda maslahi ya umma" } },
          { id: "c", text: { en: "Only if cleared by the local chief", sw: "Iwapo tu ataruhusiwa na chifu wa eneo" } },
          { id: "d", text: { en: "Only after paying a KES 10 million security bond", sw: "Baada tu ya kulipa dhamana ya KES milioni 10" } },
        ],
        correctOptionId: "b",
        explanation: {
          en: "Under Article 70(1) & (3), a person does not need to demonstrate that they have incurred loss or suffered damage to defend the environment.",
          sw: "Chini ya Kifungu 70(1) na (3), mtu hahitaji kuonyesha hasara au jeraha binafsi ili kutetea mazingira.",
        },
      },
      {
        id: "q_supp_11_3",
        category: "constitution",
        question: {
          en: "What legal instrument can communities register under Cap 164 to protect ancestral sanctuaries forever?",
          sw: "Ni chombo gani cha kisheria kinachoweza kusajiliwa chini ya Cap 164 kulinda hifadhi za asili milele?",
        },
        options: [
          { id: "a", text: { en: "Perpetual Conservation Land Trust with negative easements", sw: "Hazina ya Ardhi ya Uhifadhi wa Kudumu yenye vizuizi vya kisheria" } },
          { id: "b", text: { en: "Short-term temporary leasehold", sw: "Kukodisha kwa muda mfupi tu" } },
          { id: "c", text: { en: "Informal handwritten agreement", sw: "Makubaliano ya mkono yasiyo rasmi" } },
          { id: "d", text: { en: "Verbal pledge at a rally", sw: "Ahadi ya mdomo kwenye mkutano wa kisiasa" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "The Trustees (Perpetual Succession) Act Cap 164 allows communities to secure land in perpetual trust with binding conservation covenants.",
          sw: "Sheria ya Cap 164 inaruhusu jamii kulinda ardhi kwa hazina ya kudumu yenye masharti ya kuzuia uharibifu.",
        },
      },
      {
        id: "q_supp_11_4",
        category: "constitution",
        question: {
          en: "What does the Precautionary Principle require when environmental science is still emerging?",
          sw: "Kanuni ya Tahadhari inahitaji nini wakati sayansi ya mazingira bado haijakamilika?",
        },
        options: [
          { id: "a", text: { en: "Proceed with toxic dumping until someone falls sick", sw: "Endelea kumwaga sumu hadi mtu augue" } },
          { id: "b", text: { en: "Lack of full scientific certainty shall not postpone preventive environmental action", sw: "Kutokuwepo kwa uhakika kamili wa kisayansi kusicheleweshe hatua za kuzuia madhara" } },
          { id: "c", text: { en: "Ignore all citizen complaints", sw: "Puuza malalamiko yote ya wananchi" } },
          { id: "d", text: { en: "Privatize the regulatory agency", sw: "Binafsisha shirika la udhibiti" } },
        ],
        correctOptionId: "b",
        explanation: {
          en: "Section 3 of EMCA and international environmental jurisprudence dictate that preventive steps cannot be delayed due to scientific uncertainty.",
          sw: "Kifungu cha 3 cha EMCA kinasema kuwa hatua za tahadhari hazipaswi kuahirishwa kwa sababu ya utata wa kisayansi.",
        },
      },
      {
        id: "q_supp_11_5",
        category: "constitution",
        question: {
          en: "Which court in Kenya has primary constitutional jurisdiction to hear matters concerning the environment and land?",
          sw: "Ni mahakama ipi nchini Kenya yenye mamlaka makuu ya kikatiba kusikiliza masuala ya mazingira na ardhi?",
        },
        options: [
          { id: "a", text: { en: "The Environment and Land Court (ELC) established under Article 162(2)(b)", sw: "Mahakama ya Mazingira na Ardhi (ELC) iliyoanzishwa chini ya Kifungu 162(2)(b)" } },
          { id: "b", text: { en: "The Military Court Martial", sw: "Mahakama ya Kijeshi" } },
          { id: "c", text: { en: "The Traffic Licensing Tribunal", sw: "Baraza la Leseni za Trafiki" } },
          { id: "d", text: { en: "The County Revenue Board", sw: "Bodi ya Mapato ya Kaunti" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 162(2)(b) establishes the Environment and Land Court with status equal to the High Court.",
          sw: "Kifungu 162(2)(b) kinaunda Mahakama ya Mazingira na Ardhi yenye hadhi sawa na Mahakama Kuu.",
        },
      },
      {
        id: "q_supp_11_6",
        category: "constitution",
        question: {
          en: "What is the statutory role of the National Land Commission (NLC) regarding public land under Article 67?",
          sw: "Ni lipi jukumu la kisheria la Tume ya Kitaifa ya Ardhi (NLC) kuhusu ardhi ya umma chini ya Kifungu 67?",
        },
        options: [
          { id: "a", text: { en: "To manage public land on behalf of the national and county governments", sw: "Kusimamia ardhi ya umma kwa niaba ya serikali ya kitaifa na za kaunti" } },
          { id: "b", text: { en: "To secretly sell mangrove sanctuaries to developers", sw: "Kuuza misitu ya mikoko kwa siri kwa wafanyabiashara" } },
          { id: "c", text: { en: "To abolish community titles", sw: "Kufuta hati miliki zote za jamii" } },
          { id: "d", text: { en: "To collect vehicle registration tariffs", sw: "Kukusanya ushuru wa usajili wa magari" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 67(2)(a) designates NLC as the steward of public land for both levels of government.",
          sw: "Kifungu 67(2)(a) kinaipa NLC wajibu wa kusimamia ardhi ya umma kwa niaba ya serikali zote mbili.",
        },
      },
      {
        id: "q_supp_11_7",
        category: "constitution",
        question: {
          en: "Under Section 76 of the Land Registration Act 2012, what tool can be placed to freeze irregular transactions on title?",
          sw: "Chini ya Kifungu 76 cha Sheria ya Usajili wa Ardhi 2012, ni chombo gani kinachoweza kuwekwa kuzuia uhamisho haramu?",
        },
        options: [
          { id: "a", text: { en: "A formal Caution or Restriction", sw: "Kizuizi rasmi (Caution au Restriction)" } },
          { id: "b", text: { en: "An anonymous flyer", sw: "Karatasi isiyo na jina" } },
          { id: "c", text: { en: "A social media comment", sw: "Maoni kwenye mitandao ya kijamii" } },
          { id: "d", text: { en: "A promissory note", sw: "Hati ya ahadi ya kulipa" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Section 76 authorizes the registrar or interested parties to lodge a caution or restriction barring any disposition.",
          sw: "Kifungu cha 76 kinatoa mamlaka ya kuweka kizuizi rasmi kuzuia muamala wowote wa ardhi yenye utata.",
        },
      },
      {
        id: "q_supp_11_8",
        category: "constitution",
        question: {
          en: "What standard of clean environment is guaranteed to every person in Kenya by Article 42?",
          sw: "Ni kiwango gani cha mazingira safi kinachohakikishwa kwa kila mtu nchini Kenya na Kifungu 42?",
        },
        options: [
          { id: "a", text: { en: "The right to a clean and healthy environment", sw: "Haki ya kuwa na mazingira safi na yenye afya" } },
          { id: "b", text: { en: "Only clean air inside private mansions", sw: "Hewa safi ndani ya majumba ya kifahari tu" } },
          { id: "c", text: { en: "Right to pollute freely if taxes are paid", sw: "Haki ya kuchafua mradi tu kodi inalipwa" } },
          { id: "d", text: { en: "No environmental rights are recognized", sw: "Hakuna haki za mazingira zinazotambuliwa" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 42 guarantees every person the fundamental right to a clean and healthy environment.",
          sw: "Kifungu 42 kinampa kila mtu haki ya msingi ya kuishi katika mazingira safi na yenye afya.",
        },
      },
      {
        id: "q_supp_11_9",
        category: "constitution",
        question: {
          en: "Under the Polluter Pays Principle, who bears the financial cost of environmental remediation and cleanup?",
          sw: "Chini ya Kanuni ya Mchafuzi Kulipa, ni nani anayebeba gharama za kifedha za kusafisha mazingira?",
        },
        options: [
          { id: "a", text: { en: "The polluter who caused the contamination", sw: "Mchafuzi aliyesababisha uchafuzi huo" } },
          { id: "b", text: { en: "Vulnerable local villagers and school children", sw: "Wanavijiji wanyonge na watoto wa shule" } },
          { id: "c", text: { en: "The United Nations general fund", sw: "Hazina kuu ya Umoja wa Mataifa" } },
          { id: "d", text: { en: "No one, the mess is left abandoned", sw: "Hakuna mtu, uchafu unaachwa hivyohivyo" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "The Polluter Pays Principle legally imposes the cost of pollution prevention and control on the polluter.",
          sw: "Kanuni ya Mchafuzi Kulipa inamwekea mhusika mzigo mzima wa kifedha wa kurejesha mazingira katika hali yake ya kawaida.",
        },
      },
      {
        id: "q_supp_11_10",
        category: "constitution",
        question: {
          en: "How does grassroots community oversight prevent illegal land grabs?",
          sw: "Ni kwa jinsi gani usimamizi wa jamii mashinani unazuia unyakuzi haramu wa ardhi?",
        },
        options: [
          { id: "a", text: { en: "By continuous vigilance, baraza resolutions, legal caveats, and public interest litigation", sw: "Kwa umakini endelevu, maazimio ya baraza, vizuizi vya kisheria, na kesi za maslahi ya umma" } },
          { id: "b", text: { en: "By remaining completely silent", sw: "Kwa kukaa kimya kabisa" } },
          { id: "c", text: { en: "By accepting bribes from developers", sw: "Kwa kupokea hongo kutoka kwa wanyakuzi" } },
          { id: "d", text: { en: "By destroying official land maps", sw: "Kwa kuchana ramani rasmi za ardhi" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Active civic monitoring paired with statutory tools forms an impenetrable defense for public community assets.",
          sw: "Uangalizi makini wa wananchi ukichanganywa na sheria huunda ngome isiyopenyeka kulinda rasilimali za umma.",
        },
      },
    ],
  },
  {
    id: "supp_course_12",
    lessonNumber: 12,
    title: {
      en: "Whistleblower Protections & Article 35 Access to Information",
      sw: "Ulinzi wa Watoa Taarifa na Haki ya Kupata Habari Chini ya Kifungu 35",
    },
    summary: {
      en: "Master the statutory safeguards under the Access to Information Act 2016 and Witness Protection Act that empower citizens to expose corruption without retaliation.",
      sw: "Jifunze ulinzi wa kisheria chini ya Sheria ya Kupata Habari ya 2016 na Sheria ya Ulinzi wa Mashahidi inayowawezesha wananchi kufichua ufisadi bila hofu.",
    },
    category: "integrity",
    readTimeMinutes: 7,
    isPublished: true,
    isSupplementary: true,
    isCustom: true,
    developedByAi: true,
    authorAdmin: "Curriculum Board / KFE",
    lastUpdated: "2026-10-14",
    sections: [
      {
        id: "sec_1",
        title: {
          en: "1. The Constitutional Right to Know (Article 35)",
          sw: "1. Haki ya Kikatiba ya Kujua (Kifungu cha 35)",
        },
        content: {
          en: "Every citizen has the right to access information held by the State, and information held by another person required for the exercise or protection of any right or fundamental freedom. Public officers cannot refuse disclosure on arbitrary grounds.",
          sw: "Kila mwananchi ana haki ya kupata taarifa zinazoshikiliwa na Serikali, na taarifa zinazoshikiliwa na mtu mwingine yeyote inayohitajika kulinda haki za msingi. Maafisa wa umma hawawezi kukataa kutoa taarifa bila msingi wa kisheria.",
        },
        constitutionalArticle: "Article 35 & Access to Information Act 2016",
      },
    ],
    keyTerms: [
      {
        term: { en: "Whistleblower", sw: "Mtoa Taarifa" },
        definition: {
          en: "A person who exposes wrongdoing, illegality, or financial misappropriation in public or private bodies.",
          sw: "Mtu anayefichua ubadhirifu, uvunjifu wa sheria, au ufisadi ndani ya mashirika ya umma au ya kibinafsi.",
        },
      },
    ],
    citizenActionTip: {
      en: "Use formal written requests referencing Section 8 of the Access to Information Act 2016. Public entities must respond within 21 days.",
      sw: "Tumia barua rasmi ukitaja Kifungu cha 8 cha Sheria ya Kupata Habari ya 2016. Mashirika ya umma yanapaswa kujibu ndani ya siku 21.",
    },
    quizzes: [
      {
        id: "q_supp_12_1",
        category: "integrity",
        question: {
          en: "Within how many days must a public agency respond to an access to information request under the 2016 Act?",
          sw: "Ndani ya siku ngapi shirika la umma linapaswa kujibu maombi ya kupata taarifa chini ya Sheria ya 2016?",
        },
        options: [
          { id: "a", text: { en: "21 days (or 48 hours if life and liberty are at stake)", sw: "Siku 21 (au saa 48 ikiwa maisha na uhuru viko hatarini)" } },
          { id: "b", text: { en: "5 years", sw: "Miaka 5" } },
          { id: "c", text: { en: "Never, public offices are exempt", sw: "Kamwe, ofisi za umma hazilazimiki" } },
          { id: "d", text: { en: "Only during election week", sw: "Wakati wa juma la uchaguzi pekee" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Section 9 of the Access to Information Act 2016 stipulates a mandatory 21-day timeline, reduced to 48 hours if life or liberty is implicated.",
          sw: "Kifungu cha 9 cha Sheria ya Kupata Habari ya 2016 kinaweka ukomo wa siku 21, na saa 48 ikiwa inahusu maisha ya mtu.",
        },
      },
      {
        id: "q_supp_12_2",
        category: "integrity",
        question: {
          en: "Can an employee be demoted or dismissed for disclosing corruption in good faith?",
          sw: "Je, mfanyakazi anaweza kushushwa cheo au kufutwa kazi kwa kufichua ufisadi kwa nia njema?",
        },
        options: [
          { id: "a", text: { en: "No, Section 16 of the Access to Information Act prohibits retaliation against whistleblowers", sw: "Hapana, Kifungu 16 cha Sheria ya Kupata Habari kinakataza kulipiza kisasi kwa watoa taarifa" } },
          { id: "b", text: { en: "Yes, managers have absolute discretion", sw: "Ndiyo, wakurugenzi wana mamlaka kamili" } },
          { id: "c", text: { en: "Only if the employee didn't smile", sw: "Iwapo tu mfanyakazi huyo hakutabasamu" } },
          { id: "d", text: { en: "Retaliation is mandatory", sw: "Kulipiza kisasi ni lazima" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Whistleblower protection provisions insulate employees who report genuine wrongdoing from disciplinary or civil liability.",
          sw: "Sheria inamlinda mfanyakazi anayeripoti maovu kwa nia njema dhidi ya adhabu za kikazi au kesi za madai.",
        },
      },
      {
        id: "q_supp_12_3",
        category: "integrity",
        question: {
          en: "What oversight commission receives appeals when a government department wrongfully denies information?",
          sw: "Ni tume ipi ya usimamizi inayopokea rufaa wakati idara ya serikali inapokataa kutoa habari kinyume cha sheria?",
        },
        options: [
          { id: "a", text: { en: "Commission on Administrative Justice (Ombudsman)", sw: "Tume ya Haki ya Utawala (Ombudsman)" } },
          { id: "b", text: { en: "The Football Federation", sw: "Shirikisho la Kandanda" } },
          { id: "c", text: { en: "The Central Bank Governor", sw: "Gavana wa Benki Kuu" } },
          { id: "d", text: { en: "The Kenya Tourism Board", sw: "Bodi ya Utalii ya Kenya" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "The Commission on Administrative Justice (CAJ) is the statutory oversight body for Access to Information enforcement.",
          sw: "Tume ya Haki ya Utawala (Ombudsman) ndicho chombo chenye mamlaka ya kusimamia utekelezaji wa haki ya kupata habari.",
        },
      },
      {
        id: "q_supp_12_4",
        category: "integrity",
        question: {
          en: "Under Article 10, which national value requires openness and transparency in state decisions?",
          sw: "Chini ya Kifungu cha 10, ni thamani gani ya kitaifa inayohitaji uwazi na uwajibikaji katika maamuzi ya serikali?",
        },
        options: [
          { id: "a", text: { en: "Transparency, accountability, and public participation", sw: "Uwazi, uwajibikaji, na ushirikishwaji wa umma" } },
          { id: "b", text: { en: "Administrative secrecy", sw: "Usiri wa kiutawala" } },
          { id: "c", text: { en: "Authoritarian control", sw: "Udhibiti wa kimabavu" } },
          { id: "d", text: { en: "Selective nepotism", sw: "Upendeleo wa kifamilia" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 10(2)(c) binds all state actors to good governance, integrity, transparency, and accountability.",
          sw: "Kifungu 10(2)(c) kinamfunga kila kiongozi kwa misingi ya utawala bora, uadilifu, uwazi na uwajibikaji.",
        },
      },
      {
        id: "q_supp_12_5",
        category: "integrity",
        question: {
          en: "What should a citizen do if a county officer demands a bribe to release a public procurement tender document?",
          sw: "Mwananchi anapaswa kufanya nini afisa wa kaunti akidai hongo ili kutoa hati ya zabuni ya umma?",
        },
        options: [
          { id: "a", text: { en: "Report immediately to EACC and file an appeal with the CAJ Ombudsman", sw: "Kuripoti mara moja kwa EACC na kuwasilisha rufaa kwa Tume ya Ombudsman" } },
          { id: "b", text: { en: "Pay the bribe quietly", sw: "Kulipa hongo kimya kimya" } },
          { id: "c", text: { en: "Delete all records", sw: "Kufuta kumbukumbu zote" } },
          { id: "d", text: { en: "Apologize to the officer", sw: "Kumuomba afisa huyo msamaha" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Demanding bribes is a serious felony under ACECA; public procurement documents are public records under Article 35 & 227.",
          sw: "Kudai hongo ni kosa zito la jinai; nyaraka za zabuni ni haki ya umma chini ya Kifungu cha 35 na 227.",
        },
      },
      {
        id: "q_supp_12_6",
        category: "integrity",
        question: {
          en: "Are citizens allowed to inspect county expenditure receipts and Auditor-General reports?",
          sw: "Je, wananchi wanaruhusiwa kukagua stakabadhi za matumizi ya kaunti na ripoti za Mkaguzi Mkuu?",
        },
        options: [
          { id: "a", text: { en: "Yes, Article 35 & 201 guarantee citizen access to public financial reports", sw: "Ndiyo, Kifungu 35 na 201 vinahakikisha wananchi wanapata ripoti za fedha za umma" } },
          { id: "b", text: { en: "No, finance is classified state secret", sw: "Hapana, fedha ni siri kuu ya serikali" } },
          { id: "c", text: { en: "Only politicians with diplomatic passports", sw: "Wanasiasa pekee wenye pasipoti za kidiplomasia" } },
          { id: "d", text: { en: "Only after paying a 50% tariff", sw: "Baada tu ya kulipa ushuru wa asilimia 50" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Article 201(a) mandates openness, accountability, and public participation in all financial matters.",
          sw: "Kifungu cha 201(a) kinataka uwazi, uwajibikaji, na ushirikishwaji wa umma katika masuala yote ya kifedha.",
        },
      },
      {
        id: "q_supp_12_7",
        category: "integrity",
        question: {
          en: "What protection does the Witness Protection Agency (WPA) provide to critical witnesses under threat?",
          sw: "Ni ulinzi gani ambao Shirika la Ulinzi wa Mashahidi (WPA) hutoa kwa mashahidi walio hatarini?",
        },
        options: [
          { id: "a", text: { en: "Relocation, identity defense, physical security, and legal immunity", sw: "Kuhama makazi, kulinda utambulisho, usalama wa kimwili, na kinga ya kisheria" } },
          { id: "b", text: { en: "Public broadcasting of their home address", sw: "Kutangaza anwani yao hadharani" } },
          { id: "c", text: { en: "Forced exile without food", sw: "Kufukuzwa nchini bila chakula" } },
          { id: "d", text: { en: "No protections whatsoever", sw: "Hakuna ulinzi wowote" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "The Witness Protection Act guarantees comprehensive safety, confidentiality, and welfare support for threatened witnesses.",
          sw: "Sheria ya Ulinzi wa Mashahidi inahakikisha usalama wa hali ya juu, usiri, na ustawi kwa mashahidi.",
        },
      },
      {
        id: "q_supp_12_8",
        category: "integrity",
        question: {
          en: "What is proactive disclosure under Section 5 of the Access to Information Act?",
          sw: "Ni nini utoaji wa habari wa hiari (proactive disclosure) chini ya Kifungu cha 5 cha Sheria ya Kupata Habari?",
        },
        options: [
          { id: "a", text: { en: "Public entities must publish budgets, policies, and contracts online without waiting for requests", sw: "Mashirika ya umma lazima yachapishe bajeti, sera, na kandarasi mtandaoni bila kusubiri kuombwa" } },
          { id: "b", text: { en: "Hiding records in underground vaults", sw: "Kuficha nyaraka kwenye vyumba vya chini ya ardhi" } },
          { id: "c", text: { en: "Charging citizen fees for reading the Constitution", sw: "Kutoza wananchi ada ya kusoma Katiba" } },
          { id: "d", text: { en: "Destroying obsolete files before audits", sw: "Kuchoma faili kabla ya ukaguzi" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Section 5 requires state organs to routinely publish governance structures, budgets, and public contracts.",
          sw: "Kifungu cha 5 kinaagiza vyombo vya dola kuchapisha taarifa zao mtandaoni kwa hiari kwa manufaa ya wananchi.",
        },
      },
      {
        id: "q_supp_12_9",
        category: "integrity",
        question: {
          en: "Under Article 50(2)(j), what right protects an accused person against concealed prosecution evidence?",
          sw: "Chini ya Kifungu 50(2)(j), ni haki ipi inayomlinda mtuhumiwa dhidi ya ushahidi uliofichwa na upande wa mashtaka?",
        },
        options: [
          { id: "a", text: { en: "Right to be informed in advance of the evidence the prosecution intends to rely on", sw: "Haki ya kupewa mapema ushahidi wote ambao upande wa mashtaka unakusudia kutumia" } },
          { id: "b", text: { en: "Trial by secret ambush", sw: "Kuhukumiwa kwa kuviziwa kwa siri" } },
          { id: "c", text: { en: "Denial of defense counsel", sw: "Kunyimwa wakili wa utetezi" } },
          { id: "d", text: { en: "Immediate guilty verdict without hearing", sw: "Kupatikana na hatia mara moja bila kusikilizwa" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "Full evidentiary disclosure is a mandatory constitutional pillar of the right to a fair trial under Article 50.",
          sw: "Kutoa ushahidi wote wazi kabla ya kesi ni nguzo kuu ya kikatiba ya haki ya kusikilizwa chini ya Kifungu 50.",
        },
      },
      {
        id: "q_supp_12_10",
        category: "integrity",
        question: {
          en: "Can fabricated intelligence dossiers be used as substantive judicial evidence in a Kenyan criminal trial?",
          sw: "Je, ripoti za ujasusi za kutunga zinaweza kutumika kama ushahidi halisi mahakamani nchini Kenya?",
        },
        options: [
          { id: "a", text: { en: "No, under the Evidence Act, hearsay and unverified briefs are strictly inadmissible", sw: "Hapana, chini ya Sheria ya Ushahidi, uvumi na ripoti zisizothibitishwa hazikubaliwi kabisa" } },
          { id: "b", text: { en: "Yes, if stamped with red wax", sw: "Ndiyo, zikiwa na mhuri mwekundu wa nta" } },
          { id: "c", text: { en: "Yes, anonymous rumors are supreme evidence", sw: "Ndiyo, uvumi usiojulikana ndio ushahidi mkuu" } },
          { id: "d", text: { en: "Only if tweeted by a celebrity", sw: "Iwapo tu zilisambazwa na mtu maarufu mtandaoni" } },
        ],
        correctOptionId: "a",
        explanation: {
          en: "The Evidence Act (Cap 80) and Article 50 bar unsubstantiated hearsay; prosecution must present genuine, admissible eyewitness and forensic evidence.",
          sw: "Sheria ya Ushahidi (Cap 80) na Kifungu 50 vinazuia ushahidi wa kubuni; lazima upande wa mashtaka uthibitishe ukweli bila shaka yoyote.",
        },
      },
    ],
  },
];

function loadSnapshot(): PlatformCloudSnapshot {
  if (cachedSnapshot) return cachedSnapshot;

  try {
    if (fs.existsSync(CLOUD_STORAGE_FILE)) {
      const raw = fs.readFileSync(CLOUD_STORAGE_FILE, "utf-8");
      if (raw.trim()) {
        cachedSnapshot = JSON.parse(raw);
        if (!cachedSnapshot!.supplementaryCourses || cachedSnapshot!.supplementaryCourses.length === 0) {
          cachedSnapshot!.supplementaryCourses = [...INITIAL_SEED_SUPPLEMENTARY_COURSES];
          saveSnapshot(cachedSnapshot!);
        }
        return cachedSnapshot!;
      }
    }
  } catch (err) {
    console.warn("[CloudBackup] Error reading backup file, initializing blank:", err);
  }

  cachedSnapshot = {
    version: "2.0.0",
    lastUpdatedAt: new Date().toISOString(),
    users: {},
    questions: [],
    suggestions: [],
    certificates: [],
    incidents: [],
    adaptations: [],
    activeSessions: [],
    directMessages: [],
    userNotifications: [],
    supplementaryCourses: [...INITIAL_SEED_SUPPLEMENTARY_COURSES],
  };
  saveSnapshot(cachedSnapshot);
  return cachedSnapshot;
}

function saveSnapshot(snapshot: PlatformCloudSnapshot): boolean {
  try {
    cachedSnapshot = snapshot;
    fs.writeFileSync(CLOUD_STORAGE_FILE, JSON.stringify(snapshot, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[CloudBackup] Failed to persist cloud backup snapshot:", err);
    return false;
  }
}

export function saveUserCloudBackup(username: string, data: Partial<UserBackupRecord>): UserBackupRecord {
  const snapshot = loadSnapshot();
  const cleanKey = username.trim().toLowerCase().replace(/^@/, "");

  const existing: UserBackupRecord = snapshot.users[cleanKey] || {
    username,
    updatedAt: new Date().toISOString(),
  };

  const updated: UserBackupRecord = {
    ...existing,
    ...data,
    username: existing.username || username,
    updatedAt: new Date().toISOString(),
  };

  snapshot.users[cleanKey] = updated;
  snapshot.lastUpdatedAt = new Date().toISOString();
  saveSnapshot(snapshot);

  return updated;
}

export function getUserCloudBackup(username: string): UserBackupRecord | null {
  const snapshot = loadSnapshot();
  const cleanKey = username.trim().toLowerCase().replace(/^@/, "");
  
  if (snapshot.users[cleanKey]) {
    return snapshot.users[cleanKey];
  }

  // Fallback to checking citizens & userProgress arrays
  const matchedCitizen = (snapshot.citizens || []).find(
    (c: any) => c.username && c.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedProgress = (snapshot.userProgress || []).find(
    (p: any) => p.username && p.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedTokens = (snapshot.tokens || []).filter(
    (t: any) => t.recipientUsername && t.recipientUsername.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  const matchedBadge = (snapshot.verificationBadges || []).find(
    (b: any) => b.username && b.username.trim().toLowerCase().replace(/^@/, "") === cleanKey
  );

  if (matchedCitizen || matchedProgress || matchedTokens.length > 0 || matchedBadge) {
    const synthetic: UserBackupRecord = {
      username: (matchedCitizen && matchedCitizen.username) || username,
      county: matchedCitizen?.county || "Kwale",
      subCounty: matchedCitizen?.subCounty || "N/A",
      role: matchedCitizen?.role || "citizen",
      passwordHash: matchedCitizen?.passwordHash,
      createdAt: matchedCitizen?.createdAt || new Date().toISOString(),
      progress: matchedProgress ? {
        completedLessons: matchedProgress.completedLessons || [],
        quizScores: matchedProgress.quizScores || {},
        lastActiveDate: matchedProgress.lastActiveDate,
      } : undefined,
      tokenGrants: matchedTokens,
      tokenBalance: matchedTokens.reduce((acc: number, t: any) => acc + (t.amount || 0), 0),
      verificationBadge: matchedBadge,
      updatedAt: new Date().toISOString(),
    };
    snapshot.users[cleanKey] = synthetic;
    saveSnapshot(snapshot);
    return synthetic;
  }

  return null;
}

export function saveFullCloudPlatformSnapshot(data: Partial<PlatformCloudSnapshot>): PlatformCloudSnapshot {
  const snapshot = loadSnapshot();
  const merged: PlatformCloudSnapshot = {
    ...snapshot,
    ...data,
    lastUpdatedAt: new Date().toISOString(),
  };

  if (data.users) {
    merged.users = { ...snapshot.users, ...data.users };
  }

  // Populate individual user entries from data.citizens and data.userProgress
  if (data.citizens && Array.isArray(data.citizens)) {
    data.citizens.forEach((c: any) => {
      if (c && c.username) {
        const key = c.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: c.username, updatedAt: new Date().toISOString() };
        merged.users[key] = {
          ...existing,
          county: c.county || existing.county,
          subCounty: c.subCounty || existing.subCounty,
          role: c.role || existing.role,
          passwordHash: c.passwordHash || existing.passwordHash,
          createdAt: c.createdAt || existing.createdAt,
          updatedAt: new Date().toISOString(),
        };
      }
    });
  }

  if (data.userProgress && Array.isArray(data.userProgress)) {
    data.userProgress.forEach((p: any) => {
      if (p && p.username) {
        const key = p.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: p.username, updatedAt: new Date().toISOString() };
        merged.users[key] = {
          ...existing,
          progress: {
            completedLessons: p.completedLessons || [],
            quizScores: p.quizScores || {},
            lastActiveDate: p.lastActiveDate || new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }
    });
  }

  if (data.tokens && Array.isArray(data.tokens)) {
    data.tokens.forEach((t: any) => {
      if (t && t.recipientUsername) {
        const key = t.recipientUsername.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: t.recipientUsername, updatedAt: new Date().toISOString() };
        const grants = existing.tokenGrants || [];
        if (!grants.some((g: any) => g.id === t.id)) {
          grants.push(t);
        }
        existing.tokenGrants = grants;
        existing.tokenBalance = grants.reduce((sum: number, g: any) => sum + (g.amount || 0), 0);
        merged.users[key] = existing;
      }
    });
  }

  if (data.verificationBadges && Array.isArray(data.verificationBadges)) {
    data.verificationBadges.forEach((b: any) => {
      if (b && b.username) {
        const key = b.username.trim().toLowerCase().replace(/^@/, "");
        const existing: UserBackupRecord = merged.users[key] || { username: b.username, updatedAt: new Date().toISOString() };
        existing.verificationBadge = b;
        merged.users[key] = existing;
      }
    });
  }

  if (data.activeSessions && Array.isArray(data.activeSessions)) {
    const existingSessions: any[] = merged.activeSessions || [];
    const now = Date.now();
    const sessionMap = new Map<string, any>();
    existingSessions.filter((s) => s && s.lastActive > now - 15 * 60 * 1000).forEach((s) => {
      sessionMap.set(s.id || s.username, s);
    });
    data.activeSessions.forEach((s: any) => {
      if (s) {
        sessionMap.set(s.id || s.username, s);
      }
    });
    merged.activeSessions = Array.from(sessionMap.values());
  }

  if (data.supplementaryCourses && Array.isArray(data.supplementaryCourses)) {
    const existing: any[] = merged.supplementaryCourses || [];
    const courseMap = new Map<string, any>();
    existing.forEach((c) => {
      if (c && c.id) courseMap.set(c.id, c);
    });
    data.supplementaryCourses.forEach((c) => {
      if (c && c.id) courseMap.set(c.id, c);
    });
    merged.supplementaryCourses = Array.from(courseMap.values());
  }

  saveSnapshot(merged);
  return merged;
}

export function getFullCloudPlatformSnapshot(): PlatformCloudSnapshot {
  return loadSnapshot();
}

/**
 * Cloud-wide live presence heartbeat:
 * Stores real-time sessions in the cloud so all online devices and live sheets can immediately see active citizens and admins.
 * Automatically cleans up sessions that have been inactive for more than 5 minutes.
 */
export function recordCloudPresence(session: any): any[] {
  const snapshot = loadSnapshot();
  const sessions: any[] = snapshot.activeSessions || [];
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;
  const fifteenMinsAgo = now - 15 * 60 * 1000;

  // Filter stale sessions older than 15 minutes
  let cleaned = sessions.filter((s: any) => s && s.lastActive > fifteenMinsAgo);

  const idx = cleaned.findIndex((s: any) => (session.id && s.id === session.id) || (session.username && s.username === session.username));
  if (idx !== -1) {
    cleaned[idx] = { ...cleaned[idx], ...session, lastActive: now, isOnline: true };
  } else {
    cleaned.unshift({ ...session, lastActive: now, isOnline: true });
  }

  snapshot.activeSessions = cleaned;
  saveSnapshot(snapshot);

  return cleaned.map((s: any) => ({
    ...s,
    isOnline: s.lastActive >= fiveMinsAgo,
  }));
}

/**
 * Retrieves genuine real-time online sessions from cloud storage
 */
export function getCloudPresence(): any[] {
  const snapshot = loadSnapshot();
  const sessions: any[] = snapshot.activeSessions || [];
  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;

  return sessions
    .filter((s: any) => s && s.lastActive > now - 15 * 60 * 1000)
    .map((s: any) => ({
      ...s,
      isOnline: s.lastActive >= fiveMinsAgo,
    }));
}

/**
 * Removes an allocated guest or marks a session offline when user logs in with their own username.
 */
export function removeCloudPresenceSession(target: { id?: string; username?: string }): any[] {
  const snapshot = loadSnapshot();
  const sessions: any[] = snapshot.activeSessions || [];
  const targetId = target.id;
  const cleanTargetUser = (target.username || "").trim().toLowerCase().replace(/^@/, "");

  const filtered = sessions.filter((s: any) => {
    if (!s) return false;
    if (targetId && s.id === targetId && s.role === 'guest') return false;
    if (cleanTargetUser && s.username && s.username.trim().toLowerCase().replace(/^@/, "") === cleanTargetUser) {
      return false;
    }
    return true;
  });

  snapshot.activeSessions = filtered;
  saveSnapshot(snapshot);

  const now = Date.now();
  const fiveMinsAgo = now - 5 * 60 * 1000;
  return filtered.map((s: any) => ({
    ...s,
    isOnline: s.lastActive >= fiveMinsAgo,
  }));
}

/**
 * Persists a real-time peer-to-peer direct message to cloud storage
 */
export function saveCloudDirectMessage(message: any): { success: boolean; message: any; allMessages: any[] } {
  const snapshot = loadSnapshot();
  if (!snapshot.directMessages) snapshot.directMessages = [];

  const existingIdx = snapshot.directMessages.findIndex((m: any) => m.id === message.id);
  if (existingIdx !== -1) {
    snapshot.directMessages[existingIdx] = { ...snapshot.directMessages[existingIdx], ...message };
  } else {
    snapshot.directMessages.push(message);
  }

  // Keep last 1500 messages to maintain swift retrieval and memory efficiency
  if (snapshot.directMessages.length > 1500) {
    snapshot.directMessages = snapshot.directMessages.slice(-1500);
  }

  saveSnapshot(snapshot);
  return { success: true, message, allMessages: snapshot.directMessages };
}

/**
 * Retrieves real-time direct messages, optionally filtered by user and/or timestamp
 */
export function getCloudDirectMessages(username?: string, since?: string): any[] {
  const snapshot = loadSnapshot();
  const all = snapshot.directMessages || [];
  const cleanUser = (username || "").trim().toLowerCase().replace(/^@/, "");

  let filtered = all;
  if (cleanUser) {
    filtered = all.filter((m: any) => {
      const s = (m.senderUsername || "").trim().toLowerCase().replace(/^@/, "");
      const r = (m.recipientUsername || "").trim().toLowerCase().replace(/^@/, "");
      return s === cleanUser || r === cleanUser;
    });
  }

  if (since) {
    const sinceTime = new Date(since).getTime();
    if (!isNaN(sinceTime)) {
      filtered = filtered.filter((m: any) => new Date(m.timestamp).getTime() > sinceTime);
    }
  }

  return filtered;
}

/**
 * Marks messages between peers as read in the cloud store
 */
export function markCloudMessagesRead(myUsername: string, peerUsername: string): boolean {
  const snapshot = loadSnapshot();
  const all = snapshot.directMessages || [];
  const cleanMe = (myUsername || "").trim().toLowerCase().replace(/^@/, "");
  const cleanPeer = (peerUsername || "").trim().toLowerCase().replace(/^@/, "");

  let modified = false;
  for (const m of all) {
    const s = (m.senderUsername || "").trim().toLowerCase().replace(/^@/, "");
    const r = (m.recipientUsername || "").trim().toLowerCase().replace(/^@/, "");
    if (s === cleanPeer && r === cleanMe && !m.isRead) {
      m.isRead = true;
      modified = true;
    }
  }

  if (modified) {
    saveSnapshot(snapshot);
  }
  return modified;
}

/**
 * Stores real-time civic notification in cloud store
 */
export function saveCloudNotification(notification: any): boolean {
  const snapshot = loadSnapshot();
  if (!snapshot.userNotifications) snapshot.userNotifications = [];

  const idx = snapshot.userNotifications.findIndex((n: any) => n.id === notification.id);
  if (idx !== -1) {
    snapshot.userNotifications[idx] = { ...snapshot.userNotifications[idx], ...notification };
  } else {
    snapshot.userNotifications.unshift(notification);
  }

  if (snapshot.userNotifications.length > 500) {
    snapshot.userNotifications = snapshot.userNotifications.slice(0, 500);
  }

  saveSnapshot(snapshot);
  return true;
}

/**
 * Retrieves cloud-persisted user notifications
 */
export function getCloudNotifications(username?: string): any[] {
  const snapshot = loadSnapshot();
  const all = snapshot.userNotifications || [];
  const cleanUser = (username || "").trim().toLowerCase().replace(/^@/, "");
  if (!cleanUser) return all;

  return all.filter((n: any) => {
    const t = (n.targetUsername || n.recipientUsername || "").trim().toLowerCase().replace(/^@/, "");
    return t === cleanUser || t === "all" || t === "*";
  });
}

/**
 * Marks a notification as read in cloud store
 */
export function markCloudNotificationRead(id: string): boolean {
  const snapshot = loadSnapshot();
  const all = snapshot.userNotifications || [];
  const idx = all.findIndex((n: any) => n.id === id);
  if (idx !== -1) {
    all[idx].isRead = true;
    saveSnapshot(snapshot);
    return true;
  }
  return false;
}

/**
 * Persists a supplementary course created by an admin or Operator AI to cloud backup
 */
export function saveCloudSupplementaryCourse(course: any): any {
  const snapshot = loadSnapshot();
  const courses: any[] = snapshot.supplementaryCourses || [];
  const cleanCourse = {
    ...course,
    isSupplementary: true,
    isCustom: true,
    lastUpdated: course.lastUpdated || new Date().toISOString(),
  };

  const idx = courses.findIndex((c: any) => c.id === cleanCourse.id);
  if (idx !== -1) {
    courses[idx] = { ...courses[idx], ...cleanCourse };
  } else {
    courses.unshift(cleanCourse);
  }

  snapshot.supplementaryCourses = courses;
  snapshot.lastUpdatedAt = new Date().toISOString();
  saveSnapshot(snapshot);
  return cleanCourse;
}

/**
 * Retrieves all cloud-persisted supplementary courses for all users
 */
export function getCloudSupplementaryCourses(): any[] {
  const snapshot = loadSnapshot();
  return snapshot.supplementaryCourses || [];
}
