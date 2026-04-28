"use client";

import { useState } from "react";
import { createEducation } from "@/app/actions";

export default function EducationForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const eduData = {
      institution: formData.get("institution"),
      degree: formData.get("degree"),
      years: formData.get("years"),
      remarks: formData.get("remarks"),
      order: 0,
    };

    try {
      await createEducation(eduData);
      e.target.reset();
      alert("Education created successfully!");
    } catch (err) {
      alert("Failed to create education");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='admin-form'>
      <div className="form-group">
        <label>Institution</label>
        <input type="text" name="institution" required placeholder="e.g. Rangsit University" />
      </div>

      <div className="form-group">
        <label>Degree</label>
        <input type="text" name="degree" required placeholder="e.g. Bachelor of Computer Science" />
      </div>

      <div className="form-group">
        <label>Years</label>
        <input type="text" name="years" required placeholder="e.g. 2023 - Present" />
      </div>

      <div className="form-group">
        <label>Remarks</label>
        <textarea name="remarks" required rows="3"></textarea>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating..." : "Create Education"}
      </button>
    </form>
  );
}
