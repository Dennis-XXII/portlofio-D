"use client";

import { deleteExperience } from "@/app/actions";
import { useState } from "react";

export default function ExperienceList({ experiences }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    
    setLoadingId(id);
    try {
      await deleteExperience(id);
    } catch (err) {
      alert("Failed to delete experience");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="project-list">
      {experiences.map((exp) => (
        <div key={exp.id} className="admin-project-item">
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <img src={exp.image} alt={exp.title} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
            <div>
              <h4 style={{ margin: 0 }}>{exp.role}</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{exp.title} | {exp.years}</p>
            </div>
          </div>
          <button 
            onClick={() => handleDelete(exp.id)} 
            disabled={loadingId === exp.id}
            className="delete-btn"
          >
            {loadingId === exp.id ? "..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
