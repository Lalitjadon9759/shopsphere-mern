import { FaStar } from "react-icons/fa";

const RatingStars = ({
  rating = 0,
  onChange,
  editable = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={() => {
            if (editable && onChange) {
              onChange(star);
            }
          }}
          className={`text-xl ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300"
          } ${
            editable
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
        />
      ))}
    </div>
  );
};

export default RatingStars;