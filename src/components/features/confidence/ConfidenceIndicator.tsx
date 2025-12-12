import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low";

interface ConfidenceIndicatorProps {
    level: ConfidenceLevel;
    reason?: string;
}

export function ConfidenceIndicator({ level, reason }: ConfidenceIndicatorProps) {
    const config = {
        high: {
            color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            icon: CheckCircle,
            label: "신뢰도 높음"
        },
        medium: {
            color: "text-amber-600 bg-amber-50 border-amber-200",
            icon: HelpCircle,
            label: "신뢰도 중간"
        },
        low: {
            color: "text-rose-600 bg-rose-50 border-rose-200",
            icon: AlertTriangle,
            label: "신뢰도 낮음"
        }
    };

    const { color, icon: Icon, label } = config[level];

    return (
        <div className="group relative inline-block">
            <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium cursor-help transition-colors",
                color
            )}>
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </div>

            {reason && (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <p>{reason}</p>
                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800" />
                </div>
            )}
        </div>
    );
}
