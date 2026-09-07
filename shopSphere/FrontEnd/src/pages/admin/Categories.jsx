import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/categories");

      setCategories(data.categories || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(
          `/categories/${editingId}`,
          {
            name: name.trim(),
          }
        );

        toast.success(
          "Category updated successfully"
        );
      } else {
        await api.post("/categories", {
          name: name.trim(),
        });

        toast.success(
          "Category created successfully"
        );
      }

      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const editHandler = (category) => {
    setEditingId(category._id);
    setName(category.name);
  };

  const deleteHandler = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);

      toast.success(
        "Category deleted successfully"
      );

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Cannot delete category"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <p className="mt-1 text-gray-500">
          Manage product categories
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Category name"
            className="flex-1 rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {editingId ? (
              <Pencil size={18} />
            ) : (
              <Plus size={18} />
            )}

            {saving
              ? "Saving..."
              : editingId
              ? "Update"
              : "Add Category"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found.
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  Name
                </th>

                <th className="px-6 py-4 text-left">
                  Created
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-t"
                >
                  <td className="px-6 py-4 font-medium">
                    {category.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {category.createdAt
                      ? new Date(
                          category.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          editHandler(category)
                        }
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          deleteHandler(
                            category._id
                          )
                        }
                        className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Categories;