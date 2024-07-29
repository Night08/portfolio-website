import { create } from 'zustand';
import axios from 'axios';

// Define the types for experience and the store state
interface Experience {
  _id: string;
  company: string;
  role: string;
  workTimeline: string;
  description?: string;
}

interface ExperienceState {
  experiences: Experience[];
  fetchExperiences: () => Promise<void>;
  addExperience: (experience: Omit<Experience, '_id'>) => Promise<void>;
  updateExperience: (id: string, updatedData: Partial<Omit<Experience, '_id'>>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
}

// Create the Zustand store
const useExperienceStore = create<ExperienceState>((set) => ({
  experiences: [],

  // Fetch all experiences
  fetchExperiences: async () => {
    try {
      const response = await axios.get<Experience[]>(`${import.meta.env.VITE_BACKEND_HOST}/api/experiences`);
      set({ experiences: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to fetch experiences:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to fetch experiences:', error);
      }
    }
  },

  // Add a new experience
  addExperience: async (experience) => {
    try {
      const response = await axios.post<Experience>(`${import.meta.env.VITE_BACKEND_HOST}/api/experiences/add`, experience, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      set((state) => ({
        experiences: [...state.experiences, response.data]
      }));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to add experience:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to add experience:', error);
      }
    }
  },

  // Update an existing experience
  updateExperience: async (id, updatedData) => {
    try {
      const response = await axios.put<Experience>(`${import.meta.env.VITE_BACKEND_HOST}/api/experiences/update/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type is set
        }
      });
      set((state) => ({
        experiences: state.experiences.map((exp) =>
          exp._id === id ? response.data : exp
        )
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to update experience:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to update experience:', error);
      }
    }
  },

  // Delete an experience
  deleteExperience: async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/experiences/delete/${id}`);
      set((state) => ({
        experiences: state.experiences.filter((exp) => exp._id !== id)
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to delete experience:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to delete experience:', error);
      }
    }
  },
}));

export default useExperienceStore;
