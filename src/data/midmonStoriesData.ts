export interface StoryCharacter {
  id: string;
  name: string;
  title: string;
  role: 'protagonist' | 'companion' | 'mentor' | 'ally' | 'antagonist';
  avatarEmoji: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
  bio: string;
  weaponsAndAbilities: string[];
}

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  affinity: 'justice' | 'valor' | 'harmony';
  statBonus: {
    stat: 'justice' | 'valor' | 'harmony';
    amount: number;
  };
  requiredRelic?: string;
  relicAwarded?: StoryRelic;
  outcomeText: string;
  tokenReward?: number;
}

export interface StoryRelic {
  id: string;
  name: string;
  description: string;
  origin: string;
  power: string;
  icon: string;
}

export interface StoryNode {
  id: string;
  chapterId: number;
  chapterTitle: string;
  location: string;
  speaker: 'Lucy Shallah' | 'Sundiata Keita' | 'Lucy Shallah & Sundiata Keita' | 'Miriam Midmon' | 'Commander Kim Midmon' | 'Agnes Kimberly Midmon' | 'Kimonge Jr.' | 'Narrator';
  dialogue?: string;
  companionCommentary?: {
    speaker: 'Lucy Shallah' | 'Sundiata Keita';
    thought: string;
  };
  narrativeText: string;
  loreNote?: string;
  sceneTheme: 'sanctuary' | 'battlefield' | 'aqueduct' | 'citadel' | 'cosmos';
  choices: StoryChoice[];
  isEnding?: boolean;
  endingTitle?: string;
}

export interface StoryProgress {
  currentNodeId: string;
  visitedNodeIds: string[];
  relics: StoryRelic[];
  stats: {
    justice: number;
    valor: number;
    harmony: number;
  };
  unlockedChapters: number[];
  completedEndings: string[];
  startedAt: string;
  lastPlayedAt: string;
}

export const MIDMON_CHARACTERS: Record<string, StoryCharacter> = {
  lucyShallah: {
    id: 'lucyShallah',
    name: 'Lucy Shallah',
    title: 'Environmental Class-Action Litigator & Constitutional Defender',
    role: 'protagonist',
    avatarEmoji: '⚖️',
    colorScheme: {
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-400',
      text: 'text-emerald-200',
      accent: 'emerald',
    },
    bio: 'Pivotal figure in Raham Protocol 6 & 7. A fearless human rights lawyer who spearheaded litigation against corporate chemical dumping in the Tarasaa River basin and dismantled weaponized intelligence dossiers. She wields Articles 42, 43, 50, and 70 of the Constitution to protect vulnerable coastal communities without paying court filing fees.',
    weaponsAndAbilities: [
      'Article 70 Environmental Conservatory Injunction',
      'The Precautionary Principle & Polluter Pays Evidentiary Reversal',
      'Forensic Dismantling of Fabricated Intelligence Dossiers',
    ],
  },
  sundiataKeita: {
    id: 'sundiataKeita',
    name: 'Sundiata Keita',
    title: 'The Lion King of Mali & Author of the 1236 Kurukan Fuga',
    role: 'companion',
    avatarEmoji: '🦁',
    colorScheme: {
      bg: 'bg-amber-950/80',
      border: 'border-amber-400',
      text: 'text-amber-200',
      accent: 'amber',
    },
    bio: 'The legendary 13th-century African sovereign statesman who proclaimed the Kurukan Fuga—the earliest recorded constitutional human rights charter. In the World of the Midmons, he stands shoulder-to-shoulder with Lucy Shallah to defend communal land, water rights, and human dignity against modern predatory oligarchs.',
    weaponsAndAbilities: [
      'The 1236 Kurukan Fuga Sovereign Charter of Human Dignity',
      'Royal Mandate of Communal Land & River Stewardship',
      'Iron Will of the Manden Assembly',
    ],
  },
  miriamMidmon: {
    id: 'miriamMidmon',
    name: 'Miriam Midmon',
    title: 'Matriarch of the Midmon Family & Sails Point Guardian',
    role: 'mentor',
    avatarEmoji: '🦅',
    colorScheme: {
      bg: 'bg-purple-950/80',
      border: 'border-purple-400',
      text: 'text-purple-200',
      accent: 'purple',
    },
    bio: 'From Raham Protocol 6 & 8. Elder community matriarch who anchored the legal resistance against commercial land grabbers threatening the 35-acre golden eagle sanctuary at Sails Point (The Sank).',
    weaponsAndAbilities: [
      'Public Trust Doctrine Stewardship',
      'Community Land Trust Custodianship',
    ],
  },
  kimMidmon: {
    id: 'kimMidmon',
    name: 'Commander Kim Midmon',
    title: 'Decorated Commander & Due Process Whistleblower',
    role: 'ally',
    avatarEmoji: '🎖️',
    colorScheme: {
      bg: 'bg-blue-950/80',
      border: 'border-blue-400',
      text: 'text-blue-200',
      accent: 'blue',
    },
    bio: 'From Raham Protocol 7. A disciplined security commander who blew the whistle on rogue intelligence operations, vindicating his name against tailored frame-up dossiers through Section 17 self-defense and constitutional full disclosure.',
    weaponsAndAbilities: [
      'Section 17 Lawful Self-Defense Tactical Mastery',
      'Chain of Custody Forensic Evidence Verification',
    ],
  },
  agnesKimberlyMidmon: {
    id: 'agnesKimberlyMidmon',
    name: 'Agnes Kimberly Midmon',
    title: 'Youth Environmental Leader & Jumbo Kids Steward',
    role: 'ally',
    avatarEmoji: '🌱',
    colorScheme: {
      bg: 'bg-teal-950/80',
      border: 'border-teal-400',
      text: 'text-teal-200',
      accent: 'teal',
    },
    bio: 'From Raham Protocol 8. Fearless youth organizer alongside Agnes Kimondo and Sahiban Khan who mobilized coastal youth to establish peace sanctuaries and protect the golden eagle nesting grounds at Sails Point.',
    weaponsAndAbilities: [
      'Youth Conservation Mobilization',
      'Rapid Caveat & Public Notice Dispatch',
    ],
  },
  kimongeJr: {
    id: 'kimongeJr',
    name: 'Kimonge Jr.',
    title: 'Commercial Mega-Developer & Cartel Representative',
    role: 'antagonist',
    avatarEmoji: '🚜',
    colorScheme: {
      bg: 'bg-red-950/80',
      border: 'border-red-500',
      text: 'text-red-200',
      accent: 'red',
    },
    bio: 'From Raham Protocol 8. A ruthless commercial land developer boasting that "everyone has their price," seeking to bribe local chiefs and bulldoze Sails Point for high-rise commercial subdivisions.',
    weaponsAndAbilities: [
      'SLAPP Lawsuit Threats & Bribery Schemes',
      'Illegal Land Registry Subdivisions',
    ],
  },
};

