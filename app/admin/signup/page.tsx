"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Group,
  SimpleGrid,
  Box,
} from "@mantine/core";
import { setCookie } from "cookies-next";
import { useForm } from "@mantine/form";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLock,
  IconMail,
  IconUser,
  IconArrowRight,
  IconShieldCheck,
  IconArrowLeft,
  IconSparkles,
  IconShieldLock,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/sweetalert";
import { cn } from "@/lib/utils";
import {
  AuthRuleError,
  signupWithEmail,
} from "@/lib/services/authService";

interface AdminSignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminCode: string;
}

const AdminSignup = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<AdminSignupValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    },
    validate: {
      firstName: (val: string) => (val.length < 2 ? "Too short" : null),
      lastName: (val: string) => (val.length < 2 ? "Too short" : null),
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) =>
        val.length < 6 ? "Password must include at least 6 characters" : null,
      confirmPassword: (val: string, values: AdminSignupValues) =>
        val !== values.password ? "Passwords do not match" : null,
      adminCode: (val: string) => (val.length < 4 ? "Invalid Admin Code" : null),
    },
  });

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] font-satoshi text-white overflow-hidden relative">
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient &&
          [...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-brand-red/20 rounded-full"
              initial={{
                x: `${(i * 37) % 100}%`,
                y: `${(i * 53) % 100}%`,
              }}
              animate={{
                y: [null, `${(i * 19 + 21) % 100}%`],
                x: [null, `${(i * 29 + 11) % 100}%`],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: (i % 10) + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-brand-red/10 blur-[150px] rounded-full"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"
      />

      {/* --- LEFT SIDE: THEMATIC --- */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-20 overflow-hidden bg-[#0A0A0A] border-r border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-8 rounded-[40px] glass-dark border-2 border-brand-red/20 shadow-2xl mb-12"
          >
            <IconShieldLock
              size={80}
              className="text-brand-red animate-pulse"
            />
          </motion.div>
          <Title className="text-6xl font-black font-manrope tracking-tighter mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            SECURE ACCESS
            <br />
            CONTROL
          </Title>
          <Text className="text-gray-400 text-xl font-medium max-w-md mx-auto leading-relaxed">
            Join the elite task force managing roadside infrastructure and
            helper networks.
          </Text>
        </motion.div>

        {/* Abstract Deco */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-red/5 to-transparent z-0" />
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto py-20">
        <Link href="/" className="absolute top-8 right-8 group">
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all"
          >
            <span>Back to Portal</span>
            <IconArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px]"
        >
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-brand-red" />
              <Text className="text-brand-red font-black uppercase tracking-[0.3em] text-[10px]">
                Admin Registration
              </Text>
            </div>
            <Title className="text-4xl font-extrabold tracking-tight mb-2">
              Create Admin ID
            </Title>
            <Text className="text-gray-500 font-medium leading-relaxed">
              Enter your credentials and verification code to proceed.
            </Text>
          </div>

          <form
            onSubmit={form.onSubmit(async (data) => {
              try {
                await signupWithEmail({
                  role: "admin",
                  email: data.email,
                  password: data.password,
                  displayName: `${data.firstName} ${data.lastName}`,
                });
                await showSuccess("Admin profile established");
                router.push("/admin/dashboard");
              } catch (err: unknown) {
                const msg =
                  err instanceof AuthRuleError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Signup failed";
                await showError("Signup Failed", msg);
              }
            })}
            className="space-y-6"
          >
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="First Name"
                placeholder="John"
                leftSection={<IconUser size={18} className="text-gray-500" />}
                {...form.getInputProps("firstName")}
                classNames={{
                  label:
                    "text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2",
                  input:
                    "bg-white/5 border-2 border-white/5 text-white focus:border-brand-red h-14 rounded-2xl transition-all",
                }}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                leftSection={<IconUser size={18} className="text-gray-500" />}
                {...form.getInputProps("lastName")}
                classNames={{
                  label:
                    "text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2",
                  input:
                    "bg-white/5 border-2 border-white/5 text-white focus:border-brand-red h-14 rounded-2xl transition-all",
                }}
              />
            </SimpleGrid>

            <TextInput
              label="Professional Email"
              placeholder="admin@roadhelper.com"
              leftSection={<IconMail size={18} className="text-gray-500" />}
              {...form.getInputProps("email")}
              classNames={{
                label:
                  "text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2",
                input:
                  "bg-white/5 border-2 border-white/5 text-white focus:border-brand-red h-14 rounded-2xl transition-all",
              }}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <PasswordInput
                label="Security Key"
                placeholder="••••••••"
                leftSection={<IconLock size={18} className="text-gray-500" />}
                {...form.getInputProps("password")}
                classNames={{
                  label:
                    "text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2",
                  input:
                    "bg-white/5 border-2 border-white/5 text-white focus:border-brand-red h-14 rounded-2xl transition-all",
                  innerInput: "h-14",
                }}
              />
              <PasswordInput
                label="Verify Key"
                placeholder="••••••••"
                leftSection={<IconLock size={18} className="text-gray-500" />}
                {...form.getInputProps("confirmPassword")}
                classNames={{
                  label:
                    "text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2",
                  input:
                    "bg-white/5 border-2 border-white/5 text-white focus:border-brand-red h-14 rounded-2xl transition-all",
                  innerInput: "h-14",
                }}
              />
            </SimpleGrid>

            <TextInput
              label="Super Admin Verification Code"
              placeholder="ENTER ACCESS CODE"
              leftSection={
                <IconShieldCheck
                  size={18}
                  className="text-brand-red shadow-lg"
                />
              }
              {...form.getInputProps("adminCode")}
              className="group"
              classNames={{
                label:
                  "text-brand-red text-[10px] font-black uppercase tracking-widest mb-2",
                input:
                  "bg-brand-red/5 border-2 border-brand-red/20 text-white focus:border-brand-red h-16 rounded-2xl transition-all shadow-inner group-hover:bg-brand-red/10",
              }}
            />

            <Button
              fullWidth
              size="lg"
              type="submit"
              rightSection={<IconArrowRight size={20} />}
              className="bg-brand-red hover:bg-brand-dark-red text-white h-16 rounded-2xl transition-all shadow-2xl shadow-brand-red/20 border-none font-black text-lg tracking-tight"
            >
              INITIALIZE ADMIN ID
            </Button>
          </form>

          <Paper
            p="xl"
            radius="24px"
            className="mt-10 bg-white/5 border border-white/5 flex items-center justify-between"
          >
            <div>
              <Text className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                Existing Operator?
              </Text>
              <Text className="text-white font-bold">Access Terminal Now</Text>
            </div>
            <Button
              variant="outline"
              color="gray"
              component={Link}
              href="/admin/login"
              className="border-white/10 text-white hover:bg-white/5 rounded-xl font-bold"
            >
              Sign In
            </Button>
          </Paper>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(AdminSignup);
