"use client";

import {
  VendorProfile,
  vendorProfileSchema,
} from "@/lib/Validations/vendorProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Form, useForm } from "react-hook-form";

export default function VendorOnboarding() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<VendorProfile>({
    resolver: zodResolver(vendorProfileSchema),
    mode: "onChange",
    defaultValues: {
      company_name: "",
      category: undefined,
      service_area: "",
      capacity_min: 0,
      capacity_max: 0,
      description: "",
      pricing_min: 0,
      pricing_max: 0,
      other_category: "",
      portfolio_urls: undefined,
    },
  });

  const selectedCategory = watch("category");

  const [previewImages, setPreviewImages] = useState<
    { file: File; url: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewImages((prev) => [...prev, ...newImages]);
    // Reset input so same file can be re-added if removed
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: VendorProfile) => {
    if(!process.env.NEXT_PUBLIC_AWS_BUCKET_NAME ) {
      alert("env not found");
      return
    }
    try {
      const uploadedUrls = await Promise.all(
        previewImages.map(async (img) => {
          const file = img.file;

          const res = await fetch(
            `/api/upload?fileName=${file.name}&fileType=${file.type}`,
          );

          const { url, key } = await res.json();

          try {
            const response = await fetch(url, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": file.type,
              },
            });
          } catch (error) {
            console.log(error)
          }

          const finalUrl = `${key}`;

          return finalUrl;
        }),
      );

      data.portfolio_urls = uploadedUrls;

      await fetch("/api/onboarding/vendorProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      router.push("/vendor/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-black p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 space-y-5"
      >
        <h1 className="text-2xl font-bold text-gray-800">Set Your Profile</h1>

        <div>
          <label htmlFor="company_name">Company Name</label>
          <input
            type="text"
            placeholder="Company name"
            {...register("company_name")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <select
            {...register("category")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select a category</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="AV">AV</option>
            <option value="Florals">Florals</option>
            <option value="Venue">Venue</option>
            <option value="Other">Other</option>
          </select>

          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {selectedCategory === "Other" && (
          <div>
            <label htmlFor="category">Please Specify</label>
            <input
              type="text"
              placeholder="Enter your category"
              {...register("other_category")}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}

        <div>
          <label htmlFor="description">Company Description</label>
          <textarea
            placeholder="Description about your company"
            {...register("description")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="service_area">Service Area</label>
          <input
            type="text"
            placeholder="Service area"
            {...register("service_area")}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {errors.service_area && (
          <p className="text-red-500 text-sm mt-1">
            {errors.service_area.message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <label htmlFor="capacity_min">Min Capacity</label>
          <input
            type="number"
            placeholder="Min Capacity"
            {...register("capacity_min", { valueAsNumber: true })}
            onBlur={() => trigger("capacity_min")}
            className="border rounded-lg px-3 py-2"
          />

          <label htmlFor="capacity_max">Max Capacity</label>
          <input
            type="number"
            placeholder="Max Capacity"
            {...register("capacity_max", { valueAsNumber: true })}
            onBlur={() => trigger("capacity_max")}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        {errors.capacity_max && (
          <p className="text-red-500 text-sm mt-1">
            {errors.capacity_max.message}
          </p>
        )}

        <div className="grid grid-cols-1 gap-1">
          <label htmlFor="pricing_min">Min Pricing</label>
          <input
            type="number"
            placeholder="Min Pricing"
            {...register("pricing_min", { valueAsNumber: true })}
            className="border rounded-lg px-3 py-2"
          />

          <label htmlFor="pricing_max">Max Pricing</label>
          <input
            type="number"
            placeholder="Max Pricing"
            {...register("pricing_max", { valueAsNumber: true })}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        {errors.pricing_max && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pricing_max.message}
          </p>
        )}

        <div>
          <label className={labelCls}>Portfolio Images</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <p className="text-sm text-gray-400">Click to upload images</p>
            <p className="text-xs text-gray-300 mt-0.5">
              PNG, JPG, WEBP supported
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          {previewImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden aspect-square border border-gray-100"
                >
                  <img
                    src={img.url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
