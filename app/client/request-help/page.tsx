"use client";

import React, { useState, useEffect } from "react";
import {
    Title,
    Text,
    Paper,
    Stack,
    TextInput,
    Textarea,
    Button,
    Box,
    Group,
    Select,
    Stepper,
    rem,
    ThemeIcon,
    SimpleGrid
} from "@mantine/core";
import {
    IconMapPin,
    IconCar,
    IconMessage2,
    IconCheck,
    IconCircleCheck
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";

const requestSchema = z.object({
    serviceType: z.string().min(1, "Please select a service"),
    location: z.string().min(3, "Location is required"),
    vehicleDetails: z.string().min(3, "Vehicle details are required"),
    issueDescription: z.string().min(5, "Please describe the issue"),
});

export default function RequestHelpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, userData } = useSelector((state: RootState) => state.auth);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            serviceType: searchParams.get("type") || "",
            location: "",
            vehicleDetails: "",
            issueDescription: "",
        },
        validate: zodResolver(requestSchema),
    });

    const nextStep = () => {
        const { hasErrors } = form.validate();
        if (!hasErrors) setActive((current) => (current < 2 ? current + 1 : current));
    };

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleSubmit = async (values: typeof form.values) => {
        if (!user) return;
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "serviceRequests"), {
                ...values,
                clientId: user.uid,
                clientName: userData?.fullName,
                clientPhone: userData?.phone,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            toast.success("Request sent successfully!");
            setActive(3); // Completion step
            setTimeout(() => {
                router.push(`/client/request-status?id=${docRef.id}`);
            }, 3000);
        } catch (error) {
            toast.error("Failed to send request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="p-4 md:p-8 max-w-4xl mx-auto">
            <Paper p="xl" radius="xl" withBorder className="shadow-sm">
                <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} color="blue">
                    <Stepper.Step
                        label="Service"
                        description="What do you need?"
                        icon={<IconCar size={rem(18)} />}
                    >
                        <Stack gap="xl" mt="xl">
                            <Select
                                label="Emergency Service Type"
                                placeholder="Select service"
                                required
                                size="md"
                                data={[
                                    { value: "bike_mechanic", label: "Bike Mechanic" },
                                    { value: "car_mechanic", label: "Car Mechanic" },
                                    { value: "fuel_delivery", label: "Fuel Delivery" },
                                    { value: "towing", label: "Towing Service" },
                                ]}
                                {...form.getInputProps("serviceType")}
                            />
                            <TextInput
                                label="Current Location"
                                placeholder="Enter street name, landmark or area"
                                required
                                size="md"
                                leftSection={<IconMapPin size={18} />}
                                {...form.getInputProps("location")}
                            />
                        </Stack>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Details"
                        description="Vehicle & Issue"
                        icon={<IconMessage2 size={rem(18)} />}
                    >
                        <Stack gap="xl" mt="xl">
                            <TextInput
                                label="Vehicle Information"
                                placeholder="e.g. Honda Civic Red (ABC-123)"
                                required
                                size="md"
                                {...form.getInputProps("vehicleDetails")}
                            />
                            <Textarea
                                label="Issue Description"
                                placeholder="Briefly describe what happened..."
                                required
                                size="md"
                                minRows={4}
                                {...form.getInputProps("issueDescription")}
                            />
                        </Stack>
                    </Stepper.Step>

                    <Stepper.Step
                        label="Confirm"
                        description="Review & Send"
                        icon={<IconCheck size={rem(18)} />}
                    >
                        <Stack gap="md" mt="xl">
                            <Title order={4}>Review Your Request</Title>
                            <SimpleGrid cols={2}>
                                <Box>
                                    <Text fw={700} size="sm" c="dimmed">Service Type</Text>
                                    <Text>{form.values.serviceType.replace('_', ' ')}</Text>
                                </Box>
                                <Box>
                                    <Text fw={700} size="sm" c="dimmed">Location</Text>
                                    <Text>{form.values.location}</Text>
                                </Box>
                                <Box mt="md">
                                    <Text fw={700} size="sm" c="dimmed">Vehicle</Text>
                                    <Text>{form.values.vehicleDetails}</Text>
                                </Box>
                            </SimpleGrid>
                            <Box mt="md">
                                <Text fw={700} size="sm" c="dimmed">Description</Text>
                                <Text fs="italic">{form.values.issueDescription}</Text>
                            </Box>
                        </Stack>
                    </Stepper.Step>

                    <Stepper.Completed>
                        <Stack align="center" gap="md" py="xl">
                            <ThemeIcon size={80} radius="xl" color="green" variant="light">
                                <IconCircleCheck size={50} />
                            </ThemeIcon>
                            <Title order={2}>Request Sent!</Title>
                            <Text ta="center" c="dimmed">
                                We are searching for the nearest helpers. <br />
                                Redirecting you to the status tracking page...
                            </Text>
                        </Stack>
                    </Stepper.Completed>
                </Stepper>

                {active < 3 && (
                    <Group justify="center" mt="xl">
                        {active !== 0 && (
                            <Button variant="default" onClick={prevStep} size="md">
                                Back
                            </Button>
                        )}
                        {active < 2 ? (
                            <Button onClick={nextStep} size="md" className="bg-blue-600">Next step</Button>
                        ) : (
                            <Button
                                onClick={() => form.onSubmit(handleSubmit)()}
                                loading={loading}
                                size="md"
                                className="bg-red-600"
                            >
                                Send Help Request
                            </Button>
                        )}
                    </Group>
                )}
            </Paper>
        </Box>
    );
}
