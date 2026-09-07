const statusStyles = {
  PLACED: "bg-blue-100 text-blue-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels = {
  PLACED: "Placed",
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "").toUpperCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        statusStyles[normalizedStatus] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabels[normalizedStatus] || status || "Unknown"}
    </span>
  );
};

export default OrderStatusBadge;