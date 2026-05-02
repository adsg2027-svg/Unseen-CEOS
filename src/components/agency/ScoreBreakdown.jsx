import { AGENCY_PARAMETERS } from '../../data/mockData';
import { getBarColor, getScoreTierColor, getScoreTier } from '../../utils/agencyScore';

export default function ScoreBreakdown({ entrepreneur }) {
  const { agencyScore } = entrepreneur;
  const tierColors = getScoreTierColor(agencyScore.percentage);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary-50 border-3 border-primary-500 flex items-center justify-center">
          <span className="text-xl font-bold text-primary-600">{agencyScore.percentage}%</span>
        </div>
        <div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${tierColors.bg} ${tierColors.text}`}>
            {getScoreTier(agencyScore.percentage)}
          </span>
          <p className="text-sm text-warm-500 mt-1">Score: {agencyScore.total}/25</p>
        </div>
      </div>

      <div className="space-y-3">
        {AGENCY_PARAMETERS.map(param => {
          const score = agencyScore[param.key];
          const widthPercent = (score / 5) * 100;
          return (
            <div key={param.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-warm-700">{param.label}</span>
                <span className="text-sm font-semibold text-warm-900">{score}/5</span>
              </div>
              <div className="w-full h-2.5 bg-warm-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <p className="text-xs text-warm-400 mt-0.5">{param.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
