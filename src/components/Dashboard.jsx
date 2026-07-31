import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { summarizeWeek } from '../utils/fairness';

export default function Dashboard({ jobs }) {
  const summary = summarizeWeek(jobs);
  const chartData = jobs.map((j, idx) => ({
    name: `Job ${idx + 1}`,
    fare: j.fare,
    expected: j.expectedFare,
  }));

  // Helper function to handle copying the complaint draft
  const handleDraftComplaint = (job) => {
    const draftText = `Hello ${job.platform} Support,\n\nI am disputing the payout for my recent job logged on platform ${job.platform}.\n\nDetails:\n- Actual Fare Paid: ₹${job.fare}\n- Benchmark Expected Fare: ₹${job.expectedFare}\n- Underpayment Margin: ${job.deltaPercent}%\n\nBased on distance and time benchmarks, this trip was underpaid. Please review this discrepancy and adjust the payment.\n\nThank you.`;
    navigator.clipboard.writeText(draftText);
    alert(`Complaint draft copied to clipboard!\n\n${draftText}`);
  };

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
          {/* MODIFICATION 1: Line 38 - Added "Actions" header column */}
          <tr><th>Platform</th><th>Fare</th><th>Expected</th><th>Status</th><th>Actions</th></tr>
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
              {/* MODIFICATION 2: Line 48 - Added dynamic Draft Complaint action button */}
              <td>
                {j.isUnderpaid ? (
                  <button 
                    onClick={() => handleDraftComplaint(j)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📝 Draft Complaint
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#888' }}>—</span>
                )}
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            /* MODIFICATION 3: Line 68 - Adjusted colSpan to 5 for empty table state */
            <tr><td colSpan={5}>No jobs logged yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}