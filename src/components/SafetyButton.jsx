import { useState } from 'react';

export default function SafetyButton({ totalHoursWorked = 0 }) {
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

  const hoursNum = Number(totalHoursWorked);

  return (
    <div className="card">
      <h2>Safety & Burnout Detector</h2>

      {/* Burnout & Fatigue Alert Card */}
      <div style={{ marginBottom: 16 }}>
        {hoursNum >= 6 ? (
          <div style={{
            background: '#fffbebe6',
            borderLeft: '4px solid #f59e0b',
            color: '#92400e',
            padding: 12,
            borderRadius: 8,
            fontSize: '13px'
          }}>
            ⚠️ <strong>Fatigue Warning:</strong> You've logged <strong>{hoursNum} hrs</strong> today. Unusually long shifts increase accident risk—consider taking a break!
          </div>
        ) : (
          <div style={{
            background: '#f0fdf4',
            borderLeft: '4px solid #22c55e',
            color: '#166534',
            padding: 12,
            borderRadius: 8,
            fontSize: '13px'
          }}>
            ✅ <strong>Shift Status:</strong> {hoursNum} hrs logged today. Safe operating limits active.
          </div>
        )}
      </div>

      {/* Emergency Trigger Section */}
      <button 
        onClick={handleTrigger} 
        style={{ 
          background: '#dc2626', 
          color: '#fff', 
          border: 'none', 
          padding: '10px 16px', 
          borderRadius: 8, 
          cursor: 'pointer', 
          fontWeight: 'bold' 
        }} 
        disabled={status === 'locating'}
      >
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