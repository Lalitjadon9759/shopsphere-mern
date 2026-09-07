import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/categories");

        setCategories(data.categories || data.data || []);

        setError("");
      } catch (err) {
        console.error("Failed to fetch categories:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">
          Shop by Category
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">
          Shop by Category
        </h1>

        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Shop by Category
        </h1>

        <p className="mt-2 text-gray-500">
          Browse products by your favorite categories.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <p className="text-gray-500">
            No categories available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const imageUrl=getImageUrl(category.image)

            return (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={imageUrl}
                  alt={`${category.name} category`}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=No+Image";
                  }}
                />

                <div className="p-5 text-center">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    View Products
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;