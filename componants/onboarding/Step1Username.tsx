"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useOnboarding } from "@/context/onboarding.context";
import { saveUsername } from "@/lib/actions/onboarding";
import { useAuth } from "@/hooks/userAuth";

export default function Step1Username() {
  const { form, step, setStep } = useOnboarding();
  const { user } = useAuth();

  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const username = form.watch("username") || "";

  useEffect(() => {
    if (!username.trim()) {
      setAvailable(null);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("planner_profile")
        .select("username")
        .eq("username", username.trim())
        .maybeSingle();

      setAvailable(!data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // console.log(form.formState.errors);

  const handleContinue = async () => {

    if (available !== true) return;

    setSaving(true);

    if (!user) return;

    try {
      await saveUsername(user.id, username.trim());

      setStep(step + 1);
    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose your username</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const valid = await form.trigger("username");

          if (!valid) return;

          handleContinue();
        }}
      >
        <input
          {...form.register("username")}
          className="border p-2 w-full"
          placeholder="username"
        />

        {/* zod error */}
        {form.formState.errors.username && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.username.message}
          </p>
        )}

        {/* Loading */}
        {loading && <p className="text-gray-400 text-sm mt-1">Checking...</p>}

        {/* Taken */}
        {!loading && !form.formState.errors.username && available === false && (
          <p className="text-red-500 text-sm mt-1">Username already taken</p>
        )}

        {/* Available */}
        {!loading && !form.formState.errors.username && available === true && (
          <p className="text-green-600 text-sm mt-1">
            @{username} is available ✓
          </p>
        )}

        <button
          type="submit"
          disabled={!available || saving}
          className="mt-4 bg-black text-white px-4 py-2 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
