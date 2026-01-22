"use client";

/* ---------------- IMPORTS ---------------- */
import React, { memo } from "react";
import { protectedRoutes } from "./routes";
import { Box, Text } from "@mantine/core";

/* ---------------- INTERFACES ---------------- */
interface PathCheckerProps {
    pathName: string;
    open: boolean;
    setOpen: (v: boolean) => void;
}

/* ---------------- COMPONENT ---------------- */
const PathChecker = memo(({ pathName, open, setOpen }: PathCheckerProps) => {
    const show = protectedRoutes.includes(pathName) || pathName === "/";

    if (!show) return null;

    return (
        <>
            {/* Placeholder for Header and Sidebar - Can be replaced with actual components later */}
            <Box p="md" bg="blue.1">
                <Text fw={700}>Road Helper Header & Sidebar Placeholder</Text>
            </Box>
        </>
    );
});

PathChecker.displayName = "PathChecker";

export default PathChecker;
