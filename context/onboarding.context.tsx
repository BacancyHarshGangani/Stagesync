"use client";

import { OnboardingForm, onboardingSchema } from "@/lib/Validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

type ContextType = {
  form: UseFormReturn<OnboardingForm>;
  step: number;
  setStep: (step: number) => void;
};

export const OnboardingContext = createContext<ContextType | null>(null);

export const Onboarding = ({ children }: { children: React.ReactNode }) => {

  const [step, setStep] = useState(1);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      bio: "",
      headline: "",
      specialties: [],
      city: "",
      availability: "available",
      google_cal_status: false,
    },
  });

  return (
    <OnboardingContext.Provider value={{form, step, setStep }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("Wrap with OnboardingProvider");
  return ctx;
};