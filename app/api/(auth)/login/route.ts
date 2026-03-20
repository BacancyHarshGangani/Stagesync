import { logincontroller } from "@/controllers/auth.controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const result = await logincontroller(req);

    return NextResponse.json(result); 
  } catch (error: any) {
    console.log("LOGIN ERROR:", error); 

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}