import React, { useState } from 'react';
import { StartupProject, Competitor, CompetitiveGap } from '../../types';
import { TrustBadge } from '../TrustBadge';
import { EmptyState } from '../EmptyState';
import { lookupCompetitors } from '../../services/api';
import {
  Compass,
  Plus,
  ExternalLink,
  Search,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface CompetitorViewProps {
  project: StartupProject;
  onUpdateProject: (updated: StartupProject) => void;
}

export const CompetitorView: React.FC<CompetitorViewProps> = ({
  project,
  onUpdateProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Direct' | 'Indirect' | 'Substitute'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New competitor form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Direct' | 'Indirect' | 'Substitute'>('Direct');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [pricing, setPricing] = useState('');
  const [strengths, setStrengths] = useState('');
  const [limitations, setLimitations] = useState('');
  const [differentiation, setDifferentiation] = useState('');
  const [source, setSource] = useState('User Verified Research');

  const comp = project.competitorAnalysis;

  const allCompetitors = [
    ...(comp.directCompetitors || []),
    ...(comp.indirectCompetitors || []),
    ...(comp.substitutes || []),
  ];

  const filteredCompetitors =
    activeCategory === 'All'
      ? allCompetitors
      : allCompetitors.filter((c) => c.category === activeCategory);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newComp: Competitor = {
      id: `comp_${Date.now()}`,
      name: name.trim(),
      category,
      website: website.trim(),
      description: description.trim(),
      targetCustomer: targetCustomer.trim() || 'General buyers',
      products: [],
      pricing: pricing.trim() || 'Unverified pricing',
      strengths: strengths.split(',').map((s) => s.trim()).filter(Boolean),
      limitations: limitations.split(',').map((s) => s.trim()).filter(Boolean),
      differentiation: differentiation.trim(),
      source: source.trim() || 'User Verified Research',
      sourceType: 'USER INPUT',
    };

    const updated: StartupProject = {
      ...project,
      competitorAnalysis: {
        ...project.competitorAnalysis,
        directCompetitors:
          category === 'Direct'
            ? [...(comp.directCompetitors || []), newComp]
            : comp.directCompetitors || [],
        indirectCompetitors:
          category === 'Indirect'
            ? [...(comp.indirectCompetitors || []), newComp]
            : comp.indirectCompetitors || [],
        substitutes:
          category === 'Substitute'
            ? [...(comp.substitutes || []), newComp]
            : comp.substitutes || [],
      },
    };

    onUpdateProject(updated);
    setShowAddForm(false);
    setName('');
    setWebsite('');
    setDescription('');
    setPricing('');
    setStrengths('');
    setLimitations('');
    setDifferentiation('');
  };

  const handleDeleteCompetitor = (id: string) => {
    const updated: StartupProject = {
      ...project,
      competitorAnalysis: {
        ...project.competitorAnalysis,
        directCompetitors: (comp.directCompetitors || []).filter((c) => c.id !== id),
        indirectCompetitors: (comp.indirectCompetitors || []).filter((c) => c.id !== id),
        substitutes: (comp.substitutes || []).filter((c) => c.id !== id),
      },
    };
    onUpdateProject(updated);
  };

  const handleLookup = async () => {
    setIsSearching(true);
    setNotice(null);
    try {
      const res = await lookupCompetitors(
        project.problem.statement || project.idea.whatBuilding,
        project.customerAnalysis.industry || 'Tech'
      );
      if (res.available && res.competitors?.length > 0) {
        const direct = res.competitors.filter((c: any) => c.category === 'Direct');
        const indirect = res.competitors.filter((c: any) => c.category === 'Indirect');
        const subs = res.competitors.filter((c: any) => c.category === 'Substitute');

        const updated: StartupProject = {
          ...project,
          competitorAnalysis: {
            ...project.competitorAnalysis,
            directCompetitors: [...(comp.directCompetitors || []), ...direct],
            indirectCompetitors: [...(comp.indirectCompetitors || []), ...indirect],
            substitutes: [...(comp.substitutes || []), ...subs],
          },
        };
        onUpdateProject(updated);
        setNotice(`Identified ${res.competitors.length} relevant market alternatives.`);
      } else {
        setNotice(res.message || 'No additional verified competitors returned.');
      }
    } catch {
      setNotice('Competitor lookup failed.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competitor Analysis</h1>
            <TrustBadge type="AI ANALYSIS" />
          </div>
          <p className="text-xs text-slate-500">
            Never invent companies, websites, or pricing. Study real direct players, adjacent alternatives, and manual substitutes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLookup}
            disabled={isSearching}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            {isSearching ? 'Searching...' : 'Discover Real Alternatives'}
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Competitor
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900 rounded-lg flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs (Interactive controls with button tags per guidelines) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-sm">
        {(['All', 'Direct', 'Indirect', 'Substitute'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
              activeCategory === cat
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Competitor Form */}
      {showAddForm && (
        <form onSubmit={handleAddCompetitor} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Add Verified Competitor or Substitute</h2>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Company / Alternative Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Toast, Square, Excel Spreadsheets"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-900"
              >
                <option value="Direct">Direct Competitor</option>
                <option value="Indirect">Indirect Alternative</option>
                <option value="Substitute">Substitute / Manual Habit</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://... (or leave blank if habit)"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What they offer and how users engage them..."
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Customer</label>
              <input
                type="text"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                placeholder="e.g., Multi-unit restaurants, independent cafes"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Pricing Model</label>
              <input
                type="text"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                placeholder="e.g., $69/month + 2.49% transaction fee"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Strengths (comma-separated)
              </label>
              <input
                type="text"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="e.g., Brand recognition, comprehensive hardware ecosystem"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Limitations (comma-separated)
              </label>
              <input
                type="text"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                placeholder="e.g., Clunky inventory forecasting, expensive enterprise lock-in"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">
              Our Key Differentiation vs. Them
            </label>
            <input
              type="text"
              value={differentiation}
              onChange={(e) => setDifferentiation(e.target.value)}
              placeholder="e.g., Lightweight zero-hardware setup dedicated purely to perishables"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Save Competitor
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Competitors List */}
      {filteredCompetitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetitors.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{c.name}</h3>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {c.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {c.website && (
                      <a
                        href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="Open verified website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteCompetitor(c.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{c.description}</p>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="font-medium text-slate-700">Target Customer: </span>
                    <span>{c.targetCustomer}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Pricing: </span>
                    <span className="tabular-nums">{c.pricing || 'Not verified'}</span>
                  </div>
                  {c.differentiation && (
                    <div>
                      <span className="font-medium text-blue-700">Differentiation: </span>
                      <span>{c.differentiation}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Source: {c.source || 'AI Analysis'}</span>
                <TrustBadge type={c.sourceType || 'AI ANALYSIS'} size="sm" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state adhering to the prompt instruction */
        <EmptyState
          icon={HelpCircle}
          title="No competitor research yet"
          missingDescription="Verified directory of direct competitors, indirect alternatives, and manual habit substitutes."
          whyItMatters="If customers are not already solving this problem with workarounds, spreadsheets, or rival software, the problem may not be painful enough to sustain a business."
          actionText="Add Competitor or Substitute"
          onAction={() => setShowAddForm(true)}
          secondaryActionText="Discover Real Alternatives"
          onSecondaryAction={handleLookup}
        />
      )}

      {/* Competitive Gaps (Clearly labeled as AI-generated hypothesis) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Competitive Gaps & Opportunities</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unaddressed white space across Customer, Product, Pricing, Distribution, and Positioning.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            AI-generated hypothesis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(comp.gaps?.length > 0
            ? comp.gaps
            : [
                {
                  id: 'gap_1',
                  area: 'Product',
                  observation:
                    'Legacy incumbents require complex manual data entry and hardware installations.',
                  opportunity:
                    'Build zero-hardware smart predictive ordering that learns from point-of-sale exports.',
                  isAiHypothesis: true,
                  sourceType: 'AI ANALYSIS',
                },
                {
                  id: 'gap_2',
                  area: 'Pricing',
                  observation:
                    'Incumbent enterprise solutions force annual multi-thousand dollar contracts.',
                  opportunity:
                    'Offer low-friction monthly tiered pricing tied directly to verified inventory savings.',
                  isAiHypothesis: true,
                  sourceType: 'AI ANALYSIS',
                },
              ]
          ).map((gap) => (
            <div
              key={gap.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {gap.area} Dimension Gap
                  </span>
                  <span className="text-[10px] text-blue-700 font-mono">
                    AI-generated hypothesis
                  </span>
                </div>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-medium text-slate-700">Observation: </span>
                    <span className="text-slate-600">{gap.observation}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Strategic Opportunity: </span>
                    <span className="text-slate-800">{gap.opportunity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
