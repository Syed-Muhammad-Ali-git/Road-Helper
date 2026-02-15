"use client";

import React, { useMemo, memo } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  PasswordInput,
  Badge,
  ThemeIcon,
  Table,
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
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";
import { SimpleGrid } from "@mantine/core";

const mapBg = "/assets/images/backgrounds/map-bg.svg";

const stats = [
  {
    title: "Total Users",
    value: "3,240",
    subtitle: "Active Community",
    change: "+8.4%",
    icon: IconUsers,
    color: "blue",
    gradient: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: "Active Helpers",
    value: "158",
    subtitle: "On-Duty Now",
    change: "+12",
    icon: IconActivity,
    color: "green",
    gradient: "from-emerald-600/20 to-teal-600/20",
  },
  {
    title: "Completed Jobs",
    value: "1,284",
    subtitle: "Total Success",
    change: "+32",
    icon: IconTrendingUp,
    color: "violet",
    gradient: "from-violet-600/20 to-purple-600/20",
  },
  {
    title: "Pending Help",
    value: "18",
    subtitle: "High Priority",
    change: "5 critical",
    icon: IconAlertCircle,
    color: "red",
    gradient: "from-red-600/20 to-rose-600/20",
  },
];

const revenueData = [
  { day: "Mon", total: 3200, platform: 640 },
  { day: "Tue", total: 2800, platform: 560 },
  { day: "Wed", total: 3500, platform: 700 },
  { day: "Thu", total: 4100, platform: 820 },
  { day: "Fri", total: 4600, platform: 920 },
  { day: "Sat", total: 3800, platform: 760 },
  { day: "Sun", total: 3000, platform: 600 },
  { day: "Mon", total: 3800, platform: 760 },
];

const recentRequests = [
  {
    id: 1,
    user: "Ali Raza",
    type: "Towing",
    status: "In Progress",
    helper: "Ahmed K.",
    amount: 4500,
    hasCommissionPaid: true,
  },
  {
    id: 2,
    user: "Sara Ahmed",
    type: "Flat Tire",
    status: "Pending",
    helper: "-",
    amount: 1200,
    hasCommissionPaid: false,
  },
  {
    id: 3,
    user: "Usman Ali",
    type: "Fuel Delivery",
    status: "Completed",
    helper: "Bilal H.",
    amount: 2200,
    hasCommissionPaid: true,
  },
  {
    id: 4,
    user: "John Doe",
    type: "Car Mechanic",
    status: "Completed",
    helper: "Mike T.",
    amount: 3100,
    hasCommissionPaid: false,
  },
];

const OverviewTab = () => {
  const { dict } = useLanguage();
  const { isDark } = useAppTheme();

  const totalCommission = useMemo(
    () => recentRequests.reduce((sum, r) => sum + r.amount * 0.2, 0),
    [],
  );
  const paidCommission = useMemo(
    () =>
      recentRequests
        .filter((r) => r.hasCommissionPaid)
        .reduce((sum, r) => sum + r.amount * 0.2, 0),
    [],
  );
  const pendingCommission = useMemo(
    () => totalCommission - paidCommission,
    [totalCommission, paidCommission],
  );

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, md: 4 }} spacing={20} mb={40}>
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
            p={32}
            radius="32px"
            className={cn(
              "border h-full flex flex-col relative overflow-hidden shadow-2xl",
              isDark ? "bg-white/5 border-white/5" : "bg-white border-gray-200",
            )}
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

            <Box
              className="h-[350px] mb-8 relative z-10 w-full"
              style={{ minHeight: 350 }}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="total-tab" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="platform-tab"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    tickFormatter={(val) => `$${val}`}
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
                    fill="url(#total-tab)"
                    name="Gross Value"
                  />
                  <Area
                    type="monotone"
                    dataKey="platform"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#platform-tab)"
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
                      className={cn(
                        "bg-white/5",
                        item.color === "emerald"
                          ? "text-emerald-400"
                          : item.color === "blue"
                            ? "text-blue-400"
                            : "text-amber-400",
                      )}
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
            className={cn(
              "border h-full relative overflow-hidden flex flex-col shadow-2xl",
              isDark ? "bg-white/5 border-white/5" : "bg-white border-gray-200",
            )}
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
                {recentRequests.map((req) => (
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
                        <Text fw={700} className="text-sm">
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
                        {req.hasCommissionPaid ? "FEE SECURED" : "FEE PENDING"}
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
  );
};

export default memo(OverviewTab);
