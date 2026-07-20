import { Hr, Text } from "@react-email/components";

export function EmailFooter({ siteUrl }: { siteUrl: string }) {
  return (
    <>
      <Hr style={{ borderColor: "#e4e4e7", margin: "24px 0" }} />
      <Text style={{ color: "#71717a", fontSize: "12px", margin: 0 }}>
        Sent from the contact form at{" "}
        <a href={siteUrl} style={{ color: "#71717a" }}>
          {siteUrl.replace(/^https?:\/\//, "")}
        </a>
        .
      </Text>
    </>
  );
}
