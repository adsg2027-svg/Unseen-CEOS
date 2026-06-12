import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR, getScoreTierColor, getScoreTier } from '../../utils/agencyScore';
import { SECTORS } from '../../data/mockData';
import T from '../common/T';
import { useT } from '../common/T';

export default function EntrepreneurTable() {
  const { filteredEntrepreneurs, filters, dispatch } = useData();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const tp = useT();

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const sorted = [...filteredEntrepreneurs].sort((a, b) => {
    let aVal, bVal;
    switch (sortField) {
      case 'name': aVal = a.name; bVal = b.name; break;
      case 'sector': aVal = a.sector; bVal = b.sector; break;
      case 'agencyScore': aVal = a.agencyScore.percentage; bVal = b.agencyScore.percentage; break;
      case 'revenue': aVal = a.monthlyRevenue; bVal = b.monthlyRevenue; break;
      case 'funding': aVal = a.fundingNeeded; bVal = b.fundingNeeded; break;
      default: aVal = a.name; bVal = b.name;
    }
    if (typeof aVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="text-warm-300" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary-500" /> : <ChevronDown size={12} className="text-primary-500" />;
  };

  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-sm">
      <div className="p-4 border-b border-warm-100 flex flex-wrap gap-3 items-center">
        <select
          value={filters.sector}
          onChange={(e) => dispatch({ type: 'UPDATE_FILTERS', payload: { sector: e.target.value } })}
          className="text-sm border border-warm-200 rounded-lg px-3 py-2 bg-white text-warm-700 outline-none focus:border-primary-300"
        >
          <option value="all">{tp('All Sectors')}</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filters.minAgencyScore}
          onChange={(e) => dispatch({ type: 'UPDATE_FILTERS', payload: { minAgencyScore: Number(e.target.value) } })}
          className="text-sm border border-warm-200 rounded-lg px-3 py-2 bg-white text-warm-700 outline-none focus:border-primary-300"
        >
          <option value={0}>{tp('All Scores')}</option>
          <option value={76}>{tp('High Agency')} (76%+)</option>
          <option value={48}>{tp('Moderate')}+ (48%+)</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-warm-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.shortlistedOnly}
            onChange={(e) => dispatch({ type: 'UPDATE_FILTERS', payload: { shortlistedOnly: e.target.checked } })}
            className="accent-primary-500"
          />
          <T>Shortlisted only</T>
        </label>

        <span className="ml-auto text-sm text-warm-400">{sorted.length} <T>result(s)</T></span>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-warm-500 uppercase tracking-wider border-b border-warm-100">
              {[
                { key: 'name',        labelKey: 'Name'           },
                { key: 'sector',      labelKey: 'Sector'         },
                { key: 'agencyScore', labelKey: 'Agency Score'   },
                { key: 'revenue',     labelKey: 'Revenue/mo'     },
                { key: 'funding',     labelKey: 'Funding Needed' },
              ].map(col => (
                <th key={col.key} className="px-4 py-3 cursor-pointer hover:text-warm-700" onClick={() => handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    <T>{col.labelKey}</T>
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center"><T>Shortlist</T></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-50">
            {sorted.map(e => {
              const tierColors = getScoreTierColor(e.agencyScore.percentage);
              return (
                <tr
                  key={e.id}
                  onClick={() => navigate(`/profiles/${e.id}`)}
                  className="hover:bg-warm-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: e.avatarColor }}>
                        {e.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-warm-900">{e.name}</p>
                        <p className="text-xs text-warm-400">{e.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-warm-100 text-warm-600 px-2 py-1 rounded-full">{e.sector}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${tierColors.bg} ${tierColors.text}`}>
                      {e.agencyScore.percentage}% — <T>{getScoreTier(e.agencyScore.percentage)}</T>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-warm-700">{formatINR(e.monthlyRevenue)}</td>
                  <td className="px-4 py-3 text-sm text-warm-700">{formatINR(e.fundingNeeded)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(ev) => { ev.stopPropagation(); dispatch({ type: 'TOGGLE_SHORTLIST', payload: e.id }); }}
                      className="p-1 hover:bg-warm-100 rounded transition-colors"
                    >
                      <Star size={16} className={e.isShortlisted ? 'fill-amber-400 text-amber-400' : 'text-warm-300'} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-warm-100">
        {sorted.map(e => {
          const tierColors = getScoreTierColor(e.agencyScore.percentage);
          return (
            <div
              key={e.id}
              onClick={() => navigate(`/profiles/${e.id}`)}
              className="p-4 hover:bg-warm-50 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: e.avatarColor }}>
                    {e.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-900">{e.name}</p>
                    <p className="text-xs text-warm-400">{e.sector} | {e.location}</p>
                  </div>
                </div>
                <button
                  onClick={(ev) => { ev.stopPropagation(); dispatch({ type: 'TOGGLE_SHORTLIST', payload: e.id }); }}
                >
                  <Star size={16} className={e.isShortlisted ? 'fill-amber-400 text-amber-400' : 'text-warm-300'} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`font-medium px-2 py-1 rounded-full ${tierColors.bg} ${tierColors.text}`}>
                  {e.agencyScore.percentage}%
                </span>
                <span className="text-warm-500">Rev: {formatINR(e.monthlyRevenue)}</span>
                <span className="text-warm-500">Need: {formatINR(e.fundingNeeded)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="p-12 text-center text-warm-400">
          <p className="text-sm"><T>No entrepreneurs match your filters.</T></p>
        </div>
      )}
    </div>
  );
}
