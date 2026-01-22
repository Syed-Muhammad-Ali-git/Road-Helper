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
    ActionIcon
} from "@mantine/core";
import {
    IconCar,
    IconBike,
    IconDroplet,
    IconTruck,
    IconMapPin,
    IconArrowRight
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";

const serviceCategories = [
    {
        title: "Car Mechanic",
        icon: IconCar,
        color: "blue",
        desc: "Breakdown, tire change, jump start",
        id: "car_mechanic"
    },
    {
        title: "Bike Mechanic",
        icon: IconBike,
        color: "orange",
        desc: "Puncture repair, chain help, etc.",
        id: "bike_mechanic"
    },
    {
        title: "Fuel Delivery",
        icon: IconDroplet,
        color: "red",
        desc: "Ran out of gas? We'll bring fuel.",
        id: "fuel_delivery"
    },
    {
        title: "Towing Service",
        icon: IconTruck,
        color: "grape",
        desc: "Safe towing to nearest garage.",
        id: "towing"
    },
];

export default function ClientDashboard() {
    const { userData } = useSelector((state: RootState) => state.auth);

    return (
        <Box className="p-4 md:p-8">
            <Stack gap="xl">
                <Box>
                    <Title order={1} className="text-3xl font-bold text-slate-800">
                        Hello, {userData?.fullName?.split(' ')[0]} 👋
                    </Title>
                    <Text c="dimmed" size="lg">Need roadside assistance? Select a service below.</Text>
                </Box>

                <Paper p="xl" radius="xl" bg="blue.6" className="relative overflow-hidden">
                    <Box className="relative z-10 text-white max-w-md">
                        <Title order={2} mb="xs">Quick Emergency?</Title>
                        <Text mb="xl" size="lg" opacity={0.9}>
                            Our nearest helpers are just 10-15 minutes away from your current location.
                        </Text>
                        <Button
                            variant="white"
                            color="blue"
                            size="lg"
                            radius="md"
                            leftSection={<IconMapPin size={20} />}
                            component={Link}
                            href="/client/request-help"
                        >
                            Request Immediate Help
                        </Button>
                    </Box>
                    <Box className="absolute right-[-20px] bottom-[-40px] opacity-20 hidden md:block">
                        <IconTruck size={240} color="white" />
                    </Box>
                </Paper>

                <Box>
                    <Title order={3} mb="lg" className="text-slate-700">Explore Services</Title>
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                        {serviceCategories.map((service) => (
                            <Paper
                                key={service.id}
                                p="xl"
                                radius="xl"
                                withBorder
                                className="hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                component={Link}
                                href={`/client/request-help?type=${service.id}`}
                            >
                                <ThemeIcon size={56} radius="xl" color={service.color} variant="light" mb="md">
                                    <service.icon size={28} />
                                </ThemeIcon>
                                <Title order={4} mb={4} className="group-hover:text-blue-600 transition-colors">{service.title}</Title>
                                <Text size="sm" c="dimmed" mb="lg">{service.desc}</Text>
                                <Group justify="end">
                                    <ActionIcon variant="transparent">
                                        <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </ActionIcon>
                                </Group>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </Box>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                    <Paper p="xl" radius="xl" withBorder>
                        <Title order={4} mb="lg">Recent Activity</Title>
                        <Stack gap="md">
                            <Text c="dimmed" size="sm" ta="center" py="xl">No recent requests found.</Text>
                        </Stack>
                    </Paper>

                    <Paper p="xl" radius="xl" withBorder className="bg-slate-50 border-dashed">
                        <Title order={4} mb="lg">Safety Tips</Title>
                        <Stack gap="sm">
                            <Paper p="md" bg="white" radius="md" className="border border-slate-100">
                                <Text fw={600} size="sm">1. Stay with your vehicle</Text>
                                <Text size="xs" c="dimmed">Unless it's unsafe, always stay near your car or bike.</Text>
                            </Paper>
                            <Paper p="md" bg="white" radius="md" className="border border-slate-100">
                                <Text fw={600} size="sm">2. Use hazard lights</Text>
                                <Text size="xs" c="dimmed">Signal clearly to other drivers that you are stationary.</Text>
                            </Paper>
                        </Stack>
                    </Paper>
                </SimpleGrid>
            </Stack>
        </Box>
    );
}

