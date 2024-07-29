import { Link } from "react-router-dom";

const Dashboardheader = () => {
  return (
    <div className="px-6 py-2 font-semibold border-b shadow-sm flex items-center justify-end bg-[#ffb88f]">
      <div>
        <Link to="/" className="btn btn-ghost text-xl">
          <img src="/logo.png" alt="logo" className="w-14 h-11" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboardheader;
