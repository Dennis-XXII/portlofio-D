import { 
  getProjects, 
  getExperiences, 
  getSkills, 
  getLanguages, 
  getEducation 
} from "./actions";
import HomeClient from "./HomeClient";

export default async function Page() {
  const [projects, experiences, skills, languages, education] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getLanguages(),
    getEducation(),
  ]);

  const initialData = {
    projects,
    experiences,
    skills,
    languages,
    education,
  };

  return <HomeClient initialData={initialData} />;
}
