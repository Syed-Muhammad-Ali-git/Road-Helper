"use client";

import React, { useState, useMemo, memo, useCallback, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Box,
  Tabs,
  Avatar,
  ScrollArea,
  Button,
} from "@mantine/core";
import { Menu } from "@mantine/core"; // Explicitly import Menu
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  IconEye,
  IconMapPin,
  IconCalendar,
  IconDownload,
  IconFileText,
  IconTruck,
  IconChecks,
  IconAlertCircle,
  IconClock,
  IconArrowRight,
  IconReceipt2,
  IconUser,
  IconSearch,
} from "@tabler/icons-react";
import { showSuccess } from "@/lib/sweetalert";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { subscribeAllRequests } from "@/lib/services/requestService";
import type { RideRequestDoc } from "@/types";

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<
    Array<{ id: string } & RideRequestDoc>
  >([]);
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();

  useEffect(() => {
    const unsub = subscribeAllRequests({
      cb: setRequests,
    });
    return () => unsub();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && req.status === "pending") ||
        (activeTab === "inprogress" &&
          (req.status === "accepted" || req.status === "in_progress")) ||
        (activeTab === "completed" && req.status === "completed");

      const matchesSearch =
        (req.customerName ?? "")
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        req.id.toLowerCase().includes(search.toLowerCase()) ||
        (req.serviceType ?? "")
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, requests]);

  const handleDownloadReport = useCallback(async () => {
    const headers = [
      "ID",
      "User",
      "Service",
      "Location",
      "Status",
      "Amount",
      "Time",
    ];
    const rows = filteredRequests.map((req) => {
      const loc = req.location;
      const locLabel =
        loc?.address ??
        (loc?.lat && loc?.lng ? `${loc.lat},${loc.lng}` : "Unknown");
      return [
        req.id,
        req.customerName ?? "",
        req.serviceType ?? "",
        locLabel,
        req.status,
        req.amount ?? "",
        req.createdAt instanceof Date ? req.createdAt.toISOString() : "",
      ].join(",");
    });
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `fleet_ops_${activeTab}_${new Date().getTime()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await showSuccess(
      "Export Complete",
      "Operational log exported successfully.",
    );
  }, [filteredRequests, activeTab]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box
      className={cn(
        "relative min-h-screen overflow-hidden p-4 md:px-8 md:pt-0 md:pb-8 font-satoshi transition-colors",
        isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -right-[5%] w-[50%] h-[50%] bg-brand-red/10 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.3, 1, 1.3], opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[5%] left-[0%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-full mx-auto"
      >
        {/* Header */}
        <Group justify="space-between" mb={32} align="flex-end">
          <Box>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-2"
            >
              <IconTruck size={16} className="text-brand-red" />
              <Text className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px]">
                {dict.admin.fleet_operations}
              </Text>
            </motion.div>
            <Title
              order={1}
              className={cn(
                "font-manrope font-black text-4xl md:text-5xl tracking-tight transition-colors",
                isDark ? "text-white" : "text-gray-900",
              )}
            >
              {dict.admin.service_logistics.split(" ")[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">
                {dict.admin.service_logistics.split(" ").length > 1
                  ? dict.admin.service_logistics.split(" ").slice(1).join(" ")
                  : ""}
              </span>
            </Title>
            <Text className="text-gray-500 mt-2 font-bold uppercase tracking-tight text-xs">
              {dict.admin.deployment_monitoring}
            </Text>
          </Box>
          <motion.div variants={itemVariants}>
            <Button
              className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl px-8 transition-all font-black shadow-2xl shadow-brand-red/20 group border-none"
              leftSection={
                <IconDownload
                  size={20}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              }
              onClick={handleDownloadReport}
            >
              {dict.admin.export_intelligence}
            </Button>
          </motion.div>
        </Group>

        {/* Filters and Search */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          <Paper
            p={12}
            radius="24px"
            className={cn(
              "lg:col-span-8 border flex items-center shadow-xl",
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200",
            )}
          >
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              variant="pills"
              radius="xl"
              className="w-full"
              classNames={{
                list: "gap-1",
                tab: "h-12 px-6 bg-transparent text-gray-500 font-black uppercase text-[10px] tracking-widest hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white border-0 transition-all",
              }}
            >
              <Tabs.List>
                <Tabs.Tab value="all" leftSection={<IconReceipt2 size={14} />}>
                  {dict.admin.total_fleet}
                </Tabs.Tab>
                <Tabs.Tab
                  value="pending"
                  leftSection={<IconAlertCircle size={14} />}
                >
                  {dict.admin.pending_allocation}
                </Tabs.Tab>
                <Tabs.Tab
                  value="inprogress"
                  leftSection={<IconClock size={14} />}
                >
                  {dict.admin.active_duty}
                </Tabs.Tab>
                <Tabs.Tab
                  value="completed"
                  leftSection={<IconChecks size={14} />}
                >
                  {dict.admin.fulfillment}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Paper>
          <div className="lg:col-span-4 relative group">
            <IconSearch
              size={20}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-red transition-all"
            />
            <input
              placeholder={dict.admin.search_requests}
              className={cn(
                "w-full h-15 border-2 rounded-2xl pl-14 pr-6 font-bold text-sm outline-none focus:border-brand-red transition-all",
                isDark
                  ? "bg-white/[0.03] border-white/5 text-white"
                  : "bg-white border-gray-200 text-gray-900",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Data Registry */}
        <motion.div variants={itemVariants}>
          <Paper
            radius="32px"
            className={cn(
              "border overflow-hidden shadow-2xl relative min-h-[500px]",
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200",
            )}
          >
            <div
              className={cn(
                "absolute top-0 right-0 p-10",
                isDark ? "text-white/[0.01]" : "text-gray-900/[0.01]",
              )}
            >
              <IconTruck size={300} />
            </div>

            <Box className="overflow-x-auto">
              <Table
                verticalSpacing="md"
                horizontalSpacing="xl"
                className={cn(
                  "min-w-[1100px]",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                <Table.Thead
                  className={cn(
                    "border-none",
                    isDark ? "bg-white/5" : "bg-gray-50/50 shadow-inner",
                  )}
                >
                  <Table.Tr>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none py-6">
                      {dict.admin.reference_id}
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.requester_profile}
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.deployment_detail}
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.operational_area}
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none text-center">
                      Status Controls
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      {dict.admin.financials}
                    </Table.Th>
                    <Table.Th className="border-none"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredRequests.map((req, idx) => (
                      <motion.tr
                        key={req.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "group transition-colors border-b last:border-0",
                          isDark
                            ? "hover:bg-white/[0.03] border-white/[0.05]"
                            : "hover:bg-gray-50 border-gray-100",
                        )}
                      >
                        <Table.Td className="font-mono text-[11px] font-black text-white/40">
                          {req.id.slice(0, 8)}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size="sm"
                              radius="10px"
                              className="bg-brand-red/20 text-brand-red border border-brand-red/10 font-black"
                            >
                              {(req.customerName || "?")[0]}
                            </Avatar>
                            <div>
                              <Text
                                fw={800}
                                size="sm"
                                className={
                                  isDark ? "text-white" : "text-gray-900"
                                }
                              >
                                {req.customerName || "Unknown"}
                              </Text>
                              <Text size="xs" c="dimmed" fw={600}>
                                {req.customerPhone || "N/A"}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text
                              size="xs"
                              fw={900}
                              className="text-brand-red uppercase tracking-widest"
                            >
                              {req.serviceType?.replace("_", " ") || "SERVICE"}
                            </Text>
                            <Text size="xs" className="text-gray-500 font-bold">
                              {req.vehicleDetails || "N/A"}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                            <IconMapPin size={12} className="text-gray-600" />
                            <Text
                              size="xs"
                              fw={700}
                              className="text-gray-500 max-w-[150px] truncate"
                            >
                              {typeof req.location === "object" &&
                              req.location?.address
                                ? req.location.address
                                : "Location pin"}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Menu
                            position="bottom-end"
                            shadow="xl"
                            radius="xl"
                            width={200}
                          >
                            <Menu.Target>
                              <Button
                                variant="outline"
                                size="xs"
                                radius="xl"
                                className={cn(
                                  "h-9 px-4 font-black uppercase text-[10px] tracking-widest transition-all",
                                  req.status === "completed"
                                    ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                    : req.status === "pending"
                                      ? "border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                                      : "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
                                )}
                              >
                                {req.status}
                              </Button>
                            </Menu.Target>
                            <Menu.Dropdown
                              className={cn(
                                "backdrop-blur-xl border",
                                isDark
                                  ? "bg-[#0f0f0f] border-white/10"
                                  : "bg-white border-gray-200",
                              )}
                            >
                              <Menu.Label className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                Update State
                              </Menu.Label>
                              <Menu.Item
                                onClick={() =>
                                  showSuccess("State updated to Pending")
                                }
                                className="font-bold text-xs uppercase tracking-tight text-orange-500 hover:bg-orange-500/10 rounded-lg py-2"
                              >
                                Set Pending
                              </Menu.Item>
                              <Menu.Item
                                onClick={() =>
                                  showSuccess("State updated to Active")
                                }
                                className="font-bold text-xs uppercase tracking-tight text-blue-500 hover:bg-blue-500/10 rounded-lg py-2"
                              >
                                Set Active
                              </Menu.Item>
                              <Menu.Item
                                onClick={() =>
                                  showSuccess("State updated to Completed")
                                }
                                className="font-bold text-xs uppercase tracking-tight text-emerald-500 hover:bg-emerald-500/10 rounded-lg py-2"
                              >
                                Set Completed
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex flex-col">
                            <Text
                              fw={900}
                              className={
                                isDark ? "text-white" : "text-gray-900"
                              }
                            >
                              {/* Amount not yet in schema, standard placeholder */}
                              Rs {req.amount || "0"}
                            </Text>
                            <Text
                              size="xs"
                              className={cn(
                                "font-black text-[9px]",
                                req.paymentStatus === "Paid"
                                  ? "text-emerald-500"
                                  : "text-brand-red",
                              )}
                            >
                              {req.paymentStatus || "Pending"}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Tooltip
                            label="Intel View"
                            withArrow
                            position="left"
                            radius="md"
                          >
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              className="hover:bg-white/10 hover:text-white transition-all scale-110"
                              component={Link}
                              href={`/admin/requests/${req.id}`}
                            >
                              <IconEye size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </Table.Tbody>
              </Table>
            </Box>

            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-30">
                <IconFileText size={60} stroke={1} />
                <Text className="mt-4 font-black text-xl uppercase tracking-widest">
                  {dict.admin.no_signals_found}
                </Text>
              </div>
            )}
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default RequestsPage;
