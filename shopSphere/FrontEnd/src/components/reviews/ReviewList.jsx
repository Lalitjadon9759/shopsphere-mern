import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchReviews } from "../../features/review/reviewSlice";
import ReviewCard from "./ReviewCard";

const ReviewList = ({ productId }) => {
  const dispatch = useDispatch();

  const { reviews, loading, error } = useSelector(
    (state) => state.review
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="py-6 text-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">
          No reviews yet.
        </p>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            productId={productId}
          />
        ))
      )}
    </div>
  );
};

export default ReviewList;