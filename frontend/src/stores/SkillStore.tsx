import { create } from 'zustand';
import axios from 'axios';


// Define the types for skill and the store state
interface Skill {
  _id: string;
  icon: string;
  title: string;
  star: number; // 'star' is a number representing proficiency (e.g., 1 to 5)
}

interface SkillState {
  skills: Skill[];
  fetchAllSkills: () => Promise<void>;
  addSkill: (skill: Omit<Skill, '_id'>) => Promise<void>;
  updateSkill: (id: string, updatedData: Partial<Omit<Skill, '_id'>>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
}

// Create the Zustand store
const useSkillStore = create<SkillState>((set) => ({
  skills: [],

  // Fetch all skills
  fetchAllSkills: async () => {
    try {
      const response = await axios.get<Skill[]>(`${import.meta.env.VITE_BACKEND_HOST}/api/skills`);
      set({ skills: response.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to fetch skills:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to fetch skills:', error);
      }
    }
  },

  // Add a new skill
  addSkill: async (skill) => {
    try {
      const response = await axios.post<Skill>(`${import.meta.env.VITE_BACKEND_HOST}/api/skills/add`, skill, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type is set
        }
      });
      set((state) => ({
        skills: [...state.skills, response.data]
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to add skill:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to add skill:', error);
      }
    }
  },

  // Update an existing skill
  updateSkill: async (id, updatedData) => {
    try {
      const response = await axios.put<Skill>(`${import.meta.env.VITE_BACKEND_HOST}/api/skills/update/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type is set
        }
      });
      set((state) => ({
        skills: state.skills.map((skill) =>
          skill._id === id ? response.data : skill
        )
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to update skill:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to update skill:', error);
      }
    }
  },

  // Delete a skill
  deleteSkill: async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/skills/delete/${id}`);
      set((state) => ({
        skills: state.skills.filter((skill) => skill._id !== id)
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Failed to delete skill:', error.message);
      } else {
        // Handle other types of errors
        console.error('Failed to delete skill:', error);
      }
    }
  },
}));

export default useSkillStore;
