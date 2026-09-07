import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    featured: false,
    isActive: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes] =
          await Promise.all([
            api.get(`/products/admin/${id}`),
            api.get("/categories"),
          ]);

        const product =
          productRes.data.product;

        setCategories(
          categoryRes.data.categories || []
        );

        setForm({
          name: product.name || "",
          description:
            product.description || "",
          brand: product.brand || "",
          category:
            product.category?._id ||
            product.category ||
            "",
          price: product.price || "",
          discountPrice:
            product.discountPrice || "",
          stock: product.stock || "",
          featured: Boolean(product.featured),
          isActive:
            product.isActive !== false,
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const changeHandler = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const imageHandler = (e) => {
    setImages([...e.target.files]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          formData.append(key, value);
        }
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      await api.put(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Product updated successfully"
      );

      navigate("/admin/products");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="mt-1 text-gray-500">
          Update product information
        </p>
      </div>

      <form
        onSubmit={submitHandler}
        className="grid gap-6 md:grid-cols-2"
      >
        <input
          name="name"
          value={form.name}
          onChange={changeHandler}
          placeholder="Product Name"
          required
          className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="brand"
          value={form.brand}
          onChange={changeHandler}
          placeholder="Brand"
          className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={changeHandler}
          placeholder="Description"
          rows="5"
          className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={changeHandler}
          required
          className="rounded-lg border p-3"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          value={form.price}
          onChange={changeHandler}
          placeholder="Price"
          required
          className="rounded-lg border p-3"
        />

        <input
          name="discountPrice"
          type="number"
          value={form.discountPrice}
          onChange={changeHandler}
          placeholder="Discount Price"
          className="rounded-lg border p-3"
        />

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={changeHandler}
          placeholder="Stock"
          required
          className="rounded-lg border p-3"
        />

        <input
          type="file"
          multiple
          onChange={imageHandler}
          className="rounded-lg border p-3 md:col-span-2"
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={changeHandler}
          />

          <span>Featured Product</span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={changeHandler}
          />

          <span>Active Product</span>
        </label>

        <div className="flex gap-3 md:col-span-2">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="rounded-lg border px-6 py-3 font-medium"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;