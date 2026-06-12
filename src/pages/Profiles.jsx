import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, IndianRupee, TrendingUp, UserPlus, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { getScoreTierColor, getScoreTier, formatINR } from '../utils/agencyScore';
import { sendProfileInterest } from '../utils/connections';
import ConnectModal from '../components/connections/ConnectModal';
import T from '../components/common/T';

export default function Profiles() {
  const { filteredEntrepreneurs, filters, dispatch } = useData();
  const { user, userProfile } = useAuth();
  const hasActiveFilters = filters.searchQuery || filters.sector !== 'all' || filters.minAgencyScore > 0 || filters.shortlistedOnly || filters.maxFundingNeeded !== Infinity;
  const [modalEntrepreneur, setModalEntrepreneur] = useState(null);
  const [connected, setConnected] = useState(new Set());

  async function handleConnect(message) {
    if (!user || !modalEntrepreneur) return;
    await sendProfileInterest({
      funderUid: user.uid,
      funderName: userProfile?.displayName ?? user.email,
      entrepreneurId: modalEntrepreneur.id,
      entrepreneurName: modalEntrepreneur.name,
      message,
    });
    setConnected(prev => new Set([...prev, modalEntrepreneur.id]));
    setModalEntrepreneur(null);
  }

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-24 h-16 bg-amber-200/20 rounded-full blur-lg pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
                <T>Entrepreneur Directory</T>
              </p>
            </div>
            <h1 className="text-2xl font-bold text-white"><T>Entrepreneur Profiles</T></h1>
            <p className="text-white/70 text-sm mt-1">
              <T>Investor-ready profiles with business metrics and agency scores</T>
            </p>
          </div>
          <div className="anim-fade-in-up delay-200 shrink-0 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-black text-white">{filteredEntrepreneurs.length}</p>
            <p className="text-white/70 text-[11px] font-medium"><T>Profiles</T></p>
          </div>
        </div>
      </div>

      {filteredEntrepreneurs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-warm-300" />
          </div>
          <p className="text-warm-600 font-semibold mb-1"><T>No profiles found</T></p>
          <p className="text-warm-400 text-sm mb-4">
            <T>Adjust your search or filters to see entrepreneur profiles.</T>
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => dispatch({ type: 'RESET_FILTERS' })}
              className="inline-flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 border border-primary-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <T>Clear filters</T>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntrepreneurs.filter(e => e?.id && e?.agencyScore && e?.name).map((e, i) => {
            const tierColors = getScoreTierColor(e.agencyScore.percentage);
            const initials = e.name.split(' ').map(n => n[0]).join('');
            const tier = getScoreTier(e.agencyScore.percentage);
            const isConnected = connected.has(e?.id);

            return (
              <div
                key={e?.id}
                className="anim-fade-in-up group bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Link to={`/profiles/${e?.id}`} className="block">
                  <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-700 relative">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 right-8 w-12 h-12 bg-white/5 rounded-full" />
                    <div
                      className="absolute -bottom-6 left-4 w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-md"
                      style={{ backgroundColor: e.avatarColor }}
                    >
                      {initials}
                    </div>
                    {e.isShortlisted && (
                      <div className="absolute top-2.5 right-3 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        <T>Shortlisted</T>
                      </div>
                    )}
                  </div>

                  <div className="pt-9 px-4 pb-3">
                    <div className="flex items-start justify-between mb-1">
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-semibold text-warm-900 truncate group-hover:text-primary-600 transition-colors">{e.name}</p>
                        <p className="text-xs text-warm-400 truncate">{e.businessName}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${tierColors.bg} ${tierColors.text}`}>
                        {e.agencyScore.percentage}%
                      </span>
                    </div>

                    <div className="mt-2 mb-3">
                      <span className={`text-[10px] font-semibold ${tierColors.text}`}><T>{tier}</T></span>
                      <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            e.agencyScore.percentage >= 76 ? 'bg-green-400' :
                            e.agencyScore.percentage >= 48 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${e.agencyScore.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] bg-primary-50 text-primary-600 font-medium px-2 py-0.5 rounded-full border border-primary-100">
                        {e.sector}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-warm-100 text-warm-500 px-2 py-0.5 rounded-full">
                        <MapPin size={9} />
                        {e.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-100">
                      <div className="flex items-center gap-1 text-xs text-warm-500">
                        <IndianRupee size={11} className="text-warm-400" />
                        <span>{formatINR(e.monthlyRevenue)}<span className="text-warm-400">/mo</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <TrendingUp size={11} />
                        <span>{formatINR(e.monthlyProfit)} <T>profit</T></span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4 pt-2">
                  <button
                    onClick={() => !isConnected && setModalEntrepreneur(e)}
                    disabled={isConnected}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all
                      ${isConnected
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                        : 'bg-primary-50 hover:bg-primary-100 text-primary-600 border border-primary-200 cursor-pointer'
                      }`}
                  >
                    {isConnected ? <CheckCircle size={13} /> : <UserPlus size={13} />}
                    {isConnected ? <T>Connected</T> : <T>Connect with Entrepreneur</T>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalEntrepreneur && (
        <ConnectModal
          title={`Connect with ${modalEntrepreneur.name}`}
          subtitle={`${modalEntrepreneur.businessName} · ${modalEntrepreneur.sector}`}
          placeholder="Introduce yourself and explain why you're interested in supporting this venture…"
          onSend={handleConnect}
          onClose={() => setModalEntrepreneur(null)}
        />
      )}
    </div>
  );
}
