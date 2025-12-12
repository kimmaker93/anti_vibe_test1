"use client";

import { useGlassStore } from "@/store/useGlassStore";
import { cn } from "@/lib/utils";
import { MemoryCard } from "@/components/features/memory/MemoryCard";

interface Zone3Props {
    className?: string;
}

export function Zone3Memory({ className }: Zone3Props) {
    const { memories, updateMemory, deleteMemory } = useGlassStore();

    return (
        <div className={cn("h-full bg-slate-50 border-l border-slate-200 flex flex-col", className)}>
            <div className="p-4 border-b border-slate-200 bg-white/50">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">메모리 글래스 박스</h2>
                <p className="text-xs text-slate-500">AI가 기억하는 당신의 정보를 확인하세요.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {memories.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                        활성화된 기억이 없습니다.
                    </div>
                ) : (
                    memories.map((mem) => (
                        <MemoryCard
                            key={mem.id}
                            item={mem}
                            onUpdate={updateMemory}
                            onDelete={deleteMemory}
                        />
                    ))
                )}
            </div>

            {/* Decorative footer for RAG status */}
            <div className="p-3 border-t border-slate-200 bg-white/50 text-[10px] text-slate-400 flex justify-between items-center">
                <span>벡터 저장소: 연결됨 🟢</span>
                <span>청크: {memories.length}</span>
            </div>
        </div>
    );
}
