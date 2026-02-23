"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Phone,
  CreditCard,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "@/lib/services/cloudinaryService";
import { MultiSelect, Avatar, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const helperSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  cnic: z
    .string()
    .min(13, "CNIC must be 13 digits")
    .regex(/^\d+$/, "CNIC must be numbers only"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  services: z.array(z.string()).min(1, "Select at least one service"),
});

export type HelperFormData = z.infer<typeof helperSchema>;

interface HelperRegisterFormProps {
  isLoading: boolean;
  onSubmit: (
    data: HelperFormData & { profileImage?: string | null },
  ) => Promise<void>;
}

const SERVICE_OPTIONS = [
  { value: "mechanic", label: "🔧 Mobile Mechanic" },
  { value: "tow", label: "🚗 Towing Truck" },
  { value: "fuel", label: "⛽ Fuel Delivery" },
  { value: "medical", label: "🚑 Medical Assistance" },
  { value: "battery", label: "🔋 Battery Jump" },
  { value: "lockout", label: "🔑 Lockout Service" },
] as const;

const FormField = React.memo(
  ({
    label,
    error,
    icon: Icon,
    children,
    isDark,
    isRTL,
  }: {
    label: string;
    error?: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    children: React.ReactNode;
    isDark: boolean;
    isRTL: boolean;
  }) => (
    <motion.div
      className={cn("space-y-2", isRTL && "text-right")}
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Label
        className={cn(
          "text-sm font-semibold",
          isDark ? "text-gray-300" : "text-gray-700",
        )}
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none",
            isDark ? "text-gray-500" : "text-gray-400",
          )}
          size={18}
        />
        {children}
      </div>
      {error && (
        <p
          className={cn(
            "text-sm font-medium",
            isDark ? "text-red-400" : "text-red-600",
          )}
        >
          {error}
        </p>
      )}
    </motion.div>
  ),
);

FormField.displayName = "FormField";

export const HelperRegisterForm: React.FC<HelperRegisterFormProps> = ({
  isLoading: externalLoading,
  onSubmit,
}) => {
  const { dict, isRTL } = useLanguage();
  const { isDark } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const isLoading = externalLoading || uploading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<HelperFormData>({
    resolver: zodResolver(helperSchema),
    defaultValues: { services: [] },
  });

  const handleFormSubmit = useCallback(
    async (data: HelperFormData) => {
      await onSubmit({ ...data, profileImage });
    },
    [onSubmit, profileImage],
  );

  const onPasswordToggle = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );

  const serviceOptions = useMemo(() => SERVICE_OPTIONS, []);

  const inputClassName = (hasError?: boolean) =>
    cn(
      "pl-10 transition-all duration-300",
      isDark
        ? "bg-black/40 border-gray-700 text-white placeholder:text-gray-500 focus:border-brand-yellow focus:bg-black/60"
        : "bg-white/80 border-gray-300 text-black placeholder:text-gray-400 focus:border-brand-yellow focus:bg-white",
      hasError && (isDark ? "border-red-500" : "border-red-500"),
    );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-4", isRTL && "text-right")}
    >
      {/* Full Name */}
      <FormField
        label={dict.auth.full_name}
        icon={User}
        isDark={isDark}
        isRTL={isRTL}
        error={errors.fullName?.message}
      >
        <Input
          {...register("fullName")}
          placeholder={dict.auth.full_name}
          className={inputClassName(!!errors.fullName)}
        />
      </FormField>

      {/* Email */}
      <FormField
        label={dict.auth.email_address}
        icon={Mail}
        isDark={isDark}
        isRTL={isRTL}
        error={errors.email?.message}
      >
        <Input
          {...register("email")}
          type="email"
          placeholder={dict.auth.email_address}
          className={inputClassName(!!errors.email)}
        />
      </FormField>

      {/* Phone */}
      <FormField
        label={dict.auth.phone_number}
        icon={Phone}
        isDark={isDark}
        isRTL={isRTL}
        error={errors.phone?.message}
      >
        <Input
          {...register("phone")}
          type="tel"
          placeholder={dict.auth.phone_number}
          className={inputClassName(!!errors.phone)}
        />
      </FormField>

      {/* CNIC */}
      <FormField
        label={dict.auth.cnic_number}
        icon={CreditCard}
        isDark={isDark}
        isRTL={isRTL}
        error={errors.cnic?.message}
      >
        <Input
          {...register("cnic")}
          placeholder={dict.auth.cnic_number}
          className={inputClassName(!!errors.cnic)}
        />
      </FormField>

      {/* Services */}
      <motion.div
        className={cn("space-y-2", isRTL && "text-right")}
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label
          className={cn(
            "text-sm font-semibold",
            isDark ? "text-gray-300" : "text-gray-700",
          )}
        >
          {dict.auth.service_types}
        </Label>
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <MultiSelect
              {...field}
              data={serviceOptions}
              placeholder={dict.auth.service_types}
              searchable
              clearable
              className="rounded-lg"
              styles={{
                input: {
                  backgroundColor: isDark
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(255,255,255,0.8)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                  color: isDark ? "white" : "black",
                },
                dropdown: {
                  backgroundColor: isDark
                    ? "rgba(10,10,10,0.95)"
                    : "rgba(255,255,255,0.95)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                },
                option: {
                  color: isDark ? "white" : "black",
                  "&:hover": {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                },
              }}
            />
          )}
        />
        {errors.services && (
          <p
            className={cn(
              "text-sm font-medium",
              isDark ? "text-red-400" : "text-red-600",
            )}
          >
            {errors.services.message}
          </p>
        )}
      </motion.div>

      {/* Password */}
      <motion.div
        className={cn("space-y-2", isRTL && "text-right")}
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label
          className={cn(
            "text-sm font-semibold",
            isDark ? "text-gray-300" : "text-gray-700",
          )}
        >
          {dict.auth.password}
        </Label>
        <div className="relative">
          <Lock
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none",
              isDark ? "text-gray-500" : "text-gray-400",
            )}
            size={18}
          />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={dict.auth.password}
            className={cn(
              "pl-10 pr-10 transition-all duration-300",
              isDark
                ? "bg-black/40 border-gray-700 text-white placeholder:text-gray-500 focus:border-brand-yellow focus:bg-black/60"
                : "bg-white/80 border-gray-300 text-black placeholder:text-gray-400 focus:border-brand-yellow focus:bg-white",
              errors.password && (isDark ? "border-red-500" : "border-red-500"),
            )}
          />
          <button
            type="button"
            onClick={onPasswordToggle}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors",
              isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p
            className={cn(
              "text-sm font-medium",
              isDark ? "text-red-400" : "text-red-600",
            )}
          >
            {errors.password.message}
          </p>
        )}
      </motion.div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full h-16 text-lg font-bold rounded-xl mt-4 group relative overflow-hidden border-2 transition-all duration-500 cursor-pointer",
          isDark
            ? "bg-gradient-to-r from-brand-red via-brand-dark-red to-brand-red hover:shadow-2xl hover:shadow-brand-red/50 text-white border-2 border-brand-red/50 hover:border-brand-red"
            : "bg-gradient-to-r from-brand-red via-orange-600 to-brand-red hover:shadow-2xl hover:shadow-red-500/30 text-white border-2 border-brand-red hover:border-brand-red",
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
              {dict.auth.creating}
            </>
          ) : (
            <>
              {dict.auth.apply_as_helper}
              {isRTL ? (
                <ArrowRight
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform rotate-180"
                />
              ) : (
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </>
          )}
        </span>
      </Button>
    </motion.form>
  );
};
