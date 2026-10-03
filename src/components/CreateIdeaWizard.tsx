import React, { useState } from 'react';
import { CustomerType, BusinessModelType, StartupProject } from '../types';
import { ArrowLeft, ArrowRight, Sparkles, Edit3 } from 'lucide-react';

interface CreateIdeaWizardProps {
  onCancel: () => void;
  onSubmit: (projectData: Partial<StartupProject>) => void;
  initialData?: Partial<StartupProject>;
}

export const CreateIdeaWizard: React.FC<CreateIdeaWizardProps> = ({
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Idea
  const [startupName, setStartupName] = useState(initialData?.idea?.startupName || '');
  const [whatBuilding, setWhatBuilding] = useState(initialData?.idea?.whatBuilding || '');
  const [problemSolved, setProblemSolved] = useState(initialData?.idea?.problemSolved || '');
  const [whoExperiences, setWhoExperiences] = useState(initialData?.idea?.whoExperiences || '');

  // Step 2: Customer
  const [primaryCustomer, setPrimaryCustomer] = useState(
    initialData?.customerAnalysis?.primaryCustomer || ''
  );
  const [industry, setIndustry] = useState(initialData?.customerAnalysis?.industry || '');
  const [geography, setGeography] = useState(initialData?.customerAnalysis?.geography || 'Global / US');
  const [customerType, setCustomerType] = useState<CustomerType>(
    initialData?.customerAnalysis?.customerType || 'Startup'
  );

  // Step 3: Business
  const [solution, setSolution] = useState(initialData?.solution?.coreConcept || '');
  const [valueProposition, setValueProposition] = useState(
    initialData?.solution?.valueProposition || ''
  );
  const [businessModel, setBusinessModel] = useState<BusinessModelType>(
    initialData?.businessModel?.modelType || 'Subscription'
  );
  const [targetMarket, setTargetMarket] = useState(
    initialData?.marketAnalysis?.targetMarket || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!whatBuilding.trim()) errs.whatBuilding = 'Please describe what you are building.';
    if (!problemSolved.trim()) errs.problemSolved = 'Please explain what problem it solves.';
    if (!whoExperiences.trim()) errs.whoExperiences = 'Please specify who experiences this problem.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!primaryCustomer.trim()) errs.primaryCustomer = 'Please specify your primary customer.';
    if (!industry.trim()) errs.industry = 'Please identify the industry or vertical.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!solution.trim()) errs.solution = 'Please describe the proposed solution.';
    if (!valueProposition.trim()) errs.valueProposition = 'Please summarize the core value proposition.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handleFinish = () => {
    const projectPayload: Partial<StartupProject> = {
      name: startupName.trim() || 'Untitled Startup',
      idea: {
        startupName: startupName.trim(),
        whatBuilding: whatBuilding.trim(),
        problemSolved: problemSolved.trim(),
        whoExperiences: whoExperiences.trim(),
        sourceType: 'USER INPUT',
        updatedAt: new Date().toISOString(),
      },
      problem: {
        statement: problemSolved.trim(),
        urgency: 'Medium',
        frequency: 'Weekly',
        currentAlternatives: [],
        costOfInaction: 'Lost time and unresolved operational friction',
        sourceType: 'USER INPUT',
      },
      solution: {
        coreConcept: solution.trim(),
        valueProposition: valueProposition.trim(),
        keyDifferentiators: [],
        deliveryMechanism: 'Web Application',
        sourceType: 'USER INPUT',
      },
      customerAnalysis: {
        primaryCustomer: primaryCustomer.trim(),
        industry: industry.trim(),
        geography: geography.trim(),
        customerType,
        segments: [
          {
            id: 'seg_initial',
            name: primaryCustomer.trim(),
            description: `Primary audience in ${industry.trim()}`,
            customerType,
            primaryIndustry: industry.trim(),
            geography: geography.trim(),
            isPrimary: true,
            buyingFactors: [],
            typicalObjections: [],
            sourceType: 'USER INPUT',
          },
        ],
        painPoints: [
          {
            id: 'pain_initial',
            description: problemSolved.trim(),
            severity: 'Moderate',
            frequency: 'Regularly',
            sourceType: 'USER INPUT',
          },
        ],
        currentBehavior: 'Using manual workarounds or suboptimal existing tools',
        customerNeeds: [],
        buyingFactors: [],
        objections: [],
        willingnessToPayNotes: 'Unvalidated - requires willingness-to-pay inquiry',
        interviewQuestions: [],
        sourceType: 'USER INPUT',
      },
      businessModel: {
        modelType: businessModel,
        valueProposition: valueProposition.trim(),
        revenueStreams: [
          {
            id: 'rev_1',
            name: `${businessModel} Revenue`,
            modelType: businessModel,
            description: `Primary monetization via ${businessModel.toLowerCase()}`,
            projectedContribution: '100%',
            sourceType: 'USER INPUT',
          },
        ],
        pricing: {
          type: businessModel,
          rationale: 'Initial pricing hypothesis to be validated with early adopters',
          sourceType: 'USER INPUT',
        },
        customerChannels: [],
        costStructure: ['Product Development', 'Customer Acquisition', 'Hosting & Infrastructure'],
        keyResources: ['Founding Team', 'Proprietary Software'],
        keyPartners: [],
        sourceType: 'USER INPUT',
      },
      marketAnalysis: {
        overview: `Targeting ${targetMarket.trim() || industry.trim()} segment.`,
        industry: industry.trim(),
        targetMarket: targetMarket.trim() || `${customerType} in ${industry.trim()}`,
        geography: geography.trim(),
        trends: [],
        drivers: [],
        challenges: [],
        opportunities: [],
        marketSize: {
          isVerified: false,
          unverifiedMessage:
            'Market size information is not available yet. Connect a research provider or add verified research.',
        },
        dataPoints: [],
        sourceType: 'USER INPUT',
      },
      competitorAnalysis: {
        directCompetitors: [],
        indirectCompetitors: [],
        substitutes: [],
        gaps: [],
        differentiationPoints: [],
        sourceType: 'USER INPUT',
      },
      feasibilityAnalysis: {
        areas: [],
        sourceType: 'USER INPUT',
        updatedAt: new Date().toISOString(),
      },
      swotAnalysis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
        sourceType: 'USER INPUT',
      },
      risks: [],
      assumptions: [
        {
          id: `as_${Date.now()}_1`,
          statement: `${primaryCustomer.trim()} experiences "${problemSolved.trim()}" frequently enough to urgently seek a solution.`,
          category: 'Customer',
          priority: 'High',
          status: 'Unvalidated',
          evidence: '',
          validationMethod: 'Interview',
          sourceType: 'ASSUMPTION',
        },
        {
          id: `as_${Date.now()}_2`,
          statement: `Target customers are dissatisfied with existing alternatives and willing to pay for "${solution.trim()}".`,
          category: 'Pricing',
          priority: 'High',
          status: 'Unvalidated',
          evidence: '',
          validationMethod: 'Pricing Test',
          sourceType: 'ASSUMPTION',
        },
      ],
      validationPlan: {
        experiments: [
          {
            id: `exp_${Date.now()}_1`,
            objective: 'Confirm problem frequency and severity with 5-10 target users.',
            method: 'Interview',
            participants: `5-10 ${primaryCustomer.trim()}`,
            questions: [
              'How do you currently handle this issue?',
              'How often does this disrupt your workflow?',
              'What workarounds have you tried in the past 6 months?',
            ],
            successCriteria: 'At least 70% of interviewees actively describe the problem as painful.',
            status: 'Planned',
            sourceType: 'USER INPUT',
          },
        ],
        checklist: [
          {
            id: 'chk_1',
            title: 'Talked to target customers',
            description: 'Conducted exploratory customer discovery sessions without pitching.',
            completed: false,
          },
          {
            id: 'chk_2',
            title: 'Confirmed the problem',
            description: 'Verified that customers experience this problem regularly and painfully.',
            completed: false,
          },
          {
            id: 'chk_3',
            title: 'Identified existing alternatives',
            description: 'Documented all current tools, spreadsheets, and manual workarounds.',
            completed: false,
          },
          {
            id: 'chk_4',
            title: 'Tested willingness to pay',
            description: 'Gathered quantitative willingness-to-pay evidence or intent commits.',
            completed: false,
          },
          {
            id: 'chk_5',
            title: 'Tested the proposed solution',
            description: 'Walked customers through concept sketches or wireframes.',
            completed: false,
          },
          {
            id: 'chk_6',
            title: 'Created an early version',
            description: 'Built a focused MVP testing the single riskiest hypothesis.',
            completed: false,
          },
          {
            id: 'chk_7',
            title: 'Collected real feedback',
            description: 'Analyzed concrete usage data rather than polite compliments.',
            completed: false,
          },
        ],
        recommendedActions: [
          {
            id: `act_${Date.now()}_1`,
            title: 'Interview target customers',
            why: 'Confirm whether the problem occurs frequently enough to matter before coding.',
            priority: 'Immediate',
            status: 'Not Started',
            category: 'Customer',
          },
          {
            id: `act_${Date.now()}_2`,
            title: 'Research existing solutions',
            why: 'Discover what users currently do to solve or endure the issue.',
            priority: 'Immediate',
            status: 'Not Started',
            category: 'Competition',
          },
        ],
        sourceType: 'USER INPUT',
      },
      mvpPlan: {
        coreHypothesisToTest: `Validate whether ${primaryCustomer.trim()} will use the core ${solution.trim()} to solve their problem.`,
        buildTargetDuration: '2-3 weeks',
        features: [
          {
            id: `mvp_${Date.now()}_1`,
            feature: 'Core Problem Resolution Workflow',
            description: `Minimal implementation of ${solution.trim()}`,
            priority: 'MUST HAVE',
            reason: 'Directly tests the central value proposition.',
            validationPurpose: 'Verify users can accomplish the core job without manual intervention.',
            sourceType: 'USER INPUT',
          },
        ],
        sourceType: 'USER INPUT',
      },
      gtmPlan: {
        initialCustomer: primaryCustomer.trim(),
        positioning: valueProposition.trim(),
        acquisitionChannels: [
          {
            id: 'gtm_1',
            channel: 'Direct Outreach / Cold Outreach',
            tactics: 'Personalized email and LinkedIn messages to 50 target personas',
            expectedCost: 'Low ($0 - $100)',
            feasibility: 'High',
          },
        ],
        salesApproach: 'Founder-led sales and consultative customer discovery',
        launchExperiment: 'Landing page with waitlist and manual concierge onboarding',
        firstAction: `Identify 20 ${primaryCustomer.trim()} on LinkedIn or industry forums this week`,
        sourceType: 'USER INPUT',
      },
      evidence: [],
    };

    onSubmit(projectPayload);
  };

  const steps = [
    { number: 1, label: '01 Idea' },
    { number: 2, label: '02 Customer' },
    { number: 3, label: '03 Business' },
    { number: 4, label: '04 Review' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Your Startup Idea</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow the 4-step framework to structure your concept for objective validation.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {steps.map((s) => {
          const isActive = currentStep === s.number;
          const isDone = currentStep > s.number;
          return (
            <button
              key={s.number}
              type="button"
              onClick={() => {
                if (isDone) setCurrentStep(s.number as any);
              }}
              disabled={!isDone && !isActive}
              className={`text-left p-3 rounded-lg border transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50/50'
                  : isDone
                  ? 'border-slate-300 bg-white hover:bg-slate-50 cursor-pointer'
                  : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`text-xs font-semibold ${
                  isActive ? 'text-blue-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                }`}
              >
                {s.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                {s.number === 1
                  ? 'Concept & Problem'
                  : s.number === 2
                  ? 'Target Persona'
                  : s.number === 3
                  ? 'Model & Value'
                  : 'Final Summary'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm mb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Startup Name <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="e.g., FleetFlow, DocuPulse, ShelfCraft"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                A working title for your validation workspace. You can change this anytime.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                What are you building? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={whatBuilding}
                onChange={(e) => setWhatBuilding(e.target.value)}
                placeholder="e.g., An automated inventory replenishment tool for independent specialty retail coffee shops..."
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.whatBuilding ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.whatBuilding && (
                <p className="text-xs text-rose-600 mt-1">{errors.whatBuilding}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Explain the product or service in plain language without buzzwords.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                What problem does it solve? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={problemSolved}
                onChange={(e) => setProblemSolved(e.target.value)}
                placeholder="e.g., Coffee shop managers spend 6+ hours weekly manually auditing beans and milk in paper notebooks, frequently stock out on weekends, or waste expired perishables..."
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.problemSolved ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.problemSolved && (
                <p className="text-xs text-rose-600 mt-1">{errors.problemSolved}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Describe the specific friction, financial waste, or time drain experienced today.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Who experiences this problem? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={whoExperiences}
                onChange={(e) => setWhoExperiences(e.target.value)}
                placeholder="e.g., General managers and head baristas at independent coffee shops with 1-5 locations..."
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.whoExperiences ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.whoExperiences && (
                <p className="text-xs text-rose-600 mt-1">{errors.whoExperiences}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Be specific about who deals with this day-to-day.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Who is this for?
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Primary Customer <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={primaryCustomer}
                onChange={(e) => setPrimaryCustomer(e.target.value)}
                placeholder="e.g., Independent Coffee Shop Owner / Operator"
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.primaryCustomer ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.primaryCustomer && (
                <p className="text-xs text-rose-600 mt-1">{errors.primaryCustomer}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                The individual or role who has the authority or budget to adopt your solution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Industry <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Food & Beverage / Specialty Hospitality"
                  className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                    errors.industry ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.industry && (
                  <p className="text-xs text-rose-600 mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Geography
                </label>
                <input
                  type="text"
                  value={geography}
                  onChange={(e) => setGeography(e.target.value)}
                  placeholder="e.g., United States, North America, Global"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Customer Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'Consumer',
                    'Small Business',
                    'Startup',
                    'Enterprise',
                    'Government',
                    'Education',
                    'Other',
                  ] as CustomerType[]
                ).map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setCustomerType(ct)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      customerType === ct
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Solution <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="e.g., A mobile and web platform that connects to point-of-sale systems, auto-forecasts weekly ingredient needs based on foot traffic, and drafts one-click replenishment purchase orders..."
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.solution ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.solution && (
                <p className="text-xs text-rose-600 mt-1">{errors.solution}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Explain how your product fundamentally solves the problem.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Value Proposition <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                placeholder="e.g., Save 5 hours every week on inventory management while reducing weekend stockouts by 80%."
                className={`w-full px-3.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 ${
                  errors.valueProposition ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.valueProposition && (
                <p className="text-xs text-rose-600 mt-1">{errors.valueProposition}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                The primary measurable benefit or outcome promised to the buyer.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Business Model
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'Subscription',
                    'One-time Purchase',
                    'Marketplace',
                    'Commission',
                    'Freemium',
                    'Advertising',
                    'Usage Based',
                    'Other',
                  ] as BusinessModelType[]
                ).map((bm) => (
                  <button
                    key={bm}
                    type="button"
                    onClick={() => setBusinessModel(bm)}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      businessModel === bm
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {bm}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Target Market
              </label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="e.g., 40,000 independent specialty coffee shops in the US"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                Your initial initial niche or beachhead market.
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Review Your Startup Idea</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your core assumptions. You can click Edit on any section to make adjustments before running analysis.
              </p>
            </div>

            {/* Card 1: Idea & Problem */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  01 Idea & Problem
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Startup Name: </span>
                  <span className="text-slate-900">{startupName || 'Untitled Startup'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">What you are building: </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{whatBuilding}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Problem solved: </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{problemSolved}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Who experiences this: </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{whoExperiences}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Customer */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  02 Customer
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Primary Customer: </span>
                  <span className="text-slate-900">{primaryCustomer}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Customer Type: </span>
                  <span className="text-slate-900">{customerType}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Industry: </span>
                  <span className="text-slate-900">{industry}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Geography: </span>
                  <span className="text-slate-900">{geography}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Business */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  03 Business
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Solution: </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{solution}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Value Proposition: </span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">{valueProposition}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-semibold text-slate-800">Business Model: </span>
                    <span className="text-slate-900">{businessModel}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Target Market: </span>
                    <span className="text-slate-900">{targetMarket || 'Unspecified'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Continue
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Analyze My Idea
          </button>
        )}
      </div>
    </div>
  );
};
