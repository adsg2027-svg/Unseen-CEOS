import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import {
  Plus, Trash2, Save, Eye, EyeOff, ChevronLeft, ChevronRight,
  Presentation, Check, GripVertical, ArrowLeft, ArrowRight,
  Lightbulb, Users, BarChart2, TrendingUp, DollarSign,
  Target, Layers, Megaphone, FileText,
} from 'lucide-react';

const SLIDE_TYPES = [
  { value: 'cover',         label: 'Cover',          icon: Presentation, gradient: 'from-primary-600 to-primary-800',   hint: 'Business name, tagline, founder' },
  { value: 'problem',       label: 'Problem',         icon: Lightbulb,    gradient: 'from-red-500 to-red-700',           hint: 'The problem you solve' },
  { value: 'solution',      label: 'Solution',        icon: Check,        gradient: 'from-green-500 to-emerald-700',     hint: 'Your product or service' },
  { value: 'market',        label: 'Market',          icon: Target,       gradient: 'from-blue-500 to-blue-700',         hint: 'Target market & opportunity size' },
  { value: 'business-model',label: 'Business Model',  icon: Layers,       gradient: 'from-purple-500 to-purple-700',     hint: 'How you make money' },
  { value: 'traction',      label: 'Traction',        icon: TrendingUp,   gradient: 'from-amber-500 to-amber-700',       hint: 'Revenue, customers, milestones' },
  { value: 'financials',    label: 'Financials',      icon: BarChart2,    gradient: 'from-teal-500 to-teal-700',         hint: 'Key numbers & projections' },
  { value: 'team',          label: 'Team',            icon: Users,        gradient: 'from-indigo-500 to-indigo-700',     hint: 'About the founder & team' },
  { value: 'ask',           label: 'The Ask',         icon: DollarSign,   gradient: 'from-emerald-500 to-emerald-700',   hint: 'Funding amount & use of funds' },
  { value: 'custom',        label: 'Custom Slide',    icon: FileText,     gradient: 'from-warm-500 to-warm-700',         hint: 'Any additional content' },
];

function uid() { return `s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

function makeSlide(type = 'custom') {
  const t = SLIDE_TYPES.find(s => s.value === type) ?? SLIDE_TYPES[0];
  return { id: uid(), type, title: t.label, content: '', bullets: ['', '', ''] };
}

function SlidePreview({ slide, index, active, onClick }) {
  const t = SLIDE_TYPES.find(s => s.value === slide.type) ?? SLIDE_TYPES[0];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl overflow-hidden border-2 transition-all ${
        active ? 'border-primary-500 shadow-md' : 'border-warm-200 hover:border-primary-300'
      }`}
    >
      <div className={`bg-gradient-to-br ${t.gradient} p-3 flex items-center gap-2`}>
        <t.icon size={14} className="text-white/80 shrink-0" />
        <span className="text-white text-xs font-semibold truncate">{slide.title || t.label}</span>
      </div>
      <div className="bg-white px-3 py-2">
        <p className="text-[10px] text-warm-500 line-clamp-2">{slide.content || t.hint}</p>
      </div>
    </button>
  );
}

