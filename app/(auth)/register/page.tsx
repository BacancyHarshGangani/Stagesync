"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Userschema, userschema } from "@/lib/Validations/userschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(userschema),
  });

  const handleRegister = async (data: Userschema) => {
    // e.preventDefault();
    setLoading(true);

    await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setLoading(false);

    router.push("/login");
  };

  const handleGoogleLogin = async () => {
    const isValid = await trigger("role"); // validate only role

    if (!isValid) return;

    const role = getValues("role");
    // console.log(role)

    if (loading) return;

    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div>
        <h1 className="text-3xl font-semibold">Create an account</h1>

        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col">
          <div className="mt-4">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              {...register("password")}
              className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />

            {errors.password && (
              <p className="text-red-500 ">{errors.password.message}</p>
            )}
          </div>

          <select
            {...register("role")}
            className="mt-4 w-full py-2 px-4 border-2 border-gray-600 rounded-2xl 
             bg-black text-gray-300
             transition-all duration-200"
          >
            <option value="" className="text-gray-300">
              Select your roles
            </option>
            <option value="PLANNER" className="text-gray-300">
              I am a Planner
            </option>
            <option value="VENDOR" className="text-gray-300">
              I am a Vendor / Supplier
            </option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}

          <button
            type="submit"
            className=" text-white mt-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500"
          >
            Sign Up
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className=" text-white  mt-4 py-2 w-full rounded-2xl bg-gray-600 hover:bg-gray-500"
        >
          Contine with Google
        </button>

        <div>
          <p className="text-sm mt-4">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 cursor-pointer
            "
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
