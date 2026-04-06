import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server"

export async function POST(req : NextRequest){

    try {
        const supabase = await createServer();
        const body = await req.json();

        const { id } = body;
        const { error } = await supabase.from("Users").update({
            vendor_status : "REJECTED",
            rejection_reason : body.reason
        })
        .eq("id" , id)

        if(error) {
            throw new Error(error.message)
        }

        return NextResponse.json({
            success: true
        })
 
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({
            error : error.message
        },{
            status : 500
        })
    }
}