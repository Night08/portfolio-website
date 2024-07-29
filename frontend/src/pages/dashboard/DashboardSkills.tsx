import { IoMdAdd } from "react-icons/io";
import Select from "react-select";
import SkillsTable from "../../components/SkillsTable";
import useSkillsStore from "../../stores/SkillStore";

import javaImg from "../../assets/icons/java.png";
import cplusImg from "../../assets/icons/cplus.png";
import csharpImg from "../../assets/icons/csharp.png";
import dockerImg from "../../assets/icons/docker.png";
import gitImg from "../../assets/icons/git.png";
import javascriptImg from "../../assets/icons/javascript.png";
import linuxImg from "../../assets/icons/linux.png";

import mysqlImg from "../../assets/icons/mysql.png";
import mongodbImg from "../../assets/icons/mongodb.png";
import nextjsImg from "../../assets/icons/nextjs.png";
import pythonImg from "../../assets/icons/python.png";
import reactImg from "../../assets/icons/react.png";
import typescriptImg from "../../assets/icons/typescript.png";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import socket from "../../utils/socket";

interface IconOption {
  value: string;
  label: string;
  imgSrc: string;
}

interface ISkill {
  icon: string;
  title: string;
  star: number;
}

const skillSchema = yup.object().shape({
  icon: yup.string().required("icon is required"),
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

const DashboardSkills = () => {
  const { skills, addSkill } = useSkillsStore();
  const [selectedOption, setSelectedOption] = useState<string>("");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ISkill>({
    resolver: yupResolver(skillSchema),
  });

  const onSubmit: SubmitHandler<ISkill> = async (data) => {
    try {
      const formData = {
        ...data,
        icon: selectedOption, // Use the value of the selected option
      };
      await addSkill(formData);

    
      toast.success(`Skills added successfully!`, {
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
      handleCloseModal();
      setSelectedOption(""); // Reset selected option
      socket.emit("skills-add");
    } catch (error) {
      let errorMessage = "Failed to add skills. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error adding skills:", errorMessage);
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
          <h2 className="font-bold text-2xl ">Your Skills</h2>{" "}
          <button
            className="btn bg-black hover:bg-slate-700 text-white"
            onClick={handleOpenModal}
          >
            <IoMdAdd className="text-white text-lg" /> Add Skills
          </button>
        </div>

        <SkillsTable skills={skills} />
      </div>

      {/* // dialog box  */}
      <dialog id="add_skill_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4"> Add New Skills</h3>

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
                <p className="text-red-600 text-sm">{errors.title.message}</p>
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
                minLength={1}
                maxLength={5}
                placeholder="e.g. 3 (1-5)"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.star && (
                <p className="text-red-600 text-sm">{errors.star.message}</p>
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
                    className="mt-2 z-50"
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
                      iconOptions.find((opt) => opt.value === selectedOption) ||
                      null
                    }
                  />
                )}
              />
              {errors.icon && (
                <p className="text-red-600 text-sm">{errors.icon.message}</p>
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

export default DashboardSkills;