function SlideEditor({ slide, onChange }) {
  const t = SLIDE_TYPES.find(s => s.value === slide.type) ?? SLIDE_TYPES[0];

  const updateBullet = (i, val) => {
    const bullets = [...(slide.bullets ?? ['', '', ''])];
    bullets[i] = val;
    onChange({ ...slide, bullets });
  };

  const addBullet = () => onChange({ ...slide, bullets: [...(slide.bullets ?? []), ''] });
  const removeBullet = i => onChange({ ...slide, bullets: slide.bullets.filter((_, idx) => idx !== i) });

  const inputClass = 'w-full border border-warm-200 rounded-lg px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all';

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div>
        <label className="block text-xs font-semibold text-warm-600 mb-2">Slide Type</label>
        <div className="grid grid-cols-5 gap-1.5">
          {SLIDE_TYPES.map(st => (
            <button
              key={st.value}
              onClick={() => onChange({ ...slide, type: st.value, title: slide.title === SLIDE_TYPES.find(x => x.value === slide.type)?.label ? st.label : slide.title })}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all ${
                slide.type === st.value
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-warm-200 hover:border-primary-200 hover:bg-warm-50'
              }`}
            >
              <st.icon size={14} className={slide.type === st.value ? 'text-primary-500' : 'text-warm-400'} />
              <span className={`text-[9px] font-medium leading-tight ${slide.type === st.value ? 'text-primary-600' : 'text-warm-500'}`}>
                {st.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-warm-600 mb-1">Slide Title</label>
        <input
          value={slide.title}
          onChange={e => onChange({ ...slide, title: e.target.value })}
          placeholder={t.label}
          className={inputClass}
        />
      </div>

      {/* Main content */}
      <div>
        <label className="block text-xs font-semibold text-warm-600 mb-1">Main Content</label>
        <textarea
          value={slide.content}
          onChange={e => onChange({ ...slide, content: e.target.value })}
          placeholder={t.hint}
          rows={4}
          className={inputClass}
        />
      </div>

      {/* Bullet points */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-warm-600">Key Points <span className="text-warm-400 font-normal">(optional)</span></label>
          <button onClick={addBullet} className="text-[11px] text-primary-500 hover:text-primary-700 font-medium">+ Add point</button>
        </div>
        <div className="space-y-2">
          {(slide.bullets ?? []).map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical size={14} className="text-warm-300 shrink-0" />
              <input
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                placeholder={`Point ${i + 1}`}
                className={`${inputClass} flex-1`}
              />
              <button onClick={() => removeBullet(i)} className="p-1 text-warm-300 hover:text-red-400 transition-colors shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PresentationModal({ slides, onClose }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const t = SLIDE_TYPES.find(s => s.value === slide?.type) ?? SLIDE_TYPES[0];
  const bullets = (slide?.bullets ?? []).filter(b => b.trim());

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="text-white/60 text-sm">{idx + 1} / {slides.length}</span>
        <button onClick={onClose} className="text-white/70 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
          Close
        </button>
      </div>

      {/* Slide */}
      <div className="w-full max-w-4xl">
        <div className={`bg-gradient-to-br ${t.gradient} rounded-2xl shadow-2xl overflow-hidden`} style={{ minHeight: '480px' }}>
          {/* Header band */}
          <div className="px-10 pt-12 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <t.icon size={20} className="text-white" />
              </div>
              <span className="text-white/70 text-sm font-semibold uppercase tracking-widest">{t.label}</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">{slide?.title || t.label}</h2>
          </div>

          {/* Body */}
          <div className="bg-white/10 backdrop-blur-sm mx-6 mb-8 rounded-xl p-8">
            {slide?.content && (
              <p className="text-white text-lg leading-relaxed mb-6">{slide.content}</p>
            )}
            {bullets.length > 0 && (
              <ul className="space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-white/90 text-base">{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {!slide?.content && bullets.length === 0 && (
              <p className="text-white/40 italic">No content added yet</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-5 py-2.5 rounded-xl transition-colors font-medium"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/40'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIdx(i => Math.min(slides.length - 1, i + 1))}
            disabled={idx === slides.length - 1}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-5 py-2.5 rounded-xl transition-colors font-medium"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PitchDeck() {
  const { user, userProfile } = useAuth();
  const [deckTitle, setDeckTitle] = useState('My Pitch Deck');
  const [slides, setSlides]       = useState([makeSlide('cover'), makeSlide('problem'), makeSlide('solution'), makeSlide('ask')]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(true);

  // Load existing deck from Firestore
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

  const activeSlide = slides[activeIdx];

  const updateSlide = updated =>
    setSlides(ss => ss.map((s, i) => i === activeIdx ? updated : s));

  const addSlide = (type = 'custom') => {
    const ns = makeSlide(type);
    setSlides(ss => [...ss, ns]);
    setActiveIdx(slides.length);
    setSaved(false);
  };

  const removeSlide = idx => {
    if (slides.length === 1) return;
    setSlides(ss => ss.filter((_, i) => i !== idx));
    setActiveIdx(ai => Math.min(ai, slides.length - 2));
    setSaved(false);
  };

  const moveSlide = (idx, dir) => {
    const next = [...slides];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setSlides(next);
    if (activeIdx === idx) setActiveIdx(swap);
    else if (activeIdx === swap) setActiveIdx(idx);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pitchDecks', user.uid), {
        title: deckTitle,
        slides,
        updatedAt: new Date().toISOString(),
        ownerName: userProfile?.displayName ?? user.email,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-5 mb-6 shadow-lg shrink-0">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Presentation size={20} className="text-white/80 shrink-0" />
            <input
              value={deckTitle}
              onChange={e => { setDeckTitle(e.target.value); setSaved(false); }}
              className="bg-transparent text-white text-xl font-bold placeholder-white/50 focus:outline-none border-b border-white/30 focus:border-white/70 transition-colors min-w-0 flex-1"
              placeholder="Deck title…"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPreviewing(true)}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
            >
              <Eye size={14} />
              Present
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm disabled:opacity-60"
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor layout */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Slide list panel */}
        <div className="w-52 shrink-0 flex flex-col gap-3">
          <p className="text-xs font-bold text-warm-500 uppercase tracking-wider">Slides ({slides.length})</p>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {slides.map((slide, i) => (
              <div key={slide.id} className="relative group">
                <SlidePreview slide={slide} index={i} active={i === activeIdx} onClick={() => setActiveIdx(i)} />
                <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5 bg-white rounded-lg shadow-sm border border-warm-200 p-0.5">
                  <button onClick={() => moveSlide(i, -1)} disabled={i === 0} className="p-1 text-warm-400 hover:text-warm-700 disabled:opacity-30 rounded">
                    <ArrowLeft size={10} />
                  </button>
                  <button onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1} className="p-1 text-warm-400 hover:text-warm-700 disabled:opacity-30 rounded">
                    <ArrowRight size={10} />
                  </button>
                  <button onClick={() => removeSlide(i)} className="p-1 text-warm-400 hover:text-red-500 rounded">
                    <Trash2 size={10} />
                  </button>
                </div>
                <span className="absolute top-2 left-2 bg-black/30 text-white text-[9px] font-bold px-1 rounded pointer-events-none">{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Quick-add buttons */}
          <div className="shrink-0">
            <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider mb-1.5">Add Slide</p>
            <div className="grid grid-cols-2 gap-1">
              {SLIDE_TYPES.slice(0, 6).map(t => (
                <button
                  key={t.value}
                  onClick={() => addSlide(t.value)}
                  className="flex items-center gap-1 px-2 py-1.5 bg-warm-50 hover:bg-primary-50 border border-warm-200 hover:border-primary-300 rounded-lg text-[10px] font-medium text-warm-600 hover:text-primary-600 transition-all"
                >
                  <t.icon size={10} />
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => addSlide('custom')}
              className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-warm-300 hover:border-primary-400 text-warm-400 hover:text-primary-500 rounded-xl text-xs font-medium transition-all"
            >
              <Plus size={12} /> Custom Slide
            </button>
          </div>
        </div>

        {/* Slide editor */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-warm-200 shadow-sm overflow-y-auto p-6">
          {activeSlide ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {(() => { const t = SLIDE_TYPES.find(s => s.value === activeSlide.type) ?? SLIDE_TYPES[0]; return <div className={`p-2 rounded-lg bg-gradient-to-br ${t.gradient}`}><t.icon size={16} className="text-white" /></div>; })()}
                  <div>
                    <p className="text-sm font-semibold text-warm-900">{activeSlide.title || 'Untitled'}</p>
                    <p className="text-xs text-warm-400">Slide {activeIdx + 1} of {slides.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                    disabled={activeIdx === 0}
                    className="p-1.5 text-warm-400 hover:text-warm-700 hover:bg-warm-100 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveIdx(i => Math.min(slides.length - 1, i + 1))}
                    disabled={activeIdx === slides.length - 1}
                    className="p-1.5 text-warm-400 hover:text-warm-700 hover:bg-warm-100 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <SlideEditor
                slide={activeSlide}
                onChange={updated => { updateSlide(updated); setSaved(false); }}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-warm-400 text-sm">
              Select a slide to edit
            </div>
          )}
        </div>
      </div>

      {previewing && (
        <PresentationModal slides={slides.filter(s => s.title || s.content)} onClose={() => setPreviewing(false)} />
      )}
    </div>
  );
}
