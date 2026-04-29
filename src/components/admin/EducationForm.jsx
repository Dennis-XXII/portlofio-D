"use client";

import { useState } from "react";
import { createEducation, updateEducation } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function EducationForm({ education }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!education;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const eduData = {
      institution: formData.get("institution"),
      degree: formData.get("degree"),
      years: formData.get("years"),
      remarks: formData.get("remarks"),
    };

    try {
      if (isEditing) {
        await updateEducation(education.id, eduData);
      } else {
        await createEducation({ ...eduData, order: 0 });
      }
      router.push("/admin/education");
      router.refresh();
    } catch (err) {
      alert("Failed to save education");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit} className='admin-form'>
        <div className="form-group">
          <label>Institution</label>
          <input type="text" name="institution" defaultValue={education?.institution} required placeholder="e.g. Rangsit University" />
        </div>

        <div className="form-group">
          <label>Degree</label>
          <input type="text" name="degree" defaultValue={education?.degree} required placeholder="e.g. Bachelor of Computer Science" />
        </div>

        <div className="form-group">
          <label>Years</label>
          <input type="text" name="years" defaultValue={education?.years} required placeholder="e.g. 2023 - Present" />
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <textarea name="remarks" defaultValue={education?.remarks} required rows="4"></textarea>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Saving..." : isEditing ? "Update Education" : "Create Education"}
          </button>
          <button type="button" onClick={() => router.back()} className="secondary-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
