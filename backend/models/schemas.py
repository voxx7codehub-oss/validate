from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ProjectIdeaInput(BaseModel):
    startupName: Optional[str] = ""
    whatBuilding: str
    problemSolved: str
    whoExperiences: str

class ProjectCustomerInput(BaseModel):
    primaryCustomer: str
    industry: str
    geography: str
    customerType: str

class ProjectBusinessInput(BaseModel):
    solution: str
    valueProposition: str
    businessModel: str
    targetMarket: str

class FullProjectInput(BaseModel):
    idea: ProjectIdeaInput
    customer: ProjectCustomerInput
    business: ProjectBusinessInput
    currentAssumptions: Optional[List[Dict[str, Any]]] = []
    currentRisks: Optional[List[Dict[str, Any]]] = []

class AnalyzeRequest(BaseModel):
    project: FullProjectInput

class ResearchRequest(BaseModel):
    query: str
    industry: Optional[str] = None
    geography: Optional[str] = None

class CompetitorsRequest(BaseModel):
    industry: str
    solution: str
    targetCustomer: str

class ChatMessage(BaseModel):
    role: str # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    projectContext: Dict[str, Any]
    history: Optional[List[ChatMessage]] = []

class ReportRequest(BaseModel):
    project: Dict[str, Any]
