import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Video,
  Music,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Play,
  Paperclip,
  Eye,
  X,
  File,
  Mic,
  Square,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import { Language, AuthUser, RahamProtocolDocument, RahamProtocolAttachment } from '../types';
import {
  fetchRahamProtocolDocuments,
  addRahamProtocolDocumentClient,
  deleteRahamProtocolDocumentClient,
  DEFAULT_RAHAM_DOCUMENTS,
  saveLocalRahamDocuments,
} from '../utils/rahamProtocolClient';

interface RahamProtocolConsoleProps {
  language: Language;
  currentUser?: AuthUser | null;
}

export const RahamProtocolConsole: React.FC<RahamProtocolConsoleProps> = ({
  language,
  currentUser,
}) => {
  const isSamaritan = Boolean(
    currentUser?.username &&
      (currentUser.username.toLowerCase().replace(/^@/, '') === 'the_samaritan' ||
        currentUser.username.toLowerCase().replace(/^@/, '') === 'the samaritan' ||
        currentUser.username.toLowerCase().replace(/^@/, '') === 'sir chaucer' ||
        currentUser.role === 'admin')
  );

  const [documents, setDocuments] = useState<RahamProtocolDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // New Material Form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<
    'all_files' | 'pdf' | 'video' | 'audio' | 'image' | 'link' | 'document' | 'manual'
  >('all_files');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<RahamProtocolDocument['category']>('constitution');
  const [formAnchors, setFormAnchors] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formWhatIf, setFormWhatIf] = useState('');
  const [formExample, setFormExample] = useState('');

  // Primary Attached Media
  const [primaryMediaType, setPrimaryMediaType] = useState<RahamProtocolDocument['mediaType']>('text');
  const [primaryFileName, setPrimaryFileName] = useState('');
  const [primaryFileDataUrl, setPrimaryFileDataUrl] = useState<string | undefined>(undefined);
  const [primaryFileSize, setPrimaryFileSize] = useState<number | undefined>(undefined);
  const [formExternalLink, setFormExternalLink] = useState('');

  // Multiple Attachments
  const [attachments, setAttachments] = useState<RahamProtocolAttachment[]>([]);
  const [newAttName, setNewAttName] = useState('');
  const [newAttUrl, setNewAttUrl] = useState('');
  const [newAttType, setNewAttType] = useState<RahamProtocolAttachment['type']>('link');
  const [newAttDesc, setNewAttDesc] = useState('');
  const [newAttDataUrl, setNewAttDataUrl] = useState<string | undefined>(undefined);
  const [newAttSize, setNewAttSize] = useState<number | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals (Lightbox & PDF Viewer)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
  const [pdfPreviewModal, setPdfPreviewModal] = useState<{ url: string; title: string } | null>(null);

  // In-Browser Audio Voice Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const loadDocs = async () => {
    const list = await fetchRahamProtocolDocuments();
    setDocuments(list);
  };

  useEffect(() => {
    loadDocs();

    const handleUpdate = () => {
      loadDocs();
    };
    window.addEventListener('the_samaritan_raham_protocol_updated', handleUpdate);
    return () => {
      window.removeEventListener('the_samaritan_raham_protocol_updated', handleUpdate);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const detectMediaType = (file: File): 'pdf' | 'video' | 'audio' | 'image' | 'document' => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    if (name.endsWith('.pdf') || type.includes('pdf')) return 'pdf';
    if (
      name.endsWith('.mp4') ||
      name.endsWith('.webm') ||
      name.endsWith('.mov') ||
      name.endsWith('.mkv') ||
      name.endsWith('.avi') ||
      name.endsWith('.m4v') ||
      type.includes('video')
    )
      return 'video';
    if (
      name.endsWith('.mp3') ||
      name.endsWith('.wav') ||
      name.endsWith('.m4a') ||
      name.endsWith('.ogg') ||
      name.endsWith('.aac') ||
      name.endsWith('.flac') ||
      name.endsWith('.wma') ||
      type.includes('audio')
    )
      return 'audio';
    if (
      name.endsWith('.png') ||
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.webp') ||
      name.endsWith('.svg') ||
      name.endsWith('.gif') ||
      name.endsWith('.bmp') ||
      type.includes('image')
    )
      return 'image';
    return 'document';
  };

  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    } catch {
      return null;
    }
  };

  const getVimeoEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    try {
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
      return match && match[3] ? `https://player.vimeo.com/video/${match[3]}` : null;
    } catch {
      return null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const detected = detectMediaType(file);
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

    setPrimaryFileName(file.name);
    setPrimaryFileSize(file.size);
    setPrimaryMediaType(detected);

    if (!formTitle.trim()) {
      setFormTitle(cleanTitle);
    }
    if (!formSummary.trim()) {
      setFormSummary(
        language === 'en'
          ? `Official ${detected.toUpperCase()} resource (${file.name}, ${formatFileSize(file.size)}) registered in The Raham Protocol.`
          : `Nyenzo rasmi ya ${detected.toUpperCase()} (${file.name}, ${formatFileSize(file.size)}) iliyosajiliwa kwenye The Raham Protocol.`
      );
    }
    if (!formAnchors.trim()) {
      setFormAnchors('Constitution of Kenya 2010');
    }

    // Process file data
    const isTextDoc =
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.csv') ||
      file.name.endsWith('.xml');

    if (isTextDoc) {
      const textReader = new FileReader();
      textReader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        if (text) {
          setFormContent(text);
          if (!formSummary.trim()) {
            setFormSummary(text.slice(0, 180) + '...');
          }
        }
      };
      textReader.readAsText(file);
    }

    // Always create a DataURL for downloadable/playable preview (PDF, Audio, Video, Image, Document)
    const dataUrlReader = new FileReader();
    dataUrlReader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPrimaryFileDataUrl(dataUrl);
    };
    dataUrlReader.readAsDataURL(file);

    setIsAddFormOpen(true);
    setFeedbackMsg({
      type: 'success',
      text:
        language === 'en'
          ? `Loaded ${detected.toUpperCase()} material: "${file.name}" (${formatFileSize(file.size)}).`
          : `Imepakia nyenzo ya ${detected.toUpperCase()}: "${file.name}" (${formatFileSize(file.size)}).`,
    });
  };

  // Direct Attachment File Upload
  const handleAttachmentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const detected = detectMediaType(file);
    setNewAttName(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    setNewAttType(detected);
    setNewAttSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewAttDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);

    setFeedbackMsg({
      type: 'success',
      text:
        language === 'en'
          ? `Prepared attachment "${file.name}" (${formatFileSize(file.size)}). Click "+ Add Item" to attach.`
          : `Kiambatisho "${file.name}" kimetayarishwa. Bonyeza "+ Ongeza" kukiambatisha.`,
    });
  };

  // Microphone Voice Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setPrimaryFileDataUrl(dataUrl);
          setPrimaryFileName(`Voice_Directive_${Date.now()}.webm`);
          setPrimaryFileSize(audioBlob.size);
          setPrimaryMediaType('audio');
          if (!formTitle.trim()) {
            setFormTitle('Raham Protocol: Recorded Voice Briefing');
          }
          if (!formSummary.trim()) {
            setFormSummary('High-priority audio briefing recorded by The_Samaritan for Operator AI synthesis.');
          }
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setFeedbackMsg({
        type: 'error',
        text:
          language === 'en'
            ? 'Microphone access is unavailable or blocked in this browser.'
            : 'Maikrofoni haipatikani au imezuiwa kwenye kivinjari hiki.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleAddAttachment = () => {
    if (!newAttName.trim() || (!newAttUrl.trim() && !newAttDataUrl)) {
      setFeedbackMsg({
        type: 'error',
        text:
          language === 'en'
            ? 'Attachment name and either a file upload or link URL are required.'
            : 'Jina la kiambatisho na faili au kiungo vinahitajika.',
      });
      return;
    }

    const newAtt: RahamProtocolAttachment = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: newAttName.trim(),
      type: newAttType,
      dataUrl: newAttDataUrl,
      sizeBytes: newAttSize,
      externalUrl: newAttUrl.trim() || undefined,
      description: newAttDesc.trim() || undefined,
      uploadedAt: new Date().toISOString(),
    };

    setAttachments([...attachments, newAtt]);
    setNewAttName('');
    setNewAttUrl('');
    setNewAttDesc('');
    setNewAttDataUrl(undefined);
    setNewAttSize(undefined);
    setFeedbackMsg({
      type: 'success',
      text: language === 'en' ? `Attachment added: "${newAtt.name}".` : `Kiambatisho kimeongezwa: "${newAtt.name}".`,
    });
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(attachments.filter((a) => a.id !== attId));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFeedbackMsg({
        type: 'error',
        text: language === 'en' ? 'Title is required.' : 'Kichwa cha habari kinahitajika.',
      });
      return;
    }

    const effectiveContent =
      formContent.trim() ||
      (primaryFileName
        ? `Official ${primaryMediaType?.toUpperCase() || 'document'} "${primaryFileName}" registered in The Raham Protocol. Certified by The_Samaritan for civic, legal, and constitutional guidance.`
        : formExternalLink
        ? `External legal/media resource link: ${formExternalLink}. Verified for Operator AI knowledge synthesis.`
        : formSummary.trim());

    if (!effectiveContent) {
      setFeedbackMsg({
        type: 'error',
        text: language === 'en' ? 'Please provide text directives or attach a file/link.' : 'Tafadhali weka miongozo au pakia faili/kiungo.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addRahamProtocolDocumentClient({
        title: formTitle.trim(),
        category: formCategory,
        statutoryAnchors: formAnchors.trim() || 'Constitution of Kenya 2010',
        summary: formSummary.trim() || formTitle.trim(),
        fullContent: effectiveContent,
        whatIfScenarios: formWhatIf.trim() || undefined,
        practicalExamples: formExample.trim() || undefined,
        uploadedBy: currentUser?.username || 'The_Samaritan',
        isActive: true,
        sourceType: primaryFileName ? 'upload' : 'manual',
        mediaType: primaryMediaType || (primaryFileName ? 'document' : formExternalLink ? 'link' : 'text'),
        fileName: primaryFileName || undefined,
        fileDataUrl: primaryFileDataUrl || undefined,
        fileSizeBytes: primaryFileSize || undefined,
        externalLink: formExternalLink.trim() || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Reset form
      setFormTitle('');
      setFormSummary('');
      setFormContent('');
      setFormWhatIf('');
      setFormExample('');
      setFormAnchors('');
      setPrimaryFileName('');
      setPrimaryFileDataUrl(undefined);
      setPrimaryFileSize(undefined);
      setFormExternalLink('');
      setAttachments([]);
      setIsAddFormOpen(false);

      setFeedbackMsg({
        type: 'success',
        text:
          language === 'en'
            ? 'Successfully appended material to The Raham Protocol! Operator AI will immediately learn, cite, and reference this material.'
            : 'Nyenzo imeongezwa kwenye The Raham Protocol! Operator AI itajifunza, kuitaja, na kuitumia mara moja.',
      });
      await loadDocs();
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: language === 'en' ? 'Failed to append material.' : 'Imeshindwa kuongeza nyenzo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(language === 'en' ? `Remove "${title}" from The Raham Protocol?` : `Ondoa "${title}" kutoka The Raham Protocol?`)) {
      return;
    }

    await deleteRahamProtocolDocumentClient(id);
    setFeedbackMsg({
      type: 'success',
      text: language === 'en' ? `Removed "${title}" from protocol.` : `Imeondolewa kwenye itifaki.`,
    });
    await loadDocs();
  };

  const handleRestoreDefaults = () => {
    saveLocalRahamDocuments(DEFAULT_RAHAM_DOCUMENTS);
    setDocuments(DEFAULT_RAHAM_DOCUMENTS);
    setFeedbackMsg({
      type: 'success',
      text:
        language === 'en'
          ? 'Restored foundational Raham Protocol multimedia directives.'
          : 'Imerejesha maagizo ya awali ya The Raham Protocol yenye faili mbalimbali.',
    });
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.statutoryAnchors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fullContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.fileName && d.fileName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.externalLink && d.externalLink.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.attachments &&
        d.attachments.some(
          (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ));

    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;

    const matchesMedia =
      selectedMediaType === 'all' ||
      d.mediaType === selectedMediaType ||
      (selectedMediaType === 'multimedia' && !!d.attachments && d.attachments.length > 0) ||
      (!!d.attachments && d.attachments.some((a) => a.type === selectedMediaType));

    return matchesSearch && matchesCat && matchesMedia;
  });

  const getMediaBadge = (doc: RahamProtocolDocument) => {
    const media = doc.mediaType || (doc.fileName ? 'document' : doc.externalLink ? 'link' : 'text');
    switch (media) {
      case 'pdf':
        return {
          icon: <FileText className="w-3.5 h-3.5 text-red-400" />,
          label: 'PDF Document',
          color: 'bg-red-500/20 text-red-300 border-red-500/40',
        };
      case 'video':
        return {
          icon: <Video className="w-3.5 h-3.5 text-indigo-400" />,
          label: 'Video Resource',
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        };
      case 'audio':
        return {
          icon: <Music className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Audio Briefing',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'image':
        return {
          icon: <ImageIcon className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Visual Evidence',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'link':
        return {
          icon: <LinkIcon className="w-3.5 h-3.5 text-sky-400" />,
          label: 'Web Link / Gazette',
          color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        };
      default:
        return {
          icon: <File className="w-3.5 h-3.5 text-slate-400" />,
          label: doc.fileName ? 'Document File' : 'Legal Directive',
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Lightbox Modal for Full Image View */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs p-4 flex items-center justify-center cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[90vh] bg-slate-900 rounded-3xl p-4 border border-amber-500/40 shadow-2xl space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-700">
              <span className="font-bold text-sm truncate">{lightboxImage.title}</span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[75vh] w-auto mx-auto rounded-xl object-contain shadow-md"
            />
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {pdfPreviewModal && (
        <div
          onClick={() => setPdfPreviewModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs p-4 flex items-center justify-center cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[85vh] bg-slate-900 rounded-3xl p-4 border border-red-500/40 shadow-2xl flex flex-col space-y-3 relative"
          >
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-red-400" />
                <span className="font-bold text-sm truncate">{pdfPreviewModal.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={pdfPreviewModal.url}
                  download={pdfPreviewModal.title || 'document.pdf'}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setPdfPreviewModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <iframe
              src={pdfPreviewModal.url}
              title={pdfPreviewModal.title}
              className="w-full flex-1 rounded-xl bg-white border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 kenya-ribbon" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'en'
                  ? 'The Raham Protocol • Multimodal AI Knowledgebase'
                  : 'The Raham Protocol • Hifadhidata ya Multimedia ya AI'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              {language === 'en' ? 'The Raham Protocol' : 'Itifaki ya Raham'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {language === 'en'
                ? 'Curated legal and operational knowledgebase established by The_Samaritan. Upload and manage PDFs, video tutorials, audio briefings, evidence photos, external links, and statutory directives that Operator AI learns from to guide answers, provide what-if precedents, and enforce constitutional accountability across Kenya.'
                : 'Mfumo maalum wa maarifa ya kisheria na kiutendaji ulioanzishwa na The_Samaritan. Pakia na usimamie PDF, video za maelekezo, rekodi za sauti, picha za ushahidi, viungo vya mtandao na miongozo ya sheria ambayo Operator AI inajifunza kwayo kutoa majibu sahihi kote nchini Kenya.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {isSamaritan && (
              <button
                type="button"
                onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isAddFormOpen
                    ? language === 'en'
                      ? 'Close Form'
                      : 'Funga Fomu'
                    : language === 'en'
                    ? 'Upload Materials (PDF, Video, Audio, Image, Link, Doc)'
                    : 'Pakia Nyenzo (PDF, Video, Sauti, Picha, Kiungo, Faili)'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
              title="Restore foundational directives"
            >
              <Layers className="w-4 h-4" />
              <span>{language === 'en' ? 'Reset Protocols' : 'Rejesha Awali'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-amber-500/20 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
              {language === 'en' ? 'Active Directives' : 'Miongozo Iliyopo'}
            </div>
            <div className="text-xl font-black text-white mt-0.5">{documents.length}</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
              {language === 'en' ? 'Multimodal Formats' : 'Aina za Faili'}
            </div>
            <div className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1">
              <span>PDF • Video • Audio • Images • Links • Docs</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
              {language === 'en' ? 'Primary Authority' : 'Mamlaka Kuu'}
            </div>
            <div className="text-sm font-bold text-amber-200 mt-1 truncate">
              The_Samaritan
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
              {language === 'en' ? 'Scope' : 'Eneo'}
            </div>
            <div className="text-sm font-bold text-white mt-1">The Republic of Kenya</div>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold hover:underline"
          >
            ✕
          </button>
        </div>
      )}

      {/* ADD / UPLOAD MATERIAL FORM */}
      {isAddFormOpen && (
        <div className="p-6 bg-white rounded-3xl border-2 border-amber-400 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  {language === 'en'
                    ? 'Upload Learning Material to The Raham Protocol'
                    : 'Pakia Nyenzo ya Kujifunzia kwa The Raham Protocol'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Upload PDFs, videos, audios, images, links, or documents (DOCX, Excel, TXT, JSON) for Operator AI to learn from.'
                    : 'Pakia PDF, video, rekodi za sauti, picha, viungo, au nyaraka (DOCX, Excel, TXT, JSON) ili Operator AI ijifunze.'}
                </p>
              </div>
            </div>

            {/* Mode switch */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setUploadMode('all_files')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadMode === 'all_files' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                {language === 'en' ? 'Upload Any File' : 'Pakia Faili'}
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('audio')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadMode === 'audio' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5 inline mr-1" />
                {language === 'en' ? 'Voice / Audio' : 'Sauti'}
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('link')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadMode === 'link' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
                {language === 'en' ? 'Web Link / Video URL' : 'Kiungo / URL'}
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('manual')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  uploadMode === 'manual' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                {language === 'en' ? 'Direct Text' : 'Maandishi'}
              </button>
            </div>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-5">
            {/* FILE UPLOAD DROPZONE */}
            {(uploadMode === 'all_files' || uploadMode === 'pdf' || uploadMode === 'video' || uploadMode === 'image' || uploadMode === 'document') && (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      {language === 'en' ? 'Select Material from Device:' : 'Chagua Nyenzo kutoka Kwenye Kifaa:'}
                    </span>
                    <span className="text-[11px] text-amber-800/80">
                      Supports PDFs, Videos (MP4/WebM/MOV), Audios (MP3/WAV/M4A), Images (PNG/JPG/WEBP), and Documents (DOC/DOCX/XLS/CSV/TXT/MD/JSON).
                    </span>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{language === 'en' ? 'Browse Files...' : 'Chagua Faili...'}</span>
                    <input
                      type="file"
                      accept=".pdf,.mp4,.webm,.mov,.mkv,.avi,.mp3,.wav,.m4a,.ogg,.aac,.flac,.png,.jpg,.jpeg,.webp,.svg,.gif,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.json,.ppt,.pptx,.odt,.rtf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Primary File preview banner */}
                {primaryFileName && (
                  <div className="p-3.5 bg-white rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                        {primaryMediaType === 'pdf' && <FileText className="w-5 h-5 text-red-600" />}
                        {primaryMediaType === 'video' && <Video className="w-5 h-5 text-indigo-600" />}
                        {primaryMediaType === 'audio' && <Music className="w-5 h-5 text-emerald-600" />}
                        {primaryMediaType === 'image' && <ImageIcon className="w-5 h-5 text-amber-600" />}
                        {primaryMediaType === 'document' && <File className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 truncate max-w-xs sm:max-w-md">
                          {primaryFileName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Format: <strong className="uppercase">{primaryMediaType}</strong> • Size: {formatFileSize(primaryFileSize)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {primaryMediaType === 'image' && primaryFileDataUrl && (
                        <button
                          type="button"
                          onClick={() => setLightboxImage({ url: primaryFileDataUrl, title: primaryFileName })}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      )}
                      {primaryMediaType === 'pdf' && primaryFileDataUrl && (
                        <button
                          type="button"
                          onClick={() => setPdfPreviewModal({ url: primaryFileDataUrl, title: primaryFileName })}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-100 text-red-900 hover:bg-red-200 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-600" />
                          <span>Preview PDF</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPrimaryFileName('');
                          setPrimaryFileDataUrl(undefined);
                          setPrimaryFileSize(undefined);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Video / Audio Player Preview in form */}
                {primaryMediaType === 'audio' && primaryFileDataUrl && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Audio Player Preview:
                    </label>
                    <audio controls src={primaryFileDataUrl} className="w-full h-9 rounded-lg shadow-xs" />
                  </div>
                )}
                {primaryMediaType === 'video' && primaryFileDataUrl && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Video Player Preview:
                    </label>
                    <video controls src={primaryFileDataUrl} className="w-full max-h-48 rounded-xl bg-black" />
                  </div>
                )}
              </div>
            )}

            {/* AUDIO & VOICE RECORDER MODE */}
            {uploadMode === 'audio' && (
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      {language === 'en' ? 'Record Voice Directive or Upload Audio:' : 'Rekodi Sauti au Pakia Faili ya Sauti:'}
                    </span>
                    <span className="text-[11px] text-emerald-800/80">
                      Record voice briefings with your microphone, or upload MP3, WAV, M4A, OGG files.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-emerald-200" />
                        <span>{language === 'en' ? 'Record Voice Directive' : 'Anza Kurekodi Sauti'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors animate-pulse cursor-pointer"
                      >
                        <Square className="w-4 h-4" />
                        <span>{language === 'en' ? `Stop & Save (${formatTimer(recordingSeconds)})` : `Simamisha (${formatTimer(recordingSeconds)})`}</span>
                      </button>
                    )}

                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Upload Audio File' : 'Pakia Sauti'}</span>
                      <input
                        type="file"
                        accept=".mp3,.wav,.m4a,.ogg,.aac,.flac,.wma"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Primary Audio preview */}
                {primaryMediaType === 'audio' && primaryFileDataUrl && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-emerald-600" />
                        <span>{primaryFileName || 'Voice Recording'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700">{formatFileSize(primaryFileSize)}</span>
                    </div>
                    <audio controls src={primaryFileDataUrl} className="w-full h-8" />
                  </div>
                )}
              </div>
            )}

            {/* EXTERNAL LINK MODE */}
            {uploadMode === 'link' && (
              <div className="p-4 sm:p-5 rounded-2xl border border-sky-300 bg-sky-50/50 space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-sky-950">
                    {language === 'en' ? 'External Legal Reference, Video or Audio Link *' : 'Kiungo cha Video, Sauti au Sheria *'}
                  </label>
                  <p className="text-[11px] text-sky-800">
                    Paste links from YouTube, Vimeo, Kenya Law Reports (http://kenyalaw.org), Kenya Gazette PDFs, Google Drive, or podcasts.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={formExternalLink}
                      onChange={(e) => setFormExternalLink(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or http://kenyalaw.org/kl/..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-sky-300 bg-white text-xs focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* If YouTube URL, preview */}
                {getYouTubeEmbedUrl(formExternalLink) && (
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-sky-900 mb-1">YouTube Video Preview:</span>
                    <iframe
                      src={getYouTubeEmbedUrl(formExternalLink)!}
                      title="YouTube Preview"
                      className="w-full h-48 rounded-xl border border-sky-300"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {/* STANDARD PROTOCOL METADATA FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Material Title *' : 'Kichwa cha Nyenzo *'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Raham Protocol 6: Community Land Injunctions & Riparian Access"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Category *' : 'Kitengo *'}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="constitution">Constitution & Bill of Rights</option>
                  <option value="human_rights">Human Rights Advocacy & Paralegals</option>
                  <option value="incident_reporting">Incident Reporting & Evidentiary Standards</option>
                  <option value="peace_advocacy">Peace Building & Social Media Narratives</option>
                  <option value="devolution">Devolution & County Assembly</option>
                  <option value="public_finance">Public Finance & Social Audits</option>
                  <option value="custom">Specialized / Custom Protocol</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Statutory & Constitutional Anchors' : 'Vifungu vya Katiba na Sheria'}
                </label>
                <input
                  type="text"
                  value={formAnchors}
                  onChange={(e) => setFormAnchors(e.target.value)}
                  placeholder="e.g. Article 22, Article 42, Evidence Act Cap 80, IPOA Act 2011"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Summary for Quick AI Indexing' : 'Muhtasari wa Haraka kwa AI'}
                </label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="A concise summary of what this material teaches or mandates..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Core Directives & Legal Rules (Full Content / Notes) *' : 'Miongozo Mikuu na Kanuni za Kisheria *'}
                </label>
                <textarea
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Detailed guidelines, operational steps, video/audio transcript notes, and binding rules for Operator AI to learn from..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'What-If Scenarios & Precedents (Optional)' : 'Hali za "Je-Iwapo" (Hiari)'}
                </label>
                <textarea
                  rows={3}
                  value={formWhatIf}
                  onChange={(e) => setFormWhatIf(e.target.value)}
                  placeholder="What if the officer refuses? What if the county claims emergency reallocation?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'en' ? 'Practical Real-World Example (Optional)' : 'Mfano Halisi wa Vitendo (Hiari)'}
                </label>
                <textarea
                  rows={3}
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  placeholder="Example: How a youth group in Kwale or Nairobi resolved this specific challenge..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* MULTI-ATTACHMENTS SECTION (PDFs, Videos, Audios, Images, Links, Documents) */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'en'
                      ? 'Additional Materials & Annexures (PDFs, Videos, Audios, Images, Links, Docs)'
                      : 'Nyenzo za Ziada (PDF, Video, Sauti, Picha, Viungo, Nyaraka)'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {attachments.length} {language === 'en' ? 'attached' : 'vimeambatishwa'}
                </span>
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 shrink-0">
                          {att.type}
                        </span>
                        <div className="truncate">
                          <strong className="block text-slate-800 truncate">{att.name}</strong>
                          {att.externalUrl ? (
                            <span className="text-[10px] text-slate-500 truncate block">{att.externalUrl}</span>
                          ) : att.sizeBytes ? (
                            <span className="text-[10px] text-slate-400 font-mono block">
                              File ({formatFileSize(att.sizeBytes)})
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {att.type === 'image' && att.dataUrl && (
                          <button
                            type="button"
                            onClick={() => setLightboxImage({ url: att.dataUrl!, title: att.name })}
                            className="p-1 text-slate-500 hover:text-amber-600"
                            title="Preview image"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Attachment Form Row */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700">
                    {language === 'en' ? 'Add Supplementary Attachment:' : 'Ongeza Kiambatisho cha Ziada:'}
                  </span>

                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-bold transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>{language === 'en' ? 'Attach File from Device' : 'Pakia Faili kutoka Kwenye Kifaa'}</span>
                    <input
                      type="file"
                      accept=".pdf,.mp4,.webm,.mov,.mp3,.wav,.m4a,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt,.json"
                      onChange={handleAttachmentFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={newAttName}
                    onChange={(e) => setNewAttName(e.target.value)}
                    placeholder="Attachment Name (e.g. Sample P3 Form, Video Clip)"
                    className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                  <select
                    value={newAttType}
                    onChange={(e) => setNewAttType(e.target.value as any)}
                    className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="link">Web Link / URL</option>
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="image">Image Evidence</option>
                    <option value="document">Document / Sheet</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newAttUrl}
                    onChange={(e) => setNewAttUrl(e.target.value)}
                    placeholder="External URL (optional if file uploaded above)"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={newAttDesc}
                    onChange={(e) => setNewAttDesc(e.target.value)}
                    placeholder="Description or notes for this attachment"
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* FORM FOOTER BUTTONS */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'Ghairi'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting
                    ? language === 'en'
                      ? 'Committing Material...'
                      : 'Inahifadhi...'
                    : language === 'en'
                    ? 'Commit to The Raham Protocol'
                    : 'Hifadhi kwenye Itifaki'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search Raham Protocol directives, documents, media...'
                  : 'Tafuta miongozo, faili, video, sauti...'
              }
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Media Format Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Materials', icon: Layers },
              { id: 'pdf', label: 'PDFs', icon: FileText },
              { id: 'video', label: 'Videos', icon: Video },
              { id: 'audio', label: 'Audios', icon: Music },
              { id: 'image', label: 'Images', icon: ImageIcon },
              { id: 'link', label: 'Links', icon: LinkIcon },
              { id: 'document', label: 'Documents', icon: File },
            ].map((m) => {
              const IconComp = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMediaType(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    selectedMediaType === m.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <IconComp className="w-3 h-3" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {['all', 'constitution', 'human_rights', 'incident_reporting', 'peace_advocacy', 'public_finance'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all'
                  ? language === 'en'
                    ? 'All Categories'
                    : 'Vitengo Vyote'
                  : cat === 'constitution'
                  ? 'Constitution'
                  : cat === 'human_rights'
                  ? 'Human Rights'
                  : cat === 'incident_reporting'
                  ? 'Incident Reports'
                  : cat === 'peace_advocacy'
                  ? 'Peace & Social Media'
                  : 'Public Finance'}
              </button>
            )
          )}
        </div>
      </div>

      {/* DIRECTIVES LIST WITH MULTIMEDIA PLAYERS & CARDS */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">
              {language === 'en' ? 'No materials match the selected filters.' : 'Hakuna nyenzo zilizolingana na utafutaji.'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'Try adjusting your search terms or media format filter.'
                : 'Jaribu kubadilisha maneno ya utafutaji au aina ya faili.'}
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isExpanded = expandedDocId === doc.id;
            const badge = getMediaBadge(doc);
            const youtubeEmbed = getYouTubeEmbedUrl(doc.externalLink);
            const vimeoEmbed = getVimeoEmbedUrl(doc.externalLink);

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:border-amber-300 space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Media format badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badge.color}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      {/* Topic Category */}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {doc.category.replace('_', ' ')}
                      </span>

                      {/* Statutory Anchor */}
                      <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                        {doc.statutoryAnchors}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>
                        {isExpanded
                          ? language === 'en'
                            ? 'Hide'
                            : 'Ficha'
                          : language === 'en'
                          ? 'View Details'
                          : 'Soma Zote'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isSamaritan && (
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete from protocol"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* INLINE MEDIA PLAYERS & PREVIEWS ON CARD */}
                {/* 1. Audio Player */}
                {doc.mediaType === 'audio' && (
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <div className="flex items-center gap-1.5">
                        <Music className="w-4 h-4 text-emerald-700" />
                        <span>{doc.fileName || 'Audio Briefing'}</span>
                      </div>
                      {doc.fileSizeBytes && (
                        <span className="text-[11px] text-emerald-700 font-mono">
                          {formatFileSize(doc.fileSizeBytes)}
                        </span>
                      )}
                    </div>
                    {doc.fileDataUrl ? (
                      <audio controls src={doc.fileDataUrl} className="w-full h-8 rounded-lg" />
                    ) : (
                      <div className="text-[11px] text-emerald-800 flex items-center gap-1.5">
                        <span>Audio briefing stored for Operator AI voice & dialogue synthesis.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Video Player & Embeds */}
                {doc.mediaType === 'video' && (
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                      <div className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-indigo-700" />
                        <span>{doc.fileName || 'Video Tutorial Resource'}</span>
                      </div>
                      {doc.fileSizeBytes && (
                        <span className="text-[11px] text-indigo-700 font-mono">
                          {formatFileSize(doc.fileSizeBytes)}
                        </span>
                      )}
                    </div>
                    {doc.fileDataUrl ? (
                      <video controls src={doc.fileDataUrl} className="w-full max-h-56 rounded-xl bg-black" />
                    ) : youtubeEmbed ? (
                      <div className="pt-1">
                        <iframe
                          src={youtubeEmbed}
                          title={doc.title}
                          className="w-full h-56 rounded-xl border border-indigo-300"
                          allowFullScreen
                        />
                      </div>
                    ) : vimeoEmbed ? (
                      <div className="pt-1">
                        <iframe
                          src={vimeoEmbed}
                          title={doc.title}
                          className="w-full h-56 rounded-xl border border-indigo-300"
                          allowFullScreen
                        />
                      </div>
                    ) : doc.externalLink ? (
                      <a
                        href={doc.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Watch Video on External Channel</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    ) : null}
                  </div>
                )}

                {/* 3. PDF Document Action Bar */}
                {doc.mediaType === 'pdf' && (
                  <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <strong className="block text-red-950">{doc.fileName || 'Statutory PDF Document'}</strong>
                        <span className="text-[11px] text-red-700 font-mono">
                          Certified PDF Reference {doc.fileSizeBytes ? `• ${formatFileSize(doc.fileSizeBytes)}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.fileDataUrl && (
                        <button
                          type="button"
                          onClick={() => setPdfPreviewModal({ url: doc.fileDataUrl!, title: doc.fileName || doc.title })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-red-700" />
                          <span>Preview PDF</span>
                        </button>
                      )}
                      {doc.fileDataUrl ? (
                        <a
                          href={doc.fileDataUrl}
                          download={doc.fileName || 'raham_protocol_document.pdf'}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      ) : doc.externalLink ? (
                        <a
                          href={doc.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Kenya Law PDF</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* 4. Image Thumbnail */}
                {doc.mediaType === 'image' && doc.fileDataUrl && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                    <img
                      src={doc.fileDataUrl}
                      alt={doc.title}
                      onClick={() => setLightboxImage({ url: doc.fileDataUrl!, title: doc.title })}
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-90 border border-amber-300 shadow-xs"
                    />
                    <div className="text-xs">
                      <strong className="block text-amber-950 font-bold">
                        {doc.fileName || 'Evidence / Infographic Image'}
                      </strong>
                      <span className="text-[11px] text-amber-800">Click thumbnail to enlarge lightbox</span>
                    </div>
                  </div>
                )}

                {/* 5. Document / Spreadsheets / Other Files */}
                {doc.mediaType === 'document' && doc.fileName && (
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      {doc.fileName.endsWith('.xlsx') || doc.fileName.endsWith('.xls') || doc.fileName.endsWith('.csv') ? (
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : doc.fileName.endsWith('.json') || doc.fileName.endsWith('.md') ? (
                        <FileCode className="w-5 h-5 text-purple-600 shrink-0" />
                      ) : (
                        <File className="w-5 h-5 text-slate-700 shrink-0" />
                      )}
                      <div>
                        <strong className="block text-slate-900">{doc.fileName}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {formatFileSize(doc.fileSizeBytes) || 'Official Operational Document'}
                        </span>
                      </div>
                    </div>
                    {doc.fileDataUrl && (
                      <a
                        href={doc.fileDataUrl}
                        download={doc.fileName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Document</span>
                      </a>
                    )}
                  </div>
                )}

                {/* 6. External Link Bar */}
                {doc.externalLink && doc.mediaType !== 'pdf' && doc.mediaType !== 'video' && (
                  <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <LinkIcon className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="text-sky-950 truncate font-mono text-[11px]">{doc.externalLink}</span>
                    </div>
                    <a
                      href={doc.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors shrink-0"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Expanded Material View */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-4 text-xs leading-relaxed">
                    <div>
                      <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Core Directives & Legal Rules:' : 'Miongozo Kamili ya Kisheria:'}
                      </h5>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-line font-normal">
                        {doc.fullContent}
                      </div>
                    </div>

                    {doc.whatIfScenarios && (
                      <div>
                        <h5 className="font-bold text-purple-900 text-[11px] uppercase tracking-wider mb-1">
                          {language === 'en' ? 'What-If Scenarios & Precedents:' : 'Hali za "Je-Iwapo":'}
                        </h5>
                        <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200 text-purple-950 whitespace-pre-line font-normal">
                          {doc.whatIfScenarios}
                        </div>
                      </div>
                    )}

                    {doc.practicalExamples && (
                      <div>
                        <h5 className="font-bold text-blue-900 text-[11px] uppercase tracking-wider mb-1">
                          {language === 'en' ? 'Practical Real-World Example:' : 'Mfano Halisi wa Vitendo:'}
                        </h5>
                        <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-blue-950 whitespace-pre-line font-normal">
                          {doc.practicalExamples}
                        </div>
                      </div>
                    )}

                    {/* Attached Multi-Documents List */}
                    {doc.attachments && doc.attachments.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-bold text-amber-950 text-[11px] uppercase tracking-wider">
                          {language === 'en'
                            ? 'Attached Multimedia Materials & Reference Files:'
                            : 'Faili na Viungo Vilivyoambatishwa:'}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {doc.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col justify-between gap-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 truncate">
                                  <span className="uppercase text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 shrink-0">
                                    {att.type}
                                  </span>
                                  <strong className="block text-slate-900 truncate text-xs">{att.name}</strong>
                                </div>
                                {att.sizeBytes && (
                                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                    {formatFileSize(att.sizeBytes)}
                                  </span>
                                )}
                              </div>

                              {att.description && (
                                <p className="text-[11px] text-slate-600 line-clamp-2">{att.description}</p>
                              )}

                              {/* Media previews for attachments */}
                              {att.type === 'audio' && att.dataUrl && (
                                <audio controls src={att.dataUrl} className="w-full h-7 mt-1" />
                              )}

                              {att.type === 'image' && att.dataUrl && (
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  onClick={() => setLightboxImage({ url: att.dataUrl!, title: att.name })}
                                  className="w-full h-24 object-cover rounded-lg cursor-pointer border border-amber-300"
                                />
                              )}

                              <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/50">
                                {att.type === 'image' && att.dataUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setLightboxImage({ url: att.dataUrl!, title: att.name })}
                                    className="px-2 py-0.5 rounded-md bg-amber-200 hover:bg-amber-300 text-amber-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Zoom</span>
                                  </button>
                                )}
                                {att.type === 'pdf' && att.dataUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setPdfPreviewModal({ url: att.dataUrl!, title: att.name })}
                                    className="px-2 py-0.5 rounded-md bg-red-100 hover:bg-red-200 text-red-900 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>View PDF</span>
                                  </button>
                                )}
                                {att.dataUrl && (
                                  <a
                                    href={att.dataUrl}
                                    download={att.name}
                                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </a>
                                )}
                                {att.externalUrl && (
                                  <a
                                    href={att.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold flex items-center gap-1"
                                  >
                                    <span>Open Link</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                      <span>Uploaded by: {doc.uploadedBy}</span>
                      <span>Date: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
