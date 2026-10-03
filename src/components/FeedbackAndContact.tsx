import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  Users,
  Shield,
  HeartHandshake,
  Code,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Language, FeedbackSubmission } from '../types';
import { translations } from '../data/translations';

interface FeedbackAndContactProps {
  language: Language;
  onSelectTab?: (tab: string) => void;
}

export const FeedbackAndContact: React.FC<FeedbackAndContactProps> = ({ language, onSelectTab }) => {
  const t = translations[language];

  const [formType, setFormType] = useState<'inquiry' | 'workshop'>('inquiry');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [county, setCounty] = useState('Kwale County');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    // Save submission to localStorage for persistence
    const newSubmission: FeedbackSubmission = {
      id: 'sub_' + Date.now(),
      senderName: name,
      contact,
      location: county,
      feedbackType: formType === 'workshop' ? 'baraza_request' : 'general',
      message,
      dateSubmitted: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('the_samaritan_feedback') || '[]');
      existing.push(newSubmission);
      localStorage.setItem('the_samaritan_feedback', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setSubmitted(true);
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner with KFE Identity */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 left-0 right-0 h-1 kenya-ribbon" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Implementing Organisation Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white mb-2">
            {t.feedback.title}
          </h1>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            {t.feedback.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Complete KFE Details, Mission, Communication Channels (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* KFE Profile Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-emerald-800 flex items-center justify-center text-white shadow-md">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 font-serif">
                  {t.kfe.name}
                </h2>
                <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                  {language === 'en'
                    ? 'Youth-Led Community-Based Organisation (Founded Jan 2020)'
                    : 'Shirika la Jamii Linaloongozwa na Vijana (Lilianzishwa Jan 2020)'}
                </p>
              </div>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              {t.kfe.about}
            </p>

            {/* Mission & Values Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
                  {language === 'en' ? 'Core Mission' : 'Dhamira Kuu'}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {t.kfe.mission}
                </p>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                  {language === 'en' ? 'Core Values' : 'Misingi na Maadili'}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {t.kfe.values}
                </p>
              </div>
            </div>

            {/* Project Scope & Implementation Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">
                  {language === 'en' ? 'Implementation Period:' : 'Muda wa Mradi:'}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Ongoing
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">
                  {language === 'en' ? 'Implementation Scope:' : 'Eneo la Utekelezaji:'}
                </span>
                <span className="font-bold text-blue-900">
                  The Republic of Kenya (Kwale County & National Digital)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">
                  {language === 'en' ? 'Lead Platform Developer:' : 'Msanidi Mkuu wa Mfumo:'}
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  Abdulhamid Chaucer
                </span>
              </div>
            </div>

            {/* Official KFE Contact Channels */}
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 mb-3 font-serif">
              {t.feedback.contactKfeDirectly}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              {/* Physical Location */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'en' ? 'Headquarters / Physical Address' : 'Makao Makuu'}
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">{t.kfe.location}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 font-mono">{t.kfe.postal}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Official Email</div>
                  <a
                    href={`mailto:${t.kfe.email}`}
                    className="text-blue-700 hover:underline font-mono text-xs"
                  >
                    {t.kfe.email}
                  </a>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    {language === 'en' ? 'Direct Telephone Lines' : 'Nambari za Simu'}
                  </div>
                  <div className="text-slate-700 font-mono text-xs">{t.kfe.phones}</div>
                </div>
              </div>

              {/* Official Website */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Globe className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Official Website</div>
                  <a
                    href="https://kwalefocus.or.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline text-xs flex items-center gap-1 font-mono"
                  >
                    <span>https://kwalefocus.or.ke</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Submission Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-serif mb-2">
              {language === 'en' ? 'Send a Message or Request' : 'Tuma Ujumbe au Ombi'}
            </h2>
            <p className="text-xs text-slate-600 mb-5">
              {language === 'en'
                ? 'Reach the KFE Civic Education team directly. We support schools, women groups, and village barazas.'
                : 'Wasiliana moja kwa moja na timu ya elimu ya uraia ya KFE.'}
            </p>

            {/* Toggle Form Type */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFormType('inquiry')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  formType === 'inquiry'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.feedback.sendInquiry}
              </button>
              <button
                type="button"
                onClick={() => setFormType('workshop')}
                className={`flex-1 py-1.5 rounded-md transition-all ${
                  formType === 'workshop'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.feedback.requestWorkshop}
              </button>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-bold text-emerald-900 text-sm mb-1">
                  {language === 'en' ? 'Submission Received!' : 'Ujumbe Umepokelewa!'}
                </h3>
                <p className="text-emerald-800 text-xs leading-relaxed mb-4">
                  {t.feedback.successMessage}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  {language === 'en' ? 'Send another message' : 'Tuma ujumbe mwingine'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.feedback.name} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Hassan / Tiwi Youth Group"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.feedback.emailOrPhone} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. 0712 345 678 or citizen@email.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.feedback.countyOrSubcounty}
                  </label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    placeholder="e.g. Kwale - Matuga / Kinango / Msambweni"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.feedback.message} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      formType === 'workshop'
                        ? 'Describe your group, preferred dates, and location (e.g. We would like a baraza session on budget participation in Kombani)...'
                        : 'Type your civic question, request for clarification, or feedback here...'
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.feedback.submit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
