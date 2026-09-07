import ProductCardSkeleton from "./ProductCardSkeleton";
import CategoryCardSkeleton from "./CategoryCardSkeleton";

const SkeletonGrid = ({ type = "product", count = 8 }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) =>
        type === "product" ? (
          <ProductCardSkeleton key={index} />
        ) : (
          <CategoryCardSkeleton key={index} />
        )
      )}
    </div>
  );
};

export default SkeletonGrid;