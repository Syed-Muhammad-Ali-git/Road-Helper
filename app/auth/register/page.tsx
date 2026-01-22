"use client";

import React, { useState } from "react";
import {
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Container,
    Group,
    Anchor,
    Stack,
    Box,
    Image,
    LoadingOverlay,
    SegmentedControl,
    Select
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { registerUserAction } from "@/redux/actions/auth-action";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
    fullName: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Invalid phone number"),
    role: z.enum(["client", "helper"]),
    serviceType: z.string().optional(),
}).refine((data) => {
    if (data.role === "helper" && !data.serviceType) return false;
    return true;
}, {
    message: "Service type is required for helpers",
    path: ["serviceType"]
});

export default function RegisterPage() {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.auth);

    const form = useForm({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            phone: "",
            role: "client" as "client" | "helper",
            serviceType: "",
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(registerUserAction(values));
            toast.success("Account created successfully!");
            router.replace("/");
        } catch (err: any) {
            toast.error(err.message || "Registration failed");
        }
    };

    return (
        <Box className="min-h-screen flex bg-slate-50">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-r-[60px] shadow-2xl z-20 relative order-2 lg:order-1"
            >
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} loaderProps={{ variant: 'bars' }} />

                <Container size={450} className="w-full">
                    <Box className="mb-8">
                        <Title order={2} className="text-4xl font-black text-slate-800 tracking-tight">Register</Title>
                        <Text c="dimmed" size="md" mt={5}>
                            Already have an account?{' '}
                            <Anchor size="md" component={Link} href="/auth/login" className="font-bold text-blue-600">
                                Login here
                            </Anchor>
                        </Text>
                    </Box>

                    <Box className="mb-8">
                        <Text size="sm" fw={700} mb={8} c="slate.8" tt="uppercase">Register as:</Text>
                        <SegmentedControl
                            fullWidth
                            size="md"
                            value={form.values.role}
                            onChange={(value) => form.setFieldValue("role", value as any)}
                            data={[
                                { label: 'Client (User)', value: 'client' },
                                { label: 'Helper (Provider)', value: 'helper' },
                            ]}
                            classNames={{
                                root: "bg-slate-100 p-1 rounded-xl",
                                indicator: "bg-white shadow-md rounded-lg",
                                label: "font-bold"
                            }}
                        />
                    </Box>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="md">
                            <TextInput
                                label="Full Name"
                                placeholder="John Doe"
                                required
                                size="md"
                                radius="md"
                                {...form.getInputProps("fullName")}
                            />

                            <Group grow>
                                <TextInput
                                    label="Email"
                                    placeholder="john@example.com"
                                    required
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps("email")}
                                />
                                <TextInput
                                    label="Phone"
                                    placeholder="+1234567890"
                                    required
                                    size="md"
                                    radius="md"
                                    {...form.getInputProps("phone")}
                                />
                            </Group>

                            <AnimatePresence mode="wait">
                                {form.values.role === "helper" && (
                                    <motion.div
                                        key="helper-fields"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <Select
                                            label="Primary Service Type"
                                            placeholder="Choose your expertise"
                                            required
                                            size="md"
                                            radius="md"
                                            data={[
                                                { value: "bike_mechanic", label: "Bike Mechanic" },
                                                { value: "car_mechanic", label: "Car Mechanic" },
                                                { value: "fuel_delivery", label: "Fuel Delivery" },
                                                { value: "towing", label: "Towing Service" },
                                            ]}
                                            {...form.getInputProps("serviceType")}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <PasswordInput
                                label="Password"
                                placeholder="Min 6 characters"
                                required
                                size="md"
                                radius="md"
                                {...form.getInputProps("password")}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                radius="md"
                                className="bg-blue-600 hover:bg-blue-700 h-14 mt-6 shadow-lg transition-all"
                            >
                                Create Account
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex flex-1 relative overflow-hidden bg-[#1E293B] items-center justify-center p-12 order-1 lg:order-2"
            >
                <Box className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Image src="/assets/images/logo.jpg" alt="Background" h="100%" w="100%" fit="cover" />
                </Box>
                <Stack align="center" gap="xl" className="z-10 text-white text-center">
                    <Title order={1} className="text-6xl font-black tracking-tight leading-tight">Join the <br /> <span className="text-red-500">HEROES</span></Title>
                    <Text className="text-xl text-slate-300 max-w-md">
                        Whether you need help or want to provide it, Road Helper is your platform for reliability.
                    </Text>
                </Stack>
            </motion.div>
        </Box>
    );
}
