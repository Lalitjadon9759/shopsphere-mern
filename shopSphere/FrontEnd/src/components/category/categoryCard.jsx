import { Link } from "react-router-dom";
const CategoryCard = ({ category }) => {
  const image =
    category?.image ||
    "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <img
        src={image}
        alt={`${category?.name || "Category"} category`}
        className="h-52 w-full object-cover"
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/600x400?text=No+Image";
        }}
      />

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold">
          {category?.name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;