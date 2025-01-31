import { IoMdAdd } from "react-icons/io";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useProjectStore from "../../stores/projectStore";
import ProjectsTable from "../../components/ProjectsTable";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import socket from "../../utils/socket";

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

interface IFormInputs {
  title: string;
  description: string;
  technologies: string; // As a comma-separated string
  demoLink?: string;
  sourceLink?: string;
  thumbnailImg?: FileList;
  screenshots?: FileList;
}

const DashboardProjects = () => {
  const { addProject, projects } = useProjectStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(projectSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      technologies: "",
      demoLink: "",
      sourceLink: "",
      thumbnailImg: undefined,
      screenshots: undefined,
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
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

    if (data.screenshots) {
      Array.from(data.screenshots).forEach((file) => {
        formData.append("screenshots", file);
      });
    }

    try {
      await addProject(formData);

      toast.success(`Project added successfully!`, {
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
      socket.emit("project-add");
    } catch (error) {
      let errorMessage = "Failed to add project. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error adding project:", errorMessage);
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

  // handle modal
  const handleOpenModal = () => {
    const modal = document.getElementById(
      "add_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  // handle modal
  const handleCloseModal = () => {
    const modal = document.getElementById(
      "add_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };
  return (
    <>
      <div className="p-5">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="font-bold text-2xl ">Your Projects</h2>{" "}
          <button
            className="btn bg-black hover:bg-slate-700 text-white"
            onClick={handleOpenModal}
          >
            <IoMdAdd className="text-white text-lg" /> Add Project
          </button>
        </div>

        {/* // Projects Table  */}
        <div className="max-w-full">
          <ProjectsTable projects={projects} />
        </div>
      </div>

      {/* // dialog box  */}
      <dialog id="add_project_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4"> Add New Project</h3>

          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleCloseModal}
          >
            ✕
          </button>

          {/* form field  */}

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
                Project Name
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter title here"
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
                description
              </label>

              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="input input-bordered w-full max-w-full my-2"
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
                Technology Used
              </label>

              <input
                id="technologies"
                type="text"
                {...register("technologies", {
                  required: "Technologies are required",
                })}
                className="input input-bordered w-full max-w-full my-2"
                placeholder="Comma separated list of technologies"
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
                {...register("demoLink", { required: "Demo Link is required" })}
                className="input input-bordered w-full max-w-full my-2"
                placeholder="https://www.xyz.com"
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
                Source Code Link
              </label>

              <input
                id="sourceLink"
                {...register("sourceLink", {
                  required: "Source Link is required",
                })}
                className="input input-bordered w-full max-w-full my-2"
                placeholder="https://www.xyz.com"
              />
              {errors.sourceLink && (
                <p className="text-red-600">{errors.sourceLink.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="thumbnailImg"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Thumbnail Image (jpg | png | jpeg)
              </label>
              <input
                id="thumbnailImg"
                type="file"
                accept="image/*"
                placeholder=""
                {...register("thumbnailImg", {
                  required: "Thumbnail Image is required",
                })}
                className="file-input file-input-bordered w-full max-w-xs"
              />
              {errors.thumbnailImg && (
                <p className="text-red-600">{errors.thumbnailImg.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="screenshots"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Screenshots (max: 30)
              </label>
              <input
                id="screenshots"
                type="file"
                accept="image/*"
                multiple
                placeholder=""
                {...register("screenshots", {
                  required: "Screenshots are required",
                })}
                className="file-input file-input-bordered w-full max-w-xs"
              />
              {errors.screenshots && (
                <p className="text-red-600">{errors.screenshots.message}</p>
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

export default DashboardProjects;
