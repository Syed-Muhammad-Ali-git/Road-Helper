"use client";

import React from "react";
import {
    AppShell,
    Burger,
    Group,
    Text,
    UnstyledButton,
    Stack,
    Box,
    Avatar,
    Menu,
    ActionIcon,
    Switch
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconDashboard,
    IconHistory,
    IconUser,
    IconLogout,
    IconBell,
    IconWallet,
    IconListDetails
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const items = [
    { icon: IconDashboard, label: 'Dashboard', href: '/helper/dashboard' },
    { icon: IconListDetails, label: 'Nearby Requests', href: '/helper/requests' },
    { icon: IconWallet, label: 'Earnings', href: '/helper/earnings' },
    { icon: IconUser, label: 'Profile', href: '/helper/profile' },
];

export default function HelperLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const pathname = usePathname();
    const router = useRouter();
    const { user, userData } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth/login");
    };

    const toggleOnline = async (checked: boolean) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "helpers", user.uid), {
                isOnline: checked
            });
            toast.success(checked ? "You are now ONLINE" : "You are now OFFLINE");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <ProtectedRoute allowedRole="helper">
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
                        <Group gap="xl">
                            <Group>
                                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                                <Group gap="xs">
                                    <Box className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                        <Text fw={900} c="white">RH</Text>
                                    </Box>
                                    <Text size="xl" fw={800} className="tracking-tight text-slate-800 hidden xs:block">HELPER PANEL</Text>
                                </Group>
                            </Group>

                            <Box className="hidden md:block">
                                <Switch
                                    label={userData?.isOnline ? "Online" : "Offline"}
                                    color="green"
                                    size="md"
                                    checked={userData?.isOnline || false}
                                    onChange={(event) => toggleOnline(event.currentTarget.checked)}
                                />
                            </Box>
                        </Group>

                        <Group gap="md">
                            <ActionIcon variant="light" size="lg" radius="md" color="slate">
                                <IconBell size={20} />
                            </ActionIcon>

                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <UnstyledButton>
                                        <Group gap="xs">
                                            <Avatar src={null} alt={userData?.fullName} color="red" radius="xl">
                                                {userData?.fullName?.charAt(0)}
                                            </Avatar>
                                            <Box className="hidden md:block text-right">
                                                <Text size="sm" fw={600} mb={-2}>{userData?.fullName}</Text>
                                                <Text size="xs" c="dimmed">{userData?.serviceType?.replace('_', ' ')}</Text>
                                            </Box>
                                        </Group>
                                    </UnstyledButton>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Management</Menu.Label>
                                    <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/helper/profile">Profile</Menu.Item>
                                    <Menu.Item leftSection={<IconWallet size={14} />} component={Link} href="/helper/earnings">Earnings</Menu.Item>
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

                <AppShell.Navbar p="md" className="bg-[#FFF8F8]">
                    <Stack gap="sm">
                        {items.map((item) => (
                            <UnstyledButton
                                key={item.label}
                                component={Link}
                                href={item.href}
                                className={`p-4 rounded-xl transition-all flex items-center gap-3 ${pathname === item.href
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                                        : 'hover:bg-red-50 text-slate-600'
                                    }`}
                            >
                                <item.icon size={22} />
                                <Text fw={600}>{item.label}</Text>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </AppShell.Navbar>

                <AppShell.Main className="bg-[#FFF8F8]">
                    {children}
                </AppShell.Main>
            </AppShell>
        </ProtectedRoute>
    );
}
