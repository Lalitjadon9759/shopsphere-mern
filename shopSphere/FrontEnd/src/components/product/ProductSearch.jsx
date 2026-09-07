import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const ProductSearch = ({ filters, setFilters }) => {
  const [search, setSearch] = useState(filters.search);

  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-xl border p-3 outline-none focus:border-blue-500 md:max-w-sm"
    />
  );
};

export default ProductSearch;