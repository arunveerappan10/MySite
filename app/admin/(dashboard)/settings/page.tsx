import { getSettings } from "@/lib/queries/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsAdminPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Site-wide metadata and footer copy.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
