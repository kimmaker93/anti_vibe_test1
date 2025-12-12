"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThoughtAccordionProps {
    isOpen?: boolean;
    thoughts: string[];
    isThinking?: boolean;
}

export function ThoughtAccordion({ isOpen: defaultOpen = false, thoughts, isThinking = false }: ThoughtAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [displayedThoughts, setDisplayedThoughts] = useState<string[]>([]);

    // Streaming effect simulation
    useEffect(() => {
        if (thoughts.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedThoughts(thoughts.slice(0, i + 1));
                i++;
                if (i >= thoughts.length) clearInterval(interval);
            }, 500); // Add a new thought every 500ms
            return () => clearInterval(interval);
        }
    }, [thoughts]);

    return (
        <div className="w-full max-w-2xl mx-auto my-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    isThinking
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
            >
                {isThinking ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <span>🤔</span>
                )}
                <span>{isThinking ? "생각하는 중..." : "사고 과정"}</span>
                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-slate-600 space-y-1">
                            {displayedThoughts.map((thought, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <span>{thought}</span>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-2 animate-pulse">
                                    <span className="text-slate-300">..</span>
                                    <span className="w-2 h-4 bg-slate-400/50 block" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
