import { BiBook } from "react-icons/bi";
import { DiCodepen } from "react-icons/di";
import { FaLaptopCode, FaUserEdit } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import useUserStore from "../stores/userStore";

const DashboardSideNav = () => {
  const { allUsers } = useUserStore();

  const location = useLocation();
  const path = location.pathname;

  const menuList = [
    {
      id: 1,
      title: "Projects",
      icon: <DiCodepen />,
      path: "/dashboard/projects",
    },
    {
      id: 2,
      title: "Skills",
      icon: <FaLaptopCode />,
      path: "/dashboard/skills",
    },
    {
      id: 3,
      title: "Experiences",
      icon: <BiBook />,
      path: "/dashboard/experiences",
    },
    { id: 4, title: "Users", icon: <FaUserEdit />, path: "/dashboard/users" },
  ];

  return (
    <>
      <div className="h-screen relative px-4 py-8 border shadow-sm bg-[#fceee6]">
        <Link to={"/dashboard"} className="cursor-pointer w-[150] h-[150]">
          <h1 className="text-3xl font-bold text-center">Dashboard</h1>
        </Link>

        <div className="mt-16">
          {menuList.map((menu, index) => {
            const hasRequestedCollaborate = allUsers.some(
              (user) => user.requestedToCollaborate
            );
            return (
              <div key={index}>
                <Link to={menu.path} className="relative">
                  <div>
                    {menu.title == "Users" && hasRequestedCollaborate && (
                      <div
                        key={index}
                        className="badge badge-accent absolute top-4 right-8 bg-red-700 text-white border-none"
                      >
                        Request
                      </div>
                    )}

                    <h2
                      className={`flex gap-2 items-center mb-2 font-medium rounded-lg hover:text-main hover:bg-purple-100 p-5 cursor-pointer ${
                        path == menu.path
                          ? "text-main bg-[#ffb88f]"
                          : "text-gray-700"
                      }`}
                    >
                      {menu.icon}
                      {menu.title}
                    </h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DashboardSideNav;
