"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  Stack,
  Button,
  Box,
  Badge,
  ThemeIcon,
  Switch,
  ActionIcon,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import {
  IconCash,
  IconChecklist,
  IconClock,
  IconStar,
  IconBriefcase,
  IconNavigation,
  IconAlertCircle,
  IconTrendingUp,
  IconWallet,
  IconArrowRight,
  IconActivity,
  IconSparkles,
  IconMap2,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/app/context/ThemeContext";
import { auth } from "@/lib/firebase/config";
import {
  subscribeHelperCompletedCount,
  subscribeHelperCompletedJobs,
} from "@/lib/services/requestService";
import { useLanguage } from "@/app/context/LanguageContext";
import type { RideRequestDoc } from "@/types";

const HelperDashboard = () => {
  const { isDark } = useAppTheme();
  const { dict, isRTL, language } = useLanguage();
  const [isOnline, setIsOnline] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [helperName, setHelperName] = useState("Helper");
  const [completedCount, setCompletedCount] = useState(0);
  const [completedJobs, setCompletedJobs] = useState<
    Array<{ id: string } & RideRequestDoc>
  >([]);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUid(u?.uid ?? null);
      setHelperName(u?.displayName ?? u?.email?.split("@")[0] ?? "Helper");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsubCount = subscribeHelperCompletedCount(uid, setCompletedCount);
    // Fetch completed jobs for history and earnings
    const unsubJobs = subscribeHelperCompletedJobs({
      helperId: uid,
      cb: (jobs) => setCompletedJobs(jobs),
    });

    return () => {
      unsubCount();
      unsubJobs();
    };
  }, [uid]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(12)].map(() => ({
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        duration: Math.random() * 5 + 5,
      })),
    );
  }, []);

  const freeRidesLimit = 10;
  const ridesRemaining = Math.max(0, freeRidesLimit - completedCount);
  const commissionRate = 20;

  // Calculate earnings from completed jobs for today
  const todaysEarnings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return completedJobs.reduce((acc, job) => {
      if (job.completedAt && job.completedAt >= today) {
        return acc + (Number((job as any).amount) || 0); // Assuming amount field exists
      }
      return acc;
    }, 0);
  }, [completedJobs]);

  const recentSettlements = useMemo(() => {
    // Use completed jobs as proxy for settlements for now
    return completedJobs.slice(0, 3).map((job) => ({
      date: job.completedAt ? job.completedAt.toLocaleDateString() : "N/A",
      amount: Number((job as any).amount) || 0,
      status: "Paid", // Default for now
    }));
  }, [completedJobs]);

  const userData = useMemo(
    () => ({
      fullName: helperName,
      totalJobs: completedCount,
      rating: 0, // Need rating specific query
      todaysEarnings: todaysEarnings,
      pendingPayment: 0,
      paymentDue: completedCount > freeRidesLimit,
    }),
    [helperName, completedCount, todaysEarnings],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const handleToggleOnline = useCallback((checked: boolean) => {
    setIsOnline(checked);
  }, []);

  const bgClass = isDark ? "bg-[#0a0a0a]" : "bg-gray-50";

  return (
    <Box
      className={cn(
        "relative min-h-screen overflow-hidden p-4 md:p-8 font-satoshi",
        bgClass,
      )}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-orange-600/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-brand-red/10 blur-[100px] rounded-full"
        />

        {isLoaded &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-orange-500/20 rounded-full"
              initial={{
                x: p.x,
                y: p.y,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
      </div>

      <motion.div
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* HEADER SECTION */}
        <Group
          justify="space-between"
          mb={40}
          align="center"
          className={isRTL ? "flex-row-reverse" : ""}
        >
          <Box className={isRTL ? "text-right" : "text-left"}>
            <motion.div
              variants={itemVariants as any}
              className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="h-[1px] w-8 bg-orange-500" />
              <Text className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                {dict.helper_dashboard.professional_workstation}
              </Text>
            </motion.div>
            <Title
              order={1}
              className={`font-manrope font-extrabold text-4xl md:text-5xl tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              {dict.auth.welcome_back},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                {userData.fullName}
              </span>
            </Title>
          </Box>

          <motion.div variants={itemVariants as any}>
            <Paper
              p="md"
              radius="24px"
              className={cn(
                "border transition-all duration-500 px-6",
                isDark ? "glass-dark" : "bg-white",
                isOnline
                  ? "border-green-500/30 shadow-xl shadow-green-500/10"
                  : "border-gray-200",
              )}
            >
              <Group gap="xl" className={isRTL ? "flex-row-reverse" : ""}>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                    {dict.helper_dashboard.availability_status}
                  </Text>
                  <Text
                    className={cn(
                      "font-bold text-sm",
                      isOnline ? "text-green-400" : "text-gray-400",
                    )}
                  >
                    {isOnline
                      ? dict.helper_dashboard.operational
                      : dict.helper_dashboard.off_duty}
                  </Text>
                </div>
                <Switch
                  size="lg"
                  checked={isOnline}
                  onChange={(e) => handleToggleOnline(e.currentTarget.checked)}
                  color="green"
                  classNames={{ track: "cursor-pointer" }}
                />
              </Group>
            </Paper>
          </motion.div>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 4 }} spacing={24} mb={24}>
          {/* Earnings Card */}
          <motion.div variants={itemVariants as any} className="lg:col-span-2">
            <Paper
              p={40}
              radius="32px"
              className="bg-gradient-to-br from-orange-600/20 via-brand-red/20 to-brand-dark-red/20 text-white relative overflow-hidden shadow-2xl border border-white/10 h-full group"
            >
              <div className="absolute top-[-40px] right-[-40px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                <IconCash size={300} />
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <Group
                    justify="space-between"
                    mb={20}
                    className={isRTL ? "flex-row-reverse" : ""}
                  >
                    <div
                      className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                        <IconWallet size={24} />
                      </div>
                      <Text className="font-bold text-white/80 uppercase tracking-widest text-xs">
                        {dict.helper_dashboard.todays_revenue}
                      </Text>
                    </div>
                    <Badge
                      color="orange"
                      variant="filled"
                      className="bg-orange-500 shadow-lg shadow-orange-500/20"
                    >
                      {dict.helper_dashboard.live}
                    </Badge>
                  </Group>
                  <Title
                    order={1}
                    className={`font-manrope text-7xl font-black tracking-tighter mb-4 italic ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {dict.common.currency}{" "}
                    {(userData.todaysEarnings || 0).toLocaleString(
                      language === "en" ? "en-PK" : "ur-PK",
                    )}
                  </Title>
                  <Group gap="xs" className={isRTL ? "flex-row-reverse" : ""}>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">
                      {completedCount > 0
                        ? `${completedCount} ${dict.helper_dashboard.completed}`
                        : dict.helper_dashboard.start_earning}
                    </div>
                  </Group>
                </div>

                <div
                  className={`mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/50 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span>{dict.helper_dashboard.net_after_fee}</span>
                  <div
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <IconShieldCheck size={14} className="text-orange-500" />
                    {dict.helper_dashboard.secure_payout}
                  </div>
                </div>
              </div>
            </Paper>
          </motion.div>

          {/* Jobs Stat Card */}
          <motion.div variants={itemVariants as any}>
            <Paper
              p={32}
              radius="32px"
              className={cn(
                "border border-white/10 h-full flex flex-col justify-between group hover:bg-white/5 transition-all",
                isDark ? "glass-dark" : "bg-white border-gray-200",
              )}
            >
              <ThemeIcon
                size={64}
                radius="24px"
                className="bg-blue-500/10 text-blue-400 mb-0 border border-blue-500/20 group-hover:scale-110 transition-transform"
              >
                <IconChecklist size={32} />
              </ThemeIcon>
              <div>
                <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  {dict.helper_dashboard.completion_rate}
                </Text>
                <Title
                  order={2}
                  className={`text-4xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {userData.totalJobs > 0 ? "98" : "0"}{" "}
                  <span className="text-xl text-blue-400">%</span>
                </Title>
                <Text className="text-gray-500 text-xs mt-2 font-medium">
                  {userData.totalJobs} {dict.helper_dashboard.jobs_completed}
                </Text>
              </div>
            </Paper>
          </motion.div>

          {/* Rating Card / Free Rides Card */}
          <motion.div variants={itemVariants as any}>
            <Paper
              p={32}
              radius="32px"
              className={cn(
                "border border-white/10 h-full flex flex-col justify-between group hover:bg-white/5 transition-all",
                isDark ? "glass-dark" : "bg-white border-gray-200",
              )}
            >
              <ThemeIcon
                size={64}
                radius="24px"
                className="bg-yellow-500/10 text-yellow-400 mb-0 border border-yellow-500/20 group-hover:scale-110 transition-transform"
              >
                <IconStar size={32} />
              </ThemeIcon>
              <div>
                <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  {dict.helper_dashboard.free_rides_policy}
                </Text>
                <Title
                  order={2}
                  className={`text-4xl font-black ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {ridesRemaining}{" "}
                  <span className="text-xl text-yellow-500">
                    / {freeRidesLimit}
                  </span>
                </Title>
                <Text className="text-gray-500 text-xs mt-2 font-medium">
                  {dict.helper_dashboard.free_rides_left}. {freeRidesLimit}{" "}
                  {dict.helper_dashboard.commission_after}
                </Text>
              </div>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Payment Warning - only when past free rides */}
        {userData.paymentDue && completedCount > freeRidesLimit && (
          <motion.div variants={itemVariants as any} className="mb-24">
            <Paper
              p={24}
              radius="24px"
              className="relative overflow-hidden bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-2 border-yellow-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full" />
              <Group
                justify="space-between"
                align="center"
                className={isRTL ? "flex-row-reverse" : ""}
              >
                <Group gap={20} className={isRTL ? "flex-row-reverse" : ""}>
                  <div className="h-14 w-14 rounded-2xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30 animate-pulse">
                    <IconAlertCircle size={30} />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <Text
                      className={`font-extrabold text-xl tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {dict.helper_dashboard.system_fee_overdue}: PKR{" "}
                      {userData.pendingPayment.toLocaleString("en-PK")}
                    </Text>
                    <Text className="text-gray-400 font-medium">
                      To maintain priority, settle overdue commission.
                    </Text>
                  </div>
                </Group>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-black px-8 h-12 rounded-xl border-b-4 border-yellow-800 transition-all hover:translate-y-[-2px] active:translate-y-[2px]"
                  rightSection={<IconArrowRight size={18} />}
                >
                  {dict.helper_dashboard.clear_balance}
                </Button>
              </Group>
            </Paper>
          </motion.div>
        )}

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={24} mb={40}>
          {/* Main Feed Section */}
          <motion.div variants={itemVariants as any} className="lg:col-span-2">
            <Paper
              p={40}
              radius="32px"
              className={cn(
                "border border-white/10 h-full relative overflow-hidden",
                isDark ? "glass-dark" : "bg-white border-gray-200",
              )}
            >
              <div className="absolute top-0 right-0 p-8 text-white/5">
                <IconMap2 size={200} />
              </div>

              <Group
                justify="space-between"
                mb={40}
                align="flex-end"
                className={isRTL ? "flex-row-reverse" : ""}
              >
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Title
                    order={3}
                    className={`font-manrope font-black text-3xl tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {dict.helper_dashboard.active_job_radar}
                  </Title>
                  <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                    {dict.helper_dashboard.real_time_requests}
                  </Text>
                </div>
                <Button
                  variant="subtle"
                  className="hover:bg-white/5 text-gray-400 font-bold rounded-xl"
                  leftSection={<IconMap2 size={18} />}
                  component={Link}
                  href="/helper/requests"
                >
                  {dict.helper_dashboard.browse_jobs}
                </Button>
              </Group>

              {/* RADAR SEARCHING UI */}
              <Box
                className={`flex flex-col items-center justify-center py-20 rounded-[32px] border relative ${isDark ? "bg-white/5 border-white/5" : "bg-gray-100/50 border-gray-200"}`}
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-[-40px] bg-orange-500 rounded-full"
                  />
                  <div className="relative z-10 h-24 w-24 rounded-[32px] bg-brand-charcoal border-2 border-orange-500/30 flex items-center justify-center text-orange-500 shadow-2xl shadow-orange-500/20">
                    <IconActivity size={48} className="animate-pulse" />
                  </div>
                </div>

                <Text
                  className={`font-black text-xl mb-1 tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {dict.helper_dashboard.searching_area}
                </Text>
                <Text className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-10">
                  {dict.helper_dashboard.beacon_active}
                </Text>

                <Button
                  radius="xl"
                  className="bg-white text-black hover:bg-gray-200 px-10 h-14 font-black transition-all group shadow-xl"
                  component={Link}
                  href="/helper/requests"
                  rightSection={
                    <IconArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  }
                >
                  {dict.helper_dashboard.browse_jobs}
                </Button>
              </Box>
            </Paper>
          </motion.div>

          {/* Side Widget */}
          <Stack gap={24}>
            <motion.div variants={itemVariants as any}>
              <Paper
                p={40}
                radius="32px"
                className="bg-gradient-to-br from-[#121212] to-black text-white h-full relative overflow-hidden border border-white/10 shadow-2xl min-h-[300px]"
              >
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-600/10 blur-[60px] rounded-full" />

                <Group
                  mb={40}
                  justify="space-between"
                  className={isRTL ? "flex-row-reverse" : ""}
                >
                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <IconClock size={20} />
                  </div>
                  <Badge
                    variant="outline"
                    color="gray"
                    className="text-gray-500 border-gray-800"
                  >
                    {dict.helper_dashboard.on_duty_mock}
                  </Badge>
                </Group>

                <Title
                  order={4}
                  className="font-manrope text-white font-black text-xl mb-2"
                >
                  {dict.helper_dashboard.shift_insights}
                </Title>
                <Text className="text-gray-500 font-medium text-sm mb-8">
                  {dict.helper_dashboard.shift_insights_desc}
                </Text>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {dict.helper_dashboard.global_demand}
                    </Text>
                    <Text className="text-xs font-black text-green-400">
                      {dict.helper_dashboard.high_simulated}
                    </Text>
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <Paper
                p={30}
                radius="32px"
                className={cn(
                  "border border-white/10 hover:border-orange-500/30 transition-all shadow-2xl cursor-pointer group",
                  isDark ? "glass-dark" : "bg-white border-gray-200",
                )}
              >
                <Group
                  justify="space-between"
                  className={isRTL ? "flex-row-reverse" : ""}
                >
                  <div
                    className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <IconSparkles size={24} />
                    </div>
                    <div>
                      <Text
                        className={
                          isDark
                            ? "text-white font-bold"
                            : "text-gray-900 font-bold"
                        }
                      >
                        {dict.helper_dashboard.get_pro_perks}
                      </Text>
                      <Text className="text-gray-500 text-xs font-medium">
                        {dict.helper_dashboard.earn_more}
                      </Text>
                    </div>
                  </div>
                  <IconArrowRight
                    size={20}
                    className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </Group>
              </Paper>
            </motion.div>
          </Stack>
        </SimpleGrid>

        {/* RECENT SETTLEMENTS */}
        <motion.div variants={itemVariants as any}>
          <Paper
            p={40}
            radius="32px"
            className={cn(
              "border shadow-2xl",
              isDark
                ? "glass-dark border-white/10"
                : "bg-white border-gray-200",
            )}
          >
            <Group
              justify="space-between"
              mb={32}
              className={isRTL ? "flex-row-reverse" : ""}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <Title
                  order={4}
                  className={`font-manrope text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {dict.helper_dashboard.financial_history}
                </Title>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                  {dict.helper_dashboard.platform_settlements}
                </Text>
              </div>
              <Button
                variant="outline"
                color="gray"
                className={cn(
                  "border-white/10 text-gray-400 px-6 rounded-xl",
                  isDark ? "hover:bg-white/5" : "hover:bg-gray-100",
                )}
              >
                {dict.helper_dashboard.export_pdf}
              </Button>
            </Group>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSettlements.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <Text className="text-gray-500">
                    {dict.helper_dashboard.no_settlement_history}
                  </Text>
                </div>
              ) : (
                recentSettlements.map((payment, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-3xl border transition-all",
                      isDark
                        ? "bg-white/5 border-white/5 hover:border-green-500/20"
                        : "bg-gray-50 border-gray-200",
                    )}
                  >
                    <Group gap="xl" className={isRTL ? "flex-row-reverse" : ""}>
                      <ThemeIcon
                        size={48}
                        radius="xl"
                        className="bg-green-500/10 text-green-400"
                      >
                        <IconTrendingUp size={24} />
                      </ThemeIcon>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <Text
                          className={`font-black text-xl ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          PKR {payment.amount.toLocaleString("en-PK")}
                        </Text>
                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                          {payment.date}
                        </Text>
                      </div>
                    </Group>
                    <Badge
                      variant="dot"
                      color="green"
                      size="lg"
                      className="text-green-400 bg-transparent border-none"
                    >
                      Success
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </Paper>
        </motion.div>

        <div className="h-20" />
      </motion.div>
    </Box>
  );
};

export default HelperDashboard;
