import { AiTwotoneDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Select from "react-select";

import javaImg from "../assets/icons/java.png";
import cplusImg from "../assets/icons/cplus.png";
import csharpImg from "../assets/icons/csharp.png";
import dockerImg from "../assets/icons/docker.png";
import gitImg from "../assets/icons/git.png";
import javascriptImg from "../assets/icons/javascript.png";
import linuxImg from "../assets/icons/linux.png";

import mysqlImg from "../assets/icons/mysql.png";
import mongodbImg from "../assets/icons/mongodb.png";
import nextjsImg from "../assets/icons/nextjs.png";
import pythonImg from "../assets/icons/python.png";
import reactImg from "../assets/icons/react.png";
import typescriptImg from "../assets/icons/typescript.png";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import useSkillStore from "../stores/SkillStore";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import socket from "../utils/socket";

interface ISkill {
  _id: string;
  icon: string;
  title: string;
  star: number;
}

const skillSchema = yup.object().shape({
  icon: yup.string().required("Icon is required"),
  title: yup.string().required("Title is required"),
  star: yup
    .number()
    .required("Star rating is required")
    .min(1, "Star rating must be at least 1")
    .max(5, "Star rating cannot be more than 5"),
});

const iconOptions: IconOption[] = [
  { value: "typescriptImg", label: "Typescript", imgSrc: typescriptImg },
  { value: "reactImg", label: "React.js", imgSrc: reactImg },
  { value: "pythonImg", label: "Python", imgSrc: pythonImg },
  { value: "nextjsImg", label: "Next.Js", imgSrc: nextjsImg },
  { value: "mongodbImg", label: "MongoDB", imgSrc: mongodbImg },
  { value: "mysqlImg", label: "MySQL", imgSrc: mysqlImg },
  { value: "linuxImg", label: "Linux", imgSrc: linuxImg },
  { value: "javascriptImg", label: "Javascript", imgSrc: javascriptImg },
  { value: "gitImg", label: "Git", imgSrc: gitImg },
  { value: "dockerImg", label: "Docker", imgSrc: dockerImg },
  { value: "csharpImg", label: "C#", imgSrc: csharpImg },
  { value: "cplusImg", label: "C++", imgSrc: cplusImg },
  { value: "javaImg", label: "Java", imgSrc: javaImg },
];

type FormInputs = {
  icon: string;
  title: string;
  star: number;
};

interface SkillsTableProps {
  skills: ISkill[];
}

interface IconOption {
  value: string;
  label: string;
  imgSrc: string;
}

const SkillsTable = ({ skills }: SkillsTableProps) => {
  const { updateSkill, deleteSkill } = useSkillStore();
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(""); // to handle icon selection and submission

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(skillSchema),
  });

  useEffect(() => {
    if (selectedSkill) {
      reset({
        icon: selectedSkill.icon,
        title: selectedSkill.title,
        star: selectedSkill.star,
      });
    }
  }, [selectedSkill, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (selectedSkill) {
      const formData = {
        ...data,
        icon: selectedOption, // Use the value of the selected option
      };

      try {
        await updateSkill(selectedSkill._id, formData);
        toast.success(`Skills updated successfully!`, {
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
        setSelectedSkill(null); // Clear selected experience
        handleCloseModal(); // Close modal
        setSelectedOption(""); // Reset selected option
        socket.emit("skills-update");
      } catch (error) {
        let errorMessage = "Failed to update skill. Please try again.";

        if (axios.isAxiosError(error) && error.response) {
          errorMessage = error.response.data.error || errorMessage;
        }

        console.error("Error updating skill:", errorMessage);
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

  const handleOpenModal = (skill: ISkill) => {
    setSelectedSkill(() => skill);
    const modal = document.getElementById(
      "update_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "update_skill_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      await deleteSkill(id);
      toast.success(`Skills deleted successfully!`, {
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
      socket.emit("skills-delete");
    } catch (error) {
      let errorMessage = "Failed to delete skills. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error deleting skills", errorMessage);
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
          {/* head */}
          <thead className="bg-black text-white text-sm">
            <tr>
              <th></th>
              <th>Title</th>
              <th>Proficiency</th>
              <th>Icon</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* rows */}

            {skills.map((skill, index) => (
              <tr key={index}>
                <th className="align-top">{index + 1}</th>
                <td className="align-top">{skill.title}</td>
                <td className="align-top">{skill.star} star</td>
                <td className="align-top">{skill.icon}</td>
                <td className="text-xl flex flex-row justify-center space-x-4 px-4 items-center text-white">
                  <button
                    className="btn bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => handleOpenModal(skill)}
                  >
                    <FaRegEdit /> Edit
                  </button>{" "}
                  <button
                    className="btn bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => handleDeleteAction(skill._id)}
                  >
                    <AiTwotoneDelete />
                    Delete
                  </button>
                </td>

                {/* // dialog box  */}
              </tr>
            ))}
            <dialog id="update_skill_modal" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4"> Update Experience</h3>

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
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      {...register("title")}
                      placeholder="e.g. JavaScript"
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
                      htmlFor="star"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Proficiency
                    </label>
                    <input
                      id="star"
                      type="number"
                      {...register("star")}
                      placeholder="e.g. 3 (0-5)"
                      minLength={1}
                      maxLength={5}
                      className="input input-bordered w-full max-w-full my-2"
                    />
                    {errors.star && (
                      <p className="text-red-600 text-sm">
                        {errors.star.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="icon"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Icon
                    </label>

                    <Controller
                      name="icon"
                      control={control}
                      render={({ field }) => (
                        <Select
                          className="mt-2"
                          options={iconOptions}
                          formatOptionLabel={(option: IconOption) => (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                              className="rounded-lg"
                            >
                              <img
                                src={option.imgSrc}
                                alt={option.label}
                                width={40}
                                className="mr-4"
                              />
                              <span>{option.label}</span>
                            </div>
                          )}
                          getOptionValue={(option) => option.value}
                          onChange={(option) => {
                            // Set selectedOption to the value of the selected option
                            setSelectedOption(option?.value || "");
                            field.onChange(option?.value || "");
                          }}
                          value={
                            iconOptions.find(
                              (opt) => opt.value === selectedOption
                            ) || null
                          }
                        />
                      )}
                    />
                    {errors.icon && (
                      <p className="text-red-600 text-sm">
                        {errors.icon.message}
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

export default SkillsTable;
