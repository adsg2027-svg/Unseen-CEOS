import { useEffect, useState } from 'react';
import { Send, Inbox, Clock, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getVentureOutgoingRequests, getVentureIncomingConnections } from '../utils/connections';
import T from '../components/common/T';

const STATUS_CONFIG = {
  pending:  { labelKey: 'Pending',  icon: Clock,       color: 'text-amber-600  bg-amber-50  border-amber-200' },
  accepted: { labelKey: 'Accepted', icon: CheckCircle, color: 'text-green-600  bg-green-50  border-green-200' },
  declined: { labelKey: 'Declined', icon: XCircle,     color: 'text-red-500    bg-red-50    border-red-200'   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon size={11} />
      <T>{cfg.labelKey}</T>
    </span>
  );
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center shadow-sm">
      <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon size={24} className="text-warm-300" />
      </div>
      <p className="text-warm-500 text-sm"><T>{message}</T></p>
    </div>
  );
}

function timeAgo(ts) {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MyRequests() {
  const { user } = useAuth();
  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState('outgoing');

  useEffect(() => {
    async function load() {
      try {
        const [out, inc] = await Promise.all([
          getVentureOutgoingRequests(user.uid),
          getVentureIncomingConnections(user.uid),
        ]);
        setOutgoing(out);
        setIncoming(inc);
      } catch (err) {
        console.error('MyRequests load failed:', err);
        setLoadError(err?.message ?? 'Failed to load your requests. Check your Firestore rules and connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid]);

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 anim-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <Send size={16} className="text-white/75" />
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">
              <T>Your Activity</T>
            </p>
          </div>
          <h1 className="text-2xl font-bold text-white"><T>My Requests &amp; Connections</T></h1>
          <p className="text-white/70 text-sm mt-1">
            <T>Track your funding requests and see when funders reach out to you</T>
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-warm-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { key: 'outgoing', labelKey: 'Funding Requests',  count: outgoing.length, icon: Send  },
          { key: 'incoming', labelKey: 'Funder Connections', count: incoming.length, icon: Inbox },
        ].map(({ key, labelKey, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'}`}
          >
            <Icon size={14} />
            <T>{labelKey}</T>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
              ${tab === key ? 'bg-primary-100 text-primary-600' : 'bg-warm-200 text-warm-500'}`}>
              {count}
            </span>
          </button>
        ))}
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
          <p className="text-warm-700 font-semibold mb-1"><T>Couldn't load your requests</T></p>
          <p className="text-warm-400 text-sm mb-4 max-w-md mx-auto break-words">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <T>Retry</T>
          </button>
        </div>
      ) : tab === 'outgoing' ? (
        outgoing.length === 0 ? (
          <EmptyState icon={Send} message="You haven't sent any funding requests yet. Browse the Funders Directory to get started." />
        ) : (
          <div className="space-y-3">
            {outgoing.map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-warm-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-warm-900"><T>To:</T> {req.toName}</p>
                    <p className="text-xs text-warm-400 mt-0.5">{timeAgo(req.createdAt)}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-sm text-warm-600 bg-warm-50 rounded-lg px-3 py-2 leading-relaxed">
                  "{req.message}"
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        incoming.length === 0 ? (
          <EmptyState icon={Inbox} message="No funders have reached out to you yet. Keep your profile strong to attract interest." />
        ) : (
          <div className="space-y-3">
            {incoming.map((conn) => (
              <div key={conn.id} className="bg-white rounded-xl border border-warm-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-warm-900"><T>From:</T> {conn.fromName}</p>
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                      <T>Funder</T>
                    </span>
                    <p className="text-xs text-warm-400 mt-1">{timeAgo(conn.createdAt)}</p>
                  </div>
                  <StatusBadge status={conn.status} />
                </div>
                <p className="text-sm text-warm-600 bg-warm-50 rounded-lg px-3 py-2 leading-relaxed">
                  "{conn.message}"
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
