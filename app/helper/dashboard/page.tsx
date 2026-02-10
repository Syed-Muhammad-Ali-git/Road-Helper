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

const HelperDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [helperName, setHelperName] = useState("Helper");

  useEffect(() => {
    setIsLoaded(true);
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      try {
        const parsed = JSON.parse(loginData);
        if (parsed.fullName) setHelperName(parsed.fullName.split(" ")[0]);
      } catch (e) {}
    }
  }, []);

  const userData = useMemo(
    () => ({
      fullName: helperName,
      totalJobs: 12,
      rating: 4.9,
      todaysEarnings: 15000,
      pendingPayment: 3000,
      paymentDue: true,
    }),
    [helperName],
  );

  const paymentHistory = useMemo(
    () => [
      { date: "2026-01-25", amount: 25, status: "paid" },
      { date: "2026-01-20", amount: 40, status: "paid" },
      { date: "2026-01-15", amount: 35, status: "paid" },
    ],
    [],
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

  return (
    <Box className="relative min-h-screen bg-[#0a0a0a] overflow-hidden p-4 md:p-8 font-satoshi">
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
          [...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] bg-orange-500/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
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
        <Group justify="space-between" mb={40} align="center">
          <Box>
            <motion.div
              variants={itemVariants as any}
              className="flex items-center gap-2 mb-2"
            >
              <div className="h-[1px] w-8 bg-orange-500" />
              <Text className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                Professional Workstation
              </Text>
            </motion.div>
            <Title
              order={1}
              className="font-manrope font-extrabold text-4xl md:text-5xl text-white tracking-tight"
            >
              Welcome back,{" "}
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
                "glass-dark border transition-all duration-500 px-6",
                isOnline
                  ? "border-green-500/30 shadow-xl shadow-green-500/10"
                  : "border-white/10",
              )}
            >
              <Group gap="xl">
                <div>
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                    Availability Status
                  </Text>
                  <Text
                    className={cn(
                      "font-bold text-sm",
                      isOnline ? "text-green-400" : "text-gray-400",
                    )}
                  >
                    {isOnline ? "OPERATIONAL" : "OFF-DUTY"}
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
                  <Group justify="space-between" mb={20}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                        <IconWallet size={24} />
                      </div>
                      <Text className="font-bold text-white/80 uppercase tracking-widest text-xs">
                        Today's Revenue
                      </Text>
                    </div>
                    <Badge
                      color="orange"
                      variant="filled"
                      className="bg-orange-500 shadow-lg shadow-orange-500/20"
                    >
                      LIVE
                    </Badge>
                  </Group>
                  <Title
                    order={1}
                    className="font-manrope text-7xl font-black tracking-tighter mb-4 italic italic"
                  >
                    PKR {userData.todaysEarnings.toLocaleString("en-PK")}
                  </Title>
                  <Group gap="xs">
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">
                      +12.5% vs Average
                    </div>
                  </Group>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-white/50">
                  <span>Net after platform fee</span>
                  <div className="flex items-center gap-2">
                    <IconShieldCheck size={14} className="text-orange-500" />
                    Secure Payout
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
              className="glass-dark border border-white/10 h-full flex flex-col justify-between group hover:bg-white/5 transition-all"
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
                  Completion Rate
                </Text>
                <Title order={2} className="text-white text-4xl font-black">
                  98 <span className="text-xl text-blue-400">%</span>
                </Title>
                <Text className="text-gray-500 text-xs mt-2 font-medium">
                  {userData.totalJobs} Jobs Completed
                </Text>
              </div>
            </Paper>
          </motion.div>

          {/* Rating Card */}
          <motion.div variants={itemVariants as any}>
            <Paper
              p={32}
              radius="32px"
              className="glass-dark border border-white/10 h-full flex flex-col justify-between group hover:bg-white/5 transition-all"
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
                  Expertise Score
                </Text>
                <Title order={2} className="text-white text-4xl font-black">
                  {userData.rating}{" "}
                  <span className="text-xl text-yellow-500">★</span>
                </Title>
                <Text className="text-gray-500 text-xs mt-2 font-medium">
                  Top 5% in your area
                </Text>
              </div>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Payment Warning */}
        {userData.paymentDue && (
          <motion.div variants={itemVariants as any} className="mb-24">
            <Paper
              p={24}
              radius="24px"
              className="relative overflow-hidden bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-2 border-yellow-500/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full" />
              <Group justify="space-between" align="center">
                <Group gap={20}>
                  <div className="h-14 w-14 rounded-2xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30 animate-pulse">
                    <IconAlertCircle size={30} />
                  </div>
                  <div>
                    <Text className="text-white font-extrabold text-xl tracking-tight">
                      System Fee Overdue: PKR {userData.pendingPayment.toLocaleString("en-PK")}
                    </Text>
                    <Text className="text-gray-400 font-medium">
                      To maintain your priority status, please settle the
                      outstanding commission.
                    </Text>
                  </div>
                </Group>
                <Button
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-black px-8 h-12 rounded-xl border-b-4 border-yellow-800 transition-all hover:translate-y-[-2px] active:translate-y-[2px]"
                  rightSection={<IconArrowRight size={18} />}
                >
                  Clear Balance
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
              className="glass-dark border border-white/10 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-white/5">
                <IconMap2 size={200} />
              </div>

              <Group justify="space-between" mb={40} align="flex-end">
                <div>
                  <Title
                    order={3}
                    className="font-manrope font-black text-3xl text-white tracking-tight"
                  >
                    Active Job Radar
                  </Title>
                  <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                    Real-time rescue requests
                  </Text>
                </div>
                <Button
                  variant="subtle"
                  className="hover:bg-white/5 text-gray-400 font-bold rounded-xl"
                  leftSection={<IconMap2 size={18} />}
                >
                  Visual Mode
                </Button>
              </Group>

              {/* RADAR SEARCHING UI */}
              <Box className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[32px] border border-white/5 relative">
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

                <Text className="text-white font-black text-xl mb-1 tracking-tight">
                  Searching your area...
                </Text>
                <Text className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-10">
                  Beacon Active in 10KM Radius
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
                  Browse Job List
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

                <Group mb={40} justify="space-between">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <IconClock size={20} />
                  </div>
                  <Badge
                    variant="outline"
                    color="gray"
                    className="text-gray-500 border-gray-800"
                  >
                    1h 12m On Duty
                  </Badge>
                </Group>

                <Title
                  order={4}
                  className="font-manrope text-white font-black text-xl mb-2"
                >
                  Shift Insights
                </Title>
                <Text className="text-gray-500 font-medium text-sm mb-8">
                  No active assignments. Current ETA for new requests is{" "}
                  <span className="text-white font-bold">~4 mins</span> based on
                  demand.
                </Text>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Global Demand
                    </Text>
                    <Text className="text-xs font-black text-green-400">
                      HIGH
                    </Text>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Surge Bonus
                    </Text>
                    <Text className="text-xs font-black text-yellow-500">
                      ACTIVE
                    </Text>
                  </div>
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <Paper
                p={30}
                radius="32px"
                className="glass-dark border border-white/10 hover:border-orange-500/30 transition-all shadow-2xl cursor-pointer group"
              >
                <Group justify="space-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <IconSparkles size={24} />
                    </div>
                    <div>
                      <Text className="text-white font-bold">
                        Get Pro Perks
                      </Text>
                      <Text className="text-gray-500 text-xs font-medium">
                        Earn 5% more per job
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
            className="glass-dark border border-white/10 shadow-2xl"
          >
            <Group justify="space-between" mb={32}>
              <div>
                <Title
                  order={4}
                  className="font-manrope text-2xl font-black text-white tracking-tight"
                >
                  Financial History
                </Title>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                  Platform Settlements & Fees
                </Text>
              </div>
              <Button
                variant="outline"
                color="gray"
                className="border-white/10 text-gray-400 hover:bg-white/5 px-6 rounded-xl"
              >
                Export PDF
              </Button>
            </Group>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentHistory.map((payment, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-green-500/20 transition-all"
                >
                  <Group gap="xl">
                    <ThemeIcon
                      size={48}
                      radius="xl"
                      className="bg-green-500/10 text-green-400"
                    >
                      <IconTrendingUp size={24} />
                    </ThemeIcon>
                    <div>
                      <Text className="text-white font-black text-xl">
                        PKR {(payment.amount * 100).toLocaleString("en-PK")}
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
              ))}
            </div>
          </Paper>
        </motion.div>

        <div className="h-20" />
      </motion.div>
    </Box>
  );
};

export default HelperDashboard;
