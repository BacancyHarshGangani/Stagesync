import { s3 } from "@/lib/s3/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req : NextRequest) => {
    const { searchParams } = new URL(req.url);
    
    const key = searchParams.get("key");
    
    if (!key) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }
    
    const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: key
    });
    
    const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 60,
    });
    
    return NextResponse.json({ url: signedUrl });
}
