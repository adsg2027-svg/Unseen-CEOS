import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToMessages, sendChatMessage, getConnectionDetails } from '../utils/chat';
import T from '../components/common/T';

function timeStr(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function dateLine(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Chat() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [connection, setConnection] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState('');
  const bottomRef = useRef(null);

  // Load connection details
  useEffect(() => {
    getConnectionDetails(connectionId).then(conn => {
      if (conn) setConnection(conn);
      else setLoadError('Conversation not found.');
    }).catch(() => setLoadError('Failed to load conversation.'));
  }, [connectionId]);

  // Subscribe to messages
  useEffect(() => {
    const unsub = subscribeToMessages(connectionId, setMessages);
    return () => unsub();
  }, [connectionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await sendChatMessage(connectionId, user.uid, userProfile?.displayName ?? user.email, text);
      setText('');
    } finally {
      setSending(false);
    }
  }

  const otherName = connection
    ? (connection.fromUid === user?.uid ? connection.toName : connection.fromName)
    : 'Chat';

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-warm-400">
        <MessageCircle size={40} className="mb-3 opacity-30" />
        <p className="text-sm">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-warm-100 bg-warm-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-warm-200 rounded-lg transition-colors text-warm-500"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-primary-600 text-sm font-bold">
            {otherName?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-warm-900">{otherName}</p>
          <p className="text-xs text-warm-400"><T>Connected</T></p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-warm-300">
            <MessageCircle size={36} className="mb-2 opacity-40" />
            <p className="text-sm"><T>No messages yet. Say hello!</T></p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderUid === user?.uid;
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const showDate = !prevMsg || dateLine(msg.createdAt) !== dateLine(prevMsg.createdAt);
          return (
            <div key={msg.id}>
              {showDate && msg.createdAt && (
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-warm-100" />
                  <span className="text-[10px] text-warm-300 font-medium">{dateLine(msg.createdAt)}</span>
                  <div className="flex-1 h-px bg-warm-100" />
                </div>
              )}
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                  {!isMe && <p className="text-[10px] text-warm-400 px-1">{msg.senderName}</p>}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-warm-100 text-warm-900 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-warm-300 px-1 ${isMe ? 'text-right' : ''}`}>
                    {timeStr(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-warm-100 bg-white shrink-0">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-warm-50 border border-warm-200 rounded-xl px-4 py-2.5 text-sm text-warm-900 placeholder-warm-400 outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors shrink-0"
        >
          {sending ? <Loader2 size={15} className="text-white animate-spin" /> : <Send size={15} className="text-white" />}
        </button>
      </form>
    </div>
  );
}
