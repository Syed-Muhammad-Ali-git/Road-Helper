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
import { getAdminStats, subscribeToAdminRequests, getRevenueData } from "@/lib/services/adminService";
import { useLanguage } from "@/app/context/LanguageContext";

const mapBg = "/assets/images/backgrounds/map-bg.svg";

const generateDefaultRevenueData = () => [
  { day: "Mon", total: 3200, platform: 640 },
  { day: "Tue", total: 2800, platform: 560 },
  { day: "Wed", total: 3500, platform: 700 },
  { day: "Thu", total: 4100, platform: 820 },
  { day: "Fri", total: 4600, platform: 920 },
  { day: "Sat", total: 3800, platform: 760 },
  { day: "Sun", total: 3000, platform: 600 },
]; const containerVariants: Variants = {
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

const AdminDashboard = () => {
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);

  // Load Firebase data
  useEffect(() => {
    let mounted = true;

    // Load stats
    const loadStats = async () => {
      try {
        const stats = await getAdminStats();
        if (!mounted) return;
        setAdminStats(stats);
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
    const builtStats = [
      {
        title: "Total Users",
        value: adminStats.totalUsers.toString(),
        subtitle: "Active Community",
        change: `+${Math.floor(adminStats.totalUsers * 0.084)}`,
        icon: IconUsers,
        color: "blue",
        gradient: "from-blue-600/20 to-indigo-600/20",
      },
      {
        title: "Active Helpers",
        value: adminStats.activeHelpers.toString(),
        subtitle: "On-Duty Now",
        change: `+${Math.floor(adminStats.activeHelpers * 0.076)}`,
        icon: IconActivity,
        color: "green",
        gradient: "from-emerald-600/20 to-teal-600/20",
      },
      {
        title: "Completed Jobs",
        value: adminStats.completedJobs.toString(),
        subtitle: "Total Success",
        change: `+${Math.floor(adminStats.completedJobs * 0.025)}`,
        icon: IconTrendingUp,
        color: "violet",
        gradient: "from-violet-600/20 to-purple-600/20",
      },
      {
        title: "Pending Help",
        value: adminStats.pendingRequests.toString(),
        subtitle: "High Priority",
        change: `${adminStats.pendingRequests > 5 ? adminStats.pendingRequests - 5 : 0} critical`,
        icon: IconAlertCircle,
        color: "red",
        gradient: "from-red-600/20 to-rose-600/20",
      },
    ];
    setStats(builtStats);
  }, [adminStats]);

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
    () => recentRequests.reduce((sum: number, r: any) => sum + (r.amount || 0) * 0.2, 0),
    [recentRequests],
  );
  const paidCommission = useMemo(
    () =>
      recentRequests
        .filter((r: any) => r.hasCommissionPaid)
        .reduce((sum: number, r: any) => sum + (r.amount || 0) * 0.2, 0),
    [recentRequests],
  );
  const pendingCommission = useMemo(
    () => totalCommission - paidCommission,
    [totalCommission, paidCommission],
  );

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
  }, []);

  // No changes needed here as they are moved out

  return (
    <Box
      className={cn(
        "relative min-h-screen overflow-hidden p-4 md:p-8 font-satoshi transition-colors",
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
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* HEADER SECTION */}
        <Group justify="space-between" mb={40} align="flex-end">
          <Box>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-2"
            >
              <IconCrown size={16} className="text-brand-red" />
              <Text className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px]">
                Central Intelligence
              </Text>
            </motion.div>
            <Title
              order={1}
              className="font-manrope font-extrabold text-4xl md:text-5xl text-white tracking-tight"
            >
              Platform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                Overview
              </span>
            </Title>
            <Text className="text-gray-400 mt-2 font-medium">
              Real-time data visualization and operational controls.
            </Text>
          </Box>
          <motion.div variants={itemVariants}>
            <Button
              variant="default"
              className="bg-white/5 text-white border-white/10 hover:bg-white/10 h-14 rounded-2xl px-8 transition-all font-bold shadow-2xl group"
              leftSection={
                <IconDownload
                  size={20}
                  className="group-hover:translate-y-1 transition-transform"
                />
              }
              onClick={handleDownloadReport}
            >
              Export Analytics
            </Button>
          </motion.div>
        </Group>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing={20} mb={40}>
          {stats.map((stat) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Paper
                p={30}
                radius="32px"
                className="glass-dark border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all duration-500 h-full shadow-xl"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500",
                    stat.gradient,
                  )}
                />

                <Group justify="space-between" mb={24}>
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 shadow-inner transition-transform group-hover:scale-110",
                    )}
                  >
                    <stat.icon
                      size={24}
                      className={cn(
                        stat.color === "blue"
                          ? "text-blue-400"
                          : stat.color === "green"
                            ? "text-emerald-400"
                            : stat.color === "violet"
                              ? "text-violet-400"
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
                  className="text-white text-4xl font-black mb-3"
                >
                  {stat.value}
                </Title>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-500/20">
                    <IconTrendingUp size={12} />
                    {stat.change}
                  </div>
                  <Text className="text-[10px] font-bold text-gray-600">
                    Growth
                  </Text>
                </div>
              </Paper>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* Charts & Map Grid */}
        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={24} mb={40}>
          {/* Revenue Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Paper
              p={40}
              radius="32px"
              className="glass-dark border border-white/5 h-full flex flex-col relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-10 text-white/[0.02]">
                <IconReceipt size={240} />
              </div>

              <Group justify="space-between" mb={40} align="flex-end">
                <Box>
                  <Title
                    order={3}
                    className="font-manrope text-2xl font-black text-white tracking-tight"
                  >
                    Financial Performance
                  </Title>
                  <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                    Platform Revenue Share Analytics
                  </Text>
                </Box>
              </Group>

              <Box className="h-[350px] mb-10 relative z-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
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
                        backgroundColor: "#0f0f0f",
                        borderRadius: 20,
                        border: "1px solid #ffffff10",
                        color: "white",
                        padding: 15,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                      }}
                      cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#ef4444"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#total)"
                      name="Gross Value"
                    />
                    <Area
                      type="monotone"
                      dataKey="platform"
                      stroke="#10b981"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#platform)"
                      name="20% Share"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              <SimpleGrid
                cols={{ base: 1, sm: 3 }}
                spacing={16}
                className="mt-auto"
              >
                {[
                  {
                    label: "Commission Paid",
                    value: `Rs ${paidCommission.toFixed(0)}`,
                    color: "emerald",
                    icon: IconPercentage,
                  },
                  {
                    label: "Fees Pending",
                    value: `Rs ${pendingCommission.toFixed(0)}`,
                    color: "amber",
                    icon: IconAlertCircle,
                  },
                  {
                    label: "Platform Growth",
                    value: "+24%",
                    color: "sky",
                    icon: IconActivity,
                  },
                ].map((item, idx) => (
                  <Paper
                    key={idx}
                    p={24}
                    radius="24px"
                    className="bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-colors group"
                  >
                    <Group gap="sm" mb={12}>
                      <ThemeIcon
                        size="sm"
                        radius="md"
                        className={cn("bg-white/5", `text-${item.color}-400`)}
                      >
                        <item.icon size={14} />
                      </ThemeIcon>
                      <Text className="text-gray-500 font-black uppercase text-[9px] tracking-widest">
                        {item.label}
                      </Text>
                    </Group>
                    <Text className="text-white text-2xl font-black font-manrope">
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
              radius="32px"
              className="glass-dark border border-white/5 h-full relative overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 relative z-10 bg-gradient-to-b from-[#0a0a0a] to-transparent">
                <Group justify="space-between">
                  <Box>
                    <Title
                      order={3}
                      className="font-manrope text-2xl font-black text-white tracking-tight"
                    >
                      Heat Map
                    </Title>
                    <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                      Global Traffic Density
                    </Text>
                  </Box>
                </Group>
              </div>

              <Box className="flex-1 relative bg-[#0f0f0f]">
                <div className="absolute inset-0 opacity-10 grayscale brightness-150">
                  <Image src={mapBg} alt="Map" fill className="object-cover" />
                </div>

                {/* Visual Markers */}
                <div className="absolute top-[40%] left-[30%] h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981] animate-ping" />
                <div className="absolute top-[60%] left-[50%] h-3 w-3 rounded-full bg-brand-red shadow-[0_0_15px_#ef4444] animate-pulse" />
                <div className="absolute top-[30%] left-[70%] h-5 w-5 rounded-full bg-amber-400 shadow-[0_0_25px_#fbbf24] animate-bounce" />

                <div className="absolute bottom-10 left-8 right-8 space-y-4">
                  <div className="p-6 glass-dark border border-white/20 rounded-[28px] backdrop-blur-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                        <IconActivity size={20} />
                      </div>
                      <div>
                        <Text className="text-white font-black text-sm uppercase">
                          Active Traffic
                        </Text>
                        <Text className="text-green-400 font-black text-xs">
                          STABLE LOAD
                        </Text>
                      </div>
                    </div>
                    <Button
                      fullWidth
                      radius="xl"
                      className="bg-brand-red hover:bg-brand-dark-red text-white font-black h-12 shadow-xl shadow-brand-red/20"
                      rightSection={<IconArrowRight size={18} />}
                    >
                      Live Tracking
                    </Button>
                  </div>
                </div>
              </Box>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Requests Table */}
        <motion.div variants={itemVariants}>
          <Paper
            p={40}
            radius="32px"
            className="glass-dark border border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 p-10 text-white/[0.01]">
              <IconSparkles size={240} />
            </div>

            <Group justify="space-between" mb={40} align="flex-end">
              <div>
                <Title
                  order={3}
                  className="font-manrope text-3xl font-black text-white tracking-tight"
                >
                  Recent Operations
                </Title>
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                  Job fulfillment registry
                </Text>
              </div>
              <Button
                variant="subtle"
                color="gray"
                className="hover:bg-white/5 text-gray-500 font-black rounded-xl"
                component={Link}
                href="/admin/requests"
                rightSection={<IconArrowRight size={16} />}
              >
                View Full Logs
              </Button>
            </Group>

            <Box className="overflow-x-auto">
              <Table
                verticalSpacing="lg"
                horizontalSpacing="xl"
                className="text-white min-w-[1000px]"
              >
                <Table.Thead className="bg-white/5 border-none">
                  <Table.Tr>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      User Profile
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Category
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Operation Status
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Assigned Pro
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none text-right">
                      Value (PKR)
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Fee (20%)
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
                          <Text fw={700} className="text-sm whitespace-nowrap">
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
