import AnimatedSection from "./AnimatedSection";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import StorytellingCard from "../bits/StoryCard.jsx";
import { getSkills, getLanguages, getEducation } from "../app/actions";

export default function About({ setActive }) {
  const [data, setData] = useState({
    skills: { technical: [], soft: [] },
    languages: [],
    education: [],
  });

  const { ref: startRef, inView: startInView } = useInView({
    threshold: 0.3,
  });
  const { ref: endRef, inView: endInView } = useInView({ threshold: 0.3 });

  const [activeTab, setActiveTab] = useState("hard");

  useEffect(() => {
    async function fetchData() {
      const [skillsData, languagesData, educationData] = await Promise.all([
        getSkills(),
        getLanguages(),
        getEducation(),
      ]);
      setData({
        skills: skillsData,
        languages: languagesData,
        education: educationData,
      });
    }
    fetchData();
  }, []);

  const tabs = [
    { id: "hard", label: "Tech Skills", data: data.skills.technical },
    { id: "soft", label: "Soft Skills", data: data.skills.soft },
    { id: "languages", label: "Languages", data: data.languages },
  ];

  useEffect(() => {
    if (startInView) setActive("about");
    if (endInView) setActive("about"); // switch to next section when bottom enters
  }, [startInView, endInView, setActive]);

  return (
    <section id='about' className='section'>
      <div className='container'>
        <StorytellingCard
          title='About me'
          subtitle='& my background'
          align='left'
          theme='dark'
        />
        <p ref={startRef} style={{ height: "0px" }} />

        {/* Education */}
        <h2 className='h2'>Education</h2>
        {data.education.map((edu, i) => (
          <AnimatedSection key={edu.id || i} delay={i * 0.08}>
            <div className='kv'>
              <p className='headerP'>{edu.degree}</p>
              <p className='infoP'>
                {edu.institution} ( {edu.years} )
              </p>
              <p style={{ maxWidth: "70%" }}>
                <b>Remark: </b>
                {edu.remarks}
              </p>
            </div>
          </AnimatedSection>
        ))}

        {/* Skills + Languages */}
        <div>
          {/* Tab Buttons */}
          <div className='skills-tabs'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={`Show ${tab.label}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatedSection key={activeTab}>
            <div className='tab-content'>
              <h2 className='h2'>
                {tabs.find((t) => t.id === activeTab).label}
              </h2>
              <ul className='ul'>
                {tabs
                  .find((t) => t.id === activeTab)
                  .data.map((item, i) => (
                    <li key={item.id || i}>
                      {typeof item === "string"
                        ? item
                        : item.level
                          ? `${item.name} (${item.level})`
                          : item.name}
                    </li>
                  ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>

        <p ref={endRef} />
      </div>
    </section>
  );
}
