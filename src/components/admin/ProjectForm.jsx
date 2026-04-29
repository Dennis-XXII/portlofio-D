"use client";

import { useState } from "react";
import { createProject, updateProject, uploadImage } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function ProjectForm({ project }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const isEditing = !!project;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    try {
      let imageUrl = project?.image || "/GUARDIAN.png";
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
        image: imageUrl,
      };

      if (isEditing) {
        await updateProject(project.id, projectData);
      } else {
        await createProject({ ...projectData, order: 0 });
      }
      
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit} className='admin-form'>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        
        <div className="form-group">
          <label>Project Title</label>
          <input type="text" name="title" defaultValue={project?.title} required />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input type="text" name="year" defaultValue={project?.year} required placeholder="e.g. 2024" />
        </div>

        <div className="form-group">
          <label>Brief (Technologies)</label>
          <input type="text" name="brief" defaultValue={project?.brief} required placeholder="e.g. React, Node.js" />
        </div>

        <div className="form-group">
          <label>Full Description</label>
          <textarea name="description" defaultValue={project?.description} required rows="6"></textarea>
        </div>

        <div className="form-group">
          <label>Website Link (Optional)</label>
          <input type="url" name="link" defaultValue={project?.link || ""} />
        </div>

        <div className="form-group">
          <label>Repo Link (Optional)</label>
          <input type="url" name="repo" defaultValue={project?.repo || ""} />
        </div>

        <div className="form-group">
          <label>Project Photo {isEditing && "(Leave empty to keep current)"}</label>
          {isEditing && project.image && (
            <img src={project.image} alt="Current" style={{ width: "100px", borderRadius: "8px", marginBottom: "10px" }} />
          )}
          <input type="file" name="image" accept="image/*" />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </button>
          <button type="button" onClick={() => router.back()} className="secondary-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
