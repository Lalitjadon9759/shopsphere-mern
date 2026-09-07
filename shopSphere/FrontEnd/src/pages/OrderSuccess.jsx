import {
  CheckCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm md:p-12">

        <CheckCircle
          size={80}
          className="mx-auto mb-6 text-green-600"
        />

        <h1 className="mb-3 text-3xl font-bold md:text-4xl">
          Order Placed Successfully!
        </h1>

        <p className="mb-2 text-gray-600">
          Thank you for shopping with ShopSphere.
        </p>

        <p className="mb-8 text-gray-500">
          Your order has been successfully placed.
        </p>

        <div className="mb-8 rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="mt-1 break-all font-semibold">
            {id}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Package size={18} />
            View Orders
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;