"use client";

import React from "react";
import {
    Title,
    Text,
    Paper,
    Stack,
    Box,
    Avatar,
    TextInput,
    Button,
    Group,
    Divider,
    Select
} from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IconUser, IconPhone, IconMail, IconCamera, IconTool } from "@tabler/icons-react";

export default function HelperProfilePage() {
    const { userData } = useSelector((state: RootState) => state.auth);

    return (
        <Box className="p-4 md:p-8 max-w-2xl mx-auto">
            <Stack gap="xl">
                <Title order={1}>Helper Profile</Title>

                <Paper p="xl" radius="xl" withBorder className="text-center shadow-sm">
                    <Box className="relative inline-block mx-auto mb-lg">
                        <Avatar size={120} radius="xl" color="red">
                            {userData?.fullName?.charAt(0)}
                        </Avatar>
                        <Box className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-100 cursor-pointer">
                            <IconCamera size={20} className="text-red-600" />
                        </Box>
                    </Box>
                    <Title order={2}>{userData?.fullName}</Title>
                    <Text c="dimmed" fw={700}>VERIFIED HELPER</Text>
                </Paper>

                <Paper p="xl" radius="xl" withBorder shadow="sm">
                    <Stack gap="md">
                        <TextInput
                            label="Full Name"
                            value={userData?.fullName || ""}
                            disabled
                            leftSection={<IconUser size={18} />}
                        />
                        <TextInput
                            label="Email Address"
                            value={userData?.email || ""}
                            disabled
                            leftSection={<IconMail size={18} />}
                        />
                        <TextInput
                            label="Phone Number"
                            value={userData?.phone || ""}
                            disabled
                            leftSection={<IconPhone size={18} />}
                        />
                        <Select
                            label="Primary Service"
                            value={userData?.serviceType || ""}
                            disabled
                            data={[
                                { value: "bike_mechanic", label: "Bike Mechanic" },
                                { value: "car_mechanic", label: "Car Mechanic" },
                                { value: "fuel_delivery", label: "Fuel Delivery" },
                                { value: "towing", label: "Towing Service" },
                            ]}
                            leftSection={<IconTool size={18} />}
                        />

                        <Divider my="md" label="Security" labelPosition="center" />

                        <Button variant="light" color="red" fullWidth h={48} radius="md">
                            Change Password
                        </Button>
                        <Button variant="filled" color="red" fullWidth h={48} radius="md">
                            Update Profile
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
}
