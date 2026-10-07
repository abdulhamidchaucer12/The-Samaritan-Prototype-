import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  PlusCircle,
  Trash2,
  Share2,
  Tag,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  Globe,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { CivicEvent, AuthUser } from '../types';
import {
  getCivicEvents,
  postCivicEvent,
  deleteCivicEvent,
  toggleRsvpCivicEvent,
  checkCivicEventClash,
} from '../utils/adminManagement';
import { KENYA_47_COUNTIES } from '../data/kenyaCounties';
import { getUserCounty } from '../utils/authAndQuestions';
import { UserBadge } from './UserBadge';

interface CivicEventsCalendarProps {
  language: 'en' | 'sw';
  currentUser?: AuthUser | null;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const CivicEventsCalendar: React.FC<CivicEventsCalendarProps> = ({
  language,
  currentUser,
  onClose,
  isEmbedded = false,
}) => {
  const [events, setEvents] = useState<CivicEvent[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);

  // Form State for Admin 3 & 4
  const [eventTitleEn, setEventTitleEn] = useState('');
  const [eventTitleSw, setEventTitleSw] = useState('');
  const [eventDescEn, setEventDescEn] = useState('');
  const [eventDescSw, setEventDescSw] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('9:30 AM - 1:00 PM EAT');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCounty, setEventCounty] = useState<string>(() => (currentUser ? getUserCounty(currentUser.username) : 'Kwale'));
  const [eventSubCounty, setEventSubCounty] = useState<string>('Matuga');
  const [eventCategory, setEventCategory] = useState<CivicEvent['category']>('budget_baraza');
  const [clashWarning, setClashWarning] = useState<string | null>(null);
  const [allowClashOverride, setAllowClashOverride] = useState(false);

  const isAdmin3Or4 =
    currentUser?.username === 'Admin 3' ||
    currentUser?.username === 'Admin 4' ||
    currentUser?.username === '@admin.kfe3' ||
    currentUser?.username === '@admin.kfe4' ||
    currentUser?.username === 'The_Samaritan' ||
    currentUser?.username === 'The Samaritan' ||
    currentUser?.username === '@The_Samaritan' ||
    currentUser?.adminLevel === 'executive' ||
    currentUser?.adminLevel === 'super';

  const reloadEvents = () => {
    setEvents(getCivicEvents());
  };

  useEffect(() => {
    reloadEvents();
    const handleUpdated = () => reloadEvents();
    window.addEventListener('the_samaritan_events_updated', handleUpdated);
    return () => window.removeEventListener('the_samaritan_events_updated', handleUpdated);
  }, []);

  // Update clash warning whenever date, county or time changes
  useEffect(() => {
    if (eventDate) {
      const clash = checkCivicEventClash(eventDate, eventCounty, eventTime);
      if (clash.hasClash) {
        setClashWarning(clash.reason || 'Notice: A civic event is already registered for this date & county.');
      } else {
        setClashWarning(null);
        setAllowClashOverride(false);
      }
    } else {
      setClashWarning(null);
    }
  }, [eventDate, eventCounty, eventTime]);

  const handleRsvp = (eventId: string) => {
    const userHandle = currentUser?.username || '@mwananchi_guest';
    const isNowAttending = toggleRsvpCivicEvent(eventId, userHandle);
    reloadEvents();

    setRsvpFeedback(
      isNowAttending
        ? language === 'en'
          ? 'RSVP Confirmed! You are registered for this civic event.'
          : 'Uthibitisho Umefaulu! Umejiandikisha kwa hafla hii ya kiraia.'
        : language === 'en'
        ? 'RSVP Removed.'
        : 'Uthibitisho Umeondolewa.'
    );

    setTimeout(() => setRsvpFeedback(null), 3500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitleEn.trim() || !eventDate.trim() || !eventLocation.trim()) return;

    // Check for clash before posting
    const clash = checkCivicEventClash(eventDate, eventCounty, eventTime);
    if (clash.hasClash && !allowClashOverride) {
      setClashWarning(clash.reason || 'Schedule clash detected. Please review or confirm to proceed.');
      return;
    }

    postCivicEvent(
      {
        titleEn: eventTitleEn,
        titleSw: eventTitleSw,
        descEn: eventDescEn,
        descSw: eventDescSw,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        county: eventCounty,
        subCounty: eventSubCounty,
        category: eventCategory,
      },
      currentUser?.username || 'Admin 4'
    );

    setIsCreateModalOpen(false);
    // Reset
    setEventTitleEn('');
    setEventTitleSw('');
    setEventDescEn('');
    setEventDescSw('');
    setEventDate('');
    setEventLocation('');
    setClashWarning(null);
    setAllowClashOverride(false);
    reloadEvents();
  };

