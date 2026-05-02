import { useNavigate } from 'react-router-dom';
import { getScoreTierColor, getScoreTier } from '../../utils/agencyScore';

export default function ScoreCard({ entrepreneur, isSelected, onToggleCompare }) {
  const navigate = useNavigate();
  const { agencyScore } = entrepreneur;
  const tierColors = getScoreTierColor(agencyScore.percentage);

  return (
    <div
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'border-primary-400 ring-2 ring-primary-200' : 'border-warm-200 hover:border-primary-200'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: entrepreneur.avatarColor }}>
            {entrepreneur.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-warm-900">{entrepreneur.name}</p>
            <p className="text-xs text-warm-400">{entrepreneur.sector}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-warm-900">{agencyScore.percentage}%</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tierColors.bg} ${tierColors.text}`}>
            {getScoreTier(agencyScore.percentage)}
          </span>
        </div>
      </div>

      {/* Mini bar indicators */}
      <div className="flex gap-1 mb-3">
        {Object.entries({
          pricingControl: agencyScore.pricingControl,
          supplierNegotiation: agencyScore.supplierNegotiation,
          profitControl: agencyScore.profitControl,
          operationsManagement: agencyScore.operationsManagement,
          digitalSkills: agencyScore.digitalSkills,
        }).map(([key, val]) => (
          <div key={key} className="flex-1">
            <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${val >= 4 ? 'bg-green-500' : val === 3 ? 'bg-amber-400' : 'bg-red-400'}`}
                style={{ width: `${(val / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/profiles/${entrepreneur.id}`); }}
          className="flex-1 text-xs text-primary-600 hover:text-primary-700 font-medium py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare?.(entrepreneur.id); }}
          className={`text-xs font-medium py-1.5 px-3 rounded-lg transition-colors
            ${isSelected ? 'bg-primary-500 text-white' : 'text-warm-500 hover:bg-warm-100'}`}
        >
          {isSelected ? 'Selected' : 'Compare'}
        </button>
      </div>
    </div>
  );
}
