import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import RatingStars from "./RatingStars";
import {
  editReview,
  removeReview,
} from "../../features/review/reviewSlice";

const ReviewCard = ({ review, productId }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  // Support different possible user ID structures
  const currentUserId =
    user?._id || user?.id;

  const reviewUserId =
    review.user?._id || review.user?.id;

  const isOwner =
    currentUserId &&
    reviewUserId &&
    String(currentUserId) === String(reviewUserId);

  // ======================================================
  // Update Review
  // ======================================================

  const handleUpdate = async () => {
    if (!comment.trim()) {
      toast.error("Comment required");
      return;
    }

    const result = await dispatch(
      editReview({
        id: review._id,
        values: {
          product: productId,
          rating,
          comment: comment.trim(),
        },
      })
    );

    if (editReview.fulfilled.match(result)) {
      toast.success("Review updated");
      setEditing(false);
    } else {
      toast.error(
        result.payload || "Failed to update review"
      );
    }
  };

  // ======================================================
  // Delete Review
  // ======================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(
      removeReview({
        id: review._id,
        product: productId,
      })
    );

    if (removeReview.fulfilled.match(result)) {
      toast.success("Review deleted");
    } else {
      toast.error(
        result.payload || "Failed to delete review"
      );
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="border-b border-gray-200 py-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-gray-900">
            {review.user?.name || "Anonymous User"}
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            {review.createdAt
              ? new Date(
                  review.createdAt
                ).toLocaleDateString()
              : ""}
          </p>
        </div>

        <RatingStars
          rating={editing ? rating : review.rating}
          editable={editing}
          onChange={setRating}
        />
      </div>

      {/* Comment */}
      {editing ? (
        <textarea
          rows="4"
          className="mt-4 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />
      ) : (
        <p className="mt-3 text-gray-700">
          {review.comment}
        </p>
      )}

      {/* Owner Actions */}
      {isOwner && (
        <div className="mt-4 flex gap-3">
          {editing ? (
            <>
              <button
                type="button"
                onClick={handleUpdate}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setRating(review.rating);
                  setComment(review.comment);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;