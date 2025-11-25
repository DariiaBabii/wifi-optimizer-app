import { useState } from 'react';
import { Header } from '../../components/Header/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AssistantPage.css';

export const AssistantPage = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; isMarkdown?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/assistant/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt_data: userText }),
      });

      const data = await response.json();
      const assistantText = data.response;

      setMessages(prev => [...prev, { role: 'assistant', text: assistantText, isMarkdown: true }]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: '⚠ Помилка з\'єднання з сервером', isMarkdown: false },
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assistant-container">
      <Header title="Assistant" />

      <div className="assistant-window">
        {messages.length === 0 && (
          <div className="assistant-placeholder">
            I'm your AI assistant! Ask me any questions you're interested in...
          </div>
        )}

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
            ...
          </div>
        )}
      </div>

      <div className="assistant-input-row">
        <input
          className="assistant-input"
          placeholder="Enter your query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        <button className="assistant-send-btn" onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
};
