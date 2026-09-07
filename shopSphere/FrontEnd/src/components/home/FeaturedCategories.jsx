import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../features/category/categorySlice";
import CategoryGrid from "../category/categoryGrid";
import SkeletonGrid from "../skeleton/SkeletonGrid";

const FeaturedCategories = () => {
  const dispatch = useDispatch();

  const {
    categories = [],
    loading = false,
  } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Shop by Category
          </h2>

          <p className="mt-2 text-gray-500">
            Browse products by your favorite categories.
          </p>
        </div>
      </div>

      {loading ? (
        <SkeletonGrid
          type="category"
          count={5}
        />
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </section>
  );
};

export default FeaturedCategories;