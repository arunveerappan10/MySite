import { ArrowUpRight } from "lucide-react";

interface CredentialLinkProps {
  href: string;
  /** Visible text — "Verify" for an issuer's verification page, "View" for uploaded proof. */
  label: string;
  ariaLabel: string;
}

/** The small underline-on-hover external link shared by certification and award cards.
 * Each instance owns its own `group/link`, so siblings animate independently. */
export function CredentialLink({ href, label, ariaLabel }: CredentialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group/link inline-flex items-center gap-1 text-[10px] font-mono-tight uppercase tracking-[0.16em] text-muted-foreground hover:text-primary transition-colors duration-300 shrink-0"
    >
      <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 group-hover/link:after:scale-x-100">
        {label}
      </span>
      <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
    </a>
  );
}
