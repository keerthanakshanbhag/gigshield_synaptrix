import { useState } from 'react';
import { askGigShieldBot } from '../utils/llm';

export default function Chatbot({ weekSummary }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! Ask me things like \"is this fare fair?\" or \"what are my rights?\"" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askGigShieldBot(input, weekSummary);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong reaching the AI.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Ask GigShield</h2>
      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="chat-msg bot">Thinking...</div>}
      </div>
      <div className="form-row">
        <input
          placeholder="Type a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
