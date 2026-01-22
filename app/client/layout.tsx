"use client";

import React from "react";
import {
    AppShell,
    Burger,
    Group,
    Text,
    UnstyledButton,
    Stack,

    ThemeIcon,
    Box,
    Avatar,
    Menu,
    ActionIcon
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconDashboard,
    IconHistory,
    IconUser,
    IconMapPin,
    IconLogout,
    IconBell
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

const items = [
    { icon: IconDashboard, label: 'Dashboard', href: '/client/dashboard' },
    { icon: IconMapPin, label: 'Request Help', href: '/client/request-help' },
    { icon: IconHistory, label: 'History', href: '/client/history' },
    { icon: IconUser, label: 'Profile', href: '/client/profile' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth/login");
    };

    return (
        <ProtectedRoute allowedRole="client">
            <AppShell
                header={{ height: 70 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Header className="border-b bg-white flex items-center px-lg">
                    <Group justify="space-between" className="w-full px-4">
                        <Group>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                            <Group gap="xs">
                                <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Text fw={900} c="white">RH</Text>
                                </Box>
                                <Text size="xl" fw={800} className="tracking-tight text-slate-800 hidden xs:block">ROAD HELPER</Text>
                            </Group>
                        </Group>

                        <Group gap="md">
                            <ActionIcon variant="light" size="lg" radius="md" color="slate">
                                <IconBell size={20} />
                            </ActionIcon>

                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <UnstyledButton>
                                        <Group gap="xs">
                                            <Avatar src={null} alt={userData?.fullName} color="blue" radius="xl">
                                                {userData?.fullName?.charAt(0)}
                                            </Avatar>
                                            <Box className="hidden md:block">
                                                <Text size="sm" fw={600} mb={-2}>{userData?.fullName}</Text>
                                                <Text size="xs" c="dimmed">Client</Text>
                                            </Box>
                                        </Group>
                                    </UnstyledButton>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Application</Menu.Label>
                                    <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/client/profile">Profile</Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Label>Danger Zone</Menu.Label>
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
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar p="md" className="bg-[#F8FAFC]">
                    <Stack gap="sm">
                        {items.map((item) => (
                            <UnstyledButton
                                key={item.label}
                                component={Link}
                                href={item.href}
                                className={`p-3 rounded-xl transition-all flex items-center gap-3 ${pathname === item.href
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'hover:bg-slate-200 text-slate-600'
                                    }`}
                            >
                                <item.icon size={22} />
                                <Text fw={600}>{item.label}</Text>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </AppShell.Navbar>

                <AppShell.Main className="bg-[#F8FAFC]">
                    {children}
                </AppShell.Main>
            </AppShell>
        </ProtectedRoute>
    );
}
