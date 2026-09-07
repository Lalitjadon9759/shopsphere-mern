import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  Package,
  ShoppingCart,
  FolderTree,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  fetchDashboard,
} from "../../features/admin/adminSlice";

import {
  getRecentOrders,
  getTopProducts,
} from "../../features/admin/adminApi";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector(
    (state) => state.admin
  );

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboard());

    const loadExtraData = async () => {
      try {
        const [ordersRes, productsRes] =
          await Promise.all([
            getRecentOrders(),
            getTopProducts(),
          ]);

        setRecentOrders(ordersRes.orders || []);
        setTopProducts(productsRes.products || []);
      } catch (err) {
        console.error(
          "Dashboard extra data error:",
          err
        );
      }
    };

    loadExtraData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: dashboard?.totalUsers || 0,
      icon: <Users size={24} />,
    },
    {
      title: "Products",
      value: dashboard?.totalProducts || 0,
      icon: <Package size={24} />,
    },
    {
      title: "Orders",
      value: dashboard?.totalOrders || 0,
      icon: <ShoppingCart size={24} />,
    },
    {
      title: "Categories",
      value: dashboard?.totalCategories || 0,
      icon: <FolderTree size={24} />,
    },
    {
      title: "Revenue",
      value: `₹${Number(
        dashboard?.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      icon: <IndianRupee size={24} />,
    },
    {
      title: "Pending Orders",
      value: dashboard?.pendingOrders || 0,
      icon: <Clock size={24} />,
    },
    {
      title: "Delivered",
      value: dashboard?.deliveredOrders || 0,
      icon: <CheckCircle size={24} />,
    },
    {
      title: "Cancelled",
      value: dashboard?.cancelledOrders || 0,
      icon: <XCircle size={24} />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Overview of your ShopSphere store
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Recent Orders
            </h2>

            <p className="text-sm text-gray-500">
              Latest customer orders
            </p>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-0"
                  >
                    <td className="py-4">
                      {order.user?.name ||
                        "Customer"}
                    </td>

                    <td className="py-4 font-medium">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4">
                      {order.paymentStatus || "Pending"}
                    </td>

                    <td className="py-4">
                      {order.orderStatus}
                    </td>

                    <td className="py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Top Selling Products
        </h2>

        <div className="mt-5 space-y-4">
          {topProducts.length === 0 ? (
            <p className="text-gray-500">
              No products found.
            </p>
          ) : (
            topProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    {product.sold || 0} sold
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;