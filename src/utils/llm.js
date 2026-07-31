import { HfInference } from '@huggingface/inference';

const apiKey = import.meta.env.VITE_HF_API_KEY || '';
const hf = new HfInference(apiKey);

// Comprehensive local Knowledge Base for GigShield (Fast & Offline-proof)
function getSmartFallback(question, weekSummary) {
  const q = question.toLowerCase();

  // 1. FARES & UNDERPAYMENT
  if (q.includes("fair") || q.includes("fare") || q.includes("underpaid") || q.includes("low pay") || q.includes("calculation")) {
    return "GigShield calculates fairness based on a benchmark of base rate (e.g. ₹20-30) + distance pay (e.g. ₹10-15/km). If your actual payout is significantly lower than expected, save your trip ID and submit a pay dispute through your app's help desk.";
  }

  // 2. WORKER RIGHTS & LEGAL
  if (q.includes("right") || q.includes("law") || q.includes("legal") || q.includes("protection") || q.includes("rights")) {
    return "As a gig worker, you are entitled to clear fare transparency, active shift accident insurance coverage, protection against arbitrary account blocks, and a fair internal dispute resolution mechanism without penalization.";
  }

  // 3. GETTING BETTER ORDERS / INCREASING EARNINGS
  if (q.includes("better") || q.includes("more money") || q.includes("increase") || q.includes("boost") || q.includes("high pay") || q.includes("orders")) {
    return "To maximize daily earnings, position yourself in high-demand delivery zones during peak windows (12:00 PM – 3:30 PM lunch & 7:00 PM – 10:30 PM dinner). Maintaining a high acceptance rate also prioritizes you for stacked orders.";
  }

  // 4. COMPLAINT & DISPUTE PROCESS
  if (q.includes("complaint") || q.includes("raise") || q.includes("dispute") || q.includes("ticket") || q.includes("support")) {
    return "To lodge a complaint: 1) Go to your platform's Help/Support section. 2) Select 'Earnings & Trip Disputes'. 3) Attach screenshots of the order summary and actual payout. 4) Request a manual review for base rate shortfall.";
  }

  // 5. SAFETY & EMERGENCY
  if (q.includes("safe") || q.includes("danger") || q.includes("night") || q.includes("emergency") || q.includes("help")) {
    return "Your safety comes first. Avoid unlit or unmarked locations during late-night shifts. Use GigShield's safety tools or your platform's emergency SOS button immediately if you feel threatened or unsafe on a route.";
  }

  // 6. FATIGUE & HOURS WORKED
  if (q.includes("rest") || q.includes("hours") || q.includes("break") || q.includes("fatigue") || q.includes("tired")) {
    const hours = weekSummary?.totalHours || 0;
    return `You've logged around ${hours} hours recently. Continuous shifts past 8-10 hours significantly increase accident risks and lower efficiency. Consider taking a 30-minute break to recharge!`;
  }

  // 7. WEEKLY INSIGHT / SUMMARY
  if (q.includes("week") || q.includes("summary") || q.includes("total") || q.includes("performance")) {
    return `This week you earned ₹${weekSummary?.totalEarnings ?? 0} across ${weekSummary?.jobCount ?? 0} jobs. Keep checking flagged trips on your dashboard to ensure no underpayments go unnoticed!`;
  }

  // 8. GENERAL / DEFAULT ADVICE
  return "GigShield is built to protect gig workers. Ask me about your ride payouts, safety rights, how to raise complaint tickets, or tips to optimize your peak-hour earnings!";
}

export async function askGigShieldBot(question, weekSummary = null) {
  // If no valid HF key is present, immediately return the smart fallback response
  if (!apiKey || !apiKey.startsWith('hf_')) {
    return getSmartFallback(question, weekSummary);
  }

  try {
    const context = weekSummary
      ? `\nWorker Context: Earnings ₹${weekSummary.totalEarnings ?? 0}, ${weekSummary.flaggedCount ?? 0} flagged jobs.`
      : '';

    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct", // Reliable public serverless model
      messages: [
        { role: "system", content: "You are GigShield's assistant — an AI rights advisor and financial coach for Indian gig workers. Keep responses clear, practical, and under 3-4 sentences." },
        { role: "user", content: `${context}\nQuestion: ${question}` }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.warn("API Call failed, falling back to local KB:", error.message);
    return getSmartFallback(question, weekSummary);
  }
}




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