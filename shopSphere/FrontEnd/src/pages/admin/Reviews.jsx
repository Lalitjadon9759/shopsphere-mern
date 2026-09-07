import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminReviews,
} from "../../features/admin/adminSlice";

import ReviewTable from "../../components/admin/ReviewTable";

const Reviews = () => {
  const dispatch = useDispatch();

  const {
    reviews,
    reviewsLoading,
    reviewsError,
    reviewActionLoading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  if (reviewsLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {reviewsError}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Reviews
        </h1>

        <p className="mt-1 text-gray-500">
          Manage customer product reviews
        </p>
      </div>

      {/* Reviews Table */}
      <ReviewTable
        reviews={reviews}
        reviewActionLoading={
          reviewActionLoading
        }
      />
    </div>
  );
};

export default Reviews;