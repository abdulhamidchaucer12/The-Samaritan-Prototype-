import fs from "fs";
import path from "path";

export interface RahamProtocolDocument {
  id: string;
  title: string;
  category: "constitution" | "human_rights" | "devolution" | "incident_reporting" | "peace_advocacy" | "public_finance" | "custom";
  statutoryAnchors: string; // e.g. "Article 22, KNCHR Act 2011, Evidence Act Cap 80"
  summary: string;
  fullContent: string;
  whatIfScenarios?: string;
  practicalExamples?: string;
  uploadedBy: string; // "The_Samaritan"
  uploadedAt: string;
  isActive: boolean;
  sourceType: "manual" | "upload" | "executive_decree";
}

const STORAGE_FILE = path.join(process.cwd(), "server_raham_protocol.json");

const INITIAL_RAHAM_DOCUMENTS: RahamProtocolDocument[] = [
  {
    id: "raham_001",
    title: "Raham Protocol 1: Public Interest Defense & Grassroots Paralegal Protection",
    category: "human_rights",
    statutoryAnchors: "Constitution of Kenya 2010 Articles 19, 20, 21, 22, 23 & KNCHR Act",
    summary: "Guiding principles for human rights defenders defending community water, ancestral land, and bodily security against unauthorized municipal or state aggression without paying court filing fees.",
    fullContent: `Under The Raham Protocol, Article 22 guarantees that any person acting in public interest or representing a vulnerable community has unrestrained standing to approach the High Court.
Key Rules:
1. Immunity from arbitrary court fees: The Chief Justice's Mutunga Rules dictate that Article 22 petitions cannot be denied for lack of filing fees.
2. Direct standing: You do not have to prove personal economic damage if public land, community health, or common water resources are jeopardized.
3. Rapid injunctions: Seek conservatory orders under Article 23(3) to halt demolitions or environmental degradation pending full hearing.
4. Protection of Defenders: Human rights defenders are protected under the UN Declaration on HRDs and Article 29 freedom and security of the person. Any intimidation by state actors must be logged directly with KNCHR and IPOA.`,
    whatIfScenarios: `What if the county government or private developer claims you have no 'locus standi' (legal standing) because the land is not in your individual name?
Answer: The Raham Protocol affirms that Article 22 completely abolished strict locus standi in Kenya. Cite the Supreme Court precedent in Mitu-Bell Welfare Society v KAA; any resident can champion collective constitutional rights.`,
    practicalExamples: `Example: In Matuga and Msambweni sub-counties, community members successfully halted sand harvesting polluting a village bore-hole by serving the sub-county administrator with an Article 22 conservatory notice co-signed by 25 residents citing Article 42 (Right to clean environment) and Article 43 (Right to clean water).`,
    uploadedBy: "The_Samaritan",
    uploadedAt: "2026-01-01T00:00:00.000Z",
    isActive: true,
    sourceType: "executive_decree",
  },
  {
    id: "raham_002",
    title: "Raham Protocol 2: Evidentiary Standards for Incident Reporting & Police Oversight",
    category: "incident_reporting",
    statutoryAnchors: "Evidence Act (Cap 80), National Police Service Act Sec 61, IPOA Act 2011",
    summary: "Standard operating procedure for logging human rights abuses, excessive use of force, unlawful detention, and bribery demands to satisfy judicial admissibility.",
    fullContent: `The Raham Protocol establishes five inviolable standards for writing an incident report:
1. Contemporaneous Logging: Write notes within 2 hours of the occurrence while recollections are vivid.
2. The 5 Ws and H: Record Who (exact names, officer ranks, badge numbers, uniforms), What (specific words spoken, weapon drawn, force applied), When (exact hour, minute, date), Where (exact GPS, village name, landmark, police station cell number), Why (stated justification by officer), and How (mode of arrest or damage).
3. Chain of Custody for Digital Evidence: Never alter photo/video EXIF metadata. Export uncompressed raw files to secure offline flash drives with cryptographic SHA-256 hash or verified timestamp.
4. Medical Examination (P3 Form): For physical injuries, demand an immediate examination by a registered government medical officer at a sub-county or level 4 hospital, and obtain a certified P3 form.
5. Submission: Transmit dual certified copies to IPOA (Independent Policing Oversight Authority) and KNCHR (Kenya National Commission on Human Rights) with stamped receiving acknowledgments.`,
    whatIfScenarios: `What if police officers conceal their service numbers or remove their uniform name tags during an operation?
Answer: Note this fact explicitly in Section 1 of the Incident Report. Under National Police Service Standing Orders and Section 61, concealing service numbers is an independent disciplinary infraction and creates a strong presumption of unlawful intent before the courts. Document the vehicle registration number, time of entry, and physical descriptions.`,
    practicalExamples: `Example: A youth arrested after curfew without charge was released after a paralegal drafted an incident report recording the vehicle registration (GKB), exact OB recording time (21:40), and officer in charge, submitting a complaint to the OCS and IPOA Regional Office citing Section 25 of the IPOA Act.`,
    uploadedBy: "The_Samaritan",
    uploadedAt: "2026-01-02T00:00:00.000Z",
    isActive: true,
    sourceType: "executive_decree",
  },
  {
    id: "raham_003",
    title: "Raham Protocol 3: Digital Peacebuilding & Social Media as a Narrative Tool for Peace",
    category: "peace_advocacy",
    statutoryAnchors: "Constitution Article 33, National Cohesion and Integration Act 2008, Cybercrimes Act",
    summary: "Strategic deployment of social media narratives to prevent ethnic polarization, de-escalate election or resource tensions, and counter viral propaganda on WhatsApp and TikTok.",
    fullContent: `The Raham Protocol recognizes digital platforms as the primary narrative battleground for peace and civic cohesion in Kenya.
Core Strategies:
1. Article 33 Boundary Analysis: Freedom of expression strictly does NOT extend to propaganda for war, incitement to violence, or advocacy of hatred based on ethnic origin (Article 33(2)).
2. Pre-bunking and Rapid Verification: When inflammatory rumors circulate regarding land allocations, election tallies, or communal clashes, civic leaders deploy verified infographics cross-referencing official County Gazettes or IEBC portals.
3. The Counter-Narrative Formula: Do not amplify hate speech by quoting it directly. Instead, reframe the issue around shared constitutional rights (Article 10 national cohesion, Article 27 non-discrimination).
4. WhatsApp Community Moderation: Establish community group guidelines prohibiting unverified voice notes and ethnic stereotypes. Deploy trained peace champions who issue immediate respectful fact-checks.`,
    whatIfScenarios: `What if an inflammatory video goes viral claiming that one ethnic community is taking away jobs or land in your county?
Answer: Execute Raham Protocol De-escalation: 1) Extract official county employment statistics showing compliance with Section 65 of County Governments Act (30% non-dominant ethnic quota). 2) Disseminate brief 30-second video clips featuring community elders and youth leaders affirming peaceful co-existence. 3) Report criminal hate speech clips directly to the NCIC (National Cohesion and Integration Commission) via WhatsApp hotline +254 702 443 322.`,
    practicalExamples: `Example: During local boundary disputes between coastal sub-counties, youth digital monitors created the '#AmaniYetuKwanza' narrative campaign, debunking 14 fake notices and convening joint TikTok live discussions between youth leaders from both sides, diffusing violence.`,
    uploadedBy: "The_Samaritan",
    uploadedAt: "2026-01-03T00:00:00.000Z",
    isActive: true,
    sourceType: "executive_decree",
  },
  {
    id: "raham_004",
    title: "Raham Protocol 4: Unrecorded Police Arrests, Cash Bail Extortion & Article 49 Safeguards",
    category: "constitution",
    statutoryAnchors: "Article 49, Criminal Procedure Code (Cap 75), Bail and Bond Policy Guidelines 2015",
    summary: "Operational tactics when police demand bribes for cash bail, refuse to record suspects in the Occurrence Book (OB), or hold citizens beyond the 24-hour limit.",
    fullContent: `Under The Raham Protocol, arbitrary detention without charge is a high constitutional violation.
Operational Steps:
1. Demand OB Number: An arrest does not legally exist until an OB (Occurrence Book) entry number is assigned. Politely insist: 'Officer, please provide our OB reference number for our family records under Article 35.'
2. Police Cash Bail is Mandatory for Bailable Offenses: Under Chief Justice Bail and Bond Policy Guidelines and Criminal Procedure Code, the OCS must grant reasonable police bond before court appearance unless murder, treason, or compelling state flight risk is established.
3. Recording Cash Bail: Never give undocumented cash. Police cash bail must be accompanied by an official duplicate Miscellaneous Receipt (F.O. 20).
4. The 24-Hour Rule: The 24-hour constitutional countdown begins the exact second the citizen is deprived of liberty, not when they arrive at the station. Weekends only extend the appearance to the earliest business hour on Monday.`,
    whatIfScenarios: `What if the police station commander (OCS) refuses to release a suspect on bond over a weekend for a minor misdemeanor like loitering or lack of ID?
Answer: Raham Protocol Emergency Escalation: 1) Call the IPOA 24/7 hotline (1559) or KNCHR toll-free (0800 720 627). 2) Contact the local Court Duty Magistrate or High Court Registrar on call to issue an oral bond order or habeas corpus. Lack of national ID is NOT a criminal offense under the Registration of Persons Act.`,
    practicalExamples: `Example: A bodaboda rider detained for 36 hours over alleged traffic infraction was immediately released when his community group cited Raham Protocol 4, Article 49(1)(f), and threatened a High Court petition against the station OCS personally for damages under Article 23(3)(e).`,
    uploadedBy: "The_Samaritan",
    uploadedAt: "2026-01-04T00:00:00.000Z",
    isActive: true,
    sourceType: "executive_decree",
  },
  {
    id: "raham_005",
    title: "Raham Protocol 5: Ward Social Audits, County ADP Tracking & Fighting Tender Diversions",
    category: "public_finance",
    statutoryAnchors: "Article 201, Public Finance Management Act 2012, PPADA 2015",
    summary: "Practical methodology for community monitoring teams to audit county projects, verify contractor bills of quantities (BQ), and challenge stolen project allocations.",
    fullContent: `The Raham Protocol provides a structured social auditing toolkit for citizens across all 47 counties of Kenya:
1. Requisition the BQ (Bill of Quantities): Under Article 35, write to the County Director of Procurement requesting the unpriced or priced Bill of Quantities for the road, clinic, or water project.
2. Ground Inspection: Convene a 5-person community inspection committee (including an artisan, youth leader, woman representative, and elder). Inspect depth of gravel, thickness of concrete, brand of water pumps against the BQ specs.
3. Social Audit Report: Compile findings with high-resolution photos, date stamps, and contractor project signboards.
4. Statutory Assembly Petition: If discrepancies exceed 15%, submit a formal petition under Article 119 and Section 15 of County Governments Act to the County Assembly Public Accounts and Investments Committee (CPAIC) and copy the Auditor-General's regional office.`,
    whatIfScenarios: `What if the county procurement department denies your request for project documents, claiming they are confidential?
Answer: The Raham Protocol instructs citizens to cite Section 4 of the Access to Information Act 2016 and High Court precedent in Katiba Institute v Presidents Delivery Unit. Public finance documents are NEVER confidential. State officers who unlawfully refuse public records face personal fines of up to KES 500,000 or 3 years imprisonment under Section 28 of the Access to Information Act.`,
    practicalExamples: `Example: In Matuga Ward, a proposed KES 4M solar dispensary lighting project that stalled for 18 months was completed within 3 weeks after the village social audit team cited Raham Protocol 5, submitted a formal inquiry to the County Health CECM, and copied the Ethics and Anti-Corruption Commission (EACC).`,
    uploadedBy: "The_Samaritan",
    uploadedAt: "2026-01-05T00:00:00.000Z",
    isActive: true,
    sourceType: "executive_decree",
  },
];

