"use client";

import React from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Paper,
  Container,
  Group,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { motion } from "framer-motion";
import { IconLock, IconMail, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLogin() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      keepLoggedIn: false,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length < 6 ? "Password must include at least 6 characters" : null,
    },
  });

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden font-satoshi">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      </div>

      <Container size={420} className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 p-4 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-2xl"
            >
              <Image src="/logo.png" alt="Road Helper" width={60} height={60} />
            </motion.div>
            <Title className="text-white font-manrope text-3xl font-extrabold tracking-tight">
              Admin Portal
            </Title>
            <Text className="text-gray-400 mt-2 text-sm">
              Secure access for platform administrators
            </Text>
          </div>

          <Paper
            radius="xl"
            p={30}
            className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]"
          >
            <form onSubmit={form.onSubmit(() => {})}>
              <Text className="text-gray-300 text-sm font-bold mb-1 uppercase tracking-wider">
                Email Address
              </Text>
              <TextInput
                required
                placeholder="admin@roadhelper.com"
                leftSection={<IconMail size={16} />}
                {...form.getInputProps("email")}
                classNames={{
                  input:
                    "bg-[#18181B] border-[#27272A] text-white focus:border-brand-red h-12 rounded-lg",
                }}
                mb="md"
              />

              <Text className="text-gray-300 text-sm font-bold mb-1 uppercase tracking-wider">
                Password
              </Text>
              <PasswordInput
                required
                placeholder="Your secure password"
                leftSection={<IconLock size={16} />}
                {...form.getInputProps("password")}
                classNames={{
                  input:
                    "bg-[#18181B] border-[#27272A] text-white focus:border-brand-red h-12 rounded-lg",
                  innerInput: "h-12",
                }}
                mb="md"
              />

              <Group justify="space-between" mt="lg" mb="xl">
                <Checkbox
                  label="Keep me signed in"
                  classNames={{
                    label: "text-gray-300",
                    input:
                      "bg-transparent border-gray-600 checked:bg-brand-red checked:border-brand-red",
                  }}
                  {...form.getInputProps("keepLoggedIn", { type: "checkbox" })}
                />
                <Anchor
                  component={Link}
                  href="/forgot-password"
                  size="sm"
                  className="text-brand-red hover:text-brand-dark-red"
                >
                  Forgot password?
                </Anchor>
              </Group>

              <Button
                fullWidth
                size="lg"
                type="submit"
                rightSection={<IconArrowRight size={18} />}
                className="bg-brand-red hover:bg-brand-dark-red text-white h-12 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Button>
            </form>

            <Divider my="lg" label="Or" labelPosition="center" color="dark.4" />

            <Group justify="center">
              <Text size="sm" className="text-gray-400">
                New Administrator?{" "}
                <Link
                  href="/admin/signup"
                  className="text-brand-red hover:underline font-bold"
                >
                  Request Access
                </Link>
              </Text>
            </Group>
          </Paper>

          <Text ta="center" size="xs" className="text-gray-600 mt-8">
            &copy; {new Date().getFullYear()} Road Helper. Secure Admin
            Environment.
          </Text>
        </motion.div>
      </Container>
    </div>
  );
}