  const handleDelete = (eventId: string, title: string) => {
    if (!isAdmin3Or4) return;
    if (
      window.confirm(
        language === 'en'
          ? `Delete event: "${title}"?`
          : `Je, una uhakika unataka kufuta tukio: "${title}"?`
      )
    ) {
      const res = deleteCivicEvent(eventId, currentUser?.username);
      if (!res.success) {
        alert(res.message);
      } else {
        reloadEvents();
      }
    }
  };

  // Download .ics calendar file
  const handleDownloadIcs = (event: CivicEvent) => {
    const title = event.title[language];
    const desc = event.description[language];
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Samaritan//Civic Events//EN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${event.location}
DTSTART:${event.date.replace(/-/g, '')}T060000Z
DTEND:${event.date.replace(/-/g, '')}T100000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `the-samaritan-event-${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters
  const filteredEvents = events.filter((e) => {
    if (selectedCounty !== 'all') {
      const eventC = (e.county || 'Kwale').toLowerCase();
      if (eventC !== selectedCounty.toLowerCase() && eventC !== 'nationwide' && selectedCounty.toLowerCase() !== 'nationwide') {
        return false;
      }
    }
    if (selectedSubCounty !== 'all' && e.subCounty !== selectedSubCounty) return false;
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    return true;
  });

  const categoryLabels: Record<string, { en: string; sw: string; color: string }> = {
    budget_baraza: {
      en: 'Ward Budget Baraza',
      sw: 'Baraza la Bajeti ya Wodi',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    public_hearing: {
      en: 'Public Hearing',
      sw: 'Kikao cha Mashauri ya Umma',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    civic_training: {
      en: 'Civic Literacy Training',
      sw: 'Mafunzo ya Elimu ya Uraia',
      color: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    youth_forum: {
      en: 'Youth Leadership Forum',
      sw: 'Kongamano la Vijana',
      color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    },
    assembly_session: {
      en: 'County Assembly Committee',
      sw: 'Kamati ya Bunge la Kaunti',
      color: 'bg-purple-100 text-purple-900 border-purple-200',
    },
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'p-4 sm:p-6 max-w-6xl mx-auto'}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Community Civic Action Calendar' : 'Kalenda ya Matukio ya Kiraia'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
              {language === 'en' ? 'Public Barazas & Citizen Gatherings' : 'Mabaraza ya Umma na Mikutano ya Wananchi'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Join upcoming devolved budget hearings, citizen audit barazas, and youth civic literacy forums across The Republic of Kenya (All 47 Counties).'
                : 'Shiriki vikao vya bajeti ya kaunti, mabaraza ya uwajibikaji, na makongamano ya vijana kote katika Jamhuri ya Kenya (Kaunti zote 47).'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin3Or4 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Post New Event' : 'Chapisha Tukio Jipya'}</span>
              </button>
            )}

            {onClose && !isEmbedded && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
              >
                {language === 'en' ? 'Close Calendar' : 'Funga Kalenda'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RSVP Notification feedback */}
      {rsvpFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{rsvpFeedback}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* County Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
              {language === 'en' ? 'County Filter' : 'Chuja kwa Kaunti'}
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">{language === 'en' ? 'All Counties (Kenya-wide)' : 'Kaunti Zote (Kenya)'}</option>
              <option value="Nationwide">{language === 'en' ? 'Nationwide Forums' : 'Kitaifa'}</option>
              {KENYA_47_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {String(c.code).padStart(2, '0')} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
              {language === 'en' ? 'Sub-County Location' : 'Eneo la Kaunti Ndogo'}
            </label>
            <select
              value={selectedSubCounty}
              onChange={(e) => setSelectedSubCounty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">{language === 'en' ? 'All Sub-Counties' : 'Maeneo Yote'}</option>
              <option value="Matuga">Matuga Sub-County</option>
              <option value="Msambweni">Msambweni Sub-County</option>
              <option value="Kinango">Kinango Sub-County</option>
              <option value="Lunga Lunga">Lunga Lunga Sub-County</option>
              <option value="County-wide">{language === 'en' ? 'County-wide / Regional' : 'Kaunti Nzima / Eneo'}</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
              {language === 'en' ? 'Event Category' : 'Aina ya Tukio'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">{language === 'en' ? 'All Categories' : 'Aina Zote'}</option>
              <option value="budget_baraza">{language === 'en' ? 'Budget Baraza' : 'Baraza la Bajeti'}</option>
              <option value="public_hearing">{language === 'en' ? 'Public Hearing' : 'Kikao cha Mashauri'}</option>
              <option value="youth_forum">{language === 'en' ? 'Youth Forum' : 'Kongamano la Vijana'}</option>
              <option value="civic_training">{language === 'en' ? 'Civic Training' : 'Mafunzo ya Uraia'}</option>
              <option value="assembly_session">{language === 'en' ? 'Assembly Committee' : 'Kamati ya Bunge'}</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          <span>
            {language === 'en'
              ? `Showing ${filteredEvents.length} civic gathering(s)`
              : `Inaonyesha mikusanyiko ${filteredEvents.length} ya kiraia`}
          </span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => {
          const userHandle = (currentUser?.username || '').toLowerCase();
          const hasRsvpd =
            userHandle && (event.rsvpdUsernames || []).some((u) => u.toLowerCase() === userHandle);
          const catInfo = categoryLabels[event.category] || categoryLabels.budget_baraza;

          const eventDateObj = new Date(event.date);
          const monthShort = eventDateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const dayNum = eventDateObj.getDate() || '24';

          return (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top badges & date stamp */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-14 rounded-2xl bg-blue-900 text-white flex flex-col items-center justify-center font-serif shadow-xs">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        {monthShort}
                      </span>
                      <span className="text-lg font-black leading-none">{dayNum}</span>
                    </div>
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catInfo.color}`}
                      >
                        {catInfo[language]}
                      </span>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        {event.county ? `${event.county} • ${event.subCounty || 'County-wide'}` : (event.subCounty || 'Kwale County')}
                      </p>
                    </div>
                  </div>

