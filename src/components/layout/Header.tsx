"use client";

import { Settings, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
            {/* Left Area: Logo */}
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    GLASSY
                </span>
            </div>

            {/* Right Area: Controls (Order: [New Task] [Settings] [User1] [Logout]) */}
            <div className="flex items-center gap-4 text-sm font-medium">

                {/* New Task Button */}
                <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs font-semibold">
                    <Plus className="w-3.5 h-3.5" />
                    <span>새 작업</span>
                </button>

                {/* Settings */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                    <Settings className="w-4 h-4" />
                </button>

                {/* Nickname */}
                <span className="text-slate-700">사용자1</span>

                <div className="w-px h-3 bg-slate-300 mx-1" />

                {/* Logout */}
                <button className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5">
                    <LogOut className="w-4 h-4" />
                    <span>로그아웃</span>
                </button>
            </div>
        </header>
    );
}
