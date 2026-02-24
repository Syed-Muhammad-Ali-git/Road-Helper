"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { requestOps, type ServiceType } from "@/lib/firestore";

const SERVICES: {
  id: ServiceType;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "towing",
    label: "Towing",
    icon: "🚙",
    desc: "Need your vehicle moved",
  },
  {
    id: "tire-change",
    label: "Flat Tire",
    icon: "🛞",
    desc: "Spare replacement",
  },
  {
    id: "fuel-delivery",
    label: "Fuel Delivery",
    icon: "⛽",
    desc: "Out of gas",
  },
  {
    id: "battery-jump",
    label: "Battery Jump",
    icon: "🔋",
    desc: "Dead battery",
  },
  {
    id: "lockout",
    label: "Lockout Help",
    icon: "🔑",
    desc: "Keys locked inside",
  },
];

function RequestHelpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initType = searchParams.get("type") as ServiceType;

  const { user, profile } = useAuthStore();

  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceType | "">(initType || "");
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: "" });
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    if (step === 2 && !location.lat) {
      setLocLoading(true);
      // Fake location detect for demo
      setTimeout(() => {
        setLocation({
          lat: 31.5204,
          lng: 74.3587,
          address: "Ferozepur Road, Lahore",
        });
        setLocLoading(false);
      }, 1500);
    }
  }, [step, location.lat]);

  const handleSubmit = async () => {
    if (!user || !profile || !service) return;
    setLoading(true);
    try {
      const id = await requestOps.create({
        customerId: user.uid,
        customerName: profile.name || "Customer",
        customerPhone: profile.phone || "N/A",
        service,
        location,
        notes,
      });
      router.push(`/customer/request-status?id=${id}`);
    } catch (e) {
      alert("Failed to request help");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative z-10 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">
          Request Assistance
        </h1>
        <p className="text-dark-muted">
          Get a trusted professional to your location instantly.
        </p>
      </div>

      <div className="flex justify-between items-center relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-dark-border -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-500 z-0"
          style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
        />
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 transition-all duration-300 ${step >= s ? "bg-primary text-white shadow-glow-primary" : "bg-dark-surface border-2 border-dark-border text-dark-muted"}`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="card glass p-8">
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6">
              1. What do you need help with?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setService(s.id);
                    setStep(2);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all ${service === s.id ? "bg-primary/10 border-primary shadow-glow-primary" : "bg-dark-surface border-dark-border hover:border-primary/50"}`}
                >
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="font-bold text-lg mb-1">{s.label}</div>
                  <div className="text-sm text-dark-muted">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6">
              2. Where are you located?
            </h2>
            {locLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-dark-muted">
                <div className="w-8 h-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin mb-4" />
                Detecting GPS Location...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="h-48 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/map.png')]" />
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-4 h-4 bg-primary rounded-full" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-muted">
                    Identified Address
                  </label>
                  <input
                    type="text"
                    value={location.address}
                    onChange={(e) =>
                      setLocation({ ...location, address: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter landmark or street address"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-dark-muted">
                    Any details for the helper? (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field min-h-[100px] resize-none"
                    placeholder="E.g. I am parked near the gas station."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="btn-ghost">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary">
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6">3. Confirm Request</h2>
            <div className="bg-dark-surface rounded-xl p-6 border border-dark-border space-y-4 mb-8">
              <div className="flex items-center justify-between pb-4 border-b border-dark-border">
                <span className="text-dark-muted">Service</span>
                <span className="font-bold text-lg capitalize">
                  {service.replace("-", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-dark-border">
                <span className="text-dark-muted">Location</span>
                <span className="font-semibold text-right max-w-[200px]">
                  {location.address}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-muted">Estimated Cost</span>
                <span className="font-bold text-xl text-primary">
                  $40 - $80
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                disabled={loading}
                onClick={() => setStep(2)}
                className="btn-ghost"
              >
                Edit
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="btn-primary px-10"
              >
                {loading ? "Submitting..." : "Confirm Request"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RequestHelpPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-[5%] bg-dark-bg text-white bg-grid noise-overlay">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <RequestHelpContent />
      </Suspense>
    </div>
  );
}
