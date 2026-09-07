const ProductPagination = ({
  pagination,
  filters,
  setFilters,
}) => {

  const totalPages =
    Number(pagination?.totalPages) || 1;

  const currentPage =
    Number(filters?.page) || 1;

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">

      {/* Previous */}

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            page: currentPage - 1,
          }))
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {/* Pages */}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page,
            }))
          }
          className={`min-w-10 rounded-xl px-3 py-2 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}

      <button
        type="button"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            page: currentPage + 1,
          }))
        }
        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
};

export default ProductPagination;