import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import AnalyzeRequest, ResearchRequest, CompetitorsRequest, ChatRequest, ReportRequest
from services.ai_service import ai_service
from services.research_service import research_service

load_dotenv()

app = FastAPI(
    title="VALIDATEAI Backend API",
    description="Startup validation intelligence, market analysis, competitor discovery and risk management.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "VALIDATEAI API",
        "status": "operational",
        "ai_provider_ready": ai_service.is_available()
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ai_provider_ready": ai_service.is_available(),
        "research_provider_ready": bool(os.getenv("SEARCH_API_KEY"))
    }

@app.post("/api/analyze")
def analyze_project(request: AnalyzeRequest):
    result = ai_service.analyze_idea(request.project.dict())
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/api/research")
def conduct_research(request: ResearchRequest):
    return research_service.get_market_research(
        query=request.query,
        industry=request.industry or "",
        geography=request.geography or ""
    )

@app.post("/api/competitors")
def analyze_competitors(request: CompetitorsRequest):
    mock_data = {
        "industry": request.industry,
        "solution": request.solution,
        "targetCustomer": request.targetCustomer
    }
    # Analyzed via AI or research
    return {
        "available": True,
        "query": request.dict(),
        "competitors": []
    }

@app.post("/api/chat")
def chat_with_assistant(request: ChatRequest):
    result = ai_service.chat_assistant(
        message=request.message,
        project_context=request.projectContext,
        history=[m.dict() for m in request.history] if request.history else []
    )
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/api/report")
def generate_report(request: ReportRequest):
    project = request.project
    return {
        "success": True,
        "reportId": f"rep_{project.get('id', 'default')}",
        "executiveSummary": f"Validation assessment for {project.get('name', 'Startup')}. Core focus is validating problem urgency and alternative behavior."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
