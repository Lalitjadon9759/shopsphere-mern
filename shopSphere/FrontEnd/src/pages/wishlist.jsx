import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import {
  fetchWishlist,
  removeWishlistItem,
  clearUserWishlist,
} from "../features/wishlist/wishlistSlice";

import { addItem } from "../features/cart/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  const wishlistState = useSelector(
    (state) => state.wishlist || {}
  );

  const products = wishlistState.products || [];
  const loading = wishlistState.loading || false;
  const error = wishlistState.error || null;

  const isAuthenticated = useSelector(
    (state) => state.auth?.isAuthenticated
  );

  // ================= FETCH WISHLIST =================

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // ================= REMOVE =================

  const handleRemove = async (productId) => {
    const result = await dispatch(
      removeWishlistItem(productId)
    );

    if (removeWishlistItem.fulfilled.match(result)) {
      toast.success("Removed from wishlist");
    } else {
      toast.error(
        result.payload || "Failed to remove item"
      );
    }
  };

  // ================= CLEAR =================

  const handleClear = async () => {
    if (!products.length) return;

    const result = await dispatch(
      clearUserWishlist()
    );

    if (clearUserWishlist.fulfilled.match(result)) {
      toast.success("Wishlist cleared");
    } else {
      toast.error(
        result.payload || "Failed to clear wishlist"
      );
    }
  };

  // ================= ADD TO CART =================

  const handleAddToCart = async (product) => {
    if (!product?._id) {
      toast.error("Product information is missing");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const result = await dispatch(
      addItem({
        productId: product._id,
        quantity: 1,
      })
    );

    if (addItem.fulfilled.match(result)) {
      toast.success("Added to cart");
    } else {
      toast.error(
        result.payload || "Failed to add to cart"
      );
    }
  };

  // ================= NOT LOGGED IN =================

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">

          <Heart
            size={70}
            className="mx-auto mb-5 text-gray-300"
          />

          <h2 className="text-2xl font-bold text-gray-900">
            Please Login
          </h2>

          <p className="mt-2 text-gray-500">
            Login to view and manage your wishlist.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">

          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border bg-white"
              >
                <div className="h-64 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">

          <Heart
            size={60}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="text-xl font-semibold text-gray-900">
            Unable to load wishlist
          </h2>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={() => dispatch(fetchWishlist())}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // ================= EMPTY =================

  if (!products.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">

          <Heart
            size={80}
            className="mx-auto mb-5 text-gray-300"
          />

          <h2 className="text-2xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h2>

          <p className="mt-2 text-gray-500">
            Save your favorite products here for later.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
          >
            <ShoppingCart size={18} />
            Explore Products
          </Link>

        </div>
      </div>
    );
  }

  // ================= WISHLIST =================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Heart
                size={28}
                className="fill-red-500 text-red-500"
              />

              <h1 className="text-3xl font-bold text-gray-900">
                My Wishlist
              </h1>

            </div>

            <p className="mt-1 text-gray-500">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}{" "}
              saved
            </p>

          </div>

          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <Trash2 size={17} />
            Clear Wishlist
          </button>

        </div>

        {/* PRODUCTS */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((product) => {

            const image =
              product?.images?.[0]?.url ||
              product?.image ||
              "https://via.placeholder.com/500x500?text=Product";

            const price =
              product?.discountPrice > 0
                ? product.discountPrice
                : product?.price || 0;

            const originalPrice =
              product?.price || 0;

            const discount =
              product?.discountPrice > 0 &&
              originalPrice > 0
                ? Math.round(
                    ((originalPrice -
                      product.discountPrice) /
                      originalPrice) *
                      100
                  )
                : 0;

            return (
              <div
                key={product._id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* IMAGE */}

                <div className="relative">

                  <Link
                    to={`/products/${product.slug}`}
                  >
                    <img
                      src={image}
                      alt={product.name || "Product"}
                      className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                      -{discount}%
                    </span>
                  )}

                  <button
                    onClick={() =>
                      handleRemove(product._id)
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
                    title="Remove from wishlist"
                  >
                    <Heart
                      size={18}
                      className="fill-red-500 text-red-500"
                    />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <Link
                    to={`/products/${product.slug}`}
                  >
                    <h2 className="line-clamp-2 min-h-[48px] text-base font-semibold text-gray-900 hover:text-gray-600">
                      {product.name}
                    </h2>
                  </Link>

                  {/* PRICE */}

                  <div className="mt-3 flex items-center gap-2">

                    <span className="text-lg font-bold text-gray-900">
                      ₹{price.toLocaleString("en-IN")}
                    </span>

                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹
                        {originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    )}

                  </div>

                  {/* CART */}

                  <button
                    onClick={() =>
                      handleAddToCart(product)
                    }
                    disabled={product.stock <= 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    <ShoppingCart size={17} />

                    {product.stock <= 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default Wishlist;