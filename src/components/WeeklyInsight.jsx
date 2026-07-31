import { useState } from 'react';
import { generateWeeklyInsight } from '../utils/llm';

export default function WeeklyInsight({ weekSummary }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (weekSummary.jobCount === 0) return;
    setLoading(true);
    try {
      const text = await generateWeeklyInsight(weekSummary);
      setInsight(text);
    } catch (err) {
      setInsight("Couldn't generate an insight right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Weekly AI insight</h2>
      <button onClick={handleGenerate} disabled={loading || weekSummary.jobCount === 0}>
        {loading ? 'Generating...' : 'Generate this week\'s insight'}
      </button>
      {insight && <p style={{ marginTop: 12, lineHeight: 1.5 }}>{insight}</p>}
      {weekSummary.jobCount === 0 && (
        <p style={{ color: '#888', marginTop: 12 }}>Log a few jobs first, then generate an insight.</p>
      )}
    </div>
  );
}