                  {isAdmin3Or4 && (
                    <button
                      onClick={() => handleDelete(event.id, event.title[language])}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title={language === 'en' ? 'Delete Event (Admin 3 & 4)' : 'Futa Tukio'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                    {event.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {event.description[language]}
                  </p>
                </div>

                {/* Metadata details */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>{event.attendeesCount}</strong>{' '}
                      {language === 'en' ? 'citizens planning to attend' : 'wananchi wanatarajia kushiriki'}
                    </span>
                  </div>
                </div>

                {/* Organizer badge */}
                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{language === 'en' ? 'Posted by:' : 'Imechapishwa na:'}</span>
                  <UserBadge username={event.postedBy} size="xs" showRoleLabel />
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRsvp(event.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    hasRsvpd
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-blue-900 hover:bg-blue-800 text-white'
                  }`}
                >
                  {hasRsvpd ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Attending' : 'Nitashiriki'}</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'RSVP / Attend' : 'Thibitisha Kushiriki'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadIcs(event)}
                  title={language === 'en' ? 'Add to Device Calendar (.ics)' : 'Ongeza kwenye Kalenda'}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-serif font-bold text-slate-700">
            {language === 'en' ? 'No events found in this category' : 'Hakuna matukio yaliyopatikana'}
          </h4>
          <p className="text-xs text-slate-500">
            {language === 'en'
              ? 'Try selecting "All Locations" or check back later for scheduled county barazas.'
              : 'Jaribu kuchagua "Maeneo Yote" au urudi baadaye kwa mabaraza yaliyopangwa.'}
          </p>
        </div>
      )}

      {/* Admin 3 & 4 Modal: Post New Civic Event */}
      {isCreateModalOpen && isAdmin3Or4 && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                  {currentUser?.username === 'Admin 4' ? 'Executive Director' : 'Project Officer'}
                </span>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {language === 'en' ? 'Post Community Civic Event' : 'Chapisha Tukio la Kiraia'}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Event Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventTitleEn}
                    onChange={(e) => setEventTitleEn(e.target.value)}
                    placeholder="e.g. Ward Budget Baraza"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kichwa cha Tukio (Kiswahili)
                  </label>
                  <input
                    type="text"
                    value={eventTitleSw}
                    onChange={(e) => setEventTitleSw(e.target.value)}
                    placeholder="e.g. Baraza la Bajeti ya Wodi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description (English) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={eventDescEn}
                  onChange={(e) => setEventDescEn(e.target.value)}
                  placeholder="Detail the constitutional purpose and agenda..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* County & Sub-County selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'County Jurisdiction' : 'Mamlaka ya Kaunti'}
                  </label>
                  <select
                    value={eventCounty}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEventCounty(val);
                      const cObj = KENYA_47_COUNTIES.find((c) => c.name === val);
                      if (cObj && cObj.subCounties.length > 0) {
                        setEventSubCounty(cObj.subCounties[0]);
                      } else {
                        setEventSubCounty('County-wide');
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="Nationwide">{language === 'en' ? 'Nationwide / National' : 'Kitaifa'}</option>
                    {KENYA_47_COUNTIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {String(c.code).padStart(2, '0')} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'en' ? 'Sub-County / Constituency' : 'Kaunti Ndogo / Eneo Bunge'}
                  </label>
                  <select
                    value={eventSubCounty}
                    onChange={(e) => setEventSubCounty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="County-wide">{language === 'en' ? 'County-wide' : 'Kaunti Nzima'}</option>
                    {(() => {
                      const cObj = KENYA_47_COUNTIES.find((c) => c.name === eventCounty);
                      return (cObj?.subCounties || ['Matuga', 'Msambweni', 'Kinango', 'Lunga Lunga']).map((sc) => (
                        <option key={sc} value={sc}>
                          {sc}
                        </option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Kombani Social Hall"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="budget_baraza">Ward Budget Baraza</option>
                    <option value="public_hearing">Public Hearing</option>
                    <option value="youth_forum">Youth Forum</option>
                    <option value="civic_training">Civic Training</option>
                    <option value="assembly_session">County Assembly Committee</option>
                  </select>
                </div>
              </div>

              {/* Conflict & Schedule Clash Warning Banner */}
              {clashWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-medium space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-950">
                        {language === 'en' ? 'Potential Schedule Clash' : 'Mgongano wa Ratiba ya Tukio'}
                      </p>
                      <p className="mt-0.5 text-slate-700">{clashWarning}</p>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="overrideClashCheckbox"
                      checked={allowClashOverride}
                      onChange={(e) => setAllowClashOverride(e.target.checked)}
                      className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="overrideClashCheckbox" className="text-[11px] text-amber-950 font-bold cursor-pointer">
                      {language === 'en'
                        ? 'I verify this event does not conflict or will occur in a separate venue/hall'
                        : 'Nimethibitisha kuwa tukio hili halisababishi mgongano na litaendeshwa ukumbi tofauti'}
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : 'Ghairi'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {language === 'en' ? 'Publish Event' : 'Chapisha Tukio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
