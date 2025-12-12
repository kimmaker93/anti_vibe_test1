import { create } from 'zustand';
import scenariosData from '@/data/scenarios.json';

// Types
export type PersonaType = 'developer' | 'researcher' | 'business' | 'universal';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
    persona?: PersonaType; // The persona active when this message was generated
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

interface Scenario {
    id: string;
    description: string;
    persona: string;
    initialMessage: string;
    userMessage?: string;
    plan?: {
        title: string;
        steps: { id: string; title: string; status: string }[];
    };
    memoryContext?: { id: string; key: string; value: string }[];
    aiResponse?: {
        text: string;
        thoughts: string[];
    };
}

interface GlassStore {
    currentScenarioId: string | null;
    folders: Folder[];
    unassignedScenarioIds: string[];
    isRightPanelCollapsed: boolean;

    // State
    persona: PersonaType;
    conversation: Message[];
    memories: Memory[];
    isThinking: boolean;
    thoughts: string[];
    plan: { title: string; steps: any[] } | null;
    showConfidence: boolean;
    scenarioTitles: Record<string, string>;

    loadScenario: (id: string) => void;
    setPersona: (persona: PersonaType) => void;
    updatePlan: (steps: any[]) => void;

    // Memory Actions
    createMemory: (value: string, tags?: string[]) => void;
    updateMemory: (id: string, value: string) => void;
    deleteMemory: (id: string) => void;

    createFolder: (name: string) => void;
    updateFolder: (id: string, name: string) => void;
    deleteFolder: (id: string) => void;
    moveScenarioToFolder: (scenarioId: string, folderId: string | null) => void;
    toggleFolderCollapse: (folderId: string) => void;
    setRightPanelCollapsed: (collapsed: boolean) => void;

    // Scenario Actions
    updateScenarioTitle: (id: string, title: string) => void;
    sendMessage: (text: string) => void;
}

const MOCK_RESPONSES = [
    "네, 말씀하신 내용은 충분히 이해했습니다. 현재 상황에서는 데이터 분석을 통해 패턴을 식별하고, 이를 기반으로 최적화된 전략을 수립하는 것이 중요해 보입니다. 추가적인 변수들을 고려하여 더 정밀한 예측 모델을 만들어 보시겠습니까?",
    "흥미로운 관점이군요. 그렇다면 기존의 가설을 재검토하고 새로운 실험을 설계해보는 건 어떨까요? 특히 사용자 피드백을 심층적으로 분석하면 우리가 놓치고 있던 인사이트를 발견할 수 있을 것 같습니다. 구체적인 계획을 제안해 드릴까요?",
    "제시해주신 아이디어는 매우 창의적입니다. 다만 현실적인 제약 사항들을 고려했을 때, 단계적으로 접근하는 것이 리스크를 최소화하는 방법일 수 있습니다. 우선순위를 정해서 작은 규모로 테스트를 진행해보는 것을 추천합니다.",
    "분석 결과, 해당 접근 방식은 장기적으로 매우 긍정적인 효과를 가져올 것으로 예상됩니다. 시스템의 안정성을 확보하면서 동시에 확장성을 고려한 아키텍처를 설계한다면, 향후 트래픽 증가에도 유연하게 대처할 수 있을 것입니다.",
    "지금 말씀하신 부분은 프로젝트의 핵심 성공 요인이 될 수 있습니다. 팀원들과 공유하여 공통된 목표를 설정하고, 구체적인 실행 방안을 마련하는 것이 좋겠습니다. 협업 툴을 활용하여 진행 상황을 투명하게 관리하는 것은 어떨까요?",
    "데이터를 기반으로 판단했을 때, 현재의 방향성은 적절해 보입니다. 하지만 시장의 변화 속도가 빠르기 때문에 지속적인 모니터링이 필요합니다. 경쟁사의 동향을 예의주시하며 유연하게 전략을 수정해 나가는 것이 중요합니다.",
    "기술적인 관점에서 보았을 때, 해당 기능 구현은 충분히 가능합니다. 다만 성능 최적화 이슈가 발생할 수 있으므로, 초기 설계 단계에서부터 효율적인 알고리즘을 선택하는 것이 필수적입니다. 프로토타입을 먼저 만들어 검증해볼까요?",
    "사용자 경험(UX) 측면에서 매우 훌륭한 제안입니다. 직관적인 인터페이스와 매끄러운 인터랙션은 서비스의 만족도를 크게 높일 수 있습니다. 사용자 테스트를 통해 실제 반응을 살펴보고, 피드백을 반영하여 완성도를 높여봅시다.",
    "비즈니스 모델의 지속 가능성을 고려할 때, 수익 구조를 다변화하는 전략이 필요해 보입니다. 새로운 수익원을 창출하기 위해 파트너십을 확장하거나, 프리미엄 서비스를 도입하는 방안을 검토해보는 것은 어떨까요?",
    "말씀하신 문제는 복합적인 원인에 기인한 것으로 보입니다. 근본적인 원인을 해결하기 위해서는 시스템 전반에 대한 정밀 진단이 선행되어야 합니다. 로그 데이터를 상세히 분석하여 병목 구간을 찾아내는 것부터 시작하시죠."
];

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

    persona: 'universal', // Default to universal
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
            persona: (scenario.persona as PersonaType) || 'universal',
            conversation: [
                { id: 'sys-1', role: 'ai', text: scenario.initialMessage, timestamp: Date.now(), persona: (scenario.persona as PersonaType) || 'universal' },
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
                    const currentPersona = get().persona;
                    set(state => ({
                        isThinking: false,
                        conversation: [...state.conversation, {
                            id: 'ai-1',
                            role: 'ai',
                            text: scenario.aiResponse!.text,
                            timestamp: Date.now(),
                            persona: currentPersona
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

    updateScenarioTitle: (id, title) => set(state => ({
        scenarioTitles: { ...state.scenarioTitles, [id]: title }
    })),

    sendMessage: (text) => {
        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            role: 'user',
            text,
            timestamp: Date.now()
        };

        set(state => ({
            conversation: [...state.conversation, userMsg],
            isThinking: true
        }));

        // Simulate network delay and thinking
        setTimeout(() => {
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            const currentPersona = get().persona;

            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                role: 'ai',
                text: randomResponse,
                timestamp: Date.now(),
                persona: currentPersona
            };

            set(state => ({
                conversation: [...state.conversation, aiMsg],
                isThinking: false,
                showConfidence: true // Show confidence for new messages
            }));
        }, 1500 + Math.random() * 1000); // Random delay 1.5s - 2.5s
    }
}));
