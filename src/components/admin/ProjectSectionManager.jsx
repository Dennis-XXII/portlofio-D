"use client";

import { useState, useRef } from "react";
import { createProjectSection, updateProjectSection, deleteProjectSection, reorderProjectSections, uploadImage } from "@/app/actions";
import { Reorder, AnimatePresence, motion } from "framer-motion";

const ICON_IMAGE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const ICON_TEXT = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

export default function ProjectSectionManager({ projectId, sections: initialSections }) {
  const [sections, setSections] = useState(initialSections || []);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [insertAfterId, setInsertAfterId] = useState(null);
  
  const formRef = useRef(null);

  const [formState, setFormState] = useState({
    type: null, // 'image' | 'text'
    content: "",
    width: "full", // 'full' | 'half'
    file: null
  });

  // Group adjacent "half" width blocks into rows
  const groupIntoRows = (sections) => {
    const rows = [];
    let i = 0;
    while (i < sections.length) {
      const current = sections[i];
      if (current.width === "half" && i + 1 < sections.length && sections[i+1].width === "half") {
        rows.push({ 
          id: `row-${current.id}`, 
          type: "split", 
          items: [current, sections[i+1]] 
        });
        i += 2;
      } else {
        rows.push({ 
          id: `row-${current.id}`, 
          type: current.width === "half" ? "orphan" : "single", 
          items: [current] 
        });
        i += 1;
      }
    }
    return rows;
  };

  const rows = groupIntoRows(sections);

  function scrollToForm() {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formState.type) return alert("Please select a block type");
    setLoading(true);

    try {
      let content = formState.content;

      if (formState.type === "image" && formState.file) {
        const formData = new FormData();
        formData.append("file", formState.file);
        content = await uploadImage(formData);
      }

      const payload = {
        type: formState.type,
        content: content || "",
        width: formState.width,
      };

      if (editingId) {
        const updated = await updateProjectSection(editingId, payload);
        setSections(sections.map(s => s.id === editingId ? updated : s));
      } else {
        const newItem = await createProjectSection(projectId, payload);
        
        let newSections = [...sections, newItem];
        
        // If we are inserting after a specific block
        if (insertAfterId) {
          const insertIdx = newSections.findIndex(s => s.id === insertAfterId);
          if (insertIdx !== -1) {
            // Remove from end and insert after target
            newSections.pop();
            newSections.splice(insertIdx + 1, 0, newItem);
            
            // Sync orders in DB
            await reorderProjectSections(projectId, newSections.map(s => s.id));
          }
        }
        
        setSections(newSections);
      }

      resetForm();
    } catch (err) {
      console.error("Save block error:", err);
      alert(`Failed to save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormState({ type: null, content: "", width: "full", file: null });
    setEditingId(null);
    setInsertAfterId(null);
    setIsDragOver(false);
  }

  function handleEdit(section) {
    setEditingId(section.id);
    setInsertAfterId(null);
    setFormState({
      type: section.type,
      content: section.content,
      width: section.width || "full",
      file: null
    });
    scrollToForm();
  }

  function handleFillSlot(sectionId) {
    setInsertAfterId(sectionId);
    setEditingId(null);
    setFormState({
      type: null,
      content: "",
      width: "half",
      file: null
    });
    scrollToForm();
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (formState.type === "image") setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    if (formState.type !== "image") return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormState({ ...formState, file });
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this block?")) return;
    try {
      await deleteProjectSection(id);
      setSections(sections.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  }

  async function handleReorderRows(newRows) {
    const newFlatSections = newRows.flatMap(row => row.items);
    setSections(newFlatSections);
    await reorderProjectSections(projectId, newFlatSections.map(s => s.id));
  }

  async function handleSwap(row) {
    if (row.type !== "split") return;
    const [a, b] = row.items;
    const newSections = [...sections];
    const idxA = newSections.findIndex(s => s.id === a.id);
    const idxB = newSections.findIndex(s => s.id === b.id);
    
    // Swap elements
    [newSections[idxA], newSections[idxB]] = [newSections[idxB], newSections[idxA]];
    
    setSections(newSections);
    await reorderProjectSections(projectId, newSections.map(s => s.id));
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 className="h2">Project Case Study (Blog Editor)</h2>
      
      <Reorder.Group axis="y" values={rows} onReorder={handleReorderRows} className="admin-list" style={{ marginBottom: "40px" }}>
        <AnimatePresence>
          {rows.map((row) => (
            <Reorder.Item 
              key={row.id} 
              value={row} 
              className={`admin-row-item ${row.type === "split" ? "is-split" : "is-single"} ${row.type === "orphan" ? "is-orphan" : ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="row-reorder-handle">≡</div>
              
              <div className="row-content">
                {row.items.map((section, idx) => (
                  <div key={section.id} className="row-block">
                    <div className="row-block-preview">
                      {section.type === "image" ? (
                        <img src={section.content} alt="" />
                      ) : (
                        <div className="text-icon">{ICON_TEXT}</div>
                      )}
                    </div>
                    <div className="row-block-info">
                      <p>{section.type === "image" ? "Image Block" : section.content}</p>
                      <span>{section.width} {section.type}</span>
                    </div>
                    <div className="row-block-actions">
                      <button onClick={() => handleEdit(section)} className="edit-mini-btn">Edit</button>
                      <button onClick={() => handleDelete(section.id)} className="delete-mini-btn">Delete</button>
                    </div>
                    {row.type === "split" && idx === 0 && (
                      <button className="swap-btn" onClick={() => handleSwap(row)} title="Swap Positions">⇄</button>
                    )}
                  </div>
                ))}

                {row.type === "orphan" && (
                  <div className="row-block vacant-slot" onClick={() => handleFillSlot(row.items[0].id)}>
                    <div className="slot-plus">+</div>
                    <p>Add Half Block</p>
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <div className="admin-form" ref={formRef}>
        <h3 className="h3">
          {editingId ? "Edit Block" : (insertAfterId ? "Insert Half Block" : "Add New Block")}
        </h3>
        
        {!formState.type ? (
          <div className="skeleton-box" style={{ height: "200px" }}>
             <p style={{ marginBottom: "20px", fontWeight: "600", color: "#666" }}>Choose Block Type</p>
             <div className="skeleton-icon-group">
                <div className="skeleton-icon" onClick={() => setFormState({ ...formState, type: "image" })}>
                  {ICON_IMAGE}
                  <span>IMAGE</span>
                </div>
                <div className="skeleton-icon" onClick={() => setFormState({ ...formState, type: "text" })}>
                  {ICON_TEXT}
                  <span>TEXT</span>
                </div>
             </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <button className="secondary-btn" onClick={() => setFormState({ ...formState, type: null })}>← Change Type</button>
               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>WIDTH:</span>
                  <select 
                    value={formState.width} 
                    onChange={(e) => setFormState({ ...formState, width: e.target.value })}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ddd" }}
                    disabled={!!insertAfterId}
                  >
                    <option value="full">Full Width (100%)</option>
                    <option value="half">Half Width (50%)</option>
                  </select>
               </div>
            </div>

            <div 
              className={`skeleton-box ${isDragOver ? "drag-over" : ""}`} 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ background: "white", borderStyle: isDragOver ? "solid" : "dashed", minHeight: "200px", aspectRatio: "auto" }}
            >
              {formState.type === "image" ? (
                <div className="content-preview" style={{ padding: "20px", alignItems: "center", justifyContent: "center" }}>
                  {formState.file ? (
                    <img src={URL.createObjectURL(formState.file)} alt="Preview" style={{ maxHeight: "300px", objectFit: "contain" }} />
                  ) : formState.content ? (
                    <img src={formState.content} alt="Current" style={{ maxHeight: "300px", objectFit: "contain" }} />
                  ) : (
                    <div style={{ textAlign: "center", color: "#999" }}>
                      {ICON_IMAGE}
                      <p>Click below or drag image here</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setFormState({ ...formState, file: e.target.files[0] })}
                    style={{ marginTop: "20px", fontSize: "12px" }}
                  />
                </div>
              ) : (
                <textarea
                  placeholder="Start typing your story..."
                  value={formState.content}
                  onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                  style={{ width: "100%", height: "200px", border: "none", padding: "20px", fontSize: "16px", outline: "none", resize: "none" }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleSubmit} disabled={loading} className="primary-btn" style={{ flex: 1 }}>
                {loading ? "Saving..." : (editingId ? "Update Block" : (insertAfterId ? "Insert Block" : "Add to Case Study"))}
              </button>
              <button onClick={resetForm} className="secondary-btn">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
