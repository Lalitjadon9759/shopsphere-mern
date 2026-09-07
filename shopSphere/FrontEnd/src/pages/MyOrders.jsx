import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package, RefreshCw, ShoppingBag } from "lucide-react";

import { fetchMyOrders } from "../features/order/orderSlice";
import OrderCard from "../components/orders/OrderCard";

const MyOrders = () => {
  const dispatch = useDispatch();

  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMyOrders());
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-8">
          <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-xl border bg-white p-6"
            >
              <div className="h-6 w-56 rounded bg-gray-200" />
              <div className="mt-4 h-4 w-72 rounded bg-gray-100" />
              <div className="mt-4 h-4 w-48 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold">
          My Orders
        </h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <Package
            size={48}
            className="mx-auto mb-4 text-red-500"
          />

          <h2 className="mb-2 text-xl font-semibold text-red-700">
            Unable to load orders
          </h2>

          <p className="mb-5 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="mb-8 text-3xl font-bold">
          My Orders
        </h1>

        <div className="rounded-2xl border bg-white px-6 py-16 text-center shadow-sm">
          <ShoppingBag
            size={64}
            className="mx-auto mb-5 text-gray-400"
          />

          <h2 className="mb-3 text-2xl font-bold">
            No Orders Yet
          </h2>

          <p className="mx-auto mb-7 max-w-md text-gray-500">
            You haven't placed any orders yet.
            Start shopping and your orders will
            appear here.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            My Orders
          </h1>

          <p className="mt-1 text-gray-500">
            Track and manage your orders
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-medium transition hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Order Count */}
      <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
        <Package size={17} />
        <span>
          {orders.length}{" "}
          {orders.length === 1
            ? "order"
            : "orders"}
        </span>
      </div>

      {/* Orders */}
      <div className="space-y-5">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;