export const MIDMON_RELICS: Record<string, StoryRelic> = {
  kurukanLeaf: {
    id: 'kurukanLeaf',
    name: 'Kurukan Fuga Charter Parchment',
    description: 'The ancient 1236 charter proclaimed by Sundiata Keita at Kangaba, establishing that forests, clean water, and bodily liberty belong to all citizens equally.',
    origin: 'The Plain of Kangaba, Mali Empire (1236 CE)',
    power: 'Dispels authoritarian decrees and establishes universal communal rights.',
    icon: '📜',
  },
  shallahInjunction: {
    id: 'shallahInjunction',
    name: 'Lucy Shallah Article 70 Injunction',
    description: 'A certified High Court conservatory stop-order drafted by Lucy Shallah, halting illegal demolition and commercial discharge without court filing fees.',
    origin: 'The Environment and Land Court of Kenya',
    power: 'Instantly halts corporate bulldozers and freezes irregular land leases.',
    icon: '⚖️',
  },
  eagleFeather: {
    id: 'eagleFeather',
    name: 'Sails Point Golden Eagle Feather',
    description: 'A radiant feather blessed by Miriam Midmon and the golden eagles of The Sank, symbolizing the sacred trust of Kenya’s coastal biodiversity.',
    origin: 'Sails Point 35-Acre Sanctuary (The Sank)',
    power: 'Inspires grassroots community solidarity against bribery and intimidation.',
    icon: '🪶',
  },
  trustDeed: {
    id: 'trustDeed',
    name: 'Perpetual Conservation Trust Deed',
    description: 'An irrevocable land trust deed registered under the Trustees (Perpetual Succession) Act Cap 164, permanently shielding community land from commercial buyout.',
    origin: 'Raham Protocol 8 Land Trust Framework',
    power: 'Permanently voids corrupt private sales and locks land into community stewardship.',
    icon: '🏛️',
  },
  forensicWaterReport: {
    id: 'forensicWaterReport',
    name: 'Government Chemist Tarasaa Water Report',
    description: 'A certified chemical analysis from the Government Chemist and WRA proving hazardous fertilizer runoff into community drinking wells.',
    origin: 'Government Chemist Department & Water Resources Authority',
    power: 'Triggers the Polluter Pays Principle and shifts the full burden of proof onto polluters.',
    icon: '🧪',
  },
};

