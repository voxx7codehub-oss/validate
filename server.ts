import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';

function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Settings endpoint
app.get('/api/settings', (_req: Request, res: Response) => {
  const hasAi = Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
  const hasSearch = Boolean(process.env.SEARCH_API_KEY);
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  res.json({
    aiProviderConfigured: hasAi,
    aiProviderName: hasAi ? `Gemini 2.5 Flash (Active)` : 'Not Configured',
    researchProviderConfigured: hasSearch,
    researchProviderName: hasSearch ? 'External Web Search' : 'None (Connect Research Provider)',
    apiBaseUrl: process.env.API_BASE_URL || '',
    storageType: 'Browser Local Storage',
    hasApiKeySet: hasAi,
  });
});

// Analyze project endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { project } = req.body;
    if (!project) {
      return res.status(400).json({ error: 'Missing project data' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI provider is not configured. Connect an AI provider to continue.',
        code: 'AI_UNAVAILABLE',
      });
    }

    const systemInstruction = `You are VALIDATEAI, a rigorous startup validation analyst.
Your mission is to help founders validate their ideas before spending months building the wrong thing.
CRITICAL RULES:
1. Never invent fake companies, fake website URLs, fake market size statistics, or arbitrary scores.
2. If verified market numbers or evidence do not exist in your certainty, explicitly mark marketSize isVerified as false and state: "Market size information is not available yet. Connect a research provider or add verified research."
3. Every competitive gap must be flagged with isAiHypothesis: true.
4. Formulate strictly neutral, non-leading customer interview questions (e.g. "How do you currently solve this?", "What is difficult about your current solution?", not "Would you buy a tool that...?").
5. The MVP must categorize features strictly into MUST HAVE, SHOULD HAVE, LATER, with an explicit validation purpose for each to stop founders from building before validating.
6. Feasibility areas should use Feasible, Uncertain, Challenging, or Unknown. Never claim guaranteed success or failure.
7. Return ONLY clean JSON without markdown code fences or backticks.`;

    const userPrompt = `Analyze this startup project and return a complete JSON analysis object:
Startup Name: ${project.idea?.startupName || 'Untitled'}
What they are building: ${project.idea?.whatBuilding || ''}
Problem: ${project.idea?.problemSolved || ''}
Who experiences it: ${project.idea?.whoExperiences || ''}
Primary customer: ${project.customerAnalysis?.primaryCustomer || ''}
Customer type: ${project.customerAnalysis?.customerType || 'Startup'}
Industry: ${project.customerAnalysis?.industry || ''}
Geography: ${project.customerAnalysis?.geography || ''}
Solution: ${project.solution?.coreConcept || ''}
Value Proposition: ${project.solution?.valueProposition || ''}
Business Model: ${project.businessModel?.modelType || 'Subscription'}
Target Market: ${project.marketAnalysis?.targetMarket || ''}

Return JSON with exactly this structure:
{
  "problem": {
    "statement": "string",
    "urgency": "Low" | "Medium" | "High" | "Critical",
    "frequency": "Daily" | "Weekly" | "Monthly" | "Occasional",
    "currentAlternatives": ["string"],
    "costOfInaction": "string",
    "sourceType": "AI ANALYSIS"
  },
  "customerAnalysis": {
    "segments": [
      {
        "id": "seg_1",
        "name": "string",
        "description": "string",
        "customerType": "string",
        "primaryIndustry": "string",
        "geography": "string",
        "isPrimary": boolean,
        "buyingFactors": ["string"],
        "typicalObjections": ["string"],
        "sourceType": "AI ANALYSIS"
      }
    ],
    "painPoints": [
      {
        "id": "pain_1",
        "description": "string",
        "severity": "Minor" | "Moderate" | "Severe" | "Critical",
        "frequency": "string",
        "emotionalImpact": "string",
        "sourceType": "AI ANALYSIS"
      }
    ],
    "currentBehavior": "string",
    "customerNeeds": ["string"],
    "buyingFactors": ["string"],
    "objections": ["string"],
    "willingnessToPayNotes": "string",
    "interviewQuestions": [
      {
        "id": "q_1",
        "question": "string",
        "purpose": "string",
        "category": "Problem Frequency" | "Current Behavior" | "Alternative Friction" | "Willingness to Pay" | "Decision Dynamics",
        "isNeutral": true,
        "sourceType": "AI ANALYSIS"
      }
    ]
  },
  "marketAnalysis": {
    "overview": "string",
    "trends": [
      {
        "id": "trend_1",
        "title": "string",
        "direction": "Growing" | "Stable" | "Declining" | "Emerging",
        "impact": "Positive" | "Neutral" | "Negative",
        "description": "string",
        "sourceType": "AI ANALYSIS"
      }
    ],
    "drivers": ["string"],
    "challenges": ["string"],
    "opportunities": ["string"],
    "marketSize": {
      "isVerified": false,
      "unverifiedMessage": "Market size information is not available yet. Connect a research provider or add verified research."
    },
    "dataPoints": []
  },
  "competitorAnalysis": {
    "directCompetitors": [],
    "indirectCompetitors": [],
    "substitutes": [],
    "gaps": [
      {
        "id": "gap_1",
        "area": "Customer" | "Product" | "Pricing" | "Distribution" | "Positioning",
        "observation": "string",
        "opportunity": "string",
        "isAiHypothesis": true,
        "sourceType": "AI ANALYSIS"
      }
    ],
    "differentiationPoints": [
      {
        "id": "diff_1",
        "dimension": "string",
        "advantage": "string",
        "sustainability": "Defensible" | "Moderate" | "Temporary"
      }
    ]
  },
  "feasibilityAnalysis": {
    "areas": [
      {
        "area": "Customer" | "Product" | "Technology" | "Business" | "Operations" | "Regulatory" | "Financial",
        "status": "Feasible" | "Uncertain" | "Challenging" | "Unknown",
        "summary": "string",
        "reasons": ["string"],
        "evidence": [],
        "assumptions": ["string"]
      }
    ]
  },
  "swotAnalysis": {
    "strengths": [{ "id": "s1", "text": "string" }],
    "weaknesses": [{ "id": "w1", "text": "string" }],
    "opportunities": [{ "id": "o1", "text": "string" }],
    "threats": [{ "id": "t1", "text": "string" }]
  },
  "risks": [
    {
      "id": "risk_1",
      "title": "string",
      "description": "string",
      "category": "Customer" | "Market" | "Product" | "Pricing" | "Competition" | "Technology" | "Regulation" | "Operations" | "Revenue",
      "likelihood": "Low" | "Medium" | "High",
      "impact": "Low" | "Medium" | "High",
      "mitigation": "string",
      "validationAction": "string",
      "status": "Active",
      "sourceType": "AI ANALYSIS"
    }
  ],
  "assumptions": [
    {
      "id": "assump_1",
      "statement": "string",
      "category": "Customer" | "Market" | "Product" | "Pricing" | "Revenue",
      "priority": "High" | "Medium" | "Low",
      "status": "Unvalidated",
      "evidence": "",
      "validationMethod": "Interview" | "Survey" | "Landing Page" | "Pricing Test",
      "sourceType": "ASSUMPTION"
    }
  ],
  "validationPlan": {
    "experiments": [
      {
        "id": "exp_1",
        "objective": "string",
        "method": "Interview" | "Survey" | "Landing Page" | "Prototype" | "Pricing Test" | "Concierge",
        "participants": "string",
        "questions": ["string"],
        "successCriteria": "string",
        "status": "Planned",
        "sourceType": "AI ANALYSIS"
      }
    ],
    "checklist": [
      { "id": "c1", "title": "Talked to target customers", "description": "Conduct at least 5 neutral exploratory interviews", "completed": false },
      { "id": "c2", "title": "Confirmed the problem", "description": "Verify the problem occurs frequently and causes measurable friction", "completed": false },
      { "id": "c3", "title": "Identified existing alternatives", "description": "Catalogue what users currently do to solve or endure the issue", "completed": false },
      { "id": "c4", "title": "Tested willingness to pay", "description": "Determine if budgets or personal funds exist for a solution", "completed": false },
      { "id": "c5", "title": "Tested the proposed solution", "description": "Share low-fidelity concept to gauge resonance vs current workarounds", "completed": false },
      { "id": "c6", "title": "Created an early version", "description": "Construct focused MVP testing solely the highest-risk assumption", "completed": false },
      { "id": "c7", "title": "Collected real feedback", "description": "Review observable user actions rather than verbal compliments", "completed": false }
    ],
    "recommendedActions": [
      {
        "id": "act_1",
        "title": "Interview target customers",
        "why": "Confirm whether the problem occurs frequently enough to matter before writing code.",
        "priority": "Immediate",
        "status": "Not Started",
        "category": "Customer"
      },
      {
        "id": "act_2",
        "title": "Research existing solutions",
        "why": "Uncover how target users currently cope and what workarounds they rely on.",
        "priority": "Immediate",
        "status": "Not Started",
        "category": "Competition"
      },
      {
        "id": "act_3",
        "title": "Test willingness to pay",
        "why": "Verify whether users have discretionary budget or active motivation to buy.",
        "priority": "Next",
        "status": "Not Started",
        "category": "Business"
      }
    ]
  },
  "mvpPlan": {
    "coreHypothesisToTest": "string",
    "buildTargetDuration": "2-3 weeks",
    "features": [
      {
        "id": "f_1",
        "feature": "string",
        "description": "string",
        "priority": "MUST HAVE" | "SHOULD HAVE" | "LATER",
        "reason": "string",
        "validationPurpose": "string",
        "sourceType": "AI ANALYSIS"
      }
    ]
  },
  "gtmPlan": {
    "initialCustomer": "string",
    "positioning": "string",
    "acquisitionChannels": [
      {
        "id": "ch_1",
        "channel": "string",
        "tactics": "string",
        "expectedCost": "Low",
        "feasibility": "High"
      }
    ],
    "salesApproach": "string",
    "launchExperiment": "string",
    "firstAction": "string"
  },
  "summary": "string"
}`;

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // Clean possible stray backticks if any
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error analyzing project:', error);
    res.status(500).json({
      error: error?.message || 'We could not complete the analysis right now.',
    });
  }
});

