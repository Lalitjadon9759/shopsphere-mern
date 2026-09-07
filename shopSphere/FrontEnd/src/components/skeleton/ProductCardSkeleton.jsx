const ProductCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Image */}
      <div className="h-64 w-full animate-pulse bg-gray-200"></div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200"></div>

        <div className="h-5 w-full animate-pulse rounded bg-gray-200"></div>

        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200"></div>

        <div className="flex gap-2">
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>

        <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;