export const MIDMON_STORY_NODES: Record<string, StoryNode> = {
  // -------------------------------------------------------------
  // CHAPTER 1: THE BULLDOZERS AT SAILS POINT
  // -------------------------------------------------------------
  c1_start: {
    id: 'c1_start',
    chapterId: 1,
    chapterTitle: 'Chapter 1: The Breach at Sails Point',
    location: 'Sails Point Golden Eagle Sanctuary (The Sank)',
    speaker: 'Narrator',
    narrativeText: `Dawn breaks over the 35-acre golden eagle sanctuary at Sails Point—known affectionately by the community as 'The Sank.' The morning mist over the coastal wetlands is suddenly shattered by the roar of heavy diesel engines.

Commercial developer Kimonge Jr. has arrived at the perimeter gates accompanied by private security and two industrial bulldozers. Waving an irregular lease allocation, Kimonge Jr. announces through a megaphone: "Everyone has their price! This sanctuary is scheduled for luxury seaside high-rise subdivision today!"

Standing resolute before the locked wooden gates are young Agnes Kimberly Midmon, matriarch Miriam Midmon, and Attorney Lucy Shallah with a briefcase of legal pleadings. Standing beside Lucy is Sundiata Keita—the Lion King of Mali and author of the 1236 Kurukan Fuga.`,
    loreNote: 'From Raham Protocol 8: Kenya’s coastal ecosystems, wildlife nesting peninsulas, and ancestral heritage are held in sacred trust under Article 69(1). No private developer can claim an unfettered right to desecrate protected ecological havens.',
    sceneTheme: 'sanctuary',
    choices: [
      {
        id: 'c1_choice_injunction',
        text: 'Have Lucy Shallah serve Kimonge Jr. with an Article 70 Emergency Conservatory Injunction.',
        nextNodeId: 'c1_lucy_injunction',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        relicAwarded: MIDMON_RELICS.shallahInjunction,
        outcomeText: 'Lucy steps forward with the High Court conservatory order, stopping the bulldozers in their tracks!',
      },
      {
        id: 'c1_choice_sundiata_speech',
        text: 'Have Sundiata Keita confront Kimonge Jr. with the ancient Kurukan Fuga mandate of communal dignity.',
        nextNodeId: 'c1_sundiata_confrontation',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 3 },
        relicAwarded: MIDMON_RELICS.kurukanLeaf,
        outcomeText: 'Sundiata raises his hand, and the workers refuse to start the bulldozers out of profound reverence!',
      },
      {
        id: 'c1_choice_community_circle',
        text: 'Mobilize the Jumbo Kids and community elders into a peaceful human barrier holding eagle feathers.',
        nextNodeId: 'c1_community_stand',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 3 },
        relicAwarded: MIDMON_RELICS.eagleFeather,
        outcomeText: 'The golden eagles circle overhead, and the local community forms an unbroken shield of peace.',
      },
    ],
  },

  c1_lucy_injunction: {
    id: 'c1_lucy_injunction',
    chapterId: 1,
    chapterTitle: 'Chapter 1: The Breach at Sails Point',
    location: 'The Gates of The Sank',
    speaker: 'Lucy Shallah',
    dialogue: '“Turn off those diesel engines immediately, Mr. Kimonge! Under Article 70 of the Constitution of Kenya and the Public Trust Doctrine established in Peter K. Waweru v Republic, the environment is held in sacred trust for current and future generations. We have lodged a formal restriction with the Lands Registry under Section 76 of the Land Registration Act. If your bulldozer advances one inch, you face personal contempt of court!”',
    companionCommentary: {
      speaker: 'Sundiata Keita',
      thought: 'Her words carry the true thunder of justice. She does not plead with tyranny—she commands it to halt under the sovereign authority of the law.',
    },
    narrativeText: `Kimonge Jr.’s attorney frantically inspects the High Court seal on Lucy’s Article 70 order. Realizing that the Mutunga Rules abolished strict filing fees and granted public interest standing to any resident, Kimonge Jr. sneers:

“You may have stopped my tractors today, Shallah. But our fertilizer consortium in the Tarasaa River basin already has government backing. If you don’t drop this public interest nonsense, my associates will make sure you and Commander Kim Midmon regret it!”`,
    sceneTheme: 'sanctuary',
    choices: [
      {
        id: 'c1_proceed_tarasaa',
        text: 'Investigate the toxic chemical dumping in the Tarasaa River Basin before community health is ruined.',
        nextNodeId: 'c2_tarasaa_arrival',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        outcomeText: 'You and Lucy prepare the Raham Protocol 6 environmental action kit and head toward Tarasaa.',
      },
    ],
  },

  c1_sundiata_confrontation: {
    id: 'c1_sundiata_confrontation',
    chapterId: 1,
    chapterTitle: 'Chapter 1: The Breach at Sails Point',
    location: 'The Ridge Overlooking Sails Point',
    speaker: 'Sundiata Keita',
    dialogue: '“Eight centuries ago, upon the plains of Kangaba, our twelve kingdoms proclaimed the Kurukan Fuga: ‘Do not offend the trees; do not poison the drinking well; do not enslave the weak through hunger.’ You boast that everyone has a price, Kimonge. But the dignity of the soil and the nesting eagle have no price, for they belong to the unborn!”',
    companionCommentary: {
      speaker: 'Lucy Shallah',
      thought: 'The bulldozer operators stepped off their machines. Sundiata awakened their conscience. No mercenary wage can buy a man whose ancestral dignity is restored.',
    },
    narrativeText: `The bulldozer drivers turn off their ignitions and hand their keys to Miriam Midmon. Kimonge Jr. turns red with fury, threatening criminal retaliations through his corrupt business associates in the Tarasaa industrial zone.

Miriam Midmon turns to you and Sundiata: “The developer’s cartel operates across two fronts. While Kimonge attempts to steal Sails Point, his chemical partner is discharging toxic effluent directly into the Tarasaa River!”`,
    sceneTheme: 'sanctuary',
    choices: [
      {
        id: 'c1_ride_to_tarasaa',
        text: 'Ride with Sundiata and Lucy to confront the Tarasaa chemical polluters.',
        nextNodeId: 'c2_tarasaa_arrival',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 3 },
        outcomeText: 'You set out with Sundiata Keita and Lucy Shallah to defend the Tarasaa River basin.',
      },
    ],
  },

  c1_community_stand: {
    id: 'c1_community_stand',
    chapterId: 1,
    chapterTitle: 'Chapter 1: The Breach at Sails Point',
    location: 'The Golden Eagle Nesting Ridge',
    speaker: 'Agnes Kimberly Midmon',
    dialogue: '“We are the Jumbo Kids! We planted these mangrove roots with our grandmothers. We watch the golden eagles hatch every rainy season. You cannot buy our home because our home is not for sale!”',
    narrativeText: `Fifty youth and elders link arms along the fence line, singing coastal peace songs. A pair of golden eagles soars overhead, their wings casting vast golden shadows across the bulldozers.

Shamed by the peaceful courage of the youth, the construction crew retreats. But Lucy Shallah points to an urgent dispatch on her tablet:

Reports from the Tarasaa River indicate children and women are suffering acute chemical burns from industrial fertilizer runoff!`,
    sceneTheme: 'sanctuary',
    choices: [
      {
        id: 'c1_dispatch_tarasaa',
        text: 'Mobilize immediately to the Tarasaa River Basin to halt the toxic industrial contamination.',
        nextNodeId: 'c2_tarasaa_arrival',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 3 },
        outcomeText: 'You rush with Lucy Shallah to defend the clean water rights of the Tarasaa community.',
      },
    ],
  },

  // -------------------------------------------------------------
  // CHAPTER 2: THE POISONED WATERS OF TARASAA
  // -------------------------------------------------------------
  c2_tarasaa_arrival: {
    id: 'c2_tarasaa_arrival',
    chapterId: 2,
    chapterTitle: 'Chapter 2: The Toxic Waters of the Tarasaa Basin',
    location: 'Tarasaa River Basin & Community Water Wells',
    speaker: 'Narrator',
    narrativeText: `You arrive at the Tarasaa River basin. Where clean water once flowed to irrigate community farms and provide drinking water for village children, the water is dark, foamy, and emits a pungent chemical stench.

Local women show Lucy and Sundiata severe chemical rashes on their hands and feet from washing clothes in the river. Dead catfish float near the banks. 

Upstream, the massive pipes of the Tarasaa Fertilizer Plant discharge untreated industrial effluent directly into the public water table. Company security guards and corporate lawyers mock the villagers: "Prove in court that our fertilizer caused your rashes! Unless you pay a 5-million-shilling security deposit, your case will be thrown out!"`,
    loreNote: 'From Raham Protocol 6: Under Article 42, 43, and EMCA Cap 387, clean water is a non-negotiable survival right. The Precautionary Principle dictates that once contamination is documented, the burden shifts entirely to the polluter to prove non-toxicity.',
    sceneTheme: 'aqueduct',
    choices: [
      {
        id: 'c2_choice_precautionary',
        text: 'Deploy Raham Protocol 6: Shift the burden of proof onto the polluter using the Precautionary Principle.',
        nextNodeId: 'c2_precautionary_argument',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        outcomeText: 'Lucy quotes Section 3(5)(f) of EMCA, demanding an immediate independent audit at corporate expense!',
      },
      {
        id: 'c2_choice_water_testing',
        text: 'Conduct rapid forensic water sampling with the Water Resources Authority (WRA) and Government Chemist.',
        nextNodeId: 'c2_forensic_sampling',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 3 },
        relicAwarded: MIDMON_RELICS.forensicWaterReport,
        outcomeText: 'You secure certified Government Chemist laboratory reports proving acute industrial toxicity!',
      },
      {
        id: 'c2_choice_keita_community_rally',
        text: 'Have Sundiata Keita lead the Tarasaa villagers in a peaceful blockade of the plant’s drainage canal.',
        nextNodeId: 'c2_peaceful_canal_blockade',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 3 },
        outcomeText: 'Sundiata and the village elders seal the toxic runoff pipe with sandbags and stone barriers!',
      },
    ],
  },

  c2_precautionary_argument: {
    id: 'c2_precautionary_argument',
    chapterId: 2,
    chapterTitle: 'Chapter 2: The Toxic Waters of the Tarasaa Basin',
    location: 'Outside the Tarasaa Chemical Plant Main Gate',
    speaker: 'Lucy Shallah',
    dialogue: '“Listen carefully, counsel! Under Section 3(5)(f) of EMCA Cap 387 and Article 70(2) of the Constitution, our clients do NOT need to demonstrate financial loss or medical certainty. The Precautionary Principle dictates that lack of full scientific certainty shall not be used to postpone conservatory stop-orders! The burden of proof is entirely on your client to prove their effluent is non-toxic!”',
    companionCommentary: {
      speaker: 'Sundiata Keita',
      thought: 'Her legal brilliance turns the arrogance of the wealthy into dust. The ancient laws of the Sahel and the modern constitution speak the same undeniable truth.',
    },
    narrativeText: `The corporate attorneys stammer and retreat behind their security gates. But as Lucy files the emergency pleadings with the Environment and Land Court, a convoy of unmarked black SUVs pulls up.

Senior rogue intelligence operatives step out, waving a classified security folder labeled: 'CONFIDENTIAL DOSSIER: OPERATION SUBVERSIVE ADVOCATE - TARGET LUCY SHALLAH & COMMANDER KIM MIDMON.'`,
    sceneTheme: 'aqueduct',
    choices: [
      {
        id: 'c2_advance_to_c3',
        text: 'Stand with Lucy and Commander Kim Midmon to dismantle the fabricated intelligence dossier.',
        nextNodeId: 'c3_frame_up_arrival',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        outcomeText: 'You prepare to execute Raham Protocol 7 against malicious state frame-ups.',
      },
    ],
  },

  c2_forensic_sampling: {
    id: 'c2_forensic_sampling',
    chapterId: 2,
    chapterTitle: 'Chapter 2: The Toxic Waters of the Tarasaa Basin',
    location: 'The Tarasaa River Sampling Point',
    speaker: 'Lucy Shallah',
    dialogue: '“Under Article 35 of the Constitution, every citizen has the right to access information held by public bodies. We requisition the Water Resources Authority and Government Chemist to certify these water samples on an emergency priority basis!”',
    narrativeText: `Within 24 hours, the certified Government Chemist laboratory results return: the river contains 450% higher concentrations of toxic sulfur compounds and heavy metals than permitted safety thresholds!

The corporate managers face imminent criminal prosecution under the Water Act 2016. Desperate to bury the environmental suit, the cartel activates their corrupt allies in rogue state intelligence to manufacture criminal charges against Lucy Shallah!`,
    sceneTheme: 'aqueduct',
    choices: [
      {
        id: 'c2_confront_dossier',
        text: 'Proceed to Chapter 3 to confront the corrupt intelligence agents attempting to frame Lucy.',
        nextNodeId: 'c3_frame_up_arrival',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        outcomeText: 'You rush to the capital to protect Lucy Shallah and Commander Kim Midmon.',
      },
    ],
  },

  c2_peaceful_canal_blockade: {
    id: 'c2_peaceful_canal_blockade',
    chapterId: 2,
    chapterTitle: 'Chapter 2: The Toxic Waters of the Tarasaa Basin',
    location: 'The Drainage Canal of the Fertilizer Plant',
    speaker: 'Sundiata Keita',
    dialogue: '“In the Manden, when a clan poisoned the drinking well of its neighbors, the elders stripped them of their chieftaincy. Water is the blood of the earth. We will not allow our children to drink poison while you count gold!”',
    companionCommentary: {
      speaker: 'Lucy Shallah',
      thought: 'Sundiata’s moral clarity mobilized the entire sub-county. Over two hundred community members joined the peaceful barrier, refusing to let the plant operate until treatment filters were installed.',
    },
    narrativeText: `With the drainage canal peacefully blocked by community stones and coconut logs, the factory is forced to halt operations. 

Enraged by the shutdown, the corporate directors place a panic call to corrupt senior operatives in regional security: "Frame Shallah! Label her an enemy of the state before the High Court issues an official injunction!"`,
    sceneTheme: 'aqueduct',
    choices: [
      {
        id: 'c2_stand_against_dossier',
        text: 'Travel with Sundiata and Lucy to confront the corrupt intelligence operation.',
        nextNodeId: 'c3_frame_up_arrival',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 3 },
        outcomeText: 'You head toward the confrontation with the rogue security agents in Chapter 3.',
      },
    ],
  },

  // -------------------------------------------------------------
  // CHAPTER 3: THE FABRICATED INTELLIGENCE DOSSIER
  // -------------------------------------------------------------
  c3_frame_up_arrival: {
    id: 'c3_frame_up_arrival',
    chapterId: 3,
    chapterTitle: 'Chapter 3: The Rogue Intelligence Frame-Up',
    location: 'The High Court Corridors & Regional Police Headquarters',
    speaker: 'Narrator',
    narrativeText: `The cartel has struck back with the ultimate weapon of corrupt regimes: state-sponsored fabrication. 

Rogue intelligence operatives led by compromised agents have leaked an explosive, tailored intelligence file to the press. The dossier falsely accuses Attorney Lucy Shallah and Commander Kim Midmon of being 'ringleaders of an armed subversive syndicate attempting to sabotage national critical infrastructure.'

Armed rogue officers without uniform name tags corner Lucy Shallah and Commander Kim Midmon outside the courthouse, attempting an unrecorded abduction into an unmarked vehicle with disguised plates!`,
    loreNote: 'From Raham Protocol 7: Intelligence briefs are NOT judicial evidence. Under Article 50(2)(j) and the Evidence Act (Cap 80), unsourced hearsay manufactured to intimidate critics is inadmissible. Section 17 of the Penal Code guarantees the statutory right to lawful self-defense.',
    sceneTheme: 'battlefield',
    choices: [
      {
        id: 'c3_choice_kim_defense',
        text: 'Commander Kim Midmon invokes Section 17 Penal Code lawful self-defense to prevent the unlawful abduction.',
        nextNodeId: 'c3_lawful_self_defense',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 4 },
        outcomeText: 'Commander Kim Midmon disarms the rogue abductors with disciplined tactical restraint!',
      },
      {
        id: 'c3_choice_full_disclosure',
        text: 'Lucy Shallah demands immediate full disclosure of the raw evidence chain under Article 50(2)(j).',
        nextNodeId: 'c3_dossier_cross_examination',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 4 },
        outcomeText: 'Lucy tears the fabricated dossier apart in open court, exposing forged signatures!',
      },
      {
        id: 'c3_choice_sundiata_baraza',
        text: 'Sundiata Keita summons the public, journalists, and IPOA monitors into an open-air Baraza of Truth.',
        nextNodeId: 'c3_public_baraza_exposure',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 4 },
        outcomeText: 'Sundiata rallies the crowd and media cameras, putting the rogue agents under public scrutiny!',
      },
    ],
  },

  c3_lawful_self_defense: {
    id: 'c3_lawful_self_defense',
    chapterId: 3,
    chapterTitle: 'Chapter 3: The Rogue Intelligence Frame-Up',
    location: 'Outside the High Court Parking Bay',
    speaker: 'Commander Kim Midmon',
    dialogue: '“Stand down! Under Section 17 of the Penal Code, every citizen and officer has the inviolable statutory right to defend themselves and others against imminent unlawful violence using reasonable force! You have no warrant, you have concealed your service numbers, and this vehicle has no official police registry. Attempting to abduct an officer of the court is a felony!”',
    companionCommentary: {
      speaker: 'Sundiata Keita',
      thought: 'The commander moves with the poise of a true Manden warrior. He defended his people without spilling unnecessary blood, exposing the cowards for who they are.',
    },
    narrativeText: `Commander Kim Midmon deftly neutralizes the rogue agents' attempts to seize Lucy, securing their forged authorization passes. IPOA investigators and court security arrive on the scene within minutes, taking the rogue operatives into custody.

Lucy Shallah holds up the seized dossier: “Now let us take this fabricated file before the High Court judge and hold the puppet-masters personally liable for malicious prosecution under Article 23!”`,
    sceneTheme: 'battlefield',
    choices: [
      {
        id: 'c3_proceed_to_c4_victory',
        text: 'Advance to the High Court and Sails Point for the final triumphant verdict in Chapter 4.',
        nextNodeId: 'c4_citadel_apex',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 3 },
        outcomeText: 'You head toward the grand finale of the Midmon Odyssey.',
      },
    ],
  },

  c3_dossier_cross_examination: {
    id: 'c3_dossier_cross_examination',
    chapterId: 3,
    chapterTitle: 'Chapter 3: The Rogue Intelligence Frame-Up',
    location: 'The High Court Constitutional Chamber',
    speaker: 'Lucy Shallah',
    dialogue: '“Your Honor! Under Article 50(2)(j) of the Constitution and the Evidence Act Cap 80, the state is under strict constitutional obligation to disclose all raw evidence and chain of custody. This intelligence file relies entirely on anonymous hearsay manufactured by agents on the payroll of the Tarasaa chemical syndicate! Individual officers who draft false reports commit perjury, forgery, and abuse of office under Section 101 of the Penal Code!”',
    narrativeText: `Under Lucy Shallah’s forensic cross-examination, the intelligence brief completely disintegrates. The prosecutor is forced to withdraw all charges with prejudice. 

The presiding High Court judge issues a blistering ruling, ordering the EACC and IPOA to investigate the rogue officers and awarding exemplary damages to Lucy Shallah and Commander Kim Midmon!`,
    sceneTheme: 'battlefield',
    choices: [
      {
        id: 'c3_advance_c4_justice',
        text: 'Proceed to Chapter 4 to establish the irrevocable Perpetual Conservation Land Trust at Sails Point.',
        nextNodeId: 'c4_citadel_apex',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 3 },
        outcomeText: 'You head to Sails Point for the signing of the Perpetual Conservation Trust.',
      },
    ],
  },

  c3_public_baraza_exposure: {
    id: 'c3_public_baraza_exposure',
    chapterId: 3,
    chapterTitle: 'Chapter 3: The Rogue Intelligence Frame-Up',
    location: 'The Public Court Steps & Media Plaza',
    speaker: 'Sundiata Keita',
    dialogue: '“Let the cameras roll! Let the world see how corrupt men hide behind secrecy when the light of the constitution shines upon them! You cannot frame the truth, for the truth is written in the blood and sweat of the people!”',
    narrativeText: `Over fifty national television cameras and digital live streams broadcast Sundiata’s speech across Kenya and the world. 

The rogue operatives flee from the media glare in disgrace. The Ministry of Interior immediately issues a public apology, suspending the rogue officers and affirming Lucy Shallah’s environmental litigation as an exemplary public service!`,
    sceneTheme: 'battlefield',
    choices: [
      {
        id: 'c3_advance_c4_harmony',
        text: 'Return to Sails Point for the Grand Assembly and establishment of the Perpetual Trust.',
        nextNodeId: 'c4_citadel_apex',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 3 },
        outcomeText: 'You travel back to Sails Point for the decisive victory in Chapter 4.',
      },
    ],
  },

  // -------------------------------------------------------------
  // CHAPTER 4: THE SAILS POINT PERPETUAL TRUST COVENANT
  // -------------------------------------------------------------
  c4_citadel_apex: {
    id: 'c4_citadel_apex',
    chapterId: 4,
    chapterTitle: 'Chapter 4: The Great Sails Point Covenant',
    location: 'Sails Point Golden Eagle Sanctuary (The Sank)',
    speaker: 'Narrator',
    narrativeText: `The community gathers in triumph at Sails Point. The toxic Tarasaa chemical plant upstream has been permanently shut down by court order and mandated to pay full environmental restitution to the villagers. Kimonge Jr.’s irregular lease allocations have been revoked by the National Land Commission.

Under the shade of the ancient baobabs where golden eagles nest, a massive community Baraza is convened. Miriam Midmon, Commander Kim Midmon, young Agnes Kimberly Midmon, and the Jumbo Kids stand alongside Lucy Shallah and Sundiata Keita.

On the table rests the model deed for the Perpetual Conservation Land Trust under the Trustees (Perpetual Succession) Act Cap 164.

This is the historic moment: How will you, Lucy Shallah, and Sundiata Keita seal the permanent protection of Sails Point and the World of the Midmons?`,
    loreNote: 'From Raham Protocol 8: Establish registered conservation trusts under the Trustees Act Cap 164, placing land under community custody with binding negative easements prohibiting commercial subdivision or high-rise development.',
    sceneTheme: 'citadel',
    choices: [
      {
        id: 'c4_ending_balance',
        text: 'Unite the Kurukan Fuga and Kenyan Law into the Golden Sails Point Perpetual Trust Deed.',
        nextNodeId: 'ending_golden_covenant',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 5 },
        relicAwarded: MIDMON_RELICS.trustDeed,
        tokenReward: 1000,
        outcomeText: 'You achieve the True Master Ending of the Midmon Odyssey!',
      },
      {
        id: 'c4_ending_valor',
        text: 'Establish the Commander Kim Midmon & Sundiata Keita Grassroots Youth Peace Vanguard.',
        nextNodeId: 'ending_lion_sovereign',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 5 },
        tokenReward: 750,
        outcomeText: 'You establish the Youth Environmental Sentinel Guard across coastal Kenya!',
      },
      {
        id: 'c4_ending_justice',
        text: 'Enact the Lucy Shallah Environmental Justice Legal Clinic Network across all 47 Counties.',
        nextNodeId: 'ending_archival_genesis',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 5 },
        tokenReward: 750,
        outcomeText: 'You institutionalize the Lucy Shallah Directive into national paralegal practice!',
      },
    ],
  },

  ending_golden_covenant: {
    id: 'ending_golden_covenant',
    chapterId: 4,
    chapterTitle: 'Grand Finale: The Golden Covenant of Sails Point',
    location: 'The 35-Acre Golden Eagle Haven of The Sank',
    speaker: 'Lucy Shallah & Sundiata Keita',
    dialogue: '“Let this charter stand across all generations: This land and its waters are held in sacred trust for the children, the eagles, and the unborn. No private developer, no commercial syndicate, and no corrupted state officer shall ever desecrate what the people have consecrated in justice!”',
    narrativeText: `With the ceremonial signatures of Miriam Midmon, Commander Kim Midmon, Lucy Shallah, and Sundiata Keita, the Perpetual Conservation Land Trust is registered in perpetuity. Binding negative easements prohibit commercial subdivision forever.

A pair of golden eagles circles high above The Sank, their triumphant cries echoing across the coastal waters. The Tarasaa River runs clean and crystal-clear once more.

Agnes Kimberly Midmon presents you with the Golden Eagle Perpetual Trust Deed. Lucy Shallah clasps your hand with deep respect:

“You have walked through the World of the Midmons and proven that when constitutional law, ancestral wisdom, and grassroots courage unite, no corrupt syndicate can ever prevail.”`,
    loreNote: 'EASTER EGG TRIUMPH: You have unlocked the Highest Secret Archive of the Midmons! You have been awarded 1,000 Facilitator Tokens for your legendary achievement.',
    sceneTheme: 'cosmos',
    isEnding: true,
    endingTitle: '🏆 True Ending: The Golden Covenant of Sails Point',
    choices: [
      {
        id: 'replay_story',
        text: 'Explore other decision branches through the Midmon Chronicles.',
        nextNodeId: 'c1_start',
        affinity: 'harmony',
        statBonus: { stat: 'harmony', amount: 0 },
        outcomeText: 'Re-entering the open realm at Sails Point.',
      },
    ],
  },

  ending_lion_sovereign: {
    id: 'ending_lion_sovereign',
    chapterId: 4,
    chapterTitle: 'Grand Finale: The Youth Environmental Sentinel Guard',
    location: 'The Jumbo Kids Peace Pavilion, Sails Point',
    speaker: 'Sundiata Keita',
    dialogue: '“The greatest defense of any nation is not stone walls, but the unyielding spirit of its youth who know their rights and love their soil!”',
    narrativeText: `Commander Kim Midmon and Sundiata Keita formally inaugurate the coastal Youth Environmental Sentinel Guard. Over five hundred young paralegals and conservationists from Kwale, Mombasa, and Kilifi are trained to detect illegal land incursions and report river pollution within minutes.

Kimonge Jr. and his predatory developer associates are permanently banished from the coast. Sails Point stands as an unconquerable fortress of peace and wildlife stewardship.`,
    isEnding: true,
    endingTitle: '🦁 Ending: The Youth Environmental Sentinel Guard',
    sceneTheme: 'cosmos',
    choices: [
      {
        id: 'replay_story_lion',
        text: 'Revisit the Midmon Chronicles to explore another path.',
        nextNodeId: 'c1_start',
        affinity: 'valor',
        statBonus: { stat: 'valor', amount: 0 },
        outcomeText: 'Returning to Sails Point.',
      },
    ],
  },

  ending_archival_genesis: {
    id: 'ending_archival_genesis',
    chapterId: 4,
    chapterTitle: 'Grand Finale: The Lucy Shallah Environmental Clinic Network',
    location: 'The High Court & Community Paralegal Center',
    speaker: 'Lucy Shallah',
    dialogue: '“When community paralegals know how to shift the burden of proof and assert Article 70 without court fees, corporate polluters have nowhere left to hide.”',
    narrativeText: `Lucy Shallah’s class-action victory becomes a benchmark across all Environment and Land Courts in Kenya. Using Raham Protocol 6, community paralegals across all 47 counties successfully shut down twelve other toxic dump sites and establish clean borehole networks for half a million citizens.

The World of the Midmons becomes a legendary national blueprint for environmental constitutionalism.`,
    isEnding: true,
    endingTitle: '⚖️ Ending: The Lucy Shallah Environmental Clinic Network',
    sceneTheme: 'cosmos',
    choices: [
      {
        id: 'replay_story_genesis',
        text: 'Revisit the Midmon Chronicles to explore another path.',
        nextNodeId: 'c1_start',
        affinity: 'justice',
        statBonus: { stat: 'justice', amount: 0 },
        outcomeText: 'Returning to Sails Point.',
      },
    ],
  },
};

