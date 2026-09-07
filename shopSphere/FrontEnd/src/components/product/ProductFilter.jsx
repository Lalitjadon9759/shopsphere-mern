import {
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

const ProductFilter = ({
  filters,
  setFilters,
  onClear,
}) => {

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleQuickPrice = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
      page: 1,
    }));
  };

  return (
    <div>

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <SlidersHorizontal size={20} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Filters
            </h2>

            <p className="text-xs text-slate-500">
              Refine your results
            </p>
          </div>

        </div>

      </div>

      {/* Search */}

      <div className="mb-6">

        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Search
        </label>

        <input
          type="search"
          value={filters.search}
          onChange={(e) =>
            updateFilter(
              "search",
              e.target.value
            )
          }
          placeholder="Search products..."
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

      </div>

      {/* Category */}

      <div className="mb-6">

        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Category
        </label>

        <select
          value={filters.category}
          onChange={(e) =>
            updateFilter(
              "category",
              e.target.value
            )
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >

          <option value="">
            All Categories
          </option>

          {/* 
            IMPORTANT:
            Replace these with actual MongoDB
            category IDs when you connect your
            category API.
          */}

        </select>

      </div>

      {/* Price */}

      <div className="mb-6">

        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Price Range
        </h3>

        <div className="grid grid-cols-2 gap-3">

          <div>

            <label className="mb-1 block text-xs text-slate-500">
              Minimum
            </label>

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value
                  )
                }
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-7 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

          <div>

            <label className="mb-1 block text-xs text-slate-500">
              Maximum
            </label>

            <div className="relative">

              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value
                  )
                }
                placeholder="100000"
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-7 pr-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Quick Price */}

      <div className="mb-6">

        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Quick Price
        </h3>

        <div className="space-y-2">

          <button
            type="button"
            onClick={() =>
              handleQuickPrice("", "1000")
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Under ₹1,000
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickPrice(
                "1000",
                "5000"
              )
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            ₹1,000 – ₹5,000
          </button>

          <button
            type="button"
            onClick={() =>
              handleQuickPrice(
                "5000",
                ""
              )
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            Above ₹5,000
          </button>

        </div>

      </div>

      {/* Clear */}

      <button
        type="button"
        onClick={onClear}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
      >
        <Trash2 size={16} />
        Clear Filters
      </button>

    </div>
  );
};

export default ProductFilter;