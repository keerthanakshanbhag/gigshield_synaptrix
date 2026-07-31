import { useState } from 'react';
import { checkFairness } from '../utils/fairness';

export default function JobForm({ onAddJob }) {
  const [platform, setPlatform] = useState('');
  const [fare, setFare] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [hour, setHour] = useState(12);
  const [pasteText, setPasteText] = useState('');
  const [showPasteInput, setShowPasteInput] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!platform || !fare || !distance || !time) return;

    const { expectedFare, isUnderpaid, deltaPercent } = checkFairness(
      Number(fare),
      Number(distance),
      Number(hour)
    );

    onAddJob({
      id: Date.now(),
      platform,
      fare: Number(fare),
      distance: Number(distance),
      time: Number(time),
      hour: Number(hour),
      expectedFare,
      isUnderpaid,
      deltaPercent,
    });

    setPlatform(''); setFare(''); setDistance(''); setTime('');
  }

  // Simulated OCR parsing from uploaded screenshot
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      alert(`Scanning "${file.name}" via OCR...`);
      // Auto-fills form fields with simulated OCR data
      setPlatform('Swiggy');
      setFare('55');
      setDistance('8.5');
      setTime('0.75');
    }
  }

  // Parse raw text pasted from app receipts
  function handleParseText() {
    if (!pasteText) return;
    // Basic auto-detection logic or smart mock fill
    setPlatform('Zomato');
    setFare('40');
    setDistance('6.0');
    setTime('0.5');
    setPasteText('');
    setShowPasteInput(false);
    alert('Details parsed from text!');
  }

  return (
    <div className="card">
      <h2>Log a job</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input 
            placeholder="Platform (e.g. Swiggy)" 
            value={platform}
            onChange={(e) => setPlatform(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Fare (₹)" 
            value={fare}
            onChange={(e) => setFare(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Distance (km)" 
            value={distance}
            onChange={(e) => setDistance(e.target.value)} 
          />
        </div>

        <div className="form-row" style={{ marginTop: '10px' }}>
          <input 
            type="number" 
            step="0.1"
            placeholder="Time taken (hrs)" 
            value={time}
            onChange={(e) => setTime(e.target.value)} 
          />
          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i}:00</option>
            ))}
          </select>
          <button type="submit">Add job</button>
        </div>
      </form>

      {/* OCR Screenshot Upload & Text Paste Options */}
      <div style={{ marginTop: '15px', paddingTop: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ cursor: 'pointer', background: '#f3f4f6', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
          📷 Upload Screenshot (OCR)
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleImageUpload} 
          />
        </label>

        <button 
          type="button" 
          onClick={() => setShowPasteInput(!showPasteInput)}
          style={{ background: '#f3f4f6', color: '#374151', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
        >
          📋 Paste Text/Receipt
        </button>
      </div>

      {showPasteInput && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Paste order text e.g. Swiggy fare ₹50 for 7km" 
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            style={{ flex: 1, padding: '6px', fontSize: '13px' }}
          />
          <button type="button" onClick={handleParseText} style={{ padding: '6px 12px', fontSize: '13px' }}>
            Parse
          </button>
        </div>
      )}
    </div>
  );
}