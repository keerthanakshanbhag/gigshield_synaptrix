import { useState } from 'react';
import JobForm from './components/JobForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import { summarizeWeek } from './utils/fairness';

export default function App() {
  const [jobs, setJobs] = useState([]);

  function handleAddJob(job) {
    setJobs((prev) => [...prev, job]);
  }

  const weekSummary = summarizeWeek(jobs);

  return (
    <div className="app">
      <h1>GigShield</h1>
      <p className="subtitle">AI companion for fair wages & worker safety</p>

      <JobForm onAddJob={handleAddJob} />
      <Dashboard jobs={jobs} />
      <Chatbot weekSummary={weekSummary} />
    </div>
  );
}
