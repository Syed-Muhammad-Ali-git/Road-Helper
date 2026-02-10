"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Button, Divider, Group, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { IconMail, IconUser } from "@tabler/icons-react";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";
import { showConfirm, showError, showSuccess } from "@/lib/sweetalert";
import { deleteAccountFully } from "@/lib/services/authService";
import type { AppUserRecord } from "@/lib/services/userService";

export default function AdminProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<({ id: string } & AppUserRecord) | null>(
    null,
  );
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
    const name = profile?.displayName ?? profile?.email ?? "Admin";
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
          <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Account</Text>
          <Title order={1} className="font-manrope text-3xl md:text-4xl">
            My Profile
          </Title>
        </Box>

        <Paper p="xl" radius="xl" className="glass-dark border border-white/10 text-center">
          <Avatar size={120} radius="xl" color="red" className="mx-auto">
            {initials}
          </Avatar>
          <Title order={2} className="text-white mt-4">
            {profile?.displayName ?? "Admin"}
          </Title>
          <Text c="dimmed">ADMIN</Text>
        </Paper>

        <Paper p="xl" radius="xl" className="glass-dark border border-white/10">
          <Stack gap="md">
            <Group grow>
              <div>
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Name</Text>
                <Group gap="xs">
                  <IconUser size={18} className="text-brand-red" />
                  <Text className="text-white font-semibold">{profile?.displayName ?? "-"}</Text>
                </Group>
              </div>
              <div>
                <Text className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</Text>
                <Group gap="xs">
                  <IconMail size={18} className="text-brand-red" />
                  <Text className="text-white font-semibold">{profile?.email ?? "-"}</Text>
                </Group>
              </div>
            </Group>

            <Divider my="md" label="Danger Zone" labelPosition="center" />
            <Button
              color="red"
              variant="outline"
              fullWidth
              h={48}
              radius="md"
              loading={deleting}
              onClick={async () => {
                const res = await showConfirm(
                  "Delete admin account?",
                  "This will permanently delete your admin account from RoadHelper. This action cannot be undone.",
                  "Delete my admin account",
                );
                if (!res.isConfirmed) return;
                try {
                  setDeleting(true);
                  await deleteAccountFully();
                  await showSuccess("Account deleted", "You have been signed out.");
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
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

