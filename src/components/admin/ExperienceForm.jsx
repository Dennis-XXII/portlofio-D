"use client";

import { useState } from "react";
import { createExperience, uploadImage } from "@/app/actions";

export default function ExperienceForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    try {
      let imageUrl = "";
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageUrl = await uploadImage(imageFormData);
      }

      const experienceData = {
        role: formData.get("role"),
        title: formData.get("title"),
        years: formData.get("years"),
        description: formData.get("description"),
        link: formData.get("link"),
        image: imageUrl || "/rsuGlobal.webp",
        order: 0,
      };

      await createExperience(experienceData);
      e.target.reset();
      alert("Experience created successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create experience");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='admin-form'>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      
      <div className="form-group">
        <label>Role</label>
        <input type="text" name="role" required placeholder="e.g. Lead Developer" />
      </div>

      <div className="form-group">
        <label>Company/Institution</label>
        <input type="text" name="title" required placeholder="e.g. RSU Global" />
      </div>

      <div className="form-group">
        <label>Years</label>
        <input type="text" name="years" required placeholder="e.g. 2024 - Active" />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea name="description" required rows="4"></textarea>
      </div>

      <div className="form-group">
        <label>Link (Optional)</label>
        <input type="url" name="link" />
      </div>

      <div className="form-group">
        <label>Company Logo</label>
        <input type="file" name="image" accept="image/*" />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating..." : "Create Experience"}
      </button>
    </form>
  );
}
