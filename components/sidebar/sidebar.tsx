"use client";

import React from "react";
import {
    Stack,
    UnstyledButton,
    Text,
    Box,
    rem,
    Divider
} from "@mantine/core";
import {
    IconDashboard,
    IconHistory,
    IconUser,
    IconMapPin,
    IconWallet,
    IconListDetails,
    IconArrowLeftRight
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";

const clientItems = [
    { icon: IconDashboard, label: 'Dashboard', href: '/client/dashboard' },
    { icon: IconMapPin, label: 'Request Help', href: '/client/request-help' },
    { icon: IconHistory, label: 'Service History', href: '/client/history' },
    { icon: IconUser, label: 'Profile', href: '/client/profile' },
];

const helperItems = [
    { icon: IconDashboard, label: 'Overview', href: '/helper/dashboard' },
    { icon: IconListDetails, label: 'Requests', href: '/helper/requests' },
    { icon: IconArrowLeftRight, label: 'Active Job', href: '/helper/active-job' },
    { icon: IconWallet, label: 'Earnings', href: '/helper/earnings' },
    { icon: IconUser, label: 'Profile', href: '/helper/profile' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { userData } = useSelector((state: RootState) => state.auth);

    const items = userData?.role === 'helper' ? helperItems : clientItems;

    return (
        <Box className="w-full bg-[#fcfcfc] h-[calc(100vh-70px)] p-4 border-r overflow-y-auto">
            <Stack gap="xs">
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="md" mb="xs">
                    Main Menu
                </Text>

                {items.map((item, index) => {
                    const active = pathname === item.href;
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <UnstyledButton
                                component={Link}
                                href={item.href}
                                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${active
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'hover:bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <item.icon size={22} stroke={active ? 2.5 : 2} />
                                <Text fw={active ? 700 : 500} size="sm">{item.label}</Text>
                            </UnstyledButton>
                        </motion.div>
                    );
                })}

                <Divider my="md" label="Help & Support" labelPosition="center" />

                <UnstyledButton
                    className="w-full p-3 rounded-xl flex items-center gap-3 hover:bg-slate-100 text-slate-600 transition-all"
                >
                    <IconUser size={22} />
                    <Text fw={500} size="sm">Customer Service</Text>
                </UnstyledButton>
            </Stack>
        </Box>
    );
}
