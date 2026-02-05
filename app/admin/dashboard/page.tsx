"use client";

import React from "react";
import {
  SimpleGrid,
  Paper,
  Text,
  Title,
  Group,
  ThemeIcon,
  Badge,
  Avatar,
  Table,
  Button,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconUsers,
  IconReceipt,
  IconAlertCircle,
  IconActivity,
  IconTrendingUp,
  IconPercentage,
  IconUserShield,
  IconMapPin,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
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
import mapBg from "../../../assets/images/backgrounds/map-bg.svg";

const stats = [
  {
    title: "Total Users",
    value: "3,240",
    subtitle: "Customers + Helpers",
    change: "+8.4% this week",
    icon: IconUsers,
    color: "blue",
  },
  {
    title: "Active Helpers",
    value: "158",
    subtitle: "Online now",
    change: "+12 new",
    icon: IconActivity,
    color: "green",
  },
  {
    title: "Completed Requests",
    value: "1,284",
    subtitle: "All time",
    change: "+32 today",
    icon: IconTrendingUp,
    color: "violet",
  },
  {
    title: "Pending Requests",
    value: "18",
    subtitle: "Need attention",
    change: "5 older than 30m",
    icon: IconAlertCircle,
    color: "orange",
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

export default function AdminDashboard() {
  const totalCommission = recentRequests.reduce(
    (sum, r) => sum + r.amount * 0.2,
    0,
  );
  const paidCommission = recentRequests
    .filter((r) => r.hasCommissionPaid)
    .reduce((sum, r) => sum + r.amount * 0.2, 0);
  const pendingCommission = totalCommission - paidCommission;

  return (
    <Box className="p-4 md:p-8 min-h-screen font-satoshi bg-brand-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Group justify="space-between" mb="xl" align="flex-end">
          <Box>
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">
              Control Center
            </Text>
            <Title className="font-manrope text-3xl md:text-4xl font-bold text-white">
              Admin Dashboard
            </Title>
            <Text className="text-gray-400 mt-1">
              Live overview of users, helpers, requests & 20% platform fee.
            </Text>
          </Box>
          <Group gap="sm">
            <Button
              variant="default"
              className="bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
            >
              Download Report
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="lg" mb="xl">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Paper
                p="xl"
                radius="xl"
                className="glass-dark border border-white/10 h-full relative overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-red/10 blur-3xl rounded-full" />
                <Group justify="space-between" mb="sm">
                  <ThemeIcon
                    size="lg"
                    radius="xl"
                    variant="light"
                    color={stat.color}
                    className="bg-white/5 text-white"
                  >
                    <stat.icon size={20} />
                  </ThemeIcon>
                  <Badge
                    size="xs"
                    variant="light"
                    className="bg-white/5 text-gray-300 border-white/10"
                  >
                    {stat.subtitle}
                  </Badge>
                </Group>
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  className="text-gray-400 tracking-wide mb-1"
                >
                  {stat.title}
                </Text>
                <Title order={2} className="font-manrope text-white mb-1">
                  {stat.value}
                </Title>
                <Group gap={6}>
                  <IconTrendingUp size={14} className="text-emerald-400" />
                  <Text size="xs" className="text-emerald-300">
                    {stat.change}
                  </Text>
                </Group>
              </Paper>
            </motion.div>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="xl" mb="xl">
          <Paper
            p="xl"
            radius="xl"
            className="glass-dark border border-white/10 lg:col-span-2 h-full flex flex-col"
          >
            <Group justify="space-between" mb="lg">
              <Group gap="xs">
                <ThemeIcon
                  size="lg"
                  radius="xl"
                  className="bg-brand-red/20 text-brand-red"
                >
                  <IconReceipt size={20} />
                </ThemeIcon>
                <Box>
                  <Title
                    order={3}
                    className="font-manrope text-lg md:text-xl text-white"
                  >
                    Revenue & 20% Platform Share
                  </Title>
                  <Text size="xs" className="text-gray-400">
                    Track how much customers paid and how much 20% commission is
                    received vs pending.
                  </Text>
                </Box>
              </Group>
            </Group>

            <Box className="h-64 md:h-72 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="platform" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis dataKey="day" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderRadius: 12,
                      border: "1px solid #27272a",
                      color: "white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#total)"
                    name="Total Paid by Customers"
                  />
                  <Area
                    type="monotone"
                    dataKey="platform"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#platform)"
                    name="20% Platform Share"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <Paper
                p="md"
                radius="lg"
                className="bg-white/5 border border-emerald-500/30"
              >
                <Group gap="xs">
                  <ThemeIcon
                    size="md"
                    radius="xl"
                    className="bg-emerald-500/20 text-emerald-300"
                  >
                    <IconPercentage size={16} />
                  </ThemeIcon>
                  <Text size="xs" className="text-gray-300 uppercase">
                    20% Given
                  </Text>
                </Group>
                <Text className="text-emerald-300 text-xl font-semibold mt-1">
                  Rs {paidCommission.toFixed(0)}
                </Text>
              </Paper>

              <Paper
                p="md"
                radius="lg"
                className="bg-white/5 border border-amber-500/30"
              >
                <Group gap="xs">
                  <ThemeIcon
                    size="md"
                    radius="xl"
                    className="bg-amber-500/20 text-amber-300"
                  >
                    <IconAlertCircle size={16} />
                  </ThemeIcon>
                  <Text size="xs" className="text-gray-300 uppercase">
                    20% Pending
                  </Text>
                </Group>
                <Text className="text-amber-300 text-xl font-semibold mt-1">
                  Rs {pendingCommission.toFixed(0)}
                </Text>
              </Paper>

              <Paper
                p="md"
                radius="lg"
                className="bg-white/5 border border-sky-500/30"
              >
                <Group gap="xs">
                  <ThemeIcon
                    size="md"
                    radius="xl"
                    className="bg-sky-500/20 text-sky-300"
                  >
                    <IconUserShield size={16} />
                  </ThemeIcon>
                  <Text size="xs" className="text-gray-300 uppercase">
                    Active Customers
                  </Text>
                </Group>
                <Text className="text-sky-300 text-xl font-semibold mt-1">
                  1,024
                </Text>
              </Paper>
            </SimpleGrid>
          </Paper>

          <Paper
            p="xl"
            radius="xl"
            className="glass-dark border border-white/10 h-full relative overflow-hidden"
          >
            <Group justify="space-between" mb="md">
              <Group gap="xs">
                <ThemeIcon
                  size="lg"
                  radius="xl"
                  className="bg-white/5 text-white"
                >
                  <IconMapPin size={20} />
                </ThemeIcon>
                <Box>
                  <Title
                    order={3}
                    className="font-manrope text-lg text-white mb-0"
                  >
                    Live Map Snapshot
                  </Title>
                  <Text size="xs" className="text-gray-400">
                    Approximate helper & request density
                  </Text>
                </Box>
              </Group>
            </Group>
            <div className="h-64 rounded-2xl flex items-center justify-center relative overflow-hidden bg-brand-charcoal">
              <Image
                src={mapBg}
                alt="Map Overview"
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-emerald-500/40 rounded-full blur-xl" />
                <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-red-500/40 rounded-full blur-xl" />
                <div className="absolute top-1/2 right-1/4 w-5 h-5 bg-yellow-400/40 rounded-full blur-xl" />
              </div>
              <Group
                gap="xs"
                className="relative z-10 text-gray-100 bg-black/40 px-3 py-1.5 rounded-full border border-white/10"
              >
                <IconMapPin size={18} />
                <Text size="xs">Live tracking abstract view</Text>
              </Group>
            </div>
            <Button
              fullWidth
              mt="md"
              variant="light"
              color="gray"
              className="bg-white/5 text-gray-100 border-white/10 hover:bg-white/10"
            >
              Open Detailed Map
            </Button>
          </Paper>
        </SimpleGrid>

        <Paper
          p="xl"
          radius="xl"
          className="glass-dark border border-white/10 mt-6"
        >
          <Group justify="space-between" mb="lg">
            <Box>
              <Title order={3} className="font-manrope text-lg text-white">
                Recent Requests & 20% Status
              </Title>
              <Text size="xs" className="text-gray-400">
                See which jobs are completed, pending, and who has paid the
                platform fee.
              </Text>
            </Box>
          </Group>
          <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Helper</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>20% Platform Fee</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {recentRequests.map((req) => (
                <Table.Tr key={req.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" radius="xl" color="blue">
                        {req.user[0]}
                      </Avatar>
                      <Box>
                        <Text size="sm" fw={500}>
                          {req.user}
                        </Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td>{req.type}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        req.status === "Completed"
                          ? "green"
                          : req.status === "Pending"
                            ? "orange"
                            : "blue"
                      }
                      variant="light"
                    >
                      {req.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{req.helper}</Table.Td>
                  <Table.Td>
                    <Text size="sm" className="text-gray-200">
                      Rs {req.amount.toLocaleString()}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon
                        size="sm"
                        radius="xl"
                        className={
                          req.hasCommissionPaid
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }
                      >
                        <IconPercentage size={14} />
                      </ThemeIcon>
                      <Tooltip
                        label={
                          req.hasCommissionPaid
                            ? "20% received by platform"
                            : "20% still pending from helper"
                        }
                      >
                        <Text
                          size="xs"
                          className={
                            req.hasCommissionPaid
                              ? "text-emerald-300"
                              : "text-amber-300"
                          }
                        >
                          {req.hasCommissionPaid ? "Paid" : "Pending"}
                        </Text>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="subtle" color="gray">
                      View Details
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </motion.div>
    </Box>
  );
}
