import { Heading, Section, Text } from "@react-email/components";
import { EmailFooter } from "./components/email-footer";
import { EmailLayout } from "./components/email-layout";

interface VisitorAcknowledgmentEmailProps {
  name: string;
  message: string;
  fromName: string;
  siteUrl: string;
}

export function VisitorAcknowledgmentEmail({ name, message, fromName, siteUrl }: VisitorAcknowledgmentEmailProps) {
  return (
    <EmailLayout preview={`Thanks for reaching out, ${name}`}>
      <Heading style={{ fontSize: "20px", margin: "0 0 16px" }}>Thanks for reaching out, {name}.</Heading>
      <Text style={{ margin: "0 0 16px", fontSize: "15px", color: "#3f3f46" }}>
        This confirms I received your message and will get back to you shortly.
      </Text>
      <Section style={{ backgroundColor: "#f4f4f5", borderRadius: "6px", padding: "16px", margin: "0 0 16px" }}>
        <Text style={{ margin: 0, fontSize: "14px", color: "#52525b", whiteSpace: "pre-wrap" }}>{message}</Text>
      </Section>
      <Text style={{ margin: 0, fontSize: "15px", color: "#3f3f46" }}>— {fromName}</Text>
      <EmailFooter siteUrl={siteUrl} />
    </EmailLayout>
  );
}

export default VisitorAcknowledgmentEmail;
