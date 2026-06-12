import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target, ArrowLeftRight, Activity } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SECTORS } from '../data/mockData';
import Card from '../components/common/Card';
import ScoreCard from '../components/agency/ScoreCard';
import AgencyRadarChart from '../components/agency/RadarChart';
import ScoreBreakdown from '../components/agency/ScoreBreakdown';
import T from '../components/common/T';
import { useT } from '../components/common/T';

export default function AgencyScore() {
  const { entrepreneurs, comparisonIds, dispatch } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('highest');
  const [sectorFilter, setSectorFilter] = useState('all');
  const selectedId = searchParams.get('id');
  const tp = useT();

  const filtered = useMemo(() => {
    let result = [...entrepreneurs];
    if (sectorFilter !== 'all') result = result.filter(e => e.sector === sectorFilter);
    result.sort((a, b) => {
      if (sortBy === 'highest') return b.agencyScore.percentage - a.agencyScore.percentage;
      if (sortBy === 'lowest') return a.agencyScore.percentage - b.agencyScore.percentage;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [entrepreneurs, sortBy, sectorFilter]);

  const selectedEntrepreneur = selectedId ? entrepreneurs.find(e => e.id === selectedId) : null;
  const comparisonEntrepreneurs = comparisonIds.map(id => entrepreneurs.find(e => e.id === id)).filter(Boolean);

  function handleToggleCompare(id) {
    dispatch({ type: 'TOGGLE_COMPARISON', payload: id });
  }

  // Comparison view
  if (comparisonEntrepreneurs.length === 2) {
    return (
      <div>
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-primary-500 to-primary-600 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="anim-fade-in-up">
              <div className="flex items-center gap-2 mb-1">
                <ArrowLeftRight size={16} className="text-white/75" />
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest"><T>Comparison Mode</T></p>
              </div>
              <h1 className="text-2xl font-bold text-white"><T>Agency Score Comparison</T></h1>
              <p className="text-white/70 text-sm mt-1">
                {comparisonEntrepreneurs[0].name} vs {comparisonEntrepreneurs[1].name}
              </p>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'TOGGLE_COMPARISON', payload: comparisonIds[0] });
                dispatch({ type: 'TOGGLE_COMPARISON', payload: comparisonIds[1] });
              }}
              className="shrink-0 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
            >
              <T>Clear Comparison</T>
            </button>
          </div>
        </div>

        <Card className="mb-6">
          <AgencyRadarChart entrepreneurs={comparisonEntrepreneurs} height={400} />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisonEntrepreneurs.map(e => (
            <Card key={e.id} title={e.name} subtitle={e.sector}>
              <ScoreBreakdown entrepreneur={e} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedEntrepreneur) {
    return (
      <div>
        <button
          onClick={() => setSearchParams({})}
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
        >
          ← <T>Back to Overview</T>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title={selectedEntrepreneur.name} subtitle={`${selectedEntrepreneur.sector} | ${selectedEntrepreneur.location}`}>
            <AgencyRadarChart entrepreneurs={[selectedEntrepreneur]} height={350} />
          </Card>
          <Card title={<T>Score Breakdown</T>} icon={Target}>
            <ScoreBreakdown entrepreneur={selectedEntrepreneur} />
          </Card>
        </div>

        <Card title={<T>Methodology</T>} className="mt-6">
          <p className="text-sm text-warm-600 leading-relaxed">
            <T>The Agency Score is based on 5 parameters, each rated 1–5 through structured interviews. It assesses whether the woman registered as the business owner genuinely makes key decisions. A higher score indicates stronger independent leadership.</T>
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-green-700"><T>High Agency</T></p>
              <p className="text-xs text-green-600 mt-0.5">76–100%</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-amber-700"><T>Moderate Agency</T></p>
              <p className="text-xs text-amber-600 mt-0.5">48–75%</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-red-700"><T>Low Agency</T></p>
              <p className="text-xs text-red-600 mt-0.5"><T>Below 48%</T></p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Overview grid
  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-400 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest"><T>Leadership Analysis</T></p>
            </div>
            <h1 className="text-2xl font-bold text-white"><T>Agency Score</T></h1>
            <p className="text-white/70 text-sm mt-1"><T>Visual breakdown of leadership indicators for each entrepreneur</T></p>
          </div>
          {comparisonIds.length > 0 && (
            <div className="anim-fade-in-up delay-200 flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-3 py-2">
              <ArrowLeftRight size={14} className="text-white" />
              <span className="text-sm text-white font-medium">{comparisonIds.length}/2 <T>selected</T></span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 anim-fade-in-up delay-100">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-warm-200 rounded-xl px-3 py-2 bg-white text-warm-700 shadow-sm"
        >
          <option value="highest">{tp('Highest Score')}</option>
          <option value="lowest">{tp('Lowest Score')}</option>
          <option value="alpha">{tp('Alphabetical')}</option>
        </select>
        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          className="text-sm border border-warm-200 rounded-xl px-3 py-2 bg-white text-warm-700 shadow-sm"
        >
          <option value="all">{tp('All Sectors')}</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 anim-fade-in-up delay-200">
        {filtered.map(e => (
          <div key={e.id} onClick={() => setSearchParams({ id: e.id })}>
            <ScoreCard
              entrepreneur={e}
              isSelected={comparisonIds.includes(e.id)}
              onToggleCompare={handleToggleCompare}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
