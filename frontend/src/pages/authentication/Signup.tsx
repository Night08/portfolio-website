import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/signin-image.webp";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./utils/ValidationSchema";
import axios from "axios";
import useUserStore from "../../stores/userStore";
import { Bounce, toast } from "react-toastify";

interface IFormInputs {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const { fetchUser } = useUserStore();

  //react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const name = data.name;
    const email = data.email;
    const password = data.password;

    const userInfo: { name: string; email: string; password: string } = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_HOST}/api/auth/createuser`,
        userInfo
      );

      reset(); // update form back to default values
      toast.success(`Signed up successfully!`, {
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

      localStorage.setItem("token", response.data.authtoken);
      await fetchUser();

      navigate("/", { replace: true });
    } catch (error) {
      let errorMessage = `Failed to sign up. Please try again.`;

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error signing up:", errorMessage);
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
      <div>
        <div className="navbar  bg-[#fcd0b6] rounded-b-lg">
          <div className="navbar-start">
            <Link to="/" className="btn btn-ghost text-xl ml-4">
              <img src="/logo.png" alt="logo" className="w-14 h-11" />
            </Link>
          </div>
        </div>

        <section>
          <div className="container min-h-screen px-10 py-10">
            <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
              {/* Left column container with background--> */}
              <div className="mb-7 md:mb-0 md:w-8/12 lg:w-6/12 ">
                <img src={loginImg} className="w-full" alt="Phone image" />
              </div>

              {/* right column Registration  */}
              <div className="w-full bg-red rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center dark:text-white">
                    Registration
                  </h1>
                  <form
                    className="space-y-4 md:space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter your name (min length: 3)"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="•••••••• (minimum of 8 characters)"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={`w-full text-white ${
                        !isValid ? "bg-slate-600" : "bg-purple-600"
                      } hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                      disabled={!isValid}
                      title={`${!isValid ? "Fill out the form first" : ""}`}
                    >
                      Sign up
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account?
                      <Link
                        to="/login"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-2 text-white underline"
                      >
                        Login
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Signup;
