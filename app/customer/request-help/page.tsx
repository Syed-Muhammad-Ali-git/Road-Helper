"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Button,
  Box,
  Group,
  Select,
  Stepper,
  rem,
  ThemeIcon,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import {
  IconMapPin,
  IconCar,
  IconMessage2,
  IconCheck,
  IconCircleCheck,
  IconCurrentLocation,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import z from "zod";
import { showSuccess, showError } from "@/lib/sweetalert";
import { zodResolver } from "mantine-form-zod-resolver";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import dynamic from 'next/dynamic';
import {
  createRideRequest,
  subscribeRideRequest,
} from "@/lib/services/requestService";

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });
import type { ServiceType } from "@/types";

const requestHelpSchema = z.object({
  serviceType: z.string().min(1, "Service type is required"),
  location: z.string().min(1, "Location is required"),
  vehicleDetails: z.string().min(1, "Vehicle details are required"),
  issueDescription: z.string().min(1, "Issue description is required"),
});

function RequestHelpContent() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();
  const live = useLiveLocation();
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUid(u?.uid ?? null));
    return () => unsub();
  }, []);

  const form = useForm({
    initialValues: {
      serviceType: "",
      location: "",
      vehicleDetails: "",
      issueDescription: "",
    },
    validate: zodResolver(requestHelpSchema),
  });

  const nextStep = () => setActive((prev) => prev + 1);
  const prevStep = () => setActive((prev) => prev - 1);
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!form.validate().hasErrors) {
      setLoading(true);
      const values = form.values;
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          await showError("Not signed in", "Please log in to send a request.");
          setLoading(false);
          return;
        }

        const serviceType = values.serviceType as ServiceType;
        const location = live.coords
          ? {
              lat: live.coords.lat,
              lng: live.coords.lng,
              address: values.location,
            }
          : { lat: 24.8607, lng: 67.0011, address: values.location };

        const id = await createRideRequest({
          customerId: uid,
          serviceType,
          location,
          vehicleDetails: values.vehicleDetails,
          issueDescription: values.issueDescription,
        });
        setRequestId(id);
        setRequestStatus("pending");
        setActive(3);
        await showSuccess(
          "Request sent",
          "We’re notifying nearby helpers. Keep this screen open for live updates.",
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Unable to create request.";
        await showError("Request Failed", msg);
      } finally {
        setLoading(false);
      }
    } else {
      await showError(
        "Validation Error",
        "Please fill in all required fields correctly.",
      );
    }
  };

  useEffect(() => {
    if (!requestId) return;
    const unsub = subscribeRideRequest(requestId, (req) => {
      if (!req) return;
      setRequestStatus((req as any).status ?? null);
      if ((req as any).status === "accepted" && (req as any).helperId) {
        router.push(`/journey/${requestId}`);
      }
    });
    return () => unsub();
  }, [requestId, router]);

  return (
    <Box className="p-4 md:p-8 max-w-4xl mx-auto">
      <Paper p="xl" radius="xl" withBorder>
        <Stepper active={active} allowNextStepsSelect={false}>
          {/* STEP 1 */}
          <Stepper.Step
            label="Service"
            description="What do you need?"
            icon={<IconCar size={rem(18)} />}
            className="w-full"
          >
            <Stack mt="xl">
              <Select
                label="Emergency Service Type"
                placeholder="Select service"
                required
                data={[
                  { value: "mechanic", label: "🔧 Mobile Mechanic" },
                  { value: "tow", label: "🚗 Towing Truck" },
                  { value: "fuel", label: "⛽ Fuel Delivery" },
                  { value: "battery", label: "🔋 Battery Jump" },
                  { value: "lockout", label: "🔑 Lockout Service" },
                ]}
                {...form.getInputProps("serviceType")}
              />
              <TextInput
                label="Current Location"
                required
                leftSection={<IconMapPin size={18} />}
                rightSection={
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={(e) => {
                      e.preventDefault();
                      live.requestPermission();
                    }}
                    leftSection={<IconCurrentLocation size={14} />}
                  >
                    Use GPS
                  </Button>
                }
                {...form.getInputProps("location")}
              />
              {live.error && (
                <Text size="xs" c="dimmed">
                  Location: {live.error}
                </Text>
              )}
            </Stack>
          </Stepper.Step>

          {/* STEP 2 */}
          <Stepper.Step
            label="Details"
            description="Vehicle & Issue"
            icon={<IconMessage2 size={rem(18)} />}
            className="w-full"
          >
            <Stack mt="xl">
              <TextInput
                label="Vehicle Information"
                required
                {...form.getInputProps("vehicleDetails")}
              />
              <Textarea
                label="Issue Description"
                required
                minRows={4}
                {...form.getInputProps("issueDescription")}
              />
            </Stack>
          </Stepper.Step>

          {/* STEP 3 */}
          <Stepper.Step
            label="Review"
            description="Confirm details"
            icon={<IconCheck size={rem(18)} />}
            className="w-full"
          >
            <Stack mt="xl">
              <Title order={4}>Review Your Request</Title>
              <SimpleGrid cols={2}>
                <Box>
                  <Text fw={600}>Service</Text>
                  <Text>{form.values.serviceType.replace("_", " ")}</Text>
                </Box>
                <Box>
                  <Text fw={600}>Location</Text>
                  <Text>{form.values.location}</Text>
                </Box>
              </SimpleGrid>
              <Box>
                <Text fw={600}>Vehicle</Text>
                <Text>{form.values.vehicleDetails}</Text>
              </Box>
              <Box>
                <Text fw={600}>Description</Text>
                <Text>{form.values.issueDescription}</Text>
              </Box>
            </Stack>
          </Stepper.Step>

          {/* DONE */}
          <Stepper.Completed>
            <Stack gap="md" className="py-6">
              <Group justify="space-between" align="center">
                <Group>
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    color="green"
                    variant="light"
                  >
                    <IconCircleCheck size={32} />
                  </ThemeIcon>
                  <Box>
                    <Title order={3}>Request Sent</Title>
                    <Text c="dimmed">
                      Status:{" "}
                      <strong>
                        {(requestStatus ?? "pending").replace("_", " ")}
                      </strong>
                    </Text>
                  </Box>
                </Group>
                <Button
                  variant="light"
                  color="blue"
                  onClick={() =>
                    requestId && router.push(`/journey/${requestId}`)
                  }
                  disabled={!requestId}
                >
                  Open Live View
                </Button>
              </Group>

              <Paper
                p="md"
                radius="xl"
                className="bg-black/20 border border-white/10"
              >
                <Text fw={700} className="text-white mb-1">
                  Request sent, waiting for helper
                </Text>
                <Text size="sm" c="dimmed">
                  Keep this page open. When a helper accepts, we’ll take you to
                  the live journey screen automatically.
                </Text>
              </Paper>

              <LiveMap
                customer={
                  live.coords
                    ? {
                        lat: live.coords.lat,
                        lng: live.coords.lng,
                        label: "You",
                      }
                    : null
                }
                helper={null}
              />

              <Group justify="center">
                <Button
                  variant="light"
                  color="gray"
                  onClick={() => {
                    setActive(0);
                    setRequestId(null);
                    setRequestStatus(null);
                    form.reset();
                  }}
                >
                  Make Another Request
                </Button>
              </Group>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active < 3 && (
          <Group justify="center" mt="xl">
            {active > 0 && (
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
            {active < 2 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button
                loading={loading}
                onClick={handleSubmit}
                type="submit"
                disabled={!uid}
              >
                Send Request
              </Button>
            )}
          </Group>
        )}
      </Paper>
    </Box>
  );
}

export default function RequestHelpPage() {
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <RequestHelpContent />
    </Suspense>
  );
}
