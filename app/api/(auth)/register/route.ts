import { registercontroller } from "@/controllers/auth.controller";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try{
        const user = await registercontroller(req);

        if (!user.success) {
          return new NextResponse(JSON.stringify(user), { status: 400 });
        }
        return new NextResponse(JSON.stringify(user));
    }catch(err){
        console.log(error)
    }
}