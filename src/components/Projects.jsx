"use client";

import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { m as Motion, AnimatePresence } from "framer-motion";
import "../projects.css";
import StorytellingCard from "../bits/StoryCard";
import Link from "next/link";
import { usePortfolio } from "./PortfolioContext";

export default function Projects({ initialData }) {
  const { projects, loading } = usePortfolio();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Priority: Hydrated Context > SSR Props > Loading State
  const data = projects || initialData;
  const isLoading = loading.initial && !data;

  return (
    <section
      id='projects'
      className='section'
      style={{ minHeight: "600px", position: "relative" }}
    >
      <div className='container'>
        <StorytellingCard title='Projects' align='left' theme='dark' />

        <div className='projects-grid'>
          {/* Left Column: Dynamic Preview */}
          <div className='projects-preview'>
            <AnimatePresence mode='wait'>
              {!isLoading && hoveredIndex !== null && data ? (
                <Motion.div
                  key={hoveredIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className='preview-content'
                >
                  <Link
                    href={`/projects/${data[hoveredIndex].id}`}
                    className='preview-image-wrapper'
                    style={{ display: "block", cursor: "pointer" }}
                  >
                    <img
                      src={data[hoveredIndex].image}
                      alt={data[hoveredIndex].imgAlt || ""}
                      className='preview-img'
                    />
                  </Link>
                  <div className='preview-details'>
                    <p className='preview-description'>
                      {data[hoveredIndex].description}
                    </p>
                  </div>
                </Motion.div>
              ) : (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className={`preview-placeholder ${isLoading ? "skeleton" : ""}`}
                  style={{ height: "100%", borderRadius: "24px" }}
                >
                  {!isLoading && <p>Hover over a project to see details</p>}
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Project List */}
          <div className='projects-list'>
            {isLoading
              ? // Skeletons
                [1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className='project-item skeleton'
                    style={{ height: "100px", marginBottom: "12px" }}
                  >
                    <div className='project-item-title' />
                    <div className='project-item-brief' />
                  </div>
                ))
              : data?.map((project, index) => (
                  <div
                    key={project.id || index}
                    id={project.id}
                    className={`project-item ${hoveredIndex === index ? "active" : ""}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ scrollMarginTop: "120px" }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h3 className='project-item-title'>{project.title}</h3>
                      <p className='project-item-brief'>{project.brief}</p>
                    </Link>

                    <div className='project-item-footer'>
                      <Link
                        href={`/projects/${project.id}`}
                        className='projects-link-small'
                        style={{ marginLeft: "auto" }}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {/* Anchor for the end of the section */}
      <div
        id='projects-end'
        style={{
          position: "absolute",
          bottom: 0,
          height: "1px",
          width: "100%",
        }}
      />
    </section>
  );
}
