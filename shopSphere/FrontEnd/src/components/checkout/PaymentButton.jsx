import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../api/axios";

const PaymentButton = ({ orderData }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { user } = useSelector(
    (state) => state.auth
  );

  const handlePayment = async () => {
    if (!orderData?.orderId) {
      alert("Order information is missing.");
      return;
    }

    if (!window.Razorpay) {
      alert(
        "Razorpay could not be loaded. Please refresh the page and try again."
      );
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // 1. Create Razorpay Order
      // ==================================================

      // IMPORTANT:
      // Backend calculates the amount from the Order.
      // We only send the ShopSphere order ID.

      const response = await api.post(
        "/payments/create-order",
        {
          orderId: orderData.orderId,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to create payment order."
        );
      }

      const razorpayOrder =
        response.data.order;

      const razorpayKey =
        response.data.key;

      if (!razorpayOrder?.id) {
        throw new Error(
          "Razorpay order ID was not received."
        );
      }

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key was not received from server."
        );
      }

      // ==================================================
      // 2. Razorpay Options
      // ==================================================

      const options = {
        key: razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

        name: "ShopSphere",

        description:
          "ShopSphere Order Payment",

        order_id:
          razorpayOrder.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        notes: {
          shopSphereOrderId:
            orderData.orderId,
        },

        theme: {
          color: "#000000",
        },

        // ==================================================
        // 3. Successful Razorpay Payment
        // ==================================================

        handler: async (paymentResponse) => {
          try {
            setLoading(true);

            const verifyResponse =
              await api.post(
                "/payments/verify",
                {
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,

                  orderId:
                    orderData.orderId,
                }
              );

            if (
              verifyResponse.data?.success
            ) {
              navigate(
                `/payment-success/${orderData.orderId}`,
                {
                  replace: true,
                }
              );
            } else {
              navigate("/payment-failed", {
                replace: true,
              });
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            navigate("/payment-failed", {
              replace: true,
            });
          } finally {
            setLoading(false);
          }
        },

        // ==================================================
        // Payment Failed
        // ==================================================

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      // ==================================================
      // 4. Open Razorpay
      // ==================================================

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay Payment Failed:",
            response?.error
          );

          navigate("/payment-failed", {
            replace: true,
          });
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start payment."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Processing Payment..."
        : "Pay Now"}
    </button>
  );
};

export default PaymentButton;