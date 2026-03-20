"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Loginschema, loginschema } from "@/lib/Validations/loginschema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // trigger,
    // getValues,
  } = useForm({
    resolver: zodResolver(loginschema),
  });

  const handleLogin = async (data: Loginschema) => {
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    setLoading(false);

    if (!result.success) {
      console.log(result.error);
      return;
    }

    router.push("/onboarding");
  };

  const handleGoogleLogin = async () => {
    // console.log("object")
    if (loading) return;

    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div>
        <h1 className="text-3xl font-semibold">Login to Stagesync</h1>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
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

          <button
            type="submit"
            // onClick={handleSubmit(handleLogin)}
            className=" text-white mt-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500"
          >
            Sign In
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
            Don&apos;t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 cursor-pointer
            "
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
