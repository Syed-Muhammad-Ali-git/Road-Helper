"use client";

import React, { useState, Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError } from "@/lib/sweetalert";
import {
  AuthRuleError,
  signupWithEmail,
  loginWithGoogle,
} from "@/lib/services/authService";
import { useLanguage } from "@/app/context/LanguageContext";
import { CustomerRegisterForm, type CustomerFormData } from "@/components/auth/CustomerRegisterForm";
import { HelperRegisterForm, type HelperFormData } from "@/components/auth/HelperRegisterForm";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function RegisterPageContent() {
  const { dict, isRTL } = useLanguage();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") === "helper" ? "helper" : "customer";
  const [registerType, setRegisterType] = useState<"customer" | "helper">(
    defaultType as "customer" | "helper"
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = useCallback(async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle({ role: registerType });
      await showSuccess(dict.auth.welcome_back, "Signed in with Google.");
      router.push(
        registerType === "helper"
          ? "/subscriptions?role=helper&next=/helper/dashboard"
          : "/subscriptions?role=customer&next=/customer/dashboard"
      );
    } catch (err: unknown) {
      const msg = err instanceof AuthRuleError
        ? err.message
        : err instanceof Error ? err.message : "Google sign-up failed";
      await showError("Google Sign-up Failed", msg);
    } finally {
      setIsLoading(false);
    }
  }, [registerType, router, dict]);

  const onCustomerSubmit = useCallback(async (data: CustomerFormData) => {
    setIsLoading(true);
    try {
      await signupWithEmail({
        role: "customer",
        email: data.email,
        password: data.password,
        displayName: data.fullName,
        phone: data.phone,
      });
      await showSuccess("Account created successfully!");
      router.push("/subscriptions?role=customer&next=/customer/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof AuthRuleError
        ? err.message
        : err instanceof Error ? err.message : "Registration failed";
      await showError("Registration Failed", msg);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const onHelperSubmit = useCallback(async (data: HelperFormData) => {
    setIsLoading(true);
    try {
      await signupWithEmail({
        role: "helper",
        email: data.email,
        password: data.password,
        displayName: data.fullName,
        phone: data.phone,
      });
      await showSuccess("Application submitted successfully!");
      router.push("/subscriptions?role=helper&next=/helper/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof AuthRuleError
        ? err.message
        : err instanceof Error ? err.message : "Registration failed";
      await showError("Registration Failed", msg);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const viewportDims = useMemo(() => ({ w: 1920, h: 1080 }), []);

  return (
    <div className={`min-h-screen flex bg-gradient-to-br from-black via-brand-black to-black font-satoshi text-white overflow-hidden ${isRTL ? "font-urdu" : ""}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-red/40 rounded-full"
            animate={{
              y: [0, viewportDims.h],
              x: [Math.random() * viewportDims.w, Math.random() * viewportDims.w],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{ duration: Math.random() * 20 + 15, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 30, repeat: Infinity }}
        className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-red/20 blur-3xl rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.4, 1], rotate: [360, 180, 0] }}
        transition={{ duration: 35, repeat: Infinity }}
        className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-3xl rounded-full"
      />

      {/* Main Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 bg-black/30 backdrop-blur-sm">
        <Link href="/" className={`absolute top-4 sm:top-8 ${isRTL ? "right-4 sm:right-8" : "left-4 sm:left-8"} z-20`}>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-red">
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {dict.auth.back_to_home}
          </motion.div>
        </Link>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[500px]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 p-4 bg-gradient-to-br from-brand-red/20 to-orange-500/20 rounded-2xl border border-brand-red/30">
              <Sparkles size={40} className="text-brand-red" />
            </div>
            <h2 className="font-manrope text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {dict.auth.create_account}
            </h2>
            <p className="text-gray-400">{dict.auth.join_roadhelper}</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(['customer', 'helper'] as const).map(type => (
              <motion.button
                key={type}
                onClick={() => setRegisterType(type)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  registerType === type
                    ? 'bg-brand-red text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type === 'customer' ? dict.auth.customer : dict.auth.helper}
              </motion.button>
            ))}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {registerType === 'customer' ? (
              <CustomerRegisterForm key="customer" isLoading={isLoading} onSubmit={onCustomerSubmit} />
            ) : (
              <HelperRegisterForm key="helper" isLoading={isLoading} onSubmit={onHelperSubmit} />
            )}
          </AnimatePresence>

          {/* Google Signup */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {dict.auth.continue_google}
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            {dict.auth.already_have_account} <Link href="/login" className="text-brand-red hover:underline">{dict.auth.sign_in}</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h3 className="text-3xl font-bold mb-8">{dict.auth.join_the_future}</h3>
          <div className="space-y-6">
            {[
              { icon: Zap, title: dict.common.fast_value, desc: dict.common.fast_dispatch },
              { icon: Shield, title: "99.9%", desc: dict.common.uptime },
            ].map((item, i) => (
              <motion.div key={i} className="flex gap-4 items-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
                <item.icon className="text-brand-red" size={32} />
                <div className="text-left">
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
