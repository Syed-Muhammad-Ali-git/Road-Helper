"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
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
  Loader2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  uploadImageToCloudinary,
  validateImageFile,
} from "@/lib/services/cloudinaryService";
import { Avatar, Text } from "@mantine/core";
import { Camera } from "lucide-react";

const customerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerRegisterFormProps {
  isLoading: boolean;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

const FormField = React.memo(
  ({
    label,
    error,
    icon: Icon,
    type = "text",
    showPassword,
    onPasswordToggle,
    isDark,
    isRTL,
    ...inputProps
  }: {
    label: string;
    error?: string;
    placeholder: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    type?: string;
    showPassword?: boolean;
    onPasswordToggle?: () => void;
    isDark: boolean;
    isRTL: boolean;
    [key: string]: any;
  }) => (
    <motion.div
      className="space-y-2"
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
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            isDark ? "text-gray-500" : "text-gray-400",
            "pointer-events-none",
          )}
          size={18}
        />
        <Input
          {...inputProps}
          type={showPassword && type === "password" ? "text" : type}
          className={cn(
            "pl-10 transition-all duration-300",
            type === "password" && "pr-10",
            isDark
              ? "bg-black/40 border-gray-700 text-white placeholder:text-gray-500 focus:border-brand-yellow focus:bg-black/60"
              : "bg-white/80 border-gray-300 text-black placeholder:text-gray-400 focus:border-brand-yellow focus:bg-white",
            error && (isDark ? "border-red-500" : "border-red-500"),
          )}
        />
        {type === "password" && onPasswordToggle && (
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
        )}
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

export const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = ({
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
    setValue,
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setProfileImage(url);
    } catch (e) {
      console.error("Cloudinary upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = useCallback(
    async (data: CustomerFormData) => {
      await onSubmit({ ...data, profileImage } as any);
    },
    [onSubmit, profileImage],
  );

  const onPasswordToggle = useCallback(
    () => setShowPassword((prev) => !prev),
    [],
  );

  const formFields = useMemo(
    () => [
      {
        field: "fullName",
        label: dict.auth.full_name,
        icon: User,
        type: "text",
      },
      {
        field: "email",
        label: dict.auth.email_address,
        icon: Mail,
        type: "email",
      },
      {
        field: "phone",
        label: dict.auth.phone_number,
        icon: Phone,
        type: "tel",
      },
    ],
    [dict],
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-4", isRTL && "text-right")}
    >
      {formFields.map((config) => (
        <FormField
          key={config.field}
          label={config.label}
          icon={config.icon}
          type={config.type}
          error={(errors as any)[config.field]?.message}
          isDark={isDark}
          isRTL={isRTL}
          {...register(config.field as any)}
          placeholder={config.label}
        />
      ))}

      {/* Password */}
      <FormField
        label={dict.auth.password}
        icon={Lock}
        type="password"
        placeholder={dict.auth.password}
        showPassword={showPassword}
        onPasswordToggle={onPasswordToggle}
        error={errors.password?.message}
        isDark={isDark}
        isRTL={isRTL}
        {...register("password")}
      />

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
              {dict.auth.create_account}
              {isRTL ? (
                <ArrowRight
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
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
