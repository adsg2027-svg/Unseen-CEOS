import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, LayoutList } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useFormSchema } from '../context/FormSchemaContext';
import ProfileCard from '../components/profile/ProfileCard';
import BusinessMetrics from '../components/profile/BusinessMetrics';
import ScoreBreakdown from '../components/agency/ScoreBreakdown';
import FundingPlan from '../components/profile/FundingPlan';
import Card from '../components/common/Card';
import T from '../components/common/T';

const HANDLED_KEYS = new Set([
  'name', 'businessName', 'location', 'state', 'sector', 'businessType',
  'yearsInBusiness', 'registrationType', 'avatarColor', 'type', 'id',
  'isShortlisted', 'interviewDate', 'interviewedBy', 'age',
  'monthlyRevenue', 'monthlyCosts', 'monthlyProfit', 'fundingNeeded',
  'fundingPurpose', 'currentFundingSources', 'unitEconomics',
  'agencyScore', 'growthPlan', 'challenges', 'interviewNotes',
]);

function DynamicProfileFields({ entrepreneur }) {
  const { ventureSchema } = useFormSchema();

  const customFields = ventureSchema.filter(
    f => !HANDLED_KEYS.has(f.key) &&
         entrepreneur[f.key] !== undefined &&
         entrepreneur[f.key] !== '' &&
         !(Array.isArray(entrepreneur[f.key]) && entrepreneur[f.key].length === 0)
  );

  if (customFields.length === 0) return null;

  const sections = customFields.reduce((acc, f) => {
    if (!acc[f.section]) acc[f.section] = [];
    acc[f.section].push(f);
    return acc;
  }, {});

  return (
    <Card title={<T>Profile Details</T>} icon={LayoutList} className="mt-6 anim-fade-in-up delay-300">
      {Object.entries(sections).map(([section, sFields]) => (
        <div key={section} className="mb-5 last:mb-0">
          <p className="text-xs font-bold text-warm-500 uppercase tracking-wider mb-2"><T>{section}</T></p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sFields.map(f => {
              const raw = entrepreneur[f.key];
              const display = Array.isArray(raw) ? raw.join(', ') : String(raw ?? '');
              return (
                <div key={f.key} className="bg-warm-50 rounded-lg px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-wider mb-0.5"><T>{f.label}</T></p>
                  <p className="text-sm text-warm-800 font-medium">{display || '—'}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
}

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
        <p className="text-lg font-semibold text-warm-700 mb-2"><T>Entrepreneur not found</T></p>
        <p className="text-warm-500 text-sm mb-4"><T>The profile you're looking for doesn't exist.</T></p>
        <Link to="/profiles" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
          <ArrowLeft size={14} />
          <T>Back to Profiles</T>
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
        <T>Back to Profiles</T>
      </Link>

      <div className="anim-fade-in-up">
        <ProfileCard entrepreneur={entrepreneur} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 anim-fade-in-up delay-100">
        <BusinessMetrics entrepreneur={entrepreneur} />
        <Card title={<T>Agency Score</T>} icon={Target}>
          <ScoreBreakdown entrepreneur={entrepreneur} />
        </Card>
      </div>

      <div className="mt-6 anim-fade-in-up delay-200">
        <FundingPlan entrepreneur={entrepreneur} />
      </div>

      <DynamicProfileFields entrepreneur={entrepreneur} />
    </div>
  );
}
