"use server";

import prisma from "@/lib/prisma";

export async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getProjects() {
  return await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getSkills() {
  const allSkills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
  });
  return {
    technical: allSkills.filter(s => s.type === 'technical').map(s => s.name),
    soft: allSkills.filter(s => s.type === 'soft').map(s => s.name),
  };
}

export async function getLanguages() {
  const langs = await prisma.language.findMany({
    orderBy: { order: "asc" },
  });
  return langs.map(l => `${l.name} (${l.level})`);
}

export async function getEducation() {
  return await prisma.education.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getAchievements() {
  return await prisma.achievement.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getCertifications() {
  return await prisma.certification.findMany({
    orderBy: { order: "asc" },
  });
}
