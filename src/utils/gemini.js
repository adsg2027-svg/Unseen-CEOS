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

export async function generatePitchDeck(profile) {
  if (!initializeClient()) return { success: false, error: 'Gemini API key not configured.' };

  const fmt = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';
  const margin = profile.monthlyRevenue > 0
    ? Math.round((profile.monthlyProfit / profile.monthlyRevenue) * 100)
    : 0;

  const prompt = `You are creating a professional investor pitch deck for an Indian woman micro-entrepreneur. Use ONLY the data below — no generic placeholders.

ENTREPRENEUR DATA:
Name: ${profile.name} | Business: ${profile.businessName} | Type: ${profile.businessType || 'N/A'}
Sector: ${profile.sector} | Location: ${profile.location}, ${profile.state || ''}
Years in Business: ${profile.yearsInBusiness} | Registration: ${profile.registrationType}

FINANCIALS:
Revenue: ${fmt(profile.monthlyRevenue)}/mo | Costs: ${fmt(profile.monthlyCosts)}/mo
Profit: ${fmt(profile.monthlyProfit)}/mo | Margin: ${margin}%

PRODUCT: ${profile.unitEconomics?.productName || 'N/A'} | Price: ${fmt(profile.unitEconomics?.unitPrice)} | Cost: ${fmt(profile.unitEconomics?.unitCost)} | Daily units: ${profile.unitEconomics?.dailyUnits || 0} | Unit margin: ${fmt(profile.unitEconomics?.marginPerUnit)}

FUNDING GOAL: ${fmt(profile.fundingNeeded)} for "${profile.fundingPurpose}"
Current sources: ${(profile.currentFundingSources || []).join(', ') || 'None'}

GROWTH PLANS:
3 months: ${profile.growthPlan?.shortTerm || 'N/A'}
6-12 months: ${profile.growthPlan?.mediumTerm || 'N/A'}
2-3 years: ${profile.growthPlan?.longTerm || 'N/A'}

CHALLENGES: ${(profile.challenges || []).join(', ') || 'None listed'}
AGENCY SCORE: ${profile.agencyScore?.percentage || 0}%

Generate a 7-slide investor pitch deck. Respond with ONLY valid JSON (no markdown, no code fences):
{"deckTitle":"...","slides":[{"type":"cover","title":"...","content":"...","bullets":["...","...","..."]},{"type":"problem","title":"...","content":"...","bullets":["...","...","..."]},{"type":"solution","title":"...","content":"...","bullets":["...","...","..."]},{"type":"traction","title":"...","content":"...","bullets":["...","...","..."]},{"type":"financials","title":"...","content":"...","bullets":["...","...","..."]},{"type":"team","title":"...","content":"...","bullets":["...","...","..."]},{"type":"ask","title":"...","content":"...","bullets":["...","...","..."]}]}

Rules (strict):
- content: 2 compelling sentences telling her story using actual numbers
- bullets: exactly 3 specific data-backed points each
- titles: make them punchy using real numbers (e.g. "${fmt(profile.monthlyRevenue)}/mo Revenue" not "Traction")
- team slide: about ${profile.name}, her background, what makes her the right person
- problem slide: what market gap her business addresses in ${profile.sector} in India
- Use ${fmt(profile.fundingNeeded)} and all real numbers throughout`;

  try {
    if (!model) initializeClient();
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
    });
    const text = result.response.text().trim();
    const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(jsonStr);
    return { success: true, data: parsed };
  } catch (err) {
    console.error('generatePitchDeck error:', err);
    return { success: false, error: err.message };
  }
}

export async function generateSlideContent(profile, slideType, slideTitle) {
  if (!initializeClient()) return { success: false, error: 'Gemini API key not configured.' };

  const fmt = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';
  const margin = profile.monthlyRevenue > 0
    ? Math.round((profile.monthlyProfit / profile.monthlyRevenue) * 100)
    : 0;

  const slideContexts = {
    cover:          `Introduce ${profile.name}'s business ${profile.businessName} (${profile.sector}, ${profile.location}). ${profile.yearsInBusiness} years old, ${fmt(profile.monthlyRevenue)}/mo revenue.`,
    problem:        `What problem in the ${profile.sector} sector does ${profile.businessName} solve? Challenges faced: ${(profile.challenges || []).join(', ')}.`,
    solution:       `How does ${profile.businessName} solve this? Product: ${profile.unitEconomics?.productName || profile.businessType}, price ₹${profile.unitEconomics?.unitPrice}/unit, ${margin}% margin.`,
    'business-model': `How does ${profile.businessName} make money? ${fmt(profile.monthlyRevenue)}/mo from ${profile.unitEconomics?.productName || profile.sector}. ${fmt(profile.unitEconomics?.unitPrice)} per unit, ${profile.unitEconomics?.dailyUnits} units/day.`,
    market:         `Market opportunity for ${profile.sector} in India, targeting ${profile.location} and beyond. ${profile.businessType} business model.`,
    traction:       `Business traction: ${fmt(profile.monthlyRevenue)}/mo revenue, ${fmt(profile.monthlyProfit)}/mo profit, ${margin}% margin, ${profile.yearsInBusiness} years running. Growth plan: ${profile.growthPlan?.shortTerm}.`,
    financials:     `Financials: Revenue ${fmt(profile.monthlyRevenue)}/mo, Costs ${fmt(profile.monthlyCosts)}/mo, Profit ${fmt(profile.monthlyProfit)}/mo, Margin ${margin}%. Unit economics: ${fmt(profile.unitEconomics?.unitPrice)} price, ${fmt(profile.unitEconomics?.unitCost)} cost.`,
    team:           `About ${profile.name}: ${profile.yearsInBusiness} years running ${profile.businessName} in ${profile.location}. Registration: ${profile.registrationType}. Agency score: ${profile.agencyScore?.percentage}%.`,
    ask:            `Funding ask: ${fmt(profile.fundingNeeded)} for "${profile.fundingPurpose}". Current sources: ${(profile.currentFundingSources || []).join(', ')}. Growth milestones: ${profile.growthPlan?.mediumTerm}.`,
    custom:         `Content for the "${slideTitle}" slide of ${profile.businessName}'s pitch deck.`,
  };

  const context = slideContexts[slideType] || slideContexts.custom;
  const prompt = `Generate pitch deck slide content. Slide: "${slideTitle}" (type: ${slideType}). Context: ${context}

Respond with ONLY valid JSON (no markdown):
{"content":"2 compelling sentences using real numbers","bullets":["specific point 1","specific point 2","specific point 3"]}`;

  try {
    if (!model) initializeClient();
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
    });
    const text = result.response.text().trim();
    const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(jsonStr);
    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: err.message };
  }
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
