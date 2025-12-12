import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import './AssistantPage.css';

import { QUICK_ACTIONS } from './quickActionsConfig';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  isMarkdown?: boolean;
}

export const AssistantPage = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { settings } = useSettings();
  
  // const isExpert = settings.aiLevel === 'expert';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (userText: string, actionType?: string, language?: string, wifiDeviceModel?: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: userText
    };
    setMessages(prev => [...prev, newUserMsg]);

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/assistant/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          level: settings.aiLevel || 'simple',
          action_type: actionType || null
        }),
      });

      const data = await response.json();
      const assistantText = data.success ? data.response : `Error: ${data.error}`;

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: assistantText,
        isMarkdown: true
      }]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: '⚠ Connection error. Please ensure backend is running.',
          isMarkdown: false
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickActionClick = (promptData: string | undefined, actionType: string, label: string) => {
    const textToSend = promptData || label;
    sendMessage(textToSend, actionType, settings.language, settings.wifiDeviceModel);
  };

  return (
    <div className="assistant-container">
      <Header title={t('nav.assistant')} />

      <div className="assistant-window">
        {messages.length === 0 ? (
          <div className="assistant-placeholder">
            <div>
            </div>
             {t('assistant.assistant_placeholder')}
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
          <div
             key={idx}
             className={`assistant-message ${msg.role === 'user' ? 'user-msg' : 'assistant-msg'}`}
        >
            {msg.isMarkdown ? (
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
             </ReactMarkdown>
           ) : (
             msg.text
           )}
          </div>
          ))}

            {loading && (
               <div className="assistant-message assistant-msg">
                 <div className="assistant-message assistant-msg loading-dots">
                    {t('assistant.assistant_think')}
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* --- FOOTER--- */}
      <div className="chat-footer-wrapper">
        
        {(
          <div className="quick-actions-bar">
            {QUICK_ACTIONS.map((action) => (
              <button 
                key={action.id} 
                className="chip-btn" 
                onClick={() => handleQuickActionClick(action.promptData, action.actionType, action.label)}
                disabled={loading}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="assistant-input-row">
          <input
            className="assistant-input"
            placeholder={t('assistant.assistant_input')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSend()}
            disabled={loading}
          />

          <button 
            className="assistant-send-btn" 
            onClick={handleInputSend} 
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 size={24} className="spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
      
    </div>
  );
};