import { z } from "zod";

const VendorCategoryEnum = z
  .enum(["Catering", "Photography", "AV", "Florals", "Venue", "Other"], {
    error: () => ({ message: "Please select a valid category Or Enter Other" }),
  })
  .optional();

const PricingUnitEnum = z.enum(["per head", "per event", "per day"]).optional();

export const vendorProfileSchema = z
  .object({
    company_name: z.string().min(1, "Company Name is required"),
    category: VendorCategoryEnum,
    other_category: z.string().optional(),
    service_area: z.string().min(1, "Service Area is required"),

    capacity_min: z.number("capacity should be a number").nonnegative(),
    capacity_max: z.number("Capacity should be a number").nonnegative(),

    description: z.string().optional(),
    // founded_year: z.number().int().optional(),
    // team_size: z.number().int().optional(),
    // certifications: z.array(z.string()).optional(),

    pricing_min: z.number("Pricing should be in number").nonnegative().min(1,"Pricing should be greater than 0"),
    pricing_max: z.number("Pricing should be in number").nonnegative().min(1,"Pricing should be greater than 0"),
    base_pricing_indicator: PricingUnitEnum,

    // requires_reapproval: z.boolean(),
    // packages: z.array(z.any()),
    // average_rating: z.number().min(0).max(5),
    portfolio_urls: z.array(z.string().url()).optional(),

    // logo_url: z.string().url().optional(),
    // cover_image_url: z.string().url().optional(),
  })

  .superRefine((data, ctx) => {
    if (data.capacity_max < data.capacity_min) {
      ctx.addIssue({
        code: "custom",
        message: "Max capacity must be greater than min",
        path: ["capacity_max"],
      });
    }

    if (data.pricing_max < data.pricing_min) {
      ctx.addIssue({
        code: "custom",
        message: "Max pricing must be greater than min",
        path: ["pricing_max"],
      });
    }
  })



export type VendorProfile = z.infer<typeof vendorProfileSchema>;
