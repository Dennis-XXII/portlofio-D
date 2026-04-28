"use client";

import { deleteEducation } from "@/app/actions";
import { useState } from "react";

export default function EducationList({ education }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      await deleteEducation(id);
    } catch (err) {
      alert("Failed to delete education");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="admin-list">
      {education.map((edu) => (
        <div key={edu.id} className="admin-item">
          <div className="admin-item-info">
            <h4>{edu.degree}</h4>
            <p>{edu.institution} | {edu.years}</p>
          </div>
          <button 
            onClick={() => handleDelete(edu.id)} 
            disabled={loadingId === edu.id}
            className="delete-btn"
          >
            {loadingId === edu.id ? "..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
