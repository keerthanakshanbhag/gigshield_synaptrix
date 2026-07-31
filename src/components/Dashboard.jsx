import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { summarizeWeek } from '../utils/fairness';

export default function Dashboard({ jobs }) {
  const summary = summarizeWeek(jobs);
  const chartData = jobs.map((j, idx) => ({
    name: `Job ${idx + 1}`,
    fare: j.fare,
    expected: j.expectedFare,
  }));

  return (
    <div className="card">
      <h2>Dashboard</h2>

      <div className="stats">
        <div className="stat-box">
          <div className="value">₹{summary.totalEarnings}</div>
          <div className="label">Total earnings</div>
        </div>
        <div className="stat-box">
          <div className="value">{summary.totalHours}</div>
          <div className="label">Hours worked</div>
        </div>
        <div className="stat-box">
          <div className="value">{summary.flaggedCount}</div>
          <div className="label">Flagged underpayments</div>
        </div>
      </div>

      {jobs.length > 0 && (
        <div style={{ height: 220, marginBottom: 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="fare" fill="#7c3aed" name="Actual fare" />
              <Bar dataKey="expected" fill="#c4b5fd" name="Expected fair fare" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <table>
        <thead>
          <tr><th>Platform</th><th>Fare</th><th>Expected</th><th>Status</th></tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.platform}</td>
              <td>₹{j.fare}</td>
              <td>₹{j.expectedFare}</td>
              <td className={j.isUnderpaid ? 'flag' : 'ok'}>
                {j.isUnderpaid ? `Underpaid (${j.deltaPercent}%)` : 'Fair'}
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr><td colSpan={4}>No jobs logged yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
