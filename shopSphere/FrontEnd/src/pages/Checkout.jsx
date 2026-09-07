import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import AddressList from "../features/address/AddressList";
import PaymentButton from "../components/checkout/PaymentButton";

import {
  createOrder,
  clearCurrentOrder,
} from "../features/order/orderSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [orderProcessing, setOrderProcessing] =
    useState(false);

  const { selectedAddress } = useSelector(
    (state) => state.address
  );

  const { cart } = useSelector(
    (state) => state.cart
  );

  const {
    currentOrder,
    loading,
    error,
  } = useSelector(
    (state) => state.orders
  );

  // ======================================================
  // Redirect only when user initially enters checkout
  // with an empty cart.
  // Never redirect while an order is being processed.
  // ======================================================

  useEffect(() => {
    if (orderProcessing || currentOrder) {
      return;
    }

    if (
      cart &&
      (!cart.items || cart.items.length === 0)
    ) {
      navigate("/cart", { replace: true });
    }
  }, [
    cart,
    currentOrder,
    orderProcessing,
    navigate,
  ]);

  // ======================================================
  // Order Payload
  // ======================================================

  const orderPayload = {
    shippingAddress:
      selectedAddress?._id,

    paymentMethod,

    couponCode: "",
  };

  // ======================================================
  // Create Order
  // ======================================================

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert(
        "Please select a shipping address."
      );
      return;
    }

    if (!cart?.items?.length) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      setOrderProcessing(true);

      const result = await dispatch(
        createOrder(orderPayload)
      );

      if (createOrder.fulfilled.match(result)) {
        const createdOrder =
          result.payload?.order;

        if (!createdOrder?._id) {
          alert(
            "Order created but order ID was not received."
          );

          setOrderProcessing(false);
          return;
        }

        // ==================================================
        // COD
        // ==================================================

        if (paymentMethod === "COD") {
          dispatch(clearCurrentOrder());

          navigate(
            `/order-success/${createdOrder._id}`,
            { replace: true }
          );

          return;
        }

        // ==================================================
        // ONLINE PAYMENT
        //
        // Keep currentOrder in Redux so PaymentButton
        // can use the created order.
        // ==================================================

        setOrderProcessing(false);
      } else {
        setOrderProcessing(false);

        alert(
          result.payload ||
            "Failed to create order."
        );
      }
    } catch (error) {
      console.error(
        "Place Order Error:",
        error
      );

      setOrderProcessing(false);

      alert(
        error?.message ||
          "Something went wrong while placing the order."
      );
    }
  };

  // ======================================================
  // Display Values
  // ======================================================

  const displayTotal =
    currentOrder?.totalAmount ??
    cart?.totalPrice ??
    0;

  const displayItems =
    currentOrder?.totalItems ??
    cart?.totalItems ??
    0;

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="space-y-8 lg:col-span-2">

          {/* Shipping Address */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-2xl font-semibold">
              Shipping Address
            </h2>

            <AddressList />

          </div>

          {/* Payment Method */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-2xl font-semibold">
              Payment Method
            </h2>

            <div className="space-y-4">

              {/* COD */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  paymentMethod === "COD"
                    ? "border-green-500 bg-green-50"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={
                    paymentMethod === "COD"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );

                    if (currentOrder) {
                      dispatch(
                        clearCurrentOrder()
                      );
                    }
                  }}
                />

                <span className="font-medium">
                  Cash On Delivery
                </span>

              </label>

              {/* Razorpay */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                  paymentMethod === "ONLINE"
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={
                    paymentMethod === "ONLINE"
                  }
                  onChange={(e) => {
                    setPaymentMethod(
                      e.target.value
                    );

                    if (currentOrder) {
                      dispatch(
                        clearCurrentOrder()
                      );
                    }
                  }}
                />

                <span className="font-medium">
                  Razorpay Payment
                </span>

              </label>

            </div>

          </div>

        </div>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-semibold">
            Order Summary
          </h2>

          <div className="mb-6 space-y-4">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Total Items
              </span>

              <span className="font-medium">
                {displayItems}
              </span>

            </div>

            <div className="flex justify-between border-t pt-4">

              <span className="font-medium">
                Total Amount
              </span>

              <span className="text-xl font-bold">
                ₹{displayTotal}
              </span>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ==================================================
              ONLINE PAYMENT
          ================================================== */}

          {paymentMethod === "ONLINE" ? (

            currentOrder ? (

              <PaymentButton
                orderData={{
                  orderId:
                    currentOrder._id,
                }}
              />

            ) : (

              <button
                type="button"
                onClick={placeOrder}
                disabled={
                  loading ||
                  orderProcessing ||
                  !selectedAddress ||
                  !cart?.items?.length
                }
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ||
                orderProcessing
                  ? "Creating Order..."
                  : "Proceed To Payment"}
              </button>

            )

          ) : (

            /* ==================================================
               COD
            ================================================== */

            <button
              type="button"
              onClick={placeOrder}
              disabled={
                loading ||
                orderProcessing ||
                !selectedAddress ||
                !cart?.items?.length
              }
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ||
              orderProcessing
                ? "Placing Order..."
                : "Place COD Order"}
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default Checkout;