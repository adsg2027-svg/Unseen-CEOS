import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_CONTEXT = `You are a business plan advisor for women micro-entrepreneurs in India's informal economy, part of "The Unseen CEOs" platform.

Rules you must follow in every response:
- Maximum 150 words total
- Use short bullet points (3-5 bullets max) — no long paragraphs
- Lead with the single most important number or insight
- All amounts in ₹ (INR)
- Skip greetings, closings, and filler phrases
- Be direct and practical — informal economy context (SHGs, MUDRA, Udyam)

For strengths & weaknesses analysis:
- List 3 KEY STRENGTHS based on revenue, agency score, sector, and growth indicators
- List 3 KEY WEAKNESSES or risk areas based on low scores, funding gaps, or market challenges
- Format clearly with "💪 Strengths:" and "⚠️ Weaknesses:" headers
- Each point must be specific to the entrepreneur's actual data, not generic`;

let genAI = null;
let model = null;

function initializeClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return false;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }
  return true;
}

export function isApiKeyConfigured() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return apiKey && apiKey !== 'your_gemini_api_key_here';
}

export async function sendMessage(userMessage, conversationHistory = [], entrepreneurContext = null) {
  if (!initializeClient()) {
    return { success: false, error: 'Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the dev server.' };
  }

  try {
    let contextualPrompt = SYSTEM_CONTEXT;
    if (entrepreneurContext) {
      contextualPrompt += `\n\nContext about the entrepreneur you are helping:
Name: ${entrepreneurContext.name}
Business: ${entrepreneurContext.businessName} (${entrepreneurContext.sector})
Location: ${entrepreneurContext.location}
Monthly Revenue: ₹${entrepreneurContext.monthlyRevenue?.toLocaleString('en-IN')}
Monthly Profit: ₹${entrepreneurContext.monthlyProfit?.toLocaleString('en-IN')}
Agency Score: ${entrepreneurContext.agencyScore?.percentage}%
Challenges: ${entrepreneurContext.challenges?.join(', ')}`;
    }

    const history = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: contextualPrompt + '\n\nPlease acknowledge you understand your role briefly.' }] },
        { role: 'model', parts: [{ text: 'Understood. I\'m ready to help with practical business advice for women micro-entrepreneurs in India. How can I assist?' }] },
        ...history,
      ],
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.5,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();
    return { success: true, data: response };
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error.message?.includes('API_KEY')) {
      return { success: false, error: 'Invalid API key. Please check your VITE_GEMINI_API_KEY in the .env file.' };
    }
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      return { success: false, error: 'API rate limit reached. Please wait a moment and try again.' };
    }
    return { success: false, error: 'Failed to get a response. Please try again.' };
  }
}

export async function analyzeStrengthsWeaknesses(entrepreneur) {
  if (!entrepreneur) return { success: false, error: 'No entrepreneur data provided.' };

  const prompt = `Analyze key strengths and weaknesses for ${entrepreneur.name}'s business "${entrepreneur.businessName}" (${entrepreneur.sector}) in ${entrepreneur.location}.
Data: Revenue ₹${entrepreneur.monthlyRevenue?.toLocaleString('en-IN')}/mo, Profit ₹${entrepreneur.monthlyProfit?.toLocaleString('en-IN')}/mo, Agency Score ${entrepreneur.agencyScore?.percentage ?? 'N/A'}%, Funding needed ₹${entrepreneur.fundingNeeded?.toLocaleString('en-IN')} for ${entrepreneur.fundingPurpose}, Years in business: ${entrepreneur.yearsInBusiness}.

Give exactly:
💪 Strengths: (3 bullets, specific to her data)
⚠️ Weaknesses: (3 bullets, specific gaps or risks)
Max 130 words total.`;

  return sendMessage(prompt);
}

export async function generateBusinessPlanSection(entrepreneur, sectionType) {
  const prompts = {
    revenue_model: `Revenue model for ${entrepreneur.name}'s "${entrepreneur.businessName}" (${entrepreneur.sector}). Unit: ${entrepreneur.unitEconomics?.productName} @ ₹${entrepreneur.unitEconomics?.unitPrice}, ${entrepreneur.unitEconomics?.dailyUnits} units/day. In 3-5 bullet points: current monthly revenue, top revenue driver, one pricing improvement, one volume growth lever. Max 120 words.`,
    unit_economics: `Unit economics for "${entrepreneur.businessName}". Selling price ₹${entrepreneur.unitEconomics?.unitPrice}, cost ₹${entrepreneur.unitEconomics?.unitCost}, volume ${entrepreneur.unitEconomics?.dailyUnits} units/day. In 4 bullet points: gross margin %, contribution margin, monthly break-even units, one cost-reduction tip. Max 100 words.`,
    working_capital: `Working capital for "${entrepreneur.businessName}" — monthly costs ₹${entrepreneur.monthlyCosts?.toLocaleString('en-IN')}, revenue ₹${entrepreneur.monthlyRevenue?.toLocaleString('en-IN')}. In 4 bullet points: recommended working capital amount, why ₹1 lakh is optimal at this scale, working capital cycle days, best funding source (SHG/MUDRA/etc). Max 120 words.`,
    growth_plan: `Growth plan for "${entrepreneur.businessName}" in ${entrepreneur.location}. Funding sought: ₹${entrepreneur.fundingNeeded?.toLocaleString('en-IN')} for ${entrepreneur.fundingPurpose}. Give exactly 3 bullets: 3-month target, 12-month target, 2-year vision. Each bullet = one specific, measurable action. Max 100 words.`,
  };

  const prompt = prompts[sectionType];
  if (!prompt) {
    return { success: false, error: 'Unknown section type' };
  }

  return sendMessage(prompt);
}
