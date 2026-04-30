"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { put } from "@vercel/blob";

// AUTH HELPER
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
  return session;
}

// FETCH ACTIONS (CACHED)
export const getExperiences = unstable_cache(
  async () => {
    return await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
  },
  ["experiences-list"],
  { tags: ["experiences"] }
);

export const getProjects = unstable_cache(
  async () => {
    return await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  },
  ["projects-list"],
  { tags: ["projects"] }
);

export const getSkills = unstable_cache(
  async () => {
    const allSkills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return {
      technical: allSkills.filter(s => s.type === 'technical'),
      soft: allSkills.filter(s => s.type === 'soft'),
    };
  },
  ["skills-list"],
  { tags: ["skills"] }
);

export const getLanguages = unstable_cache(
  async () => {
    return await prisma.language.findMany({
      orderBy: { order: "asc" },
    });
  },
  ["languages-list"],
  { tags: ["languages"] }
);

export const getEducation = unstable_cache(
  async () => {
    return await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
  },
  ["education-list"],
  { tags: ["education"] }
);

const getCachedProject = unstable_cache(
  async (id) => {
    return await prisma.project.findUnique({ 
      where: { id },
      include: { sections: { orderBy: { order: 'asc' } } }
    });
  },
  ["project-detail"],
  { tags: ["projects"] }
);

export async function getProject(id) {
  return getCachedProject(id);
}

// MUTATION ACTIONS

// Image Upload
export async function uploadImage(formData) {
  await checkAuth();
  const file = formData.get("file");
  if (!file) throw new Error("No file provided");

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
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
  revalidateTag("projects");
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
  revalidateTag("projects");
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/projects/${id}`);
  return project;
}

export async function deleteProject(id) {
  await checkAuth();
  await prisma.project.delete({
    where: { id },
  });
  revalidateTag("projects");
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
  revalidateTag("projects");
  revalidatePath("/");
}

// Project Section Actions
export async function createProjectSection(projectId, data) {
  await checkAuth();
  try {
    const count = await prisma.projectSection.count({ where: { projectId } });
    const section = await prisma.projectSection.create({
      data: {
        type: data.type,
        content: data.content || "",
        width: data.width || "full",
        order: count,
        project: { connect: { id: projectId } }
      },
    });
    revalidateTag("projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/admin/projects/${projectId}`);
    return section;
  } catch (error) {
    console.error("Prisma createProjectSection error:", error);
    throw error;
  }
}

export async function updateProjectSection(id, data) {
  await checkAuth();
  const section = await prisma.projectSection.update({
    where: { id },
    data: {
      type: data.type,
      content: data.content,
      width: data.width,
    },
  });
  revalidateTag("projects");
  revalidatePath(`/projects/${section.projectId}`);
  revalidatePath(`/admin/projects/${section.projectId}`);
  return section;
}

export async function deleteProjectSection(id) {
  await checkAuth();
  const section = await prisma.projectSection.delete({ where: { id } });
  revalidateTag("projects");
  revalidatePath(`/projects/${section.projectId}`);
  revalidatePath(`/admin/projects/${section.projectId}`);
  return section;
}

export async function reorderProjectSections(projectId, ids) {
  await checkAuth();
  const transactions = ids.map((id, index) =>
    prisma.projectSection.update({
      where: { id },
      data: { order: index },
    })
  );
  await prisma.$transaction(transactions);
  revalidateTag("projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}`);
}

// Experience Actions
export async function createExperience(data) {
  await checkAuth();
  const count = await prisma.experience.count();
  const exp = await prisma.experience.create({ 
    data: { ...data, order: count } 
  });
  revalidateTag("experiences");
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
}

export async function deleteExperience(id) {
  await checkAuth();
  await prisma.experience.delete({ where: { id } });
  revalidateTag("experiences");
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function updateExperience(id, data) {
  await checkAuth();
  const exp = await prisma.experience.update({
    where: { id },
    data,
  });
  revalidateTag("experiences");
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return exp;
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
  revalidateTag("experiences");
  revalidatePath("/");
}

// Skill Actions
export async function createSkill(data) {
  await checkAuth();
  const count = await prisma.skill.count();
  const skill = await prisma.skill.create({ 
    data: { ...data, order: count } 
  });
  revalidateTag("skills");
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
}

export async function deleteSkill(id) {
  await checkAuth();
  await prisma.skill.delete({ where: { id } });
  revalidateTag("skills");
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function updateSkill(id, data) {
  await checkAuth();
  const skill = await prisma.skill.update({
    where: { id },
    data,
  });
  revalidateTag("skills");
  revalidatePath("/");
  revalidatePath("/admin/skills");
  return skill;
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
  revalidateTag("skills");
  revalidatePath("/");
}

// Education Actions
export async function createEducation(data) {
  await checkAuth();
  const count = await prisma.education.count();
  const edu = await prisma.education.create({ 
    data: { ...data, order: count } 
  });
  revalidateTag("education");
  revalidatePath("/");
  revalidatePath("/admin/education");
  return edu;
}

export async function deleteEducation(id) {
  await checkAuth();
  await prisma.education.delete({ where: { id } });
  revalidateTag("education");
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function updateEducation(id, data) {
  await checkAuth();
  const edu = await prisma.education.update({
    where: { id },
    data,
  });
  revalidateTag("education");
  revalidatePath("/");
  revalidatePath("/admin/education");
  return edu;
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
  revalidateTag("education");
  revalidatePath("/");
}

// SINGLE ITEM FETCHERS
export async function getExperience(id) {
  return await prisma.experience.findUnique({ where: { id } });
}

export async function getSkill(id) {
  return await prisma.skill.findUnique({ where: { id } });
}

export async function getEducationItem(id) {
  return await prisma.education.findUnique({ where: { id } });
}
