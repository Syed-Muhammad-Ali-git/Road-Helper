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
import { Eye, EyeOff, Mail, User, Lock, Phone, CreditCard } from "lucide-react";
import { MultiSelect, Stack } from "@mantine/core";
import { motion } from "framer-motion";

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
  onSubmit: (data: HelperFormData) => Promise<void>;
}

const SERVICE_OPTIONS = [
  { value: "mechanic", label: "🔧 Mobile Mechanic" },
  { value: "tow", label: "🚗 Towing Truck" },
  { value: "fuel", label: "⛽ Fuel Delivery" },
  { value: "medical", label: "🚑 Medical Assistance" },
  { value: "battery", label: "🔋 Battery Jump" },
  { value: "lockout", label: "🔑 Lockout Service" },
] as const;

export const HelperRegisterForm: React.FC<HelperRegisterFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const { dict, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

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
      await onSubmit(data);
    },
    [onSubmit]
  );

  const onPasswordToggle = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const serviceOptions = useMemo(() => SERVICE_OPTIONS, []);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      {/* Full Name */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.full_name}</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            {...register("fullName")}
            placeholder={dict.auth.full_name}
            className={cn(
              "pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
              errors.fullName && "border-red-500"
            )}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-400 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.email_address}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            {...register("email")}
            type="email"
            placeholder={dict.auth.email_address}
            className={cn(
              "pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
              errors.email && "border-red-500"
            )}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.phone_number}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            {...register("phone")}
            type="tel"
            placeholder={dict.auth.phone_number}
            className={cn(
              "pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
              errors.phone && "border-red-500"
            )}
          />
        </div>
        {errors.phone && (
          <p className="text-red-400 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* CNIC */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.cnic_number}</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            {...register("cnic")}
            placeholder={dict.auth.cnic_number}
            className={cn(
              "pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
              errors.cnic && "border-red-500"
            )}
          />
        </div>
        {errors.cnic && (
          <p className="text-red-400 text-sm">{errors.cnic.message}</p>
        )}
      </div>

      {/* Services */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.service_types}</Label>
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
                  backgroundColor: "rgba(0,0,0,0.4)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "white",
                },
                dropdown: {
                  backgroundColor: "rgba(10,10,10,0.95)",
                  borderColor: "rgba(255,255,255,0.1)",
                },
              }}
            />
          )}
        />
        {errors.services && (
          <p className="text-red-400 text-sm">{errors.services.message}</p>
        )}
      </div>

      {/* Password */}
      <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
        <Label className="text-gray-300">{dict.auth.password}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={dict.auth.password}
            className={cn(
              "pl-10 pr-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500",
              errors.password && "border-red-500"
            )}
          />
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-red hover:bg-brand-dark-red text-white font-semibold py-2 rounded-lg transition-all"
      >
        {isLoading ? dict.auth.creating : dict.auth.apply_as_helper}
      </Button>
    </motion.form>
  );
};
