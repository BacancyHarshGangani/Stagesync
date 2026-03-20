import {
  loginservice,
  logoutService,
  registerservice,
} from "@/services/auth.services";
import { NextRequest } from "next/server";
import { loginschema } from "@/lib/Validations/loginschema";
import { userschema } from "@/lib/Validations/userschema";

export const registercontroller = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parseddata = userschema.safeParse(body);

    if (!parseddata.success) {
      return {
        success: false,
        error: parseddata.error.issues[0].message,
      };
    }
    const user = await registerservice(body);
    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logincontroller = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const parseddata = loginschema.safeParse(body);

    if (!parseddata.success) {
      return {
        success: false,
        error: parseddata.error.issues[0].message,
      };
    }
    const user = await loginservice(body);
    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logoutcontroller = async () => {
  try {
    await logoutService();
  } catch (err: any) {
    console.log(err);
  }
};
