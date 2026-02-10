export type PaymentMethod = "jazzcash" | "easypaisa" | "bank";

export interface Plan {
  id: string;
  name: string;
  rideLimit: number;
  pricePKR: number;
  currency: "PKR";
  paymentMethods: PaymentMethod[];
  comingSoon?: boolean;
}

