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
  const project = await prisma.project.create({
    data,
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

// Experience Actions
export async function createExperience(data) {
  await checkAuth();
  const exp = await prisma.experience.create({ data });
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

// Skill Actions
export async function createSkill(data) {
  await checkAuth();
  const skill = await prisma.skill.create({ data });
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

// Education Actions
export async function createEducation(data) {
  await checkAuth();
  const edu = await prisma.education.create({ data });
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
