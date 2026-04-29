"use client";

import { useState } from "react";
import { createProjectSection, updateProjectSection, deleteProjectSection, reorderProjectSections, uploadImage } from "@/app/actions";
import { Reorder } from "framer-motion";

export default function ProjectSectionManager({ projectId, sections: initialSections }) {
  const [sections, setSections] = useState(initialSections || []);
  const [loading, setLoading] = useState(false);

  async function handleAddSection(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    try {
      let imageUrl = "";
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageUrl = await uploadImage(imageFormData);
      }

      const newSection = await createProjectSection(projectId, {
        text: formData.get("text"),
        image: imageUrl || "/GUARDIAN.png",
      });

      setSections([...sections, newSection]);
      e.target.reset();
    } catch (err) {
      alert("Failed to add section");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this section?")) return;
    try {
      await deleteProjectSection(id);
      setSections(sections.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  }

  async function handleReorder(newOrder) {
    setSections(newOrder);
    await reorderProjectSections(projectId, newOrder.map(s => s.id));
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 className="h2">Detailed Content (Alternating)</h2>
      
      <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="admin-list" style={{ marginBottom: "30px" }}>
        {sections.map((section, index) => (
          <Reorder.Item key={section.id} value={section} className="admin-item" style={{ cursor: "grab" }}>
            <div style={{ display: "flex", gap: "20px", width: "100%", alignItems: "center" }}>
              <div style={{ color: "#ccc" }}>≡</div>
              <img src={section.image} alt="" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", color: "#666", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {section.text}
                </p>
                <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#999" }}>
                  {index % 2 === 0 ? "Left Image / Right Text" : "Right Image / Left Text"}
                </span>
              </div>
              <button onClick={() => handleDelete(section.id)} className="delete-btn">Delete</button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <form onSubmit={handleAddSection} className="admin-form" style={{ background: "#f0f0f0" }}>
        <h3 className="h3">Add New Content Block</h3>
        <div className="form-group">
          <label>Section Image (4:3 Recommended)</label>
          <input type="file" name="image" accept="image/*" required />
        </div>
        <div className="form-group">
          <label>Section Text</label>
          <textarea name="text" required rows="4" placeholder="Explain this part of the project..."></textarea>
        </div>
        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Adding..." : "Add Content Block"}
        </button>
      </form>
    </div>
  );
}
