"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: "client" | "helper" }) {
    const { user, userData, loading, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    const role = userData?.role;

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.replace("/auth/login");
                return;
            }

            // If on a root or shared path, redirect based on role
            if (pathname === "/") {
                router.replace(role === "client" ? "/client/dashboard" : "/helper/dashboard");
                return;
            }

            // Strict Role Check
            if (pathname.startsWith("/client") && role !== "client") {
                router.replace("/helper/dashboard");
            } else if (pathname.startsWith("/helper") && role !== "helper") {
                router.replace("/client/dashboard");
            }
        }
    }, [isAuthenticated, role, loading, router, pathname]);

    if (loading) {
        return (
            <Center className="h-screen bg-slate-50">
                <Stack align="center" gap="sm">
                    <Loader size="xl" variant="bars" color="blue" />
                    <Text fw={700} c="dimmed">Authenticating...</Text>
                </Stack>
            </Center>
        );
    }

    // If we are authenticated and on the correct path, or it's a root redirect in progress
    if (!isAuthenticated) return null;

    // Prevent flash of content before redirecting wrong role
    if (pathname.startsWith("/client") && role !== "client") return null;
    if (pathname.startsWith("/helper") && role !== "helper") return null;

    return <>{children}</>;
}
