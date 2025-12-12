"use client";

import { useState } from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryItem {
    id: string;
    key: string;
    value: string;
    tags?: string[];
}

interface MemoryCardProps {
    item: MemoryItem;
    onUpdate: (id: string, newValue: string) => void;
    onDelete: (id: string) => void;
    isHighlighted?: boolean;
}

export function MemoryCard({ item, onUpdate, onDelete, isHighlighted }: MemoryCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.value);

    const handleSave = () => {
        onUpdate(item.id, editValue);
        setIsEditing(false);
    };

    return (
        <div className={cn(
            "group relative p-3 bg-white border rounded-lg shadow-sm transition-all duration-300",
            isHighlighted ? "border-amber-400 ring-2 ring-amber-100 scale-[1.02]" : "border-slate-200 hover:border-slate-300",
            isEditing && "border-indigo-400"
        )}>
            <div className="flex items-start justify-between mb-1">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.key}</h4>

                {/* Actions */}
                <div className={cn("flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", isEditing && "opacity-100")}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                <Save className="w-3 h-3" />
                            </button>
                            <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                                <X className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded">
                                <Edit2 className="w-3 h-3" />
                            </button>
                            <button onClick={() => onDelete(item.id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isEditing ? (
                <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full text-sm p-1.5 border border-indigo-200 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none bg-slate-50 text-slate-800"
                    rows={4}
                    autoFocus
                />
            ) : (
                <div className="space-y-2">
                    <p className="text-sm text-slate-800 leading-relaxed line-clamp-3">
                        {item.value}
                    </p>

                    {/* Tags Section */}
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1 mt-1 border-t border-slate-100">
                            {item.tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Optimization Indicator (Mocking Vector embedding update) */}
            {isEditing && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            )}
        </div>
    );
}
