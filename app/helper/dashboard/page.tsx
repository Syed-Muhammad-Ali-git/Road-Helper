"use client";

import React, { useState } from "react";
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
  RingProgress,
  ActionIcon,
  Avatar,
  Card,
  Progress,
} from "@mantine/core";
import {
  IconCash,
  IconChecklist,
  IconClock,
  IconStar,
  IconBriefcase,
  IconMapPin,
  IconNavigation,
  IconPhone,
  IconBrandWhatsapp,
  IconAlertCircle,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HelperDashboardUI() {
  const [isOnline, setIsOnline] = useState(true);

  // Static/hardcoded data for UI
  const userData = {
    fullName: "Ali Khan",
    totalJobs: 12,
    rating: 4.9,
    todaysEarnings: 150,
    pendingPayment: 30, // 20% platform fee
    paymentDue: true,
    lastPaymentDate: "2026-01-25",
  };

  const paymentHistory = [
    { date: "2026-01-25", amount: 25, status: "paid" },
    { date: "2026-01-20", amount: 40, status: "paid" },
    { date: "2026-01-15", amount: 35, status: "paid" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box className="p-4 md:p-8 min-h-screen font-satoshi bg-transparent">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Group justify="space-between" mb="xl" align="center">
          <Box>
            <Text className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">
              WORKSTATION
            </Text>
            <Title
              order={1}
              className="font-manrope text-3xl font-bold text-white"
            >
              Welcome back, {userData.fullName.split(" ")[0]}
            </Title>
          </Box>
          <Paper
            p="xs"
            radius="xl"
            className="glass-dark border border-white/10 flex items-center gap-3 pr-4"
          >
            <Switch
              size="lg"
              onLabel="ON"
              offLabel="OFF"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.currentTarget.checked)}
              color="green"
              classNames={{ track: "cursor-pointer" }}
            />
            <Text
              size="sm"
              fw={700}
              c={isOnline ? "green" : "dimmed"}
              className="text-white"
            >
              {isOnline ? "You are Online" : "You are Offline"}
            </Text>
          </Paper>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 4 }} spacing="md" mb="xl">
          {/* Earnings Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Paper
              p="xl"
              radius="xl"
              className="bg-gradient-to-br from-brand-red to-brand-dark-red text-white relative overflow-hidden shadow-xl h-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <IconCash size={80} />
              </div>
              <Text className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
                Today's Earnings
              </Text>
              <Title order={1} className="font-manrope text-4xl mb-4">
                ${userData.todaysEarnings}
              </Title>
              <Group gap="xs" mb="lg">
                <Badge
                  color="green"
                  variant="light"
                  className="bg-green-500/20 text-green-300 border border-green-500/30"
                >
                  +12% vs yesterday
                </Badge>
              </Group>
              <Text className="text-xs text-white/90 font-medium bg-white/10 py-1.5 px-3 rounded-lg inline-block">
                20% Platform Fee Applied
              </Text>
            </Paper>
          </motion.div>

          {/* Other Stats */}
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="xl"
              className="glass-dark border border-white/10 h-full flex flex-col justify-between"
            >
              <ThemeIcon
                size={48}
                radius="xl"
                className="bg-blue-500/10 text-blue-400 mb-2"
              >
                <IconChecklist size={24} />
              </ThemeIcon>
              <div>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Jobs Done
                </Text>
                <Title order={2} className="text-white">
                  {userData.totalJobs}
                </Title>
              </div>
            </Paper>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="xl"
              className="glass-dark border border-white/10 h-full flex flex-col justify-between"
            >
              <ThemeIcon
                size={48}
                radius="xl"
                className="bg-yellow-500/10 text-yellow-400 mb-2"
              >
                <IconStar size={24} />
              </ThemeIcon>
              <div>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Rating
                </Text>
                <Title order={2} className="text-white">
                  {userData.rating}
                </Title>
              </div>
            </Paper>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="xl"
              className="glass-dark border border-white/10 h-full flex flex-col justify-between"
            >
              <ThemeIcon
                size={48}
                radius="xl"
                className="bg-orange-500/10 text-orange-400 mb-2"
              >
                <IconClock size={24} />
              </ThemeIcon>
              <div>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Active Hours
                </Text>
                <Title order={2} className="text-white">
                  5h 20m
                </Title>
              </div>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Payment Alert Card */}
        {userData.paymentDue && (
          <motion.div variants={itemVariants} className="mb-xl">
            <Paper
              p="lg"
              radius="xl"
              className="glass-dark border-2 border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
            >
              <Group justify="space-between" align="center">
                <Group>
                  <ThemeIcon
                    size={48}
                    radius="xl"
                    className="bg-yellow-500/20 text-yellow-400"
                  >
                    <IconAlertCircle size={24} />
                  </ThemeIcon>
                  <div>
                    <Text className="text-white font-bold text-lg">
                      Payment Due: ${userData.pendingPayment}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Pay within 24 hours to continue accepting requests
                    </Text>
                  </div>
                </Group>
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                  radius="xl"
                  size="md"
                  leftSection={<IconWallet size={18} />}
                >
                  Pay Now
                </Button>
              </Group>
            </Paper>
          </motion.div>
        )}

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="xl" mb="xl">
          {/* Active Job / Incoming Requests */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Paper
              p="xl"
              radius="xl"
              className="glass-dark border border-white/10 h-full"
            >
              <Group justify="space-between" mb="xl">
                <Title order={3} className="font-manrope font-bold text-white">
                  Nearby Requests
                </Title>
                <Button
                  variant="subtle"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/5"
                >
                  View Map
                </Button>
              </Group>

              {/* Placeholder for no requests */}
              <Box className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-brand-red/20 blur-xl rounded-full animate-pulse"></div>
                  <ThemeIcon
                    size={80}
                    radius="full"
                    className="bg-brand-charcoal text-brand-red shadow-lg relative z-10 border border-white/10"
                  >
                    <IconBriefcase size={40} />
                  </ThemeIcon>
                </div>
                <Text fw={600} size="lg" className="text-white">
                  Searching for requests...
                </Text>
                <Text c="dimmed" size="sm" mb="xl" className="text-gray-400">
                  Stay online to receive job alerts nearby.
                </Text>

                <Button
                  className="bg-brand-red hover:bg-brand-dark-red text-white"
                  size="md"
                  radius="xl"
                  component={Link}
                  href="/helper/requests"
                >
                  Browse Manual List
                </Button>
              </Box>
            </Paper>
          </motion.div>

          {/* Active Job Widget */}
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="xl"
              className="bg-gradient-to-br from-brand-charcoal to-brand-black text-white h-full relative overflow-hidden border border-white/10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 blur-3xl rounded-full"></div>

              <Title order={4} className="font-manrope mb-6 text-white/90">
                Current Status
              </Title>

              <div className="text-center py-10">
                <ThemeIcon
                  variant="outline"
                  color="gray"
                  size={60}
                  radius="full"
                  className="border-white/20 text-white/50 mb-4"
                >
                  <IconNavigation size={30} />
                </ThemeIcon>
                <Text className="text-white font-bold">No Active Job</Text>
                <Text className="text-white/50 text-sm mt-1">
                  You are ready to accept new work.
                </Text>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <Group justify="space-between">
                  <Text size="xs" className="text-white/50">
                    Shift Started
                  </Text>
                  <Text size="xs" className="text-white font-bold">
                    09:00 AM
                  </Text>
                </Group>
              </div>
            </Paper>
          </motion.div>
        </SimpleGrid>

        {/* Payment History */}
        <motion.div variants={itemVariants}>
          <Paper
            p="xl"
            radius="xl"
            className="glass-dark border border-white/10"
          >
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={4} className="font-manrope text-white mb-1">
                  Payment History
                </Title>
                <Text className="text-gray-400 text-sm">
                  Track your platform fee payments
                </Text>
              </div>
              <Button
                variant="subtle"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                View All
              </Button>
            </Group>

            <Stack gap="md">
              {paymentHistory.map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg glass hover:bg-white/5 transition-all border border-white/5"
                >
                  <Group>
                    <ThemeIcon
                      size={40}
                      radius="xl"
                      className="bg-green-500/10 text-green-400"
                    >
                      <IconTrendingUp size={20} />
                    </ThemeIcon>
                    <div>
                      <Text className="text-white font-semibold">
                        ${payment.amount}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {payment.date}
                      </Text>
                    </div>
                  </Group>
                  <Badge
                    color="green"
                    variant="light"
                    className="bg-green-500/10 text-green-400 border border-green-500/20"
                  >
                    Paid
                  </Badge>
                </div>
              ))}
            </Stack>
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
}
