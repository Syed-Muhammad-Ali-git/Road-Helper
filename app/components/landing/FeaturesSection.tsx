"use client";
import {
  Container,
  Grid,
  Text,
  Title,
  ThemeIcon,
  Card,
  SimpleGrid,
} from "@mantine/core";
import {
  IconClock,
  IconShieldCheck,
  IconWallet,
  IconMapPin,
  IconUserCheck,
  IconCar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: IconClock,
    title: "Lighting Fast Response",
    description:
      "Our helpers are notified instantly. Average arrival time is 15-30 minutes.",
  },
  {
    icon: IconShieldCheck,
    title: "Trusted Professionals",
    description:
      "Every helper is verified, background-checked, and rated by users like you.",
  },
  {
    icon: IconWallet,
    title: "Transparent Pricing",
    description:
      "Know the cost upfront. No hidden fees, no haggling. Pay securely through the app.",
  },
];

const steps = [
  {
    num: "01",
    title: "Request Help",
    desc: "Choose your service (tow, tire, gas) and set your location.",
    icon: IconMapPin,
  },
  {
    num: "02",
    title: "Get Matched",
    desc: "Nearby helpers accept your request. See their profile and ETA.",
    icon: IconUserCheck,
  },
  {
    num: "03",
    title: "Back on the Road",
    desc: "Get help quick. Pay seamlessly and rate your experience.",
    icon: IconCar,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      <div className="absolute inset-0 bg-transparent -z-10" />

      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Text className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2">
            Why Road Helper
          </Text>
          <Title className="font-satoshi text-3xl md:text-5xl font-bold text-white mb-4">
            Emergency assistance, <br />{" "}
            <span className="text-gray-500">redefined.</span>
          </Title>
        </motion.div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing={30} className="mb-32">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card
                padding="xl"
                radius="lg"
                className="glass-dark border border-white/5 hover:border-brand-red/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 group h-full"
              >
                <ThemeIcon
                  size={60}
                  radius="md"
                  className="bg-brand-red/10 text-brand-red mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  <f.icon size={30} stroke={1.5} />
                </ThemeIcon>
                <Text className="font-satoshi text-xl font-bold text-white mb-3">
                  {f.title}
                </Text>
                <Text className="text-gray-400 leading-relaxed">
                  {f.description}
                </Text>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* HOW IT WORKS */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-brand-charcoal to-brand-black rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden border border-white/10"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/20 opacity-30 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <Text className="text-brand-red font-bold uppercase tracking-widest text-sm mb-2">
                How it works
              </Text>
              <Title className="font-satoshi text-3xl md:text-4xl font-bold text-white">
                Simple steps to safety
              </Title>
            </div>

            <Grid gutter={50}>
              {steps.map((s, i) => (
                <Grid.Col span={{ base: 12, md: 4 }} key={i}>
                  <div className="relative pl-8 border-l border-white/10 md:border-none md:pl-0 md:text-center group">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-red-500/25">
                      <s.icon size={36} stroke={1.5} />
                    </div>
                    <Text className="text-6xl font-black text-white/5 absolute -top-6 left-4 md:left-1/2 md:-translate-x-1/2 font-satoshi z-0 select-none">
                      {s.num}
                    </Text>
                    <Text className="font-satoshi text-xl font-bold text-white mb-2 relative z-10">
                      {s.title}
                    </Text>
                    <Text className="text-gray-400 relative z-10 leading-relaxed max-w-xs mx-auto">
                      {s.desc}
                    </Text>
                  </div>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
