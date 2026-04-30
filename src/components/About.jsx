import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import StorytellingCard from "../bits/StoryCard.jsx";
import { usePortfolio } from "./PortfolioContext";

export default function About({ initialData }) {
  const { skills, languages, education, loading } = usePortfolio();
  const [activeTab, setActiveTab] = useState("hard");

  // Priority: Hydrated Context > SSR Props > Loading State
  const technicalSkills = skills?.technical || initialData?.skills?.technical;
  const softSkills = skills?.soft || initialData?.skills?.soft;
  const currentLanguages = languages || initialData?.languages;
  const currentEducation = education || initialData?.education;

  const isLoading = loading.initial && !technicalSkills;

  const tabs = [
    { id: "hard", label: "Tech Skills", data: technicalSkills },
    { id: "soft", label: "Soft Skills", data: softSkills },
    { id: "languages", label: "Languages", data: currentLanguages },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <section id='about' className='section'>
      <div className='container'>
        <StorytellingCard title='About me' align='left' theme='dark' />

        {/* Education */}
        <h2 className='h2'>Education</h2>
        {isLoading
          ? [1, 2].map((n) => (
              <div
                key={n}
                className='kv skeleton'
                style={{ height: "120px", marginBottom: "16px" }}
              />
            ))
          : currentEducation?.map((edu, i) => (
              <AnimatedSection key={edu.id || i} delay={i * 0.08}>
                <div className='kv'>
                  <p className='headerP'>{edu.degree}</p>
                  <p className='infoP'>
                    {edu.institution} ( {edu.years} )
                  </p>
                  <p
                    style={{
                      maxWidth: "80%",
                      color: "var(--ink)",
                      fontSize: "14px",
                    }}
                  >
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
          {isLoading ? (
            <div className='tab-content skeleton' style={{ height: "200px" }} />
          ) : (
            <AnimatedSection key={activeTab}>
              <div className='tab-content'>
                <h2 className='h2'>{currentTab.label}</h2>
                <ul className='ul'>
                  {currentTab.data?.map((item, i) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
