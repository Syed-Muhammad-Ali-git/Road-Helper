"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  SimpleGrid,
  Paper,
  Text,
  Title,
  Group,
  ThemeIcon,
  Badge,
  Table,
  Button,
  Box,
  Avatar,
  ActionIcon,
  Stack,
} from "@mantine/core";
import {
  IconUsers,
  IconReceipt,
  IconAlertCircle,
  IconActivity,
  IconTrendingUp,
  IconPercentage,
  IconArrowRight,
  IconDownload,
  IconCrown,
  IconSparkles,
} from "@tabler/icons-react";
import { motion, type Variants } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/app/context/ThemeContext";
import {
  getAdminStats,
  subscribeToAdminRequests,
  getRevenueData,
} from "@/lib/services/adminService";
import { useLanguage } from "@/app/context/LanguageContext";
import type { RideRequestDoc } from "@/types";

import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";

const mapBg = "/assets/images/backgrounds/map-bg.svg";

const generateDefaultRevenueData = () => [
  { day: "Mon", total: 3200, platform: 640 },
  { day: "Tue", total: 2800, platform: 560 },
  { day: "Wed", total: 3500, platform: 700 },
  { day: "Thu", total: 4100, platform: 820 },
  { day: "Fri", total: 4600, platform: 920 },
  { day: "Sat", total: 3800, platform: 760 },
  { day: "Sun", total: 3000, platform: 600 },
];
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

interface AdminStatItem {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

interface RevenueDataPoint {
  day: string;
  total: number;
  platform: number;
}

interface AdminStatsData {
  totalUsers: number;
  activeHelpers: number;
  completedJobs: number;
  pendingRequests: number;
}

const AdminDashboard = () => {
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<AdminStatItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [recentRequests, setRecentRequests] = useState<RideRequestDoc[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStatsData | null>(null);

  const [profile, setProfile] = useState<{
    displayName: string;
    email: string;
  } | null>(null);

  // Load Firebase data
  useEffect(() => {
    let mounted = true;

    // Load current user profile
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user && mounted) {
        const p = await getUserByUid(user.uid);
        if (mounted) setProfile(p);
      }
    };
    loadProfile();

    // Load stats
    const loadStats = async () => {
      try {
        const statsData = await getAdminStats();
        if (!mounted) return;
        setAdminStats(statsData);
      } catch (error) {
        console.error("Error loading admin stats:", error);
      }
    };

    // Load revenue data
    const loadRevenueData = async () => {
      try {
        const data = await getRevenueData();
        if (!mounted) return;
        setRevenueData(data.length > 0 ? data : generateDefaultRevenueData());
      } catch (error) {
        console.error("Error loading revenue data:", error);
        setRevenueData(generateDefaultRevenueData());
      }
    };

    // Subscribe to requests
    const unsubscribe = subscribeToAdminRequests((requests) => {
      if (!mounted) return;
      setRecentRequests(requests.slice(0, 10));
    });

    loadStats();
    loadRevenueData();
    setIsLoaded(true);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Build stats array from Firebase data
  useEffect(() => {
    if (!adminStats) return;
    const builtStats: AdminStatItem[] = [
      {
        title: dict.admin.total_users,
        value: adminStats.totalUsers.toString(),
        subtitle: dict.admin.active_community,
        change: `+${Math.floor(adminStats.totalUsers * 0.084)}`,
        icon: IconUsers,
        color: "blue",
        gradient: "from-blue-600/20 to-indigo-600/20",
      },
      {
        title: dict.admin.active_helpers,
        value: adminStats.activeHelpers.toString(),
        subtitle: dict.admin.on_duty_now,
        change: `+${Math.floor(adminStats.activeHelpers * 0.076)}`,
        icon: IconActivity,
        color: "green",
        gradient: "from-emerald-600/20 to-teal-600/20",
      },
      {
        title: dict.admin.completed_jobs,
        value: adminStats.completedJobs.toString(),
        subtitle: dict.admin.total_success,
        change: `+${Math.floor(adminStats.completedJobs * 0.025)}`,
        icon: IconTrendingUp,
        color: "violet",
        gradient: "from-violet-600/20 to-purple-600/20",
      },
      {
        title: dict.admin.pending_help,
        value: adminStats.pendingRequests.toString(),
        subtitle: dict.admin.high_priority,
        change: `${adminStats.pendingRequests > 5 ? adminStats.pendingRequests - 5 : 0} critical`,
        icon: IconAlertCircle,
        color: "red",
        gradient: "from-red-600/20 to-rose-600/20",
      },
    ];
    setStats(builtStats);
  }, [adminStats, dict]);

  const [particles] = useState<
    Array<{ x: string; y_target: string; duration: number }>
  >(() =>
    [...Array(20)].map(() => ({
      x: `${Math.random() * 100}%`,
      y_target: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 10,
    })),
  );

  const totalCommission = useMemo(
    () =>
      recentRequests.reduce(
        (sum: number, r: RideRequestDoc) =>
          sum + ((r as any).amount || 0) * 0.2,
        0,
      ),
    [recentRequests],
  );
  const paidCommission = useMemo(
    () =>
      recentRequests
        .filter((r: RideRequestDoc) => (r as any).hasCommissionPaid)
        .reduce(
          (sum: number, r: RideRequestDoc) =>
            sum + ((r as any).amount || 0) * 0.2,
          0,
        ),
    [recentRequests],
  );
  const pendingCommission = useMemo(
    () => totalCommission - paidCommission,
    [totalCommission, paidCommission],
  );

  // Production-safe Tailwind color mapping
  const textColorMap = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    sky: "text-sky-500",
    blue: "text-blue-500",
    green: "text-emerald-500",
    violet: "text-violet-500",
    red: "text-brand-red",
  };

  const bgColorMap = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
  };

