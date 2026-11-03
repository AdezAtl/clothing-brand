import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || "tullipio-assets";
const publicUrlBase = process.env.R2_PUBLIC_URL || "https://assets.tullipio.com";

let s3Client: S3Client | null = null;

if (accountId && accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export interface PresignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generates a presigned URL for direct client-to-bucket garment image upload.
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<PresignedUploadResult> {
  const sanitizedName = filename.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  const key = `garments/${Date.now()}-${sanitizedName}`;

  if (s3Client) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `${publicUrlBase}/${key}`;

    return {
      uploadUrl,
      publicUrl,
      key,
    };
  }

  // Local development / mock fallback
  return {
    uploadUrl: `/api/upload/mock-upload?key=${encodeURIComponent(key)}`,
    publicUrl: `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000`,
    key,
  };
}

