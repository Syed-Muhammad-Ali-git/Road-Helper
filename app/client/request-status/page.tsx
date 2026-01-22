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
    ThemeIcon,
    Avatar,
    Divider,
    Timeline,
    rem,
    Rating
} from "@mantine/core";
import {
    IconMapPin,
    IconUser,
    IconPhone,
    IconCircleCheck,
    IconClock,
    IconSearch,
    IconCheck,
    IconStar,
    IconArrowLeft
} from "@tabler/icons-react";
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

export default function RequestStatus() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");
    const router = useRouter();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (!requestId) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(doc(db, "serviceRequests", requestId), (docSnap) => {
            if (docSnap.exists()) {
                setRequest({ id: docSnap.id, ...docSnap.data() });
            } else {
                setRequest(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [requestId]);

    const submitRating = async () => {
        if (!requestId || rating === 0) return;
        try {
            await updateDoc(doc(db, "serviceRequests", requestId), {
                rating: rating,
                ratedAt: serverTimestamp(),
            });
            // Also update helper rating in a real app (omitted for brevity but mentioned)
            toast.success("Thank you for your feedback!");
        } catch (error) {
            toast.error("Failed to submit rating.");
        }
    };

    if (loading) return <Box className="p-8 text-center"><Loader size="xl" /></Box>;

    if (!request) {
        return (
            <Box className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[70vh]">
                <Title order={3}>Request Not Found</Title>
                <Button mt="lg" component={Link} href="/client/dashboard">Back to Dashboard</Button>
            </Box>
        );
    }

    const getActiveStep = () => {
        switch (request.status) {
            case 'pending': return 0;
            case 'accepted': return 1;
            case 'in_progress': return 2;
            case 'completed': return 3;
            default: return 0;
        }
    };

    return (
        <Box className="p-4 md:p-8 max-w-4xl mx-auto">
            <Stack gap="xl">
                <Group>
                    <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} component={Link} href="/client/dashboard">
                        Dashboard
                    </Button>
                    <Title order={1} className="text-3xl font-bold">Request Status</Title>
                </Group>

                <Paper p="xl" radius="xl" withBorder className="relative overflow-hidden">
                    <Box className="absolute top-0 right-0 p-6">
                        <Badge size="xl" color={request.status === 'completed' ? 'green' : request.status === 'pending' ? 'orange' : 'blue'} variant="filled">
                            {request.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                    </Box>

                    <Stack gap="xl">
                        <Box>
                            <Text fw={700} size="sm" c="dimmed" mb={4}>SERVICE TYPE</Text>
                            <Title order={3}>{request.serviceType?.replace('_', ' ').toUpperCase()}</Title>
                        </Box>

                        <Timeline active={getActiveStep()} bulletSize={40} lineWidth={3}>
                            <Timeline.Item bullet={<IconSearch size={22} />} title="Finding Helper">
                                <Text size="sm" c="dimmed">Your request is visible to nearby verified helpers.</Text>
                                <Text size="xs" mt={4}>{request.createdAt?.toDate?.().toLocaleTimeString()}</Text>
                            </Timeline.Item>

                            <Timeline.Item bullet={<IconUser size={22} />} title="Helper Assigned">
                                <Text size="sm" c="dimmed">
                                    {request.helperName ? `${request.helperName} has accepted your request!` : 'Waiting for a helper to accept...'}
                                </Text>
                            </Timeline.Item>

                            <Timeline.Item bullet={<IconClock size={22} />} title="Service in Progress">
                                <Text size="sm" c="dimmed">Helper is on the way or working on your vehicle.</Text>
                            </Timeline.Item>

                            <Timeline.Item bullet={<IconCircleCheck size={22} />} title="Job Completed">
                                <Text size="sm" c="dimmed">Service has been delivered successfully.</Text>
                            </Timeline.Item>
                        </Timeline>

                        {request.status === 'completed' && !request.rating && (
                            <Paper p="lg" radius="lg" bg="blue.0" withBorder>
                                <Stack align="center" gap="sm">
                                    <Text fw={700}>How was the service?</Text>
                                    <Rating value={rating} onChange={setRating} size="xl" />
                                    <Button variant="filled" color="blue" onClick={submitRating} disabled={rating === 0}>
                                        Submit Rating
                                    </Button>
                                </Stack>
                            </Paper>
                        )}

                        {request.helperName && (
                            <Paper p="lg" radius="lg" withBorder>
                                <Group justify="space-between">
                                    <Group>
                                        <Avatar size="lg" radius="xl" color="blue">{request.helperName.charAt(0)}</Avatar>
                                        <Box>
                                            <Text fw={700}>{request.helperName}</Text>
                                            <Text size="xs" c="dimmed">Assigned Helper</Text>
                                        </Box>
                                    </Group>
                                    <Button
                                        variant="light"
                                        color="green"
                                        leftSection={<IconPhone size={18} />}
                                        component="a"
                                        href={`tel:${request.helperPhone}`}
                                    >
                                        Contact Helper
                                    </Button>
                                </Group>
                            </Paper>
                        )}
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}
