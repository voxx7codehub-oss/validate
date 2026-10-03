/**
 * VALIDATEAI - Comprehensive Domain Data Models & Types
 */

export type SourceType = 'VERIFIED' | 'AI ANALYSIS' | 'USER INPUT' | 'ASSUMPTION' | 'NEEDS VALIDATION';

export type StatusIndicator = 'Complete' | 'Needs Review' | 'Not Started';

export type CustomerType =
  | 'Consumer'
  | 'Small Business'
  | 'Startup'
  | 'Enterprise'
  | 'Government'
  | 'Education'
  | 'Other';

export type BusinessModelType =
  | 'Subscription'
  | 'One-time Purchase'
  | 'Marketplace'
  | 'Commission'
  | 'Freemium'
  | 'Advertising'
  | 'Usage Based'
  | 'Other';

export interface Idea {
  startupName: string;
  whatBuilding: string;
  problemSolved: string;
  whoExperiences: string;
  sourceType: SourceType;
  updatedAt: string;
}

export interface Problem {
  statement: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Occasional';
  currentAlternatives: string[];
  costOfInaction: string;
  sourceType: SourceType;
}

export interface Solution {
  coreConcept: string;
  valueProposition: string;
  keyDifferentiators: string[];
  deliveryMechanism: string;
  sourceType: SourceType;
}

export interface CustomerPainPoint {
  id: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  frequency: string;
  emotionalImpact?: string;
  sourceType: SourceType;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerType: CustomerType;
  primaryIndustry: string;
  geography: string;
  isPrimary: boolean;
  buyingFactors: string[];
  typicalObjections: string[];
  sourceType: SourceType;
}

export interface CustomerAnalysis {
  primaryCustomer: string;
  industry: string;
  geography: string;
  customerType: CustomerType;
  segments: CustomerSegment[];
  painPoints: CustomerPainPoint[];
  currentBehavior: string;
  customerNeeds: string[];
  buyingFactors: string[];
  objections: string[];
  willingnessToPayNotes: string;
  interviewQuestions: InterviewQuestion[];
  sourceType: SourceType;
}

export interface PricingModel {
  type: string;
  startingPrice?: string;
  billingCadence?: string;
  targetTier?: string;
  rationale: string;
  sourceType: SourceType;
}

export interface RevenueStream {
  id: string;
  name: string;
  modelType: BusinessModelType;
  description: string;
  projectedContribution: string;
  sourceType: SourceType;
}

export interface BusinessModel {
  modelType: BusinessModelType;
  valueProposition: string;
  revenueStreams: RevenueStream[];
  pricing: PricingModel;
  customerChannels: string[];
  costStructure: string[];
  keyResources: string[];
  keyPartners: string[];
  sourceType: SourceType;
}

export interface MarketSize {
  isVerified: boolean;
  tam?: string; // Total Addressable Market
  sam?: string; // Serviceable Addressable Market
  som?: string; // Serviceable Obtainable Market
  currency?: string;
  source?: string;
  publisher?: string;
  date?: string;
  url?: string;
  notes?: string;
  unverifiedMessage?: string;
}

export interface MarketTrend {
  id: string;
  title: string;
  direction: 'Growing' | 'Stable' | 'Declining' | 'Emerging';
  impact: 'Positive' | 'Neutral' | 'Negative';
  description: string;
  sourceType: SourceType;
}

export interface MarketDataPoint {
  category: string;
  value: number;
  unit: string;
  label: string;
}

export interface MarketAnalysis {
  overview: string;
  industry: string;
  targetMarket: string;
  geography: string;
  trends: MarketTrend[];
  drivers: string[];
  challenges: string[];
  opportunities: string[];
  marketSize: MarketSize;
  dataPoints: MarketDataPoint[];
  sourceType: SourceType;
}

export interface Competitor {
  id: string;
  name: string;
  category: 'Direct' | 'Indirect' | 'Substitute';
  website: string;
  description: string;
  targetCustomer: string;
  products: string[];
  pricing: string;
  strengths: string[];
  limitations: string[];
  differentiation: string;
  source: string;
  sourceType: SourceType;
}

export interface CompetitorComparison {
  dimension: string;
  ourStartup: string;
  competitorNames: Record<string, string>;
}

export interface CompetitiveGap {
  id: string;
  area: 'Customer' | 'Product' | 'Pricing' | 'Distribution' | 'Positioning';
  observation: string;
  opportunity: string;
  isAiHypothesis: boolean; // clearly labelled as AI-generated hypothesis
  sourceType: SourceType;
}

export interface DifferentiationPoint {
  id: string;
  dimension: string;
  advantage: string;
  sustainability: 'Defensible' | 'Moderate' | 'Temporary';
}

export interface CompetitorAnalysis {
  directCompetitors: Competitor[];
  indirectCompetitors: Competitor[];
  substitutes: Competitor[];
  gaps: CompetitiveGap[];
  differentiationPoints: DifferentiationPoint[];
  sourceType: SourceType;
}

export type FeasibilityStatus = 'Feasible' | 'Uncertain' | 'Challenging' | 'Unknown';

