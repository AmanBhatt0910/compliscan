"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_45%,_#020617_80%,_#000_100%)] text-slate-50">
      {/* Sidebar (desktop + mobile overlay inside) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onToggleSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
          <div className="mx-auto max-w-6xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}