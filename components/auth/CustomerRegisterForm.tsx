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
    ...inputProps
  }: {
    label: string;
    error?: string;
    placeholder: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    type?: string;
    showPassword?: boolean;
    onPasswordToggle?: () => void;
    [key: string]: any;
  }) => (
    <div className="space-y-2">
      <Label className="text-gray-300">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input
          {...inputProps}
          type={showPassword && type === "password" ? "text" : type}
          className={cn(
            "pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
            type === "password" && "pr-10",
            error && "border-red-500"
          )}
        />
        {type === "password" && onPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
);

FormField.displayName = "FormField";

export const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const { dict, isRTL } = useLanguage();
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

  const formFields = useMemo(() => [
    { field: "fullName", label: dict.auth.full_name, icon: User, type: "text" },
    { field: "email", label: dict.auth.email_address, icon: Mail, type: "email" },
    { field: "phone", label: dict.auth.phone_number, icon: Phone, type: "tel" },
  ], [dict]);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {formFields.map((config) => (
        <FormField
          key={config.field}
          label={config.label}
          icon={config.icon}
          type={config.type}
          placeholder={config.label}
          error={errors[config.field as keyof typeof errors]?.message}
          {...register(config.field as keyof CustomerFormData)}
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
