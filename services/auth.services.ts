import { createServer } from "@/lib/supabase/server";

export const registerservice = async (
  userData : {
    email : string,
    password : string,
    role : string
  }
) => {
  const {email, password, role} = userData
  const supabase = await createServer();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error.message;
  }

  const user = data.user;

  if (!user) {
    throw new Error("user creation failed");
  }

  const { error: insertError } = await supabase.from("Users").insert({
    id: user.id,
    email,
    role,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }
  return user;
};

export async function loginservice(userdata:{email: string, password: string}) {
  const supabase = await createServer();

  const { email, password } = userdata;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const logoutService = async () => {
  const supabase = await createServer();

  await supabase.auth.signOut();
};
