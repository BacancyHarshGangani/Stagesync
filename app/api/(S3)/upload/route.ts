import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3/client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType");

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const uniqueFileName = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });
    
    return NextResponse.json({
      url: signedUrl,
      key: uniqueFileName,
    });
  } catch (err) {
    console.error(err);
    console.log(err)
    return NextResponse.json(
      { error: "Failed to generate URL" },
      { status: 500 },
    );
  }
}
