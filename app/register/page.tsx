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
  Select,
  Paper,
} from "@mantine/core";
import Image from "next/image";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const customerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const helperSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  serviceType: z.string().min(1, "Service type is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultType =
    searchParams.get("type") === "helper" ? "helper" : "customer";
  const [registerType, setRegisterType] = useState<string>(defaultType);
  const router = useRouter();

  const customerForm = useForm({
    initialValues: { fullName: "", phone: "" },
    validate: zodResolver(customerSchema),
  });

  const helperForm = useForm({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      serviceType: "",
      password: "",
    },
    validate: zodResolver(helperSchema),
  });

  const handleCustomerSubmit = async (values: typeof customerForm.values) => {
    console.log(values);
    toast.success("Account created! Redirecting...");
    router.replace("/customer/dashboard");
  };

  const handleHelperSubmit = async (values: typeof helperForm.values) => {
    console.log(values);
    toast.success("Application submitted! Redirecting...");
    router.replace("/helper/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-white font-satoshi">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <Link
          href="/"
          className="absolute top-8 left-8 text-sm font-bold text-brand-charcoal hover:text-brand-red transition-colors"
        >
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <Title className="font-manrope text-4xl font-bold text-brand-black mb-2">
                Create Account
              </Title>
              <Text className="text-gray-500">Join Road Helper today.</Text>
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
                value={registerType}
                onChange={setRegisterType}
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
              {registerType === "customer" ? (
                <motion.form
                  key="customer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={customerForm.onSubmit(handleCustomerSubmit)}
                >
                  <Stack>
                    <TextInput
                      label="Full Name"
                      placeholder="John Doe"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...customerForm.getInputProps("fullName")}
                    />
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
                      Sign Up
                    </Button>
                    <Text size="sm" ta="center" className="text-gray-500 mt-2">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-brand-red font-bold hover:underline"
                      >
                        Log in
                      </Link>
                    </Text>
                  </Stack>
                </motion.form>
              ) : (
                <motion.form
                  key="helper"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={helperForm.onSubmit(handleHelperSubmit)}
                >
                  <Stack>
                    <TextInput
                      label="Full Name"
                      placeholder="Business or Personal Name"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("fullName")}
                    />
                    <TextInput
                      label="Email Address"
                      placeholder="work@example.com"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("email")}
                    />
                    <TextInput
                      label="Phone Number"
                      placeholder="+1 (555) 000-0000"
                      size="lg"
                      radius="md"
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("phone")}
                    />
                    <Select
                      label="Service Type"
                      placeholder="Select your service"
                      size="lg"
                      radius="md"
                      data={[
                        { value: "tow", label: "Towing Service" },
                        { value: "mechanic", label: "Mobile Mechanic" },
                        { value: "fuel", label: "Fuel Delivery" },
                        { value: "locksmith", label: "Locksmith" },
                      ]}
                      classNames={{
                        input:
                          "focus:border-brand-red focus:ring-1 focus:ring-brand-red",
                      }}
                      {...helperForm.getInputProps("serviceType")}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Create a password"
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
                      Join Network
                    </Button>
                    <Text size="sm" ta="center" className="text-gray-500 mt-2">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="text-brand-red font-bold hover:underline"
                      >
                        Log in
                      </Link>
                    </Text>
                  </Stack>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
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

        <div className="absolute bottom-0 left-0 p-16 text-white z-10">
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
            Earn while you <br />
            <span className="text-brand-red">Help Others.</span>
          </Title>
          <Text className="text-gray-300 text-lg max-w-md">
            Join our network of professional helpers and get paid for every
            rescue.
          </Text>
        </div>
      </motion.div>
    </div>
  );
}
