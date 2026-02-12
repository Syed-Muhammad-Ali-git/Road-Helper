"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/lib/sweetalert";
import {
  AuthRuleError,
  loginWithEmail,
} from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await loginWithEmail({
        role: "admin",
        email: data.email,
        password: data.password,
      });
      await showSuccess("Access Granted", "Welcome, Administrator.");
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const msg =
        error instanceof AuthRuleError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Invalid credentials or unauthorized access.";
      await showError(
        "Access Denied",
        msg
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] font-satoshi text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-brand-red/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[130px] rounded-full"
        />
      </div>

      {/* --- LEFT SIDE: THEMATIC SIDEBAR --- */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 z-10 border-r border-white/5 bg-black"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/login-sidebar.png"
            alt="Admin Background"
            fill
            sizes="50vw"
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-12 relative bg-white rounded-xl p-2 shadow-2xl">
              <Image
                src="/assets/images/logo.png"
                alt="Logo"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <span className="font-manrope font-black text-2xl tracking-tighter">
              Road<span className="text-brand-red">Helper</span>{" "}
              <span className="text-gray-500 text-sm font-bold ml-2 uppercase tracking-[0.3em]">
                HQ
              </span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-7xl font-black leading-[1.1] mb-8 tracking-tighter">
              Central <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">
                Command
              </span>
              <br /> Center.
            </h1>
            <p className="text-gray-400 text-xl max-w-md leading-relaxed font-medium">
              Enterprise-grade infrastructure management and real-time
              operational oversight for the world&apos;s most reliable rescue
              network.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex gap-6">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Shield className="text-brand-red" size={24} />
            <div>
              <p className="text-white font-black text-xl leading-none mb-1">
                SECURED
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Encrypted Access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <Activity className="text-orange-500" size={24} />
            <div>
              <p className="text-white font-black text-xl leading-none mb-1">
                SYSTEMS
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                100% Operational
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <Link href="/" className="absolute top-8 right-8 group">
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all"
          >
            <span>Back to Portal</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px]"
        >
          <div className="text-center mb-12">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block p-6 rounded-[32px] bg-gradient-to-br from-brand-red/20 to-orange-500/20 border-2 border-brand-red/30 shadow-2xl mb-8 backdrop-blur-3xl"
            >
              <Shield size={52} className="text-brand-red" />
            </motion.div>
            <h2 className="text-4xl font-black mb-3 text-white tracking-tight">
              Admin Authentication
            </h2>
            <p className="text-gray-500 font-medium">
              Verify your administrative credentials to enter the HQ
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="uppercase text-[10px] font-black text-gray-500 tracking-[0.2em] ml-1">
                Professional Identity
              </Label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-brand-red transition-all" />
                <Input
                  {...register("email")}
                  placeholder="name@protocol.com"
                  className="pl-14 h-16 bg-white/[0.03] border-2 border-white/5 focus:border-brand-red text-white rounded-2xl transition-all font-medium"
                />
              </div>
              {errors.email && (
                <p className="text-brand-red text-xs font-bold mt-1 ml-1 animate-pulse">
                  ⚠ {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 group-focus-within:text-brand-red transition-all" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-14 pr-14 h-16 bg-white/[0.03] border-2 border-white/5 focus:border-brand-red text-white rounded-2xl transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-brand-red text-xs font-bold mt-1 ml-1 animate-pulse">
                  ⚠ {errors.password.message as string}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center px-1">
              <Label className="uppercase text-[10px] font-black text-gray-500 tracking-[0.2em]">
                Security Key
              </Label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-black text-brand-red/70 hover:text-brand-red transition-colors uppercase tracking-widest no-underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-18 bg-brand-red hover:bg-brand-dark-red text-white rounded-2xl font-black text-lg tracking-tight shadow-3xl shadow-brand-red/30 border-none transition-all active:scale-95 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    AUTHORIZING...
                  </>
                ) : (
                  <>
                    INITIALIZE SECURE ACCESS
                    <ArrowRight
                      className="group-hover:translate-x-2 transition-transform"
                      size={24}
                    />
                  </>
                )}
              </span>
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center space-y-4">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
              System Operator Priority Access Only
            </p>
            <p className="text-sm text-gray-400">
              Don&apos;t have an admin account?{" "}
              <Link
                href="/admin/signup"
                className="text-brand-red font-bold hover:text-white transition-colors underline underline-offset-4 decoration-brand-red/60 hover:decoration-white"
              >
                Create Admin ID
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
