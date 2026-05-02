import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import ProfileCard from '../components/profile/ProfileCard';
import BusinessMetrics from '../components/profile/BusinessMetrics';
import ScoreBreakdown from '../components/agency/ScoreBreakdown';
import FundingPlan from '../components/profile/FundingPlan';
import Card from '../components/common/Card';

export default function EntrepreneurProfile() {
  const { id } = useParams();
  const { getEntrepreneurById } = useData();
  const entrepreneur = getEntrepreneurById(id);

  if (!entrepreneur) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target size={28} className="text-warm-300" />
        </div>
        <p className="text-lg font-semibold text-warm-700 mb-2">Entrepreneur not found</p>
        <p className="text-warm-500 text-sm mb-4">The profile you're looking for doesn't exist.</p>
        <Link to="/profiles" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/profiles"
        className="inline-flex items-center gap-1.5 text-sm text-warm-500 hover:text-primary-600 font-medium mb-4 transition-colors duration-200"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <div className="anim-fade-in-up">
        <ProfileCard entrepreneur={entrepreneur} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 anim-fade-in-up delay-100">
        <BusinessMetrics entrepreneur={entrepreneur} />
        <Card title="Agency Score" icon={Target}>
          <ScoreBreakdown entrepreneur={entrepreneur} />
        </Card>
      </div>

      <div className="mt-6 anim-fade-in-up delay-200">
        <FundingPlan entrepreneur={entrepreneur} />
      </div>
    </div>
  );
}
