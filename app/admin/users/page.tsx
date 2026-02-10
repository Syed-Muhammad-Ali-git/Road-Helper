"use client";

import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
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
  Modal,
  Box,
  SimpleGrid,
  Select,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconBan,
  IconFilter,
  IconDownload,
  IconUserPlus,
  IconSortDescending,
  IconUsers,
  IconArrowRight,
  IconShieldCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError, showConfirm } from "@/lib/sweetalert";
import { cn } from "@/lib/utils";

const initialUsers = [
  {
    id: 1,
    name: "Ali Raza",
    email: "ali@gmail.com",
    role: "Customer",
    phone: "+92 300 1234567",
    status: "Active",
    lastActive: "2 mins ago",
  },
  {
    id: 2,
    name: "Ahmed Khan",
    email: "ahmed@helper.com",
    role: "Helper",
    phone: "+92 321 7654321",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Sara Smith",
    email: "sara@gmail.com",
    role: "Customer",
    phone: "+92 333 9876543",
    status: "Inactive",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Mike T.",
    email: "mike@mechanic.com",
    role: "Helper",
    phone: "+92 301 1122334",
    status: "Suspended",
    lastActive: "1 week ago",
  },
  {
    id: 5,
    name: "John Doe",
    email: "john@doe.com",
    role: "Customer",
    phone: "+92 345 6789012",
    status: "Active",
    lastActive: "5 mins ago",
  },
];

