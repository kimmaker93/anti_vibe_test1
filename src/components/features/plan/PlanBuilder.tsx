"use client";

import { useState } from "react";
import { CheckSquare, Square, MoreHorizontal, GripVertical, Plus, Trash2, Edit2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlanStep {
    id: string;
    label: string;
    status: "pending" | "in-progress" | "completed";
    required?: boolean;
}

interface PlanBuilderProps {
    title?: string;
    initialSteps: PlanStep[];
    onStepsChange?: (steps: PlanStep[]) => void;
    onExecute?: () => void;
}

export function PlanBuilder({ title = "실행 계획", initialSteps, onStepsChange, onExecute }: PlanBuilderProps) {
    const [steps, setSteps] = useState(initialSteps);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newStepLabel, setNewStepLabel] = useState("");

    const handleToggleStep = (id: string) => {
        if (isEditMode) return;
        // In a real app, this might just mark it done, but here we simulate flow status
        // For now, let's just toggle completed for visual feedback if needed
    };

    const handleDeleteStep = (id: string) => {
        const newSteps = steps.filter(s => s.id !== id);
        setSteps(newSteps);
        onStepsChange?.(newSteps);
    };

    const handleAddStep = () => {
        if (!newStepLabel.trim()) return;
        const newStep: PlanStep = {
            id: `new-${Date.now()}`,
            label: newStepLabel,
            status: "pending"
        };
        const newSteps = [...steps, newStep];
        setSteps(newSteps);
        onStepsChange?.(newSteps);
        setNewStepLabel("");
    };

    // Simple drag simulation (move up/down) could be added here, but for MVP keep it simple

    return (
        <div className={cn(
            "border rounded-xl overflow-hidden bg-white shadow-sm transition-all",
            isEditMode ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    {isEditMode ? "✏️ 계획 편집 중..." : `📋 ${title}`}
                </h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                        title="계획 편집"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Steps List */}
            <div className="p-2 space-y-1">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={cn(
                            "group flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                            isEditMode ? "bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200" : "hover:bg-slate-50"
                        )}
                    >
                        {isEditMode ? (
                            <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                        ) : (
                            <div className={cn(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                step.status === 'completed' ? "bg-emerald-500 border-emerald-500" :
                                    step.status === 'in-progress' ? "border-indigo-500" : "border-slate-300"
                            )}>
                                {step.status === 'completed' && <CheckSquare className="w-3 h-3 text-white" />}
                                {step.status === 'in-progress' && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />}
                            </div>
                        )}

                        <span className={cn(
                            "flex-1 text-sm",
                            step.status === 'completed' && !isEditMode && "text-slate-400 line-through",
                            step.status === 'in-progress' && !isEditMode && "text-slate-900 font-medium",
                            step.status === 'pending' && "text-slate-600"
                        )}>
                            {step.label}
                        </span>

                        {isEditMode && (
                            <button
                                onClick={() => handleDeleteStep(step.id)}
                                className="text-slate-300 hover:text-rose-500 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add Step Input (Edit Mode) */}
                {isEditMode && (
                    <div className="flex items-center gap-2 px-3 py-2 mt-2 animate-in fade-in slide-in-from-top-1">
                        <Plus className="w-4 h-4 text-indigo-500" />
                        <input
                            type="text"
                            value={newStepLabel}
                            onChange={(e) => setNewStepLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                            placeholder="새로운 단계 추가..."
                            className="flex-1 text-sm bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none pb-1 placeholder:text-slate-300"
                            autoFocus
                        />
                        <button
                            onClick={handleAddStep}
                            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100"
                        >
                            추가
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                {isEditMode ? (
                    <button
                        onClick={() => setIsEditMode(false)}
                        className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        변경사항 저장
                    </button>
                ) : (
                    <button
                        onClick={onExecute}
                        className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        <Play className="w-3 h-3" />
                        <span>계획 실행</span>
                    </button>
                )}
            </div>
        </div>
    );
}
