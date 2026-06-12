import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Minimize2, Maximize2, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { sendMessage, isApiKeyConfigured, analyzeStrengthsWeaknesses } from '../../utils/gemini';
import MarkdownRenderer from '../common/MarkdownRenderer';

const QUICK_PROMPTS = [
  'Help with revenue model',
  'Calculate unit economics',
  'Estimate working capital',
  'Suggest growth strategy',
];

export default function AIChatbot({ entrepreneur, isOpen, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  async function handleSend(text = input) {
    if (!text.trim() || isLoading) return;
    const userMessage = { role: 'user', content: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const result = await sendMessage(text.trim(), history, entrepreneur);

    if (result.success) {
      setMessages(prev => [...prev, { role: 'model', content: result.data, timestamp: Date.now() }]);
    } else {
      setMessages(prev => [...prev, { role: 'error', content: result.error, timestamp: Date.now() }]);
    }
    setIsLoading(false);
  }

  async function handleStrengthsWeaknesses() {
    if (isLoading) return;
    if (!entrepreneur) {
      setMessages(prev => [...prev, { role: 'error', content: 'Please select an entrepreneur first.', timestamp: Date.now() }]);
      return;
    }
    setMessages(prev => [...prev, { role: 'user', content: 'Analyze my key strengths & weaknesses', timestamp: Date.now() }]);
    setIsLoading(true);
    const result = await analyzeStrengthsWeaknesses(entrepreneur);
    if (result.success) {
      setMessages(prev => [...prev, { role: 'model', content: result.data, timestamp: Date.now() }]);
    } else {
      setMessages(prev => [...prev, { role: 'error', content: result.error, timestamp: Date.now() }]);
    }
    setIsLoading(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 z-50"
      >
        <Sparkles size={22} />
      </button>
    );
  }

  if (!isApiKeyConfigured()) {
    return (
      <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-warm-200 z-50">
        <div className="flex items-center justify-between p-4 border-b border-warm-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary-500" />
            <span className="font-semibold text-sm text-warm-900">AI Business Advisor</span>
          </div>
          <button onClick={onToggle} className="p-1 hover:bg-warm-100 rounded"><X size={16} className="text-warm-400" /></button>
        </div>
        <div className="p-6 text-center">
          <AlertCircle size={32} className="mx-auto text-amber-500 mb-3" />
          <p className="text-sm font-medium text-warm-700 mb-2">API Key Required</p>
          <p className="text-xs text-warm-500">
            Add your Gemini API key to the <code className="bg-warm-100 px-1 rounded">.env</code> file as <code className="bg-warm-100 px-1 rounded">VITE_GEMINI_API_KEY</code> and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-warm-200 z-50 flex flex-col transition-all duration-200
      ${isMinimized ? 'w-72 h-14' : 'w-96 h-[500px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-100 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary-500" />
          <span className="font-semibold text-sm text-warm-900">AI Business Advisor</span>
          {entrepreneur && (
            <span className="text-xs text-warm-400 hidden sm:inline">| {entrepreneur.name}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-warm-100 rounded">
            {isMinimized ? <Maximize2 size={14} className="text-warm-400" /> : <Minimize2 size={14} className="text-warm-400" />}
          </button>
          <button onClick={onToggle} className="p-1 hover:bg-warm-100 rounded">
            <X size={14} className="text-warm-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Sparkles size={28} className="mx-auto text-primary-300 mb-3" />
                <p className="text-sm text-warm-500 mb-4">Ask me anything about business planning!</p>
                {/* Strengths & Weaknesses analysis button */}
                <button
                  onClick={handleStrengthsWeaknesses}
                  className="w-full flex items-center gap-2 text-xs bg-gradient-to-r from-primary-50 to-amber-50 hover:from-primary-100 hover:to-amber-100 border border-primary-200 text-primary-700 px-3 py-2.5 rounded-lg transition-colors mb-3 font-medium"
                >
                  <TrendingUp size={13} className="text-primary-500 shrink-0" />
                  Analyze my strengths &amp; weaknesses
                </button>
                <div className="space-y-1.5">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="block w-full text-left text-xs bg-warm-50 hover:bg-primary-50 text-warm-600 hover:text-primary-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-primary-500 text-white">
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  </div>
                ) : msg.role === 'error' ? (
                  <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200">
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-lg px-3 py-2 bg-warm-100">
                    <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-warm-100 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-warm-500" />
                  <span className="text-sm text-warm-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-warm-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about business planning..."
                className="flex-1 text-sm bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 outline-none focus:border-primary-300"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
