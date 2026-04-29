import ExperienceForm from "@/components/admin/ExperienceForm";
import { getExperience } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditExperiencePage({ params }) {
  const { id } = await params;
  const experience = await getExperience(id);

  if (!experience) {
    notFound();
  }

  return (
    <div>
      <h1 className="h1">Edit Experience</h1>
      <ExperienceForm experience={experience} />
    </div>
  );
}
