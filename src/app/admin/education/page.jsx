import { getEducation } from "../../actions";
import EducationForm from "@/components/admin/EducationForm";
import EducationList from "@/components/admin/EducationList";

export default async function AdminEducation() {
  const education = await getEducation();

  return (
    <div>
      <h1 className='h1' style={{ marginBottom: "32px" }}>Manage Education</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Add New Education</h2>
          <EducationForm />
        </section>

        <section>
          <h2 className='h3' style={{ marginBottom: "20px" }}>Existing Education</h2>
          <EducationList education={education} />
        </section>
      </div>
    </div>
  );
}
