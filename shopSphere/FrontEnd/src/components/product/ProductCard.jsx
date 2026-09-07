import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";

import { addItem } from "../../features/cart/cartSlice";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../../features/wishlist/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const wishlistProducts = useSelector(
    (state) => state.wishlist?.products || []
  );

  const isWishlisted = wishlistProducts.some(
    (item) =>
      (item?._id || item) === product?._id
  );

  const image =
    product?.images?.[0]?.url ||
    "https://via.placeholder.com/500x500?text=Product";

  const price =
    product?.discountPrice > 0
      ? product.discountPrice
      : product?.price || 0;

  const discount =
    product?.discountPrice > 0 &&
    product?.price > 0
      ? Math.round(
          ((product.price -
            product.discountPrice) /
            product.price) *
            100
        )
      : 0;

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?._id) {
      toast.error("Product information is missing");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (adding) return;

    try {
      setAdding(true);

      const resultAction = await dispatch(
        addItem({
          productId: product._id,
          quantity: 1,
        })
      );

      if (addItem.fulfilled.match(resultAction)) {
        toast.success("Product added to cart");
      } else {
        toast.error(
          resultAction.payload ||
            "Failed to add product to cart"
        );
      }
    } catch (error) {
      console.error(
        "❌ Add to cart error:",
        error
      );

      toast.error(
        "Something went wrong while adding to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // ======================================================
  // WISHLIST
  // ======================================================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        "Please login to use your wishlist"
      );
      return;
    }

    if (!product?._id || wishlistLoading) {
      return;
    }

    try {
      setWishlistLoading(true);

      if (isWishlisted) {
        await dispatch(
          removeWishlistItem(product._id)
        ).unwrap();

        toast.success(
          "Removed from wishlist"
        );
      } else {
        await dispatch(
          addWishlistItem(product._id)
        ).unwrap();

        toast.success(
          "Added to wishlist ❤️"
        );
      }
    } catch (error) {
      toast.error(
        error || "Wishlist update failed"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* ==================================================
          IMAGE
      ================================================== */}

      <div className="relative aspect-square overflow-hidden bg-slate-100">

        <img
          src={image}
          alt={product?.name || "Product"}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          title={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="
            absolute
            right-3
            top-3
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-md
            transition
            hover:scale-110
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Heart
            size={20}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-slate-600"
            }
          />
        </button>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="p-4">

        {/* Category */}
        <p className="mb-1 text-xs font-medium text-slate-500">
          {product?.category?.name || "Product"}
        </p>

        {/* Name */}
        <h3 className="line-clamp-1 text-base font-bold text-slate-900">
          {product?.name || "Unnamed Product"}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={15}
                  className="fill-transparent text-slate-300"
                />
              )
            )}
          </div>

          <span className="text-xs text-slate-500">
            {product?.rating
              ? Number(
                  product.rating
                ).toFixed(1)
              : "0.0"}
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">
            ₹
            {Number(price).toLocaleString(
              "en-IN"
            )}
          </span>

          {product?.discountPrice > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ₹
              {Number(
                product.price
              ).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Stock */}
        {product?.stock <= 0 && (
          <p className="mt-2 text-sm font-medium text-red-500">
            Out of Stock
          </p>
        )}

        {/* Add To Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={
            adding || product?.stock <= 0
          }
          className="
            mt-4
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-blue-600
            px-4
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:bg-slate-400
          "
        >
          <ShoppingCart size={17} />

          {adding
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;