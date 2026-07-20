import "server-only";
import { AdminNotificationEmail } from "@/emails/admin-notification";
import { VisitorAcknowledgmentEmail } from "@/emails/visitor-acknowledgment";
import { logger } from "@/lib/logger";
import { getResendClient } from "./resend";

interface SendContactEmailsInput {
  name: string;
  email: string;
  message: string;
  fromName: string;
}

type SendResult = Awaited<ReturnType<ReturnType<typeof getResendClient>["emails"]["send"]>>;

function logSendResult(label: string, result: PromiseSettledResult<SendResult>) {
  if (result.status === "rejected") {
    logger.error(`Failed to send ${label} email`, { error: String(result.reason) });
    return;
  }
  if (result.value.error) {
    logger.error(`Failed to send ${label} email`, { error: result.value.error.message });
    return;
  }
  logger.info(`Sent ${label} email`, { id: result.value.data.id });
}

/**
 * Best-effort dual send — the enquiry is already persisted by the time this runs, so an
 * email failure here shouldn't surface as a failed submission to the visitor. Resend's
 * SDK resolves with `{data, error}` rather than throwing on API-level failures, so both
 * the rejected-promise and resolved-with-error shapes need checking.
 */
export async function sendContactEmails({ name, email, message, fromName }: SendContactEmailsInput) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL!;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const [adminResult, visitorResult] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      react: <AdminNotificationEmail name={name} email={email} message={message} siteUrl={siteUrl} />,
    }),
    resend.emails.send({
      from,
      to: email,
      subject: `Thanks for reaching out, ${name}`,
      react: <VisitorAcknowledgmentEmail name={name} message={message} fromName={fromName} siteUrl={siteUrl} />,
    }),
  ]);

  logSendResult("admin notification", adminResult);
  logSendResult("visitor acknowledgment", visitorResult);
}
