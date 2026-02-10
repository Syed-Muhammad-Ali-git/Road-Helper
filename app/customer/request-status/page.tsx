"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Group,
  Button,
  Badge,
  Loader,
  Avatar,
  ThemeIcon,
  Timeline,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconEye,
  IconCar,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase/config";
import { subscribeCustomerRequests } from "@/lib/services/requestService";

/* ---------------- TYPES ---------------- */

interface Request {
  id: string;
  serviceType: string;
  status: string;
  helperName: string | null;
  location: string;
  createdAt?: any;
}

/* ---------------- COMPONENT ---------------- */

export default function RequestStatusList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeCustomerRequests({
      customerId: uid,
      cb: (reqs) => {
        setRequests(
          reqs.map((r: any) => ({
            id: r.id,
            serviceType: r.serviceType,
            status: r.status,
            helperName: r.helperName ?? null,
            location: r.location?.address ?? "Live location",
            createdAt: r.createdAt,
          })),
        );
        setLoading(false);
      },
    });
    return () => unsub();
  }, [uid]);

  const toDateLabel = useMemo(() => {
    return (createdAt: any) => {
      const d =
        createdAt?.toDate?.() instanceof Date
          ? createdAt.toDate()
          : createdAt instanceof Date
            ? createdAt
            : null;
      if (!d) return "Just now";
      return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    };
  }, []);

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-brand-black">
        <Loader size="xl" color="red" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen p-4 md:p-8 bg-brand-black text-white">
      <Stack gap="xl" className="max-w-5xl mx-auto">
        <Group justify="space-between">
          <Group>
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={20} />}
              component={Link}
              href="/customer/dashboard"
              className="text-gray-400 hover:text-white"
            >
              Back
            </Button>
            <Title
              order={1}
              className="font-manrope text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
            >
              My Requests
            </Title>
          </Group>
        </Group>

        {requests.length === 0 ? (
          <Paper
            p="xl"
            radius="xl"
            className="text-center bg-brand-charcoal border border-gray-800"
          >
            <Text className="text-gray-400">No requests found.</Text>
            <Button
              component={Link}
              href="/customer/request-help"
              mt="md"
              variant="light"
              color="red"
            >
              Request Help Now
            </Button>
          </Paper>
        ) : (
          <Stack gap="lg">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Paper
                  p="lg"
                  radius="lg"
                  className="bg-brand-charcoal border border-gray-800 hover:border-brand-red/50 transition-colors shadow-lg"
                >
                  <Group
                    justify="space-between"
                    align="start"
                    wrap="nowrap"
                    className="flex-col md:flex-row"
                  >
                    <Group align="start" className="w-full md:w-auto">
                      <ThemeIcon
                        size={50}
                        radius="md"
                        color="red"
                        variant="light"
                        className="bg-brand-red/10 text-brand-red"
                      >
                        <IconCar size={28} />
                      </ThemeIcon>

                      <Box>
                        <Text
                          fw={700}
                          size="lg"
                          className="capitalize text-white"
                        >
                          {request.serviceType.replace("_", " ")}
                        </Text>
                        <Group gap={6} mt={4}>
                          <IconMapPin size={14} className="text-gray-500" />
                          <Text size="sm" className="text-gray-400">
                            {request.location}
                          </Text>
                        </Group>
                        <Group gap={6} mt={2}>
                          <IconClock size={14} className="text-gray-500" />
                          <Text size="xs" className="text-gray-500">
                          {toDateLabel(request.createdAt)}
                          </Text>
                        </Group>
                      </Box>
                    </Group>

                    <Stack
                      align="flex-end"
                      className="w-full md:w-auto mt-4 md:mt-0"
                      gap="xs"
                    >
                      <Badge
                        size="lg"
                        variant="light"
                        color={
                          request.status === "completed"
                            ? "green"
                            : request.status === "in_progress"
                              ? "blue"
                              : "yellow"
                        }
                        className="capitalize"
                      >
                        {request.status.replace("_", " ")}
                      </Badge>
                      {request.helperName && (
                        <Text size="sm" className="text-gray-400">
                          Helper:{" "}
                          <span className="text-white font-semibold">
                            {request.helperName}
                          </span>
                        </Text>
                      )}
                      <Button
                        variant="gradient"
                        gradient={{ from: "red", to: "orange", deg: 90 }}
                        leftSection={<IconEye size={16} />}
                        component={Link}
                        href={`/journey/${request.id}`}
                        size="sm"
                        className="mt-2 w-full md:w-auto shadow-md hover:shadow-xl transition-shadow"
                      >
                        Live View
                      </Button>
                    </Stack>
                  </Group>
                </Paper>
              </motion.div>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
