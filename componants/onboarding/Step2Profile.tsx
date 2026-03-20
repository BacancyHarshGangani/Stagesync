import { useState } from "react";
import { useOnboarding } from "@/context/onboarding.context";
import { useAuth } from "@/hooks/userAuth";
import { step2 } from "@/lib/actions/onboarding";

const EVENT_TYPES = [
  "Wedding",
  "Corporate",
  "Birthday",
  "Festival",
  "Private Party",
];

export default function Step2Profile() {

  const { form, step, setStep } = useOnboarding();
  const { user } = useAuth();

  const headline = form.watch("headline") || "";
  const bio = form.watch("bio") || "";
  const tags = form.watch("specialties") || [];
  const [saving, setSaving] = useState(false);

  function toggle(tag: string) {
    const current = tags;

    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];

    form.setValue("specialties", updated, {
      shouldValidate: true,
    });
  }

  const handleContinue = async () => {
    const valid = await form.trigger(["headline", "bio", "specialties"]);
    if (!valid) return;

    setSaving(true);
    if (!user) {
      setSaving(false);
      return;
    }

    const currentSpecialties = form.getValues("specialties") || [];

    try{
      await step2(user.id, bio.trim(), headline.trim(), currentSpecialties);

      setStep(step + 1);
    }catch(err){
      console.error(err);
    }

    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your profile</h2>

      <input
        maxLength={80}
        {...form.register("headline")}
        placeholder="Headline"
        className="border p-2 w-full"
      />
      <p className="text-xs text-gray-400 text-right">{headline.length}/80</p>
      {form.formState.errors.headline && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.headline.message}
        </p>
      )}

      <textarea
        maxLength={300}
        {...form.register("bio")}
        placeholder="Bio"
        className="border rou p-2 w-full mt-3"
      />
      <p className="text-xs text-gray-400 text-right">{bio.length}/300</p>
      {form.formState.errors.bio && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.bio.message}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {EVENT_TYPES.map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-3 py-1 rounded-full border ${
              tags.includes(tag)
                ? "bg-black text-white"
                : "bg-amber-50 text-black"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {form.formState.errors.specialties && (
        <p className="text-red-500 text-sm mt-2">
          {form.formState.errors.specialties.message}
        </p>
      )}

      <div>
        <button
          onClick={handleContinue}
          disabled={saving}
          className="mt-6 bg-black text-white px-4 py-2 disabled:opacity-40"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
