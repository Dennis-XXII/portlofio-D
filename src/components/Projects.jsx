import AnimatedSection from "./AnimatedSection";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { m as Motion, AnimatePresence } from "framer-motion";
import "../projects.css";
import StorytellingCard from "../bits/StoryCard";
import { getProjects } from "../app/actions";

export default function Projects({ setActive }) {
  const [projects, setProjects] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { ref: startRef, inView: startInView } = useInView({
    threshold: 0.3,
  });
  const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    async function fetchData() {
      const data = await getProjects();
      setProjects(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (startInView || endInView) setActive("projects");
  }, [startInView, endInView, setActive]);

  if (projects.length === 0) return null;

  return (
    <section id='projects' className='section'>
      <div className='container'>
        <p ref={startRef} />
        <StorytellingCard title='Projects' align='left' theme='dark' />

        <div className='projects-grid'>
          {/* Left Column: Dynamic Preview */}
          <div className='projects-preview'>
            <AnimatePresence mode='wait'>
              {hoveredIndex !== null ? (
                <Motion.div
                  key={hoveredIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className='preview-content'
                >
                  <div className='preview-image-wrapper'>
                    <img
                      src={projects[hoveredIndex].image}
                      alt={projects[hoveredIndex].imgAlt || ""}
                      className='preview-img'
                    />
                  </div>
                  <div className='preview-details'>
                    <p className='preview-description'>
                      {projects[hoveredIndex].description}
                    </p>
                  </div>
                </Motion.div>
              ) : (
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className='preview-placeholder'
                >
                  <p>Hover over a project to see details</p>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Project List */}
          <div className='projects-list'>
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                className={`project-item ${hoveredIndex === index ? "active" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <h3 className='project-item-title'>{project.title}</h3>
                <p className='project-item-brief'>{project.brief}</p>

                <div className='project-item-footer'>
                  {project.link && (
                    <a
                      className='projects-link-small'
                      href={project.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                    >
                      Website
                    </a>
                  )}
                  {project.repo && (
                    <a
                      className='projects-link-small'
                      href={project.repo}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={(e) => e.stopPropagation()}
                    >
                      Repo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p ref={endRef} />
      </div>
    </section>
  );
}
