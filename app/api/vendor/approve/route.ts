import { createServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServer();

        const body = await req.json();

        const { id } = body;

        const { data, error } = await supabase
          .from("Users")
          .update({
            vendor_status: "ACTIVE",
          })
          .eq("id", id)
          .eq("vendor_status", "PENDING")
          .select();

        if (error) {
            console.log(error);
            throw new Error(error.message);
        }
        return NextResponse.json({ success: true });
    } catch (error : any) {

        return NextResponse.json({ error: error.message },
            {
                status: 500
            }
        )
    }
}