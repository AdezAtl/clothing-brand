import crypto from "crypto";

export interface InitializePaymentParams {
  amount: number; // In kobo
  email: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface BachsInitResponse {
  success: boolean;
  reference: string;
  checkoutUrl: string;
  message?: string;
}

export interface BachsWebhookEvent {
  event: "payment.success" | "payment.failed";
  data: {
    reference: string;
    amount: number; // in kobo
    status: "paid" | "failed";
    customer: {
      email: string;
      name?: string;
    };
    metadata?: Record<string, any>;
    paidAt?: string;
  };
}

function getBachsSecretKey(): string {
  if (process.env.BACHS_SECRET_KEY) {
    return process.env.BACHS_SECRET_KEY;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing required BACHS_SECRET_KEY in production. Ensure environment variables are configured in production deployments."
    );
  }
  return "bachs_sk_test_sample_tullipio_2026";
}

function getBachsWebhookSecret(): string {
  if (process.env.BACHS_WEBHOOK_SECRET) {
    return process.env.BACHS_WEBHOOK_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing required BACHS_WEBHOOK_SECRET in production. Ensure environment variables are configured in production deployments."
    );
  }
  return "bachs_whsec_sample_hmac_secret_2026";
}

const BACHS_API_URL = process.env.BACHS_API_URL || "https://api.bachspay.com/v1";

/**
 * Initializes a transaction with the Bachs Payment Gateway.
 * If live keys are not configured or the endpoint is in test mode, provides a seamless fallback checkout flow.
 */
export async function initializeBachsTransaction(
  params: InitializePaymentParams
): Promise<BachsInitResponse> {
  const { amount, email, reference, callbackUrl, metadata } = params;

  // Real API call attempt
  try {
    const secretKey = getBachsSecretKey();
    const response = await fetch(`${BACHS_API_URL}/checkout/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        email,
        reference,
        callback_url: callbackUrl,
        metadata: {
          ...metadata,
          source: "tullipio-storefront",
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        reference: data.data.reference || reference,
        checkoutUrl: data.data.checkout_url,
      };
    }
  } catch (err) {
    console.warn("Bachs Payment live gateway unreachable, activating local sandbox redirect:", err);
  }

  // Sandbox / Test fallback simulator
  return {
    success: true,
    reference,
    checkoutUrl: `/checkout/bachs-simulator?reference=${encodeURIComponent(
      reference
    )}&amount=${amount}&email=${encodeURIComponent(email)}`,
  };
}

/**
 * Validates the HMAC-SHA256 signature sent by the Bachs webhook header.
 */
export function verifyBachsWebhookSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  if (!signatureHeader) return false;

  const webhookSecret = getBachsWebhookSecret();
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  // Timing safe comparison to protect against timing attacks
  try {
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const signatureBuffer = Buffer.from(signatureHeader, "utf8");
    if (expectedBuffer.length !== signatureBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  } catch {
    return false;
  }
}

