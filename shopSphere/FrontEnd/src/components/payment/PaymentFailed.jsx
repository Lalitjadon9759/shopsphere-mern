import React from "react";
import { Link } from "react-router-dom";


const PaymentFailed = () => {


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
          text-red-500
          text-6xl
          mb-4
        ">
          ✕
        </div>


        <h1 className="
          text-2xl
          font-bold
          mb-3
        ">
          Payment Failed
        </h1>


        <p className="
          text-gray-600
          mb-6
        ">
          Your payment could not be completed.
          Please try again.
        </p>


        <Link
          to="/checkout"
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
          Try Again
        </Link>


      </div>


    </div>

  );
};


export default PaymentFailed;