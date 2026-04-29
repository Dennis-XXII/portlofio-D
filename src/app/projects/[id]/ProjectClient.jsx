"use client";

import AnimatedSection from "@/components/AnimatedSection";
import NavBar from "@/components/NavBar";
import { LazyMotion, domMax } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePortfolio } from "@/components/PortfolioContext";

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
      <main style={{ paddingTop: "140px", paddingBottom: "100px" }}>
        <div className='container'>
          {/* Header */}
          <AnimatedSection>
            <div style={{ marginBottom: hasSections ? "80px" : "40px" }}>
              <Link
                href={`/#${displayProject.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  marginBottom: "32px",
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: "inherit",
                }}
              >
                ← Back to Projects
              </Link>
              <h1 className='h1' style={{ marginBottom: "16px" }}>
                {displayProject.title}
              </h1>
              <p
                className='infoP'
                style={{ marginBottom: "32px", fontSize: "14px" }}
              >
                {displayProject.year} • {displayProject.brief}
              </p>
              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.8",
                  color: "var(--ink-2)",
                  maxWidth: "1200px",
                }}
              >
                {displayProject.description}
              </p>

              <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
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
            <div
              style={{ display: "flex", flexDirection: "column", gap: "120px" }}
            >
              {displayProject.sections.map((section, index) => {
                const isEven = index % 2 === 0;
                return (
                  <AnimatedSection key={section.id}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "60px",
                        alignItems: "center",
                        direction: isEven ? "ltr" : "rtl",
                      }}
                    >
                      <div style={{ direction: "ltr" }}>
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "4/3",
                            borderRadius: "24px",
                            overflow: "hidden",
                            boxShadow: "var(--shadow-md)",
                            backgroundColor: "var(--button-bg)",
                          }}
                        >
                          <img
                            src={section.image}
                            alt=''
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ direction: "ltr" }}>
                        <p
                          style={{
                            fontSize: "18px",
                            lineHeight: "1.8",
                            color: "var(--ink-2)",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          ) : (
            <AnimatedSection delay={0.2}>
              <div
                style={{
                  marginTop: "60px",
                  padding: "80px 40px",
                  borderRadius: "32px",
                  backgroundColor: "var(--button-bg)",
                  textAlign: "center",
                  border: "1px dashed var(--nav-border)",
                }}
              >
                <h2
                  className='h2'
                  style={{ marginBottom: "12px", color: "var(--brand)" }}
                >
                  Coming Soon
                </h2>
                <p style={{ color: "var(--ink-2)", fontSize: "16px" }}>
                  I'm currently putting together the details for this project.
                  Stay tuned!
                </p>
              </div>
            </AnimatedSection>
          )}

          <div
            style={{
              marginTop: "120px",
              textAlign: "center",
              paddingTop: "60px",
              borderTop: "1px solid var(--nav-border)",
            }}
          >
            <Link
              href={`/#${displayProject.id}`}
              className='btn btn--ghost'
              style={{ fontFamily: "inherit" }}
            >
              Back to all projects
            </Link>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
