"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconSparkles, IconCheck } from "@tabler/icons-react";
import { SUBSCRIPTION_PLANS } from "@/data/subscriptions";
import { assignPlanToCurrentUser } from "@/lib/services/subscriptionService";
import { showError, showSuccess } from "@/lib/sweetalert";
import { useAppTheme } from "@/app/context/ThemeContext";

function formatPKR(amount: number) {
  return amount === 0 ? "PKR 0" : `PKR ${amount.toLocaleString("en-PK")}`;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/customer/dashboard";
  const role = params.get("role") || "customer";
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const plans = useMemo(() => SUBSCRIPTION_PLANS, []);
  const { isDark } = useAppTheme();

  return (
    <Box
      className={
        isDark
          ? "min-h-screen bg-brand-black text-white p-4 md:p-10"
          : "min-h-screen bg-gray-50 text-gray-900 p-4 md:p-10"
      }
    >
      <Stack gap="lg" className="max-w-6xl mx-auto">
        <Box>
          <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">
            Subscriptions
          </Text>
          <Title order={1} className="font-manrope text-3xl md:text-5xl">
            Choose your plan
          </Title>
          <Text className="text-gray-400 mt-2 max-w-2xl">
            Your account is ready. Pick a plan to unlock the full RoadHelper experience. Prices are shown in PKR.
          </Text>
        </Box>

        <Group align="stretch" className="flex-col md:flex-row" grow>
          {plans.map((p) => (
            <Paper
              key={p.id}
              p="xl"
              radius="2xl"
              className="glass-dark border border-white/10"
            >
              <Stack gap="md" className="h-full">
                <Group justify="space-between" align="start">
                  <Box>
                    <Group gap="sm">
                      <IconSparkles size={20} className="text-brand-red" />
                      <Text fw={900} className="text-white text-xl">
                        {p.name}
                      </Text>
                    </Group>
                    <Text className="text-gray-400 mt-1">{p.description}</Text>
                  </Box>
                  {p.isDefault && (
                    <Badge className="bg-brand-red text-white">Recommended</Badge>
                  )}
                  {p.comingSoon && (
                    <Badge variant="outline" color="gray">
                      Coming soon
                    </Badge>
                  )}
                </Group>

                <Box className="mt-2">
                  <Text className="text-4xl font-black text-white">
                    {formatPKR(p.pricePKR)}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Includes up to <strong className="text-gray-200">{p.maxRides}</strong>{" "}
                    rides/helpers
                  </Text>
                </Box>

                <Stack gap="xs" className="mt-2">
                  {p.highlights.map((h) => (
                    <Group key={h} gap="xs">
                      <IconCheck size={18} className="text-green-400" />
                      <Text className="text-gray-300">{h}</Text>
                    </Group>
                  ))}
                </Stack>

                <Box className="mt-auto pt-4">
                  <Button
                    fullWidth
                    size="lg"
                    radius="xl"
                    className={
                      p.comingSoon
                        ? "bg-white/10 text-gray-400 cursor-not-allowed"
                        : "bg-brand-red hover:bg-brand-dark-red"
                    }
                    disabled={!!p.comingSoon || loadingPlanId !== null}
                    loading={loadingPlanId === p.id}
                    onClick={async () => {
                      try {
                        setLoadingPlanId(p.id);
                        await assignPlanToCurrentUser(p.id);
                        await showSuccess("Plan selected", `You’re on the ${p.name}.`);
                        router.push(next);
                      } catch (e: unknown) {
                        await showError(
                          "Selection failed",
                          e instanceof Error ? e.message : "Unable to select plan.",
                        );
                      } finally {
                        setLoadingPlanId(null);
                      }
                    }}
                  >
                    {p.comingSoon ? "Not available yet" : "Continue"}
                  </Button>
                  <Text className="text-gray-500 text-xs mt-3 text-center">
                    Signed in as <strong className="text-gray-300">{role}</strong>
                  </Text>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}

