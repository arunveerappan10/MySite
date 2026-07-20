import { SkillGroupForm } from "../skill-group-form";

export default function NewSkillGroupPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">New skill group</h1>
      <SkillGroupForm />
    </div>
  );
}
