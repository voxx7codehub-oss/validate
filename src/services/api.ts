/**
 * VALIDATEAI - API Client Service
 * Centralized client for all backend communication with timeouts,
 * graceful fallbacks, and error handling.
 */

import { StartupProject, AppSettings } from '../types';
import { loadSettings } from './storage';

const DEFAULT_TIMEOUT_MS = 30000;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

function getBaseUrl(): string {
  const settings = loadSettings();
  if (settings.apiBaseUrl && settings.apiBaseUrl.trim()) {
    return settings.apiBaseUrl.replace(/\/+$/, '');
  }
  return '';
}

async function requestWithTimeout<T>(
  endpoint: string,
  options: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const message =
        errorJson?.error ||
        errorJson?.detail ||
        `Server responded with status ${response.status}: ${response.statusText}`;
      return {
        success: false,
        error: message,
        code: errorJson?.code || `HTTP_${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'The request timed out. Please verify your connection or try again.',
        code: 'TIMEOUT',
      };
    }
    return {
      success: false,
      error:
        error?.message ||
        'AI analysis is currently unavailable. Connect an AI provider to continue.',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Fetch application backend status & configured providers
 */
export async function fetchServerSettings(): Promise<Partial<AppSettings> | null> {
  const result = await requestWithTimeout<AppSettings>('/api/settings', {
    method: 'GET',
  }, 5000);
  if (result.success && result.data) {
    return result.data;
  }
  return null;
}

/**
 * Run full structured startup validation analysis
 */
export async function analyzeStartupIdea(project: StartupProject): Promise<ApiResponse<any>> {
  return requestWithTimeout<any>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ project }),
  }, 45000);
}

/**
 * Query external verified market research
 */
export async function fetchMarketResearch(
  query: string,
  industry?: string,
  geography?: string
): Promise<{ available: boolean; message?: string; evidence?: any[] }> {
  const result = await requestWithTimeout<{ available: boolean; message?: string; evidence?: any[] }>(
    '/api/research',
    {
      method: 'POST',
      body: JSON.stringify({ query, industry, geography }),
    },
    15000
  );

  if (result.success && result.data) {
    return result.data;
  }

  return {
    available: false,
    message: result.error || 'Research provider is not configured. Connect a research provider or add verified research.',
  };
}

/**
 * Look up verified competitors or alternative approaches
 */
export async function lookupCompetitors(
  query: string,
  industry: string
): Promise<{ available: boolean; competitors: any[]; message?: string }> {
  const result = await requestWithTimeout<{ available: boolean; competitors: any[]; message?: string }>(
    '/api/competitors',
    {
      method: 'POST',
      body: JSON.stringify({ query, industry }),
    },
    20000
  );

  if (result.success && result.data) {
    return result.data;
  }

  return {
    available: false,
    competitors: [],
    message: result.error || 'Competitor lookup unavailable.',
  };
}

/**
 * Ask VALIDATEAI assistant a question grounded in project context
 */
export async function askAssistant(
  message: string,
  projectContext: any
): Promise<{ reply?: string; error?: string }> {
  const result = await requestWithTimeout<{ reply: string }>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, projectContext }),
  }, 25000);

  if (result.success && result.data) {
    return { reply: result.data.reply };
  }

  return {
    error:
      result.error ||
      'AI assistant is currently unavailable. Connect an AI provider to continue.',
  };
}

/**
 * Generate formal validation report
 */
export async function generateValidationReport(
  project: StartupProject
): Promise<ApiResponse<any>> {
  return requestWithTimeout<any>('/api/report', {
    method: 'POST',
    body: JSON.stringify({ project }),
  }, 20000);
}
