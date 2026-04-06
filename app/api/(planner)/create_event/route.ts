import { createServer } from "@/lib/supabase/server";
import { createEventSchema } from "@/lib/Validations/createeventSchema";
import { create_event } from "@/services/event.services";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
        const supabase = await createServer();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Unauthorized");

        const body = await req.json();

        const parseddata = createEventSchema.safeParse(body);
        
        if (!parseddata.success) {
            return NextResponse.json({ error: parseddata.error.issues[0].message });
        }

        const res = await create_event(parseddata.data, user.id);

        return NextResponse.json(res);

    } catch (error : any) {
        console.log(error);
        return NextResponse.json({ error: error.message });
    }
}   