"use client";

import { useState } from "react";
import { createProject, uploadImage } from "@/app/actions";

export default function ProjectForm() {
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

      const projectData = {
        title: formData.get("title"),
        year: formData.get("year"),
        brief: formData.get("brief"),
        description: formData.get("description"),
        link: formData.get("link"),
        repo: formData.get("repo"),
        image: imageUrl || "/GUARDIAN.png", // fallback
        order: 0,
      };

      await createProject(projectData);
      e.target.reset();
      alert("Project created successfully!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='admin-form'>
      {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
      
      <div className="form-group">
        <label>Project Title</label>
        <input type="text" name="title" required />
      </div>

      <div className="form-group">
        <label>Year</label>
        <input type="text" name="year" required placeholder="e.g. 2024" />
      </div>

      <div className="form-group">
        <label>Brief (Technologies)</label>
        <input type="text" name="brief" required placeholder="e.g. React, Node.js" />
      </div>

      <div className="form-group">
        <label>Full Description</label>
        <textarea name="description" required rows="4"></textarea>
      </div>

      <div className="form-group">
        <label>Website Link (Optional)</label>
        <input type="url" name="link" />
      </div>

      <div className="form-group">
        <label>Repo Link (Optional)</label>
        <input type="url" name="repo" />
      </div>

      <div className="form-group">
        <label>Project Photo</label>
        <input type="file" name="image" accept="image/*" />
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
