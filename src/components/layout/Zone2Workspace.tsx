"use client";

import { useGlassStore } from "@/store/useGlassStore";
import { cn } from "@/lib/utils";
import { PersonaChip } from "@/components/features/persona/PersonaChip";
import { PlanBuilder } from "@/components/features/plan/PlanBuilder";
import { ThoughtAccordion } from "@/components/features/thought/ThoughtAccordion";
import { ConfidenceIndicator } from "@/components/features/confidence/ConfidenceIndicator";
import { ToolBadge } from "@/components/features/plan/ToolBadge";
import { useEffect, useRef, useState } from "react";
import config from "@/data/config.json";
import scenarios from "@/data/scenarios.json";
import { Paperclip, Sparkles, Send, BrainCircuit, PlusCircle } from "lucide-react";

interface Zone2Props {
    className?: string;
}

// Simple Tooltip Implementation
function Tooltip({ children, content, isOpen }: { children: React.ReactNode, content: React.ReactNode, isOpen: boolean }) {
    if (!isOpen) return children;
    return (
        <div className="relative">
            {children}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
            </div>
        </div>
    );
}

// Tool Selector Popover
function ToolSelector({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;
    return (
        <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-lg p-1 z-50 w-48 animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
            <h4 className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">도구 선택</h4>
            <div className="space-y-0.5">
                <button className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded flex items-center gap-2 text-sm text-slate-700">
                    <BrainCircuit className="w-4 h-4 text-indigo-500" />
                    <span>체계적인 사고</span>
                </button>
                <button className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded flex items-center gap-2 text-sm text-slate-400">
                    <PlusCircle className="w-4 h-4" />
                    <span>도구 추가하기 (TBD)</span>
                </button>
            </div>
        </div>
    );
}

export function Zone2Workspace({ className }: Zone2Props) {
    const {
        currentScenarioId,
        persona, setPersona,
        plan, updatePlan,
        conversation,
        isThinking, thoughts,
        showConfidence,
        scenarioTitles
    } = useGlassStore();

    const scrollRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [showToolSelector, setShowToolSelector] = useState(false);

    // Destructure sendMessage
    const { sendMessage } = useGlassStore();

    // Get Title Logic
    const currentScenario = scenarios.find(s => s.id === currentScenarioId);
    const displayTitle = currentScenarioId
        ? ((scenarioTitles && scenarioTitles[currentScenarioId]) || currentScenario?.title || "작업 공간")
        : "작업 공간";

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversation, thoughts, isThinking]);

    const handleToolClick = () => {
        setShowToolSelector(!showToolSelector);
    };

    const handleSend = () => {
        if (!inputValue.trim() || isThinking) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    return (
        <div className="h-full bg-white relative flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 z-10 bg-white/80 backdrop-blur-sm sticky top-0 h-14 flex-shrink-0">
                {/* Left: Title */}
                <div className="flex items-center gap-3 min-w-0">
                    <span className="font-semibold text-slate-800 truncate">{displayTitle}</span>
                </div>

                {/* Right: Persona */}
                <div>
                    <PersonaChip persona={persona} onChange={setPersona} />
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth w-full">

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

                {conversation.map((msg) => {
                    // Define Bubble Colors per persona
                    const bubbleColors = {
                        universal: "bg-slate-100 text-slate-800 border-slate-200",
                        developer: "bg-indigo-100 text-slate-800 border-indigo-200",
                        researcher: "bg-emerald-100 text-slate-800 border-emerald-200",
                        business: "bg-orange-100 text-slate-800 border-orange-200"
                    };

                    // Get color class if AI, else default behavior
                    const aiBubbleClass = msg.role === 'ai'
                        ? (bubbleColors[msg.persona as keyof typeof bubbleColors] || bubbleColors.universal)
                        : "bg-slate-900 text-white rounded-tr-none";

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full animate-in fade-in slide-in-from-bottom-2 group relative",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm relative border",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white rounded-tr-none border-transparent"
                                    : cn(
                                        "rounded-tl-none group-hover:ring-1 transition-all",
                                        aiBubbleClass,
                                        msg.role === 'ai' ? "group-hover:ring-current/20" : ""
                                    )
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

                                {/* Add to Memory Button (Only for AI) */}
                                {msg.role === 'ai' && (
                                    <button
                                        onClick={() => {
                                            // Mock Keyword Extraction
                                            const keywords = ["핵심", "요약"]; // Mocked for now as per request "Keyword 2 items"
                                            useGlassStore.getState().createMemory(msg.text, [persona, ...keywords]);
                                        }}
                                        className="absolute -bottom-3 left-0 bg-white border border-indigo-100 shadow-sm rounded-full px-2 py-0.5 text-[10px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 hover:bg-indigo-50 flex items-center gap-1"
                                    >
                                        <PlusCircle className="w-3 h-3" />
                                        메모리 추가
                                    </button>
                                )}
                            </div >
                        </div >
                    );
                })}

                {/* Thought Process (Only show if latest msg is user or we are thinking/responding) */}
                {
                    (isThinking || (conversation.length > 0 && conversation[conversation.length - 1].role === 'user') || thoughts.length > 0) && (
                        <div className="max-w-2xl mx-auto w-full">
                            <ThoughtAccordion
                                isThinking={isThinking}
                                thoughts={thoughts}
                                isOpen={true}
                            />
                        </div>
                    )
                }

                {/* Confidence Indicator (Shown after AI response) */}
                {
                    !isThinking && showConfidence && conversation.length > 0 && conversation[conversation.length - 1].role === 'ai' && (
                        <div className="flex justify-start pl-1">
                            <ConfidenceIndicator level="high" reason="Based on verified memory and safe logic." />
                        </div>
                    )
                }

                <div className="h-4" /> {/* Spacer */}
            </div >

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                <div className="max-w-3xl mx-auto w-full relative">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 flex flex-col gap-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all">

                        {/* Text Input */}
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            rows={1}
                            className="w-full bg-transparent border-none text-sm px-2 py-1 focus:ring-0 resize-none max-h-32"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />

                        {/* Toolbar */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-1 relative">
                                {/* File Add */}
                                <button className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="파일 추가">
                                    <Paperclip className="w-4 h-4" />
                                </button>

                                {/* Tool Selector */}
                                <div className="relative">
                                    <button
                                        onClick={handleToolClick}
                                        className={cn(
                                            "p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1",
                                            showToolSelector && "text-indigo-500 bg-indigo-50"
                                        )}
                                        title="도구 선택"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-xs font-medium">도구</span>
                                    </button>
                                    <ToolSelector isOpen={showToolSelector} onClose={() => setShowToolSelector(false)} />
                                </div>
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                className={cn(
                                    "p-1.5 rounded-lg transition-all flex items-center justify-center",
                                    inputValue.trim()
                                        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                )}
                                disabled={!inputValue.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}
