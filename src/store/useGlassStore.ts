import { create } from 'zustand';
import scenariosData from '@/data/scenarios.json';
import { PlanStep } from '@/components/features/plan/PlanBuilder';
import { PersonaType } from '@/components/features/persona/PersonaChip';

interface MemoryItem {
    id: string;
    key: string;
    value: string;
}

interface Scenario {
    id: string;
    title: string;
    persona: PersonaType;
    description: string;
    initialMessage: string;
    userMessage?: string;
    plan?: { title: string; steps: PlanStep[] };
    aiResponse?: {
        text: string;
        thoughts: string[];
        confidence: "high" | "medium" | "low";
        confidenceReason?: string;
        toolUsage: string[];
        citation?: { id: string; label: string };
        personaswitch?: { from: PersonaType; to: PersonaType };
    };
    memoryContext?: MemoryItem[];
}

interface GlassStore {
    currentScenarioId: string;
    persona: PersonaType;
    memories: MemoryItem[];
    plan: { title: string; steps: PlanStep[] } | null;

    // Conversation State
    conversation: Array<{ role: 'ai' | 'user'; text: string; id: string }>;
    isThinking: boolean;
    thoughts: string[];
    showConfidence: boolean;

    // Actions
    loadScenario: (id: string) => void;
    setPersona: (p: PersonaType) => void;
    updateMemory: (id: string, val: string) => void;
    deleteMemory: (id: string) => void;
    updatePlan: (steps: PlanStep[]) => void;
}

export const useGlassStore = create<GlassStore>((set, get) => ({
    currentScenarioId: 'case-1',
    persona: 'developer',
    memories: [],
    plan: null,
    conversation: [],
    isThinking: false,
    thoughts: [],
    showConfidence: false,

    loadScenario: (id) => {
        const scenario = (scenariosData as unknown as Scenario[]).find(s => s.id === id);
        if (!scenario) return;

        // Reset State with new scenario data
        set({
            currentScenarioId: id,
            persona: scenario.persona,
            memories: scenario.memoryContext || [],
            plan: scenario.plan ? { ...scenario.plan, steps: scenario.plan.steps.map(s => ({ ...s })) } : null,
            conversation: [
                { role: 'ai', text: scenario.initialMessage, id: 'init' }
            ],
            isThinking: false,
            thoughts: [],
            showConfidence: false
        });

        // Simulate "User Interaction" and "AI Response" flow automatically for demo
        if (scenario.userMessage) {
            setTimeout(() => {
                set(state => ({
                    conversation: [...state.conversation, { role: 'user', text: scenario.userMessage!, id: 'user-msg' }],
                    isThinking: true
                }));

                // After a delay, show thoughts
                setTimeout(() => {
                    set({ thoughts: scenario.aiResponse?.thoughts || [] });

                    // After thinking, show response
                    setTimeout(() => {
                        const aiRes = scenario.aiResponse;
                        set(state => {
                            // Handle Persona Switch if any
                            if (aiRes?.personaswitch) {
                                return {
                                    conversation: [...state.conversation, { role: 'ai', text: aiRes.text, id: 'ai-res' }],
                                    isThinking: false,
                                    showConfidence: true,
                                    persona: aiRes.personaswitch.to
                                };
                            }
                            return {
                                conversation: [...state.conversation, { role: 'ai', text: aiRes?.text || "", id: 'ai-res' }],
                                isThinking: false,
                                showConfidence: true
                            };
                        });
                    }, 2000); // Thinking time
                }, 1000); // Delay before thinking visibly starts
            }, 1000); // Delay before user types
        }
    },

    setPersona: (p) => set({ persona: p }),

    updateMemory: (id, val) => set(state => ({
        memories: state.memories.map(m => m.id === id ? { ...m, value: val } : m)
    })),

    deleteMemory: (id) => set(state => ({
        memories: state.memories.filter(m => m.id !== id)
    })),

    updatePlan: (steps) => set(state => ({
        plan: state.plan ? { ...state.plan, steps } : null
    }))
}));
