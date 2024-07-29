import UsersTable from "../../components/UsersTable";
import useUserStore from "../../stores/userStore";

const DashboardUser = () => {
  const { allUsers } = useUserStore();

  return (
    <>
      <div className="p-5">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="font-bold text-2xl ">Registered Users</h2>
        </div>

        <UsersTable allUsers={allUsers} />
      </div>
    </>
  );
};

export default DashboardUser;
