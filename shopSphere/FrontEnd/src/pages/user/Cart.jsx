import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCart } from "../../features/cart/cartSlice";

import CartItem from "../../features/cart/CartItem";
import CartSummary from "../../features/cart/CartSummary";
import EmptyCart from "../../features/cart/EmptyCart";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart, loading } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg">
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-5 lg:col-span-2">
          {cart.items.map((item) => (
            <CartItem
              key={item.product._id}
              item={item}
            />
          ))}
        </div>

        {/* Summary */}
        <CartSummary cart={cart} />
      </div>
    </div>
  );
};

export default Cart;