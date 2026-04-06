import { createServer } from "@/lib/supabase/server";

 interface VendorProfileInput {
   company_name: string;
   category: string;
   service_area: string;
   capacity_min: number;
   capacity_max: number;
   description: string;
   pricing_min: number;
   pricing_max: number;
   other_category: string;
   portfolio_urls?: string[];
 }

export const vendorService = async (formdata: VendorProfileInput) => {
  const supabase = await createServer();

  const{data: user, error: userError } = await supabase.auth.getUser();

  if(!user){
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("vendor_profiles")
    .upsert({
      id: user.user?.id,
      company_name: formdata.company_name,
      category: formdata.category,
      service_area: formdata.service_area,
      capacity_min: formdata.capacity_min,
      capacity_max: formdata.capacity_max,
      description: formdata.description,
      pricing_min: formdata.pricing_min,
      pricing_max: formdata.pricing_max,
      other_category: formdata.other_category,
      portfolio_urls: formdata.portfolio_urls,
    })
    .select()
    .single();

    const { data: profile, error: profileError } = await supabase
    .from("Users")
    .update({
        vendor_onboarding_status: true,
    })
    .eq("id", user.user?.id)
    .single();

    if (profileError) {
        console.log(profileError.message);
      throw new Error(profileError.message);
    }

  if (error) {
    console.log(error.message)
    throw new Error(error.message);
  }

  return data;
};


export const vendordetailesService = async () => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("Users")
    .select(
      `
    id,
    email,
    vendor_status,
    vendor_profiles (
      id,
      company_name,
      category,
      other_category,
      service_area,
      capacity_min,
      capacity_max,
      pricing_max,
      pricing_min,
      description,
      portfolio_urls
    )
  `,
    )
    .eq("role", "VENDOR")
    .eq("vendor_status", "PENDING");
  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return data;
};