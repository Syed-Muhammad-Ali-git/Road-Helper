"use client";

import React, { useEffect, useState } from "react";
import {
    Title,
    Text,
    Paper,
    Stack,
    Box,
    Group,
    SimpleGrid,
    ThemeIcon,
    Table,
    Badge
} from "@mantine/core";
import {
    IconWallet,
    IconTrendingUp,
    IconCalendarEvent,
    IconChecklist
} from "@tabler/icons-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function EarningsPage() {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchEarnings = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "serviceRequests"),
                    where("helperId", "==", user.uid),
                    where("status", "==", "completed"),
                    orderBy("completedAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEarnings(data);
            } catch (error) {
                console.error("Error fetching earnings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [user]);

    const totalEarnings = earnings.reduce((sum, item) => sum + (item.price || 50), 0); // Mock price if not exist

    return (
        <Box className="p-4 md:p-8">
            <Stack gap="xl">
                <Box>
                    <Title order={1} className="text-3xl font-bold">Earnings Summary</Title>
                    <Text c="dimmed">Track your payouts and completed jobs.</Text>
                </Box>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                    <Paper p="xl" radius="xl" withBorder className="bg-green-600 text-white shadow-lg shadow-green-100">
                        <Group justify="space-between" mb="sm">
                            <ThemeIcon size={48} radius="lg" color="green.4" variant="filled">
                                <IconWallet size={24} />
                            </ThemeIcon>
                            <Badge color="green.8">Total Payout</Badge>
                        </Group>
                        <Title order={1}>${totalEarnings}</Title>
                        <Text size="sm" opacity={0.8}>Current Balance</Text>
                    </Paper>

                    <Paper p="xl" radius="xl" withBorder className="bg-white">
                        <Group justify="space-between" mb="xs">
                            <ThemeIcon size={48} radius="lg" color="blue" variant="light">
                                <IconChecklist size={24} />
                            </ThemeIcon>
                            <Text size="xs" fw={700} c="dimmed">COMPLETED</Text>
                        </Group>
                        <Title order={2}>{earnings.length}</Title>
                        <Text size="sm" c="dimmed">Finished Jobs</Text>
                    </Paper>

                    <Paper p="xl" radius="xl" withBorder className="bg-white">
                        <Group justify="space-between" mb="xs">
                            <ThemeIcon size={48} radius="lg" color="orange" variant="light">
                                <IconTrendingUp size={24} />
                            </ThemeIcon>
                            <Text size="xs" fw={700} c="dimmed">RATING</Text>
                        </Group>
                        <Title order={2}>4.9</Title>
                        <Text size="sm" c="dimmed">Performance Score</Text>
                    </Paper>
                </SimpleGrid>

                <Paper p="xl" radius="xl" withBorder className="bg-white overflow-hidden">
                    <Title order={4} mb="xl">Recent Transactions</Title>
                    <Table verticalSpacing="md" horizontalSpacing="lg">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Date</Table.Th>
                                <Table.Th>Client</Table.Th>
                                <Table.Th>Service</Table.Th>
                                <Table.Th>Amount</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {earnings.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td colSpan={5} className="text-center py-12 text-slate-400">No earnings history yet.</Table.Td>
                                </Table.Tr>
                            ) : (
                                earnings.map((job) => (
                                    <Table.Tr key={job.id}>
                                        <Table.Td>{job.completedAt?.toDate?.().toLocaleDateString()}</Table.Td>
                                        <Table.Td>{job.clientName}</Table.Td>
                                        <Table.Td tt="capitalize">{job.serviceType?.replace('_', ' ')}</Table.Td>
                                        <Table.Td fw={700} c="green.7">${job.price || 50}</Table.Td>
                                        <Table.Td><Badge color="green" variant="light">PAID</Badge></Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                </Paper>
            </Stack>
        </Box>
    );
}
