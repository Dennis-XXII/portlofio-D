"use client";

import { useState } from "react";
import { createSkill, updateSkill } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function SkillForm({ skill }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEditing = !!skill;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const skillData = {
      name: formData.get("name"),
      type: formData.get("type"),
    };

    try {
      if (isEditing) {
        await updateSkill(skill.id, skillData);
      } else {
        await createSkill({ ...skillData, order: 0 });
      }
      router.push("/admin/skills");
      router.refresh();
    } catch (err) {
      alert("Failed to save skill");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit} className='admin-form'>
        <div className="form-group">
          <label>Skill Name</label>
          <input type="text" name="name" defaultValue={skill?.name} required placeholder="e.g. Next.js" />
        </div>

        <div className="form-group">
          <label>Skill Type</label>
          <select name="type" defaultValue={skill?.type || "technical"} required>
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Saving..." : isEditing ? "Update Skill" : "Create Skill"}
          </button>
          <button type="button" onClick={() => router.back()} className="secondary-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
