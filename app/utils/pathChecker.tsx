"use client";

/* ---------------- IMPORTS ---------------- */
import React, { memo } from "react";
import { protectedRoutes } from "./routes";


/* ---------------- INTERFACES ---------------- */
interface PathCheckerProps {
    pathName: string;
    open: boolean;
    setOpen: (v: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */
// I'll move Header/Sidebar to components/layout for better org or just point correctly
import AppHeader from "@/components/header/header";
import AppSidebar from "@/components/sidebar/sidebar";

const PathChecker = memo(({ pathName, open, setOpen }: PathCheckerProps) => {
    const show = protectedRoutes.includes(pathName) || pathName === "/";

    if (!show) return null;

    return (
        <>
            <AppHeader opened={open} toggle={() => setOpen(!open)} />
            {/* Sidebar visibility is handled in ClientLayout via CSS/Mantine-AppShell traits, 
          but usually PathChecker renders it if requested. */}
        </>
    );
});

PathChecker.displayName = "PathChecker";

export default PathChecker;
