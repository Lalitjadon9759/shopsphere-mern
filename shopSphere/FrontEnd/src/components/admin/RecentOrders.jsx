import { useSelector } from "react-redux";

const RecentOrders = () => {
  const { recentOrders } = useSelector(
    (state) => state.admin
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Amount
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Payment
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b"
              >
                <td className="p-3">
                  {order.user?.name}
                </td>

                <td className="p-3">
                  ₹{order.totalAmount}
                </td>

                <td className="p-3">
                  {order.orderStatus}
                </td>

                <td className="p-3">
                  {order.paymentStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;