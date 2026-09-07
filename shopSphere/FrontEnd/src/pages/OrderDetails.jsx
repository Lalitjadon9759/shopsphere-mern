
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { getImageUrl } from "../utils/imageUrl";

import {
  fetchOrderById,
  cancelOrder,
  clearCurrentOrder,
} from "../features/order/orderSlice";

import OrderStatusBadge from "../components/orders/OrderStatusBadge";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [cancelling, setCancelling] = useState(false);

  const {
    currentOrder: order,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancelling(true);

    try {
      await dispatch(cancelOrder(id)).unwrap();

      // Refresh order details after successful cancellation
      await dispatch(fetchOrderById(id)).unwrap();
    } catch (error) {
      console.error("Cancel Order Error:", error);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-8 h-64 rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center md:px-6">
        <XCircle
          size={56}
          className="mx-auto mb-4 text-red-500"
        />

        <h1 className="mb-2 text-2xl font-bold">
          Unable to load order
        </h1>

        <p className="mb-6 text-red-500">
          {error}
        </p>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center md:px-6">
        <Package
          size={56}
          className="mx-auto mb-4 text-gray-400"
        />

        <h1 className="mb-3 text-2xl font-bold">
          Order Not Found
        </h1>

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = String(
    order.orderStatus || ""
  ).toUpperCase();

  const canCancel = [
    "PLACED",
    "PENDING",
    "PROCESSING",
  ].includes(status);

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const shippingAddress =
    order.shippingAddress || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">

      {/* Back */}
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
      >
        <ArrowLeft size={17} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Order Details
          </h1>

          <p className="mt-1 text-gray-500">
            Order #{order._id?.slice(-8) || "N/A"}
          </p>
        </div>

        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={18} />

            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}
      </div>

      {/* Order Main Card */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        {/* Status Header */}
        <div className="border-b bg-gray-50 p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Order placed on
              </p>

              <p className="mt-1 font-semibold">
                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <OrderStatusBadge
                status={order.orderStatus}
              />

              <p className="text-sm">
                Payment:{" "}
                <span className="font-semibold">
                  {order.paymentStatus ||
                    "PENDING"}
                </span>
              </p>
            </div>

          </div>
        </div>

        {/* Items */}
        <div className="p-5 md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Package size={21} />

            <h2 className="text-xl font-bold">
              Ordered Items
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
              No items found for this order.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item, index) => {
                const image =
                  item.image ||
                  item.product?.image ||
                  item.product?.images?.[0];

                const subtotal =
                  item.subtotal ??
                  Number(item.price || 0) *
                    Number(item.quantity || 0);

                return (
                  <div
                    key={
                      item._id ||
                      item.product?._id ||
                      index
                    }
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">

                      {/* Product Image */}
                      {image ? (
                        <img
                          src={getImageUrl(image)}
                          alt={
                            item.name ||
                            item.product?.name ||
                            "Product"
                          }
                          className="h-20 w-20 rounded-lg border object-cover"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://placehold.co/600x600?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                          <Package
                            size={28}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                      {/* Product Information */}
                      <div>
                        <h3 className="font-semibold">
                          {item.name ||
                            item.product?.name ||
                            "Product"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
                          {item.quantity || 0}
                        </p>

                        <p className="text-sm text-gray-500">
                          Price: ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold">
                      ₹
                      {Number(
                        subtotal || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Address + Summary */}
        <div className="grid gap-8 border-t p-5 md:grid-cols-2 md:p-6">

          {/* Shipping Address */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Truck size={21} />

              <h2 className="text-xl font-bold">
                Shipping Address
              </h2>
            </div>

            <div className="rounded-xl border bg-gray-50 p-4 leading-7 text-gray-700">

              <p className="font-semibold text-gray-900">
                {shippingAddress.fullName ||
                  "N/A"}
              </p>

              {shippingAddress.phone && (
                <p>
                  {shippingAddress.phone}
                </p>
              )}

              {shippingAddress.addressLine1 && (
                <p>
                  {shippingAddress.addressLine1}
                </p>
              )}

              {shippingAddress.addressLine2 && (
                <p>
                  {shippingAddress.addressLine2}
                </p>
              )}

              {shippingAddress.landmark && (
                <p>
                  Landmark:{" "}
                  {shippingAddress.landmark}
                </p>
              )}

              {(shippingAddress.city ||
                shippingAddress.state) && (
                <p>
                  {shippingAddress.city || ""}
                  {shippingAddress.city &&
                  shippingAddress.state
                    ? ", "
                    : ""}
                  {shippingAddress.state || ""}
                </p>
              )}

              {(shippingAddress.pincode ||
                shippingAddress.postalCode) && (
                <p>
                  {shippingAddress.pincode ||
                    shippingAddress.postalCode}
                </p>
              )}

              <p>
                {shippingAddress.country ||
                  "India"}
              </p>

            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle size={21} />

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>
            </div>

            <div className="space-y-3 rounded-xl border bg-gray-50 p-4">

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    order.subtotal || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Shipping
                </span>

                <span>
                  ₹
                  {Number(
                    order.shippingCharge || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Discount
                </span>

                <span className="text-green-600">
                  -₹
                  {Number(
                    order.discount || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Payment Method
                </span>

                <span className="font-medium">
                  {order.paymentMethod ||
                    "N/A"}
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
