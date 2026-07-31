import { useState } from 'react';

export default function SafetyButton() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  function handleTrigger() {
    setStatus('locating');
    if (!navigator.geolocation) {
      buildMessage(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => buildMessage(pos.coords),
      () => buildMessage(null),
      { timeout: 5000 }
    );
  }

  function buildMessage(coords) {
    const locationText = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : 'location unavailable';
    const text = `I feel unsafe on my current job and need help. My last known location: ${locationText}. Please check in on me.`;
    setMessage(text);
    setStatus('ready');
  }

  function copyMessage() {
    navigator.clipboard.writeText(message);
  }

  return (
    <div className="card">
      <h2>Safety</h2>
      <button onClick={handleTrigger} style={{ background: '#dc2626' }} disabled={status === 'locating'}>
        {status === 'locating' ? 'Getting location...' : "I feel unsafe"}
      </button>

      {status === 'ready' && (
        <div style={{ marginTop: 12 }}>
          <p style={{ background: '#fef2f2', padding: 12, borderRadius: 8 }}>{message}</p>
          <div className="form-row">
            <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer">
              <button type="button">Send via WhatsApp</button>
            </a>
            <button type="button" onClick={copyMessage}>Copy message</button>
          </div>
        </div>
      )}
    </div>
  );
}