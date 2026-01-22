"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Center, Loader } from "@mantine/core";

export default function Home() {
  const router = useRouter();
  const { user, userData, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (userData) {
        router.push(userData.role === "client" ? "/client/dashboard" : "/helper/dashboard");
      }
    }
  }, [user, userData, loading, router]);

  return (
    <Center className="h-screen bg-slate-50">
      <Loader size="xl" variant="bars" color="blue" />
    </Center>
  );
}
