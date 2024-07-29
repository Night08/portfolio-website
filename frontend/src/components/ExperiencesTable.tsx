import { AiTwotoneDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useExperienceStore from "../stores/ExperienceStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import socket from "../utils/socket";

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

interface Experience {
  _id: string;
  company: string;
  role: string;
  workTimeline: string;
  description?: string;
}

interface ExperiencesTableProps {
  experiences: Experience[];
}

const ExperiencesTable = ({ experiences }: ExperiencesTableProps) => {
  const { updateExperience, deleteExperience } = useExperienceStore();
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedExperience) {
      reset({
        company: selectedExperience.company,
        role: selectedExperience.role,
        workTimeline: selectedExperience.workTimeline,
        description: selectedExperience.description || "",
      });
    }
  }, [selectedExperience, reset]);

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "update_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (selectedExperience) {
      try {
        await updateExperience(selectedExperience._id, data);
        toast.success(`Experience updated successfully!`, {
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
        setSelectedExperience(null); // Clear selected experience
        handleCloseModal(); // Close modal
        socket.emit("experience-update");
      } catch (error) {
        let errorMessage = "Failed to update experience. Please try again.";

        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || errorMessage;
        }

        console.error("Error updating experience:", errorMessage);
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

  const handleOpenModal = (experience: Experience) => {
    setSelectedExperience(() => experience);
    const modal = document.getElementById(
      "update_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await deleteExperience(id);
      toast.success(`Experience deleted successfully!`, {
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
      socket.emit("experience-delete");
    } catch (error) {
      let errorMessage = "Failed to delete experience. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error deleting experience:", errorMessage);
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
      <div className="overflow-x-auto mt-10 md:mt-0">
        <table className="table table-zebra">
          {/* head */}
          <thead className="bg-black text-white text-sm">
            <tr>
              <th></th>
              <th>Company</th>
              <th>Role</th>
              <th>Work Timeline</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* rows */}
            {experiences.map((experience, index) => (
              <tr key={index}>
                <th className="align-top">{index + 1}</th>
                <td className="align-top">{experience.company}</td>
                <td className="align-top">{experience.role}</td>
                <td className="align-top">{experience.workTimeline}</td>
                <td className="align-top break-all">
                  {experience.description ? experience.description : "N/A"}
                </td>
                <td className="text-xl flex flex-row justify-center space-x-4 px-4 items-center text-white pr-6">
                  <button
                    className="btn bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => handleOpenModal(experience)}
                  >
                    <FaRegEdit /> Edit
                  </button>
                  <button
                    className="btn bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => handleDeleteAction(experience._id)}
                  >
                    <AiTwotoneDelete /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {/* // dialog box */}
            <dialog id="update_skill_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Update Experience</h3>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
                {/* form field */}
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
                      <p className="text-red-600 text-sm">
                        {errors.company.message}
                      </p>
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
                      {...register("role", { value: "data" })}
                      placeholder="e.g. SQL Developer"
                      className="input input-bordered w-full max-w-full my-2"
                    />
                    {errors.role && (
                      <p className="text-red-600 text-sm">
                        {errors.role.message}
                      </p>
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
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExperiencesTable;
