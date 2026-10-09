import { RahamProtocolDocument } from '../types';

const RAHAM_STORAGE_KEY = 'the_samaritan_raham_protocol_client_v1';

export const DEFAULT_RAHAM_DOCUMENTS: RahamProtocolDocument[] = [
  {
    id: 'raham_001',
    title: 'Raham Protocol 1: Public Interest Defense & Grassroots Paralegal Protection',
    category: 'human_rights',
    statutoryAnchors: 'Constitution of Kenya 2010 Articles 19, 20, 21, 22, 23 & KNCHR Act',
    summary: 'Guiding principles for human rights defenders defending community water, ancestral land, and bodily security against unauthorized municipal or state aggression without paying court filing fees.',
    fullContent: `Under The Raham Protocol, Article 22 guarantees that any person acting in public interest or representing a vulnerable community has unrestrained standing to approach the High Court.
Key Rules:
1. Immunity from arbitrary court fees: The Chief Justice's Mutunga Rules dictate that Article 22 petitions cannot be denied for lack of filing fees.
2. Direct standing: You do not have to prove personal economic damage if public land, community health, or common water resources are jeopardized.
3. Rapid injunctions: Seek conservatory orders under Article 23(3) to halt demolitions or environmental degradation pending full hearing.
4. Protection of Defenders: Human rights defenders are protected under the UN Declaration on HRDs and Article 29 freedom and security of the person. Any intimidation by state actors must be logged directly with KNCHR and IPOA.`,
    whatIfScenarios: `What if the county government or private developer claims you have no 'locus standi' (legal standing) because the land is not in your individual name?
Answer: The Raham Protocol affirms that Article 22 completely abolished strict locus standi in Kenya. Cite the Supreme Court precedent in Mitu-Bell Welfare Society v KAA; any resident can champion collective constitutional rights.`,
    practicalExamples: `Example: In Matuga and Msambweni sub-counties, community members successfully halted sand harvesting polluting a village bore-hole by serving the sub-county administrator with an Article 22 conservatory notice co-signed by 25 residents citing Article 42 (Right to clean environment) and Article 43 (Right to clean water).`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-01T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Article_22_Mutunga_Rules_High_Court_Guide.pdf',
    fileSizeBytes: 245000,
    externalLink: 'http://kenyalaw.org/kl/index.php?id=398',
    attachments: [
      {
        id: 'att_01',
        name: 'Article 22 High Court Practice Rules (PDF)',
        type: 'pdf',
        sizeBytes: 245000,
        externalUrl: 'http://kenyalaw.org/kl/index.php?id=398',
        description: 'Official statutory guide abolishing strict court filing fees for public interest litigation.',
        uploadedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'att_02',
        name: 'Kenya National Commission on Human Rights Reporting Portal',
        type: 'link',
        externalUrl: 'https://www.knchr.org',
        description: 'Statutory complaints gateway for human rights violations and protection of defenders.',
        uploadedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_002',
    title: 'Raham Protocol 2: Evidentiary Standards for Incident Reporting & Police Oversight',
    category: 'incident_reporting',
    statutoryAnchors: 'Evidence Act (Cap 80), National Police Service Act Sec 61, IPOA Act 2011',
    summary: 'Standard operating procedure for logging human rights abuses, excessive use of force, unlawful detention, and bribery demands to satisfy judicial admissibility.',
    fullContent: `The Raham Protocol establishes five inviolable standards for writing an incident report:
1. Contemporaneous Logging: Write notes within 2 hours of the occurrence while recollections are vivid.
2. The 5 Ws and H: Record Who (exact names, officer ranks, badge numbers, uniforms), What (specific words spoken, weapon drawn, force applied), When (exact hour, minute, date), Where (exact GPS, village name, landmark, police station cell number), Why (stated justification by officer), and How (mode of arrest or damage).
3. Chain of Custody for Digital Evidence: Never alter photo/video EXIF metadata. Export uncompressed raw files to secure offline flash drives with cryptographic SHA-256 hash or verified timestamp.
4. Medical Examination (P3 Form): For physical injuries, demand an immediate examination by a registered government medical officer at a sub-county or level 4 hospital, and obtain a certified P3 form.
5. Submission: Transmit dual certified copies to IPOA (Independent Policing Oversight Authority) and KNCHR (Kenya National Commission on Human Rights) with stamped receiving acknowledgments.`,
    whatIfScenarios: `What if police officers conceal their service numbers or remove their uniform name tags during an operation?
Answer: Note this fact explicitly in Section 1 of the Incident Report. Under National Police Service Standing Orders and Section 61, concealing service numbers is an independent disciplinary infraction and creates a strong presumption of unlawful intent before the courts. Document the vehicle registration number, time of entry, and physical descriptions.`,
    practicalExamples: `Example: A youth arrested after curfew without charge was released after a paralegal drafted an incident report recording the vehicle registration (GKB), exact OB recording time (21:40), and officer in charge, submitting a complaint to the OCS and IPOA Regional Office citing Section 25 of the IPOA Act.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-02T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'video',
    fileName: 'Incident_Report_Video_Tutorial_and_Sample_P3.mp4',
    fileSizeBytes: 14200000,
    externalLink: 'https://www.ipoa.go.ke/complaints-procedure',
    attachments: [
      {
        id: 'att_03',
        name: 'IPOA Official Complaints Filing Guidelines (PDF)',
        type: 'pdf',
        sizeBytes: 512000,
        externalUrl: 'https://www.ipoa.go.ke',
        description: 'Statutory complaint form and evidentiary requirements for police misconduct.',
        uploadedAt: '2026-01-02T00:00:00.000Z',
      },
      {
        id: 'att_04',
        name: 'Video Masterclass: How to Fill an Incident Report in 15 Minutes',
        type: 'video',
        sizeBytes: 14200000,
        externalUrl: 'https://www.youtube.com/watch?v=sample_incident_report_kenya',
        description: 'Video walkthrough demonstrating contemporaneous logging of timestamps, badges, and OB numbers.',
        uploadedAt: '2026-01-02T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_003',
    title: 'Raham Protocol 3: Digital Peacebuilding & Social Media as a Narrative Tool for Peace',
    category: 'peace_advocacy',
    statutoryAnchors: 'Constitution Article 33, National Cohesion and Integration Act 2008, Cybercrimes Act',
    summary: 'Strategic deployment of social media narratives to prevent ethnic polarization, de-escalate election or resource tensions, and counter viral propaganda on WhatsApp and TikTok.',
    fullContent: `The Raham Protocol recognizes digital platforms as the primary narrative battleground for peace and civic cohesion in Kenya.
Core Strategies:
1. Article 33 Boundary Analysis: Freedom of expression strictly does NOT extend to propaganda for war, incitement to violence, or advocacy of hatred based on ethnic origin (Article 33(2)).
2. Pre-bunking and Rapid Verification: When inflammatory rumors circulate regarding land allocations, election tallies, or communal clashes, civic leaders deploy verified infographics cross-referencing official County Gazettes or IEBC portals.
3. The Counter-Narrative Formula: Do not amplify hate speech by quoting it directly. Instead, reframe the issue around shared constitutional rights (Article 10 national cohesion, Article 27 non-discrimination).
4. WhatsApp Community Moderation: Establish community group guidelines prohibiting unverified voice notes and ethnic stereotypes. Deploy trained peace champions who issue immediate respectful fact-checks.`,
    whatIfScenarios: `What if an inflammatory video goes viral claiming that one ethnic community is taking away jobs or land in your county?
Answer: Execute Raham Protocol De-escalation: 1) Extract official county employment statistics showing compliance with Section 65 of County Governments Act (30% non-dominant ethnic quota). 2) Disseminate brief 30-second video clips featuring community elders and youth leaders affirming peaceful co-existence. 3) Report criminal hate speech clips directly to the NCIC (National Cohesion and Integration Commission) via WhatsApp hotline +254 702 443 322.`,
    practicalExamples: `Example: During local boundary disputes between coastal sub-counties, youth digital monitors created the '#AmaniYetuKwanza' narrative campaign, debunking 14 fake notices and convening joint TikTok live discussions between youth leaders from both sides, diffusing violence.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-03T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'audio',
    fileName: 'Peace_Advocacy_Audio_Briefing_Podcast.mp3',
    fileSizeBytes: 4800000,
    externalLink: 'https://cohesion.or.ke',
    attachments: [
      {
        id: 'att_05',
        name: 'Audio Podcast: De-escalating WhatsApp Group Tribal Propaganda',
        type: 'audio',
        sizeBytes: 4800000,
        description: 'Audio briefing for community group admins on countering rumors and hate speech.',
        uploadedAt: '2026-01-03T00:00:00.000Z',
      },
      {
        id: 'att_06',
        name: 'Digital Peace Infographic & Article 33 Poster',
        type: 'image',
        sizeBytes: 850000,
        description: 'Bilingual infographic on constitutional limits of online speech and peacebuilding.',
        uploadedAt: '2026-01-03T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_004',
    title: 'Raham Protocol 4: Unrecorded Police Arrests, Cash Bail Extortion & Article 49 Safeguards',
    category: 'constitution',
    statutoryAnchors: 'Article 49, Criminal Procedure Code (Cap 75), Bail and Bond Policy Guidelines 2015',
    summary: 'Operational tactics when police demand bribes for cash bail, refuse to record suspects in the Occurrence Book (OB), or hold citizens beyond the 24-hour limit.',
    fullContent: `Under The Raham Protocol, arbitrary detention without charge is a high constitutional violation.
Operational Steps:
1. Demand OB Number: An arrest does not legally exist until an OB (Occurrence Book) entry number is assigned. Politely insist: 'Officer, please provide our OB reference number for our family records under Article 35.'
2. Police Cash Bail is Mandatory for Bailable Offenses: Under Chief Justice Bail and Bond Policy Guidelines and Criminal Procedure Code, the OCS must grant reasonable police bond before court appearance unless murder, treason, or compelling state flight risk is established.
3. Recording Cash Bail: Never give undocumented cash. Police cash bail must be accompanied by an official duplicate Miscellaneous Receipt (F.O. 20).
4. The 24-Hour Rule: The 24-hour constitutional countdown begins the exact second the citizen is deprived of liberty, not when they arrive at the station. Weekends only extend the appearance to the earliest business hour on Monday.`,
    whatIfScenarios: `What if the police station commander (OCS) refuses to release a suspect on bond over a weekend for a minor misdemeanor like loitering or lack of ID?
Answer: Raham Protocol Emergency Escalation: 1) Call the IPOA 24/7 hotline (1559) or KNCHR toll-free (0800 720 627). 2) Contact the local Court Duty Magistrate or High Court Registrar on call to issue an oral bond order or habeas corpus. Lack of national ID is NOT a criminal offense under the Registration of Persons Act.`,
    practicalExamples: `Example: A bodaboda rider detained for 36 hours over alleged traffic infraction was immediately released when his community group cited Raham Protocol 4, Article 49(1)(f), and threatened a High Court petition against the station OCS personally for damages under Article 23(3)(e).`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-04T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Judiciary_Bail_and_Bond_Policy_Guidelines_2015.pdf',
    fileSizeBytes: 1250000,
    externalLink: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Bail_and_Bond_Policy_Guidelines.pdf',
    attachments: [
      {
        id: 'att_07',
        name: 'Judiciary Bail & Bond Policy Guidelines (PDF)',
        type: 'pdf',
        sizeBytes: 1250000,
        externalUrl: 'http://kenyalaw.org/kl/fileadmin/pdfdownloads/Bail_and_Bond_Policy_Guidelines.pdf',
        description: 'Complete Judiciary benchmark setting strict limits on bail amounts and forbidding station extortion.',
        uploadedAt: '2026-01-04T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_005',
    title: 'Raham Protocol 5: Ward Social Audits, County ADP Tracking & Fighting Tender Diversions',
    category: 'public_finance',
    statutoryAnchors: 'Article 201, Public Finance Management Act 2012, PPADA 2015',
    summary: 'Practical methodology for community monitoring teams to audit county projects, verify contractor bills of quantities (BQ), and challenge stolen project allocations.',
    fullContent: `The Raham Protocol provides a structured social auditing toolkit for citizens across all 47 counties of Kenya:
1. Requisition the BQ (Bill of Quantities): Under Article 35, write to the County Director of Procurement requesting the unpriced or priced Bill of Quantities for the road, clinic, or water project.
2. Ground Inspection: Convene a 5-person community inspection committee (including an artisan, youth leader, woman representative, and elder). Inspect depth of gravel, thickness of concrete, brand of water pumps against the BQ specs.
3. Social Audit Report: Compile findings with high-resolution photos, date stamps, and contractor project signboards.
4. Statutory Assembly Petition: If discrepancies exceed 15%, submit a formal petition under Article 119 and Section 15 of County Governments Act to the County Assembly Public Accounts and Investments Committee (CPAIC) and copy the Auditor-General's regional office.`,
    whatIfScenarios: `What if the county procurement department denies your request for project documents, claiming they are confidential?
Answer: The Raham Protocol instructs citizens to cite Section 4 of the Access to Information Act 2016 and High Court precedent in Katiba Institute v Presidents Delivery Unit. Public finance documents are NEVER confidential. State officers who unlawfully refuse public records face personal fines of up to KES 500,000 or 3 years imprisonment under Section 28 of the Access to Information Act.`,
    practicalExamples: `Example: In Matuga Ward, a proposed KES 4M solar dispensary lighting project that stalled for 18 months was completed within 3 weeks after the village social audit team cited Raham Protocol 5, submitted a formal inquiry to the County Health CECM, and copied the Ethics and Anti-Corruption Commission (EACC).`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-05T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'document',
    fileName: 'Ward_Social_Audit_Checklist_and_BQ_Template.xlsx',
    fileSizeBytes: 320000,
    externalLink: 'https://eacc.go.ke',
    attachments: [
      {
        id: 'att_08',
        name: 'County Annual Development Plan (ADP) Social Audit Toolkit',
        type: 'document',
        sizeBytes: 320000,
        description: 'Inspection form for village audit committees tracking tender completion and materials.',
        uploadedAt: '2026-01-05T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_006',
    title: 'Raham Protocol 6: The Lucy Shallah Environmental Justice & Toxic Contamination Directive',
    category: 'human_rights',
    statutoryAnchors: 'Article 42, Article 69, Article 70, EMCA Cap 387, Water Act 2016',
    summary: 'Operational and litigation playbook inspired by Attorney Lucy Shallah and Miriam Midmon for community paralegals taking on industrial chemical dumping, corporate river contamination, and environmental harm without paying prohibitive security deposits.',
    fullContent: `Under The Raham Protocol (The Lucy Shallah Directive), clean water and a healthy environment are non-negotiable constitutional rights under Articles 42 & 43(1)(d).
Operational Legal Directives:
1. Universal Standing without Financial Loss: Under Article 70(1), a citizen does NOT need to demonstrate personal loss or medical injury to petition the Environment and Land Court (ELC) to stop toxic industrial discharge.
2. The Precautionary Principle: Once credible evidence of abnormal water discoloration, chemical smells, or fish mortality is documented, the evidentiary burden shifts entirely to the corporation to prove non-toxicity under Section 3(5)(f) of EMCA.
3. Rapid Scientific Testing: Citizens requisition testing from the Water Resources Authority (WRA) and Kenya Government Chemist. Public bodies are compelled under Article 35 to provide certified lab reports.
4. Court Mandated Injunctions: Petition for immediate conservatory stop-orders under Article 70(2)(a) to cease plant operations until effluent treatment plants are independently audited.
5. Restoration & Clean-Up Orders: Demand corporate restitution under the Polluter Pays Principle to fund water pipeline installations and community health clinics.`,
    whatIfScenarios: `What if an influential fertilizer corporation or politician claims community residents cannot prove that chemical discharges caused their health symptoms, or company lawyers threaten SLAPP suits?
Answer: Execute Raham Protocol 6: 1) Cite Article 70(2) which explicitly states the applicant does not need to show that any person has incurred loss or suffered injury. 2) Apply the Polluter Pays Principle codified in Section 3 of EMCA Cap 387. 3) Request the court to order the National Environment Complaints Committee (NECC) and NEMA to conduct forensic testing at state expense. 4) SLAPP countersuits against environmental defenders violate Section 3 of the Fair Administrative Action Act and the UN Escazú Principles on environmental defenders.`,
    practicalExamples: `Example: In the Tarasaa River basin, community paralegals documented chemical runoff from a fertilizer facility that caused acute rashes among local women and livestock. By presenting a synchronized petition with GPS-tagged water photos and laboratory testing co-signed by 40 residents, they obtained an emergency ELC conservatory order shutting down the facility within 72 hours.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-06T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Lucy_Shallah_Environmental_Class_Action_Toolkit.pdf',
    fileSizeBytes: 890000,
    externalLink: 'https://kenyalaw.org/kl/index.php?id=398',
    attachments: [
      {
        id: 'att_09',
        name: 'Article 70 Environmental Injunction Petition Template (PDF)',
        type: 'pdf',
        sizeBytes: 890000,
        description: 'Official statutory pleading framework for halting industrial contamination.',
        uploadedAt: '2026-01-06T00:00:00.000Z',
      },
      {
        id: 'att_10',
        name: 'National Environment Complaints Committee (NECC) Reporting Portal',
        type: 'link',
        externalUrl: 'https://environment.go.ke',
        description: 'Direct statutory gateway for reporting river pollution and illegal chemical dumping.',
        uploadedAt: '2026-01-06T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_007',
    title: 'Raham Protocol 7: The Kim Midmon & Lucy Shallah Anti-Fabrication & Malicious Prosecution Protocol',
    category: 'constitution',
    statutoryAnchors: 'Article 27, 28, 47, 50, Section 17 & 18 Penal Code, Prevention of Torture Act 2017',
    summary: 'Defense strategies against weaponized intelligence dossiers, state fabrication, politically motivated criminal frame-ups, and the statutory right to necessary self-defense against rogue aggressors.',
    fullContent: `Inspired by Commander Kim Midmon's vindication against senior rogue agents and Lucy Shallah's defense against tailored intelligence dossiers, The Raham Protocol establishes strict defenses against fabricated criminal accusations:
1. Right to Full Disclosure: Under Article 50(2)(j) and Article 35(1)(b), the prosecution and investigative agencies MUST disclose all raw evidence, witness statements, and exculpatory material to the defense prior to trial. Withholding evidence constitutes prosecutorial misconduct.
2. Striking Out Tailored Intelligence: Intelligence briefs are NOT judicial evidence. Under the Evidence Act (Cap 80), unsourced hearsay and tailored dossiers manufactured to intimidate critics are inadmissible.
3. Lawful Self-Defense (Section 17 Penal Code): Every citizen has the statutory right to defend themselves and others against imminent unlawful violence using reasonable and proportionate force. When attacked by armed perpetrators, actions taken in necessary self-defense do not constitute a crime.
4. Independent Commission of Inquiry: When senior state officials conspire to frame an operative or citizen, demand an independent judicial inquiry under the Commissions of Inquiry Act (Cap 102).
5. Civil Damages for Malicious Prosecution: File for exemplary and constitutional damages under Article 23 against both the investigating agency and the individual rogue officers in their personal capacities.`,
    whatIfScenarios: `What if corrupt politicians or rogue officers fabricate a confidential intelligence file labeling an activist or human rights lawyer as an enemy of the state or criminal syndicate member (as was done to Lucy Shallah)?
Answer: The Raham Protocol instructs: 1) File an urgent constitutional reference in the High Court under Article 47 (Fair Administrative Action) and Section 4 of the FAA Act. 2) Requisition all underlying logs, source recordings, and chain of custody; fabricated files collapse under forensic cross-examination. 3) Individual officers who draft false reports commit perjury, forgery, and abuse of office under Section 101 of the Penal Code.`,
    practicalExamples: `Example: In a landmark ruling, an activist accused of treason based on an anonymous security brief was fully acquitted with KES 8,000,000 in constitutional damages after the High Court determined the dossier was fabricated to halt an anti-corruption audit of public tenders.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-07T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Anti_Malicious_Prosecution_and_Due_Process_Guide.pdf',
    fileSizeBytes: 670000,
    externalLink: 'http://kenyalaw.org',
    attachments: [
      {
        id: 'att_11',
        name: 'Due Process & Section 17 Self-Defense Legal Brief (PDF)',
        type: 'pdf',
        sizeBytes: 670000,
        description: 'Statutory manual on handling weaponized charges and asserting justification.',
        uploadedAt: '2026-01-07T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_008',
    title: 'Raham Protocol 8: The Sails Point & The Sank Conservation & Land Trust Charter',
    category: 'devolution',
    statutoryAnchors: 'Article 62, 63, 67, 69, Community Land Act 2016, Trustees Act Cap 164',
    summary: 'Framework for shielding ecological reserves, wildlife sanctuaries, and ancestral community lands against predatory commercial mega-developers through perpetual conservation trusts and legal caveats.',
    fullContent: `Drawn from Agnes Kimondo, Sahiban Khan, and young Agnes Kimberly Midmon's defense of the 35-acre golden eagle sanctuary at Sails Point (The Sank):
1. The Public Trust Doctrine: Kenya's environment, coastal ecosystems, wildlife nesting peninsulas, and ancestral heritage are held in sacred trust for current and future generations (Article 69(1)). No private developer can claim an unfettered right to desecrate protected ecological havens.
2. Perpetual Conservation Land Trusts: Establish registered conservation trusts under the Trustees (Perpetual Succession) Act Cap 164, placing land under community custody with binding negative easements prohibiting commercial subdivision or high-rise development.
3. Preempting Unscrupulous Share Sales: Where historical land associations exist, require a supermajority and public environmental notice before any transfer can be registered, preventing corrupt buyouts.
4. National Land Commission (NLC) Review: Lodge immediate caveats and restrictions under Section 76 of the Land Registration Act 2012 against any irregular title allocations bordering wetlands or protected flora/fauna.
5. Youth Peace Sanctuaries: Channel community land towards youth innovation, peace diplomacy, and wildlife stewardship (the 'Jumbo Kids' model).`,
    whatIfScenarios: `What if a commercial developer (like Kimonge Jr.) boasts that 'everyone has their price' and buys out a few co-owners or local chiefs to bulldoze a community wildlife haven?
Answer: Invoke the Public Trust Doctrine established in Peter K. Waweru v Republic (2006). Public ecological rights cannot be bought or extinguished by private monetary agreements. Community members can lodge an immediate caution at the Lands Registry and petition the Environment and Land Court under Article 70 for a permanent injunction protecting the ecosystem and nesting bird species.`,
    practicalExamples: `Example: In coastal Taita Taveta and Kwale, community conservationists thwarted an illegal 40-acre hotel complex on an elephant corridor by registering a Community Conservation Trust and obtaining an NLC revocation of the developer's irregular lease.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-08T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'document',
    fileName: 'Community_Conservation_Trust_Charter_and_Caveat_Forms.docx',
    fileSizeBytes: 410000,
    externalLink: 'https://landcommission.go.ke',
    attachments: [
      {
        id: 'att_12',
        name: 'Community Land Trust Model Deed (DOCX)',
        type: 'document',
        sizeBytes: 410000,
        description: 'Irrevocable land trust deed template prohibiting commercial exploitation.',
        uploadedAt: '2026-01-08T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_009',
    title: 'Raham Protocol 9: The Kofi Malik & Swiftly AI Cyber Defense & Digital Sovereignty Directive',
    category: 'peace_advocacy',
    statutoryAnchors: 'Computer Misuse and Cybercrimes Act 2018, Data Protection Act 2019, Article 31, Article 81',
    summary: 'Cybersecurity protocols for civic organizations, whistleblowers, and election defenders against malicious botnets, synthetic identity cloning, surveillance intercepts, and critical infrastructure disruption.',
    fullContent: `Distilled from Kofi Malik, Sajaad, and the Primecodes Cyber Defense team:
1. Digital Privacy & Warrant Protections: Under Article 31(c) & (d), search of phones, laptops, and servers without a specific warrant issued by a magistrate is unconstitutional. Evidence obtained through unlawful spyware or unauthorized wiretaps is void under Article 50(4).
2. Cyber Intrusion & Botnet Countermeasures: Deploy real-time network telemetry to detect automated malware, distributed denial of service (DDoS), and botnet manipulation designed to sway elections or disable emergency services.
3. Cold-Storage Cryptographic Ledgers: Critical civic audit records, whistleblower evidence, and electoral forms must be mirrored to offline encrypted storage with immutable SHA-256 hashes.
4. Protection Against Synthetic Identity Theft & Clones: Report unauthorized cloning of biometric data, deepfake video manipulation, or impersonation to the Office of the Data Protection Commissioner (ODPC) and NC4.
5. Whistleblower Digital Safety: Whistleblowers reporting public corruption or cyber warfare are granted full statutory protection under Section 34 of the CMCA 2018.`,
    whatIfScenarios: `What if rogue cyber actors deploy botnets or manipulated synthetic deepfakes during an election or crisis to impersonate candidates or incite unrest?
Answer: Under Section 22 and Section 23 of the Computer Misuse and Cybercrimes Act 2018, spreading computer-generated disinformation to cause panic or alter election systems is a criminal offense punishable by up to KES 20M fine or 10 years imprisonment. Citizens should verify all digital media against the official gazetted records and lodge reports with NC4 (nc4.go.ke) and the ODPC.`,
    practicalExamples: `Example: During a contested county by-election, youth digital monitors identified coordinated bot accounts circulating forged tally sheets. By presenting time-stamped cryptographic hashes of authentic polling station forms, they compelled the electoral commission to issue an immediate public verification notice within 45 minutes.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-09T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Cyber_Defense_and_Digital_Sovereignty_Manual.pdf',
    fileSizeBytes: 980000,
    externalLink: 'https://nc4.go.ke',
    attachments: [
      {
        id: 'att_13',
        name: 'Civic Encryption & Cyber Incident Guide (PDF)',
        type: 'pdf',
        sizeBytes: 980000,
        description: 'Step-by-step handbook for securing communications and documenting cyber attacks.',
        uploadedAt: '2026-01-09T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_010',
    title: 'Raham Protocol 10: The Sahiban Ruhr Kwale PVE & Grassroots Community Resilience Charter',
    category: 'peace_advocacy',
    statutoryAnchors: 'National Strategy to Counter Violent Extremism, Kwale County PVE Action Plan, Article 10, Article 27',
    summary: 'Community-driven early warning, family mediation, and youth empowerment strategies to prevent violent extremism and protect human dignity across coastal and vulnerable communities.',
    fullContent: `Anchored in Sahiban Khan Ruhr's teachings at Msambweni Youth Empowerment Center and the Kwale County PVE Action Plan:
1. Women as Primary Early Warning Guardians: Mothers, sisters, and female community elders are frequently the first to notice behavioral isolation, trauma, or radicalization. Provide secure, dignified channels for women leaders to seek intervention without fear of stigmatization.
2. Ending Extrajudicial Cycles: Arbitrary killings and disappearances of youth by security agencies do not prevent terrorism; they fuel vengeance and extremist recruitment (as experienced in the tragic murder of Suleiman Girma). Every suspect must be subjected to rule of law.
3. Safe Surrender & Judicial De-radicalization: Establish trusted multi-sectoral escort teams (comprising a religious leader, human rights monitor, and legal advocate) to facilitate the safe surrender and formal court registration of defecting youth.
4. Youth Livelihoods & Artistic Empowerment: Direct public resources to vocational training, arts, and sports to give young people dignity and purpose.
5. Community Dialogue Barazas: Convene monthly inter-faith and inter-generational dialogues to defuse grievances and build social cohesion.`,
    whatIfScenarios: `What if an innocent family or religious leader is harassed or blacklisted by security agencies because a youth from their neighborhood was recruited into a criminal or extremist gang?
Answer: The Raham Protocol affirms that guilt is strictly individual under Article 50(2) and Section 24 of the Penal Code. Collective punishment and guilt by association are unconstitutional violations of human dignity (Article 28). Relatives are legally protected and should immediately contact the KNCHR and county civil society PVE networks for protection and legal aid.`,
    practicalExamples: `Example: In Msambweni, community mothers formed a peace monitoring circle that identified 8 at-risk youths being approached by cross-border recruiters. Through counseling, vocational bursaries, and safe community mentorship, all 8 successfully completed technical training and started small businesses.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-10T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'video',
    fileName: 'Sahiban_Ruhr_Msambweni_Youth_Empowerment_Briefing.mp4',
    fileSizeBytes: 18500000,
    externalLink: 'https://counteringviolentextremism.go.ke',
    attachments: [
      {
        id: 'att_14',
        name: 'Kwale County PVE Action Plan Summary (PDF)',
        type: 'pdf',
        sizeBytes: 740000,
        description: 'Official county blueprint for community-led prevention of violent extremism.',
        uploadedAt: '2026-01-10T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_011',
    title: 'Raham Protocol 11: The Eyo Oloo Abuma Reparation & Civilian Crossfire Protection Decree',
    category: 'incident_reporting',
    statutoryAnchors: 'Victims Protection Act 2014, Government Proceedings Act Cap 40, Article 23(3)(e), Prevention of Torture Act',
    summary: 'Statutory rights and compensation mechanisms for innocent civilian bystanders injured, blinded, or harmed during police operations, high-speed chases, or public crossfire encounters.',
    fullContent: `Formulated in honor of Eyo Oloo's trauma after being blinded by acid in Likoni Market and the tragic bombing of The Cradle:
1. Strict State Duty of Care in Public Spaces: Law enforcement and security personnel owe a non-delegable duty of care to civilians. Discharging firearms or conducting reckless vehicular pursuits in crowded markets, ferries, or bus stops violates Section 61 of the National Police Service Act.
2. Emergency State Medical Liability: Under Section 22 of the Victims Protection Act 2014, any civilian injured in crossfire is entitled to immediate government-funded emergency hospitalization, surgical intervention, and visual/physical rehabilitation.
3. Right to Independent Investigation: The incident must be independently investigated by IPOA within 14 days, with ballistics and chemical trajectory reports made available to the victim's family under Article 35.
4. Constitutional Redress for Bodily Harm: Victims are entitled to substantial damages under Article 23(3)(e) for pain, suffering, loss of amenities, and lifelong assistive care.
5. Protection Against Harmful Superstition: In line with Article 2(4) and Article 53, no victim of disability, trauma, or cultural taboo (such as twin superstition in Tarasaa) may be ostracized or denied community support.`,
    whatIfScenarios: `What if an innocent citizen is blinded, maimed, or injured when security agents engage in a shootout or high-speed chase in a crowded public market (like Likoni)?
Answer: The Raham Protocol instructs: 1) Secure all medical records, witness statements, and CCTV footage within 24 hours. 2) File an immediate complaint with IPOA and the Victims Protection Board. 3) File a constitutional petition under Article 22 & 23(3)(e) against the Attorney General and Inspector General of Police for breach of the right to security of the person (Article 29) and gross negligence. Kenyan courts have awarded damages ranging from KES 5M to KES 25M for civilian crossfire maiming.`,
    practicalExamples: `Example: Following a botched pursuit through a busy bus park where a market vendor lost vision in her left eye, paralegals filed an Article 23 petition relying on police duty-of-care standards. The High Court awarded KES 9.5M in state compensation and ordered full lifelong medical coverage.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-11T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Civilian_Crossfire_and_Victims_Protection_Legal_Kit.pdf',
    fileSizeBytes: 820000,
    externalLink: 'https://kenyalaw.org',
    attachments: [
      {
        id: 'att_15',
        name: 'Victims Protection Board Claim Form & Filing Checklist (PDF)',
        type: 'pdf',
        sizeBytes: 820000,
        description: 'Standard statutory compensation claim form for civilian crossfire injuries.',
        uploadedAt: '2026-01-11T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_012',
    title: 'Raham Protocol 12: The Teacher Nicole & The Samaritan Anti-Graft & Civic Whistleblower Defense Directive',
    category: 'human_rights',
    statutoryAnchors: 'Article 10, Chapter Six (Art 73 & 75), Anti-Corruption and Economic Crimes Act 2003, Whistleblower Protection Act & Section 34 ACECA',
    summary: 'Operational shield for civic educators, school mentors, students, and civic innovators (inspired by Teacher Nicole, Montano, Alvita, and The Samaritan) confronting intimidation, arbitrary transfer, or arrest by municipal corruption cartels (Mayor Mossi, Inspector Bembe, Seymour, and compromised judicial allies like Justice Jaden).',
    fullContent: `Derived from the pivotal struggle in The Samaritan where Teacher Nicole and the Sagar High innovators built a platform that exposed municipal corruption despite threats of arrest, blackmail, and unconstitutional assembly charges:
1. Constitutional Protection of Civic Whistleblowers & Educators: Under Article 33 (Freedom of Expression), Article 35 (Access to Information), and Section 34 of the Anti-Corruption and Economic Crimes Act (ACECA), any teacher, student, or citizen who exposes graft or mismanagement is immune from administrative retaliation, demotion, or punitive transfer.
2. Inadmissibility of Fabricated 'Incitement' Charges: When municipal leaders or police bosses (like Mayor Mossi and Inspector Bembe) threaten civic whistleblowers with fabricated charges of 'creating a disturbance' or 'incitement to violence', cite Supreme Court and High Court jurisprudence establishing that exposing verified public corruption is a constitutional civic duty under Article 3(1).
3. The Conflict of Interest Disqualification: Any judge, magistrate, or state officer (such as Justice Jaden) who attempts to intimidate whistleblowers or protect business co-conspirators must be subjected to an immediate complaint before the Judicial Service Commission (JSC) under Article 168 for gross misconduct.
4. Independent Digital Archiving: Civic applications and whistleblowing records must be mirrored across decentralized nodes so corrupt politicians cannot suppress or destroy evidence by seizing physical servers.
5. Protection of Youth & Student Innovators: Under Article 53 (Rights of the Child) and Basic Education Act, schools and learners are protected peace havens. Any state agent attempting to coerce children or students to suppress truth commits a severe statutory offense.`,
    whatIfScenarios: `What if a corrupt county boss, mayor, or police chief threatens to close a school, arrest the ethics teacher, or confiscate digital servers because an anti-corruption tool (like The Samaritan App) exposed municipal graft?
Answer: Deploy Raham Protocol 12: 1) File an urgent constitutional petition under Article 22 and Article 23(3)(f) for a conservatory injunction prohibiting any arrest, harassment, or administrative transfer. 2) Requisition protection from the Witness Protection Agency (WPA) under the Witness Protection Act (Cap 79). 3) Lodge immediate criminal complaints with the EACC and IPOA against the specific state officers for abuse of office (Section 101 Penal Code) and obstruction of justice. Public interest exposure of stolen public funds cannot be suppressed by state intimidation.`,
    practicalExamples: `Example: When municipal authorities attempted to shut down a youth civic lab in Kilifi and arrest the project mentor for documenting stalled health center expenditures, paralegals cited Raham Protocol 12 and Article 35, obtaining an emergency High Court stay order restraining the police commander and securing full audit disclosure from the Auditor-General within 10 days.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-12T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'document',
    fileName: 'Teacher_Nicole_Civic_Whistleblower_Legal_Protection_Brief.pdf',
    fileSizeBytes: 760000,
    externalLink: 'https://eacc.go.ke/whistleblower-protection',
    attachments: [
      {
        id: 'att_16',
        name: 'Whistleblower & Academic Freedom Protection Guide (PDF)',
        type: 'pdf',
        sizeBytes: 760000,
        description: 'Official legal guidelines protecting civic educators and student innovators exposing graft.',
        uploadedAt: '2026-01-12T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_013',
    title: 'Raham Protocol 13: Community Health, Safe Water Access & Public Dispensary Defense Charter',
    category: 'human_rights',
    statutoryAnchors: 'Article 43(1)(a) & (d), Health Act 2017, Water Act 2016, Public Health Act Cap 242',
    summary: 'Grassroots paralegal and community oversight methodology to prevent unauthorized closure of rural dispensaries, diversion of essential pharmaceuticals, and privatization of community boreholes and clean water springs.',
    fullContent: `Under The Raham Protocol, health and water are supreme survival rights guaranteed unconditionally by Article 43:
1. Immunity of Essential Public Health Services: No county or national authority may shut down or downscale an operational public dispensary, maternity wing, or health post without conducting comprehensive public participation under Article 10 and securing alternative local coverage within 5 kilometers.
2. Drug Diversion & Phantom Supply Verification: Community Health Units (CHUs) and local barazas have the statutory right under the Health Act 2017 to audit the dispensary bin cards, KEMSA delivery notes, and batch registers. If supplied drugs are missing or diverted to private chemists, file an immediate complaint with the Kenya Medical Practitioners and Dentists Council (KMPDC) and EACC.
3. Clean Community Water Protection: Under Section 5 of the Water Act 2016, water resources are vested in the state in trust for the people. Any private enclosure, diversion of piped water to commercial plantations, or arbitrary disconnection of village kiosks violates Article 43(1)(d).
4. Rapid Parish/Ward Water Petitions: Requisition the Water Services Regulatory Board (WASREB) to freeze irregular tariff hikes and mandate minimum lifeline water allowances for vulnerable households.
5. Mobile Emergency Escalation: Community members maintain direct contact lines with the sub-county Medical Officer of Health (MOH) and county health committee chairperson.`,
    whatIfScenarios: `What if a county health department removes staff and essential medicines from a rural dispensary to divert funds, leaving expectant mothers and children without medical care?
Answer: Execute Raham Protocol 13: 1) Convene an emergency village baraza and draft an Article 43(1)(a) Notice of Failure of Constitutional Duty addressed to the County Executive Committee Member (CECM) for Health and the Governor. 2) Copy the Senate Standing Committee on Health and KNCHR. Under the landmark decision in Coalition for Health and Human Rights v Attorney General, the state is under strict progressive realization obligations and cannot regressively dismantle existing healthcare access.`,
    practicalExamples: `Example: In a semi-arid ward where the local dispensary was locked for 4 months due to 'staff shortage' while drugs expired in storage, the community committee mobilized an Article 43 petition citing Raham Protocol 13. Within 48 hours, the County MOH deployed two clinical officers, restored drug supply, and reopened the maternity ward.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-13T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Public_Dispensary_and_Clean_Water_Audit_Manual.pdf',
    fileSizeBytes: 690000,
    externalLink: 'https://wasreb.go.ke',
    attachments: [
      {
        id: 'att_17',
        name: 'Dispensary & Water Kiosk Social Audit Form (PDF)',
        type: 'pdf',
        sizeBytes: 690000,
        description: 'Community inspection tool for tracking drug stocks and borehole water access.',
        uploadedAt: '2026-01-13T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'raham_014',
    title: 'Raham Protocol 14: Grassroots Paralegal Rapid Response & Police Cell Bail Advocacy',
    category: 'incident_reporting',
    statutoryAnchors: 'Article 49, Criminal Procedure Code Sec 29, Legal Aid Act 2016, National Police Service Standing Orders',
    summary: 'Tactical guidelines for community paralegals and legal defenders entering police stations to secure rapid cash bail, inspect cell conditions, and halt \'Kamata Kamata Friday\' weekend extortion schemes.',
    fullContent: `The Raham Protocol operational playbook for paralegal station visits and cell oversight:
1. Station Etiquette & Authority: Under the Legal Aid Act 2016 and Article 48 (Access to Justice), accredited community paralegals have the legal right to assist unrepresented arrested persons in police stations. Always enter calmly, identify yourself with your Paralegal / Samaritan credential, and ask to see the Station Diary / Occurrence Book (OB).
2. Dismantling 'Kamata Kamata Friday': Police officers frequently execute frivolous arrests on Friday afternoons specifically to extort weekend cash payments when courts are closed. Remind the OCS: 'Officer, under the Chief Justice Bail Guidelines, offenses carrying less than 6 months or petty misdemeanors must be granted police bond regardless of the day of the week.'
3. Physical Cell Inspection: If permitted or accompanied, verify that juvenile suspects are NOT held with adult offenders (Article 53(1)(f)), and female detainees have separate secure cells staffed by female officers.
4. Bail Bond Documentation: Ensure the exact cash amount is reflected on the official police bail bond form and the citizen is given a clear court date with charge sheet details.
5. Escalation on Obstruction: If the station duty officer or OCS is hostile, refuses bail, or demands an informal bribe, contact the IPOA Toll-Free line (1559), the Court Users Committee (CUC) Duty Magistrate, or the Police Internal Affairs Unit (IAU) via SMS 40683.`,
    whatIfScenarios: `What if police officers arrest youth on Friday evening for 'loitering' or 'failing to give a satisfactory account of themselves' and demand KES 5,000 each for release before Monday?
Answer: Under Section 29 of the Penal Code and High Court decisions declaring vagrancy laws unconstitutional, 'loitering' is NO LONGER a criminal offense in Kenya. Cite the High Court ruling in Criminal Appeal No. 24 of 2016. Demand immediate free police bond under Article 49(1)(h) or summon the sub-county Legal Aid clinic paralegal team.`,
    practicalExamples: `Example: On a Friday evening in Likoni, 12 bodaboda riders were rounded up for lack of reflective vests and held in a cell. A certified paralegal arrived with Raham Protocol 14 guidelines, cited the Bail and Bond Guidelines to the OCS, and secured the release of all 12 on free police bond within 90 minutes without paying any bribe.`,
    uploadedBy: 'The_Samaritan',
    uploadedAt: '2026-01-14T00:00:00.000Z',
    isActive: true,
    sourceType: 'executive_decree',
    mediaType: 'pdf',
    fileName: 'Paralegal_Police_Station_Rapid_Response_Handbook.pdf',
    fileSizeBytes: 890000,
    externalLink: 'https://nlac.go.ke',
    attachments: [
      {
        id: 'att_18',
        name: 'Police Station Visit & Bail Bond Checklist (PDF)',
        type: 'pdf',
        sizeBytes: 890000,
        description: 'Official paralegal guide for securing free police bond and documenting station entries.',
        uploadedAt: '2026-01-14T00:00:00.000Z',
      },
    ],
  },
];

export function getLocalRahamDocuments(): RahamProtocolDocument[] {
  try {
    const raw = localStorage.getItem(RAHAM_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(RAHAM_STORAGE_KEY, JSON.stringify(DEFAULT_RAHAM_DOCUMENTS));
      return DEFAULT_RAHAM_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Seamlessly merge any new built-in default documents
      const existingIds = new Set(parsed.map((p: RahamProtocolDocument) => p.id));
      const merged = [...parsed];
      let added = false;
      for (const defDoc of DEFAULT_RAHAM_DOCUMENTS) {
        if (!existingIds.has(defDoc.id)) {
          merged.push(defDoc);
          added = true;
        }
      }
      if (added) {
        localStorage.setItem(RAHAM_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
    return DEFAULT_RAHAM_DOCUMENTS;
  } catch (e) {
    return DEFAULT_RAHAM_DOCUMENTS;
  }
}

export function saveLocalRahamDocuments(docs: RahamProtocolDocument[]): void {
  try {
    localStorage.setItem(RAHAM_STORAGE_KEY, JSON.stringify(docs));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('the_samaritan_raham_protocol_updated', { detail: docs }));
    }
  } catch (e) {
    console.error('Failed saving local Raham Protocol materials:', e);
  }
}

export async function fetchRahamProtocolDocuments(): Promise<RahamProtocolDocument[]> {
  try {
    const res = await fetch('/api/raham-protocol');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.documents)) {
        saveLocalRahamDocuments(data.documents);
        return data.documents;
      }
    }
  } catch (e) {
    console.warn('[Raham Protocol Client] Backend fetch failed, using local store:', e);
  }
  return getLocalRahamDocuments();
}

export async function addRahamProtocolDocumentClient(
  doc: Omit<RahamProtocolDocument, 'id' | 'uploadedAt'> & { id?: string }
): Promise<RahamProtocolDocument> {
  const localList = getLocalRahamDocuments();
  const newDoc: RahamProtocolDocument = {
    id: doc.id || `raham_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: doc.title.trim(),
    category: doc.category || 'custom',
    statutoryAnchors: doc.statutoryAnchors?.trim() || 'Constitution of Kenya 2010',
    summary: doc.summary?.trim() || doc.title.trim(),
    fullContent: doc.fullContent.trim(),
    whatIfScenarios: doc.whatIfScenarios?.trim() || '',
    practicalExamples: doc.practicalExamples?.trim() || '',
    uploadedBy: doc.uploadedBy || 'The_Samaritan',
    uploadedAt: new Date().toISOString(),
    isActive: doc.isActive !== false,
    sourceType: doc.sourceType || 'manual',
    mediaType: doc.mediaType || 'text',
    attachments: doc.attachments || [],
    externalLink: doc.externalLink?.trim() || undefined,
    fileName: doc.fileName || undefined,
    fileDataUrl: doc.fileDataUrl || undefined,
    fileSizeBytes: doc.fileSizeBytes || undefined,
  };

  const existingIdx = localList.findIndex((d) => d.id === newDoc.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = newDoc;
  } else {
    localList.unshift(newDoc);
  }
  saveLocalRahamDocuments(localList);

  // Sync to server
  try {
    await fetch('/api/raham-protocol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc),
    });
  } catch (e) {
    console.warn('[Raham Protocol Client] Server sync failed (cached locally):', e);
  }

  return newDoc;
}

export async function deleteRahamProtocolDocumentClient(id: string): Promise<boolean> {
  const localList = getLocalRahamDocuments();
  const filtered = localList.filter((d) => d.id !== id);
  saveLocalRahamDocuments(filtered);

  try {
    await fetch(`/api/raham-protocol/${id}`, { method: 'DELETE' });
  } catch (e) {
    console.warn('[Raham Protocol Client] Server delete failed (deleted locally):', e);
  }
  return true;
}
