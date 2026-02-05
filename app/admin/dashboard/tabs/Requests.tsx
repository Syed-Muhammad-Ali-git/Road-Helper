"use client";

import React from "react";
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

const requests = [
  {
    id: "REQ-001",
    user: "Ali Raza",
    service: "Towing",
    location: "Gulberg III, Lahore",
    helper: "Ahmed K.",
    status: "In Progress",
    time: "10 mins ago",
    amount: "Rs 4,500",
  },
  {
    id: "REQ-002",
    user: "Sara Ahmed",
    service: "Flat Tire",
    location: "DHA Phase 5, Lahore",
    helper: "Looking...",
    status: "Pending",
    time: "25 mins ago",
    amount: "Rs 1,200",
  },
  {
    id: "REQ-003",
    user: "John Doe",
    service: "Fuel Delivery",
    location: "Johar Town, Lahore",
    helper: "Mike T.",
    status: "Completed",
    time: "2 hours ago",
    amount: "Rs 2,200",
  },
];

export default function RequestsTab() {
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
        {/* Filters */}
        <Group mb="md">
          <Button
            variant="light"
            className="bg-brand-red/10 text-brand-red hover:bg-brand-red/20 border border-brand-red/20"
          >
            All Requests
          </Button>
          <Button
            variant="subtle"
            className="text-gray-400 hover:bg-white/5 hover:text-white"
          >
            Pending
          </Button>
          <Button
            variant="subtle"
            className="text-gray-400 hover:bg-white/5 hover:text-white"
          >
            In Progress
          </Button>
          <Button
            variant="subtle"
            className="text-gray-400 hover:bg-white/5 hover:text-white"
          >
            Completed
          </Button>
        </Group>

        <div className="overflow-x-auto">
          <Table verticalSpacing="md" className="text-gray-200">
            <Table.Thead className="bg-white/5">
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>User & Service</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Helper</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th className="text-right">Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {requests.map((req, i) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <Table.Td className="font-mono text-gray-400 text-xs">
                    {req.id}
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <Text size="sm" fw={600} className="text-white">
                        {req.service}
                      </Text>
                      <Text size="xs" className="text-gray-400">
                        {req.user}
                      </Text>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" className="text-gray-300">
                      <IconMapPin size={14} className="text-brand-red" />
                      <Text size="sm">{req.location}</Text>
                    </Group>
                  </Table.Td>
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
                    <Group gap="xs" className="text-gray-400">
                      <IconCalendar size={14} />
                      <Text size="xs">{req.time}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Tooltip label="View Details">
                      <ActionIcon
                        variant="light"
                        color="gray"
                        className="bg-white/5 hover:bg-white/10 text-gray-300"
                        component={motion.button}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
      </Paper>
    </motion.div>
  );
}
