"use client";

import React from "react";
import {
    Title,
    Text,
    SimpleGrid,
    Paper,
    Group,
    Stack,
    Button,
    Box,
    Badge,
    ThemeIcon,
    Avatar
} from "@mantine/core";
import {
    IconCash,
    IconChecklist,
    IconClock,
    IconStar,
    IconMapPin,
    IconBriefcase
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function HelperDashboard() {
    const { userData } = useSelector((state: RootState) => state.auth);

    const stats = [
        { title: "Total Earnings", value: "$1,240", icon: IconCash, color: "green" },
        { title: "Jobs Completed", value: userData?.totalJobs || 0, icon: IconChecklist, color: "blue" },
        { title: "Current Rating", value: userData?.rating || 5.0, icon: IconStar, color: "yellow" },
        { title: "Active Hours", value: "48h", icon: IconClock, color: "orange" },
    ];

    return (
        <Box className="p-4 md:p-8">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Box>
                        <Title order={1} className="text-3xl font-bold text-slate-800">
                            Welcome back, {userData?.fullName?.split(' ')[0]}
                        </Title>
                        <Text c="dimmed" size="lg">Ready for some new jobs today?</Text>
                    </Box>
                    <Badge size="xl" radius="md" color={userData?.isOnline ? "green" : "red"} variant="light" p="lg">
                        {userData?.isOnline ? "ONLINE & VISIBLE" : "OFFLINE"}
                    </Badge>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                    {stats.map((stat) => (
                        <Paper key={stat.title} p="xl" radius="xl" withBorder className="bg-white">
                            <Group justify="space-between" mb="xs">
                                <ThemeIcon size={48} radius="lg" color={stat.color} variant="light">
                                    <stat.icon size={24} />
                                </ThemeIcon>
                                <Text size="xs" fw={700} c="dimmed" tt="uppercase">{stat.title}</Text>
                            </Group>
                            <Title order={2}>{stat.value}</Title>
                        </Paper>
                    ))}
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                    {/* Active Job Card */}
                    <Paper p="xl" radius="xl" withBorder className="md:col-span-2">
                        <Title order={3} mb="xl">Active Job Tracking</Title>
                        <Box className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                            <ThemeIcon size={64} radius="xl" color="slate" variant="light" mb="md">
                                <IconBriefcase size={32} />
                            </ThemeIcon>
                            <Text fw={600} c="slate.6">No active jobs at the moment</Text>
                            <Button
                                variant="filled"
                                color="red"
                                mt="xl"
                                radius="md"
                                component={Link}
                                href="/helper/requests"
                            >
                                View Nearby Requests
                            </Button>
                        </Box>
                    </Paper>

                    {/* Recent Reviews Card */}
                    <Paper p="xl" radius="xl" withBorder>
                        <Title order={4} mb="lg">Latest Feedback</Title>
                        <Stack gap="md">
                            <Text c="dimmed" size="sm" ta="center" py="xl">No reviews yet.</Text>
                        </Stack>
                    </Paper>
                </SimpleGrid>

                <Box>
                    <Title order={3} mb="lg">Recent Orders</Title>
                    <Paper p="xl" radius="xl" withBorder>
                        <Text c="dimmed" ta="center">Your recent job history will appear here.</Text>
                    </Paper>
                </Box>
            </Stack>
        </Box>
    );
}
