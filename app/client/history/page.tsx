"use client";

import React, { useEffect, useState } from "react";
import {
    Title,
    Text,
    Paper,
    Stack,
    Box,
    Group,
    Badge,
    Loader,
    Table,
    Button
} from "@mantine/core";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function ServiceHistory() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "serviceRequests"),
                    where("clientId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) return <Box className="p-8 text-center"><Loader size="xl" /></Box>;

    return (
        <Box className="p-4 md:p-8">
            <Stack gap="xl">
                <Box>
                    <Title order={1} className="text-3xl font-bold">Service History</Title>
                    <Text c="dimmed">Track all your past help requests.</Text>
                </Box>

                {history.length === 0 ? (
                    <Paper p="xl" radius="xl" withBorder py={60} className="text-center bg-slate-50 border-dashed">
                        <Text c="dimmed">You haven't made any requests yet.</Text>
                        <Button mt="md" component={Link} href="/client/request-help">Get Help Now</Button>
                    </Paper>
                ) : (
                    <Paper p="md" radius="xl" withBorder className="overflow-hidden">
                        <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Service</Table.Th>
                                    <Table.Th>Helper</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Action</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {history.map((req) => (
                                    <Table.Tr key={req.id}>
                                        <Table.Td>
                                            <Text size="sm">{req.createdAt?.toDate?.()?.toLocaleDateString()}</Text>
                                            <Text size="xs" c="dimmed">{req.createdAt?.toDate?.()?.toLocaleTimeString()}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={600} tt="capitalize">{req.serviceType?.replace('_', ' ')}</Text>
                                            <Text size="xs" c="dimmed" lineClamp={1}>{req.location}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{req.helperName || '—'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={req.status === 'completed' ? 'green' : req.status === 'pending' ? 'orange' : 'blue'}
                                                variant="light"
                                            >
                                                {req.status?.replace('_', ' ')}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Button
                                                variant="subtle"
                                                size="xs"
                                                component={Link}
                                                href={`/client/request-status?id=${req.id}`}
                                            >
                                                View
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                )}
            </Stack>
        </Box>
    );
}
