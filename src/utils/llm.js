// llm.js — Gemini API Integration for GigShield

const SYSTEM_PROMPT = `You are GigShield's assistant — a plain-language
rights advisor and financial coach for Indian gig workers (delivery
riders, cab drivers). Explain things simply, be encouraging but honest,
and when relevant mention practical next steps like raising a complaint
with the platform or checking their weekly earnings trend. Keep answers
short (3-5 sentences) unless asked for detail.`;

/**
 * Helper function to safely retrieve the API key at request time
 */
function getApiKey() {
  const key = import.meta.env.VITE_LLM_API_KEY;
  if (!key || key.trim() === '' || key === 'your_actual_gemini_api_key_here') {
    throw new Error('Missing VITE_LLM_API_KEY. Please check your .env file and restart your server.');
  }
  return key;
}

/**
 * Sends a user question (plus optional week summary context) to Gemini API
 */
export async function askGigShieldBot(question, weekSummary) {
  const apiKey = getApiKey();

  const context = weekSummary
    ? `\n\nContext on this worker's week: total earnings ₹${weekSummary.totalEarnings}, ` +
      `${weekSummary.flaggedCount} of ${weekSummary.jobCount} jobs flagged as possibly underpaid, ` +
      `${weekSummary.totalHours} hours worked.`
    : '';

  // Using gemini-1.5-flash which is standard on all Google AI Studio keys
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    console.error('Gemini API Error Response:', errData);
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";
}

/**
 * Generates the weekly insight summary
 */
export async function generateWeeklyInsight(weekSummary) {
  const apiKey = getApiKey();

  const prompt = `Summarize this gig worker's week in 2-3 sentences of
  plain, encouraging language, calling out anything concerning:
  Total earnings: ₹${weekSummary.totalEarnings}
  Hours worked: ${weekSummary.totalHours}
  Jobs logged: ${weekSummary.jobCount}
  Jobs flagged as underpaid: ${weekSummary.flaggedCount}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    console.error('Gemini API Error Response:', errData);
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}