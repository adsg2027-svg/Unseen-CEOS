import { useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import TemplateForm from '../components/builder/TemplateForm';
import AIChatbot from '../components/builder/AIChatbot';

export default function BusinessPlanBuilder() {
  const { getEntrepreneurById } = useData();
  const [selectedId, setSelectedId] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const selectedEntrepreneur = selectedId ? getEntrepreneurById(selectedId) : null;

  return (
    <div>
      {/* Gradient page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-200/20 rounded-full blur-lg pointer-events-none" />
        <div className="relative z-10 anim-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={15} className="text-white/75" />
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">AI-Assisted Planning</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Business Plan Builder</h1>
          <p className="text-white/70 text-sm mt-1">
            Create revenue models, unit economics, and working capital estimates with AI assistance
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:block">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
            <Lightbulb size={24} className="text-white/80" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl anim-fade-in-up delay-100">
        <TemplateForm
          selectedEntrepreneur={selectedEntrepreneur}
          onSelectEntrepreneur={setSelectedId}
        />
      </div>

      <AIChatbot
        entrepreneur={selectedEntrepreneur}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
      />
    </div>
  );
}
