import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import T from '../common/T';

export default function ConnectModal({ title, subtitle, placeholder, onSend, onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSend() {
    if (!message.trim()) return setError('Please write a short message before sending.');
    setError('');
    setLoading(true);
    try {
      await onSend(message.trim());
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-start justify-between p-5 border-b border-warm-100">
          <div>
            <h2 className="text-base font-bold text-warm-900">{title}</h2>
            {subtitle && <p className="text-sm text-warm-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-warm-400 hover:text-warm-600 p-1 rounded-lg hover:bg-warm-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2.5 text-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <T>{error}</T>
            </div>
          )}
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder ?? 'Write your message…'}
            className="w-full border border-warm-200 rounded-xl px-3.5 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none transition"
          />
          <p className="text-xs text-warm-400 mt-1.5">{message.length}/500 <T>characters</T></p>
        </div>

        <div className="flex items-center gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 border border-warm-200 text-warm-600 hover:bg-warm-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            <T>Cancel</T>
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {loading ? <T>Sending…</T> : <T>Send</T>}
          </button>
        </div>
      </div>
    </div>
  );
}
