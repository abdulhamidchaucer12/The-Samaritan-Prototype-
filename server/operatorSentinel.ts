export interface MessageSentinelAnalysis {
  isSuspicious: boolean;
  category?:
    | "incitement_violence"
    | "ethnic_hate_speech"
    | "electoral_malpractice"
    | "officer_impersonation"
    | "violent_threat_extortion"
    | "fraud_scam"
    | "civic_subversion";
  categoryLabel: { en: string; sw: string };
  explanation: { en: string; sw: string };
  riskScore: number; // 0 to 100
  flaggedKeywords: string[];
}

const CIVIC_SAFETY_PATTERNS = [
  {
    regex: /\b(burn|torch|attack|clash|kill|panga|machete|choma|ua|piga|vita|maandamano ya vurugu|fukuza|dondoa)\b/i,
    category: "incitement_violence" as const,
    label: { en: "Incitement to Violence & Civil Unrest", sw: "Uchochezi wa Vurugu na Machafuko" },
    explanation: {
      en: "Message promotes violent confrontation, attacks, or destruction of property violating Article 33(2) and Chapter Four of the Constitution of Kenya.",
      sw: "Ujumbe unachochea vurugu, mashambulizi, au uharibifu wa mali kinyume na Kifungu cha 33(2) cha Katiba ya Kenya.",
    },
    riskScore: 92,
  },
  {
    regex: /\b(madoadoa|kabila fulani|washushe|ondoa hao|kikuyu|luo|kalenjin|kamba|mijikenda|digo|duruma|waswahili) (tuwapige|wasiishi|fukuza|hawafai|haribu|chuki)\b/i,
    category: "ethnic_hate_speech" as const,
    label: { en: "Ethnic Hate Speech & Discriminatory Vilification", sw: "Uchochezi wa Kikabila na Matamshi ya Chuki" },
    explanation: {
      en: "Message contains ethnic vilification and discriminatory incitement violating Article 27 and the National Cohesion and Integration Act.",
      sw: "Ujumbe una maneno ya chuki na ubaguzi wa kikabila kinyume na Kifungu cha 27 na Sheria ya Uwiano na Utangamano wa Kitaifa.",
    },
    riskScore: 96,
  },
  {
    regex: /\b(vote buying|sell vote|rig election|iba kura|nunua kura|feva kura|kura bandia|burn ballot|iba masanduku|vote twice|choma kura)\b/i,
    category: "electoral_malpractice" as const,
    label: { en: "Electoral Malpractice & Vote Tampering", sw: "Udanganyifu wa Uchaguzi na Wizi wa Kura" },
    explanation: {
      en: "Message attempts electoral interference, illegal vote trade, or tampering violating Article 38, 88, and the Elections Offences Act.",
      sw: "Ujumbe unahusisha jaribio la udanganyifu au uuzaji wa kura kinyume na Kifungu cha 38 na Sheria ya Makosa ya Uchaguzi.",
    },
    riskScore: 89,
  },
  {
    regex: /\b(i am the police boss|mimi ni dci|nisipolipwa nita|inspector general|iebc commissioner|county commissioner|officer commanding station|ocs matuga|court magistrate|askari feki)\b/i,
    category: "officer_impersonation" as const,
    label: { en: "Impersonation of State / Law Enforcement Officer", sw: "Kujifanya Afisa wa Serikali au Usalama" },
    explanation: {
      en: "Message falsely claims official police, judicial, or state authority to deceive citizens or obstruct administration under the Penal Code.",
      sw: "Ujumbe unajifanya kimakosa kuwa afisa wa usalama au serikali ili kudanganya wananchi kinyume na Sheria ya Adhabu.",
    },
    riskScore: 85,
  },
  {
    regex: /\b(send money or else|tuma pesa nisiku|extortion|nitakuua|tutakumaliza|blackmail|tuma mpesa ama|doxx|nitalipua)\b/i,
    category: "violent_threat_extortion" as const,
    label: { en: "Violent Threats & Criminal Extortion", sw: "Vitisho vya Mauaji na Unyang'anyi" },
    explanation: {
      en: "Message contains criminal threats against personal safety, bodily harm, or extortion under Section 295 of the Penal Code.",
      sw: "Ujumbe una vitisho dhidi ya maisha na usalama wa mtu binafsi kinyume na Sheria ya Adhabu.",
    },
    riskScore: 94,
  },
];

export async function monitorMessageWithOperatorAi(params: {
  content: string;
  senderUsername: string;
  recipientUsername: string;
}): Promise<MessageSentinelAnalysis> {
  const { content } = params;
  const cleanContent = (content || "").trim();

  // Fast Kenyan Constitutional Pattern Classifier
  for (const pattern of CIVIC_SAFETY_PATTERNS) {
    const match = cleanContent.match(pattern.regex);
    if (match) {
      return {
        isSuspicious: true,
        category: pattern.category,
        categoryLabel: pattern.label,
        explanation: pattern.explanation,
        riskScore: pattern.riskScore,
        flaggedKeywords: [match[0]],
      };
    }
  }

  // Safe message
  return {
    isSuspicious: false,
    categoryLabel: { en: "Approved Civic Message", sw: "Ujumbe Uliothibitishwa" },
    explanation: {
      en: "Message adheres to constitutional civic decency standards.",
      sw: "Ujumbe unazingatia maadili ya kikatiba.",
    },
    riskScore: 5,
    flaggedKeywords: [],
  };
}