// Research endpoint
app.post('/api/research', async (req: Request, res: Response) => {
  const searchApiKey = process.env.SEARCH_API_KEY;
  if (!searchApiKey) {
    return res.json({
      available: false,
      message: 'Research provider is not configured. Connect a research provider or add verified research.',
    });
  }

  // If search key is present
  res.json({
    available: true,
    provider: 'Configured Research Provider',
    evidence: [],
  });
});

// Competitors endpoint
app.post('/api/competitors', async (req: Request, res: Response) => {
  const { query, industry } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      available: false,
      message: 'AI provider is not configured.',
      competitors: [],
    });
  }

  try {
    const prompt = `Identify 3-5 real known existing competitors or alternatives for a product in industry "${industry}" addressing "${query}".
Never invent fake companies or fake websites. If you do not know real ones with certainty, return only well-known real companies or general substitute categories (e.g., "Manual Spreadsheets", "Pen & Paper").
Return JSON:
{
  "competitors": [
    {
      "id": "string",
      "name": "string",
      "category": "Direct" | "Indirect" | "Substitute",
      "website": "string (real URL or empty)",
      "description": "string",
      "targetCustomer": "string",
      "products": ["string"],
      "pricing": "string",
      "strengths": ["string"],
      "limitations": ["string"],
      "differentiation": "string",
      "source": "AI ANALYSIS"
    }
  ]
}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{"competitors":[]}');
    res.json({ available: true, ...parsed });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Competitor lookup failed' });
  }
});

// Chat assistant endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, projectContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'AI provider is currently unavailable. Connect an AI provider to continue.',
      });
    }

    const systemInstruction = `You are the VALIDATEAI assistant.
You help founders critically validate startup ideas before building.
Your style:
- Direct, clear, objective, and deeply constructive.
- No buzzwords, no hyper-enthusiastic startup clichés.
- Ground your answers in the founder's specific project context.
- Always guide them towards talking to real customers, testing willingness to pay, and shrinking MVP scope to only what is needed to validate the core problem.`;

    const projectContextStr = JSON.stringify(projectContext || {}, null, 2).slice(0, 4000);
    const prompt = `Startup Project Information:\n${projectContextStr}\n\nFounder Question:\n${message}`;

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text || 'No response generated.' });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "We couldn't complete the request right now.",
    });
  }
});

// Report generation endpoint
app.post('/api/report', async (req: Request, res: Response) => {
  try {
    const { project } = req.body;
    res.json({
      success: true,
      reportId: `rep_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      executiveSummary: `Validation report for ${project.name || 'Startup Project'}. The core priority is testing whether the target customer segment feels sufficient pain to seek alternative solutions.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Vite Middleware for development
const isDev = process.env.NODE_ENV !== 'production';

async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`VALIDATEAI server running on http://0.0.0.0:${port}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}

