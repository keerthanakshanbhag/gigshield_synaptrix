// llm.js — this is the "AI component" of the app: real calls to an
// LLM API. Swap in whichever provider your team picks (Gemini's free
// tier is usually fastest to get an API key for during a hackathon).
//
// IMPORTANT: never commit your real API key to GitHub. Put it in a
// .env file (already gitignored) and read it via import.meta.env.

const API_KEY = import.meta.env.VITE_LLM_API_KEY;

const SYSTEM_PROMPT = `You are GigShield's assistant — a plain-language
rights advisor and financial coach for Indian gig workers (delivery
riders, cab drivers). Explain things simply, be encouraging but honest,
and when relevant mention practical next steps like raising a complaint
with the platform or checking their weekly earnings trend. Keep answers
short (3-5 sentences) unless asked for detail.`;

/**
 * Sends a user question (plus optional week summary context) to the LLM
 * and returns the text response.
 */
export async function askGigShieldBot(question, weekSummary) {
  const context = weekSummary
    ? `\n\nContext on this worker's week: total earnings ₹${weekSummary.totalEarnings}, ` +
      `${weekSummary.flaggedCount} of ${weekSummary.jobCount} jobs flagged as possibly underpaid, ` +
      `${weekSummary.totalHours} hours worked.`
    : '';

  // --- Example using Google Gemini's generateContent endpoint ---
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${SYSTEM_PROMPT}${context}\n\nWorker's question: ${question}` }],
          },
        ],
      }),
    }
  );

  if (!response.ok) throw new Error('LLM request failed');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";
}

/**
 * Generates the "AI-generated weekly insight" feature — one LLM call
 * that turns the raw weekly numbers into a plain-language summary.
 */
export async function generateWeeklyInsight(weekSummary) {
  const prompt = `Summarize this gig worker's week in 2-3 sentences of
  plain, encouraging language, calling out anything concerning:
  Total earnings: ₹${weekSummary.totalEarnings}
  Hours worked: ${weekSummary.totalHours}
  Jobs logged: ${weekSummary.jobCount}
  Jobs flagged as underpaid: ${weekSummary.flaggedCount}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!response.ok) throw new Error('LLM request failed');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}
