import { LayoutDashboard, Globe2, ShieldCheck, Activity } from "lucide-react";

export const sidebarNav = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        label: "Applications",
        href: "/apps",
        icon: Globe2
    },
    {
        label: "Scans",
        href: "/scans",
        icon: ShieldCheck
    },
    {
        label: "Activities",
        href: "/dashboard/activities",
        icon: Activity
    },
];