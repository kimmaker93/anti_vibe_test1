import { Globe, Terminal, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolType = "web-search" | "code-interpreter" | "calculator";

interface ToolBadgeProps {
    tool: ToolType;
    query?: string;
    isExecuting?: boolean;
}

export function ToolBadge({ tool, query, isExecuting = false }: ToolBadgeProps) {
    const config = {
        "web-search": { icon: Globe, label: "검색 중", color: "bg-blue-100 text-blue-700" },
        "code-interpreter": { icon: Terminal, label: "코드 실행 중", color: "bg-slate-100 text-slate-700 font-mono" },
        "calculator": { icon: Calculator, label: "계산 중", color: "bg-orange-100 text-orange-700" }
    };

    const { icon: Icon, label, color } = config[tool];

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border border-transparent",
            color,
            isExecuting && "animate-pulse border-current"
        )}>
            <Icon className="w-3 h-3" />
            <span className="font-semibold">{label}</span>
            {query && (
                <>
                    <span className="opacity-50 mx-1">|</span>
                    <span className="truncate max-w-[150px]">"{query}"</span>
                </>
            )}
        </div>
    );
}
