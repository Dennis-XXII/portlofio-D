import EducationForm from "@/components/admin/EducationForm";
import { getEducationItem } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditEducationPage({ params }) {
  const { id } = await params;
  const education = await getEducationItem(id);

  if (!education) {
    notFound();
  }

  return (
    <div>
      <h1 className="h1">Edit Education</h1>
      <EducationForm education={education} />
    </div>
  );
}
