"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Center, Loader } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: "client" | "helper" }) {
    const { user, userData, loading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const role = userData?.role;

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/auth/login");
            } else if (allowedRole && role !== allowedRole) {
                // Redirect to their respective dashboard if they try to access wrong side
                router.replace(role === "client" ? "/client/dashboard" : "/helper/dashboard");
            }
        }
    }, [user, role, loading, router, allowedRole]);

    if (loading) {
        return (
            <Center className="h-screen">
                <Loader size="xl" variant="bars" color="blue" />
            </Center>
        );
    }

    if (!user || (allowedRole && role !== allowedRole)) {
        return null;
    }

    return <>{children}</>;
}
