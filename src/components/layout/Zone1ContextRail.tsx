"use client";

import { useGlassStore } from "@/store/useGlassStore";
import { cn } from "@/lib/utils";
import scenarios from "@/data/scenarios.json";
import { PlayCircle } from "lucide-react";

interface Zone1Props {
    className?: string;
}

export function Zone1ContextRail({ className }: Zone1Props) {
    const { currentScenarioId, loadScenario } = useGlassStore();

    return (
        <div className={cn("h-full bg-slate-50 border-r border-slate-200 flex flex-col", className)}>
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">컨텍스트 레일</h2>
                <p className="text-xs text-slate-500">테스트할 시나리오를 선택하세요.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {scenarios.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => loadScenario(scenario.id)}
                        className={cn(
                            "w-full text-left p-3 rounded-lg text-sm transition-all flex items-start gap-2 group",
                            currentScenarioId === scenario.id
                                ? "bg-white shadow-sm ring-1 ring-slate-200"
                                : "hover:bg-slate-100 text-slate-600"
                        )}
                    >
                        <PlayCircle className={cn(
                            "w-4 h-4 mt-0.5 flex-shrink-0",
                            currentScenarioId === scenario.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                        )} />
                        <div>
                            <span className={cn(
                                "block font-medium",
                                currentScenarioId === scenario.id ? "text-slate-900" : "text-slate-700"
                            )}>
                                {scenario.title}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1">
                                {scenario.description}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
                    <span>글로벌 컨텍스트</span>
                    <div className="w-8 h-4 bg-slate-300 rounded-full relative cursor-not-allowed">
                        <div className="absolute left-1 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}

