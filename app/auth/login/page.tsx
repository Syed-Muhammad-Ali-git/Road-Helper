"use client";

import React from "react";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Anchor,
    Stack,
    Divider,
    ActionIcon,
    Image,
    Box
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Link from "next/link";

const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
});

export default function LoginPage() {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        validate: zodResolver(schema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // Check role
            const clientDoc = await getDoc(doc(db, "users", user.uid));
            if (clientDoc.exists()) {
                router.push("/client/dashboard");
                return;
            }

            const helperDoc = await getDoc(doc(db, "helpers", user.uid));
            if (helperDoc.exists()) {
                router.push("/helper/dashboard");
                return;
            }

            toast.error("User profile not found. Please contact support.");
        } catch (error: any) {
            toast.error(error.message || "Failed to login");
        }
    };

    return (
        <Box className="min-h-screen flex bg-[#F8FAFC]">
            {/* Left Decoration Side */}
            <Box className="hidden lg:flex flex-1 relative overflow-hidden bg-[#1E293B] items-center justify-center p-12">
                <Box className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <Image src="/assets/images/ui-design.jpg" alt="Background" h="100%" w="100%" fit="cover" />
                </Box>
                <Stack align="center" gap="xl" className="z-10 text-white text-center">
                    <Image src="/assets/images/logo.jpg" alt="Road Helper Logo" w={200} />
                    <Title order={1} className="text-5xl font-bold tracking-tight">Fixing the way forward</Title>
                    <Text className="text-xl text-slate-300 max-w-md">
                        Join thousands of users getting instant roadside assistance anywhere, anytime.
                    </Text>
                </Stack>
            </Box>

            {/* Right Form Side */}
            <Box className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-l-[40px] shadow-2xl z-20">
                <Container size={420} className="w-full">
                    <Box className="lg:hidden mb-12 flex flex-col items-center">
                        <Image src="/assets/images/logo.jpg" alt="Road Helper Logo" w={150} />
                        <Title order={2} className="mt-4 font-bold text-slate-800">Welcome Back</Title>
                    </Box>

                    <Box className="hidden lg:block mb-10">
                        <Title order={2} className="text-3xl font-bold text-slate-800">Welcome Back</Title>
                        <Text c="dimmed" size="sm" mt={5}>
                            Don&apos;t have an account?{' '}
                            <Anchor size="sm" component={Link} href="/auth/register" className="font-semibold text-blue-600">
                                Create account
                            </Anchor>
                        </Text>
                    </Box>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <TextInput
                                label="Email Address"
                                placeholder="hello@roadhelper.com"
                                required
                                size="md"
                                {...form.getInputProps("email")}
                                classNames={{
                                    input: "focus:border-blue-500 rounded-lg h-12",
                                    label: "mb-1 font-medium text-slate-700"
                                }}
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                required
                                size="md"
                                {...form.getInputProps("password")}
                                classNames={{
                                    input: "focus:border-blue-500 rounded-lg h-12",
                                    label: "mb-1 font-medium text-slate-700"
                                }}
                            />

                            <Group justify="space-between" mt="xs">
                                <Checkbox label="Remember me" size="sm" />
                                <Anchor component={Link} href="/auth/forgot-password" size="sm" className="font-medium text-blue-600">
                                    Forgot password?
                                </Anchor>
                            </Group>

                            <Button
                                type="submit"
                                fullWidth
                                size="md"
                                className="bg-blue-600 hover:bg-blue-700 rounded-lg h-12 mt-4 shadow-lg active:scale-95 transition-all"
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>

                    <Divider label="Or continue with" labelPosition="center" my="xl" />

                    <Group grow mb="md" mt="md">
                        <Button variant="default" leftSection={<i className="pi pi-google" />} className="rounded-lg h-11 border-slate-200">
                            Google
                        </Button>
                        <Button variant="default" leftSection={<i className="pi pi-phone" />} className="rounded-lg h-11 border-slate-200" component={Link} href="/auth/phone-login">
                            Phone
                        </Button>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
}
