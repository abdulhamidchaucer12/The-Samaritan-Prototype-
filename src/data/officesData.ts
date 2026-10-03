import { OfficeProfile } from '../types';

export const officesData: OfficeProfile[] = [
  // 1. President
  {
    id: 'president',
    name: {
      en: 'President of the Republic of Kenya',
      sw: 'Rais wa Jamhuri ya Kenya',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'elected',
    iconName: 'Crown',
    badgeColor: 'bg-blue-700 text-white',
    keyStats: {
      totalNumber: '1 Head of State',
      establishedBy: 'Constitution of Kenya, Article 130–132',
    },
    summary: {
      en: 'The President is the Head of State, Head of Government, and Commander-in-Chief of the Kenya Defence Forces. The President is a symbol of national unity and safeguards the Constitution.',
      sw: 'Rais ndiye Mkuu wa Nchi, Mkuu wa Serikali, na Amiri Jeshi Mkuu wa Majeshi ya Ulinzi ya Kenya. Rais ni nembo ya umoja wa kitaifa na mlinzi mkuu wa Katiba.',
    },
    responsibilities: {
      en: [
        'Upholds, safeguards, and respects the Constitution and the rule of law.',
        'Directs and coordinates the functions of ministries and government departments.',
        'Chairs the Cabinet meetings.',
        'Assents to bills passed by Parliament or refers them back with reservations.',
        'Appoints Cabinet Secretaries, Principal Secretaries, Ambassadors, and judges (with parliamentary vetting / JSC recommendations).',
        'Addresses the nation annually on national values and implementation of constitutional principles.',
      ],
      sw: [
        'Kulinda, kutetea, na kuheshimu Katiba na utawala wa sheria.',
        'Kuelekeza na kuratibu shughuli za wizara na idara zote za serikali.',
        'Kuongoza vikao vya Baraza la Mawaziri (Cabinet).',
        'Kutia saini miswada ya sheria iliyopitishwa na Bunge au kuirejesha na maoni.',
        'Kuteua Mawaziri (CS), Makatibu Wakuu (PS), Mabalozi, na Majaji (kwa idhini ya Bunge / ushauri wa JSC).',
        'Kulihutubia taifa mara moja kwa mwaka kuhusu maadili ya kitaifa na utekelezaji wa Katiba.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT make or pass laws unilaterally (law-making belongs to Parliament).',
        'Does NOT direct court judgments or interfere with judicial independence.',
        'Does NOT manage county government functions like county roads, local markets, or county hospitals.',
        'Cannot dismiss independent commission chairs without following the constitutional tribunal process.',
      ],
      sw: [
        'HAFANYI wala kupitisha sheria peke yake (utunzi wa sheria ni kazi ya Bunge).',
        'HAINGILII maamuzi ya mahakama wala kutoa amri kwa majaji.',
        'HASIMAMII huduma za serikali za kaunti kama masoko ya mitaa, zahanati za kaunti au barabara za vijijini.',
        'Hawezi kumfuta kazi mwenyekiti wa tume huru bila kufuata jopo maalum la kikatiba (tribunal).',
      ],
    },
    howSelected: {
      en: 'Directly elected by registered Kenyan voters in a general election for a five-year term. Must receive more than 50% of the total votes cast nationwide plus at least 25% of votes cast in each of more than half of the 47 counties.',
      sw: 'Huchaguliwa moja kwa moja na wananchi wapiga kura kwenye uchaguzi mkuu kwa muhula wa miaka mitano. Lazima apate zaidi ya 50% ya kura zote nchini na angalau 25% ya kura katika zaidi ya nusu ya kaunti 47.',
    },
    qualifications: {
      en: [
        'Must be a Kenyan citizen by birth.',
        'Qualified to stand for election as a Member of Parliament.',
        'Nominated by a registered political party or running as an independent candidate.',
        'Nominated by not fewer than 2,000 registered voters from each of a majority of counties.',
        'Must not hold dual citizenship or owe allegiance to a foreign state.',
        'Must satisfy Chapter 6 of the Constitution (Leadership and Integrity).',
      ],
      sw: [
        'Awe raia wa Kenya kwa kuzaliwa.',
        'Awe na sifa za kuchaguliwa kama Mbunge wa Bunge la Kitaifa.',
        'Awe ameteuliwa na chama cha siasa kilichosajiliwa au agombee kama mgombea huru.',
        'Awe amependekezwa na wapiga kura wasiopungua 2,000 kutoka kila kaunti katika zaidi ya nusu ya kaunti 47.',
        'Asiwe na uraia wa nchi mbili au mtiifu kwa nchi ya kigeni.',
        'Azingatie maadili ya Sura ya 6 ya Katiba (Uongozi na Uadilifu).',
      ],
    },
    termOfOffice: {
      en: 'Five-year term, eligible for re-election once. Maximum two terms (total 10 years) under Article 142 of the Constitution.',
      sw: 'Muhula wa miaka mitano, anaruhusiwa kuchaguliwa tena mara moja pekee. Kiwango cha juu ni mihula miwili (miaka 10 jumla) chini ya Kifungu cha 142 cha Katiba.',
    },
    oversightAndAccountability: {
      en: 'Overseen by the National Assembly and the Senate through impeachment for gross violation of the Constitution, serious crimes, or gross misconduct (Article 144 & 145). Decisions subject to judicial review by the Supreme Court and High Court.',
      sw: 'Husimamiwa na Bunge la Kitaifa na Seneti kupitia mchakato wa kumwondoa madarakani (impeachment) kwa kukiuka Katiba, makosa makubwa ya jinai, au utovu mkubwa wa maadili (Kifungu cha 144 & 145). Maamuzi yake huchunguzwa na Mahakama Kuu na ya Juu.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 130–146', 'Leadership and Integrity Act 2012'],
      sw: ['Katiba ya Kenya 2010: Vifungu 130–146', 'Sheria ya Uongozi na Uadilifu ya 2012'],
    },
    citizenEngagement: {
      en: 'Citizens engage the Presidency through parliamentary petitions, constitutional public participation on policy, public state-of-the-nation feedback, or judicial petitions challenging executive orders.',
      sw: 'Wananchi hushiriki kupitia maombi rasmi (petitions) bungeni, ushiriki wa umma katika sera za serikali, na kesi za kikatiba mahakamani kupinga amri zisizofuata sheria.',
    },
    relatedOfficeIds: ['deputy_president', 'cabinet_secretary', 'governor', 'chief_justice'],
  },

  // 2. Deputy President
  {
    id: 'deputy_president',
    name: {
      en: 'Deputy President of the Republic of Kenya',
      sw: 'Naibu Rais wa Jamhuri ya Kenya',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'elected',
    iconName: 'UserCheck',
    badgeColor: 'bg-blue-600 text-white',
    keyStats: {
      totalNumber: '1 Principal Assistant',
      establishedBy: 'Constitution of Kenya, Article 147',
    },
    summary: {
      en: 'The Deputy President is the principal assistant to the President and deputises for the President in the execution of the President\'s functions.',
      sw: 'Naibu Rais ndiye msaidizi mkuu wa Rais na anashika nafasi ya Rais katika utekelezaji wa majukumu ya Rais anapokuwa hayupo au kulingana na maagizo ya Rais.',
    },
    responsibilities: {
      en: [
        'Acts as the principal assistant to the President in executive duties.',
        'Performs executive functions assigned by the President.',
        'Acts as President when the President is absent or temporarily incapacitated.',
        'Member of the Cabinet and National Security Council.',
        'Chairs the Intergovernmental Budget and Economic Council (IBEC) linking national and county governments.',
      ],
      sw: [
        'Kufanya kazi kama msaidizi mkuu wa Rais katika shughuli za kiserikali.',
        'Kutekeleza majukumu yoyote ya kiutendaji yaliyotolewa na Rais.',
        'Kukaimu nafasi ya Urais wakati Rais hayupo nchini au hawezi kutekeleza majukumu.',
        'Mwanachama wa Baraza la Mawaziri na Baraza la Usalama wa Kitaifa.',
        'Mwenyekiti wa Baraza la Ushauri wa Kiuchumi na Bajeti kati ya Serikali ya Kitaifa na Kaunti (IBEC).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Cannot appoint or dismiss Cabinet Secretaries unless acting as President under specific constitutional mandate.',
        'Does not hold a separate legislative power independent of the executive.',
        'Cannot unilaterally dissolve county governments.',
      ],
      sw: [
        'Hawezi kuteua au kufuta kazi Mawaziri isipokuwa akihudumu kama Rais chini ya maelekezo maalum ya kikatiba.',
        'Hana mamlaka huru ya kutunga sheria nje ya sera za serikali kuu.',
        'Hawezi kuvunja serikali ya kaunti bila mchakato wa kisheria.',
      ],
    },
    howSelected: {
      en: 'Nominated by the presidential candidate as a running mate and declared elected upon the election of the President.',
      sw: 'Huteuliwa na mgombea urais kama mgombea mwenza na kutangazwa mshindi punde tu Rais anapochaguliwa.',
    },
    qualifications: {
      en: [
        'Must meet identical qualifications as the candidate for President (citizen by birth, eligible MP, Chapter 6 compliance).',
      ],
      sw: [
        'Lazima awe na sifa sawa kabisa na mgombea wa Urais (raia wa kuzaliwa, sifa za Mbunge, kuzingatia Sura ya 6).',
      ],
    },
    termOfOffice: {
      en: 'Five-year term running concurrently with the President. Maximum two terms.',
      sw: 'Muhula wa miaka mitano sambamba na Rais. Mwisho ni mihula miwili.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the Constitution and people. Can be removed through impeachment by the National Assembly and the Senate under Articles 148 and 150.',
      sw: 'Huwajibika kwa Katiba na wananchi. Anaweza kuondolewa madarakani kwa uamuzi wa Bunge la Kitaifa na Seneti chini ya Vifungu 148 na 150 vya Katiba.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 147–151'],
      sw: ['Katiba ya Kenya 2010: Vifungu 147–151'],
    },
    citizenEngagement: {
      en: 'Citizens engage through consultative forums, intergovernmental coordination processes, public barazas, and official representations.',
      sw: 'Wananchi hushiriki kupitia makongamano ya mashauriano ya kitaifa, baraza za umma, na mijadala ya maendeleo ya kiuchumi.',
    },
    relatedOfficeIds: ['president', 'cabinet_secretary', 'governor'],
  },

  // 3. Cabinet Secretary
  {
    id: 'cabinet_secretary',
    name: {
      en: 'Cabinet Secretary (CS)',
      sw: 'Waziri wa Baraza la Mawaziri',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'Briefcase',
    badgeColor: 'bg-indigo-700 text-white',
    keyStats: {
      totalNumber: 'Between 14 and 22 Secretaries',
      establishedBy: 'Constitution of Kenya, Article 152',
    },
    summary: {
      en: 'A Cabinet Secretary is an appointed government minister responsible for formulating policy, guiding state departments, and administering specific ministries (such as Health, Education, Roads, or Agriculture).',
      sw: 'Waziri wa Baraza la Mawaziri ni kiongozi anayeteuliwa na Rais kuongoza wizara maalum ya serikali (kama Elimu, Afya, Barabara, au Kilimo) na kubuni sera za kitaifa.',
    },
    responsibilities: {
      en: [
        'Formulates national sector policies, strategic plans, and proposed legislation.',
        'Guides and oversees State Departments under their assigned ministry.',
        'Appears before parliamentary committees to answer questions on ministry operations and public spending.',
        'Provides regular reports to the President and Parliament concerning the ministry.',
        'Implements national development programmes.',
      ],
      sw: [
        'Kubuni sera za sekta ya kitaifa, mikakati na kupendekeza miswada ya sheria.',
        'Kuongoza na kusimamia Idara za Kiserikali (State Departments) chini ya wizara yake.',
        'Kufika mbele ya kamati za Bunge kujibu maswali kuhusu matumizi ya fedha na utendaji kazi wa wizara.',
        'Kutoa ripoti za mara kwa mara kwa Rais na Bunge kuhusu maendeleo ya wizara.',
        'Kusimamia utekelezaji wa miradi ya maendeleo ya kitaifa.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Cannot be a sitting Member of Parliament (strict separation between Cabinet and Parliament under the 2010 Constitution).',
        'Cannot unilaterally reallocate budgeted public funds without National Assembly approval.',
        'Cannot issue directives contrary to constitutional statutes.',
      ],
      sw: [
        'HAWEZI kuwa Mbunge anayehudumu bungeni (Katiba ya 2010 inakataza mawaziri kuwa wabunge).',
        'Hawezi kubadilisha matumizi ya fedha za umma bila kibali cha Bunge la Kitaifa.',
        'Hawezi kutoa maagizo yanayokiuka sheria za nchi.',
      ],
    },
    howSelected: {
      en: 'Nominated and appointed by the President with the formal approval and vetting of the National Assembly.',
      sw: 'Huteuliwa na Rais na kupigwa msasa na kuidhinishwa na Bunge la Kitaifa kabla ya kuapishwa.',
    },
    qualifications: {
      en: [
        'Must not be a Member of Parliament.',
        'Must possess relevant professional knowledge and experience in public administration.',
        'Compliant with Chapter 6 (Leadership and Integrity).',
      ],
      sw: [
        'Asiwe Mbunge wa Bunge la Kitaifa au Seneta.',
        'Awe na ujuzi wa kitaaluma, weledi na uzoefu unaofaa katika utawala.',
        'Azingatie maadili na uadilifu wa Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Serves at the pleasure of the President or until removed by the President or dismissed through a parliamentary censure motion.',
      sw: 'Anahudumu kulingana na uamuzi wa Rais au hadi anapoondolewa na Rais au kupitia kura ya kutokuwa na imani naye bungeni (censure motion).',
    },
    oversightAndAccountability: {
      en: 'Accountable to the President and the National Assembly. Can be summoned by parliamentary committees and dismissed under Article 152(6) by a resolution of the National Assembly.',
      sw: 'Huwajibika kwa Rais na Bunge la Kitaifa. Anaweza kuitwa mbele ya kamati za bunge na kuondolewa chini ya Kifungu cha 152(6) kwa azimio la Bunge la Kitaifa.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 152–153'],
      sw: ['Katiba ya Kenya 2010: Vifungu 152–153'],
    },
    citizenEngagement: {
      en: 'Citizens participate in public stakeholder validations of ministry policies, submit written memoranda during bill consultations, or lodge service delivery complaints through the Ombudsman.',
      sw: 'Wananchi hushiriki kupitia maoni ya umma kuhusu sera za wizara, kuwasilisha maoni kwenye miswada, au kuripoti malalamiko ya huduma kupitia Ofisi ya Mlinzi wa Haki (Ombudsman).',
    },
    relatedOfficeIds: ['principal_secretary', 'president', 'member_of_parliament'],
  },

  // 4. Principal Secretary
  {
    id: 'principal_secretary',
    name: {
      en: 'Principal Secretary (PS)',
      sw: 'Katibu Mkuu wa Idara ya Serikali',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'FileText',
    badgeColor: 'bg-indigo-600 text-white',
    keyStats: {
      totalNumber: 'State Department Accounting Officers',
      establishedBy: 'Constitution of Kenya, Article 155',
    },
    summary: {
      en: 'The Principal Secretary is the accounting and administrative officer of a State Department. While the Cabinet Secretary oversees political policy, the PS manages civil servants, budgets, and technical execution.',
      sw: 'Katibu Mkuu (PS) ndiye afisa mkuu wa uhasibu na utawala wa Idara ya Serikali. Wakati Waziri anasimamia sera za kisiasa, PS anasimamia fedha, watumishi wa umma na utekelezaji wa kitaalamu.',
    },
    responsibilities: {
      en: [
        'Serves as the designated Accounting Officer for the State Department under the Public Finance Management Act.',
        'Manages daily administrative operations and personnel within the department.',
        'Ensures proper expenditure of allocated state funds and procurement compliance.',
        'Appears before the Public Accounts Committee (PAC) and Public Investments Committee (PIC) to defend expenditure.',
      ],
      sw: [
        'Kufanya kazi kama Afisa Mhasibu Mkuu wa Idara ya Serikali chini ya Sheria ya Fedha za Umma.',
        'Kusimamia shughuli za kila siku za kiutawala na watumishi wa umma idarani.',
        'Kuhakikisha fedha zilizotengwa zinatumika kwa uaminifu na kufuata sheria za ununuzi wa umma.',
        'Kufika mbele ya Kamati za Bunge za Ukaguzi wa Hesabu za Serikali (PAC na PIC) kujieleza kuhusu matumizi ya pesa.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT make high-level ministerial political decisions independently of the Cabinet Secretary.',
        'Does NOT sit in the Cabinet as a voting minister.',
      ],
      sw: [
        'HAAMUI sera kuu za kisiasa za wizara bila idhini ya Waziri.',
        'HAPIGI kura katika mikutano ya Baraza la Mawaziri.',
      ],
    },
    howSelected: {
      en: 'Competitively interviewed and shortlisted by the Public Service Commission (PSC), nominated by the President, and vetted/approved by the National Assembly.',
      sw: 'Hufanyiwa usaili wa kiushindani na Tume ya Utumishi wa Umma (PSC), kuteuliwa na Rais kisha kupigwa msasa na kuidhinishwa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Distinguished academic credentials and administrative experience in public service or corporate governance.',
        'Clean record under Chapter 6 (Leadership and Integrity).',
      ],
      sw: [
        'Shahada ya chuo kikuu na uzoefu wa juu wa utawala na uongozi katika utumishi wa umma.',
        'Rekodi safi ya kimaadili chini ya Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Serves on contract terms subject to presidential reappointment or dismissal, and administrative review.',
      sw: 'Huhudumu kwa mkataba kulingana na uamuzi wa Rais na kanuni za utumishi wa umma.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the Cabinet Secretary, Auditor-General, EACC, and parliamentary watchdog committees (PAC/PIC). Personally liable for illegal procurement or unauthorized expenditure.',
      sw: 'Huwajibika kwa Waziri wake, Mkaguzi Mkuu wa Hesabu (Auditor-General), EACC, na kamati za Bunge (PAC). Anawajibika kibinafsi kwa matumizi mabaya ya fedha za idara yake.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 155', 'Public Finance Management Act 2012'],
      sw: ['Katiba ya Kenya 2010: Kifungu 155', 'Sheria ya Usimamizi wa Fedha za Umma ya 2012'],
    },
    citizenEngagement: {
      en: 'Citizens request public departmental records under the Access to Information Act and participate in departmental tender monitoring.',
      sw: 'Wananchi wana haki ya kuomba taarifa rasmi za idara chini ya Sheria ya Haki ya Kupata Taarifa na kufuatilia utoaji wa zabuni za serikali.',
    },
    relatedOfficeIds: ['cabinet_secretary', 'auditor_general', 'public_service_commission'],
  },

  // 5. Member of Parliament (National Assembly)
  {
    id: 'member_of_parliament',
    name: {
      en: 'Member of Parliament - Constituency MP',
      sw: 'Mbunge wa Bunge la Kitaifa (Mbunge wa Eneo Bunge)',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Users',
    badgeColor: 'bg-amber-600 text-white',
    keyStats: {
      totalNumber: '290 Constituency MPs (+ 47 Women Reps & 12 Nominated)',
      establishedBy: 'Constitution of Kenya, Articles 93–97',
    },
    summary: {
      en: 'A Member of the National Assembly represents the people of a specific single-member constituency (such as Matuga, Msambweni, Kinango, or Lunga Lunga in Kwale). An MP legislates national laws, allocates national revenue, and conducts executive oversight.',
      sw: 'Mbunge wa Bunge la Kitaifa anawakilisha wananchi wa eneo bunge maalum (kama vile Matuga, Msambweni, Kinango, au Lunga Lunga hapa Kwale). Mbunge hutunga sheria za kitaifa, kugawa bajeti ya nchi, na kusimamia utendaji wa serikali kuu.',
    },
    responsibilities: {
      en: [
        'Enacts and amends national legislation that binds all citizens.',
        'Determines the allocation of national revenue between national and county governments.',
        'Appropriates funds for national government expenditure and scrutinizes state accounts.',
        'Patronizes and oversees the National Government Constituencies Development Fund (NG-CDF) for education and security infrastructure.',
        'Vets nominees for Cabinet Secretaries, Principal Secretaries, Judges, and Commissioners.',
        'Presents constituency petitions and queries on behalf of constituents in Parliament.',
      ],
      sw: [
        'Kutunga na kurekebisha sheria za kitaifa zinazotumika kote nchini.',
        'Kugawanya mapato ya kitaifa kati ya serikali ya kitaifa na kaunti 47.',
        'Kuidhinisha matumizi ya bajeti ya serikali ya kitaifa na kukagua hesabu za umma.',
        'Kusimamia Hazina ya Ustawi wa Maeneo Bunge (NG-CDF) kwa ajili ya madarasa ya shule za upili/msingi na vituo vya usalama.',
        'Kupiga msasa wateule wa Rais (Mawaziri, Majaji, Makamishna).',
        'Kuwasilisha maombi na kero za wananchi wa eneo bunge lake bungeni.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT build or maintain county roads, village dispensary clinics, or county water projects (those are County Governor functions).',
        'Does NOT award NG-CDF tenders directly or sit on procurement committees (strictly reserved for the CDF committee).',
        'Cannot employ or dismiss local public school teachers (managed independently by TSC).',
      ],
      sw: [
        'HAJENGI wala kukarabati barabara za vijijini, zahanati za kaunti, au mabwawa ya maji ya kaunti (hayo ni majukumu ya Gavana wa Kaunti).',
        'HAWEZI kutoa zabuni za NG-CDF moja kwa moja wala kuwa mjumbe wa kamati ya ununuzi (hilo linafanywa na kamati ya CDF kwa mujibu wa sheria).',
        'Hawezi kuajiri au kuhamisha walimu wa shule (hilo ni jukumu huru la Tume ya Walimu - TSC).',
      ],
    },
    howSelected: {
      en: 'Directly elected by registered voters of the constituency in general elections held every 5 years.',
      sw: 'Huchaguliwa moja kwa moja na wapiga kura wa eneo bunge katika uchaguzi mkuu unaofanyika kila baada ya miaka 5.',
    },
    qualifications: {
      en: [
        'Registered Kenyan voter.',
        'Satisfies educational, moral, and ethical requirements prescribed by the Constitution and Elections Act.',
        'Nominated by a political party or registered as an independent candidate.',
        'Must not be an undischarged bankrupt, convicted of election offense, or subject to a prison sentence exceeding 6 months.',
      ],
      sw: [
        'Awe mpiga kura aliyesajiliwa nchini Kenya.',
        'Awe na sifa za kielimu na kimaadili zinazohitajika kisheria.',
        'Awe ameteuliwa na chama cha siasa au mgombea huru.',
        'Asiwe amefilisika, wala kutiwa hatiani kwa makosa ya uchaguzi au kufungwa gerezani zaidi ya miezi sita.',
      ],
    },
    termOfOffice: {
      en: 'Five-year term corresponding with Parliament life cycle.',
      sw: 'Muhula wa miaka mitano unaolingana na uhai wa Bunge.',
    },
    oversightAndAccountability: {
      en: 'Accountable to constituents who hold the constitutional right of recall under Article 104 and the Elections Act. Bound by the Speaker\'s rules and Powers and Privileges Act.',
      sw: 'Huwajibika kwa wapiga kura wake ambao wana haki ya kikatiba ya kumwondoa (recall) chini ya Kifungu cha 104 cha Katiba na Sheria ya Uchaguzi.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 93–97, 104', 'NG-CDF Act 2015', 'Elections Act 2011'],
      sw: ['Katiba ya Kenya 2010: Vifungu 93–97, 104', 'Sheria ya NG-CDF ya 2015'],
    },
    citizenEngagement: {
      en: 'Citizens attend constituency NG-CDF public project identification meetings, visit constituency offices, and submit citizen petitions directly to the Clerk of the National Assembly.',
      sw: 'Wananchi huhudhuria mikutano ya hadhara ya kupanga miradi ya NG-CDF, kutembelea ofisi ya mbunge jimboni, au kuwasilisha maombi rasmi (petitions) kwa Karani wa Bunge.',
    },
    relatedOfficeIds: ['senator', 'woman_representative', 'speaker_national_assembly', 'member_county_assembly'],
  },

  // 6. Senator
  {
    id: 'senator',
    name: {
      en: 'Senator of the County',
      sw: 'Seneta wa Kaunti',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Shield',
    badgeColor: 'bg-amber-700 text-white',
    keyStats: {
      totalNumber: '47 Elected County Senators (+ 16 Nominated Women, 2 Youth, 2 PWDs)',
      establishedBy: 'Constitution of Kenya, Articles 93, 96, 98',
    },
    summary: {
      en: 'The Senator represents the entire county at the national level and serves as the constitutional guardian of devolution, protecting the interests of the county and its government.',
      sw: 'Seneta anawakilisha kaunti nzima katika ngazi ya kitaifa na ndiye mlinzi mkuu wa kikatiba wa ugatuzi, akilinda maslahi ya kaunti na serikali yake.',
    },
    responsibilities: {
      en: [
        'Protects the constitutional interests of counties and their governments.',
        'Debates, amends, and passes legislation concerning county governments.',
        'Determines the allocation of national revenue among the 47 county governments (Division of Revenue Bill & County Allocation of Revenue Act - CARA).',
        'Exercises oversight over national revenue allocated to county governments through the Senate County Public Accounts Committee (CPAC).',
        'Considers and votes on impeachment resolutions against County Governors.',
      ],
      sw: [
        'Kulinda maslahi ya kikatiba ya serikali za kaunti na wananchi wake.',
        'Kujadili, kurekebisha na kupitisha sheria zote zinazohusu serikali za kaunti.',
        'Kuamua mgao wa fedha za kitaifa kwa kila moja ya kaunti 47 (Mswada wa Ugavi wa Mapato wa Kaunti - CARA).',
        'Kufanya ukaguzi na usimamizi wa matumizi ya fedha zilizotumwa kwenye serikali za kaunti kupitia Kamati ya Bunge ya Hesabu za Kaunti (CPAC).',
        'Kusikiliza na kupiga kura kuhusu kuondolewa madarakani kwa Magavana (impeachment).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT manage county funds, county bank accounts, or county executive tenders (that is the Governor\'s role).',
        'Does NOT approve the county budget line items (that is the County Assembly\'s role).',
        'Does not control the NG-CDF fund (which is managed at constituency MP level).',
      ],
      sw: [
        'HASIMAMII akaunti za benki za kaunti, utoaji wa zabuni za kaunti wala bajeti ya miradi ya kaunti (hayo ni ya Gavana).',
        'HAIDHINISHI vifungu vya bajeti ya kaunti (hilo ni jukumu la Bunge la Kaunti - MCA).',
        'Hana hazina ya NG-CDF (ambayo iko chini ya Mbunge wa Eneo Bunge).',
      ],
    },
    howSelected: {
      en: 'Directly elected by registered voters of the county during the general elections.',
      sw: 'Huchaguliwa moja kwa moja na wapiga kura wa kaunti nzima katika uchaguzi mkuu.',
    },
    qualifications: {
      en: [
        'Registered voter in Kenya.',
        'Meets educational and ethical qualifications specified in the Elections Act.',
        'Compliant with Chapter 6 (Leadership and Integrity).',
      ],
      sw: [
        'Mpiga kura aliyesajiliwa nchini Kenya.',
        'Awe na sifa za kielimu na maadili zilizoainishwa katika Sheria ya Uchaguzi.',
        'Awe na rekodi safi ya Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Five-year term.',
      sw: 'Muhula wa miaka mitano.',
    },
    oversightAndAccountability: {
      en: 'Accountable to county voters, bound by the Senate Standing Orders, and subject to voter recall under Article 104.',
      sw: 'Huwajibika kwa wapiga kura wa kaunti, kufuata Kanuni za Seneti, na anaweza kuondolewa na wananchi chini ya Kifungu cha 104.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 96, 98, 104', 'County Allocation of Revenue Act (Annual)'],
      sw: ['Katiba ya Kenya 2010: Vifungu 96, 98, 104'],
    },
    citizenEngagement: {
      en: 'Citizens engage their Senator by submitting statements to the Senate, attending Senate county oversight visits, and submitting memoranda on county-related bills.',
      sw: 'Wananchi hushiriki kwa kuwasilisha maoni kwa Seneti wakati wa ziara za ukaguzi kaunti, au kuwasilisha malalamiko kuhusu matumizi mabaya ya fedha za kaunti.',
    },
    relatedOfficeIds: ['governor', 'member_of_parliament', 'member_county_assembly', 'controller_of_budget'],
  },

  // 7. County Woman Representative
  {
    id: 'woman_representative',
    name: {
      en: 'County Woman Representative',
      sw: 'Mwakilishi wa Wanawake wa Kaunti',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'HeartHandshake',
    badgeColor: 'bg-pink-700 text-white',
    keyStats: {
      totalNumber: '47 Representatives in National Assembly',
      establishedBy: 'Constitution of Kenya, Article 97(1)(b)',
    },
    summary: {
      en: 'The County Woman Representative is a full Member of the National Assembly elected county-wide to promote gender equity, champion women, youth, and vulnerable groups, and oversee national affirmative action funds.',
      sw: 'Mwakilishi wa Wanawake wa Kaunti ni Mbunge kamili wa Bunge la Kitaifa anayechaguliwa na kaunti nzima kuendeleza usawa wa kijinsia, kutetea haki za wanawake, vijana na walemavu, na kusimamia hazina ya usawa (NGAAF).',
    },
    responsibilities: {
      en: [
        'Full voting Member of the National Assembly on all national legislation.',
        'Champions gender equality, maternal and child healthcare, and affirmative action policies.',
        'Oversees the National Government Affirmative Action Fund (NGAAF) for women, youth, and PWD empowerment.',
        'Sponsors bills addressing domestic violence, economic empowerment, and educational scholarships.',
      ],
      sw: [
        'Ni Mbunge kamili anayepiga kura kwenye miswada yote ya kitaifa bungeni.',
        'Kupigania usawa wa kijinsia, afya ya uzazi, na sera za kuwawezesha makundi maalum.',
        'Kusimamia Hazina ya Kitaifa ya Uwezeshaji (NGAAF) inayosaidia vikundi vya wanawake, vijana na walemavu.',
        'Kupendekeza sheria za kuzuia ukatili wa kijinsia na kutoa ufadhili wa masomo.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does not represent only women; represents all residents of the county in the National Assembly.',
        'Does not control county executive departments or hospital staffing.',
      ],
      sw: [
        'Hawatetei wanawake pekee; anawakilisha wananchi wote wa kaunti nzima katika Bunge la Kitaifa.',
        'HASIMAMII idara za serikali ya kaunti wala hospitali za kaunti.',
      ],
    },
    howSelected: {
      en: 'Elected by registered voters of the entire county in the general election.',
      sw: 'Huchaguliwa na wapiga kura wote wa kaunti katika uchaguzi mkuu.',
    },
    qualifications: {
      en: [
        'Must be a woman registered voter in Kenya.',
        'Satisfies educational and leadership integrity requirements under Chapter 6.',
      ],
      sw: [
        'Awe mwanamke mpiga kura aliyesajiliwa nchini Kenya.',
        'Atimize vigezo vya kielimu na kimaadili chini ya Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Five-year term.',
      sw: 'Muhula wa miaka mitano.',
    },
    oversightAndAccountability: {
      en: 'Accountable to county voters, overseen by the National Assembly and NGAAF board regulations.',
      sw: 'Huwajibika kwa wapiga kura wa kaunti na kanuni za bodi ya NGAAF na Bunge.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 97(1)(b)', 'Public Finance Management (NGAAF) Regulations'],
      sw: ['Katiba ya Kenya 2010: Kifungu 97(1)(b)'],
    },
    citizenEngagement: {
      en: 'Community groups, women\'s groups, and youth apply for NGAAF empowerment grants, vocational training sponsorships, and civic engagement forums.',
      sw: 'Vikundi vya wanawake, vijana na watu wanaoishi na ulemavu hutuma maombi ya ruzuku za NGAAF na kushiriki mafunzo ya kujiwezesha kiuchumi.',
    },
    relatedOfficeIds: ['member_of_parliament', 'senator', 'governor'],
  },

  // 8. Governor
  {
    id: 'governor',
    name: {
      en: 'County Governor',
      sw: 'Gavana wa Kaunti',
    },
    level: 'county',
    branch: 'executive',
    selectionMethod: 'elected',
    iconName: 'Landmark',
    badgeColor: 'bg-emerald-700 text-white',
    keyStats: {
      totalNumber: '47 County Governors',
      establishedBy: 'Constitution of Kenya, Articles 179–181',
    },
    summary: {
      en: 'The Governor is the chief executive officer of the county government. The Governor leads the county executive committee, manages county resources, and oversees the delivery of devolved public services (like health clinics, county roads, markets, and early childhood education).',
      sw: 'Gavana ndiye kiongozi mkuu wa kiutendaji wa serikali ya kaunti. Anaongoza kamati kuu ya mawaziri wa kaunti (CECMs), kusimamia rasilimali za kaunti, na kuhakikisha huduma zilizogatuliwa (kama zahanati, barabara za vijijini, masoko, na elimu ya chekechea/ECDE) zinawafikia wananchi.',
    },
    responsibilities: {
      en: [
        'Leads the County Executive and implements county legislation.',
        'Oversees devolved functions: county health facilities, county roads, agriculture & livestock, water provision, trade licensing, ECDE, and local markets.',
        'Appoints County Executive Committee Members (CECMs) and Chief Officers with County Assembly approval.',
        'Prepares and submits the County Integrated Development Plan (CIDP) and Annual Development Plan (ADP) for public participation and assembly approval.',
        'Submits the annual county budget estimates to the County Assembly.',
      ],
      sw: [
        'Kuongoza Serikali ya Kaunti na kutekeleza sheria zilizopitishwa na Bunge la Kaunti.',
        'Kusimamia huduma zilizogatuliwa: zahanati na hospitali za kaunti, barabara za vijijini, kilimo na mifugo, maji, leseni za biashara, chekechea (ECDE) na masoko.',
        'Kuteua Mawaziri wa Kaunti (CECMs) na Makatibu Wakuu wa Kaunti kwa idhini ya Bunge la Kaunti.',
        'Kuandaa na kuwasilisha Mpango Jumuishi wa Maendeleo ya Kaunti (CIDP) kwa ushiriki wa wananchi.',
        'Kuwasilisha makadirio ya bajeti ya kila mwaka kwa Bunge la Kaunti.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT control national security, police, armed forces, or foreign relations (national government mandate).',
        'Does NOT manage primary, secondary, or university teacher hiring (Teachers Service Commission).',
        'Does NOT issue national identity cards or passports (National Registration Bureau & Immigration).',
        'Cannot pass laws or county budgets without County Assembly approval.',
      ],
      sw: [
        'HASIMAMII usalama wa taifa, polisi, majeshi, wala masuala ya kigeni (hayo ni ya Serikali ya Kitaifa).',
        'HAWEZI kuajiri walimu wa shule za msingi au upili (hilo ni jukumu la TSC).',
        'HATOI vitambulisho vya kitaifa (ID) wala pasipoti za kusafiri (hayo ni ya Serikali Kuu).',
        'Hawezi kupitisha sheria wala kutumia bajeti bila kibali cha Bunge la Kaunti (MCAs).',
      ],
    },
    howSelected: {
      en: 'Directly elected by registered voters in the county during general elections for a 5-year term.',
      sw: 'Huchaguliwa moja kwa moja na wapiga kura wa kaunti katika uchaguzi mkuu kwa muhula wa miaka 5.',
    },
    qualifications: {
      en: [
        'Kenyan citizen.',
        'Registered voter in the county.',
        'Satisfies educational requirements specified by law (degree from a recognized university under Elections Act).',
        'Nominated by a political party or independent candidate.',
        'High moral standing and compliance with Chapter 6.',
      ],
      sw: [
        'Raia wa Kenya.',
        'Mpiga kura aliyesajiliwa katika kaunti husika.',
        'Awe na sifa za kielimu zinazotakiwa (shahada ya chuo kikuu chini ya Sheria ya Uchaguzi).',
        'Awe ameteuliwa na chama au mgombea huru.',
        'Awe mwenye kufuata uadilifu wa Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Maximum of two five-year terms (10 years total). Cannot serve more than two terms.',
      sw: 'Kiwango cha juu ni mihula miwili ya miaka mitano (miaka 10 jumla). Hawezi kuongoza zaidi ya mihula miwili.',
    },
    oversightAndAccountability: {
      en: 'Oversight conducted by the County Assembly (budget scrutiny, audits, vetting). Can be impeached by a two-thirds vote of MCAs and confirmed by the Senate (Article 181). Financial audits done by Auditor-General.',
      sw: 'Hukaguliwa na Bunge la Kaunti (MCAs). Anaweza kuondolewa madarakani (impeached) na theluthi mbili ya madiwani na uamuzi huo kuthibitishwa na Seneti (Kifungu cha 181). Hesabu zake hukaguliwa na Mkaguzi Mkuu wa Hesabu.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 179–181', 'County Governments Act 2012', 'Public Finance Management Act 2012'],
      sw: ['Katiba ya Kenya 2010: Vifungu 179–181', 'Sheria ya Serikali za Kaunti ya 2012'],
    },
    citizenEngagement: {
      en: 'Citizens participate in mandatory ward-level public participation hearings on the CIDP, Annual Budget, and county finance bills, or submit petitions to the county executive.',
      sw: 'Wananchi wanatakiwa kikatiba kushiriki mikutano ya wadi ya kupanga maendeleo ya kaunti (CIDP), bajeti ya mwaka, au kuwasilisha malalamiko ya huduma ofisini kwa gavana.',
    },
    relatedOfficeIds: ['deputy_governor', 'member_county_assembly', 'senator', 'president'],
  },

  // 9. Member of County Assembly (MCA)
  {
    id: 'member_county_assembly',
    name: {
      en: 'Member of County Assembly (MCA)',
      sw: 'Mjumbe wa Bunge la Kaunti (Diwani / MCA)',
    },
    level: 'county',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'MapPin',
    badgeColor: 'bg-emerald-600 text-white',
    keyStats: {
      totalNumber: '1,450 Elected Ward MCAs nationwide',
      establishedBy: 'Constitution of Kenya, Articles 177, 185',
    },
    summary: {
      en: 'The MCA represents the people of a specific electoral ward (e.g., Tiwi, Ukunda, Gombato Bongwe, Pongwe Kikoneni in Kwale). MCAs pass county laws, approve county budgets, and oversee the County Executive.',
      sw: 'Diwani (MCA) anawakilisha wananchi wa wadi maalum ya uchaguzi (kama Tiwi, Ukunda, Gombato Bongwe, Pongwe Kikoneni hapa Kwale). Diwani hutunga sheria za kaunti, kuidhinisha bajeti ya kaunti, na kusimamia mawaziri na utendaji wa Gavana.',
    },
    responsibilities: {
      en: [
        'Represents ward residents in the County Assembly.',
        'Enacts county legislation on devolved functions (trade, markets, county health, local transport).',
        'Scrutinizes, amends, and approves the county annual budget and county taxes/fees.',
        'Vets and approves nominees for CECMs, County Secretary, and County Chief Officers.',
        'Exercises oversight over the Governor and county executive departments.',
        'Facilitates ward development projects through the Ward Development Fund.',
      ],
      sw: [
        'Kuwakilisha wananchi wa wadi yake katika Bunge la Kaunti.',
        'Kutunga sheria za kaunti kuhusu huduma zilizogatuliwa (biashara, masoko, afya ya kaunti, usafiri wa ndani).',
        'Kukagua, kurekebisha na kupitisha bajeti ya kaunti na ushuru wa kaunti.',
        'Kupiga msasa wateule wa Gavana (Mawaziri wa Kaunti na Makatibu Wakuu).',
        'Kusimamia utendaji na uwajibikaji wa Gavana na idara zote za kaunti.',
        'Kupanga na kufuatilia miradi ya maendeleo ya wadi kupitia Hazina ya Maendeleo ya Wadi.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT manage constituency-level NG-CDF funds (that belongs to the MP).',
        'Does NOT award county government tenders directly.',
        'Does NOT issue birth certificates, IDs, or title deeds.',
      ],
      sw: [
        'HASIMAMII fedha za NG-CDF za eneo bunge (hilo ni la Mbunge wa Bunge la Kitaifa).',
        'HATOI zabuni za serikali ya kaunti kibinafsi.',
        'HATOI vitambulisho vya taifa, hati za kuzaliwa wala hati miliki za ardhi.',
      ],
    },
    howSelected: {
      en: 'Directly elected by registered voters of the ward in general elections every 5 years.',
      sw: 'Huchaguliwa moja kwa moja na wapiga kura wa wadi husika katika uchaguzi mkuu kila baada ya miaka 5.',
    },
    qualifications: {
      en: [
        'Registered voter in the respective ward.',
        'Meets statutory educational requirements.',
        'Clean ethical standing under Chapter 6.',
      ],
      sw: [
        'Mpiga kura aliyesajiliwa katika wadi husika.',
        'Awe na sifa za kielimu zinazotakiwa kisheria.',
        'Awe na mwenendo safi wa kimaadili chini ya Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Five-year term.',
      sw: 'Muhula wa miaka mitano.',
    },
    oversightAndAccountability: {
      en: 'Accountable to ward residents who possess constitutional recall rights under Article 104 and County Governments Act Section 27.',
      sw: 'Huwajibika kwa wananchi wa wadi yake ambao wana haki ya kikatiba ya kumng\'oa (recall) chini ya Kifungu cha 104 na Sheria ya Serikali za Kaunti.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 177, 185', 'County Governments Act 2012'],
      sw: ['Katiba ya Kenya 2010: Vifungu 177, 185', 'Sheria ya Serikali za Kaunti ya 2012'],
    },
    citizenEngagement: {
      en: 'Citizens interact with their MCA in ward barazas, ward development committees, and by presenting petitions directly to the County Assembly clerk.',
      sw: 'Wananchi hukutana na Diwani wao kwenye mikutano ya hadhara ya wadi (barazas), kamati za miradi ya wadi, na kuwasilisha malalamiko kwenye Bunge la Kaunti.',
    },
    relatedOfficeIds: ['governor', 'speaker_county_assembly', 'member_of_parliament', 'senator'],
  },

  // 10. Chief Justice
  {
    id: 'chief_justice',
    name: {
      en: 'Chief Justice and President of the Supreme Court',
      sw: 'Jaji Mkuu na Rais wa Mahakama ya Juu Zaidi',
    },
    level: 'national',
    branch: 'judiciary',
    selectionMethod: 'constitutional_process',
    iconName: 'Scale',
    badgeColor: 'bg-stone-800 text-white',
    keyStats: {
      totalNumber: 'Head of Judiciary',
      establishedBy: 'Constitution of Kenya, Articles 161, 163',
    },
    summary: {
      en: 'The Chief Justice is the Head of the Judiciary, President of the Supreme Court, and Chairperson of the Judicial Service Commission (JSC). The CJ safeguards judicial independence and the supremacy of the Constitution.',
      sw: 'Jaji Mkuu ndiye Kiongozi Mkuu wa Idara ya Mahakama, Rais wa Mahakama ya Juu Zaidi, na Mwenyekiti wa Tume ya Huduma za Mahakama (JSC). Analinda uhuru wa mahakama na ushindi wa Katiba.',
    },
    responsibilities: {
      en: [
        'Leads and administers the judicial system across all courts in Kenya.',
        'Presides over the Supreme Court of Kenya.',
        'Chairs the Judicial Service Commission (JSC), which recommends judge appointments and handles judicial discipline.',
        'Swears in the President and Deputy President of Kenya.',
        'Submits the annual State of the Judiciary and Administration of Justice Report (SOJAR).',
      ],
      sw: [
        'Kuongoza na kusimamia mfumo mzima wa mahakama zote nchini Kenya.',
        'Kuongoza Mahakama ya Juu Zaidi (Supreme Court).',
        'Mwenyekiti wa Tume ya Huduma za Mahakama (JSC) inayopendekeza kuteuliwa kwa majaji na kushughulikia nidhamu ya mahakama.',
        'Kumwapisha Rais na Naibu Rais wa Kenya.',
        'Kuwasilisha ripoti ya kila mwaka ya Hali ya Utoaji Haki nchini (SOJAR).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT take instructions from the President, Cabinet, or Parliament.',
        'Cannot decide cases outside of established constitutional laws and court hearings.',
        'Does NOT prosecute crimes (that is the independent mandate of the Director of Public Prosecutions - ODPP).',
      ],
      sw: [
        'HAPOKEI maagizo kutoka kwa Rais, Mawaziri wala Bunge.',
        'Hawezi kutoa uamuzi wa kesi kinyume na sheria zilizopo na ushahidi mahakamani.',
        'HASHTAKI wahalifu (hilo ni jukumu huru la Mkurugenzi wa Mashtaka ya Umma - ODPP).',
      ],
    },
    howSelected: {
      en: 'Competitively recruited through televised public interviews by the Judicial Service Commission (JSC), formally nominated to the President, and vetted/approved by the National Assembly before presidential appointment.',
      sw: 'Huchaguliwa kupitia usaili wa hadhara unaorushwa hewani na Tume ya JSC, kupendekezwa kwa Rais, na kupigwa msasa na kuidhinishwa na Bunge la Kitaifa kabla ya kuapishwa rasmi.',
    },
    qualifications: {
      en: [
        'At least 15 years experience as a superior court judge or distinguished academic/legal practitioner.',
        'High moral character, integrity, and impartiality.',
        'Compliance with Chapter 6 of the Constitution.',
      ],
      sw: [
        'Uzoefu usiopungua miaka 15 kama jaji wa mahakama ya juu au wakili mashuhuri wa sheria.',
        'Tabia njema, uadilifu wa hali ya juu na kutopendelea.',
        'Kuzingatia kikamilifu Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Serves for a maximum term of ten years as Chief Justice, or until retirement age of 70 years, whichever comes earlier.',
      sw: 'Muhula usiozidi miaka kumi kama Jaji Mkuu, au akifikisha umri wa kustaafu wa miaka 70, lolote litakalotangulia.',
    },
    oversightAndAccountability: {
      en: 'Judicial decisions appealable within constitutional appellate hierarchy. Misconduct petitions investigated by the Judicial Service Commission (JSC) and a constitutional tribunal appointed under Article 168.',
      sw: 'Maamuzi ya kesi yanaweza kukatiwa rufaa kisheria. Malalamiko ya utovu wa nidhamu huchunguzwa na Tume ya JSC na jopo maalum la kikatiba (tribunal) chini ya Kifungu cha 168.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Articles 161, 163, 168', 'Judicial Service Act 2011'],
      sw: ['Katiba ya Kenya 2010: Vifungu 161, 163, 168'],
    },
    citizenEngagement: {
      en: 'Citizens access courts directly (Article 22 for Bill of Rights violations without court fees), participate in Court User Committees (CUCs), and file conduct complaints with the JSC.',
      sw: 'Wananchi wana haki ya kwenda mahakamani kutetea haki zao (Kifungu cha 22 bila malipo ya kesi), kushiriki Kamati za Watumiaji wa Mahakama (CUCs), na kuripoti majaji wasio waadilifu kwa JSC.',
    },
    relatedOfficeIds: ['president', 'attorney_general', 'eacc', 'commission_administrative_justice'],
  },

  // 11. Independent Electoral and Boundaries Commission (IEBC)
  {
    id: 'iebc',
    name: {
      en: 'Independent Electoral and Boundaries Commission (IEBC)',
      sw: 'Tume Huru ya Uchaguzi na Mipaka (IEBC)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'Vote',
    badgeColor: 'bg-emerald-800 text-white',
    keyStats: {
      totalNumber: 'Chairperson + 6 Commissioners',
      establishedBy: 'Constitution of Kenya, Article 88',
    },
    summary: {
      en: 'IEBC is an independent constitutional commission responsible for conducting and supervising transparent elections, voter registration, and delimiting constituency and ward boundaries in Kenya.',
      sw: 'IEBC ni tume huru ya kikatiba inayohusika na kuendesha na kusimamia uchaguzi huru na wa wazi, kuandikisha wapiga kura, na kukagua mipaka ya maeneo bunge na wadi nchini Kenya.',
    },
    responsibilities: {
      en: [
        'Continuous voter registration and updating the national voter register.',
        'Delimitation of electoral boundaries (constituencies and wards).',
        'Regulates political parties nomination processes and campaign financing.',
        'Conducts general elections, by-elections, and national referenda.',
        'Conducts voter education across the republic.',
      ],
      sw: [
        'Kuendelea kuandikisha wapiga kura wapya na kusafisha rejista ya kitaifa ya wapiga kura.',
        'Kukagua na kuweka mipaka ya maeneo bunge na wadi za uwakilishi.',
        'Kusimamia mchakato wa uteuzi wa wagombea na gharama za kampeni za kisiasa.',
        'Kuendesha uchaguzi mkuu, chaguzi ndogo, na kura za maoni (referendum).',
        'Kutoa elimu ya mpiga kura kwa wananchi kote nchini.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT campaign for or endorse any political party or candidate.',
        'Does not adjudicate post-election presidential disputes (reserved exclusively for the Supreme Court).',
      ],
      sw: [
        'HAIPIGII debe wala kumuunga mkono mgombea au chama chochote cha siasa.',
        'Haiamui kesi za matokeo ya urais baada ya uchaguzi (hilo ni jukumu la pekee la Mahakama ya Juu).',
      ],
    },
    howSelected: {
      en: 'Recruited by an independent multi-stakeholder selection panel, nominated by the President, and vetted by the National Assembly.',
      sw: 'Huteuliwa kupitia jopo huru la uteuzi, kupendekezwa na Rais na kupigwa msasa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Degree from recognized university.',
        'Demonstrated competence in electoral administration, law, or public management.',
        'Strictly non-partisan; not held political office in past 5 years.',
      ],
      sw: [
        'Shahada ya chuo kikuu kinachotambuliwa.',
        'Uzoefu na umahiri katika usimamizi wa uchaguzi, sheria au utawala.',
        'Asiwe mwanachama wa chama cha siasa wala kushikilia nafasi ya kisiasa katika miaka 5 iliyopita.',
      ],
    },
    termOfOffice: {
      en: 'Single non-renewable term of six years (Article 250).',
      sw: 'Muhula mmoja usioongezwa wa miaka sita (Kifungu cha 250).',
    },
    oversightAndAccountability: {
      en: 'Independent and subject only to the Constitution. Submits annual reports to Parliament and President. Can be removed only through a constitutional tribunal under Article 251.',
      sw: 'Ni huru na inafuata Katiba pekee. Huwasilisha ripoti kwa Bunge na Rais. Huondolewa kwa jopo maalum chini ya Kifungu cha 251.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 88, 248–254', 'IEBC Act 2011', 'Elections Act 2011'],
      sw: ['Katiba ya Kenya 2010: Kifungu 88', 'Sheria ya IEBC ya 2011'],
    },
    citizenEngagement: {
      en: 'Citizens register to vote, verify their details during inspection, attend boundary review hearings, and participate as accredited election observers.',
      sw: 'Wananchi wanashiriki kwa kujiandikisha kama wapiga kura, kuhakiki majina yao, kuhudhuria vikao vya mapitio ya mipaka, na kuwa waangalizi huru wa uchaguzi.',
    },
    relatedOfficeIds: ['president', 'member_of_parliament', 'senator', 'governor'],
  },

  // 12. Ethics and Anti-Corruption Commission (EACC)
  {
    id: 'eacc',
    name: {
      en: 'Ethics and Anti-Corruption Commission (EACC)',
      sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC)',
    },
    level: 'independent',
    branch: 'oversight',
    selectionMethod: 'statutory_process',
    iconName: 'AlertTriangle',
    badgeColor: 'bg-red-700 text-white',
    keyStats: {
      totalNumber: 'Commissioners + Directorate of Investigations',
      establishedBy: 'Constitution of Kenya, Article 79 & EACC Act',
    },
    summary: {
      en: 'EACC is the constitutional agency established under Article 79 to ensure compliance with and enforcement of Chapter 6 (Leadership and Integrity), combat public corruption, and recover stolen public assets.',
      sw: 'EACC ni tume ya kikatiba iliyoanzishwa chini ya Kifungu cha 79 cha Katiba kuhakikisha uzingatiaji na utekelezaji wa Sura ya 6 (Uongozi na Uadilifu), kupambana na ufisadi, na kurejesha mali ya umma iliyoibwa.',
    },
    responsibilities: {
      en: [
        'Investigates acts of corruption, economic crime, and violation of Chapter 6 integrity codes.',
        'Files civil recovery suits to repossess grabbed public land and stolen public finances.',
        'Audits systems, procedures, and internal controls of public entities to seal corruption loopholes.',
        'Conducts integrity vetting of applicants for senior state offices.',
        'Promotes ethical civic values and public anti-corruption education.',
      ],
      sw: [
        'Kuchunguza vitendo vya ufisadi, uhalifu wa kiuchumi na ukiukaji wa maadili ya Sura ya 6.',
        'Kufungua kesi za kurejesha ardhi ya umma iliyonyakuliwa na fedha za serikali zilizoibwa.',
        'Kukagua mifumo na taratibu za taasisi za umma ili kuziba mianya ya wizi wa mali ya umma.',
        'Kupiga msasa wa kimaadili wateule wanaoomba kazi za uongozi wa juu serikalini.',
        'Kutoa elimu ya kupinga ufisadi kwa umma na mashuleni.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT prosecute suspects directly in court (it investigates and submits files to the Director of Public Prosecutions - ODPP for prosecution).',
        'Does not pass judicial sentences (that power belongs exclusively to anti-corruption courts).',
      ],
      sw: [
        'HAISHTAKI watuhumiwa mahakamani moja kwa moja (inachunguza na kupeleka faili kwa Mkurugenzi wa Mashtaka - ODPP kuamua kuanzisha mashtaka).',
        'HAIFUNGI mtu gerezani (hilo ni jukumu la majaji na mahakama za kupambana na ufisadi).',
      ],
    },
    howSelected: {
      en: 'Commissioners are competitively selected through public interviews by a selection panel, nominated by the President, and approved by the National Assembly.',
      sw: 'Makamishna huchaguliwa kwa ushindani kupitia jopo la uteuzi, kupendekezwa na Rais na kuidhinishwa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Degree in law, finance, governance, or public administration.',
        'Unquestionable integrity and compliance with Chapter 6.',
      ],
      sw: [
        'Shahada ya sheria, fedha, utawala au sayansi za jamii.',
        'Uadilifu usiokuwa na mashaka yoyote chini ya Sura ya 6.',
      ],
    },
    termOfOffice: {
      en: 'Commissioners serve a single non-renewable term of six years.',
      sw: 'Makamishna huhudumu kwa muhula mmoja usioongezwa wa miaka sita.',
    },
    oversightAndAccountability: {
      en: 'Accountable to Parliament through statutory annual reports and budget scrutiny. Removal governed by tribunal process under Article 251.',
      sw: 'Huwajibika kwa Bunge kupitia ripoti za kila mwaka. Huondolewa kwa utaratibu wa jopo maalum chini ya Kifungu cha 251 cha Katiba.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 79', 'Ethics and Anti-Corruption Commission Act 2011', 'Anti-Corruption and Economic Crimes Act 2003'],
      sw: ['Katiba ya Kenya 2010: Kifungu 79', 'Sheria ya EACC ya 2011'],
    },
    citizenEngagement: {
      en: 'Citizens report bribery demands, procurement fraud, and unexplained public wealth anonymously through toll-free hotlines, regional offices, or whistleblower portals.',
      sw: 'Wananchi wanaripoti maombi ya rushwa, wizi wa fedha za miradi, na viongozi wanaojilimbikizia mali kinyume cha sheria bila kutaja majina yao kupitia nambari za bure na ofisi za mikoa.',
    },
    relatedOfficeIds: ['auditor_general', 'commission_administrative_justice', 'principal_secretary'],
  },

  // 13. Office of the Auditor-General (OAG)
  {
    id: 'auditor_general',
    name: {
      en: 'Office of the Auditor-General (OAG)',
      sw: 'Ofisi ya Mdhibiti na Mkaguzi Mkuu wa Hesabu za Serikali',
    },
    level: 'independent',
    branch: 'oversight',
    selectionMethod: 'constitutional_process',
    iconName: 'Calculator',
    badgeColor: 'bg-emerald-900 text-white',
    keyStats: {
      totalNumber: 'Independent Constitutional Office',
      establishedBy: 'Constitution of Kenya, Article 229',
    },
    summary: {
      en: 'The Auditor-General is an independent constitutional officer who audits and reports on public accounts and expenditure of all national and county government entities, ensuring taxpayer money is applied lawfully and effectively.',
      sw: 'Mkaguzi Mkuu wa Hesabu za Serikali ni afisa huru wa kikatiba anayekagua na kutoa ripoti kuhusu hesabu na matumizi ya fedha za umma katika taasisi zote za serikali ya kitaifa na kaunti, akihakikisha kodi ya mwananchi inatumika kwa kufuata sheria na uaminifu.',
    },
    responsibilities: {
      en: [
        'Audits the accounts of national government ministries, state departments, and commissions.',
        'Audits all 47 county executive and assembly accounts, funds, and municipal boards.',
        'Audits public funds including NG-CDF, county bursaries, and national debt servicing.',
        'Submits statutory audit reports within 6 months after the end of each financial year to Parliament and relevant County Assemblies.',
        'Confirms whether public funds have been applied lawfully, effectively, and economically.',
      ],
      sw: [
        'Kukagua hesabu za wizara zote za serikali ya kitaifa, idara na tume za umma.',
        'Kukagua hesabu za serikali zote 47 za kaunti, mabaraza ya kaunti na fedha za manispaa.',
        'Kukagua fedha zote maalum kama vile NG-CDF, ufadhili wa elimu wa kaunti (bursary), na mikopo ya taifa.',
        'Kuwasilisha ripoti rasmi za ukaguzi ndani ya miezi 6 baada ya kumalizika kwa mwaka wa fedha kwa Bunge na Mabunge ya Kaunti.',
        'Kuthibitisha iwapo fedha za walipa kodi zimetumika kwa kufuata sheria, kwa ufanisi na bila ubadhirifu.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT authorize or release daily government expenditures (that is the Controller of Budget - COB).',
        'Does NOT directly arrest suspects (findings are forwarded to EACC and Parliament).',
      ],
      sw: [
        'HAIDHINISHI utoaji wa fedha za kila siku kutoka hazina ya taifa (hilo ni jukumu la Mdhibiti wa Bajeti - COB).',
        'HAKAMATI watuhumiwa (ripoti zake huwasilishwa kwa Bunge, EACC na DCI kwa hatua za kisheria).',
      ],
    },
    howSelected: {
      en: 'Competitively shortlisted through public interviews by a selection panel, nominated by the President, and vetted by the National Assembly.',
      sw: 'Huteuliwa kwa ushindani na jopo la uteuzi, kupendekezwa na Rais na kupigwa msasa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Qualified accountant with at least 10 years experience in public audit or financial management.',
        'Exemplary integrity under Chapter 6.',
      ],
      sw: [
        'Mhasibu aliyesajiliwa na mwenye uzoefu usiopungua miaka 10 katika ukaguzi wa fedha za umma au usimamizi wa fedha.',
        'Uadilifu wa hali ya juu chini ya Sura ya 6 ya Katiba.',
      ],
    },
    termOfOffice: {
      en: 'Single, non-renewable term of eight years (Article 229(3)).',
      sw: 'Muhula mmoja pekee wa miaka minane usioongezwa (Kifungu 229(3)).',
    },
    oversightAndAccountability: {
      en: 'Independent office subject only to the Constitution. Accounts of the Office of the Auditor-General are audited by a professionally appointed auditor selected by Parliament.',
      sw: 'Ofisi huru inayofuata Katiba pekee. Hesabu za ofisi ya Mkaguzi Mkuu hukaguliwa na mkaguzi huru anayeteuliwa na Bunge.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 229', 'Public Audit Act 2015'],
      sw: ['Katiba ya Kenya 2010: Kifungu 229', 'Sheria ya Ukaguzi wa Umma ya 2015'],
    },
    citizenEngagement: {
      en: 'Citizens access published audit reports freely online to track county and constituency projects, query stalled projects during public participation, and submit whistleblowing audit leads.',
      sw: 'Wananchi wana haki ya kupakua na kusoma ripoti za ukaguzi mtandaoni bila malipo ili kufuatilia miradi ya kaunti yao, kuuliza maswali kwenye vikao vya bajeti, na kutoa taarifa za ubadhirifu.',
    },
    relatedOfficeIds: ['controller_of_budget', 'principal_secretary', 'governor', 'eacc'],
  },

  // 14. Controller of Budget (COB)
  {
    id: 'controller_of_budget',
    name: {
      en: 'Controller of Budget (COB)',
      sw: 'Mdhibiti wa Bajeti ya Serikali (COB)',
    },
    level: 'independent',
    branch: 'oversight',
    selectionMethod: 'constitutional_process',
    iconName: 'DollarSign',
    badgeColor: 'bg-emerald-950 text-white',
    keyStats: {
      totalNumber: 'Independent Constitutional Office',
      establishedBy: 'Constitution of Kenya, Article 228',
    },
    summary: {
      en: 'The Controller of Budget oversees the implementation of national and county budgets by approving withdrawals from public funds only after confirming legal compliance and valid appropriations.',
      sw: 'Mdhibiti wa Bajeti anasimamia utekelezaji wa bajeti za serikali ya kitaifa na kaunti kwa kuidhinisha utoaji wa fedha kutoka kwenye hazina ya umma tu baada ya kujiridhisha kuwa kuna sheria na idhini ya bunge.',
    },
    responsibilities: {
      en: [
        'Authorizes withdrawals from the Consolidated Fund, County Revenue Funds, and Equalization Fund.',
        'Prevents unauthorized or illegal withdrawals from public bank accounts.',
        'Prepares and submits quarterly budget implementation reports to Parliament and County Assemblies.',
        'Mediates financial disputes between executive and legislative branches concerning budget releases.',
      ],
      sw: [
        'Kuidhinisha kutolewa kwa fedha kutoka Hazina Kuu ya Kitaifa, Hazina za Mapato za Kaunti, na Hazina ya Usawa.',
        'Kuzuia utoaji holela au usiofuata sheria wa fedha kutoka akaunti za benki za serikali.',
        'Kuandaa na kuwasilisha ripoti za kila robo mwaka za utekelezaji wa bajeti kwa Bunge na Mabunge ya Kaunti.',
        'Kutoa ushauri wa kitaalamu ili kuhakikisha bajeti zinatekelezwa kwa uwazi na sheria.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT conduct retrospective forensic accounting audits after spending occurs (that is the Auditor-General).',
        'Does not prepare ministry budgets (that is done by the National Treasury and County Executives).',
      ],
      sw: [
        'HAKAGUI hesabu baada ya matumizi kufanyika (hilo ni la Mkaguzi Mkuu wa Hesabu - Auditor General).',
        'HAANDAI bajeti ya wizara (hilo ni kazi ya Wizara ya Fedha na Mawaziri wa Kaunti).',
      ],
    },
    howSelected: {
      en: 'Competitively shortlisted by selection panel, nominated by the President, and vetted by the National Assembly.',
      sw: 'Huchaguliwa kwa ushindani na jopo, kupendekezwa na Rais na kupigwa msasa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Extensive qualifications in public finance management, economics, or accounting.',
        'Compliance with Chapter 6.',
      ],
      sw: [
        'Shahada na uzoefu wa kina katika usimamizi wa fedha za umma, uchumi au uhasibu.',
        'Uadilifu wa Sura ya 6.',
      ],
    },
    termOfOffice: {
      en: 'Single non-renewable term of eight years (Article 228(3)).',
      sw: 'Muhula mmoja usioongezwa wa miaka minane (Kifungu 228(3)).',
    },
    oversightAndAccountability: {
      en: 'Independent office, submits quarterly reports to both houses of Parliament and County Assemblies.',
      sw: 'Ofisi huru, huwasilisha ripoti za utekelezaji wa bajeti kila baada ya miezi mitatu bungeni.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 228', 'Controller of Budget Act 2016'],
      sw: ['Katiba ya Kenya 2010: Kifungu 228', 'Sheria ya Mdhibiti wa Bajeti ya 2016'],
    },
    citizenEngagement: {
      en: 'Citizens review COB quarterly budget absorption reports to verify if their county is actually spending development money on roads, health, and water.',
      sw: 'Wananchi husoma ripoti za kila robo mwaka za COB ili kuona kama kaunti yao inatumia fedha zilizoidhinishwa kwa miradi ya maendeleo kama barabara, maji na afya au mishahara pekee.',
    },
    relatedOfficeIds: ['auditor_general', 'governor', 'senator'],
  },

  // 15. Commission on Administrative Justice (Ombudsman)
  {
    id: 'commission_administrative_justice',
    name: {
      en: 'Commission on Administrative Justice (Office of the Ombudsman)',
      sw: 'Tume ya Haki za Utawala (Ofisi ya Mlinzi wa Haki / Ombudsman)',
    },
    level: 'independent',
    branch: 'oversight',
    selectionMethod: 'constitutional_process',
    iconName: 'HelpCircle',
    badgeColor: 'bg-teal-700 text-white',
    keyStats: {
      totalNumber: 'Commissioners + Complaints Registry',
      establishedBy: 'Constitution of Kenya, Article 59(4) & CAJ Act',
    },
    summary: {
      en: 'The Ombudsman investigates complaints of maladministration, delays, abuse of power, discourtesy, and unfair treatment by public officials, and enforces the Access to Information Act.',
      sw: 'Ofisi ya Mlinzi wa Haki inachunguza malalamiko ya utendaji mbaya wa kazi, ucheleweshaji wa huduma, matumizi mabaya ya mamlaka, dharau na uonevu unaofanywa na maafisa wa umma, na inalinda Haki ya Kupata Taarifa za Kiserikali.',
    },
    responsibilities: {
      en: [
        'Investigates complaints of injustice, unlawful decisions, or mistreatment by national and county public servants.',
        'Investigates public offices that delay birth certificates, ID cards, pensions, or medical records unreasonably.',
        'Oversees and enforces the constitutional right to Access to Information under Article 35.',
        'Recommends disciplinary or corrective actions against errant public institutions.',
      ],
      sw: [
        'Kuchunguza malalamiko ya uonevu, maamuzi yasiyo ya haki au ucheleweshaji wa huduma za serikali.',
        'Kuwachunguza maafisa wa serikali wanaochelewesha kutoa vitambulisho, vyeti vya kuzaliwa au pensheni ya kustaafu bila sababu.',
        'Kusimamia na kutekeleza haki ya kikatiba ya mwananchi kupata taarifa za kiserikali (Kifungu cha 35).',
        'Kupendekeza hatua za kinidhamu dhidi ya taasisi za umma zinazonyanyasa wananchi.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT investigate matters currently pending before court of law.',
        'Does not resolve purely private commercial disputes between private citizens.',
      ],
      sw: [
        'HAICHUNGUZI kesi ambazo tayari ziko mahakamani.',
        'Haishughulikii migogoro ya kibiashara kati ya wananchi wawili binafsi.',
      ],
    },
    howSelected: {
      en: 'Competitively recruited, nominated by the President, and vetted by the National Assembly.',
      sw: 'Huchaguliwa kwa ushindani, kupendekezwa na Rais na kupigwa msasa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: [
        'Law degree or extensive experience in administrative law and human rights.',
        'High integrity under Chapter 6.',
      ],
      sw: [
        'Shahada ya sheria au uzoefu mkubwa katika sheria za utawala na haki za kibinadamu.',
        'Uadilifu wa hali ya juu chini ya Sura ya 6.',
      ],
    },
    termOfOffice: {
      en: 'Single non-renewable term of six years.',
      sw: 'Muhula mmoja wa miaka sita usioongezwa.',
    },
    oversightAndAccountability: {
      en: 'Submits annual reports to Parliament and the President.',
      sw: 'Hutoa ripoti ya kila mwaka kwa Bunge na Rais.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 59(4)', 'Commission on Administrative Justice Act 2011', 'Access to Information Act 2016'],
      sw: ['Katiba ya Kenya 2010: Kifungu 59(4)', 'Sheria ya Upatikanaji wa Taarifa ya 2016'],
    },
    citizenEngagement: {
      en: 'Any citizen who is denied service, ignored, or mistreated by a government office can file a free complaint via SMS, email, post, or walk-in.',
      sw: 'Mwananchi yeyote anayenyimwa huduma, kudhulumiwa, au kupuuzwa na ofisi yoyote ya serikali anaweza kuwasilisha malalamiko bure kupitia ujumbe wa simu (SMS), barua pepe au kufika ofisini kwao.',
    },
    relatedOfficeIds: ['eacc', 'knchr', 'public_service_commission'],
  },

  // 16. Kenya National Commission on Human Rights (KNCHR)
  {
    id: 'knchr',
    name: {
      en: 'Kenya National Commission on Human Rights (KNCHR)',
      sw: 'Tume ya Kitaifa ya Haki za Kibinadamu ya Kenya (KNCHR)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-emerald-800 text-white',
    keyStats: {
      totalNumber: 'Article 59 Constitutional Commission',
      establishedBy: 'Constitution of Kenya, Article 59',
    },
    summary: {
      en: 'KNCHR is the national human rights watchdog that promotes, protects, and monitors compliance with human rights and fundamental freedoms guaranteed in the Bill of Rights (Chapter 4).',
      sw: 'KNCHR ni mtetezi mkuu wa haki za kibinadamu nchini anayekuza, kulinda na kufuatilia utekelezaji wa haki zote za msingi zilizoainishwa katika Mswada wa Haki (Sura ya 4 ya Katiba).',
    },
    responsibilities: {
      en: [
        'Promotes respect for human rights and constitutional culture.',
        'Investigates complaints of human rights violations by security agencies, employers, or public bodies.',
        'Inspects prisons, police cells, and remand facilities to assess detention conditions.',
        'Advises government on compliance with international human rights treaties.',
      ],
      sw: [
        'Kukuza heshima ya haki za binadamu na utamaduni wa kikatiba.',
        'Kuchunguza malalamiko ya ukiukaji wa haki za kibinadamu unaofanywa na vyombo vya usalama au taasisi za serikali.',
        'Kukagua magereza na seli za polisi kutathmini hali ya mahabusu na wafungwa.',
        'Kuishauri serikali kuhusu utekelezaji wa mikataba ya kimataifa ya haki za kibinadamu.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT act as a criminal court to sentence human rights abusers directly.',
      ],
      sw: [
        'HAITOI hukumu ya kifungo gerezani kama mahakama ya jinai.',
      ],
    },
    howSelected: {
      en: 'Competitive selection, nominated by the President, vetted by Parliament.',
      sw: 'Usaili wa kiushindani, kupendekezwa na Rais na kupigwa msasa na Bunge.',
    },
    qualifications: {
      en: ['Demonstrated experience in human rights advocacy, constitutional law, and Chapter 6 compliance.'],
      sw: ['Uzoefu katika utetezi wa haki za binadamu, sheria ya katiba na uadilifu.'],
    },
    termOfOffice: {
      en: 'Single term of six years.',
      sw: 'Muhula mmoja wa miaka sita.',
    },
    oversightAndAccountability: {
      en: 'Independent commission reporting annually to Parliament and the President.',
      sw: 'Tume huru inayotoa ripoti kila mwaka kwa Bunge na Rais.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010: Article 59', 'KNCHR Act 2011'],
      sw: ['Katiba ya Kenya 2010: Kifungu 59', 'Sheria ya KNCHR ya 2011'],
    },
    citizenEngagement: {
      en: 'Citizens file reports of police brutality, unlawful arrests, eviction without due process, or discrimination based on gender or disability.',
      sw: 'Wananchi wanaripoti vitendo vya ukatili wa polisi, ukamataji holela, ubomoaji usiofuata sheria, au unyanyapaa wa kijinsia au walemavu.',
    },
    relatedOfficeIds: ['commission_administrative_justice', 'chief_justice'],
  },

  // 17. National Government Administration (County Commissioner & Chiefs)
  {
    id: 'national_administration',
    name: {
      en: 'National Government Administration (County Commissioner & Chiefs)',
      sw: 'Utawala wa Serikali ya Kitaifa (Kamishna wa Kaunti na Machifu)',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'UsersRound',
    badgeColor: 'bg-blue-900 text-white',
    keyStats: {
      totalNumber: 'County Commissioners, DCCs, ACCs, Chiefs, Assistant Chiefs',
      establishedBy: 'National Government Co-ordination Act 2012',
    },
    summary: {
      en: 'National Government Administrative Officers (NGAO) represent the President and the national executive at the grassroots level, coordinating national security, national policies, and national development projects in each county, sub-county, location, and sub-location.',
      sw: 'Maafisa wa Utawala wa Serikali ya Kitaifa (NGAO) wanawakilisha Rais na serikali kuu mashinani, wakiratibu usalama wa kitaifa, amani na sera za serikali kuu kuanzia ngazi ya kaunti hadi kijijini (sub-location).',
    },
    responsibilities: {
      en: [
        'Chairs County / Sub-County / Ward Security and Intelligence Committees.',
        'Coordinates peace-building, conflict resolution, and community security (Nyumba Kumi).',
        'Facilitates national government registration exercises (voter ID vetting, births, cash transfers for elderly).',
        'Coordinates disaster response (drought relief distribution, flood emergencies).',
        'Enforces presidential directives and national statutory laws.',
      ],
      sw: [
        'Kuongoza Kamati za Usalama na Ujasusi katika ngazi ya Kaunti, Tarafa na Kata.',
        'Kuratibu amani, usuluhishi wa migogoro na usalama wa jamii (Nyumba Kumi).',
        'Kusaidia utoaji wa huduma za kitaifa kama vitambulisho (vetting), vyeti vya kuzaliwa, na fedha za wazee (Inua Jamii).',
        'Kusimamia ugawaji wa misaada ya serikali kuu wakati wa ukame au mafuriko.',
        'Kusimamia utekelezaji wa sheria za nchi na maagizo ya Rais.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT direct or control the County Governor, County Ministers, or County Assembly (Counties are autonomous governments).',
        'Does not collect county market taxes or issue county trade licenses.',
        'Cannot try criminal cases in chief\'s offices (criminal trials belong strictly to courts).',
      ],
      sw: [
        'HATOI maagizo kwa Gavana wa Kaunti, Mawaziri wa Kaunti au Bunge la Kaunti (Serikali za kaunti zina mamlaka huru ya kiutawala).',
        'HAKUSANYI ushuru wa masoko ya kaunti wala kutoa leseni za biashara za kaunti.',
        'HAWEZI kuendesha kesi za jinai ofisini kwa chifu na kutoa faini (hukumu za jinai ni za mahakamani pekee).',
      ],
    },
    howSelected: {
      en: 'Appointed through the Public Service Commission (PSC) as career civil servants under the Ministry of Interior and National Administration.',
      sw: 'Huteuliwa na Tume ya Utumishi wa Umma (PSC) kama watumishi wa kudumu wa umma chini ya Wizara ya Mambo ya Ndani.',
    },
    qualifications: {
      en: ['Relevant university degree for Commissioners; administrative qualifications and community leadership standing for Chiefs.'],
      sw: ['Shahada ya chuo kikuu kwa Makamishna; uzoefu wa utawala na uongozi bora wa jamii kwa Machifu.'],
    },
    termOfOffice: {
      en: 'Permanent and pensionable civil service terms until statutory retirement age of 60.',
      sw: 'Watumishi wa kudumu na pensheni hadi umri wa kustaafu wa miaka 60.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the Cabinet Secretary for Interior, Public Service Commission, and Independent Policing Oversight Authority (IPOA) where police operations are coordinated.',
      sw: 'Huwajibika kwa Waziri wa Mambo ya Ndani, Tume ya PSC, na sheria za nchi.',
    },
    legalReferences: {
      en: ['National Government Co-ordination Act 2012', 'Public Service Commission Act'],
      sw: ['Sheria ya Uratibu wa Serikali ya Kitaifa ya 2012'],
    },
    citizenEngagement: {
      en: 'Citizens attend local Chief\'s barazas weekly to address community security, disputes, and receive official government notices.',
      sw: 'Wananchi huhudhuria mikutano ya baraza la chifu kila wiki kushughulikia usalama wa mtaa, kusuluhisha migogoro ya amani na kupata taarifa za serikali.',
    },
    relatedOfficeIds: ['president', 'governor', 'cabinet_secretary'],
    lastReviewedDate: '2026-08-15',
    contentVersion: '1.2.0',
  },

  // 18. Attorney-General
  {
    id: 'attorney_general',
    name: {
      en: 'Attorney-General of Kenya',
      sw: 'Mwanasheria Mkuu wa Serikali',
    },
    level: 'national',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'Scale',
    badgeColor: 'bg-indigo-700 text-white',
    keyStats: {
      totalNumber: '1 Principal Legal Adviser',
      establishedBy: 'Constitution of Kenya, Article 156',
    },
    summary: {
      en: 'The principal legal adviser to the National Government who represents national government in court in civil proceedings and promotes the rule of law.',
      sw: 'Mshauri mkuu wa kisheria wa Serikali ya Kitaifa anayeiwakilisha serikali mahakamani katika kesi za madai na kulinda utawala wa sheria.',
    },
    responsibilities: {
      en: [
        'Advises the President, Cabinet, and ministries on all legal matters.',
        'Drafts national government legislation, treaties, and international agreements.',
        'Represents the National Government in civil litigations and constitutional references.',
        'Champions and defends public interest and human rights in legal processes.',
      ],
      sw: [
        'Kushauri Rais, Baraza la Mawaziri na wizara zote kuhusu masuala ya sheria.',
        'Kuandaa miswada ya sheria za serikali, mikataba ya kimataifa na mapatano.',
        'Kuwakilisha Serikali Kuu katika kesi za madai na marejeleo ya kikatiba.',
        'Kutetea maslahi ya umma na haki za binadamu katika michakato ya sheria.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT prosecute criminal cases (criminal prosecutions belong exclusively to the Director of Public Prosecutions - ODPP under Art. 157).',
        'Does NOT make final judicial rulings (that is the role of judges).',
        'Does NOT act as private lawyer for politicians in personal lawsuits.',
      ],
      sw: [
        'HASHTAKI kesi za jinai (ushitaki wa jinai ni mamlaka ya kipekee ya Mkurugenzi wa Mashtaka ya Umma - ODPP chini ya Kifungu 157).',
        'HATOI maamuzi ya mwisho ya mahakama (hilo ni jukumu la majaji).',
        'HAFANYI kazi kama wakili wa kibinafsi wa wanasiasa katika kesi zao binafsi.',
      ],
    },
    howSelected: {
      en: 'Nominated by the President and appointed after mandatory vetting and approval by the National Assembly.',
      sw: 'Huteuliwa na Rais na kuingia ofisini baada ya kuhojiwa na kuidhinishwa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: ['Qualified for appointment as a judge of the Supreme Court (at least 15 years as superior court judge or distinguished legal practitioner).'],
      sw: ['Kuwa na sifa za kuteuliwa kama jaji wa Mahakama ya Upeo (uzoefu wa angalau miaka 15 kama jaji au wakili mbobezi).'],
    },
    termOfOffice: {
      en: 'Serves at the pleasure of the appointing authority, subject to constitutional standards.',
      sw: 'Huhudumu kwa mujibu wa mamlaka ya uteuzi na viwango vya kikatiba.',
    },
    oversightAndAccountability: {
      en: 'Oversight by the National Assembly Committee on Justice and Legal Affairs and bound by Article 73 Leadership and Integrity.',
      sw: 'Hukaguliwa na Kamati ya Haki na Masuala ya Kisheria ya Bunge la Kitaifa na kuongozwa na Kifungu cha 73 cha Uongozi na Uadilifu.',
    },
    removalProcess: {
      en: 'Can be removed by the President or through parliamentary censure and petition under constitutional leadership grounds.',
      sw: 'Anaweza kuondolewa na Rais au kupitia hoja ya bunge kulingana na misingi ya kikatiba.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 156', 'Office of the Attorney-General Act 2012'],
      sw: ['Katiba ya Kenya 2010, Kifungu 156', 'Sheria ya Ofisi ya Mwanasheria Mkuu 2012'],
    },
    citizenEngagement: {
      en: 'Citizens can petition the AG on public interest litigation, bill drafting concerns, or access to public legal notices.',
      sw: 'Wananchi wanaweza kuwasilisha maombi kwa Mwanasheria Mkuu kuhusu maslahi ya umma na miswada ya sheria.',
    },
    relatedOfficeIds: ['president', 'cabinet_secretary', 'chief_justice'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 19. National Assembly
  {
    id: 'national_assembly',
    name: {
      en: 'National Assembly of Kenya',
      sw: 'Bunge la Kitaifa la Kenya',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Landmark',
    badgeColor: 'bg-emerald-800 text-white',
    keyStats: {
      totalNumber: '349 Members (290 Constituency, 47 County Women Reps, 12 Nominated, Speaker)',
      establishedBy: 'Constitution of Kenya, Article 95',
    },
    summary: {
      en: 'The lower house of Kenya\'s bicameral Parliament, representing the people of constituencies and special interests, appropriating national revenue, and exercising oversight over national state organs.',
      sw: 'Bunge la chini la Kenya linalowakilisha wananchi wa maeneobunge na maslahi maalum, kugawa mapato ya taifa, na kusimamia vyombo vyote vya Serikali Kuu.',
    },
    responsibilities: {
      en: [
        'Enacts national legislation on all matters.',
        'Determines allocation of national revenue between national and county governments (Division of Revenue Act).',
        'Appropriates funds for expenditure by the national government and state organs.',
        'Exercises oversight over national revenue, public debt, and state expenditure.',
        'Reviews conduct in office of the President, Deputy President, and state officers and initiates impeachment where warranted.',
        'Approves declarations of war and state of emergency.',
      ],
      sw: [
        'Kutunga sheria za kitaifa kuhusu masuala yote.',
        'Kuamua mgao wa mapato ya kitaifa kati ya serikali ya kitaifa na kaunti.',
        'Kutenga fedha kwa ajili ya matumizi ya serikali ya kitaifa.',
        'Kusimamia matumizi ya fedha za umma, madeni ya nchi na matumizi ya serikali.',
        'Kukagua utendaji wa Rais, Naibu Rais na maafisa wakuu wa serikali.',
        'Kuidhinisha matangazo ya vita na hali ya hatari.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT govern counties or pass county assembly by-laws.',
        'Does NOT implement development projects directly (project execution is strictly an executive function).',
        'Does NOT resolve election disputes (that is the constitutional duty of the courts).',
      ],
      sw: [
        'HAITUNGI sheria ndogo za serikali za kaunti (hilo ni jukumu la Bunge la Kaunti).',
        'HAITEKELEZI miradi ya maendeleo moja kwa moja (utekelezaji ni jukumu la serikali mtendaji).',
        'HAIAMUI migogoro ya uchaguzi (hilo ni jukumu la mahakama).',
      ],
    },
    howSelected: {
      en: '290 elected from constituencies, 47 elected women from counties, 12 nominated by political parties to represent youth, persons with disabilities, and workers, plus the Speaker.',
      sw: 'Wabunge 290 wanachaguliwa kutoka maeneobunge, wanawake 47 kutoka kaunti, 12 wateule wa vyama vya kisiasa, na Spika wa Bunge.',
    },
    qualifications: {
      en: ['Registered voter, satisfies moral/integrity requirements under Chapter 6, meets minimum educational thresholds.'],
      sw: ['Mpiga kura aliyesajiliwa, anayetimiza masharti ya uadilifu ya Sura ya Sita ya Katiba.'],
    },
    termOfOffice: {
      en: 'Five-year constitutional term following general elections.',
      sw: 'Muhula wa kikatiba wa miaka mitano baada ya uchaguzi mkuu.',
    },
    oversightAndAccountability: {
      en: 'Accountable to citizens via regular elections, Auditor-General reports, and Parliamentary Powers and Privileges Act.',
      sw: 'Huwajibika kwa wananchi kupitia uchaguzi mkuu, ripoti za Mkaguzi Mkuu wa Hesabu, na Kamati za Bunge.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 93–95', 'National Assembly Standing Orders'],
      sw: ['Katiba ya Kenya 2010, Kifungu 93–95'],
    },
    citizenEngagement: {
      en: 'Citizens participate in public hearings, submit petitions to the Clerk under Article 119, and attend committee inquiries.',
      sw: 'Wananchi hushiriki katika mikutano ya maoni ya umma, kuwasilisha maombi (petitions) kwa Karani wa Bunge chini ya Kifungu 119.',
    },
    relatedOfficeIds: ['member_of_parliament', 'woman_representative', 'speaker_national_assembly', 'senate'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 20. Senate
  {
    id: 'senate',
    name: {
      en: 'Senate of Kenya',
      sw: 'Bunge la Seneti la Kenya',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Shield',
    badgeColor: 'bg-teal-800 text-white',
    keyStats: {
      totalNumber: '67 Senators (47 Elected, 16 Nominated Women, 2 Youth, 2 PWDs, Speaker)',
      establishedBy: 'Constitution of Kenya, Article 96',
    },
    summary: {
      en: 'The upper house of Parliament that represents the 47 counties, protects county interests and county governments, and determines county revenue allocation.',
      sw: 'Bunge la juu la Kenya linalowakilisha kaunti 47, kulinda maslahi ya serikali za kaunti, na kuamua mgao wa fedha za kaunti.',
    },
    responsibilities: {
      en: [
        'Protects the devolution system and the interests of county governments.',
        'Considers, debates, and approves bills concerning county governments.',
        'Determines allocation of national revenue among counties (County Allocation of Revenue Act - CARA).',
        'Exercises oversight over national revenue allocated to county governments.',
        'Hears and determines impeachment charges against the President, Deputy President, and County Governors.',
      ],
      sw: [
        'Kulinda mfumo wa ugatuzi na maslahi ya serikali za kaunti.',
        'Kujadili na kupitisha miswada yote ya sheria inayohusu kaunti.',
        'Kuamua ugawaji wa mapato ya kitaifa miongoni mwa kaunti zote 47.',
        'Kusimamia matumizi ya fedha za kitaifa zilizotengwa kwa serikali za kaunti.',
        'Kusikiliza na kuamua mashtaka ya kumwondoa mamlakani (impeachment) Rais, Naibu Rais na Magavana wa Kaunti.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT manage county funds or direct county tenders.',
        'Does NOT approve money bills concerning national government expenditure (that is the National Assembly).',
        'Does NOT issue contracts or execute road building.',
      ],
      sw: [
        'HASIMAMII fedha za kaunti wala kutoa zabuni (tenders).',
        'HAIPITISHI miswada ya fedha za matumizi ya Serikali Kuu (hilo ni la Bunge la Kitaifa).',
        'HATOI kandarasi za barabara au miradi.',
      ],
    },
    howSelected: {
      en: '47 senators elected directly by registered voters in each county, 16 women nominated by political parties, 2 youth representatives, 2 persons with disabilities representatives, plus the Speaker.',
      sw: 'Maseneta 47 huchaguliwa moja kwa moja na wapiga kura wa kila kaunti, wanawake 16 kuteuliwa na vyama, vijana 2, wawakilishi 2 wa watu wenye ulemavu, na Spika.',
    },
    qualifications: {
      en: ['Registered Kenyan voter, high moral character under Chapter 6, verified educational qualifications.'],
      sw: ['Mpiga kura aliyesajiliwa, uadilifu wa hali ya juu chini ya Sura ya Sita ya Katiba.'],
    },
    termOfOffice: {
      en: 'Five-year constitutional term following general elections.',
      sw: 'Muhula wa miaka mitano baada ya uchaguzi mkuu.',
    },
    oversightAndAccountability: {
      en: 'Senate County Public Accounts Committee (CPAC) summons Governors and county executives on Auditor-General queries.',
      sw: 'Kamati ya Hesabu za Umma za Kaunti ya Seneti (CPAC) huita Magavana kujibu ripoti za Mkaguzi Mkuu wa Hesabu.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 96', 'Senate Standing Orders', 'County Allocation of Revenue Act'],
      sw: ['Katiba ya Kenya 2010, Kifungu 96'],
    },
    citizenEngagement: {
      en: 'Citizens can petition the Senate on county boundary disputes, devolution mismanagement, or county budget injustices.',
      sw: 'Wananchi wanaweza kuwasilisha maombi kwa Seneti kuhusu usimamizi mbovu wa ugatuzi na migogoro ya mipaka ya kaunti.',
    },
    relatedOfficeIds: ['senator', 'governor', 'national_assembly', 'speaker_senate'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 21. Speaker of National Assembly
  {
    id: 'speaker_national_assembly',
    name: {
      en: 'Speaker of the National Assembly',
      sw: 'Spika wa Bunge la Kitaifa',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Award',
    badgeColor: 'bg-amber-800 text-white',
    keyStats: {
      totalNumber: '1 Presiding Officer (3rd in Presidential Succession)',
      establishedBy: 'Constitution of Kenya, Article 106 & 146',
    },
    summary: {
      en: 'The presiding officer of the National Assembly who maintains parliamentary order, interprets standing orders, and acts as President if both President and Deputy President offices become vacant.',
      sw: 'Mkuu wa Bunge la Kitaifa anayeongoza mijadala ya bunge, kusimamia kanuni za bunge, na anayechukua nafasi ya Rais ikitokea nafasi za Rais na Naibu Rais ziko wazi kwa pamoja.',
    },
    responsibilities: {
      en: [
        'Presides over all sittings of the National Assembly with strict impartiality.',
        'Interprets Standing Orders, rules, and parliamentary procedures.',
        'Chairs the Parliamentary Service Commission (PSC).',
        'Assumes the office of President temporarily under Article 146(2)(b) pending an election within 60 days if both President and DP vacate office.',
      ],
      sw: [
        'Kuongoza vikao vyote vya Bunge la Kitaifa kwa usawa bila upendeleo.',
        'Kufafanua Kanuni za Bunge na taratibu zote za kisheria.',
        'Kuwa Mwenyekiti wa Tume ya Huduma za Bunge (PSC).',
        'Kukaimu nafasi ya Rais kwa muda chini ya Kifungu 146(2)(b) ikiwa Rais na Naibu Rais wataondoka ofisini pamoja.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT cast a deliberative vote on motions or bills in the house.',
        'Does NOT participate in partisan political campaign rallies while serving.',
        'Does NOT control constituency funds directly.',
      ],
      sw: [
        'HAPIGI kura ya kawaida katika miswada au hoja za bunge.',
        'HASHIRIKI katika mikutano ya kisiasa ya vyama wakati akihudumu.',
        'HASIMAMII fedha za maeneobunge moja kwa moja.',
      ],
    },
    howSelected: {
      en: 'Elected by Members of the National Assembly from among persons qualified to be MPs, but who are NOT sitting MPs.',
      sw: 'Huchaguliwa na Wabunge kutoka miongoni mwa watu wenye sifa za kuwa wabunge lakini ambao si wabunge waliopo.',
    },
    qualifications: {
      en: ['Qualified to be elected as a Member of Parliament; high standing in constitutional law and governance.'],
      sw: ['Mtu mwenye sifa za kuchaguliwa mbunge; uelewa wa hali ya juu wa sheria za katiba.'],
    },
    termOfOffice: {
      en: 'Five-year parliamentary term; vacates office when a new House meets after a general election.',
      sw: 'Muhula wa miaka mitano; huondoka wakati Bunge jipya linapokutana.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the House and subject to removal by a resolution supported by at least two-thirds of all members.',
      sw: 'Huwajibika kwa Bunge na anaweza kuondolewa kwa azimio la theluthi mbili ya wabunge wote.',
    },
    removalProcess: {
      en: 'Removed by a resolution supported by at least two-thirds of all members of the National Assembly under Article 106(2)(c).',
      sw: 'Huondolewa na azimio la kuungwa mkono na angalau theluthi mbili (2/3) ya wabunge wote chini ya Kifungu 106(2)(c).',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 106, 107, 146', 'Parliamentary Powers and Privileges Act'],
      sw: ['Katiba ya Kenya 2010, Kifungu 106, 146'],
    },
    citizenEngagement: {
      en: 'Citizens can address formal petitions through the Speaker\'s office to table public matters before Parliament.',
      sw: 'Wananchi wanaweza kuwasilisha maombi rasmi kupitia ofisi ya Spika ili yawasilishwe bungeni.',
    },
    relatedOfficeIds: ['national_assembly', 'member_of_parliament', 'speaker_senate'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 22. Speaker of the Senate
  {
    id: 'speaker_senate',
    name: {
      en: 'Speaker of the Senate',
      sw: 'Spika wa Bunge la Seneti',
    },
    level: 'national',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Award',
    badgeColor: 'bg-teal-900 text-white',
    keyStats: {
      totalNumber: '1 Presiding Officer of the Upper House',
      establishedBy: 'Constitution of Kenya, Article 106',
    },
    summary: {
      en: 'The presiding officer of the Senate who steers debates on devolution, co-chairs joint parliamentary sittings, and ensures lawful oversight of county finances.',
      sw: 'Mkuu wa Seneti anayeongoza mijadala kuhusu ugatuzi, kusaidia kuongoza vikao vya pamoja vya bunge, na kuhakikisha usimamizi sahihi wa fedha za kaunti.',
    },
    responsibilities: {
      en: [
        'Presides over all sittings of the Senate with impartial constitutional authority.',
        'Determines, jointly with the Speaker of the National Assembly, whether a bill concerns county governments under Article 110(3).',
        'Presides over trial sittings during impeachment hearings of County Governors and Deputy President.',
        'Serves on the Parliamentary Service Commission.',
      ],
      sw: [
        'Kuongoza vikao vyote vya Seneti bila kuegemea upande wowote.',
        'Kuamua, kwa kushirikiana na Spika wa Bunge la Kitaifa, ikiwa mswada unahusu kaunti chini ya Kifungu 110(3).',
        'Kuongoza vikao vya kesi za kumwondoa mamlakani (impeachment) Gavana wa Kaunti au Naibu Rais.',
        'Kuhudumu katika Tume ya Huduma za Bunge (PSC).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT cast a vote on ordinary Senate motions.',
        'Does NOT run individual county administration or allocate county projects.',
        'Cannot dissolve county assemblies.',
      ],
      sw: [
        'HAPIGI kura ya kawaida katika hoja za Seneti.',
        'HASIMAMII utawala wa kaunti yoyote au kugawa miradi.',
        'HAWEZI kuvunja mabunge ya kaunti.',
      ],
    },
    howSelected: {
      en: 'Elected by Senators from among persons qualified to be senators, but who are not members of parliament.',
      sw: 'Huchaguliwa na Maseneta kutoka miongoni mwa watu wenye sifa za kuwa seneta lakini ambao si wabunge.',
    },
    qualifications: {
      en: ['Qualified for election as Senator; exceptional reputation and grasp of governance and devolution.'],
      sw: ['Sifa za kuchaguliwa kuwa seneta; heshima na uelewa mpana wa ugatuzi na sheria.'],
    },
    termOfOffice: {
      en: 'Five-year parliamentary term.',
      sw: 'Muhula wa miaka mitano.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the Senate; subject to removal by a resolution supported by at least two-thirds of all senators.',
      sw: 'Huwajibika kwa Seneti; huondolewa kwa azimio la theluthi mbili ya maseneta wote.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 106, 110', 'Senate Standing Orders'],
      sw: ['Katiba ya Kenya 2010, Kifungu 106, 110'],
    },
    citizenEngagement: {
      en: 'Citizens may submit petitions on county disputes and county revenue questions directly to the Speaker of the Senate.',
      sw: 'Wananchi wanaweza kuwasilisha maombi rasmi kuhusu changamoto za ugatuzi kwa Spika wa Seneti.',
    },
    relatedOfficeIds: ['senate', 'senator', 'speaker_national_assembly'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 23. Supreme Court of Kenya
  {
    id: 'supreme_court',
    name: {
      en: 'Supreme Court of Kenya',
      sw: 'Mahakama ya Upeo ya Kenya',
    },
    level: 'national',
    branch: 'judiciary',
    selectionMethod: 'constitutional_process',
    iconName: 'Scale',
    badgeColor: 'bg-red-900 text-white',
    keyStats: {
      totalNumber: '7 Judges (Chief Justice, Deputy Chief Justice, 5 Supreme Court Judges)',
      establishedBy: 'Constitution of Kenya, Article 163',
    },
    summary: {
      en: 'The highest apex court in Kenya with exclusive original jurisdiction to hear presidential election petitions and authoritative final appellate jurisdiction on constitutional interpretation.',
      sw: 'Mahakama kuu ya juu kabisa nchini Kenya yenye mamlaka ya pekee ya kusikiliza kesi za uchaguzi wa Rais na maamuzi ya mwisho kuhusu tafsiri ya Katiba.',
    },
    responsibilities: {
      en: [
        'Hears and determines presidential election dispute petitions within 14 days under Article 140.',
        'Hears appeals from the Court of Appeal on matters involving the interpretation or application of the Constitution.',
        'Gives advisory opinions upon request by National Government, state organs, or any County Government under Article 163(6).',
        'All other courts in Kenya are strictly bound by the legal decisions of the Supreme Court.',
      ],
      sw: [
        'Kusikiliza na kutoa uamuzi wa migogoro ya uchaguzi wa Rais ndani ya siku 14 chini ya Kifungu 140.',
        'Kusikiliza rufaa kutoka Mahakama ya Rufaa kuhusu masuala ya tafsiri ya Katiba.',
        'Kutoa ushauri wa kisheria (advisory opinion) kwa Serikali Kuu au Serikali ya Kaunti chini ya Kifungu 163(6).',
        'Mahakama zote nchini Kenya zinalazimika kisheria kufuata maamuzi ya Mahakama ya Upeo.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT conduct criminal trials directly or accept minor civil claims.',
        'Does NOT hear parliamentary or gubernatorial election petitions at the first instance.',
        'Does NOT enact laws (interpretation only).',
      ],
      sw: [
        'HAIENDESHI kesi za kawaida za jinai au madai madogo madogo.',
        'HAISIKILIZI kesi za uchaguzi wa wabunge au magavana katika hatua ya kwanza.',
        'HAITUNGI sheria (hufasiri tu sheria zilizotungwa).',
      ],
    },
    howSelected: {
      en: 'Recruited transparently through competitive public interviews by the Judicial Service Commission (JSC), then formally appointed by the President (with parliamentary approval for CJ and DCJ).',
      sw: 'Huchujwa kwa mahojiano ya wazi na Tume ya JSC, kisha kuteuliwa na Rais (baada ya idhini ya bunge kwa Jaji Mkuu na Naibu Jaji Mkuu).',
    },
    qualifications: {
      en: ['At least 15 years\' experience as superior court judge, distinguished academic, or legal practitioner of unblemished integrity.'],
      sw: ['Uzoefu usiopungua miaka 15 kama jaji wa mahakama ya juu au wakili mwenye uadilifu uliotukuka.'],
    },
    termOfOffice: {
      en: 'Serves until statutory retirement age of 70 years (CJ holds leadership office for a maximum of 10 years).',
      sw: 'Huhudumu hadi umri wa kustaafu kisheria wa miaka 70 (Jaji Mkuu anashikilia uongozi kwa kiwango cha juu cha miaka 10).',
    },
    oversightAndAccountability: {
      en: 'Subject to JSC disciplinary code and removal only via a constitutional tribunal appointed by the President upon JSC petition under Article 168.',
      sw: 'Huwajibika kwa mwongozo wa JSC na huondolewa tu kupitia jopo la kijaji chini ya Kifungu 168.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 163', 'Supreme Court Act 2011'],
      sw: ['Katiba ya Kenya 2010, Kifungu 163', 'Sheria ya Mahakama ya Upeo 2011'],
    },
    citizenEngagement: {
      en: 'Citizens and public interest organisations can file amicus curiae (friend of the court) briefs or petition for advisory opinions on devolution and human rights.',
      sw: 'Wananchi na mashirika ya kijamii yanaweza kuwasilisha maoni kama rafiki wa mahakama (amicus curiae) au maoni ya ushauri.',
    },
    relatedOfficeIds: ['chief_justice', 'court_of_appeal', 'high_court', 'judicial_service_commission'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 24. Court of Appeal of Kenya
  {
    id: 'court_of_appeal',
    name: {
      en: 'Court of Appeal of Kenya',
      sw: 'Mahakama ya Rufaa ya Kenya',
    },
    level: 'national',
    branch: 'judiciary',
    selectionMethod: 'constitutional_process',
    iconName: 'Scale',
    badgeColor: 'bg-purple-900 text-white',
    keyStats: {
      totalNumber: 'President of Court of Appeal & Appellate Judges',
      establishedBy: 'Constitution of Kenya, Article 164',
    },
    summary: {
      en: 'The intermediate appellate court that hears appeals from the High Court, Employment and Labour Relations Court, and Environment and Land Court.',
      sw: 'Mahakama ya rufaa inayoshughulikia rufaa kutoka Mahakama Kuu, Mahakama ya Ajira na Kazi, na Mahakama ya Mazingira na Ardhi.',
    },
    responsibilities: {
      en: [
        'Hears and determines appeals arising from judgments and rulings of the High Court.',
        'Hears appeals from specialized courts of equal status (Environment and Land Court; Employment and Labour Relations Court).',
        'Reviews disputed legal interpretations and facts established in lower superior courts.',
        'Sits in benches of uneven numbers (normally 3 or 5 appellate judges).',
      ],
      sw: [
        'Kusikiliza na kutoa uamuzi kuhusu rufaa zote kutoka Mahakama Kuu.',
        'Kusikiliza rufaa kutoka Mahakama ya Mazingira na Ardhi na Mahakama ya Ajira.',
        'Kukagua sheria na ukweli wa kesi zilizosikilizwa katika mahakama za chini.',
        'Kukaa katika jopo la idadi isiyo ya namba shufwa (kawaida majaji 3 au 5).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT hear original cases from the general public (must have been tried in a lower court first).',
        'Does NOT take fresh witness testimony except in rare exceptional circumstances with court permission.',
        'Does NOT determine presidential election petitions.',
      ],
      sw: [
        'HAISIKILIZI kesi mpya za wananchi moja kwa moja (lazima zianzie katika mahakama ya chini kwanza).',
        'HAIITI mashahidi wapya kutoa ushahidi isipokuwa kwa vibali maalum vya kipekee.',
        'HAISIKILIZI kesi za uchaguzi wa Rais.',
      ],
    },
    howSelected: {
      en: 'Interviewed competitively by the JSC and appointed by the President.',
      sw: 'Hufanyiwa mahojiano na Tume ya JSC na kuteuliwa na Rais.',
    },
    qualifications: {
      en: ['At least 10 years\' experience as superior court judge or distinguished legal practitioner.'],
      sw: ['Uzoefu usiopungua miaka 10 kama jaji wa mahakama ya juu au wakili.'],
    },
    termOfOffice: {
      en: 'Serves until statutory retirement age of 70 years.',
      sw: 'Huhudumu hadi umri wa kustaafu wa miaka 70.',
    },
    oversightAndAccountability: {
      en: 'Regulated by Judicial Service Commission; decisions reviewable only by Supreme Court on constitutional grounds.',
      sw: 'Husimamiwa na Tume ya JSC; maamuzi yake yanaweza kukatiwa rufaa kwenye Mahakama ya Upeo tu.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 164', 'Court of Appeal (Organisation and Administration) Act 2015'],
      sw: ['Katiba ya Kenya 2010, Kifungu 164'],
    },
    citizenEngagement: {
      en: 'Citizens who are dissatisfied with High Court decisions can appeal through accredited advocates within 14 to 30 days.',
      sw: 'Wananchi ambao hawajaridhishwa na uamuzi wa Mahakama Kuu wanaweza kukata rufaa ndani ya siku 14 hadi 30.',
    },
    relatedOfficeIds: ['supreme_court', 'high_court', 'chief_justice', 'judicial_service_commission'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 25. High Court of Kenya
  {
    id: 'high_court',
    name: {
      en: 'High Court of Kenya',
      sw: 'Mahakama Kuu ya Kenya',
    },
    level: 'national',
    branch: 'judiciary',
    selectionMethod: 'constitutional_process',
    iconName: 'Scale',
    badgeColor: 'bg-red-800 text-white',
    keyStats: {
      totalNumber: 'Stations in all 47 counties headed by Principal Judge',
      establishedBy: 'Constitution of Kenya, Article 165',
    },
    summary: {
      en: 'The premier court of unlimited original jurisdiction in civil and criminal matters, with express authority to enforce the Bill of Rights and determine constitutional validity of laws.',
      sw: 'Mahakama yenye mamlaka yasiyo na kikomo ya kusikiliza kesi za madai na jinai, na yenye mamlaka ya kutetea Haki za Kibinadamu (Bill of Rights) na kutathmini uhalali wa sheria.',
    },
    responsibilities: {
      en: [
        'Unlimited original jurisdiction in civil and criminal matters.',
        'Hears questions on whether a right or fundamental freedom in the Bill of Rights has been denied, violated, or threatened.',
        'Supervises subordinate courts (Magistrate Courts, Kadhis Courts, Courts Martial) and tribunals.',
        'Determines whether any law passed by Parliament or County Assembly is unconstitutional.',
        'Hears parliamentary and gubernatorial election dispute petitions.',
      ],
      sw: [
        'Mamlaka yasiyo na kikomo ya kusikiliza kesi zote za madai na jinai.',
        'Kusikiliza malalamiko ikiwa haki au uhuru wa msingi katika Katiba umekiukwa au kutishiwa.',
        'Kusimamia mahakama za chini (Mahakama za Mahakimu, Mahakama za Makadhi) na mabaraza ya usuluhishi.',
        'Kuamua ikiwa sheria yoyote iliyotungwa na Bunge au Bunge la Kaunti inakiuka Katiba.',
        'Kusikiliza kesi za uchaguzi wa wabunge na magavana.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT hear presidential election disputes (strictly Supreme Court under Art. 140).',
        'Does NOT adjudicate land title disputes (assigned to the specialized Environment and Land Court).',
        'Does NOT rule on employer-employee union contracts (assigned to Employment and Labour Relations Court).',
      ],
      sw: [
        'HAISIKILIZI kesi za uchaguzi wa Rais (ni kazi ya Mahakama ya Upeo chini ya Kifungu 140).',
        'HAISIKILIZI migogoro ya ardhi na mazingira (ni ya Mahakama ya Mazingira na Ardhi).',
        'HAISIKILIZI migogoro ya kazi na miungano ya wafanyakazi (ni ya Mahakama ya Ajira na Kazi).',
      ],
    },
    howSelected: {
      en: 'Competitive public recruitment by Judicial Service Commission (JSC), formal recommendation and appointment by the President.',
      sw: 'Huchujwa kwa ushindani wa wazi na Tume ya JSC, na kuteuliwa rasmi na Rais.',
    },
    qualifications: {
      en: ['At least 10 years\' experience as superior court judge, magistrate, or distinguished advocate of the High Court.'],
      sw: ['Uzoefu usiopungua miaka 10 kama hakimu au wakili wa Mahakama Kuu mwenye sifa nzuri.'],
    },
    termOfOffice: {
      en: 'Permanent until retirement age of 70 years.',
      sw: 'Hudumu kwa kudumu hadi umri wa miaka 70.',
    },
    oversightAndAccountability: {
      en: 'Accountable to Judicial Service Commission and subject to tribunal removal under Article 168 for misconduct or incapacity.',
      sw: 'Huwajibika kwa Tume ya JSC na kuondolewa kwa jopo maalum chini ya Kifungu 168.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 165', 'High Court (Organisation and Administration) Act 2015'],
      sw: ['Katiba ya Kenya 2010, Kifungu 165'],
    },
    citizenEngagement: {
      en: 'Any citizen can file a constitutional petition under Article 22 for rights violations without paying excessive court fees.',
      sw: 'Mwananchi yeyote anaweza kufungua kesi ya kikatiba chini ya Kifungu 22 kutetea haki zake bila vikwazo vya ada kubwa.',
    },
    relatedOfficeIds: ['chief_justice', 'supreme_court', 'court_of_appeal', 'judicial_service_commission'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 26. Judicial Service Commission (JSC)
  {
    id: 'judicial_service_commission',
    name: {
      en: 'Judicial Service Commission (JSC)',
      sw: 'Tume ya Huduma za Mahakama (JSC)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'Shield',
    badgeColor: 'bg-stone-800 text-white',
    keyStats: {
      totalNumber: '11 Commissioners Chaired by the Chief Justice',
      establishedBy: 'Constitution of Kenya, Article 171',
    },
    summary: {
      en: 'The independent constitutional commission responsible for recruiting judges, disciplining judicial staff, and safeguarding the independence of the Judiciary.',
      sw: 'Tume huru ya kikatiba inayohusika na kuajiri majaji, kuadhibu wafanyakazi wa mahakama, na kulinda uhuru wa Idara ya Mahakama.',
    },
    responsibilities: {
      en: [
        'Recommends persons for appointment as judges to the President.',
        'Reviews and makes recommendations on conditions of service for judicial officers.',
        'Receives, investigates, and acts upon complaints against judges and magistrates.',
        'Prepares and implements programmes for the continuing education and training of judges and magistrates.',
        'Promotes and facilitates judicial independence, transparency, and accountability.',
      ],
      sw: [
        'Kupendekeza majina ya watu wa kuteuliwa kama majaji kwa Rais.',
        'Kukagua na kupendekeza mishahara na masilahi ya maafisa wa mahakama.',
        'Kupokea, kuchunguza na kushughulikia malalamiko dhidi ya majaji na mahakimu.',
        'Kuandaa mafunzo endelevu kwa majaji na mahakimu.',
        'Kukuza na kulinda uhuru na uwajibikaji wa idara ya mahakama.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT decide court cases or interfere with judges\' judicial decisions.',
        'Cannot convict or jail judges (disciplinary and removal recommendation only).',
        'Does NOT represent the executive branch.',
      ],
      sw: [
        'HAIAMUI kesi mahakamani wala kuingilia maamuzi ya majaji.',
        'HAINA mamlaka ya kufunga majaji jela (inapendekeza kuondolewa tu).',
        'HAIWAKILISHI serikali mtendaji.',
      ],
    },
    howSelected: {
      en: 'Composition: Chief Justice (Chair), 1 Supreme Court Judge elected by peers, 1 Court of Appeal Judge, 1 High Court Judge, 1 Magistrate, Attorney-General, 2 Advocates elected by LSK, 1 nominee from PSC, 2 lay members appointed by the President with National Assembly approval.',
      sw: 'Wajumbe: Jaji Mkuu (Mwenyekiti), jaji wa Mahakama ya Upeo, jaji wa Mahakama ya Rufaa, jaji wa Mahakama Kuu, hakimu 1, Mwanasheria Mkuu, mawakili 2 waliochaguliwa na LSK, mjumbe wa PSC, na raia 2 walioteuliwa na Rais kwa idhini ya Bunge.',
    },
    qualifications: {
      en: ['Elected peers from the bench, bar, and respected public members of unassailable character.'],
      sw: ['Wataalamu waliochaguliwa kutoka mahakama, mawakili, na raia wenye maadili mema.'],
    },
    termOfOffice: {
      en: 'Elected members serve a 5-year term, renewable once.',
      sw: 'Wajumbe waliochaguliwa huhudumu kwa muhula wa miaka 5, unaoweza kuhuishwa mara moja.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the public and reports annually to the President and Parliament on judiciary status.',
      sw: 'Huwajibika kwa umma na kutoa ripoti ya kila mwaka kwa Rais na Bunge kuhusu hali ya idara ya mahakama.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 171–173', 'Judicial Service Act 2011'],
      sw: ['Katiba ya Kenya 2010, Kifungu 171–173', 'Sheria ya Tume ya Huduma za Mahakama 2011'],
    },
    citizenEngagement: {
      en: 'Citizens can file petitions directly with the JSC Secretary to report judicial corruption, bias, or unexplained trial delays.',
      sw: 'Wananchi wanaweza kuwasilisha malalamiko moja kwa moja kwa Katibu wa JSC kuripoti ufisadi au ucheleweshaji wa kesi mahakamani.',
    },
    relatedOfficeIds: ['chief_justice', 'supreme_court', 'court_of_appeal', 'high_court'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 27. Deputy Governor
  {
    id: 'deputy_governor',
    name: {
      en: 'Deputy Governor',
      sw: 'Naibu Gavana wa Kaunti',
    },
    level: 'county',
    branch: 'executive',
    selectionMethod: 'elected',
    iconName: 'Building2',
    badgeColor: 'bg-emerald-700 text-white',
    keyStats: {
      totalNumber: '47 Deputy Governors (1 per County)',
      establishedBy: 'Constitution of Kenya, Article 179(3) & 180(5)',
    },
    summary: {
      en: 'The principal assistant to the County Governor who deputises the Governor in executive functions and automatically assumes the office of Governor for the remainder of the term if the Governor vacates office.',
      sw: 'Msaidizi mkuu wa Gavana wa Kaunti anayemsaidia katika majukumu yote ya utendaji na anayechukua rasmi wadhifa wa Gavana kwa muda uliobaki ikitokea Gavana ameondoka ofisini.',
    },
    responsibilities: {
      en: [
        'Deputises for the Governor in the execution of county executive functions.',
        'Performs any executive functions assigned by the Governor, including heading specific county departments (CECM role).',
        'Assumes the office of Governor for the remainder of the term under Article 182(2) if the Governor dies, resigns, or is removed by impeachment.',
        'Serves as a member of the County Executive Committee.',
      ],
      sw: [
        'Kukaimu majukumu ya Gavana katika kusimamia shughuli zote za serikali ya kaunti.',
        'Kutekeleza majukumu yote aliyopewa na Gavana, ikiwemo kusimamia idara maalum ya kaunti.',
        'Kuchukua rasmi wadhifa wa Gavana kwa muda uliobaki chini ya Kifungu 182(2) iwapo Gavana atafariki, kujiuzulu au kubanduliwa madarakani.',
        'Kuwa mwanachama wa Baraza la Mawaziri la Kaunti.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Cannot hire or dismiss County Executive Committee Members without assuming full gubernatorial powers.',
        'Does NOT make county assembly laws.',
        'Cannot veto resolutions passed by the County Executive Committee.',
      ],
      sw: [
        'HAWEZI kuajiri au kufuta kazi Mawaziri wa Kaunti (CECM) bila kuwa Gavana kamili kwanza.',
        'HAITUNGI sheria za bunge la kaunti.',
        'HAWEZI kupinga maamuzi ya Baraza la Mawaziri la Kaunti kiholela.',
      ],
    },
    howSelected: {
      en: 'Nominated as running mate by the gubernatorial candidate; elected jointly on a single ticket during general elections.',
      sw: 'Huteuliwa kama mgombea mwenza na mgombea wa ugavana; huchaguliwa pamoja kwenye tikiti moja katika uchaguzi mkuu.',
    },
    qualifications: {
      en: ['Must meet the same constitutional qualifications as a County Governor (university degree, registered voter, Chapter 6 compliance).'],
      sw: ['Lazima atimize sifa sawa na Gavana wa Kaunti (shahada ya chuo kikuu, mpiga kura, na maadili ya Sura ya Sita).'],
    },
    termOfOffice: {
      en: 'Five-year term linked to the Governor\'s term; can serve subsequent terms or seek election as Governor.',
      sw: 'Muhula wa miaka mitano sambamba na wa Gavana; anaweza kuwania kuwa Gavana baadaye.',
    },
    oversightAndAccountability: {
      en: 'Accountable to County Assembly, Senate, and courts under Chapter Six of the Constitution.',
      sw: 'Huwajibika kwa Bunge la Kaunti, Seneti, na sheria za maadili za Sura ya Sita.',
    },
    removalProcess: {
      en: 'Can be removed on the same constitutional grounds and process as a Governor under Article 181 (gross violation of Constitution, crime, physical/mental incapacity).',
      sw: 'Huondolewa kwa mchakato sawa na wa Gavana chini ya Kifungu 181 (kukiuka Katiba, uhalifu, au kutojiweza kiafya).',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 179, 180, 182', 'County Governments Act 2012, Sec. 32'],
      sw: ['Katiba ya Kenya 2010, Kifungu 179, 182', 'Sheria ya Serikali za Kaunti 2012'],
    },
    citizenEngagement: {
      en: 'Citizens engage Deputy Governors during county stakeholder forums, monitoring delivery of county health, agriculture, and water projects.',
      sw: 'Wananchi hushirikiana na Naibu Gavana katika mabaraza ya maoni ya kaunti na ukaguzi wa miradi ya afya, maji na kilimo.',
    },
    relatedOfficeIds: ['governor', 'county_executive_committee_member', 'county_assembly'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 28. County Executive Committee Member (CECM)
  {
    id: 'county_executive_committee_member',
    name: {
      en: 'County Executive Committee Member (CECM)',
      sw: 'Waziri wa Serikali ya Kaunti (CECM)',
    },
    level: 'county',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'Briefcase',
    badgeColor: 'bg-emerald-600 text-white',
    keyStats: {
      totalNumber: 'Maximum 10 CEC Members per County',
      establishedBy: 'Constitution of Kenya, Article 179',
    },
    summary: {
      en: 'A county "minister" appointed by the Governor to head a specific department (such as Health, Water, Roads, or Agriculture) and implement county policies.',
      sw: '"Waziri" wa kaunti anayeteuliwa na Gavana kusimamia idara maalum (kama vile Afya, Maji, Barabara, au Kilimo) na kutekeleza sera za kaunti.',
    },
    responsibilities: {
      en: [
        'Implements county legislation and policies in their designated portfolio (e.g. Kwale Health, Kwale Roads).',
        'Prepares proposed county legislation and sub-county policy drafts for approval by County Assembly.',
        'Provides the County Assembly with full and regular reports concerning matters under their control.',
        'Oversees delivery of devolved services under Schedule 4 of the Constitution.',
      ],
      sw: [
        'Kutekeleza sera na sheria za kaunti katika idara aliyopewa (mfano Afya au Maji Kaunti ya Kwale).',
        'Kuandaa miswada ya sheria za kaunti ili iwasilishwe kwenye Bunge la Kaunti.',
        'Kutoa ripoti kamili za mara kwa mara kwa Bunge la Kaunti kuhusu idara yake.',
        'Kusimamia ugawaji na uboreshaji wa huduma zilizogatuliwa chini ya Jedwali la Nne la Katiba.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Cannot hold office as an elected Member of County Assembly (strict separation of powers).',
        'Does NOT authorize illegal expenditure outside approved county budgets.',
        'Cannot pass laws independently without County Assembly enactment.',
      ],
      sw: [
        'HAWEZI kuwa MCA aliyechaguliwa (kuna utengano mkali wa mamlaka).',
        'HARUHUSIWI kutumia fedha za kaunti nje ya bajeti iliyopitishwa na Bunge la Kaunti.',
        'HAPITISHI sheria peke yake bila idhini ya Bunge la Kaunti.',
      ],
    },
    howSelected: {
      en: 'Nominated by the County Governor and appointed only after rigorous vetting and approval by the County Assembly.',
      sw: 'Huteuliwa na Gavana na kuajiriwa baada ya kuhojiwa na kuidhinishwa na Bunge la Kaunti.',
    },
    qualifications: {
      en: ['Recognized university degree, professional expertise in the relevant field, compliance with Chapter 6 integrity.'],
      sw: ['Shahada ya chuo kikuu, utaalamu wa fani husika, na uadilifu wa Sura ya Sita.'],
    },
    termOfOffice: {
      en: 'Co-terminus with the term of the Governor; serves at the discretion of the Governor.',
      sw: 'Muda wake unaisha pindi muhula wa Gavana anayemteua unapokamilika.',
    },
    oversightAndAccountability: {
      en: 'Individually and collectively accountable to the Governor and the County Assembly for the exercise of their powers.',
      sw: 'Huwajibika binafsi na kwa pamoja kwa Gavana na Bunge la Kaunti.',
    },
    removalProcess: {
      en: 'Can be dismissed by the Governor, or removed by a vote of the County Assembly upon petition by any citizen or MCA under section 40 of County Governments Act.',
      sw: 'Anaweza kufutwa kazi na Gavana au kubanduliwa na Bunge la Kaunti chini ya Kifungu 40 cha Sheria ya Serikali za Kaunti.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 179', 'County Governments Act 2012, Sec. 35, 40'],
      sw: ['Katiba ya Kenya 2010, Kifungu 179', 'Sheria ya Serikali za Kaunti 2012'],
    },
    citizenEngagement: {
      en: 'Citizens engage CECMs during departmental budget hearings, project validation sessions, and public hearings on hospital and water services.',
      sw: 'Wananchi hushirikiana na Mawaziri wa Kaunti kwenye vikao vya bajeti ya idara na usikilizaji wa kero za hospitali na maji.',
    },
    relatedOfficeIds: ['governor', 'county_chief_officer', 'county_assembly', 'member_county_assembly'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 29. County Chief Officer
  {
    id: 'county_chief_officer',
    name: {
      en: 'County Chief Officer',
      sw: 'Afisa Mkuu Mtendaji wa Kaunti',
    },
    level: 'county',
    branch: 'executive',
    selectionMethod: 'appointed',
    iconName: 'FileText',
    badgeColor: 'bg-emerald-900 text-white',
    keyStats: {
      totalNumber: 'Accounting Officer for County Departments',
      establishedBy: 'County Governments Act 2012, Section 45',
    },
    summary: {
      en: 'The administrative head and authorized accounting officer of a county department, responsible for day-to-day administration, budget execution, and procurement compliance.',
      sw: 'Kiongozi mkuu wa kiutawala na afisa mwenye mamlaka ya uhasibu (Accounting Officer) katika idara ya kaunti, anayehusika na matumizi ya fedha, wafanyakazi na ununuzi wa umma.',
    },
    responsibilities: {
      en: [
        'Acts as the authorized accounting and financial officer of the county department.',
        'Directs day-to-day departmental operations, personnel, and public service delivery.',
        'Ensures financial prudency under the Public Finance Management Act (PFMA 2012).',
        'Answers Auditor-General queries regarding departmental expenditure and tenders.',
      ],
      sw: [
        'Kuwa afisa mkuu wa uhasibu na matumizi ya fedha katika idara ya kaunti.',
        'Kuongoza shughuli za kila siku za kiutawala na utoaji huduma kwa umma.',
        'Kuhakikisha nidhamu ya kifedha chini ya Sheria ya Usimamizi wa Fedha za Umma (PFMA 2012).',
        'Kujibu maswali ya Mkaguzi Mkuu wa Hesabu kuhusu ununuzi na miradi ya idara.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT make political policies (that belongs to the CECM and Governor).',
        'Cannot divert public funds without formal budget reallocation approval.',
        'Does not adjudicate legal disputes.',
      ],
      sw: [
        'HATUNGI sera za kisiasa (sera ni kazi ya CECM na Gavana).',
        'HAWEZI kuhamisha fedha za umma kinyume na bajeti iliyoidhinishwa.',
        'HAAMUI kesi za kisheria.',
      ],
    },
    howSelected: {
      en: 'Nominated by the Governor from candidates competitively shortlisted and interviewed by the County Public Service Board (CPSB), then vetted and approved by the County Assembly.',
      sw: 'Huteuliwa na Gavana kutoka kwa majina yaliyopitishwa na Bodi ya Utumishi wa Umma ya Kaunti (CPSB), kisha kuidhinishwa na Bunge la Kaunti.',
    },
    qualifications: {
      en: ['University degree, at least 5 years\' senior managerial experience, proven track record in financial or administrative management.'],
      sw: ['Shahada ya chuo kikuu, uzoefu wa angalau miaka 5 katika ngazi ya juu ya utawala, na rekodi nzuri ya usimamizi wa fedha.'],
    },
    termOfOffice: {
      en: 'Contractual terms of 3 to 5 years, renewable based on performance.',
      sw: 'Mkataba wa miaka 3 hadi 5 kulingana na utendaji kazi.',
    },
    oversightAndAccountability: {
      en: 'Directly accountable to the CECM, County Executive Committee, and summonsed by County Assembly committees.',
      sw: 'Huwajibika kwa Waziri wa Idara (CECM), Gavana, na kamati za Bunge la Kaunti.',
    },
    legalReferences: {
      en: ['County Governments Act 2012, Sec. 45', 'Public Finance Management Act 2012, Sec. 148'],
      sw: ['Sheria ya Serikali za Kaunti 2012, Kifungu 45', 'Sheria ya PFMA 2012'],
    },
    citizenEngagement: {
      en: 'Citizens submit formal requests for information under Article 35 and Access to Information Act regarding local project tenders and delivery status.',
      sw: 'Wananchi huwasilisha maombi rasmi ya taarifa chini ya Kifungu 35 kuhusu zabuni za miradi na bajeti ya idara.',
    },
    relatedOfficeIds: ['county_executive_committee_member', 'governor', 'county_public_service_board'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 30. County Assembly
  {
    id: 'county_assembly',
    name: {
      en: 'County Assembly',
      sw: 'Bunge la Kaunti',
    },
    level: 'county',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Landmark',
    badgeColor: 'bg-emerald-800 text-white',
    keyStats: {
      totalNumber: '47 County Assemblies (Legislative arm of County Governments)',
      establishedBy: 'Constitution of Kenya, Article 177 & 185',
    },
    summary: {
      en: 'The legislative arm of a county government, composed of elected and nominated MCAs, responsible for making county by-laws, approving county budgets, and holding the County Executive accountable.',
      sw: 'Mhimili wa utungaji sheria wa serikali ya kaunti unaoundwa na madiwani (MCAs) waliochaguliwa na kuteuliwa, wenye jukumu la kutunga sheria za kaunti, kuidhinisha bajeti, na kusimamia serikali ya Gavana.',
    },
    responsibilities: {
      en: [
        'Vets and approves nominees for CECMs, Chief Officers, and county board members.',
        'Enacts county legislation for matters devolved under Schedule 4 (health, agriculture, trade, county roads).',
        'Scrutinizes, amends, and approves County Annual Development Plans (ADP) and County Budgets.',
        'Exercises oversight over county public finances, debt, and county executive departments.',
        'Approves borrowing by county government in accordance with the law.',
      ],
      sw: [
        'Kuhoji na kuidhinisha walioteuliwa kuwa Mawaziri wa Kaunti, Maafisa Wakuu na wajumbe wa bodi.',
        'Kutunga sheria zote za kaunti chini ya Jedwali la Nne la Katiba (afya, kilimo, biashara, barabara za vijijini).',
        'Kukagua na kupitisha Mpango wa Maendeleo wa Kaunti (ADP) na Bajeti ya Kaunti.',
        'Kusimamia matumizi ya fedha za umma za kaunti na kukagua utendaji wa Gavana na mawaziri wake.',
        'Kuidhinisha mikopo ya serikali ya kaunti kulingana na sheria.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT implement development projects (e.g. MCAs do not build dispensaries or award construction tenders).',
        'Does NOT collect county taxes directly.',
        'Cannot pass legislation contrary to national laws or the Constitution of Kenya.',
      ],
      sw: [
        'HAITEKELEZI miradi ya maendeleo (madiwani hawajengi zahanati wala kutoa kandarasi).',
        'HAIKUSANYI kodi za masoko moja kwa moja.',
        'HAIPITISHI sheria inayokiuka sheria za kitaifa au Katiba ya Kenya.',
      ],
    },
    howSelected: {
      en: 'Composed of elected MCAs representing wards, nominated MCAs to fulfill the two-thirds gender rule, youth and disability nominees, and an externally elected Speaker.',
      sw: 'Hujumuisha Madiwani waliochaguliwa kutoka wadi zote, madiwani wateule wa jinsia, vijana na watu wenye ulemavu, na Spika wa Bunge.',
    },
    qualifications: {
      en: ['Registered voter, moral integrity under Chapter 6, verified educational credentials.'],
      sw: ['Mpiga kura aliyesajiliwa, maadili ya Sura ya Sita ya Katiba.'],
    },
    termOfOffice: {
      en: 'Five-year constitutional term following general elections.',
      sw: 'Muhula wa miaka mitano baada ya uchaguzi mkuu.',
    },
    oversightAndAccountability: {
      en: 'Monitored by the Controller of Budget, Auditor-General, Senate, and local citizens.',
      sw: 'Hukaguliwa na Mdhibiti wa Bajeti (COB), Mkaguzi Mkuu wa Hesabu, Seneti, na wananchi.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 177, 185', 'County Governments Act 2012', 'Public Finance Management Act 2012'],
      sw: ['Katiba ya Kenya 2010, Kifungu 177, 185', 'Sheria ya Serikali za Kaunti 2012'],
    },
    citizenEngagement: {
      en: 'Citizens attend public participation hearings on county bills, inspect assembly public gallery during debates, and petition under Article 119.',
      sw: 'Wananchi huhudhuria mikutano ya ushiriki wa umma ya kupitisha bajeti na miswada ya sheria za kaunti na kuwasilisha maombi rasmi.',
    },
    relatedOfficeIds: ['member_county_assembly', 'speaker_county_assembly', 'governor', 'senate'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 31. Speaker of County Assembly
  {
    id: 'speaker_county_assembly',
    name: {
      en: 'Speaker of County Assembly',
      sw: 'Spika wa Bunge la Kaunti',
    },
    level: 'county',
    branch: 'legislature',
    selectionMethod: 'elected',
    iconName: 'Award',
    badgeColor: 'bg-emerald-950 text-white',
    keyStats: {
      totalNumber: '47 Speakers (Presiding Officers of County Assemblies)',
      establishedBy: 'Constitution of Kenya, Article 178',
    },
    summary: {
      en: 'The presiding officer of the County Assembly who enforces assembly standing orders, maintains decorum, and chairs the County Assembly Service Board (CASB).',
      sw: 'Kiongozi anayeongoza mijadala ya Bunge la Kaunti, kusimamia kanuni za bunge, na mwenyekiti wa Bodi ya Huduma za Bunge la Kaunti (CASB).',
    },
    responsibilities: {
      en: [
        'Presides over all sittings of the County Assembly impartially.',
        'Interprets County Assembly Standing Orders and constitutional rules of debate.',
        'Chairs the County Assembly Service Board (CASB) which manages assembly staff and resources.',
        'Acts as temporary County Governor under Article 182(4) if both Governor and Deputy Governor vacate office, pending a by-election within 60 days.',
      ],
      sw: [
        'Kuongoza vikao vyote vya Bunge la Kaunti kwa uadilifu.',
        'Kufafanua Kanuni za Bunge la Kaunti na miongozo ya mijadala.',
        'Kuwa Mwenyekiti wa Bodi ya Huduma za Bunge la Kaunti (CASB) inayosimamia wafanyakazi na bajeti ya bunge.',
        'Kukaimu nafasi ya Gavana wa Kaunti chini ya Kifungu 182(4) ikiwa Gavana na Naibu wake wote wataondoka ofisini kwa pamoja, kabla ya uchaguzi mdogo ndani ya siku 60.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT vote on assembly motions except in rare casting vote scenarios where permitted.',
        'Cannot be a sitting elected Member of County Assembly.',
        'Does NOT award county executive road or health tenders.',
      ],
      sw: [
        'HAPIGI kura ya kawaida katika mijadala ya bunge la kaunti.',
        'HAWEZI kuwa MCA aliyechaguliwa wakati huo huo.',
        'HATOI zabuni za ujenzi wa miradi ya serikali ya Gavana.',
      ],
    },
    howSelected: {
      en: 'Elected by Members of the County Assembly from among persons qualified to be MCAs, but who are not elected MCAs.',
      sw: 'Huchaguliwa na Madiwani kutoka miongoni mwa watu wenye sifa za kuwa MCA lakini ambao si madiwani waliopo.',
    },
    qualifications: {
      en: ['Qualified for election as an MCA; proven leadership, legal knowledge, and high ethical standing.'],
      sw: ['Mtu mwenye sifa za kuwa diwani; uongozi uliotukuka na maadili mema.'],
    },
    termOfOffice: {
      en: 'Five-year parliamentary term; vacates office at the opening of a newly elected assembly.',
      sw: 'Muhula wa miaka mitano hadi bunge jipya linapokutana.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the assembly; subject to removal by a resolution supported by at least two-thirds of all MCAs.',
      sw: 'Huwajibika kwa bunge la kaunti na huondolewa kwa azimio la theluthi mbili ya madiwani wote.',
    },
    removalProcess: {
      en: 'Removed by a resolution supported by at least two-thirds of all MCAs under Section 11 of the County Governments Act 2012.',
      sw: 'Huondolewa kwa azimio linaloungwa mkono na angalau theluthi mbili ya madiwani wote chini ya Kifungu 11 cha Sheria ya Serikali za Kaunti 2012.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 178, 182', 'County Governments Act 2012, Sec. 9–11'],
      sw: ['Katiba ya Kenya 2010, Kifungu 178, 182', 'Sheria ya Serikali za Kaunti 2012'],
    },
    citizenEngagement: {
      en: 'Citizens can submit written petitions directly to the Speaker to table public interest grievances before the County Assembly.',
      sw: 'Wananchi wanaweza kuwasilisha maombi rasmi (petitions) kwa Spika ili yajadiliwe bungeni.',
    },
    relatedOfficeIds: ['county_assembly', 'member_county_assembly', 'governor'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 32. County Public Service Board (CPSB)
  {
    id: 'county_public_service_board',
    name: {
      en: 'County Public Service Board (CPSB)',
      sw: 'Bodi ya Utumishi wa Umma ya Kaunti (CPSB)',
    },
    level: 'county',
    branch: 'commission',
    selectionMethod: 'appointed',
    iconName: 'Users',
    badgeColor: 'bg-teal-900 text-white',
    keyStats: {
      totalNumber: '1 Board per County (Chairperson & 4–6 Members)',
      establishedBy: 'County Governments Act 2012, Section 57',
    },
    summary: {
      en: 'The independent human resource body of a county government that recruits, appoints, promotes, and disciplines county public officers, doctors, nurses, and administrators.',
      sw: 'Chombo huru cha rasilimali watu katika serikali ya kaunti kinachoajiri, kuteua, kupandisha vyeo na kusimamia nidhamu ya watumishi wote wa kaunti wakiwemo madaktari, wauguzi na maafisa wa utawala.',
    },
    responsibilities: {
      en: [
        'Establishes and abolishes offices in the county public service.',
        'Appoints persons to hold or act in offices of the county public service, including Chief Officers and directors.',
        'Exercises disciplinary control over and removes persons holding county public offices.',
        'Prepares annual reports on the values and principles of public service in the county.',
      ],
      sw: [
        'Kuanzisha na kufuta nafasi za kazi katika utumishi wa umma wa kaunti.',
        'Kuajiri na kuteua watumishi wa kaunti wakiwemo Maafisa Wakuu na wakurugenzi.',
        'Kusimamia nidhamu na kuwachukulia hatua za kinidhamu watumishi wa kaunti.',
        'Kutoa ripoti ya kila mwaka kuhusu utekelezaji wa maadili na kanuni za utumishi wa umma.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT employ teachers (teachers are employed strictly by Teachers Service Commission - TSC).',
        'Does NOT employ police officers (police belong to the National Police Service Commission).',
        'Cannot award tenders or control county bank accounts.',
      ],
      sw: [
        'HAIAJIRI walimu (walimu huajiriwa na Tume ya Utumishi wa Walimu - TSC).',
        'HAIAJIRI maafisa wa polisi (polisi huajiriwa na Tume ya NPSC).',
        'HATOI zabuni za miradi ya kaunti.',
      ],
    },
    howSelected: {
      en: 'Nominated by the County Governor from a competitively shortlisted list and appointed upon vetting and approval by the County Assembly.',
      sw: 'Huteuliwa na Gavana kutoka orodha ya waliofanyiwa usaili wa wazi na kuidhinishwa na Bunge la Kaunti.',
    },
    qualifications: {
      en: ['Recognized university degree, at least 10 years\' professional and managerial experience, compliance with Chapter 6 integrity.'],
      sw: ['Shahada ya chuo kikuu, uzoefu wa angalau miaka 10 ya usimamizi, na uadilifu wa Sura ya Sita.'],
    },
    termOfOffice: {
      en: 'Non-renewable 6-year term.',
      sw: 'Muhula mmoja wa miaka 6 usioongezwa.',
    },
    oversightAndAccountability: {
      en: 'Accountable to the County Assembly and subject to national standards overseen by the Public Service Commission (PSC).',
      sw: 'Huwajibika kwa Bunge la Kaunti na viwango vya kitaifa vinavyosimamiwa na Tume ya PSC.',
    },
    legalReferences: {
      en: ['County Governments Act 2012, Sec. 57–59', 'Constitution of Kenya 2010, Art. 235'],
      sw: ['Sheria ya Serikali za Kaunti 2012, Kifungu 57–59'],
    },
    citizenEngagement: {
      en: 'Citizens apply for county jobs through open competitive CPSB advertisements and can petition against nepotism or ethnic bias in hiring.',
      sw: 'Wananchi huomba nafasi za kazi za kaunti na wanaweza kuripoti upendeleo au ukabila katika ajira za kaunti.',
    },
    relatedOfficeIds: ['governor', 'county_chief_officer', 'public_service_commission'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 33. Public Service Commission (PSC)
  {
    id: 'public_service_commission',
    name: {
      en: 'Public Service Commission (PSC)',
      sw: 'Tume ya Utumishi wa Umma ya Kitaifa (PSC)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'Users',
    badgeColor: 'bg-blue-900 text-white',
    keyStats: {
      totalNumber: 'Chairperson & Commissioners (Established 1954/2010)',
      establishedBy: 'Constitution of Kenya, Article 233 & 234',
    },
    summary: {
      en: 'The constitutional commission responsible for human resource management in the national public service, establishing offices, and interviewing candidates for Principal Secretaries and national directors.',
      sw: 'Tume ya kikatiba inayosimamia rasilimali watu katika serikali ya kitaifa, kuanzisha ofisi, na kufanya usaili wa Makatibu Wakuu (PS) na wakurugenzi wa kitaifa.',
    },
    responsibilities: {
      en: [
        'Establishes and abolishes offices in the public service of Kenya.',
        'Interviews and shortlists candidates for appointment by the President as Principal Secretaries.',
        'Recruits, promotes, and disciplines national civil servants in government ministries.',
        'Promotes values and principles of public service under Articles 10 and 232.',
        'Hears and determines appeals from county public service boards.',
      ],
      sw: [
        'Kuanzisha na kufuta ofisi katika utumishi wa umma nchini Kenya.',
        'Kufanya usaili wa wazi wa watu wa kuteuliwa na Rais kama Makatibu Wakuu (PS).',
        'Kuajiri, kupandisha vyeo na kusimamia nidhamu ya watumishi wa serikali kuu.',
        'Kusimamia na kukuza maadili na kanuni za utumishi wa umma chini ya Kifungu cha 232.',
        'Kusikiliza na kuamua rufaa za kinidhamu kutoka bodi za utumishi za kaunti (CPSB).',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT employ teachers (TSC) or police officers (NPSC).',
        'Does NOT appoint military personnel (KDF).',
        'Does NOT manage judicial officers (Judicial Service Commission).',
      ],
      sw: [
        'HAIAJIRI walimu (ni kazi ya TSC) wala polisi (ni kazi ya NPSC).',
        'HAIAJIRI wanajeshi wa KDF.',
        'HAISIMAMII majaji wala mahakimu (ni kazi ya JSC).',
      ],
    },
    howSelected: {
      en: 'Recruited competitively through open advertisement and appointed by the President with National Assembly approval.',
      sw: 'Huchujwa kwa ushindani wa wazi na kuteuliwa na Rais kwa idhini ya Bunge la Kitaifa.',
    },
    qualifications: {
      en: ['Degree from recognized university, at least 15 years\' distinguished experience in public administration or law, high integrity.'],
      sw: ['Shahada ya chuo kikuu, uzoefu wa miaka 15 katika utawala wa umma au sheria, na uadilifu wa hali ya juu.'],
    },
    termOfOffice: {
      en: 'Single non-renewable term of six years.',
      sw: 'Muhula mmoja wa miaka sita usioongezwa.',
    },
    oversightAndAccountability: {
      en: 'Reports annually to the President and Parliament on public service values and compliance.',
      sw: 'Hutoa ripoti ya kila mwaka kwa Rais na Bunge kuhusu uzingatiaji wa maadili ya utumishi wa umma.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 233, 234', 'Public Service Commission Act 2017'],
      sw: ['Katiba ya Kenya 2010, Kifungu 233, 234', 'Sheria ya Tume ya Utumishi wa Umma 2017'],
    },
    citizenEngagement: {
      en: 'Kenyan graduates apply for national civil service and public internship programmes through the PSC portal.',
      sw: 'Wananchi huhusika kwa kuomba nafasi za ajira na mpango wa mafunzo kwa vitendo (internships) kupitia mfumo wa PSC.',
    },
    relatedOfficeIds: ['principal_secretary', 'county_public_service_board', 'cabinet_secretary'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 34. Salaries and Remuneration Commission (SRC)
  {
    id: 'salaries_remuneration_commission',
    name: {
      en: 'Salaries and Remuneration Commission (SRC)',
      sw: 'Tume ya Mishahara na Marupurupu (SRC)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'Coins',
    badgeColor: 'bg-amber-900 text-white',
    keyStats: {
      totalNumber: '14 Commissioners Chaired by Chairperson',
      establishedBy: 'Constitution of Kenya, Article 230',
    },
    summary: {
      en: 'The constitutional commission mandated to set and regularly review remuneration and benefits for all state officers and advise governments on public sector wage bills.',
      sw: 'Tume ya kikatiba yenye mamlaka ya kupanga na kukagua mara kwa mara mishahara na marupurupu ya maafisa wote wa serikali na kutoa ushauri kuhusu gharama za mishahara ya watumishi wa umma.',
    },
    responsibilities: {
      en: [
        'Sets and regularly reviews the remuneration and benefits of all State officers (President, MPs, Governors, Judges, MCAs).',
        'Advises the national and county governments on the remuneration and benefits of all other public officers.',
        'Ensures that the total public compensation bill is fiscally sustainable.',
        'Promotes equity and fair competition to attract and retain skilled public servants.',
      ],
      sw: [
        'Kupanga na kukagua mishahara na marupurupu ya viongozi wote wakuu wa serikali (Rais, Wabunge, Magavana, Majaji, Madiwani).',
        'Kushauri serikali kuu na za kaunti kuhusu mishahara ya wafanyakazi wengine wote wa umma.',
        'Kuhakikisha mzigo wa mishahara ya umma unalingana na uwezo wa kiuchumi wa nchi.',
        'Kuhakikisha usawa na haki katika mishahara ili kuvutia wataalamu katika utumishi wa umma.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT pay salaries directly (payments are made by the National Treasury and County Treasuries).',
        'Does NOT set salaries for private company workers.',
        'Cannot unilaterally alter salaries without considering constitutional principles and economic parameters.',
      ],
      sw: [
        'HAILIPISHI mishahara moja kwa moja (mishahara hulipwa na Hazina Kuu ya Kitaifa na Hazina za Kaunti).',
        'HAIPANGI mishahara ya wafanyakazi wa kampuni za kibinafsi.',
        'HAIBADILISHI mishahara kiholela bila kuzingatia hali ya uchumi wa nchi.',
      ],
    },
    howSelected: {
      en: 'Nominees from parliamentary bodies, public service commissions, trade unions, employers\' federation, and defense organs; appointed by the President with National Assembly approval.',
      sw: 'Wajumbe huteuliwa kutoka bunge, tume za utumishi, miungano ya wafanyakazi (COTU), waajiri (FKE) na kuteuliwa na Rais kwa idhini ya Bunge.',
    },
    qualifications: {
      en: ['Degree in economics, human resource management, finance, or law, with at least 10 years\' senior experience.'],
      sw: ['Shahada ya uchumi, rasilimali watu, fedha au sheria na uzoefu wa miaka 10.'],
    },
    termOfOffice: {
      en: 'Non-renewable 6-year constitutional term.',
      sw: 'Muhula mmoja wa miaka sita usioongezwa.',
    },
    oversightAndAccountability: {
      en: 'Decisions subject to judicial review by High Court and regular reports to Parliament.',
      sw: 'Maamuzi yake yanaweza kukaguliwa na Mahakama Kuu na kutoa ripoti bungeni.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 230', 'Salaries and Remuneration Commission Act 2011'],
      sw: ['Katiba ya Kenya 2010, Kifungu 230', 'Sheria ya SRC 2011'],
    },
    citizenEngagement: {
      en: 'Citizens participate in public hearings on state officers\' salary reviews and demand reduction of wasteful allowances.',
      sw: 'Wananchi hushiriki katika mikutano ya maoni ya umma kupinga mishahara na marupurupu ya kupindukia ya wanasiasa.',
    },
    relatedOfficeIds: ['president', 'member_of_parliament', 'controller_of_budget', 'auditor_general'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },

  // 35. National Police Service Commission (NPSC)
  {
    id: 'national_police_service_commission',
    name: {
      en: 'National Police Service Commission (NPSC)',
      sw: 'Tume ya Huduma ya Polisi ya Kitaifa (NPSC)',
    },
    level: 'independent',
    branch: 'commission',
    selectionMethod: 'constitutional_process',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-zinc-800 text-white',
    keyStats: {
      totalNumber: 'Independent Commission for Police Personnel',
      establishedBy: 'Constitution of Kenya, Article 246',
    },
    summary: {
      en: 'The constitutional body established to recruit, appoint, promote, transfer, and discipline personnel in the National Police Service (Kenya Police and Administration Police).',
      sw: 'Chombo cha kikatiba kilichoanzishwa kuajiri, kuteua, kupandisha vyeo, kuhamisha na kusimamia nidhamu ya maafisa wote wa Polisi wa Kenya na Polisi wa Utawala.',
    },
    responsibilities: {
      en: [
        'Recruits and appoints persons to hold or act in offices in the National Police Service.',
        'Determines promotions and transfers within the police service.',
        'Exercises disciplinary control over and removes persons holding police offices.',
        'Develops transparent welfare policies and transparent vetting of police commanders.',
      ],
      sw: [
        'Kuajiri na kuteua watu wa kuhudumu katika Huduma ya Polisi ya Kitaifa.',
        'Kupanga na kuamua upandishaji vyeo na uhamisho wa maafisa wa polisi.',
        'Kusimamia nidhamu na kuwaondoa kazini maafisa wanaokiuka maadili ya kazi.',
        'Kuweka sera za masilahi bora na kufanya ukaguzi wa uadilifu (vetting) wa makamanda wa polisi.',
      ],
    },
    whatItDoesNotDo: {
      en: [
        'Does NOT direct daily police tactical operations (that belongs to the Inspector-General of Police under Art. 245).',
        'Does NOT investigate police brutality criminal offenses (that belongs to the Independent Policing Oversight Authority - IPOA).',
        'Does NOT operate private security guards.',
      ],
      sw: [
        'HATOI amri za kila siku za kiutendaji za doria na oparesheni za polisi (hilo ni jukumu la Inspekta Jenerali wa Polisi chini ya Kifungu 245).',
        'HAICHUNGUZI uhalifu na mauaji ya kinyama ya polisi (hilo ni jukumu la IPOA).',
        'HAISIMAMII walinzi wa makampuni ya kibinafsi.',
      ],
    },
    howSelected: {
      en: 'Recruited through open public competitive interview and appointed by the President with approval of the National Assembly.',
      sw: 'Huchujwa kwa ushindani wa wazi na kuteuliwa na Rais baada ya kuidhinishwa na Bunge la Kitaifa.',
    },
    qualifications: {
      en: ['Distinguished citizens of unquestioned integrity with legal, security, or human rights background.'],
      sw: ['Raia wenye uadilifu uliotukuka, wataalamu wa sheria, usalama au haki za binadamu.'],
    },
    termOfOffice: {
      en: 'Single 6-year constitutional term.',
      sw: 'Muhula mmoja wa miaka sita.',
    },
    oversightAndAccountability: {
      en: 'Accountable to Parliament and public scrutiny under Chapter 6 of the Constitution.',
      sw: 'Huwajibika kwa Bunge na kufuata maadili ya Sura ya Sita ya Katiba.',
    },
    legalReferences: {
      en: ['Constitution of Kenya 2010, Art. 246', 'National Police Service Commission Act 2011'],
      sw: ['Katiba ya Kenya 2010, Kifungu 246'],
    },
    citizenEngagement: {
      en: 'Citizens report corrupt recruitment drives and submit community feedback during national police recruitment exercises.',
      sw: 'Wananchi huripoti ulaghai katika zoezi la kuajiri polisi na kutoa maoni kuhusu nidhamu ya maafisa wa usalama mtaani.',
    },
    relatedOfficeIds: ['president', 'national_administration', 'knchr'],
    lastReviewedDate: '2026-08-20',
    contentVersion: '1.2.0',
  },
];

