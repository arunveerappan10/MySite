"use server";

import { headers } from "next/headers";
import { sendContactEmails } from "@/lib/email/send-contact-emails";
import { hashIp } from "@/lib/hash-ip";
import { logger } from "@/lib/logger";
import { getProfile } from "@/lib/queries/profile";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

function getClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headersList.get("x-real-ip") ?? "unknown";
}

export async function submitEnquiry(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const headersList = await headers();
  const ip = getClientIp(headersList);
  const userAgent = headersList.get("user-agent");
  const ipHash = hashIp(ip);

  const { allowed } = await checkRateLimit(ipHash);
  if (!allowed) {
    return { error: "Too many messages sent recently. Please try again later." };
  }

  const verified = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!verified) {
    return { error: "Verification failed. Please try again." };
  }

  const { name, email, message } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").insert({
    name,
    email,
    message,
    ip_hash: ipHash,
    user_agent: userAgent,
    turnstile_verified: true,
  });

  if (error) {
    logger.error("Failed to insert enquiry", { error: error.message });
    return { error: "Something went wrong. Please try again." };
  }

  try {
    const profile = await getProfile();
    await sendContactEmails({ name, email, message, fromName: profile.full_name });
  } catch (emailError) {
    logger.error("Contact email pipeline threw", {
      error: emailError instanceof Error ? emailError.message : String(emailError),
    });
  }

  return { success: true as const };
}
