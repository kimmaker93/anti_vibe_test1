"use client";

import { useGlassStore } from "@/store/useGlassStore";
import { cn } from "@/lib/utils";
import { PersonaChip } from "@/components/features/persona/PersonaChip";
import { PlanBuilder } from "@/components/features/plan/PlanBuilder";
import { ThoughtAccordion } from "@/components/features/thought/ThoughtAccordion";
import { ConfidenceIndicator } from "@/components/features/confidence/ConfidenceIndicator";
import { ToolBadge } from "@/components/features/plan/ToolBadge";
import { useEffect, useRef } from "react";
import config from "@/data/config.json";

interface Zone2Props {
    className?: string;
}

export function Zone2Workspace({ className }: Zone2Props) {
    const {
        persona, setPersona,
        plan, updatePlan,
        conversation,
        isThinking, thoughts,
        showConfidence
    } = useGlassStore();

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation, thoughts, isThinking]);

    const currentTheme = config.themes[persona as keyof typeof config.themes];

    return (
        <div className={cn("h-full bg-white relative flex flex-col", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 z-10 bg-white/80 backdrop-blur-sm sticky top-0">
                <div className="flex items-center gap-3">
                    <PersonaChip persona={persona} onChange={setPersona} />
                    <span className="text-sm text-slate-400">|</span>
                    <span className="text-sm font-medium text-slate-600">활성 작업 공간</span>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">

                {/* Render Plan if exists */}
                {plan && (
                    <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4">
                        <PlanBuilder
                            title={plan.title}
                            initialSteps={plan.steps}
                            onStepsChange={(newSteps) => updatePlan(newSteps)}
                        />
                    </div>
                )}

                {conversation.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full animate-in fade-in slide-in-from-bottom-2",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-slate-900 text-white rounded-tr-none"
                                : "bg-slate-100 text-slate-800 rounded-tl-none"
                        )}>
                            {/* Render Code Blocks simply if any (naive check) */}
                            {msg.text.split("```").map((part, i) => (
                                i % 2 === 1 ? (
                                    <pre key={i} className="bg-slate-800 text-slate-200 p-3 rounded-md my-2 overflow-x-auto font-mono text-xs">
                                        <code>{part}</code>
                                    </pre>
                                ) : (
                                    <p key={i} className="whitespace-pre-wrap">{part}</p>
                                )
                            ))}
                        </div >
                    </div >
                ))}

                {/* Thought Process (Only show if latest msg is user or we are thinking/responding) */}
                {
                    (isThinking || (conversation.length > 0 && conversation[conversation.length - 1].role === 'user') || thoughts.length > 0) && (
                        <div className="max-w-2xl mx-auto">
                            <ThoughtAccordion
                                isThinking={isThinking}
                                thoughts={thoughts}
                                isOpen={true}
                            />
                        </div>
                    )
                }

                {/* Tool Usage Badges (Mock) - Can be inserted based on Scenario data but for now hardcoded check or use last msg */}

                {/* Confidence Indicator (Shown after AI response) */}
                {
                    !isThinking && showConfidence && conversation[conversation.length - 1].role === 'ai' && (
                        <div className="flex justify-start pl-1">
                            <ConfidenceIndicator level="high" reason="Based on verified memory and safe logic." />
                        </div>
                    )
                }

                <div className="h-10" /> {/* Spacer */}
            </div >

            {/* Input Area (Mock) */}
            < div className="p-4 border-t border-slate-100 bg-white" >
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        disabled
                        placeholder="메시지를 입력하세요..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                            →
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
