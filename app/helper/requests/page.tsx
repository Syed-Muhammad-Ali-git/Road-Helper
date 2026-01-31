"use client";

import React from "react";
import {
  Title,
  Text,
  Paper,
  Stack,
  Box,
  Group,
  Button,
  Badge,
  ThemeIcon,
  Avatar,
  SimpleGrid,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMapPin,
  IconCheck,
  IconPhone,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function NearbyRequestsUI() {
  // Mock helper info
  const userData = {
    fullName: "Ali Khan",
    serviceType: "car_mechanic",
    isOnline: true,
  };

  // Hardcoded requests
  const requests = [
    {
      id: "1",
      customerName: "Ahmed Raza",
      vehicleDetails: "Toyota Corolla White (XYZ-123)",
      location: "Gulshan-e-Iqbal, Karachi",
      issueDescription: "Car won't start, engine makes clicking sound",
      createdAt: new Date(),
    },
    {
      id: "2",
      customerName: "Sara Khan",
      vehicleDetails: "Honda Civic Red (ABC-456)",
      location: "Clifton, Karachi",
      issueDescription: "Flat tire, need urgent help to replace it",
      createdAt: new Date(),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box className="p-4 md:p-8 font-satoshi min-h-screen bg-transparent">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Box mb="xl">
            <Text className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-xs">
              Job Requests
            </Text>
            <Title
              order={1}
              className="text-3xl md:text-4xl font-bold text-white font-manrope mb-2"
            >
              Available Jobs
            </Title>
            <Text className="text-gray-400">
              Nearby customers needing your assistance.
            </Text>
          </Box>
        </motion.div>

        {requests.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Paper
              p="xl"
              radius="xl"
              className="glass-dark border-2 border-dashed border-white/10 py-20"
            >
              <Stack align="center" gap="sm">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  className="bg-brand-red/10 text-brand-red mb-4"
                >
                  <IconAlertCircle size={40} />
                </ThemeIcon>
                <Text fw={600} className="text-white text-lg">
                  No requests in your area right now.
                </Text>
                <Text size="sm" className="text-gray-400">
                  Jobs matching your service (
                  {userData.serviceType.replace("_", " ")}) will appear here.
                </Text>
              </Stack>
            </Paper>
          </motion.div>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            {requests.map((req, idx) => (
              <motion.div
                key={req.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Paper
                  p="xl"
                  radius="xl"
                  className="glass-dark border border-white/10 hover:border-brand-red/30 transition-all duration-300 group h-full"
                >
                  <Group justify="space-between" mb="md">
                    <Badge
                      size="lg"
                      className="bg-brand-red text-white font-bold"
                    >
                      PENDING
                    </Badge>
                    <Text size="xs" className="text-gray-400">
                      {req.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Group>

                  <Stack gap="md">
                    <Group gap="md">
                      <Avatar
                        color="blue"
                        radius="xl"
                        size="lg"
                        className="ring-2 ring-blue-500/30"
                      >
                        {req.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Text fw={700} className="text-white text-lg">
                          {req.customerName}
                        </Text>
                        <Text size="sm" className="text-gray-400">
                          {req.vehicleDetails}
                        </Text>
                      </Box>
                    </Group>

                    <Group
                      gap="xs"
                      className="glass p-3 rounded-lg border border-white/5"
                    >
                      <IconMapPin size={18} className="text-brand-red" />
                      <Text size="sm" fw={600} className="text-white">
                        {req.location}
                      </Text>
                    </Group>

                    <Paper
                      p="md"
                      radius="lg"
                      className="bg-white/5 border border-white/5"
                    >
                      <Text size="sm" lineClamp={3} className="text-gray-300">
                        {req.issueDescription}
                      </Text>
                    </Paper>

                    <Group mt="md" grow>
                      <Button
                        className="bg-green-600 hover:bg-green-700 h-12 rounded-xl transition-all font-bold hover:scale-105 active:scale-95"
                        leftSection={<IconCheck size={20} />}
                        disabled={!userData.isOnline}
                        onClick={() => toast.success("Job accepted!")}
                      >
                        Accept Job
                      </Button>
                    </Group>

                    <Group grow>
                      <Button
                        variant="outline"
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-11 rounded-xl transition-all"
                        leftSection={<IconPhone size={18} />}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10 h-11 rounded-xl transition-all"
                        leftSection={<IconBrandWhatsapp size={18} />}
                      >
                        WhatsApp
                      </Button>
                    </Group>

                    {!userData.isOnline && (
                      <Text
                        size="xs"
                        className="text-red-400 font-semibold text-center"
                      >
                        ⚠ Go Online to accept jobs
                      </Text>
                    )}
                  </Stack>
                </Paper>
              </motion.div>
            ))}
          </SimpleGrid>
        )}
      </motion.div>
    </Box>
  );
}
