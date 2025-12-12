"use client";

import { ReactNode } from "react";
import { Zone1ContextRail } from "./Zone1ContextRail";
import { Zone2Workspace } from "./Zone2Workspace";
import { Zone3Memory } from "./Zone3Memory";
import config from "@/data/config.json";

interface GlassLayoutProps {
    children?: ReactNode; // For future extensibility if we wrap specific pages
}

export function GlassLayout({ children }: GlassLayoutProps) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-white text-slate-900 font-sans">
            {/* Zone 1: Context Rail - Left Sidebar */}
            <aside
                style={{ width: config.layout.defaultLeftPanelWidth }}
                className="flex-shrink-0 hidden md:block" // Hidden on mobile for now
            >
                <Zone1ContextRail />
            </aside>

            {/* Zone 2: Workspace - Main Content */}
            <main className="flex-1 min-w-0 shadow-xl z-10">
                <Zone2Workspace />
            </main>

            {/* Zone 3: Memory - Right Sidebar */}
            <aside
                style={{ width: config.layout.defaultRightPanelWidth }}
                className="flex-shrink-0 hidden lg:block"
            >
                <Zone3Memory />
            </aside>
        </div>
    );
}
