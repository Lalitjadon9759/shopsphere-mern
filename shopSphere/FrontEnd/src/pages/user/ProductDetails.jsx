import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductGallery from "../../components/product/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo";
import RelatedProducts from "../../components/product/RelatedProducts";
import SkeletonGrid from "../../components/skeleton/SkeletonGrid";

import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewList from "../../components/reviews/ReviewList";

import {
  fetchProductBySlug,
  fetchRelatedProducts,
} from "../../features/product/productSlice";

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const {
    product,
    relatedProducts,
    loading,
  } = useSelector((state) => state.product);

  // Fetch product
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  // Fetch related products
  useEffect(() => {
    if (product?._id) {
      dispatch(fetchRelatedProducts(product._id));
    }
  }, [dispatch, product?._id]);

  // Loading state
  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Product Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <ProductGallery product={product} />

        {/* Product Information */}
        <ProductInfo product={product} />
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div className="mt-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      )}

      {/* Reviews Section */}
      <section className="mt-16 border-t border-gray-200 pt-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Existing Reviews */}
          <div>
            <ReviewList productId={product._id} />
          </div>

          {/* Add Review */}
          <div>
            <ReviewForm productId={product._id} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;