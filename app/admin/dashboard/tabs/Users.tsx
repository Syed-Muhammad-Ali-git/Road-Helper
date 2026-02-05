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
  Avatar,
  Badge,
  ActionIcon,
  Menu,
  Pagination,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconBan,
  IconFilter,
  IconDownload,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const users = [
  {
    id: 1,
    name: "Ali Raza",
    email: "ali@gmail.com",
    role: "Customer",
    status: "Active",
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Ahmed Khan",
    email: "ahmed@helper.com",
    role: "Helper",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Sara Smith",
    email: "sara@gmail.com",
    role: "Customer",
    status: "Inactive",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Mike T.",
    email: "mike@mechanic.com",
    role: "Helper",
    status: "Suspended",
    lastActive: "1 week ago",
  },
  {
    id: 5,
    name: "John Doe",
    email: "john@doe.com",
    role: "Customer",
    status: "Active",
    lastActive: "5 mins ago",
  },
];

export default function UsersTab() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Group justify="space-between" mb="lg">
        <div>
          <Title className="font-manrope text-3xl font-bold text-white mb-1">
            User Management
          </Title>
          <Text className="text-gray-400">
            Manage customers, helpers, and verification status.
          </Text>
        </div>
        <Group>
          <Button
            variant="outline"
            color="gray"
            leftSection={<IconDownload size={18} />}
            className="text-gray-300 border-gray-700 hover:bg-gray-800"
          >
            Export
          </Button>
          <Button
            className="bg-brand-red hover:bg-brand-dark-red text-white"
            leftSection={<IconPlus size={18} />}
          >
            Add New User
          </Button>
        </Group>
      </Group>

      <Paper
        p="lg"
        radius="xl"
        className="glass-dark border border-white/10 overflow-hidden"
      >
        {/* Toolbar */}
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            className="w-full md:w-80"
            styles={{
              input: {
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
                color: "white",
                "&:focus": {
                  borderColor: "#EF4444",
                },
              },
            }}
          />
          <Group gap="xs">
            <Button
              variant="default"
              leftSection={<IconFilter size={16} />}
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            >
              Filter
            </Button>
            <Button
              variant="default"
              className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            >
              Sort By: Newest
            </Button>
          </Group>
        </Group>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table verticalSpacing="sm" className="text-gray-200">
            <Table.Thead className="bg-white/5">
              <Table.Tr>
                <Table.Th>User Info</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Last Active</Table.Th>
                <Table.Th className="text-right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        src={null}
                        alt={user.name}
                        radius="xl"
                        color="red"
                        className="bg-gradient-to-br from-brand-red to-brand-dark-red text-white font-bold"
                      >
                        {user.name[0]}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={600} className="text-white">
                          {user.name}
                        </Text>
                        <Text size="xs" className="text-gray-400">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="dot"
                      size="lg"
                      className="bg-transparent pl-0 text-gray-300"
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        user.status === "Active"
                          ? "green"
                          : user.status === "Suspended"
                            ? "red"
                            : "gray"
                      }
                      variant="light"
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="text-gray-400 text-sm">
                    {user.lastActive}
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Menu shadow="md" width={200} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          className="hover:bg-white/10"
                        >
                          <IconDotsVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown className="bg-[#18181B] border-[#27272A]">
                        <Menu.Item
                          leftSection={<IconEdit size={14} />}
                          className="text-gray-300 hover:bg-white/5"
                        >
                          Edit Details
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconBan size={14} />}
                          color="orange"
                          className="hover:bg-orange-500/10"
                        >
                          Suspend User
                        </Menu.Item>
                        <Menu.Divider className="border-gray-700" />
                        <Menu.Item
                          leftSection={<IconTrash size={14} />}
                          color="red"
                          className="hover:bg-red-500/10"
                        >
                          Delete User
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </motion.tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* Pagination */}
        <Group justify="end" mt="lg">
          <Pagination
            total={10}
            color="red"
            classNames={{
              control:
                "bg-white/5 border-white/10 text-gray-300 data-[active=true]:bg-brand-red",
            }}
          />
        </Group>
      </Paper>
    </motion.div>
  );
}
