import { useState, useEffect, useCallback, useRef } from 'react';
import T from '../components/common/T';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { sendMessage, isApiKeyConfigured } from '../utils/gemini';
import {
  Plus, Trash2, Save, Eye, EyeOff, ChevronLeft, ChevronRight,
  Presentation, Check, GripVertical, ArrowUp, ArrowDown,
  Lightbulb, Users, BarChart2, TrendingUp, DollarSign,
  Target, Layers, Megaphone, FileText, Copy, Sparkles, Loader2,
  X, ChevronDown,
} from 'lucide-react';

const SLIDE_TYPES = [
  { value: 'cover',          label: 'Cover',         icon: Presentation, gradient: 'from-primary-600 to-primary-800',  hint: 'Business name, tagline, founder' },
  { value: 'problem',        label: 'Problem',        icon: Lightbulb,    gradient: 'from-red-500 to-red-700',          hint: 'The problem you solve' },
  { value: 'solution',       label: 'Solution',       icon: Check,        gradient: 'from-green-500 to-emerald-700',    hint: 'Your product or service' },
  { value: 'market',         label: 'Market',         icon: Target,       gradient: 'from-blue-500 to-blue-700',        hint: 'Target market & opportunity size' },
  { value: 'business-model', label: 'Business Model', icon: Layers,       gradient: 'from-purple-500 to-purple-700',    hint: 'How you make money' },
  { value: 'traction',       label: 'Traction',       icon: TrendingUp,   gradient: 'from-amber-500 to-amber-700',      hint: 'Revenue, customers, milestones' },
  { value: 'financials',     label: 'Financials',     icon: BarChart2,    gradient: 'from-teal-500 to-teal-700',        hint: 'Key numbers & projections' },
  { value: 'team',           label: 'Team',           icon: Users,        gradient: 'from-indigo-500 to-indigo-700',    hint: 'About the founder & team' },
  { value: 'ask',            label: 'The Ask',        icon: DollarSign,   gradient: 'from-emerald-500 to-emerald-700',  hint: 'Funding amount & use of funds' },
  { value: 'custom',         label: 'Custom',         icon: FileText,     gradient: 'from-warm-500 to-warm-700',        hint: 'Any additional content' },
];

function uid() { return `s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function makeSlide(type = 'custom') {
  const t = SLIDE_TYPES.find(s => s.value === type) ?? SLIDE_TYPES[0];
  return { id: uid(), type, title: t.label, content: '', bullets: ['', '', ''] };
}

function getTypeInfo(type) {
  return SLIDE_TYPES.find(s => s.value === type) ?? SLIDE_TYPES[0];
}

// Mini visual slide preview card
function SlideCard({ slide, index, active, onClick }) {
  const t = getTypeInfo(slide.type);
  const bullets = (slide.bullets ?? []).filter(b => b.trim());
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-150 group ${
        active
          ? 'border-primary-500 shadow-lg shadow-primary-100 scale-[1.02]'
          : 'border-warm-200 hover:border-primary-300 hover:shadow-md'
      }`}
    >
      {/* Slide header strip */}
      <div className={`bg-gradient-to-r ${t.gradient} px-3 pt-2.5 pb-1.5`}>
        <div className="flex items-center gap-1.5 mb-1">
          <t.icon size={11} className="text-white/80 shrink-0" />
          <span className="text-white/80 text-[9px] font-bold uppercase tracking-wide truncate">{t.label}</span>
        </div>
        <p className="text-white text-[11px] font-semibold leading-tight truncate">{slide.title || t.label}</p>
      </div>
      {/* Content preview */}
      <div className="bg-white px-2.5 py-2 min-h-[36px]">
        {slide.content ? (
          <p className="text-[9px] text-warm-600 line-clamp-2 leading-relaxed">{slide.content}</p>
        ) : bullets.length > 0 ? (
          <div className="space-y-0.5">
            {bullets.slice(0, 2).map((b, i) => (
              <p key={i} className="text-[9px] text-warm-500 truncate">• {b}</p>
            ))}
          </div>
        ) : (
          <p className="text-[9px] text-warm-300 italic">{t.hint}</p>
        )}
      </div>
      {/* Slide number badge */}
      <div className={`absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
        active ? 'bg-primary-500 text-white' : 'bg-black/25 text-white'
      }`}>
        {index + 1}
      </div>
    </button>
  );
}

