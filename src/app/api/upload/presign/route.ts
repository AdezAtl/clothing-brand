import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/storage/r2";
import { auth } from "@/auth";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z
    .string()
    .regex(/^image\/(jpeg|png|webp|avif|gif)$/, "Only image uploads are allowed"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = uploadSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: parsed.error.format() },
        { status: 400 }
      );
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