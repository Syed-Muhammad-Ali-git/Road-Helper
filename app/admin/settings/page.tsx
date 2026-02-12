"use client";

import React from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  TextInput,
  Button,
  Switch,
  Divider,
  NumberInput,
  Box,
} from "@mantine/core";
import { IconShieldLock, IconBell } from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <Box className="p-4 md:p-8 pt-20 min-h-screen font-satoshi bg-brand-black text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl"
      >
        <Title className="font-manrope text-3xl font-bold text-white mb-1">
          Settings
        </Title>
        <Text className="text-gray-400 mb-8">
          Configure platform fee, security, and notifications.
        </Text>

        <Paper
          p="xl"
          radius="xl"
          className="glass-dark border border-white/10 space-y-6"
        >
          <div>
            <Group gap="xs" mb="xs">
              <IconShieldLock className="text-brand-red" size={20} />
              <Text className="text-white font-bold text-lg">
                Platform Configuration
              </Text>
            </Group>
            <Divider color="dark.6" mb="md" />

            <div className="grid gap-4">
              <NumberInput
                label={
                  <Text className="text-gray-300 mb-1">
                    Platform Commission (%)
                  </Text>
                }
                defaultValue={20}
                min={0}
                max={100}
                suffix="%"
                classNames={{
                  input:
                    "bg-white/5 border-white/10 text-white focus:border-brand-red",
                }}
              />
              <Text size="xs" c="dimmed">
                This percentage will be forcefully deducted from every completed
                request.
              </Text>
            </div>
          </div>

          <div>
            <Group gap="xs" mb="xs">
              <IconBell className="text-brand-red" size={20} />
              <Text className="text-white font-bold text-lg">
                Notifications
              </Text>
            </Group>
            <Divider color="dark.6" mb="md" />

            <Group justify="space-between" mb="sm">
              <div>
                <Text className="text-gray-200">Email Alerts</Text>
                <Text size="xs" className="text-gray-500">
                  Receive emails for new user registrations
                </Text>
              </div>
              <Switch color="red" defaultChecked />
            </Group>

            <Group justify="space-between">
              <div>
                <Text className="text-gray-200">System Warnings</Text>
                <Text size="xs" className="text-gray-500">
                  Get notified for high server load
                </Text>
              </div>
              <Switch color="red" defaultChecked />
            </Group>
          </div>

          <Group justify="end" mt="xl">
            <Button
              variant="default"
              className="bg-transparent border-white/20 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              color="red"
              leftSection={<IconBell size={18} />}
              className="bg-brand-red hover:bg-brand-dark-red"
            >
              Save Changes
            </Button>
          </Group>
        </Paper>
      </motion.div>
    </Box>
  );
}
