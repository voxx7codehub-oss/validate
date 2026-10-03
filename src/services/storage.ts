/**
 * VALIDATEAI - Browser LocalStorage Storage Service
 * Handles project persistence, version snapshots, import/export, and settings.
 */

import { StartupProject, ProjectVersion, AppSettings } from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'validateai_projects',
  ACTIVE_PROJECT: 'validateai_active_project',
  SETTINGS: 'validateai_settings',
  VERSIONS_PREFIX: 'validateai_versions_',
};

export const DEFAULT_SETTINGS: AppSettings = {
  aiProviderConfigured: true,
  aiProviderName: 'Gemini Analysis Engine',
  researchProviderConfigured: false,
  researchProviderName: 'None (Connect Research Provider)',
  apiBaseUrl: '',
  storageType: 'Browser Local Storage',
  hasApiKeySet: false,
};

/**
 * List all saved projects
 */
export function listProjects(): StartupProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw) as StartupProject[];
  } catch (error) {
    console.error('Failed to load projects from localStorage:', error);
    return [];
  }
}

/**
 * Load a single project by ID
 */
export function loadProject(id: string): StartupProject | null {
  const projects = listProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Save or update a project
 */
export function saveProject(project: StartupProject): void {
  try {
    const projects = listProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.unshift(updatedProject);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save project:', error);
  }
}

/**
 * Delete a project by ID
 */
export function deleteProject(id: string): void {
  try {
    const projects = listProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    localStorage.removeItem(`${STORAGE_KEYS.VERSIONS_PREFIX}${id}`);

    const activeId = getActiveProjectId();
    if (activeId === id) {
      setActiveProjectId(projects.length > 0 ? projects[0].id : null);
    }
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
}

/**
 * Duplicate an existing project
 */
export function duplicateProject(id: string): StartupProject | null {
  const existing = loadProject(id);
  if (!existing) return null;

  const duplicated: StartupProject = {
    ...JSON.parse(JSON.stringify(existing)),
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: `${existing.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    idea: {
      ...existing.idea,
      startupName: `${existing.idea.startupName || existing.name} (Copy)`,
    },
  };

  saveProject(duplicated);
  saveVersion(duplicated.id, 'Version 1', 'Duplicated snapshot');
  return duplicated;
}

/**
 * Rename a project
 */
export function renameProject(id: string, newName: string): StartupProject | null {
  const project = loadProject(id);
  if (!project) return null;

  project.name = newName;
  project.idea.startupName = newName;
  project.updatedAt = new Date().toISOString();
  saveProject(project);
  return project;
}

/**
 * Get active project ID
 */
export function getActiveProjectId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT);
}

/**
 * Set active project ID
 */
export function setActiveProjectId(id: string | null): void {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
  }
}

/**
 * Save a version snapshot of a project
 */
export function saveVersion(projectId: string, label: string, description: string): ProjectVersion {
  const project = loadProject(projectId);
  if (!project) {
    throw new Error('Project not found to create version');
  }

  const versions = loadVersions(projectId);
  const versionNumber = versions.length + 1;

  const newVersion: ProjectVersion = {
    id: `ver_${Date.now()}_${versionNumber}`,
    versionNumber,
    timestamp: new Date().toISOString(),
    label: label || `Version ${versionNumber}`,
    description: description || 'Snapshot of startup idea and analysis',
    snapshot: JSON.parse(JSON.stringify(project)),
  };

  versions.unshift(newVersion);
  try {
    localStorage.setItem(
      `${STORAGE_KEYS.VERSIONS_PREFIX}${projectId}`,
      JSON.stringify(versions)
    );
  } catch (e) {
    console.error('Failed to save project version:', e);
  }

  return newVersion;
}

/**
 * Load all versions for a project
 */
export function loadVersions(projectId: string): ProjectVersion[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.VERSIONS_PREFIX}${projectId}`);
    if (!raw) return [];
    return JSON.parse(raw) as ProjectVersion[];
  } catch (error) {
    console.error('Failed to load versions:', error);
    return [];
  }
}

/**
 * Restore a specific version
 */
export function restoreVersion(projectId: string, versionId: string): StartupProject | null {
  const versions = loadVersions(projectId);
  const target = versions.find((v) => v.id === versionId);
  if (!target) return null;

  const restoredProject: StartupProject = {
    ...JSON.parse(JSON.stringify(target.snapshot)),
    id: projectId,
    updatedAt: new Date().toISOString(),
  };

  saveProject(restoredProject);
  return restoredProject;
}

/**
 * Export project as JSON string
 */
export function exportProject(id: string): string {
  const project = loadProject(id);
  if (!project) throw new Error('Project not found');
  return JSON.stringify(project, null, 2);
}

/**
 * Import project from JSON string
 */
export function importProject(jsonString: string): StartupProject {
  try {
    const parsed = JSON.parse(jsonString) as StartupProject;
    if (!parsed || !parsed.idea || !parsed.customerAnalysis) {
      throw new Error('Invalid project structure');
    }

    // Assign new ID to prevent colliding with existing records
    const newProject: StartupProject = {
      ...parsed,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: parsed.name ? `${parsed.name} (Imported)` : 'Imported Project',
      updatedAt: new Date().toISOString(),
      createdAt: parsed.createdAt || new Date().toISOString(),
    };

    saveProject(newProject);
    saveVersion(newProject.id, 'Version 1', 'Imported snapshot');
    return newProject;
  } catch (error) {
    throw new Error('Failed to parse project JSON. Please verify the file format.');
  }
}

/**
 * Load application settings
 */
export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save application settings
 */
export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = loadSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
  return updated;
}

/**
 * Clear all local data
 */
export function clearLocalData(): void {
  try {
    const projects = listProjects();
    for (const p of projects) {
      localStorage.removeItem(`${STORAGE_KEYS.VERSIONS_PREFIX}${p.id}`);
    }
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROJECT);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (e) {
    console.error('Failed to clear local data:', e);
  }
}
