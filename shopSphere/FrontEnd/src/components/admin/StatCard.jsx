import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
} from "lucide-react";

import { useSelector } from "react-redux";

import DashboardCard from "./Dashboard";

const StatsCards = () => {
  const { dashboard } = useSelector(
    (state) => state.admin
  );

  if (!dashboard) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <DashboardCard
        title="Users"
        value={dashboard.totalUsers}
        icon={<Users size={30} />}
        color="bg-blue-600"
      />

      <DashboardCard
        title="Products"
        value={dashboard.totalProducts}
        icon={<Package size={30} />}
        color="bg-green-600"
      />

      <DashboardCard
        title="Orders"
        value={dashboard.totalOrders}
        icon={<ShoppingCart size={30} />}
        color="bg-yellow-500"
      />

      <DashboardCard
        title="Revenue"
        value={`₹${dashboard.totalRevenue}`}
        icon={<IndianRupee size={30} />}
        color="bg-red-600"
      />

    </div>
  );
};

export default StatsCards;