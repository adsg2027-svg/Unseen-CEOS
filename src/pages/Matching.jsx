import { useState, useMemo } from 'react';
import { Handshake, Search, SlidersHorizontal } from 'lucide-react';
import { useData } from '../context/DataContext';
import FilterPanel from '../components/matching/FilterPanel';
import MatchCard from '../components/matching/MatchCard';

const defaultFilters = {
  sectors: [],
  minScore: 0,
  maxFunding: 'any',
  shortlistedOnly: false,
  searchQuery: '',
};

export default function Matching() {
  const { entrepreneurs } = useData();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('score');

  function handleFilterChange(updates) {
    setFilters(prev => ({ ...prev, ...updates }));
  }

  const filtered = useMemo(() => {
    let result = entrepreneurs.filter(e => {
      if (filters.sectors.length > 0 && !filters.sectors.includes(e.sector)) return false;
      if (e.agencyScore.percentage < filters.minScore) return false;
      if (filters.maxFunding !== 'any' && e.fundingNeeded > filters.maxFunding) return false;
      if (filters.shortlistedOnly && !e.isShortlisted) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!e.name.toLowerCase().includes(q) && !e.businessName.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'score') return b.agencyScore.percentage - a.agencyScore.percentage;
      if (sortBy === 'funding') return a.fundingNeeded - b.fundingNeeded;
      if (sortBy === 'profit') return b.monthlyProfit - a.monthlyProfit;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [entrepreneurs, filters, sortBy]);

  return (
    <div>
      {/* Gradient page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 anim-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Handshake size={16} className="text-white/75" />
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Investor View</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Investor Matching</h1>
          <p className="text-white/70 text-sm mt-1">Shortlisted ventures aligned with funder criteria, backed by verified data</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 shrink-0 anim-fade-in-up delay-100">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters(defaultFilters)}
          />
        </div>

        <div className="flex-1 anim-fade-in-up delay-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-white border border-warm-200 rounded-xl px-3 py-2 flex-1 sm:flex-initial sm:w-64 shadow-sm">
                <Search size={14} className="text-warm-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                  placeholder="Search by name..."
                  className="text-sm bg-transparent outline-none w-full text-warm-700"
                />
              </div>
              <span className="text-sm text-warm-400 whitespace-nowrap font-medium">
                {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-warm-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-warm-200 rounded-xl px-3 py-2 bg-white text-warm-700 shadow-sm"
              >
                <option value="score">Highest Score</option>
                <option value="funding">Lowest Funding</option>
                <option value="profit">Highest Profit</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((e, i) => (
                <div key={e.id} className="anim-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <MatchCard entrepreneur={e} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-warm-200 p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Handshake size={28} className="text-warm-300" />
              </div>
              <p className="text-warm-600 font-semibold mb-1">No matches found</p>
              <p className="text-warm-400 text-sm">Try adjusting your filters to see more entrepreneurs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
