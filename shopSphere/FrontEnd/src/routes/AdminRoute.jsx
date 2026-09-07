import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderTree,
  BarChart3,
  Star,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin",
  },
  {
    title: "Users",
    icon: <Users size={20} />,
    path: "/admin/users",
  },
  {
    title: "Products",
    icon: <Package size={20} />,
    path: "/admin/products",
  },
  {
    title: "Categories",
    icon: <FolderTree size={20} />,
    path: "/admin/categories",
  },
  {
    title: "Orders",
    icon: <ShoppingCart size={20} />,
    path: "/admin/orders",
  },
  {
    title: "Reviews",
    icon: <Star size={20} />,
    path: "/admin/reviews",
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={20} />,
    path: "/admin/analytics",
  },
];

const Sidebar = () => {
  return (
    <aside className="min-h-screen w-64 shrink-0 bg-slate-900 text-white">
      <div className="border-b border-slate-700 px-6 py-5">
        <h1 className="text-2xl font-bold">
          ShopSphere
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Admin Panel
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {menu.icon}
            <span>{menu.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;