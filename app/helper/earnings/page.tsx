"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Group,
  SimpleGrid,
  ThemeIcon,
  Table,
  Badge,
  ScrollArea,
  Loader,
  Center,
  ActionIcon,
} from "@mantine/core";
import {
  IconWallet,
  IconTrendingUp,
  IconChecklist,
  IconClock,
  IconReceipt,
  IconDownload,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { auth } from "@/lib/firebase/config";
import {
  subscribeToHelperEarnings,
  formatPKR,
  getHelperEarningsStats,
} from "@/lib/services/earningsService";
import type { EarningRecord } from "@/lib/services/earningsService";

export default function EarningsPage() {
  const { isDark } = useAppTheme();
  const { dict, isRTL } = useLanguage();
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingAmount: 0,
    paidAmount: 0,
    totalJobs: 0,
    averageEarningPerJob: 0,
  });
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUid(u?.uid ?? null);
    });
    return () => unsub();
  }, []);

  // Subscribe to earnings real-time updates
  useEffect(() => {
    if (!uid) return;
    setIsLoading(true);
    const unsub = subscribeToHelperEarnings(uid, (data) => {
      setEarnings(data);
      setIsLoading(false);
    });
    return () => unsub();
  }, [uid]);

  // Load stats
  useEffect(() => {
    if (!uid) return;
    getHelperEarningsStats(uid).then(setStats);
  }, [uid, earnings]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <Box
      className={cn(
        "relative min-h-screen p-4 md:p-8 transition-colors duration-300",
        isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-green-600/15 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Title
            order={1}
            className={cn(
              "text-3xl md:text-4xl font-black",
              isDark ? "text-white" : "text-gray-900",
            )}
          >
            {dict.earnings_page.title}
          </Title>
          <Text c="dimmed" size="lg" mt="xs">
            {dict.earnings_page.subtitle}
          </Text>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div variants={itemVariants}>
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
            {/* Total Earned */}
            <Paper
              p="xl"
              radius="xl"
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                isDark
                  ? "bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200",
              )}
            >
              <Group justify="space-between" mb="md">
                <ThemeIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="green"
                  className="group-hover:scale-110 transition-transform"
                >
                  <IconWallet size={20} />
                </ThemeIcon>
                <Badge variant="light" color="green">
                  {dict.earnings_page.total_earned}
                </Badge>
              </Group>
              <Title
                order={2}
                className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-green-300" : "text-green-600",
                )}
              >
                {formatPKR(stats.totalEarned)}
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {dict.earnings_page.lifetime_earnings}
              </Text>
            </Paper>

            {/* Pending */}
            <Paper
              p="xl"
              radius="xl"
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                isDark
                  ? "bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border border-yellow-700/30"
                  : "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200",
              )}
            >
              <Group justify="space-between" mb="md">
                <ThemeIcon size="lg" radius="xl" variant="light" color="yellow">
                  <IconClock size={20} />
                </ThemeIcon>
                <Badge variant="light" color="yellow">
                  {dict.earnings_page.payout_status_pending}
                </Badge>
              </Group>
              <Title
                order={2}
                className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-yellow-300" : "text-yellow-600",
                )}
              >
                {formatPKR(stats.pendingAmount)}
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {dict.earnings_page.payout_status_pending}
              </Text>
            </Paper>

            {/* Paid */}
            <Paper
              p="xl"
              radius="xl"
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                isDark
                  ? "bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30"
                  : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200",
              )}
            >
              <Group justify="space-between" mb="md">
                <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                  <IconChecklist size={20} />
                </ThemeIcon>
                <Badge variant="light" color="blue">
                  {dict.earnings_page.payout_status_paid}
                </Badge>
              </Group>
              <Title
                order={2}
                className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-blue-300" : "text-blue-600",
                )}
              >
                {formatPKR(stats.paidAmount)}
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {dict.earnings_page.payout_status_paid}
              </Text>
            </Paper>

            {/* Average per Job */}
            <Paper
              p="xl"
              radius="xl"
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-lg",
                isDark
                  ? "bg-gradient-to-br from-purple-900/40 to-pink-800/20 border border-purple-700/30"
                  : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200",
              )}
            >
              <Group justify="space-between" mb="md">
                <ThemeIcon size="lg" radius="xl" variant="light" color="grape">
                  <IconTrendingUp size={20} />
                </ThemeIcon>
                <Badge variant="light" color="grape">
                  {dict.earnings_page.average_per_job}
                </Badge>
              </Group>
              <Title
                order={2}
                className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-purple-300" : "text-purple-600",
                )}
              >
                {formatPKR(stats.averageEarningPerJob)}
              </Title>
              <Text size="sm" c="dimmed" mt="xs">
                {dict.earnings_page.average_per_job} ({stats.totalJobs})
              </Text>
            </Paper>
          </SimpleGrid>
        </motion.div>

        {/* Earnings Table */}
        <motion.div variants={itemVariants}>
          <Paper
            p="lg"
            radius="xl"
            className={cn(
              "border transition-all",
              isDark
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200",
            )}
          >
            <Group justify="space-between" mb="lg">
              <Title
                order={3}
                size="lg"
                className={isDark ? "text-white" : "text-gray-900"}
              >
                {dict.earnings_page.recent_earnings}
              </Title>
              {earnings.length > 0 && (
                <ActionIcon variant="light" size="lg">
                  <IconDownload size={18} />
                </ActionIcon>
              )}
            </Group>

            {isLoading ? (
              <Center py="xl">
                <Loader />
              </Center>
            ) : earnings.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">{dict.earnings_page.no_earnings_yet}</Text>
              </Center>
            ) : (
              <ScrollArea>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr className={isDark ? "bg-gray-800" : "bg-gray-50"}>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_service}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_customer}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_amount}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_commission}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_your_earning}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_status}
                      </Table.Th>
                      <Table.Th
                        className={isDark ? "text-gray-300" : "text-gray-700"}
                      >
                        {dict.earnings_page.table_date}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {earnings.map((earning) => (
                      <Table.Tr
                        key={earning.id}
                        className={
                          isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }
                      >
                        <Table.Td className="font-medium">
                          {earning.serviceType}
                        </Table.Td>
                        <Table.Td>{earning.customerName}</Table.Td>
                        <Table.Td className="font-semibold">
                          {formatPKR(earning.amount)}
                        </Table.Td>
                        <Table.Td
                          className={isDark ? "text-red-400" : "text-red-600"}
                        >
                          {formatPKR(earning.platformFee)}
                        </Table.Td>
                        <Table.Td
                          className={
                            isDark ? "text-green-400" : "text-green-600"
                          }
                        >
                          <strong>{formatPKR(earning.helperEarning)}</strong>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={
                              earning.status === "paid" ? "green" : "yellow"
                            }
                            variant="light"
                          >
                            {earning.status === "paid"
                              ? dict.earnings_page.payout_status_paid
                              : dict.earnings_page.payout_status_pending}
                          </Badge>
                        </Table.Td>
                        <Table.Td c="dimmed">
                          {new Date(earning.createdAt).toLocaleDateString(
                            isRTL ? "ur-PK" : "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>
            )}
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
}
