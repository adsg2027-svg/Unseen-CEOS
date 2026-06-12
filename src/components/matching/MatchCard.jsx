import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Eye, UserPlus, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { formatINR, getScoreTierColor, getScoreTier } from '../../utils/agencyScore';
import { AGENCY_PARAMETERS } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { sendProfileInterest, getFunderSentConnections } from '../../utils/connections';
import ConnectModal from '../connections/ConnectModal';
import T from '../common/T';

export default function MatchCard({ entrepreneur }) {
  const navigate = useNavigate();
  const { dispatch } = useData();
  const { user, userProfile } = useAuth();
  const tierColors = getScoreTierColor(entrepreneur.agencyScore.percentage);
  const initials = entrepreneur.name.split(' ').map(n => n[0]).join('');
  const [modalOpen, setModalOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const radarData = AGENCY_PARAMETERS.map(param => ({
    param: param.label.split(' ')[0],
    value: entrepreneur.agencyScore[param.key],
  }));

  const tierBarColor = entrepreneur.agencyScore.percentage >= 76
    ? 'bg-green-500'
    : entrepreneur.agencyScore.percentage >= 48
      ? 'bg-amber-500'
      : 'bg-red-500';

  async function handleConnect(message) {
    await sendProfileInterest({
      funderUid: user.uid,
      funderName: userProfile?.displayName ?? user.email,
      entrepreneurId: entrepreneur.id,
      entrepreneurName: entrepreneur.name,
      message,
    });
    setConnected(true);
  }

  return (
    <div className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden hover:shadow-md hover:border-primary-200 transition-all duration-200">
      <div className={`h-1.5 ${tierBarColor}`} />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: entrepreneur.avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-warm-900 truncate">{entrepreneur.name}</p>
            <p className="text-xs text-warm-400 truncate">{entrepreneur.businessName}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${tierColors.bg} ${tierColors.text}`}>
            {entrepreneur.agencyScore.percentage}%
          </span>
        </div>

        {/* Sector badge */}
        <span className="text-xs bg-warm-100 text-warm-600 px-2 py-0.5 rounded-full">{entrepreneur.sector}</span>

        {/* Mini metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
          <div className="text-center">
            <p className="text-xs text-warm-400"><T>Score</T></p>
            <p className="text-sm font-bold text-warm-900">{entrepreneur.agencyScore.percentage}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-warm-400"><T>Profit/mo</T></p>
            <p className="text-sm font-bold text-green-600">{formatINR(entrepreneur.monthlyProfit)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-warm-400"><T>Funding</T></p>
            <p className="text-sm font-bold text-primary-600">{formatINR(entrepreneur.fundingNeeded)}</p>
          </div>
        </div>

        {/* Mini Radar */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#E7E5E4" />
              <PolarAngleAxis dataKey="param" tick={{ fontSize: 8, fill: '#A8A29E' }} />
              <Radar dataKey="value" stroke="#E97451" fill="#E97451" fillOpacity={0.2} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Funding purpose */}
        <p className="text-xs text-warm-500 mt-2 line-clamp-2">{entrepreneur.fundingPurpose}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => navigate(`/profiles/${entrepreneur.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 py-2 rounded-lg transition-colors"
          >
            <Eye size={12} />
            <T>View Profile</T>
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHORTLIST', payload: entrepreneur.id })}
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-warm-500 hover:bg-warm-50 py-2 px-3 rounded-lg transition-colors"
          >
            <Star size={12} className={entrepreneur.isShortlisted ? 'fill-amber-400 text-amber-400' : ''} />
            {entrepreneur.isShortlisted ? <T>Saved</T> : <T>Save</T>}
          </button>
          <button
            onClick={() => !connected && setModalOpen(true)}
            disabled={connected}
            className={`flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-colors
              ${connected
                ? 'text-green-600 bg-green-50 cursor-default'
                : 'text-primary-600 hover:bg-primary-50'
              }`}
          >
            {connected ? <CheckCircle size={12} /> : <UserPlus size={12} />}
            {connected ? <T>Connected</T> : <T>Connect</T>}
          </button>
        </div>
      </div>

      {modalOpen && (
        <ConnectModal
          title={`Connect with ${entrepreneur.name}`}
          subtitle={`${entrepreneur.businessName} · ${entrepreneur.sector}`}
          placeholder="Introduce yourself and explain why you're interested in supporting this venture…"
          onSend={handleConnect}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
