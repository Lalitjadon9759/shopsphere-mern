import { useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageUrl";
const TopProducts = () => {
  const { topProducts } = useSelector(
    (state) => state.admin
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Top Selling Products
      </h2>

      <div className="space-y-4">
        {topProducts.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <img
               src={getImageUrl(product.images?.[0].url)}
                alt={product.name}
                className="h-14 w-14 rounded-lg object-cover"
              />

              <div>
                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Sold : {product.sold}
                </p>
              </div>
            </div>

            <h3 className="font-bold text-blue-600">
              ₹{product.price}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;