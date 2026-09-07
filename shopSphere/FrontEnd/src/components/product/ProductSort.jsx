const ProductSort = ({
  filters,
  setFilters,
}) => {

  const handleSort = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
      page: 1,
    }));
  };

  return (
    <select
      value={filters.sort}
      onChange={handleSort}
      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="latest">
        Latest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="price_asc">
        Price: Low to High
      </option>

      <option value="price_desc">
        Price: High to Low
      </option>

      <option value="rating">
        Highest Rated
      </option>

      <option value="name">
        Name: A-Z
      </option>
    </select>
  );
};

export default ProductSort;