// Live slide preview panel (shows how the slide looks when presented)
function SlidePreviewPane({ slide }) {
  if (!slide) return null;
  const t = getTypeInfo(slide.type);
  const bullets = (slide.bullets ?? []).filter(b => b.trim());

  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br ${t.gradient} flex flex-col`} style={{ aspectRatio: '16/9' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
          <t.icon size={14} className="text-white" />
        </div>
        <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{t.label}</span>
      </div>
      {/* Title */}
      <div className="px-6 pb-3 shrink-0">
        <h2 className="text-white font-black leading-tight" style={{ fontSize: 'clamp(16px, 3.5vw, 28px)' }}>
          {slide.title || t.label}
        </h2>
      </div>
      {/* Body */}
      <div className="flex-1 mx-4 mb-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 overflow-hidden">
        {slide.content && (
          <p className="text-white/90 leading-relaxed mb-3" style={{ fontSize: 'clamp(9px, 1.5vw, 13px)' }}>
            {slide.content}
          </p>
        )}
        {bullets.length > 0 && (
          <ul className="space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center text-white font-bold shrink-0 mt-0.5" style={{ fontSize: '8px' }}>{i + 1}</span>
                <span className="text-white/85" style={{ fontSize: 'clamp(8px, 1.3vw, 12px)' }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {!slide.content && bullets.length === 0 && (
          <p className="text-white/30 italic" style={{ fontSize: 'clamp(9px, 1.3vw, 12px)' }}>{t.hint}</p>
        )}
      </div>
    </div>
  );
}

// Slide editor form
function SlideEditor({ slide, onChange, onAIAssist, aiLoading }) {
  const t = getTypeInfo(slide.type);

  const updateBullet = (i, val) => {
    const bullets = [...(slide.bullets ?? ['', '', ''])];
    bullets[i] = val;
    onChange({ ...slide, bullets });
  };

  const addBullet = () => onChange({ ...slide, bullets: [...(slide.bullets ?? []), ''] });
  const removeBullet = i => onChange({ ...slide, bullets: slide.bullets.filter((_, idx) => idx !== i) });

  const inputClass = 'w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all bg-white';

  return (
    <div className="space-y-5">
      {/* Slide type grid */}
      <div>
        <label className="block text-xs font-bold text-warm-500 uppercase tracking-wider mb-2"><T>Slide Type</T></label>
        <div className="grid grid-cols-5 gap-1.5">
          {SLIDE_TYPES.map(st => (
            <button
              key={st.value}
              onClick={() => onChange({
                ...slide,
                type: st.value,
                title: slide.title === getTypeInfo(slide.type).label ? st.label : slide.title,
              })}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${
                slide.type === st.value
                  ? 'border-primary-400 bg-primary-50 shadow-sm'
                  : 'border-warm-200 hover:border-primary-200 hover:bg-warm-50'
              }`}
            >
              <st.icon size={13} className={slide.type === st.value ? 'text-primary-500' : 'text-warm-400'} />
              <span className={`text-[8px] font-semibold leading-tight ${slide.type === st.value ? 'text-primary-600' : 'text-warm-500'}`}>
                {st.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-warm-500 uppercase tracking-wider mb-1.5"><T>Slide Title</T></label>
        <input
          value={slide.title}
          onChange={e => onChange({ ...slide, title: e.target.value })}
          placeholder={t.label}
          className={inputClass}
        />
      </div>

      {/* Main content + AI assist */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-warm-500 uppercase tracking-wider"><T>Main Content</T></label>
          {isApiKeyConfigured() && (
            <button
              onClick={onAIAssist}
              disabled={aiLoading}
              className="flex items-center gap-1 text-[11px] text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-2 py-1 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
              <T>AI Suggest</T>
            </button>
          )}
        </div>
        <textarea
          value={slide.content}
          onChange={e => onChange({ ...slide, content: e.target.value })}
          placeholder={t.hint}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Bullet points */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-warm-500 uppercase tracking-wider">
            <T>Key Points</T> <span className="text-warm-400 font-normal normal-case">(<T>optional</T>)</span>
          </label>
          <button
            onClick={addBullet}
            disabled={(slide.bullets?.length ?? 0) >= 6}
            className="text-[11px] text-primary-500 hover:text-primary-700 font-semibold disabled:opacity-40"
          >
            + <T>Add point</T>
          </button>
        </div>
        <div className="space-y-2">
          {(slide.bullets ?? []).map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical size={13} className="text-warm-300 shrink-0" />
              <input
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                placeholder={`Point ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              <button
                onClick={() => removeBullet(i)}
                className="p-1 text-warm-300 hover:text-red-400 transition-colors shrink-0 rounded"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Full-screen presentation modal
function PresentationModal({ slides, onClose }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const t = getTypeInfo(slide?.type);
  const bullets = (slide?.bullets ?? []).filter(b => b.trim());

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setIdx(i => Math.min(slides.length - 1, i + 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setIdx(i => Math.max(0, i - 1));
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, onClose]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-black/40">
        <div className="flex items-center gap-2">
          <t.icon size={16} className="text-white/60" />
          <span className="text-white/60 text-sm font-medium">{slide?.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">{idx + 1} / {slides.length}</span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Slide */}
      <div className="w-full max-w-5xl">
        <div className={`bg-gradient-to-br ${t.gradient} rounded-3xl shadow-2xl overflow-hidden`} style={{ minHeight: '500px' }}>
          <div className="px-12 pt-14 pb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <t.icon size={22} className="text-white" />
              </div>
              <span className="text-white/60 text-sm font-bold uppercase tracking-widest">{t.label}</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">{slide?.title || t.label}</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-sm mx-8 mb-10 rounded-2xl p-8">
            {slide?.content && (
              <p className="text-white text-xl leading-relaxed mb-6">{slide.content}</p>
            )}
            {bullets.length > 0 && (
              <ul className="space-y-4">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-white/90 text-lg">{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {!slide?.content && bullets.length === 0 && (
              <p className="text-white/30 italic text-lg"><T>No content added yet</T></p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-6 py-3 rounded-2xl transition-colors font-semibold"
          >
            <ChevronLeft size={20} /> <T>Prev</T>
          </button>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'bg-white w-6 h-2.5' : 'bg-white/35 w-2.5 h-2.5'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx(i => Math.min(slides.length - 1, i + 1))}
            disabled={idx === slides.length - 1}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-6 py-3 rounded-2xl transition-colors font-semibold"
          >
            <T>Next</T> <ChevronRight size={20} />
          </button>
        </div>
        <p className="text-center text-white/30 text-xs mt-3"><T>Use ← → arrow keys to navigate</T></p>
      </div>
    </div>
  );
}

export default function PitchDeck() {
  const { user, userProfile } = useAuth();
  const [deckTitle, setDeckTitle] = useState('My Pitch Deck');
  const [slides, setSlides] = useState([
    makeSlide('cover'), makeSlide('problem'), makeSlide('solution'), makeSlide('ask'),
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedState, setSavedState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const autoSaveTimer = useRef(null);

  // Load deck from Firestore
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'pitchDecks', user.uid)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setDeckTitle(data.title ?? 'My Pitch Deck');
        setSlides(data.slides ?? slides);
      }
      setLoading(false);
    });
  }, [user?.uid]);

  // Auto-save with 2.5s debounce
  useEffect(() => {
    if (loading) return;
    clearTimeout(autoSaveTimer.current);
    setSavedState('idle');
    autoSaveTimer.current = setTimeout(() => {
      saveToFirestore(true);
    }, 2500);
    return () => clearTimeout(autoSaveTimer.current);
  }, [slides, deckTitle, loading]);

  const activeSlide = slides[activeIdx];

  async function saveToFirestore(isAuto = false) {
    if (!user) return;
    setSavedState('saving');
    try {
      await setDoc(doc(db, 'pitchDecks', user.uid), {
        title: deckTitle,
        slides,
        updatedAt: new Date().toISOString(),
        ownerName: userProfile?.displayName ?? user.email,
      });
      setSavedState('saved');
      setTimeout(() => setSavedState('idle'), isAuto ? 2000 : 3000);
    } catch {
      setSavedState('idle');
    }
  }

  const updateSlide = useCallback(updated =>
    setSlides(ss => ss.map((s, i) => i === activeIdx ? updated : s)),
    [activeIdx]
  );

  const addSlide = (type = 'custom') => {
    const ns = makeSlide(type);
    setSlides(ss => [...ss, ns]);
    setActiveIdx(slides.length);
    setShowAddPanel(false);
  };

  const duplicateSlide = (idx) => {
    const copy = { ...slides[idx], id: uid() };
    const next = [...slides];
    next.splice(idx + 1, 0, copy);
    setSlides(next);
    setActiveIdx(idx + 1);
  };

  const removeSlide = idx => {
    if (slides.length === 1) return;
    setSlides(ss => ss.filter((_, i) => i !== idx));
    setActiveIdx(ai => Math.min(ai, slides.length - 2));
  };

  const moveSlide = (idx, dir) => {
    const next = [...slides];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setSlides(next);
    if (activeIdx === idx) setActiveIdx(swap);
    else if (activeIdx === swap) setActiveIdx(idx);
  };

  // Keyboard navigation for slides
  useEffect(() => {
    function onKey(e) {
      if (previewing) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setActiveIdx(i => Math.min(slides.length - 1, i + 1));
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setActiveIdx(i => Math.max(0, i - 1));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slides.length, previewing]);

  // AI assist for slide content
  async function handleAIAssist() {
    if (!activeSlide || aiLoading) return;
    setAiLoading(true);
    const slideInfo = getTypeInfo(activeSlide.type);
    const prompt = `Generate concise pitch deck content for the "${activeSlide.title || slideInfo.label}" slide of a business pitch. The slide hint: "${slideInfo.hint}". Current title: "${activeSlide.title}". Give a 2-3 sentence main content paragraph and 3 key bullet points. Format: [CONTENT]: ... [BULLETS]: • ... • ... • ...`;
    const result = await sendMessage(prompt);
    if (result.success) {
      const text = result.data;
      const contentMatch = text.match(/\[CONTENT\]:\s*([\s\S]*?)(?=\[BULLETS\]|$)/);
      const bulletsMatch = text.match(/\[BULLETS\]:\s*([\s\S]*?)$/);
      const content = contentMatch ? contentMatch[1].trim() : text;
      const bulletsRaw = bulletsMatch ? bulletsMatch[1].trim() : '';
      const bullets = bulletsRaw
        .split('\n')
        .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 5);
      updateSlide({
        ...activeSlide,
        content: content || activeSlide.content,
        bullets: bullets.length > 0 ? bullets : activeSlide.bullets,
      });
    }
    setAiLoading(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const saveButtonLabel = savedState === 'saving' ? 'Saving…' : savedState === 'saved' ? 'Saved' : 'Save';

  return (
    <div className="flex flex-col h-full gap-0">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-amber-500 rounded-2xl p-5 mb-5 shadow-lg shrink-0">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Presentation size={20} className="text-white/80 shrink-0" />
            <input
              value={deckTitle}
              onChange={e => setDeckTitle(e.target.value)}
              className="bg-transparent text-white text-xl font-bold placeholder-white/50 focus:outline-none border-b border-white/30 focus:border-white/80 transition-colors min-w-0 flex-1"
              placeholder="Deck title…"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white/50 text-xs hidden sm:inline">
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setPreviewing(true)}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <Eye size={14} />
              <T>Present</T>
            </button>
            <button
              onClick={() => saveToFirestore(false)}
              disabled={savedState === 'saving'}
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm disabled:opacity-60 ${
                savedState === 'saved'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-primary-700 hover:bg-primary-50'
              }`}
            >
              {savedState === 'saved' ? <Check size={14} /> : <Save size={14} />}
              <T>{saveButtonLabel}</T>
            </button>
          </div>
        </div>
        {/* Auto-save indicator */}
        {savedState === 'saving' && (
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 text-white/50 text-xs">
            <Loader2 size={10} className="animate-spin" />
            <T>Auto-saving…</T>
          </div>
        )}
        {savedState === 'saved' && (
          <div className="absolute bottom-2 right-4 flex items-center gap-1.5 text-white/50 text-xs">
            <Check size={10} />
            <T>Auto-saved</T>
          </div>
        )}
      </div>

      {/* Three-column layout */}
      <div className="flex gap-4 flex-1 min-h-0">

        {/* Left: Slide list */}
        <div className="w-48 shrink-0 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">
              <T>Slides</T> <span className="text-warm-300">({slides.length})</span>
            </p>
            <button
              onClick={() => setShowAddPanel(p => !p)}
              className={`p-1 rounded-lg transition-colors ${showAddPanel ? 'bg-primary-100 text-primary-600' : 'text-warm-400 hover:text-warm-700 hover:bg-warm-100'}`}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add slide panel */}
          {showAddPanel && (
            <div className="bg-white rounded-xl border border-warm-200 shadow-lg p-2 space-y-1">
              <p className="text-[9px] font-bold text-warm-400 uppercase tracking-wider px-1 mb-1.5"><T>Add Slide</T></p>
              {SLIDE_TYPES.map(st => (
                <button
                  key={st.value}
                  onClick={() => addSlide(st.value)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-primary-50 text-warm-600 hover:text-primary-700 rounded-lg transition-colors text-xs font-medium"
                >
                  <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${st.gradient} flex items-center justify-center`}>
                    <st.icon size={10} className="text-white" />
                  </div>
                  {st.label}
                </button>
              ))}
            </div>
          )}

          {/* Slide list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {slides.map((slide, i) => (
              <div key={slide.id} className="relative group">
                <SlideCard
                  slide={slide}
                  index={i}
                  active={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                />
                {/* Hover actions */}
                <div className="absolute top-1.5 right-1.5 hidden group-hover:flex items-center gap-0.5 bg-white/95 rounded-lg shadow border border-warm-100 p-0.5">
                  <button
                    onClick={() => moveSlide(i, -1)}
                    disabled={i === 0}
                    className="p-1 text-warm-400 hover:text-warm-700 disabled:opacity-25 rounded transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={9} />
                  </button>
                  <button
                    onClick={() => moveSlide(i, 1)}
                    disabled={i === slides.length - 1}
                    className="p-1 text-warm-400 hover:text-warm-700 disabled:opacity-25 rounded transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={9} />
                  </button>
                  <button
                    onClick={() => duplicateSlide(i)}
                    className="p-1 text-warm-400 hover:text-blue-500 rounded transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={9} />
                  </button>
                  <button
                    onClick={() => removeSlide(i)}
                    disabled={slides.length === 1}
                    className="p-1 text-warm-400 hover:text-red-500 disabled:opacity-25 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={9} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick add bottom */}
          {!showAddPanel && (
            <button
              onClick={() => addSlide('custom')}
              className="shrink-0 w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-warm-300 hover:border-primary-400 text-warm-400 hover:text-primary-500 rounded-xl text-xs font-medium transition-all"
            >
              <Plus size={12} /> <T>Add Slide</T>
            </button>
          )}
        </div>

        {/* Center: Live preview pane */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider shrink-0"><T>Preview</T></p>
          <div className="flex-1 min-h-0 flex items-center">
            <div className="w-full">
              <SlidePreviewPane slide={activeSlide} />
              {/* Slide navigation arrows */}
              <div className="flex items-center justify-center gap-4 mt-3">
                <button
                  onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                  disabled={activeIdx === 0}
                  className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-warm-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-warm-400 font-medium">{activeIdx + 1} / {slides.length}</span>
                <button
                  onClick={() => setActiveIdx(i => Math.min(slides.length - 1, i + 1))}
                  disabled={activeIdx === slides.length - 1}
                  className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-warm-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="w-80 shrink-0 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider"><T>Edit Slide</T></p>
            {activeSlide && (
              <div className="flex items-center gap-1">
                {(() => {
                  const t = getTypeInfo(activeSlide.type);
                  return (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r ${t.gradient}`}>
                      <t.icon size={10} className="text-white" />
                      <span className="text-white text-[9px] font-bold">{t.label}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-warm-50 rounded-2xl border border-warm-200 p-4 shadow-sm">
            {activeSlide ? (
              <SlideEditor
                slide={activeSlide}
                onChange={updated => updateSlide(updated)}
                onAIAssist={handleAIAssist}
                aiLoading={aiLoading}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-warm-400 text-sm">
                <T>Select a slide to edit</T>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewing && (
        <PresentationModal
          slides={slides.filter(s => s.title || s.content)}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  );
}
