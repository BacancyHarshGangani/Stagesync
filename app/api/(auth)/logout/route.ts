import { logoutcontroller } from "@/controllers/auth.controller";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await logoutcontroller();
    return NextResponse.json({ success: true }); 
}