"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { showSuccess, showError } from "@/lib/sweetalert";
import {
  AuthRuleError,
  loginWithEmail,
  loginWithGoogle,
} from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  UserCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Shield,
  ArrowLeft, // Added ArrowLeft for RTL support
} from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext"; // Import useLanguage
import { useAppTheme } from "@/app/context/ThemeContext"; // Import useAppTheme

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { dict, isRTL } = useLanguage(); // Use language hook
  const { isDark } = useAppTheme(); // Use theme hook
  const [loginType, setLoginType] = useState<"customer" | "helper">("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      setIsLoading(true);
      try {
        await loginWithEmail({
          role: loginType,
          email: data.email,
          password: data.password,
        });
        await showSuccess(
          dict.auth.welcome_back,
          loginType === "customer" ? dict.auth.customer : dict.auth.helper,
        );
        router.push(
          loginType === "customer"
            ? "/customer/dashboard"
            : "/helper/dashboard",
        );
        // Keep loader visible until navigation completes; do not set false on success
      } catch (error: unknown) {
        console.error(error);
        const message =
          error instanceof AuthRuleError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Login failed. Please try again.";
        await showError("Login Failed", message);
        setIsLoading(false);
      }
    },
    [loginType, router, dict],
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle({ role: loginType });
      await showSuccess(dict.auth.welcome_back, "Signed in with Google.");
      router.push(
        loginType === "customer" ? "/customer/dashboard" : "/helper/dashboard",
      );
      // Keep loader until navigation completes
    } catch (err: unknown) {
      const msg =
        err instanceof AuthRuleError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Google sign-in failed";
      await showError("Google Sign-in Failed", msg);
      setIsLoading(false);
    }
  }, [loginType, router, dict]);

  const tabIcon = useMemo(
    () => (loginType === "customer" ? "👤" : "🔧"),
    [loginType],
  );
  const tabColor = useMemo(
    () =>
      loginType === "customer"
        ? "from-blue-600 to-blue-800"
        : "from-orange-600 to-orange-800",
    [loginType],
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
          [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-red/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
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

      {/* Left Side - Premium Image */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 100 : -100 }} // Support RTL animation
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 z-10"
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-brand-charcoal/50 to-transparent">
          <Image
            src="/assets/images/login-sidebar.png"
            alt="Background"
            fill
            sizes="50vw"
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
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
            Roadside <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-orange-500 to-yellow-500 animate-pulse">
              Assistance
            </span>
            <br />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300 text-xl max-w-md leading-relaxed"
          >
            {dict.auth.connect_verified}
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
              label: dict.auth.support_24_7,
              value: dict.auth.always_on,
            },
            { icon: Zap, label: dict.auth.avg_eta, value: "15 mins" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-dark px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-xl cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon
                  className="text-brand-red group-hover:animate-spin"
                  size={24}
                />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <Link
          href="/"
          className={`absolute top-4 ${isRTL ? "left-4 sm:left-8" : "right-4 sm:right-8"} sm:top-8 group z-20`}
        >
          <motion.div
            whileHover={{ scale: 1.05, x: isRTL ? -5 : 5 }}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-red transition-all cursor-pointer"
          >
            {!isRTL && <span>{dict.auth.back_to_home}</span>}
            {isRTL ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
            {isRTL && <span>{dict.auth.back_to_home}</span>}
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[480px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
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
                  loginType === "customer"
                    ? "from-blue-600/30 to-indigo-600/30 border-blue-500/30 shadow-blue-500/30"
                    : "from-orange-600/30 to-red-600/30 border-orange-500/30 shadow-orange-500/30",
                )}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  key={loginType}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {loginType === "customer" ? (
                    <UserCircle
                      size={52}
                      className="text-blue-500 relative z-10"
                    />
                  ) : (
                    <Sparkles
                      size={52}
                      className="text-orange-500 relative z-10"
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
            <h2
              className={cn(
                "text-4xl font-bold mb-2 bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-white to-gray-400"
                  : "bg-gradient-to-r from-gray-900 to-gray-600",
              )}
            >
              {dict.auth.welcome_back}
            </h2>
            <p
              className={cn(
                "text-lg",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              {dict.auth.sign_in_continue}
            </p>
          </motion.div>

          {/* Enhanced Toggle Switch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white/5 p-1.5 rounded-2xl border-2 border-white/20 mb-8 backdrop-blur-xl shadow-xl"
          >
            <motion.div
              layout
              className={cn(
                "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl shadow-xl border-2 transition-all duration-300",
                loginType === "helper"
                  ? isRTL
                    ? "right-[calc(50%+3px)]"
                    : "left-[calc(50%+3px)]"
                  : isRTL
                    ? "right-1.5"
                    : "left-1.5",
                loginType === "customer"
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 shadow-blue-500/40 border-blue-400/50"
                  : "bg-gradient-to-r from-orange-600 to-orange-800 shadow-orange-500/40 border-orange-400/50",
              )}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            <div className="relative z-10 flex gap-1">
              {[
                {
                  type: "customer",
                  icon: "👤",
                  label: dict.auth.customer,
                  color: "blue",
                },
                {
                  type: "helper",
                  icon: "🔧",
                  label: dict.auth.helper,
                  color: "orange",
                },
              ].map((item) => (
                <motion.button
                  key={item.type}
                  type="button"
                  onClick={() => setLoginType(item.type as any)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer border-2 flex items-center justify-center gap-2",
                    loginType === item.type
                      ? "text-white border-transparent"
                      : `text-gray-400 border-transparent hover:border-${item.color}-500/20 hover:text-white hover:bg-${item.color}-500/5`,
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Label
                className={cn(
                  "text-xs uppercase tracking-wider font-bold flex items-center gap-2",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Mail size={14} className="text-brand-red" />
                {dict.auth.email_address}
              </Label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <Mail
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-brand-red transition-colors z-10`}
                />
                <Input
                  {...register("email")}
                  className={cn(
                    `${isRTL ? "pr-12" : "pl-12"} h-14 border-2 backdrop-blur-xl rounded-xl transition-all focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red`,
                    isDark
                      ? "bg-white/5 border-white/10 text-white focus:bg-white/10 hover:bg-white/10 hover:border-brand-red/50"
                      : "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:bg-gray-50 hover:bg-gray-50 hover:border-brand-red/30",
                  )}
                  placeholder="name@example.com"
                  dir="ltr" // Email is usually LTR
                />
                <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-red/20 to-transparent opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
              </motion.div>
              {errors.email && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs ml-1 flex items-center gap-1"
                >
                  ⚠️ {errors.email.message as string}
                </motion.span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label
                className={cn(
                  "text-xs uppercase tracking-wider font-bold flex items-center gap-2",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                <Lock size={14} className="text-brand-red" />
                {dict.auth.password}
              </Label>
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="relative group"
              >
                <Lock
                  className={`absolute ${isRTL ? "right-4" : "left-4"} top-4 h-5 w-5 text-gray-500 group-focus-within:text-brand-red transition-colors z-10`}
                />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    `${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} h-14 border-2 backdrop-blur-xl rounded-xl transition-all focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red`,
                    isDark
                      ? "bg-white/5 border-white/10 text-white focus:bg-white/10 hover:bg-white/10 hover:border-brand-red/50"
                      : "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:bg-gray-50 hover:bg-gray-50 hover:border-brand-red/30",
                  )}
                  placeholder="••••••••"
                  dir="ltr"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePasswordVisibility}
                  className={`absolute ${isRTL ? "left-4" : "right-4"} top-4 text-gray-500 hover:text-brand-red transition-colors z-10 cursor-pointer`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
                <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-red/20 to-transparent opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity pointer-events-none" />
              </motion.div>
              {errors.password && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs ml-1 flex items-center gap-1"
                >
                  ⚠️ {errors.password.message as string}
                </motion.span>
              )}

              {/* Forgot Password Link */}
              <div className={`text-${isRTL ? "left" : "right"} pt-1`}>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-brand-red hover:text-white transition-colors hover:underline cursor-pointer inline-flex items-center gap-1 group"
                >
                  <Lock size={12} className="group-hover:animate-pulse" />
                  {dict.auth.forgot_password}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-16 text-lg font-bold rounded-xl mt-4 group relative overflow-hidden border-2 transition-all duration-500 cursor-pointer",
                  isDark
                    ? "bg-gradient-to-r from-brand-red via-brand-dark-red to-brand-red hover:shadow-2xl hover:shadow-brand-red/50 border-brand-red/50 hover:border-brand-red"
                    : "bg-gradient-to-r from-brand-red via-orange-600 to-brand-red hover:shadow-2xl hover:shadow-red-500/30 border-brand-red hover:border-brand-red",
                )}
                style={{ backgroundSize: "200% 100%" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {dict.auth.signing_in}
                    </>
                  ) : (
                    <>
                      {dict.auth.sign_in}
                      {isRTL ? (
                        <ArrowLeft
                          className="group-hover:-translate-x-1 transition-transform"
                          size={20}
                        />
                      ) : (
                        <ArrowRight
                          className="group-hover:translate-x-1 transition-transform"
                          size={20}
                        />
                      )}
                    </>
                  )}
                </span>
              </Button>
            </motion.div>

            {/* Google Login Separator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="relative flex items-center gap-4 my-6"
            >
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                {dict.auth.or_secure_entry}
              </span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 bg-white/[0.03] border-2 border-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] group cursor-pointer"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                >
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
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <p className="text-gray-500 text-center">
              {dict.auth.dont_have_account}{" "}
              <Link
                href={`/register?type=${loginType}`}
                className="text-white font-bold hover:text-brand-red transition-colors relative group cursor-pointer"
              >
                {dict.auth.create_account}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>

            {/* Admin Link */}
            <div className="text-center pt-4 border-t border-white/10">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-red transition-all group cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5"
              >
                <Shield size={16} className="group-hover:animate-pulse" />
                <span>{dict.auth.are_you_admin}</span>
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
        </motion.div>
      </div>
    </div>
  );
}
