"use client";

import React from "react";
import {
    Group,
    Text,
    Avatar,
    Menu,
    UnstyledButton,
    Box,
    Burger,
    ActionIcon,
    rem,
    Loader
} from "@mantine/core";
import {
    IconLogout,
    IconUser,
    IconBell,
    IconChevronDown
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { logoutUserAction } from "@/redux/actions/auth-action";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface HeaderProps {
    opened: boolean;
    toggle: () => void;
}

export default function Header({ opened, toggle }: HeaderProps) {
    const { userData, loading } = useSelector((state: RootState) => state.auth);
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await dispatch(logoutUserAction());
        router.push("/auth/login");
    };

    return (
        <Box className="h-[70px] border-b bg-white flex items-center px-4 justify-between sticky top-0 z-[100] shadow-sm">
            <Group>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Group gap="xs">
                        <Box className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                            <Text c="white" fw={900} size="xs">RH</Text>
                        </Box>
                        <Text fw={800} size="xl" className="tracking-tighter text-slate-800">
                            ROAD HELPER
                        </Text>
                    </Group>
                </motion.div>
            </Group>

            <Group gap="md">
                <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                    <IconBell size={20} />
                </ActionIcon>

                <Menu shadow="md" width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
                    <Menu.Target>
                        <UnstyledButton className="p-1 pr-2 hover:bg-slate-50 transition-colors rounded-lg">
                            <Group gap="xs">
                                <Avatar
                                    src={null}
                                    alt={userData?.fullName}
                                    radius="md"
                                    color={userData?.role === 'client' ? 'blue' : 'red'}
                                >
                                    {userData?.fullName?.charAt(0)}
                                </Avatar>
                                <Box className="hidden xs:block">
                                    <Text size="sm" fw={600} mb={-3}>{userData?.fullName}</Text>
                                    <Text size="xs" c="dimmed" tt="capitalize">{userData?.role || 'Guest'}</Text>
                                </Box>
                                <IconChevronDown size={14} className="text-slate-400" />
                            </Group>
                        </UnstyledButton>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>Settings</Menu.Label>
                        <Menu.Item leftSection={<IconUser size={14} />} onClick={() => router.push(`/${userData?.role}/profile`)}>
                            My Profile
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Label>Session</Menu.Label>
                        <Menu.Item
                            color="red"
                            leftSection={<IconLogout size={14} />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Box>
    );
}
