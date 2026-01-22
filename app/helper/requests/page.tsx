"use client";

import React, { useEffect, useState } from "react";
import {
    Title,
    Text,
    Paper,
    Stack,
    Box,
    Group,
    Button,
    Badge,
    Loader,
    SimpleGrid,
    ThemeIcon,
    Avatar
} from "@mantine/core";
import {
    IconMapPin,
    IconUser,
    IconPhone,
    IconAlertCircle,
    IconCheck
} from "@tabler/icons-react";
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";

export default function NearbyRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, userData } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!userData?.serviceType) return;

        const q = query(
            collection(db, "serviceRequests"),
            where("status", "==", "pending"),
            where("serviceType", "==", userData.serviceType)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userData]);

    const acceptRequest = async (requestId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "serviceRequests", requestId), {
                status: "accepted",
                helperId: user.uid,
                helperName: userData?.fullName,
                helperPhone: userData?.phone,
                acceptedAt: serverTimestamp(),
            });
            toast.success("Request accepted! Go to 'Active Job' to track.");
        } catch (error) {
            toast.error("Failed to accept request.");
        }
    };

    if (loading) return <Box className="p-8"><Loader size="xl" /></Box>;

    return (
        <Box className="p-4 md:p-8">
            <Stack gap="xl">
                <Box>
                    <Title order={1} className="text-3xl font-bold text-slate-800">Available Jobs</Title>
                    <Text c="dimmed">Nearby clients needing your assistance.</Text>
                </Box>

                {requests.length === 0 ? (
                    <Paper p="xl" radius="xl" withBorder className="bg-slate-50 border-dashed py-20">
                        <Stack align="center" gap="sm">
                            <ThemeIcon size={60} radius="xl" color="slate" variant="light">
                                <IconAlertCircle size={30} />
                            </ThemeIcon>
                            <Text fw={600}>No requests in your area right now.</Text>
                            <Text size="sm" c="dimmed">Jobs matching your service ({userData?.serviceType?.replace('_', ' ')}) will appear here.</Text>
                        </Stack>
                    </Paper>
                ) : (
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                        {requests.map((req) => (
                            <Paper key={req.id} p="xl" radius="xl" withBorder className="hover:shadow-md transition-shadow">
                                <Group justify="space-between" mb="md">
                                    <Badge size="lg" color="red" variant="filled">PENDING</Badge>
                                    <Text size="xs" c="dimmed">{req.createdAt?.toDate?.()?.toLocaleString()}</Text>
                                </Group>

                                <Stack gap="md">
                                    <Group gap="md">
                                        <Avatar color="blue" radius="xl">{req.clientName?.charAt(0)}</Avatar>
                                        <Box>
                                            <Text fw={700}>{req.clientName}</Text>
                                            <Text size="sm" c="dimmed">{req.vehicleDetails}</Text>
                                        </Box>
                                    </Group>

                                    <Group gap="xs">
                                        <IconMapPin size={18} className="text-blue-600" />
                                        <Text size="sm" fw={600}>{req.location}</Text>
                                    </Group>

                                    <Paper p="md" radius="lg" bg="slate.0" withBorder>
                                        <Text size="sm" lineClamp={3}>{req.issueDescription}</Text>
                                    </Paper>

                                    <Group mt="md">
                                        <Button
                                            className="bg-green-600 flex-1 h-12 rounded-xl"
                                            leftSection={<IconCheck size={20} />}
                                            onClick={() => acceptRequest(req.id)}
                                            disabled={!userData?.isOnline}
                                        >
                                            Accept Request
                                        </Button>
                                        {!userData?.isOnline && (
                                            <Text size="xs" c="red" fw={600}>Go Online to accept</Text>
                                        )}
                                    </Group>
                                </Stack>
                            </Paper>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </Box>
    );
}
