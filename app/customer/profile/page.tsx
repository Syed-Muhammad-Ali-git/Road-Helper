"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Avatar,
  TextInput,
  Button,
  Group,
  Divider,
  Loader,
} from "@mantine/core";

import { IconUser, IconPhone, IconMail, IconCamera } from "@tabler/icons-react";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";
import { showConfirm, showError, showSuccess } from "@/lib/sweetalert";
import { deleteAccountFully } from "@/lib/services/authService";

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  useEffect(() => {
    let alive = true;
    if (!uid) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      const p = await getUserByUid(uid);
      if (!alive) return;
      setProfile(p);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [uid]);

  const initials = useMemo(() => {
    const name = profile?.displayName ?? profile?.email ?? "User";
    return name.toString().slice(0, 2).toUpperCase();
  }, [profile]);

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-brand-black">
        <Loader size="xl" color="red" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto bg-brand-black text-white">
      <Stack gap="xl">
        <Box>
          <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">
            Account
          </Text>
          <Title order={1} className="font-manrope text-3xl md:text-4xl">
            My Profile
          </Title>
        </Box>

        <Paper p="xl" radius="xl" className="glass-dark border border-white/10 text-center">
          <Box className="relative inline-block mx-auto mb-lg">
            <Avatar size={120} radius="xl" color="red">
              {initials}
            </Avatar>
            <Box className="absolute bottom-0 right-0 bg-black/60 p-2 rounded-full shadow-md border border-white/10 cursor-not-allowed opacity-70">
              <IconCamera size={20} className="text-white" />
            </Box>
          </Box>
          <Title order={2} className="text-white">
            {profile?.displayName ?? "Customer"}
          </Title>
          <Text c="dimmed">CUSTOMER</Text>
        </Paper>

        <Paper p="xl" radius="xl" className="glass-dark border border-white/10">
          <Stack gap="md">
            <TextInput
              label="Full Name"
              value={profile?.displayName ?? ""}
              disabled
              leftSection={<IconUser size={18} />}
            />

            <TextInput
              label="Phone Number"
              value={profile?.phone ?? ""}
              disabled
              leftSection={<IconPhone size={18} />}
            />

            <TextInput
              label="Email Address"
              value={profile?.email ?? ""}
              disabled
              leftSection={<IconMail size={18} />}
            />

            <Divider my="md" label="Security" labelPosition="center" />

            <Button variant="light" color="blue" fullWidth h={48} radius="md">
              Change Password
            </Button>
            <Button variant="filled" color="blue" fullWidth h={48} radius="md">
              Update Profile
            </Button>

            <Divider my="md" label="Danger Zone" labelPosition="center" />
            <Group>
              <Button
                color="red"
                variant="outline"
                fullWidth
                h={48}
                radius="md"
                loading={deleting}
                onClick={async () => {
                  const res = await showConfirm(
                    "Delete account?",
                    "This will permanently delete your account from RoadHelper. This action cannot be undone.",
                    "Delete my account",
                  );
                  if (!res.isConfirmed) return;
                  try {
                    setDeleting(true);
                    await deleteAccountFully();
                    await showSuccess("Account deleted", "We’re sorry to see you go.");
                    window.location.href = "/";
                  } catch (e: unknown) {
                    const msg =
                      e instanceof Error
                        ? e.message
                        : "Unable to delete account. Please re-login and try again.";
                    await showError("Delete failed", msg);
                  } finally {
                    setDeleting(false);
                  }
                }}
              >
                Delete Account
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
