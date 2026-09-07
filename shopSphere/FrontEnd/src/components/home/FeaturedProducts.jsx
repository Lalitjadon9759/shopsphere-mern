import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../../features/product/productSlice";
import ProductGrid from "../product/ProductGrid";
import SkeletonGrid from "../skeleton/SkeletonGrid";

const FeaturedProducts = () => {
  const dispatch = useDispatch();

  const { featuredProducts, loading } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <section className="py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Featured Products
        </h2>

        <p className="mt-2 text-gray-500">
          Handpicked products just for you.
        </p>
      </div>

     {loading ? (
  <SkeletonGrid type="product" count={8} />
) : (
  <ProductGrid products={featuredProducts} />
)}
    </section>
  );
};

export default FeaturedProducts;