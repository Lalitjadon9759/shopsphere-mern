const CategoryCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="h-52 w-full animate-pulse bg-gray-200"></div>

      <div className="p-4">
        <div className="mx-auto h-5 w-28 animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;