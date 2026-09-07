import { useEffect, useMemo } from "react";
import {
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductGrid from "../../components/product/ProductGrid";
import ProductFilter from "../../components/product/ProductFilter";
import ProductSort from "../../components/product/ProductSort";
import ProductPagination from "../../components/product/ProductPagination";
import SkeletonGrid from "../../components/skeleton/SkeletonGrid";

import { fetchProducts } from "../../features/product/productSlice";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 8,
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const {
    products,
    loading,
    pagination,
    error,
  } = useSelector((state) => state.product);

  // ======================================================
  // URL -> FILTERS
  // ======================================================

  const filters = useMemo(() => {
    return {
      page:
        Number(searchParams.get("page")) || 1,

      limit:
        Number(searchParams.get("limit")) || 8,

      search:
        searchParams.get("search") || "",

      category:
        searchParams.get("category") || "",

      minPrice:
        searchParams.get("minPrice") || "",

      maxPrice:
        searchParams.get("maxPrice") || "",

      sort:
        searchParams.get("sort") || "latest",
    };
  }, [searchParams]);

  // ======================================================
  // UPDATE FILTERS
  // ======================================================

  const setFilters = (update) => {
    const currentFilters = filters;

    const nextFilters =
      typeof update === "function"
        ? update(currentFilters)
        : update;

    const params = new URLSearchParams();

    // Page
    if (
      nextFilters.page &&
      Number(nextFilters.page) > 1
    ) {
      params.set(
        "page",
        String(nextFilters.page)
      );
    }

    // Search
    if (nextFilters.search?.trim()) {
      params.set(
        "search",
        nextFilters.search.trim()
      );
    }

    // Category
    if (nextFilters.category) {
      params.set(
        "category",
        nextFilters.category
      );
    }

    // Minimum Price
    if (nextFilters.minPrice !== "") {
      params.set(
        "minPrice",
        nextFilters.minPrice
      );
    }

    // Maximum Price
    if (nextFilters.maxPrice !== "") {
      params.set(
        "maxPrice",
        nextFilters.maxPrice
      );
    }

    // Sort
    if (
      nextFilters.sort &&
      nextFilters.sort !== "latest"
    ) {
      params.set(
        "sort",
        nextFilters.sort
      );
    }

    // Limit
    if (nextFilters.limit !== 8) {
      params.set(
        "limit",
        String(nextFilters.limit)
      );
    }

    // Prevent unnecessary navigation
    const nextUrl = params.toString();
    const currentUrl =
      searchParams.toString();

    if (nextUrl !== currentUrl) {
      setSearchParams(params, {
        replace: true,
      });
    }
  };

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  useEffect(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
    };

    dispatch(fetchProducts(params));
  }, [
    dispatch,
    filters.page,
    filters.limit,
    filters.search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);

  // ======================================================
  // CLEAR FILTERS
  // ======================================================

  const handleClearFilters = () => {
    setSearchParams({}, {
      replace: true,
    });
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-2">

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Home</span>
              <span>/</span>
              <span className="font-medium text-blue-600">
                Products
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {filters.search
                ? `Search results for "${filters.search}"`
                : "All Products"}
            </h1>

            <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
              Discover products that match your
              needs and preferences.
            </p>

          </div>

        </div>
      </section>

      {/* ==================================================
          PRODUCTS AREA
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* ==================================================
              FILTER
          ================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <ProductFilter
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
              />

            </div>

          </aside>

          {/* ==================================================
              PRODUCTS CONTENT
          ================================================== */}

          <div className="min-w-0">

            {/* ==================================================
                TOOLBAR
            ================================================== */}

            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  {loading
                    ? "Loading products..."
                    : (
                      <>
                        Showing{" "}
                        <span className="font-bold text-slate-900">
                          {products?.length || 0}
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-900">
                          {pagination?.totalProducts || 0}
                        </span>{" "}
                        products
                      </>
                    )}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="hidden text-sm font-medium text-slate-500 sm:block">
                  Sort by
                </span>

                <ProductSort
                  filters={filters}
                  setFilters={setFilters}
                />

              </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ==================================================
                LOADING
            ================================================== */}

            {loading ? (
              <SkeletonGrid
                type="product"
                count={8}
              />
            ) : products?.length > 0 ? (

              <>
                <ProductGrid
                  products={products}
                />

                <div className="mt-10 flex justify-center">
                  <ProductPagination
                    pagination={pagination}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </div>
              </>

            ) : (

              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">

                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                  🛍️
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  No products found
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  We couldn't find any products
                  matching your search or filters.
                  Try another search or clear your
                  filters.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
};

export default Products;