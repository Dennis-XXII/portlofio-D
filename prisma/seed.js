import 'dotenv/config'
import prisma from '../src/lib/prisma.js'
import { experiences, projects, skills, softSkills, languages, education, achievements, certifications } from '../src/data.js'

async function main() {
  console.log('Start seeding...')

  // Clear existing data (Careful: this deletes all current data in Postgres)
  await prisma.experience.deleteMany()
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.language.deleteMany()
  await prisma.education.deleteMany()
  await prisma.achievement.deleteMany()
  await prisma.certification.deleteMany()

  // Seed Experiences
  for (let i = 0; i < experiences.length; i++) {
    const exp = experiences[i]
    await prisma.experience.create({
      data: {
        ...exp,
        order: i,
      },
    })
  }

  // Seed Projects
  for (let i = 0; i < projects.length; i++) {
    const proj = projects[i]
    await prisma.project.create({
      data: {
        ...proj,
        order: i,
      },
    })
  }

  // Seed Technical Skills
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({
      data: {
        name: skills[i],
        type: 'technical',
        order: i,
      },
    })
  }

  // Seed Soft Skills
  for (let i = 0; i < softSkills.length; i++) {
    await prisma.skill.create({
      data: {
        name: softSkills[i],
        type: 'soft',
        order: i,
      },
    })
  }

  // Seed Languages
  for (let i = 0; i < languages.length; i++) {
    const match = languages[i].match(/(.*) \((.*)\)/)
    await prisma.language.create({
      data: {
        name: match ? match[1] : languages[i],
        level: match ? match[2] : '',
        order: i,
      },
    })
  }

  // Seed Education
  for (let i = 0; i < education.length; i++) {
    await prisma.education.create({
      data: {
        ...education[i],
        order: i,
      },
    })
  }

  // Seed Achievements
  for (let i = 0; i < achievements.length; i++) {
    await prisma.achievement.create({
      data: {
        ...achievements[i],
        order: i,
      },
    })
  }

  // Seed Certifications
  for (let i = 0; i < certifications.length; i++) {
    await prisma.certification.create({
      data: {
        ...certifications[i],
        order: i,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
