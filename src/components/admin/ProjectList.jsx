"use client";

import { deleteProject } from "@/app/actions";
import { useState } from "react";

export default function ProjectList({ projects }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setLoadingId(id);
    try {
      await deleteProject(id);
    } catch (err) {
      alert("Failed to delete project");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="project-list">
      {projects.map((project) => (
        <div key={project.id} className="admin-project-item">
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <img src={project.image} alt={project.title} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
            <div>
              <h4 style={{ margin: 0 }}>{project.title}</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{project.year}</p>
            </div>
          </div>
          <button 
            onClick={() => handleDelete(project.id)} 
            disabled={loadingId === project.id}
            className="delete-btn"
          >
            {loadingId === project.id ? "..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
