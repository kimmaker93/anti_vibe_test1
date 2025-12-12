"use client";

import { ReactNode } from "react";
import { ZoneRightWorkspace } from "./ZoneRightWorkspace";
import { Zone2Workspace } from "./Zone2Workspace";
import { Zone3Memory } from "./Zone3Memory";
import { Header } from "./Header";
import config from "@/data/config.json";
import { useGlassStore } from "@/store/useGlassStore";

interface GlassLayoutProps {
    children?: ReactNode;
}

export function GlassLayout({ children }: GlassLayoutProps) {
    const { isRightPanelCollapsed } = useGlassStore();

    return (
        <div className="flex flex-col h-screen w-full overflow-hidden bg-white text-slate-900 font-sans">
            {/* Global Header */}
            <Header />

            {/* Main Content Area (3-Column Layout) */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Workspace Explorer */}
                <aside
                    className={"flex-shrink-0 hidden md:block border-r border-slate-200 transition-all duration-300 ease-in-out"}
                    style={{ width: isRightPanelCollapsed ? 48 : 280 }} // Dynamic Width
                >
                    <ZoneRightWorkspace />
                </aside>

                {/* Zone 2: Workspace - Main Content */}
                <main className="flex-1 min-w-0 shadow-xl z-10">
                    <Zone2Workspace />
                </main>

                {/* Right Sidebar: Memory */}
                <aside
                    style={{ width: config.layout.defaultRightPanelWidth }}
                    className="flex-shrink-0 hidden lg:block border-l border-slate-200"
                >
                    <Zone3Memory />
                </aside>
            </div>
        </div>
    );
}
