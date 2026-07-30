// fairness.js
// Simple fair-rate benchmark model.
// Replace these numbers with a quick web-researched reference
// (e.g. average per-km delivery/ride rates) before the demo —
// judges like to see the number is grounded in something real,
// even if the dataset itself is small/simulated.

export const FAIR_RATE_PER_KM = {
  day: 15,   // ₹ per km, 6:00–22:00
  night: 20, // ₹ per km, 22:00–6:00 (night surcharge expected)
};

const UNDERPAYMENT_THRESHOLD = 0.85; // flag if actual pay < 85% of expected

/**
 * Determines whether a logged job was likely underpaid.
 * @param {number} fare - amount actually paid (₹)
 * @param {number} distanceKm - trip distance in km
 * @param {number} hour - hour of day the job happened (0-23)
 * @returns {{ expectedFare: number, isUnderpaid: boolean, deltaPercent: number }}
 */
export function checkFairness(fare, distanceKm, hour) {
  const isNight = hour < 6 || hour >= 22;
  const rate = isNight ? FAIR_RATE_PER_KM.night : FAIR_RATE_PER_KM.day;
  const expectedFare = rate * distanceKm;
  const isUnderpaid = fare < expectedFare * UNDERPAYMENT_THRESHOLD;
  const deltaPercent = expectedFare > 0
    ? Math.round(((fare - expectedFare) / expectedFare) * 100)
    : 0;

  return { expectedFare: Math.round(expectedFare), isUnderpaid, deltaPercent };
}

/**
 * Builds a plain-language weekly summary object from a list of jobs.
 * This is the data you hand to the LLM to generate the
 * "AI-generated weekly insight" feature.
 */
export function summarizeWeek(jobs) {
  const totalEarnings = jobs.reduce((sum, j) => sum + Number(j.fare), 0);
  const flaggedJobs = jobs.filter((j) => j.isUnderpaid);
  const totalHours = jobs.reduce((sum, j) => sum + Number(j.time), 0);

  return {
    totalEarnings,
    totalHours,
    jobCount: jobs.length,
    flaggedCount: flaggedJobs.length,
    flaggedJobs,
  };
}
