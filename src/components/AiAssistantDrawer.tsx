import React, { useState } from 'react';
import { StartupProject } from '../types';
import { askAssistant } from '../services/api';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: StartupProject;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hello founder! I have loaded all context for "${project.name || 'your startup idea'}". Ask me anything about uncovering blind spots, prioritizing customer discovery questions, or shrinking your MVP scope.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const suggestedQuestions = [
    'What should I validate first?',
    'What are my biggest assumptions?',
    'What questions should I ask customers?',
    'What risks should I investigate?',
    'What should my MVP include?',
  ];

  const handleSend = async (text: string) => {
    const questionText = text.trim();
    if (!questionText || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askAssistant(questionText, {
        name: project.name,
        idea: project.idea,
        problem: project.problem,
        customer: project.customerAnalysis,
        solution: project.solution,
        businessModel: project.businessModel,
        assumptions: project.assumptions,
        risks: project.risks,
      });

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: response.reply || response.error || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Unable to communicate with the assistant. Check your connection or provider settings.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ask VALIDATEAI</h2>
              <p className="text-[11px] text-slate-400">Contextual validation advisor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 leading-relaxed'
                }`}
              >
                {m.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing against project data...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-1.5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Suggested questions:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about assumptions, tests, customers..."
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-md transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
