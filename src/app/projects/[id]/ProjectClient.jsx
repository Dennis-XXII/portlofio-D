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

  // Priority: Props (instant from SSR) -> Cache (client-side context)
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

  const hasSections =
    displayProject.sections && displayProject.sections.length > 0;

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
                  <a
                    href={displayProject.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn'
                  >
                    Visit Website
                  </a>
                )}
                {displayProject.repo && (
                  <a
                    href={displayProject.repo}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn btn--ghost'
                  >
                    View Source
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>

          {hasSections ? (
            <div className='project-sections'>
              {displayProject.sections.map((section, index) => {
                const isEven = index % 2 === 0;
                return (
                  <AnimatedSection key={section.id}>
                    <div
                      className={`project-section-grid ${isEven ? "is-even" : "is-odd"}`}
                    >
                      <div className='project-section-image-container'>
                        <div className='project-section-image-wrapper'>
                          <img
                            src={section.image}
                            alt=''
                            className='project-section-image'
                          />
                        </div>
                      </div>
                      <div className='project-section-content'>
                        <p className='project-section-text'>{section.text}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          ) : (
            <AnimatedSection delay={0.2}>
              <div className='project-coming-soon'>
                <h2 className='h2' style={{ marginBottom: "12px", color: "var(--brand)" }}>
                  Coming Soon
                </h2>
                <p style={{ color: "var(--ink-2)", fontSize: "16px" }}>
                  I'm currently putting together the details for this project.
                  Stay tuned!
                </p>
              </div>
            </AnimatedSection>
          )}

          <div className='project-footer'>
            <Link
              href={`/#${displayProject.id}`}
              className='btn btn--ghost'
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
