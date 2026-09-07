import { Link } from "react-router-dom";

const CartSummary = ({ cart }) => {
  const subtotal = cart.items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 999 ? 0 : 99;

  const total = subtotal + shipping;

  return (
    <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "FREE" : `₹${shipping}`}
          </span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-8 block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Proceed to Checkout
      </Link>

      {shipping > 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Add ₹{999 - subtotal} more for free shipping.
        </p>
      )}
    </div>
  );
};

export default CartSummary;