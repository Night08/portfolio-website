import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import useUserStore from './stores/userStore'
import { useEffect, useState } from 'react'
import useSkillStore from './stores/SkillStore'
import useProjectStore from './stores/projectStore'
import useExperienceStore from './stores/ExperienceStore'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import socket from './utils/socket'
import HomeSocketListeners from './utils/HomeSocketListener'

function App() {
  const location = useLocation()
  const { fetchUser } = useUserStore()
  const { fetchAllSkills } = useSkillStore()
  const { fetchProjects } = useProjectStore()
  const { fetchExperiences } = useExperienceStore()
  const [isLoading, setIsLoading] = useState(true);



  // provide real time updates 
  useEffect(() => {
    HomeSocketListeners(socket)
    return () => {
      // Remove all listeners
      socket.off('project-update');
      socket.off('project-add');
      socket.off('project-delete');
      socket.off('experience-update');
      socket.off('experience-add');
      socket.off('experience-delete');
      socket.off('skills-update');
      socket.off('skills-add');
      socket.off('skills-delete');
      socket.off('profile-update');
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
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchUser, fetchAllSkills, fetchProjects, fetchExperiences]);



  return (
    <>
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
      {isLoading ? <div className="loader flex flex-row items-center justify-center w-full h-screen">
        <div>
          <span className="loading loading-dots loading-xs"></span>
          <span className="loading loading-dots loading-sm"></span>
          <span className="loading loading-dots loading-md"></span>
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div> : <div className='bg-[#fceee6] overflow-hidden'>

        {location.pathname !== "/sign-up" && location.pathname !== "/login" && <Navbar />}

        <div className="min-h-screen ">
          <Outlet />

        </div>
        {location.pathname !== "/" && <Footer />}
      </div>
      }

    </>
  )
}

export default App
