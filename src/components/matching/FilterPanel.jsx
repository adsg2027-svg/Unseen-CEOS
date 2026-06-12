import { SECTORS } from '../../data/mockData';
import { X } from 'lucide-react';
import Button from '../common/Button';
import T from '../common/T';
import { useT } from '../common/T';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const tp = useT();

  function toggleSector(sector) {
    const current = filters.sectors || [];
    const updated = current.includes(sector)
      ? current.filter(s => s !== sector)
      : [...current, sector];
    onFilterChange({ sectors: updated });
  }

  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-warm-900 text-sm"><T>Filters</T></h3>
        <button onClick={onReset} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
          <T>Reset</T>
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-warm-600 mb-2 uppercase tracking-wider"><T>Sector</T></p>
        <div className="space-y-1.5">
          {SECTORS.map(sector => (
            <label key={sector} className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
              <input
                type="checkbox"
                checked={(filters.sectors || []).includes(sector)}
                onChange={() => toggleSector(sector)}
                className="accent-primary-500 rounded"
              />
              {sector}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-warm-600 mb-2 uppercase tracking-wider"><T>Min Agency Score</T></p>
        <select
          value={filters.minScore || 0}
          onChange={(e) => onFilterChange({ minScore: Number(e.target.value) })}
          className="w-full text-sm border border-warm-200 rounded-lg px-3 py-2 bg-white text-warm-700"
        >
          <option value={0}>{tp('Any Score')}</option>
          <option value={50}>50%+</option>
          <option value={60}>60%+</option>
          <option value={70}>70%+</option>
          <option value={80}>80%+</option>
        </select>
      </div>

      <div className="mb-5">
        <p className="text-xs font-medium text-warm-600 mb-2 uppercase tracking-wider"><T>Max Funding Needed</T></p>
        <select
          value={filters.maxFunding || 'any'}
          onChange={(e) => onFilterChange({ maxFunding: e.target.value === 'any' ? 'any' : Number(e.target.value) })}
          className="w-full text-sm border border-warm-200 rounded-lg px-3 py-2 bg-white text-warm-700"
        >
          <option value="any">{tp('Any Amount')}</option>
          <option value={50000}>Up to ₹50,000</option>
          <option value={100000}>Up to ₹1,00,000</option>
          <option value={200000}>Up to ₹2,00,000</option>
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-warm-700 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.shortlistedOnly || false}
          onChange={(e) => onFilterChange({ shortlistedOnly: e.target.checked })}
          className="accent-primary-500"
        />
        <T>Shortlisted only</T>
      </label>

      {((filters.sectors?.length > 0) || filters.minScore > 0 || filters.maxFunding !== 'any' || filters.shortlistedOnly) && (
        <div className="mt-4 pt-3 border-t border-warm-100 flex flex-wrap gap-1.5">
          {filters.sectors?.map(s => (
            <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full flex items-center gap-1">
              {s}
              <button onClick={() => toggleSector(s)}><X size={10} /></button>
            </span>
          ))}
          {filters.minScore > 0 && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full">{filters.minScore}%+</span>
          )}
        </div>
      )}
    </div>
  );
}
