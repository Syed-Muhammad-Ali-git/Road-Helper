"use client";

import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  TextInput,
  Button,
  Table,
  Badge,
  ActionIcon,
  Tooltip,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconEye,
  IconCheck,
  IconX,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { subscribeToAdminRequests } from "@/lib/services/adminService";
import { useLanguage } from "@/app/context/LanguageContext";

export default function RequestsTab() {
  const { dict } = useLanguage();
  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Subscribe to Firebase requests
  useEffect(() => {
    const unsubscribe = subscribeToAdminRequests((allRequests) => {
      setRequests(allRequests);
    });
    return () => unsubscribe();
  }, []);

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const statusMatch =
      filterStatus === "all" ||
      req.status.toLowerCase() === filterStatus.toLowerCase();
    const searchMatch =
      req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    if (status.includes("Completed")) return "green";
    if (status.includes("In Progress")) return "blue";
    if (status.includes("Pending")) return "orange";
    return "gray";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Group justify="space-between" mb="lg">
        <div>
          <Title className="font-manrope text-3xl font-bold text-white mb-1">
            Service Requests
          </Title>
          <Text className="text-gray-400">
            Monitor and manage ongoing and past service requests.
          </Text>
        </div>
      </Group>

      <Paper
        p="lg"
        radius="xl"
        className="glass-dark border border-white/10 overflow-hidden"
      >
        {/* Search and Filters */}
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search by user or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            className="flex-1"
            classNames={{
              input: "bg-white/5 border-white/10 text-white placeholder-gray-500",
            }}
          />
        </Group>

        <Group mb="md">
          <Button
            variant={filterStatus === "all" ? "light" : "subtle"}
            className={
              filterStatus === "all"
                ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/20 border border-brand-red/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setFilterStatus("all")}
          >
            All Requests
          </Button>
          <Button
            variant={filterStatus === "pending" ? "light" : "subtle"}
            className={
              filterStatus === "pending"
                ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "in progress" ? "light" : "subtle"}
            className={
              filterStatus === "in progress"
                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setFilterStatus("in progress")}
          >
            In Progress
          </Button>
          <Button
            variant={filterStatus === "completed" ? "light" : "subtle"}
            className={
              filterStatus === "completed"
                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </Group>

        {filteredRequests.length === 0 ? (
          <Box className="text-center py-12">
            <Text className="text-gray-400">No requests found</Text>
          </Box>
        ) : (
          <div className="overflow-x-auto">
            <Table verticalSpacing="md" className="text-gray-200">
              <Table.Thead className="bg-white/5">
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>User & Service</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Helper</Table.Th>
                  <Table.Th className="text-right">Amount</Table.Th>
                  <Table.Th className="text-right">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredRequests.map((req, i) => (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <Table.Td className="font-mono text-gray-400 text-xs">
                      {req.id.slice(0, 8).toUpperCase()}
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={600} className="text-white">
                          {req.type}
                        </Text>
                        <Text size="xs" className="text-gray-400">
                          {req.user}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={getStatusColor(req.status)}
                        variant="light"
                      >
                        {req.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-gray-300">{req.helper}</Table.Td>
                    <Table.Td className="text-right text-white font-bold">
                      Rs {(req.amount || 0).toLocaleString()}
                    </Table.Td>
                    <Table.Td className="text-right">
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          color="gray"
                          className="bg-white/5 hover:bg-white/10 text-gray-300"
                        >
                          <IconEye size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </motion.tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Paper>
    </motion.div>
  );
}
