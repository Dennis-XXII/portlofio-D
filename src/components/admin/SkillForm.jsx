"use client";

import { useState } from "react";
import { createSkill } from "@/app/actions";

export default function SkillForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const skillData = {
      name: formData.get("name"),
      type: formData.get("type"),
      order: 0,
    };

    try {
      await createSkill(skillData);
      e.target.reset();
      alert("Skill created successfully!");
    } catch (err) {
      alert("Failed to create skill");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='admin-form'>
      <div className="form-group">
        <label>Skill Name</label>
        <input type="text" name="name" required placeholder="e.g. Next.js" />
      </div>

      <div className="form-group">
        <label>Skill Type</label>
        <select name="type" required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
          <option value="technical">Technical</option>
          <option value="soft">Soft</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "Creating..." : "Create Skill"}
      </button>
    </form>
  );
}
