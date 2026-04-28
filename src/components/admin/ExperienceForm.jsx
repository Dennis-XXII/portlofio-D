"use client";

import { useState } from "react";
import { createExperience, updateExperience, uploadImage } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ExperienceForm({ experience }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isEditing = !!experience;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    try {
      let imageUrl = experience?.image || "/rsuGlobal.webp";
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageUrl = await uploadImage(imageFormData);
      }

      const expData = {
        role: formData.get("role"),
        title: formData.get("title"),
        years: formData.get("years"),
        description: formData.get("description"),
        link: formData.get("link"),
        image: imageUrl,
      };

      if (isEditing) {
        await updateExperience(experience.id, expData);
      } else {
        await createExperience(expData);
      }
      
      router.push("/admin/experience");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save experience");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit} className='admin-form'>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        
        <div className="form-group">
          <label>Job Role</label>
          <input type="text" name="role" defaultValue={experience?.role} required placeholder="e.g. Lead Developer" />
        </div>

        <div className="form-group">
          <label>Company / Organization</label>
          <input type="text" name="title" defaultValue={experience?.title} required placeholder="e.g. RSU Global" />
        </div>

        <div className="form-group">
          <label>Years</label>
          <input type="text" name="years" defaultValue={experience?.years} required placeholder="e.g. 2024 - Active" />
        </div>

        <div className="form-group">
          <label>Full Description</label>
          <textarea name="description" defaultValue={experience?.description} required rows="6"></textarea>
        </div>

        <div className="form-group">
          <label>Link (Optional)</label>
          <input type="url" name="link" defaultValue={experience?.link || ""} />
        </div>

        <div className="form-group">
          <label>Company Logo</label>
          {isEditing && experience.image && (
            <img src={experience.image} alt="Current" style={{ width: "60px", height: "60px", borderRadius: "8px", marginBottom: "10px", objectFit: "cover" }} />
          )}
          <input type="file" name="image" accept="image/*" />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Saving..." : isEditing ? "Update Experience" : "Create Experience"}
          </button>
          <button type="button" onClick={() => router.back()} className="secondary-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
