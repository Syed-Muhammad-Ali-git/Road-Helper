"use client";

import React, { useState, useMemo, memo, useCallback } from "react";
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

// Enhanced Mock Data
const allRequests = [
  {
    id: "REQ-001",
    user: "Ali Raza",
    phone: "+92 300 1234567",
    service: "Towing",
    vehicle: "Honda Civic 2019",
    location: "Gulberg III, Lahore",
    helper: "Ahmed K.",
    helperPhone: "+92 321 7654321",
    status: "In Progress",
    time: "10 mins ago",
    amount: "4,500",
    paymentStatus: "Pending",
    notes: "Car broke down near Main Boulevard.",
  },
  {
    id: "REQ-002",
    user: "Sara Ahmed",
    phone: "+92 333 9876543",
    service: "Flat Tire",
    vehicle: "Suzuki Alto",
    location: "DHA Phase 5, Lahore",
    helper: "Looking...",
    helperPhone: "N/A",
    status: "Pending",
    time: "25 mins ago",
    amount: "1,200",
    paymentStatus: "Unpaid",
    notes: "Need urgent assistance.",
  },
  {
    id: "REQ-003",
    user: "John Doe",
    phone: "+92 345 6789012",
    service: "Fuel Delivery",
    vehicle: "Toyota Corolla",
    location: "Johar Town, Lahore",
    helper: "Mike T.",
    helperPhone: "+92 301 1122334",
    status: "Completed",
    time: "2 hours ago",
    amount: "2,200",
    paymentStatus: "Paid",
    notes: "Ran out of fuel on highway exit.",
  },
  {
    id: "REQ-004",
    user: "Bilal Khan",
    phone: "+92 312 3456789",
    service: "Car Mechanic",
    vehicle: "Kia Sportage",
    location: "Model Town, Lahore",
    helper: "Usman A.",
    helperPhone: "+92 322 4455667",
    status: "Completed",
    time: "5 hours ago",
    amount: "3,500",
    paymentStatus: "Paid",
    notes: "Engine overheating issues.",
  },
  {
    id: "REQ-005",
    user: "Ayesha Malik",
    phone: "+92 307 7788990",
    service: "Locksmith",
    vehicle: "Honda City",
    location: "Bahria Town, Lahore",
    helper: "Looking...",
    helperPhone: "N/A",
    status: "Pending",
    time: "1 hour ago",
    amount: "1,500",
    paymentStatus: "Unpaid",
    notes: "Keys locked inside the car.",
  },
];

const RequestsPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("all");
  const [search, setSearch] = useState("");

  const filteredRequests = useMemo(() => {
    return allRequests.filter((req) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && req.status === "Pending") ||
        (activeTab === "inprogress" && req.status === "In Progress") ||
        (activeTab === "completed" && req.status === "Completed");

      const matchesSearch =
        req.user.toLowerCase().includes(search.toLowerCase()) ||
        req.id.toLowerCase().includes(search.toLowerCase()) ||
        req.service.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, search]);

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
    const rows = filteredRequests.map((req) =>
      [
        req.id,
        req.user,
        req.service,
        req.location,
        req.status,
        req.amount,
        req.time,
      ].join(","),
    );
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
    await showSuccess("Export Complete", "Operational log exported successfully.");
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
    <Box className="relative min-h-screen bg-[#0a0a0a] overflow-hidden p-4 md:p-8 font-satoshi text-white">
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
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Header */}
        <Group justify="space-between" mb={45} align="flex-end">
          <Box>
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mb-2"
            >
              <IconTruck size={16} className="text-brand-red" />
              <Text className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px]">
                Fleet Operations
              </Text>
            </motion.div>
            <Title
              order={1}
              className="font-manrope font-black text-4xl md:text-5xl text-white tracking-tight"
            >
              Service{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Logistics
              </span>
            </Title>
            <Text className="text-gray-500 mt-2 font-bold uppercase tracking-tight text-xs">
              Live deployment monitoring & history
            </Text>
          </Box>
          <motion.div variants={itemVariants}>
            <Button
              className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl px-8 transition-all font-black shadow-2xl shadow-brand-red/20 group"
              leftSection={
                <IconDownload
                  size={20}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              }
              onClick={handleDownloadReport}
            >
              Export Intelligence
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
            className="lg:col-span-8 glass-dark border border-white/10 flex items-center shadow-xl"
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
                  Total Fleet
                </Tabs.Tab>
                <Tabs.Tab
                  value="pending"
                  leftSection={<IconAlertCircle size={14} />}
                >
                  Pending Allocation
                </Tabs.Tab>
                <Tabs.Tab
                  value="inprogress"
                  leftSection={<IconClock size={14} />}
                >
                  Active Duty
                </Tabs.Tab>
                <Tabs.Tab
                  value="completed"
                  leftSection={<IconChecks size={14} />}
                >
                  Fulfillment
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
              placeholder="Search requests..."
              className="w-full h-15 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-14 pr-6 text-white font-bold text-sm outline-none focus:border-brand-red transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Data Registry */}
        <motion.div variants={itemVariants}>
          <Paper
            radius="32px"
            className="glass-dark border border-white/10 overflow-hidden shadow-2xl relative min-h-[500px]"
          >
            <div className="absolute top-0 right-0 p-10 text-white/[0.01]">
              <IconTruck size={300} />
            </div>

            <Box className="overflow-x-auto">
              <Table
                verticalSpacing="xl"
                horizontalSpacing="xl"
                className="text-white min-w-[1100px]"
              >
                <Table.Thead className="bg-white/5 border-none">
                  <Table.Tr>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none py-6">
                      Reference ID
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      Requester Profile
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      Deployment Detail
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      Operational Area
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      Duty Status
                    </Table.Th>
                    <Table.Th className="text-gray-600 font-black uppercase text-[10px] tracking-widest border-none">
                      Financials
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
                        className="group hover:bg-white/[0.03] transition-colors border-b border-white/[0.05] last:border-0"
                      >
                        <Table.Td className="font-mono text-[11px] font-black text-white/40">
                          {req.id}
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size="sm"
                              radius="10px"
                              className="bg-brand-red/20 text-brand-red border border-brand-red/10 font-black"
                            >
                              {req.user[0]}
                            </Avatar>
                            <div>
                              <Text fw={800} size="sm">
                                {req.user}
                              </Text>
                              <Text size="xs" color="dimmed" fw={600}>
                                {req.phone}
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
                              {req.service}
                            </Text>
                            <Text size="xs" className="text-gray-500 font-bold">
                              {req.vehicle}
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
                              {req.location}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest",
                              req.status === "Completed"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : req.status === "Pending"
                                  ? "bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                                  : "bg-blue-500/10 border-blue-500/20 text-blue-400",
                            )}
                          >
                            <div
                              className={cn(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                req.status === "Completed"
                                  ? "bg-emerald-400"
                                  : req.status === "Pending"
                                    ? "bg-orange-400"
                                    : "bg-blue-400",
                              )}
                            />
                            {req.status}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex flex-col">
                            <Text fw={900} className="text-white">
                              Rs {req.amount}
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
                              {req.paymentStatus}
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
                  No signals found
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
