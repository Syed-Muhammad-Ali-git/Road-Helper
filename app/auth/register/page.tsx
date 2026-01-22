"use client";

import React, { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Anchor,
    Stack,
    SegmentedControl,
    Box,
    Image,
    Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Link from "next/link";

const registerSchema = z.object({
    fullName: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Invalid phone number"),
    role: z.enum(["client", "helper"]),
    serviceType: z.string().optional(),
});

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState("client");

    const form = useForm({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
            role: "client",
            serviceType: "",
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const collection = values.role === "client" ? "users" : "helpers";
            const data: any = {
                uid: user.uid,
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                role: values.role,
                createdAt: new Date().toISOString(),
            };

            if (values.role === "helper") {
                data.serviceType = values.serviceType;
                data.isOnline = false;
                data.rating = 5.0;
                data.totalJobs = 0;
                data.isVerified = false;
            }

            await setDoc(doc(db, collection, user.uid), data);

            toast.success("Account created successfully!");
            setTimeout(() => {
                router.push(values.role === "client" ? "/client/dashboard" : "/helper/dashboard");
            }, 2000);
        } catch (error: any) {
            toast.error(error.message || "Failed to register");
        }
    };

    return (
        <Box className="min-h-screen flex bg-[#F8FAFC]">
            {/* Left Form Side */}
            <Box className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-r-[40px] shadow-2xl z-20">
                <Container size={450} className="w-full">
                    <Box className="mb-8">
                        <Image src="/assets/images/logo.jpg" alt="Road Helper Logo" w={120} mb="md" />
                        <Title order={2} className="text-3xl font-bold text-slate-800">Create Account</Title>
                        <Text c="dimmed" size="sm" mt={5}>
                            Already have an account?{' '}
                            <Anchor size="sm" component={Link} href="/auth/login" className="font-semibold text-blue-600">
                                Login here
                            </Anchor>
                        </Text>
                    </Box>

                    <Box className="mb-8">
                        <Text size="sm" fw={500} mb={8} c="slate.7">Register as:</Text>
                        <SegmentedControl
                            fullWidth
                            size="md"
                            value={form.values.role}
                            onChange={(value) => {
                                setRole(value);
                                form.setFieldValue("role", value as "client" | "helper");
                            }}
                            data={[
                                { label: 'Client (Need Help)', value: 'client' },
                                { label: 'Helper (Provider)', value: 'helper' },
                            ]}
                            classNames={{
                                root: "bg-slate-100 p-1 rounded-xl",
                                indicator: "bg-white shadow-sm rounded-lg",
                                label: "font-semibold"
                            }}
                        />
                    </Box>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Full Name"
                                placeholder="John Doe"
                                required
                                {...form.getInputProps("fullName")}
                                classNames={{ input: "h-12 rounded-lg", label: "mb-1 font-medium" }}
                            />

                            <TextInput
                                label="Email Address"
                                placeholder="john@example.com"
                                required
                                {...form.getInputProps("email")}
                                classNames={{ input: "h-12 rounded-lg", label: "mb-1 font-medium" }}
                            />

                            <TextInput
                                label="Phone Number"
                                placeholder="+1234567890"
                                required
                                {...form.getInputProps("phone")}
                                classNames={{ input: "h-12 rounded-lg", label: "mb-1 font-medium" }}
                            />

                            {form.values.role === "helper" && (
                                <Select
                                    label="Primary Service"
                                    placeholder="Select service type"
                                    required
                                    data={[
                                        { value: "bike_mechanic", label: "Bike Mechanic" },
                                        { value: "car_mechanic", label: "Car Mechanic" },
                                        { value: "fuel_delivery", label: "Fuel Delivery" },
                                        { value: "towing", label: "Towing Service" },
                                    ]}
                                    {...form.getInputProps("serviceType")}
                                    classNames={{ input: "h-12 rounded-lg", label: "mb-1 font-medium" }}
                                />
                            )}

                            <PasswordInput
                                label="Password"
                                placeholder="Min 6 characters"
                                required
                                {...form.getInputProps("password")}
                                classNames={{ input: "h-12 rounded-lg", label: "mb-1 font-medium" }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg h-12 mt-6 shadow-md transition-all active:scale-95"
                            >
                                Register Now
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Box>

            {/* Right Decoration Side */}
            <Box className="hidden lg:flex flex-1 relative overflow-hidden bg-[#1E293B] items-center justify-center p-12">
                <Box className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Image src="/assets/images/ui-design.jpg" alt="Background" h="100%" w="100%" fit="cover" />
                </Box>
                <Stack align="center" gap="xl" className="z-10 text-white text-center">
                    <Title order={1} className="text-5xl font-bold tracking-tight">Become a Hero</Title>
                    <Text className="text-xl text-slate-300 max-w-md">
                        Help people on the move and earn while you grow your service business.
                    </Text>
                    <Box className="grid grid-cols-2 gap-4 mt-8">
                        <Paper p="md" radius="lg" bg="rgba(255,255,255,0.05)" className="border border-white/10 backdrop-blur-md">
                            <Text fw={700} size="xl" c="white">10k+</Text>
                            <Text size="xs" c="slate.4">Active Users</Text>
                        </Paper>
                        <Paper p="md" radius="lg" bg="rgba(255,255,255,0.05)" className="border border-white/10 backdrop-blur-md">
                            <Text fw={700} size="xl" c="white">500+</Text>
                            <Text size="xs" c="slate.4">Top Helpers</Text>
                        </Paper>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
