'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Loader2, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { messages, sendMessage, status } = useChat();
  
  const initialMessage = { 
    id: '1', 
    role: 'assistant', 
    parts: [{ type: 'text', text: 'Hi! I am LedgerAI. Ask me anything about our AP, AR, cash flow, or spend intelligence.' }]
  } as any;
  
  const displayMessages = messages.length === 0 ? [initialMessage] : [initialMessage, ...messages];
  
  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] } as any);
    setInput('');
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen, messages]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Drawer */}
          <motion.div
            className="relative bg-background/95 backdrop-blur-xl border-l border-border w-[420px] h-full flex flex-col shadow-2xl"
            style={{ borderRadius: '16px 0 0 16px' }}
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-surface/50 border-b border-border/50 px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderRadius: '16px 0 0 0' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold">Ask LedgerAI</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-hover transition-colors">
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {displayMessages.map((msg: any) => {
                const textContent = Array.isArray(msg.parts) ? msg.parts.map((p: any) => p.type === 'text' ? p.text : '').join('') : '';
                return (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-surface border border-border/50' : 'bg-accent/10 border border-accent/20'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-text-muted" /> : <Bot className="w-4 h-4 text-accent" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-surface border border-border/50 text-text-primary rounded-tr-sm' 
                        : 'bg-accent/10 border border-accent/20 text-text-primary rounded-tl-sm'
                    }`}>
                      {textContent}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-accent animate-spin" />
                  </div>
                  <div className="glass-flat p-4 rounded-2xl rounded-tl-sm text-sm text-text-muted">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {[
                  "What is our current AR balance?",
                  "What is our cash flow situation?",
                  "Do we have any spend leakage or alerts?",
                  "Show me the latest audit logs"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage({ role: 'user', parts: [{ type: 'text', text: q }] } as any)}
                    className="text-[10px] px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/15 text-accent transition-colors text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 glass-flat flex-shrink-0 mx-4 mb-4 rounded-2xl">
              <form id="chat-form" onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a financial question..."
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none px-2"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-accent hover:bg-accent-hover text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
