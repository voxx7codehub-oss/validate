import os
import json
from typing import Dict, Any, List
from google import genai
from google.genai import types

class AIService:
    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None

    def is_available(self) -> bool:
        return self.client is not None or bool(os.getenv("GEMINI_API_KEY") or os.getenv("AI_API_KEY"))

    def _get_client(self):
        if not self.client:
            key = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
            if key:
                self.client = genai.Client(api_key=key)
        return self.client

    def analyze_idea(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes a startup idea through structured reasoning:
        Idea, Customer, Market, Competition, Business, Feasibility, Risks, Assumptions, Validation, MVP, GTM.
        Returns validated structured JSON. Never fabricates fake evidence or scores.
        """
        client = self._get_client()
        if not client:
            return {"error": "AI provider is not configured. Please supply an AI_API_KEY in settings or environment."}

        system_instruction = (
            "You are VALIDATEAI, an expert startup validation analyst. "
            "Your job is to critically evaluate early-stage startup ideas without hype, toxic positivity, or fake metrics. "
            "Never invent fake companies, fake website URLs, fake market size statistics, or arbitrary scores. "
            "Clearly distinguish between user input, verified facts, and AI-generated hypotheses. "
            "Formulate neutral, non-leading customer interview questions. "
            "Produce structured, practical validation experiments and an MVP scope focused strictly on testing the core problem. "
            "Respond ONLY with valid JSON matching the requested structure."
        )

        prompt = f"""
Analyze this startup project:
Startup Name: {project_data.get('idea', {}).get('startupName', 'Untitled')}
Building: {project_data.get('idea', {}).get('whatBuilding', '')}
Problem: {project_data.get('idea', {}).get('problemSolved', '')}
Who Experiences: {project_data.get('idea', {}).get('whoExperiences', '')}
Primary Customer: {project_data.get('customer', {}).get('primaryCustomer', '')}
Customer Type: {project_data.get('customer', {}).get('customerType', '')}
Industry: {project_data.get('customer', {}).get('industry', '')}
Geography: {project_data.get('customer', {}).get('geography', '')}
Solution: {project_data.get('business', {}).get('solution', '')}
Value Proposition: {project_data.get('business', {}).get('valueProposition', '')}
Business Model: {project_data.get('business', {}).get('businessModel', '')}
Target Market: {project_data.get('business', {}).get('targetMarket', '')}

Provide a structured JSON output with the following keys:
- problem_analysis: {{ statement, urgency (Low/Medium/High/Critical), frequency, currentAlternatives: [string], costOfInaction }}
- customer_analysis: {{ segments: [{{ id, name, description, customerType, isPrimary, buyingFactors: [string], typicalObjections: [string] }}], painPoints: [{{ id, description, severity (Minor/Moderate/Severe/Critical), frequency }}], currentBehavior, customerNeeds: [string], buyingFactors: [string], objections: [string], willingnessToPayNotes, interviewQuestions: [{{ id, question, purpose, category, isNeutral: true }}] }}
- market_analysis: {{ overview, trends: [{{ id, title, direction (Growing/Stable/Declining/Emerging), impact, description }}], drivers: [string], challenges: [string], opportunities: [string] }}
- competitor_analysis: {{ directCompetitors: [{{ id, name, website, description, targetCustomer, products: [string], pricing, strengths: [string], limitations: [string], differentiation, source }}], indirectCompetitors: [...], substitutes: [...], gaps: [{{ id, area, observation, opportunity, isAiHypothesis: true }}], differentiationPoints: [{{ id, dimension, advantage, sustainability (Defensible/Moderate/Temporary) }}] }}
- feasibility_analysis: {{ areas: [{{ area, status (Feasible/Uncertain/Challenging/Unknown), summary, reasons: [string], evidence: [string], assumptions: [string] }}] }}
- swot_analysis: {{ strengths: [{{ id, text }}], weaknesses: [{{ id, text }}], opportunities: [{{ id, text }}], threats: [{{ id, text }}] }}
- risks: [{{ id, title, description, category (Customer/Market/Product/Pricing/Competition/Technology/Regulation/Operations/Revenue), likelihood (Low/Medium/High), impact (Low/Medium/High), mitigation, validationAction, status: 'Active' }}]
- assumptions: [{{ id, statement, category, priority (High/Medium/Low), status: 'Unvalidated', evidence: '', validationMethod }}]
- validation_plan: {{ experiments: [{{ id, objective, method (Interview/Survey/Landing Page/Prototype/Pricing Test/Preorder/Concierge/Other), participants, questions: [string], successCriteria, status: 'Planned' }}], checklist: [{{ id, title, description, completed: false }}], recommendedActions: [{{ id, title, why, priority (Immediate/Next/Later), status: 'Not Started', category }}] }}
- mvp_plan: {{ coreHypothesisToTest, buildTargetDuration, features: [{{ id, feature, description, priority (MUST HAVE/SHOULD HAVE/LATER), reason, validationPurpose }}] }}
- gtm_plan: {{ initialCustomer, positioning, acquisitionChannels: [{{ id, channel, tactics, expectedCost, feasibility }}], salesApproach, launchExperiment, firstAction }}
- recommendedNextSteps: [{{ id, title, why, priority, status: 'Not Started', category }}]
- summary: string
"""

        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            data = json.loads(response.text)
            return {"success": True, "data": data}
        except Exception as e:
            return {"error": f"AI analysis failed: {str(e)}"}

    def chat_assistant(self, message: str, project_context: Dict[str, Any], history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Context-aware startup validation assistant.
        """
        client = self._get_client()
        if not client:
            return {"error": "AI provider is not configured. Connect an AI provider to chat."}

        system_instruction = (
            "You are the VALIDATEAI Assistant. "
            "You assist founders in critically validating startup ideas. "
            "Anchor all advice in the founder's project context. "
            "Be direct, objective, supportive, and methodologically sound. "
            "Never give generic motivational fluff. Focus on finding uncertainty and reducing risk."
        )

        context_str = json.dumps(project_context, indent=2)[:3000]
        full_prompt = f"Project Context:\n{context_str}\n\nUser Question:\n{message}"

        try:
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3
                )
            )
            return {"reply": response.text}
        except Exception as e:
            return {"error": f"Assistant response failed: {str(e)}"}

ai_service = AIService()
