"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function HelperLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRole="helper">
            {children}
        </ProtectedRoute>
    );
}
