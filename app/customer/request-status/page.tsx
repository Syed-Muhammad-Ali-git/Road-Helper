"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Group,
  Button,
  Badge,
  Loader,
  Avatar,
  Timeline,
  Rating,
} from "@mantine/core";
import {
  IconUser,
  IconPhone,
  IconCircleCheck,
  IconClock,
  IconSearch,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

/* ---------------- MOCK DATA ---------------- */

const MOCK_REQUEST = {
  id: "REQ-123",
  serviceType: "car_battery",
  status: "completed", // pending | accepted | in_progress | completed
  helperName: "Ahmed Khan",
  helperPhone: "0301XXXXXXX",
  rating: null,
  createdAt: new Date(),
};

function RequestStatusContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  /* ---------------- FAKE FETCH ---------------- */
  useEffect(() => {
    setTimeout(() => {
      if (!requestId) {
        setRequest(null);
      } else {
        setRequest(MOCK_REQUEST);
      }
      setLoading(false);
    }, 800);
  }, [requestId]);

  const submitRating = async () => {
    if (rating === 0) return;

    toast.success("Thank you for your feedback!");
    setRequest((prev: any) => ({
      ...prev,
      rating,
    }));
  };

  if (loading) {
    return (
      <Box className="p-8 text-center">
        <Loader size="xl" />
      </Box>
    );
  }

  if (!request) {
    return (
      <Box className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <Title order={3}>Request Not Found</Title>
        <Button mt="lg" component={Link} href="/customer/dashboard">
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const getActiveStep = () => {
    switch (request.status) {
      case "pending":
        return 0;
      case "accepted":
        return 1;
      case "in_progress":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Box className="p-4 md:p-8 max-w-4xl mx-auto">
      <Stack gap="xl">
        <Group>
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            component={Link}
            href="/customer/dashboard"
          >
            Dashboard
          </Button>
          <Title order={1}>Request Status</Title>
        </Group>

        <Paper p="xl" radius="xl" withBorder>
          <Badge size="xl" mb="md">
            {request.status.replace("_", " ").toUpperCase()}
          </Badge>

          <Timeline active={getActiveStep()} bulletSize={40} lineWidth={3}>
            <Timeline.Item bullet={<IconSearch />} title="Finding Helper" />
            <Timeline.Item bullet={<IconUser />} title="Helper Assigned" />
            <Timeline.Item bullet={<IconClock />} title="Service in Progress" />
            <Timeline.Item bullet={<IconCircleCheck />} title="Job Completed" />
          </Timeline>

          {request.status === "completed" && !request.rating && (
            <Paper mt="xl" p="lg" radius="lg" withBorder>
              <Stack align="center">
                <Text fw={700}>How was the service?</Text>
                <Rating value={rating} onChange={setRating} size="xl" />
                <Button onClick={submitRating} disabled={rating === 0}>
                  Submit Rating
                </Button>
              </Stack>
            </Paper>
          )}

          {request.helperName && (
            <Paper mt="xl" p="lg" radius="lg" withBorder>
              <Group justify="space-between">
                <Group>
                  <Avatar size="lg">{request.helperName.charAt(0)}</Avatar>
                  <Box>
                    <Text fw={700}>{request.helperName}</Text>
                    <Text size="xs" c="dimmed">
                      Assigned Helper
                    </Text>
                  </Box>
                </Group>
                <Button
                  component="a"
                  href={`tel:${request.helperPhone}`}
                  leftSection={<IconPhone size={18} />}
                >
                  Call
                </Button>
              </Group>
            </Paper>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}

export default function RequestStatus() {
  return (
    <Suspense
      fallback={
        <Box p="xl" className="text-center">
          <Loader size="lg" />
        </Box>
      }
    >
      <RequestStatusContent />
    </Suspense>
  );
}