const UsersPage = () => {
  const [isLoaded] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    phone: "",
  });

  const handleAddUser = useCallback(async () => {
    if (!newUser.firstName || !newUser.email || !newUser.role) {
      await showError("Validation", "Please fill in all required fields.");
      return;
    }
    const userToAdd = {
      id: users.length + 1,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      status: "Active",
      lastActive: "Just now",
    };
    setUsers([userToAdd, ...users]);
    await showSuccess("User added successfully!");
    setNewUser({ firstName: "", lastName: "", email: "", role: "", phone: "" });
    close();
  }, [newUser, users, close]);

  const handleDeleteUser = useCallback(async (id: number) => {
    const { isConfirmed } = await showConfirm(
      "Delete User",
      "Are you sure you want to delete this user?",
      "Yes, delete"
    );
    if (isConfirmed) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      await showSuccess("User deleted.");
    }
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box className="relative min-h-screen bg-[#0a0a0a] overflow-hidden p-4 md:p-8 font-satoshi text-white">
      {/* Premium Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[60%] h-[60%] bg-brand-red/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -45, 0],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full"
        />
      </div>

      <motion.div
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* HEADER SECTION */}
        <Group justify="space-between" mb={40} align="flex-end">
          <Box>
            <motion.div
              variants={itemVariants as any}
              className="flex items-center gap-2 mb-2"
            >
              <IconUsers size={16} className="text-brand-red" />
              <Text className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px]">
                User Governance
              </Text>
            </motion.div>
            <Title
              order={1}
              className="font-manrope font-extrabold text-4xl md:text-5xl text-white tracking-tight"
            >
              Community{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Registry
              </span>
            </Title>
            <Text className="text-gray-500 mt-2 font-medium">
              Monitoring {users.length} registered accounts across the platform.
            </Text>
          </Box>
          <motion.div variants={itemVariants as any} className="flex gap-4">
            <Button
              variant="default"
              className="bg-white/5 text-white border-white/10 hover:bg-white/10 h-14 rounded-2xl px-6 transition-all font-bold"
              leftSection={<IconDownload size={20} />}
            >
              Export Database
            </Button>
            <Button
              className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl px-8 transition-all font-black text-sm shadow-xl shadow-brand-red/20"
              leftSection={<IconUserPlus size={22} />}
              onClick={open}
            >
              Onboard User
            </Button>
          </motion.div>
        </Group>

        {/* TOOLBAR & SEARCH */}
        <motion.div variants={itemVariants as any} className="mb-8">
          <Paper
            p={24}
            radius="32px"
            className="glass-dark border border-white/10 shadow-2xl"
          >
            <Group
              justify="space-between"
              align="center"
              className="flex-wrap gap-6"
            >
              <div className="flex-1 min-w-[300px] relative group">
                <IconSearch
                  size={22}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-red transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search by identity, email or credentials..."
                  className="w-full h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl pl-14 pr-6 text-white font-medium focus:border-brand-red transition-all outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Group gap="md">
                <Button
                  variant="outline"
                  color="gray"
                  className="h-14 rounded-2xl border-white/10 text-gray-400 hover:bg-white/5 px-6 font-bold"
                  leftSection={<IconFilter size={18} />}
                >
                  Advanced Filters
                </Button>
                <ActionIcon
                  size={56}
                  radius="2xl"
                  className="bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                >
                  <IconSortDescending size={24} />
                </ActionIcon>
              </Group>
            </Group>
          </Paper>
        </motion.div>

        {/* DATA TABLE */}
        <motion.div variants={itemVariants as any}>
          <Paper
            radius="32px"
            className="glass-dark border border-white/10 overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 p-10 text-white/[0.01]">
              <IconShieldCheck size={280} />
            </div>

            <Box className="overflow-x-auto">
              <Table
                verticalSpacing="xl"
                horizontalSpacing="xl"
                className="text-white min-w-[900px]"
              >
                <Table.Thead className="bg-white/5 border-none">
                  <Table.Tr>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none py-6">
                      Identity Profile
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Access Privilege
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Verification Status
                    </Table.Th>
                    <Table.Th className="text-gray-500 font-black uppercase text-[10px] tracking-widest border-none">
                      Last Interaction
                    </Table.Th>
                    <Table.Th className="border-none"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-white/[0.03] transition-colors border-b border-white/[0.05] last:border-0"
                      >
                        <Table.Td>
                          <Group gap="lg">
                            <Avatar
                              size="lg"
                              radius="20px"
                              className="bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-white/5 text-white font-black shadow-lg"
                            >
                              {user.name[0]}
                            </Avatar>
                            <div>
                              <Text
                                fw={800}
                                className="text-md text-white tracking-tight"
                              >
                                {user.name}
                              </Text>
                              <Text
                                size="xs"
                                className="text-gray-500 font-medium"
                              >
                                {user.email}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest",
                              user.role === "Admin"
                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                : user.role === "Helper"
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                  : "bg-gray-500/10 border-gray-500/20 text-gray-400",
                            )}
                          >
                            <div
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                user.role === "Admin"
                                  ? "bg-red-400"
                                  : user.role === "Helper"
                                    ? "bg-blue-400"
                                    : "bg-gray-400",
                              )}
                            />
                            {user.role}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            variant="filled"
                            radius="md"
                            className={cn(
                              "px-4 h-7 text-[10px] font-black",
                              user.status === "Active"
                                ? "bg-emerald-600 shadow-lg shadow-emerald-500/20"
                                : user.status === "Suspended"
                                  ? "bg-brand-red shadow-lg shadow-brand-red/20"
                                  : "bg-gray-700",
                            )}
                          >
                            {user.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td className="text-gray-400 text-xs font-bold font-manrope">
                          {user.lastActive}
                        </Table.Td>
                        <Table.Td>
                          <Menu
                            shadow="xl"
                            width={220}
                            radius="xl"
                            position="bottom-end"
                          >
                            <Menu.Target>
                              <ActionIcon
                                size={44}
                                radius="xl"
                                variant="subtle"
                                color="gray"
                                className="hover:bg-white/10 text-gray-600 hover:text-white transition-all"
                              >
                                <IconDotsVertical size={20} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown className="bg-[#0f0f0f] border-white/10 p-2 shadow-2xl backdrop-blur-3xl">
                              <Menu.Item
                                leftSection={<IconEdit size={16} />}
                                className="rounded-lg text-gray-300 font-bold hover:bg-white/5 transition-colors"
                              >
                                Edit Metadata
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconBan size={16} />}
                                color="orange"
                                className="rounded-lg font-bold hover:bg-orange-500/10 transition-colors"
                              >
                                Apply Sanction
                              </Menu.Item>
                              <Menu.Divider className="border-white/5" />
                              <Menu.Item
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                className="rounded-lg font-bold hover:bg-red-500/10 transition-colors"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Revoke Access
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Table.Td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </Table.Tbody>
              </Table>
            </Box>

            {filteredUsers.length === 0 && (
              <div className="text-center py-20 bg-white/[0.02]">
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 mx-auto mb-4">
                  <IconSearch size={32} />
                </div>
                <Text className="text-white font-black text-xl">
                  No match found
                </Text>
                <Text className="text-gray-600 font-medium">
                  Try refining your search parameters
                </Text>
              </div>
            )}
          </Paper>
        </motion.div>

        {/* PAGINATION */}
        <motion.div
          variants={itemVariants as any}
          className="mt-12 flex justify-between items-center"
        >
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            Showing 1 to {filteredUsers.length} of {users.length} entities
          </Text>
          <Pagination
            total={1}
            radius="xl"
            classNames={{
              control:
                "bg-white/5 border-white/10 text-white font-bold h-12 w-12 hover:bg-white/10 transition-all data-[active=true]:bg-brand-red data-[active=true]:border-none shadow-xl",
            }}
          />
        </motion.div>

        <div className="h-32" />
      </motion.div>

      {/* ADD USER MODAL */}
      <Modal
        opened={opened}
        onClose={close}
        radius="32px"
        centered
        size="lg"
        title={
          <Title order={3} className="text-white font-manrope font-black">
            Identity Onboarding
          </Title>
        }
        classNames={{
          content:
            "bg-[#0f0f0f] border-2 border-white/10 backdrop-blur-3xl shadow-3xl",
          header: "bg-[#0f0f0f] border-b border-white/5 p-8",
          body: "p-8",
          close:
            "text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all scale-125 mr-2",
        }}
        overlayProps={{ blur: 10, opacity: 0.8 }}
      >
        <Stack gap="xl">
          <SimpleGrid cols={2}>
            <TextInput
              label="Legal First Name"
              placeholder="John"
              {...newUser}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              classNames={{
                label:
                  "text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2",
                input:
                  "bg-white/5 border-2 border-white/5 text-white h-14 rounded-2xl focus:border-brand-red transition-all",
              }}
            />
            <TextInput
              label="Legal Last Name"
              placeholder="Doe"
              className="last"
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              classNames={{
                label:
                  "text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2",
                input:
                  "bg-white/5 border-2 border-white/5 text-white h-14 rounded-2xl focus:border-brand-red transition-all",
              }}
            />
          </SimpleGrid>
          <TextInput
            label="Verification Email"
            placeholder="john@protocol.com"
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            classNames={{
              label:
                "text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2",
              input:
                "bg-white/5 border-2 border-white/5 text-white h-14 rounded-2xl focus:border-brand-red transition-all",
            }}
          />
          <Select
            label="Privilege Protocol"
            placeholder="Select Role"
            data={["Customer", "Helper", "Admin"]}
            onChange={(val) => setNewUser({ ...newUser, role: val || "" })}
            classNames={{
              label:
                "text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2",
              input:
                "bg-white/5 border-2 border-white/5 text-white h-14 rounded-2xl focus:border-brand-red transition-all",
              dropdown: "bg-[#0f0f0f] border border-white/10 rounded-2xl p-2",
              option:
                "rounded-xl font-bold hover:bg-white/5 data-[checked=true]:bg-brand-red transition-all",
            }}
          />
          <Button
            fullWidth
            className="bg-brand-red hover:bg-brand-dark-red h-16 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-brand-red/20 border-none transition-all mt-4"
            leftSection={<IconArrowRight size={20} />}
            onClick={handleAddUser}
          >
            Commit to Database
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
};

export default UsersPage;
