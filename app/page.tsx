"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Center, Loader, Stack, Text } from "@mantine/core";

export default function Home() {
  return (
    <ProtectedRoute>
      <Center className="h-screen bg-slate-50">
        <Stack align="center">
          <Loader size="xl" variant="bars" color="blue" />
          <Text fw={700} c="dimmed">Redirecting to your dashboard...</Text>
        </Stack>
      </Center>
    </ProtectedRoute>
  );
}
