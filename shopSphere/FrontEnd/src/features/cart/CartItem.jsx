import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";

import {
  removeItem,
  updateItem,
} from "./cartSlice";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // ======================================================
  // Increase Quantity
  // ======================================================

  const increase = () => {
    if (item.quantity >= item.product.stock) {
      return;
    }

    dispatch(
      updateItem({
        productId: item.product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  // ======================================================
  // Decrease Quantity
  // ======================================================

  const decrease = () => {
    if (item.quantity === 1) {
      return;
    }

    dispatch(
      updateItem({
        productId: item.product._id,
        quantity: item.quantity - 1,
      })
    );
  };

  // ======================================================
  // Remove Item
  // ======================================================

  const remove = () => {
    const confirmed = window.confirm(
      "Remove this item from cart?"
    );

    if (!confirmed) {
      return;
    }

    dispatch(
      removeItem(item.product._id)
    );
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl border bg-white p-5 shadow-sm md:flex-row">

      {/* Product Image */}

      <img
        src={
          item.product.images?.[0]?.url
            ? `${import.meta.env.VITE_API_URL}${item.product.images[0].url}`
            : "https://placehold.co/300x300?text=Product"
        }
        alt={item.product.name}
        className="h-32 w-32 rounded-xl object-cover"
      />

      {/* Product Information */}

      <div className="flex flex-1 flex-col justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            {item.product.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {item.product.brand}
          </p>

          <p className="mt-3 text-lg font-bold text-blue-600">
            ₹{item.price}
          </p>

        </div>

        {/* Quantity Controls */}

        <div className="mt-4 flex items-center gap-3">

          <button
            type="button"
            onClick={decrease}
            disabled={item.quantity === 1}
            className="h-10 w-10 rounded-lg border text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            -
          </button>

          <span className="min-w-[2rem] text-center font-semibold">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={increase}
            disabled={
              item.quantity >= item.product.stock
            }
            className="h-10 w-10 rounded-lg border text-lg transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            +
          </button>

        </div>

      </div>

      {/* Remove + Total */}

      <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">

        <button
          type="button"
          onClick={remove}
          className="flex items-center gap-2 text-red-500 transition hover:text-red-600"
        >
          <Trash2 size={18} />
          Remove
        </button>

        <p className="text-xl font-bold">
          ₹{item.price * item.quantity}
        </p>

      </div>

    </div>
  );
};

export default CartItem;