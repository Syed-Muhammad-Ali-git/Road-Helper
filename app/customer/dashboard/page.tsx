"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Title,
  Text,
  SimpleGrid,
  Paper,
  Stack,
  Button,
  Box,
  Group,
  Avatar,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconCar,
  IconDroplet,
  IconTruck,
  IconMapPin,
  IconPhoneCall,
  IconHistory,
  IconArrowRight,
  IconSparkles,
  IconShieldCheck,
  IconBolt,
  IconWheel,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useLiveLocation } from "@/hooks/useLiveLocation";

const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
});

// Background assets (using standard paths)
const avatar1 = "/assets/images/avatars/avatar-1.jpg";
const avatar5 = "/assets/images/avatars/avatar-5.jpg";
const avatar6 = "/assets/images/avatars/avatar-6.jpg";

const serviceCategories = [
  {
    title: "Mobile Mechanic",
    icon: IconCar,
    color: "blue",
    desc: "Breakdown, tire change, diagnostics",
    id: "mechanic",
    gradient: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: "Fuel Delivery",
    icon: IconDroplet,
    color: "red",
    desc: "Ran out of gas? We'll bring fuel.",
    id: "fuel",
    gradient: "from-red-600/20 to-rose-600/20",
  },
  {
    title: "Tyre Punkcher",
    icon: IconWheel,
    color: "blue",
    desc: "Breakdown, tire change, diagnostics",
    id: "Tyre Punkcher",
    gradient: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: "Towing Service",
    icon: IconTruck,
    color: "grape",
    desc: "Safe towing to nearest garage.",
    id: "tow",
    gradient: "from-purple-600/20 to-pink-600/20",
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const ClientDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState("User");
  const live = useLiveLocation();

  useEffect(() => {
    setIsLoaded(true);
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      try {
        const parsed = JSON.parse(loginData);
        if (parsed.fullName) setUserName(parsed.fullName.split(" ")[0]);
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const particles = useMemo(
    () =>
      [...Array(15)].map((_, i) => ({
        x: Math.random() * 100 + "%",
        y_target: Math.random() * 100 + "%",
        duration: Math.random() * 10 + 10,
      })),
    [],
  );

  return (
    <Box className="relative min-h-screen bg-[#0a0a0a] overflow-hidden p-4 md:p-8">
      {/* --- Premium Background Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-brand-red/10 blur-[120px] rounded-full"
        />

        {/* Particles */}
        {isLoaded &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: p.x,
                y: "100%",
              }}
              animate={{
                y: [null, p.y_target],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
      </div>

      <motion.div
        variants={containerVariants as any}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* --- HEADER SECTION --- */}
        <Group justify="space-between" mb={40} align="flex-end">
          <Box>
            <motion.div
              variants={itemVariants as any}
              className="flex items-center gap-2 mb-2"
            >
              <div className="h-px w-8 bg-brand-red" />
              <Text className="text-brand-red font-bold uppercase tracking-[0.2em] text-[10px]">
                Member Area
              </Text>
            </motion.div>
            <Title
              order={1}
              className="font-manrope font-extrabold text-4xl md:text-5xl text-white tracking-tight"
            >
              Welcome Back,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                {userName}
              </span>
            </Title>
            <Text className="text-gray-400 mt-2 font-medium">
              Ready for your next journey? We&apos;ve got your back.
            </Text>
          </Box>
          <motion.div variants={itemVariants as any}>
            <Button
              variant="filled"
              className="bg-brand-red text-white shadow-2xl shadow-brand-red/20 hover:bg-brand-dark-red transition-all font-manrope font-bold rounded-2xl h-14 px-8 border border-white/10 group"
              leftSection={
                <IconPhoneCall
                  size={20}
                  className="group-hover:animate-bounce"
                />
              }
            >
              Emergency SOS
            </Button>
          </motion.div>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={24} mb={40}>
          {/* --- MAP SECTION --- */}
          <motion.div variants={itemVariants as any} className="lg:col-span-2">
            <Paper
              radius="32px"
              className="relative overflow-hidden h-87.5 md:h-112.5 border border-white/10 glass-dark shadow-2xl group"
            >
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
                className="absolute inset-0"
              />

              {/* Map Controls */}
              <div className="absolute bottom-8 left-8 right-8 p-6 glass-dark rounded-3xl border border-white/20 flex flex-col md:flex-row items-center justify-between z-20 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <IconMapPin size={24} />
                  </div>
                  <div>
                    <Text className="font-bold text-white text-lg leading-tight">
                      Live Location
                    </Text>
                    <Text className="text-sm text-gray-400">
                      {live.coords
                        ? `${live.coords.lat.toFixed(5)}, ${live.coords.lng.toFixed(5)}`
                        : "Turn on GPS to share your location"}
                    </Text>
                  </div>
                </div>
                <Button
                  className="bg-white text-black hover:bg-gray-200 rounded-xl px-8 h-12 font-bold transition-all w-full md:w-auto"
                  onClick={() => live.requestPermission()}
                  rightSection={<IconArrowRight size={18} />}
                >
                  Enable GPS
                </Button>
              </div>
            </Paper>
          </motion.div>

          {/* --- SIDE STATS --- */}
          <Stack gap={24}>
            <motion.div variants={itemVariants as any}>
              <Paper
                p={32}
                radius="32px"
                className="bg-linear-to-br from-blue-600/20 to-indigo-600/20 text-white relative overflow-hidden shadow-2xl border border-blue-500/20 min-h-[210px] flex flex-col justify-between"
              >
                <div className="absolute top-[-20px] right-[-20px] opacity-10">
                  <IconShieldCheck size={180} />
                </div>
                <div>
                  <Group justify="space-between" mb={12}>
                    <Text className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Membership Status
                    </Text>
                    <Badge
                      color="blue"
                      variant="filled"
                      className="bg-blue-500"
                    >
                      PRO
                    </Badge>
                  </Group>
                  <Title
                    order={2}
                    className="font-manrope text-3xl font-black italic"
                  >
                    PREMIUM PLAN
                  </Title>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <IconBolt size={14} className="text-yellow-500" />
                  Expires in 312 days
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <Paper
                p={24}
                radius="32px"
                className="glass-dark border border-white/10 min-h-[210px] shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <Group justify="space-between" mb={8}>
                    <Text className="font-bold text-white text-lg">
                      Helpers Nearby
                    </Text>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase">
                      ● 8 Online
                    </div>
                  </Group>
                  <Text size="xs" className="text-gray-500 font-medium mb-6">
                    Verified professionals in 5km radius
                  </Text>
                </div>

                <Group justify="space-between">
                  <Avatar.Group spacing="lg">
                    <Avatar
                      src={avatar1}
                      radius="xl"
                      size="lg"
                      className="border-2 border-brand-black"
                    />
                    <Avatar
                      src={avatar5}
                      radius="xl"
                      size="lg"
                      className="border-2 border-brand-black"
                    />
                    <Avatar
                      src={avatar6}
                      radius="xl"
                      size="lg"
                      className="border-2 border-brand-black"
                    />
                    <Avatar
                      radius="xl"
                      size="lg"
                      className="bg-white/5 text-gray-400 text-sm font-bold border-2 border-brand-black"
                    >
                      +5
                    </Avatar>
                  </Avatar.Group>
                  <ActionIcon
                    size={48}
                    radius="xl"
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    <IconArrowRight size={20} />
                  </ActionIcon>
                </Group>
              </Paper>
            </motion.div>
          </Stack>
        </SimpleGrid>

        {/* --- SERVICES GRID --- */}
        <div className="mb-40">
          <Group justify="space-between" mb={24} align="flex-end">
            <Title
              order={3}
              className="font-manrope text-2xl font-bold text-white tracking-tight"
            >
              Select Service Category
            </Title>
            <Text className="text-gray-500 font-medium text-sm hidden sm:block">
              Choose what best matches your situation
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={20}>
            {serviceCategories.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants as any}
                whileHover={{
                  y: -10,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="h-full"
              >
                <Link
                  href={`/customer/request-help?service=${service.id}`}
                  className="no-underline block h-full"
                >
                  <Paper
                    p={32}
                    radius="32px"
                    className={cn(
                      "relative h-full border border-white/10 glass-dark transition-all duration-300 group overflow-hidden shadow-xl",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        service.gradient,
                      )}
                    />

                    <div className="relative z-10 flex flex-col h-full">
                      <div
                        className={cn(
                          "h-16 w-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110",
                          `bg-${service.color}-500/10 text-${service.color}-400 group-hover:bg-${service.color}-500/20 group-hover:text-${service.color}-300 border border-white/5`,
                        )}
                      >
                        <service.icon size={32} stroke={1.5} />
                      </div>

                      <Text
                        fw={800}
                        size="xl"
                        className="text-white mb-3 tracking-tight group-hover:text-brand-red transition-colors font-manrope"
                      >
                        {service.title}
                      </Text>
                      <Text
                        size="sm"
                        className="text-gray-400 leading-relaxed font-medium mb-8"
                      >
                        {service.desc}
                      </Text>

                      <div className="mt-auto flex items-center gap-2 text-white font-bold text-sm">
                        <span>Get Support</span>
                        <IconArrowRight
                          size={16}
                          className="group-hover:translate-x-2 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </Paper>
                </Link>
              </motion.div>
            ))}
          </SimpleGrid>
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <motion.div variants={itemVariants as any}>
          <Paper
            p={40}
            radius="32px"
            className="glass-dark border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-600/5 blur-[100px] rounded-full" />

            <Group justify="space-between" mb={40}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  <IconHistory size={20} />
                </div>
                <Title
                  order={4}
                  className="font-manrope text-2xl font-bold text-white tracking-tight"
                >
                  Recent Activity
                </Title>
              </div>
              <Button
                variant="subtle"
                color="gray"
                className="hover:bg-white/5 text-gray-400 font-bold"
                rightSection={<IconArrowRight size={14} />}
              >
                History
              </Button>
            </Group>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-[24px] border border-white/5"
              >
                <div className="h-20 w-20 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 mb-6">
                  <IconSparkles size={40} />
                </div>
                <Text className="text-white font-bold text-xl mb-2">
                  No active requests
                </Text>
                <Text className="text-gray-500 font-medium mb-8 text-center max-w-sm px-6">
                  Your activity feed is empty. When you request help, it will
                  appear here.
                </Text>
                <Button
                  className="bg-brand-red hover:bg-brand-dark-red rounded-xl h-12 px-8 font-bold transition-all shadow-xl shadow-brand-red/20"
                  component={Link}
                  href="/customer/request-help"
                >
                  Start New Request
                </Button>
              </motion.div>
            </AnimatePresence>
          </Paper>
        </motion.div>

        {/* --- SPACER --- */}
        <div className="h-20" />
      </motion.div>
    </Box>
  );
};

export default ClientDashboard;
