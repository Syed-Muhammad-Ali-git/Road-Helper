"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconPhone,
  IconMapPin,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import LiveMap from "@/components/map/LiveMap";
import { auth } from "@/lib/firebase/config";
import { getCookie } from "cookies-next";
import { showError, showSuccess } from "@/lib/sweetalert";
import {
  subscribeRideRequest,
  updateRideLocations,
  updateRideStatus,
} from "@/lib/services/requestService";
import { getUserByUid } from "@/lib/services/userService";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import type { RideRequestDoc } from "@/types";
import type { AppUserRecord } from "@/lib/services/userService";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function JourneyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = params?.id;
  const role = ((getCookie("role") as string | undefined) ?? "customer") as
    | "customer"
    | "helper"
    | "admin";

  const live = useLiveLocation();
  const [req, setReq] = useState<({ id: string } & RideRequestDoc) | null>(null);
  const [customer, setCustomer] = useState<({ id: string } & AppUserRecord) | null>(null);
  const [helper, setHelper] = useState<({ id: string } & AppUserRecord) | null>(null);

  useEffect(() => {
    if (!requestId) return;
    const unsub = subscribeRideRequest(requestId, async (r) => {
      setReq(r);
      if (!r) return;
      if (r.customerId) setCustomer(await getUserByUid(r.customerId));
      if (r.helperId) setHelper(await getUserByUid(r.helperId));
    });
    return () => unsub();
  }, [requestId]);

  useEffect(() => {
    if (!requestId) return;
    if (!live.coords) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const t = setInterval(() => {
      updateRideLocations({
        requestId,
        customerLocation:
          role === "customer"
            ? { lat: live.coords!.lat, lng: live.coords!.lng }
            : undefined,
        helperLocation:
          role === "helper"
            ? { lat: live.coords!.lat, lng: live.coords!.lng }
            : undefined,
      }).catch(() => {});
    }, 5000);

    return () => clearInterval(t);
  }, [live.coords, requestId, role]);

  const customerPoint = useMemo(() => {
    const loc = req?.customerLocation ?? req?.location;
    if (!loc?.lat || !loc?.lng) return null;
    return { lat: loc.lat, lng: loc.lng, label: "Customer" };
  }, [req]);

  const helperPoint = useMemo(() => {
    const loc = req?.helperLocation;
    if (!loc?.lat || !loc?.lng) return null;
    return { lat: loc.lat, lng: loc.lng, label: "Helper" };
  }, [req]);

  const eta = useMemo(() => {
    if (!customerPoint || !helperPoint) return null;
    const km = haversineKm(customerPoint, helperPoint);
    const minutes = Math.max(3, Math.round((km / 30) * 60)); // assume 30km/h
    return { km, minutes };
  }, [customerPoint, helperPoint]);

  const otherParty = role === "helper" ? customer : helper;
  const otherName = otherParty?.displayName ?? "User";
  const otherPhone = otherParty?.phone ?? null;

  const whatsappHref = useMemo(() => {
    const msg = encodeURIComponent(
      `RoadHelper live request ${requestId}. Hi ${otherName} — I'm on my way.`,
    );
    return `https://wa.me/${(otherPhone ?? "").replace(/[^\d]/g, "")}?text=${msg}`;
  }, [otherName, otherPhone, requestId]);

  return (
    <Box className="min-h-screen p-4 md:p-8 bg-brand-black text-white">
      <Stack gap="lg" className="max-w-6xl mx-auto">
        <Group justify="space-between" align="start">
          <Box>
            <Text className="text-gray-400 text-xs uppercase tracking-wider">
              Live Journey
            </Text>
            <Title order={1} className="font-manrope text-3xl md:text-4xl">
              Request #{requestId}
            </Title>
            <Group gap="sm" mt={6}>
              <Badge className="bg-brand-red text-white">
                {(req?.status ?? "pending").toString().replace("_", " ").toUpperCase()}
              </Badge>
              {eta && (
                <Group gap={6}>
                  <IconClock size={16} className="text-gray-400" />
                  <Text size="sm" className="text-gray-300">
                    ETA ~ {eta.minutes} min ({eta.km.toFixed(1)} km)
                  </Text>
                </Group>
              )}
            </Group>
          </Box>

          <Button
            variant="light"
            color="gray"
            onClick={() =>
              router.push(role === "helper" ? "/helper/requests" : "/customer/request-status")
            }
          >
            Back
          </Button>
        </Group>

        <Paper p="lg" radius="xl" className="glass-dark border border-white/10">
          <Group justify="space-between" align="center" wrap="wrap">
            <Box>
              <Text fw={700} className="text-white">
                Location sharing
              </Text>
              <Text size="sm" className="text-gray-400">
                Turn on GPS to see live markers and calculate ETA.
              </Text>
            </Box>
            <Button
              className="bg-brand-red hover:bg-brand-dark-red rounded-xl"
              leftSection={<IconMapPin size={18} />}
              onClick={() => live.requestPermission()}
            >
              Enable GPS
            </Button>
          </Group>
        </Paper>

        <LiveMap customer={customerPoint} helper={helperPoint} className="h-[420px] w-full rounded-2xl overflow-hidden border border-white/10" />

        <Group align="stretch" grow className="flex-col md:flex-row">
          <Paper p="lg" radius="xl" className="glass-dark border border-white/10">
            <Stack gap="sm">
              <Text className="text-gray-400 text-xs uppercase tracking-wider">
                {role === "helper" ? "Customer" : "Helper"} details
              </Text>
              <Title order={3} className="text-white">
                {otherName}
              </Title>
              <Group gap="sm">
                <Button
                  variant="outline"
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10 rounded-xl"
                  leftSection={<IconBrandWhatsapp size={18} />}
                  disabled={!otherPhone}
                  component="a"
                  href={whatsappHref}
                  target="_blank"
                >
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 rounded-xl"
                  leftSection={<IconPhone size={18} />}
                  disabled={!otherPhone}
                  component="a"
                  href={otherPhone ? `tel:${otherPhone}` : undefined}
                >
                  Call
                </Button>
              </Group>
              {!otherPhone && (
                <Text size="sm" className="text-gray-500">
                  Phone number not available yet.
                </Text>
              )}
            </Stack>
          </Paper>

          <Paper p="lg" radius="xl" className="glass-dark border border-white/10">
            <Stack gap="sm">
              <Text className="text-gray-400 text-xs uppercase tracking-wider">
                Next actions
              </Text>

              {role === "helper" ? (
                <Group grow>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                    onClick={async () => {
                      try {
                        await updateRideStatus({
                          requestId,
                          status: "in_progress",
                          helperLocation: live.coords
                            ? { lat: live.coords.lat, lng: live.coords.lng }
                            : undefined,
                        });
                        await showSuccess("Status updated", "Marked as in progress.");
                      } catch (e: unknown) {
                        await showError(
                          "Update failed",
                          e instanceof Error ? e.message : "Unable to update status.",
                        );
                      }
                    }}
                    disabled={!requestId || req?.status === "completed"}
                  >
                    Start
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 rounded-xl"
                    leftSection={<IconCheck size={18} />}
                    onClick={async () => {
                      try {
                        await updateRideStatus({
                          requestId,
                          status: "completed",
                          helperLocation: live.coords
                            ? { lat: live.coords.lat, lng: live.coords.lng }
                            : undefined,
                        });
                        await showSuccess("Completed", "Great work. Waiting for feedback.");
                      } catch (e: unknown) {
                        await showError(
                          "Update failed",
                          e instanceof Error ? e.message : "Unable to update status.",
                        );
                      }
                    }}
                    disabled={!requestId || req?.status === "completed"}
                  >
                    Complete
                  </Button>
                </Group>
              ) : (
                <Stack gap="sm">
                  <Text size="sm" className="text-gray-300">
                    When your helper completes the job, you’ll be able to leave feedback here.
                  </Text>
                  {req?.status === "completed" && (
                    <Button
                      className="bg-brand-red hover:bg-brand-dark-red rounded-xl"
                      onClick={() => showSuccess("Thanks!", "Feedback flow will appear next.")}
                    >
                      Leave Feedback
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Group>
      </Stack>
    </Box>
  );
}

