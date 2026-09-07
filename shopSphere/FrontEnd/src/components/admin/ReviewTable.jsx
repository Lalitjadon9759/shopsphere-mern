import toast from "react-hot-toast";

import { useDispatch } from "react-redux";

import {
  toggleAdminReviewStatus,
} from "../../features/admin/adminSlice";

const ReviewTable = ({
  reviews,
  reviewActionLoading,
}) => {
  const dispatch = useDispatch();

  const handleToggleStatus = async (id) => {
    const result = await dispatch(
      toggleAdminReviewStatus(id)
    );

    if (
      toggleAdminReviewStatus.fulfilled.match(result)
    ) {
      toast.success(
        result.payload.message ||
          "Review status updated"
      );
    } else {
      toast.error(
        result.payload ||
          "Failed to update review"
      );
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-gray-500">
          No reviews found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Rating
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Comment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="hover:bg-gray-50"
              >
                {/* Customer */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.user?.name ||
                        "Unknown User"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {review.user?.email || ""}
                    </p>
                  </div>
                </td>

                {/* Product */}
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {review.product?.name ||
                      "Unknown Product"}
                  </p>
                </td>

                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">
                      ★
                    </span>

                    <span className="font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                </td>

                {/* Comment */}
                <td className="max-w-xs px-6 py-4">
                  <p className="truncate text-gray-600">
                    {review.comment}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {review.isApproved ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Approved
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Rejected
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <button
                    type="button"
                    disabled={reviewActionLoading}
                    onClick={() =>
                      handleToggleStatus(
                        review._id
                      )
                    }
                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      review.isApproved
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {review.isApproved
                      ? "Reject"
                      : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewTable;