import { getEducation } from "../../actions";
import EducationList from "@/components/admin/EducationList";
import Link from "next/link";

export default async function AdminEducation() {
  const education = await getEducation();

  return (
    <div>
      <div className="admin-header">
        <h1 className='h1'>Manage Education</h1>
        <Link href="/admin/education/new" className="primary-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Education
        </Link>
      </div>
      
      <div className="summary-card">
        <h2 className="h2" style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", color: "#666" }}>Existing Education</h2>
        <p style={{ marginBottom: "20px", fontSize: "14px", color: "#888" }}>Drag items to reorder them on your portfolio.</p>
        <EducationList education={education} />
      </div>
    </div>
  );
}
