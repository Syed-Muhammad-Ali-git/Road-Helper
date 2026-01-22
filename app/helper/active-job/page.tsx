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
    Timeline
} from "@mantine/core";
import {
    IconMapPin,
    IconUser,
    IconPhone,
    IconCircleCheck,
    IconClock,
    IconNavigation,
    IconCheck
} from "@tabler/icons-react";
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";

export default function ActiveJob() {
    const [activeJob, setActiveJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "serviceRequests"),
            where("helperId", "==", user.uid),
            where("status", "in", ["accepted", "in_progress"])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setActiveJob({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            } else {
                setActiveJob(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const updateStatus = async (status: string) => {
        if (!activeJob) return;
        try {
            await updateDoc(doc(db, "serviceRequests", activeJob.id), {
                status: status,
                updatedAt: serverTimestamp(),
                ...(status === "completed" ? { completedAt: serverTimestamp() } : {})
            });
            toast.success(`Job status updated to ${status.replace('_', ' ')}`);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    if (loading) return <Box className="p-8 text-center"><Loader size="xl" /></Box>;

    if (!activeJob) {
        return (
            <Box className="p-4 md:p-8 flex items-center justify-center min-h-[70vh]">
                <Paper p="xl" radius="xl" withBorder className="text-center max-w-md bg-slate-50 border-dashed">
                    <ThemeIcon size={80} radius="xl" color="slate" variant="light" mb="md">
                        <IconClock size={40} />
                    </ThemeIcon>
                    <Title order={3} mb="xs">No Active Job</Title>
                    <Text c="dimmed" mb="xl">You don't have any ongoing jobs right now. Grab one from the requests panel!</Text>
                    <Button color="red" size="lg" radius="md" component="a" href="/helper/requests">
                        Find Nearby Jobs
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box className="p-4 md:p-8 max-w-4xl mx-auto">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Title order={1} className="text-3xl font-bold">Active Job</Title>
                    <Badge size="xl" color={activeJob.status === 'accepted' ? 'blue' : 'green'} variant="filled" p="lg">
                        {activeJob.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                </Group>

                <Paper p="xl" radius="xl" withBorder shadow="sm">
                    <Group justify="space-between" mb="xl">
                        <Group gap="md">
                            <Avatar size="xl" radius="md" color="blue">{activeJob.clientName?.charAt(0)}</Avatar>
                            <Box>
                                <Title order={3}>{activeJob.clientName}</Title>
                                <Group gap="xs">
                                    <IconPhone size={14} className="text-slate-400" />
                                    <Text size="sm" c="dimmed">{activeJob.clientPhone}</Text>
                                </Group>
                            </Box>
                        </Group>
                        <Button variant="light" color="blue" leftSection={<IconNavigation size={18} />}>
                            Get Directions
                        </Button>
                    </Group>

                    <Divider my="xl" />

                    <Stack gap="lg">
                        <Box>
                            <Text fw={700} size="sm" c="dimmed">LOCATION</Text>
                            <Text fw={600}>{activeJob.location}</Text>
                        </Box>
                        <Box>
                            <Text fw={700} size="sm" c="dimmed">VEHICLE DETAILS</Text>
                            <Text>{activeJob.vehicleDetails}</Text>
                        </Box>
                        <Box>
                            <Text fw={700} size="sm" c="dimmed">ISSUE DESCRIPTION</Text>
                            <Text className="bg-slate-50 p-4 rounded-xl italic">{activeJob.issueDescription}</Text>
                        </Box>
                    </Stack>

                    <Divider my="xl" />

                    <Timeline active={activeJob.status === 'accepted' ? 0 : 1} bulletSize={30} lineWidth={2}>
                        <Timeline.Item bullet={<IconCheck size={16} />} title="Request Accepted">
                            <Text size="xs" c="dimmed">You accepted this request</Text>
                        </Timeline.Item>
                        <Timeline.Item bullet={<IconNavigation size={16} />} title="In Progress">
                            <Text size="xs" c="dimmed">Work started or you are on your way</Text>
                        </Timeline.Item>
                        <Timeline.Item bullet={<IconCircleCheck size={16} />} title="Completed">
                            <Text size="xs" c="dimmed">Service delivered successfully</Text>
                        </Timeline.Item>
                    </Timeline>

                    <Group grow mt="xl">
                        {activeJob.status === 'accepted' && (
                            <Button
                                color="blue"
                                size="lg"
                                radius="md"
                                onClick={() => updateStatus('in_progress')}
                            >
                                Start Service
                            </Button>
                        )}
                        {activeJob.status === 'in_progress' && (
                            <Button
                                color="green"
                                size="lg"
                                radius="md"
                                onClick={() => updateStatus('completed')}
                            >
                                Mark as Completed
                            </Button>
                        )}
                    </Group>
                </Paper>
            </Stack>
        </Box>
    );
}
