"use client";

import StepIndicator from "@/componants//onboarding/StepIndicator";
import Step1Username from "@/componants/onboarding/Step1Username";
import Step2Profile from "@/componants/onboarding/Step2Profile";
import Step3Location from "@/componants/onboarding/Step3Location";
import Step4Calendar from "@/componants/onboarding/Step4Calender";
import { useOnboarding } from "@/context/onboarding.context";
import { useAuth } from "@/hooks/userAuth";
import { step0 } from "@/lib/actions/onboarding";
import { useEffect } from "react";

export default function OnboardingPage() {
  const {step, setStep} = useOnboarding();

   const { user } = useAuth();

   useEffect(() => {
     if (!user) return;

     const getProfile = async () => {
       const  data  = await step0(user.id);
      //  console.log("from step0 :", data);
       if (!data) return;

       setStep(data.onboarding_step);
     };

     getProfile();
   }, [user]);


  return (
    <div className=" h-screen mt-4 mx-auto max-w-xl">
      <StepIndicator step={step} total={4} />

      {step === 1 && <Step1Username/>}
      {step === 2 && <Step2Profile/>}
      {step === 3 && <Step3Location />}
      {step === 4 && <Step4Calendar />}
    </div>
  );
}
