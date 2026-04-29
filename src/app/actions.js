"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

// AUTH HELPER
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return session;
}

// FETCH ACTIONS
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
    technical: allSkills.filter(s => s.type === 'technical'),
    soft: allSkills.filter(s => s.type === 'soft'),
  };
}

export async function getLanguages() {
  return await prisma.language.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getEducation() {
  return await prisma.education.findMany({
    orderBy: { order: "asc" },
  });
}

// MUTATION ACTIONS

// Image Upload
export async function uploadImage(formData) {
  await checkAuth();
  const file = formData.get("file");
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, {
    access: "public",
  });

  return blob.url;
}

// Project Actions
export async function createProject(data) {
  await checkAuth();
  const count = await prisma.project.count();
  const project = await prisma.project.create({
    data: { ...data, order: count },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function updateProject(id, data) {
  await checkAuth();
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return project;
}

export async function deleteProject(id) {
  await checkAuth();
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function reorderProjects(ids) {
  await checkAuth();
  const transactions = ids.map((id, index) =>
    prisma.project.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(transactions);
  revalidatePath("/");
}

// Experience Actions
export async function createExperience(data) {
  await checkAuth();
  const count = await prisma.experience.count();
  const exp = await prisma.experience.create({ 
    data: { ...data, order: count } 
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
}

export async function deleteExperience(id) {
  await checkAuth();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function reorderExperiences(ids) {
  await checkAuth();
  const transactions = ids.map((id, index) =>
    prisma.experience.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(transactions);
  revalidatePath("/");
}

// Skill Actions
export async function createSkill(data) {
  await checkAuth();
  const count = await prisma.skill.count();
  const skill = await prisma.skill.create({ 
    data: { ...data, order: count } 
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function deleteSkill(id) {
  await checkAuth();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function reorderSkills(ids) {
  await checkAuth();
  const transactions = ids.map((id, index) =>
    prisma.skill.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(transactions);
  revalidatePath("/");
}

// Education Actions
export async function createEducation(data) {
  await checkAuth();
  const count = await prisma.education.count();
  const edu = await prisma.education.create({ 
    data: { ...data, order: count } 
  });
  revalidatePath("/");
  revalidatePath("/admin/education");
  return edu;
}

export async function deleteEducation(id) {
  await checkAuth();
  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function reorderEducation(ids) {
  await checkAuth();
  const transactions = ids.map((id, index) =>
    prisma.education.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(transactions);
  revalidatePath("/");
}

// SINGLE ITEM FETCHERS
export async function getProject(id) {
  return await prisma.project.findUnique({ where: { id } });
}

export async function getExperience(id) {
  return await prisma.experience.findUnique({ where: { id } });
}

export async function getSkill(id) {
  return await prisma.skill.findUnique({ where: { id } });
}

export async function getEducationItem(id) {
  return await prisma.education.findUnique({ where: { id } });
}

// UPDATE ACTIONS (Adding missing ones)
export async function updateExperience(id, data) {
  await checkAuth();
  const exp = await prisma.experience.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
}

export async function updateSkill(id, data) {
  await checkAuth();
  const skill = await prisma.skill.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function updateEducation(id, data) {
  await checkAuth();
  const edu = await prisma.education.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath("/admin/education");
  return edu;
}
