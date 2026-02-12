"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import { showInfo } from "@/lib/sweetalert";
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";
import { auth } from "@/lib/firebase/config";
import { getUserByUid } from "@/lib/services/userService";

const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
});

// Background assets (using standard paths)
// Placeholder avatars - using Mantine Avatar with initials instead
const avatars = [
  { name: "John Smith", initials: "JS", color: "blue" },
  { name: "Sarah Johnson", initials: "SJ", color: "green" },
  { name: "Mike Brown", initials: "MB", color: "orange" },
];

const getServiceCategories = (dict: { dashboard: { mobile_mechanic: string; fuel_delivery: string; tyre_puncture: string; towing_service: string; mechanic_desc: string; fuel_desc: string; tyre_desc: string; tow_desc: string } }) => [
  {
    title: dict.dashboard.mobile_mechanic,
    icon: IconCar,
    color: "blue",
    desc: dict.dashboard.mechanic_desc,
    id: "mechanic",
    gradient: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: dict.dashboard.fuel_delivery,
    icon: IconDroplet,
    color: "red",
    desc: dict.dashboard.fuel_desc,
    id: "fuel",
    gradient: "from-red-600/20 to-rose-600/20",
  },
  {
    title: dict.dashboard.tyre_puncture,
    icon: IconWheel,
    color: "blue",
    desc: dict.dashboard.tyre_desc,
    id: "Tyre Punkcher",
    gradient: "from-blue-600/20 to-indigo-600/20",
  },
  {
    title: dict.dashboard.towing_service,
    icon: IconTruck,
    color: "grape",
    desc: dict.dashboard.tow_desc,
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
  const [userName, setUserName] = useState<string | null>(null);
  const live = useLiveLocation({
    onSuccess: () => toast.success("Location enabled! Your position is now visible on the map."),
  });
  const { dict } = useLanguage();
  const { isDark } = useAppTheme();
  const serviceCategories = getServiceCategories(dict);

  // Firebase: Load user from auth + Firestore
  useEffect(() => {
    let alive = true;
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!alive) return;
      if (!u) {
        setUserName(dict.common.user);
        return;
      }
      const p = await getUserByUid(u.uid);
      if (!alive) return;
      setUserName(p?.displayName ?? u.displayName ?? dict.common.user);
    });
    return () => {
      alive = false;
      unsub();
    };
  }, [dict.common.user]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      [...Array(15)].map((_, i) => ({
        x: Math.random() * 100 + "%",
        y_target: Math.random() * 100 + "%",
        duration: Math.random() * 10 + 10,
      })),
    );
  }, []);

  return (
    <Box className={cn(
      "relative min-h-screen overflow-hidden p-4 md:p-8 transition-colors duration-300",
      isDark ? "bg-gray-950" : "bg-gray-50"
    )}>
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
                {dict.dashboard.member_area}
              </Text>
            </motion.div>
            <Title
              order={1}
              className={cn(
                "font-manrope font-extrabold text-4xl md:text-5xl tracking-tight",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              {dict.dashboard.welcome_back},{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-400">
                {userName ?? dict.common.user}
              </span>
            </Title>
            <Text className={cn("mt-2 font-medium", isDark ? "text-gray-400" : "text-gray-600")}>
              {dict.dashboard.ready_for_journey}
            </Text>
          </Box>
          <motion.div variants={itemVariants as any} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="filled"
              className="bg-brand-red text-white shadow-2xl shadow-brand-red/20 hover:bg-brand-dark-red transition-all font-manrope font-bold rounded-2xl h-14 px-8 border border-white/10 group hover:shadow-brand-red/30"
              leftSection={
                <IconPhoneCall
                  size={20}
                  className="group-hover:animate-bounce"
                />
              }
            >
              {dict.dashboard.emergency_sos}
            </Button>
          </motion.div>
        </Group>

        <SimpleGrid cols={{ base: 1, lg: 3 }} spacing={24} mb={40}>
          {/* --- MAP SECTION --- */}
          <motion.div variants={itemVariants as any} className="lg:col-span-2">
            <Paper
              radius="32px"
              className={cn(
                "relative overflow-hidden h-87.5 md:h-112.5 shadow-2xl group border transition-colors",
                isDark ? "border-white/10 glass-dark" : "border-gray-200/80 bg-white/80 backdrop-blur"
              )}
            >
              <LiveMap
                customer={
                  live.coords
                    ? {
                        lat: live.coords.lat,
                        lng: live.coords.lng,
                        label: dict.common.you,
                      }
                    : null
                }
                helper={null}
                className="absolute inset-0"
              />

              {/* Map Controls */}
              <div className={cn(
                "absolute bottom-8 left-8 right-8 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between z-20 gap-4",
                isDark ? "glass-dark border border-white/20" : "bg-white/90 border border-gray-200/80"
              )}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <IconMapPin size={24} />
                  </div>
                  <div>
                    <Text className={cn("font-bold text-lg leading-tight", isDark ? "text-white" : "text-gray-900")}>
                      {dict.dashboard.live_location}
                    </Text>
                    <Text className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
                      {live.coords
                        ? `${live.coords.lat.toFixed(5)}, ${live.coords.lng.toFixed(5)}`
                        : dict.dashboard.turn_on_gps}
                    </Text>
                  </div>
                </div>
                <Button
                  className={cn(
                    "rounded-xl px-8 h-12 font-bold transition-all w-full md:w-auto hover:scale-105 active:scale-95",
                    isDark ? "bg-white text-black hover:bg-gray-200" : "bg-brand-red text-white hover:bg-brand-dark-red"
                  )}
                  onClick={async () => {
                    await showInfo(
                      "Enable Location",
                      "Allow location access to show your position on the map and enable live tracking for faster assistance.",
                    );
                    live.requestPermission();
                  }}
                  rightSection={<IconArrowRight size={18} />}
                >
                  {dict.dashboard.enable_gps}
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
                      {dict.dashboard.membership_status}
                    </Text>
                    <Badge
                      color="blue"
                      variant="filled"
                      className="bg-blue-500"
                    >
                      {dict.dashboard.pro}
                    </Badge>
                  </Group>
                  <Title
                    order={2}
                    className="font-manrope text-3xl font-black italic text-white"
                  >
                    {dict.dashboard.premium_plan}
                  </Title>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <IconBolt size={14} className="text-yellow-500" />
                  {dict.dashboard.expires_in_days.replace("{days}", "312")}
                </div>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants as any}>
              <Paper
                p={24}
                radius="32px"
                className={cn(
                  "min-h-[210px] shadow-2xl flex flex-col justify-between border transition-colors",
                  isDark ? "glass-dark border-white/10" : "bg-white border-gray-200/80"
                )}
              >
                <div>
                  <Group justify="space-between" mb={8}>
                    <Text className={cn("font-bold text-lg", isDark ? "text-white" : "text-gray-900")}>
                      {dict.dashboard.helpers_nearby}
                    </Text>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase">
                      {dict.dashboard.online_count.replace("{count}", "8")}
                    </div>
                  </Group>
                  <Text size="xs" className={cn("font-medium mb-6", isDark ? "text-gray-500" : "text-gray-600")}>
                    {dict.dashboard.verified_in_radius}
                  </Text>
                </div>

                <Group justify="space-between">
                  <Avatar.Group spacing="lg">
                    {avatars.map((avatar, idx) => (
                      <Avatar
                        key={idx}
                        radius="xl"
                        size="lg"
                        color={avatar.color}
                        className="border-2 border-brand-black"
                      >
                        {avatar.initials}
                      </Avatar>
                    ))}
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
                    className={cn(
                      "transition-all hover:scale-110",
                      isDark ? "bg-white/5 border border-white/10 text-white hover:bg-white/10" : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    )}
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
              className={cn(
                "font-manrope text-2xl font-bold tracking-tight",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              {dict.dashboard.select_service}
            </Title>
            <Text className={cn("font-medium text-sm hidden sm:block", isDark ? "text-gray-500" : "text-gray-600")}>
              {dict.dashboard.choose_best_match}
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
                      "relative h-full border transition-all duration-300 group overflow-hidden shadow-xl hover:shadow-2xl",
                      isDark ? "border-white/10 glass-dark" : "border-gray-200/80 bg-white hover:border-brand-red/30"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
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
                        className={cn(
                          "mb-3 tracking-tight group-hover:text-brand-red transition-colors font-manrope",
                          isDark ? "text-white" : "text-gray-900"
                        )}
                      >
                        {service.title}
                      </Text>
                      <Text
                        size="sm"
                        className={cn(
                          "leading-relaxed font-medium mb-8",
                          isDark ? "text-gray-400" : "text-gray-600"
                        )}
                      >
                        {service.desc}
                      </Text>

                      <div className={cn(
                        "mt-auto flex items-center gap-2 font-bold text-sm",
                        isDark ? "text-white" : "text-gray-900"
                      )}>
                        <span>{dict.dashboard.get_support}</span>
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
            className={cn(
              "shadow-2xl relative overflow-hidden border transition-colors",
              isDark ? "glass-dark border-white/10" : "bg-white border-gray-200/80"
            )}
          >
            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-600/5 blur-[100px] rounded-full" />

            <Group justify="space-between" mb={40}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"
                )}>
                  <IconHistory size={20} />
                </div>
                <Title
                  order={4}
                  className={cn(
                    "font-manrope text-2xl font-bold tracking-tight",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {dict.dashboard.recent_activity}
                </Title>
              </div>
              <Button
                variant="subtle"
                color="gray"
                className={cn(
                  "font-bold hover:scale-105 transition-transform",
                  isDark ? "hover:bg-white/5 text-gray-400" : "hover:bg-gray-100 text-gray-600"
                )}
                rightSection={<IconArrowRight size={14} />}
                component={Link}
                href="/customer/history"
              >
                {dict.sidebar.history}
              </Button>
            </Group>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex flex-col items-center justify-center py-20 rounded-[24px] border",
                  isDark ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-200/80"
                )}
              >
                <div className={cn(
                  "h-20 w-20 rounded-[28px] flex items-center justify-center mb-6 border",
                  isDark ? "bg-white/5 border-white/10 text-gray-600" : "bg-gray-100 border-gray-200 text-gray-500"
                )}>
                  <IconSparkles size={40} />
                </div>
                <Text className={cn("font-bold text-xl mb-2", isDark ? "text-white" : "text-gray-900")}>
                  {dict.dashboard.no_active_requests}
                </Text>
                <Text className={cn("font-medium mb-8 text-center max-w-sm px-6", isDark ? "text-gray-500" : "text-gray-600")}>
                  {dict.dashboard.activity_empty_msg}
                </Text>
                <Button
                  className="bg-brand-red hover:bg-brand-dark-red rounded-xl h-12 px-8 font-bold transition-all shadow-xl shadow-brand-red/20 hover:scale-105 active:scale-95"
                  component={Link}
                  href="/customer/request-help"
                >
                  {dict.dashboard.start_new_request}
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
