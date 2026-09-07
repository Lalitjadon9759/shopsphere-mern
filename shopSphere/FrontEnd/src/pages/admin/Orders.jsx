import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const statuses = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/orders",
        {
          params: {
            page: 1,
            limit: 50,
          },
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/orders/${id}/status`,
        { status }
      );

      toast.success(
        "Order status updated"
      );

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/orders/${id}`);

      toast.success("Order deleted");

      setOrders((prev) =>
        prev.filter(
          (order) => order._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="mt-1 text-gray-500">
          Manage customer orders
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-left">
                  Order
                </th>

                <th className="px-5 py-4 text-left">
                  Customer
                </th>

                <th className="px-5 py-4 text-left">
                  Total
                </th>

                <th className="px-5 py-4 text-left">
                  Payment
                </th>

                <th className="px-5 py-4 text-left">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t"
                >
                  <td className="px-5 py-4 font-medium">
                    #{order._id.slice(-8)}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {order.user?.name ||
                        "Customer"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.user?.email || ""}
                    </p>
                  </td>

                  <td className="px-5 py-4 font-semibold">
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4">
                    {order.paymentStatus ||
                      "Pending"}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={
                        order.orderStatus
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm outline-none"
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        deleteOrder(
                          order._id
                        )
                      }
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;