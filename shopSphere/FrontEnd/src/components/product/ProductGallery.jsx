import { useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

const ProductGallery = ({ product }) => {
  const images = product?.images || [];

  const [selectedImage, setSelectedImage] = useState(
    images?.[0]?.url || ""
  );

  const mainImage = getImageUrl(selectedImage);

  return (
    <div className="w-full">

      {/* Main Image */}

      <div className="overflow-hidden rounded-2xl border bg-white">
        <img
          src={mainImage}
          alt={product?.name || "Product image"}
          className="h-[500px] w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/800x800?text=No+Image";
          }}
        />
      </div>

      {/* Thumbnails */}

      {images.length > 0 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

          {images.map((image, index) => {
            const imageUrl = getImageUrl(image.url);

            return (
              <button
                key={image._id || image.public_id || index}
                type="button"
                onClick={() =>
                  setSelectedImage(image.url)
                }
                className={`shrink-0 overflow-hidden rounded-xl border-2 ${
                  selectedImage === image.url
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`${product.name} view ${index + 1}`}
                  className="h-24 w-24 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/200x200?text=No+Image";
                  }}
                />
              </button>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default ProductGallery;