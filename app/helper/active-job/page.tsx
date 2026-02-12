"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Group,
  Button,
  Badge,
  ThemeIcon,
  Avatar,
  Divider,
  Timeline,
} from "@mantine/core";
import {
  IconPhone,
  IconCircleCheck,
  IconClock,
  IconNavigation,
  IconCheck,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase/config";
import {
  subscribeHelperActiveJobs,
  updateRideStatus,
} from "@/lib/services/requestService";
import { showError } from "@/lib/sweetalert";
import { toast } from "react-toastify";
import type { RideRequestDoc } from "@/types";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ActiveJobUI() {
  const [activeJobs, setActiveJobs] = useState<
    Array<{ id: string } & RideRequestDoc>
  >([]);
  const [updating, setUpdating] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const { dict, isRTL } = useLanguage();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeHelperActiveJobs({
      helperId: uid,
      cb: setActiveJobs,
    });
    return () => unsub();
  }, [uid]);

  const activeJob = activeJobs[0] ?? null;

  const updateStatus = async (status: string) => {
    if (!activeJob) return;
    setUpdating(true);
    try {
      await updateRideStatus({
        requestId: activeJob.id,
        status: status as "in_progress" | "completed",
      });
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    } catch (e: unknown) {
      await showError(
        "Update failed",
        e instanceof Error ? e.message : "Unable to update status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const customerPhone = activeJob?.customerPhone ?? null;
  const phoneClean = customerPhone
    ? String(customerPhone).replace(/[^\d+]/g, "")
    : "";
  const whatsappHref = phoneClean
    ? `https://wa.me/${phoneClean}?text=${encodeURIComponent("RoadHelper: I'm on my way to assist you.")}`
    : "#";
  const telHref = phoneClean ? `tel:${phoneClean}` : "#";

  if (!activeJob) {
    return (
      <Box className="p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Paper
            p="xl"
            radius="xl"
            withBorder
            className="text-center max-w-md bg-slate-50 dark:bg-gray-900 border-dashed dark:border-gray-700"
          >
            <ThemeIcon
              size={80}
              radius="xl"
              color="gray"
              variant="light"
              mb="md"
            >
              <IconClock size={40} />
            </ThemeIcon>
            <Title order={3} mb="xs">
              {dict.active_job.no_active_job_title}
            </Title>
            <Text c="dimmed" mb="xl">
              {dict.active_job.no_active_job_desc}
            </Text>
            <Button
              color="red"
              size="lg"
              radius="md"
              component={Link}
              href="/helper/requests"
              className="hover:scale-105 transition-transform"
            >
              {dict.active_job.find_jobs}
            </Button>
          </Paper>
        </motion.div>
      </Box>
    );
  }

  const loc = activeJob.location;
  const locationStr =
    loc?.address ??
    (loc?.lat && loc?.lng
      ? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
      : "Live location");
  const mapsHref =
    loc?.lat && loc?.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`
      : "#";

  return (
    <Box className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Stack gap="xl">
          <Group
            justify="space-between"
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <Title order={1} className="text-3xl font-bold">
              {dict.active_job.title}
            </Title>
            <Badge
              size="xl"
              color={activeJob.status === "accepted" ? "blue" : "green"}
              variant="filled"
              p="lg"
            >
              {activeJob.status === "accepted"
                ? dict.active_job.timeline_accepted.toUpperCase()
                : dict.active_job.timeline_progress.toUpperCase()}
            </Badge>
          </Group>

          <Paper p="xl" radius="xl" withBorder shadow="sm">
            <Group justify="space-between" mb="xl">
              <Group gap="md">
                <Avatar size="xl" radius="md" color="blue">
                  {(activeJob.customerName ?? "C").charAt(0)}
                </Avatar>
                <Box>
                  <Title order={3}>
                    {activeJob.customerName ?? "Customer"}
                  </Title>
                  <Group gap="xs">
                    <IconPhone size={14} className="text-slate-400" />
                    <Text size="sm" c="dimmed">
                      {customerPhone ?? "Phone not available"}
                    </Text>
                  </Group>
                </Box>
              </Group>
              <Button
                variant="light"
                color="blue"
                leftSection={<IconNavigation size={18} />}
                component="a"
                href={mapsHref}
                target="_blank"
                className="hover:scale-105 transition-transform"
              >
                {dict.active_job.get_directions}
              </Button>
            </Group>

            <Divider my="xl" />

            <Stack gap="lg">
              <Box className={isRTL ? "text-right" : ""}>
                <Text fw={700} size="sm" c="dimmed">
                  {dict.active_job.location}
                </Text>
                <Text fw={600}>{locationStr}</Text>
              </Box>
              <Box className={isRTL ? "text-right" : ""}>
                <Text fw={700} size="sm" c="dimmed">
                  {dict.active_job.vehicle_details}
                </Text>
                <Text>{activeJob.vehicleDetails ?? "—"}</Text>
              </Box>
              <Box className={isRTL ? "text-right" : ""}>
                <Text fw={700} size="sm" c="dimmed">
                  {dict.active_job.issue_description}
                </Text>
                <Text className="bg-slate-50 dark:bg-gray-800 p-4 rounded-xl italic">
                  {activeJob.issueDescription ?? "No description provided."}
                </Text>
              </Box>
            </Stack>

            <Divider my="xl" />

            <Group grow>
              <Button
                variant="outline"
                leftSection={<IconPhone size={18} />}
                component="a"
                href={telHref}
                disabled={!customerPhone}
              >
                {dict.helper_requests.call}
              </Button>
              <Button
                variant="outline"
                color="green"
                leftSection={<IconBrandWhatsapp size={18} />}
                component="a"
                href={whatsappHref}
                target="_blank"
                disabled={!customerPhone}
              >
                {dict.helper_requests.whatsapp}
              </Button>
            </Group>

            <Timeline
              active={
                activeJob.status === "accepted"
                  ? 0
                  : activeJob.status === "in_progress"
                    ? 1
                    : 2
              }
              bulletSize={30}
              lineWidth={2}
              mt="xl"
            >
              <Timeline.Item
                bullet={<IconCheck size={16} />}
                title={dict.active_job.timeline_accepted}
              >
                <Text
                  size="xs"
                  c="dimmed"
                  className={isRTL ? "text-right" : ""}
                >
                  {isRTL
                    ? "آپ نے یہ درخواست قبول کی"
                    : "You accepted this request"}
                </Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<IconNavigation size={16} />}
                title={dict.active_job.timeline_progress}
              >
                <Text
                  size="xs"
                  c="dimmed"
                  className={isRTL ? "text-right" : ""}
                >
                  {isRTL
                    ? "کام شروع ہو چکا ہے یا آپ راستے میں ہیں"
                    : "Work started or you are on your way"}
                </Text>
              </Timeline.Item>
              <Timeline.Item
                bullet={<IconCircleCheck size={16} />}
                title={dict.active_job.timeline_completed}
              >
                <Text
                  size="xs"
                  c="dimmed"
                  className={isRTL ? "text-right" : ""}
                >
                  {isRTL
                    ? "سروس کامیابی سے فراہم کر دی گئی"
                    : "Service delivered successfully"}
                </Text>
              </Timeline.Item>
            </Timeline>

            <Group grow mt="xl">
              {activeJob.status === "accepted" && (
                <Button
                  color="blue"
                  size="lg"
                  radius="md"
                  loading={updating}
                  onClick={() => updateStatus("in_progress")}
                  className="hover:scale-105 transition-transform"
                >
                  {dict.active_job.start_service}
                </Button>
              )}
              {activeJob.status === "in_progress" && (
                <Button
                  color="green"
                  size="lg"
                  radius="md"
                  loading={updating}
                  onClick={() => updateStatus("completed")}
                  className="hover:scale-105 transition-transform"
                >
                  {dict.active_job.mark_completed}
                </Button>
              )}
            </Group>
          </Paper>
        </Stack>
      </motion.div>
    </Box>
  );
}
