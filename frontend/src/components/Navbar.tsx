import { Link } from "react-router-dom";
import useUserStore from "../stores/userStore";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import socket from "../utils/socket";

const Navbar = () => {
  const { user, logout, updateUser } = useUserStore();

  // handle logout
  const handleLogout = () => {
    try {
      logout();
      toast.success(`Logged out successfully!`, {
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
    } catch (error) {
      let errorMessage = "Failed to logout. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error logging out:", errorMessage);
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

  const handleRequest = async () => {
    try {
      await updateUser(user?._id as any, {
        role: "viewer",
        canCollaborate: user?.canCollaborate,
        requestedToCollaborate: true,
      });
      toast.success(`Request sent successfully!`, {
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
      socket.emit("collaboration-request");
    } catch (error) {
      let errorMessage =
        "Failed to send request to collaborate. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error sending request:", errorMessage);
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

  const handleCancelRequst = async () => {
    try {
      await updateUser(user?._id as any, {
        role: user?.role,
        canCollaborate: user?.canCollaborate,
        requestedToCollaborate: false,
      });
      toast.success(`Request cancelled successfully!`, {
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
    } catch (error) {
      let errorMessage = "Failed to cancel request.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error sending request:", errorMessage);
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
      <div className="navbar  bg-[#fcd0b6] rounded-b-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li className="text-base font-semibold">
                <Link to={"/"}>Home</Link>
              </li>
              <li className={`text-base font-medium`}>
                <Link to={"/projects"}>Projects</Link>
              </li>
              <li className={`text-base font-medium`}>
                <Link to={"/skills"}>Skills</Link>
              </li>
              <li className={`text-base font-medium`}>
                <Link to={"/experiences"}>Experience</Link>
              </li>
              <li className={`text-base font-medium`}>
                <Link to={"/contact"}>Contact</Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">
            <img src="/logo.png" alt="logo" className="w-16 h-12" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li className={`text-base font-medium`}>
              <Link to={"/"}>Home</Link>
            </li>
            <li className={`text-base font-medium`}>
              <Link to={"/projects"}>Projects</Link>
            </li>
            <li className={`text-base font-medium`}>
              <Link to={"/skills"}>Skills</Link>
            </li>
            <li className={`text-base font-medium`}>
              <Link to={"/experiences"}>Experience</Link>
            </li>
            <li className={`text-base font-medium`}>
              <Link to={"/contact"}>Contact</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {!user ? (
            <Link
              to="/login"
              className="btn px-4 py-1 mr-4j bg-black text-white border-none hover:bg-slate-700"
            >
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <div className="justify-between text-base">
                    {user.role !== "owner" ? (
                      <div>
                        {" "}
                        {!user.requestedToCollaborate ? (
                          <button onClick={handleRequest}>
                            Request to Collaborate
                          </button>
                        ) : (
                          <button onClick={handleCancelRequst}>
                            Cancel request
                          </button>
                        )}
                      </div>
                    ) : (
                      <Link to="/dashboard">Dashboard</Link>
                    )}
                    {user.role == "owner" && (
                      <span className="badge bg-rose-600 text-white">
                        Admin
                      </span>
                    )}
                  </div>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
