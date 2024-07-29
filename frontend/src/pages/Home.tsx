import { useRef, useState } from "react";
import About from "../components/About";
import Hero from "../components/Hero";
import { FaRegEdit } from "react-icons/fa";
import useUserStore from "../stores/userStore";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Bounce, toast } from "react-toastify";
import socket from "../utils/socket";

interface IFormInputs {
  name: string;
  designation: string;
  about: string;
}

const aboutSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  designation: yup.string().required("Designation is required"),
  about: yup.string().required("About description is required"),
});

const Home = () => {
  const { user } = useUserStore();
  const [name, setName] = useState("Shubham");
  const [designation, setDesignation] = useState("Full Stack Developer");
  const [about, setAbout] = useState(
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore magni illo temporibus tempore saepe soluta porro officia tempora culpa. Nam quidem necessitatibus nemo repellendus qui corporis commodi eligendi maiores cumque?   Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque corrupti accusantium corporis. Ullam, cum. Vel alias incidunt itaque quasi tempore! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique voluptas laborum unde numquam facilis! Rem molestias tenetur numquam sed amet sit expedita quaerat ipsam, commodi possimus obcaecati quo repellat cum nihil quae natus non mollitia nobis adipisci cumque? Et nostrum commodi cupiditate eos aspernatur repellendus molestias dignissimos distinctio laboriosam quae?"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(aboutSchema) as any,
  });

  // handle scroll to about me
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const scrollToAboutSection = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    reset({
      name: name,
      designation: designation,
      about: about, // Convert array to comma-separated string
    });
  }, [reset, name, designation, about]);

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    try {
      setName(data.name);
      setDesignation(data.designation);
      setAbout(data.about);
      toast.success(`Profile edited successfully!`, {
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
      socket.emit("profile-update");
    } catch (error) {
      toast.error(`Failed to edit profile. Please try again.`, {
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

  const handleOpenModal = () => {
    const modal = document.getElementById(
      "edit_profile_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById(
      "edit_profile_modal"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="relative">
      {user?.role == "owner" && (
        <div className="absolute top-4 right-4">
          <button
            className="btn bg-blue-800 hover:bg-blue-900 text-white"
            onClick={handleOpenModal}
          >
            <FaRegEdit /> Edit Profile
          </button>
        </div>
      )}
      {/* // edit dialog  */}

      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Update Profile</h3>
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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Enter name here"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700"
              >
                Designation
              </label>
              <input
                id="designation"
                type="text"
                {...register("designation")}
                placeholder="Enter designation here"
                className="input input-bordered w-full max-w-full my-2"
              />
              {errors.designation && (
                <p className="text-red-600 text-sm">
                  {errors.designation.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700"
              >
                About
              </label>
              <textarea
                id="about"
                {...register("about")}
                placeholder="Enter about description here"
                className="input input-bordered w-full max-w-full my-2 py-2 min-h-10"
              />
              {errors.about && (
                <p className="text-red-600 text-sm">{errors.about.message}</p>
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

      <Hero
        onAboutClick={scrollToAboutSection}
        name={name}
        designation={designation}
      />
      <About ref={aboutSectionRef} about={about} />
    </div>
  );
};

export default Home;
