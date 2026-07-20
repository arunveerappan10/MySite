import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Portfolio dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
