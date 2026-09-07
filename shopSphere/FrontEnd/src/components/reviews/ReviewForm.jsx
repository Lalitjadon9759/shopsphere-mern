import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import RatingStars from "./RatingStars";
import { addReview } from "../../features/review/reviewSlice";

const ReviewForm = ({ productId }) => {
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Comment required");
      return;
    }

    const result = await dispatch(
      addReview({
        product: productId,
        rating,
        comment,
      })
    );

    if (addReview.fulfilled.match(result)) {
      toast.success("Review added successfully");

      setComment("");
      setRating(5);
    } else {
      toast.error(result.payload || "Failed to add review");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <h3 className="text-lg font-semibold text-gray-900">
        Write a Review
      </h3>

      <div className="mt-4">
        <RatingStars
          rating={rating}
          editable
          onChange={setRating}
        />
      </div>

      <textarea
        rows="4"
        className="mt-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;