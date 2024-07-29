import { create } from 'zustand';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

// Define the User type to match the backend structure
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  canCollaborate: boolean;
  requestedToCollaborate?: boolean;
}

// Define the state and methods for the user store
interface UserState {
  user: User | null;
  allUsers: User[];
  setUser: (user: User) => void;
  getUser: () => User | null;
  clearUser: () => void;
  fetchUser: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  updateUser: (id: string, updatedData: Partial<User>) => Promise<void>;
  logout: () => void;
}


// Create the user store
const useUserStore = create<UserState>((set, get) => ({
  user: null,
  allUsers: [],
  setUser: (user: User) => set({ user }),
  getUser: () => get().user,
  clearUser: () => set({ user: null }),
  fetchUser: async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      set({ user: null });
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/getuser`, {
        headers: {
          'Authorization': token // Send token in the Authorization header
        }
      });

      const userData = response.data;
      set({ user: userData });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Error fetching user:', error.message);
      } else {
        // Handle other types of errors
        console.error('Error fetching user:', error);
      }
      set({ user: null });
    }

  },

  fetchAllUsers: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ allUsers: [] });
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/auth/getAllUsers`);

      const usersData = response.data;
      set({ allUsers: usersData });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.error('Error fetching users:', error.message);
      } else {
        // Handle other types of errors
        console.error('Error fetching users:', error);
      }
      set({ allUsers: [] });
    }
  },

  updateUser: async (id: string, updatedData: Partial<User>) => {


    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_HOST}/api/auth/updateuser/${id}`,
        updatedData
      );

      const updatedUser = response.data;

      // Update the user in the state if it matches the logged-in user
      if (get().user?._id === id) {
        set({ user: updatedUser });
      }

      // Update the allUsers array with the updated user data
      set((state) => ({
        allUsers: state.allUsers.map((user) => (user._id === id ? updatedUser : user)),
      }));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.success(`'Error updating user:${error.message}`, {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce
        });
        console.error('Error updating user:', error.message);
      } else {
        console.error('Error updating user:', error);
        // 
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null }); // Clear user from state
  },
}));

export default useUserStore;
