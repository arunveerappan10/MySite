import { getProfile } from "@/lib/queries/profile";
import { ProfileForm } from "./profile-form";

export default async function ProfileAdminPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hero, About, and Contact copy — the singleton content shown across the public site.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
