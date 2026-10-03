import React, { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  Phone,
  Mail,
  Shield,
  Copy,
  Check,
  Building,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Printer,
  ChevronRight,
  Info,
  MapPin,
  Globe,
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { translations } from '../data/translations';
import { printDocument } from '../utils/printHelper';
import { KENYA_47_COUNTIES } from '../data/kenyaCounties';
import { getUserCounty, getUserSubCounty } from '../utils/authAndQuestions';

interface CitizenActionHubProps {
  language: Language;
  currentUser?: AuthUser | null;
}

export const CitizenActionHub: React.FC<CitizenActionHubProps> = ({ language, currentUser }) => {
  const t = translations[language];

  // Memorandum Generator state
  const [citizenName, setCitizenName] = useState(currentUser?.username || '');
  const [organizationOrGroup, setOrganizationOrGroup] = useState('');
  const [county, setCounty] = useState(() => (currentUser ? getUserCounty(currentUser.username) : 'Kwale'));
  const [subCounty, setSubCounty] = useState(() => {
    const userSc = currentUser ? getUserSubCounty(currentUser.username) : '';
    if (userSc) return userSc;
    const cObj = KENYA_47_COUNTIES.find((c) => c.name === 'Kwale');
    return cObj?.subCounties[0] || 'Matuga';
  });
  const [wardName, setWardName] = useState('');
  const [issueCategory, setIssueCategory] = useState('Water & Sanitation');
  const [problemDescription, setProblemDescription] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [copiedMemo, setCopiedMemo] = useState(false);

  useEffect(() => {
    if (currentUser?.username) {
      if (!citizenName) setCitizenName(currentUser.username);
      const userC = getUserCounty(currentUser.username);
      if (userC) {
        setCounty(userC);
        const userSc = getUserSubCounty(currentUser.username);
        if (userSc) {
          setSubCounty(userSc);
        } else {
          const cObj = KENYA_47_COUNTIES.find((c) => c.name === userC);
          if (cObj && cObj.subCounties.length > 0) {
            setSubCounty(cObj.subCounties[0]);
          }
        }
      }
    }
  }, [currentUser?.username]);

  const agencyContacts = [
    {
      name: {
        en: 'Ethics and Anti-Corruption Commission (EACC)',
        sw: 'Tume ya Maadili na Kupambana na Ufisadi (EACC)',
      },
      role: {
        en: 'Report bribery, theft of public funds, conflict of interest, and corrupt public officers.',
        sw: 'Ripoti hongo, wizi wa fedha za umma, mgongano wa kimaslahi, na viongozi mafisadi.',
      },
      phone: '0727 285663 / 020 2717318',
      email: 'report@integrity.go.ke',
      hotline: 'Toll-free Hotline: 1530',
      website: 'https://eacc.go.ke',
      tag: 'Anti-Corruption',
    },
    {
      name: {
        en: 'Commission on Administrative Justice (Ombudsman - CAJ)',
        sw: 'Tume ya Haki za Kiutawala (Ombudsman)',
      },
      role: {
        en: 'Report delays in public service, abuse of power by chiefs/officials, or denial of access to public records under Art. 35.',
        sw: 'Ripoti ucheleweshaji wa huduma za serikali, unyanyasaji wa machifu, au kunyimwa taarifa za umma chini ya Kifungu cha 35.',
      },
      phone: '020 2270000 / 0800 221349 (Toll Free)',
      email: 'complain@ombudsman.go.ke',
      hotline: 'SMS: 15700',
      website: 'https://ombudsman.go.ke',
      tag: 'Service Delivery & Art. 35',
    },
    {
      name: {
        en: 'Independent Policing Oversight Authority (IPOA)',
        sw: 'Mamlaka Huru ya Kusimamia Utendaji Kazi wa Polisi (IPOA)',
      },
      role: {
        en: 'Report police harassment, unlawful arrests, excessive force, or deaths in police custody.',
        sw: 'Ripoti unyanyasaji wa polisi, kukamatwa bila hatia, kupigwa, au vifo vilivyotokea mikononi mwa polisi.',
      },
      phone: '1559 (Toll Free) / 020 4906000',
      email: 'complaints@ipoa.go.ke',
      hotline: 'Toll Free: 1559',
      website: 'https://ipoa.go.ke',
      tag: 'Police Accountability',
    },
    {
      name: {
        en: 'Kenya National Commission on Human Rights (KNCHR)',
        sw: 'Tume ya Kitaifa ya Haki za Binadamu ya Kenya (KNCHR)',
      },
      role: {
        en: 'Report violations of fundamental constitutional rights and freedoms enshrined in Chapter 4.',
        sw: 'Ripoti uvunjaji wa haki za msingi za binadamu na uhuru uliowekwa katika Sura ya 4 ya Katiba.',
      },
      phone: '0800 720 627 (Toll Free) / 0726 610159',
      email: 'complaint@knchr.org',
      hotline: 'SMS Hotline: 22359',
      website: 'https://knchr.org',
      tag: 'Human Rights',
    },
  ];

  const selectedCountyObj = KENYA_47_COUNTIES.find((c) => c.name === county) || KENYA_47_COUNTIES[1]; // default Kwale (code 02)

  const generatedMemoText = `CITIZEN MEMORANDUM ON COMMUNITY PRIORITIES
Pursuant to Article 10, Article 35, and Article 174 of the Constitution of Kenya 2010

Date: ${new Date().toLocaleDateString()}
To: The Clerk / Committee on Public Participation
County Assembly of ${county} / National Assembly of Kenya

FROM:
Submitter: ${citizenName || '[Citizen / Representative Name]'}
Group/Organization: ${organizationOrGroup || 'Local Community Members'}
County: ${county} County (County Code: ${String(selectedCountyObj.code).padStart(2, '0')})
Sub-County: ${subCounty}
Ward: ${wardName || '[Ward Name]'}

SECTOR / FOCUS AREA:
${issueCategory}

1. CONSTITUTIONAL BASIS:
This memorandum is submitted in exercise of sovereign power (Article 1), the national value of public participation (Article 10(2)(a)), and the right to petition public authorities (Article 119).

2. COMMUNITY PROBLEM STATEMENT:
${problemDescription || '[Detailed description of the issue faced by residents (e.g. stalled borehole, lack of medicine in dispensary, feeder road damaged by rain)]'}

3. PROPOSED PUBLIC ACTION & RECOMMENDATION:
${proposedSolution || '[Specific request from the government (e.g. allocate KES 1.5M in the upcoming Annual Development Plan for solar water pump installation)]'}

4. DECLARATION:
We respectfully request that this memorandum be formally tabled, recorded in the official hansard/minutes, and included in the public participation report for the current financial year.

Submitted with respect for the Constitution of Kenya.`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(generatedMemoText);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  const handlePrintMemo = () => {
    printDocument('printable-memorandum');
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Citizen Action' : 'Hatua za Mwananchi'}</span>
        </div>
        <h1 className="text-3xl font-extrabold font-serif text-stone-900 tracking-tight">
          {t.citizenAction.title}
        </h1>
        <p className="text-stone-600 text-base max-w-3xl leading-relaxed">
          {t.citizenAction.subtitle}
        </p>
      </div>

      {/* Section 1: Interactive Citizen Memorandum Generator */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="space-y-2 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {language === 'en'
                ? 'Citizen Memorandum Builder'
                : 'Mjenzi wa Barua Rasmi ya Maoni (Memorandum)'}
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            {language === 'en'
              ? 'Fill in your community details below to generate a formally structured memorandum under Article 10 & 119 to submit to the County Assembly or during budget hearings across any of Kenya’s 47 counties.'
              : 'Jaza maelezo ya kijiji chako hapa chini kutengeneza barua rasmi ya kikatiba ya kuwasilisha kwenye Bunge la Kaunti yako au vikao vya bajeti ya ugatuzi.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Submitter Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Your Full Name / Spokesperson:' : 'Jina Lako Kamili:'}
            </label>
            <input
              type="text"
              value={citizenName}
              onChange={(e) => setCitizenName(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Mwanaidi Mwambire' : 'mfano: Juma Bakari'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Group / Organization */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Community Group / Youth Chama (Optional):' : 'Kikundi / Chama cha Jamii:'}
            </label>
            <input
              type="text"
              value={organizationOrGroup}
              onChange={(e) => setOrganizationOrGroup(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Matuga Youth Empowerment Network' : 'mfano: Kikundi cha Wazazi cha Msambweni'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* County selection */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">
                {language === 'en' ? 'County Jurisdiction (1 - 47):' : 'Kaunti Yako (1 - 47):'}
              </label>
              <span className="text-[10px] text-emerald-800 font-bold">
                Code {String(selectedCountyObj.code).padStart(2, '0')}
              </span>
            </div>
            <div className="relative">
              <select
                value={county}
                onChange={(e) => {
                  const val = e.target.value;
                  setCounty(val);
                  const cObj = KENYA_47_COUNTIES.find((c) => c.name === val);
                  if (cObj && cObj.subCounties.length > 0) {
                    setSubCounty(cObj.subCounties[0]);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden appearance-none pr-8 cursor-pointer"
              >
                {KENYA_47_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {String(c.code).padStart(2, '0')} - {c.name} ({c.region})
                  </option>
                ))}
              </select>
              <Globe className="w-4 h-4 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sub-county dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Sub-County / Constituency:' : 'Kaunti Ndogo / Eneo Bunge:'}
            </label>
            <select
              value={subCounty}
              onChange={(e) => setSubCounty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {(selectedCountyObj.subCounties || []).map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Name */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Ward / Village Name:' : 'Jina la Wadi au Kijiji:'}
            </label>
            <input
              type="text"
              value={wardName}
              onChange={(e) => setWardName(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Waa, Tiwi, Kubo South, Gombato, Parklands, Township' : 'mfano: Kubo Kusini, Ramisi, Dzombo'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Sector Category */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Sector / Category:' : 'Sekta / Eneo la Changamoto:'}
            </label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="Water & Sanitation (Clean Drinking Water, Boreholes)">
                {language === 'en' ? 'Water & Sanitation' : 'Maji Safi na Usafi wa Mazingira'}
              </option>
              <option value="Health Services (Dispensary Medicines & Maternity)">
                {language === 'en' ? 'Health Services' : 'Huduma za Afya (Zahanati na Wodi ya Wazazi)'}
              </option>
              <option value="County Feeder Roads & Bridge Repairs">
                {language === 'en' ? 'County Roads & Infrastructure' : 'Barabara za Vijijini na Madaraja'}
              </option>
              <option value="ECDE Centers & Ward Bursary Allocation">
                {language === 'en' ? 'Education (Bursaries & ECDE)' : 'Elimu (Ufadhili wa Masomo & Chekechea)'}
              </option>
              <option value="Agriculture, Irrigation & Livestock Sales Yards">
                {language === 'en' ? 'Agriculture & Livestock' : 'Kilimo, Unyunyiziaji na Mifugo'}
              </option>
              <option value="Youth & Women Economic Empowerment (AGPO Tenders)">
                {language === 'en' ? 'Youth & Women Empowerment' : 'Uwezeshaji wa Vijana na Wanawake (AGPO)'}
              </option>
            </select>
          </div>

          {/* Problem Statement */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Describe the Community Problem:' : 'Eleza Changamoto ya Jamii Yako:'}
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'e.g. Over 300 households currently walk 6km to fetch water because the village borehole broke down 8 months ago, affecting schooling and maternal health.'
                  : 'mfano: Zaidi ya kaya 300 zinatembea kilomita 6 kufuata maji kwa sababu kisima cha kijiji kiliharibika miezi 8 iliyopita...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Proposed Solution */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-700">
              {language === 'en' ? 'Proposed Government Solution / Budget Request:' : 'Suluhisho Unalopendekeza Kutoka Serikalini:'}
            </label>
            <textarea
              rows={2}
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'e.g. We urge the County Government of Kwale to allocate funds in the upcoming budget to install a solar pump and repair the piping network.'
                  : 'mfano: Tunaiomba Serikali ya Kaunti ya Kwale kutenga fedha kwenye bajeti inayokuja kufunga pampu ya jua na kutengeneza mifereji.'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Live Generated Preview Box */}
        <div className="space-y-2 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {language === 'en' ? 'Formal Output Document Preview' : 'Mwonekano wa Nyaraka Rasmi'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyMemo}
                className="px-3 py-2 sm:py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
              >
                {copiedMemo ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'en' ? 'Copied!' : 'Imenakiliwa!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Copy Text' : 'Nakili Maandishi'}</span>
                  </>
                )}
              </button>
              <button
                onClick={handlePrintMemo}
                className="px-3 py-2 sm:py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Print Memorandum' : 'Chapa Barua'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-2xl bg-stone-900 text-emerald-400 font-mono text-[11px] sm:text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 border border-stone-800 shadow-inner">
            {generatedMemoText}
          </pre>

          {/* Printable target rendered only for printer */}
          <div id="printable-memorandum" className="printable-document-target hidden">
            <div className="p-6 font-serif text-slate-900 bg-white">
              <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
                <h2 className="text-lg font-bold uppercase tracking-wider">Formal Citizen Memorandum & Advocacy Petition</h2>
                <p className="text-xs text-slate-600">Generated under Article 37 & Article 119 of the Constitution of Kenya 2010</p>
                <p className="text-xs text-slate-500 mt-0.5">Kwale Focus Empowerment CBO (The Samaritan Platform)</p>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-900">
                {generatedMemoText}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Official Oversight & Reporting Directory */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-serif text-stone-900">
            {t.citizenAction.contactsDirectory}
          </h2>
          <p className="text-stone-600 text-sm">
            {language === 'en'
              ? 'Direct, verified contact information for independent accountability and watchdog commissions in Kenya.'
              : 'Njia za mawasiliano za moja kwa moja na tume huru za uwajibikaji na uchunguzi nchini Kenya.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {agencyContacts.map((agency, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    {agency.tag}
                  </span>
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 text-xs flex items-center gap-1 font-semibold"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="font-bold text-base text-stone-900 leading-snug">
                  {agency.name[language]}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {agency.role[language]}
                </p>
              </div>

              {/* Contact Details Box */}
              <div className="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-stone-900 font-semibold">{agency.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-stone-900">{agency.email}</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {agency.hotline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Article 35 Access to Information Quick Guide */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 text-amber-700" />
          <span>{language === 'en' ? 'Constitutional Right Notice' : 'Taarifa ya Haki ya Kikatiba'}</span>
        </div>
        <h3 className="text-xl font-bold font-serif text-amber-950">
          {language === 'en'
            ? 'Article 35: You Have The Right To Request Public Records'
            : 'Kifungu cha 35: Una Haki ya Kudai Nyaraka za Umma'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {language === 'en'
            ? 'Under Kenya\'s Access to Information Act 2016, any citizen can request copies of approved county budget estimates, bill of quantities (BQ) for dispensaries or feeder roads, tender awards, and project contracts. Public officers are legally mandated to respond within 21 days. If an officer refuses or demands a bribe, complain directly to the Commission on Administrative Justice (Ombudsman).'
            : 'Chini ya Sheria ya Upatikanaji wa Taarifa ya 2016, mwananchi yeyote ana haki ya kuomba nakala za bajeti za kaunti, makisio ya gharama (BQ) za ujenzi wa zahanati au barabara, na mikataba ya zabuni. Afisa wa umma anapaswa kujibu ndani ya siku 21. Afisa akikataa au kuomba hongo, wasilisha malalamiko kwa Tume ya Ombudsman mara moja.'}
        </p>
      </section>
    </div>
  );
};
