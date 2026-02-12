"use client";

import { memo, useMemo } from "react";
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
import { useLanguage } from "@/app/context/LanguageContext";
import { useAppTheme } from "@/app/context/ThemeContext";

const FeaturesSectionComponent = () => {
  const { dict, isRTL } = useLanguage();
  const { theme } = useAppTheme();

  const features = useMemo(
    () => [
      {
        icon: IconClock,
        title: dict.features.feature1_title,
        description: dict.features.feature1_desc,
      },
      {
        icon: IconShieldCheck,
        title: dict.features.feature2_title,
        description: dict.features.feature2_desc,
      },
      {
        icon: IconWallet,
        title: dict.features.feature3_title,
        description: dict.features.feature3_desc,
      },
    ],
    [dict],
  );

  const steps = useMemo(
    () => [
      {
        num: "01",
        title: dict.features.step1_title,
        desc: dict.features.step1_desc,
        icon: IconMapPin,
      },
      {
        num: "02",
        title: dict.features.step2_title,
        desc: dict.features.step2_desc,
        icon: IconUserCheck,
      },
      {
        num: "03",
        title: dict.features.step3_title,
        desc: dict.features.step3_desc,
        icon: IconCar,
      },
    ],
    [dict],
  );

  const isDark = theme === "dark";

  return (
    <section
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${isDark ? "" : "bg-gray-50"}`}
      id="features"
    >
      <div className="absolute inset-0 bg-transparent -z-10" />

      <Container size="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Text
            className={`font-bold uppercase tracking-widest text-sm mb-2 ${isDark ? "text-brand-red" : "text-brand-gold"}`}
          >
            {dict.features.why_road_helper}
          </Text>
          <Title
            className={`font-satoshi text-3xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}
          >
            {dict.features.title} <br />{" "}
            <span className={`${isDark ? "text-gray-500" : "text-gray-400"}`}>
              {dict.features.subtitle}
            </span>
          </Title>
        </motion.div>

        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing={30}
          className={`mb-32 ${isRTL ? "text-right" : "text-left"}`}
        >
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
                className={`${isDark ? "glass-dark border-white/5" : "bg-white border-black/5 shadow-md"} border hover:border-brand-red/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 group h-full`}
              >
                <ThemeIcon
                  size={60}
                  radius="md"
                  className={`${isDark ? "bg-brand-red/10 text-brand-red" : "bg-brand-yellow/10 text-brand-gold"} mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                >
                  <f.icon size={30} stroke={1.5} />
                </ThemeIcon>
                <Text
                  className={`font-satoshi text-xl font-bold mb-3 ${isDark ? "text-white" : "text-black"}`}
                >
                  {f.title}
                </Text>
                <Text
                  className={`${isDark ? "text-gray-400" : "text-gray-600"} leading-relaxed`}
                >
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
          className={`${isDark ? "bg-linear-to-br from-brand-charcoal to-brand-black" : "bg-white shadow-xl"} rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden border ${isDark ? "border-white/10" : "border-black/5"}`}
        >
          {/* Glow Effect */}
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? "bg-brand-red/20" : "bg-brand-yellow/10"} opacity-30 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none`}
          ></div>

          <div className="relative z-10">
            <div className="text-center mb-16">
              <Text
                className={`${isDark ? "text-brand-red" : "text-brand-gold"} font-bold uppercase tracking-widest text-sm mb-2`}
              >
                {dict.features.steps_title}
              </Text>
              <Title
                className={`font-satoshi text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-black"}`}
              >
                {dict.how_it_works.title} {dict.how_it_works.subtitle}
              </Title>
            </div>

            <Grid gutter={50} className={isRTL ? "text-right" : "text-left"}>
              {steps.map((s, i) => (
                <Grid.Col
                  span={{ base: 12, md: 4 }}
                  key={i}
                  order={isRTL ? 3 - i : i}
                >
                  <div
                    className={`relative pl-8 border-l ${isDark ? "border-white/10" : "border-black/10"} md:border-none md:pl-0 md:text-center group`}
                  >
                    <div
                      className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl border ${isDark ? "bg-white/5 border-white/10 text-brand-red" : "bg-black/5 border-black/10 text-brand-gold"} group-hover:bg-brand-red group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-red-500/25`}
                    >
                      <s.icon size={36} stroke={1.5} />
                    </div>
                    <Text
                      className={`text-6xl font-black absolute -top-6 ${isRTL ? "right-4 md:left-1/2 md:-translate-x-1/2" : "left-4 md:left-1/2 md:-translate-x-1/2"} font-satoshi z-0 select-none ${isDark ? "text-white/5" : "text-black/5"}`}
                    >
                      {s.num}
                    </Text>
                    <Text
                      className={`font-satoshi text-xl font-bold mb-2 relative z-10 ${isDark ? "text-white" : "text-black"}`}
                    >
                      {s.title}
                    </Text>
                    <Text
                      className={`${isDark ? "text-gray-400" : "text-gray-600"} relative z-10 leading-relaxed max-w-xs mx-auto`}
                    >
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
};

export const FeaturesSection = memo(FeaturesSectionComponent);
