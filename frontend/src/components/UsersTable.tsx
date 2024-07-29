import useUserStore from "../stores/userStore";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  canCollaborate?: boolean;
  requestedToCollaborate?: boolean;
}

interface UserTableProps {
  allUsers: User[];
}

const UsersTable = ({ allUsers }: UserTableProps) => {
  const { updateUser } = useUserStore();

  const handleAllowAction = async (user: User) => {
    try {
      await updateUser(user._id, {
        role: "collaborator",
        canCollaborate: true,
        requestedToCollaborate: user.requestedToCollaborate,
      });
      toast.success(`Permission granted successfully!`, {
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
      let errorMessage = "Failed to grant permission. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error granting permission", errorMessage);
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

  const handleDeleteAction = async (id: string) => {
    try {
      await updateUser(id, {
        role: "viewer",
        canCollaborate: false,
        requestedToCollaborate: false,
      });
      toast.success(`Permission revoked successfully!`, {
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
      let errorMessage = "Failed to revoke permission. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.error || errorMessage;
      }

      console.error("Error revoking", errorMessage);
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
      <div className="overflow-x-auto  mt-14 md:mt-0">
        <table className="table">
          {/* head */}
          <thead className="bg-black text-white text-sm">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Can Collaborate</th>
              <th>Requested to Collaborate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* rows */}

            {allUsers.map((user, index) => (
              <tr
                key={index}
                className={`${user.canCollaborate ? "bg-rose-200" : ""}`}
              >
                <th
                  className={`align-top ${
                    user.requestedToCollaborate ? "bg-rose-600" : ""
                  }`}
                >
                  {index + 1}
                </th>
                <td className="align-top">{user.name}</td>
                <td className="align-top">{user.email}</td>
                <td className="align-top">{user.role}</td>
                <td className="align-top">
                  {user.canCollaborate ? "Yes" : "No"}
                </td>
                <td className="align-top">
                  {user.requestedToCollaborate ? "Yes" : "No"}
                </td>
                <td className="text-xl flex flex-row justify-start space-x-4 px-4 items-center text-white">
                  <button
                    className="btn bg-blue-800 hover:bg-blue-900 text-white"
                    onClick={() => handleAllowAction(user)}
                  >
                    <TiTick /> Grant
                  </button>{" "}
                  <button
                    className="btn bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => handleDeleteAction(user._id)}
                  >
                    <RxCross2 />
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UsersTable;
