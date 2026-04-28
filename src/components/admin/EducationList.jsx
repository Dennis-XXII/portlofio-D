"use client";

import { deleteEducation, reorderEducation } from "@/app/actions";
import { useState, useEffect, useRef } from "react";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import Link from "next/link";

function EducationItem({ edu, handleDelete, loadingId }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={edu} 
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
        <div className="admin-item-info">
          <h4>{edu.degree}</h4>
          <p>{edu.institution} | {edu.years}</p>
        </div>
      </div>
      <div className="admin-item-actions">
        <Link href={`/admin/education/${edu.id}`} className="edit-btn">Edit</Link>
        <button 
          onClick={() => handleDelete(edu.id)} 
          disabled={loadingId === edu.id}
          className="delete-btn"
        >
          {loadingId === edu.id ? "..." : "Delete"}
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function EducationList({ education: initialEducation }) {
  const [education, setEducation] = useState(initialEducation);
  const [loadingId, setLoadingId] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setEducation(initialEducation);
  }, [initialEducation]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await reorderEducation(education.map(e => e.id));
      } catch (err) {
        console.error("Failed to save new order", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [education]);

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      await deleteEducation(id);
    } catch (err) {
      alert("Failed to delete education");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Reorder.Group axis="y" values={education} onReorder={setEducation} className="admin-list">
      <AnimatePresence mode="popLayout">
        {education.map((edu) => (
          <EducationItem 
            key={edu.id} 
            edu={edu} 
            handleDelete={handleDelete} 
            loadingId={loadingId} 
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
