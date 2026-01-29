"use client";

import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  SegmentedControl,
  Paper,
} from "@mantine/core";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const customerSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const helperSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [loginType, setLoginType] = useState<string>("customer");
  const router = useRouter();

  const customerForm = useForm({
    initialValues: { phone: "" },
    validate: zodResolver(customerSchema),
  });

  const helperForm = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(helperSchema),
  });

  const handleCustomerSubmit = async (values: typeof customerForm.values) => {
    toast.success("Welcome back!");
    router.replace("/customer/dashboard");
  };

  const handleHelperSubmit = async (values: typeof helperForm.values) => {
    toast.success("Welcome back, Helper!");
    router.replace("/helper/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-white font-satoshi">
      {/* Left Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block w-1/2 relative overflow-hidden bg-brand-charcoal"
      >
        <Image
          src="/assets/images/login-sidebar.png"
          alt="Road Helper Network"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-black/90 to-transparent" />

        <div className="absolute bottom-16 left-0 p-16 text-white z-10">
          <div className="mb-6 w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <Image
              src="/assets/images/logo.jpg"
              alt="Logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <Title className="font-manrope text-5xl font-bold mb-4 leading-tight">
            Your Safety, <br />
            <span className="text-brand-red">Our Priority.</span>
          </Title>
          <Text className="text-gray-300 text-lg max-w-md">
            Join thousands of drivers and helpers in the fastest growing
            roadside assistance network.
          </Text>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <Link
          href="/"
          className="absolute top-8 right-8 text-sm font-bold text-brand-charcoal hover:text-brand-red transition-colors"
        >
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <Title className="font-manrope text-4xl font-bold text-brand-black mb-2">
                Welcome Back
              </Title>
              <Text className="text-gray-500">
                Please enter your details to sign in.
              </Text>
            </div>

            <Paper
              p="md"
              radius="lg"
              className="bg-gray-50 border border-gray-100 mb-8"
            >
              <SegmentedControl
                fullWidth
                size="md"
                radius="md"
                value={loginType}
                onChange={setLoginType}
                data={[
                  { label: "For Customers", value: "customer" },
                  { label: "For Helpers", value: "helper" },
                ]}
                classNames={{
                  root: "bg-transparent",
                  indicator: "bg-white shadow-md",
                  label:
                    "text-gray-600 data-[active=true]:text-brand-black font-semibold",
                }}
              />
            </Paper>

            <AnimatePresence mode="wait">
              {loginType === "customer" ? (
                <motion.form
                  key="customer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={customerForm.onSubmit(handleCustomerSubmit)}
                >
                  <Stack>
                    <TextInput
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...customerForm.getInputProps("phone")}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      radius="md"
                      fullWidth
                      className="bg-brand-red hover:bg-brand-dark-red transition-colors h-14 font-manrope font-bold text-lg text-white"
                    >
                      Continue
                    </Button>
                    <Text size="sm" ta="center" className="text-gray-500 mt-2">
                      If You are new First Signup to continue{" "}
                      <Link
                        href="/register?type=customer"
                        className="text-brand-red font-bold hover:underline"
                      >
                        Signup here
                      </Link>
                    </Text>
                  </Stack>
                </motion.form>
              ) : (
                <motion.form
                  key="helper"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={helperForm.onSubmit(handleHelperSubmit)}
                >
                  <Stack>
                    <TextInput
                      label="Email Address"
                      placeholder="helper@roadhelper.com"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("email")}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="••••••••"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("password")}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      radius="md"
                      fullWidth
                      className="bg-brand-black hover:bg-gray-800 transition-colors h-14 font-manrope font-bold text-lg text-white"
                    >
                      Login to Dashboard
                    </Button>
                    <Text size="sm" ta="center" className="text-gray-500 mt-2">
                      Want to be a helper?{" "}
                      <Link
                        href="/register?type=helper"
                        className="text-brand-red font-bold hover:underline"
                      >
                        Apply here
                      </Link>
                    </Text>
                  </Stack>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              <Text size="sm" className="text-gray-400">
                Protected by reCAPTCHA and subject to the Road Helper{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
                .
              </Text>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
