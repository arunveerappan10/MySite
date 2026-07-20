import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

/** Lazily constructed so a missing RESEND_API_KEY only breaks email sending, not the module graph. */
export function getResendClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}
