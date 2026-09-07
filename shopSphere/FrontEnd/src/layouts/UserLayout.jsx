import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout; 