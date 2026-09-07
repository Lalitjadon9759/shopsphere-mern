import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getStatistics,
  getMonthlySales,
} from "../../features/admin/adminApi";

const Analytics = () => {
  const [statistics, setStatistics] =
    useState(null);

  const [sales, setSales] = useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          statisticsRes,
          salesRes,
        ] = await Promise.all([
          getStatistics(),
          getMonthlySales(),
        ]);

        setStatistics(
          statisticsRes.statistics
        );

        setSales(
          salesRes.sales || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Analytics
        </h1>

        <p className="mt-1 text-gray-500">
          Shop performance overview
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Users
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics?.activeUsers || 0}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Blocked Users
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics?.blockedUsers || 0}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Featured Products
          </p>

          <p className="mt-2 text-3xl font-bold">
            {statistics?.featuredProducts ||
              0}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="mt-2 flex items-center text-3xl font-bold">
            <IndianRupee size={25} />

            {Number(
              statistics?.revenue || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Monthly Sales
          </h2>

          <p className="text-sm text-gray-500">
            Revenue and orders by month
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-4">
                  Month
                </th>

                <th className="pb-4">
                  Orders
                </th>

                <th className="pb-4">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {sales.map((item) => (
                <tr
                  key={item.month}
                  className="border-b last:border-0"
                >
                  <td className="py-4">
                    {item.month}
                  </td>

                  <td className="py-4">
                    <span className="flex items-center gap-2">
                      <ShoppingCart
                        size={16}
                      />
                      {item.orders}
                    </span>
                  </td>

                  <td className="py-4 font-semibold">
                    ₹
                    {Number(
                      item.revenue || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;