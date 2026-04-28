"use client";

import { deleteSkill } from "@/app/actions";
import { useState } from "react";

export default function SkillList({ skills }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      await deleteSkill(id);
    } catch (err) {
      alert("Failed to delete skill");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="project-list">
      {skills.map((skill) => (
        <div key={skill.id} className="admin-project-item">
          <span>{skill.name}</span>
          <button 
            onClick={() => handleDelete(skill.id)} 
            disabled={loadingId === skill.id}
            className="delete-btn"
          >
            {loadingId === skill.id ? "..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
