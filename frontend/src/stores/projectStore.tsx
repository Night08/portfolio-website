import { create } from 'zustand';
import axios from 'axios';



// Define the types for Project
interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  sourceLink: string;
  thumbnailImg: string;
  screenshots: string[];
}


interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: FormData) => Promise<void>;
  updateProject: (projectId: string, project: FormData) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  fetchProjects: () => Promise<void | null>;
  fetchProject: (projectId: string) => Promise<void | null>;
}

// Create the project store
const useProjectStore = create<ProjectState>(set => ({
  projects: [],
  selectedProject: null,
  addProject: async (project: FormData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_HOST}/api/projects/add`, project, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set(state => ({ projects: [...state.projects, response.data] }));
    } catch (error) {
      console.error('Error adding project:', error);
    }
  },
  updateProject: async (projectId: string, project: FormData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_HOST}/api/projects/update/${projectId}`, project);
      set(state => ({
        projects: state.projects.map(p => (p._id === projectId ? response.data : p))
      }));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  },
  deleteProject: async (projectId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/projects/delete/${projectId}`);
      set(state => ({
        projects: state.projects.filter(p => p._id !== projectId)
      }));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  },
  fetchProjects: async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/projects`);
      set({ projects: response.data });
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  },
  fetchProject: async (projectId: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/projects/${projectId}`);
      set({ selectedProject: response.data });
      // return response; 
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  },
}));

export default useProjectStore;
