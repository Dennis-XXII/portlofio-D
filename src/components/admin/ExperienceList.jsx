"use client";

import { deleteExperience, reorderExperiences } from "@/app/actions";
import { useState, useEffect, useRef } from "react";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import Link from "next/link";

function ExperienceItem({ exp, handleDelete, loadingId }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={exp} 
      className="admin-item"
      dragListener={false}
      dragControls={controls}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileDrag={{ 
        scale: 1.03, 
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        zIndex: 100,
      }}
      transition={{ 
        layout: { type: "spring", stiffness: 600, damping: 40 },
        scale: { duration: 0.2 }
      }}
    >
      <div className="admin-item-content">
        <div 
          className="reorder-handle" 
          onPointerDown={(e) => controls.start(e)}
          style={{ cursor: "grab", touchAction: "none" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <img src={exp.image} alt={exp.title} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "12px" }} />
        <div className="admin-item-info">
          <h4>{exp.role}</h4>
          <p>{exp.title} • {exp.years}</p>
        </div>
      </div>
      <div className="admin-item-actions">
        <Link href={`/admin/experience/${exp.id}`} className="edit-btn">Edit</Link>
        <button 
          onClick={() => handleDelete(exp.id)} 
          disabled={loadingId === exp.id}
          className="delete-btn"
        >
          {loadingId === exp.id ? "..." : "Delete"}
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function ExperienceList({ experiences: initialExperiences }) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [loadingId, setLoadingId] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setExperiences(initialExperiences);
  }, [initialExperiences]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await reorderExperiences(experiences.map(e => e.id));
      } catch (err) {
        console.error("Failed to save new order", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [experiences]);

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      await deleteExperience(id);
    } catch (err) {
      alert("Failed to delete experience");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Reorder.Group axis="y" values={experiences} onReorder={setExperiences} className="admin-list">
      <AnimatePresence mode="popLayout">
        {experiences.map((exp) => (
          <ExperienceItem 
            key={exp.id} 
            exp={exp} 
            handleDelete={handleDelete} 
            loadingId={loadingId} 
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
