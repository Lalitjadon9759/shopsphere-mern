import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, X } from "lucide-react";

import { cancelOrder } from "../../features/order/orderSlice";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.orders
  );

  const canCancel = [
    "PLACED",
    "PENDING",
    "PROCESSING",
  ].includes(
    String(order.orderStatus || "").toUpperCase()
  );

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    dispatch(cancelOrder(order._id));
  };

  const itemCount =
    order.totalItems ??
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ) ??
    0;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Order Information */}
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold md:text-xl">
              Order #{order._id?.slice(-8)}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Date unavailable"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:flex md:flex-wrap">
            <p>
              <span className="text-gray-500">
                Total:
              </span>{" "}
              <strong>
                ₹{Number(order.totalAmount || 0).toLocaleString()}
              </strong>
            </p>

            <p>
              <span className="text-gray-500">
                Items:
              </span>{" "}
              <strong>{itemCount}</strong>
            </p>

            <p>
              <span className="text-gray-500">
                Payment:
              </span>{" "}
              <strong>
                {order.paymentMethod || "N/A"}
              </strong>
            </p>

            <p>
              <span className="text-gray-500">
                Payment Status:
              </span>{" "}
              <strong
                className={
                  order.paymentStatus === "PAID"
                    ? "text-green-600"
                    : order.paymentStatus === "FAILED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {order.paymentStatus || "PENDING"}
              </strong>
            </p>
          </div>

          <OrderStatusBadge
            status={order.orderStatus}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/orders/${order._id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Eye size={17} />
            View Details
          </Link>

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />

              {loading
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 