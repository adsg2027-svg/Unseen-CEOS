import { useEffect, useState } from 'react';
import { Bell, Send, Clock, CheckCircle, XCircle, Loader, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getFunderIncomingRequests,
  getFunderSentConnections,
  updateConnectionStatus,
} from '../utils/connections';

const STATUS_CONFIG = {
  pending:  { label: 'Pending',  icon: Clock,       color: 'text-amber-600 bg-amber-50  border-amber-200' },
  accepted: { label: 'Accepted', icon: CheckCircle, color: 'text-green-600 bg-green-50  border-green-200' },
  declined: { label: 'Declined', icon: XCircle,     color: 'text-red-500   bg-red-50    border-red-200'   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
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

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center shadow-sm">
      <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon size={24} className="text-warm-300" />
      </div>
      <p className="text-warm-500 text-sm">{message}</p>
    </div>
  );
}

export default function FunderRequests() {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState('incoming');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [inc, sentConns] = await Promise.all([
          getFunderIncomingRequests(user.uid),
          getFunderSentConnections(user.uid),
        ]);
        setIncoming(inc);
        setSent(sentConns);
      } catch (err) {
        console.error('FunderRequests load failed:', err);
        setLoadError(err?.message ?? 'Failed to load requests. Check your Firestore rules and connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid]);

  async function handleStatus(connectionId, status) {
    setUpdating(connectionId);
    try {
      await updateConnectionStatus(connectionId, status);
      setIncoming(prev =>
        prev.map(r => r.id === connectionId ? { ...r, status } : r)
      );
    } finally {
      setUpdating(null);
    }
  }

  const pendingCount = incoming.filter(r => r.status === 'pending').length;

  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-amber-500 rounded-2xl p-6 mb-6 shadow-lg">
        <div className="absolute -top-6 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="anim-fade-in-up">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={16} className="text-white/75" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Connection Hub</p>
            </div>
            <h1 className="text-2xl font-bold text-white">Requests & Connections</h1>
            <p className="text-white/70 text-sm mt-1">
              Funding requests from ventures and your outgoing connections
            </p>
          </div>
          {pendingCount > 0 && (
            <div className="anim-fade-in-up delay-200 shrink-0 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black text-white">{pendingCount}</p>
              <p className="text-white/70 text-[11px] font-medium">Pending</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warm-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { key: 'incoming', label: 'Incoming Requests', count: incoming.length, icon: Bell },
          { key: 'sent',     label: 'Sent Connections',  count: sent.length,     icon: Send },
        ].map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'}`}
          >
            <Icon size={14} />
            {label}
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
          <p className="text-warm-700 font-semibold mb-1">Couldn't load requests</p>
          <p className="text-warm-400 text-sm mb-4 max-w-md mx-auto break-words">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : tab === 'incoming' ? (
        incoming.length === 0 ? (
          <EmptyState icon={Bell} message="No funding requests yet. Ventures who reach out to you will appear here." />
        ) : (
          <div className="space-y-3">
            {incoming.map((req) => (
              <div key={req.id} className="bg-white rounded-xl border border-warm-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-warm-900">{req.fromName}</p>
                    <span className="text-[10px] font-semibold bg-primary-50 text-primary-600 border border-primary-200 px-2 py-0.5 rounded-full">
                      Venture
                    </span>
                    <p className="text-xs text-warm-400 mt-1">{timeAgo(req.createdAt)}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <p className="text-sm text-warm-600 bg-warm-50 rounded-lg px-3 py-2 leading-relaxed mb-3">
                  "{req.message}"
                </p>

                {req.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(req.id, 'accepted')}
                      disabled={updating === req.id}
                      className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:bg-green-50 border border-green-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
                    >
                      <Check size={13} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatus(req.id, 'declined')}
                      disabled={updating === req.id}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
                    >
                      <X size={13} />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        sent.length === 0 ? (
          <EmptyState icon={Send} message="You haven't connected with any ventures yet. Use the Matching or Profiles pages to reach out." />
        ) : (
          <div className="space-y-3">
            {sent.map((conn) => (
              <div key={conn.id} className="bg-white rounded-xl border border-warm-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-warm-900">{conn.entrepreneurName}</p>
                    <p className="text-xs text-warm-400 mt-0.5">{timeAgo(conn.createdAt)}</p>
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
