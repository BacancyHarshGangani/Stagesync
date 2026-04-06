"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Step4Calendar() {
  const supabase = createClient();

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("Users")
        .select("google_cal_status")
        .eq("id", user.id)
        .single();

      setConnected(data?.google_cal_status);

    };

    getStatus();
  }, []);

  const disconnectCalendar = async () => {
    await fetch("/api/google/disconnect", {
      method: "POST",
    });

    setConnected(false);
  };
  
  const connectCalendar = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: `${window.location.origin}/api/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  return (
    <div>
      {connected ? (
        <div className="border p-4 rounded">
          <p className="font-medium">Google Calendar Connected</p>
          <p className="text-sm text-gray-500">
            Your confirmed bookings will sync automatically
          </p>

          <button
            onClick={disconnectCalendar}
            className="mt-3 bg-red-500 text-white px-4 py-2"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectCalendar}
          className="bg-black text-white px-4 py-2"
        >
          Connect Google Calendar
        </button>
      )}
    </div>
  );
}