  const handleDownloadReport = useCallback(() => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,User,Type,Status,Helper,Amount\n" +
      recentRequests
        .map(
          (e) =>
            `${e.id},${e.user},${e.type},${e.status},${e.helper},${e.amount}`,
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [recentRequests]);

  // No changes needed here as they are moved out

  return (
    <Box
      className={cn(
        "relative min-h-screen overflow-hidden p-4 md:px-8 md:pt-0 md:pb-8 font-satoshi transition-colors",
        isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
      )}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-brand-red/15 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [0, -45, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-blue-600/10 blur-[130px] rounded-full"
        />

        {isLoaded &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              initial={{
                x: p.x,
                y: "100%",
              }}
              animate={{
                y: [null, p.y_target],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-full mx-auto"
      >
        {/* HEADER SECTION */}
        <Group justify="space-between" align="flex-end" mb={24}>
          <Box>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-2"
            >
              <IconCrown size={16} className="text-brand-red" />
              <Text className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">
                {dict.admin.central_intelligence}
              </Text>
            </motion.div>
            <Title
              order={1}
              className={cn(
                "font-manrope font-extrabold text-4xl md:text-5xl tracking-tight transition-colors",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              {profile
                ? `${dict.dashboard.welcome}, ${profile.displayName.split(" ")[0]}`
                : dict.admin.platform_dashboard}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">
                {dict.admin.dashboard}
              </span>
            </Title>
            <Text className="text-gray-400 mt-2 font-medium">
              {dict.admin.real_time_visualization}
            </Text>
          </Box>
          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              className={cn(
                "h-14 rounded-2xl px-8 transition-all font-bold shadow-2xl group border-2",
                isDark
                  ? "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50",
              )}
              leftSection={
                <IconDownload
                  size={20}
                  className="group-hover:translate-y-1 transition-transform"
                />
              }
              onClick={handleDownloadReport}
            >
              {dict.admin.export_analytics}
            </Button>
          </motion.div>
        </Group>

        {/* Stats Grid */}
        {stats.length > 0 && (
          <SimpleGrid cols={{ base: 1, md: 4 }} spacing={16} mb={24}>
            {stats.map((stat) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <Paper
                  p={24}
                  radius="24px"
                  className={cn(
                    "border relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 h-full shadow-xl",
                    isDark
                      ? "bg-white/5 border-white/5 shadow-white/5"
                      : "bg-white border-gray-200 shadow-gray-200/50",
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500",
                      stat.gradient,
                    )}
                  />

                  <Group justify="space-between" mb={16}>
                    <div
                      className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110",
                        isDark
                          ? "bg-white/5 border-white/5 shadow-inner"
                          : "bg-gray-50 border-gray-200",
                      )}
                    >
                      <stat.icon
                        size={24}
                        className={cn(
                          stat.color === "blue"
                            ? "text-blue-500"
                            : stat.color === "green"
                              ? "text-emerald-500"
                              : stat.color === "violet"
                                ? "text-violet-500"
                                : "text-brand-red",
                        )}
                      />
                    </div>
                    <Badge
                      variant="dot"
                      color="gray"
                      className="text-gray-500 border-none px-0"
                    >
                      {stat.subtitle}
                    </Badge>
                  </Group>

                  <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {stat.title}
                  </Text>
                  <Title
                    order={2}
                    className={cn(
                      "text-3xl font-black mb-2 transition-colors",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
                  </Title>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-500/20">
                      <IconTrendingUp size={12} />
                      {stat.change}
                    </div>
                    <Text className="text-[10px] font-bold text-gray-600">
                      {dict.admin.growth}
                    </Text>
                  </div>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>
        )}

        {/* Charts & Map Grid */}
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={24} mb={40}>
          {/* Revenue Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Paper
              p={32}
              radius="32px"
              className={cn(
                "border h-full flex flex-col relative overflow-hidden shadow-2xl",
                isDark
                  ? "bg-white/5 border-white/5"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "absolute top-0 right-0 p-10",
                  isDark ? "text-white/[0.02]" : "text-gray-900/[0.02]",
                )}
              >
                <IconReceipt size={240} />
              </div>

              <Group justify="space-between" mb={40} align="flex-end">
                <Box>
                  <Title
                    order={3}
                    className={cn(
                      "font-manrope text-2xl font-black tracking-tight",
                      isDark ? "text-white" : "text-gray-900",
                    )}
                  >
                    {dict.admin.financial_performance}
                  </Title>
                  <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                    {dict.admin.platform_revenue_analytics}
                  </Text>
                </Box>
              </Group>

              <Box
                className="h-[350px] mb-8 relative z-10 w-full"
                style={{ minHeight: 350 }}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="platform" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff05"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#ffffff20"
                      tick={{ fill: "#666", fontSize: 11, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dy={15}
                    />
                    <YAxis
                      stroke="#ffffff20"
                      tick={{ fill: "#666", fontSize: 11, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-15}
                      tickFormatter={(val) => `PKR ${val}`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#0f0f0f" : "#fff",
                        borderRadius: 16,
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.1)",
                        color: isDark ? "#fff" : "#000",
                        padding: 12,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                      itemStyle={{ fontWeight: 700 }}
                      cursor={{
                        stroke: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                        strokeWidth: 1,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ef4444"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#total)"
                      name={dict.admin.gross_value}
                    />
                    <Area
                      type="monotone"
                      dataKey="platform"
                      stroke="#10b981"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#platform)"
                      name={dict.admin.platform_share}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              <SimpleGrid
                cols={{ base: 1, sm: 3 }}
                spacing={16}
                className="mt-6"
              >
                {[
                  {
                    label: dict.admin.commission_paid,
                    value: `Rs ${paidCommission.toFixed(0)}`,
                    color: "emerald",
                    icon: IconPercentage,
                  },
                  {
                    label: dict.admin.fees_pending,
                    value: `Rs ${pendingCommission.toFixed(0)}`,
                    color: "amber",
                    icon: IconAlertCircle,
                  },
                  {
                    label: dict.admin.platform_growth,
                    value: "+24%",
                    color: "sky",
                    icon: IconActivity,
                  },
                ].map((item, idx) => (
                  <Paper
                    key={idx}
                    p={24}
                    radius="24px"
                    className={cn(
                      "border transition-colors group",
                      isDark
                        ? "bg-white/[0.03] border-white/[0.05] hover:border-white/10"
                        : "bg-gray-50 border-gray-100 hover:border-gray-200",
                    )}
                  >
                    <Group gap="sm" mb={12}>
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        className={cn(
                          isDark
                            ? "bg-white/5"
                            : "bg-white border border-gray-100",
                          textColorMap[item.color as keyof typeof textColorMap],
                        )}
                      >
                        <item.icon size={14} />
                      </ThemeIcon>
                      <Text className="text-gray-500 font-black uppercase text-[9px] tracking-widest">
                        {item.label}
                      </Text>
                    </Group>
                    <Text
                      className={cn(
                        "text-2xl font-black font-manrope",
                        isDark ? "text-white" : "text-gray-900",
                      )}
                    >
                      {item.value}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Paper>
          </motion.div>

          {/* Map Snapshot */}
          <motion.div variants={itemVariants}>
            <Paper
              p={32}
              radius="32px"
              className={cn(
                "border h-full relative overflow-hidden flex flex-col shadow-2xl",
                isDark
                  ? "glass-dark border-white/5"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="mb-8">
                <Title
                  order={3}
                  className={cn(
                    "font-manrope text-2xl font-black tracking-tight",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  {dict.admin.platform_health}
                </Title>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                  {dict.admin.system_reliability_index}
                </Text>
              </div>

              <Stack gap="xl">
                {[
                  {
                    label: dict.admin.active_jobs_density,
                    val: 85,
                    color: "blue",
                  },
                  {
                    label: dict.admin.helper_availability,
                    val: 42,
                    color: "emerald",
                  },
                  {
                    label: dict.admin.avg_service_time,
                    val: 28,
                    color: "amber",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <Group justify="space-between" mb={8}>
                      <Text
                        size="sm"
                        fw={700}
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {item.label}
                      </Text>
                      <Text size="sm" fw={900} color={item.color}>
                        {item.val}%
                      </Text>
                    </Group>
                    <div
                      className={cn(
                        "h-3 w-full rounded-full overflow-hidden",
                        isDark ? "bg-white/5" : "bg-gray-100",
                      )}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          item.color === "blue"
                            ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                            : item.color === "emerald"
                              ? "bg-emerald-500 shadow-[0_0_10px_#10b981]"
                              : "bg-amber-500 shadow-[0_0_10px_#f59e0b]",
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  fullWidth
                  radius="xl"
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "brand-red", to: "orange", deg: 90 }}
                  className="mt-8 font-black shadow-xl"
                  rightSection={<IconArrowRight size={18} />}
                  component={Link}
                  href="/admin/status"
                >
                  {dict.admin.detailed_diagnostics}
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Requests Table */}
        <motion.div variants={itemVariants}>
          <Paper
            p={32}
            radius="32px"
            className={cn(
              "border shadow-2xl relative overflow-hidden",
              isDark ? "glass-dark border-white/5" : "bg-white border-gray-200",
            )}
          >
            <div
              className={cn(
                "absolute top-0 left-0 p-10",
                isDark ? "text-white/[0.01]" : "text-gray-900/[0.01]",
              )}
            >
              <IconSparkles size={240} />
            </div>

            <Group justify="space-between" mb={40} align="flex-end">
              <div>
                <Title
                  order={3}
                  className={cn(
                    "font-manrope text-3xl font-black tracking-tight",
                    isDark ? "text-white" : "text-gray-900",
                  )}
                >
                  {dict.admin.recent_operations}
                </Title>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                  {dict.admin.job_fulfillment_registry}
                </Text>
              </div>
              <Button
                variant="subtle"
                color="gray"
                className={cn(
                  "font-black rounded-xl",
                  isDark
                    ? "hover:bg-white/5 text-gray-500"
                    : "hover:bg-gray-50 text-gray-600",
                )}
                component={Link}
                href="/admin/requests"
                rightSection={<IconArrowRight size={16} />}
              >
                {dict.admin.view_full_logs}
              </Button>
            </Group>

            <Box className="overflow-x-auto">
              <Table
                verticalSpacing="lg"
                horizontalSpacing="xl"
                className={cn(
                  "min-w-[1000px]",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                <Table.Thead className="bg-white/5 border-none">
                  <Table.Tr>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.user_profile}
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.category}
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.operation_status}
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.assigned_pro}
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none text-right">
                      {dict.admin.value_pkr}
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.fee_20}
                    </Table.Th>
                    <Table.Th className="border-none"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentRequests.map((req, index) => (
                    <Table.Tr
                      key={req.id}
                      className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.05]"
                    >
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            size="md"
                            radius="14px"
                            className="bg-blue-600/20 text-blue-400 font-black border border-blue-500/20"
                          >
                            {req.user[0]}
                          </Avatar>
                          <Text
                            fw={700}
                            className={cn(
                              "text-sm whitespace-nowrap",
                              isDark ? "text-white" : "text-gray-900",
                            )}
                          >
                            {req.user}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="outline"
                          color="gray"
                          className="text-gray-400 border-gray-800 font-black uppercase text-[9px]"
                        >
                          {req.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              req.status === "Completed"
                                ? "bg-green-500"
                                : req.status === "Pending"
                                  ? "bg-orange-500 shadow-[0_0_10px_#f97316]"
                                  : "bg-blue-500",
                            )}
                          />
                          <Text
                            size="xs"
                            fw={800}
                            className={cn(
                              "uppercase tracking-tighter",
                              req.status === "Completed"
                                ? "text-green-500"
                                : req.status === "Pending"
                                  ? "text-orange-500"
                                  : "text-blue-500",
                            )}
                          >
                            {req.status}
                          </Text>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" className="text-gray-400 font-bold">
                          {req.helper !== "-" ? req.helper : "ALLOCATING..."}
                        </Text>
                      </Table.Td>
                      <Table.Td className="text-right">
                        <Text
                          fw={900}
                          className="text-white text-md tracking-tighter"
                        >
                          Rs {req.amount.toLocaleString()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black",
                            req.hasCommissionPaid
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-brand-red/5 border-red-500/20 text-brand-red",
                          )}
                        >
                          <IconActivity size={10} />
                          {req.hasCommissionPaid
                            ? "FEE SECURED"
                            : "FEE PENDING"}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          radius="lg"
                          component={Link}
                          href={`/admin/requests/${req.id}`}
                        >
                          <IconArrowRight size={18} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard;
