import { IoMdAdd } from "react-icons/io";
import ExperiencesTable from "../../components/ExperiencesTable";
import useExperienceStore from "../../stores/ExperienceStore";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import socket from "../../utils/socket";

interface IFormInputs {
  company: string;
  role: string;
  workTimeline: string;
  description?: string;
}

const schema = yup.object().shape({
  company: yup.string().required("Company is required"),
  role: yup.string().required("Role is required"),
  workTimeline: yup.string().required("Work timeline is required"),
  description: yup.string().optional(),
});

const DashboardExperience = () => {
  const { experiences, addExperience } = useExperienceStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      company: "",
      role: "",
      workTimeline: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      await addExperience(data);

      toast.success(`Experience added successfully!`, {
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
      reset(); // Reset form fields after successful submission
      socket.emit("experience-add");
    } catch (error) {
      let errorMessage = "Failed to add experience. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error adding experience:", errorMessage);
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
      "add_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  // handle modal
  const handleCloseModal = () => {
    const modal = document.getElementById(
      "add_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };
  return (
    <>
      <div className="p-5">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="font-bold text-2xl ">Your Experiences</h2>{" "}
          <button
            className="btn bg-black hover:bg-slate-700 text-white"
            onClick={handleOpenModal}
          >
            <IoMdAdd className="text-white text-lg" /> Add Experience
          </button>
        </div>

        <ExperiencesTable experiences={experiences} />
      </div>

      {/* // dialog box  */}
      <dialog id="add_skill_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4"> Add New Experience</h3>

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
                htmlFor="company"
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <input
                id="company"
                type="text"
                {...register("company")}
                placeholder="e.g. xyz Pvt Ltd"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.company && (
                <p className="text-red-600 text-sm">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <input
                id="role"
                type="text"
                {...register("role")}
                placeholder="e.g. SQL Developer"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.role && (
                <p className="text-red-600 text-sm">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="workTimeline"
                className="block text-sm font-medium text-gray-700"
              >
                Work Timeline
              </label>
              <input
                id="workTimeline"
                type="text"
                {...register("workTimeline")}
                placeholder="e.g. 2022-2024"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.workTimeline && (
                <p className="text-red-600 text-sm">
                  {errors.workTimeline.message}
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
                placeholder="write description here"
                className="input input-bordered w-full max-w-full my-2 py-2"
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
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

export default DashboardExperience;
