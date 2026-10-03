import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Search, Users, Target, Layers, FileText, Upload, Plus, Trash2, Copy } from 'lucide-react';
import { StartupProject } from '../types';

interface HomepageProps {
  projects: StartupProject[];
  onStartValidating: () => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onImportClick: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  projects,
  onStartValidating,
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  onImportClick,
  onNavigateSection,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#111827]">
      {/* Top Bar / Header adhering strictly to Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              VALIDATE<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigateSection('features')}
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => onNavigateSection('process')}
              className="hover:text-slate-900 transition-colors"
            >
              Validation Process
            </button>
            {projects.length > 0 && (
              <button
                onClick={() => onNavigateSection('projects')}
                className="hover:text-slate-900 transition-colors"
              >
                My Projects ({projects.length})
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onImportClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Import JSON
            </button>
            <button
              onClick={onStartValidating}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Start Validating
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-3xl mx-auto" style={{ textWrap: 'balance' }}>
          Validate your idea before you build it.
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Analyze your startup idea, understand your customers, research the market, discover competitors, identify risks, and create a practical validation plan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onStartValidating}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            Start Validating
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            How It Works
          </button>
        </div>

        {/* Process Flow Diagram */}
        <div id="process" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6 text-center">
            Structured Validation Workflow
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'IDEA', desc: 'Define problem & who feels it' },
              { step: '02', title: 'CUSTOMER', desc: 'Map segments & friction points' },
              { step: '03', title: 'MARKET', desc: 'Ground dynamics & verified scope' },
              { step: '04', title: 'COMPETITION', desc: 'Uncover real alternatives' },
              { step: '05', title: 'VALIDATION', desc: 'Design empirical tests' },
              { step: '06', title: 'REPORT', desc: 'Synthesize actionable strategy' },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-blue-600 font-semibold mb-1">
                    {item.step}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1">{item.title}</div>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Saved Projects Section (if any exist) */}
      {projects.length > 0 && (
        <section id="projects" className="py-12 px-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Saved Projects</h2>
              <p className="text-xs text-slate-500">Stored privately in your browser local storage.</p>
            </div>
            <button
              onClick={onStartValidating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Idea
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 flex flex-col justify-between transition-shadow hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 text-base truncate">
                      {proj.name || 'Untitled Idea'}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {proj.idea.whatBuilding || 'No description provided'}
                  </p>
                  <div className="text-[11px] text-slate-500 mb-4 bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-medium text-slate-700">Problem: </span>
                    <span className="line-clamp-1">{proj.idea.problemSolved || 'Unspecified'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenProject(proj.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Open Workspace
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      title="Duplicate Project"
                      className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Delete Project"
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How VALIDATEAI Works</h2>
          <p className="text-sm text-slate-600">
            Most startups fail not from bad execution, but from building something nobody urgently needs. VALIDATEAI forces rigor where founders usually rely on guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">Uncover Hidden Assumptions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every business plan contains dozens of implicit bets: that the problem exists, that alternatives are intolerable, and that users have budget. We extract every assumption into an organized test backlog.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">Neutral Customer Inquiries</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leading questions ("Would you buy this?") produce false compliments. VALIDATEAI formulates unbiased discovery questions focused strictly on past behavior and current workaround friction.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">Empirical Test Design & MVP Scope</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the smallest testable experiment before engineering. Separate MUST HAVE validation features from bloated nice-to-haves so you launch tests in days rather than months.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Professional Validation Intelligence</h2>
          <p className="text-sm text-slate-600">
            A complete suite for early-stage founders, startup studios, and accelerators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Target,
              title: 'Problem Framing',
              desc: 'Confirm urgency, frequency, cost of inaction, and current coping mechanisms.',
            },
            {
              icon: Users,
              title: 'Customer Discovery',
              desc: 'Segment buyers, map decision criteria, and craft unbiased interview guides.',
            },
            {
              icon: Search,
              title: 'Alternative Analysis',
              desc: 'Evaluate direct, indirect, and habit substitutes with honest evidence attribution.',
            },
            {
              icon: ShieldCheck,
              title: 'Risk & Assumption Matrix',
              desc: 'Track uncertainty across customer, market, technology, and pricing dimensions.',
            },
            {
              icon: Layers,
              title: 'MVP Scoping',
              desc: 'Enforce discipline with strict MUST HAVE, SHOULD HAVE, and LATER categorization.',
            },
            {
              icon: CheckCircle2,
              title: 'Experiment Playbooks',
              desc: 'Step-by-step validation protocols: concierge tests, smoke landing pages, and preorders.',
            },
            {
              icon: FileText,
              title: 'Exportable Reports',
              desc: 'Generate comprehensive executive validation documents in PDF, Markdown, and JSON.',
            },
            {
              icon: Upload,
              title: 'Local Privacy & Versions',
              desc: 'Data remains in browser localStorage. Snapshot versions, compare projects, and import anytime.',
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-5">
                <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-lg font-bold text-slate-900 mb-2">VALIDATEAI</div>
          <p className="text-xs text-slate-500 mb-6">Validate your idea before you build it.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 mb-8">
            <button onClick={onStartValidating} className="hover:text-slate-900 font-medium">
              Start Validating
            </button>
            <button onClick={onImportClick} className="hover:text-slate-900 font-medium">
              Import Project
            </button>
            <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-slate-900 font-medium">
              How It Works
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Data is stored in browser local storage. No cloud database or authentication required.
          </p>
        </div>
      </footer>
    </div>
  );
};
