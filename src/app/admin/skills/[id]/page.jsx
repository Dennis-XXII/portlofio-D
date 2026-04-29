import SkillForm from "@/components/admin/SkillForm";
import { getSkill } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditSkillPage({ params }) {
  const { id } = await params;
  const skill = await getSkill(id);

  if (!skill) {
    notFound();
  }

  return (
    <div>
      <h1 className="h1">Edit Skill</h1>
      <SkillForm skill={skill} />
    </div>
  );
}
