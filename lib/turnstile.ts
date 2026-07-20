import "server-only";
import { logger } from "@/lib/logger";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string, ip: string | null): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      logger.warn("Turnstile verification failed", { errorCodes: data["error-codes"] });
    }
    return data.success;
  } catch (error) {
    logger.error("Turnstile verification request failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
