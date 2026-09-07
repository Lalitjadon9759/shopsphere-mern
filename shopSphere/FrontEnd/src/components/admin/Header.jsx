import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-5 shadow">
      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?background=2563eb&color=fff&name=Admin"
            alt="admin"
            className="h-10 w-10 rounded-full"
          />

          <div>
            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;