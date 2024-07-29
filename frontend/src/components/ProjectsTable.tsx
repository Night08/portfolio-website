import { AiTwotoneDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import useProjectStore from "../stores/projectStore";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import socket from "../utils/socket";

interface IFormInputs {
  title: string;
  description: string;
  technologies: string;
  demoLink?: string;
  sourceLink?: string;
  thumbnailImg?: FileList;
  screenshots?: FileList;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  demoLink?: string;
  sourceLink?: string;
  thumbnailImg?: string; // URL or path to the image
  screenshots?: string[]; // Array of URLs or paths to the images
}

interface ProjectsTableProps {
  projects: Project[];
}

const projectSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  technologies: yup.string().required("Technologies are required"),
  demoLink: yup.string().url("Demo link must be a valid URL").optional(),
  sourceLink: yup.string().url("Source link must be a valid URL").optional(),
  thumbnailImg: yup
    .mixed()
    .test(
      "fileRequired",
      "Thumbnail image is required",
      (value) => value && value instanceof FileList && value.length > 0
    )
    .optional(),
  screenshots: yup
    .mixed()
    .test(
      "fileRequired",
      "Screenshots are required",
      (value) => value && value instanceof FileList && value.length > 0
    )
    .optional(),
});

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  const { updateProject, deleteProject } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(projectSchema) as any,
  });

  useEffect(() => {
    if (selectedProject) {
      reset({
        title: selectedProject.title,
        description: selectedProject.description,
        technologies: selectedProject.technologies.join(", "), // Convert array to comma-separated string
        demoLink: selectedProject.demoLink || "",
        sourceLink: selectedProject.sourceLink || "",
      });
    }
  }, [selectedProject, reset]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (selectedProject) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("technologies", data.technologies);

      if (data.demoLink) {
        formData.append("demoLink", data.demoLink);
      }

      if (data.sourceLink) {
        formData.append("sourceLink", data.sourceLink);
      }

      if (data.thumbnailImg && data.thumbnailImg.length > 0) {
        formData.append("thumbnailImg", data.thumbnailImg[0]);
      }

      if (data.screenshots && data.screenshots.length > 0) {
        Array.from(data.screenshots).forEach((file) => {
          formData.append("screenshots", file);
        });
      }

      try {
        await updateProject(selectedProject._id, formData);
        toast.success(`Project updated successfully!`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        reset();
        setSelectedProject(null);
        handleCloseModal();
        socket.emit("project-update");
      } catch (error) {
        let errorMessage = "Failed to update project. Please try again.";

        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || errorMessage;
        }

        console.error("Error updating project:", errorMessage);
        toast.error(`${errorMessage}`, {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    }
  };

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    const modal = document.getElementById(
      "update_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "update_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await deleteProject(id);
      toast.success(`Project deleted successfully!`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      socket.emit("project-delete");
    } catch (error) {
      let errorMessage = "Failed to delete project. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error deleting project", errorMessage);
      toast.error(`${errorMessage}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <div className="overflow-x-auto  mt-10 md:mt-0">
        <table className="table table-zebra">
          <thead className="bg-black text-white text-sm">
            <tr>
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Technologies</th>
              <th>Source Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{project.title}</td>
                <td className="break-all">{project.description}</td>
                <td className="space-x-1 space-y-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      className="badge bg-[#fa9f69] h-fit text-center"
                      key={techIndex}
                    >
                      {tech}
                    </span>
                  ))}
                </td>

                <td className="text-blue-700 cursor-pointer underline break-all">
                  <a href={project.sourceLink} target="_blank">
                    {project.sourceLink}
                  </a>
                </td>
                <td className="text-xl flex flex-row justify-center space-x-4 px-4 items-center text-white pr-6">
                  <button
                    className="btn bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => handleOpenModal(project)}
                  >
                    <FaRegEdit /> Edit
                  </button>
                  <button
                    className="btn bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => handleDeleteAction(project._id)}
                  >
                    <AiTwotoneDelete /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="update_project_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Project</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseModal}
          >
            ✕
          </button>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            method="dialog"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                placeholder="e.g. Project Title"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Project description"
                className="input input-bordered w-full max-w-full my-2 py-2"
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="technologies"
                className="block text-sm font-medium text-gray-700"
              >
                Technologies
              </label>
              <input
                id="technologies"
                type="text"
                {...register("technologies")}
                placeholder="Technologies used"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.technologies && (
                <p className="text-red-600 text-sm">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="demoLink"
                className="block text-sm font-medium text-gray-700"
              >
                Demo Link
              </label>
              <input
                id="demoLink"
                type="text"
                {...register("demoLink")}
                placeholder="https://demo-link.com"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.demoLink && (
                <p className="text-red-600 text-sm">
                  {errors.demoLink.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sourceLink"
                className="block text-sm font-medium text-gray-700"
              >
                Source Link
              </label>
              <input
                id="sourceLink"
                type="text"
                {...register("sourceLink")}
                placeholder="https://source-link.com"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.sourceLink && (
                <p className="text-red-600 text-sm">
                  {errors.sourceLink.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="thumbnailImg"
                className="block text-sm font-medium text-gray-700"
              >
                Thumbnail Image
              </label>
              <input
                id="thumbnailImg"
                type="file"
                {...register("thumbnailImg")}
                className="file-input file-input-bordered w-full max-w-xs mt-1"
              />
              {errors.thumbnailImg && (
                <p className="text-red-600 text-sm">
                  {errors.thumbnailImg.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="screenshots"
                className="block text-sm font-medium text-gray-700"
              >
                Screenshots
              </label>
              <input
                id="screenshots"
                type="file"
                {...register("screenshots")}
                multiple
                className="file-input file-input-bordered w-full max-w-xs mt-1"
              />
              {errors.screenshots && (
                <p className="text-red-600 text-sm">
                  {errors.screenshots.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-900 disabled:opacity-50 w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ProjectsTable;
