import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="mx-auto mt-24 max-w-xl rounded-xl bg-white p-10 text-center shadow">

      <h1 className="text-4xl font-bold text-red-600">
        Payment Failed
      </h1>

      <p className="mt-5">
        Your payment could not be completed.
      </p>

      <Link
        to="/checkout"
        className="mt-8 inline-block rounded bg-red-600 px-6 py-3 text-white"
      >
        Try Again
      </Link>

    </div>
  );
};

export default PaymentFailed;