"use client";

import { useState } from "react";
import { useOnboarding } from "@/context/onboarding.context";
import { useAuth } from "@/hooks/userAuth";
import { step3 } from "@/lib/actions/onboarding";

export default function Step3Location() {

  const { form , step, setStep } = useOnboarding();
  const { user } = useAuth();

  const city = form.watch("city") || "";
  const availability = form.watch("availability");
  const [saving, setSaving] = useState(false);

  // console.log(form.formState.errors)

  const handleContinue = async () => {

    setSaving(true);

    if (!user) {
      setSaving(false);
      return;
    }

    try {
      await step3(user.id, city.trim(), availability);

      setStep(step + 1);
    } catch (error) {
      console.log(error)
    }

    setSaving(false);

  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Location & availability</h2>

      <input
        placeholder="City / Region"
        {...form.register("city")}
        className="border p-2 w-full"
      />
      {form.formState.errors.city?.message && <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>}

      <select
        {...form.register("availability")}
        className="border p-2 rounded"
      >
        <option value="available" className="bg-gray-800 text-amber-50">
          Taking New Bookings
        </option>
        <option value="at_capacity" className="bg-gray-800 text-amber-50">
          At Capacity
        </option>
      </select>

      <button
        onClick={handleContinue}
        disabled={saving}
        className="mt-6 bg-black text-white px-4 py-2 rounded disabled:opacity-40"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
