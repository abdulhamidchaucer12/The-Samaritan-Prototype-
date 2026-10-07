import React from 'react';
import {
  Shield,
  BookOpen,
  ExternalLink,
  Heart,
  Mail,
  Phone,
  MapPin,
  Globe,
  Code,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 relative">
      {/* Kenyan Flag Ribbon across the top of footer */}
      <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: App Identity & KFE Overview (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 drop-shadow-md">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-white font-serif tracking-tight">
                    THE SAMARITAN
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                    KENYA
                  </span>
                </div>
                <div className="text-[11px] text-amber-400/90 font-medium tracking-wide font-mono">
                  Kwale Focus Empowerment CBO (KFE)
                </div>
              </div>
            </div>

            {/* KFE Organizational Metadata */}
            <div className="pt-2 text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80">
              <p>
                <strong className="text-slate-200">
                  {language === 'en' ? 'Implementing Organisation:' : 'Shirika Tekelezaji:'}
                </strong>{' '}
                <span className="text-amber-300 font-semibold">Kwale Focus Empowerment CBO (KFE)</span>
              </p>
              <p>
                <strong className="text-slate-200">
                  {language === 'en' ? 'Implementation Period:' : 'Muda wa Mradi:'}
                </strong>{' '}
                <span className="text-emerald-400 font-medium">Ongoing Community Initiative</span>
              </p>
              <p>
                <strong className="text-slate-200">
                  {language === 'en' ? 'Implementation Scope:' : 'Eneo la Utekelezaji:'}
                </strong>{' '}
                <span>{language === 'en' ? 'The Republic of Kenya (Nationwide • All 47 Counties)' : 'Jamhuri ya Kenya (Nchi Nzima • Kaunti Zote 47)'}</span>
              </p>
              <p>
                <strong className="text-slate-200">
                  {language === 'en' ? 'Core Thematic Areas:' : 'Maeneo ya Kazi:'}
                </strong>{' '}
                <span>Civic Literacy, Devolved Budget Oversight, Human Rights & Youth Empowerment</span>
              </p>
            </div>
          </div>

          {/* Col 2: KFE Communication Details (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs text-slate-400">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-serif">
              {language === 'en' ? 'KFE Contact & Office' : 'Mawasiliano ya KFE'}
            </h4>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">
                  {language === 'en' ? 'Office Location:' : 'Mahali pa Ofisi:'}
                </strong>
                <span>
                  Majengo Mapya Village, Kombani, along Likoni–Lunga Lunga Road, Kwale County, Kenya
                </span>
                <span className="block text-slate-500 text-[11px] font-mono">P.O. Box 111-80403 Kwale</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <strong className="text-slate-200 mr-1">Email:</strong>
                <a
                  href="mailto:info.kwalefocuscbo@gmail.com"
                  className="text-blue-400 hover:underline font-mono"
                >
                  info.kwalefocuscbo@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200 mr-1">Phone:</strong>
                <span className="font-mono text-slate-300">+254 795 293 820 / +254 724 507 536</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <strong className="text-slate-200 mr-1">Website:</strong>
                <a
                  href="https://kwalefocus.or.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline font-mono"
                >
                  kwalefocus.or.ke
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation Quick Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 font-serif">
              {language === 'en' ? 'Platform Modules' : 'Mitaala ya Uraia'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('explorer')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.explorer}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('compare')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.compare}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('howGov')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.howGovWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lessons')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.lessons}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('quiz')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.quiz}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('action')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.citizenAction}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('myLearning')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.myLearning}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('profile')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.profile}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('qa')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1 text-emerald-400"
                >
                  <span>{language === 'en' ? 'Civic Q&A Hub' : 'Maswali ya Raia'}</span>
                  <span className="bg-emerald-800 text-emerald-200 text-[9px] px-1 rounded">Live</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('qa')}
                  className="hover:text-amber-300 transition-colors text-teal-300"
                >
                  {language === 'en' ? 'Interactive Civic FAQ' : 'Maswali ya Kawaida ya Katiba'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('demoMode')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.demoMode}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('feedback')}
                  className="hover:text-amber-300 transition-colors"
                >
                  {t.nav.feedback}
                </button>
              </li>
              <li className="pt-1.5 border-t border-slate-800">
                <button
                  onClick={() => onSelectTab('admin')}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Administrator Portal' : 'Tovuti ya Wasimamizi'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold block mb-0.5">
                {language === 'en'
                  ? 'Legal & Educational Notice'
                  : 'Ilani ya Kisheria na Kielimu'}
              </strong>
              {t.footer.disclaimer}
            </div>
          </div>
        </div>

        {/* Developer Credit & Copyright Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              © {new Date().getFullYear()} The Samaritan • Kwale Focus Empowerment CBO (KFE).
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tagline: <em>"Know Your Government. Understand Your Rights. Shape Your Future."</em>
            </p>
          </div>

          {/* Explicit Developer Credit */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Developer:{' '}
              <a
                href="mailto:abdulhamid.moh.ali19@gmail.com"
                className="text-amber-300 hover:text-amber-200 underline font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
                title="Email Lead Developer Abdulhamid Chaucer"
              >
                Abdulhamid Chaucer
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
