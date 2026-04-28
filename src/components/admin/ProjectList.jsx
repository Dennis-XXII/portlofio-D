"use client";

import { deleteProject, reorderProjects } from "@/app/actions";
import { useState, useEffect, useRef } from "react";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import Link from "next/link";

function ProjectItem({ project, handleDelete, loadingId }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={project} 
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
        <img src={project.image} alt={project.title} style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "12px" }} />
        <div className="admin-item-info">
          <h4>{project.title}</h4>
          <p>{project.year} • {project.brief}</p>
        </div>
      </div>
      <div className="admin-item-actions">
        <Link href={`/admin/projects/${project.id}`} className="edit-btn">Edit</Link>
        <button 
          onClick={() => handleDelete(project.id)} 
          disabled={loadingId === project.id}
          className="delete-btn"
        >
          {loadingId === project.id ? "..." : "Delete"}
        </button>
      </div>
    </Reorder.Item>
  );
}

export default function ProjectList({ projects: initialProjects }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loadingId, setLoadingId] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await reorderProjects(projects.map(p => p.id));
      } catch (err) {
        console.error("Failed to save new order", err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [projects]);

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    setLoadingId(id);
    try {
      await deleteProject(id);
    } catch (err) {
      alert("Failed to delete project");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Reorder.Group 
      axis="y" 
      values={projects} 
      onReorder={setProjects} 
      className="admin-list"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <ProjectItem 
            key={project.id} 
            project={project} 
            handleDelete={handleDelete} 
            loadingId={loadingId} 
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
