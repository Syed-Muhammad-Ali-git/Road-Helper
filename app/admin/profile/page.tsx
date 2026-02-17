"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import {
  IconMail,
  IconUser,
  IconEdit,
  IconCheck,
  IconX,
  IconLock,
} from "@tabler/icons-react";
import { auth } from "@/lib/firebase/config";
import { getUserByUid, updateUserProfile } from "@/lib/services/userService";
import { showConfirm, showError, showSuccess } from "@/lib/sweetalert";
import { deleteAccountFully } from "@/lib/services/authService";
import { updateEmail, updatePassword, updateProfile } from "firebase/auth";
import type { AppUserRecord } from "@/lib/services/userService";
import { useAppTheme } from "@/app/context/ThemeContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function AdminProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<
    ({ id: string } & AppUserRecord) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isDark } = useAppTheme();
  const { dict } = useLanguage();

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      setDisplayName(p?.displayName ?? "");
      setEmail(p?.email ?? "");
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [uid]);

  const handleSave = async () => {
    if (!uid || !auth.currentUser) return;
    try {
      setSaving(true);

      // Update Firebase Auth Profile
      if (displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }

      // Update Email if changed (requires recent login)
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Update Password if provided
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      // Update Firestore
      await updateUserProfile(uid, { displayName, email });

      setProfile((prev: any) => {
        if (!prev) return null;
        return { ...prev, displayName, email };
      });
      setEditing(false);
      setPassword("");
      await showSuccess(
        "Profile Updated",
        "Your information has been synchronized.",
      );
    } catch (e: any) {
      await showError(
        "Update Failed",
        e.message ||
          "Ensure you have logged in recently to change sensitive data.",
      );
    } finally {
      setSaving(false);
    }
  };

  const initials = useMemo(() => {
    const name = profile?.displayName ?? profile?.email ?? "Admin";
    return name.toString().slice(0, 2).toUpperCase();
  }, [profile]);

  if (loading) {
    return (
      <Box
        className={cn(
          "min-h-screen flex items-center justify-center transition-colors",
          isDark ? "bg-[#0a0a0a]" : "bg-gray-50",
        )}
      >
        <Loader size="xl" color="red" />
      </Box>
    );
  }

  return (
    <Box
      className={cn(
        "min-h-screen p-4 md:px-8 md:pt-4 md:pb-8 max-w-full mx-auto transition-colors",
        isDark ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900",
      )}
    >
      <Stack gap="xl">
        <Box className="text-center md:text-left">
          <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
            Security Clearance
          </Text>
          <Title
            order={1}
            className="font-manrope text-4xl font-extrabold tracking-tight"
          >
            Administrator <span className="text-brand-red">Vault</span>
          </Title>
        </Box>

        <Paper
          p={40}
          radius="32px"
          className={cn(
            "border text-center relative overflow-hidden transition-colors shadow-2xl",
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200",
          )}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
          <Avatar
            size={140}
            radius="100%"
            color="red"
            className="mx-auto border-4 border-white/5 shadow-2xl"
          >
            {initials}
          </Avatar>
          <Title
            order={2}
            className={cn(
              "mt-6 font-manrope font-black text-2xl tracking-tight transition-colors",
              isDark ? "text-white" : "text-gray-900",
            )}
          >
            {profile?.displayName ?? "Admin"}
          </Title>
          <Text className="text-brand-red font-bold text-xs uppercase tracking-widest mt-1">
            Authorized Person
          </Text>
        </Paper>

        <Paper
          p={40}
          radius="32px"
          className={cn(
            "border transition-colors shadow-2xl",
            isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200",
          )}
        >
          <Stack gap="xl">
            <TextInput
              label={
                <Text className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  Display Identity
                </Text>
              }
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!editing}
              leftSection={<IconUser size={18} />}
              classNames={{
                input: cn(
                  "border-2 h-14 rounded-2xl transition-all font-bold",
                  isDark
                    ? "bg-white/5 border-white/5 text-white focus:border-brand-red"
                    : "bg-gray-50 border-gray-100 text-gray-900 focus:border-brand-red",
                ),
              }}
            />

            <TextInput
              label={
                <Text className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  Secure Email
                </Text>
              }
              placeholder="admin@roadhelper.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
              leftSection={<IconMail size={18} />}
              classNames={{
                input: cn(
                  "border-2 h-14 rounded-2xl transition-all font-bold",
                  isDark
                    ? "bg-white/5 border-white/5 text-white focus:border-brand-red"
                    : "bg-gray-50 border-gray-100 text-gray-900 focus:border-brand-red",
                ),
              }}
            />

            {editing && (
              <PasswordInput
                label={
                  <Text className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                    Rotate Security Key (Optional)
                  </Text>
                }
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftSection={<IconLock size={18} />}
                classNames={{
                  input: cn(
                    "border-2 h-14 rounded-2xl transition-all font-bold",
                    isDark
                      ? "bg-white/5 border-white/5 text-white focus:border-brand-red"
                      : "bg-gray-50 border-gray-100 text-gray-900 focus:border-brand-red",
                  ),
                  innerInput: "h-14",
                }}
              />
            )}

            <Divider my="md" color="white" opacity={0.05} />

            {!editing ? (
              <Button
                variant="filled"
                className={cn(
                  "h-14 rounded-2xl font-black transition-all shadow-xl",
                  isDark
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-brand-red text-white hover:bg-brand-dark-red",
                )}
                leftSection={<IconEdit size={20} />}
                onClick={() => setEditing(true)}
              >
                Modify Credentials
              </Button>
            ) : (
              <Group grow gap="md">
                <Button
                  className="bg-brand-red hover:bg-brand-dark-red text-white h-14 rounded-2xl font-black shadow-xl shadow-brand-red/20 border-none"
                  leftSection={<IconCheck size={20} />}
                  loading={saving}
                  onClick={handleSave}
                >
                  Commit Alterations
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  className="text-gray-500 hover:text-white font-bold h-14 rounded-2xl"
                  leftSection={<IconX size={20} />}
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(profile?.displayName ?? "");
                    setEmail(profile?.email ?? "");
                  }}
                >
                  Abort
                </Button>
              </Group>
            )}

            <Box mt={20}>
              <Divider
                mb="xl"
                label={
                  <Text className="text-red-500 font-black text-[10px] uppercase tracking-widest">
                    Danger Zone
                  </Text>
                }
                labelPosition="center"
                color="red"
                opacity={0.2}
              />
              <Button
                color="red"
                variant="subtle"
                fullWidth
                h={56}
                radius="xl"
                className="hover:bg-red-500/10 font-bold"
                loading={deleting}
                onClick={async () => {
                  const res = await showConfirm(
                    "Destroy Admin Entity?",
                    "This will permanently revoke all access rights and delete your profile data. Proceed with extreme caution.",
                    "Destroy Entity",
                  );
                  if (!res.isConfirmed) return;
                  try {
                    setDeleting(true);
                    await deleteAccountFully();
                    await showSuccess(
                      "Entity Destroyed",
                      "Session terminated.",
                    );
                    window.location.href = "/";
                  } catch (e: unknown) {
                    const msg =
                      e instanceof Error ? e.message : "Termination failed.";
                    await showError("Error", msg);
                  } finally {
                    setDeleting(false);
                  }
                }}
              >
                Decommission Account
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