const STORY_STORAGE_KEY = 'the_samaritan_midmon_story_progress_v1';

export function getStoredStoryProgress(): StoryProgress {
  if (typeof window === 'undefined') {
    return {
      currentNodeId: 'c1_start',
      visitedNodeIds: ['c1_start'],
      relics: [],
      stats: { justice: 0, valor: 0, harmony: 0 },
      unlockedChapters: [1],
      completedEndings: [],
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };
  }

  try {
    const raw = localStorage.getItem(STORY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const defaultProgress: StoryProgress = {
    currentNodeId: 'c1_start',
    visitedNodeIds: ['c1_start'],
    relics: [],
    stats: { justice: 0, valor: 0, harmony: 0 },
    unlockedChapters: [1],
    completedEndings: [],
    startedAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
  };
  saveStoredStoryProgress(defaultProgress);
  return defaultProgress;
}

export function saveStoredStoryProgress(progress: StoryProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new CustomEvent('midmon_story_progress_updated', { detail: progress }));
  } catch (e) {}
}

export function resetStoryProgress(): StoryProgress {
  const fresh: StoryProgress = {
    currentNodeId: 'c1_start',
    visitedNodeIds: ['c1_start'],
    relics: [],
    stats: { justice: 0, valor: 0, harmony: 0 },
    unlockedChapters: [1],
    completedEndings: [],
    startedAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
  };
  saveStoredStoryProgress(fresh);
  return fresh;
}
