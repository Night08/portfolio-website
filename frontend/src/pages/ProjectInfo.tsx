import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjectStore from "../stores/projectStore";
import { FaRegEdit } from "react-icons/fa";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
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

const ProjectInfo = () => {
  const { fetchProject, selectedProject, updateProject } = useProjectStore();
  const { user } = useUserStore();
  const params = useParams();
  let projectId = params.id || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(projectSchema) as any,
  });

  useEffect(() => {
    fetchProject(projectId);
  }, [fetchProject]);

  // to keep the form field filled
  useEffect(() => {
    console.log(selectedProject);
    reset({
      title: selectedProject?.title,
      description: selectedProject?.description,
      technologies: selectedProject?.technologies.join(", "), // Convert array to comma-separated string
      demoLink: selectedProject?.demoLink || "",
      sourceLink: selectedProject?.sourceLink || "",
    });
  }, [reset, selectedProject]);

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
        await fetchProject(selectedProject._id);
        toast.success(`Project edited successfully!`, {
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
        handleCloseModal();
        socket.emit("project-update");
      } catch (error) {
        let errorMessage = "Failed to edit project. Please try again.";

        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || errorMessage;
        }

        console.error("Error editing project:", errorMessage);
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

  const handleOpenModal = () => {
    const modal = document.getElementById(
      "update_selected_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "update_selected_project_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="flex flex-col w-[95%] p-10 justify-center ml-4 mb-32">
      <div className="flex flex-row space-x-4 md:space-x-10">
        <div className="w-[50%] md:w-[40%] flex items-center justify-center">
          {selectedProject?.thumbnailImg ? (
            <img
              src={selectedProject?.thumbnailImg}
              alt="project"
              className="rounded-3xl"
            />
          ) : (
            <div className="w-[400px] h-[200px] bg-slate-500 rounded-3xl"></div>
          )}

          {/* can be used as loader    */}
          {/* <div className="w-[400px] h-[200px] bg-slate-500 rounded-3xl animate-pulse"></div> */}
        </div>

        <div className="flex flex-col justify-between w-[45%] md:w-[55%]">
          <h2 className="text-3xl font-bold">{selectedProject?.title}</h2>
          <div className="flex flex-row justify-end items-end space-x-4">
            {user?.role == "collaborator" || user?.role == "owner" ? (
              <button
                className="btn bg-blue-800 hover:bg-blue-900 text-white"
                onClick={handleOpenModal}
              >
                <FaRegEdit /> Edit Project
              </button>
            ) : (
              ""
            )}

            {/* // edit dialog  */}

            <dialog id="update_selected_project_modal" className="modal">
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
                      <p className="text-red-600 text-sm">
                        {errors.title.message}
                      </p>
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
          </div>
        </div>
      </div>
      <hr className="my-5" />
      {/* Technologies  */}
      <div className="flex flex-col items-start space-y-2 mt-4 px-4">
        <h2 className="font-semibold text-xl mb-3"> Technologies Used</h2>
        <div className="flex gap-x-3 gap-y-3 flex-wrap">
          {selectedProject?.technologies.map((tech, techIndex) => (
            <span
              className="badge badge-outline bg-[#fa9f69] h-fit text-center p-2"
              key={techIndex}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* description  */}
      <div className="flex flex-col items-start space-y-2 mt-10 px-5">
        <h2 className="font-semibold text-xl mb-3"> Description</h2>
        <div className="flex gap-x-3 gap-y-3 flex-wrap">
          {!selectedProject?.description ? (
            <p>No description provided.</p>
          ) : (
            <p className="leading-6 text-slate-700 px-1">
              {selectedProject?.description}
            </p>
          )}
        </div>
      </div>

      {/* description  */}
      <div className="flex flex-col items-start space-y-2 mt-10 px-5">
        <h2 className="font-semibold text-xl mb-3"> Source Code Link</h2>
        <div className="flex gap-x-3 gap-y-3 flex-wrap">
          {!selectedProject?.sourceLink ? (
            <p>No link provided.</p>
          ) : (
            <a
              href={selectedProject?.sourceLink}
              className="leading-6 underline cursor-pointer text-blue-700 px-1"
              target="_blank"
            >
              {selectedProject?.sourceLink}
            </a>
          )}
        </div>
      </div>

      {/* description  */}
      <div className="flex flex-col items-start space-y-2 mt-10 px-5">
        <h2 className="font-semibold text-xl mb-3"> Demo Link</h2>
        <div className="flex gap-x-3 gap-y-3 flex-wrap">
          {!selectedProject?.demoLink ? (
            <p>No link provided.</p>
          ) : (
            <a
              href={selectedProject?.demoLink}
              className="leading-6 underline cursor-pointer text-blue-700 px-1"
              target="_blank"
            >
              {selectedProject?.demoLink}
            </a>
          )}
        </div>
      </div>

      {/* screenshots  */}

      <div className="flex flex-col items-start space-y-2 mt-10 px-5 w-[100%]">
        <h2 className="font-semibold text-xl mb-3"> Screenshots</h2>
        {!selectedProject?.screenshots ? (
          <p>No screenshots added.</p>
        ) : (
          <div className="gap-x-6 gap-y-6 grid grid-cols-1 md:grid-cols-2">
            {selectedProject?.screenshots.map((shots, index) => (
              <div key={index}>
                <img src={shots} alt="screenshot" className="min-w-[550px] " />
              </div>
            ))}

            {/* can be used as loader  */}
            {/* <div className="w-[550px] h-[300px] bg-slate-500 rounded-3xl"></div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
