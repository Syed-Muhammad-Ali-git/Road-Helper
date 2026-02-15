"use client";

import React, { useEffect, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  Button,
  Switch,
  Divider,
  NumberInput,
  Box,
  Center,
  Stack,
} from "@mantine/core";
import { IconShieldLock, IconBell, IconCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  getSystemSettings,
  updateSystemSettings,
} from "@/lib/services/adminService";
import { showSuccess, showError } from "@/lib/sweetalert";
import { useAppTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();
  const [commission, setCommission] = useState<number>(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const settings = await getSystemSettings();
      setCommission(settings.commission);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSystemSettings({ commission });
      await showSuccess(
        dict.common.success || "Settings Saved",
        "Platform configuration has been updated.",
      );
    } catch (e: any) {
      await showError("Save Failed", e.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Center
      className={cn(
        "min-h-screen transition-colors p-4 md:px-8 md:pt-4 md:pb-8",
        isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Box mb={40} className="text-center">
          <Title
            className={cn(
              "font-manrope text-4xl font-black mb-2",
              isDark ? "text-white" : "text-gray-900",
            )}
          >
            {dict.admin.settings_title}
          </Title>
          <Text className="text-gray-500 font-medium">
            {dict.admin.platform_configuration}
          </Text>
        </Box>

        <Paper
          p={40}
          radius="32px"
          className={cn(
            "border space-y-10 shadow-2xl",
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200",
          )}
        >
          <div>
            <Group gap="md" mb="xl">
              <div className="h-10 w-10 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red border border-brand-red/20 transition-transform hover:scale-110">
                <IconShieldLock size={22} />
              </div>
              <Text
                className={cn(
                  "font-black text-xl tracking-tight transition-colors",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {dict.admin.platform_configuration}
              </Text>
            </Group>

            <div className="space-y-4">
              <NumberInput
                label={
                  <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    {dict.admin.system_commission_fee}
                  </Text>
                }
                value={commission}
                onChange={(val) => setCommission(Number(val))}
                min={0}
                max={100}
                suffix="%"
                size="lg"
                classNames={{
                  input: cn(
                    "border-2 h-14 rounded-2xl transition-all font-bold",
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-brand-red"
                      : "bg-gray-50 border-gray-100 text-gray-900 focus:border-brand-red",
                  ),
                }}
              />
              <Text className="text-gray-500 text-xs font-medium leading-relaxed">
                {dict.admin.commission_desc}
              </Text>
            </div>
          </div>

          <Divider color="white" opacity={0.05} />

          <div>
            <Group gap="md" mb="xl">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 transition-transform hover:scale-110">
                <IconBell size={22} />
              </div>
              <Text
                className={cn(
                  "font-black text-xl tracking-tight",
                  isDark ? "text-white" : "text-gray-900",
                )}
              >
                {dict.admin.notification_protocols}
              </Text>
            </Group>

            <Stack gap="lg">
              <Group justify="space-between">
                <div>
                  <Text
                    className={cn(
                      "font-bold",
                      isDark ? "text-gray-200" : "text-gray-800",
                    )}
                  >
                    {dict.admin.email_alerts}
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium">
                    Receive data on new operator registrations
                  </Text>
                </div>
                <Switch color="red" defaultChecked size="md" />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text
                    className={cn(
                      "font-bold",
                      isDark ? "text-gray-200" : "text-gray-800",
                    )}
                  >
                    {dict.admin.health_monitoring}
                  </Text>
                  <Text className="text-gray-500 text-xs font-medium">
                    Get telemetry for system infrastructure
                  </Text>
                </div>
                <Switch color="red" defaultChecked size="md" />
              </Group>
            </Stack>
          </div>

          <Group justify="end" mt={50} gap="md">
            <Button
              variant="subtle"
              color="gray"
              className={cn(
                "font-bold h-14 rounded-2xl px-8",
                isDark
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-400 hover:text-gray-900",
              )}
            >
              {dict.profile.cancel}
            </Button>
            <Button
              className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl px-10 transition-all font-black shadow-xl shadow-brand-red/20 border-none"
              leftSection={<IconCheck size={20} />}
              loading={saving}
              onClick={handleSave}
            >
              {dict.admin.apply_changes}
            </Button>
          </Group>
        </Paper>
      </motion.div>
    </Center>
  );
}
