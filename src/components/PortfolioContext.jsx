"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  getProjects, 
  getExperiences, 
  getSkills, 
  getLanguages, 
  getEducation, 
  getProject 
} from "@/app/actions";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState({
    projects: null,
    experiences: null,
    skills: null,
    languages: null,
    education: null,
  });
  
  // Cache for full project details (including sections)
  const [projectDetails, setProjectDetails] = useState({});
  const [loading, setLoading] = useState({
    initial: false,
    projects: false,
    experiences: false,
    about: false,
  });

  const hydrate = useCallback((initialData) => {
    const { projectDetails: initialProjectDetails, ...otherData } = initialData;
    
    if (Object.keys(otherData).length > 0) {
      setData(prev => ({
        ...prev,
        ...otherData
      }));
    }

    if (initialProjectDetails) {
      setProjectDetails(prev => ({
        ...prev,
        ...initialProjectDetails
      }));
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    // If we already have data (from hydration or previous fetch), don't fetch again
    if (data.projects && data.experiences && data.skills) return;
    
    setLoading(prev => ({ ...prev, initial: true }));
    try {
      const [projects, experiences, skills, languages, education] = await Promise.all([
        getProjects(),
        getExperiences(),
        getSkills(),
        getLanguages(),
        getEducation(),
      ]);
      
      setData({
        projects,
        experiences,
        skills,
        languages,
        education,
      });
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
    } finally {
      setLoading(prev => ({ ...prev, initial: false }));
    }
  }, [data.projects, data.experiences, data.skills]);

  const fetchProjectDetail = useCallback(async (id) => {
    // If already cached, return it
    if (projectDetails[id]) return projectDetails[id];
    
    try {
      const project = await getProject(id);
      if (project) {
        setProjectDetails(prev => ({ ...prev, [id]: project }));
      }
      return project;
    } catch (err) {
      console.error(`Error fetching project ${id}:`, err);
      return null;
    }
  }, [projectDetails]);

  const value = {
    ...data,
    projectDetails,
    loading,
    hydrate,
    fetchInitialData,
    fetchProjectDetail,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
