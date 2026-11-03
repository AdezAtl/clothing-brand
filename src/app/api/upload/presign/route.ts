import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/storage/r2";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = uploadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { filename, contentType } = parsed.data;
    const result = await getPresignedUploadUrl(filename, contentType);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Presign upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate presigned upload url" },
      { status: 500 }
    );
  }
}

