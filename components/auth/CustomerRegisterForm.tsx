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
import { Eye, EyeOff, Mail, User, Lock, Phone } from "lucide-react";
import { motion } from "framer-motion";

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
          isDark ? "text-gray-300" : "text-gray-700"
        )}
      >
        {label}
      </Label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2",
            isDark ? "text-gray-500" : "text-gray-400",
            "pointer-events-none"
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
            error && (isDark ? "border-red-500" : "border-red-500")
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
                : "text-gray-500 hover:text-gray-700"
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
            isDark ? "text-red-400" : "text-red-600"
          )}
        >
          {error}
        </p>
      )}
    </motion.div>
  )
);

FormField.displayName = "FormField";

export const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const { dict, isRTL } = useLanguage();
  const { isDark } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const handleFormSubmit = useCallback(
    async (data: CustomerFormData) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  const onPasswordToggle = useCallback(
    () => setShowPassword((prev) => !prev),
    []
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
    [dict]
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
        className="w-full bg-brand-red hover:bg-brand-dark-red text-white font-semibold py-2 rounded-lg transition-all"
      >
        {isLoading ? "Creating..." : dict.auth.create_account}
      </Button>
    </motion.form>
  );
};
