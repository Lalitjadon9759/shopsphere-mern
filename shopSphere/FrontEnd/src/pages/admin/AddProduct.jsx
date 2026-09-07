import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [images, setImages] = useState([]);

  const [preview, setPreview] = useState([]);

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
    api.get("/categories").then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const imageHandler = (e) => {
    const files = [...e.target.files];

    setImages(files);

    setPreview(
      files.map((file) =>
        URL.createObjectURL(file)
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/products", formData);

      toast.success("Product Added");

      navigate("/admin/products");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed"
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">

      <h1 className="mb-8 text-3xl font-bold">
        Add Product
      </h1>

      <form
        onSubmit={submitHandler}
        className="grid gap-6 md:grid-cols-2"
      >
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={changeHandler}
          className="rounded border p-3"
          required
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={changeHandler}
          className="rounded border p-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={changeHandler}
          className="rounded border p-3 md:col-span-2"
          rows="4"
        />

        <select
          name="category"
          value={form.category}
          onChange={changeHandler}
          className="rounded border p-3"
          required
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={changeHandler}
          className="rounded border p-3"
          required
        />

        <input
          name="discountPrice"
          type="number"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={changeHandler}
          className="rounded border p-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={changeHandler}
          className="rounded border p-3"
          required
        />

        <input
          type="file"
          multiple
          onChange={imageHandler}
          className="rounded border p-3 md:col-span-2"
        />

        <div className="flex flex-wrap gap-3 md:col-span-2">
          {preview.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className="h-24 w-24 rounded object-cover"
            />
          ))}
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={changeHandler}
          />
          Featured
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={changeHandler}
          />
          Active
        </label>

        <button
          className="rounded-lg bg-blue-600 p-3 text-white md:col-span-2"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;