"use client";

import React, { useState, Suspense, useCallback, useEffect } from "react";
import Image from "next/image";
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
import { useAppTheme } from "@/app/context/ThemeContext";
import {
  CustomerRegisterForm,
  type CustomerFormData,
} from "@/components/auth/CustomerRegisterForm";
import {
  HelperRegisterForm,
  type HelperFormData,
} from "@/components/auth/HelperRegisterForm";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function RegisterPageContent() {
  const { dict, isRTL } = useLanguage();
  const { isDark } = useAppTheme();
  const searchParams = useSearchParams();
  const defaultType =
    searchParams.get("type") === "helper" ? "helper" : "customer";
  const [registerType, setRegisterType] = useState<"customer" | "helper">(
    defaultType as "customer" | "helper",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGoogleSignup = useCallback(async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle({ role: registerType });
      await showSuccess(
        dict.auth.welcome_back,
        `Signed up with Google as ${registerType}`,
      );
      router.push(
        registerType === "helper"
          ? "/subscriptions?role=helper&next=/helper/dashboard"
          : "/subscriptions?role=customer&next=/customer/dashboard",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof AuthRuleError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Google sign-up failed";
      await showError("Google Sign-up Failed", msg);
      setIsLoading(false);
    }
  }, [registerType, router, dict]);

  const onCustomerSubmit = useCallback(
    async (data: CustomerFormData & { profileImage?: string | null }) => {
      setIsLoading(true);
      try {
        await signupWithEmail({
          role: "customer",
          email: data.email,
          password: data.password,
          displayName: data.fullName,
          phone: data.phone,
          profileImage: data.profileImage,
        } as any);
        await showSuccess("Account created successfully!");
        router.push("/subscriptions?role=customer&next=/customer/dashboard");
      } catch (err: unknown) {
        const msg =
          err instanceof AuthRuleError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Registration failed";
        await showError("Registration Failed", msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const onHelperSubmit = useCallback(
    async (data: HelperFormData & { profileImage?: string | null }) => {
      setIsLoading(true);
      try {
        await signupWithEmail({
          role: "helper",
          email: data.email,
          password: data.password,
          displayName: data.fullName,
          phone: data.phone,
          profileImage: data.profileImage,
        } as any);
        await showSuccess("Application submitted successfully!");
        router.push("/subscriptions?role=helper&next=/helper/dashboard");
      } catch (err: unknown) {
        const msg =
          err instanceof AuthRuleError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Registration failed";
        await showError("Registration Failed", msg);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return (
    <div
      className={cn(
        "min-h-screen flex font-satoshi overflow-hidden relative",
        isDark
          ? "bg-gradient-to-br from-black via-brand-black to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900",
        isRTL ? "font-urdu" : "font-satoshi",
      )}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient &&
          isDark &&
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-red/30 rounded-full"
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1920),
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1080),
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [
                  null,
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 1080),
                ],
                x: [
                  null,
                  Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1920),
                ],
                opacity: [0.2, 0.8, 0.2],
                scale: [null, Math.random() * 1.5 + 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      {/* Gradient Orbs */}
      {isDark && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-red/20 blur-[150px] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full"
          />
        </>
      )}

      {/* Left Side - Premium Image & Features */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative flex-col justify-center p-12 z-10"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-brand-charcoal to-transparent">
          {/* Background image removed as requested by user */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent" />
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 mb-8 flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-14 h-14 relative bg-white rounded-2xl overflow-hidden shadow-2xl shadow-brand-red/30 p-2"
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="Road Helper Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </motion.div>
              <span className="font-manrope font-bold text-3xl tracking-tighter">
                Road<span className="text-brand-red">Helper</span>
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-7xl font-bold leading-tight mb-6"
            >
              Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-orange-500 to-yellow-500 animate-pulse">
                Journey
              </span>
              <br />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-300 text-xl max-w-md leading-relaxed"
            >
              {dict.auth.join_roadhelper}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="relative z-10 flex gap-4"
          >
            {[
              {
                icon: Sparkles,
                label: dict.auth.verified,
                value: "100%",
              },
              { icon: Zap, label: dict.auth.fast, value: "< 2 min" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(
                  "px-6 py-4 rounded-2xl border backdrop-blur-xl cursor-pointer group transition-all",
                  isDark
                    ? "glass-dark border-white/10 bg-white/5"
                    : "bg-white/50 border-gray-200",
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon
                    className="text-brand-red group-hover:animate-spin"
                    size={24}
                  />
                  <p
                    className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <p
                  className={`text-xs uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div
        className={cn(
          "w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10",
          isDark
            ? "bg-black/80 backdrop-blur-xl shadow-2xl"
            : "bg-white/80 backdrop-blur-xl shadow-2xl",
        )}
      >
        <Link
          href="/"
          className={`absolute top-4 sm:top-8 ${isRTL ? "right-4 sm:right-8" : "left-4 sm:left-8"} z-20`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "flex items-center gap-2 text-sm font-bold hover:text-brand-red transition-all",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {dict.auth.back_to_home}
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-125"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div
                className={cn(
                  "p-6 rounded-3xl bg-gradient-to-br border-2 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500",
                  isDark
                    ? "from-brand-red/30 to-orange-600/30 border-brand-red/30 shadow-brand-red/30"
                    : "from-brand-red/10 to-orange-600/10 border-brand-red/20 shadow-brand-red/10",
                )}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <Sparkles size={52} className="text-brand-red relative z-10" />
              </div>
            </motion.div>
            <h2
              className={cn(
                "font-manrope text-4xl font-bold mb-2 bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-white to-gray-300"
                  : "bg-gradient-to-r from-gray-900 to-gray-700",
              )}
            >
              {dict.auth.create_account}
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              {dict.auth.join_roadhelper}
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(["customer", "helper"] as const).map((type) => (
              <motion.button
                key={type}
                onClick={() => setRegisterType(type)}
                className={cn(
                  "py-3 px-4 rounded-lg font-medium transition-all shadow-lg",
                  registerType === type
                    ? "bg-brand-red text-white shadow-brand-red/20"
                    : isDark
                      ? "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type === "customer" ? dict.auth.customer : dict.auth.helper}
              </motion.button>
            ))}
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {registerType === "customer" ? (
              <CustomerRegisterForm
                key="customer"
                isLoading={isLoading}
                onSubmit={onCustomerSubmit}
              />
            ) : (
              <HelperRegisterForm
                key="helper"
                isLoading={isLoading}
                onSubmit={onHelperSubmit}
              />
            )}
          </AnimatePresence>

          {/* Google Signup */}
          <div
            className={cn(
              "mt-6 pt-6 border-t",
              isDark ? "border-white/10" : "border-gray-200",
            )}
          >
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              variant="outline"
              className={cn(
                "w-full h-12 rounded-xl transition-all shadow-md active:scale-95",
                isDark
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                  : "bg-white border-gray-300 hover:bg-gray-50 text-gray-900",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  {dict.auth.continue_google}
                </>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {dict.auth.continue_google}
                </span>
              )}
            </Button>
          </div>

          {/* Login Link */}
          <p
            className={cn(
              "text-center mt-6 text-sm",
              isDark ? "text-gray-400" : "text-gray-600",
            )}
          >
            <strong className={isDark ? "text-white" : "text-black"}>
              {dict.auth.already_have_account}
            </strong>{" "}
            <Link
              href={`/login?type=${registerType}`}
              className="text-brand-red font-bold hover:underline transition-all active:scale-95 inline-block"
            >
              {dict.auth.sign_in}
            </Link>
          </p>

          {/* Admin Signup Link */}
          <div className="text-center pt-4 border-t border-white/10 mt-6">
            <Link
              href="/admin/signup"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-red transition-all group cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5"
            >
              <Shield size={16} className="group-hover:animate-pulse" />
              <span>Are you an Admin? Register here</span>
              {isRTL ? (
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              ) : (
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
