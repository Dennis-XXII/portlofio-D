"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { LazyMotion, domMax } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/PortfolioContext";
import "@/project-detail.css";

export default function ProjectClient({ project }) {
  const { hydrate, projectDetails } = usePortfolio();

  useEffect(() => {
    if (project) {
      hydrate({ projectDetails: { [project.id]: project } });
    }
  }, [project, hydrate]);

  const displayProject =
    project || (project?.id ? projectDetails[project.id] : null);

  if (!displayProject) {
    return (
      <div style={{ textAlign: "center", paddingTop: "200px" }}>
        <h1 className='h1'>Project Not Found</h1>
        <Link href='/#projects' className='btn' style={{ marginTop: "24px" }}>
          Back to Projects
        </Link>
      </div>
    );
  }

  const sections = displayProject.sections || [];

  // Group adjacent "half" width blocks into pairs
  const renderRows = () => {
    const rows = [];
    let i = 0;
    while (i < sections.length) {
      const current = sections[i];
      if (current.width === "half" && i + 1 < sections.length && sections[i+1].width === "half") {
        rows.push({ type: "split", blocks: [current, sections[i+1]] });
        i += 2;
      } else {
        rows.push({ type: "single", block: current });
        i += 1;
      }
    }
    return rows;
  };

  const rows = renderRows();

  return (
    <LazyMotion features={domMax}>
      <main className='project-detail-main'>
        <div className='container'>
          {/* Header */}
          <AnimatedSection>
            <div className='project-detail-header'>
              <Link href={`/#${displayProject.id}`} className='back-link'>
                ← Back to Projects
              </Link>
              <h1 className='h1 project-title'>{displayProject.title}</h1>
              <div className='project-meta'>
                {displayProject.year} • {displayProject.brief}
              </div>
              <p className='project-description'>{displayProject.description}</p>

              <div className='project-actions'>
                {displayProject.link && (
                  <a href={displayProject.link} target='_blank' rel='noopener noreferrer' className='btn'>
                    Visit Website
                  </a>
                )}
                {displayProject.repo && (
                  <a href={displayProject.repo} target='_blank' rel='noopener noreferrer' className='btn btn--ghost'>
                    View Source
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>

          <div className='project-sections'>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <AnimatedSection key={index}>
                  <div className={`project-row ${row.type === "split" ? "is-split" : "is-single"}`}>
                    {row.type === "split" ? (
                      row.blocks.map((block) => (
                        <div key={block.id} className={`project-block type-${block.type}`}>
                          {block.type === "image" ? (
                            <div className='project-section-image-wrapper'>
                              <img src={block.content} alt='' className='project-section-image' />
                            </div>
                          ) : (
                            <p className='project-section-text'>{block.content}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={`project-block type-${row.block.type} is-full`}>
                        {row.block.type === "image" ? (
                          <div className='project-section-image-wrapper' style={{ aspectRatio: "21/9" }}>
                            <img src={row.block.content} alt='' className='project-section-image' />
                          </div>
                        ) : (
                          <p className='project-section-text' style={{ maxWidth: "800px", margin: "0 auto" }}>
                            {row.block.content}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              ))
            ) : (
              <AnimatedSection delay={0.2}>
                <div className='project-coming-soon'>
                  <h2 className='h2' style={{ marginBottom: "12px", color: "var(--brand)" }}>
                    Coming Soon
                  </h2>
                  <p style={{ color: "var(--ink-2)", fontSize: "16px" }}>
                    I'm currently putting together the details for this project.
                  </p>
                </div>
              </AnimatedSection>
            )}
          </div>

          <div className='project-footer'>
            <Link href={`/#${displayProject.id}`} className='btn btn--ghost'>
              Back to all projects
            </Link>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
