"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRole="client">
            {children}
        </ProtectedRoute>
    );
}
