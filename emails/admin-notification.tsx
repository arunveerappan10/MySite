import { Heading, Section, Text } from "@react-email/components";
import { EmailFooter } from "./components/email-footer";
import { EmailLayout } from "./components/email-layout";

interface AdminNotificationEmailProps {
  name: string;
  email: string;
  message: string;
  siteUrl: string;
}

export function AdminNotificationEmail({ name, email, message, siteUrl }: AdminNotificationEmailProps) {
  return (
    <EmailLayout preview={`New enquiry from ${name}`}>
      <Heading style={{ fontSize: "20px", margin: "0 0 16px" }}>New contact form enquiry</Heading>
      <Section>
        <Text style={{ margin: "0 0 4px", color: "#71717a", fontSize: "12px", textTransform: "uppercase" }}>
          From
        </Text>
        <Text style={{ margin: "0 0 16px", fontSize: "15px" }}>
          {name} &lt;{email}&gt;
        </Text>
        <Text style={{ margin: "0 0 4px", color: "#71717a", fontSize: "12px", textTransform: "uppercase" }}>
          Message
        </Text>
        <Text style={{ margin: 0, fontSize: "15px", whiteSpace: "pre-wrap" }}>{message}</Text>
      </Section>
      <EmailFooter siteUrl={siteUrl} />
    </EmailLayout>
  );
}

export default AdminNotificationEmail;
