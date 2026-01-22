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
    Box,
    Image,
    LoadingOverlay
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { loginUserAction } from "@/redux/actions/auth-action";
import { motion } from "framer-motion";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: zodResolver(schema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await dispatch(loginUserAction(values));
            toast.success("Welcome back to Road Helper!");
            router.replace("/");
        } catch (err: any) {
            toast.error(err.message || "An error occurred during login");
        }
    };

    return (
        <Box className="min-h-screen flex bg-slate-50">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex flex-1 relative overflow-hidden bg-[#1a237e] items-center justify-center p-12"
            >
                <Box className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <Image src="/assets/images/ui-design.jpg" alt="Background" h="100%" w="100%" fit="cover" />
                </Box>
                <Stack align="center" gap="xl" className="z-10 text-white text-center">
                    <Title order={1} className="text-6xl font-black tracking-tight leading-tight">
                        Your Roadside <br /> <span className="text-blue-400">Guardian</span>
                    </Title>
                    <Text className="text-xl text-slate-300 max-w-md font-medium">
                        Instant assistance for car and bike emergencies, powered by verified local experts.
                    </Text>
                </Stack>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-l-[60px] shadow-2xl z-20 relative"
            >
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} loaderProps={{ variant: 'bars' }} />

                <Container size={420} className="w-full">
                    <Box className="mb-10">
                        <Group gap="xs" mb="lg">
                            <Box className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Text fw={900} c="white">RH</Text>
                            </Box>
                            <Text fw={900} size="xl" className="tracking-tighter">ROAD HELPER</Text>
                        </Group>
                        <Title order={2} className="text-4xl font-black text-slate-800 tracking-tight">Login</Title>
                        <Text c="dimmed" size="md" mt={5}>
                            Unlock smarter roadside help.{' '}
                            <Anchor size="md" component={Link} href="/auth/register" className="font-bold text-blue-600">
                                Create an account
                            </Anchor>
                        </Text>
                    </Box>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack gap="lg">
                            <TextInput
                                label="Email Address"
                                placeholder="hello@example.com"
                                required
                                size="lg"
                                radius="md"
                                {...form.getInputProps("email")}
                            />
                            <PasswordInput
                                label="Password"
                                placeholder="••••••••"
                                required
                                size="lg"
                                radius="md"
                                {...form.getInputProps("password")}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                radius="md"
                                className="bg-blue-600 hover:bg-blue-700 h-14 mt-4 shadow-lg active:scale-[0.98] transition-all"
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </form>

                    <Text ta="center" mt="xl" size="xs" c="dimmed" className="uppercase font-bold tracking-widest">
                        Security Insured by Firebase
                    </Text>
                </Container>
            </motion.div>
        </Box>
    );
}
