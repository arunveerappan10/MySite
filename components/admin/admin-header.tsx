import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/admin/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV_ITEMS } from "./admin-nav-items";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <nav className="flex items-center gap-4 overflow-x-auto no-scrollbar text-sm md:hidden">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="hidden md:inline text-sm text-muted-foreground truncate">{email}</span>
        <form action={signOut} className="shrink-0">
          <Button type="submit" variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
