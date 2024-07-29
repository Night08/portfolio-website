import { Link, Outlet, useLocation } from "react-router-dom";
import Dashboardheader from "../../components/DashboardHeader";
import DashboardSideNav from "../../components/DashboardSideNav";
import useExperienceStore from "../../stores/ExperienceStore";
import { useEffect, useState } from "react";
import useSkillStore from "../../stores/SkillStore";
import useUserStore from "../../stores/userStore";
import useProjectStore from "../../stores/projectStore";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardSocketListeners from "../../utils/DashboardSocketListener";
import socket from "../../utils/socket";

const Dashboard = () => {
  const { fetchExperiences } = useExperienceStore();
  const { fetchAllSkills } = useSkillStore();
  const { fetchAllUsers, fetchUser, user } = useUserStore();
  const { fetchProjects } = useProjectStore();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // provide real time updates
  useEffect(() => {
    DashboardSocketListeners(socket);
    return () => {
      // Remove all listeners
      socket.off("project-update");
      socket.off("project-add");
      socket.off("project-delete");
      socket.off("collaboration-request");
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchAllSkills(),
          fetchProjects(),
          fetchExperiences(),
          fetchAllUsers(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    fetchUser,
    fetchAllSkills,
    fetchProjects,
    fetchExperiences,
    fetchAllUsers,
  ]);

  return (
    <div>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {isLoading ? (
        <div className="loader flex flex-row items-center justify-center w-full h-screen">
          <div>
            <span className="loading loading-dots loading-xs"></span>
            <span className="loading loading-dots loading-sm"></span>
            <span className="loading loading-dots loading-md"></span>
            <span className="loading loading-dots loading-lg"></span>
          </div>
        </div>
      ) : (
        <div>
          {user?.role === "owner" ? (
            <div className="relative">
              <div className="fixed md:w-64">
                <div className="navbar md:hidden">
                  <div className="dropdown z-50">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
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
                      className="menu menu-sm dropdown-content bg-base-100 rounded-box  mt-3 w-52 p-2 shadow z-50 fixed overflow-visible"
                    >
                      <li className="text-base font-semibold">
                        <Link to={"/dashboard/projects"}>Projects</Link>
                      </li>
                      <li className={`text-base font-medium`}>
                        <Link to={"/dashboard/experiences"}>Experiences</Link>
                      </li>
                      <li className={`text-base font-medium`}>
                        <Link to={"/dashboard/skills"}>Skills</Link>
                      </li>
                      <li className={`text-base font-medium`}>
                        <Link to={"/dashboard/users"}>Users</Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="hidden md:block">
                  <DashboardSideNav />
                </div>
              </div>

              <div className="md:ml-64">
                <Dashboardheader />
                <div className="bg-white pt-4 md:pt-0">
                  {location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/" ? (
                    <div className="flex flex-col items-center justify-center min-h-screen">
                      <h2 className="font-semibold text-xl align-middle">
                        Manage the dashboard through tabs!
                      </h2>
                    </div>
                  ) : (
                    <Outlet />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h2 className="font-semibold text-xl align-middle">
                Only owner can access the dashboard!
              </h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