export interface FeasibilityArea {
  area: 'Customer' | 'Product' | 'Technology' | 'Business' | 'Operations' | 'Regulatory' | 'Financial';
  status: FeasibilityStatus;
  summary: string;
  reasons: string[];
  evidence: string[];
  assumptions: string[];
}

export interface FeasibilityAnalysis {
  areas: FeasibilityArea[];
  sourceType: SourceType;
  updatedAt: string;
}

export type RiskCategory =
  | 'Customer'
  | 'Market'
  | 'Product'
  | 'Pricing'
  | 'Competition'
  | 'Technology'
  | 'Regulation'
  | 'Operations'
  | 'Revenue';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
  validationAction: string;
  status: 'Active' | 'Mitigating' | 'Resolved';
  sourceType: SourceType;
}

export type AssumptionStatus = 'Unvalidated' | 'Testing' | 'Supported' | 'Contradicted' | 'Resolved';

export interface Assumption {
  id: string;
  statement: string;
  category: RiskCategory;
  priority: 'High' | 'Medium' | 'Low';
  status: AssumptionStatus;
  evidence: string;
  validationMethod: string;
  sourceType: SourceType;
}

export type ValidationExperimentMethod =
  | 'Interview'
  | 'Survey'
  | 'Landing Page'
  | 'Prototype'
  | 'Pricing Test'
  | 'Preorder'
  | 'Concierge'
  | 'Other';

export interface ValidationExperiment {
  id: string;
  objective: string;
  method: ValidationExperimentMethod;
  participants: string;
  questions: string[];
  successCriteria: string;
  result?: string;
  findings?: string;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  relatedAssumptionId?: string;
  sourceType: SourceType;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  purpose: string;
  category: 'Problem Frequency' | 'Current Behavior' | 'Alternative Friction' | 'Willingness to Pay' | 'Decision Dynamics';
  isNeutral: boolean;
  sourceType: SourceType;
}

export interface ValidationChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface ValidationAction {
  id: string;
  title: string;
  why: string;
  priority: 'Immediate' | 'Next' | 'Later';
  status: 'Not Started' | 'In Progress' | 'Completed';
  category: string;
}

export interface ValidationPlan {
  experiments: ValidationExperiment[];
  checklist: ValidationChecklistItem[];
  recommendedActions: ValidationAction[];
  sourceType: SourceType;
}

export type MVPPriority = 'MUST HAVE' | 'SHOULD HAVE' | 'LATER';

export interface MVPFeature {
  id: string;
  feature: string;
  description: string;
  priority: MVPPriority;
  reason: string;
  validationPurpose: string;
  sourceType: SourceType;
}

export interface MVPPlan {
  coreHypothesisToTest: string;
  buildTargetDuration: string;
  features: MVPFeature[];
  sourceType: SourceType;
}

export interface GTMChannel {
  id: string;
  channel: string;
  tactics: string;
  expectedCost: string;
  feasibility: 'High' | 'Medium' | 'Low';
}

export interface GTMPlan {
  initialCustomer: string;
  positioning: string;
  acquisitionChannels: GTMChannel[];
  salesApproach: string;
  launchExperiment: string;
  firstAction: string;
  sourceType: SourceType;
}

export interface Evidence {
  id: string;
  finding: string;
  source: string;
  url?: string;
  publisher?: string;
  date?: string;
  context: string;
  isVerified: boolean;
}

export interface SWOTItem {
  id: string;
  text: string;
  context?: string;
}

export interface SWOTAnalysis {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  sourceType: SourceType;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  actionableStep: string;
}

export interface AIAnalysis {
  analyzedAt: string;
  summary: string;
  statusOverview: {
    problem: StatusIndicator;
    customer: StatusIndicator;
    market: StatusIndicator;
    competition: StatusIndicator;
    business: StatusIndicator;
    validation: StatusIndicator;
  };
  recommendedNextSteps: ValidationAction[];
  insights: Insight[];
}

export interface ValidationReport {
  id: string;
  generatedAt: string;
  executiveSummary: string;
  startupConcept: string;
  limitations: string[];
  nextActions: string[];
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  label: string;
  description: string;
  snapshot: StartupProject;
}

export interface StartupProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isAnalyzed: boolean;
  idea: Idea;
  problem: Problem;
  solution: Solution;
  customerAnalysis: CustomerAnalysis;
  businessModel: BusinessModel;
  marketAnalysis: MarketAnalysis;
  competitorAnalysis: CompetitorAnalysis;
  feasibilityAnalysis: FeasibilityAnalysis;
  swotAnalysis: SWOTAnalysis;
  risks: Risk[];
  assumptions: Assumption[];
  validationPlan: ValidationPlan;
  mvpPlan: MVPPlan;
  gtmPlan: GTMPlan;
  evidence: Evidence[];
  aiAnalysis?: AIAnalysis;
  report?: ValidationReport;
}

export interface AppSettings {
  aiProviderConfigured: boolean;
  aiProviderName: string;
  researchProviderConfigured: boolean;
  researchProviderName: string;
  apiBaseUrl: string;
  storageType: 'Browser Local Storage';
  hasApiKeySet: boolean;
}
