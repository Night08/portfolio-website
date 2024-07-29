import { Link } from "react-router-dom";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  sourceLink: string;
  thumbnailImg: string;
  screenshots: string[];
}

interface ProjectProps {
  projects: Project[];
}
const ProjectCard = ({ projects }: ProjectProps) => {
  return (
    <>
      {projects.map((project, index) => (
        <div key={index}>
          <Link to={`/projects/${project._id}`}>
            <div className="card bg-base-100 w-96 shadow-xl hover:-translate-y-3 transition-all mb-4 cursor-pointer">
              <figure>
                <img
                  src={project.thumbnailImg}
                  alt="project"
                  className="h-[250px] w-full"
                /> 
              </figure>
              <div className="card-body p-4 pb-5 ">
                <h2 className="card-title">{project.title}</h2>
                <p className="text-sm text-slate-700 min-w-[200px]">
                  {project.description ? project.description.slice(0, 20) : ""}...
                </p>
                <div className="card-actions justify-start">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      className="badge badge-outline bg-[#fa9f69] h-fit text-center"
                      key={techIndex}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default ProjectCard;
