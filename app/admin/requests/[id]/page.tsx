"use client";

import React, { memo, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconMapPin,
  IconUser,
  IconPhone,
  IconCar,
  IconTools,
  IconMail,
  IconStar,
  IconDotsVertical,
  IconReceipt2,
  IconRoute,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Badge,
  Paper,
  Text,
  Avatar,
  Divider,
  Timeline,
  Box,
  Group,
  Stack,
  ThemeIcon,
  ActionIcon,
  Title,
} from "@mantine/core";
import { motion, Variants } from "framer-motion";
import { showSuccess, showInfo } from "@/lib/sweetalert";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { subscribeRideRequest } from "@/lib/services/requestService";
import type { RideRequestDoc, TimelineItem } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const RequestDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [request, setRequest] = useState<RideRequestDoc | null>(null);
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();

  // Production-safe Tailwind color mapping
  const colorMap = {
    red: "text-red-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeRideRequest(id, (req) => setRequest(req));
    return () => unsub();
  }, [id]);

  const handleAction = async () => {
    await showSuccess("Job status updated successfully.");
  };

  if (!request) {
    return (
      <Box
        className={cn(
          "relative min-h-screen overflow-hidden p-4 md:px-8 md:pt-0 md:pb-8 font-satoshi flex items-center justify-center",
          isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900",
        )}
      >
        <Text>{dict.common.loading || "Loading request…"}</Text>
      </Box>
    );
  }

  return (
    <Box
      className={cn(
        "min-h-screen p-4 md:px-8 md:pt-2 md:pb-8 max-w-full mx-auto transition-colors",
        isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-[5%] -left-[5%] w-[50%] h-[50%] bg-brand-red/10 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-[0%] right-[0%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-full mx-auto"
      >
        {/* Navigation Header */}
        <Group justify="space-between" mb={40} align="center">
          <Group gap="xl">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className={cn(
                "h-14 rounded-2xl px-6 group",
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
              )}
            >
              <IconArrowLeft
                size={22}
                className="mr-3 group-hover:-translate-x-1 transition-transform"
              />
              {dict.profile.back || "Return to Registry"}
            </Button>
            <div
              className={cn(
                "h-10 w-px hidden md:block",
                isDark ? "bg-white/10" : "bg-gray-200",
              )}
            />
            <Box>
              <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                {dict.admin.operational_id}
              </Text>
              <Title
                order={4}
                className={cn(
                  "font-mono text-xl",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {request.id.slice(0, 12)}...
              </Title>
            </Box>
          </Group>
          <Group gap="md">
            <ActionIcon
              size={56}
              radius="2xl"
              variant="subtle"
              color="gray"
              className={cn(
                "border transition-all",
                isDark
                  ? "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  : "bg-white border-gray-200 text-gray-400 hover:text-gray-900",
              )}
            >
              <IconDotsVertical size={24} />
            </ActionIcon>
            <Button
              onClick={handleAction}
              className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl px-10 font-black shadow-2xl shadow-brand-red/20 transition-all active:scale-95"
            >
              MARK AS FULFILLED
            </Button>
          </Group>
        </Group>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Primary Intel */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mission Progress */}
            <motion.div variants={itemVariants}>
              <Paper
                p={40}
                radius="40px"
                className={cn(
                  "border shadow-2xl relative overflow-hidden",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 p-10",
                    isDark ? "text-white/2" : "text-gray-900/2",
                  )}
                >
                  <IconRoute size={240} />
                </div>
                <Group justify="space-between" mb={35} align="flex-start">
                  <Box>
                    <Title
                      order={3}
                      className={cn(
                        "font-manrope font-black text-2xl tracking-tight",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {dict.admin.mission_telemetry}
                    </Title>
                    <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                      Real-time engagement timeline
                    </Text>
                  </Box>
                  <Badge
                    size="xl"
                    radius="md"
                    className={cn(
                      "px-6 h-9 font-black uppercase text-[10px]",
                      request.status === "in_progress"
                        ? "bg-blue-600 shadow-lg shadow-blue-500/20"
                        : "bg-emerald-600 shadow-lg shadow-emerald-500/20",
                    )}
                  >
                    {request.status}
                  </Badge>
                </Group>

                <Timeline
                  active={2}
                  bulletSize={40}
                  lineWidth={3}
                  color="brand-red"
                >
                  {request.timeline.map((item: TimelineItem, idx: number) => (
                    <Timeline.Item
                      key={idx}
                      bullet={
                        <item.icon
                          size={20}
                          className={
                            item.active ? "text-white" : "text-gray-700"
                          }
                        />
                      }
                      title={item.title}
                      classNames={{
                        itemTitle: cn(
                          "font-black uppercase text-xs tracking-widest",
                          item.active
                            ? isDark
                              ? "text-white"
                              : "text-gray-900"
                            : "text-gray-600",
                        ),
                        itemContent: "mt-1",
                        itemBullet: cn(
                          "border-2",
                          isDark ? "bg-[#0a0a0a]" : "bg-white",
                          item.active
                            ? "border-brand-red shadow-[0_0_15px_#ef4444]"
                            : isDark
                              ? "border-white/10"
                              : "border-gray-200",
                        ),
                      }}
                    >
                      <Text
                        size="xs"
                        c="dimmed"
                        fw={700}
                        className="font-manrope"
                      >
                        {item.time}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Paper>
            </motion.div>

            {/* Deployment Details */}
            <motion.div variants={itemVariants}>
              <Paper
                p={40}
                radius="40px"
                className={cn(
                  "border shadow-2xl relative overflow-hidden",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200",
                )}
              >
                <header className="mb-10">
                  <Title
                    order={3}
                    className={cn(
                      "font-manrope font-black text-2xl tracking-tight",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    {dict.admin.deployment_specification}
                  </Title>
                  <div className="h-1 w-20 bg-brand-red mt-3" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  {[
                    {
                      icon: IconTools,
                      label: "Assigned Service",
                      value: request.serviceType,
                      color: "red",
                    },
                    {
                      icon: IconCar,
                      label: "Subject Vehicle",
                      value: request.vehicleDetails,
                      color: "blue",
                    },
                    {
                      icon: IconMapPin,
                      label: "Deployment Zone",
                      value:
                        request.location?.address ??
                        (request.location?.lat && request.location?.lng
                          ? `${request.location.lat.toFixed(
                              4,
                            )}, ${request.location.lng.toFixed(4)}`
                          : "Live location"),
                      color: "emerald",
                      full: true,
                    },
                    {
                      icon: IconReceipt2,
                      label: "Estimated Value",
                      value: `Rs ${
                        request.amount
                          ? Number(request.amount).toLocaleString()
                          : "0"
                      }`,
                      color: "emerald",
                      premium: true,
                    },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-4",
                        spec.full ? "md:col-span-2" : "",
                      )}
                    >
                      <ThemeIcon
                        size={48}
                        radius="16px"
                        className={cn(
                          "border transition-transform hover:scale-110",
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-gray-50 border-gray-100",
                          colorMap[spec.color as keyof typeof colorMap],
                        )}
                      >
                        <spec.icon size={22} />
                      </ThemeIcon>
                      <div>
                        <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                          {spec.label}
                        </Text>
                        <Text
                          className={cn(
                            "font-black tracking-tight transition-colors",
                            spec.premium
                              ? "text-2xl text-emerald-400"
                              : isDark
                                ? "text-white text-lg"
                                : "text-gray-900 text-lg",
                          )}
                        >
                          {spec.value}
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider
                  my={40}
                  className={isDark ? "border-white/5" : "border-gray-100"}
                />

                <div>
                  <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Operator Field Report
                  </Text>
                  <Paper
                    p={24}
                    radius="20px"
                    className={cn(
                      "border relative",
                      isDark
                        ? "bg-white/2 border-white/5"
                        : "bg-gray-50/50 border-gray-100",
                    )}
                  >
                    <Text
                      className={cn(
                        "font-medium italic leading-loose",
                        isDark ? "text-gray-300" : "text-gray-600",
                      )}
                    >
                      &quot;{request.notes}&quot;
                    </Text>
                  </Paper>
                </div>
              </Paper>
            </motion.div>
          </div>

          {/* Sidebar Intel */}
          <div className="lg:col-span-4 space-y-8">
            {/* Asset: Requester */}
            <motion.div variants={itemVariants}>
              <Paper
                p={32}
                radius="40px"
                className={cn(
                  "border shadow-2xl overflow-hidden relative group",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 p-6 transition-colors",
                    isDark
                      ? "text-white/1 group-hover:text-white/3"
                      : "text-gray-900/1 group-hover:text-gray-900/3",
                  )}
                >
                  <IconUser size={100} />
                </div>
                <Title
                  order={4}
                  className={cn(
                    "font-black text-sm uppercase tracking-widest mb-8",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  Asset: Requester
                </Title>

                <div className="flex items-center gap-5 mb-10">
                  <Avatar
                    size={72}
                    radius="24px"
                    className="bg-linear-to-br from-brand-red to-brand-dark-red border-2 border-white/10 font-black shadow-xl"
                  >
                    {request.user.name[0]}
                  </Avatar>
                  <div>
                    <Text
                      fw={900}
                      className={cn(
                        "text-xl tracking-tight transition-colors",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {request.user.name}
                    </Text>
                    <Text
                      size="xs"
                      className="text-gray-500 font-bold uppercase tracking-widest"
                    >
                      Verified Customer
                    </Text>
                  </div>
                </div>

                <Stack
                  gap="md"
                  className={cn(
                    "border-t pt-8",
                    isDark ? "border-white/5" : "border-gray-100",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ThemeIcon
                      radius="md"
                      size="md"
                      className={cn(
                        "bg-transparent",
                        isDark ? "text-gray-500" : "text-gray-400",
                      )}
                    >
                      <IconPhone size={16} />
                    </ThemeIcon>
                    <Text
                      size="sm"
                      fw={800}
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {request.user.phone}
                    </Text>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThemeIcon
                      radius="md"
                      size="md"
                      className={cn(
                        "bg-transparent",
                        isDark ? "text-gray-500" : "text-gray-400",
                      )}
                    >
                      <IconMail size={16} />
                    </ThemeIcon>
                    <Text
                      size="sm"
                      fw={800}
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {request.user.email}
                    </Text>
                  </div>
                </Stack>

                <Button className="w-full mt-10 bg-white/5 hover:bg-white/10 text-white h-14 rounded-2xl border border-white/5 font-black uppercase text-[10px] tracking-widest">
                  Access Personnel File
                </Button>
              </Paper>
            </motion.div>

            {/* Asset: Deployer */}
            <motion.div variants={itemVariants}>
              <Paper
                p={32}
                radius="40px"
                className={cn(
                  "border shadow-2xl overflow-hidden relative group",
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0 right-0 p-6 transition-colors",
                    isDark
                      ? "text-white/1 group-hover:text-white/3"
                      : "text-gray-900/1 group-hover:text-gray-900/3",
                  )}
                >
                  <IconTools size={100} />
                </div>
                <Title
                  order={4}
                  className={cn(
                    "font-black text-sm uppercase tracking-widest mb-8",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  Asset: Deployer
                </Title>

                <div className="flex items-center gap-5 mb-10">
                  <Avatar
                    size={72}
                    radius="24px"
                    className="bg-linear-to-br from-blue-600 to-indigo-700 border-2 border-white/10 font-black shadow-xl"
                  >
                    {request.helper.name[0]}
                  </Avatar>
                  <div>
                    <Text
                      fw={900}
                      className={cn(
                        "text-xl tracking-tight transition-colors",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {request.helper.name}
                    </Text>
                    <Group gap={4} className="mt-1">
                      <IconStar
                        size={12}
                        fill="#fbbf24"
                        className="text-amber-400"
                      />
                      <Text
                        size="xs"
                        className="text-amber-400 font-black tracking-widest"
                      >
                        4.8 OPERATIONAL RATING
                      </Text>
                    </Group>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-3 mb-10 p-4 rounded-2xl border transition-colors",
                    isDark
                      ? "bg-white/5 border-white/5"
                      : "bg-gray-50 border-gray-100",
                  )}
                >
                  <ThemeIcon
                    radius="md"
                    size="md"
                    className="bg-transparent text-gray-500"
                  >
                    <IconPhone size={16} />
                  </ThemeIcon>
                  <Text
                    size="sm"
                    fw={800}
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                  >
                    {request.helper.phone}
                  </Text>
                </div>

                <Button
                  onClick={() => showInfo("Reassigning...")}
                  className="w-full bg-transparent hover:bg-brand-red border-2 border-brand-red/30 hover:border-brand-red text-white h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                >
                  Reassign Specialist
                </Button>
              </Paper>
            </motion.div>
          </div>
        </div>

        <div className="h-32" />
      </motion.div>
    </Box>
  );
};

export default memo(RequestDetailPage);
