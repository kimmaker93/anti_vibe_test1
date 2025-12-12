"use client";

import { User, BookOpen, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export type PersonaType = "developer" | "researcher" | "business";

interface PersonaChipProps {
    persona: PersonaType;
    onChange?: (persona: PersonaType) => void;
}

export function PersonaChip({ persona, onChange }: PersonaChipProps) {
    const config = {
        developer: {
            icon: User,
            label: "시니어 개발자",
            color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
        },
        researcher: {
            icon: BookOpen,
            label: "학술 연구원",
            color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200"
        },
        business: {
            icon: Briefcase,
            label: "프로덕트 매니저",
            color: "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
        }
    };

    const { icon: Icon, label, color } = config[persona];

    return (
        <div className="relative inline-block">
            <button
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ease-in-out shadow-sm",
                    color
                )}
                onClick={() => {
                    // Cycle through personas for demo purposes if no specific change handler
                    const types: PersonaType[] = ["developer", "researcher", "business"];
                    const next = types[(types.indexOf(persona) + 1) % types.length];
                    onChange?.(next);
                }}
            >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{label}</span>
            </button>

            {/* Animated Glow effect when persona changes */}
            <span className={cn(
                "absolute inset-0 rounded-full opacity-0 highlight-ping pointer-events-none",
                "animate-[ping_1s_ease-out_1]"
            )} />
        </div>
    );
}
