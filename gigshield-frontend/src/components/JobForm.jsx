import { useState } from 'react';
import { checkFairness } from '../utils/fairness';

export default function JobForm({ onAddJob }) {
  const [platform, setPlatform] = useState('');
  const [fare, setFare] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [hour, setHour] = useState(12);

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

  return (
    <div className="card">
      <h2>Log a job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input placeholder="Platform (e.g. Swiggy)" value={platform}
            onChange={(e) => setPlatform(e.target.value)} />
          <input type="number" placeholder="Fare (₹)" value={fare}
            onChange={(e) => setFare(e.target.value)} />
          <input type="number" placeholder="Distance (km)" value={distance}
            onChange={(e) => setDistance(e.target.value)} />
        </div>
        <div className="form-row">
          <input type="number" placeholder="Time taken (hrs)" value={time}
            onChange={(e) => setTime(e.target.value)} />
          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i}:00</option>
            ))}
          </select>
          <button type="submit">Add job</button>
        </div>
      </form>
    </div>
  );
}
