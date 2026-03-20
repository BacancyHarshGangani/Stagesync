"use client";

import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string;
  role: "VENDOR" | "PLANNER" | "CLIENT";
};

type UserContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  //   refreshUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    setUser(currentUser);
    
    if (currentUser) {
      const { data: Profiledata } = await supabase
        .from("Users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setProfile(Profiledata);
    } else {
      setProfile(null);
    }

    setLoading(false);
  };


  useEffect(()=>{
    getUser();

    const { data : listener } = supabase.auth.onAuthStateChange(() => {
        getUser();
    })

    return (()=>{
        listener?.subscription.unsubscribe();
    })
  },[])


  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};
