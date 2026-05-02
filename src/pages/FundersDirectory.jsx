import { useEffect, useState } from 'react';
import { Building2, Send, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFundersProfiles, sendFundingRequest, getVentureOutgoingRequests } from '../utils/connections';
import ConnectModal from '../components/connections/ConnectModal';

export default function FundersDirectory() {
  const { user, userProfile } = useAuth();
  const [funders, setFunders] = useState([]);
  const [sentTo, setSentTo] = useState(new Set()); // uids already requested
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modalFunder, setModalFunder] = useState(null); // funder to send request to

  useEffect(() => {
    async function load() {
      try {
        const [funderList, existing] = await Promise.all([
          getFundersProfiles(),
          getVentureOutgoingRequests(user.uid),
        ]);
        setFunders(funderList);
        setSentTo(new Set(existing.map(r => r.toUid)));
      } catch (err) {
        console.error('FundersDirectory load failed:', err);
        setLoadError(err?.message ?? 'Failed to load funders. Check your Firestore rules and connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid]);

  async function handleSend(message) {
    if (!modalFunder || !user) return;
    await sendFundingRequest({
      ventureUid: user.uid,
      ventureName: userProfile?.displayName ?? user.email,
      funderUid: modalFunder.uid,
      funderName: modalFunder.name || modalFunder.displayName || 'Unknown Funder',
      message,
    });
    setSentTo(prev => new Set([...prev, modalFunder.uid]));
    setModalFunder(null);
  }

  const initials = (name) => name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?';

  const avatarColors = [
    '#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
  ];

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Discover</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Funders Directory</h1>
            <p className="text-white/70 text-sm mt-1">
              Browse funders on the platform and send a funding request directly
            </p>
          </div>
          <div className="anim-fade-in-up delay-200 shrink-0 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-black text-white">{funders.length}</p>
            <p className="text-white/70 text-[11px] font-medium">Funders</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader size={28} className="text-primary-400 animate-spin" />
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={26} className="text-red-500" />
          </div>
          <p className="text-warm-700 font-semibold mb-1">Couldn't load funders</p>
          <p className="text-warm-400 text-sm mb-4 max-w-md mx-auto break-words">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : funders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} className="text-warm-300" />
          </div>
          <p className="text-warm-600 font-semibold mb-1">No funders yet</p>
          <p className="text-warm-400 text-sm">Funders who join the platform will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funders.map((funder, i) => {
            const color = avatarColors[i % avatarColors.length];
            const alreadySent = sentTo.has(funder.uid);
            return (
              <div
                key={funder.uid}
                className="anim-fade-in-up bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden hover:shadow-md hover:border-primary-200 transition-all duration-200"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary-500 to-amber-400" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {initials(funder.name || funder.displayName || '?')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-warm-900 truncate">{funder.name || funder.displayName}</p>
                      <p className="text-xs text-warm-500 truncate">{funder.organization || funder.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                       {funder.fundingType || 'Funder'}
                    </span>
                    {funder.investmentRange && (
                      <span className="text-[10px] bg-warm-100 text-warm-600 font-semibold px-2 py-0.5 rounded-full border border-warm-200">
                        {funder.investmentRange}
                      </span>
                    )}
                  </div>
                  
                  {funder.preferredSectors && (
                    <div className="mb-4">
                      <p className="text-xs text-warm-500 mb-1 line-clamp-2"><strong>Sectors:</strong> {Array.isArray(funder.preferredSectors) ? funder.preferredSectors.join(', ') : funder.preferredSectors}</p>
                    </div>
                  )}

                  {funder.about && (
                    <div className="mb-4">
                      <p className="text-xs text-warm-600 line-clamp-2 border-l-2 border-warm-200 pl-2">{funder.about}</p>
                    </div>
                  )}

                  <button
                    onClick={() => !alreadySent && setModalFunder(funder)}
                    disabled={alreadySent}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                      ${alreadySent
                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow'
                      }`}
                  >
                    {alreadySent ? (
                      <>
                        <CheckCircle size={14} />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Request Funding
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalFunder && (
        <ConnectModal
          title={`Request Funding from ${modalFunder.name || modalFunder.displayName || 'this Funder'}`}
          subtitle="Briefly describe your business and what funding you need"
          placeholder="E.g. I run a tailoring business in Rajasthan with 8 years of experience. I need ₹50,000 to expand my workshop and hire two more workers…"
          onSend={handleSend}
          onClose={() => setModalFunder(null)}
        />
      )}
    </div>
  );
}
