export interface SubscriptionPlan {
  id: string;
  name: string;
  pricePKR: number;
  description: string;
  maxRides: number;
  isDefault?: boolean;
  comingSoon?: boolean;
  highlights: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    pricePKR: 0,
    description: "Perfect for getting started and building your first reviews.",
    maxRides: 10,
    isDefault: true,
    highlights: [
      "10 rides included",
      "Access to nearby requests",
      "Basic support",
      "JazzCash / EasyPaisa / Bank (future)",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    pricePKR: 1999,
    description: "Designed for active helpers who want more volume and priority placement.",
    maxRides: 150,
    comingSoon: true,
    highlights: [
      "Up to 150 rides / month",
      "Priority listing in busy areas",
      "Faster payout options (future)",
      "Premium support",
    ],
  },
];

