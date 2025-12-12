import { create } from 'zustand';
import scenariosData from '@/data/scenarios.json';

// Types
export type PersonaType = 'developer' | 'researcher' | 'business';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
}

export interface Folder {
    id: string;
    name: string;
    isCollapsed: boolean;
    conversationIds: string[];
}

export interface Memory {
    id: string;
    key: string;
    value: string;
    tags?: string[]; // New: For Persona and Keywords
}

// ... existing PlanStep/Plan properties ...

interface GlassStore {
    // ...
    // Memory Actions
    createMemory: (value: string, tags?: string[]) => void;
    updateMemory: (id: string, value: string) => void;
    deleteMemory: (id: string) => void;

    // ...
    createFolder: (name: string) => void;
    updateFolder: (id: string, name: string) => void;
    deleteFolder: (id: string) => void;
    moveScenarioToFolder: (scenarioId: string, folderId: string | null) => void;
    toggleFolderCollapse: (folderId: string) => void;
    setRightPanelCollapsed: (collapsed: boolean) => void;

    // Scenario Actions
    updateScenarioTitle: (id: string, title: string) => void;
}

export const useGlassStore = create<GlassStore>((set, get) => ({
    currentScenarioId: null,

    // Initialize with some mock folders
    folders: [
        { id: 'f-1', name: '연구 프로젝트', isCollapsed: false, conversationIds: ['case-2'] },
        { id: 'f-2', name: '마케팅 기획', isCollapsed: false, conversationIds: ['case-3', 'case-4', 'case-9'] }
    ],
    // Put remaining scenarios in unassigned
    unassignedScenarioIds: ['case-1', 'case-5', 'case-6', 'case-7', 'case-8'],

    isRightPanelCollapsed: false,

    persona: 'developer',
    memories: [], // Will be loaded from scenario
    conversation: [],
    isThinking: false,
    thoughts: [],
    plan: null,
    showConfidence: false,

    // Local state for scenario titles (to support renaming mocked data)
    scenarioTitles: {} as Record<string, string>,

    loadScenario: (id) => {
        const scenario = (scenariosData as unknown as Scenario[]).find(s => s.id === id);
        if (!scenario) return;

        // Use persisted title if exists, else default
        const currentTitles = get().scenarioTitles || {};

        set({
            currentScenarioId: id,
            persona: scenario.persona,
            conversation: [
                { id: 'sys-1', role: 'ai', text: scenario.initialMessage, timestamp: Date.now() },
                ...(scenario.userMessage ? [{ id: 'usr-1', role: 'user' as const, text: scenario.userMessage, timestamp: Date.now() + 100 }] : [])
            ],
            plan: scenario.plan ? {
                title: scenario.plan.title,
                steps: scenario.plan.steps.map(s => ({ ...s, status: s.status as 'pending' | 'in-progress' | 'completed' }))
            } : null,
            memories: scenario.memoryContext ? scenario.memoryContext.map(m => ({ ...m, value: m.value })) : [],
            isThinking: !!scenario.aiResponse,
            thoughts: [],
            showConfidence: false,
        });

        // Simulate AI response stream
        if (scenario.aiResponse) {
            setTimeout(() => {
                set({ thoughts: scenario.aiResponse?.thoughts || [] });

                setTimeout(() => {
                    set(state => ({
                        isThinking: false,
                        conversation: [...state.conversation, {
                            id: 'ai-1',
                            role: 'ai',
                            text: scenario.aiResponse!.text,
                            timestamp: Date.now()
                        }],
                        showConfidence: true
                    }));
                }, 2500);
            }, 1000);
        }
    },

    updateScenarioTitle: (id, title) => set(state => ({
        scenarioTitles: { ...state.scenarioTitles, [id]: title }
    })),

    setPersona: (p) => set({ persona: p }),

    updatePlan: (steps) => set(state => ({
        plan: state.plan ? { ...state.plan, steps } : null
    })),

    createMemory: (value, tags = []) => set(state => ({
        memories: [
            ...state.memories,
            {
                id: `mem-${Date.now()}`,
                key: 'New Memory', // Default key
                value,
                tags
            }
        ]
    })),

    updateMemory: (id, value) => set(state => ({
        memories: state.memories.map(m => m.id === id ? { ...m, value } : m)
    })),

    deleteMemory: (id) => set(state => ({
        memories: state.memories.filter(m => m.id !== id)
    })),

    // Workspace Actions Implementation
    createFolder: (name) => set(state => ({
        folders: [...state.folders, {
            id: `f-${Date.now()}`,
            name,
            isCollapsed: false,
            conversationIds: []
        }]
    })),

    updateFolder: (id, name) => set(state => ({
        folders: state.folders.map(f => f.id === id ? { ...f, name } : f)
    })),

    deleteFolder: (id) => set(state => {
        const folderToDelete = state.folders.find(f => f.id === id);
        if (!folderToDelete) return state;

        // Move contents to unassigned
        return {
            folders: state.folders.filter(f => f.id !== id),
            unassignedScenarioIds: [...state.unassignedScenarioIds, ...folderToDelete.conversationIds]
        };
    }),

    moveScenarioToFolder: (scenarioId, folderId) => set(state => {
        // 1. Remove from source (either unassigned or another folder)
        // We look in both places to be safe
        const newUnassigned = state.unassignedScenarioIds.filter(id => id !== scenarioId);

        const newFolders = state.folders.map(f => ({
            ...f,
            conversationIds: f.conversationIds.filter(id => id !== scenarioId)
        }));

        // 2. Add to target
        if (folderId === null) {
            // Move to unassigned
            return {
                unassignedScenarioIds: [...newUnassigned, scenarioId],
                folders: newFolders
            };
        } else {
            // Move to specific folder
            return {
                unassignedScenarioIds: newUnassigned,
                folders: newFolders.map(f => f.id === folderId ? {
                    ...f,
                    conversationIds: [...f.conversationIds, scenarioId]
                } : f)
            };
        }
    }),

    toggleFolderCollapse: (folderId) => set(state => ({
        folders: state.folders.map(f => f.id === folderId ? { ...f, isCollapsed: !f.isCollapsed } : f)
    })),

    setRightPanelCollapsed: (collapsed) => set({ isRightPanelCollapsed: collapsed }),
}));