let cachedDocuments: RahamProtocolDocument[] | null = null;

export function getRahamProtocolDocuments(): RahamProtocolDocument[] {
  if (cachedDocuments) return cachedDocuments;

  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8");
      cachedDocuments = JSON.parse(data);
      return cachedDocuments || INITIAL_RAHAM_DOCUMENTS;
    }
  } catch (err) {
    console.warn("[Raham Protocol] Failed reading file storage, using defaults:", err);
  }

  cachedDocuments = [...INITIAL_RAHAM_DOCUMENTS];
  saveRahamProtocolDocuments(cachedDocuments);
  return cachedDocuments;
}

export function saveRahamProtocolDocuments(docs: RahamProtocolDocument[]): boolean {
  try {
    cachedDocuments = docs;
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(docs, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[Raham Protocol] Failed saving documents:", err);
    return false;
  }
}

export function addRahamProtocolDocument(doc: Omit<RahamProtocolDocument, "id" | "uploadedAt"> & { id?: string }): RahamProtocolDocument {
  const current = getRahamProtocolDocuments();
  const newDoc: RahamProtocolDocument = {
    id: doc.id || `raham_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: doc.title.trim(),
    category: doc.category || "custom",
    statutoryAnchors: doc.statutoryAnchors?.trim() || "Constitution of Kenya 2010",
    summary: doc.summary.trim(),
    fullContent: doc.fullContent.trim(),
    whatIfScenarios: doc.whatIfScenarios?.trim() || "",
    practicalExamples: doc.practicalExamples?.trim() || "",
    uploadedBy: doc.uploadedBy || "The_Samaritan",
    uploadedAt: new Date().toISOString(),
    isActive: doc.isActive !== false,
    sourceType: doc.sourceType || "manual",
  };

  const existingIdx = current.findIndex((d) => d.id === newDoc.id);
  if (existingIdx >= 0) {
    current[existingIdx] = newDoc;
  } else {
    current.unshift(newDoc);
  }

  saveRahamProtocolDocuments(current);
  return newDoc;
}

export function deleteRahamProtocolDocument(id: string): boolean {
  const current = getRahamProtocolDocuments();
  const filtered = current.filter((d) => d.id !== id);
  if (filtered.length !== current.length) {
    saveRahamProtocolDocuments(filtered);
    return true;
  }
  return false;
}

export function searchRahamProtocolKnowledge(query: string): RahamProtocolDocument[] {
  const docs = getRahamProtocolDocuments().filter((d) => d.isActive);
  const q = query.toLowerCase().trim();
  if (!q) return docs;

  const terms = q.split(/\s+/).filter(Boolean);
  return docs.filter((d) => {
    const text = `${d.title} ${d.category} ${d.statutoryAnchors} ${d.summary} ${d.fullContent} ${d.whatIfScenarios || ""} ${d.practicalExamples || ""}`.toLowerCase();
    return terms.some((t) => text.includes(t));
  });
}

export function formatRahamProtocolContextForAi(query: string): string {
  const matches = searchRahamProtocolKnowledge(query);
  const selected = matches.length > 0 ? matches.slice(0, 3) : getRahamProtocolDocuments().slice(0, 2);

  return selected
    .map(
      (d, i) => `=== THE RAHAM PROTOCOL REFERENCE #${i + 1}: ${d.title} ===
Statutory Anchors: ${d.statutoryAnchors}
Summary: ${d.summary}
Guidance & Core Rules:
${d.fullContent}
What-If Scenarios & Precedents:
${d.whatIfScenarios || "None recorded"}
Practical Real-World Example:
${d.practicalExamples || "None recorded"}
============================================================`
    )
    .join("\n\n");
}
