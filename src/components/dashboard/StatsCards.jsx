import { Users, Target, IndianRupee, Star, TrendingUp, Sparkles, BookMarked } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/agencyScore';
import T from '../common/T';

export default function StatsCards() {
  const { summaryStats } = useData();
  const { userType } = useAuth();

  const funderCards = [
    {
      labelKey: 'Entrepreneurs Available',
      value: summaryStats.total,
      icon: Users,
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      text: 'text-primary-600',
      delay: '',
    },
    {
      labelKey: 'High Agency Score',
      value: summaryStats.highAgency,
      icon: Sparkles,
      gradient: 'from-amber-400 to-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      delay: 'delay-100',
      subKey: '≥ 76% agency score',
    },
    {
      labelKey: 'Total Funding Gap',
      value: formatINR(summaryStats.totalFunding),
      icon: IndianRupee,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-600',
      delay: 'delay-200',
      subKey: 'across all entrepreneurs',
    },
    {
      labelKey: 'Your Shortlist',
      value: summaryStats.shortlisted,
      icon: BookMarked,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      delay: 'delay-300',
    },
  ];

  const defaultCards = [
    {
      labelKey: 'Total Entrepreneurs',
      value: summaryStats.total,
      icon: Users,
      gradient: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50',
      border: 'border-primary-100',
      text: 'text-primary-600',
      delay: '',
    },
    {
      labelKey: 'Avg Agency Score',
      value: `${summaryStats.avgAgencyScore}%`,
      icon: Target,
      gradient: 'from-amber-400 to-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-600',
      delay: 'delay-100',
    },
    {
      labelKey: 'Total Funding Needed',
      value: formatINR(summaryStats.totalFunding),
      icon: IndianRupee,
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-600',
      delay: 'delay-200',
    },
    {
      labelKey: 'Shortlisted',
      value: summaryStats.shortlisted,
      icon: Star,
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      delay: 'delay-300',
    },
  ];

  const cards = userType === 'funder' ? funderCards : defaultCards;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`anim-fade-in-up ${card.delay} relative overflow-hidden ${card.bg} border ${card.border} rounded-2xl p-4 lg:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} rounded-t-2xl`} />

          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm`}>
              <card.icon size={16} className="text-white" />
            </div>
            <TrendingUp size={14} className={`${card.text} opacity-40 group-hover:opacity-70 transition-opacity`} />
          </div>

          <p className="text-2xl lg:text-3xl font-black text-warm-900">{card.value}</p>
          <p className="text-xs text-warm-500 mt-1 font-medium"><T>{card.labelKey}</T></p>
          {card.subKey && <p className="text-[10px] text-warm-400 mt-0.5"><T>{card.subKey}</T></p>}
        </div>
      ))}
    </div>
  );
}
