import { formatINR } from '../../utils/agencyScore';
import Card from '../common/Card';
import { Target, Wallet, TrendingUp } from 'lucide-react';

export default function FundingPlan({ entrepreneur }) {
  const timelineSteps = [
    { label: 'Short-term', desc: entrepreneur.growthPlan?.shortTerm, color: 'bg-primary-500' },
    { label: 'Medium-term', desc: entrepreneur.growthPlan?.mediumTerm, color: 'bg-amber-500' },
    { label: 'Long-term', desc: entrepreneur.growthPlan?.longTerm, color: 'bg-green-500' },
  ].filter(s => s.desc);

  return (
    <div className="space-y-6">
      <Card title="Funding Requirements" icon={Wallet}>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center sm:w-48 shrink-0">
            <p className="text-xs text-primary-600 font-medium mb-1">Funding Needed</p>
            <p className="text-3xl font-bold text-primary-700">{formatINR(entrepreneur.fundingNeeded)}</p>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-sm font-medium text-warm-700 mb-1">Purpose</p>
              <p className="text-sm text-warm-600 leading-relaxed">{entrepreneur.fundingPurpose}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-warm-700 mb-2">Current Funding Sources</p>
              <div className="flex flex-wrap gap-2">
                {entrepreneur.currentFundingSources?.map((source, i) => (
                  <span key={i} className="text-xs bg-warm-100 text-warm-600 px-3 py-1 rounded-full">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {timelineSteps.length > 0 && (
        <Card title="Growth Plan" icon={TrendingUp}>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-warm-200" />
            <div className="space-y-6">
              {timelineSteps.map((step, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${step.color} border-2 border-white shadow`} />
                  <div>
                    <p className="text-sm font-semibold text-warm-800">{step.label}</p>
                    <p className="text-sm text-warm-600 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {entrepreneur.interviewNotes && (
        <Card title="Interview Notes" icon={Target}>
          <p className="text-sm text-warm-600 leading-relaxed">{entrepreneur.interviewNotes}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-warm-400">Interviewed by: {entrepreneur.interviewedBy}</span>
            <span className="text-xs text-warm-400">|</span>
            <span className="text-xs text-warm-400">Date: {entrepreneur.interviewDate}</span>
          </div>
          {entrepreneur.challenges?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-warm-700 mb-2">Key Challenges</p>
              <div className="flex flex-wrap gap-2">
                {entrepreneur.challenges.map((c, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
