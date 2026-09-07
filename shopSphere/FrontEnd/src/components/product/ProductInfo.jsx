import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import QuantitySelector from "./QuantitySelector";
import RatingStars from "../reviews/RatingStars";
import { addItem } from "../../features/cart/cartSlice";

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);

const handleAddToCart = async () => {
  if (!product?._id) {
    toast.error("Product ID is missing");
    return;
  }

  if (product.stock <= 0) {
    toast.error("Product is out of stock");
    return;
  }

  try {
    console.log("🛒 Adding product to cart:", {
      productId: product._id,
      quantity,
    });

    const resultAction = await dispatch(
      addItem({
        productId: product._id,
        quantity: Number(quantity),
      })
    );

    console.log("🛒 Add cart result:", resultAction);

    if (addItem.fulfilled.match(resultAction)) {
      toast.success("Product added to cart");
    } else {
      console.error("❌ Add cart failed:", resultAction);

      toast.error(
        resultAction.payload || "Failed to add product to cart"
      );
    }
  } catch (error) {
    console.error("❌ Add cart exception:", error);
    toast.error("Something went wrong while adding to cart");
  }
};

  return (
    <div>
      {/* Product Name */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mt-3 flex items-center gap-3">
        <RatingStars
          rating={product.rating || 0}
        />

        <span className="font-medium text-gray-700">
          {product.rating
            ? Number(product.rating).toFixed(1)
            : "0.0"}
        </span>

        <span className="text-gray-500">
          ({product.totalReviews || 0}{" "}
          {product.totalReviews === 1
            ? "review"
            : "reviews"})
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600">
        {product.description}
      </p>

      {/* Price */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-3xl font-bold text-blue-600">
          ₹{product.discountPrice || product.price}
        </span>

        {product.discountPrice > 0 && (
          <span className="text-xl text-gray-400 line-through">
            ₹{product.price}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="mt-6 space-y-2">
        <p>
          <strong>Brand:</strong>{" "}
          {product.brand || "N/A"}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {product.category?.name || "N/A"}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {product.stock > 0 ? (
            <span className="font-medium text-green-600">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="font-medium text-red-600">
              Out of Stock
            </span>
          )}
        </p>
      </div>

      {/* Quantity */}
      {product.stock > 0 && (
        <div className="mt-8">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="rounded-xl bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Add to Cart
        </button>

        <button
          className="rounded-xl border px-8 py-3 transition hover:bg-gray-100"
          disabled={product.stock <= 0}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;