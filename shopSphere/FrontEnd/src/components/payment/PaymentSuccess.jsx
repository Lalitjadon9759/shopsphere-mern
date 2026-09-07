import React from "react";
import { Link, useParams } from "react-router-dom";

const PaymentSuccess = () => {

  const { id } = useParams();


  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      px-4
    ">

      <div className="
        bg-white
        shadow-lg
        rounded-xl
        p-8
        text-center
        max-w-md
        w-full
      ">

        <div className="
          text-green-500
          text-6xl
          mb-4
        ">
          ✓
        </div>


        <h1 className="
          text-2xl
          font-bold
          mb-3
        ">
          Payment Successful
        </h1>


        <p className="
          text-gray-600
          mb-6
        ">
          Your order has been placed successfully.
        </p>


        <p className="
          text-sm
          text-gray-500
          mb-6
        ">
          Order ID:
          <span className="font-semibold">
            {" "}
            {id}
          </span>
        </p>


        <Link
          to="/orders"
          className="
            inline-block
            bg-black
            text-white
            px-6
            py-3
            rounded-lg
            hover:bg-gray-800
          "
        >
          View Orders
        </Link>

      </div>

    </div>
  );
};


export default PaymentSuccess;