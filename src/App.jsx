import { useState } from 'react';
import JobForm from './components/JobForm';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import WeeklyInsight from './components/WeeklyInsight';
import SafetyButton from './components/SafetyButton';
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
      <WeeklyInsight weekSummary={weekSummary} />
      <Chatbot weekSummary={weekSummary} />
      
      {/* Updated line below: passing total hours into SafetyButton */}
      <SafetyButton totalHoursWorked={weekSummary.totalHours} />
    </div>
  );
}