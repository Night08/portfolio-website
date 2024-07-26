import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import '../index.css'

import Experiences from "../pages/Experiences";
import Contact from "../pages/Contact";
import Projects from "../pages/Projects";
import Dashboard from "../pages/dashboard/Dashboard";
import Skills from "../pages/Skills";
import DashboardSkills from "../pages/dashboard/DashboardSkills";
import DashboardExperience from "../pages/dashboard/DashboardExperience";
import DashboardProjects from "../pages/dashboard/DashboardProjects";
import Home from "../pages/Home";
import DashboardUser from "../pages/dashboard/DashboardUser";


const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />
      },
        {
            path: "/skills",
            element: <Skills />
        },
        {
          path: "/experiences",
          element: <Experiences />
      },
      {
        path: "/contact",
        element: <Contact />
    },
    {
      path: "/projects",
      element: <Projects />
  },
      ]
      },
      
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
              path: "skills",
              element: <DashboardSkills />
          },
          {
            path: "experiences",
            element: <DashboardExperience />
        },
      {
        path: "projects",
        element: <DashboardProjects />
    },
    {
      path: "users",
      element: <DashboardUser />
  }
        ]
        }

  ]);
  
  export default router;