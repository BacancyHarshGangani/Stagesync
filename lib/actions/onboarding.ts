"use server";

import { createServer } from "@/lib/supabase/server";

export async function step0(userId: string) {
  const supabase = await createServer(); 
  const { data,error } = await supabase.from("planner_profile").select("onboarding_step").eq("user_id", userId).maybeSingle();

   if (error) {
     console.error("step0 error:", error.message);
     return null;
   }

  return data;
}

export async function saveUsername(userId: string, username: string) {
  const supabase = await createServer();
  const { error } = await supabase.from("planner_profile").upsert({
    user_id: userId,
    username,
    onboarding_step: 2,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}


export async function step2(userId: string, bio: string, headline: string, specialties: string[]) {
  const supabase = await createServer();

  const { data,error } = await supabase
    .from("planner_profile")
    .update({
      headline: headline.trim(),
      bio: bio.trim(),
      speciality: specialties,
      onboarding_step: 3
    })
    .eq("user_id", userId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function step3(userId: string, city: string, availability: string) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("planner_profile")
    .update({
      city: city.trim(),
      availability,
      onboarding_step: 4
    })
    .eq("user_id", userId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}