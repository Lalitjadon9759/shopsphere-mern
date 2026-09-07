import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchDashboard,
  fetchStatistics,
  fetchMonthlySales,
  fetchRecentOrders,
  fetchTopProducts,
} from "../../features/admin/adminSlice";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import StatsCards from "../../components/admin/StatsCards";
import MonthlySalesChart from "../../components/admin/MonthlySalesChart";
import RecentOrders from "../../components/admin/RecentOrders";
import TopProducts from "../../components/admin/TopProducts";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchStatistics());
    dispatch(fetchMonthlySales());
    dispatch(fetchRecentOrders());
    dispatch(fetchTopProducts());
  }, [dispatch]);

  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8">
        <Header />

        <div className="mt-8">
          <StatsCards />
        </div>

       <div className="mt-8">
  <MonthlySalesChart />
</div>

<div className="mt-8 grid gap-8 lg:grid-cols-2">
  <RecentOrders />
  <TopProducts />
</div>

        <div className="mt-8 rounded-xl bg-white p-10 shadow">
          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <p className="mt-2 text-gray-500">
            (Orders Table Coming Next)
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-white p-10 shadow">
          <h2 className="text-2xl font-bold">
            Top Selling Products
          </h2>

          <p className="mt-2 text-gray-500">
            (Products Table Coming Next)
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;